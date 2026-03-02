import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import AppNav from "@/components/layout/AppNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.userId) redirect("/login");
  if (session.role !== "ADMIN") redirect("/checkin");

  const openFlagCount = await prisma.entry.count({
    where: { isAnomaly: true, flagReviewed: false },
  });

  return (
    <div className="min-h-screen bg-cream-50">
      <AppNav userName={session.name} role={session.role} openFlagCount={openFlagCount} />
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-28 md:pb-10">{children}</main>
    </div>
  );
}
