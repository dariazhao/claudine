"use client";

import Link from "next/link";
import MoodTrendChart, { TrendPoint } from "./MoodTrendChart";
import MoodDistributionChart, { DistPoint } from "./MoodDistributionChart";
import StreakCalendar, { CalData } from "./StreakCalendar";

export interface ProgressPreviewProps {
  trendData: TrendPoint[];
  distData: DistPoint[];
  calData: CalData;
  totalEntries: number;
  streak: number;
}

export default function ProgressPreview({
  trendData,
  distData,
  calData,
  totalEntries,
  streak,
}: ProgressPreviewProps) {
  return (
    <Link
      href="/progress"
      className="block mb-8 bg-white border border-bear-100 rounded-3xl p-5 shadow-warm-sm hover:shadow-warm transition-all hover:-translate-y-0.5 group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-honey-500">
            Your progress
          </p>
          <p className="font-display italic font-bold text-bear-600 text-lg leading-tight mt-0.5">
            {totalEntries} check-in{totalEntries !== 1 ? "s" : ""}
            {streak > 0 && (
              <span className="text-honey-500"> · {streak}-day streak 🔥</span>
            )}
          </p>
        </div>
        <span className="text-bear-300 font-bold text-sm group-hover:text-honey-500 transition-colors">
          View all →
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Mini trend */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-bear-300 mb-1.5">
            Mood trend
          </p>
          <div className="h-24 bg-cream-50 rounded-xl overflow-hidden">
            <MoodTrendChart data={trendData.slice(-20)} compact />
          </div>
        </div>

        {/* Mini donut */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-bear-300 mb-1.5">
            Breakdown
          </p>
          <div className="h-24 bg-cream-50 rounded-xl overflow-hidden">
            <MoodDistributionChart data={distData} compact total={totalEntries} />
          </div>
        </div>

        {/* Mini calendar */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-bear-300 mb-1.5">
            Streaks
          </p>
          <div className="h-24 bg-cream-50 rounded-xl flex items-center justify-center overflow-hidden px-1">
            <StreakCalendar data={calData} compact />
          </div>
        </div>
      </div>
    </Link>
  );
}
