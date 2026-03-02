"use client";

import { useSearchParams } from "next/navigation";

export default function AlreadyCheckedInBanner() {
  const searchParams = useSearchParams();
  const already = searchParams.get("already");

  if (!already) return null;

  return (
    <p className="text-bear-400 text-sm mt-1">
      (You already checked in today — see you tomorrow! 🐾)
    </p>
  );
}
