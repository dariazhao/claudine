"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@prisma/client";

interface AppNavProps {
  userName: string;
  role: Role;
}

export default function AppNav({ userName, role }: AppNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks =
    role === "ADMIN"
      ? [
          { href: "/checkin", label: "Check-in", emoji: "📝" },
          { href: "/dashboard", label: "Dashboard", emoji: "📊" },
          { href: "/flags", label: "Flags", emoji: "🚩" },
          { href: "/history", label: "History", emoji: "📖" },
        ]
      : [
          { href: "/checkin", label: "Check-in", emoji: "📝" },
          { href: "/history", label: "History", emoji: "📖" },
        ];

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  }

  return (
    <nav className="bg-white border-b border-bear-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
        <Link
          href={role === "ADMIN" ? "/dashboard" : "/checkin"}
          className="flex items-center gap-2 font-extrabold text-bear-600 text-lg"
        >
          <span>🐻</span>
          <span>Claudine</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname?.startsWith(link.href)
                  ? "bg-honey-50 text-honey-600"
                  : "text-bear-400 hover:bg-cream-100"
              }`}
            >
              <span>{link.emoji}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}

          <span className="ml-2 text-sm text-bear-200 hidden sm:inline">
            Hi, {userName.split(" ")[0]}!
          </span>

          <button
            onClick={handleSignOut}
            className="ml-1 px-2 py-2 rounded-xl text-xs text-bear-200 hover:bg-cream-100 hover:text-bear-400 transition-colors"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
