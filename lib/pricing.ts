export type RoundingModeKey = "NEAREST_500" | "NEAREST_1000";

export function usdToEgp(
  priceUsd: number,
  rate: number,
  mode: RoundingModeKey
): number {
  const raw = priceUsd * rate;
  const step = mode === "NEAREST_500" ? 500 : 1000;
  return Math.round(raw / step) * step;
}

// alias for backward compat
export const usdToSyp = usdToEgp;

export function lineTotalEgp(
  unitPriceUsd: number,
  quantity: number,
  rate: number,
  mode: RoundingModeKey
): number {
  return usdToEgp(unitPriceUsd, rate, mode) * quantity;
}

// alias for backward compat
export const lineTotalSyp = lineTotalEgp;
