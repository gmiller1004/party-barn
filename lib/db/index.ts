import { neon } from "@neondatabase/serverless";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export type MessageRow = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export type ConversationRow = {
  id: string;
  created_at: string;
  updated_at: string;
};

/** Create a new conversation and return its id. */
export async function createConversation(): Promise<string> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO conversations (created_at, updated_at)
    VALUES (now(), now())
    RETURNING id
  `;
  const row = rows[0] as { id: string };
  return row.id;
}

/** Append a message to a conversation. */
export async function addMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO messages (conversation_id, role, content)
    VALUES (${conversationId}, ${role}, ${content})
  `;
  await sql`
    UPDATE conversations SET updated_at = now() WHERE id = ${conversationId}
  `;
}

/** Get all messages for a conversation, ordered by created_at. */
export async function getMessages(conversationId: string): Promise<MessageRow[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, conversation_id, role, content, created_at
    FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at ASC
  `;
  return rows as MessageRow[];
}

/** Check that a conversation exists (for auth/validation). */
export async function conversationExists(conversationId: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT 1 FROM conversations WHERE id = ${conversationId} LIMIT 1
  `;
  return rows.length > 0;
}
