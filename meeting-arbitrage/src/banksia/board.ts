/**
 * The chore board — the whiteboard in the kitchen, as data.
 *
 * The house already has a working artefact: a grid with jobs down the left and
 * names across the top, and a tick where the two meet. It works because it is
 * legible in one glance from the doorway. The failure is not the board, it is
 * that nothing happens at the end of the week.
 *
 * So this models the board exactly as drawn — rows are tasks, columns are
 * people, a cell is a tick — and adds only the ending. Anything that would
 * make the digital board diverge from the physical one is left out.
 *
 * Photo import is the other half. A house that already has a whiteboard will
 * not retype it, so a photo of the board is a first-class input. The model
 * reads the picture; everything downstream of that is deterministic, and the
 * two rules that make it safe are:
 *
 *   - **A photo can add ticks and never remove them.** A board gets wiped, a
 *     marker smudges, a hand covers a column. Deleting someone's completed
 *     chore because the camera missed it is precisely the failure that makes a
 *     house abandon the tool, and it is unrecoverable — the evidence was on the
 *     whiteboard that has since been wiped.
 *   - **An unrecognised name is surfaced, never guessed.** Assigning a chore to
 *     the wrong housemate is worse than asking which one it was.
 */

export interface BoardTask {
  id: string;
  label: string;
  /** e.g. "water the plants — max 2x". Ticks past the cap don't count twice. */
  cap?: number;
}

export interface BoardTick {
  taskId: string;
  memberId: string;
}

export interface Board {
  /** Monday of the week this board covers, `YYYY-MM-DD`. */
  weekOf: string;
  tasks: BoardTask[];
  ticks: BoardTick[];
}

export interface BoardMember {
  id: string;
  name: string;
}

/** The eight jobs the house already runs, as they read on the whiteboard. */
export const DEFAULT_TASKS: BoardTask[] = [
  { id: 'plants', label: 'Water the plants', cap: 2 },
  { id: 'dishes', label: 'Unstack the dishes' },
  { id: 'bins', label: 'Take the bins out' },
  { id: 'kitchen', label: 'Clean the kitchen' },
  { id: 'vacuum', label: 'Vacuum everything' },
  { id: 'sunday-bins', label: 'Sunday bins out' },
  { id: 'bathrooms', label: 'Bathrooms' },
  { id: 'bin-bags', label: 'Large bin bags' },
];

/** Stable id for a chore row that the house has never had before. */
export function slugTask(label: string): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'task';
}

/**
 * Find the existing row a photographed label refers to.
 *
 * Slugging the label is not enough: the house's rows carry short handles
 * (`bins`, `dishes`) while the whiteboard says "Take the bins out". Matching on
 * the slug alone forks a second row for a chore that already exists, and the
 * board silently doubles.
 *
 * Containment is allowed in the last tier — "bins out" finds "Take the bins
 * out" — but only when exactly one row contains it. "Bins" alone matches both
 * "Take the bins out" and "Sunday bins out", and a duplicated row someone can
 * see and merge beats a tick filed under the wrong job.
 */
export function matchTask(label: string, known: BoardTask[]): BoardTask | null {
  const needle = fold(label);
  if (!needle) return null;

  const tiers: ((t: BoardTask) => boolean)[] = [
    (t) => fold(t.label) === needle,
    (t) => t.id === slugTask(label),
    (t) => needle.length >= 4 && (fold(t.label).includes(needle) || needle.includes(fold(t.label))),
  ];

  for (const test of tiers) {
    const hits = known.filter(test);
    if (hits.length === 1) return hits[0];
    if (hits.length > 1) return null;
  }
  return null;
}

/* ── Matching handwriting to housemates ───────────────────────────────────── */

function fold(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

/** Edit distance, capped: we only care whether it is 0, 1, or more than 1. */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  let i = 0; let j = 0; let edits = 0;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (short.length === long.length) { i++; j++; } else { j++; }
  }
  return edits + (long.length - j) + (short.length - i) <= 1;
}

/**
 * Resolve a name read off a whiteboard to a housemate.
 *
 * Exact fold first, then first-name, then one typo. An ambiguous match returns
 * null: two housemates whose names are one edit apart (Pete and Peta) must not
 * be told apart by a coin flip, and the caller has a perfectly good fallback,
 * which is to ask.
 */
export function matchName(raw: string, members: BoardMember[]): string | null {
  const needle = fold(raw);
  if (!needle) return null;

  const tiers: ((m: BoardMember) => boolean)[] = [
    (m) => fold(m.name) === needle,
    (m) => fold(m.name.split(/\s+/)[0]) === needle,
    (m) => fold(m.name).startsWith(needle) && needle.length >= 3,
    (m) => withinOneEdit(fold(m.name.split(/\s+/)[0]), needle) && needle.length >= 3,
  ];

  for (const test of tiers) {
    const hits = members.filter(test);
    if (hits.length === 1) return hits[0].id;
    if (hits.length > 1) return null; // ambiguous at this tier — do not fall through
  }
  return null;
}

/* ── Importing a photographed board ───────────────────────────────────────── */

/** One row as the vision model reports it: a job, and the names ticked against it. */
export interface RawBoardRow {
  task: string;
  cap?: number;
  names: string[];
}

