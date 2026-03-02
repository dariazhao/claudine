import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";
import EmotionBear, {
  Emotion,
  EMOTION_LABELS,
  EMOTION_COLORS,
} from "@/components/bear/EmotionBear";

const ALL_EMOTIONS: Emotion[] = [
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

const FEATURES = [
  {
    emotion: "joyful" as Emotion,
    tag: "Daily ritual",
    title: "A gentle question, every morning",
    desc: "One warm prompt a day — no pressure, no judgment. Just a cozy two-minute moment that's entirely yours.",
    bg: "bg-honey-50",
    border: "border-honey-200",
    tagColor: "text-honey-600 bg-honey-100 border-honey-200",
  },
  {
    emotion: "peaceful" as Emotion,
    tag: "Stay close",
    title: "Stay connected without calling",
    desc: "The people who love you can quietly see you checked in — from wherever they are in the world.",
    bg: "bg-peach-100/50",
    border: "border-peach-200",
    tagColor: "text-peach-400 bg-peach-100 border-peach-200",
  },
  {
    emotion: "calm" as Emotion,
    tag: "Privacy first",
    title: "Private and cozy, always",
    desc: "Your words stay yours. No social feed, no public posts — just a warm, invite-only space.",
    bg: "bg-bear-50",
    border: "border-bear-100",
    tagColor: "text-bear-400 bg-bear-100 border-bear-100",
  },
];

const STEPS = [
  {
    step: "01",
    emotion: "hopeful" as Emotion,
    title: "Open Claudine in the morning",
    desc: "A fresh daily prompt is waiting — just for you, no log-in hassle.",
  },
  {
    step: "02",
    emotion: "content" as Emotion,
    title: "Write how you're really feeling",
    desc: "Two minutes. No essays needed. Just what's on your heart right now.",
  },
  {
    step: "03",
    emotion: "ecstatic" as Emotion,
    title: "The people you love know you're okay",
    desc: "Your family gets a quiet signal that you've checked in. No drama, just warmth.",
  },
];

const QUOTES = [
  { emotion: "joyful" as Emotion, text: "Finally something that helps me feel closer to Mum without the guilt of not calling every day." },
  { emotion: "content" as Emotion, text: "My daughter and I have never felt more in sync. It's like a little hug every morning." },
  { emotion: "hopeful" as Emotion, text: "I love that I can see how everyone is doing without being intrusive about it." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 pt-5 pb-3 max-w-5xl mx-auto">
        <span className="font-display italic font-bold text-bear-600 text-xl tracking-tight">
          Claudine
        </span>
        <Link
          href="/login"
          className="text-sm font-bold text-bear-400 hover:text-bear-600 transition-colors"
        >
          Sign in →
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-10 pb-20 overflow-hidden">
        {/* Radial bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(251,191,36,0.20) 0%, rgba(253,252,249,0) 70%)",
          }}
        />

        {/* Floating decorative bears — desktop only */}
        <div className="absolute top-10 left-6 opacity-25 rotate-[-15deg] hidden md:block pointer-events-none">
          <EmotionBear emotion="excited" size={52} />
        </div>
        <div className="absolute top-16 right-8 opacity-25 rotate-[12deg] hidden md:block pointer-events-none">
          <EmotionBear emotion="hopeful" size={44} />
        </div>
        <div className="absolute bottom-12 left-10 opacity-20 rotate-[8deg] hidden md:block pointer-events-none">
          <EmotionBear emotion="peaceful" size={48} />
        </div>
        <div className="absolute bottom-16 right-6 opacity-20 rotate-[-10deg] hidden md:block pointer-events-none">
          <EmotionBear emotion="content" size={52} />
        </div>

        {/* Invite pill */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-honey-50 border border-honey-300 text-honey-600 text-xs font-bold tracking-wider uppercase mb-8 shadow-warm-sm">
          <span>✦</span>
          <span>Invite-only · 2 minutes a day</span>
          <span>✦</span>
        </div>

        {/* Hero bear with glow */}
        <div className="relative z-10 mb-8">
          <div className="pulse-glow absolute inset-0 bg-honey-400 blur-3xl rounded-full" />
          <BearMascot mood="celebrating" size={168} animate />
        </div>

        {/* Heading */}
        <h1 className="relative z-10 font-display italic font-bold text-bear-600 text-5xl sm:text-6xl leading-[1.1] mb-5 max-w-lg">
          For the people<br />you love most
        </h1>

        <p className="relative z-10 text-bear-400 text-base sm:text-lg leading-relaxed mb-10 max-w-sm">
          A warm daily moment to reflect — and let the people who care about you
          know you&apos;re doing okay.
        </p>

        {/* CTA */}
        <Link
          href="/login"
          className="relative z-10 inline-flex items-center gap-3 px-10 py-4 bg-honey-500 hover:bg-honey-600 active:scale-95 text-white font-extrabold rounded-2xl text-lg transition-all shadow-warm"
        >
          <span>Get started</span>
          <span className="text-xl">🐾</span>
        </Link>
        <p className="relative z-10 mt-4 text-xs text-bear-300 font-semibold">
          No sign-up form. Just a magic link in your inbox.
        </p>
      </section>

      {/* ── Bear Parade ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-bear-100 overflow-hidden">
        <div className="text-center mb-10 px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-500 mb-2">
            Feel everything
          </p>
          <h2 className="font-display italic font-bold text-bear-600 text-3xl sm:text-4xl">
            Every mood is welcome here
          </h2>
          <p className="text-bear-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
            Claudine understands the full spectrum — on the great days and the
            hard ones.
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling track — doubled for seamless loop */}
          <div
            className="marquee-track flex gap-4"
            style={{ width: "max-content" }}
          >
            {[...ALL_EMOTIONS, ...ALL_EMOTIONS].map((emotion, i) => (
              <div
                key={i}
                className="inline-flex flex-col items-center gap-2.5 px-5 py-5 rounded-2xl border transition-all hover:scale-105 cursor-default select-none"
                style={{
                  backgroundColor: `${EMOTION_COLORS[emotion]}18`,
                  borderColor: `${EMOTION_COLORS[emotion]}35`,
                }}
              >
                <EmotionBear emotion={emotion} size={76} />
                <span
                  className="text-xs font-bold tracking-wide"
                  style={{ color: EMOTION_COLORS[emotion] }}
                >
                  {EMOTION_LABELS[emotion]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-500 mb-2">
            Why Claudine
          </p>
          <h2 className="font-display italic font-bold text-bear-600 text-3xl sm:text-4xl">
            Simple, warm, and private
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`${f.bg} border ${f.border} rounded-3xl p-7 flex flex-col gap-5 hover:shadow-warm transition-all hover:-translate-y-1 fade-up-${i + 1}`}
            >
              <div className="flex items-start justify-between">
                <EmotionBear emotion={f.emotion} size={76} />
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${f.tagColor}`}
                >
                  {f.tag}
                </span>
              </div>
              <div>
                <h3 className="font-display italic font-bold text-bear-600 text-lg leading-snug mb-2">
                  {f.title}
                </h3>
                <p className="text-bear-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-bear-50 border-y border-bear-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-500 mb-2">
              The ritual
            </p>
            <h2 className="font-display italic font-bold text-bear-600 text-3xl sm:text-4xl">
              How it works
            </h2>
          </div>

          <div className="grid gap-10 sm:gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center text-center gap-5"
              >
                <div className="relative">
                  <span className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-honey-500 text-white text-xs font-black flex items-center justify-center shadow-warm-sm z-10">
                    {s.step}
                  </span>
                  <div className="bg-white rounded-2xl p-5 border border-bear-100 shadow-warm-sm">
                    <EmotionBear emotion={s.emotion} size={80} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-bear-600 text-base leading-snug mb-2">
                    {s.title}
                  </h3>
                  <p className="text-bear-400 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-honey-500 mb-2">
            From families
          </p>
          <h2 className="font-display italic font-bold text-bear-600 text-3xl sm:text-4xl">
            What they&apos;re saying
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="bg-white border border-bear-100 rounded-3xl p-6 shadow-warm-sm flex flex-col gap-4 hover:shadow-warm transition-shadow"
            >
              <EmotionBear emotion={q.emotion} size={52} />
              <p className="font-display italic text-bear-500 text-sm leading-relaxed">
                &ldquo;{q.text}&rdquo;
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-honey-400 text-xs">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 flex flex-col items-center text-center bg-white border-t border-bear-100">
        <div className="relative mb-8">
          <div className="pulse-glow absolute inset-0 bg-peach-400 blur-3xl rounded-full" />
          <EmotionBear emotion="joyful" size={100} className="relative" />
        </div>
        <h2 className="font-display italic font-bold text-bear-600 text-4xl sm:text-5xl leading-tight mb-5 max-w-sm">
          Ready to check in?
        </h2>
        <p className="text-bear-400 text-base mb-10 max-w-xs leading-relaxed">
          Join the families already sharing their mornings on Claudine.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-3 px-12 py-4 bg-honey-500 hover:bg-honey-600 active:scale-95 text-white font-extrabold rounded-2xl text-lg transition-all shadow-warm"
        >
          <span>Get started</span>
          <span className="text-xl">🐾</span>
        </Link>
        <p className="mt-4 text-xs text-bear-300 font-semibold">
          Invite-only. Ask a family member for your link.
        </p>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-bear-100 px-6 py-8 flex items-center justify-between max-w-5xl mx-auto">
        <span className="font-display italic font-bold text-bear-300 text-base">
          Claudine
        </span>
        <div className="flex items-center gap-3">
          <EmotionBear emotion="tired" size={28} />
          <p className="text-bear-300 text-xs font-semibold">
            Made with 🍯 for families
          </p>
        </div>
      </footer>
    </div>
  );
}
