import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dispatchReminder } from "@/lib/notifications/dispatcher";

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentHourUTC = now.getUTCHours();
    const currentMinuteUTC = now.getUTCMinutes();

    // Only send within first 5 minutes of the hour
    if (currentMinuteUTC > 5) {
      return NextResponse.json({ skipped: "not within send window" });
    }

    // Find users who haven't checked in today
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const usersWhoCheckedIn = await prisma.entry.findMany({
      where: { createdAt: { gte: startOfDay } },
      select: { userId: true },
    });
    const checkedInIds = new Set(usersWhoCheckedIn.map((e) => e.userId));

    // Get all active users
    const allUsers = await prisma.user.findMany({
      where: { notifyAppOnly: false },
    });

    const pendingUsers = allUsers.filter((u) => !checkedInIds.has(u.id));

    // Filter by reminder time matching current UTC hour
    // (simplified: match on hour only, ignoring timezone complexity for now)
    const usersToNotify = pendingUsers.filter((u) => {
      const [hh] = u.reminderTime.split(":").map(Number);
      // Basic timezone offset approximation
      // For production: use a proper timezone library
      return hh === currentHourUTC;
    });

    const results = await Promise.allSettled(
      usersToNotify.map((u) => dispatchReminder(u))
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      total: usersToNotify.length,
    });
  } catch (err) {
    console.error("[notifications/send]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
