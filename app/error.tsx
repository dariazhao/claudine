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
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <BearMascot mood="worried" size={100} className="mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-bear-600 mb-2">
          Oh honey, something went wrong!
        </h2>
        <p className="text-bear-400 mb-6">
          The bear tripped on something. Don&#39;t worry, these things happen.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-honey-500 text-white font-bold rounded-xl hover:bg-honey-600 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-bear-100 text-bear-600 font-bold rounded-xl hover:bg-bear-200 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
