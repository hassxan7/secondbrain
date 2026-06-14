# Civly Quickstart — for pilot firms (2 pages)

## What Civly does

Civly reads your **IFC model** and gives you, in minutes:

- **Ventilation pre-sizing** — outdoor air per space/zone, duct cross-sections,
  suggested shaft clear dimensions, per riser zone
- **Feasibility screening** — parking demand vs yield, bicycle spaces, sanitary
  fixture counts, egress screening (PASS / REVIEW / FAIL per storey)
- **Yield metrics** — GFA, NLA, efficiency, facade ratios, quantity roll-ups
- **Scenarios** — "make floors 1–2 cellular offices at 8 m²/person" without
  redrawing anything, with side-by-side deltas:
  *"Required riser airflow for zone Z: 0.27 → 0.33 m³/s (+21%); suggested shaft
  clear size 500×300 → 600×300."*
- **One-click PDF report** with every assumption cited

Everything is computed by a deterministic rules engine — same model in, same
numbers out, every number clickable to its rule and source citation. Values we
haven't had verified by a licensed engineer yet carry a visible
**"default — verify"** badge. *Civly is design assistance, not certification.*

## Install (15 minutes, IT-friendly)

1. Install Docker Desktop.
2. `docker compose up -d --build` in the Civly folder.
3. Open **http://localhost:8080**.

Your models and results stay on this machine. Civly makes no internet calls.

## First session (5 minutes)

1. **Upload** — drag your IFC export in. Most space names auto-map to functions
   (English, Dutch, Swedish, German understood).
2. **Model tab** — fix any "map me" spaces with the dropdown. Check the
   diagnostics banner; if it says *no spaces found*, see the Revit export guide.
3. **Zones** — group storeys into riser zones (or keep the default single zone).
4. **Dashboard** — baseline results. Click any number to see the rule behind it.
   Set your council's parking rates under *Rule overrides*.
5. **Scenarios** — build a variation with the form (or describe it in plain
   language if the assistant is enabled — you always confirm before it runs).
6. **Compare** — tick scenarios, see deltas and traffic lights. **Export PDF.**
7. **3D tab** — the model coloured by function; pick a scenario to highlight
   what it changes (great in client meetings).

## Jurisdictions

Switch rule packs (top right): **Australia (NCC 2022)**, **Hong Kong (CoP FS
2011 / Cap 123I / HKPSG)**, or generic defaults. Rates that vary by council/
district (parking!) are meant to be set per project via Rule overrides.

## When something looks wrong

- Numbers you disagree with → click them; the rule, value, and source are shown.
  Override per project, or tell us — rule values are data, fixed in minutes.
- Spaces missing → the diagnostics banner says why (usually export settings).
- Anything else → send us the feedback form and (if possible) a throwaway IFC.
