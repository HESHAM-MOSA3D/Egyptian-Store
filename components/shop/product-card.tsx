"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Plus, Check } from "lucide-react";
import { ProductImage } from "@/components/shop/product-image";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { StatusBadge, stockStateToVariant } from "@/components/ui/status-badge";
import type { PublicProduct } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: PublicProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const image = product.images[0];
  const isGrayed = product.stockState === "grayed";
  const isDisabled = product.stockState === "disable";
  const canQuickAdd =
    !product.hasVariants &&
    product.stockState === "available" &&
    product.inStock &&
    product.stockQty > 0;

  const statusVariant = stockStateToVariant(
    product.stockState,
    product.inStock
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canQuickAdd) return;
    addItem(
      {
        productId: product.id,
        productName: product.nameAr,
        image,
        unitPriceUsd: product.priceUsd,
        maxStock: product.stockQty,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article
      className={cn(
        "surface-card flex h-full flex-col overflow-hidden transition",
        isGrayed && "opacity-80",
        !isGrayed && !isDisabled && "hover:shadow-card hover:border-teal-200/90"
      )}
    >
      <Link href={`/products/${product.id}`} className="relative block shrink-0">
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-square",
            isGrayed && "grayscale-[0.3]"
          )}
        >
          <ProductImage
            src={image}
            alt={product.nameAr}
            productId={product.id}
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
          />
          {product.categoryName && (
            <span className="absolute top-2 right-2 max-w-[85%] truncate rounded-lg bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-teal-800 shadow-soft backdrop-blur-sm">
              {product.categoryName}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <Link href={`/products/${product.id}`} className="group/title min-w-0">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-text group-hover/title:text-primary-dark">
            {product.nameAr}
          </h3>
        </Link>

        {product.descriptionAr && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-teal-700/90">
            {product.descriptionAr}
          </p>
        )}

        <div className="mt-2">
          <PriceDisplay label={product.priceLabel} size="md" />
        </div>

        <div className="mt-2">
          <StatusBadge variant={statusVariant} />
        </div>

        {product.hasVariants && product.stockState === "available" && (
          <p className="mt-1.5 text-[10px] text-teal-600">
            خيارات متعددة — افتح التفاصيل
          </p>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-3.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 w-full text-xs"
          >
            <Link href={`/products/${product.id}`} className="gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              عرض التفاصيل
            </Link>
          </Button>

          {canQuickAdd ? (
            <Button
              type="button"
              size="sm"
              className="h-10 w-full gap-1.5 text-xs"
              onClick={handleQuickAdd}
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  تمت الإضافة
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  إضافة سريعة
                </>
              )}
            </Button>
          ) : product.hasVariants ? null : (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-10 w-full text-xs text-teal-500"
              disabled
            >
              {isDisabled || isGrayed ? "الطلب غير متاح" : "نفد المخزون"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
