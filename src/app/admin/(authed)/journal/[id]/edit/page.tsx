import { notFound } from "next/navigation";
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
type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    db.article.findUnique({ where: { id } }),
    db.articleCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!article) notFound();

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
            <BreadcrumbPage>Edit: {article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Artikel
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Perbarui artikel <span className="font-medium text-foreground">{article.title}</span>.
        </p>
      </div>

      <ArticleForm
        action={saveArticleAction}
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          coverImageUrl: article.coverImageUrl,
          authorName: article.authorName,
          categoryId: article.categoryId,
          tags: article.tags,
          status: article.status,
          isFeatured: article.isFeatured,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          publishedAt: article.publishedAt,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
