import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const flags = await prisma.entry.findMany({
    where: { isAnomaly: true },
    include: {
      user: { select: { id: true, name: true, email: true } },
      prompt: { select: { body: true } },
    },
    orderBy: { flaggedAt: "desc" },
  });

  return NextResponse.json(flags);
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entryId } = await req.json();
  if (!entryId) {
    return NextResponse.json({ error: "entryId required" }, { status: 400 });
  }

  const updated = await prisma.entry.update({
    where: { id: entryId },
    data: { flagReviewed: true },
  });

  return NextResponse.json({ ok: true, id: updated.id });
}
