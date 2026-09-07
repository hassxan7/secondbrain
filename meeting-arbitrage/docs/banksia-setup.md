# Running Banksia

Everything below is on a free tier. The only thing that ever costs money is
SMS, and SMS is optional.

## What it costs

| Piece | Provider | Free allowance | What a house actually uses |
|---|---|---|---|
| The site and the API | Cloudflare Workers | 100,000 requests/day | a few hundred |
| The database | Cloudflare D1 | 5 GB, 5M reads/day | a few thousand rows |
| The half-hourly chase | Cloudflare Cron | included | 48 runs/day |
| Email reminders | Resend | 3,000/month | ~40/month for seven people |
| Reading a photo | Anthropic API | pay per use | 1–2c for a sink photo, 2–5c for a whole board |
| WhatsApp messages | your own number | free | unlimited |
| SMS | Twilio | none — **~5c/message** | skip it unless email is being ignored |

Seven people, three messages a week each, is about 84 emails a month. The free
Resend tier is 3,000. There is no version of this house that costs anything.

## Deploying

```bash
npx wrangler login        # opens a browser, once
npm run setup             # everything else
```

`npm run setup` creates the D1 database, writes its id into `wrangler.toml`,
applies `schema.sql`, seeds the seven housemates and the eight chores, and
deploys. It is safe to re-run — including after a half-finished attempt, which
is the state the manual version usually leaves you in.

It prints your URL at the end. The house dashboard is at `/h/banksia`.

### Turning on the reminders

```bash
npx wrangler secret put RESEND_KEY     # from resend.com, free
npx wrangler secret put RESEND_FROM    # e.g.  Banksia <house@yourdomain.com>
```

Resend needs a domain you control, verified with a DNS record. If you do not
have one, use their `onboarding@resend.dev` sender for testing and add a domain
later — or skip email entirely and run the WhatsApp bridge, which is free and
needs no domain.

Nothing breaks without these. The reminders are still computed and queued;
they just sit in the `outbox` table until something drains them.

### Turning on board photos

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Without it, the photo button returns "photo import is not configured — tap the
grid instead", and the grid always works.

### SMS, if you decide you need it

```bash
npx wrangler secret put TWILIO_SID
npx wrangler secret put TWILIO_TOKEN
npx wrangler secret put TWILIO_FROM
```

Roughly five cents a message in Australia. At three messages a week for seven
people that is about four dollars a month, and only for the people who gave a
number instead of an email. Start without it.

### The WhatsApp bridge (optional, free)

```bash
npx wrangler secret put BOT_TOKEN     # any long random string
BOT_TOKEN=<same string> API=<your url> npm run bot
```

Scan the QR code with a spare phone number. This uses `whatsapp-web.js`, which
drives a real WhatsApp session and is **not** an official API — it violates
WhatsApp's terms of service and the number can be banned. Use a spare SIM, not
your own. The official Cloud API cannot post into a group chat, which is the
only thing that would make it useful here.

It has to keep running somewhere. A laptop that sleeps is fine for a trial;
a $5 VPS or an old Raspberry Pi is the version that survives a term.

## Running the "who did this" poll

The mechanic in one line: **not answering is an answer.**

1. Somebody finds the thing. In the group chat: `!issue pan of noodles left on the stove`
   — or on the Raise screen, "Ask the house about something".
2. Every housemate is asked once, individually. Two buttons: *Was me* / *Not me*.
3. It closes 24 hours later, and one of three things is true:
   - **Someone said "was me".** Closed. Nothing else happens — owning it is the
     cheapest possible outcome, which is the point.
   - **Everyone said "not me".** It goes on the meeting agenda as a house
     problem rather than as an accusation of anybody.
   - **Some people never answered.** They are named as not having answered.
     Not accused — that distinction is the whole design. Silence is the one
     thing the system will not treat as innocence, because otherwise ignoring
     the group chat is the winning move and everybody learns it within a month.

Nobody has to point at anyone. The poll does the pointing, and it points at a
behaviour (not answering) rather than at a person.

## Where the rules live

| Thing | File | Notes |
|---|---|---|
| Meeting time | `src/core/arbitrage.ts` | scoring, weights, hysteresis |
| Standing time | `src/core/anchor.ts` | weekly-pattern folding, re-fix budget |
| The board | `src/banksia/board.ts` | grid, photo merge, standings |
| 4 tasks, $100 | `src/banksia/pot.ts` | stakes, deduction, distribution |
| Who gets chased | `src/banksia/reminders.ts` | the three-a-week cap lives here |
| Joining | `src/banksia/onboarding.ts` | validation, availability modes |
| Anonymous | `src/banksia/anonymous.ts` | cooling window, name stripping |

All of it is pure and tested — `npm test` runs 253 tests with no database and no
network. If the house wants to argue about a rule, change the number in the
file, run the tests, redeploy.

## What is not built

- **Money does not move.** The pot is tracked, not held. Somebody collects the
  $100 and the app records who is clear at the end of term. Handling real money
  needs a payment processor, a refund policy and someone accountable for a float
  — considerably more than a chore board is worth.
- **The photo import needs a decent photo.** Glare on a whiteboard, a hand over
  a column, or handwriting nobody could read either produces a partial import.
  It only ever adds, so the fix is to tap the missing cells.
- **The WhatsApp bridge is unofficial** and can be banned. See above.
- **No one has verified a tick.** Anyone can tick anything in their own column.
  Challenging a claim exists (`!challenge`) and suspends it until the meeting,
  but the honest description is that this is a system for a house that is
  mostly honest and occasionally forgetful, which is most houses.
