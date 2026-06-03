import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function AdminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "default" | "warning" | "success" | "muted";
}) {
  const accents = {
    default: "bg-white",
    warning: "bg-amber-50/80",
    success: "bg-teal-50/80",
    muted: "bg-gray-50/90",
  };

  const iconBg = {
    default: "bg-muted",
    warning: "bg-amber-100",
    success: "bg-teal-100",
    muted: "bg-gray-100",
  };

  return (
    <div className={cn("surface-card p-4 transition hover:shadow-card", accents[accent])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-teal-600">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-primary-dark">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-[11px] leading-snug text-teal-600">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            iconBg[accent]
          )}
        >
          <Icon className="h-5 w-5 text-primary" aria-hidden />
        </div>
      </div>
    </div>
  );
}
