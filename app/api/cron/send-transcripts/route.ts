import { NextRequest, NextResponse } from "next/server";
import { getConversationsPendingTranscript, getMessages, setTranscriptEmailedAt } from "@/lib/db";
import { sendTranscriptEmail, type TranscriptMessage } from "@/lib/sendgrid";

/** Delay (minutes) after last activity before sending transcript so user can read and ask more. */
const DELAY_MINUTES = 4;

/**
 * GET /api/cron/send-transcripts
 * Called by Vercel Cron. Sends transcript emails for conversations that have an email,
 * haven't been sent yet, and were last updated at least DELAY_MINUTES ago.
 * Secure with CRON_SECRET in production.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const pending = await getConversationsPendingTranscript(DELAY_MINUTES);
  let sent = 0;
  for (const conv of pending) {
    try {
      const messages = await getMessages(conv.id);
      const transcript: TranscriptMessage[] = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      await sendTranscriptEmail(conv.contact_email, conv.contact_name ?? "", transcript);
      await setTranscriptEmailedAt(conv.id);
      sent++;
    } catch (err) {
      console.error("Send transcript failed for conversation", conv.id, err);
    }
  }

  return NextResponse.json({ ok: true, sent, pending: pending.length });
}
