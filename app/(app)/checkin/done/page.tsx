import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import BearMascot from "@/components/bear/BearMascot";
import AlreadyCheckedInBanner from "./AlreadyCheckedInBanner";

export default async function DonePage() {
  const session = await getSession();

  return (
    <div className="flex flex-col items-center text-center py-8">
      <BearMascot mood="celebrating" size={120} className="mb-4" />

      <h1 className="text-3xl font-extrabold text-bear-600 mb-2">
        Beary well done! 🎉
      </h1>

      <p className="text-bear-400 text-lg mb-2">
        Thanks for checking in{session.name ? `, ${session.name.split(" ")[0]}` : ""}!
      </p>

      <Suspense>
        <AlreadyCheckedInBanner />
      </Suspense>

      <div className="mt-4 bg-honey-50 border border-honey-400/30 rounded-2xl px-6 py-4 max-w-sm">
        <p className="text-honey-600 font-semibold text-base">
          🍯 Your check-in is saved. Come back tomorrow for a new prompt!
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/history"
          className="px-5 py-3 rounded-xl bg-bear-100 text-bear-600 font-bold hover:bg-bear-200 transition-colors text-sm"
        >
          View my history 📖
        </Link>
      </div>
    </div>
  );
}
