import { SentimentLabel } from "@prisma/client";
import Link from "next/link";

const LABEL_EMOJI: Record<SentimentLabel, string> = {
  JOYFUL: "🌟",
  POSITIVE: "😊",
  NEUTRAL: "😌",
  CONCERNED: "😟",
  DISTRESSED: "😢",
};

const LABEL_COLORS: Record<SentimentLabel, string> = {
  JOYFUL: "bg-honey-50 text-honey-600",
  POSITIVE: "bg-green-50 text-green-700",
  NEUTRAL: "bg-bear-50 text-bear-400",
  CONCERNED: "bg-peach-100 text-peach-400",
  DISTRESSED: "bg-red-50 text-red-600",
};

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  sentimentLabel: SentimentLabel | null;
  isAnomaly: boolean;
  createdAt: Date | string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-bear-300 text-sm font-semibold">No check-ins yet today</p>
        <p className="text-bear-200 text-xs mt-1">Check back later 🍯</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-bear-100">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/members/${item.userId}`}
          className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-cream-50 -mx-1 px-1 rounded-xl transition-colors group ${
            item.isAnomaly ? "bg-red-50/60 hover:bg-red-50" : ""
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
            item.isAnomaly ? "bg-red-100 text-red-600" : "bg-bear-100 text-bear-600 group-hover:bg-bear-200"
          }`}>
            {item.userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-bear-600 truncate group-hover:text-bear-700">
              {item.userName}
            </p>
            <p className="text-xs text-bear-300">
              {new Date(item.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {item.sentimentLabel && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LABEL_COLORS[item.sentimentLabel]}`}>
                {LABEL_EMOJI[item.sentimentLabel]} {item.sentimentLabel.charAt(0) + item.sentimentLabel.slice(1).toLowerCase()}
              </span>
            )}
            {item.isAnomaly && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                🚩
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
