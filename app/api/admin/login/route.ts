import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCredentials,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { username?: string; password?: string };
  const { user, password } = getAdminCredentials();

  if (body.username !== user || body.password !== password) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  return setSessionCookie(response);
}
