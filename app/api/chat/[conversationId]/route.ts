import { NextRequest, NextResponse } from "next/server";
import { getMessages, conversationExists } from "@/lib/db";

type Params = { params: Promise<{ conversationId: string }> };

/** GET /api/chat/[conversationId] – return all messages for a conversation. */
export async function GET(request: NextRequest, { params }: Params) {
  if (!process.env.DATABASE_URL && !process.env.STORAGE_DATABASE_URL) {
    return NextResponse.json({ error: "Chat storage is not configured." }, { status: 503 });
  }

  const { conversationId } = await params;
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId required." }, { status: 400 });
  }

  const exists = await conversationExists(conversationId);
  if (!exists) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const messages = await getMessages(conversationId);
  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.created_at,
    })),
  });
}
