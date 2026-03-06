import { neon } from "@neondatabase/serverless";

/** Connection string: DATABASE_URL (local) or STORAGE_DATABASE_URL (e.g. Vercel). */
function getConnectionUrl(): string {
  const url = process.env.DATABASE_URL || process.env.STORAGE_DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL or STORAGE_DATABASE_URL is not set");
  return url;
}

function getSql() {
  return neon(getConnectionUrl());
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
  contact_name: string | null;
  contact_email: string | null;
  transcript_emailed_at: string | null;
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

/** Get conversation by id with contact fields. */
export async function getConversation(conversationId: string): Promise<ConversationRow | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, created_at, updated_at, contact_name, contact_email, transcript_emailed_at
    FROM conversations
    WHERE id = ${conversationId}
    LIMIT 1
  `;
  const r = rows[0] as (ConversationRow & { transcript_emailed_at?: string | null }) | undefined;
  if (!r) return null;
  return {
    id: r.id,
    created_at: r.created_at,
    updated_at: r.updated_at,
    contact_name: r.contact_name ?? null,
    contact_email: r.contact_email ?? null,
    transcript_emailed_at: r.transcript_emailed_at ?? null,
  };
}

/** Set contact name on a conversation. */
export async function setContactName(conversationId: string, name: string): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE conversations SET contact_name = ${name.trim()}, updated_at = now() WHERE id = ${conversationId}
  `;
}

/** Set contact email (or empty string for "skipped"). */
export async function setContactEmail(conversationId: string, email: string | null): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE conversations SET contact_email = ${email}, updated_at = now() WHERE id = ${conversationId}
  `;
}

/** Mark transcript as emailed. */
export async function setTranscriptEmailedAt(conversationId: string): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE conversations SET transcript_emailed_at = now(), updated_at = now() WHERE id = ${conversationId}
  `;
}

/** Conversations that have an email, no transcript sent yet, and were last updated at least N minutes ago. */
export async function getConversationsPendingTranscript(minutesAgo: number): Promise<Array<{ id: string; contact_name: string | null; contact_email: string }>> {
  const sql = getSql();
  const cutoff = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
  const rows = await sql`
    SELECT id, contact_name, contact_email
    FROM conversations
    WHERE contact_email IS NOT NULL AND contact_email != '' AND transcript_emailed_at IS NULL
      AND updated_at <= ${cutoff}
  `;
  return rows as Array<{ id: string; contact_name: string | null; contact_email: string }>;
}
