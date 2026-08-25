-- Cloudflare D1 (SQLite) schema for the meeting-arbitrage service.
--
-- One deployment serves both products. `groups.kind` selects which routes and
-- which UI a group gets; everything above the `-- Banksia` divider is shared.
--
-- Apply with:  npm run db:local   (or db:remote)

PRAGMA foreign_keys = ON;

-- ── Shared ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS groups (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (kind IN ('banksia', 'ripple')),
  name          TEXT NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'Australia/Sydney',
  -- Engine config overrides (quorum, switchMargin, ...) as JSON.
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS members (
  id              TEXT PRIMARY KEY,
  group_id        TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  suburb          TEXT,
  -- Rolling share of recent meetings attended. Feeds scheduling weight.
  attendance_rate REAL NOT NULL DEFAULT 1.0,
  is_required     INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_members_group ON members(group_id);

-- Recurring commitments. Free to declare, permanent, never held against anyone.
CREATE TABLE IF NOT EXISTS standing_conflicts (
  id        TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  weekday   INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_min INTEGER NOT NULL,
  end_min   INTEGER NOT NULL,
  label     TEXT NOT NULL,
  CHECK (end_min > start_min)
);
CREATE INDEX IF NOT EXISTS idx_conflicts_member ON standing_conflicts(member_id);

CREATE TABLE IF NOT EXISTS polls (
  id             TEXT PRIMARY KEY,
  group_id       TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  kind           TEXT NOT NULL CHECK (kind IN ('anchor', 'refix', 'hangout')),
  title          TEXT NOT NULL,
  slots_json     TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  anchor_slot_id TEXT,
  closes_at      TEXT,
  created_by     TEXT REFERENCES members(id) ON DELETE SET NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_polls_group_status ON polls(group_id, status);

CREATE TABLE IF NOT EXISTS responses (
  poll_id    TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  member_id  TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  slot_id    TEXT NOT NULL,
  value      TEXT NOT NULL CHECK (value IN ('yes', 'ifneed', 'no')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (poll_id, member_id, slot_id)
);

-- Per-poll extras used only by Ripple hangouts.
CREATE TABLE IF NOT EXISTS poll_preferences (
  poll_id        TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  member_id      TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  budget_aud     INTEGER,
  suburb         TEXT,
  approvals_json TEXT NOT NULL DEFAULT '[]',
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (poll_id, member_id)
);

CREATE TABLE IF NOT EXISTS decisions (
  id          TEXT PRIMARY KEY,
  poll_id     TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  slot_id     TEXT,
  action      TEXT NOT NULL,
  rationale   TEXT NOT NULL,
  brief_json  TEXT,
  decided_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Link-based auth. No passwords: the link in the group chat is the credential.
CREATE TABLE IF NOT EXISTS member_tokens (
  token      TEXT PRIMARY KEY,
  member_id  TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  group_id   TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tokens_member ON member_tokens(member_id);

-- ── Banksia: chores, fines, accountability ───────────────────────────────────

CREATE TABLE IF NOT EXISTS veto_state (
  member_id    TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  period_start TEXT NOT NULL,
  used         INTEGER NOT NULL DEFAULT 0,
  budget       INTEGER NOT NULL DEFAULT 2,
  PRIMARY KEY (member_id, period_start)
);

CREATE TABLE IF NOT EXISTS chore_tasks (
  id        TEXT PRIMARY KEY,
  group_id  TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS chore_claims (
  id                 TEXT PRIMARY KEY,
  group_id           TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id          TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  task_id            TEXT NOT NULL REFERENCES chore_tasks(id) ON DELETE CASCADE,
  week_of            TEXT NOT NULL,
  claimed_at         TEXT NOT NULL DEFAULT (datetime('now')),
  challenged_by_json TEXT NOT NULL DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_claims_week ON chore_claims(group_id, week_of);

CREATE TABLE IF NOT EXISTS settlements (
  id          TEXT PRIMARY KEY,
  group_id    TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id   TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  week_of     TEXT NOT NULL,
  completed   INTEGER NOT NULL,
  challenged  INTEGER NOT NULL DEFAULT 0,
  shortfall   INTEGER NOT NULL,
  fine_cents  INTEGER NOT NULL,
  state       TEXT NOT NULL CHECK (state IN ('pending','disputed','upheld','waived','paid')),
  note        TEXT NOT NULL DEFAULT '',
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (group_id, member_id, week_of)
);

CREATE TABLE IF NOT EXISTS disputes (
  id        TEXT PRIMARY KEY,
  group_id  TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  week_of   TEXT NOT NULL,
  argument  TEXT NOT NULL,
  raised_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (group_id, member_id, week_of)
);

CREATE TABLE IF NOT EXISTS issues (
  id          TEXT PRIMARY KEY,
  group_id    TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  raised_by   TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  photo_url   TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  closes_at   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open',
  outcome_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_issues_group_status ON issues(group_id, status);

CREATE TABLE IF NOT EXISTS issue_responses (
  issue_id  TEXT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  answer    TEXT NOT NULL CHECK (answer IN ('was-me', 'not-me')),
  answered_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (issue_id, member_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id           TEXT PRIMARY KEY,
  group_id     TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id    TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  meeting_date TEXT NOT NULL,
  present      INTEGER NOT NULL,
  UNIQUE (group_id, member_id, meeting_date)
);

-- ── Ripple: curated events ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ripple_events (
  id            TEXT PRIMARY KEY,
  group_id      TEXT REFERENCES groups(id) ON DELETE CASCADE,
  label         TEXT NOT NULL,
  emoji         TEXT NOT NULL DEFAULT '🎟️',
  est_cost_aud  INTEGER NOT NULL,
  duration_mins INTEGER NOT NULL DEFAULT 120,
  category      TEXT NOT NULL,
  time_of_day   TEXT NOT NULL DEFAULT 'night',
  sequence_rank INTEGER NOT NULL DEFAULT 2,
  starts_at     TEXT,
  venue_name    TEXT,
  suburb        TEXT,
  url           TEXT,
  is_active     INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_events_active ON ripple_events(is_active, starts_at);

-- ── Messaging ────────────────────────────────────────────────────────────────

-- The WhatsApp bot polls this table, sends what is queued, and marks it sent.
-- A queue rather than a webhook because whatsapp-web.js runs on a machine in
-- the house with no stable inbound address.
CREATE TABLE IF NOT EXISTS outbox (
  id         TEXT PRIMARY KEY,
  group_id   TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  channel    TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email')),
  target     TEXT NOT NULL,
  body       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed')),
  attempts   INTEGER NOT NULL DEFAULT 0,
  error      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  sent_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox(status, created_at);

-- Inbound chat messages the bot recognised as commands or poll answers.
CREATE TABLE IF NOT EXISTS inbox (
  id          TEXT PRIMARY KEY,
  group_id    TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id   TEXT REFERENCES members(id) ON DELETE SET NULL,
  raw_from    TEXT NOT NULL,
  body        TEXT NOT NULL,
  handled_as  TEXT,
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Optional Google Calendar connection ──────────────────────────────────────
-- Free/busy scope only. Tokens are stored as issued; if you run this for a
-- group beyond a share house, encrypt them at rest or move them to a KV
-- namespace with restricted bindings.
CREATE TABLE IF NOT EXISTS calendar_tokens (
  member_id     TEXT PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
  access_token  TEXT NOT NULL,
  refresh_token TEXT,
  expires_at    TEXT NOT NULL,
  connected_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
