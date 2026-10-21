import {

  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdminCategoriesTable } from "@/components/admin/admin-categories-table";
import { db } from "@/lib/db";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
export default async function AdminKategoriPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
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
            <BreadcrumbPage>Kategori Produk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Kategori Produk
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola kategori produk di katalog publik Dapur Ayam.
        </p>
      </div>

      <AdminCategoriesTable
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          _count: c._count,
        }))}
      />
    </div>
  );
}
