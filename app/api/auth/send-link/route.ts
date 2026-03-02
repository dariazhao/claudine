import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/auth/magic-link";
import { sendMagicLink } from "@/lib/notifications/email";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Auto-promote admin email
    const isAdminEmail =
      process.env.ADMIN_EMAIL &&
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase().trim();

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Only allow pre-invited emails (or the admin email)
      if (!isAdminEmail) {
        // Return same response to avoid email enumeration
        return NextResponse.json({ ok: true });
      }

      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: "Daria",
          role: Role.ADMIN,
        },
      });
    } else if (isAdminEmail && user.role !== Role.ADMIN) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.ADMIN },
      });
      user = { ...user, role: Role.ADMIN };
    }

    const rawToken = await generateToken(user.id);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const link = `${appUrl}/verify?token=${rawToken}`;

    await sendMagicLink(user.email, user.name, link);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-link]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
