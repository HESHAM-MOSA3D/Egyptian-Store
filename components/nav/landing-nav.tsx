import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingMobileNav } from "@/components/marketing/landing-mobile-nav";

const desktopLinks = [
  { href: "#features", label: "المميزات" },
  { href: "#categories", label: "التصنيفات" },
  { href: "#how", label: "كيف يعمل" },
  { href: "#featured", label: "منتجات مميزة" },
] as const;

export function LandingNav({ storeName }: { storeName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-teal-100/80 bg-white/95 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <Link
          href="/"
          className="min-w-0 truncate text-base font-bold text-primary-dark sm:text-lg"
        >
          {storeName}
        </Link>
        <nav
          className="hidden items-center gap-6 text-sm font-medium text-teal-800 md:flex"
          aria-label="أقسام الصفحة"
        >
          {desktopLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="transition hover:text-primary"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">دخول</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/shop">الكتالوج</Link>
          </Button>
        </div>
      </div>
      <LandingMobileNav />
    </header>
  );
}
