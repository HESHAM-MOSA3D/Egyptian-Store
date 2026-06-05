export const LOCAL_PRODUCT_PLACEHOLDER = "/images/product-placeholder.png";

export function productDemoImage(seed: string): string {
  const normalizedSeed = seed?.toLowerCase().trim() || "";

  const map: Record<string, string> = {
    "serum-vitamin-c": "https://images.unsplash.com/photo-1612810436541-336d2e8b2a15?auto=format&fit=crop&w=600&q=80",
    "toner-rose": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    "sunscreen-spf50": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad3c0b?auto=format&fit=crop&w=600&q=80",
    "gentle-scrub": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80",
    "body-lotion-vanilla": "https://images.unsplash.com/photo-1620917669790-3f0b6c3c3a45?auto=format&fit=crop&w=600&q=80",
    "perfume-oud": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=600&q=80",
    "makeup-sponges": "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
    "face-brush": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
  };

  return map[normalizedSeed] || "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=600&q=80";
}

export function resolveProductImageSrc(
  src?: string | null,
  productId?: string
): string {
  if (!src || src.trim() === "" || src === "undefined" || src === "null") {
    return productId
      ? productDemoImage(productId)
      : LOCAL_PRODUCT_PLACEHOLDER;
  }

  if (src.includes("placehold.co") || src.includes("placeholder")) {
    return productId
      ? productDemoImage(productId)
      : LOCAL_PRODUCT_PLACEHOLDER;
  }

  return src;
}

export function normalizeProductImages(
  urls: string[],
  productId: string
): string[] {
  if (!urls || urls.length === 0) {
    return [productDemoImage(productId)];
  }

  return urls.map((u) => resolveProductImageSrc(u, productId));
}