import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import {

  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
export default async function AdminProdukPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Produk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Kelola Produk
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tambah, edit, atau hapus produk yang tampil di katalog publik.
        </p>
      </div>

      <AdminProductsTable
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          isActive: p.isActive,
          imageUrl: p.imageUrl,
          category: p.category ? { name: p.category.name } : null,
        }))}
      />
    </div>
  );
}
