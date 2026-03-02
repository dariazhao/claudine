"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mini kawaii bear faces as SVG — inspired by the dumpling icon style
function MiniBear({ expression, selected }: { expression: string; selected: boolean }) {
  const faces: Record<string, React.ReactNode> = {
    joyful: (
      // ^ arch eyes
      <>
        <path d="M 18 23 Q 23 17 28 23" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 32 23 Q 37 17 42 23" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="18" cy="35" r="5" fill="#f4a0b0" opacity="0.5" />
        <circle cx="42" cy="35" r="5" fill="#f4a0b0" opacity="0.5" />
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848" />
        <path d="M 22 39 Q 30 47 38 39" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ),
    happy: (
      <>
        <circle cx="22" cy="24" r="3.5" fill="#1a0a00" />
        <circle cx="38" cy="24" r="3.5" fill="#1a0a00" />
        <circle cx="23.5" cy="22.5" r="1.2" fill="white" />
        <circle cx="39.5" cy="22.5" r="1.2" fill="white" />
        <circle cx="17" cy="34" r="5" fill="#f4a0b0" opacity="0.45" />
        <circle cx="43" cy="34" r="5" fill="#f4a0b0" opacity="0.45" />
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848" />
        <path d="M 22 39 Q 30 46 38 39" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ),
    calm: (
      // gentle half-moon eyes
      <>
        <path d="M 18 24 Q 22 29 27 24" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
        <path d="M 33 24 Q 37 29 42 24" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
        <circle cx="17" cy="34" r="4" fill="#f4a0b0" opacity="0.35" />
        <circle cx="43" cy="34" r="4" fill="#f4a0b0" opacity="0.35" />
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848" />
        <path d="M 23 39 Q 30 44 37 39" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ),
    sleepy: (
      <>
        <path d="M 18 25 Q 22 30 27 25" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
        <path d="M 33 25 Q 37 30 42 25" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
        <circle cx="17" cy="34" r="4" fill="#f4a0b0" opacity="0.25" />
        <circle cx="43" cy="34" r="4" fill="#f4a0b0" opacity="0.25" />
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848" />
        <path d="M 25 40 Q 30 44 35 40" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <text x="40" y="18" fontSize="7" fill="#c8956c" fontWeight="bold" opacity="0.8">z</text>
      </>
    ),
    worried: (
      <>
        <circle cx="22" cy="25" r="3" fill="#1a0a00" />
        <circle cx="38" cy="25" r="3" fill="#1a0a00" />
        <circle cx="23" cy="23.5" r="1" fill="white" />
        <circle cx="39" cy="23.5" r="1" fill="white" />
        <path d="M 17 18 Q 22 15 27 19" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 33 19 Q 38 15 43 18" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="17" cy="34" r="4" fill="#f4a0b0" opacity="0.2" />
        <circle cx="43" cy="34" r="4" fill="#f4a0b0" opacity="0.2" />
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848" />
        <path d="M 22 41 Q 27 37 30 39 Q 33 41 38 37" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <circle cx="22" cy="25" r="3.5" fill="#1a0a00" />
        <circle cx="38" cy="25" r="3.5" fill="#1a0a00" />
        <circle cx="23.5" cy="23.5" r="1.2" fill="white" />
        <circle cx="39.5" cy="23.5" r="1.2" fill="white" />
        <circle cx="17" cy="34" r="4" fill="#f4a0b0" opacity="0.2" />
        <circle cx="43" cy="34" r="4" fill="#f4a0b0" opacity="0.2" />
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848" />
        <path d="M 22 43 Q 30 37 38 43" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* little tear */}
        <ellipse cx="43" cy="31" rx="1.5" ry="2.5" fill="#93c5fd" opacity="0.8" />
      </>
    ),
    excited: (
      // Star eyes!
      <>
        <text x="16" y="29" fontSize="11" fill="#f59e0b">★</text>
        <text x="32" y="29" fontSize="11" fill="#f59e0b">★</text>
        <circle cx="17" cy="35" r="5" fill="#f4a0b0" opacity="0.6" />
        <circle cx="43" cy="35" r="5" fill="#f4a0b0" opacity="0.6" />
        <ellipse cx="30" cy="34" rx="3" ry="2" fill="#b07848" />
        <path d="M 21 40 Q 30 49 39 40" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ),
    frustrated: (
      <>
        <circle cx="22" cy="26" r="3.5" fill="#1a0a00" />
        <circle cx="38" cy="26" r="3.5" fill="#1a0a00" />
        {/* Strong angry brows */}
        <path d="M 16 17 L 27 21" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" />
        <path d="M 33 21 L 44 17" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" />
        <circle cx="17" cy="35" r="4" fill="#f4956b" opacity="0.4" />
        <circle cx="43" cy="35" r="4" fill="#f4956b" opacity="0.4" />
        <ellipse cx="30" cy="34" rx="3" ry="2" fill="#b07848" />
        <path d="M 22 43 Q 30 38 38 43" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* steam puffs */}
        <text x="42" y="12" fontSize="8" fill="#f4956b" opacity="0.7">~</text>
        <text x="47" y="7"  fontSize="6" fill="#f4956b" opacity="0.5">~</text>
      </>
    ),
  };

  return (
    <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
      {/* Ears */}
      <circle cx="11" cy="13" r="9"  fill={selected ? "#a07050" : "#c8956c"} />
      <circle cx="11" cy="13" r="5.5" fill="#e8c4a0" />
      <circle cx="49" cy="13" r="9"  fill={selected ? "#a07050" : "#c8956c"} />
      <circle cx="49" cy="13" r="5.5" fill="#e8c4a0" />
      {/* Head */}
      <circle cx="30" cy="30" r="24" fill={selected ? "#a07050" : "#c8956c"} />
      {/* Muzzle */}
      <ellipse cx="30" cy="38" rx="12" ry="9" fill="#e8c4a0" />
      {/* Face */}
      {faces[expression]}
    </svg>
  );
}

