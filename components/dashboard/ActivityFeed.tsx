import { SentimentLabel } from "@prisma/client";

const LABEL_EMOJI: Record<SentimentLabel, string> = {
  JOYFUL: "🌟",
  POSITIVE: "😊",
  NEUTRAL: "😌",
  CONCERNED: "😟",
  DISTRESSED: "😢",
};

interface ActivityItem {
  id: string;
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
      <div className="text-center py-8 text-bear-200 text-sm">
        No check-ins yet today
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            item.isAnomaly
              ? "bg-red-50 border-red-200"
              : "bg-white border-bear-100"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-bear-100 flex items-center justify-center text-bear-600 font-bold text-xs flex-shrink-0">
            {item.userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-bear-600 truncate">
              {item.userName}
            </p>
            <p className="text-xs text-bear-200">
              {new Date(item.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {item.sentimentLabel && (
              <span className="text-lg">
                {LABEL_EMOJI[item.sentimentLabel]}
              </span>
            )}
            {item.isAnomaly && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                🚩 Flagged
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
