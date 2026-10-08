# Set Room
A classroom SET competition built by Rishik Rontala. Each day, every class receives the same twelve cards with exactly six sets. Classic rounds finish after six sets; sprint rounds finish after three. After a match, its three cards refill and another set is guaranteed. Repeated combinations count when they appear again.

## Use
Create a class league, enter class names one per line, and share its room code/link with the teacher’s other screens. Select the class and round length, then start. Each match is verified and saved by the server. The timer stops after the final valid set and the server automatically saves the official time with the class and New York puzzle date. The leaderboard shows each class’s best daily or all-time result and highlights the pizza leader. Choose Save room to keep a league in your ChatGPT account. Open Saved rooms in the header to return on any device. The full round history includes completed, ended, and unfinished rounds; Load older rounds reaches every record, and CSV export includes all rounds. Practice provides hints and never saves ranked scores.

## Local development
`npm run dev -- --port 5190` runs the development preview. `npm run db:generate` generates additive database migrations after schema changes. Build with `npm run build`, then apply pending migrations locally following the generated `dist/server/wrangler.json` D1 configuration and `.wrangler/state` persistence directory. `node --experimental-strip-types --test lib/set.test.ts` checks the pure rules and generator.

## Architecture
React/Vinext interface; pure deterministic SET logic in `lib/set.ts`; Cloudflare D1 structured storage; validated request boundary in `app/api/game/route.ts`. Server timestamps are authoritative. Match claims validate the current authoritative board, advance atomically, and retry idempotently. Account bookmarks live in D1 through `app/api/rooms/route.ts`, scoped to the trusted signed-in user. New attempts receive a private write token, so viewing their history cannot authorize a change. Room names and class labels render as text. Practice never writes an attempt.

See `LIMITATIONS.md` for supervision, timing, privacy, and all-time comparison limits. `DESIGN.md` records the design system. The initial hosted site is private to its owner; sharing must be enabled before a teacher can use the hosted link.

This is an independent recreation of SET and is not affiliated with its original publisher.

Manual Refresh cards deals a new solvable board without resetting the timer or found-set count. Ranked rounds permit up to five manual refreshes. Repeated combinations may be found again.
