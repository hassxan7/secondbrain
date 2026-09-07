# Meeting arbitrage

Multi-person availability arbitrage. One deterministic engine, two products:

- **Banksia** — the house's standing weekly meeting, plus the chore, fine and
  issue machinery that gives it something to be about.
- **Ripple** — shareable links that turn a Sydney friend group's answers into
  one plan: time, activities, budget and meeting spot.

Calendly picks a time the organiser already chose. This picks the time that
suits the most people, and then keeps picking it week after week without the
meeting drifting.

```
┌─ src/core ────────────────────────────────────────────────┐
│  slots.ts       timezone maths (Intl only, DST-correct)   │
│  arbitrage.ts   score candidate slots, recommend one      │
│  anchor.ts      pick the STANDING time; police re-fixes   │
└───────────────────────────────────────────────────────────┘
        │                                    │
┌───────▼──────────────┐        ┌────────────▼──────────────┐
│ src/banksia          │        │ src/ripple                │
│  accountability.ts   │        │  activities.ts  geo.ts    │
│  routes.ts           │        │  places.ts      brief.ts  │
└──────────────────────┘        │  routes.ts                │
        │                       └───────────────────────────┘
        │                                    │
┌───────▼────────────────────────────────────▼──────────────┐
│ src/index.ts — Cloudflare Worker (D1, cron, bot queue)    │
└───────────────────────────────────────────────────────────┘
        │                                    │
   bot/index.js                     web/ (same engine,
   WhatsApp bridge                   bundled for browsers)
```

## Why it works the way it does

Most of this file is ordinary. These five decisions are not, and they are the
reason the thing might actually change behaviour in a share house.

**Showing up buys influence over the time.** Scheduling weight *decreases* with
absenteeism. The instinct is the opposite — weight the no-shows more so the
time suits them and maybe they come — but that rewards the behaviour and lets
one person drag a seven-person meeting around indefinitely. A floor keeps a
chronic absentee from being erased, and a genuine recurring clash is handled
separately and for free.

**A recurring clash is free; an ad-hoc excuse is not.** Isaac has football
every Monday at 7:30. Declaring that costs nothing, is permanent, and re-picks
the standing time so every future poll routes around it. "Something came up"
spends from a budget of two per period, and once it is gone the meeting goes
ahead without you. Same words, opposite handling, because they are opposite
things.

**A fixed time needs hysteresis.** The incumbent slot carries a stability
bonus and an alternative must beat it by a margin before the meeting moves. A
recurring meeting that relocates every week stops being a schelling point and
attendance collapses.

**Being absent forfeits the right to contest.** Fines compute from the board,
not from an accusation, and uphold themselves unless disputed — by someone who
was at the meeting. This is the load-bearing rule: it converts "come to the
meeting" from a request into the only way to defend yourself, which is why the
accountability code sits next to the scheduler rather than in an app of its own.

**Silence is not an exit.** An unanswered "was this you?" closes by naming
everyone who did not answer, and escalates to the agenda. Ignoring the group
chat stops being free, and nobody had to accuse anyone.

The engine is pure and deterministic. No model is consulted to pick a time,
compute a fine, or decide who owes what — the output gets used to fine people,
so it has to be arguable in a kitchen. An LLM writes one optional sentence of
prose on the Ripple event brief and touches nothing else.

## Running it

Requires Node 22.18+ (the tests use native TypeScript execution, no build step).

```bash
npm install
npm test          # 96 tests, no dependencies beyond node
npm run typecheck
npm run build:web # bundle the engine for the browser UIs
```

### Deploy the Worker

```bash
npx wrangler d1 create arbitrage      # paste database_id into wrangler.toml
npm run db:remote                     # apply schema.sql
npx wrangler secret put BOT_TOKEN     # required: shared secret for the bot
npm run deploy
```

Optional secrets, each of which degrades cleanly when absent:

| Secret | Enables | Without it |
|---|---|---|
| `GOOGLE_PLACES_KEY` | Live venue search | Clearly-labelled sample venues, no invented ratings |
| `ANTHROPIC_API_KEY` | Prose on the event brief | The deterministic summary, which is always present |
| `GOOGLE_OAUTH_ID` / `_SECRET` | Calendar free/busy prefill | The grid, filled in by hand |

### Run the WhatsApp bot

```bash
cd bot && npm install
BOT_TOKEN=... ARBITRAGE_API=https://your-worker.workers.dev \
BANKSIA_GROUP_ID=... node index.js
```

Scan the QR code. Send `!whereami` in the group to get its chat id, then set
`WHATSAPP_CHAT_ID` and restart.

