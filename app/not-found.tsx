import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
      <div className="page-enter text-center max-w-sm w-full">
        <BearMascot mood="sleepy" size={110} animate className="mx-auto mb-5" />
        <h2 className="text-2xl font-extrabold text-bear-600 mb-2">
          Page not found
        </h2>
        <p className="text-bear-400 text-sm mb-7 leading-relaxed">
          The bear looked everywhere but couldn&#39;t find this page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-honey-500 text-white font-extrabold rounded-2xl hover:bg-honey-600 active:scale-95 transition-all text-sm shadow-sm"
        >
          <span>🐾</span>
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}
