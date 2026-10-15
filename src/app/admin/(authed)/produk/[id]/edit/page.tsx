import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductForm } from "@/components/admin/product-form";
import { saveProductAction } from "@/actions/product-actions";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/produk">Produk</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit: {product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Produk
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Perbarui informasi produk <span className="font-medium text-foreground">{product.name}</span>.
        </p>
      </div>

      <ProductForm
        action={saveProductAction}
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          packageSize: product.packageSize,
          imageUrl: product.imageUrl,
          ingredients: product.ingredients,
          storageInstructions: product.storageInstructions,
          servingSuggestion: product.servingSuggestion,
          categoryId: product.categoryId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          featuredOrder: product.featuredOrder,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
