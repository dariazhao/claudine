"use client";

import { useEffect } from "react";
import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
      <div className="page-enter text-center max-w-sm w-full">
        <BearMascot mood="worried" size={110} animate className="mx-auto mb-5" />
        <h2 className="text-2xl font-extrabold text-bear-600 mb-2">
          Oh honey, something went wrong!
        </h2>
        <p className="text-bear-400 text-sm mb-7 leading-relaxed">
          The bear tripped on something. Don&#39;t worry, these things happen.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-honey-500 text-white font-extrabold rounded-2xl hover:bg-honey-600 active:scale-95 transition-all text-sm shadow-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-bear-100 text-bear-600 font-extrabold rounded-2xl hover:bg-bear-200 active:scale-95 transition-all text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
