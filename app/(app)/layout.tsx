import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AppNav from "@/components/layout/AppNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <AppNav userName={session.name} role={session.role} />
      <main className="max-w-2xl mx-auto px-4 pt-8 pb-28 md:pb-10">{children}</main>
    </div>
  );
}
