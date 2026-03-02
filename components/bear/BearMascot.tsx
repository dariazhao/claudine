export type BearMood = "happy" | "worried" | "sleepy" | "celebrating";

interface BearMascotProps {
  mood?: BearMood;
  size?: number;
  className?: string;
  animate?: boolean;
}

// Rosy cheek circles — always present, opacity varies by mood
function Cheeks({ opacity = 0.45 }: { opacity?: number }) {
  return (
    <>
      <circle cx="28" cy="57" r="8" fill="#f4a0b0" opacity={opacity} />
      <circle cx="72" cy="57" r="8" fill="#f4a0b0" opacity={opacity} />
    </>
  );
}

// Kawaii dot eyes with shine
function DotEyes({ sad = false }: { sad?: boolean }) {
  return (
    <>
      <circle cx="38" cy="47" r={sad ? 4 : 5} fill="#1a0a00" />
      <circle cx="62" cy="47" r={sad ? 4 : 5} fill="#1a0a00" />
      <circle cx="40.5" cy="44.5" r="2" fill="white" />
      <circle cx="64.5" cy="44.5" r="2" fill="white" />
    </>
  );
}

// Bear nose
function Nose() {
  return <ellipse cx="50" cy="56" rx="4.5" ry="3.5" fill="#b07848" />;
}

const MOOD_FACES: Record<BearMood, React.ReactNode> = {
  happy: (
    <>
      <DotEyes />
      <Cheeks opacity={0.45} />
      <Nose />
      {/* Wide open smile */}
      <path
        d="M 37 63 Q 50 76 63 63"
        stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
    </>
  ),

  celebrating: (
    <>
      {/* ^ arch eyes — dumpling-style kawaii joy */}
      <path d="M 31 49 Q 38 40 45 49" stroke="#1a0a00" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 55 49 Q 62 40 69 49" stroke="#1a0a00" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Cheeks opacity={0.65} />
      <Nose />
      {/* Big grin */}
      <path
        d="M 35 62 Q 50 78 65 62"
        stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      {/* Little star sparkles scattered around */}
      <text x="8"  y="22" fontSize="11" fill="#fbbf24" opacity="0.9">✦</text>
      <text x="78" y="18" fontSize="9"  fill="#f4956b" opacity="0.9">✦</text>
      <text x="4"  y="60" fontSize="7"  fill="#c8956c" opacity="0.8">✦</text>
      <text x="83" y="55" fontSize="8"  fill="#fbbf24" opacity="0.8">✦</text>
      <text x="42" y="10" fontSize="7"  fill="#f4a0b0" opacity="0.9">✦</text>
    </>
  ),

  sleepy: (
    <>
      {/* Half-moon droopy eyes — filled arcs */}
      <path d="M 32 46 Q 38 53 44 46" stroke="#1a0a00" strokeWidth="3" fill="#1a0a00" strokeLinecap="round" />
      <path d="M 56 46 Q 62 53 68 46" stroke="#1a0a00" strokeWidth="3" fill="#1a0a00" strokeLinecap="round" />
      <Cheeks opacity={0.28} />
      <Nose />
      {/* Soft small mouth */}
      <path
        d="M 44 64 Q 50 69 56 64"
        stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      {/* Z Z */}
      <text x="68" y="30" fontSize="10" fill="#c8956c" fontWeight="bold" opacity="0.75">z</text>
      <text x="75" y="20" fontSize="8"  fill="#c8956c" fontWeight="bold" opacity="0.5">z</text>
    </>
  ),

  worried: (
    <>
      <DotEyes sad />
      {/* Furrowed brows — angled inward */}
      <path d="M 30 37 Q 38 33 44 38" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 56 38 Q 62 33 70 37" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Cheeks opacity={0.2} />
      <Nose />
      {/* Wobbly worried mouth */}
      <path
        d="M 38 66 Q 44 61 50 63 Q 56 65 62 60"
        stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
    </>
  ),
};

const MOOD_ANIMATION: Record<BearMood, string> = {
  happy:       "bear-float",
  celebrating: "bear-wiggle",
  sleepy:      "bear-breathe",
  worried:     "bear-worried",
};

export default function BearMascot({
  mood = "happy",
  size = 100,
  className = "",
  animate = true,
}: BearMascotProps) {
  const animClass = animate ? MOOD_ANIMATION[mood] : "";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${animClass} ${className}`}
      aria-label={`Bear feeling ${mood}`}
      style={{ overflow: "visible" }}
    >
      {/* ── Ears ── */}
      <circle cx="21" cy="23" r="15" fill="#c8956c" />
      <circle cx="21" cy="23" r="10" fill="#e8c4a0" />
      <circle cx="79" cy="23" r="15" fill="#c8956c" />
      <circle cx="79" cy="23" r="10" fill="#e8c4a0" />

      {/* ── Head ── round, plump, dumpling-inspired */}
      <circle cx="50" cy="50" r="40" fill="#c8956c" />

      {/* ── Muzzle ── soft rounded patch */}
      <ellipse cx="50" cy="62" rx="20" ry="15" fill="#e8c4a0" />

      {/* ── Face details by mood ── */}
      {MOOD_FACES[mood]}
    </svg>
  );
}