const MOODS = [
  { expression: "joyful",     label: "Joyful",     value: "joyful" },
  { expression: "happy",      label: "Happy",      value: "happy" },
  { expression: "calm",       label: "Calm",       value: "calm" },
  { expression: "sleepy",     label: "Tired",      value: "sleepy" },
  { expression: "worried",    label: "Worried",    value: "worried" },
  { expression: "sad",        label: "Sad",        value: "sad" },
  { expression: "excited",    label: "Excited",    value: "excited" },
  { expression: "frustrated", label: "Frustrated", value: "frustrated" },
];

interface JournalFormProps {
  promptId: string;
}

export default function JournalForm({ promptId }: JournalFormProps) {
  const [body, setBody] = useState("");
  const [moodValue, setMoodValue] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const progress = Math.min(100, (body.length / 30) * 100); // encourage at least ~30 chars

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, moodEmoji: moodValue ?? null, promptId }),
      });

      if (res.status === 409) { router.push("/checkin/done?already=true"); return; }
      if (!res.ok) throw new Error("Server error");
      router.push("/checkin/done");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood selector — big round bear faces */}
      <div>
        <p className="text-sm font-bold text-bear-400 mb-3">
          How are you feeling right now? (optional)
        </p>
        <div className="grid grid-cols-4 gap-3">
          {MOODS.map((m) => {
            const selected = moodValue === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setMoodValue(selected ? null : m.value)}
                className={`flex flex-col items-center gap-1 py-2 rounded-2xl border-2 transition-all duration-150 ${
                  selected
                    ? "border-honey-500 bg-honey-50 scale-105 shadow-sm"
                    : "border-bear-100 bg-white hover:border-bear-200 hover:bg-cream-50"
                }`}
                aria-pressed={selected}
                aria-label={m.label}
              >
                <MiniBear expression={m.expression} selected={selected} />
                <span className={`text-xs font-bold ${selected ? "text-honey-600" : "text-bear-400"}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text area with live progress */}
      <div>
        <label htmlFor="journal-body" className="block text-sm font-bold text-bear-400 mb-2">
          Your thoughts
        </label>

        {/* Progress bar */}
        <div className="h-1 w-full bg-cream-200 rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-honey-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <textarea
          id="journal-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          placeholder="Take a moment to reflect… there's no wrong answer 🐾"
          className="w-full px-4 py-3 rounded-2xl border-2 border-bear-100 bg-cream-50 text-bear-600 placeholder-bear-200 focus:outline-none focus:border-honey-400 resize-none text-base leading-relaxed transition-colors"
        />
        <p className="text-xs text-bear-200 mt-1 text-right">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </p>
      </div>

      {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

      {/* Submit — full-width, prominent */}
      <button
        type="submit"
        disabled={status === "loading" || !body.trim()}
        className="w-full py-4 bg-honey-500 hover:bg-honey-600 active:scale-95 text-white font-extrabold rounded-2xl text-lg transition-all disabled:opacity-50 shadow-sm"
      >
        {status === "loading" ? "Saving… 🍯" : "Submit check-in 🐾"}
      </button>
    </form>
  );
}
