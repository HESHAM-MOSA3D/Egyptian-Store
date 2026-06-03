import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseImages(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function stringifyImages(urls: string[]): string {
  return JSON.stringify(urls.filter(Boolean));
}

export function formatSyp(amount: number): string {
  return `${amount.toLocaleString("ar-SY")} ل.س`;
}

/** Cart / order display: "صابون طبيعي - فحم" */
export function formatCartItemTitle(
  productName: string,
  variantLabel?: string
): string {
  return variantLabel ? `${productName} - ${variantLabel}` : productName;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-");
}
