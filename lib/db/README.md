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

After that, the chat API will create and update conversations and messages automatically.
