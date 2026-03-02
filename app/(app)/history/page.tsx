import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { SentimentLabel } from "@prisma/client";
import BearMascot from "@/components/bear/BearMascot";
import EmotionBear, { Emotion } from "@/components/bear/EmotionBear";
import Link from "next/link";

const LABEL_CONFIG: Record<
  SentimentLabel,
  {
    border: string;
    badge: string;
    label: string;
    emotion: Emotion;
  }
> = {
  JOYFUL:     { border: "border-l-honey-500",  badge: "bg-honey-50 text-honey-600 border-honey-300",  label: "Joyful",     emotion: "ecstatic"    },
  POSITIVE:   { border: "border-l-green-400",  badge: "bg-green-50 text-green-700 border-green-200",  label: "Positive",   emotion: "hopeful"     },
  NEUTRAL:    { border: "border-l-bear-200",   badge: "bg-bear-50 text-bear-400 border-bear-100",     label: "Neutral",    emotion: "calm"        },
  CONCERNED:  { border: "border-l-peach-400",  badge: "bg-peach-100 text-peach-400 border-peach-200", label: "Concerned",  emotion: "pensive"     },
  DISTRESSED: { border: "border-l-red-400",    badge: "bg-red-50 text-red-600 border-red-200",        label: "Distressed", emotion: "lonely"      },
};

export default async function HistoryPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const entries = await prisma.entry.findMany({
    where: { userId: session.userId },
    include: { prompt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
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
            {/* Mini parade of mood bears based on recent entries */}
            {entries.slice(0, 5).map((entry, i) => {
              const cfg = entry.sentimentLabel ? LABEL_CONFIG[entry.sentimentLabel] : null;
              if (!cfg) return null;
              return (
                <div key={i} className="rounded-full bg-white border border-bear-100 p-0.5 shadow-warm-sm">
                  <EmotionBear emotion={cfg.emotion} size={28} />
                </div>
              );
            })}
          </div>
        )}
      </div>

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
        <div className="space-y-3">
          {entries.map((entry) => {
            const cfg = entry.sentimentLabel
              ? LABEL_CONFIG[entry.sentimentLabel]
              : null;

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl border border-bear-100 border-l-4 ${
                  cfg ? cfg.border : "border-l-bear-100"
                } p-5 shadow-warm-sm hover:shadow-warm transition-shadow`}
              >
                {/* Date + badge + bear row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {cfg && (
                      <EmotionBear emotion={cfg.emotion} size={32} />
                    )}
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-bear-300">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {cfg && (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${cfg.badge}`}
                    >
                      {cfg.label}
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <p className="font-display italic text-bear-400 text-sm mb-2.5 leading-snug">
                  &#8220;{entry.prompt.body}&#8221;
                </p>

                {/* Entry body */}
                <p className="text-bear-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {entry.body}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
