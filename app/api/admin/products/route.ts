import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isProductInStock } from "@/lib/stock";
import { stringifyImages } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const active = searchParams.get("active");
  const outOfStock = searchParams.get("outOfStock");
  const hidden = searchParams.get("hidden");
  const q = searchParams.get("q")?.trim();

  const products = await prisma.product.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(active === "true" ? { isActive: true } : active === "false" ? { isActive: false } : {}),
      ...(hidden === "true" ? { isHidden: true } : hidden === "false" ? { isHidden: false } : {}),
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
    orderBy: { updatedAt: "desc" },
  });

  const filtered = outOfStock === "true"
    ? products.filter((p) => !isProductInStock(p))
    : outOfStock === "false"
      ? products.filter((p) => isProductInStock(p))
      : products;

  return NextResponse.json(
    filtered.map((p) => ({
      ...p,
      inStock: isProductInStock(p),
      images: JSON.parse(p.images || "[]"),
    }))
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const images = Array.isArray(body.images) ? stringifyImages(body.images) : body.images ?? "[]";

  const product = await prisma.product.create({
    data: {
      categoryId: body.categoryId,
      nameAr: body.nameAr,
      descriptionAr: body.descriptionAr ?? null,
      images,
      priceUsd: Number(body.priceUsd),
      stockQty: Number(body.stockQty ?? 0),
      hasVariants: Boolean(body.hasVariants),
      isActive: body.isActive ?? true,
      isHidden: body.isHidden ?? false,
      outOfStockBehavior: body.outOfStockBehavior ?? "GRAYED",
      variants: body.variants?.length
        ? {
            create: body.variants.map(
              (
                v: {
                  labelAr: string;
                  sku?: string;
                  priceUsd?: number | null;
                  stockQty?: number;
                  sortOrder?: number;
                  isActive?: boolean;
                },
                idx: number
              ) => ({
                labelAr: v.labelAr,
                sku: v.sku ?? null,
                priceUsd: v.priceUsd ?? null,
                stockQty: v.stockQty ?? 0,
                sortOrder: v.sortOrder ?? idx,
                isActive: v.isActive ?? true,
              })
            ),
          }
        : undefined,
    },
    include: { variants: true, category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
