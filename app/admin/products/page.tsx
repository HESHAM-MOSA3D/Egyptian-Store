"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Package, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmpty } from "@/components/admin/admin-empty";

type Category = { id: string; nameAr: string };

type Product = {
  id: string;
  nameAr: string;
  priceUsd: number;
  isActive: boolean;
  isHidden: boolean;
  inStock: boolean;
  category: { id: string; nameAr: string };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [filter, setFilter] = useState({
    categoryId: "",
    active: "",
    hidden: "",
    outOfStock: "",
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.categoryId) params.set("categoryId", filter.categoryId);
    if (filter.active) params.set("active", filter.active);
    if (filter.hidden) params.set("hidden", filter.hidden);
    if (filter.outOfStock) params.set("outOfStock", filter.outOfStock);
    if (debouncedQ) params.set("q", debouncedQ);
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [filter, debouncedQ]);

  useEffect(() => {
    load();
  }, [load]);

  const hasFilters = useMemo(
    () =>
      Boolean(
        debouncedQ ||
          filter.categoryId ||
          filter.active ||
          filter.hidden ||
          filter.outOfStock
      ),
    [debouncedQ, filter]
  );

  return (
    <div>
      <AdminPageHeader
        title="المنتجات"
        description="بحث، تصفية، وتعديل المنتجات والمتغيرات"
        action={
          <Button asChild className="gap-2">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              منتج جديد
            </Link>
          </Button>
        }
      />

      <div className="surface-card mb-4 space-y-3 p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500" />
          <Input
            className="pr-10"
            placeholder="بحث بالاسم أو الوصف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            className="min-w-[8rem] flex-1 text-sm sm:flex-none"
            value={filter.categoryId}
            onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })}
          >
            <option value="">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameAr}
              </option>
            ))}
          </Select>
          <Select
            className="min-w-[8rem] flex-1 text-sm sm:flex-none"
            value={filter.active}
            onChange={(e) => setFilter({ ...filter, active: e.target.value })}
          >
            <option value="">الحالة</option>
            <option value="true">نشط</option>
            <option value="false">غير نشط</option>
          </Select>
          <Select
            className="min-w-[8rem] flex-1 text-sm sm:flex-none"
            value={filter.hidden}
            onChange={(e) => setFilter({ ...filter, hidden: e.target.value })}
          >
            <option value="">الظهور</option>
            <option value="false">ظاهر</option>
            <option value="true">مخفي</option>
          </Select>
          <Select
            className="min-w-[8rem] flex-1 text-sm sm:flex-none"
            value={filter.outOfStock}
            onChange={(e) =>
              setFilter({ ...filter, outOfStock: e.target.value })
            }
          >
            <option value="">المخزون</option>
            <option value="false">متوفر</option>
            <option value="true">نفد</option>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-sm text-teal-600 py-12">جاري التحميل...</p>
      ) : products.length === 0 ? (
        <AdminEmpty
          icon={Package}
          title={hasFilters ? "لا توجد نتائج" : "لا توجد منتجات بعد"}
          description={
            hasFilters
              ? "جرّب تغيير البحث أو الفلاتر"
              : "أضف أول منتج للكتالوج"
          }
          action={
            !hasFilters ? (
              <Button asChild>
                <Link href="/admin/products/new">إضافة منتج</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="surface-card overflow-hidden">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-50 bg-teal-50/50 text-right text-teal-800">
                  <th className="px-4 py-3 font-semibold">المنتج</th>
                  <th className="px-4 py-3 font-semibold">التصنيف</th>
                  <th className="px-4 py-3 font-semibold">USD</th>
                  <th className="px-4 py-3 font-semibold">الحالة</th>
                  <th className="px-4 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-teal-50 last:border-0 hover:bg-teal-50/30"
                  >
                    <td className="px-4 py-3 font-medium text-primary-dark">
                      {p.nameAr}
                    </td>
                    <td className="px-4 py-3 text-teal-700">{p.category.nameAr}</td>
                    <td className="px-4 py-3">${p.priceUsd.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {!p.inStock && <StatusBadge variant="out" />}
                        {p.isHidden && <StatusBadge variant="hidden" />}
                        {!p.isActive && <StatusBadge variant="inactive" />}
                        {p.inStock && p.isActive && !p.isHidden && (
                          <StatusBadge variant="available" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/products/${p.id}`}>تعديل</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-teal-50 md:hidden">
            {products.map((p) => (
              <li key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{p.nameAr}</p>
                    <p className="text-xs text-teal-600">
                      {p.category.nameAr} — ${p.priceUsd.toFixed(2)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {!p.inStock && <StatusBadge variant="out" />}
                      {p.isHidden && <StatusBadge variant="hidden" />}
                      {!p.isActive && <StatusBadge variant="inactive" />}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/products/${p.id}`}>تعديل</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-teal-50 px-4 py-2 text-xs text-teal-600">
            {products.length} منتج
          </p>
        </div>
      )}
    </div>
  );
}