export interface BoardImport {
  board: Board;
  /** Names on the board that matched nobody. Asked about, never guessed. */
  unmatched: { name: string; task: string }[];
  /** Rows that were not on the board before this photo. */
  newTasks: BoardTask[];
  ticksFound: number;
}

/**
 * Turn whatever the model returned into a board, or throw.
 *
 * Validation lives here rather than in the model call so the parse can be
 * tested against hostile input without an API key, and so a model that starts
 * returning a different shape fails loudly at one place.
 */
export function parseBoardPayload(
  payload: unknown,
  members: BoardMember[],
  weekOf: string,
  knownTasks: BoardTask[] = DEFAULT_TASKS,
): BoardImport {
  const rows = extractRows(payload);
  if (rows.length === 0) throw new Error('no rows found on that board');

  const tasks: BoardTask[] = [];
  const newTasks: BoardTask[] = [];
  const ticks: BoardTick[] = [];
  const unmatched: { name: string; task: string }[] = [];
  const seenTick = new Set<string>();

  for (const row of rows) {
    const label = row.task.replace(/\s+/g, ' ').trim();
    if (!label) continue;
    const known = matchTask(label, knownTasks);
    const task: BoardTask = known
      ?? { id: slugTask(label), label, ...(row.cap ? { cap: row.cap } : {}) };
    if (!known) newTasks.push(task);
    if (!tasks.some((t) => t.id === task.id)) tasks.push(task);

    for (const rawName of row.names) {
      const name = rawName.replace(/\s+/g, ' ').trim();
      if (!name) continue;
      const memberId = matchName(name, members);
      if (!memberId) { unmatched.push({ name, task: label }); continue; }
      const key = `${task.id}:${memberId}`;
      if (seenTick.has(key)) continue;
      seenTick.add(key);
      ticks.push({ taskId: task.id, memberId });
    }
  }

  return { board: { weekOf, tasks, ticks }, unmatched, newTasks, ticksFound: ticks.length };
}

function extractRows(payload: unknown): RawBoardRow[] {
  const source = Array.isArray(payload)
    ? payload
    : (payload && typeof payload === 'object' && Array.isArray((payload as { rows?: unknown }).rows))
      ? (payload as { rows: unknown[] }).rows
      : null;
  if (!source) throw new Error('expected an array of rows');

  const rows: RawBoardRow[] = [];
  for (const entry of source) {
    if (!entry || typeof entry !== 'object') continue;
    const { task, names, cap } = entry as Partial<RawBoardRow>;
    if (typeof task !== 'string') continue;
    const list = Array.isArray(names) ? names.filter((n): n is string => typeof n === 'string') : [];
    rows.push({
      task,
      names: list,
      ...(typeof cap === 'number' && cap > 0 ? { cap: Math.floor(cap) } : {}),
    });
  }
  return rows;
}

export interface BoardMerge {
  board: Board;
  added: BoardTick[];
  /** Ticks already recorded digitally that the photo did not show. Kept. */
  keptDespiteAbsence: BoardTick[];
}

/**
 * Fold an imported board into the one on record. Additive only.
 *
 * See the header: a photo is evidence that something happened, never evidence
 * that something did not.
 */
export function mergeBoard(existing: Board, imported: Board): BoardMerge {
  if (existing.weekOf !== imported.weekOf) {
    throw new Error('refusing to merge boards from different weeks');
  }
  const has = (list: BoardTick[], t: BoardTick) =>
    list.some((x) => x.taskId === t.taskId && x.memberId === t.memberId);

  const added = imported.ticks.filter((t) => !has(existing.ticks, t));
  const keptDespiteAbsence = existing.ticks.filter((t) => !has(imported.ticks, t));

  const tasks = [...existing.tasks];
  for (const t of imported.tasks) if (!tasks.some((x) => x.id === t.id)) tasks.push(t);

  return {
    board: { weekOf: existing.weekOf, tasks, ticks: [...existing.ticks, ...added] },
    added,
    keptDespiteAbsence,
  };
}

/* ── Where everyone stands ────────────────────────────────────────────────── */

export interface Standing {
  memberId: string;
  name: string;
  done: number;
  required: number;
  short: number;
  /** Task ids this person has not ticked — what a nudge should offer them. */
  remaining: string[];
}

/**
 * Count each person's week.
 *
 * One tick per task per person: doing the bins on Tuesday and again on Friday
 * is one job done twice, not two jobs. A capped task counts once regardless —
 * the cap is a ceiling on how often it is *worth* doing, not a way to hit four
 * by watering the plants four times.
 */
export function boardStanding(
  board: Board,
  members: BoardMember[],
  tasksRequired = 4,
): Standing[] {
  const validTasks = new Set(board.tasks.map((t) => t.id));

  return members.map((m) => {
    const mine = new Set(
      board.ticks
        .filter((t) => t.memberId === m.id && validTasks.has(t.taskId))
        .map((t) => t.taskId),
    );
    const done = mine.size;
    return {
      memberId: m.id,
      name: m.name,
      done,
      required: tasksRequired,
      short: Math.max(0, tasksRequired - done),
      remaining: board.tasks.filter((t) => !mine.has(t.id)).map((t) => t.id),
    };
  });
}

/** Who is short, worst first — the list the bot works through. */
export function behind(standings: Standing[]): Standing[] {
  return standings
    .filter((s) => s.short > 0)
    .sort((a, b) => (b.short - a.short) || a.name.localeCompare(b.name));
}
