import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const isSm = size === "sm";

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-teal-200/90 bg-white text-center shadow-soft",
        isSm ? "px-4 py-10" : "px-6 py-14",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-muted text-primary",
          isSm ? "h-12 w-12" : "h-14 w-14"
        )}
      >
        <Icon
          className={cn(isSm ? "h-6 w-6" : "h-7 w-7")}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <h3
        className={cn(
          "mt-4 font-bold text-primary-dark",
          isSm ? "text-base" : "text-lg"
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "mt-2 max-w-sm leading-relaxed text-teal-700",
            isSm ? "text-xs" : "text-sm"
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>
      )}
    </div>
  );
}
