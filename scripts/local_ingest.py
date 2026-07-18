"""
local_ingest.py
---------------
Unified local LLM ingest for the Civly Brain Obsidian vault.
Runs on Ollama (qwen2.5:14b). Zero cloud credits.

Three handlers — auto-detected by folder or file content:

  1. WHATSAPP  → raw/whatsapp/_chat.txt        → strategy/Civly To-Do — DATE.md
  2. TRANSCRIPT → raw/*.md (YouTube transcript) → injects [!tip] + ## Notes into file
                                                → creates pages/sources/Title.md
  3. CRM        → raw/crm/*.md or *.txt         → creates CRM/First-Last.md

Usage:
    python local_ingest.py <path-to-file>
    python local_ingest.py --watch          # watch mode (requires watchdog)
"""

import re
import sys
import json
import argparse
import textwrap
from datetime import datetime, timedelta
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("Run: pip install requests watchdog")

# ── Config ────────────────────────────────────────────────────────────────────

VAULT      = Path(r"C:\Users\hassa\OneDrive\Documents\Civly Brain")
MODEL      = "qwen3:14b"
OLLAMA_URL = "http://localhost:11434/api/generate"
MAX_CHARS  = 80_000   # qwen2.5:14b has 32k token context; 80k chars ≈ 26k tokens

WATCH_DIRS = {
    "whatsapp":   VAULT / "raw" / "whatsapp",
    "transcript": VAULT / "raw",
    "crm":        VAULT / "raw" / "crm",
}

# ── Civly context — injected into every LLM call ─────────────────────────────
#
# This tells the local model what Civly is, what's buildable, and how to
# evaluate relevance. Update this as the product evolves.

CIVLY_SYSTEM_PROMPT = """
You are the knowledge assistant for Civly, an AI-powered BIM feasibility tool
for Australian architects and property developers. Keep this context in mind
for every task.

## What Civly does

Given a site address and basic parameters (storeys, building class, GFA), Civly
automatically generates a compliant BIM model and a feasibility report.

Architecture — three layers:
  Layer 1  BIM Generator   → Claude Code + Tapir MCP → Archicad
                              Places structural elements, MEP risers, core,
                              egress stairs using parametric Tapir API calls.
  Layer 2  Feasibility Engine → Python (ifc_writer/ + calcs/ + rules/)
                              Reads the IFC, runs NCC compliance checks,
                              outputs a PDF report.
  Layer 3  React UI         → input form + PDF viewer, hosted on web.

Four implementation surfaces (where new code actually goes):
  1. Tapir MCP calls   — placing/configuring Archicad elements via JSON-RPC
  2. IFC writer        — ifc_writer/mep.py; writes MEP elements to IFC
  3. YAML rule packs   — rules/*.yaml; NCC rates, thresholds, citations
  4. Calc functions    — calcs/*.py; egress, ventilation, sanitary, parking

## What Civly currently generates
- RC columns: 400×400mm on 7.2m grid
- Ground slab: 300mm RC
- Upper slabs: 200mm RC flat plate
- MEP risers: hydraulic, electrical, mechanical shafts in core
- Egress: compliant stair dimensions from calcs/egress.py
- Ventilation & sanitary fixture counts from NCC Volume 1

## What Civly is NOT doing yet (out of scope)
- Structural engineering calculations (no AS 3600 beam/column design)
- Fire engineering (Part C NCC)
- Energy efficiency (Part J NCC / NatHERS)
- Hydraulic engineering beyond riser placement
- Cost estimating
- Town planning / DA lodgement

## Relevance scoring for content
When evaluating whether something is useful to Civly, score HIGH if it concerns:
- Tapir / Archicad API, IFC, IfcOpenShell
- NCC Volume 1 Parts B, D, E, F (compliance rates and rules)
- BIM automation, parametric modelling, AI in AEC
- PropTech accelerators, AEC-focused VCs, architect/developer contacts
- Feasibility analysis, development economics

Score MEDIUM for: general AI/LLM tooling, startup fundraising, construction tech.
Score LOW/SKIP for: unrelated tech, gaming, lifestyle, politics.

## CRM — who Civly wants to track
Priority contacts:
  - Architects and architectural practices (potential pilot users)
  - Property developers (clients who buy feasibility reports)
  - Engineers (structural, hydraulic, fire — potential integration partners)
  - Accelerator program managers and mentors
  - PropTech / ConTech VCs and angels

CRM entry schema (always output valid JSON):
{
  "full_name":     "First Last",
  "category":      "architect | developer | engineer | investor | accelerator | mentor | other",
  "organisation":  "company name or null",
  "relevance":     "HIGH | MEDIUM | LOW",
  "who":           "one line: their role and why they matter to Civly",
  "why":           "what Civly could do for them or get from them",
  "details":       "location, LinkedIn, any specifics from notes",
  "met":           "YYYY-MM-DD or null",
  "followup":      "specific next action or null"
}
""".strip()

