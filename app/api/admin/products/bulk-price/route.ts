import { NextRequest, NextResponse } from "next/server";
import { usdToSyp, type RoundingModeKey } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

type PreviewRow = {
  productId: string;
  productNameAr: string;
  variantLabel: string | null;
  oldPriceUsd: number;
  newPriceUsd: number;
  priceSyp: number;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    percent: number;
    categoryId?: string;
    productIds?: string[];
    preview?: boolean;
  };

  const multiplier = 1 + body.percent / 100;
  const settings = await getSettings();
  const mode = settings.roundingMode as RoundingModeKey;
  const rate = settings.usdToSypRate;

  const where = body.productIds?.length
    ? { id: { in: body.productIds } }
    : body.categoryId
      ? { categoryId: body.categoryId }
      : {};

  const products = await prisma.product.findMany({
    where,
    include: { variants: true },
  });

  const previewRows: PreviewRow[] = [];

  for (const product of products) {
    const newProductUsd = product.priceUsd * multiplier;
    if (product.hasVariants && product.variants.length) {
      for (const variant of product.variants) {
        const oldUsd = variant.priceUsd ?? product.priceUsd;
        const newUsd = oldUsd * multiplier;
        previewRows.push({
          productId: product.id,
          productNameAr: product.nameAr,
          variantLabel: variant.labelAr,
          oldPriceUsd: oldUsd,
          newPriceUsd: newUsd,
          priceSyp: usdToSyp(newUsd, rate, mode),
        });
      }
    } else {
      previewRows.push({
        productId: product.id,
        productNameAr: product.nameAr,
        variantLabel: null,
        oldPriceUsd: product.priceUsd,
        newPriceUsd: newProductUsd,
        priceSyp: usdToSyp(newProductUsd, rate, mode),
      });
    }
  }

  if (body.preview) {
    return NextResponse.json({
      affected: products.length,
      rowCount: previewRows.length,
      rows: previewRows.slice(0, 100),
    });
  }

  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: { priceUsd: product.priceUsd * multiplier },
    });

    for (const variant of product.variants) {
      if (variant.priceUsd != null) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: { priceUsd: variant.priceUsd * multiplier },
        });
      }
    }
  }

  return NextResponse.json({ updated: products.length });
}
