import {

  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArticleForm } from "@/components/admin/article-form";
import { saveArticleAction } from "@/actions/article-actions";
import { db } from "@/lib/db";


// Always dynamic — DB-required page, skip static prerender to avoid build crash when DATABASE_URL not available at build time
export const dynamic = "force-dynamic";
export default async function NewArticlePage() {
  const categories = await db.articleCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/journal">Journal</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Artikel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tambah Artikel Baru
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tulis artikel baru untuk Journal Dapur Ayam.
        </p>
      </div>

      <ArticleForm
        action={saveArticleAction}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Tambah Artikel"
      />
    </div>
  );
}
