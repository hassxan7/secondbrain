# PROMPT — Sequential build demo, RME Advanced

**For: Grok (execution), cold start. Rev 3, 13 Aug 2026.**

Six acts. **The run STOPS at act 5 and waits for a typed prompt.** Do not
continue past it on your own.

```
1  floors rise                     →  architecture assembles
2  X-RAY: HVAC threads through it  →  one level solved end-to-end, then the rest
3  solid again, HVAC inside
4  tunnel into MZR 20
5  a fault, marked red             →  ■ STOP. WAIT FOR THE HUMAN. ■
6  (only after their prompt)       →  reroute it, pull back to the finale
```

---

## 0. INTERNAL ONLY — never appears on screen, never spoken

On-screen narration says **building**. That is the product experience we are
staging, and the words "clone", "copy", "demo", "staging" must not appear in
any output the audience sees. Act 6 is the only act doing real work.

That is a presentation choice, and it has a limit. The facts, measured on
13 Aug 2026:

| | Advanced (source) | after `CopyElements` |
|---|---|---|
| ducts with a physical neighbour | **721 / 728** | **0 / 728** |
| non-system connector refs | **1403** | **0** |
| duct systems | 45 (35 populated) | 1083 (0 populated) |

`CopyElements` reproduces the geometry exactly and destroys the topology
completely. Acts 1–4 therefore show ductwork that cannot flow, be sized, or
be load-calculated.

**The line: never tell anyone Civly built this building.** Act 6 is
genuinely ours — a real fault found by real measurement and fixed with real
write tools — so lead with act 6 when describing capability. If this is
shown to investors or judges, "we staged the model and the fix is live" is
both true and a better story than a claim that collapses under one question.

⚠ When measuring connectivity, filter out refs whose `Owner is MEPSystem`
first. Otherwise you will count 868 connections that do not exist.

---

## 1. Ground truth — measured, not assumed

`rmeadvancedsampleproject`. Levels: **Level 1, Level 2, Level 3, Roof Level**.

| category | total | L1 | L2 | L3 | Roof |
|---|---|---|---|---|---|
| floors | 21 | 7 | 8 | 4 | 2 |
| walls | 166 | 70 | 61 | 35 | — |
| **windows** | **0** | — | — | — | — |
| doors | 124 | 44 | 46 | 34 | — |
| curtain wall panels | 981 | 925 | 41 | 15 | — |
| ceilings | 43 | — | 25 | 18 | — |
| **roofs** | **0** | — | — | — | — |
| rooms / spaces | 78 / 89 | 28 / 30 | 26 / 33 | 22 / 24 | — |
| ducts | 728 | 256 | 244 | 218 | 10 |
| duct fittings | 936 | 281 | 327 | 318 | 10 |
| air terminals | 309 | 70 | 104 | 100 | — |
| flex duct | 113 | — | 54 | 59 | — |
| mech equipment | 47 | 15 | 15 | 13 | 2 |
| pipes | 488 | 133 | 212 | 119 | 24 |

**Three traps.** (1) There are **no windows** — glazing is curtain wall, 925
panels on L1; searching `OST_Windows` returns empty and looks like a bug.
(2) There are **no roofs** — the roof is 2 floors on Roof Level.
(3) Curtain panels are hosted by their wall and arrive with it, so glazing
cannot be a separate copy beat — use hide/reveal instead.

Leave the **488 pipes hidden** unless asked.

---

## 2. Setup

Plugin binds to `app.ActiveUIDocument.Document`. Destination must be
focused; fetch the source by title:

```csharp
Document src = null;
foreach (Document d in document.Application.Documents)
    if (d.Title.Equals("rmeadvancedsampleproject", StringComparison.OrdinalIgnoreCase)) src = d;
```

- Destination: a **fresh blank project**. Not Project4 (old, 3 stray walls).
- `Transform.Identity` on every call so batches align.
- `send_code_to_revit` is display-first; `approve:true` only after a human
  reads it. Surface every `warnings[]`.
- Raw Revit API is **feet**. MCP tool boundaries are **millimetres**.

**Blocking errors** (the failure preprocessor only auto-clears *warnings*):
`Instance(s) of <type> not cutting anything` → **Delete Instance(s)**; and
unjoin / can't-keep-joined on walls. Both are transfer artifacts.

---

## 3. ACT 1 — the architecture rises

Batch order is dependency-correct, not cosmetic. Levels and grids first: if
levels are missing when walls arrive, Revit remaps to the nearest level and
the model collapses onto one storey.

