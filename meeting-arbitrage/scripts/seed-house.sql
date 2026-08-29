-- Seed one house. Edit the names and contact details, then run:
--   npx wrangler d1 execute arbitrage --remote --file=./scripts/seed-house.sql
--
-- Contact details are left NULL on purpose. Housemates fill them in themselves
-- through the join link, which is also where they see and accept what the
-- messages are used for — typing someone's number in on their behalf skips the
-- one screen that makes the reminders acceptable.

INSERT OR IGNORE INTO groups (id, kind, name, timezone, settings_json)
VALUES ('banksia', 'banksia', 'Banksia', 'Australia/Sydney', '{"quorum":4,"anchorBonus":1.5}');

INSERT OR IGNORE INTO members (id, group_id, name) VALUES
  ('mem_hassaan', 'banksia', 'Hassaan'),
  ('mem_isaac',   'banksia', 'Isaac'),
  ('mem_kez',     'banksia', 'Kez'),
  ('mem_ross',    'banksia', 'Ross'),
  ('mem_eyong',   'banksia', 'Eyong'),
  ('mem_pete',    'banksia', 'Pete'),
  ('mem_manan',   'banksia', 'Manan');

-- Isaac's football. Declared once, free, permanent: it is a real recurring
-- commitment, not a dodge, so it never costs him anything — it just fails every
-- Monday-evening slot forever.
INSERT OR IGNORE INTO standing_conflicts (id, member_id, weekday, start_min, end_min, label)
VALUES ('sc_isaac_football', 'mem_isaac', 1, 1140, 1260, 'football practice');

-- The eight jobs, as they read on the whiteboard.
INSERT OR IGNORE INTO chore_tasks (id, group_id, label) VALUES
  ('plants',      'banksia', 'Water the plants'),
  ('dishes',      'banksia', 'Unstack the dishes'),
  ('bins',        'banksia', 'Take the bins out'),
  ('kitchen',     'banksia', 'Clean the kitchen'),
  ('vacuum',      'banksia', 'Vacuum everything'),
  ('sunday-bins', 'banksia', 'Sunday bins out'),
  ('bathrooms',   'banksia', 'Bathrooms'),
  ('bin-bags',    'banksia', 'Large bin bags');
