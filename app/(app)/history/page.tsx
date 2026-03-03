import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { SentimentLabel } from "@prisma/client";
import BearMascot from "@/components/bear/BearMascot";
import EmotionBear, { Emotion } from "@/components/bear/EmotionBear";
import ProgressPreview from "@/components/charts/ProgressPreview";
import { TrendPoint } from "@/components/charts/MoodTrendChart";
import { DistPoint } from "@/components/charts/MoodDistributionChart";
import { CalData } from "@/components/charts/StreakCalendar";
import EntryList, { EntryItem } from "@/components/history/EntryList";
import Link from "next/link";

const LABEL_CONFIG: Record<
  SentimentLabel,
  { emotion: Emotion }
> = {
  JOYFUL:     { emotion: "ecstatic" },
  POSITIVE:   { emotion: "hopeful"  },
  NEUTRAL:    { emotion: "calm"     },
  CONCERNED:  { emotion: "pensive"  },
  DISTRESSED: { emotion: "lonely"   },
};

function getStreak(dateStrings: string[]): number {
  if (dateStrings.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateSet = new Set(dateStrings);
  const todayStr = today.toISOString().split("T")[0];
  // Start from today if already checked in, otherwise try from yesterday
  const start = new Date(today);
  if (!dateSet.has(todayStr)) {
    start.setDate(start.getDate() - 1);
  }
  let streak = 0;
  const cursor = new Date(start);
  while (dateSet.has(cursor.toISOString().split("T")[0])) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default async function HistoryPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  // Fetch all entries (newest first)
  const entries = await prisma.entry.findMany({
    where: { userId: session.userId },
    include: { prompt: true },
    orderBy: { createdAt: "desc" },
  });

  // ── Chart preview data (use most recent 30) ────────────────────────────────
  const chartEntries = entries.slice(0, 30);

  const trendData: TrendPoint[] = [...chartEntries]
    .reverse()
    .filter((e) => e.sentimentScore !== null)
    .map((e) => ({
      date: new Date(e.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: e.sentimentScore!,
    }));

  const distCounts: Record<SentimentLabel, number> = {
    JOYFUL: 0, POSITIVE: 0, NEUTRAL: 0, CONCERNED: 0, DISTRESSED: 0,
  };
  chartEntries.forEach((e) => { if (e.sentimentLabel) distCounts[e.sentimentLabel]++; });

  const distData: DistPoint[] = [
    { name: "Joyful",     value: distCounts.JOYFUL,     color: "#f59e0b" },
    { name: "Positive",   value: distCounts.POSITIVE,   color: "#22c55e" },
    { name: "Neutral",    value: distCounts.NEUTRAL,    color: "#c8956c" },
    { name: "Concerned",  value: distCounts.CONCERNED,  color: "#f4956b" },
    { name: "Distressed", value: distCounts.DISTRESSED, color: "#ef4444" },
  ];

  const calData: CalData = {};
  entries.forEach((e) => {
    const str = new Date(e.createdAt).toISOString().split("T")[0];
    calData[str] = e.sentimentLabel ?? null;
  });

  const streak = getStreak(Object.keys(calData));

  // Serialize for client components
  const entryItems: EntryItem[] = entries.map((e) => ({
    id: e.id,
    createdAt: e.createdAt.toISOString(),
    sentimentLabel: e.sentimentLabel,
    body: e.body,
    promptBody: e.prompt.body,
  }));

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500 mb-1">
            Your journal
          </p>
          <h1 className="font-display italic font-bold text-bear-600 text-3xl leading-tight">
            {entries.length} check-in{entries.length !== 1 ? "s" : ""}
          </h1>
        </div>
        {entries.length > 0 && (
          <div className="flex -space-x-2">
            {entries.slice(0, 5).map((entry, i) => {
              const cfg = entry.sentimentLabel
                ? LABEL_CONFIG[entry.sentimentLabel]
                : null;
              if (!cfg) return null;
              return (
                <div
                  key={i}
                  className="rounded-full bg-white border border-bear-100 p-0.5 shadow-warm-sm"
                >
                  <EmotionBear emotion={cfg.emotion} size={28} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Progress preview (click to /progress) ────────────────────────── */}
      {entries.length > 0 && (
        <ProgressPreview
          trendData={trendData}
          distData={distData}
          calData={calData}
          totalEntries={entries.length}
          streak={streak}
        />
      )}

      {/* ── Entry list ────────────────────────────────────────────────────── */}
      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-bear-100 shadow-warm-sm">
          <BearMascot mood="sleepy" size={90} className="mx-auto mb-4" />
          <p className="font-display italic font-bold text-bear-600 text-xl mb-1">
            No entries yet
          </p>
          <p className="text-bear-400 text-sm mb-5">
            Complete your first check-in and it&apos;ll show up here.
          </p>
          <Link
            href="/checkin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-honey-500 hover:bg-honey-600 text-white font-bold text-sm transition-colors shadow-sm"
          >
            Start my first check-in →
          </Link>
        </div>
      ) : (
        <EntryList entries={entryItems} />
      )}
    </div>
  );
}
