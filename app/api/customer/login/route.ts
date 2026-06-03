import { NextRequest, NextResponse } from "next/server";
import {
  normalizePhone,
  setCustomerSessionCookie,
  toPublicCustomer,
  verifyPassword,
} from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { validatePhone } from "@/store/customer";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    phone?: string;
    password?: string;
    remember?: boolean;
  };

  const phoneRaw = body.phone?.trim() ?? "";
  const password = body.password ?? "";

  if (!validatePhone(phoneRaw)) {
    return NextResponse.json({ error: "رقم الهاتف غير صالح" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "كلمة المرور مطلوبة" }, { status: 400 });
  }

  const phoneNorm = normalizePhone(phoneRaw);
  const customer = await prisma.customer.findUnique({
    where: { phone: phoneNorm },
  });

  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return NextResponse.json(
      { error: "رقم الهاتف أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    customer: toPublicCustomer(customer),
  });
  return setCustomerSessionCookie(
    response,
    customer.id,
    body.remember === true
  );
}
