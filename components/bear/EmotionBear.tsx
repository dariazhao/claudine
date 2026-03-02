/**
 * EmotionBear — 16-emotion bear face component based on Plutchik's Wheel of Emotions.
 * Each emotion maps to a distinct SVG face expression.
 *
 * Usage:
 *   <EmotionBear emotion="joyful" size={64} />
 *   <EmotionBear emotion="overwhelmed" size={120} label />
 */

export type Emotion =
  | "ecstatic"
  | "joyful"
  | "excited"
  | "hopeful"
  | "content"
  | "calm"
  | "peaceful"
  | "tired"
  | "pensive"
  | "lonely"
  | "sad"
  | "afraid"
  | "worried"
  | "overwhelmed"
  | "frustrated"
  | "irritable";

export const EMOTION_LABELS: Record<Emotion, string> = {
  ecstatic:    "Ecstatic",
  joyful:      "Joyful",
  excited:     "Excited",
  hopeful:     "Hopeful",
  content:     "Content",
  calm:        "Calm",
  peaceful:    "Peaceful",
  tired:       "Tired",
  pensive:     "Pensive",
  lonely:      "Lonely",
  sad:         "Sad",
  afraid:      "Afraid",
  worried:     "Worried",
  overwhelmed: "Overwhelmed",
  frustrated:  "Frustrated",
  irritable:   "Irritable",
};

/** Plutchik color for each emotion — matches the wheel gradient ring */
export const EMOTION_COLORS: Record<Emotion, string> = {
  ecstatic:    "#fbbf24",
  joyful:      "#f59e0b",
  excited:     "#f97316",
  hopeful:     "#84cc16",
  content:     "#22c55e",
  calm:        "#14b8a6",
  peaceful:    "#06b6d4",
  tired:       "#94a3b8",
  pensive:     "#64748b",
  lonely:      "#3b82f6",
  sad:         "#2563eb",
  afraid:      "#6366f1",
  worried:     "#f97316",
  overwhelmed: "#ef4444",
  frustrated:  "#b91c1c",
  irritable:   "#f97316",
};

// ── Shared SVG layers ─────────────────────────────────────────────────────────

const BASE = (
  <>
    {/* Ears */}
    <circle cx="11" cy="13" r="9" fill="#c8956c" />
    <circle cx="11" cy="13" r="5.5" fill="#e8c4a0" />
    <circle cx="49" cy="13" r="9" fill="#c8956c" />
    <circle cx="49" cy="13" r="5.5" fill="#e8c4a0" />
    {/* Head */}
    <circle cx="30" cy="30" r="24" fill="#c8956c" />
    {/* Muzzle */}
    <ellipse cx="30" cy="38" rx="12" ry="9" fill="#e8c4a0" />
  </>
);

const NOSE = <ellipse cx="30" cy="33" rx="3" ry="2" fill="#b07848" />;

const BLUSH = (opacity = 0.45) => (
  <>
    <circle cx="17" cy="34" r="5" fill="#f4a0b0" opacity={opacity} />
    <circle cx="43" cy="34" r="5" fill="#f4a0b0" opacity={opacity} />
  </>
);

// ── Face expressions per emotion ──────────────────────────────────────────────

function FaceEcstatic() {
  return (
    <>
      {/* arch eyes */}
      <path d="M 14 22 Q 22 12 30 22" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 30 22 Q 38 12 46 22" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {BLUSH(0.6)}
      {NOSE}
      {/* big grin */}
      <path d="M 19 39 Q 30 50 41 39" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* sparkles */}
      <text x="8" y="14" fontSize="8" fill="#fbbf24" opacity="0.9">✦</text>
      <text x="42" y="14" fontSize="8" fill="#fbbf24" opacity="0.9">✦</text>
    </>
  );
}

function FaceJoyful() {
  return (
    <>
      {/* arch eyes */}
      <path d="M 18 23 Q 23 17 28 23" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 32 23 Q 37 17 42 23" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {BLUSH(0.5)}
      {NOSE}
      <path d="M 22 39 Q 30 47 38 39" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  );
}

function FaceExcited() {
  return (
    <>
      {/* star eyes */}
      <text x="16" y="29" fontSize="11" fill="#f59e0b">★</text>
      <text x="32" y="29" fontSize="11" fill="#f59e0b">★</text>
      {BLUSH(0.6)}
      {NOSE}
      <path d="M 21 40 Q 30 49 39 40" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  );
}

