import { mapProductToPublic } from "@/lib/product-mapper";
import { prisma } from "@/lib/prisma";
import { getSettings, toPublicSettings } from "@/lib/settings";
import type { PublicProduct, PublicSettings } from "@/lib/types";

/** Curated seed products for the landing showcase */
const FEATURED_PRODUCT_NAMES = [
  "صابون طبيعي",
  "سيروم فيتامين C",
  "شامبو احترافي",
  "أحمر شفاه مات",
  "عطر زهور الربيع",
  "كريم اليدين بالشيا",
] as const;

export type LandingCategory = {
  id: string;
  nameAr: string;
  slug: string;
};

export async function getLandingPageData(): Promise<{
  settings: PublicSettings;
  categories: LandingCategory[];
  featuredProducts: PublicProduct[];
}> {
  const settings = await getSettings();
  const publicSettings = toPublicSettings(settings);

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, nameAr: true, slug: true },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        isHidden: false,
        nameAr: { in: [...FEATURED_PRODUCT_NAMES] },
      },
      include: {
        category: true,
        variants: { orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  const byName = new Map(
    products
      .map((p) =>
        mapProductToPublic(
          p,
          publicSettings.usdToSypRate,
          publicSettings.roundingMode
        )
      )
      .filter((p): p is PublicProduct => p !== null)
      .map((p) => [p.nameAr, p])
  );

  let featuredProducts = FEATURED_PRODUCT_NAMES.map(
    (name) => byName.get(name)
  ).filter((p): p is PublicProduct => p !== undefined);

  if (featuredProducts.length < 4) {
    const fallback = await prisma.product.findMany({
      where: { isActive: true, isHidden: false, stockQty: { gt: 0 } },
      take: 6,
      include: {
        category: true,
        variants: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    featuredProducts = fallback
      .map((p) =>
        mapProductToPublic(
          p,
          publicSettings.usdToSypRate,
          publicSettings.roundingMode
        )
      )
      .filter((p): p is PublicProduct => p !== null)
      .slice(0, 6);
  }

  return {
    settings: publicSettings,
    categories,
    featuredProducts,
  };
}
