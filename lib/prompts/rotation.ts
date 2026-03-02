import { prisma } from "@/lib/db";

export async function getTodaysPrompt() {
  const prompts = await prisma.prompt.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  if (prompts.length === 0) return null;

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const index = dayIndex % prompts.length;
  return prompts[index];
}
