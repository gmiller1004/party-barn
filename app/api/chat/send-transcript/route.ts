import { NextRequest, NextResponse } from "next/server";
import { getConversation, getMessages, setTranscriptEmailedAt } from "@/lib/db";
import { sendTranscriptEmail, type TranscriptMessage } from "@/lib/sendgrid";

/**
 * POST /api/chat/send-transcript
 * Sends the transcript for one conversation if it has an email and hasn't been sent yet.
 * Called when the user closes the chat or the browser tab (via sendBeacon).
 */
export async function POST(request: NextRequest) {
  let conversationId: string;
  try {
    const body = await request.json();
    conversationId = typeof body?.conversationId === "string" ? body.conversationId.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  }

  const dbUrl = process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const conv = await getConversation(conversationId);
  if (!conv) {
    return NextResponse.json({ ok: true }); // no-op for unknown id
  }
  if (!conv.contact_email || conv.contact_email.trim() === "") {
    return NextResponse.json({ ok: true }); // no email, nothing to send
  }
  if (conv.transcript_emailed_at) {
    return NextResponse.json({ ok: true, alreadySent: true });
  }

  try {
    const messages = await getMessages(conversationId);
    const transcript: TranscriptMessage[] = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
    await sendTranscriptEmail(conv.contact_email, conv.contact_name ?? "", transcript);
    await setTranscriptEmailedAt(conversationId);
  } catch (err) {
    console.error("Send transcript failed for conversation", conversationId, err);
    return NextResponse.json({ error: "Failed to send transcript" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