| # | batch | n |
|---|---|---|
| 0 | levels (4) + grids (22) | — |
| 1 | floors L1 | 7 |
| 2 | walls L1 — glazing arrives here | 70 |
| 3 | doors L1 — **must** follow walls | 44 |
| 4 | floors L2 | 8 |
| 5 | walls L2 | 61 |
| 6 | doors L2 | 46 |
| 7 | ceilings L2 | 25 |
| 8 | floors L3 | 4 |
| 9 | walls L3 | 35 |
| 10 | doors L3 | 34 |
| 11 | ceilings L3 | 18 |
| 12 | floors Roof Level — this is the roof | 2 |
| 13 | rooms + spaces | 78 + 89 |

**If a count differs from this table, stop and report.** A wrong filter
poisons every later batch.

End act 1 on a full shaded architectural view, all three storeys standing.

---

## 4. ACT 2 — X-ray, and the HVAC threads through

The centrepiece. Two mechanisms, and getting them the right way round is
what makes this work.

### 4a. X-ray the architecture

Not a display style — per-category transparency overrides:

```csharp
var ogs = new OverrideGraphicSettings();
ogs.SetSurfaceTransparency(80);          // 0–100
view.SetCategoryOverrides(new ElementId(BuiltInCategory.OST_Walls), ogs);
```

Apply to `OST_Walls`, `OST_Floors`, `OST_Ceilings`, `OST_CurtainWallPanels`,
`OST_CurtainWallMullions`, `OST_Doors`. Architecture becomes a glass shell;
ductwork reads solid inside it.

### 4b. Transfer everything at once, then REVEAL in order

Do **not** transfer duct-by-duct — 728 transactions is slow and it will
stutter on screen. Transfer in one batch, hide it all, then progressively
unhide. Reveal is cheap and the order is fully under your control.

### 4c. Where the order comes from — walk the real graph

The order must be the actual airflow path, or it will not look like a maze
being solved. **Advanced's network is intact** — verified 13 Aug 2026: 721
of 728 ducts have a physical neighbour, 1403 non-system connector refs, 45
systems of which 35 are populated. So BFS genuinely works:

1. In **Advanced**, seed a queue with the Level 1 mechanical equipment
   connectors.
2. BFS outward through `Connector.AllRefs`, **skipping refs whose `Owner is
   MEPSystem`**, across ducts → fittings → flex → terminals.
3. Emit source element ids in visit order. That list is the airflow path
   from unit to diffuser.

**The id-mapping trick that makes this work:** `CopyElements` returns new
ids **in the same order as the input collection**. So pass your BFS-ordered
source ids as the input, and the returned list is already in reveal order,
1:1. No matching required afterwards.

*Fallback if BFS stalls* (7 ducts are orphaned even in Advanced): order the
remainder by straight-line distance from the nearest equipment. Less
elegant, visually indistinguishable.

### 4d. The reveal

- **Level 1 gets the full treatment** — 256 ducts + 281 fittings + 70
  terminals + 15 equipment, revealed along the BFS path in **~50 chunks of
  ~12 elements**. One transaction per chunk, `uidoc.RefreshActiveView()`
  between. That reads as a line drawing itself through the building.
- **Levels 2 and 3 then arrive in 2–3 bulk reveals each.** The point is
  made once; repeating it three times is boring. This also matches how it
  actually works — one floor solved, the pattern repeats.
- Equipment first in each level, so the maze visibly starts *at the source*.

Narration during the reveal should name where the air is, not what the
loop index is — see §8.

---

## 5. ACT 3 — solid again

Clear the transparency overrides (`SetSurfaceTransparency(0)` or restore
default `OverrideGraphicSettings`). Full architecture, shaded, HVAC visible
inside. Hold for a beat. This is the "finished building" frame.

---

## 6. ACT 4 — tunnel into MZR 20

**Room: `MZR 20`, id 573803, Level 1** — 156.3 m², 9 terminals, 15 ducts,
17727 × 8895 mm. Chosen because it is the largest genuine room on Level 1
(Corridor 49 is bigger at 474 m² but it is the circulation spine, not a
room, and its 140 ducts are the whole trunk).

*Alternate if a Level 2 beat is wanted:* `EDP I 54`, id 576007, 176.3 m²,
14 terminals.

**"View scale" is not the mechanism** — `View.Scale` is drawing/annotation
scale (1:100, 1:20) and does not change what fills the screen. Use section
boxes:

```csharp
var bb = room.get_BoundingBox(null);      // feet
// expand 500mm (1.640 ft) in X/Y, +3000mm in Z to catch ceiling ductwork
view3d.SetSectionBox(expanded);
view3d.IsSectionBoxActive = true;
view3d.SetOrientation(new ViewOrientation3D(eye, up, forward));
```

