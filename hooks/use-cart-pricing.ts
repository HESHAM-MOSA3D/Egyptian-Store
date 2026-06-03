"use client";

import { lineTotalSyp, usdToSyp } from "@/lib/pricing";
import type { PublicSettings } from "@/lib/types";
import { useCartItems } from "@/hooks/use-cart-hydrated";

export function useCartPricing(settings: PublicSettings) {
  const items = useCartItems();

  const lines = items.map((item) => {
    const unitSyp = usdToSyp(
      item.unitPriceUsd,
      settings.usdToSypRate,
      settings.roundingMode
    );
    const lineTotal = lineTotalSyp(
      item.unitPriceUsd,
      item.quantity,
      settings.usdToSypRate,
      settings.roundingMode
    );
    return { ...item, unitSyp, lineTotal };
  });

  const totalSyp = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  return { lines, totalSyp };
}
