"""
whatsapp_ingest.py
------------------
Reads a WhatsApp chat export, extracts the last N days of messages,
sends them to a local Ollama model, and writes a to-do list into the
Civly Brain Obsidian vault. No cloud API credits used.

Usage:
    python whatsapp_ingest.py                    # last 14 days
    python whatsapp_ingest.py --days 7           # last 7 days
    python whatsapp_ingest.py --chat "D:/path/to/_chat.txt"

Setup (one-time):
    1. Install Ollama: https://ollama.com/download
    2. Pull a model: ollama pull qwen2.5:7b
    3. pip install requests
    4. Run: python whatsapp_ingest.py
"""

import re
import json
import argparse
import sys
from datetime import datetime, timedelta
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("Missing dependency. Run: pip install requests")

# ── Config ────────────────────────────────────────────────────────────────────

CHAT_FILE   = r"D:\startup files\WhatsApp Chat - Yash\_chat.txt"
VAULT_DIR   = r"C:\Users\hassa\OneDrive\Documents\Civly Brain\strategy"
MODEL       = "qwen2.5:7b"          # change to qwen2.5:14b if you have more VRAM
OLLAMA_URL  = "http://localhost:11434/api/generate"
MAX_CHARS   = 60_000                # safe limit for 7B model (~20k tokens)

# ── Chat parsing ──────────────────────────────────────────────────────────────

DATE_RE = re.compile(r"^\[(\d{1,2}/\d{1,2}/\d{4}),")

def parse_date(raw: str) -> datetime | None:
    for fmt in ("%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(raw, fmt)
        except ValueError:
            pass
    return None

def extract_recent(path: str, days: int) -> str:
    cutoff = datetime.now() - timedelta(days=days)
    lines  = Path(path).read_text(encoding="utf-8", errors="replace").splitlines()

    chunks, current_date = [], None
    for line in lines:
        m = DATE_RE.match(line)
        if m:
            current_date = parse_date(m.group(1))
        if current_date and current_date >= cutoff:
            # Strip image/video/audio omitted lines — not useful for LLM
            if "omitted" not in line and "This message was deleted" not in line:
                chunks.append(line)

    text = "\n".join(chunks)

    # If over token budget, keep the most recent portion
    if len(text) > MAX_CHARS:
        text = text[-MAX_CHARS:]
        # Don't start mid-line
        newline_pos = text.find("\n")
        if newline_pos > 0:
            text = text[newline_pos + 1:]
        print(f"  [trimmed to last {MAX_CHARS:,} chars to fit model context]")

    return text

# ── LLM call ─────────────────────────────────────────────────────────────────

PROMPT_TEMPLATE = """\
You are reading a WhatsApp chat between two startup co-founders, Hassaan and Yash, \
who are building Civly — an AI software for architects and engineers that generates \
BIM models and checks building compliance.

Your job: extract every action item, task, decision, and commitment from this chat. \
Group them under these headings:

## Product
## Outreach / Sales
## Funding & Accelerators
## Meetings This Week
## Done (completed this period)

Rules:
- Use Obsidian checkbox format: `- [ ]` for pending, `- [x]` for done
- For each item note who is responsible (Hassaan / Yash / Both) if clear
- Include specific names, dates, and links when mentioned
- Be exhaustive — miss nothing
- Output ONLY the markdown, no intro or explanation

CHAT (last {days} days):
{chat}
"""

def call_ollama(chat_text: str, days: int, model: str) -> str:
    prompt = PROMPT_TEMPLATE.format(days=days, chat=chat_text)
    payload = {
        "model":  model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,   # low temp for factual extraction
            "num_ctx":     32768,  # use full context window
        }
    }

    print(f"  Sending {len(chat_text):,} chars to {model} via Ollama...")
    try:
        r = requests.post(OLLAMA_URL, json=payload, timeout=300)
        r.raise_for_status()
        return r.json()["response"]
    except requests.exceptions.ConnectionError:
        sys.exit(
            "\nCould not connect to Ollama.\n"
            "Make sure Ollama is running: open a terminal and type `ollama serve`\n"
            "If Ollama is not installed: https://ollama.com/download\n"
            "Then pull the model: ollama pull qwen2.5:7b"
        )

# ── Write to Obsidian ─────────────────────────────────────────────────────────

def write_vault(result: str, vault_dir: str, days: int, model: str) -> Path:
    today    = datetime.now().strftime("%Y-%m-%d")
    out_path = Path(vault_dir) / f"Civly To-Do — {today}.md"

    content = f"""---
title: "Civly To-Do — {today}"
type: analysis
tags: [todo, civly, action-items, auto-generated]
created: {today}
updated: {today}
sources: 0
---

*Auto-generated from WhatsApp chat — last {days} days. Local model: `{model}`. No cloud credits used.*

---

{result.strip()}
"""
    out_path.write_text(content, encoding="utf-8")
    return out_path

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Extract Civly to-dos from WhatsApp chat using a local LLM.")
    parser.add_argument("--days",  type=int, default=14,        help="How many days back to look (default: 14)")
    parser.add_argument("--chat",  type=str, default=CHAT_FILE, help="Path to WhatsApp _chat.txt export")
    parser.add_argument("--model", type=str, default=MODEL,     help="Ollama model name (default: qwen2.5:7b)")
    parser.add_argument("--vault", type=str, default=VAULT_DIR, help="Obsidian vault output directory")
    args = parser.parse_args()

    print(f"\n=== WhatsApp → Obsidian To-Do (local, {args.model}) ===\n")

    print(f"[1/3] Reading last {args.days} days from chat...")
    chat_text = extract_recent(args.chat, args.days)
    if not chat_text.strip():
        sys.exit("No messages found in the requested date range.")
    print(f"      Found {len(chat_text):,} chars across {chat_text.count(chr(10))} lines")

    print(f"\n[2/3] Running local LLM extraction...")
    result = call_ollama(chat_text, args.days, args.model)

    print(f"\n[3/3] Writing to Obsidian vault...")
    out = write_vault(result, args.vault, args.days, args.model)
    print(f"      Done → {out}")
    print("\nOpen Obsidian and the file will appear automatically.\n")

if __name__ == "__main__":
    main()
