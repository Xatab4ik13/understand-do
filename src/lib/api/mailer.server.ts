import nodemailer from "nodemailer";

let cached: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (cached) return cached;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP не настроен: отсутствуют SMTP_HOST/SMTP_USER/SMTP_PASSWORD");
  }

  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
    logger: true,
    debug: true,
  });
  return cached;

}

export function getFrom(): string {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@brandalum.ru";
}

export function getRecipient(): string {
  return process.env.CONTACT_TO || "artem.br.doors@mail.ru";
}
