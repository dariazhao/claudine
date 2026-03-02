import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import BearMascot from "@/components/bear/BearMascot";
import AlreadyCheckedInBanner from "./AlreadyCheckedInBanner";

export default async function DonePage() {
  const session = await getSession();
  const firstName = session.name ? session.name.split(" ")[0] : null;

  return (
    <div className="page-enter flex flex-col items-center text-center py-10">
      {/* Glow + bear */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-honey-400 opacity-20 blur-3xl rounded-full scale-75" />
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

      <div className="mt-8">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bear-100 text-bear-600 font-extrabold hover:bg-bear-200 transition-colors text-sm"
        >
          <span>📖</span>
          <span>View my journal</span>
        </Link>
      </div>
    </div>
  );
}
