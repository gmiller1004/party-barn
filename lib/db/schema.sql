-- Run this in the Neon SQL Editor (Dashboard → SQL Editor) to create tables for Nicole chat.
-- Or use: psql $DATABASE_URL -f lib/db/schema.sql

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  contact_name TEXT,
  contact_email TEXT,
  transcript_emailed_at TIMESTAMPTZ
);

-- Run this if the table already exists (add contact/email columns):
-- ALTER TABLE conversations ADD COLUMN IF NOT EXISTS contact_name TEXT;
-- ALTER TABLE conversations ADD COLUMN IF NOT EXISTS contact_email TEXT;
-- ALTER TABLE conversations ADD COLUMN IF NOT EXISTS transcript_emailed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(conversation_id, created_at);
