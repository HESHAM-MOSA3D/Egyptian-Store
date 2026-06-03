"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartItemCount } from "@/hooks/use-cart-hydrated";
import { useCustomerAuth } from "@/hooks/use-customer-auth";

const tabs = [
  { href: "/", label: "الرئيسية", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/shop",
    label: "المتجر",
    icon: LayoutGrid,
    match: (p: string) => p === "/shop" || p.startsWith("/products"),
  },
  {
    href: "/cart",
    label: "السلة",
    icon: ShoppingCart,
    match: (p: string) => p === "/cart" || p === "/checkout",
  },
  {
    href: "/login",
    label: "حسابي",
    icon: User,
    match: (p: string) =>
      p === "/login" || p === "/register" || p === "/account",
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const count = useCartItemCount();
  const { isLoggedIn } = useCustomerAuth();
  const accountHref = isLoggedIn ? "/account" : "/login";

  if (pathname === "/" || pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-teal-100 bg-white/98 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-4px_rgb(13_148_136/0.08)] backdrop-blur-md md:hidden"
      aria-label="التنقل السفلي"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 py-0.5">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const linkHref = label === "حسابي" ? accountHref : href;
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={linkHref}
                className={cn(
                  "relative flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold",
                  active ? "text-primary" : "text-teal-600"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span>{label}</span>
                {label === "السلة" && count > 0 && (
                  <span className="absolute top-0.5 left-1/2 flex h-4 min-w-4 -translate-x-1/2 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
