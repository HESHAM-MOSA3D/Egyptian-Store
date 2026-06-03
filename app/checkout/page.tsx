"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/shop/page-header";
import { CartSummary } from "@/components/shop/cart-summary";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerAuth } from "@/hooks/use-customer-auth";
import { useCartPricing } from "@/hooks/use-cart-pricing";
import { useSettings } from "@/hooks/use-settings";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  openWhatsAppChat,
} from "@/lib/whatsapp";
import { formatCartItemTitle, formatSyp } from "@/lib/utils";
import { useCartItemCount, useCartItems } from "@/hooks/use-cart-hydrated";
import { useCustomerStore, validatePhone } from "@/store/customer";

export default function CheckoutPage() {
  const { settings } = useSettings();
  const items = useCartItems();
  const itemCount = useCartItemCount();
  const { lines, totalSyp } = useCartPricing(settings);
  const customer = useCustomerStore();
  const { customer: loggedIn, isLoggedIn, loading: authLoading } =
    useCustomerAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filledFromAccount, setFilledFromAccount] = useState(false);

  useEffect(() => {
    if (authLoading || !loggedIn || filledFromAccount) return;
    const store = useCustomerStore.getState();
    store.setField("name", loggedIn.name);
    store.setField("phone", loggedIn.phone);
    store.setField("address", loggedIn.address);
    setFilledFromAccount(true);
  }, [authLoading, loggedIn, filledFromAccount]);

  const handleSubmit = () => {
    setError("");

    if (items.length === 0) {
      setError("السلة فارغة");
      return;
    }
    if (!customer.name.trim()) {
      setError("الاسم مطلوب");
      return;
    }
    if (!validatePhone(customer.phone)) {
      setError("رقم الهاتف غير صالح (8–15 رقم)");
      return;
    }
    if (!customer.address.trim()) {
      setError("العنوان مطلوب");
      return;
    }

    if (!settings.whatsappNumber?.replace(/\D/g, "")) {
      setError("رقم واتساب غير مضبوط في إعدادات المتجر");
      return;
    }

    setSubmitting(true);

    try {
      const message = buildWhatsAppMessage({
        storeNameAr: settings.storeNameAr,
        customer: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          notes: customer.notes,
          deliveryRequested: customer.deliveryRequested,
        },
        lines: lines.map((l) => ({
          productName: l.productName,
          variantLabel: l.variantLabel,
          quantity: l.quantity,
          unitPriceSyp: l.unitSyp,
          lineTotalSyp: l.lineTotal,
        })),
        totalSyp,
      });

      const url = buildWhatsAppUrl(settings.whatsappNumber, message);
      openWhatsAppChat(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر فتح واتساب");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white p-8 pb-28 text-center">
        <p>لا يوجد طلب للإتمام</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/shop">العودة للكتالوج</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/20 to-white pb-32">
      <PageHeader title="إتمام الطلب" backHref="/cart" />

      <main className="mx-auto max-w-lg space-y-5 px-4 py-4">
        {!authLoading && !isLoggedIn && (
          <div className="rounded-2xl border border-teal-100 bg-gradient-to-l from-teal-50/80 to-white p-4 text-sm text-teal-800">
            <Link
              href="/register"
              className="font-semibold text-primary underline"
            >
              سجّل حسابك لتسهيل الطلبات القادمة
            </Link>
            <span className="text-teal-700">
              {" "}
              — أو أكمل كضيف (تُحفظ بياناتك على هذا الجهاز)
            </span>
          </div>
        )}

        {isLoggedIn && loggedIn && (
          <p className="rounded-xl border border-teal-100 bg-white px-3 py-2 text-xs text-teal-700 shadow-sm">
            مرحباً {loggedIn.name} — تم تعبئة بياناتك من حسابك
          </p>
        )}

        <section className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-bold text-primary-dark">ملخص الطلب</h2>
          <ul className="max-h-48 space-y-3 overflow-y-auto text-sm">
            {lines.map((l) => (
              <li
                key={`${l.productId}-${l.variantId}`}
                className="border-b border-teal-50 pb-3 last:border-0 last:pb-0"
              >
                <p className="font-semibold text-text">
                  {formatCartItemTitle(l.productName, l.variantLabel)}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-teal-700">
                  <span>الكمية: {l.quantity}</span>
                  <span>سعر القطعة: {formatSyp(l.unitSyp)}</span>
                  <span className="font-bold text-primary">
                    الإجمالي: {formatSyp(l.lineTotal)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-teal-100 pt-4">
            <CartSummary totalSyp={totalSyp} itemCount={itemCount} />
          </div>
        </section>

        <section className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
          <h2 className="mb-4 font-bold text-primary-dark">بيانات العميل</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">
                الاسم <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                autoComplete="name"
                value={customer.name}
                onChange={(e) => customer.setField("name", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">
                رقم الهاتف <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                dir="ltr"
                className="mt-1 text-left"
                placeholder="9639xxxxxxxx"
                value={customer.phone}
                onChange={(e) => customer.setField("phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">
                العنوان <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                rows={3}
                autoComplete="street-address"
                className="mt-1"
                value={customer.address}
                onChange={(e) => customer.setField("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea
                id="notes"
                rows={2}
                className="mt-1"
                placeholder="أي تفاصيل إضافية للطلب..."
                value={customer.notes}
                onChange={(e) => customer.setField("notes", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3">
              <Checkbox
                id="delivery"
                checked={customer.deliveryRequested}
                onCheckedChange={(v) =>
                  customer.setField("deliveryRequested", v === true)
                }
              />
              <Label htmlFor="delivery" className="cursor-pointer text-sm">
                التوصيل مطلوب
              </Label>
            </div>
          </div>
        </section>

        {settings.deliveryNoteAr && (
          <p className="rounded-xl bg-muted px-3 py-2 text-xs text-teal-700">
            {settings.deliveryNoteAr}
          </p>
        )}

        <p className="text-center text-xs text-teal-600">
          لا يوجد دفع إلكتروني — يتم إرسال الطلب عبر واتساب للتأكيد
        </p>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          className="h-12 w-full gap-2 text-base"
          size="lg"
          disabled={submitting}
          onClick={handleSubmit}
        >
          <MessageCircle className="h-5 w-5" />
          {submitting ? "جاري التحضير..." : "إرسال الطلب عبر واتساب"}
        </Button>
      </main>
    </div>
  );
}
