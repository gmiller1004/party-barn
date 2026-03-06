import { NextRequest, NextResponse } from "next/server";
import { createConversation, addMessage, getMessages, conversationExists } from "@/lib/db";
import { NICOLE_SYSTEM_PROMPT } from "@/lib/nicole-prompt";

const XAI_URL = "https://api.x.ai/v1/responses";
const MODEL = "grok-4-1-fast-reasoning";

type InputMessage = { role: "system" | "user" | "assistant"; content: string };

/** Extract assistant text from xAI Responses API response. */
function getOutputText(body: {
  output?: Array<{ type?: string; text?: string }>;
  output_text?: string;
}): string {
  if (typeof body.output_text === "string" && body.output_text.trim()) {
    return body.output_text.trim();
  }
  const output = body.output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (item?.type === "output_text" && typeof item.text === "string") {
        return item.text.trim();
      }
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

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "Chat storage is not configured (missing DATABASE_URL)." }, { status: 503 });
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

  const xaiJson = (await xaiRes.json()) as {
    output?: Array<{ type?: string; text?: string }>;
    output_text?: string;
  };
  const assistantText = getOutputText(xaiJson);

  if (!assistantText) {
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
