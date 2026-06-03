"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicCustomer } from "@/lib/customer-auth";

export function useCustomerAuth() {
  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/me", { credentials: "include" });
      const data = (await res.json()) as { customer: PublicCustomer | null };
      setCustomer(data.customer ?? null);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    customer,
    loading,
    isLoggedIn: !!customer,
    refresh,
  };
}
