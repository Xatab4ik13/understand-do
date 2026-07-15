import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

// Simple in-memory rate limiter (per worker instance).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateBucket = new Map<string, number[]>();

function checkRate(key: string): boolean {
  const now = Date.now();
  const arr = (rateBucket.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (arr.length >= RATE_LIMIT_MAX) {
    rateBucket.set(key, arr);
    return false;
  }
  arr.push(now);
  rateBucket.set(key, arr);
  return true;
}

function clientKey(): string {
  const xff = getRequestHeader("x-forwarded-for") || getRequestHeader("x-real-ip") || "unknown";
  return String(xff).split(",")[0]?.trim() || "unknown";
}

const phoneRe = /^[+\d][\d\s\-()]{5,20}$/;

const dealerRequestSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100),
  phone: z.string().trim().regex(phoneRe, "Некорректный телефон").max(30),
  city: z.string().trim().min(2, "Укажите город").max(100),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

const contactRequestSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100),
  phone: z.string().trim().regex(phoneRe, "Некорректный телефон").max(30),
  email: z.string().trim().email("Некорректный email").max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  summary: z.string().max(8000).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const submitDealerRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => dealerRequestSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("[dealer] request received", { name: data.name, phone: data.phone });
    try {
      if (data.website) return { ok: true as const };
      if (!checkRate(`dealer:${clientKey()}`)) {
        throw new Error("Слишком много запросов. Попробуйте позже.");
      }
      const { getTransporter, getFrom, getRecipient } = await import("./mailer.server");
      const transporter = getTransporter();

      const subject = `Brand Alum — заявка на дилерство от ${data.name}`;
      const rows: [string, string][] = [
        ["Имя", data.name],
        ["Телефон", data.phone],
        ["Город", data.city],
        ["Компания", data.company || "—"],
        ["Сообщение", data.message || "—"],
      ];
      const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
      const html = `<h2>Заявка на дилерство</h2><table cellpadding="6" style="border-collapse:collapse">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="border:1px solid #ddd"><b>${escapeHtml(k)}</b></td><td style="border:1px solid #ddd">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
        )
        .join("")}</table>`;

      console.log("[dealer] sending mail to", getRecipient(), "from", getFrom());
      const info = await transporter.sendMail({
        from: getFrom(),
        to: getRecipient(),
        replyTo: data.phone ? `${data.name} <${getFrom()}>` : undefined,
        subject,
        text,
        html,
      });
      console.log("[dealer] mail sent", info?.messageId, info?.response);
      return { ok: true as const };
    } catch (err) {
      console.error("[dealer] FAILED", err);
      throw new Error(
        err instanceof Error ? `${err.name}: ${err.message}` : "Ошибка отправки заявки",
      );
    }
  });

export const submitContactRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactRequestSchema.parse(data))
  .handler(async ({ data }) => {
    console.log("[contact] request received", { name: data.name, phone: data.phone });
    try {
      if (data.website) return { ok: true as const };
      if (!checkRate(`contact:${clientKey()}`)) {
        throw new Error("Слишком много запросов. Попробуйте позже.");
      }
      const { getTransporter, getFrom, getRecipient } = await import("./mailer.server");
      const transporter = getTransporter();

      const subject = `Brand Alum — заявка на расчёт от ${data.name}`;
      const rows: [string, string][] = [
        ["Имя", data.name],
        ["Телефон", data.phone],
        ["Email", data.email || "—"],
        ["Сообщение", data.message || "—"],
      ];
      const text =
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
        (data.summary ? `\n\n--- Конфигурация ---\n${data.summary}` : "");
      const html = `<h2>Заявка на расчёт</h2><table cellpadding="6" style="border-collapse:collapse">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="border:1px solid #ddd"><b>${escapeHtml(k)}</b></td><td style="border:1px solid #ddd">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
        )
        .join("")}</table>${
        data.summary
          ? `<h3>Конфигурация</h3><pre style="background:#f7f7f7;padding:12px;border-radius:6px;white-space:pre-wrap;font-family:ui-monospace,monospace">${escapeHtml(data.summary)}</pre>`
          : ""
      }`;

      console.log("[contact] sending mail to", getRecipient(), "from", getFrom());
      const info = await transporter.sendMail({
        from: getFrom(),
        to: getRecipient(),
        subject,
        text,
        html,
      });
      console.log("[contact] mail sent", info?.messageId, info?.response);
      return { ok: true as const };
    } catch (err) {
      console.error("[contact] FAILED", err);
      throw new Error(
        err instanceof Error ? `${err.name}: ${err.message}` : "Ошибка отправки заявки",
      );
    }
  });
