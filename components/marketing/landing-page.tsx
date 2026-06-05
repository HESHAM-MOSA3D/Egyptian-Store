import Link from "next/link";
import {
  ArrowLeft,
  BadgePercent,
  Building2,
  CheckCircle2,
  Droplets,
  Flower2,
  Layers,
  Leaf,
  MessageCircle,
  Palette,
  Phone,
  Scissors,
  Settings2,
  ShoppingBag,
  Sparkles,
  Store,
  Wand2,
} from "lucide-react";
import { LandingNav } from "@/components/nav/landing-nav";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { buildWhatsAppInquiryUrl } from "@/lib/whatsapp";
import type { LandingCategory } from "@/lib/landing-data";
import type { PublicProduct, PublicSettings } from "@/lib/types";

const trustFeatures = [
  {
    icon: BadgePercent,
    title: "أسعار واضحة بالجنيه المصري",
    desc: "عرض مباشر للأسعار بعد التحويل والتقريب — بدون مفاجآت عند الطلب.",
  },
  {
    icon: MessageCircle,
    title: "طلب سريع عبر واتساب",
    desc: "رسالة طلب منسّقة بضغطة واحدة مع تفاصيل المنتجات والكميات.",
  },
  {
    icon: Layers,
    title: "خيارات متعددة داخل المنتج",
    desc: "أحجام، روائح، وألوان — أضف عدة متغيرات في طلب واحد.",
  },
  {
    icon: Store,
    title: "مناسب للمحلات والصيدليات",
    desc: "واجهة سريعة للجوال مصمّمة لتجار الجملة والمشتريات المتكررة.",
  },
  {
    icon: Settings2,
    title: "تحديث الأسعار من لوحة التحكم",
    desc: "إدارة بالدولار مع تحويل تلقائي وسعر صرف قابل للتعديل.",
  },
];

const howItWorks = [
  { step: "1", title: "اختر التصنيف", desc: "تصفّح أقسام العناية والتجميل بسهولة" },
  {
    step: "2",
    title: "حدد المنتجات والكميات",
    desc: "أضف المنتجات والمتغيرات إلى السلة",
  },
  {
    step: "3",
    title: "أرسل الطلب عبر واتساب",
    desc: "رسالة عربية جاهزة ببياناتك وملخص الطلب",
  },
  {
    step: "4",
    title: "يتم التواصل لتأكيد الطلب والتوصيل",
    desc: "مراجعة الطلب وترتيب التسليم مع فريق المبيعات",
  },
];

const wholesaleBenefits = [
  "طلبيات مجمّعة دون تعقيد بوابة دفع",
  "كتالوج محدّث يعكس المخزون وسلوك نفاد المنتجات",
  "تجربة عربية RTL مريحة على الجوال",
  "مناسب للطلبات المتكررة من المحلات",
  "إدارة مركزية للمنتجات والتصنيفات والأسعار",
  "تصدير واستيراد Excel للتحديث السريع",
];

const categoryIcons: Record<string, typeof Sparkles> = {
  "skin-care": Droplets,
  hair: Scissors,
  perfumes: Flower2,
  creams: Sparkles,
  "natural-soap": Leaf,
  makeup: Palette,
  tools: Wand2,
};

type Props = {
  settings: PublicSettings;
  categories: LandingCategory[];
  featuredProducts: PublicProduct[];
};

