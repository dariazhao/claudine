import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Bear mascot */}
        <div className="flex justify-center mb-6">
          <BearMascot mood="happy" size={120} />
        </div>

        <h1 className="text-4xl font-extrabold text-bear-600 mb-2">
          Claudine
        </h1>
        <p className="text-bear-400 text-xl font-semibold mb-3">
          Your daily check-in companion 🍯
        </p>
        <p className="text-bear-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          A warm, gentle space to reflect on how you&#39;re doing — and stay
          connected with the people who care about you.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-honey-500 hover:bg-honey-600 text-white font-extrabold rounded-2xl text-lg transition-colors shadow-sm"
        >
          <span>Get started</span>
          <span>🐾</span>
        </Link>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            {
              emoji: "📝",
              label: "Daily prompts",
              desc: "A gentle question each morning",
            },
            {
              emoji: "🤗",
              label: "Stay connected",
              desc: "Your people know you care",
            },
            {
              emoji: "🔒",
              label: "Private & safe",
              desc: "Your thoughts, your space",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="bg-white rounded-2xl border border-bear-100 p-4"
            >
              <div className="text-2xl mb-2">{f.emoji}</div>
              <p className="text-bear-600 font-bold text-sm">{f.label}</p>
              <p className="text-bear-200 text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