function FaceHopeful() {
  return (
    <>
      {/* upward dot eyes */}
      <circle cx="22" cy="26" r="3" fill="#1a0a00" />
      <circle cx="38" cy="26" r="3" fill="#1a0a00" />
      <circle cx="23" cy="24" r="1.2" fill="white" />
      <circle cx="39" cy="24" r="1.2" fill="white" />
      {BLUSH(0.35)}
      {NOSE}
      <path d="M 23 40 Q 30 45 37 40" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

function FaceContent() {
  return (
    <>
      {/* half-moon eyes */}
      <path d="M 18 24 Q 22 29 27 24" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
      <path d="M 33 24 Q 37 29 42 24" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
      {BLUSH(0.35)}
      {NOSE}
      <path d="M 23 40 Q 30 45 37 40" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

function FaceCalm() {
  return (
    <>
      <path d="M 18 24 Q 22 29 27 24" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
      <path d="M 33 24 Q 37 29 42 24" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
      {BLUSH(0.35)}
      {NOSE}
      <path d="M 23 39 Q 30 44 37 39" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  );
}

function FacePeaceful() {
  return (
    <>
      {/* very serene crescent eyes */}
      <path d="M 18 25 Q 22 29 27 25" stroke="#1a0a00" strokeWidth="2" fill="#1a0a00" strokeLinecap="round" />
      <path d="M 33 25 Q 37 29 42 25" stroke="#1a0a00" strokeWidth="2" fill="#1a0a00" strokeLinecap="round" />
      {BLUSH(0.2)}
      {NOSE}
      <path d="M 24 40 Q 30 43 36 40" stroke="#1a0a00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  );
}

function FaceTired() {
  return (
    <>
      <path d="M 18 25 Q 22 30 27 25" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
      <path d="M 33 25 Q 37 30 42 25" stroke="#1a0a00" strokeWidth="2.5" fill="#1a0a00" strokeLinecap="round" />
      {BLUSH(0.25)}
      {NOSE}
      <path d="M 25 40 Q 30 44 35 40" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* z's */}
      <text x="40" y="18" fontSize="7" fill="#c8956c" fontWeight="bold" opacity="0.8">z</text>
    </>
  );
}

function FacePensive() {
  return (
    <>
      {/* half-lidded ellipse eyes with inward brows */}
      <ellipse cx="22" cy="26" rx="3.5" ry="2" fill="#1a0a00" />
      <ellipse cx="38" cy="26" rx="3.5" ry="2" fill="#1a0a00" />
      <line x1="18" y1="23" x2="26" y2="24.5" stroke="#1a0a00" strokeWidth="1.5" />
      <line x1="34" y1="24.5" x2="42" y2="23" stroke="#1a0a00" strokeWidth="1.5" />
      {BLUSH(0.2)}
      {NOSE}
      <line x1="24" y1="41" x2="36" y2="41" stroke="#1a0a00" strokeWidth="1.8" strokeLinecap="round" />
    </>
  );
}

function FaceLonely() {
  return (
    <>
      <circle cx="22" cy="26" r="2.5" fill="#1a0a00" />
      <circle cx="38" cy="26" r="2.5" fill="#1a0a00" />
      <circle cx="22.5" cy="25" r="0.8" fill="white" />
      <circle cx="38.5" cy="25" r="0.8" fill="white" />
      {NOSE}
      {/* slight frown */}
      <path d="M 24 42 Q 30 37 36 42" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* teardrop */}
      <ellipse cx="38" cy="31" rx="1.2" ry="2" fill="#93c5fd" opacity="0.7" />
    </>
  );
}

function FaceSad() {
  return (
    <>
      <circle cx="22" cy="25" r="3.5" fill="#1a0a00" />
      <circle cx="38" cy="25" r="3.5" fill="#1a0a00" />
      <circle cx="23.5" cy="23.5" r="1.2" fill="white" />
      <circle cx="39.5" cy="23.5" r="1.2" fill="white" />
      {BLUSH(0.2)}
      {NOSE}
      <path d="M 22 43 Q 30 37 38 43" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* tear */}
      <ellipse cx="43" cy="31" rx="1.5" ry="2.5" fill="#93c5fd" opacity="0.8" />
    </>
  );
}

function FaceAfraid() {
  return (
    <>
      {/* wide circle eyes */}
      <circle cx="22" cy="25" r="5" fill="#1a0a00" />
      <circle cx="38" cy="25" r="5" fill="#1a0a00" />
      <circle cx="20" cy="23" r="2" fill="white" />
      <circle cx="36" cy="23" r="2" fill="white" />
      {/* raised brows */}
      <path d="M 15 18 Q 22 14 28 19" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 32 19 Q 38 14 45 18" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      {BLUSH(0.15)}
      {NOSE}
      {/* wavy mouth */}
      <path d="M 22 41 Q 24 38 27 41 Q 30 38 33 41 Q 36 38 38 41" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

function FaceWorried() {
  return (
    <>
      <circle cx="22" cy="25" r="3" fill="#1a0a00" />
      <circle cx="38" cy="25" r="3" fill="#1a0a00" />
      <circle cx="23" cy="23.5" r="1" fill="white" />
      <circle cx="39" cy="23.5" r="1" fill="white" />
      {/* furrowed brows */}
      <path d="M 17 18 Q 22 15 27 19" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 33 19 Q 38 15 43 18" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      {BLUSH(0.2)}
      {NOSE}
      <path d="M 22 41 Q 27 37 30 39 Q 33 41 38 37" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

function FaceOverwhelmed() {
  return (
    <>
      {/* huge eyes */}
      <circle cx="22" cy="25" r="5.5" fill="#1a0a00" />
      <circle cx="38" cy="25" r="5.5" fill="#1a0a00" />
      <circle cx="20" cy="22.5" r="2.2" fill="white" />
      <circle cx="36" cy="22.5" r="2.2" fill="white" />
      {/* high raised brows */}
      <path d="M 15 16 Q 22 12 28 17" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 32 17 Q 38 12 45 16" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {NOSE}
      {/* open O mouth */}
      <ellipse cx="30" cy="42" rx="4" ry="3" fill="#1a0a00" opacity="0.85" />
      {/* sweat drops */}
      <path d="M 36 19 L 38 14" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M 40 22 L 44 17" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </>
  );
}

function FaceFrustrated() {
  return (
    <>
      <circle cx="22" cy="26" r="3.5" fill="#1a0a00" />
      <circle cx="38" cy="26" r="3.5" fill="#1a0a00" />
      {/* thick angled brows */}
      <path d="M 16 17 L 27 21" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" />
      <path d="M 33 21 L 44 17" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" />
      <circle cx="17" cy="35" r="4" fill="#f4956b" opacity="0.4" />
      <circle cx="43" cy="35" r="4" fill="#f4956b" opacity="0.4" />
      {NOSE}
      <path d="M 22 43 Q 30 38 38 43" stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="42" y="12" fontSize="8" fill="#f4956b" opacity="0.7">~</text>
    </>
  );
}

function FaceIrritable() {
  return (
    <>
      <circle cx="22" cy="25" r="3.5" fill="#1a0a00" />
      <circle cx="38" cy="25" r="3.5" fill="#1a0a00" />
      {/* lighter angled brows */}
      <path d="M 16 18 L 27 21" stroke="#1a0a00" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 33 21 L 44 18" stroke="#1a0a00" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="17" cy="35" r="4" fill="#f4956b" opacity="0.3" />
      <circle cx="43" cy="35" r="4" fill="#f4956b" opacity="0.3" />
      {NOSE}
      {/* wavy slight frown */}
      <path d="M 23 42 Q 27 38 30 40 Q 33 42 37 38" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

const FACE_MAP: Record<Emotion, () => React.ReactElement> = {
  ecstatic:    FaceEcstatic,
  joyful:      FaceJoyful,
  excited:     FaceExcited,
  hopeful:     FaceHopeful,
  content:     FaceContent,
  calm:        FaceCalm,
  peaceful:    FacePeaceful,
  tired:       FaceTired,
  pensive:     FacePensive,
  lonely:      FaceLonely,
  sad:         FaceSad,
  afraid:      FaceAfraid,
  worried:     FaceWorried,
  overwhelmed: FaceOverwhelmed,
  frustrated:  FaceFrustrated,
  irritable:   FaceIrritable,
};

// ── Component ─────────────────────────────────────────────────────────────────

interface EmotionBearProps {
  emotion: Emotion;
  /** Rendered size in px (width & height). Default 60. */
  size?: number;
  /** Show the emotion label below the bear. */
  label?: boolean;
  className?: string;
}

export default function EmotionBear({
  emotion,
  size = 60,
  label = false,
  className = "",
}: EmotionBearProps) {
  const FaceComponent = FACE_MAP[emotion];
  const emotionLabel = EMOTION_LABELS[emotion];

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        aria-label={`${emotionLabel} bear`}
        role="img"
      >
        {BASE}
        <FaceComponent />
      </svg>
      {label && (
        <span className="text-xs font-semibold text-bear-400 leading-none">
          {emotionLabel}
        </span>
      )}
    </div>
  );
}
