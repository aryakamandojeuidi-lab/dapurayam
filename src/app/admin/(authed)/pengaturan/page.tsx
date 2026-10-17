import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { db } from "@/lib/db";

export default async function AdminPengaturanPage() {
  const settings = await db.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pengaturan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Pengaturan Situs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola informasi bisnis, kontak, media sosial, dan tampilan beranda.
        </p>
      </div>

      <SiteSettingsForm
        initialData={{
          businessName: settings?.businessName || "",
          tagline: settings?.tagline ?? "",
          description: settings?.description ?? "",
          whatsappNumber: settings?.whatsappNumber ?? "",
          contactEmail: settings?.contactEmail ?? "",
          address: settings?.address ?? "",
          operationalHours: settings?.operationalHours ?? "",
          instagramUrl: settings?.instagramUrl ?? "",
          facebookUrl: settings?.facebookUrl ?? "",
          tiktokUrl: settings?.tiktokUrl ?? "",
          footerText: settings?.footerText ?? "",
          heroHeadline: settings?.heroHeadline ?? "",
          heroSubtext: settings?.heroSubtext ?? "",
          shopeeStoreUrl: settings?.shopeeStoreUrl ?? "",
          tokopediaStoreUrl: settings?.tokopediaStoreUrl ?? "",
          positioningLabel: settings?.positioningLabel ?? "",
          freshnessNote: settings?.freshnessNote ?? "",
        }}
      />
    </div>
  );
}
