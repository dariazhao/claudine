import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient, SentimentLabel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DEMO_ENTRIES } from "../lib/demo-entries";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🐻 Seeding DemoBear data...");

  const demobear = await prisma.user.findFirst({
    where: { username: "demobear" },
  });
  if (!demobear) {
    console.error("DemoBear user not found. Run `npm run db:seed` first.");
    process.exit(1);
  }

  const prompts = await prisma.prompt.findMany({ where: { active: true } });
  const promptMap = new Map(prompts.map((p) => [p.body, p.id]));

  // Clear existing demo entries
  const existing = await prisma.entry.count({ where: { userId: demobear.id } });
  if (existing > 0) {
    console.log(`  Deleting ${existing} existing entries...`);
    await prisma.entry.deleteMany({ where: { userId: demobear.id } });
    await prisma.baseline.deleteMany({ where: { userId: demobear.id } });
  }

  let created = 0;
  for (const e of DEMO_ENTRIES) {
    const promptId = promptMap.get(e.promptBody);
    if (!promptId) {
      console.warn(`  ⚠ Prompt not found: "${e.promptBody.slice(0, 50)}..."`);
      continue;
    }

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - e.daysAgo);
    createdAt.setUTCHours(9, 0, 0, 0);

    await prisma.entry.create({
      data: {
        userId: demobear.id,
        promptId,
        body: e.body,
        moodEmoji: e.mood,
        sentimentScore: e.sentimentScore,
        sentimentLabel: e.sentimentLabel as SentimentLabel,
        sentimentRaw: { score: e.sentimentScore, label: e.sentimentLabel },
        isAnomaly: e.isAnomaly,
        anomalyReason: e.isAnomaly
          ? "Score significantly below established baseline (>2 standard deviations)"
          : null,
        flaggedAt: e.isAnomaly ? createdAt : null,
        createdAt,
      },
    });
    created++;
  }

  // Build baseline from all entries
  const scores = DEMO_ENTRIES.map((e) => e.sentimentScore);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  await prisma.baseline.upsert({
    where: { userId: demobear.id },
    update: { mean, stdDev, sampleCount: scores.length, updatedAt: new Date() },
    create: {
      userId: demobear.id,
      mean,
      stdDev,
      sampleCount: scores.length,
      windowDays: 14,
    },
  });

  console.log(`  ✅ Created ${created} entries`);
  console.log(
    `  📊 Baseline: mean=${mean.toFixed(2)}, stdDev=${stdDev.toFixed(2)}`
  );
  console.log(`  🚩 Flagged entries: ${DEMO_ENTRIES.filter((e) => e.isAnomaly).length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
