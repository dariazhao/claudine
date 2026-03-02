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

  // Check if already checked in today
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const existing = await prisma.entry.findFirst({
    where: {
      userId: session.userId,
      createdAt: { gte: startOfDay },
    },
  });

  if (existing) {
    redirect("/checkin/done?already=true");
  }

  const prompt = await getTodaysPrompt();

  if (!prompt) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">😴</div>
        <p className="text-bear-400 font-semibold">
          No prompts available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Bear greeting */}
      <div className="flex items-center gap-4 mb-6">
        <BearMascot mood="happy" size={72} />
        <BearGreeting name={session.name} />
      </div>

      {/* Today's prompt */}
      <DailyPrompt body={prompt.body} category={prompt.category} />

      {/* Small bear below the speech bubble */}
      <div className="flex justify-start mb-5 ml-2">
        <BearMascot mood="happy" size={48} />
      </div>

      {/* Journal form */}
      <div className="bg-white rounded-2xl border border-bear-100 shadow-sm p-6">
        <JournalForm promptId={prompt.id} />
      </div>
    </div>
  );
}
