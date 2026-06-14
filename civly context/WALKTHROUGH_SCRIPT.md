# Sample-project walkthrough — video script (~4 minutes)

Recording setup: Civly at http://localhost:8080, Schependomlaan sample on the
desktop, browser full-screen, no other tabs. Speak the *italic* lines.

**[0:00 — Upload]**
Drag `Schependomlaan.ifc` onto the upload button.
*"This is a real Dutch residential project — a 49-megabyte IFC. Watch the
clock."* Ingest completes in seconds; the Model tab shows 6 storeys, 100
spaces. *"Civly read every space and matched 99 of 100 Dutch room names to
functions automatically. One space needs a human — that's this dropdown."*
Map the one "map me" space. **Elapsed: ~45 s.**

**[0:45 — Trust]**
Open the Dashboard tab. *"Everything you see is computed by a deterministic
rules engine — no AI in the numbers."* Click the zone airflow figure.
*"Every number is clickable: the formula, the rule, the source, and an honest
badge when a value is an industry default we haven't had verified yet."*
Point at an egress REVIEW pill, hover the note. **Elapsed: ~1:30.**

**[1:30 — The scenario]**
Scenarios tab. Type into the describe box:
`make floors 1 and 2 cellular offices, increase density to 8 m2 per person`
*"Plain language goes to a local model running on this machine — nothing leaves
the building — and it only proposes; I confirm."* Show the two proposed
mutations, click **Create scenario**. **Elapsed: ~2:15.**

**[2:15 — The cascade]**
Compare tab, tick the scenario, **Compare**. Read the sentence aloud:
*"Required riser airflow for zone 1 goes from zero to 0.75 cubic metres per
second — the suggested shaft is 700 by 600. That sentence is the week of
engineer back-and-forth this replaces."* Scroll the delta table, traffic
lights. **Elapsed: ~3:00.**

**[3:00 — Show the client]**
3D tab. Pick the scenario in the highlight dropdown. *"Orange is everything
this scenario touches — this is the picture you put in front of a client."*
Click a space to show its identity. **Elapsed: ~3:30.**

**[3:30 — The artifact]**
Back to Compare → **Export comparison PDF**. Open it; show the assumptions
table and the disclaimer. *"Every assumption cited, every unverified default
badged, disclaimer on every report. Total elapsed: under five minutes."*
Stop talking. Let them react.
