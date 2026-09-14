---
title: "Apps Registry"
aliases: ["Apps Registry"]
type: analysis
tags: [apps, infrastructure]
created: 2026-09-07
updated: 2026-09-07
sources: 0
---

# Apps

Buildable tools that live inside the vault. They read the knowledge in
`pages/`, `strategy/`, `CRM/`, and `civly context/` — that adjacency is the
point. One folder open, one session, knowledge and code together.

| App | What it does | Status | Own repo? |
|---|---|---|---|
| [outreach-engine](outreach-engine/) | LinkedIn/CRM outreach: playbooks, drafts, lead DB, send + verify | **Live** | Yes — `RatherN-t/Civly-outreach-engine` |
| [form-filler](form-filler/) | Given a URL, draft and fill an application form in Hassaan's voice | **Live** | No — vault repo |
| [tapreview-site](tapreview-site/) | NFC review-card landing page (Surry Hills targets) | Deployed (Vercel) | No — vault repo |
| [ingest](ingest/) | Local Ollama pipeline: transcripts / WhatsApp / CRM notes → wiki pages | Live | No — vault repo |

---

## Rules for apps in this vault

1. **One folder per app**, directly under `apps/`. No app code anywhere else.
2. **Knowledge stays out of `apps/`.** If an app produces something worth
   keeping — an analysis, a contact, a decision — it writes to `strategy/`,
   `CRM/`, or `pages/`, not into its own folder.
3. **Nothing heavy gets committed or synced.** `node_modules/`, `.venv/`,
   `dist/`, `.vercel/`, `__pycache__` are gitignored vault-wide. Rebuild them,
   don't store them.
4. **Secrets never land in the vault repo.** `.env` is ignored; commit
   `.env.example` instead. Same for `*.sqlite` and `apps/**/data/`.
5. **Obsidian ignores app internals** via `userIgnoreFilters` in
   `.obsidian/app.json` — app code stays out of search and the graph. Add a
   line there when you add an app.

## Adding a new app

```bash
mkdir -p apps/<name>
# write apps/<name>/README.md — what it does, how to run it, what vault
# folders it reads and writes
```

Then add a row to the table above, and a `userIgnoreFilters` entry in
`.obsidian/app.json` if the app has code Obsidian shouldn't index.

## Apps with their own git repo

`outreach-engine` has its own GitHub remote, so the vault's `.gitignore`
excludes `/apps/outreach-engine/` — the vault repo must not swallow a nested
repo. Commit and push it from inside its own folder:

```bash
git -C apps/outreach-engine status
```

Its `data/leads.sqlite` is gitignored by *both* repos. It survives on OneDrive
sync alone — see the warning in [outreach-engine/README.md](outreach-engine/README.md).

## Related

[[Civly Architecture Reference]] · [[Data Partnership Outreach Strategy]] ·
[[NFC Review Cards — Surry Hills Target List]]
