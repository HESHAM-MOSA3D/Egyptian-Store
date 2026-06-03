import { NextRequest, NextResponse } from "next/server";
import { mapProductToPublic } from "@/lib/product-mapper";
import { prisma } from "@/lib/prisma";
import { getSettings, toPublicSettings } from "@/lib/settings";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const settings = await getSettings();
  const publicSettings = toPublicSettings(settings);

  const product = await prisma.product.findFirst({
    where: { id, isActive: true, isHidden: false },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
  }

  const mapped = mapProductToPublic(
    product,
    publicSettings.usdToSypRate,
    publicSettings.roundingMode
  );

  if (!mapped) {
    return NextResponse.json({ error: "المنتج غير متاح" }, { status: 404 });
  }

  return NextResponse.json({ product: mapped, settings: publicSettings });
}
