interface DailyPromptProps {
  body: string;
  category?: string | null;
}

const CATEGORY_EMOJI: Record<string, string> = {
  connection: "🤝",
  gratitude: "✨",
  body: "🌿",
  memory: "💭",
  daily: "☀️",
};

export default function DailyPrompt({ body, category }: DailyPromptProps) {
  const emoji = category ? (CATEGORY_EMOJI[category] ?? "🐾") : "🐾";

  return (
    <div className="relative bg-white rounded-2xl border border-bear-100 shadow-sm p-6 mb-6">
      {/* Speech bubble tail */}
      <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
      <div className="absolute -bottom-[14px] left-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-bear-100" style={{ zIndex: -1 }} />

      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{emoji}</span>
        <p className="text-bear-600 font-semibold text-lg leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}
