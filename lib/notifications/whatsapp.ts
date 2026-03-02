import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppReminder(
  to: string,
  name: string,
  checkinUrl: string
) {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER!, // e.g. whatsapp:+14155238886
    to: `whatsapp:${to}`,
    body: `Hi ${name}! 🐻 Time for your Claudine daily check-in.\n\n✍️ *Today's prompt is ready!*\n\nTap here to write your entry: ${checkinUrl}`,
  });
}
