"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert-message";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerStore } from "@/store/customer";
import { validatePhone } from "@/store/customer";

export default function RegisterPage() {
  const router = useRouter();
  const customerStore = useCustomerStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) {
      setError("رقم الهاتف غير صالح");
      return;
    }
    if (form.password.length < 6) {
      setError("كلمة المرور 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    setError("");
    const res = await fetch("/api/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
        remember: true,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "تعذّر إنشاء الحساب");
      return;
    }

    if (data.customer) {
      customerStore.setField("name", data.customer.name);
      customerStore.setField("phone", data.customer.phone);
      customerStore.setField("address", data.customer.address);
    }
    router.push("/shop");
    router.refresh();
  };

  return (
    <AuthShell
      title="حساب تجاري جديد"
      subtitle="تسجيل سريع — دقيقة واحدة لتسهيل طلباتك القادمة"
      footer={
        <p className="text-center text-sm text-teal-700">
          لديك حساب؟{" "}
          <Link href="/login" className="font-semibold text-primary underline">
            تسجيل الدخول
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input
            id="name"
            autoComplete="name"
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
            autoComplete="tel"
            dir="ltr"
            className="text-left"
            placeholder="9639xxxxxxxx"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="address">العنوان</Label>
          <Textarea
            id="address"
            rows={2}
            autoComplete="street-address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <p className="mt-1 text-xs text-teal-600">6 أحرف على الأقل</p>
        </div>
        {error && <AlertMessage variant="error">{error}</AlertMessage>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
        </Button>
      </form>
    </AuthShell>
  );
}
