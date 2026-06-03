import { NextRequest, NextResponse } from "next/server";
import {
  getLoggedInCustomer,
  normalizePhone,
  requireCustomerApi,
  toPublicCustomer,
} from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { validatePhone } from "@/store/customer";

export async function GET() {
  const customer = await getLoggedInCustomer();
  return NextResponse.json({ customer });
}

export async function PATCH(request: NextRequest) {
  const auth = requireCustomerApi(request);
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    address?: string;
  };

  const name = body.name?.trim();
  const phone = body.phone?.trim()
    ? normalizePhone(body.phone.trim())
    : "";
  const address = body.address?.trim();

  if (!name) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  if (!phone || !validatePhone(phone)) {
    return NextResponse.json({ error: "رقم الهاتف غير صالح" }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  }

  try {
    const updated = await prisma.customer.update({
      where: { id: auth.customerId },
      data: { name, phone, address },
      select: { id: true, name: true, phone: true, address: true },
    });
    return NextResponse.json({ customer: toPublicCustomer(updated) });
  } catch {
    return NextResponse.json(
      { error: "رقم الهاتف مستخدم من حساب آخر" },
      { status: 409 }
    );
  }
}
