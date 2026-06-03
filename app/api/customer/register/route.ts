import { NextRequest, NextResponse } from "next/server";
import {
  formatPhoneDisplay,
  hashPassword,
  normalizePhone,
  setCustomerSessionCookie,
  toPublicCustomer,
} from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { validatePhone } from "@/store/customer";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    address?: string;
    password?: string;
    remember?: boolean;
  };

  const name = body.name?.trim();
  const phoneRaw = body.phone?.trim() ?? "";
  const address = body.address?.trim();
  const password = body.password ?? "";

  if (!name) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  if (!validatePhone(phoneRaw)) {
    return NextResponse.json({ error: "رقم الهاتف غير صالح" }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "كلمة المرور 6 أحرف على الأقل" },
      { status: 400 }
    );
  }

  const phoneNorm = normalizePhone(formatPhoneDisplay(phoneRaw));

  const existing = await prisma.customer.findUnique({
    where: { phone: phoneNorm },
  });
  if (existing) {
    return NextResponse.json(
      { error: "رقم الهاتف مسجّل مسبقاً" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const customer = await prisma.customer.create({
    data: { name, phone: phoneNorm, address, passwordHash },
    select: { id: true, name: true, phone: true, address: true },
  });

  const response = NextResponse.json({
    customer: toPublicCustomer(customer),
  });
  return setCustomerSessionCookie(
    response,
    customer.id,
    body.remember === true
  );
}
