type BearMood = "happy" | "worried" | "sleepy" | "celebrating";

interface BearMascotProps {
  mood?: BearMood;
  size?: number;
  className?: string;
}

const MOOD_FACES: Record<BearMood, React.ReactNode> = {
  happy: (
    <>
      {/* eyes */}
      <ellipse cx="36" cy="48" rx="4" ry="4.5" fill="#3d2b1f" />
      <ellipse cx="64" cy="48" rx="4" ry="4.5" fill="#3d2b1f" />
      {/* shine */}
      <circle cx="38" cy="46" r="1.5" fill="white" />
      <circle cx="66" cy="46" r="1.5" fill="white" />
      {/* smile */}
      <path
        d="M 38 60 Q 50 72 62 60"
        stroke="#3d2b1f"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* nose */}
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#c8956c" />
    </>
  ),
  worried: (
    <>
      <ellipse cx="36" cy="48" rx="4" ry="4.5" fill="#3d2b1f" />
      <ellipse cx="64" cy="48" rx="4" ry="4.5" fill="#3d2b1f" />
      <circle cx="38" cy="46" r="1.5" fill="white" />
      <circle cx="66" cy="46" r="1.5" fill="white" />
      {/* worried brows */}
      <path
        d="M 30 41 Q 36 38 42 41"
        stroke="#3d2b1f"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 58 41 Q 64 38 70 41"
        stroke="#3d2b1f"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* sad mouth */}
      <path
        d="M 40 66 Q 50 60 60 66"
        stroke="#3d2b1f"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#c8956c" />
    </>
  ),
  sleepy: (
    <>
      {/* half-closed eyes */}
      <path
        d="M 32 48 Q 36 52 40 48"
        stroke="#3d2b1f"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 60 48 Q 64 52 68 48"
        stroke="#3d2b1f"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* zzz */}
      <text x="70" y="30" fontSize="10" fill="#c8956c" fontWeight="bold">
        z
      </text>
      <text x="76" y="22" fontSize="8" fill="#c8956c" fontWeight="bold">
        z
      </text>
      {/* small smile */}
      <path
        d="M 43 62 Q 50 68 57 62"
        stroke="#3d2b1f"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#c8956c" />
    </>
  ),
  celebrating: (
    <>
      <ellipse cx="36" cy="48" rx="4.5" ry="5" fill="#3d2b1f" />
      <ellipse cx="64" cy="48" rx="4.5" ry="5" fill="#3d2b1f" />
      <circle cx="38" cy="46" r="1.5" fill="white" />
      <circle cx="66" cy="46" r="1.5" fill="white" />
      {/* big grin */}
      <path
        d="M 35 60 Q 50 76 65 60"
        stroke="#3d2b1f"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#c8956c" />
      {/* confetti */}
      <circle cx="18" cy="25" r="3" fill="#fbbf24" />
      <circle cx="82" cy="20" r="2.5" fill="#f4956b" />
      <circle cx="12" cy="60" r="2" fill="#c8956c" />
      <circle cx="88" cy="55" r="3" fill="#fbbf24" />
      <rect x="20" y="70" width="5" height="5" rx="1" fill="#f59e0b" transform="rotate(20 22 72)" />
      <rect x="75" y="65" width="4" height="4" rx="1" fill="#fde8d8" transform="rotate(-15 77 67)" />
    </>
  ),
};

export default function BearMascot({
  mood = "happy",
  size = 100,
  className = "",
}: BearMascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label={`Bear mascot feeling ${mood}`}
    >
      {/* Ears */}
      <circle cx="22" cy="22" r="14" fill="#c8956c" />
      <circle cx="22" cy="22" r="9" fill="#f5d5b0" />
      <circle cx="78" cy="22" r="14" fill="#c8956c" />
      <circle cx="78" cy="22" r="9" fill="#f5d5b0" />

      {/* Head */}
      <circle cx="50" cy="50" r="38" fill="#c8956c" />

      {/* Face / muzzle */}
      <ellipse cx="50" cy="62" rx="18" ry="13" fill="#f5d5b0" />

      {/* Face features by mood */}
      {MOOD_FACES[mood]}
    </svg>
  );
}
