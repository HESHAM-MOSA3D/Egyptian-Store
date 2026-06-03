import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const config = {
  error: {
    icon: AlertCircle,
    wrap: "border-red-200 bg-red-50 text-red-800",
    iconColor: "text-red-600",
  },
  success: {
    icon: CheckCircle2,
    wrap: "border-teal-200 bg-teal-50 text-teal-900",
    iconColor: "text-primary",
  },
  info: {
    icon: Info,
    wrap: "border-teal-100 bg-muted text-teal-800",
    iconColor: "text-primary",
  },
} as const;

export function AlertMessage({
  variant,
  children,
  className,
}: {
  variant: keyof typeof config;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, wrap, iconColor } = config[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-relaxed",
        wrap,
        className
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColor)} aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
