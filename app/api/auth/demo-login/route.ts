import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function POST() {
  const user = await prisma.user.findUnique({ where: { username: "demobear" } });

  if (!user) {
    return NextResponse.json({ error: "Demo account not set up yet" }, { status: 404 });
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  session.role = user.role;
  await session.save();

  return NextResponse.json({ ok: true });
}
