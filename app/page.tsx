import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";

const FEATURES = [
  {
    bear: "happy" as const,
    title: "A gentle question, every morning",
    desc: "One warm prompt a day — no pressure, no judgment. Just a moment for you.",
  },
  {
    bear: "celebrating" as const,
    title: "Stay connected without calling",
    desc: "The people who love you can check in quietly, from wherever they are.",
  },
  {
    bear: "sleepy" as const,
    title: "Private and cozy",
    desc: "Your thoughts are yours. No social feed, no notifications for the world.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 page-enter">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center text-center px-6 pt-20 pb-16 overflow-hidden">
        {/* Background gradient bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Eyebrow */}
        <p className="relative z-10 text-xs font-bold uppercase tracking-[0.2em] text-honey-500 mb-8">
          invite-only · takes 2 minutes a day
        </p>

        {/* Bear */}
        <div className="relative z-10 mb-8">
          <div className="absolute inset-0 bg-honey-400 opacity-20 blur-3xl rounded-full scale-75" />
          <BearMascot mood="celebrating" size={148} animate />
        </div>

        {/* Display heading */}
        <h1 className="relative z-10 font-display italic font-bold text-bear-600 text-5xl leading-tight mb-4 max-w-sm">
          For the people<br />you love most
        </h1>

        <p className="relative z-10 text-bear-400 text-base leading-relaxed mb-10 max-w-xs">
          A warm daily moment to reflect — and help the people who care about you
          know you&apos;re doing okay.
        </p>

        <Link
          href="/login"
          className="relative z-10 inline-flex items-center gap-3 px-10 py-4 bg-honey-500 hover:bg-honey-600 active:scale-95 text-white font-extrabold rounded-2xl text-lg transition-all shadow-warm"
        >
          <span>Get started</span>
          <span className="text-xl">🐾</span>
        </Link>
      </div>

      {/* ── Feature list ─────────────────────────────────────────────────── */}
      <div className="px-6 pb-20 max-w-sm mx-auto w-full">
        <div className="space-y-px">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex items-center gap-5 py-6 ${
                i < FEATURES.length - 1 ? "border-b border-bear-100" : ""
              }`}
            >
              <div className="flex-shrink-0">
                <BearMascot mood={f.bear} size={52} animate />
              </div>
              <div>
                <p className="font-display italic font-bold text-bear-600 text-base leading-snug mb-0.5">
                  {f.title}
                </p>
                <p className="text-bear-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
