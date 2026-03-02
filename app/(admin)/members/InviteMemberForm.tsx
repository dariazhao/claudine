"use client";

import { useState } from "react";

export default function InviteMemberForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Server error");
      }
      setStatus("done");
      setForm({ name: "", email: "", username: "", password: "", phoneNumber: "" });
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to invite");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-honey-500 text-white rounded-xl font-bold text-sm hover:bg-honey-600 transition-colors"
      >
        + Invite member
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-bear-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-bear-600">Invite a family member</h3>
        <button onClick={() => setOpen(false)} className="text-bear-200 hover:text-bear-400 text-lg">✕</button>
      </div>

      {status === "done" ? (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-green-700 font-bold">Member added!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-bear-400 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-bear-100 text-bear-600 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="Grandma Rose"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-bear-400 mb-1">Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-bear-100 text-bear-600 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="rose@example.com"
            />
          </div>

          {/* Username login section */}
          <div className="border-t border-bear-100 pt-3 mt-1">
            <p className="text-xs font-bold text-bear-400 mb-2">🐾 Username login (optional but recommended)</p>
            <p className="text-xs text-bear-200 mb-3">
              Set a simple username and password so they can sign in without needing email.
            </p>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-bear-400 mb-1">Username</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, "") }))}
                  className="w-full px-3 py-2 rounded-xl border border-bear-100 text-bear-600 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
                  placeholder="mamabear"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-bear-400 mb-1">Password</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-bear-100 text-bear-600 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
                  placeholder="e.g. sunshine2024"
                />
                <p className="text-xs text-bear-200 mt-1">Keep it simple and memorable — they&#39;ll type this on their phone.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-bear-400 mb-1">Phone (optional, for SMS/WhatsApp reminders)</label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-bear-100 text-bear-600 text-sm focus:outline-none focus:ring-2 focus:ring-honey-400"
              placeholder="+12125551234"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-2.5 bg-honey-500 hover:bg-honey-600 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? "Adding..." : "Add member 🐻"}
          </button>
        </form>
      )}
    </div>
  );
}
