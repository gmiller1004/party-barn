-- Run this in Neon SQL Editor if conversations table already existed before contact fields were added.
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS transcript_emailed_at TIMESTAMPTZ;
