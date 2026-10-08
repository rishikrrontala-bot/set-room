# Set Room

A classroom SET competition built by Rishik Rontala. Each day, every class receives the same twelve cards with exactly six sets. Classic rounds finish after six sets; sprint rounds finish after three. After a match, its three cards refill and another set is guaranteed. Repeated combinations count when they appear again.

Live app: [Set Room](https://set-room.vercel.app).

## Use

Create a class league, enter class names one per line, and share its room code/link with the teacher’s other screens. Select the class and round length, then start. Each match is verified and saved by the server. The timer stops after the final valid set and the server saves the official time with the class and New York puzzle date. The leaderboard shows each class’s best daily or all-time result and highlights the pizza leader.

Choose Save room, then create an account or sign in with email and password to keep a league in your account. Open Saved rooms in the header to return on another device; sign out from the same dialog. Playing by room code does not require an account. Email ownership is not verified, and password recovery is not available.

The full round history includes completed, ended, and unfinished rounds; Load older rounds reaches every record, and CSV export includes all rounds. Practice provides hints and never saves ranked scores. Refresh cards deals a new solvable board without resetting the timer or found-set count. Ranked rounds permit up to five manual refreshes.

## Local development

Use Node.js 22.13 or later and install dependencies with `npm ci`. Create an ignored `.env.local` containing these configuration variables:

- `TURSO_DATABASE_URL`: a remote Turso/libSQL URL, or a local `file:` database URL for development only.
- `TURSO_AUTH_TOKEN`: the remote database credential; unnecessary for a local file database.
- `BETTER_AUTH_SECRET`: a random secret of at least 32 characters.
- `BETTER_AUTH_URL`: the app origin, such as `http://localhost:3000` locally or the canonical live URL in production.

Run `npm run db:migrate` to apply the checked-in migrations. This command loads `.env.local` and creates both game and account tables. Start the app with `npm run dev`; a different port requires the matching auth origin. Build with `npm run build` and run that build with `npm start`. `npm run db:generate` generates migrations after schema changes. `node --experimental-strip-types --test lib/set.test.ts` checks the pure rules and generator.

## Vercel deployment

Vercel builds this directory as a conventional Next.js app using `vercel.json`. The Turso Cloud Marketplace integration provides `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Configure `BETTER_AUTH_SECRET` and the production `BETTER_AUTH_URL` separately. Apply migrations against the intended database before serving requests; after pulling development configuration into `.env.local`, `npm run db:migrate` uses that database. Vercel requires a durable remote database and rejects a local `file:` database URL.

The original Sites/Vinext deployment used Cloudflare D1 and ChatGPT sign-in. Those are historical platform details; the current live app runs on Vercel with Turso and its own email/password accounts. Existing game records were migrated from the original database. Account bookmarks belong to the current app’s verified sessions, not to externally supplied identity headers.

## Architecture

Next.js 16 and React 19 provide the interface and route handlers. Pure deterministic SET logic lives in `lib/set.ts`; Turso/libSQL stores rooms, attempts, account sessions, and bookmarks. `lib/storage.ts` preserves the prepared-query interface used by the game routes. Better Auth handles email/password accounts through `/api/auth`, with the sign-in form at `/signin`.

Server timestamps are authoritative. Match claims validate the current board, advance atomically, and retry idempotently. `app/api/rooms/route.ts` scopes bookmarks to the live signed-in session. New attempts receive a private write token, so viewing their history cannot authorize a change. Room names and class labels render as text. Practice never writes an attempt.

See `LIMITATIONS.md` for supervision, timing, account, and privacy limits; `DESIGN.md` for the design system; and `VERIFICATION.md` for the distinction between historical checks and current deployment validation.

This is an independent recreation of SET and is not affiliated with its original publisher.
