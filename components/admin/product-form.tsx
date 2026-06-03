"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { usdToSyp } from "@/lib/pricing";

type VariantRow = {
  labelAr: string;
  sku: string;
  priceUsd: string;
  stockQty: number;
  isActive: boolean;
};

type Category = { id: string; nameAr: string };

const defaultProduct = {
  nameAr: "",
  descriptionAr: "",
  categoryId: "",
  images: "https://picsum.photos/seed/new-product/400/400",
  priceUsd: 10,
  stockQty: 50,
  hasVariants: false,
  isActive: true,
  isHidden: false,
  outOfStockBehavior: "GRAYED",
};

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState({
    usdToSypRate: 15000,
    roundingMode: "NEAREST_1000" as const,
  });
  const [form, setForm] = useState(defaultProduct);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [loading, setLoading] = useState(!!productId);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
    ]).then(([cats, sett]) => {
      setCategories(cats);
      setSettings({
        usdToSypRate: sett.usdToSypRate,
        roundingMode: sett.roundingMode,
      });
      if (!productId && cats[0]) {
        setForm((f) => ({ ...f, categoryId: cats[0].id }));
      }
    });
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          nameAr: p.nameAr,
          descriptionAr: p.descriptionAr ?? "",
          categoryId: p.categoryId,
          images: (p.images as string[]).join("\n"),
          priceUsd: p.priceUsd,
          stockQty: p.stockQty,
          hasVariants: p.hasVariants,
          isActive: p.isActive,
          isHidden: p.isHidden,
          outOfStockBehavior: p.outOfStockBehavior,
        });
        setVariants(
          p.variants.map(
            (v: {
              labelAr: string;
              sku: string | null;
              priceUsd: number | null;
              stockQty: number;
              isActive: boolean;
            }) => ({
              labelAr: v.labelAr,
              sku: v.sku ?? "",
              priceUsd: v.priceUsd?.toString() ?? "",
              stockQty: v.stockQty,
              isActive: v.isActive,
            })
          )
        );
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const previewSyp = usdToSyp(
    form.priceUsd,
    settings.usdToSypRate,
    settings.roundingMode
  );

  const save = async () => {
    const images = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const body = {
      ...form,
      images,
      variants: form.hasVariants
        ? variants.map((v) => ({
            labelAr: v.labelAr,
            sku: v.sku || null,
            priceUsd: v.priceUsd ? Number(v.priceUsd) : null,
            stockQty: v.stockQty,
            isActive: v.isActive,
          }))
        : [],
    };

    const url = productId
      ? `/api/admin/products/${productId}`
      : "/api/admin/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) router.push("/admin/products");
  };

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <Label>الاسم</Label>
        <Input
          value={form.nameAr}
          onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
        />
      </div>
      <div>
        <Label>الوصف</Label>
        <Textarea
          value={form.descriptionAr}
          onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
        />
      </div>
      <div>
        <Label>التصنيف</Label>
        <Select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label>روابط الصور (سطر لكل صورة)</Label>
        <Textarea
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>السعر USD</Label>
          <Input
            type="number"
            step="0.01"
            value={form.priceUsd}
            onChange={(e) =>
              setForm({ ...form, priceUsd: Number(e.target.value) })
            }
          />
          <p className="mt-1 text-sm text-primary">
            معاينة: {previewSyp.toLocaleString("ar-SY")} ل.س
          </p>
        </div>
        {!form.hasVariants && (
          <div>
            <Label>المخزون</Label>
            <Input
              type="number"
              value={form.stockQty}
              onChange={(e) =>
                setForm({ ...form, stockQty: Number(e.target.value) })
              }
            />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.hasVariants}
            onChange={(e) => setForm({ ...form, hasVariants: e.target.checked })}
          />
          له متغيرات
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          نشط
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isHidden}
            onChange={(e) => setForm({ ...form, isHidden: e.target.checked })}
          />
          مخفي من المتجر
        </label>
      </div>
      <div>
        <Label>سلوك عند نفاد المخزون</Label>
        <Select
          value={form.outOfStockBehavior}
          onChange={(e) =>
            setForm({ ...form, outOfStockBehavior: e.target.value })
          }
        >
          <option value="HIDE">إخفاء</option>
          <option value="DISABLE">تعطيل</option>
          <option value="GRAYED">رمادي</option>
        </Select>
      </div>

      {form.hasVariants && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">المتغيرات</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setVariants([
                  ...variants,
                  {
                    labelAr: "",
                    sku: "",
                    priceUsd: "",
                    stockQty: 0,
                    isActive: true,
                  },
                ])
              }
            >
              + متغير
            </Button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="grid gap-2 rounded border p-3 sm:grid-cols-2">
              <Input
                placeholder="التسمية"
                value={v.labelAr}
                onChange={(e) => {
                  const next = [...variants];
                  next[i] = { ...v, labelAr: e.target.value };
                  setVariants(next);
                }}
              />
              <Input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => {
                  const next = [...variants];
                  next[i] = { ...v, sku: e.target.value };
                  setVariants(next);
                }}
              />
              <Input
                type="number"
                placeholder="سعر USD اختياري"
                value={v.priceUsd}
                onChange={(e) => {
                  const next = [...variants];
                  next[i] = { ...v, priceUsd: e.target.value };
                  setVariants(next);
                }}
              />
              <Input
                type="number"
                placeholder="مخزون"
                value={v.stockQty}
                onChange={(e) => {
                  const next = [...variants];
                  next[i] = { ...v, stockQty: Number(e.target.value) };
                  setVariants(next);
                }}
              />
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={v.isActive}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i] = { ...v, isActive: e.target.checked };
                    setVariants(next);
                  }}
                />
                متغير نشط
              </label>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setVariants(variants.filter((_, j) => j !== i))}
              >
                حذف
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={save}>حفظ</Button>
        <Button variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
