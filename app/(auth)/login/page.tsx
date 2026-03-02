"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import EmotionBear from "@/components/bear/EmotionBear";

function DemoBearButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/auth/demo-login", { method: "POST" });
    if (res.ok) {
      router.push("/checkin");
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full mt-3 py-3 px-6 bg-bear-100 hover:bg-bear-200 text-bear-600 font-bold rounded-xl transition-colors disabled:opacity-60 text-base border-2 border-dashed border-bear-200"
    >
      {loading ? "Loading..." : "🐻 Try as DemoBear"}
    </button>
  );
}

function DevLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    await fetch("/api/auth/dev-login", { method: "POST" });
    router.push("/dashboard");
  }

  return (
    <div className="mt-4 p-3 bg-bear-50 border border-bear-100 rounded-xl text-center">
      <p className="text-bear-200 text-xs mb-2">🛠️ Dev mode</p>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full py-2 bg-bear-400 hover:bg-bear-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in as admin (dev only)"}
      </button>
    </div>
  );
}

function LoginForm() {
  const [tab, setTab] = useState<"magic" | "password">("password");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(data.redirectTo ?? "/checkin");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  const errorMessages: Record<string, string> = {
    missing_token: "That link seems broken. Try requesting a new one.",
    invalid_token: "That link has expired or already been used. Please request a new one.",
    user_not_found: "We couldn't find your account. Please contact your admin.",
  };

  if (status === "sent") {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-3xl border border-bear-100 shadow-warm p-8 mb-4">
          <div className="flex items-center justify-center gap-2 mb-5">
            <EmotionBear emotion="excited" size={40} />
            <EmotionBear emotion="hopeful" size={56} />
            <EmotionBear emotion="peaceful" size={40} />
          </div>
          <h2 className="font-display italic font-bold text-2xl text-bear-600 mb-2">Check your inbox!</h2>
          <p className="text-bear-400 text-sm leading-relaxed">
            We sent a sign-in link to
          </p>
          <p className="font-bold text-bear-600 text-sm mt-0.5 mb-3 break-all">{email}</p>
          <div className="bg-cream-100 rounded-2xl px-4 py-3">
            <p className="text-bear-400 text-xs">Link expires in <strong className="text-bear-600">15 minutes</strong>. Check your spam folder if you don&apos;t see it.</p>
          </div>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="text-honey-600 hover:text-honey-700 text-sm font-bold underline underline-offset-2"
        >
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {/* Brand header */}
      <div className="text-center mb-7">
        <div className="flex items-end justify-center gap-1.5 mb-4">
          <EmotionBear emotion="worried" size={32} />
          <EmotionBear emotion="calm" size={40} />
          <EmotionBear emotion="hopeful" size={52} />
          <EmotionBear emotion="joyful" size={40} />
          <EmotionBear emotion="tired" size={32} />
        </div>
        <h1 className="font-display italic font-bold text-3xl text-bear-600 mb-1">Claudine</h1>
        <p className="text-bear-400 text-sm font-semibold">Your daily check-in companion</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-peach-100 border border-peach-200 rounded-2xl text-bear-600 text-sm">
          <span className="text-base flex-shrink-0">⚠️</span>
          <span>{errorMessages[error] ?? "Something went wrong. Please try again."}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-warm border border-bear-100 p-6">
        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-cream-100 p-1 mb-5">
          <button
            onClick={() => { setTab("password"); setStatus("idle"); setErrorMsg(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              tab === "password" ? "bg-white text-bear-600 shadow-sm" : "text-bear-300 hover:text-bear-500"
            }`}
          >
            Username
          </button>
          <button
            onClick={() => { setTab("magic"); setStatus("idle"); setErrorMsg(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              tab === "magic" ? "bg-white text-bear-600 shadow-sm" : "text-bear-300 hover:text-bear-500"
            }`}
          >
            Magic link
          </button>
        </div>

        {tab === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-[0.1em] text-bear-400 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. mamabear"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full px-4 py-3 rounded-xl border border-bear-200 bg-cream-50 text-bear-600 placeholder-bear-300 focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent text-base transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.1em] text-bear-400 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secret word"
                className="w-full px-4 py-3 rounded-xl border border-bear-200 bg-cream-50 text-bear-600 placeholder-bear-300 focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent text-base transition-shadow"
              />
            </div>
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-peach-100 border border-peach-200 rounded-xl">
                <span className="text-sm">⚠️</span>
                <p className="text-bear-600 text-sm">{errorMsg}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-6 bg-honey-500 hover:bg-honey-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all disabled:opacity-60 text-base shadow-sm"
            >
              {status === "loading" ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <p className="text-bear-400 text-sm">Enter your email and we&apos;ll send you a one-click sign-in link.</p>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.1em] text-bear-400 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-bear-200 bg-cream-50 text-bear-600 placeholder-bear-300 focus:outline-none focus:ring-2 focus:ring-honey-400 focus:border-transparent text-base transition-shadow"
              />
            </div>
            {status === "error" && (
              <div className="flex items-center gap-2 p-3 bg-peach-100 border border-peach-200 rounded-xl">
                <span>⚠️</span>
                <p className="text-bear-600 text-sm">Something went wrong. Please try again.</p>
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-6 bg-honey-500 hover:bg-honey-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all disabled:opacity-60 text-base shadow-sm"
            >
              {status === "loading" ? "Sending…" : "Send magic link 🍯"}
            </button>
          </form>
        )}
      </div>

      <DemoBearButton />

      {process.env.NODE_ENV === "development" && <DevLoginButton />}

      <p className="text-center text-bear-300 text-xs mt-6">
        This app is invite-only. Contact{" "}
        <Link href="mailto:daria@example.com" className="text-honey-600 underline underline-offset-1">your admin</Link>{" "}
        to get access.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
