"use client";

import { useState } from "react";
import EmotionBear, { Emotion } from "@/components/bear/EmotionBear";

const LABEL_CONFIG: Record<
  string,
  { border: string; badge: string; label: string; emotion: Emotion }
> = {
  JOYFUL:     { border: "border-l-honey-500",  badge: "bg-honey-50 text-honey-600 border-honey-300",   label: "Joyful",     emotion: "ecstatic" },
  POSITIVE:   { border: "border-l-green-400",  badge: "bg-green-50 text-green-700 border-green-200",   label: "Positive",   emotion: "hopeful"  },
  NEUTRAL:    { border: "border-l-bear-200",   badge: "bg-bear-50 text-bear-400 border-bear-100",      label: "Neutral",    emotion: "calm"     },
  CONCERNED:  { border: "border-l-peach-400",  badge: "bg-peach-100 text-peach-400 border-peach-200",  label: "Concerned",  emotion: "pensive"  },
  DISTRESSED: { border: "border-l-red-400",    badge: "bg-red-50 text-red-600 border-red-200",         label: "Distressed", emotion: "lonely"   },
};

const PAGE_SIZE = 10;

export interface EntryItem {
  id: string;
  createdAt: string; // ISO date string
  sentimentLabel: string | null;
  body: string;
  promptBody: string;
}

export default function EntryList({ entries }: { entries: EntryItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;
  const remaining = entries.length - visibleCount;

  return (
    <div className="space-y-3">
      {visible.map((entry) => {
        const cfg = entry.sentimentLabel ? LABEL_CONFIG[entry.sentimentLabel] : null;

        return (
          <div
            key={entry.id}
            className={`bg-white rounded-2xl border border-bear-100 border-l-4 ${
              cfg ? cfg.border : "border-l-bear-100"
            } p-5 shadow-warm-sm hover:shadow-warm transition-shadow`}
          >
            {/* Date + bear + badge */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                {cfg && <EmotionBear emotion={cfg.emotion} size={32} />}
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

            <p className="font-display italic text-bear-400 text-sm mb-2.5 leading-snug">
              &#8220;{entry.promptBody}&#8221;
            </p>

            <p className="text-bear-600 leading-relaxed text-sm whitespace-pre-wrap">
              {entry.body}
            </p>
          </div>
        );
      })}

      {hasMore && (
        <div className="text-center pt-2 pb-1">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-2xl border-2 border-bear-100 bg-white text-bear-400 font-bold text-sm hover:border-bear-200 hover:bg-cream-50 transition-colors"
          >
            Show {Math.min(PAGE_SIZE, remaining)} more
            {remaining > PAGE_SIZE ? ` (${remaining} left)` : ""}
          </button>
        </div>
      )}
    </div>
  );
}
