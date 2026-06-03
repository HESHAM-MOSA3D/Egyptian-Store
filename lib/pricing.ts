export type RoundingModeKey = "NEAREST_500" | "NEAREST_1000";

export function usdToSyp(
  priceUsd: number,
  rate: number,
  mode: RoundingModeKey
): number {
  const raw = priceUsd * rate;
  const step = mode === "NEAREST_500" ? 500 : 1000;
  return Math.round(raw / step) * step;
}

export function lineTotalSyp(
  unitPriceUsd: number,
  quantity: number,
  rate: number,
  mode: RoundingModeKey
): number {
  return usdToSyp(unitPriceUsd, rate, mode) * quantity;
}
