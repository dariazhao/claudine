"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkReviewedButton({ entryId }: { entryId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    await fetch("/api/admin/flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs font-bold px-3 py-1.5 bg-bear-100 text-bear-600 rounded-xl hover:bg-bear-200 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Mark reviewed"}
    </button>
  );
}
