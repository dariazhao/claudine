"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", emoji: "📊" },
  { href: "/members", label: "Members", emoji: "👥" },
  { href: "/flags", label: "Flags", emoji: "🚩" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 flex-shrink-0 hidden md:block">
      <nav className="bg-white rounded-2xl border border-bear-100 p-3 space-y-1 sticky top-24">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              pathname?.startsWith(link.href)
                ? "bg-honey-50 text-honey-600"
                : "text-bear-400 hover:bg-cream-100"
            }`}
          >
            <span>{link.emoji}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