# ── Ollama helper ─────────────────────────────────────────────────────────────

def ask(prompt: str, model: str = MODEL) -> str:
    payload = {
        "model":   model,
        "system":  CIVLY_SYSTEM_PROMPT,
        "prompt":  prompt,
        "stream":  False,
        "options": {"temperature": 0.2, "num_ctx": 8192},
    }
    try:
        r = requests.post(OLLAMA_URL, json=payload, timeout=600)
        if r.status_code == 500:
            body = r.text[:300]
            sys.exit(
                f"\nOllama returned 500 — likely out of memory loading {model}.\n"
                f"Fix: pull a smaller model and retry:\n"
                f"  ollama pull qwen3:8b\n"
                f"  python local_ingest.py --watch --model qwen3:8b\n"
                f"Details: {body}"
            )
        r.raise_for_status()
        return r.json()["response"].strip()
    except requests.exceptions.ConnectionError:
        sys.exit(
            "\nCannot reach Ollama. Open a terminal and run: ollama serve\n"
        )

# ── Detect file type ──────────────────────────────────────────────────────────

def detect_type(path: Path) -> str:
    """Return 'whatsapp', 'transcript', or 'crm'."""
    p = str(path).replace("\\", "/")

    if "raw/whatsapp" in p or path.name == "_chat.txt":
        return "whatsapp"
    if "raw/crm" in p:
        return "crm"

    # Transcript: .md file in raw/ with a YouTube URL or transcript-like content
    if path.suffix == ".md" and "raw" in p and "raw/whatsapp" not in p and "raw/crm" not in p:
        text = path.read_text(encoding="utf-8", errors="replace")[:2000]
        if "youtube.com" in text or "youtu.be" in text or "transcript" in text.lower():
            return "transcript"
        # Any other .md dropped in raw/ is treated as a transcript/article
        return "transcript"

    if path.suffix in (".txt", ".md") and "raw/crm" in p:
        return "crm"

    return "transcript"  # default fallback

# ══════════════════════════════════════════════════════════════════════════════
# HANDLER 1 — WhatsApp → To-Do
# ══════════════════════════════════════════════════════════════════════════════

DATE_RE = re.compile(r"^\[(\d{1,2}/\d{1,2}/\d{4}),")

