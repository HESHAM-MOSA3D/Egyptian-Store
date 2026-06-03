import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      storeNameAr: body.storeNameAr,
      storeDescriptionAr: body.storeDescriptionAr ?? null,
      usdToSypRate: Number(body.usdToSypRate),
      roundingMode: body.roundingMode,
      whatsappNumber: String(body.whatsappNumber).replace(/\D/g, ""),
      deliveryNoteAr: body.deliveryNoteAr ?? null,
    },
    create: {
      id: "singleton",
      storeNameAr: body.storeNameAr,
      storeDescriptionAr: body.storeDescriptionAr ?? null,
      usdToSypRate: Number(body.usdToSypRate),
      roundingMode: body.roundingMode,
      whatsappNumber: String(body.whatsappNumber).replace(/\D/g, ""),
      deliveryNoteAr: body.deliveryNoteAr ?? null,
    },
  });
  return NextResponse.json(settings);
}
