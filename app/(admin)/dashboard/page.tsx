import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import MemberCard from "@/components/dashboard/MemberCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import BearMascot from "@/components/bear/BearMascot";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.userId || session.role !== "ADMIN") redirect("/login");

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [members, recentEntries, openFlagCount] = await Promise.all([
    prisma.user.findMany({
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
    }),
    prisma.entry.findMany({
      where: { createdAt: { gte: today } },
      include: { user: { select: { name: true, id: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.entry.count({ where: { isAnomaly: true, flagReviewed: false } }),
  ]);

  const totalCheckedIn = members.filter((m) =>
    m.entries.some((e) => new Date(e.createdAt) >= today)
  ).length;

  const stats = [
    {
      label: "Members",
      value: members.length,
      emoji: "👥",
      color: "text-bear-600",
      bg: "bg-white border-bear-100",
    },
    {
      label: "Checked in today",
      value: `${totalCheckedIn} / ${members.length}`,
      emoji: "✓",
      color: "text-green-700",
      bg: totalCheckedIn === members.length && members.length > 0
        ? "bg-green-50 border-green-200"
        : "bg-white border-bear-100",
    },
    {
      label: "Open flags",
      value: openFlagCount,
      emoji: "🚩",
      color: openFlagCount > 0 ? "text-red-600" : "text-bear-300",
      bg: openFlagCount > 0 ? "bg-red-50 border-red-200" : "bg-white border-bear-100",
    },
  ];

  return (
    <div className="page-enter space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-1">Admin</p>
        <h1 className="font-display italic font-bold text-bear-600 text-3xl leading-tight mb-1">
          Overview
        </h1>
        <p className="text-bear-300 text-sm font-semibold">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-4 text-center shadow-sm transition-colors ${s.bg}`}
          >
            <div className={`text-2xl font-extrabold ${s.color}`}>
              {s.value}
            </div>
            <div className="text-xs text-bear-400 mt-0.5 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Members */}
        <div>
          <h2 className="text-lg font-bold text-bear-600 mb-3">
            Family members
          </h2>
          {members.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-bear-100">
              <BearMascot mood="sleepy" size={70} className="mx-auto mb-3" />
              <p className="text-bear-400 font-bold text-sm">No members yet</p>
              <p className="text-bear-200 text-xs mt-1">Invite someone from the Members page</p>
            </div>
          ) : (
            <div className="space-y-3">
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
          )}
        </div>

        {/* Today's activity */}
        <div>
          <h2 className="text-lg font-bold text-bear-600 mb-3">
            Today&#39;s activity
          </h2>
          <div className="bg-white rounded-2xl border border-bear-100 p-4">
            <ActivityFeed
              items={recentEntries.map((e) => ({
                id: e.id,
                userId: e.user.id,
                userName: e.user.name,
                sentimentLabel: e.sentimentLabel,
                isAnomaly: e.isAnomaly,
                createdAt: e.createdAt,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
