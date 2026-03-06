# Nicole chat database (Neon)

Chat conversations are stored in Neon Postgres so they persist across sessions and can be loaded after a page refresh.

## Setup

1. **Create a Neon project** at [neon.tech](https://neon.tech) (free tier is fine).
2. **Get your connection string** from the Neon dashboard (Connection string → URI).
3. **Add to `.env.local`:**
   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
4. **Create the tables** by running the SQL in `schema.sql` in the Neon SQL Editor (Dashboard → SQL Editor → New query → paste contents of `lib/db/schema.sql` → Run).

5. **If the table already existed** (e.g. before contact name/email), run `migrate-contact-fields.sql` in the SQL Editor to add `contact_name`, `contact_email`, and `transcript_emailed_at`.

After that, the chat API will create and update conversations and messages automatically.

### Optional: Neon CLI (`neonctl init`)

Neon may suggest running `npx neonctl@latest init`. That command links the repo to Neon’s CLI (branching, migrations, etc.). **You don’t need it for the chat to work** — the app only needs the connection string and the tables from `schema.sql`. Run `npx neonctl@latest init` only if you want to use Neon’s CLI features; otherwise you can skip it.
