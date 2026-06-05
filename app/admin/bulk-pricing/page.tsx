"use client";

import { useEffect, useState } from "react";
import { Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

type Category = { id: string; nameAr: string };

type PreviewRow = {
  productId: string;
  productNameAr: string;
  variantLabel: string | null;
  oldPriceUsd: number;
  newPriceUsd: number;
  priceSyp: number;
};

export default function BulkPricingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [percent, setPercent] = useState(10);
  const [scope, setScope] = useState<"all" | "category">("all");
  const [categoryId, setCategoryId] = useState("");
  const [preview, setPreview] = useState<{
    affected: number;
    rowCount: number;
    rows: PreviewRow[];
  } | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
  }, []);

  const body = () => ({
    percent,
    ...(scope === "category" && categoryId ? { categoryId } : {}),
  });

  const runPreview = async () => {
    const res = await fetch("/api/admin/products/bulk-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body(), preview: true }),
    });
    const data = await res.json();
    setPreview(data);
  };

  const apply = async () => {
    if (!preview) return;
    const msg =
      scope === "category"
        ? `تطبيق ${percent}% على تصنيف محدد (${preview.affected} منتج، ${preview.rowCount} سطر سعر)؟`
        : `تطبيق ${percent}% على كل المنتجات (${preview.affected} منتج)؟`;
    if (!confirm(msg)) return;
    setApplying(true);
    try {
      await fetch("/api/admin/products/bulk-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body()),
      });
      alert("تم تحديث الأسعار");
      setPreview(null);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="تسعير جماعي"
        description="زيادة أو خفض الأسعار بالدولار مع معاينة السعر بالجنيه بعد الصرف والتقريب"
      />

      <Card className="mb-6 max-w-xl border-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Percent className="h-5 w-5 text-primary" />
            نسبة التغيير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>النسبة % (مثال: 10 أو -5)</Label>
            <Input
              type="number"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              كل المنتجات
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={scope === "category"}
                onChange={() => setScope("category")}
              />
              تصنيف محدد
            </label>
            {scope === "category" && (
              <select
                className="h-11 w-full rounded-lg border border-teal-100 px-3"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">اختر تصنيفاً</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={runPreview}>
              معاينة الأسعار
            </Button>
            <Button
              onClick={apply}
              disabled={!preview || applying || (scope === "category" && !categoryId)}
            >
              {applying ? "جاري التطبيق..." : "تأكيد التطبيق"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {preview && (
        <Card className="border-teal-100">
          <CardHeader>
            <CardTitle className="text-base">
              معاينة: {preview.affected} منتج — {preview.rowCount} سطر سعر
              {preview.rows.length < preview.rowCount &&
                ` (عرض أول ${preview.rows.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[32rem] text-sm">
              <thead>
                <tr className="border-b bg-teal-50/50 text-right text-teal-800">
                  <th className="px-3 py-2">المنتج</th>
                  <th className="px-3 py-2">المتغير</th>
                  <th className="px-3 py-2">USD قديم</th>
                  <th className="px-3 py-2">USD جديد</th>
                  <th className="px-3 py-2">ج.م للعميل</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={`${row.productId}-${i}`} className="border-b last:border-0">
                    <td className="px-3 py-2">{row.productNameAr}</td>
                    <td className="px-3 py-2 text-teal-600">
                      {row.variantLabel ?? "—"}
                    </td>
                    <td className="px-3 py-2">${row.oldPriceUsd.toFixed(2)}</td>
                    <td className="px-3 py-2 font-medium text-primary">
                      ${row.newPriceUsd.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      {row.priceSyp.toLocaleString("ar-EG")} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
