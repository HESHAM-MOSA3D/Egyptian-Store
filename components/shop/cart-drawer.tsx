"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { CartLineItem } from "@/components/shop/cart-line-item";
import { CartSummary } from "@/components/shop/cart-summary";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCartPricing } from "@/hooks/use-cart-pricing";
import { useSettings } from "@/hooks/use-settings";
import { useCartStore } from "@/store/cart";
import { useCartItemCount, useCartItems, useCartStoreHydrated } from "@/hooks/use-cart-hydrated";
import { cn } from "@/lib/utils";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings } = useSettings();
  const hydrated = useCartStoreHydrated();
  const items = useCartItems();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const itemCount = useCartItemCount();
  const { lines, totalSyp } = useCartPricing(settings);
  const hasItems = hydrated && items.length > 0;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[55] bg-teal-900/30",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[56] flex max-h-[min(92vh,40rem)] flex-col rounded-t-2xl border-t border-teal-100 bg-white shadow-card sm:mx-auto sm:max-w-lg sm:rounded-t-3xl",
          open ? "translate-y-0" : "translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="السلة"
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-teal-200 sm:hidden" />
        <div className="flex items-center justify-between border-b border-teal-50 px-4 py-3.5">
          <h2 className="flex items-center gap-2 text-base font-bold text-primary-dark">
            <ShoppingBag className="h-5 w-5 text-primary" aria-hidden />
            السلة
            {itemCount > 0 && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                {itemCount}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-teal-700 hover:bg-muted"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {!hasItems ? (
            <EmptyState
              icon={ShoppingBag}
              title="السلة فارغة"
              description="أضف منتجات من الكتالوج للمتابعة"
              size="sm"
              action={
                <Button asChild onClick={onClose}>
                  <Link href="/shop">تصفح المنتجات</Link>
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <CartLineItem
                  key={`${line.productId}-${line.variantId ?? ""}`}
                  line={line}
                  compact
                  onUpdateQuantity={(q) =>
                    updateQuantity(line.productId, line.variantId, q)
                  }
                  onRemove={() => removeItem(line.productId, line.variantId)}
                />
              ))}
            </ul>
          )}
        </div>

        {hasItems && (
          <div className="border-t border-teal-100 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <CartSummary totalSyp={totalSyp} itemCount={itemCount} compact />
            <div className="mt-4 grid gap-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout" onClick={onClose}>
                  إتمام الطلب عبر واتساب
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/cart" onClick={onClose}>
                  صفحة السلة الكاملة
                </Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={onClose}>
                متابعة التسوق
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
