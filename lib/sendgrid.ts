/**
 * SendGrid v3 – send transcript email from Nicole.
 * Env: SENDGRID_API_KEY, SENDER_EMAIL, SENDER_NAME
 */

const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";

/** BCC for transcript emails. Comma-separated for multiple (e.g. add Nicole's store email later). */
function getBccEmails(): string[] {
  const bcc = process.env.TRANSCRIPT_BCC_EMAIL ?? "gmiller@jgmcreative.com";
  return bcc.split(",").map((e) => e.trim()).filter(Boolean);
}

// Design board colors (Party Barn)
const colors = {
  copper: "#9d755c",
  ink: "#2c2c2c",
  cream: "#e4e2d7",
  offwhite: "#f7f8f3",
  sand: "#b8a999",
};

export type TranscriptMessage = { role: "user" | "assistant"; content: string };

/** Build HTML body for the transcript email (brand colors, personal from Nicole). */
function buildTranscriptHtml(recipientName: string, messages: TranscriptMessage[]): string {
  const rows = messages
    .map((m) => {
      const isUser = m.role === "user";
      const label = isUser ? "You" : "Nicole";
      const bg = isUser ? colors.ink : colors.cream;
      const textColor = isUser ? colors.offwhite : colors.ink;
      const align = isUser ? "right" : "left";
      const content = m.content.replace(/\n/g, "<br>");
      return `
        <tr><td style="padding:8px 0; text-align:${align}">
          <span style="font-size:11px; color:${colors.sand}; display:block; margin-bottom:4px;">${label}</span>
          <div style="display:inline-block; max-width:85%; padding:12px 14px; border-radius:12px; background:${bg}; color:${textColor}; font-size:14px; line-height:1.5; text-align:left;">${content}</div>
        </td></tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding:0; background:${colors.offwhite}; font-family: Georgia, serif;">
  <div style="max-width:560px; margin:0 auto; padding:24px;">
    <div style="background:${colors.copper}; color:${colors.offwhite}; padding:20px 24px; border-radius:12px 12px 0 0;">
      <p style="margin:0; font-size:18px; font-weight:600;">Hi${recipientName ? ` ${recipientName}` : ""}! 👋</p>
      <p style="margin:8px 0 0 0; font-size:14px; opacity:0.95;">Here’s your Party Barn planning chat, as promised.</p>
    </div>
    <div style="background:white; padding:20px 24px 24px; border:1px solid ${colors.cream}; border-top:none; border-radius:0 0 12px 12px;">
      <p style="margin:0 0 16px 0; font-size:14px; color:${colors.ink}; line-height:1.5;">Save this email so you don’t lose your ideas—and when you’re ready, we’d love to help you bring them to life at Party Barn.</p>
      <table style="width:100%; border-collapse:collapse;">${rows}</table>
      <p style="margin:20px 0 0 0; font-size:13px; color:${colors.sand};">Rooted in Celebration — <a href="https://party-barn.vercel.app" style="color:${colors.copper};">Party Barn</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendTranscriptEmail(
  toEmail: string,
  recipientName: string,
  messages: TranscriptMessage[]
): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDER_EMAIL;
  const fromName = process.env.SENDER_NAME ?? "Nicole at Party Barn";

  if (!apiKey || !fromEmail) {
    throw new Error("SENDGRID_API_KEY and SENDER_EMAIL are required to send transcript emails.");
  }

  const html = buildTranscriptHtml(recipientName, messages);
  const bccList = getBccEmails();
  const body = {
    personalizations: [
      {
        to: [{ email: toEmail }],
        ...(bccList.length > 0 ? { bcc: bccList.map((email) => ({ email })) } : {}),
      },
    ],
    from: { email: fromEmail, name: fromName },
    subject: `Your Party Barn planning chat${recipientName ? `, ${recipientName}` : ""}`,
    content: [{ type: "text/html", value: html }],
  };

  const res = await fetch(SENDGRID_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SendGrid error ${res.status}: ${err}`);
  }
}
