"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😟", label: "Worried" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "🥰", label: "Loved" },
];

interface JournalFormProps {
  promptId: string;
}

export default function JournalForm({ promptId }: JournalFormProps) {
  const [body, setBody] = useState("");
  const [moodEmoji, setMoodEmoji] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, moodEmoji, promptId }),
      });

      if (res.status === 409) {
        router.push("/checkin/done?already=true");
        return;
      }

      if (!res.ok) {
        throw new Error("Server error");
      }

      router.push("/checkin/done");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mood selector */}
      <div>
        <p className="text-sm font-semibold text-bear-400 mb-2">
          How are you feeling right now? (optional)
        </p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.emoji}
              type="button"
              onClick={() =>
                setMoodEmoji(moodEmoji === m.emoji ? null : m.emoji)
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                moodEmoji === m.emoji
                  ? "border-honey-500 bg-honey-50 text-bear-600"
                  : "border-bear-100 bg-white text-bear-400 hover:border-bear-200"
              }`}
              aria-pressed={moodEmoji === m.emoji}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text area */}
      <div>
        <label
          htmlFor="journal-body"
          className="block text-sm font-semibold text-bear-400 mb-2"
        >
          Your thoughts
        </label>
        <textarea
          id="journal-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          placeholder="Take a moment to reflect... there's no wrong answer 🐾"
          className="w-full px-4 py-3 rounded-xl border border-bear-100 bg-cream-50 text-bear-600 placeholder-bear-200 focus:outline-none focus:ring-2 focus:ring-honey-400 resize-none text-base leading-relaxed"
        />
        <p className="text-xs text-bear-200 mt-1 text-right">
          {body.length} characters
        </p>
      </div>

      {errorMsg && (
        <p className="text-red-500 text-sm text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !body.trim()}
        className="w-full py-4 bg-honey-500 hover:bg-honey-600 text-white font-extrabold rounded-2xl text-lg transition-colors disabled:opacity-50 shadow-sm"
      >
        {status === "loading" ? "Saving… 🍯" : "Submit check-in 🐾"}
      </button>
    </form>
  );
}
