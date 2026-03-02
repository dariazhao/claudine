import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL ?? "claudine@yourdomain.com";
}

export async function sendMagicLink(to: string, name: string, link: string) {
  const resend = getResend();
  await resend.emails.send({
    from: getFrom(),
    to,
    subject: "🐻 Your Claudine sign-in link",
    html: `
      <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fdfcf9; border-radius: 16px;">
        <div style="text-align: center; font-size: 48px; margin-bottom: 16px;">🐻</div>
        <h1 style="color: #8b5e3c; font-size: 24px; margin-bottom: 8px;">Hi ${name}! 👋</h1>
        <p style="color: #3d2b1f; font-size: 16px; line-height: 1.6;">
          Here's your sign-in link for Claudine. It expires in 15 minutes.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}" style="background: #f59e0b; color: white; padding: 14px 32px; border-radius: 999px; font-size: 16px; font-weight: 700; text-decoration: none; display: inline-block;">
            Sign in to Claudine
          </a>
        </div>
        <p style="color: #c8956c; font-size: 14px; text-align: center;">
          If you didn't request this, you can safely ignore it. 🍯
        </p>
      </div>
    `,
  });
}

export async function sendReminderEmail(
  to: string,
  name: string,
  promptBody: string,
  checkinUrl: string
) {
  const resend = getResend();
  await resend.emails.send({
    from: getFrom(),
    to,
    subject: "🐻 Time for your daily check-in!",
    html: `
      <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fdfcf9; border-radius: 16px;">
        <div style="text-align: center; font-size: 48px; margin-bottom: 16px;">🐻</div>
        <h1 style="color: #8b5e3c; font-size: 22px; margin-bottom: 8px;">Good morning, ${name}! ☀️</h1>
        <p style="color: #3d2b1f; font-size: 16px; line-height: 1.6;">
          Today's reflection prompt is waiting for you:
        </p>
        <div style="background: #faebd7; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="color: #8b5e3c; font-size: 16px; font-style: italic; margin: 0;">
            "${promptBody}"
          </p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${checkinUrl}" style="background: #f59e0b; color: white; padding: 14px 32px; border-radius: 999px; font-size: 16px; font-weight: 700; text-decoration: none; display: inline-block;">
            Write my check-in 🍯
          </a>
        </div>
        <p style="color: #c8956c; font-size: 13px; text-align: center;">
          Takes just a few minutes. Your thoughts matter! 🐾
        </p>
      </div>
    `,
  });
}
