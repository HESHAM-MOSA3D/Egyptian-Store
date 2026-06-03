"use client";

import { QtyStepper } from "@/components/shop/qty-stepper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PublicVariant } from "@/lib/types";
import { cn, formatSyp } from "@/lib/utils";

export function VariantPicker({
  variants,
  variantQtys,
  canOrder,
  onQtyChange,
  onSetAll,
  onClear,
}: {
  variants: PublicVariant[];
  variantQtys: Record<string, number>;
  canOrder: boolean;
  onQtyChange: (variantId: string, qty: number) => void;
  onSetAll: (qty: number) => void;
  onClear: () => void;
}) {
  return (
    <section className="mt-6" aria-labelledby="variants-heading">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2
            id="variants-heading"
            className="text-lg font-bold text-primary-dark"
          >
            اختر المتغيرات والكميات
          </h2>
          <p className="mt-0.5 text-xs text-teal-600">
            يمكنك إضافة عدة خيارات في طلب واحد
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canOrder}
            onClick={() => onSetAll(1)}
          >
            +1 للكل
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canOrder}
            onClick={onClear}
          >
            مسح
          </Button>
        </div>
      </div>

      <div className="space-y-2 md:rounded-2xl md:border md:border-teal-100 md:overflow-hidden">
        {variants.map((variant, index) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            qty={variantQtys[variant.id] ?? 0}
            canOrder={canOrder}
            showDivider={index > 0}
            onChange={(n) => onQtyChange(variant.id, n)}
          />
        ))}
      </div>
    </section>
  );
}

function VariantCard({
  variant,
  qty,
  canOrder,
  showDivider,
  onChange,
}: {
  variant: PublicVariant;
  qty: number;
  canOrder: boolean;
  showDivider?: boolean;
  onChange: (n: number) => void;
}) {
  const stepperDisabled = !canOrder || !variant.inStock;
  const selected = qty > 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition md:rounded-none md:border-0 md:border-teal-100",
        showDivider && "md:border-t",
        selected
          ? "border-primary bg-gradient-to-l from-teal-50/80 to-white shadow-sm"
          : "border-teal-100 bg-white",
        !variant.inStock && "opacity-70"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-bold text-text">{variant.labelAr}</p>
            {!variant.inStock && (
              <Badge className="bg-gray-100 text-gray-600 text-[10px]">
                غير متوفر
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm font-bold text-primary">
            {formatSyp(variant.priceSyp)}
          </p>
          <p className="mt-0.5 text-xs text-teal-600">
            {variant.inStock
              ? `المخزون: ${variant.stockQty} قطعة`
              : "لا يمكن الطلب حالياً"}
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
          <span className="text-xs font-medium text-teal-700 sm:hidden">
            الكمية
          </span>
          <QtyStepper
            value={qty}
            max={variant.stockQty}
            disabled={stepperDisabled}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
