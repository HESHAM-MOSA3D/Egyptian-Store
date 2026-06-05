"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ExternalLink,
  EyeOff,
  FolderTree,
  Package,
  Percent,
  Settings,
  FileSpreadsheet,
  Phone,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { cn } from "@/lib/utils";

type Stats = {
  productCount: number;
  activeCount: number;
  hiddenCount: number;
  outOfStockCount: number;
  categoryCount: number;
  usdToSypRate: number;
  roundingLabel: string;
  whatsappNumber: string;
  storeNameAr: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const quickLinks = [
    {
      href: "/admin/products/new",
      label: "منتج جديد",
      desc: "إضافة منتج للكتالوج",
      icon: Package,
      accent: "bg-teal-600",
    },
    {
      href: "/admin/bulk-pricing",
      label: "تسعير جماعي",
      desc: "تعديل أسعار بنسبة %",
      icon: Percent,
      accent: "bg-teal-700",
    },
    {
      href: "/admin/import-export",
      label: "Excel",
      desc: "استيراد وتصدير",
      icon: FileSpreadsheet,
      accent: "bg-primary-dark",
    },
    {
      href: "/admin/settings",
      label: "الإعدادات",
      desc: "صرف، واتساب، المتجر",
      icon: Settings,
      accent: "bg-teal-500",
    },
  ];

  const navLinks = [
    { href: "/admin/products", label: "إدارة المنتجات", icon: Package },
    { href: "/admin/categories", label: "التصنيفات", icon: FolderTree },
    { href: "/admin/bulk-pricing", label: "تسعير جماعي", icon: Percent },
    { href: "/admin/settings", label: "الإعدادات", icon: Settings },
    { href: "/admin/import-export", label: "استيراد وتصدير Excel", icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="لوحة التحكم"
        description={
          stats
            ? `${stats.storeNameAr} — إدارة الكتالوج والأسعار بالدولار وطلبات واتساب`
            : "جاري التحميل..."
        }
        action={
          <Button asChild variant="outline" className="gap-2">
            <Link href="/shop" target="_blank">
              <ExternalLink className="h-4 w-4" />
              عرض المتجر
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="إجمالي المنتجات"
          value={stats?.productCount ?? "—"}
          hint="كل السجلات"
          icon={Package}
        />
        <AdminStatCard
          label="منتجات نشطة"
          value={stats?.activeCount ?? "—"}
          hint="ظاهرة ونشطة"
          icon={CheckCircle2}
          accent="success"
        />
        <AdminStatCard
          label="نفد المخزون"
          value={stats?.outOfStockCount ?? "—"}
          hint="تحتاج متابعة"
          icon={AlertTriangle}
          accent="warning"
        />
        <AdminStatCard
          label="منتجات مخفية"
          value={stats?.hiddenCount ?? "—"}
          icon={EyeOff}
          accent="muted"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="التصنيفات"
          value={stats?.categoryCount ?? "—"}
          icon={FolderTree}
        />
        <AdminStatCard
          label="سعر الصرف"
          value={
            stats
              ? `${stats.usdToSypRate.toLocaleString("ar-EG")} ج.م`
              : "—"
          }
          hint="لكل 1 USD"
          icon={DollarSign}
        />
        <AdminStatCard
          label="تقريب الأسعار"
          value={stats?.roundingLabel ?? "—"}
          icon={Settings}
        />
        <AdminStatCard
          label="واتساب الطلبات"
          value={stats?.whatsappNumber ?? "—"}
          hint="رقم الاستلام"
          icon={Phone}
        />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-primary-dark">إجراءات سريعة</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ href, label, desc, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group surface-card p-4 transition hover:shadow-card"
            >
              <div
                className={cn(
                  "mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white",
                  accent
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-bold text-text group-hover:text-primary">{label}</p>
              <p className="mt-1 text-xs text-teal-600">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-primary-dark">جميع الأقسام</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 rounded-xl border border-teal-100 bg-white px-4 py-3 shadow-soft transition hover:bg-muted/80"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
