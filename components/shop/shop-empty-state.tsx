import Link from "next/link";
import { PackageOpen, Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type EmptyVariant = "no-products" | "no-search" | "no-category";

const config: Record<
  EmptyVariant,
  {
    icon: typeof Search;
    title: string;
    description: string;
    action?: React.ReactNode;
  }
> = {
  "no-products": {
    icon: PackageOpen,
    title: "لا توجد منتجات في الكتالوج",
    description:
      "جرّب لاحقاً أو تواصل معنا عبر واتساب للاستفسار عن التوفر.",
    action: (
      <Button asChild variant="outline">
        <Link href="/">العودة للرئيسية</Link>
      </Button>
    ),
  },
  "no-search": {
    icon: Search,
    title: "لا نتائج للبحث",
    description:
      "لم نجد منتجاً يطابق كلمة البحث. جرّب اسماً مختلفاً أو تصفح التصنيفات.",
  },
  "no-category": {
    icon: Tags,
    title: "لا منتجات في هذا التصنيف",
    description: "اختر تصنيفاً آخر أو اعرض كل المنتجات من الكتالوج.",
  },
};

export function ShopEmptyState({
  variant,
  onClearFilters,
}: {
  variant: EmptyVariant;
  onClearFilters?: () => void;
}) {
  const { icon, title, description, action } = config[variant];

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      className="mt-8"
      action={
        <>
          {variant !== "no-products" && onClearFilters && (
            <Button type="button" onClick={onClearFilters}>
              عرض كل المنتجات
            </Button>
          )}
          {action}
        </>
      }
    />
  );
}
