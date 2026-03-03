"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmotionWheel from "@/components/checkin/EmotionWheel";

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
      {/* Mood selector — 16-emotion color wheel */}
      <div>
        <p className="text-sm font-bold text-bear-400 mb-1">
          How are you feeling right now? <span className="font-normal text-bear-200">(optional)</span>
        </p>
        <EmotionWheel value={moodValue} onChange={setMoodValue} />
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
