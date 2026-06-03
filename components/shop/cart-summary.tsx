import { CART_PRICE_NOTE } from "@/lib/whatsapp";
import { formatSyp } from "@/lib/utils";
import { Info } from "lucide-react";

export function CartSummary({
  totalSyp,
  itemCount,
  compact,
}: {
  totalSyp: number;
  itemCount: number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-teal-700">الإجمالي التقديري</p>
          {!compact && (
            <p className="text-xs text-teal-600">
              {itemCount} {itemCount === 1 ? "قطعة" : "قطع"} في السلة
            </p>
          )}
        </div>
        <p className="text-xl font-bold text-primary sm:text-2xl">
          {formatSyp(totalSyp)}
        </p>
      </div>
      <p className="flex items-start gap-2 rounded-xl bg-teal-50/80 px-3 py-2 text-[11px] leading-relaxed text-teal-800 sm:text-xs">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        {CART_PRICE_NOTE}
      </p>
    </div>
  );
}
