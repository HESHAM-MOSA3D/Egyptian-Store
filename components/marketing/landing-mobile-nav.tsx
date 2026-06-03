"use client";

const links = [
  { href: "#features", label: "المميزات" },
  { href: "#categories", label: "التصنيفات" },
  { href: "#how", label: "كيف يعمل" },
  { href: "#featured", label: "منتجات" },
] as const;

export function LandingMobileNav() {
  return (
    <nav
      className="border-b border-teal-50 bg-white/95 md:hidden"
      aria-label="أقسام الصفحة"
    >
      <ul className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-hide">
        {links.map(({ href, label }) => (
          <li key={href} className="shrink-0">
            <a
              href={href}
              className="inline-flex min-h-10 items-center rounded-full border border-teal-100 bg-white px-4 text-xs font-semibold text-teal-800 shadow-soft hover:border-teal-200 hover:bg-teal-50/50"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
