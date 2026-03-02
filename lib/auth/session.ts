import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "claudine_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax" as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session.userId) {
    throw new Error("Not authenticated");
  }
  return session as SessionData;
}

export async function requireAdmin(): Promise<SessionData> {
  const user = await requireSession();
  if (user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return user;
}
