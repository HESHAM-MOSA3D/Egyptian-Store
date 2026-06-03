"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/lib/types";

/**
 * Zustand persist reads localStorage on the client only.
 * Until rehydration finishes, use empty cart on first paint to match SSR.
 */
export function useCartStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finish = () => setHydrated(true);
    const unsub = useCartStore.persist.onFinishHydration(finish);
    if (useCartStore.persist.hasHydrated()) {
      finish();
    }
    return unsub;
  }, []);

  return hydrated;
}

export function useCartItemCount() {
  const hydrated = useCartStoreHydrated();
  const count = useCartStore((s) => s.itemCount());
  return hydrated ? count : 0;
}

export function useCartItems(): CartItem[] {
  const hydrated = useCartStoreHydrated();
  const items = useCartStore((s) => s.items);
  return hydrated ? items : [];
}
