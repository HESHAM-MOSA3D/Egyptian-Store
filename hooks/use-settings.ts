"use client";

import { useEffect, useState } from "react";
import type { PublicSettings } from "@/lib/types";

const defaultSettings: PublicSettings = {
  storeNameAr: "مركز التجميل",
  usdToSypRate: 50,
  roundingMode: "NEAREST_1000",
  whatsappNumber: "963911223344",
  deliveryNoteAr: null,
};

export function useSettings() {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: PublicSettings) => setSettings(data))
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
