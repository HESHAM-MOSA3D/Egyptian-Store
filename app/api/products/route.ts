import { NextRequest, NextResponse } from "next/server";
import { mapProductToPublic } from "@/lib/product-mapper";
import { prisma } from "@/lib/prisma";
import { getSettings, toPublicSettings } from "@/lib/settings";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.trim();

  const settings = await getSettings();
  const publicSettings = toPublicSettings(settings);

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isHidden: false,
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { nameAr: { contains: q } },
              { descriptionAr: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = products
    .map((p) =>
      mapProductToPublic(p, publicSettings.usdToSypRate, publicSettings.roundingMode)
    )
    .filter(Boolean);

  return NextResponse.json(mapped);
}
