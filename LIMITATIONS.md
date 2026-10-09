# Limits

- A classroom activity supervised by a teacher. Server time and per-board valid-set checks prevent submitting an invented elapsed time, but a determined player can automate solving or study the daily starting board. This is not a proctored exam.
- Rankings compare Original, Refill, and Sprint separately. Existing scores retain their Refill or Sprint classification. Today uses an America/New_York puzzle date. All-time compares puzzles of different difficulty.
- Official ranked time measures server receipt of start and the final match, including connection delay. The screen timer is approximate until the server confirms it. There is no pause in a ranked round.
- The Vercel app is accessible at its live URL. Room codes provide separation, not private authentication. Anyone with the code can play for a class and view its standings and history.
- Saved rooms require the app’s email/password sign-in. The list is account-specific, but saving a room does not change who can play by its code. Room, history, account, and bookmark records live in the connected Turso database.
- Email ownership is not verified. An account’s email address is a sign-in identifier, not proof of identity. Password recovery is not available; users who lose their password cannot recover that account through the app. Creating a new account does not restore the old account’s bookmarks. Rooms remain reachable by their codes.
- The current account system does not use ChatGPT sign-in or trust client-supplied identity headers. The original Sites/Cloudflare D1 deployment is the historical source of migrated game records. Its account identifiers are not automatically linked to the current account system.
- History pages show 50 rounds at a time; Load older rounds reaches the rest. Export includes all rounds. Unfinished rounds appear in history but never affect the leaderboard. Leaving an active game does not resume its clock later.
- New round writes require a private token returned to the starting screen. Existing tokenless rounds retain compatibility until they expire after 24 hours.
- Original has exactly six distinct sets on an unchanged board; it does not allow refreshes or repeated triples. Cards can be shared between sets. In Refill/Sprint, each starting and refreshed board contains six valid sets; matched-card refills contain at least one. Availability after a refill can vary. Up to five manual refreshes are optional; finding six sets requires no refresh.
- SET is a game by its original creators. This is an independent classroom recreation, not an official publisher service.
