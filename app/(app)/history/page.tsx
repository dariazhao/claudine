import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { SentimentLabel } from "@prisma/client";
import BearMascot from "@/components/bear/BearMascot";

const LABEL_CONFIG: Record<
  SentimentLabel,
  { border: string; badge: string; label: string; bear: string }
> = {
  JOYFUL:     { border: "border-l-honey-500",  badge: "bg-honey-50 text-honey-600 border-honey-400/40",    label: "Joyful",     bear: "✦" },
  POSITIVE:   { border: "border-l-green-400",  badge: "bg-green-50 text-green-700 border-green-200",       label: "Positive",   bear: "✦" },
  NEUTRAL:    { border: "border-l-bear-200",   badge: "bg-bear-50 text-bear-400 border-bear-100",          label: "Neutral",    bear: "✦" },
  CONCERNED:  { border: "border-l-peach-400",  badge: "bg-peach-100 text-peach-400 border-peach-200",      label: "Concerned",  bear: "✦" },
  DISTRESSED: { border: "border-l-red-400",    badge: "bg-red-50 text-red-600 border-red-200",             label: "Distressed", bear: "✦" },
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
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-bear-600">Your journal 📖</h1>
        <p className="text-bear-400 text-sm mt-1">
          {entries.length} check-in{entries.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-bear-100">
          <BearMascot mood="sleepy" size={90} className="mx-auto mb-4" />
          <p className="text-bear-600 font-bold text-lg mb-1">No entries yet!</p>
          <p className="text-bear-400 text-sm">Complete your first check-in and it'll show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const cfg = entry.sentimentLabel
              ? LABEL_CONFIG[entry.sentimentLabel]
              : null;

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl border border-bear-100 border-l-4 ${
                  cfg ? cfg.border : "border-l-bear-100"
                } p-5 shadow-sm`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-bear-200 text-xs font-bold uppercase tracking-wide">
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {cfg && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-bear-300 text-xs italic mb-2 leading-snug">
                  &#8220;{entry.prompt.body}&#8221;
                </p>

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
