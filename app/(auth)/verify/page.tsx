"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      router.replace(`/api/auth/verify?token=${token}`);
    } else {
      router.replace("/login?error=missing_token");
    }
  }, [token, router]);

  return (
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">🐻</div>
      <h2 className="text-xl font-bold text-bear-600 mb-2">
        Verifying your link…
      </h2>
      <p className="text-bear-400">Just a moment!</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
