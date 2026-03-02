import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import BearMascot from "@/components/bear/BearMascot";
import EmotionBear from "@/components/bear/EmotionBear";
import AlreadyCheckedInBanner from "./AlreadyCheckedInBanner";

export default async function DonePage() {
  const session = await getSession();
  const firstName = session.name ? session.name.split(" ")[0] : null;

  return (
    <div className="page-enter flex flex-col items-center text-center py-10">
      {/* Glow + bears */}
      <div className="relative mb-6">
        <div className="pulse-glow absolute inset-0 bg-honey-400 blur-3xl rounded-full" />
        <BearMascot mood="celebrating" size={130} animate className="relative" />
      </div>

      <h1 className="text-3xl font-extrabold text-bear-600 mb-2">
        Beary well done{firstName ? `, ${firstName}` : ""}!
      </h1>

      <p className="text-bear-400 text-base mb-1">
        Thanks for checking in today.
      </p>

      <Suspense>
        <AlreadyCheckedInBanner />
      </Suspense>

      {/* Honey card */}
      <div className="mt-6 bg-honey-50 border border-honey-400/30 rounded-3xl px-6 py-5 max-w-xs w-full shadow-sm">
        <p className="text-honey-700 font-bold text-base leading-snug">
          Your check-in is saved 🍯
        </p>
        <p className="text-honey-600 text-sm mt-1">
          Come back tomorrow for a new prompt!
        </p>
      </div>

      {/* Mini emotion bear row */}
      <div className="mt-6 flex items-center gap-3">
        <EmotionBear emotion="ecstatic" size={40} />
        <EmotionBear emotion="joyful" size={32} />
        <EmotionBear emotion="excited" size={28} />
        <EmotionBear emotion="content" size={32} />
        <EmotionBear emotion="hopeful" size={40} />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bear-100 text-bear-600 font-extrabold hover:bg-bear-200 transition-colors text-sm"
        >
          <span>📖</span>
          <span>View my journal</span>
        </Link>
        <Link
          href="/checkin"
          className="text-bear-300 hover:text-bear-500 font-semibold text-sm transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
