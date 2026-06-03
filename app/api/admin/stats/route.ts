import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { isProductInStock } from "@/lib/stock";

export async function GET() {
  const [settings, productCount, activeCount, hiddenCount, categoryCount, products] =
    await Promise.all([
      getSettings(),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true, isHidden: false } }),
      prisma.product.count({ where: { isHidden: true } }),
      prisma.category.count(),
      prisma.product.findMany({ include: { variants: true } }),
    ]);

  const outOfStockCount = products.filter((p) => !isProductInStock(p)).length;

  const roundingLabel =
    settings.roundingMode === "NEAREST_500" ? "500 ل.س" : "1000 ل.س";

  return NextResponse.json({
    productCount,
    activeCount,
    hiddenCount,
    outOfStockCount,
    categoryCount,
    usdToSypRate: settings.usdToSypRate,
    roundingMode: settings.roundingMode,
    roundingLabel,
    whatsappNumber: settings.whatsappNumber,
    storeNameAr: settings.storeNameAr,
    storeDescriptionAr: settings.storeDescriptionAr,
  });
}
