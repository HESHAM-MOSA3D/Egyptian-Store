"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Percent,
  Settings,
  FileSpreadsheet,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: FolderTree },
  { href: "/admin/bulk-pricing", label: "تسعير جماعي", icon: Percent },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
  { href: "/admin/import-export", label: "استيراد/تصدير", icon: FileSpreadsheet },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (href === "/admin/products/bulk" && pathname.startsWith("/admin/bulk-pricing"))
    return true;
  if (href === "/admin/import" && pathname.startsWith("/admin/import-export"))
    return true;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  onNavigate,
  vertical,
}: {
  pathname: string;
  onNavigate?: () => void;
  vertical?: boolean;
}) {
  return (
    <>
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition min-h-11",
              vertical ? "w-full" : "shrink-0",
              active
                ? "bg-primary text-white shadow-sm"
                : "text-text hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-teal-100 bg-white/98 px-4 py-3 shadow-soft md:hidden">
        <div>
          <p className="text-xs text-teal-600">لوحة الإدارة</p>
          <p className="font-bold text-primary-dark">B2B Wholesale</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100"
          aria-label="فتح القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-teal-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 flex w-[min(100%,18rem)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <span className="font-bold">القائمة</span>
              <button type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              <NavLinks
                pathname={pathname}
                vertical
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>
            <div className="space-y-2 border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
              <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/shop" target="_blank">
                  <Store className="h-4 w-4" />
                  عرض المتجر
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-l border-teal-100 bg-white shadow-soft md:flex">
        <div className="border-b border-teal-50 p-5">
          <p className="text-xs font-medium text-teal-600">B2B Wholesale</p>
          <p className="text-lg font-bold text-primary-dark">لوحة الإدارة</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <NavLinks pathname={pathname} vertical />
        </nav>
        <div className="space-y-2 border-t border-teal-50 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-teal-800"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
          <Button asChild variant="outline" className="w-full justify-start gap-2">
            <Link href="/shop" target="_blank">
              <Store className="h-4 w-4" />
              عرض المتجر
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-teal-100 bg-white px-1 py-1 pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="تنقل الإدارة"
      >
        {links.slice(0, 5).map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium",
                active ? "text-primary" : "text-teal-600"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
