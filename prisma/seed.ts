import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const prompts = [
  // connection
  { body: "Who made you smile or laugh recently? What happened?", category: "connection", sortOrder: 1 },
  { body: "Is there someone you've been thinking about but haven't talked to in a while?", category: "connection", sortOrder: 2 },
  { body: "What's something kind someone did for you this week?", category: "connection", sortOrder: 3 },
  { body: "Tell me about a conversation that stuck with you lately.", category: "connection", sortOrder: 4 },
  { body: "Who would you love to have a cup of tea with right now, and why?", category: "connection", sortOrder: 5 },
  { body: "Is there someone you'd like to reconnect with? What's holding you back?", category: "connection", sortOrder: 6 },

  // gratitude
  { body: "What's one small thing that went well today (or yesterday)?", category: "gratitude", sortOrder: 7 },
  { body: "What's something about your home or surroundings you appreciate?", category: "gratitude", sortOrder: 8 },
  { body: "Name three things — big or tiny — that you're grateful for right now.", category: "gratitude", sortOrder: 9 },
  { body: "What season or kind of weather makes you happiest, and why?", category: "gratitude", sortOrder: 10 },
  { body: "What's a skill or ability you have that you sometimes take for granted?", category: "gratitude", sortOrder: 11 },
  { body: "What's a piece of music, a book, or a show that's bringing you joy lately?", category: "gratitude", sortOrder: 12 },

  // body
  { body: "How has your sleep been this week? Any dreams worth sharing?", category: "body", sortOrder: 13 },
  { body: "What did you eat or drink today that felt nourishing?", category: "body", sortOrder: 14 },
  { body: "How is your body feeling right now — any tension, energy, tiredness?", category: "body", sortOrder: 15 },
  { body: "Did you spend any time outside today? How did it feel?", category: "body", sortOrder: 16 },
  { body: "What's one thing you could do today to be kind to your body?", category: "body", sortOrder: 17 },
  { body: "How have your energy levels been lately — steady, up-and-down, or flat?", category: "body", sortOrder: 18 },

  // memory
  { body: "What's a happy memory that came to mind recently?", category: "memory", sortOrder: 19 },
  { body: "Describe a place that always makes you feel safe or peaceful.", category: "memory", sortOrder: 20 },
  { body: "What's something you used to love doing that you haven't done in a while?", category: "memory", sortOrder: 21 },
  { body: "Think of a time you overcame something hard. What helped you through it?", category: "memory", sortOrder: 22 },
  { body: "What's a tradition or ritual — big or small — that means a lot to you?", category: "memory", sortOrder: 23 },
  { body: "If you could relive one day from the past year, which would it be and why?", category: "memory", sortOrder: 24 },

  // daily
  { body: "How are you feeling today, in three words?", category: "daily", sortOrder: 25 },
  { body: "What's on your mind most right now?", category: "daily", sortOrder: 26 },
  { body: "What are you looking forward to this week?", category: "daily", sortOrder: 27 },
  { body: "Is there anything weighing on you lately that you haven't had a chance to talk about?", category: "daily", sortOrder: 28 },
  { body: "What would make today feel like a good day?", category: "daily", sortOrder: 29 },
  { body: "What's one thing you'd like to do — or not do — differently tomorrow?", category: "daily", sortOrder: 30 },
  { body: "If today had a color, what would it be and why?", category: "daily", sortOrder: 31 },
  { body: "What's something you're proud of from the past few days?", category: "daily", sortOrder: 32 },
];

async function main() {
  console.log("Seeding prompts...");
  for (const prompt of prompts) {
    await prisma.prompt.upsert({
      where: { id: prompt.body.slice(0, 20) },
      update: {},
      create: prompt,
    });
  }


  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    console.log(`Creating admin user: ${adminEmail}`);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: Role.ADMIN },
      create: {
        email: adminEmail,
        name: "Daria",
        role: Role.ADMIN,
      },
    });
  }

  // Demo account
  console.log("Creating demobear account...");
  await prisma.user.upsert({
    where: { username: "demobear" },
    update: {},
    create: {
      email: "demobear@claudine.app",
      name: "Demo Bear",
      username: "demobear",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
