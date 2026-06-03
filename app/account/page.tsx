"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerAuth } from "@/hooks/use-customer-auth";
import { useCustomerStore } from "@/store/customer";
import { validatePhone } from "@/store/customer";
import { ClipboardList, LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { customer, loading, refresh } = useCustomerAuth();
  const customerStore = useCustomerStore();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      });
    }
  }, [customer]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) {
      setError("رقم الهاتف غير صالح");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/customer/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "تعذّر الحفظ");
      return;
    }
    if (data.customer) {
      customerStore.setField("name", data.customer.name);
      customerStore.setField("phone", data.customer.phone);
      customerStore.setField("address", data.customer.address);
    }
    setSaved(true);
    refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = async () => {
    await fetch("/api/customer/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <AuthShell title="حسابي">
        <p className="text-sm text-teal-600">جاري التحميل...</p>
      </AuthShell>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <AuthShell
      title="حسابي"
      subtitle="إدارة بياناتك لتعبئة الطلبات تلقائياً"
    >
      <form onSubmit={save} className="space-y-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            className="text-left"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="address">العنوان</Label>
          <Textarea
            id="address"
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && (
          <p className="text-sm font-medium text-primary">تم حفظ التغييرات</p>
        )}
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </form>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-dashed border-teal-200 bg-muted/40 p-4">
        <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-teal-700">
          سجل الطلبات السابقة يمكن إضافته لاحقاً في نسخة الإنتاج — حالياً
          الطلبات تتم عبر واتساب فقط.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button asChild variant="outline">
          <Link href="/shop">متابعة التسوق</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="gap-2 text-teal-800"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </AuthShell>
  );
}
