import { User } from "@prisma/client";
import { sendReminderEmail } from "./email";
import { sendSmsReminder } from "./sms";
import { sendWhatsAppReminder } from "./whatsapp";
import { getTodaysPrompt } from "@/lib/prompts/rotation";

export async function dispatchReminder(user: User): Promise<void> {
  // App-only users get no push notification
  if (user.notifyAppOnly) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const checkinUrl = `${appUrl}/checkin`;

  const prompt = await getTodaysPrompt();
  const promptBody = prompt?.body ?? "How are you feeling today?";

  const tasks: Promise<void>[] = [];

  if (user.notifyEmail) {
    tasks.push(
      sendReminderEmail(user.email, user.name, promptBody, checkinUrl).catch(
        (err) => console.error(`[dispatcher] email failed for ${user.id}:`, err)
      )
    );
  }

  if (user.notifySms && user.phoneNumber) {
    tasks.push(
      sendSmsReminder(user.phoneNumber, user.name, checkinUrl).catch((err) =>
        console.error(`[dispatcher] SMS failed for ${user.id}:`, err)
      )
    );
  }

  if (user.notifyWhatsapp && user.phoneNumber) {
    tasks.push(
      sendWhatsAppReminder(user.phoneNumber, user.name, checkinUrl).catch(
        (err) =>
          console.error(`[dispatcher] WhatsApp failed for ${user.id}:`, err)
      )
    );
  }

  await Promise.all(tasks);
}
