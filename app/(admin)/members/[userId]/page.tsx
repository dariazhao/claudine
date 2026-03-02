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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/members" className="text-bear-200 hover:text-bear-400 text-sm font-semibold">
          ← Members
        </Link>
      </div>

      {/* Member header */}
      <div className="bg-white rounded-2xl border border-bear-100 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-bear-100 flex items-center justify-center text-bear-600 font-bold text-xl">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-bear-600">
                {member.name}
              </h1>
              <p className="text-bear-400 text-sm">{member.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    checkedInToday
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-peach-100 text-peach-400 border-peach-200"
                  }`}
                >
                  {checkedInToday ? "✓ Checked in today" : "○ Not yet today"}
                </span>
                <FlagBadge
                  count={member.entries.filter((e) => e.isAnomaly && !e.flagReviewed).length}
                />
              </div>
            </div>
          </div>

          {member.baseline && (
            <div className="text-right">
              <p className="text-xs text-bear-200">Baseline</p>
              <p className="text-sm font-bold text-bear-600">
                {member.baseline.mean.toFixed(2)} ±{" "}
                {member.baseline.stdDev.toFixed(2)}
              </p>
              <p className="text-xs text-bear-200">
                {member.baseline.sampleCount} samples
              </p>
            </div>
          )}
        </div>

        {/* 7-day sparkline */}
        <div className="mt-4">
          <p className="text-xs text-bear-200 mb-2">7-day mood trend</p>
          <SentimentSparkline data={last7} height={64} />
        </div>
      </div>

      {/* Entry history */}
      <div>
        <h2 className="text-lg font-bold text-bear-600 mb-3">
          Entry history
        </h2>
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

              <p className="text-bear-400 text-xs italic mb-1.5 line-clamp-1">
                &#8220;{entry.prompt.body}&#8221;
              </p>

              <p className="text-bear-600 text-sm leading-relaxed line-clamp-3">
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
