"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCartDrawer } from "@/components/shop/cart-drawer-provider";
import { useCartItemCount } from "@/hooks/use-cart-hydrated";
import { cn } from "@/lib/utils";

export function ShopNav({
  storeName,
  search,
  onSearchChange,
}: {
  storeName: string;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const count = useCartItemCount();
  const { openDrawer } = useCartDrawer();

  return (
    <header className="sticky top-0 z-50 border-b border-teal-100/90 bg-white/95 shadow-soft backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <Link href="/shop" className="min-w-0 flex-1">
            <span className="block truncate text-base font-bold text-primary-dark sm:text-lg">
              {storeName}
            </span>
            <span className="text-[11px] text-teal-600 sm:text-xs">
              كتالوج الجملة — الأسعار بالجنيه المصري
            </span>
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            className={cn(
              "relative flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-xl",
              "bg-primary px-3 text-white shadow-soft transition hover:bg-primary-dark",
              "sm:min-w-[7rem]"
            )}
            aria-label={`السلة${count > 0 ? `، ${count} منتج` : ""}`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden text-sm font-semibold sm:inline">السلة</span>
            {count > 0 && (
              <span className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-primary ring-2 ring-primary">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>
        <div className="relative pb-3">
          <Search
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-400"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="ابحث بالاسم أو الوصف..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-teal-100 bg-muted/40 pr-11 focus-visible:bg-white"
            aria-label="بحث المنتجات"
          />
        </div>
      </div>
    </header>
  );
}
