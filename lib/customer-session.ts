import { createHmac, timingSafeEqual } from "crypto";

export const CUSTOMER_SESSION_COOKIE = "customer_session";

function getSessionSecret(): string {
  return (
    process.env.CUSTOMER_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "beauty-demo-customer-secret"
  );
}

export function createCustomerSessionToken(
  customerId: string,
  maxAgeDays: number
): string {
  const exp = Date.now() + maxAgeDays * 24 * 60 * 60 * 1000;
  const payload = `${customerId}.${exp}`;
  const sig = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyCustomerSessionToken(
  token: string | undefined
): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const dot = payload.indexOf(".");
  if (dot <= 0) return null;
  const customerId = payload.slice(0, dot);
  const expStr = payload.slice(dot + 1);
  const exp = Number(expStr);
  if (!customerId || !Number.isFinite(exp) || Date.now() > exp) return null;

  const expected = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return customerId;
}
