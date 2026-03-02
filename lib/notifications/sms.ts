import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSmsReminder(
  to: string,
  name: string,
  checkinUrl: string
) {
  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
    body: `Hi ${name}! 🐻 Time for your Claudine daily check-in. It only takes a minute: ${checkinUrl}`,
  });
}
