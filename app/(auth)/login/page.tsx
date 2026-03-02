"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

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
      <div className="text-center">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="text-2xl font-bold text-bear-600 mb-2">Check your inbox!</h2>
        <p className="text-bear-400 text-lg">
          We sent a sign-in link to <strong className="text-bear-600">{email}</strong>.<br />
          It expires in 15 minutes.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-honey-600 underline text-sm font-semibold">
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🐻</div>
        <h1 className="text-3xl font-extrabold text-bear-600 mb-1">Claudine</h1>
        <p className="text-bear-400 font-semibold">Your daily check-in companion</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-peach-100 border border-peach-200 rounded-xl text-bear-600 text-sm">
          {errorMessages[error] ?? "Something went wrong. Please try again."}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-bear-100 p-6">
        {/* Tab switcher */}
        <div className="flex rounded-xl bg-cream-100 p-1 mb-5">
          <button
            onClick={() => { setTab("password"); setStatus("idle"); setErrorMsg(""); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              tab === "password" ? "bg-white text-bear-600 shadow-sm" : "text-bear-200"
            }`}
          >
            🐾 Username
          </button>
          <button
            onClick={() => { setTab("magic"); setStatus("idle"); setErrorMsg(""); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              tab === "magic" ? "bg-white text-bear-600 shadow-sm" : "text-bear-200"
            }`}
          >
            🍯 Magic link
          </button>
        </div>

        {tab === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-bear-600 mb-1">
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
                className="w-full px-4 py-3 rounded-xl border border-bear-200 bg-cream-50 text-bear-600 placeholder-bear-200 focus:outline-none focus:ring-2 focus:ring-honey-400 text-base"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-bear-600 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secret word"
                className="w-full px-4 py-3 rounded-xl border border-bear-200 bg-cream-50 text-bear-600 placeholder-bear-200 focus:outline-none focus:ring-2 focus:ring-honey-400 text-base"
              />
            </div>
            {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-6 bg-honey-500 hover:bg-honey-600 text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-base"
            >
              {status === "loading" ? "Signing in..." : "Sign in 🐾"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <p className="text-bear-400 text-sm">Enter your email and we&#39;ll send you a sign-in link.</p>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-bear-600 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-bear-200 bg-cream-50 text-bear-600 placeholder-bear-200 focus:outline-none focus:ring-2 focus:ring-honey-400 text-base"
              />
            </div>
            {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-6 bg-honey-500 hover:bg-honey-600 text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-base"
            >
              {status === "loading" ? "Sending..." : "Send magic link 🍯"}
            </button>
          </form>
        )}
      </div>

      {process.env.NODE_ENV === "development" && <DevLoginButton />}

      <p className="text-center text-bear-200 text-xs mt-6">
        This app is invite-only. Contact{" "}
        <Link href="mailto:daria@example.com" className="underline">your admin</Link>{" "}
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
