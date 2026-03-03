"use client";

import { useState } from "react";
import EmotionBear, {
  Emotion,
  EMOTION_LABELS,
  EMOTION_COLORS,
} from "@/components/bear/EmotionBear";

// Arranged in Plutchik wheel order: warm positives at top → cool neutrals → blues/purples → reds
const WHEEL_EMOTIONS: Emotion[] = [
  "ecstatic",
  "joyful",
  "excited",
  "hopeful",
  "content",
  "calm",
  "peaceful",
  "tired",
  "pensive",
  "lonely",
  "sad",
  "afraid",
  "worried",
  "overwhelmed",
  "frustrated",
  "irritable",
];

interface Props {
  value: string | null;
  onChange: (emotion: string | null) => void;
}

export default function EmotionWheel({ value, onChange }: Props) {
  const [hovered, setHovered] = useState<Emotion | null>(null);

  const N = WHEEL_EMOTIONS.length;
  const CX = 145;
  const CY = 145;
  const R = 108;
  const BEAR_SIZE = 38;

  const displayEmotion = (hovered ?? value) as Emotion | null;

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: 290, height: 310 }}
      aria-label="Emotion selector"
    >
      {/* Decorative color ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: R * 2 + BEAR_SIZE + 8,
          height: R * 2 + BEAR_SIZE + 8,
          left: CX - R - (BEAR_SIZE + 8) / 2,
          top: CY - R - (BEAR_SIZE + 8) / 2,
          background:
            "conic-gradient(#fbbf24 0deg, #f97316 45deg, #84cc16 90deg, #22c55e 135deg, #06b6d4 180deg, #3b82f6 225deg, #6366f1 270deg, #ef4444 315deg, #fbbf24 360deg)",
          opacity: 0.1,
        }}
      />

      {/* Center display */}
      <div
        className="absolute rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-200"
        style={{
          width: 76,
          height: 76,
          left: CX - 38,
          top: CY - 38,
          background: displayEmotion
            ? `${EMOTION_COLORS[displayEmotion]}18`
            : "#fdf8f0",
          border: `2px solid ${displayEmotion ? EMOTION_COLORS[displayEmotion] : "#e8c4a0"}`,
        }}
      >
        {displayEmotion ? (
          <EmotionBear emotion={displayEmotion} size={62} />
        ) : (
          <span className="text-2xl leading-none">🐾</span>
        )}
      </div>

      {/* Center label */}
      <div
        className="absolute text-center pointer-events-none"
        style={{ left: CX - 58, top: CY + 42, width: 116 }}
      >
        <p
          className="text-[11px] font-bold leading-tight transition-colors duration-150"
          style={{ color: displayEmotion ? EMOTION_COLORS[displayEmotion] : "#c8956c" }}
        >
          {displayEmotion ? EMOTION_LABELS[displayEmotion] : "How are you feeling?"}
        </p>
      </div>

      {/* Bear buttons in a ring */}
      {WHEEL_EMOTIONS.map((emotion, i) => {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
        const x = CX + R * Math.cos(angle);
        const y = CY + R * Math.sin(angle);
        const selected = value === emotion;
        const isHovered = hovered === emotion;
        const color = EMOTION_COLORS[emotion];
        const isDimmed = hovered !== null && !isHovered && !selected;

        return (
          <button
            key={emotion}
            type="button"
            onClick={() => onChange(selected ? null : emotion)}
            onMouseEnter={() => setHovered(emotion)}
            onMouseLeave={() => setHovered(null)}
            aria-label={EMOTION_LABELS[emotion]}
            aria-pressed={selected}
            className="absolute flex items-center justify-center"
            style={{
              left: x - BEAR_SIZE / 2 - 5,
              top: y - BEAR_SIZE / 2 - 5,
              width: BEAR_SIZE + 10,
              height: BEAR_SIZE + 10,
              borderRadius: "50%",
              border: `2.5px solid ${
                selected
                  ? color
                  : isHovered
                  ? color + "88"
                  : "transparent"
              }`,
              background: selected
                ? `${color}22`
                : isHovered
                ? `${color}11`
                : "transparent",
              transform: selected || isHovered ? "scale(1.18)" : "scale(1)",
              opacity: isDimmed ? 0.4 : 1,
              transition: "transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, background 0.12s ease",
              zIndex: selected || isHovered ? 10 : 1,
            }}
          >
            <EmotionBear emotion={emotion} size={BEAR_SIZE} />
          </button>
        );
      })}
    </div>
  );
}
