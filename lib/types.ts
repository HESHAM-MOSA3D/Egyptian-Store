import type { RoundingModeKey } from "@/lib/pricing";

export type PublicSettings = {
  storeNameAr: string;
  usdToSypRate: number;
  roundingMode: RoundingModeKey;
  whatsappNumber: string;
  deliveryNoteAr: string | null;
};

export type PublicVariant = {
  id: string;
  labelAr: string;
  sku: string | null;
  priceUsd: number;
  priceSyp: number;
  stockQty: number;
  isActive: boolean;
  inStock: boolean;
};

export type PublicProduct = {
  id: string;
  nameAr: string;
  descriptionAr: string | null;
  images: string[];
  categoryId: string;
  categoryName: string;
  hasVariants: boolean;
  priceUsd: number;
  priceSyp: number;
  priceLabel: string;
  stockQty: number;
  inStock: boolean;
  stockState: "available" | "disable" | "grayed";
  variants?: PublicVariant[];
};

export type CartItem = {
  productId: string;
  variantId?: string;
  productName: string;
  variantLabel?: string;
  image: string;
  unitPriceUsd: number;
  quantity: number;
  maxStock: number;
};
