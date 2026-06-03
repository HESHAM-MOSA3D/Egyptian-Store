import { NextResponse } from "next/server";
import { clearCustomerSessionCookie } from "@/lib/customer-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearCustomerSessionCookie(response);
}
