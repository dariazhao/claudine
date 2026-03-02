import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AppNav from "@/components/layout/AppNav";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.userId) redirect("/login");
  if (session.role !== "ADMIN") redirect("/checkin");

  return (
    <div className="min-h-screen bg-cream-50">
      <AppNav userName={session.name} role={session.role} />
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        <AdminSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
