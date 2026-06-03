import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    nameAr: string;
    slug?: string;
    sortOrder?: number;
    isActive?: boolean;
  };

  const category = await prisma.category.create({
    data: {
      nameAr: body.nameAr,
      slug: body.slug || slugify(body.nameAr) || `cat-${Date.now()}`,
      sortOrder: body.sortOrder ?? 0,
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
