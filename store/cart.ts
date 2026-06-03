"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  addBatch: (entries: Array<Omit<CartItem, "quantity"> & { quantity: number }>) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clear: () => void;
  itemCount: () => number;
};

function lineKey(productId: string, variantId?: string) {
  return `${productId}:${variantId ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        if (quantity <= 0) return;
        set((state) => {
          const key = lineKey(item.productId, item.variantId);
          const existing = state.items.find(
            (i) => lineKey(i.productId, i.variantId) === key
          );
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, item.maxStock);
            return {
              items: state.items.map((i) =>
                lineKey(i.productId, i.variantId) === key
                  ? { ...i, quantity: nextQty, maxStock: item.maxStock }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(quantity, item.maxStock) },
            ],
          };
        });
      },
      addBatch: (entries) => {
        entries.forEach((e) => {
          if (e.quantity > 0) {
            get().addItem(e, e.quantity);
          }
        });
      },
      updateQuantity: (productId, variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) =>
                  !(
                    i.productId === productId &&
                    (i.variantId ?? "") === (variantId ?? "")
                  )
              ),
            };
          }
          return {
            items: state.items.map((i) => {
              if (
                i.productId === productId &&
                (i.variantId ?? "") === (variantId ?? "")
              ) {
                return { ...i, quantity: Math.min(quantity, i.maxStock) };
              }
              return i;
            }),
          };
        });
      },
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (i.variantId ?? "") === (variantId ?? "")
              )
          ),
        }));
      },
      clear: () => set({ items: [] }),
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "beauty-cart" }
  )
);
