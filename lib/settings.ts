import { prisma } from "@/lib/prisma";
import type { RoundingModeKey } from "@/lib/pricing";
import type { PublicSettings } from "@/lib/types";

export async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "singleton" } });
  }
  return settings;
}

export function toPublicSettings(settings: {
  storeNameAr: string;
  usdToSypRate: number;
  roundingMode: string;
  whatsappNumber: string;
  deliveryNoteAr: string | null;
}): PublicSettings {
  return {
    storeNameAr: settings.storeNameAr,
    usdToSypRate: settings.usdToSypRate,
    roundingMode: settings.roundingMode as RoundingModeKey,
    whatsappNumber: settings.whatsappNumber,
    deliveryNoteAr: settings.deliveryNoteAr,
  };
}
