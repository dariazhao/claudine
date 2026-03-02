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

export default function MemberCard({
  id,
  name,
  email,
  checkedInToday,
  recentEntries,
  flagCount,
}: MemberCardProps) {
  return (
    <Link
      href={`/members/${id}`}
      className="block bg-white rounded-2xl border border-bear-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-bear-100 flex items-center justify-center text-bear-600 font-bold text-sm">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-bear-600 text-sm">{name}</p>
              <p className="text-bear-200 text-xs">{email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FlagBadge count={flagCount} />
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              checkedInToday
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-peach-100 text-peach-400 border border-peach-200"
            }`}
          >
            {checkedInToday ? "✓ Today" : "○ Pending"}
          </span>
        </div>
      </div>

      <SentimentSparkline data={recentEntries} height={48} />
      <p className="text-bear-200 text-xs mt-1 text-right">7-day mood</p>
    </Link>
  );
}
