"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@prisma/client";

// ── Tab icons (minimal, filled when active) ──────────────────────────────────

function IconCheckin({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "0" : "2"}
      />
    </svg>
  );
}

function IconHistory({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

function IconDashboard({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

function IconMembers({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" fill={active ? "currentColor" : "none"} />
      <path d="M1 21v-2a7 7 0 0 1 11.95-4.95" />
      <circle cx="19" cy="15" r="3" fill={active ? "currentColor" : "none"} />
      <path d="M22 21v-1a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v1" />
    </svg>
  );
}

function IconFlags({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill={active ? "currentColor" : "none"} />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface AppNavProps {
  userName: string;
  role: Role;
  openFlagCount?: number;
}

export default function AppNav({ userName, role, openFlagCount = 0 }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const memberTabs = [
    { href: "/checkin", label: "Check-in", Icon: IconCheckin },
    { href: "/history", label: "Journal", Icon: IconHistory },
  ];

  const adminTabs = [
    { href: "/checkin", label: "Check-in", Icon: IconCheckin },
    { href: "/dashboard", label: "Overview", Icon: IconDashboard },
    { href: "/members", label: "Family", Icon: IconMembers },
    { href: "/flags", label: "Flags", Icon: IconFlags },
  ];

  const tabs = role === "ADMIN" ? adminTabs : memberTabs;
  const firstName = userName.split(" ")[0];

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-bear-100 sticky top-0 z-30 shadow-warm-sm">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href={role === "ADMIN" ? "/dashboard" : "/checkin"}
            className="font-display italic font-bold text-bear-600 text-xl tracking-tight"
          >
            Claudine
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {tabs.map(({ href, label, Icon }) => {
              const active = !!pathname?.startsWith(href);
              const showBadge = href === "/flags" && openFlagCount > 0;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    active
                      ? "bg-honey-50 text-honey-600"
                      : "text-bear-400 hover:bg-cream-100 hover:text-bear-600"
                  }`}
                >
                  <Icon active={active} />
                  <span>{label}</span>
                  {showBadge && (
                    <span className="ml-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                      {openFlagCount > 9 ? "9+" : openFlagCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User + sign out */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-bear-300 font-bold hidden sm:inline">
              Hi, {firstName} 🐾
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-bear-300 hover:text-bear-600 font-bold px-3 py-1.5 rounded-lg hover:bg-cream-100 transition-colors border border-transparent hover:border-bear-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ──────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-bear-100"
        style={{ boxShadow: "0 -2px 20px rgba(139,94,60,0.08)" }}
      >
        <div
          className="grid h-16 safe-area-inset-bottom"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
        >
          {tabs.map(({ href, label, Icon }) => {
            const active = !!pathname?.startsWith(href);
            const showBadge = href === "/flags" && openFlagCount > 0;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center justify-center gap-0.5 pt-1 transition-colors ${
                  active ? "text-honey-500" : "text-bear-300"
                }`}
              >
                <span className="relative">
                  <Icon active={active} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {openFlagCount > 9 ? "9+" : openFlagCount}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-bold tracking-wide leading-none">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
