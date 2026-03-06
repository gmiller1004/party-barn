import { NextRequest, NextResponse } from "next/server";
import { createConversation, addMessage, getMessages, conversationExists } from "@/lib/db";
import { NICOLE_SYSTEM_PROMPT } from "@/lib/nicole-prompt";

const XAI_URL = "https://api.x.ai/v1/responses";
const MODEL = "grok-4-1-fast-reasoning";

type InputMessage = { role: "system" | "user" | "assistant"; content: string };

/** xAI Responses API returns output as array of items; assistant message has type "message" and content[].type "output_text". */
function getOutputText(body: unknown): string {
  if (body && typeof body === "object" && "output_text" in body && typeof (body as { output_text?: string }).output_text === "string") {
    const t = (body as { output_text: string }).output_text.trim();
    if (t) return t;
  }
  const output = body && typeof body === "object" && "output" in body ? (body as { output?: unknown[] }).output : undefined;
  if (!Array.isArray(output)) return "";

  for (const item of output) {
    if (item && typeof item === "object" && (item as { type?: string }).type === "message") {
      const content = (item as { content?: Array<{ type?: string; text?: string }> }).content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block?.type === "output_text" && typeof block.text === "string") {
            const t = block.text.trim();
            if (t) return t;
          }
        }
      }
    }
    if (item && typeof item === "object" && (item as { type?: string }).type === "output_text" && "text" in item) {
      const t = String((item as { text: string }).text).trim();
      if (t) return t;
    }
  }
  return "";
}

/** POST /api/chat – send a message and get Nicole's reply. Creates conversation if needed. */
export async function POST(request: NextRequest) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat is not configured (missing XAI_API_KEY)." }, { status: 503 });
  }

  const dbUrl = process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json(
      { error: "Chat storage is not configured (missing DATABASE_URL or STORAGE_DATABASE_URL)." },
      { status: 503 }
    );
  }

  let body: { conversationId?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const userContent = typeof body.message === "string" ? body.message.trim() : "";
  if (!userContent) {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  let conversationId: string;

  if (body.conversationId) {
    const exists = await conversationExists(body.conversationId);
    if (!exists) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    conversationId = body.conversationId;
  } else {
    conversationId = await createConversation();
  }

  await addMessage(conversationId, "user", userContent);

  const history = await getMessages(conversationId);
  const input: InputMessage[] = [
    { role: "system", content: NICOLE_SYSTEM_PROMPT },
    ...history
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  const xaiRes = await fetch(XAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input,
      store: false,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!xaiRes.ok) {
    const errText = await xaiRes.text();
    console.error("xAI API error:", xaiRes.status, errText);
    return NextResponse.json(
      { error: "Nicole is temporarily unavailable. Please try again." },
      { status: 502 }
    );
  }

  const xaiJson: unknown = await xaiRes.json();
  const assistantText = getOutputText(xaiJson);

  if (!assistantText) {
    const logSnippet =
      typeof xaiJson === "object" && xaiJson !== null
        ? JSON.stringify(Object.keys(xaiJson as Record<string, unknown>))
        : String(xaiJson).slice(0, 200);
    console.error("xAI response had no output_text. Top-level keys:", logSnippet);
    return NextResponse.json(
      { error: "Nicole didn’t return a reply. Please try again." },
      { status: 502 }
    );
  }

  await addMessage(conversationId, "assistant", assistantText);

  return NextResponse.json({
    conversationId,
    message: assistantText,
  });
}
