import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isProductInStock } from "@/lib/stock";
import { stringifyImages } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }
  return NextResponse.json({
    ...product,
    inStock: isProductInStock(product),
    images: JSON.parse(product.images || "[]"),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const images = Array.isArray(body.images)
    ? stringifyImages(body.images)
    : body.images;

  await prisma.productVariant.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      categoryId: body.categoryId,
      nameAr: body.nameAr,
      descriptionAr: body.descriptionAr ?? null,
      ...(images !== undefined ? { images } : {}),
      priceUsd: Number(body.priceUsd),
      stockQty: Number(body.stockQty ?? 0),
      hasVariants: Boolean(body.hasVariants),
      isActive: body.isActive,
      isHidden: body.isHidden,
      outOfStockBehavior: body.outOfStockBehavior,
      variants: body.hasVariants && body.variants?.length
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

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
