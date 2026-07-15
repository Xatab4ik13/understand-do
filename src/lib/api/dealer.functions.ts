import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type DealerSession = { dealer?: boolean };

function sessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password) throw new Error("SESSION_SECRET is not set");
  return {
    password,
    name: "brand-alum-session",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export const getDealerMode = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<DealerSession>(sessionConfig());
  return { dealer: session.data.dealer === true };
});

export const dealerLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const expected = process.env.DEALER_PASSWORD;
    if (!expected) throw new Error("DEALER_PASSWORD is not set");
    if (data.password !== expected) {
      return { ok: false as const };
    }
    const session = await useSession<DealerSession>(sessionConfig());
    await session.update({ dealer: true });
    return { ok: true as const };
  });

export const dealerLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<DealerSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});
