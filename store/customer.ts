"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CustomerFields = {
  name: string;
  phone: string;
  address: string;
  notes: string;
  deliveryRequested: boolean;
};

const defaults: CustomerFields = {
  name: "",
  phone: "",
  address: "",
  notes: "",
  deliveryRequested: false,
};

type CustomerState = CustomerFields & {
  setField: <K extends keyof CustomerFields>(
    key: K,
    value: CustomerFields[K]
  ) => void;
  reset: () => void;
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      ...defaults,
      setField: (key, value) => set({ [key]: value }),
      reset: () => set(defaults),
    }),
    { name: "beauty-customer" }
  )
);

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}
