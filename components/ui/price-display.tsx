import { formatSyp } from "@/lib/utils";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg sm:text-xl",
} as const;

export function PriceDisplay({
  label,
  amountSyp,
  size = "md",
  subdued = false,
  className,
}: {
  /** Pre-formatted price string (e.g. from API) */
  label?: string;
  /** Raw SYP amount to format */
  amountSyp?: number;
  size?: keyof typeof sizes;
  subdued?: boolean;
  className?: string;
}) {
  const text =
    label ?? (amountSyp != null ? formatSyp(amountSyp) : "");

  if (!text) return null;

  return (
    <p
      className={cn(
        "font-bold tabular-nums tracking-tight",
        subdued ? "text-teal-700" : "text-primary",
        sizes[size],
        className
      )}
    >
      {text}
    </p>
  );
}
