---
title: "Meeting Arbitrage — Banksia & Ripple"
type: analysis
tags: [build, scheduling, banksia, ripple, accountability, whatsapp, cloudflare]
created: 2026-08-25
updated: 2026-08-25
sources: 0
---

Built a shared availability-arbitrage engine serving two use cases: the Banksia house's standing weekly meeting (with chore/fine accountability) and Ripple Social's hangout planning links. Code lives in `meeting-arbitrage/` on branch `claude/banksia-meeting-arbitrage-odscrq`. This page records the design decisions worth keeping; the operational detail is in `meeting-arbitrage/README.md`.

## Question / Prompt

Calendly and its clones let an organiser offer times and a single invitee pick one. Neither use case is that shape:

- **Banksia** needs a *fixed* weekly time that survives contact with seven housemates, one recurring clash (Isaac's Monday football), and one chronic no-show (Pete) — plus a mechanism that makes the meeting worth attending at all, since the chore fines are never enforced.
- **Ripple** needs a shareable link that arbitrages time **and** activity **and** budget **and** travel across a Sydney friend group spread over several suburbs.

## Methodology

One deterministic engine, two front doors. No model decides a time, a quorum, or a fine — the output is used to fine people, so it has to be arguable in a kitchen. An LLM writes one optional sentence of prose on the Ripple event brief and nothing else.

Stack: Cloudflare Workers + D1, `whatsapp-web.js` for the group bot, Google Calendar free/busy for grid prefill, Google Places for venues. 96 tests, no runtime dependencies in the engine.

## Findings

### The five decisions that carry the system

**Showing up buys influence over the time.** Scheduling weight *decreases* with absenteeism. The instinct is to weight no-shows more so the time suits them — but that rewards the behaviour and lets one person drag a seven-person meeting around forever. A floor stops a chronic absentee being erased entirely.

**A recurring clash is free; an ad-hoc excuse is not.** Declaring "football every Monday" costs nothing, is permanent, and re-picks the standing time so every future poll routes around it. "Something came up" spends from a budget of two per period; once spent, the meeting proceeds without you. Same sentence in the group chat, opposite handling, because they are opposite things. This is the distinction that separates Isaac from Pete without anyone having to say so out loud.

**A fixed time needs hysteresis.** The incumbent slot carries a stability bonus and must be beaten by a margin before the meeting moves. A recurring meeting that relocates weekly stops being a schelling point and attendance collapses — which is likely part of what already happened.

**Being absent forfeits the right to contest.** Fines compute from the board rather than from an accusation, and uphold themselves unless disputed *by someone who was at the meeting*. This is the load-bearing rule. The house's stated problem was never unclear rules — it was that enforcement requires somebody to personally accuse a housemate at dinner, and nobody wants to be that person. Making attendance the price of arguing is what turns the meeting from a request into the only venue where you can defend yourself.

**Silence is not an exit.** An unanswered "was this you?" closes by naming everyone who did not answer, and escalates to the agenda. Ignoring the group chat stops being free, and it costs less social capital than accusing someone.

### Two bugs the build surfaced

**Greedy itinerary construction was provably wrong.** On a $40 ceiling it took the $28 dinner four people voted for, then found nothing fitted in the remaining $12 — while pool ($15) and trivia ($25) came to exactly $40 and carried six votes. Replaced with an exhaustive search over combinations (one candidate per category caps it at a few dozen). Directly serves the "people want to do multiple activities" requirement.

**A challenge could be laundered.** Re-ticking a challenged chore claim silently cleared the challenge, because deduplication kept the last claim per task. Challenges now stick to the task.

### The budget rule that matters

The itinerary ceiling is the **minimum** budget among attendees, not the average. An average silently prices out whoever is broke this fortnight — precisely the failure the budget field exists to prevent, and precisely the thing students will not say out loud in a group chat.

## Limitations

- **Straight-line distance, not rail topology.** A spread-out Sydney group scores best around Burwood/Strathfield — genuinely the geographic middle, though such groups usually end up in the city. Half the gap closes via venue density (a clubbing plan finds nothing in Burwood); the other half needs the Google Directions API.
- **Ripple's brand colours are a placeholder** — ripplesocial.me was unreachable from the build environment. All six hexes sit in one marked block. **Open action: get the real palette from Isaac.**
- **`whatsapp-web.js` is unofficial** and against WhatsApp's terms; the bot account can be banned. Use a spare number. The official Cloud API cannot post to groups at all, which is the only reason this path exists.
- **Calendar screenshot parsing was dropped** in favour of Google Calendar free/busy — free, exact, and no vision model.
- Cost estimates are static; enough to keep a plan inside a budget, not enough to quote.

## Open Questions

- Does the veto budget of two per period hold up, or does Pete simply stop engaging entirely once it is spent?
- Should the fine escalate for repeat weeks, or does a flat $5/task stay more defensible?
- For Ripple: is minimum-budget the right ceiling, or should one very tight budget be allowed to opt out of a stop rather than cap the whole night?
- Does Ripple want this as a feature inside the app, or as a public link that drives installs?

## Related pages

[[Civly - Overview and Status]] · `meeting-arbitrage/README.md`
