---
title: "Civly Product Trajectory — MCP, Harness, Agentic IDE"
type: analysis
tags: [civly, strategy, architecture, moat, ML, agentic-ide, roadmap]
created: 2026-09-08
updated: 2026-09-08
sources: 3
---

## Question / Prompt

What is Civly actually building, over what horizon? The MCP is what exists. It was never
meant to be the whole thing. This page records the three stages, what each is for, and
what has to be true before the next one starts.

Stated by Hassaan, 21 Aug 2026: *"we're a plugin rn and all we technically are is a
harness — that's what even Cursor is. So what if we actually make an IDE type
application, which has connectors but plugins, allows AI to use plugins, and is modeller
agnostic."*

---

## Findings

### Stage 1 — the MCP (now, shipped to Ring 2 in parts)

A Revit MCP server plus a C# plugin. See [[Civly Architecture Reference]] for the stack.

**What it is for:** proving the hands work, and getting into real firms fast enough to
earn the data that Stage 2 needs. It is a wedge and a credibility instrument, not the
business.

**Hassaan's own framing, 12 Aug:** *"I think even an MCP isn't a startup."* That is the
right instinct and it is why this page exists — but the MCP is what produced 38/38 ducts
in real Revit, the Kongwei pilot, and the demo that gets meetings. Do not skip it.

**What it cannot do:** decide *where* things go, or *why* 200mm and not 250mm. It places
what it is told to place. That gap is Stage 2.

### Stage 2 — the harness + ML (in progress, this is the moat)

Two distinct things share the word "harness", and keeping them apart matters:

1. **The test harness** (`harness/`, mock plugin, Ring 0/1) — how the code is proven
   without Revit. Built.
2. **The learning harness / DI loop** — the thing that makes Civly better than a prompt.
   Take a matched pair (architectural model + its real MEP model), **delete the MEP, ask
   Civly to rebuild it, then diff what it built against what the engineer actually
   built.** Iterate. This is Surface 4 in [[Civly Architecture Reference]].

The DI loop is the answer to *"what can we have that no one else can?"* — the question
Yash keeps pressing (12 Aug: *"Moat is such a weird thing, I don't know what someone can
get that no one else can"*). The answer is not the code. It is **matched input/output
pairs at volume**, which is why [[Data Partnership Moat]] and this page are the same
strategy seen from two ends.

**The physics-first correction (7 Aug), which is load-bearing.** The Snowdon reference
model — an Autodesk demo file — was found to contain real engineering errors: one duct at
66x its friction target (300 CFM through a 4-inch duct at 3438 FPM: deafening and
undeliverable), another at 10x, one system with no flow data at all. **Anything trained
to imitate that data learns those faults.** Physics-first caught all three on the first
pass. So:

> **Deterministic where physics decides. Learned where practice decides.**
> Sizing, pressure drop, code clearances: calculate them, never predict them.
> Routing choices, layout conventions, what a firm habitually does: that is what the
> learned layer is for.

This also answers Hassaan's 6 Jul worry (*"we might be overreaching with the ML
already"*) and `docs/00`'s stance (*"deterministic tools, no ML in the execution
path"*). Those are not in conflict with Stage 2. The ML sits **beside** the execution
path, choosing among valid options; it never produces a number.

**Routing as a graph problem.** The current mental model: A\* over a graph (NetworkX),
like Google Maps but hitting every room with supply and return. Stated to the pilot
architect 30 Aug and it landed — *"now I actually understand that the laying out is a
graph problem."*

**What must be true before this compounds:** matched pairs at volume. Today's supply is
scraped tutorials, a handful of sample files, and one paid schematic set. That is enough
for a demo and not enough for a model.

### Stage 3 — the agentic IDE (later, and it is the actual company)

A modeller-agnostic application: chat interface, connectors and plugins, the intelligence
in the middle, so the user does not open Revit at all.

**Yash's correct objection (21 Aug):** an IDE means competing with Revit the way Cursor
competes with VS Code — you would have to reproduce *all* functionality and convert
people off Revit. That is a long way out.

**The resolution both founders landed on:** do not sell a Revit replacement. Sell **our
own interface with the intelligence behind it**, which drives Revit today, ArchiCAD next,
and whatever else later. The user's relationship is with Civly; Revit becomes an engine
underneath. Embedding Revit rather than replacing it is the open question.

**Why this is strategically necessary, not just ambitious:** *"we can't be umbrellaed by
Revit in reality — if it weren't for Revit exposing its API endpoints our MCP wouldn't
even work."* A product whose existence depends on a competitor's API permission is a
product with a landlord. Also relevant: GeoPogo's Claude-to-Revit plugin already exists,
and a plugin is not defensible.

**The near-term stand-in:** Civly Desktop (Electron, `docs/21`) is Stage 3's first
concrete step, not a detour. Same chat UI, same backend, the shell decision deferred
(`docs/19`).

---

## The dependency chain, stated so it can fail

```
MCP (hands)  ──proves capability──>  pilots + demo  ──earns──>  matched data
                                                                     │
                                            learning harness <───────┘
                                                     │
                                    the intelligence that is worth an interface
                                                     │
                                              agentic IDE
```

Read right to left: **the IDE is only worth building once there is intelligence worth
wrapping, and that intelligence only exists once there is data, and the data only comes
from pilots the MCP earns.** Skipping to the IDE gives a nicer wrapper around the same
commodity prompt. That is the failure mode to avoid.

## Limitations

- The learning harness has produced **no trained model**. It has produced a manual loop
  that "actually works once you do it" (25 Aug) but requires screenshotting a tutorial's
  real output by hand. It is not yet a pipeline.
- Volume needed is contested: the figure quoted to Sasha was ~100,000 files for a
  firm-specific model. Nothing on hand approaches that.
- Stage 3 has no design, no spec, and no date. It is a direction, not a plan. Do not put
  it on a slide as a commitment.
- The public/free data avenues have been checked and mostly fail: CADBull is noisy and
  incomplete, AS 1668.2 and much of the NCC sit behind paywalls.

## Related pages

[[Civly Architecture Reference]] · [[Data Partnership Moat]] ·
[[BIM Drafting vs Coordination]] · [[Level of Development (LOD)]] ·
[[Civly Direction — Drafting-First Pivot (Jun 2026)]] · [[Deliverables — Sep 2026]] ·
[[Data & Credibility — Core Problem & Open Decisions (SF, 14 Jul)]]
