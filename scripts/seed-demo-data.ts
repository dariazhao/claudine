import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient, SentimentLabel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ENTRIES = [
  {
    daysAgo: 30,
    promptBody: "Who made you smile or laugh recently? What happened?",
    body: "My neighbor Margaret stopped by with tomatoes from her garden. We sat on the porch for two whole hours just talking — about the grandchildren, about when we were young. She brought photos of her newest great-grandchild. Eight pounds, two ounces, and already so alert! It reminded me how much joy a single afternoon visit can bring.",
    mood: "joyful",
    sentimentScore: 0.82,
    sentimentLabel: "JOYFUL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 29,
    promptBody: "What's one small thing that went well today (or yesterday)?",
    body: "I finished the scarf I've been knitting since October. Deep burgundy — Anya always said that color suits everyone. I'm going to mail it to her before the weather turns cold. Small thing, but finishing something feels good. The pile of yarn for a sweater is still staring at me from the corner, but one project at a time!",
    mood: "happy",
    sentimentScore: 0.61,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 28,
    promptBody: "How has your sleep been this week? Any dreams worth sharing?",
    body: "Sleeping better than last month, thank goodness. Had a funny dream about being back in the house I grew up in — the kitchen smelled exactly like my mother's apple cake. I woke up almost expecting to smell it. Eight hours most nights now. The new pillow helped.",
    mood: "calm",
    sentimentScore: 0.48,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 27,
    promptBody: "What's a happy memory that came to mind recently?",
    body: "I remembered the summer we all went to the lake — must have been 1987 or 1988. The children were young enough to think catching frogs was the greatest adventure. We didn't have much money that year but I can't remember feeling anything but rich. Those were good days. I should find those old photos.",
    mood: "joyful",
    sentimentScore: 0.79,
    sentimentLabel: "JOYFUL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 26,
    promptBody: "How are you feeling today, in three words?",
    body: "Peaceful, grateful, unhurried. Had my tea on the back steps this morning watching the cardinals at the feeder. The male one has been coming every day for weeks. I've started leaving sunflower seeds out especially for him. No particular reason to rush anywhere today, which is a luxury I don't take for granted.",
    mood: "happy",
    sentimentScore: 0.55,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 25,
    promptBody: "What's something kind someone did for you this week?",
    body: "The young man from down the street carried my groceries in without being asked. Just saw me struggling and appeared beside me. He didn't want anything for it — just smiled and went back to his house. I baked him a tin of shortbread to say thank you. People are mostly good if you let them be.",
    mood: "happy",
    sentimentScore: 0.65,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 24,
    promptBody: "Name three things — big or tiny — that you're grateful for right now.",
    body: "Hot water on a cold morning. The fact that my joints aren't hurting today — that's a gift! And the video call with the grandchildren last night — the little one showed me her drawing of a horse that looked more like a cloud with legs, and I told her it was the best horse I'd ever seen. She was so proud. Three isn't nearly enough.",
    mood: "joyful",
    sentimentScore: 0.78,
    sentimentLabel: "JOYFUL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 23,
    promptBody: "Did you spend any time outside today? How did it feel?",
    body: "Walked around the block twice when the sun came out. The air smelled like leaves and that particular cold that means autumn is actually here. My knees complained a bit on the second loop but I went anyway. Always feel clearer in the head after. Saw a neighbor I hadn't spoken to in months — we stopped and chatted.",
    mood: "calm",
    sentimentScore: 0.52,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 22,
    promptBody: "What's a piece of music, a book, or a show that's bringing you joy lately?",
    body: "I've been rereading the Mitford books. Started from the beginning again last week. They're comforting in a way that's hard to explain — like visiting old friends in a village where nothing terrible stays terrible. Also found an old record of Ella Fitzgerald and it's been playing most afternoons.",
    mood: "happy",
    sentimentScore: 0.60,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 21,
    promptBody: "How is your body feeling right now — any tension, energy, tiredness?",
    body: "A bit achy today, if I'm being honest. Knees mostly. Slept a little stiff. Nothing alarming, just the usual. Did my stretches this morning which helped some. Energy is okay, not great. Stayed in most of the day and watched the rain, which I didn't mind at all actually. Some days you just need to be still.",
    mood: "calm",
    sentimentScore: 0.15,
    sentimentLabel: "NEUTRAL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 20,
    promptBody: "What's on your mind most right now?",
    body: "Been thinking about my sister a lot this week. We haven't spoken since the spring. I keep picking up the phone and putting it back down. Not sure what I'd even say. These things get harder the longer you leave them. Maybe I'll write her a letter instead. That always felt easier.",
    mood: "sleepy",
    sentimentScore: 0.08,
    sentimentLabel: "NEUTRAL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 19,
    promptBody: "How have your energy levels been lately — steady, up-and-down, or flat?",
    body: "Honestly, a bit flat this week. Getting out of bed has taken more convincing than usual. I don't think it's anything serious — probably just the change in light as the days get shorter. I always feel it this time of year. Eating well and sleeping okay, just moving a little slower. It passes.",
    mood: "sleepy",
    sentimentScore: -0.05,
    sentimentLabel: "NEUTRAL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 18,
    promptBody: "Is there someone you've been thinking about but haven't talked to in a while?",
    body: "My old friend Patricia from work moved away six or seven years ago. We exchange Christmas cards but that's about it. I think of her more than she'd probably guess. She always knew how to make me laugh in the difficult meetings. I wonder how she's managing with her husband's health. Should probably reach out.",
    mood: "calm",
    sentimentScore: 0.20,
    sentimentLabel: "NEUTRAL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 17,
    promptBody: "How has your sleep been this week? Any dreams worth sharing?",
    body: "Not sleeping well, I won't pretend otherwise. Waking up at 3 or 4 and then lying there with my thoughts going around. Mostly worrying about test results that are still pending from the doctor. I know I shouldn't catastrophize. But the dark hours have a way of making things feel bigger than they are. Tired today.",
    mood: "worried",
    sentimentScore: -0.38,
    sentimentLabel: "CONCERNED" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 16,
    promptBody: "Is there anything weighing on you lately that you haven't had a chance to talk about?",
    body: "Yes, if I'm honest. I've been more worried than I let on to people. The doctor found something in my bloodwork and I have to go back next week. I haven't told anyone yet because I don't want to alarm them before I know more. But keeping it to myself makes it heavier. I know I should eat something. I haven't had much appetite.",
    mood: "worried",
    sentimentScore: -0.52,
    sentimentLabel: "CONCERNED" as const,
    isAnomaly: true,
  },
  {
    daysAgo: 15,
    promptBody: "How are you feeling today, in three words?",
    body: "Anxious, tired, waiting. The appointment is Thursday. I've been trying to keep busy — reorganized the linen closet, which didn't need reorganizing, and read the same page of my book four times without taking it in. A person shouldn't have to worry alone but I don't want to be a burden. Just need Thursday to come.",
    mood: "worried",
    sentimentScore: -0.48,
    sentimentLabel: "CONCERNED" as const,
    isAnomaly: true,
  },
  {
    daysAgo: 14,
    promptBody: "What's something you used to love doing that you haven't done in a while?",
    body: "I used to love gardening properly — not just the window box herbs, but a real garden with rows and planning and all of it. My knees don't cooperate much anymore. But I was looking at seed catalogs this morning and felt something light up in me. Maybe raised beds next spring. Maybe that's what I'll do.",
    mood: "sleepy",
    sentimentScore: -0.08,
    sentimentLabel: "NEUTRAL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 13,
    promptBody: "What would make today feel like a good day?",
    body: "Heard from the doctor — the results were much less worrying than I'd prepared myself for. Nothing that requires immediate attention. I cried a little from relief, which surprised me. Made myself a proper lunch and ate it sitting at the table instead of standing at the counter. Some days that's enough.",
    mood: "calm",
    sentimentScore: 0.18,
    sentimentLabel: "NEUTRAL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 12,
    promptBody: "What did you eat or drink today that felt nourishing?",
    body: "Made my mother's soup — barley and root vegetables. It takes most of the afternoon but the house smells wonderful the whole time. Ate two bowls and felt genuinely warm for the first time in a couple of weeks. Food can be medicine if you let it. Kept some back for tomorrow.",
    mood: "calm",
    sentimentScore: 0.28,
    sentimentLabel: "NEUTRAL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 11,
    promptBody: "What's one thing you could do today to be kind to your body?",
    body: "Went for my walk. Longer than usual — almost 40 minutes. The tree on the corner has gone absolutely spectacular, all orange and gold. Took a photo of it to send to the grandchildren. Feel much more like myself today. Sometimes the kindest thing is just to keep moving.",
    mood: "happy",
    sentimentScore: 0.38,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 10,
    promptBody: "Who made you smile or laugh recently? What happened?",
    body: "Called my sister finally. It went better than I expected. We talked for almost an hour. She cried a bit and so did I. We've both been stubborn and neither of us had reason to be. She's going to come for a visit in the spring. Strange how much lighter I feel. Should have called sooner.",
    mood: "happy",
    sentimentScore: 0.55,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 9,
    promptBody: "What's a happy memory that came to mind recently?",
    body: "Thought about the year we had the big Christmas where everyone came — seventeen people in that little house. Every chair occupied, extra chairs borrowed from the neighbors, children on the floor. The chaos was tremendous. But everyone was laughing at something during dinner and I remember thinking I would remember this forever. I have.",
    mood: "happy",
    sentimentScore: 0.58,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 8,
    promptBody: "Name three things — big or tiny — that you're grateful for right now.",
    body: "The phone call with my sister on Sunday. The way the light comes through the kitchen window in the morning — golden and slanted in a way that makes everything look important. And my neighbor offering to drive me to the pharmacy so I don't have to wait for the bus in the cold. Simple things. Good things.",
    mood: "happy",
    sentimentScore: 0.62,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 7,
    promptBody: "What are you looking forward to this week?",
    body: "The book club meets Thursday at Ruth's house. I've actually read this one — a mystery set in Edinburgh — and have opinions about the ending that I'm sure no one will agree with, which is half the fun. Also looking forward to the farmers market on Saturday if the weather holds. They still have the apple cider donuts.",
    mood: "happy",
    sentimentScore: 0.65,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 6,
    promptBody: "What's something kind someone did for you this week?",
    body: "Ruth from book club dropped off an extra portion of the soup she made. Just appeared on my doorstep with it in a little container with a handwritten label. I didn't even mention I hadn't been feeling well — she just noticed I seemed tired. That's the kind of friend to hold onto.",
    mood: "happy",
    sentimentScore: 0.68,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 5,
    promptBody: "If today had a color, what would it be and why?",
    body: "Warm amber — like the inside of a lit window when it's dark outside. Today felt like that. Not dramatic, just quietly good. Good light, managed to finish a chapter, had a long bath, watched a documentary about the Amalfi coast that made me want to go somewhere beautiful. Maybe I still will, one day. Why not.",
    mood: "joyful",
    sentimentScore: 0.72,
    sentimentLabel: "JOYFUL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 4,
    promptBody: "What's something you're proud of from the past few days?",
    body: "Made the call I'd been putting off — rescheduled my follow-up and asked the doctor's office all the questions I'd been hoarding. Wrote them all down first so I wouldn't forget anything in the moment. It's so easy to go blank in those appointments. Proud I advocated for myself. It gets harder as you get older. But it matters.",
    mood: "happy",
    sentimentScore: 0.62,
    sentimentLabel: "POSITIVE" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 3,
    promptBody: "How are you feeling today, in three words?",
    body: "Content, rested, present. Slept wonderfully and woke up without the usual stiffness. Made a real breakfast — eggs and toast and sliced apple. Ate it slowly. The cardinals were at the feeder. I've started writing their visits down in a little notebook, which my granddaughter thinks is the funniest thing. She's not wrong, but I like my little record.",
    mood: "joyful",
    sentimentScore: 0.75,
    sentimentLabel: "JOYFUL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 2,
    promptBody: "Who would you love to have a cup of tea with right now, and why?",
    body: "My mother. She's been gone for twenty-two years and I still have moments where something happens and my first thought is to call her. I'd want to tell her about how the grandchildren are turning out, show her photos on the phone which would absolutely mystify and delight her, and hear her say that things will be alright in that way only mothers can.",
    mood: "joyful",
    sentimentScore: 0.80,
    sentimentLabel: "JOYFUL" as const,
    isAnomaly: false,
  },
  {
    daysAgo: 1,
    promptBody: "Name three things — big or tiny — that you're grateful for right now.",
    body: "Three! Only three? The video call this morning where the little one showed me how to do a magic trick she'd learned — she accidentally revealed how it worked and was horrified, which was funnier than the trick. My health holding steady. And this little app, which has gotten me in the habit of noticing things worth noticing. That's a good habit to have at any age.",
    mood: "excited",
    sentimentScore: 0.85,
    sentimentLabel: "JOYFUL" as const,
    isAnomaly: false,
  },
];

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
  for (const e of ENTRIES) {
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
  const scores = ENTRIES.map((e) => e.sentimentScore);
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
  console.log(`  🚩 Flagged entries: ${ENTRIES.filter((e) => e.isAnomaly).length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
