import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { DEMO_ENTRIES } from "@/lib/demo-entries";
import { SentimentLabel } from "@prisma/client";

async function refreshDemoData(userId: string) {
  const prompts = await prisma.prompt.findMany({ where: { active: true } });
  const promptMap = new Map(prompts.map((p) => [p.body, p.id]));

  await prisma.$transaction(async (tx) => {
    await tx.entry.deleteMany({ where: { userId } });
    await tx.baseline.deleteMany({ where: { userId } });

    for (const e of DEMO_ENTRIES) {
      const promptId = promptMap.get(e.promptBody);
      if (!promptId) continue;

      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - e.daysAgo);
      createdAt.setUTCHours(9, 0, 0, 0);

      await tx.entry.create({
        data: {
          userId,
          promptId,
          body: e.body,
          moodEmoji: e.mood,
          sentimentScore: e.sentimentScore,
          sentimentLabel: e.sentimentLabel as SentimentLabel,
          sentimentRaw: { score: e.sentimentScore, label: e.sentimentLabel },
          isAnomaly: e.isAnomaly,
          anomalyReason: e.isAnomaly
            ? "Score significantly below established baseline (>2 standard deviations)"
            : null,
          flaggedAt: e.isAnomaly ? createdAt : null,
          createdAt,
        },
      });
    }

    const scores = DEMO_ENTRIES.map((e) => e.sentimentScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    await tx.baseline.upsert({
      where: { userId },
      update: { mean, stdDev, sampleCount: scores.length, updatedAt: new Date() },
      create: {
        userId,
        mean,
        stdDev,
        sampleCount: scores.length,
        windowDays: 14,
      },
    });
  });
}

export async function POST() {
  const user = await prisma.user.findUnique({ where: { username: "demobear" } });

  if (!user) {
    return NextResponse.json({ error: "Demo account not set up yet" }, { status: 404 });
  }

  // Check if demo data is stale (most recent entry older than 2 days ago)
  const mostRecent = await prisma.entry.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  twoDaysAgo.setHours(0, 0, 0, 0);

  if (!mostRecent || mostRecent.createdAt < twoDaysAgo) {
    await refreshDemoData(user.id);
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  session.role = user.role;
  await session.save();

  return NextResponse.json({ ok: true });
}
