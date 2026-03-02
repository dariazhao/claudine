import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <BearMascot mood="sleepy" size={100} className="mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-bear-600 mb-2">
          404 — Couldn&#39;t find that!
        </h2>
        <p className="text-bear-400 mb-6">
          The bear looked everywhere but couldn&#39;t find this page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-honey-500 text-white font-bold rounded-xl hover:bg-honey-600 transition-colors"
        >
          Go home 🐾
        </Link>
      </div>
    </div>
  );
}
