import crypto from "crypto";
import { prisma } from "@/lib/db";

export function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function generateToken(userId: string): Promise<string> {
  const raw = crypto.randomBytes(32).toString("hex");
  const hashed = hashToken(raw);

  // Invalidate existing tokens for this user
  await prisma.magicToken.deleteMany({ where: { userId } });

  await prisma.magicToken.create({
    data: {
      token: hashed,
      userId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  });

  return raw;
}

export async function verifyToken(
  raw: string
): Promise<{ userId: string } | null> {
  const hashed = hashToken(raw);

  const record = await prisma.magicToken.findUnique({
    where: { token: hashed },
  });

  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expiresAt < new Date()) return null;

  await prisma.magicToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return { userId: record.userId };
}
