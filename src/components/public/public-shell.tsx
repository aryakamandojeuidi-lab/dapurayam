import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export async function PublicShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });

  const settingsProps = settings
    ? {
        businessName: settings.businessName,
        tagline: settings.tagline,
        description: settings.description,
        whatsappNumber: settings.whatsappNumber,
        contactEmail: settings.contactEmail,
        address: settings.address,
        operationalHours: settings.operationalHours,
        instagramUrl: settings.instagramUrl,
        facebookUrl: settings.facebookUrl,
        tiktokUrl: settings.tiktokUrl,
        footerText: settings.footerText,
        shopeeStoreUrl: settings.shopeeStoreUrl,
        tokopediaStoreUrl: settings.tokopediaStoreUrl,
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        whatsappNumber={settings?.whatsappNumber || ""}
        businessName={settings?.businessName || "Dapur Ayam"}
      />
      <div className={cn("flex-1", className)}>{children}</div>
      <Footer settings={settingsProps} />
    </div>
  );
}
