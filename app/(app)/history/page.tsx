import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { SentimentLabel } from "@prisma/client";

const LABEL_COLORS: Record<SentimentLabel, string> = {
  JOYFUL: "bg-honey-50 text-honey-600 border-honey-400/40",
  POSITIVE: "bg-green-50 text-green-700 border-green-200",
  NEUTRAL: "bg-bear-50 text-bear-400 border-bear-100",
  CONCERNED: "bg-peach-100 text-peach-400 border-peach-200",
  DISTRESSED: "bg-red-50 text-red-600 border-red-200",
};

const LABEL_EMOJI: Record<SentimentLabel, string> = {
  JOYFUL: "🌟",
  POSITIVE: "😊",
  NEUTRAL: "😌",
  CONCERNED: "😟",
  DISTRESSED: "😢",
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-bear-600">
          Your journal 📖
        </h1>
        <p className="text-bear-400 text-sm mt-1">
          {entries.length} check-in{entries.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-bear-100">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-bear-400 font-semibold">
            No check-ins yet. Complete your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-bear-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-bear-200 text-sm font-semibold">
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {entry.moodEmoji && (
                    <span className="text-xl">{entry.moodEmoji}</span>
                  )}
                  {entry.sentimentLabel && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full border ${
                        LABEL_COLORS[entry.sentimentLabel]
                      }`}
                    >
                      {LABEL_EMOJI[entry.sentimentLabel]}{" "}
                      {entry.sentimentLabel.charAt(0) +
                        entry.sentimentLabel.slice(1).toLowerCase()}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-bear-400 text-xs italic mb-2 line-clamp-1">
                &#8220;{entry.prompt.body}&#8221;
              </p>

              <p className="text-bear-600 leading-relaxed text-sm whitespace-pre-wrap">
                {entry.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
