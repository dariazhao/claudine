import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { analyzeSentiment } from "@/lib/ai/sentiment";
import { checkAndUpdateBaseline } from "@/lib/ai/anomaly";

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { body, moodEmoji, promptId } = await req.json();

    if (!body?.trim() || !promptId) {
      return NextResponse.json(
        { error: "body and promptId required" },
        { status: 400 }
      );
    }

    // Prevent duplicate check-ins on the same day
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const existing = await prisma.entry.findFirst({
      where: {
        userId: session.userId,
        createdAt: { gte: startOfDay },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "already_checked_in", entryId: existing.id },
        { status: 409 }
      );
    }

    // Verify prompt exists
    const prompt = await prisma.prompt.findUnique({ where: { id: promptId } });
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Run sentiment analysis
    const sentiment = await analyzeSentiment(body);

    // Check anomaly against baseline and update it
    const { isAnomaly, reason } = await checkAndUpdateBaseline(
      session.userId,
      sentiment.score
    );

    // Save entry
    const entry = await prisma.entry.create({
      data: {
        userId: session.userId,
        promptId,
        body: body.trim(),
        moodEmoji: moodEmoji ?? null,
        sentimentScore: sentiment.score,
        sentimentLabel: sentiment.label,
        sentimentRaw: { reasoning: sentiment.reasoning },
        isAnomaly,
        anomalyReason: reason,
        flaggedAt: isAnomaly ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, entryId: entry.id, isAnomaly });
  } catch (err) {
    console.error("[checkin]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
