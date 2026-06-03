"use client";

import { cn } from "@/lib/utils";

export function CategoryChip({
  label,
  selected,
  onClick,
  className,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={selected}
      className={cn(
        "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition min-h-10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        selected
          ? "bg-primary text-white shadow-soft"
          : "border border-teal-100 bg-white text-teal-800 hover:border-teal-200 hover:bg-teal-50/50",
        className
      )}
    >
      {label}
    </button>
  );
}

export function CategoryChipRow({
  children,
  className,
  "aria-label": ariaLabel = "تصفية التصنيفات",
}: {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-hide",
        className
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
