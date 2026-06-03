"use client";

import { useEffect, useState } from "react";
import { FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmpty } from "@/components/admin/admin-empty";

type Category = {
  id: string;
  nameAr: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    nameAr: "",
    slug: "",
    sortOrder: 0,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () =>
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (editingId) {
      await fetch(`/api/admin/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ nameAr: "", slug: "", sortOrder: 0, isActive: true });
    setEditingId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف التصنيف؟")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "فشل الحذف");
      return;
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="التصنيفات"
        description="أقسام الكتالوج وترتيب العرض"
      />
      <Card className="mb-6 border-teal-100">
        <CardHeader>
          <CardTitle>{editingId ? "تعديل" : "إضافة تصنيف"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>الاسم بالعربية</Label>
            <Input
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            />
          </div>
          <div>
            <Label>المعرّف (slug)</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div>
            <Label>الترتيب</Label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              نشط
            </label>
          </div>
          <Button onClick={save}>{editingId ? "حفظ" : "إضافة"}</Button>
        </CardContent>
      </Card>
      {categories.length === 0 ? (
        <AdminEmpty
          icon={FolderTree}
          title="لا توجد تصنيفات"
          description="أضف تصنيفاً لربط المنتجات به"
        />
      ) : (
      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-3"
          >
            <div>
              <span className="font-medium">{c.nameAr}</span>
              <span className="mr-2 text-xs text-teal-600">({c.slug})</span>
              {!c.isActive && (
                <span className="text-xs text-red-500">غير نشط</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(c.id);
                  setForm({
                    nameAr: c.nameAr,
                    slug: c.slug,
                    sortOrder: c.sortOrder,
                    isActive: c.isActive,
                  });
                }}
              >
                تعديل
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove(c.id)}>
                حذف
              </Button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}
