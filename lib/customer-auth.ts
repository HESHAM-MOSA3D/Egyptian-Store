import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import {
  createCustomerSessionToken,
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerSessionToken,
} from "@/lib/customer-session";
import { prisma } from "@/lib/prisma";

export { CUSTOMER_SESSION_COOKIE } from "@/lib/customer-session";

const BCRYPT_ROUNDS = 10;

export type PublicCustomer = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhone(phone);
  return digits || phone;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function toPublicCustomer(customer: {
  id: string;
  name: string;
  phone: string;
  address: string;
}): PublicCustomer {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
  };
}

export function setCustomerSessionCookie(
  response: NextResponse,
  customerId: string,
  remember: boolean
): NextResponse {
  const days = remember ? 30 : 7;
  const token = createCustomerSessionToken(customerId, days);
  response.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: days * 24 * 60 * 60,
  });
  return response;
}

export function clearCustomerSessionCookie(
  response: NextResponse
): NextResponse {
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function getCustomerIdFromRequest(
  request: NextRequest
): string | null {
  const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
  return verifyCustomerSessionToken(token);
}

export async function getCustomerIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  return verifyCustomerSessionToken(token);
}

export async function getLoggedInCustomer(): Promise<PublicCustomer | null> {
  const customerId = await getCustomerIdFromCookies();
  if (!customerId) return null;
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { id: true, name: true, phone: true, address: true },
  });
  return customer ? toPublicCustomer(customer) : null;
}

export function requireCustomerApi(
  request: NextRequest
): { customerId: string } | NextResponse {
  const customerId = getCustomerIdFromRequest(request);
  if (!customerId) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }
  return { customerId };
}