def _parse_date(raw: str) -> datetime | None:
    for fmt in ("%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(raw, fmt)
        except ValueError:
            pass
    return None

def handle_whatsapp(path: Path, days: int = 14) -> Path:
    print(f"  Type: WHATSAPP  (last {days} days)")
    cutoff = datetime.now() - timedelta(days=days)
    lines  = path.read_text(encoding="utf-8", errors="replace").splitlines()

    kept, current_date = [], None
    for line in lines:
        m = DATE_RE.match(line)
        if m:
            current_date = _parse_date(m.group(1))
        if current_date and current_date >= cutoff:
            if "omitted" not in line and "was deleted" not in line:
                kept.append(line)

    chat_text = "\n".join(kept)
    if len(chat_text) > MAX_CHARS:
        chat_text = chat_text[-MAX_CHARS:]
        chat_text = chat_text[chat_text.find("\n") + 1:]
        print(f"  [trimmed to {MAX_CHARS:,} chars]")

    print(f"  Extracted {len(chat_text):,} chars from {len(kept)} lines")

    prompt = textwrap.dedent(f"""\
        You are reading a WhatsApp chat between two startup co-founders, Hassaan and Yash,
        building Civly — an AI BIM software for architects and engineers.

        Extract every action item, task, commitment, and thing that needs to be done.
        Also note what has already been completed.

        Group under these exact headings:
        ## Product
        ## Outreach / Sales
        ## Funding & Accelerators
        ## Meetings This Week
        ## Done (completed this period)

        Rules:
        - Use Obsidian checkboxes: `- [ ]` pending, `- [x]` done
        - Note who is responsible (Hassaan / Yash / Both) in brackets where clear
        - Include specific names, dates, and context
        - Be exhaustive — miss nothing actionable
        - Output ONLY the markdown, no intro sentence

        CHAT (last {days} days):
        {chat_text}
    """)

    result = ask(prompt)

    today    = datetime.now().strftime("%Y-%m-%d")
    out_path = VAULT / "strategy" / f"Civly To-Do — {today}.md"
    out_path.write_text(
        f"""---
title: "Civly To-Do — {today}"
type: analysis
tags: [todo, civly, action-items, auto-generated]
created: {today}
updated: {today}
sources: 0
---

*Auto-generated from WhatsApp chat — last {days} days. Local model: `{MODEL}`.*

---

{result}
""",
        encoding="utf-8",
    )
    print(f"  → {out_path}")
    return out_path


# ══════════════════════════════════════════════════════════════════════════════
# HANDLER 2 — YouTube / Article Transcript → Notes + Source Page
# ══════════════════════════════════════════════════════════════════════════════

def handle_transcript(path: Path) -> Path:
    print(f"  Type: TRANSCRIPT")
    raw = path.read_text(encoding="utf-8", errors="replace")

    # ── Step 1: extract metadata ─────────────────────────────────────────────
    meta_prompt = textwrap.dedent(f"""\
        Read this document and return a JSON object with these fields:
        {{
          "title": "video or article title",
          "channel": "channel or author name, or null",
          "url": "YouTube or source URL, or null",
          "published": "YYYY-MM-DD or null"
        }}
        Return ONLY the JSON, nothing else.

        DOCUMENT (first 3000 chars):
        {raw[:3000]}
    """)
    meta_raw = ask(meta_prompt)
    try:
        # Strip markdown code fences if model wrapped it
        meta_raw = re.sub(r"```json|```", "", meta_raw).strip()
        meta = json.loads(meta_raw)
    except Exception:
        meta = {"title": path.stem, "channel": None, "url": None, "published": None}

    title     = meta.get("title") or path.stem
    channel   = meta.get("channel") or "Unknown"
    url       = meta.get("url") or ""
    published = meta.get("published") or datetime.now().strftime("%Y-%m-%d")
    today     = datetime.now().strftime("%Y-%m-%d")

    print(f"  Title: {title}")

    # ── Step 2: relevance score + tip ────────────────────────────────────────
    relevance_prompt = textwrap.dedent(f"""\
        Civly is a startup building AI software for architects. Here is how it works:
        - Layer 1: Claude Code drives Archicad via Tapir MCP plugin to build BIM models
        - Layer 2: Python feasibility engine reads IFC files → deterministic calcs ← YAML rule packs → PDF report
        - Layer 3: React UI
        - Priority disciplines: MEP (critical, in dev), Compliance/NCC 2022 (high), Structural (high, partly shipped), IFC (high)
        - NOT doing: Revit plug-in, making design decisions, LLM for calcs, cloud SaaS

        Score this document's relevance to Civly as HIGH / MEDIUM / LOW / NONE.
        Then write 2-3 sentences explaining specifically why, referencing which part of Civly it helps
        (Tapir MCP calls, IFC writer, YAML rule packs, calc functions, or market context).

        Return ONLY:
        SCORE: <HIGH|MEDIUM|LOW|NONE>
        REASON: <2-3 sentences>

        DOCUMENT TITLE: {title}
        DOCUMENT (first 4000 chars):
        {raw[:4000]}
    """)
    rel_raw = ask(relevance_prompt)
    score_m  = re.search(r"SCORE:\s*(HIGH|MEDIUM|LOW|NONE)", rel_raw, re.I)
    reason_m = re.search(r"REASON:\s*(.+)", rel_raw, re.DOTALL)
    score    = score_m.group(1).upper() if score_m else "MEDIUM"
    reason   = reason_m.group(1).strip()[:400] if reason_m else rel_raw[:300]

    # ── Step 3: comprehensive notes ───────────────────────────────────────────
    content = raw if len(raw) <= MAX_CHARS else raw[:MAX_CHARS]
    notes_prompt = textwrap.dedent(f"""\
        You are creating comprehensive study notes from this document so someone can
        read the notes instead of watching/reading the original.

        Rules:
        - Cover EVERY meaningful point, technique, example, and insight
        - Organise by section with ## subheadings matching the video/article structure
        - Use bullet points, not prose paragraphs
        - Include timestamps if present in the transcript
        - Be thorough — the reader should learn everything from your notes alone
        - Do NOT write a brief summary — write detailed study notes
        - Output ONLY the notes (no intro, no "Here are the notes:")

        DOCUMENT:
        {content}
    """)
    notes = ask(notes_prompt)

    # ── Step 4: inject into raw file ─────────────────────────────────────────
    tip_block = textwrap.dedent(f"""\
        > [!tip] Civly Relevance — **{score}**
        > {reason.replace(chr(10), ' ')}

        ## Notes

        {notes}

    """)

    # Insert after the frontmatter closing --- (or at top if no frontmatter)
    if raw.startswith("---"):
        end_fm = raw.find("---", 3)
        if end_fm != -1:
            insert_at = end_fm + 3
            new_raw = raw[:insert_at] + "\n\n" + tip_block + raw[insert_at:]
        else:
            new_raw = tip_block + raw
    else:
        new_raw = tip_block + raw

    path.write_text(new_raw, encoding="utf-8")
    print(f"  Notes injected into {path.name}")

    # ── Step 5: move to processed ─────────────────────────────────────────────
    processed_dir = VAULT / "processed"
    processed_dir.mkdir(exist_ok=True)
    processed_path = processed_dir / path.name
    path.rename(processed_path)
    print(f"  Moved → processed/{path.name}")

    # ── Step 6: create source page ────────────────────────────────────────────
    slug      = re.sub(r"[^\w\s-]", "", title).strip().replace(" ", "-")[:60]
    src_path  = VAULT / "pages" / "sources" / f"{title[:80]}.md"

    summary_prompt = textwrap.dedent(f"""\
        Write a 3-sentence TL;DR summary of this document for a startup building AI BIM software.
        Be specific about what it teaches. Output ONLY the 3 sentences, no labels.

        DOCUMENT (first 5000 chars):
        {raw[:5000]}
    """)
    tldr = ask(summary_prompt)

    src_path.write_text(
        textwrap.dedent(f"""\
            ---
            title: "{title}"
            type: source
            tags: [source, auto-generated]
            source_url: "{url}"
            channel: "{channel}"
            published: {published}
            created: {today}
            updated: {today}
            sources: 1
            ---

            ## TL;DR
            {tldr}

            ## Civly Relevance
            **Score: {score}**

            {reason}

            ## Notes
            See [[processed/{path.name}]] for full notes.

            ## What Changed in the Wiki
            - Created this source page
            - Injected comprehensive notes into raw file
            - Moved source to `processed/`
        """),
        encoding="utf-8",
    )
    print(f"  Source page → pages/sources/{title[:80]}.md")
    return src_path


# ══════════════════════════════════════════════════════════════════════════════
# HANDLER 3 — Contact info → CRM page
# ══════════════════════════════════════════════════════════════════════════════

CATEGORIES = [
    "Customer", "Design Partner", "Investor", "Accelerator",
    "Industry Expert", "Integration Partner", "Channel Partner",
    "Connector", "Press / Analyst", "Other"
]

def handle_crm(path: Path) -> Path:
    print(f"  Type: CRM")
    raw  = path.read_text(encoding="utf-8", errors="replace")
    today = datetime.now().strftime("%Y-%m-%d")

    prompt = textwrap.dedent(f"""\
        You are building a CRM entry for a startup called Civly (AI BIM software for architects).

        Read these notes about a person and return a JSON object:
        {{
          "full_name": "First Last",
          "category": "one of: Customer | Design Partner | Investor | Accelerator | Industry Expert | Integration Partner | Channel Partner | Connector | Press / Analyst | Other",
          "organisation": "company or firm name",
          "location": "City, Country",
          "linkedin": "URL or null",
          "relevance": "HIGH | MEDIUM | LOW",
          "who_they_are": "2-3 sentence bio. Role, background.",
          "why_they_matter": "3-5 sentences on how this person helps Civly: as customer, investor, expert, or connector. Be specific.",
          "key_details": ["bullet 1", "bullet 2", "bullet 3"],
          "how_we_met": "event, context, who introduced",
          "follow_up": "specific next step"
        }}

        Civly context: We build AI software that generates BIM models (via Archicad + MCP) and checks building compliance (NCC 2022 AU, HK CoP). Target users: architects and AEC engineers. Currently: 2 LOIs, 1 design partner (Michael Westerlund), pilot in progress.

        Relevance scoring:
        HIGH = Direct ICP customer, active investor, or expert whose knowledge Civly urgently needs
        MEDIUM = Potential future customer, warm lead, useful validator
        LOW = Tangentially related

        Return ONLY the JSON, nothing else.

        NOTES:
        {raw}
    """)

    raw_json = ask(prompt)
    raw_json = re.sub(r"```json|```", "", raw_json).strip()

    try:
        p = json.loads(raw_json)
    except Exception:
        print(f"  Warning: could not parse JSON, writing raw output")
        out = VAULT / "CRM" / f"{path.stem}.md"
        out.write_text(raw_json, encoding="utf-8")
        return out

    name     = p.get("full_name", path.stem)
    category = p.get("category", "Other")
    org      = p.get("organisation", "")
    location = p.get("location", "")
    linkedin = p.get("linkedin") or ""
    relevance = p.get("relevance", "MEDIUM")
    who       = p.get("who_they_are", "")
    why       = p.get("why_they_matter", "")
    details   = p.get("key_details", [])
    met       = p.get("how_we_met", "")
    followup  = p.get("follow_up", "")

    slug     = re.sub(r"[^\w\s-]", "", name).strip().replace(" ", "-")
    crm_path = VAULT / "CRM" / f"{slug}.md"

    details_md = "\n".join(f"- {d}" for d in details)

    crm_path.write_text(
        textwrap.dedent(f"""\
            ---
            title: "{name}"
            type: crm
            category: {category}
            civly_relevance: {relevance}
            tags: [crm, auto-generated]
            linkedin: "{linkedin}"
            organisation: "{org}"
            location: "{location}"
            met: "{met}"
            met_date: {today}
            created: {today}
            updated: {today}
            follow_up: "{followup}"
            ---

            ## Who They Are
            {who}

            ## Why They Matter to Civly
            **Category:** {category}
            **Relevance: {relevance}**

            {why}

            ## Key Details
            {details_md}

            ## How We Met
            {met}

            ## Follow-up Actions
            - [ ] {followup}

            ## Related Pages
            [[Civly Architecture Reference]]
        """),
        encoding="utf-8",
    )

    # Archive the raw input
    archive = VAULT / "processed"
    archive.mkdir(exist_ok=True)
    path.rename(archive / path.name)

    print(f"  → CRM/{slug}.md  (relevance: {relevance})")
    return crm_path


# ══════════════════════════════════════════════════════════════════════════════
# Router
# ══════════════════════════════════════════════════════════════════════════════

def ingest(path: Path, days: int = 14) -> Path | None:
    path = Path(path)
    if not path.exists():
        print(f"  File not found: {path}")
        return None

    print(f"\n{'='*60}")
    print(f"  File: {path.name}")

    kind = detect_type(path)
    if kind == "whatsapp":
        return handle_whatsapp(path, days=days)
    elif kind == "transcript":
        return handle_transcript(path)
    elif kind == "crm":
        return handle_crm(path)
    else:
        print(f"  Unknown type — skipping")
        return None


# ══════════════════════════════════════════════════════════════════════════════
# Watcher mode
# ══════════════════════════════════════════════════════════════════════════════

def watch_mode(days: int = 14):
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
    except ImportError:
        sys.exit("Run: pip install watchdog")

    class Handler(FileSystemEventHandler):
        def on_created(self, event):
            if event.is_directory:
                return
            p = Path(event.src_path)
            # Ignore temp files and already-processed files
            if p.suffix in (".tmp", ".part") or "processed" in str(p):
                return
            if p.suffix in (".md", ".txt"):
                print(f"\n[watcher] New file detected: {p.name}")
                ingest(p, days=days)

    # Ensure watch dirs exist
    for d in WATCH_DIRS.values():
        d.mkdir(parents=True, exist_ok=True)

    observer = Observer()
    for name, d in WATCH_DIRS.items():
        observer.schedule(Handler(), str(d), recursive=False)
        print(f"  Watching {name}: {d}")

    print("\nWatcher running. Drop files into the watched folders to auto-ingest.")
    print("Press Ctrl+C to stop.\n")
    observer.start()
    try:
        import time
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Civly Brain local LLM ingest")
    parser.add_argument("file",    nargs="?",           help="File to ingest")
    parser.add_argument("--watch", action="store_true", help="Watch mode: auto-ingest on new files")
    parser.add_argument("--days",  type=int, default=14, help="Days back for WhatsApp (default 14)")
    parser.add_argument("--model", type=str, default=None, help="Ollama model name")
    args = parser.parse_args()

    global MODEL
    if args.model:
        MODEL = args.model

    print(f"\n=== Civly Brain Local Ingest ({MODEL}) ===")

    if args.watch:
        watch_mode(days=args.days)
    elif args.file:
        ingest(args.file, days=args.days)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
