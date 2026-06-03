import { usdToSyp, type RoundingModeKey } from "@/lib/pricing";
import {
  getStockUiState,
  isProductInStock,
  isVariantInStock,
  type ProductWithVariants,
} from "@/lib/stock";
import type { PublicProduct, PublicVariant } from "@/lib/types";
import { normalizeProductImages } from "@/lib/product-images";
import { parseImages } from "@/lib/utils";

function resolveUnitUsd(
  product: ProductWithVariants,
  variant?: { priceUsd: number | null }
): number {
  if (variant?.priceUsd != null) return variant.priceUsd;
  return product.priceUsd;
}

function buildPriceLabel(
  prices: number[],
  rate: number,
  mode: RoundingModeKey
): string {
  const unique = [...new Set(prices.map((p) => usdToSyp(p, rate, mode)))];
  if (unique.length <= 1) {
    return `${unique[0]?.toLocaleString("ar-SY") ?? "0"} ل.س`;
  }
  const min = Math.min(...unique);
  return `من ${min.toLocaleString("ar-SY")} ل.س`;
}

export function mapProductToPublic(
  product: ProductWithVariants & { category?: { nameAr: string } },
  rate: number,
  mode: RoundingModeKey
): PublicProduct | null {
  const stockState = getStockUiState(product);
  if (stockState === "hide") return null;

  const images = normalizeProductImages(parseImages(product.images), product.id);
  const activeVariants = product.variants.filter((v) => v.isActive);

  let priceLabel: string;
  let priceSyp: number;
  let variants: PublicVariant[] | undefined;

  if (product.hasVariants) {
    const variantPrices = activeVariants.map((v) =>
      resolveUnitUsd(product, v)
    );
    priceLabel = buildPriceLabel(variantPrices, rate, mode);
    priceSyp = variantPrices.length
      ? usdToSyp(Math.min(...variantPrices), rate, mode)
      : usdToSyp(product.priceUsd, rate, mode);
    variants = activeVariants.map((v) => {
      const unitUsd = resolveUnitUsd(product, v);
      return {
        id: v.id,
        labelAr: v.labelAr,
        sku: v.sku,
        priceUsd: unitUsd,
        priceSyp: usdToSyp(unitUsd, rate, mode),
        stockQty: v.stockQty,
        isActive: v.isActive,
        inStock: isVariantInStock(v),
      };
    });
  } else {
    priceSyp = usdToSyp(product.priceUsd, rate, mode);
    priceLabel = `${priceSyp.toLocaleString("ar-SY")} ل.س`;
  }

  const uiState =
    stockState === "available"
      ? "available"
      : stockState === "disable"
        ? "disable"
        : "grayed";

  return {
    id: product.id,
    nameAr: product.nameAr,
    descriptionAr: product.descriptionAr,
    images,
    categoryId: product.categoryId,
    categoryName: product.category?.nameAr ?? "",
    hasVariants: product.hasVariants,
    priceUsd: product.priceUsd,
    priceSyp,
    priceLabel,
    stockQty: product.stockQty,
    inStock: isProductInStock(product),
    stockState: uiState,
    variants,
  };
}
