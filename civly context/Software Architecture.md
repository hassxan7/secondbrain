ARCHITECTURE.md — Civly Feasibility Engine
System overview
            ┌──────────────────────────────────────────────┐
            │                 React + Vite UI               │
            │  Viewer (@thatopen)  Mapping  Scenarios  Cmp  │
            └───────────────▲──────────────────────────────┘
                            │ REST (FastAPI)
┌───────────────────────────┴────────────────────────────────┐
│                        engine (Python)                      │
│                                                             │
│  ingest/ ──► semantic/ ──► calcs/ ◄── rules/ (YAML packs)   │
│  (IfcOpenShell)  (typed model)  (deterministic)             │
│                      │                                      │
│                 scenarios/ (mutations + recompute)          │
│                      │                                      │
│                 reports/ (templates; optional llm/ polish)  │
│                                                             │
│  store: SQLite (projects, mappings, scenarios, results)     │
│  llm/: Ollama adapter — OPTIONAL, app fully works without   │
└─────────────────────────────────────────────────────────────┘
Key decisions and why
D1 — IFC as the only input format. Every authoring tool (Revit, ArchiCAD, Tekla, Vectorworks) exports IFC; building on it makes Civly vendor-neutral and keeps the LOI firms' existing workflow untouched. IfcOpenShell is mature, open source, and free.

D2 — Semantic model layer between IFC and calcs. Calcs never read IFC entities. ingest/ produces typed Pydantic objects (Project, Storey, Space, Envelope, ElementInventory). This isolates IFC messiness (and there is a lot — real files have missing quantities, unnamed spaces, broken storey assignments) in one module, and lets us unit-test calcs with synthetic fixtures.

D3 — Quantities: trust but recompute. Use IFC base quantities (Qto_*) when present; recompute area/volume from geometry via IfcOpenShell when absent; flag discrepancies

5% in the UI. Real-world files lie; the product must not.

D4 — Rules engine = data interpreter. A rule pack is a directory of YAML files (rules/au-ncc/ventilation.yaml, parking.yaml, …). The interpreter resolves a rule lookup by (jurisdiction, category, space_function) with fallback to rules/generic/. Every resolved value carries its citation through to the report. Adding Germany or the UK later = adding a directory, no code.

D5 — Scenarios are declarative mutations, never geometry edits. A scenario is JSON: [{op: change_space_function, selector: {storeys: [3,4,5,6]}, to: office_cellular}]. Recompute = apply mutations to a copy of the semantic model, rerun calcs. This is why recompute is < 5 s and why results are perfectly diffable.

D6 — LLM strictly at the edges. Two uses only: (1) parse plain-language scenario requests into mutation JSON — always shown to the user for confirmation before running; (2) rewrite template report prose more fluently. Numbers never pass through the LLM. Adapter pattern: llm/ollama.py implements parse_intent() and polish_text(); llm/disabled.py implements the same interface with form-fallback and raw templates.

D7 — Local-first deployment. docker compose up gives a firm the whole product on one machine. Confidentiality is a feature: discovery showed firms won't even screen-share their PLM systems. SQLite is sufficient at this scale; do not add Postgres in v1.

Module specs
ingest/
load_ifc(path) -> IfcModel (IfcOpenShell wrapper, schema detect 2x3/IFC4)
extract_storeys, extract_spaces (name, LongName, area, volume, storey, centroid), extract_envelope (window/curtain-wall areas by orientation → WWR), extract_inventory (element counts + quantities by class)
Geometry fallback: ifcopenshell.geom with world coords for area/volume recompute.
Output: SemanticProject (Pydantic), serialized to SQLite as JSON.
semantic/
Space taxonomy enum + per-space function (mapped by user or matched from name via a deterministic synonym table first; LLM suggestion only as a labeled suggestion).
RiserZone: user groups storeys into zones served by a shaft (simple UI step).
calcs/
Each calc is a pure function (SemanticProject, RuleSet, ScenarioParams) -> ResultSet.

ventilation.py — occupancy → outdoor air → zone airflow → duct area → shaft size. Formulas in RULES_SPEC.md §2–3. Every intermediate value is kept in the result tree.
parking.py, sanitary.py, egress.py, efficiency.py — RULES_SPEC.md §4–6.
quantities.py — inventory roll-ups (concrete m³, steel t estimate, facade m²).
scenarios/
apply(project, mutations) -> project' (immutably), run(project') -> ResultSet, compare(results...) -> DeltaTable.
reports/
Jinja2 HTML templates → PDF via WeasyPrint (free). Sections: summary, assumptions, per-calc tables with citations, deltas, disclaimer (PRD §9, non-removable).
api/
POST /projects (upload IFC), GET /projects/{id}/semantic, PUT /projects/{id}/mapping, POST /projects/{id}/scenarios, POST /scenarios/{id}/run, GET /compare?ids=…, GET /reports/{id}.pdf, POST /intent (LLM parse; returns proposed mutations, never executes).
web/
Pages: Upload → Semantic review/mapping → Dashboard (baseline results) → Scenario builder (form + optional text box) → Comparison → Report.
Viewer: load IFC via @thatopen/components; color by function; selection sync with result tables. Keep viewer concerns in one component; the app must work if WebGL fails (tables are the product, the viewer is the wow).
Performance notes
Parse once, cache SemanticProject; scenario runs never re-read the IFC.
Geometry iteration with ifcopenshell.geom.iterator and multiprocessing.
50 MB file budget: parse+extract < 60 s on M-series Mac.
Security/privacy
No outbound network calls in the engine. CI test asserts this (socket guard).
Uploaded files stay in a local project directory; "delete project" removes them.