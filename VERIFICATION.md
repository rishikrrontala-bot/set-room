# Verification

## Original classroom mode — October 9, 2026

Nine pure-logic tests and the Next.js production build passed. A muted browser test of the local production build verified exactly six sets on an unchanged board, rejection of duplicate triples in either selection order, shared-card sets, idempotent claim retries, rejection of Original refreshes, class switching with both cancelled and accepted confirmation, preserved ended-round history, legacy requests defaulting to Refill, five-refresh enforcement and retry behavior, separate Original/Refill leaderboard records, CSV mode labels, and all six practice hints completing without saved attempts. Desktop and 390px mobile screenshots were reviewed; there were no page errors or horizontal page overflow.

The additive migration preserved all 13 existing production rounds and the existing account bookmark. Old records default to Refill; Original scores are ranked separately. The staged production deployment passed six actual fixed-board claims, duplicate and refresh rejection, idempotent retries, and automatic official time/history saving. The same full browser flow then passed on the public Vercel URL after promotion, including confirmed/cancelled class switching, separate leaderboards, history/CSV, six practice hints without database writes, and mobile layout. Synthetic production rooms and rounds were removed afterward. The published runtime source is commit `d8a77eda437daaf8b1668f6e5c872c522dd52404`; the remaining commit only records this verification.

## Vercel migration status — October 8, 2026

Canonical live URL: [Set Room](https://set-room.vercel.app).

The application has been ported to conventional Next.js on Vercel, with durable Turso storage and Better Auth email/password accounts. The migration preserved the existing room and its three rounds; the source contained no saved bookmarks. `npm run db:migrate` loads `.env.local` and applies the checked-in game and account migrations.

Current Vercel checks passed: the production Next.js build and TypeScript checks; six pure SET-rule tests; live account creation, room creation, saving, and loading through authenticated Vercel access; and the migrated room history containing all three original rounds. Synthetic live check data was removed afterward.

A muted local production-browser test passed account creation, sign-in in a separate browser context, private saved-room isolation, rejection of forged Sites identity headers, saving/reopening a room, sign-out, six actual card matches with automatic result/history saving, and a 390px mobile viewport without horizontal overflow. Local testing uses `http://localhost:5190` to match Next.js's request origin.

After production promotion, the public URL was tested without a Vercel account. The same full browser flow passed on the actual Vercel site, including account creation, cross-session sign-in, saving/reopening, six actual matches and history, sign-out, account isolation, and the mobile viewport. Synthetic live accounts, room, and score were then removed; the three original rounds remain. Email verification and password recovery are not implemented. Claim/refresh retry and multi-page export checks below belong to the earlier Sites build and have not been rerun against Vercel.

## Historical local verification — original Sites version

Reported locally on October 8, 2026, before the Vercel migration:

- Six pure-logic tests: feature rules; deterministic daily board; repeated combinations; New York date; the user’s valid 4–8–5 example; 250 successive refill boards preserving nine unmatched slots and at least one available set.
- Server flow: class-room creation, same starting board, per-set validation, exact screenshot match, refill behavior, safe claim retries, manual refresh preserving progress, stable refresh retry, sixth-set automatic class/date/time save, rejection of completed-round refresh, concurrent claims incrementing once, invalid card rejection.
- Repeated-combination regression reproduced in a local authoritative board state: the same triple on a later board increments from one to two.
- Browser flow: keyboard 4–8–5; six live claims; manual refresh during a ranked round; completion; saved ranking after reload; practice hints and refresh; mobile rules.
- 1440px desktop and 390px mobile captures reviewed; no page errors; 390px viewport equaled 390px document width. Settled rules dialog opacity confirmed 1.
- Type check and the former Sites/Vinext production build passed. Independent design/correctness review reported no material blockers.

WebMCP was feature-detected and exposed `read_class_standings` when supported. The test browser did not provide `document.modelContext`, so native WebMCP runtime validation was unavailable. It is optional and has no effect on gameplay.

The historical QA leagues, synthetic race times, and test screenshots were local only. Publication checks through Sites applied to the former hosted deployment, not to the current Vercel app.

## Historical saved-room and history checks

These checks used the original Sites account and D1 storage setup:

- Account save was idempotent; sign-in was required. Reopening in a fresh signed-in browser session showed the same saved room. Removing the shortcut left the room and scores intact.
- A 56-round local fixture spanned completed, ended, and unfinished rounds. History paging returned 56 unique records, and the exported CSV contained all 56.
- New round write tokens were required for claims, refreshes, and end. Missing/wrong tokens were rejected; history never exposed the token. Claim and refresh retries stayed idempotent.
- Actual browser play completed all six sets and saved the official result without a manual refresh. Five refreshes succeeded; the sixth was rejected. An ended round rejected more refreshes.
- Independent API/security review found no remaining blockers in that version. Type check, six pure-rule tests, and the former production build passed. Desktop and 390px mobile showed no page errors or horizontal page overflow.
