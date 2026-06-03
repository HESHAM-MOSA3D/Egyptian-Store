import { cn } from "@/lib/utils";

export type StatusVariant =
  | "available"
  | "out"
  | "grayed"
  | "disabled"
  | "hidden"
  | "inactive"
  | "success"
  | "warning"
  | "neutral";

const variants: Record<StatusVariant, string> = {
  available: "bg-teal-50 text-teal-800 ring-teal-100",
  out: "bg-red-50 text-red-700 ring-red-100",
  grayed: "bg-gray-100 text-gray-700 ring-gray-100",
  disabled: "bg-amber-50 text-amber-800 ring-amber-100",
  hidden: "bg-teal-100/80 text-teal-800 ring-teal-100",
  inactive: "bg-gray-100 text-gray-600 ring-gray-100",
  success: "bg-teal-50 text-teal-800 ring-teal-100",
  warning: "bg-amber-50 text-amber-800 ring-amber-100",
  neutral: "bg-muted text-teal-800 ring-teal-50",
};

const defaultLabels: Partial<Record<StatusVariant, string>> = {
  available: "متوفر",
  out: "نفد المخزون",
  grayed: "غير متوفر حاليًا",
  disabled: "غير متاح للطلب",
  hidden: "مخفي",
  inactive: "غير نشط",
};

export function StatusBadge({
  variant,
  children,
  className,
}: {
  variant: StatusVariant;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset sm:text-xs",
        variants[variant],
        className
      )}
    >
      {children ?? defaultLabels[variant]}
    </span>
  );
}

/** Map shop product stock state to badge variant */
export function stockStateToVariant(
  stockState: string,
  inStock: boolean
): StatusVariant {
  if (stockState === "grayed") return "grayed";
  if (stockState === "disable") return "disabled";
  if (inStock) return "available";
  return "out";
}
