import { NextRequest, NextResponse } from "next/server";
import {
  createConversation,
  addMessage,
  getMessages,
  getConversation,
  conversationExists,
  setContactName,
  setContactEmail,
  setTranscriptEmailedAt,
} from "@/lib/db";
import { NICOLE_SYSTEM_PROMPT } from "@/lib/nicole-prompt";

const XAI_URL = "https://api.x.ai/v1/responses";
const MODEL = "grok-4-1-fast-reasoning";

type InputMessage = { role: "system" | "user" | "assistant"; content: string };

/** xAI Responses API: extract assistant text from response body. */
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

/** Call Grok and return assistant text. */
async function callGrok(input: InputMessage[], apiKey: string): Promise<string> {
  const xaiRes = await fetch(XAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, input, store: false }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!xaiRes.ok) {
    const errText = await xaiRes.text();
    console.error("xAI API error:", xaiRes.status, errText);
    throw new Error("Nicole is temporarily unavailable. Please try again.");
  }

  const xaiJson: unknown = await xaiRes.json();
  const text = getOutputText(xaiJson);
  if (!text) {
    console.error("xAI response had no output_text.");
    throw new Error("Nicole didn’t return a reply. Please try again.");
  }
  return text;
}

const EMAIL_SKIP_PATTERN = /^(skip|no|nope|nah|optional|pass|none|n\/a)$/i;

/** First message sounds like party/event planning (vs. hours, order, product, etc.). */
function isPartyPlanningContext(firstMessage: string): boolean {
  const lower = firstMessage.toLowerCase().trim();
  const partyTerms = /\b(party|parties|birthday|celebration|event|planning|shower|balloon|theme|decor|favors|venue|guest)\b/;
  return partyTerms.test(lower) || lower.length < 20;
}

/** Reply asking for name, framed by whether they're asking about party planning or something else. */
function getNameAskReply(firstMessage: string): string {
  if (isPartyPlanningContext(firstMessage)) {
    return "Thanks for reaching out! Give me just a few seconds to evoke some magic on your party idea. In the meantime, what's your name?";
  }
  return "Thanks for reaching out! I'd be happy to help with that. Give me just a moment — and in the meantime, what's your name?";
}

/** POST /api/chat – send a message and get Nicole's reply. Name/email collection before first full response. */
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
  const conv = await getConversation(conversationId);
  if (!conv) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const userMessages = history.filter((m) => m.role === "user");
  const userCount = userMessages.length;
  const firstUserMessage = userMessages[0]?.content ?? "";

  // Step 1: First message – ask for name (contextual: party planning vs. other)
  if (userCount === 1 && !conv.contact_name) {
    const reply = getNameAskReply(firstUserMessage);
    await addMessage(conversationId, "assistant", reply);
    return NextResponse.json({ conversationId, message: reply });
  }

  // Step 2: Second message – treat as name, then ask for email (optional)
  if (userCount === 2 && !conv.contact_name) {
    const name = userContent;
    await setContactName(conversationId, name);
    const reply = `Thanks, ${name}! I'd love to send you the details of this chat so you don't lose it. Would you like me to email you a copy for follow-up? If so, what's your email address? (Totally optional — just say "skip" or "no" if you prefer.)`;
    await addMessage(conversationId, "assistant", reply);
    return NextResponse.json({ conversationId, message: reply });
  }

  // Step 3: Third message – email or skip, then call Grok with first message + name, send transcript if email given
  if (userCount === 3 && conv.contact_name && conv.contact_email === null && conv.transcript_emailed_at === null) {
    const isSkip = EMAIL_SKIP_PATTERN.test(userContent) || userContent.length < 3;
    const email = isSkip ? null : userContent;
    if (!isSkip && email) {
      const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!simpleEmail.test(email)) {
        await addMessage(
          conversationId,
          "assistant",
          "That doesn't look like a valid email. No worries — just say \"skip\" if you'd rather not share it, and I'll still send your full response!"
        );
        return NextResponse.json({
          conversationId,
          message:
            "That doesn't look like a valid email. No worries — just say \"skip\" if you'd rather not share it, and I'll still send your full response!",
        });
      }
    }
    await setContactEmail(conversationId, email);

    const name = conv.contact_name;
    const systemWithName = `${NICOLE_SYSTEM_PROMPT}\n\n**Right now:** The user just shared their name (${name}) and ${email ? "their email for the transcript." : "chose not to share an email."} Address them by name (${name}) in your reply. They asked: "${firstUserMessage}" — give your full, helpful party-planning response now.`;
    const input: InputMessage[] = [
      { role: "system", content: systemWithName },
      { role: "user", content: firstUserMessage },
    ];
    let assistantText: string;
    try {
      assistantText = await callGrok(input, apiKey);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Nicole is temporarily unavailable." },
        { status: 502 }
      );
    }
    await addMessage(conversationId, "assistant", assistantText);
    // Transcript is sent later by cron (after a short delay so they can read and ask more)
    return NextResponse.json({ conversationId, message: assistantText });
  }

  // Normal flow: full history to Grok
  const input: InputMessage[] = [
    { role: "system", content: NICOLE_SYSTEM_PROMPT },
    ...history
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  let assistantText: string;
  try {
    assistantText = await callGrok(input, apiKey);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Nicole is temporarily unavailable." },
      { status: 502 }
    );
  }

  await addMessage(conversationId, "assistant", assistantText);
  return NextResponse.json({ conversationId, message: assistantText });
}
