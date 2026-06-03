"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertMessage } from "@/components/ui/alert-message";
import { useCustomerStore } from "@/store/customer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerStore = useCustomerStore();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const syncCheckoutFields = (profile: {
    name: string;
    phone: string;
    address: string;
  }) => {
    customerStore.setField("name", profile.name);
    customerStore.setField("phone", profile.phone);
    customerStore.setField("address", profile.address);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone, password, remember }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "تعذّر تسجيل الدخول");
      return;
    }
    if (remember && data.customer) {
      syncCheckoutFields(data.customer);
    }
    const from = searchParams.get("from") || "/shop";
    router.push(from);
    router.refresh();
  };

  return (
    <AuthShell
      title="تسجيل الدخول"
      subtitle="ادخل برقم هاتفك وكلمة المرور للوصول إلى حسابك التجاري"
      footer={
        <p className="text-center text-sm text-teal-700">
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            className="font-semibold text-primary underline"
          >
            إنشاء حساب
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            className="text-left"
            placeholder="9639xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setRemember(v === true)}
          />
          <Label htmlFor="remember" className="cursor-pointer text-sm leading-snug">
            تذكّر بياناتي للطلبات القادمة (الاسم، الهاتف، العنوان في هذا
            الجهاز)
          </Label>
        </div>
        {error && <AlertMessage variant="error">{error}</AlertMessage>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "جاري الدخول..." : "دخول"}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-teal-500">
        يمكنك إتمام الطلب كضيف دون تسجيل من صفحة السلة
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-teal-600">
          جاري التحميل...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
