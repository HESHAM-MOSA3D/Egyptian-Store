/** Local fallback when remote image fails */

export const LOCAL_PRODUCT_PLACEHOLDER = "/images/product-placeholder.png";



/** Deterministic demo photo (JPEG) — works with next/image */

export function productDemoImage(seed: string): string {

  const safe =

    seed

      .trim()

      .toLowerCase()

      .replace(/[^a-z0-9-]+/g, "-")

      .replace(/^-+|-+$/g, "") || "product";

  return `https://picsum.photos/seed/${safe}/400/400`;

}



export const REMOTE_PRODUCT_PLACEHOLDER = productDemoImage("default-product");



/** Normalize URLs — migrate legacy placehold.co (Arabic text showed as ????) */

export function resolveProductImageSrc(

  src?: string | null,

  productId?: string

): string {

  const trimmed = src?.trim();

  if (!trimmed) {

    return productId

      ? productDemoImage(productId)

      : LOCAL_PRODUCT_PLACEHOLDER;

  }

  if (trimmed.includes("placehold.co")) {

    return productId

      ? productDemoImage(productId)

      : REMOTE_PRODUCT_PLACEHOLDER;

  }

  return trimmed;

}



export function normalizeProductImages(

  urls: string[],

  productId: string

): string[] {

  const normalized = urls.map((u) => resolveProductImageSrc(u, productId));

  return normalized.length > 0

    ? normalized

    : [productDemoImage(productId)];

}


