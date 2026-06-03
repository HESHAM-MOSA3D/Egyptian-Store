import type { OutOfStockBehavior, Product, ProductVariant } from "@prisma/client";

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

export function isVariantInStock(variant: ProductVariant): boolean {
  return variant.isActive && variant.stockQty > 0;
}

export function getAvailableStock(
  product: ProductWithVariants,
  variantId?: string | null
): number {
  if (product.hasVariants) {
    if (variantId) {
      const v = product.variants.find((x) => x.id === variantId);
      return v?.isActive ? v.stockQty : 0;
    }
    return product.variants
      .filter((v) => v.isActive)
      .reduce((sum, v) => sum + v.stockQty, 0);
  }
  return product.stockQty;
}

export function isProductInStock(product: ProductWithVariants): boolean {
  if (!product.isActive) return false;
  if (product.hasVariants) {
    return product.variants.some(isVariantInStock);
  }
  return product.stockQty > 0;
}

export function shouldHideFromCatalog(
  product: ProductWithVariants
): boolean {
  if (product.isHidden || !product.isActive) return true;
  if (!isProductInStock(product) && product.outOfStockBehavior === "HIDE") {
    return true;
  }
  return false;
}

export function getStockUiState(
  product: ProductWithVariants
): "available" | "hide" | "disable" | "grayed" {
  if (shouldHideFromCatalog(product)) return "hide";
  if (isProductInStock(product)) return "available";
  if (product.outOfStockBehavior === "DISABLE") return "disable";
  if (product.outOfStockBehavior === "GRAYED") return "grayed";
  return "hide";
}

export function outOfStockLabel(behavior: OutOfStockBehavior): string {
  switch (behavior) {
    case "HIDE":
      return "مخفي عند النفاد";
    case "DISABLE":
      return "معطل عند النفاد";
    case "GRAYED":
      return "رمادي عند النفاد";
    default:
      return "";
  }
}
