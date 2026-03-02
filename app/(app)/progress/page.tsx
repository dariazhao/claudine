import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { SentimentLabel } from "@prisma/client";
import Link from "next/link";
import EmotionBear, { Emotion } from "@/components/bear/EmotionBear";
import MoodTrendChart, { TrendPoint } from "@/components/charts/MoodTrendChart";
import MoodDistributionChart, { DistPoint } from "@/components/charts/MoodDistributionChart";
import StreakCalendar, { CalData } from "@/components/charts/StreakCalendar";

export const dynamic = "force-dynamic";

const MOOD_TO_EMOTION: Record<SentimentLabel, Emotion> = {
  JOYFUL:     "ecstatic",
  POSITIVE:   "hopeful",
  NEUTRAL:    "calm",
  CONCERNED:  "pensive",
  DISTRESSED: "lonely",
};

const MOOD_MESSAGE: Record<SentimentLabel, string> = {
  JOYFUL:     "You've been shining lately — keep nurturing that joy.",
  POSITIVE:   "Overall things feel good. You're doing great.",
  NEUTRAL:    "You've been steady and grounded. That's a gift.",
  CONCERNED:  "Some heavier days lately. Be gentle with yourself.",
  DISTRESSED: "It's been tough. You showed up anyway — that matters.",
};

function getStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateSet = new Set(
    dates.map((d) => {
      const c = new Date(d);
      c.setHours(0, 0, 0, 0);
      return c.toISOString().split("T")[0];
    })
  );
  let streak = 0;
  const cursor = new Date(today);
  while (dateSet.has(cursor.toISOString().split("T")[0])) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function avgLabel(score: number): string {
  if (score >= 0.7)   return "Joyful";
  if (score >= 0.3)   return "Positive";
  if (score >= -0.29) return "Neutral";
  if (score >= -0.69) return "Concerned";
  return "Distressed";
}

export default async function ProgressPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const entries = await prisma.entry.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true, sentimentScore: true, sentimentLabel: true },
  });

  // ── Trend ──────────────────────────────────────────────────────────────────
  const trendData: TrendPoint[] = entries
    .filter((e) => e.sentimentScore !== null)
    .map((e) => ({
      date: new Date(e.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: e.sentimentScore!,
    }));

  // ── Distribution ───────────────────────────────────────────────────────────
  const counts: Record<SentimentLabel, number> = {
    JOYFUL: 0, POSITIVE: 0, NEUTRAL: 0, CONCERNED: 0, DISTRESSED: 0,
  };
  entries.forEach((e) => { if (e.sentimentLabel) counts[e.sentimentLabel]++; });

  const distData: DistPoint[] = [
    { name: "Joyful",     value: counts.JOYFUL,     color: "#f59e0b" },
    { name: "Positive",   value: counts.POSITIVE,   color: "#22c55e" },
    { name: "Neutral",    value: counts.NEUTRAL,    color: "#c8956c" },
    { name: "Concerned",  value: counts.CONCERNED,  color: "#f4956b" },
    { name: "Distressed", value: counts.DISTRESSED, color: "#ef4444" },
  ];

  // ── Calendar ───────────────────────────────────────────────────────────────
  const calData: CalData = {};
  entries.forEach((e) => {
    const str = new Date(e.createdAt).toISOString().split("T")[0];
    calData[str] = e.sentimentLabel ?? null;
  });

  // ── Stats ──────────────────────────────────────────────────────────────────
  const streak = getStreak(entries.map((e) => e.createdAt));

  const scores = entries
    .map((e) => e.sentimentScore)
    .filter((s): s is number => s !== null);
  const avgScore =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

  const topEntry = (Object.entries(counts) as [SentimentLabel, number][]).reduce(
    (a, b) => (a[1] >= b[1] ? a : b)
  );
  const topLabel: SentimentLabel | null =
    topEntry[1] > 0 ? topEntry[0] : null;
  const topEmotion: Emotion = topLabel ? MOOD_TO_EMOTION[topLabel] : "calm";

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const daysThisMonth = entries.filter(
    (e) => new Date(e.createdAt) >= startOfMonth
  ).length;

  const firstName = session.name?.split(" ")[0] ?? "You";

  return (
    <div className="page-enter max-w-4xl mx-auto">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-8">
        <EmotionBear emotion={topEmotion} size={72} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-1">
            Your progress
          </p>
          <h1 className="font-display italic font-bold text-bear-600 text-3xl leading-tight">
            {firstName}&apos;s journey
          </h1>
          {topLabel && (
            <p className="text-bear-400 text-sm mt-1.5 max-w-sm leading-relaxed">
              {MOOD_MESSAGE[topLabel]}
            </p>
          )}
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total check-ins", value: entries.length,                               icon: "📖" },
          { label: "Current streak",  value: `${streak} day${streak !== 1 ? "s" : ""}`,   icon: "🔥" },
          { label: "Average mood",    value: avgScore !== null ? avgLabel(avgScore) : "—", icon: "💛" },
          { label: "This month",      value: `${daysThisMonth} day${daysThisMonth !== 1 ? "s" : ""}`, icon: "📅" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-bear-100 p-4 shadow-warm-sm"
          >
            <p className="text-xl mb-1">{s.icon}</p>
            <p className="text-xl font-extrabold text-bear-600 leading-tight">{s.value}</p>
            <p className="text-xs text-bear-300 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Mood trend — full width ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-bear-100 shadow-warm-sm p-6 mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-1">
          Mood over time
        </p>
        <h2 className="font-display italic font-bold text-bear-600 text-xl mb-6">
          How you&apos;ve been feeling
        </h2>
        <div className="h-64">
          {trendData.length > 0 ? (
            <MoodTrendChart data={trendData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <EmotionBear emotion="tired" size={56} />
              <p className="text-bear-300 text-sm font-semibold">
                Check in a few times to see your mood trend appear here!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Distribution + Calendar — side by side ──────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">

        {/* Donut */}
        <div className="bg-white rounded-3xl border border-bear-100 shadow-warm-sm p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-1">
            Breakdown
          </p>
          <h2 className="font-display italic font-bold text-bear-600 text-xl mb-4">
            Mood distribution
          </h2>

          <div className="h-56 relative">
            <MoodDistributionChart data={distData} total={entries.length} />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-5">
            {distData
              .filter((d) => d.value > 0)
              .map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-xs text-bear-400 font-semibold">{d.name}</span>
                  <span className="text-xs text-bear-300 ml-auto font-semibold">
                    {d.value}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl border border-bear-100 shadow-warm-sm p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-1">
            Activity
          </p>
          <h2 className="font-display italic font-bold text-bear-600 text-xl mb-4">
            Check-in calendar
          </h2>
          <div className="overflow-x-auto">
            <StreakCalendar data={calData} />
          </div>
          <p className="text-xs text-bear-300 font-semibold mt-4">
            Last 13 weeks · hover a cell to see the date
          </p>
        </div>
      </div>

      {/* ── Back link ───────────────────────────────────────────────────── */}
      <div className="text-center pb-10">
        <Link
          href="/history"
          className="text-bear-300 hover:text-bear-500 text-sm font-semibold transition-colors"
        >
          ← Back to journal
        </Link>
      </div>
    </div>
  );
}
