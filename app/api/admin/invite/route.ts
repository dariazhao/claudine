import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name, username, password, phoneNumber, notifySms, notifyWhatsapp, notifyEmail, reminderTime, timezone } =
    await req.json();

  if (!email || !name) {
    return NextResponse.json({ error: "email and name are required" }, { status: 400 });
  }

  // If username provided, password is required and vice versa
  if ((username && !password) || (!username && password)) {
    return NextResponse.json({ error: "Provide both username and password, or neither" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
  }

  if (username) {
    const takenUsername = await prisma.user.findUnique({ where: { username: username.toLowerCase().trim() } });
    if (takenUsername) {
      return NextResponse.json({ error: `Username "${username}" is already taken` }, { status: 409 });
    }
  }

  const passwordHash = password ? await bcrypt.hash(password, 12) : null;

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      name,
      username: username ? username.toLowerCase().trim() : null,
      passwordHash,
      phoneNumber: phoneNumber ?? null,
      notifyEmail: notifyEmail ?? true,
      notifySms: notifySms ?? false,
      notifyWhatsapp: notifyWhatsapp ?? false,
      reminderTime: reminderTime ?? "09:00",
      timezone: timezone ?? "America/New_York",
    },
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
