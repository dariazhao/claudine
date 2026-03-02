import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth/magic-link";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const rawToken = req.nextUrl.searchParams.get("token");

  if (!rawToken) {
    return NextResponse.redirect(
      new URL("/login?error=missing_token", req.url)
    );
  }

  const result = await verifyToken(rawToken);

  if (!result) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_token", req.url)
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: result.userId },
  });

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=user_not_found", req.url)
    );
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  session.role = user.role;
  await session.save();

  const redirectTo = user.role === "ADMIN" ? "/dashboard" : "/checkin";
  return NextResponse.redirect(new URL(redirectTo, req.url));
}
