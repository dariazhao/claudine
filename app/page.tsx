import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col page-enter">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* Floating bear */}
        <div className="relative mb-6">
          {/* Soft glow behind bear */}
          <div className="absolute inset-0 bg-honey-400 opacity-20 blur-3xl rounded-full scale-75" />
          <BearMascot mood="celebrating" size={140} animate />
        </div>

        <h1 className="text-5xl font-extrabold text-bear-600 mb-3 leading-tight">
          Claudine
        </h1>
        <p className="text-xl font-bold text-bear-400 mb-4">
          Your daily check-in companion
        </p>
        <p className="text-bear-400 text-base leading-relaxed mb-10 max-w-xs">
          A warm, gentle moment to reflect — and help the people who love you
          know you're doing okay.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2.5 px-10 py-4 bg-honey-500 hover:bg-honey-600 active:scale-95 text-white font-extrabold rounded-2xl text-lg transition-all shadow-md"
        >
          <span>Get started</span>
          <span className="text-xl">🐾</span>
        </Link>

        <p className="mt-4 text-bear-200 text-sm">
          Invite-only · takes 2 minutes a day
        </p>
      </div>

      {/* Feature cards */}
      <div className="px-6 pb-16 max-w-sm mx-auto w-full">
        <div className="space-y-3">
          {[
            {
              bear: "happy" as const,
              title: "A gentle question, every morning",
              desc: "One warm prompt a day — no pressure, no judgment. Just a moment for you.",
              bg: "bg-honey-50 border-honey-400/30",
            },
            {
              bear: "celebrating" as const,
              title: "Stay connected without calling",
              desc: "The people who care about you can check in quietly, from wherever they are.",
              bg: "bg-bear-50 border-bear-200",
            },
            {
              bear: "sleepy" as const,
              title: "Private and cozy",
              desc: "Your thoughts are yours. No social feed, no notifications for the world.",
              bg: "bg-cream-100 border-cream-200",
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${f.bg}`}
            >
              <BearMascot mood={f.bear} size={56} animate />
              <div>
                <p className="font-extrabold text-bear-600 text-sm">{f.title}</p>
                <p className="text-bear-400 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
