/**
 * SendGrid v3 – send transcript email from Nicole.
 * Env: SENDGRID_API_KEY, SENDER_EMAIL, SENDER_NAME
 */

import { marked } from "marked";

const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";

/** Convert markdown to HTML for email (headings, bold, lists). */
function markdownToHtml(md: string): string {
  const html = marked.parse(md, { async: false as const });
  return (typeof html === "string" ? html : "").trim();
}

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
      const content = isUser ? m.content.replace(/\n/g, "<br>") : markdownToHtml(m.content);
      return `
        <tr><td style="padding:8px 0; text-align:${align}">
          <span style="font-size:11px; color:${colors.sand}; display:block; margin-bottom:4px;">${label}</span>
          <div class="message-body" style="display:inline-block; max-width:85%; padding:12px 14px; border-radius:12px; background:${bg}; color:${textColor}; font-size:14px; line-height:1.5; text-align:left;">${content}</div>
        </td></tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <style>.message-body h2,.message-body h3{font-size:1em; font-weight:600; margin:0.75em 0 0.35em 0;} .message-body h2:first-child,.message-body h3:first-child{margin-top:0;} .message-body ul,.message-body ol{margin:0.5em 0; padding-left:1.25em;} .message-body li{margin:0.25em 0;} .message-body strong{font-weight:600;} .message-body p{margin:0.5em 0;} .message-body p:first-child{margin-top:0;} .message-body p:last-child{margin-bottom:0;}</style>
</head>
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
      <p style="margin:12px 0 0 0; font-size:13px; color:${colors.ink};"><a href="https://www.google.com/maps/search/?api=1&amp;query=24977+Washington+Ave+Suite+E+Murrieta+CA+92562" style="color:${colors.copper}; text-decoration:underline;">24977 Washington Ave, Suite E · Murrieta, CA 92562</a><br><span style="font-size:12px; color:${colors.sand};">Entrance faces Ivy Street</span></p>
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

/** Contact form submission payload for the notification email to Nicole. */
export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const SUBJECT_LABELS: Record<string, string> = {
  "event-styling": "Event styling inquiry",
  balloons: "Balloon order / question",
  general: "General question",
};

/** Send contact form details to nicole@party-barn.com (or CONTACT_TO_EMAIL). */
export async function sendContactNotificationEmail(data: ContactSubmission): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDER_EMAIL;
  const fromName = process.env.SENDER_NAME ?? "Party Barn Website";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "nicole@party-barn.com";

  if (!apiKey || !fromEmail) {
    throw new Error("SENDGRID_API_KEY and SENDER_EMAIL are required to send contact notifications.");
  }

  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject || "Contact form";
  const safeName = data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeEmail = data.email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeMessage = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding:0; background:${colors.offwhite}; font-family: Georgia, serif;">
  <div style="max-width:560px; margin:0 auto; padding:24px;">
    <div style="background:${colors.copper}; color:${colors.offwhite}; padding:20px 24px; border-radius:12px 12px 0 0;">
      <p style="margin:0; font-size:18px; font-weight:600;">New contact form submission</p>
      <p style="margin:8px 0 0 0; font-size:14px; opacity:0.95;">${subjectLabel}</p>
    </div>
    <div style="background:white; padding:20px 24px 24px; border:1px solid ${colors.cream}; border-top:none; border-radius:0 0 12px 12px;">
      <p style="margin:0 0 12px 0; font-size:14px; color:${colors.ink};"><strong>From:</strong> ${safeName} &lt;<a href="mailto:${safeEmail}" style="color:${colors.copper};">${safeEmail}</a>&gt;</p>
      <p style="margin:0 0 16px 0; font-size:14px; color:${colors.ink};"><strong>Subject:</strong> ${subjectLabel}</p>
      <div style="font-size:14px; color:${colors.ink}; line-height:1.6;">${safeMessage}</div>
      <p style="margin:20px 0 0 0; font-size:12px; color:${colors.sand};">Sent from Party Barn contact form</p>
    </div>
  </div>
</body>
</html>`;

  const body = {
    personalizations: [{ to: [{ email: toEmail }] }],
    from: { email: fromEmail, name: fromName },
    subject: `Contact: ${subjectLabel} – ${data.name}`,
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
