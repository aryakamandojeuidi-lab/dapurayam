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


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

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
            <BreadcrumbPage>Tambah Produk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tambah Produk Baru
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi informasi produk. Field yang ditandai * wajib diisi.
        </p>
      </div>

      <ProductForm
        action={saveProductAction}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Tambah Produk"
      />
    </div>
  );
}
