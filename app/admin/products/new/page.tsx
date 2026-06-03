import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function NewProductPage() {
  return (
    <div>
      <AdminPageHeader title="منتج جديد" description="إضافة منتج مع صور ومتغيرات" />
      <ProductForm />
    </div>
  );
}
