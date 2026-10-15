import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminArticlesTable } from "@/components/admin/admin-articles-table";
import { AdminArticleCategoriesTable } from "@/components/admin/admin-article-categories-table";
import { db } from "@/lib/db";

export default async function AdminJournalPage() {
  const [articles, articleCategories] = await Promise.all([
    db.article.findMany({
      include: { category: true },
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    }),
    db.articleCategory.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Journal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Journal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola artikel dan kategori artikel Journal Dapur Ayam.
        </p>
      </div>

      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">Artikel ({articles.length})</TabsTrigger>
          <TabsTrigger value="categories">
            Kategori Artikel ({articleCategories.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="articles" className="mt-6">
          <AdminArticlesTable
            articles={articles.map((a) => ({
              id: a.id,
              title: a.title,
              slug: a.slug,
              status: a.status,
              authorName: a.authorName,
              publishedAt: a.publishedAt,
              coverImageUrl: a.coverImageUrl,
              category: a.category ? { name: a.category.name } : null,
            }))}
          />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <AdminArticleCategoriesTable
            categories={articleCategories.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description,
              _count: c._count,
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
