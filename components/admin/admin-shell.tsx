"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-teal-50/25 via-white to-slate-50/80 md:flex-row-reverse"
      dir="rtl"
    >
      <AdminNav />
      <main className="flex-1 p-4 pb-24 md:max-h-screen md:overflow-y-auto md:p-8 md:pb-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
