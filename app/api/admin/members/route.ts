import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      entries: {
        orderBy: { createdAt: "desc" },
        take: 7,
        select: {
          sentimentScore: true,
          sentimentLabel: true,
          createdAt: true,
          isAnomaly: true,
        },
      },
      baseline: true,
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return NextResponse.json(
    members.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role,
      avatarUrl: m.avatarUrl,
      checkedInToday: m.entries.some((e) => new Date(e.createdAt) >= today),
      recentEntries: m.entries,
      flagCount: m.entries.filter((e) => e.isAnomaly).length,
      baseline: m.baseline,
    }))
  );
}
