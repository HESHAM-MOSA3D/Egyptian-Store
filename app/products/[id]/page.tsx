"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, ShoppingCart } from "lucide-react";
import { ProductImage } from "@/components/shop/product-image";
import { productDemoImage } from "@/lib/product-images";
import { PageHeader } from "@/components/shop/page-header";
import { useCartDrawer } from "@/components/shop/cart-drawer-provider";
import { Toast } from "@/components/shop/toast";
import { VariantPicker } from "@/components/shop/variant-picker";
import { QtyStepper } from "@/components/shop/qty-stepper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PublicProduct } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { cn, formatSyp } from "@/lib/utils";

function availabilityBadge(product: PublicProduct) {
  if (product.stockState === "grayed") {
    return { label: "غير متوفر حاليًا", className: "bg-gray-100 text-gray-700" };
  }
  if (product.stockState === "disable") {
    return { label: "غير متاح للطلب", className: "bg-amber-50 text-amber-800" };
  }
  if (product.hasVariants) {
    const anyInStock = product.variants?.some((v) => v.inStock);
    if (anyInStock) {
      return { label: "بعض المتغيرات متوفرة", className: "bg-teal-50 text-teal-800" };
    }
    return { label: "غير متوفر حاليًا", className: "bg-gray-100 text-gray-700" };
  }
  if (product.inStock) {
    return { label: `متوفر — ${product.stockQty} قطعة`, className: "bg-teal-50 text-teal-800" };
  }
  return { label: "غير متوفر", className: "bg-gray-100 text-gray-700" };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const addBatch = useCartStore((s) => s.addBatch);

  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [variantQtys, setVariantQtys] = useState<Record<string, number>>({});
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const { openDrawer } = useCartDrawer();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data: { product: PublicProduct }) => {
        setProduct(data.product);
        const initial: Record<string, number> = {};
        data.product.variants?.forEach((v) => {
          initial[v.id] = 0;
        });
        setVariantQtys(initial);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const images = useMemo(
    () =>
      product?.images?.length
        ? product.images
        : product
          ? [productDemoImage(product.id)]
          : [],
    [product]
  );

  const variantSelection = useMemo(() => {
    if (!product?.variants) return { count: 0, totalSyp: 0, lines: [] as { label: string; q: number }[] };
    let count = 0;
    let totalSyp = 0;
    const lines: { label: string; q: number }[] = [];
    for (const v of product.variants) {
      const q = variantQtys[v.id] ?? 0;
      if (q > 0) {
        count += q;
        totalSyp += v.priceSyp * q;
        lines.push({ label: v.labelAr, q });
      }
    }
    return { count, totalSyp, lines };
  }, [product?.variants, variantQtys]);

  const showSuccess = useCallback(() => {
    setToast("تمت الإضافة إلى السلة بنجاح");
    openDrawer();
    setError("");
  }, [openDrawer]);

  const handleAddSimple = () => {
    if (!product || product.stockState !== "available") return;
    if (qty > product.stockQty) {
      setError("الكمية تتجاوز المخزون المتاح");
      return;
    }
    addItem(
      {
        productId: product.id,
        productName: product.nameAr,
        image: images[0],
        unitPriceUsd: product.priceUsd,
        maxStock: product.stockQty,
      },
      qty
    );
    showSuccess();
  };

  const handleAddVariants = () => {
    if (!product?.variants) return;
    try {
      const entries = product.variants
        .filter((v) => (variantQtys[v.id] ?? 0) > 0)
        .map((v) => {
          const q = variantQtys[v.id];
          if (q > v.stockQty) {
            throw new Error(`الكمية تتجاوز مخزون ${v.labelAr}`);
          }
          return {
            productId: product.id,
            variantId: v.id,
            productName: product.nameAr,
            variantLabel: v.labelAr,
            image: images[0],
            unitPriceUsd: v.priceUsd,
            quantity: q,
            maxStock: v.stockQty,
          };
        });

      if (!entries.length) return;

      addBatch(entries);
      showSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ");
    }
  };

  const setAllVariants = (quantity: number) => {
    if (!product?.variants) return;
    const next: Record<string, number> = {};
    product.variants.forEach((v) => {
      next[v.id] =
        v.inStock && product.stockState === "available"
          ? Math.min(quantity, v.stockQty)
          : 0;
    });
    setVariantQtys(next);
  };

  const clearVariants = () => {
    if (!product?.variants) return;
    const next: Record<string, number> = {};
    product.variants.forEach((v) => {
      next[v.id] = 0;
    });
    setVariantQtys(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="h-14 animate-pulse border-b bg-teal-50/50" />
        <div className="mx-auto max-w-4xl animate-pulse p-4 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="aspect-square rounded-2xl bg-teal-50" />
          <div className="mt-4 space-y-3 lg:mt-0">
            <div className="h-6 w-2/3 rounded bg-teal-50" />
            <div className="h-8 w-1/3 rounded bg-teal-100" />
            <div className="h-24 rounded-xl bg-teal-50" />
            <div className="h-32 rounded-xl bg-teal-50" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white p-8 pb-28 text-center">
        <p>المنتج غير موجود</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/shop">العودة للكتالوج</Link>
        </Button>
      </div>
    );
  }

  const canAdd = product.stockState === "available";
  const hasVariantSelection = variantSelection.count > 0;
  const status = availabilityBadge(product);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/20 pb-40">
      <PageHeader title={product.nameAr} backHref="/shop" />
      <Toast
        message={toast}
        visible={!!toast}
        onClose={() => setToast("")}
      />
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-20">
            <div className="relative overflow-hidden rounded-2xl border border-teal-100 bg-muted shadow-sm">
              <div className="relative aspect-square">
                <ProductImage
                  src={images[imageIndex]}
                  alt={product.nameAr}
                  productId={product.id}
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition",
                      i === imageIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-teal-100 opacity-85 hover:opacity-100"
                    )}
                  >
                    <ProductImage
                      src={img}
                      alt=""
                      productId={product.id}
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categoryName && (
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <Package className="h-3.5 w-3.5" />
                {product.categoryName}
              </Link>
            )}

            <h1 className="mt-2 text-2xl font-bold leading-tight text-primary-dark sm:text-3xl">
              {product.nameAr}
            </h1>

            <p className="mt-3 text-2xl font-bold text-primary">
              {product.priceLabel}
            </p>

            <Badge className={cn("mt-3 border-0", status.className)}>
              {status.label}
            </Badge>

            {product.descriptionAr && (
              <p className="mt-4 rounded-2xl border border-teal-50 bg-white p-4 text-sm leading-relaxed text-teal-800 shadow-sm">
                {product.descriptionAr}
              </p>
            )}

            {product.hasVariants && product.variants ? (
              <>
                <VariantPicker
                  variants={product.variants}
                  variantQtys={variantQtys}
                  canOrder={canAdd}
                  onQtyChange={(variantId, n) =>
                    setVariantQtys((prev) => ({ ...prev, [variantId]: n }))
                  }
                  onSetAll={setAllVariants}
                  onClear={clearVariants}
                />

                {hasVariantSelection && (
                  <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-l from-teal-50 to-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-teal-800">
                      ملخص الاختيار
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-teal-700">
                      {variantSelection.lines.map(({ label, q }) => (
                        <li key={label}>
                          {product.nameAr} - {label} × {q}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between border-t border-teal-100 pt-3">
                      <span className="text-sm text-teal-700">
                        {variantSelection.count} قطعة
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {formatSyp(variantSelection.totalSyp)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-teal-800">الكمية</span>
                  <QtyStepper
                    value={qty}
                    max={product.stockQty}
                    disabled={!canAdd || !product.inStock}
                    onChange={setQty}
                  />
                </div>
                {canAdd && product.inStock && (
                  <p className="mt-2 text-center text-sm text-teal-600">
                    الإجمالي: {formatSyp(product.priceSyp * qty)}
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="mt-3 text-center text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-teal-100 bg-white/95 shadow-[0_-4px_20px_rgba(13,148,136,0.08)] backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {product.hasVariants && hasVariantSelection && (
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-teal-700">
                {variantSelection.count} قطعة محددة
              </span>
              <span className="font-bold text-primary">
                {formatSyp(variantSelection.totalSyp)}
              </span>
            </div>
          )}
          {product.hasVariants ? (
            <Button
              className="h-12 w-full gap-2 text-base font-semibold"
              disabled={!canAdd || !hasVariantSelection}
              onClick={handleAddVariants}
            >
              <ShoppingCart className="h-5 w-5" />
              إضافة المحدد إلى السلة
            </Button>
          ) : (
            <Button
              className="h-12 w-full gap-2 text-base font-semibold"
              disabled={!canAdd || !product.inStock || qty < 1}
              onClick={handleAddSimple}
            >
              <ShoppingCart className="h-5 w-5" />
              أضف إلى السلة
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
