import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import MemberCard from "@/components/dashboard/MemberCard";
import InviteMemberForm from "./InviteMemberForm";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const session = await getSession();
  if (!session.userId || session.role !== "ADMIN") redirect("/login");

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const members = await prisma.user.findMany({
    include: {
      entries: {
        orderBy: { createdAt: "desc" },
        take: 7,
        select: {
          sentimentScore: true,
          sentimentLabel: true,
          createdAt: true,
          isAnomaly: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-bear-600">Members 👥</h1>
          <p className="text-bear-400 text-sm mt-0.5">
            {members.length} total
          </p>
        </div>
      </div>

      <InviteMemberForm />

      <div className="grid sm:grid-cols-2 gap-4">
        {members.map((m) => (
          <MemberCard
            key={m.id}
            id={m.id}
            name={m.name}
            email={m.email}
            checkedInToday={m.entries.some(
              (e) => new Date(e.createdAt) >= today
            )}
            recentEntries={m.entries}
            flagCount={m.entries.filter((e) => e.isAnomaly).length}
          />
        ))}
      </div>
    </div>
  );
}
