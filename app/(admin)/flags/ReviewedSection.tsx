"use client";

import { useState } from "react";

interface ReviewedEntry {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  body: string;
}

export default function ReviewedSection({ entries }: { entries: ReviewedEntry[] }) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-base font-bold text-bear-300 hover:text-bear-500 transition-colors mb-3 group"
      >
        <span>Reviewed ({entries.length})</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-bear-100 rounded-2xl p-4 opacity-60"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-bear-400 text-sm">{entry.userName}</p>
                  <p className="text-bear-200 text-xs">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-bear-200 bg-bear-50 px-2 py-0.5 rounded-full border border-bear-100 flex-shrink-0">
                  ✓ Reviewed
                </span>
              </div>
              <p className="text-bear-400 text-sm mt-2 line-clamp-2">{entry.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
