import Link from "next/link";
import SentimentSparkline from "./SentimentSparkline";
import FlagBadge from "./FlagBadge";

interface MemberCardProps {
  id: string;
  name: string;
  email: string;
  checkedInToday: boolean;
  recentEntries: Array<{ sentimentScore: number | null; createdAt: string | Date }>;
  flagCount: number;
}

function lastSeenLabel(entries: Array<{ createdAt: string | Date }>): string | null {
  if (!entries.length) return "Never checked in";
  const last = new Date(entries[0].createdAt);
  const diffDays = Math.floor((Date.now() - last.getTime()) / 86_400_000);
  if (diffDays === 0) return null; // checked in today — handled by badge
  if (diffDays === 1) return "Last seen yesterday";
  if (diffDays <= 6) return `Last seen ${diffDays} days ago`;
  return `Last seen ${last.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function MemberCard({
  id,
  name,
  email,
  checkedInToday,
  recentEntries,
  flagCount,
}: MemberCardProps) {
  const lastSeen = lastSeenLabel(recentEntries);
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Link
      href={`/members/${id}`}
      className="block bg-white rounded-2xl border border-bear-100 p-4 hover:shadow-warm hover:border-bear-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-bear-100 group-hover:bg-bear-200 flex items-center justify-center text-bear-600 font-bold text-sm transition-colors flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-bold text-bear-600 text-sm group-hover:text-bear-700 transition-colors">{name}</p>
            <p className="text-bear-300 text-xs">{email}</p>
            {!checkedInToday && lastSeen && (
              <p className="text-peach-400 text-[11px] font-semibold mt-0.5">{lastSeen}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <FlagBadge count={flagCount} />
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              checkedInToday
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-peach-100 text-peach-400 border-peach-200"
            }`}
          >
            {checkedInToday ? "✓ Today" : "Pending"}
          </span>
        </div>
      </div>

      <SentimentSparkline data={recentEntries} height={52} />
      <p className="text-bear-300 text-[10px] mt-1 text-right font-semibold uppercase tracking-wide">7-day mood</p>
    </Link>
  );
}
