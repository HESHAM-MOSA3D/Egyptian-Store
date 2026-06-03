import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <AdminPageHeader title="تعديل منتج" description="الاسم، السعر، المخزون، والمتغيرات" />
      <ProductForm productId={id} />
    </div>
  );
}
