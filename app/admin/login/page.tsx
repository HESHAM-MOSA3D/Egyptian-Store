"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertMessage } from "@/components/ui/alert-message";
import { AuthNav } from "@/components/nav/auth-nav";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("بيانات الدخول غير صحيحة");
      return;
    }
    const from = searchParams.get("from") || "/admin";
    router.push(from);
  };

  return (
    <Card className="w-full max-w-md shadow-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-primary">
          <Shield className="h-7 w-7" aria-hidden />
        </div>
        <CardTitle className="text-xl">تسجيل دخول الإدارة</CardTitle>
        <p className="mt-1 text-sm text-teal-600">
          إدارة المنتجات، الأسعار بالدولار، والإعدادات
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>اسم المستخدم</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <Label>كلمة المرور</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <AlertMessage variant="error">{error}</AlertMessage>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-teal-700">
          <Link href="/" className="font-medium text-primary hover:underline">
            العودة للموقع
          </Link>
          <span className="mx-2 text-teal-300">·</span>
          <Link href="/shop" className="font-medium text-primary hover:underline">
            المتجر
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="page-gradient flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-6 w-full max-w-md">
        <AuthNav />
      </div>
      <Suspense
        fallback={
          <p className="text-sm text-teal-600">جاري التحميل...</p>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
