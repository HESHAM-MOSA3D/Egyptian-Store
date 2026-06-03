"use client";

import { ProductImage } from "@/components/shop/product-image";
import { QtyStepper } from "@/components/shop/qty-stepper";
import type { CartItem } from "@/lib/types";
import { PriceDisplay } from "@/components/ui/price-display";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export type PricedCartLine = CartItem & {
  unitSyp: number;
  lineTotal: number;
};

export function CartLineItem({
  line,
  onUpdateQuantity,
  onRemove,
  compact,
}: {
  line: PricedCartLine;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex gap-3 bg-white",
        compact
          ? "rounded-xl border border-teal-50 p-2.5"
          : "surface-card p-3.5"
      )}
    >
      <div
        className={
          compact
            ? "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
            : "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-24"
        }
      >
        <ProductImage
          src={line.image}
          alt={line.productName}
          productId={line.productId}
          sizes={compact ? "64px" : "96px"}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-text line-clamp-2">
              {line.productName}
            </p>
            {line.variantLabel && (
              <p className="mt-0.5 text-xs font-medium text-teal-600">
                الخيار: {line.variantLabel}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-lg p-2 text-red-500 transition hover:bg-red-50"
            aria-label="حذف من السلة"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-teal-700">
          <span className="flex items-center gap-1">
            سعر القطعة:
            <PriceDisplay amountSyp={line.unitSyp} size="sm" />
          </span>
          <span>الكمية: {line.quantity}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <QtyStepper
            value={line.quantity}
            max={line.maxStock}
            onChange={onUpdateQuantity}
          />
          <div className="text-left">
            <p className="text-[10px] text-teal-600">إجمالي السطر</p>
            <PriceDisplay amountSyp={line.lineTotal} size="sm" />
          </div>
        </div>
      </div>
    </li>
  );
}
