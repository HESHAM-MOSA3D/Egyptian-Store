export const LOCAL_PRODUCT_PLACEHOLDER = "/images/product-placeholder.png";

export function productDemoImage(seed: string): string {
  const normalizedSeed = seed?.toLowerCase().trim() || "";

  const map: Record<string, string> = {
    "serum-vitamin-c": "https://images.unsplash.com/photo-1723951174326-2a97221d3b7f?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "toner-rose": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    "sunscreen-spf50": "https://images.unsplash.com/photo-1654973552952-d0c98a3e3388?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "gentle-scrub": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80",
    "body-lotion-vanilla": "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "perfume-oud": "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=600&q=80",
    "makeup-sponges": "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
    "face-brush": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    "hand-cream-shea": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80",
    "perfume-spring": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    "pro-shampoo": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
    "luxury-perfume-sizes": "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    "natural-soap": "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "matte-lipstick": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    "clay-mask-hide": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=600&q=80",
    "care-oil-disable": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    "repair-balm-grayed": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80",
    "hidden-admin-product": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
    "led-makeup-mirror": "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "face-cleansing-gel": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
  };

  if (map[normalizedSeed]) return map[normalizedSeed];

  if (normalizedSeed.includes("serum") || normalizedSeed.includes("سيروم")) return map["serum-vitamin-c"];
  if (normalizedSeed.includes("sunscreen") || normalizedSeed.includes("شمس")) return map["sunscreen-spf50"];
  if (normalizedSeed.includes("lotion") || normalizedSeed.includes("لوشن")) return map["body-lotion-vanilla"];
  if (normalizedSeed.includes("soap") || normalizedSeed.includes("صابون")) return map["natural-soap"];
  if (normalizedSeed.includes("mirror") || normalizedSeed.includes("مرآة") || normalizedSeed.includes("led")) return map["led-makeup-mirror"];
  if (normalizedSeed.includes("shampoo") || normalizedSeed.includes("شامبو")) return map["pro-shampoo"];
  if (normalizedSeed.includes("perfume") || normalizedSeed.includes("عطر")) return map["luxury-perfume-sizes"];
  if (normalizedSeed.includes("lipstick") || normalizedSeed.includes("شفاه")) return map["matte-lipstick"];

  return "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=600&q=80";
}

export function resolveProductImageSrc(
  src?: string | null,
  productId?: string
): string {
  if (!src || src.trim() === "" || src === "undefined" || src === "null") {
    return productId ? productDemoImage(productId) : LOCAL_PRODUCT_PLACEHOLDER;
  }

  if (!src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("/")) {
    return productDemoImage(src || productId || "");
  }

  if (src.includes("placehold.co") || src.includes("via.placeholder")) {
    return productId ? productDemoImage(productId) : LOCAL_PRODUCT_PLACEHOLDER;
  }

  return src;
}

export function normalizeProductImages(
  urls: string[] | string | null | undefined,
  productId: string
): string[] {
  if (!urls) return [productDemoImage(productId)];
  
  let parsedUrls: string[] = [];
  if (typeof urls === "string") {
    try {
      parsedUrls = JSON.parse(urls);
    } catch {
      parsedUrls = [urls];
    }
  } else if (Array.isArray(urls)) {
    parsedUrls = urls;
  }

  if (parsedUrls.length === 0) return [productDemoImage(productId)];

  return parsedUrls.map((u) => resolveProductImageSrc(u, productId));
}