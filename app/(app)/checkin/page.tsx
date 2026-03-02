import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTodaysPrompt } from "@/lib/prompts/rotation";
import { prisma } from "@/lib/db";
import BearMascot from "@/components/bear/BearMascot";
import BearGreeting from "@/components/bear/BearGreeting";
import DailyPrompt from "@/components/checkin/DailyPrompt";
import JournalForm from "@/components/checkin/JournalForm";

export default async function CheckinPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const existing = await prisma.entry.findFirst({
    where: { userId: session.userId, createdAt: { gte: startOfDay } },
  });

  if (existing) redirect("/checkin/done?already=true");

  const prompt = await getTodaysPrompt();

  if (!prompt) {
    return (
      <div className="text-center py-16">
        <BearMascot mood="sleepy" size={90} className="mx-auto mb-4" />
        <p className="text-bear-600 font-bold text-lg mb-1">No prompts yet!</p>
        <p className="text-bear-400 text-sm">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="page-enter">
      {/* Bear greeting — centered, prominent */}
      <div className="flex flex-col items-center text-center mb-8">
        <BearMascot mood="happy" size={108} animate className="mb-4" />
        <BearGreeting name={session.name} />
        <p className="text-bear-300 text-sm mt-1.5 font-semibold">Here&apos;s today&apos;s question for you 🍯</p>
      </div>

      {/* Prompt speech bubble */}
      <DailyPrompt body={prompt.body} category={prompt.category} />

      {/* Journal form card */}
      <div className="bg-white rounded-3xl border border-bear-100 shadow-warm p-6 mt-8">
        <JournalForm promptId={prompt.id} />
      </div>
    </div>
  );
}
