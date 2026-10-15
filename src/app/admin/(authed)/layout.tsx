import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const user = session.user;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userName={user?.name} userEmail={user?.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader userName={user?.name} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
