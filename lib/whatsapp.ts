import { formatCartItemTitle, formatSyp } from "@/lib/utils";

export const CART_PRICE_NOTE =
  "الأسعار قابلة للتأكيد حسب التوفر وسعر الصرف النهائي";

export type CartLineForMessage = {
  productName: string;
  variantLabel?: string;
  quantity: number;
  unitPriceSyp: number;
  lineTotalSyp: number;
};

export type CheckoutCustomer = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  deliveryRequested: boolean;
};

export function buildWhatsAppMessage(params: {
  storeNameAr: string;
  customer: CheckoutCustomer;
  lines: CartLineForMessage[];
  totalSyp: number;
}): string {
  const { storeNameAr, customer, lines, totalSyp } = params;

  const itemsText = lines
    .map((line, i) => {
      const title = formatCartItemTitle(line.productName, line.variantLabel);
      return [
        `${i + 1}. ${title}`,
        `الكمية: ${line.quantity}`,
        `سعر القطعة: ${formatSyp(line.unitPriceSyp)}`,
        `الإجمالي: ${formatSyp(line.lineTotalSyp)}`,
      ].join("\n");
    })
    .join("\n\n");

  const deliveryLine = customer.deliveryRequested
    ? "\nالتوصيل: مطلوب"
    : "";

  const notes = customer.notes?.trim() || "—";

  return [
    `طلب جديد من ${storeNameAr}`,
    "",
    "بيانات العميل:",
    `الاسم: ${customer.name.trim()}`,
    `الهاتف: ${customer.phone.trim()}`,
    `العنوان: ${customer.address.trim()}${deliveryLine}`,
    "",
    "تفاصيل الطلب:",
    itemsText,
    "",
    `الإجمالي النهائي: ${formatSyp(totalSyp)}`,
    "",
    "ملاحظات العميل:",
    notes,
    "",
    CART_PRICE_NOTE,
  ].join("\n");
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  if (!digits) {
    throw new Error("رقم واتساب غير صالح في إعدادات المتجر");
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Opens WhatsApp; falls back to same-tab navigation if popup is blocked (common on mobile). */
export function openWhatsAppChat(url: string): void {
  if (typeof window === "undefined") return;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (opened === null) {
    window.location.assign(url);
  }
}

export function buildWhatsAppInquiryUrl(
  whatsappNumber: string,
  storeNameAr: string
): string {
  const message = `مرحباً، أود الاستفسار عن طلبات الجملة من ${storeNameAr}.`;
  return buildWhatsAppUrl(whatsappNumber, message);
}