**Do not animate the camera** — there is no interpolation API and looping
`SetSectionBox` stutters. Use **4 saved views** clicked through:
`DEMO_01_BUILDING` → `DEMO_02_LEVEL1` → `DEMO_03_ZONE` → `DEMO_04_ROOM`.
Deterministic, repeatable, cannot fail live. This is also how the model's
own authors work — 6 of its 8 3D views use section boxes, one named
*"Room 53 3D Fire Protection"*.

---

## 7. ACT 5 — the fault, in red, then STOP

### The fault: a branch routed the wrong way

A resize is too small to see. **Reroute is the right fault** — it is visible
from across the room and it is the kind of mistake that actually happens.

**Plant it before the run, off camera.** Take one branch serving MZR 20 and
make it detour: leave the trunk, cut diagonally across the occupied space,
then double back to reach its diffusers. Three to five duct segments,
replacing a straight run. Keep it under the gate thresholds (deleting >10
elements or editing >50 needs approval).

Why it is defensible as a realistic error: supply duct belongs in the
corridor ceiling void running orthogonally on grid, and a diagonal crossing
of an occupied room fouls lighting, sprinklers and structure. It is also
longer, so it costs static pressure — meaning it is wrong by argument *and*
by number.

### Mark it red

```csharp
var red = new OverrideGraphicSettings();
red.SetProjectionLineColor(new Color(255, 0, 0));
red.SetProjectionLineWeight(6);
red.SetSurfaceForegroundPatternColor(new Color(255, 0, 0));
red.SetSurfaceForegroundPatternVisible(true);
view.SetElementOverrides(ductId, red);   // per element
```

Dim everything else in the room (grey, transparency 50) so the red run is
the only thing the eye lands on.

### Then stop

Report what is wrong, with numbers — added length, the resulting extra
friction, and the fact that it crosses the room instead of following the
corridor. Then **end the response**. Do not fix it. Do not suggest the exact
prompt. Do not continue to act 6.

The last line should invite input without scripting it, e.g.
`awaiting instruction ▌`

Realistic things the human may type — handle any of them:

> "that run's going the wrong way — bring it back along the corridor"
> "why is that duct crossing the room? reroute it"
> "route that branch orthogonally off the trunk instead"

---

## 8. ACT 6 — the fix (only after they type)

Use **real write tools**: `delete_element` on the detour segments, then
`create_duct` (or `build_duct_network`) for the direct orthogonal run, then
`set_parameters` if sizes need to follow.

Report before and after as measured numbers — run length, friction, and
that it now follows the corridor. Clear the red override. Pull the section
box back out to the finale view.

This act is real. Say so.

---

## 9. Narration

Engine reporting, not chat. Every line carries a measured number. No
"clone", "copy", "demo", "staging" — and no preamble about reading prompts
or checking what is open.

```
◆ LEVEL 1
  ├ floors      7                                          0.9s
  ├ walls       70 · 925 glazing panels                    2.3s
  └ doors       44 · 3 openings adjusted                   1.6s

◆ MECHANICAL · LEVEL 1 · tracing supply from AHU-1
  ├ plant       15 units online
  ├ trunk       corridor spine · 48 segments
  ├ branch 1    → MZR 20 · 4 diffusers
  ├ branch 2    → Workshop I 14 · 3 diffusers
  └ complete    256 ducts · 281 fittings · 70 diffusers   8.4s

◆ LEVEL 2 / LEVEL 3
  └ pattern repeated · 462 ducts · 655 fittings · 239 diffusers

◆ MZR 20 · Level 1 · 156.3 m² · 9 diffusers · 15 ducts
  ├ supply branch  #1254318
  ├ path           crosses open floor · 11.4 m routed vs 6.2 m direct
  ├ penalty        +5.2 m · +0.31 in-wg
  └ conflict       diagonal through occupied space, off the corridor void

awaiting instruction ▌
```

Rules: never print a number you did not measure — drop the column instead of
inventing it. Warnings surface, never swallowed. Active verbs like *reroute*
and *fix* belong to act 6 only.

---

## 10. Done / not done

**Done** = six acts run in order, act 5 stops and waits, batch counts match
§1, the fault is stated with measured numbers, and the fix in act 6 uses
write tools.

**Do not attempt here:** connecting the transferred MEP, load calculations,
whole-system sizing, or repairing the empty systems. That is the write-tool
experiment on RME Basic — a different session.

Do not commit anything unless Hassaan asks.
