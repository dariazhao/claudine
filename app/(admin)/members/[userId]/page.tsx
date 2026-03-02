import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import { SentimentLabel } from "@prisma/client";
import SentimentSparkline from "@/components/dashboard/SentimentSparkline";
import FlagBadge from "@/components/dashboard/FlagBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

const LABEL_COLORS: Record<SentimentLabel, string> = {
  JOYFUL: "bg-honey-50 text-honey-600 border-honey-400/40",
  POSITIVE: "bg-green-50 text-green-700 border-green-200",
  NEUTRAL: "bg-bear-50 text-bear-400 border-bear-100",
  CONCERNED: "bg-peach-100 text-peach-400 border-peach-200",
  DISTRESSED: "bg-red-50 text-red-600 border-red-200",
};

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await getSession();
  if (!session.userId || session.role !== "ADMIN") redirect("/login");

  const { userId } = await params;

  const member = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      baseline: true,
      entries: {
        include: { prompt: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });

  if (!member) notFound();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const checkedInToday = member.entries.some(
    (e) => new Date(e.createdAt) >= today
  );

  const last7 = member.entries.slice(0, 7);

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/members"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-bear-400 hover:text-bear-600 hover:bg-cream-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          ← Family
        </Link>
      </div>

      {/* Member header */}
      <div className="bg-white rounded-3xl border border-bear-100 shadow-warm-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-bear-100 flex items-center justify-center text-bear-600 font-bold text-xl flex-shrink-0">
              {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-0.5">Member</p>
              <h1 className="font-display italic font-bold text-2xl text-bear-600 leading-tight">
                {member.name}
              </h1>
              <p className="text-bear-400 text-sm">{member.email}</p>
            </div>
          </div>

          {member.baseline && (
            <div className="text-right bg-cream-100 rounded-2xl px-4 py-3 flex-shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-bear-300 mb-1">Baseline</p>
              <p className="text-base font-extrabold text-bear-600">
                {member.baseline.mean.toFixed(2)} <span className="text-bear-300 font-bold text-sm">±{member.baseline.stdDev.toFixed(2)}</span>
              </p>
              <p className="text-xs text-bear-300">
                {member.baseline.sampleCount} entries
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              checkedInToday
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-peach-100 text-peach-400 border-peach-200"
            }`}
          >
            {checkedInToday ? "✓ Checked in today" : "Not yet today"}
          </span>
          <FlagBadge
            count={member.entries.filter((e) => e.isAnomaly && !e.flagReviewed).length}
          />
        </div>

        {/* 7-day sparkline */}
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-bear-300 mb-2">7-day mood trend</p>
          <SentimentSparkline data={last7} height={100} />
        </div>
      </div>

      {/* Entry history */}
      <div>
        <div className="flex items-baseline gap-2 mb-3">
          <h2 className="text-lg font-bold text-bear-600">Entry history</h2>
          <span className="text-bear-300 text-sm font-semibold">{member.entries.length} entries</span>
        </div>
        {member.entries.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-bear-100">
            <p className="text-bear-400 font-semibold text-sm">No entries yet</p>
            <p className="text-bear-300 text-xs mt-1">This member hasn&apos;t checked in yet</p>
          </div>
        )}
        <div className="space-y-3">
          {member.entries.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white rounded-2xl border p-4 ${
                entry.isAnomaly ? "border-red-200" : "border-bear-100"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-bear-200 text-xs font-semibold">
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-2">
                  {entry.sentimentLabel && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        LABEL_COLORS[entry.sentimentLabel]
                      }`}
                    >
                      {entry.sentimentLabel.charAt(0) +
                        entry.sentimentLabel.slice(1).toLowerCase()}
                    </span>
                  )}
                  {entry.sentimentScore !== null && (
                    <span className="text-xs text-bear-200 font-mono">
                      {entry.sentimentScore.toFixed(2)}
                    </span>
                  )}
                  {entry.isAnomaly && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      🚩 {entry.flagReviewed ? "reviewed" : "flagged"}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-bear-400 text-xs italic mb-1.5">
                &#8220;{entry.prompt.body}&#8221;
              </p>

              <p className="text-bear-600 text-sm leading-relaxed">
                {entry.body}
              </p>

              {entry.anomalyReason && (
                <p className="mt-2 text-xs text-red-400 bg-red-50 rounded-lg px-3 py-1.5">
                  {entry.anomalyReason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
