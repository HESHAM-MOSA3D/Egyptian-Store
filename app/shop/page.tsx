"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryChips } from "@/components/shop/category-chips";
import { ProductCard } from "@/components/shop/product-card";
import { ProductSkeleton } from "@/components/shop/product-skeleton";
import { ShopEmptyState } from "@/components/shop/shop-empty-state";
import { ShopHeader } from "@/components/shop/shop-header";
import { useSettings } from "@/hooks/use-settings";
import type { PublicProduct } from "@/lib/types";

type Category = { id: string; nameAr: string; slug: string };

function getEmptyVariant(
  search: string,
  category: string | null
): "no-products" | "no-search" | "no-category" {
  if (search.trim()) return "no-search";
  if (category) return "no-category";
  return "no-products";
}

function ShopContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (fromUrl && !initialized) {
      setCategory(fromUrl);
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search.trim()) params.set("q", search.trim());
    const res = await fetch(`/api/products?${params}`);
    const data = (await res.json()) as PublicProduct[];
    setProducts(data);
    setLoading(false);
  }, [category, search]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
  }, [loadProducts]);

  const selectedCategoryName = useMemo(
    () => categories.find((c) => c.slug === category)?.nameAr,
    [categories, category]
  );

  const clearFilters = () => {
    setSearch("");
    setCategory(null);
  };

  const emptyVariant = getEmptyVariant(search, category);

  return (
    <div className="page-gradient min-h-screen pb-24 md:pb-10">
      <ShopHeader
        storeName={settings.storeNameAr}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="border-b border-teal-50/90 bg-white/95 shadow-soft">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <CategoryChips
            categories={categories}
            selected={category}
            onSelect={setCategory}
            loading={categoriesLoading}
          />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-4">
        {!loading && products.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-teal-700">
            <p>
              <span className="font-bold text-primary-dark">{products.length}</span>{" "}
              منتج
              {selectedCategoryName && (
                <span> في «{selectedCategoryName}»</span>
              )}
              {search.trim() && (
                <span> لبحث «{search.trim()}»</span>
              )}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <ShopEmptyState
            variant={emptyVariant}
            onClearFilters={
              emptyVariant !== "no-products" ? clearFilters : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-teal-50/30 to-white pb-24">
          <div className="h-28 animate-pulse border-b bg-white" />
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="mb-4 flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-20 animate-pulse rounded-full bg-teal-100"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