Put each housemate's number on their `members.phone` row in international
format (`+61400000000`) — that is how a reply in the group chat gets matched to
a person. An answer from a number that is not on file is *not* dropped: it comes
back as `needsLink`, and the bot tells the sender their answer has not counted
yet. Silently discarding a real answer would be the worst possible failure in a
system that names people for not answering.

> **whatsapp-web.js is unofficial.** It drives a real WhatsApp Web session, and
> automating an account is against WhatsApp's terms of service — the account can
> be banned. Use a spare number, keep the volume low (this bot sends a handful of
> messages a week), and do not point it at a chat whose members have not agreed
> to it. The official Cloud API cannot post to group chats at all, which is the
> only reason this path exists.

### The standalone prototype

```bash
node scripts/build-artifact.mjs
```

Writes one self-contained HTML file with the engine, styles and app inlined,
generated from `web/ripple/` so it cannot drift from the deployed page.

## Suggestions added mid-plan

The plan fills in asynchronously, so the third person to answer can add an
option the first two never saw. `src/ripple/suggestions.ts` handles that by
treating an answer as one cell per option — each `answered` or `pending` —
rather than as a single submission.

Two consequences:

- **Re-asking is proportional.** Someone who already answered sees only what
  they have not seen, usually one question. `GET .../asks?token=…` returns
  exactly that delta.
- **An option cannot win before people have seen it.** Ranking on approval
  *rate* would let a brand-new suggestion sit at 1/1 = 100% and beat something
  four of six people wanted, so eligibility gates on coverage. `pending` names
  who is holding it up, which is who `POST .../nudge` chases and nobody else.

Coverage is measured over people who can make the chosen time, so someone who
is not coming cannot hold an option hostage.

## Pasting in an event

`POST .../link` accepts Luma, Partiful, Eventbrite, Humanitix and Meetup URLs.
Parsing is pure and network-free; fetching Open Graph metadata is gated on the
parse succeeding, and that ordering is the security property — a server that
fetches whatever URL a user hands it is an SSRF hole. Loopback, private ranges,
IP literals, lookalike hosts and non-http schemes are rejected structurally.

Pasted links are recorded in `directory_submissions` as `pending_review`.
Anyone with a link could otherwise write to Ripple's curated directory.

## The iOS widget

`ios/` holds WidgetKit source for a home-screen and Lock Screen tile. Not
compiled here — see `ios/README.md` for the Xcode target setup and the App
Group step that fails silently when it is wrong.

## What this does not do

- **Straight-line distance, not rail topology.** `geo.ts` measures geography, so
  a spread-out group scores best around Burwood or Strathfield — genuinely where
  the middle of Sydney is, even though such a group usually ends up in the city.
  Half that gap is closed by venue density in `places.ts` (a clubbing plan finds
  nothing in Burwood); the other half needs the Google Directions API in place of
  `estimateTravelMinutes`.
- **The Ripple palette is sampled, not licensed.** Tokens were read pixel-by-pixel
  off screenshots of the shipped iOS app — ground `#F2F1F6`, accent `#709ACC`,
  semantics `#5DB359` / `#F19E49` — and sit in one marked block at the top of
  `web/ripple/app.css`. Type is SF Pro on Apple hardware (what the app itself
  uses) with Inter as the metric fallback, and Playfair Display for the wordmark,
  which is a close stand-in rather than Ripple's actual logo face.
- **Calendar screenshot parsing is not built.** Deferred in favour of Google
  Calendar free/busy, which is free, exact, and needs no vision model.
- **Calendar tokens are stored as issued.** Fine for a share house. Encrypt them
  at rest before pointing this at anyone else.
- **Cost estimates are static.** Good enough to keep a plan inside a budget, not
  good enough to quote.
- **Nothing crawls event sites.** Only links a real user pastes come in. The
  ingestion contract is defined; the discovery half is not built.
- **The widget is uncompiled.** No macOS toolchain in this environment.

## Layout

| Path | What |
|---|---|
| `src/core/` | The engine. Pure, deterministic, 24 tests. |
| `src/banksia/` | Chores, fines, issue polls, house routes. |
| `src/ripple/` | Activities, geography, venues, event brief, hangout routes. |
| `src/integrations/` | Google Calendar free/busy. |
| `src/index.ts` | Worker router, cron, bot queue endpoints. |
| `web/` | Both UIs plus the shared engine bundle. |
| `bot/` | The WhatsApp bridge. |
| `ios/` | WidgetKit widget source (uncompiled). |
| `docs/` | Write-up for review. |
| `schema.sql` | D1 schema, 20 tables. |
