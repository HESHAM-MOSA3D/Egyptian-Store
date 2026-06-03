"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shop/page-header";
import { CartLineItem } from "@/components/shop/cart-line-item";
import { CartSummary } from "@/components/shop/cart-summary";
import { Button } from "@/components/ui/button";
import { useCartPricing } from "@/hooks/use-cart-pricing";
import { useSettings } from "@/hooks/use-settings";
import { useCartStore } from "@/store/cart";
import { useCartItemCount, useCartItems, useCartStoreHydrated } from "@/hooks/use-cart-hydrated";
import { formatSyp } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { settings } = useSettings();
  const hydrated = useCartStoreHydrated();
  const items = useCartItems();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const itemCount = useCartItemCount();
  const { lines, totalSyp } = useCartPricing(settings);
  const hasItems = hydrated && items.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/20 to-white pb-40">
      <PageHeader title="السلة" backHref="/shop" />

      <main className="mx-auto max-w-lg px-4 py-4">
        {!hasItems ? (
          <div className="rounded-2xl border border-dashed border-teal-200 bg-white py-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-12 w-12 text-teal-300" />
            <p className="mt-4 font-medium text-teal-800">السلة فارغة</p>
            <p className="mt-1 text-sm text-teal-600">
              أضف منتجات من الكتالوج لبدء الطلب
            </p>
            <Button asChild className="mt-6">
              <Link href="/shop">تصفح المنتجات</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {lines.map((line) => (
                <CartLineItem
                  key={`${line.productId}-${line.variantId ?? ""}`}
                  line={line}
                  onUpdateQuantity={(q) =>
                    updateQuantity(line.productId, line.variantId, q)
                  }
                  onRemove={() =>
                    removeItem(line.productId, line.variantId)
                  }
                />
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
              <CartSummary totalSyp={totalSyp} itemCount={itemCount} />
            </div>
          </>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-teal-100 bg-white/95 shadow-[0_-8px_24px_rgba(13,148,136,0.08)] backdrop-blur-md">
          <div className="mx-auto max-w-lg px-4 py-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-teal-700">
                الإجمالي النهائي
              </span>
              <span className="text-xl font-bold text-primary">
                {formatSyp(totalSyp)}
              </span>
            </div>
            <Button asChild size="lg" className="h-12 w-full text-base">
              <Link href="/checkout">إتمام الطلب عبر واتساب</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