export function LandingPage({
  settings,
  categories,
  featuredProducts,
}: Props) {
  const storeName = settings.storeNameAr;
  const whatsappHref = buildWhatsAppInquiryUrl(
    settings.whatsappNumber,
    storeName
  );

  return (
    <div className="min-h-screen bg-white text-text">
      <LandingNav storeName={storeName} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-50/80 via-white to-white"
          aria-hidden
        />
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-4 h-56 w-56 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              كتالوج جملة ذكي — عناية وتجميل
            </span>
            <h1 className="mt-6 text-3xl font-extrabold leading-[1.25] tracking-tight text-primary-dark sm:text-4xl md:text-[2.75rem]">
              طلبات جملة لمستحضرات التجميل
              <span className="block text-primary">والعناية الشخصية</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-teal-800 sm:text-lg">
              {storeName} — منصة كتالوج جملة ذكية وليست متجراً تقليدياً.
              تصفّح، حدّد الكميات، وأرسل طلبك المنظّم عبر واتساب خلال دقائق.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 text-base shadow-md">
                <Link href="/shop">تصفح الكتالوج</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 gap-2 border-teal-200 text-base text-primary-dark hover:bg-teal-50"
              >
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  تواصل عبر واتساب
                </a>
              </Button>
            </div>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-teal-600">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                بدون دفع إلكتروني
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                عربي RTL — محسّن للجوال
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Trust / Features */}
      <section id="features" className="border-y border-teal-50 bg-muted/40 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl">
              لماذا يثق التجار بهذا الكتالوج؟
            </h2>
            <p className="mt-2 text-sm text-teal-700 sm:text-base">
              كل ما تحتاجه لطلب الجملة بوضوح وسرعة
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trustFeatures.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="rounded-2xl border border-teal-100/80 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-bold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-700">
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories preview */}
      <section id="categories" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl">
                تصنيفات الكتالوج
              </h2>
              <p className="mt-2 text-sm text-teal-700">
                ابدأ من القسم المناسب لنشاطك التجاري
              </p>
            </div>
            <Button asChild variant="outline" className="gap-1">
              <Link href="/shop">
                عرض الكل
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Sparkles;
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group flex flex-col items-center rounded-2xl border border-teal-100 bg-white p-4 text-center shadow-sm transition hover:border-teal-200 hover:shadow-md sm:p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-3 text-sm font-semibold text-text group-hover:text-primary-dark">
                    {cat.nameAr}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-gradient-to-b from-teal-50/50 to-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-primary-dark sm:text-3xl">
            كيف يعمل الطلب؟
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-teal-700">
            أربع خطوات بسيطة من التصفح حتى التأكيد
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map(({ step, title, desc }) => (
              <li
                key={step}
                className="relative rounded-2xl border border-teal-100 bg-white p-5 shadow-sm"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {step}
                </span>
                <h3 className="mt-3 font-bold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-700">
                  {desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured products */}
      <section id="featured" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl">
                منتجات مميزة
              </h2>
              <p className="mt-2 text-sm text-teal-700">
                عيّنة من منتجات العرض — الأسعار بالجنيه المصري
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/shop">كل المنتجات</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale benefits */}
      <section className="border-t border-teal-50 bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary ring-1 ring-teal-100">
                <Building2 className="h-3.5 w-3.5" />
                مزايا الجملة
              </span>
              <h2 className="mt-4 text-2xl font-bold text-primary-dark sm:text-3xl">
                مصمّم لشراء الجملة بذكاء
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-teal-800 sm:text-base">
                ليس هدفنا استبدال علاقتك مع عملائك — بل تسريع اختيار المنتجات
                وتنظيم الطلب حتى يصل جاهزاً لفريق المبيعات عبر واتساب.
              </p>
              <ul className="mt-6 space-y-3">
                {wholesaleBenefits.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-teal-800"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/shop" className="gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    تصفح الكتالوج
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">إنشاء حساب تجاري</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-lg sm:p-8">
              <div className="space-y-4">
                {[
                  { label: "متوسط وقت الطلب", value: "دقائق" },
                  { label: "عملة العرض", value: "جنيه مصري" },
                  { label: "قناة التأكيد", value: "واتساب" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3"
                  >
                    <span className="text-sm text-teal-700">{label}</span>
                    <span className="font-bold text-primary-dark">{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-xs text-teal-600">
                إدارة الأسعار والمخزون من لوحة تحكم واحدة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-primary-dark">
            جاهز لطلبيتك القادمة؟
          </h2>
          <p className="mt-2 text-teal-700">
            افتح الكتالوج من جوالك أو تواصل معنا مباشرة
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/shop">تصفح الكتالوج</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                تواصل عبر واتساب
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-teal-100 bg-teal-50/30">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-lg font-bold text-primary-dark">{storeName}</p>
              <p className="mt-2 text-sm text-teal-700">
                كتالوج جملة B2B — عناية وتجميل
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                واتساب: {settings.whatsappNumber}
              </a>
            </div>
            <div>
              <p className="font-semibold text-text">روابط سريعة</p>
              <ul className="mt-3 space-y-2 text-sm text-teal-700">
                <li>
                  <Link href="/shop" className="hover:text-primary">
                    الكتالوج
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-primary">
                    تسجيل الدخول
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-primary">
                    إنشاء حساب
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-primary">
                    لوحة الإدارة
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-semibold text-text">للتجار</p>
              <p className="mt-2 text-sm leading-relaxed text-teal-700">
                {settings.deliveryNoteAr ??
                  "التواصل لتأكيد الطلب وترتيب التوصيل بعد الإرسال عبر واتساب."}
              </p>
            </div>
          </div>
          <p className="mt-8 border-t border-teal-100 pt-6 text-center text-xs text-teal-600">
            © {new Date().getFullYear()} {storeName}. عرض تجريبي — جميع الحقوق
            محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
