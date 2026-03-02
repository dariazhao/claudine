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
    <div className="page-enter space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-1">Admin</p>
        <h1 className="font-display italic font-bold text-bear-600 text-3xl leading-tight mb-1">
          Family
        </h1>
        <p className="text-bear-300 text-sm font-semibold">{members.length} member{members.length !== 1 ? "s" : ""}</p>
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
