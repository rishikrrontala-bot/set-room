# Verification
Verified locally on October 8, 2026.

- Six pure-logic tests: feature rules; deterministic daily board; repeated combinations; New York date; the user’s valid 4–8–5 example; 250 successive refill boards preserving nine unmatched slots and at least one available set.
- Server flow: class-room creation, same starting board, per-set validation, exact screenshot match, refill behavior, safe claim retries, manual refresh preserving progress, stable refresh retry, sixth-set automatic class/date/time save, rejection of completed-round refresh, concurrent claims incrementing once, invalid card rejection.
- Repeated-combination regression reproduced in a local authoritative board state: the same triple on a later board increments from one to two.
- Browser flow: keyboard 4–8–5; six live claims; manual refresh during a ranked round; completion; saved ranking after reload; practice hints and refresh; mobile rules.
- 1440px desktop and 390px mobile captures reviewed; no page errors; 390px viewport equals 390px document width. Settled rules dialog opacity confirmed 1.
- Type check and production build passed. Fresh independent design/correctness review: ship, no material blockers.

WebMCP is feature-detected and exposes read_class_standings when supported. The test browser did not provide document.modelContext, so native WebMCP runtime validation was unavailable. It is optional and has no effect on gameplay.

QA leagues, synthetic race times, and test screenshots are local only. Production starts with an empty database. Hosted publication status is verified separately through Sites.
