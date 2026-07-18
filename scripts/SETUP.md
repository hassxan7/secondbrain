# Civly Brain — Local LLM Ingest Setup

Fully local. No Claude credits. Runs on your PC with Ollama + qwen2.5:14b.

---

## One-time setup (15 minutes)

### 1. Install Ollama
https://ollama.com/download → Windows installer → run it

### 2. Pull qwen2.5:14b (best for 16GB RAM)
```powershell
ollama pull qwen2.5:14b
```
Downloads ~9 GB once, cached forever.

### 3. Install Python dependencies
```powershell
pip install requests watchdog
```

### 4. Create the watched folders
These are auto-created when you first run watch mode, but you can make them now:
```
Civly Brain/
  raw/
    whatsapp/     ← drop WhatsApp _chat.txt exports here
    crm/          ← drop contact notes (.md or .txt) here
  raw/            ← drop YouTube transcript .md files here (existing behaviour)
```

---

## How to use

### Option A — Ingest a single file manually
```powershell
python "C:\Users\hassa\OneDrive\Documents\Civly Brain\scripts\local_ingest.py" "D:\path\to\file.md"
```

### Option B — Watch mode (recommended)
```powershell
python "C:\Users\hassa\OneDrive\Documents\Civly Brain\scripts\local_ingest.py" --watch
```
Leave this running in a terminal. Drop any file into a watched folder → auto-processes.

---

## What goes where

| Drop this... | Into this folder... | Gets processed as... |
|---|---|---|
| WhatsApp `_chat.txt` export | `raw/whatsapp/` | To-do list → `strategy/Civly To-Do — DATE.md` |
| YouTube transcript `.md` | `raw/` | Notes injected into file + source page in `pages/sources/` |
| Contact notes `.md` or `.txt` | `raw/crm/` | CRM page → `CRM/First-Last.md` |

---

## WhatsApp export (manual, 10 seconds on phone)

WhatsApp has no auto-export API — this step requires your phone:

1. Open chat with Yash
2. Tap ⋮ → More → **Export chat**
3. Choose **Without media**
4. Send to yourself (WhatsApp, email, OneDrive — anything)
5. Save the `_chat.txt` (or unzip the `.zip`) to `raw/whatsapp/`
6. If watch mode is running → auto-processes immediately

Do this weekly (Monday morning takes 30 seconds) and the to-do list is always fresh.

## CRM contact notes format

Just write anything natural — the model figures it out:
```
Name: Andrew Tang-Smith
Company: Studio Tangara
Role: Principal Architect
Location: Perth, WA
LinkedIn: linkedin.com/in/andrewtangsmith
How we met: Giants cohort, June 2026
Notes: 15+ years tier-1 experience. Mixed-use/residential focus. 
       Interested in trying Civly for a residential project.
       Follow up: send pilot onboarding guide.
```

Save as `raw/crm/andrew-tang-smith.md` → auto-generates the full CRM page.

---

## Run on startup (optional)

To have watch mode start automatically when you log into Windows:

1. Press `Win + R` → type `shell:startup` → Enter
2. Create a new file: `civly-watcher.bat`
3. Paste:
```batch
@echo off
cd /d "C:\Users\hassa\OneDrive\Documents\Civly Brain\scripts"
python local_ingest.py --watch
```
4. Save — it will run every time you log in.

---

## Troubleshooting

**"Cannot reach Ollama"** → Run `ollama serve` in a terminal first

**Output quality is low** → Already on 14b; try `--model qwen2.5:32b` if you upgrade RAM

**Transcript notes are thin** → The raw file might be too short; check the transcript has full content before dropping

**CRM JSON parse error** → Model returned malformed JSON; the raw output is saved anyway, manually clean it up
