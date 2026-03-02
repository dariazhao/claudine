import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/verify") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // iron-session needs a Response to set cookies — use a passthrough
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin guard
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/members") || pathname.startsWith("/flags")) {
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/checkin", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/checkin/:path*",
    "/history/:path*",
    "/dashboard/:path*",
    "/members/:path*",
    "/flags/:path*",
    "/api/checkin",
    "/api/prompts/:path*",
    "/api/admin/:path*",
  ],
};
