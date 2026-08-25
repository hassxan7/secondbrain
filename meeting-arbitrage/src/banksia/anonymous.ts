/**
 * Anonymous issues — and the design work that keeps them from poisoning a house.
 *
 * A plain anonymous complaint box is a bad idea in a seven-person share house,
 * and it's worth being precise about why: it invites the two failure modes that
 * do the most damage to people living together. It lets one person snipe at
 * another with no accountability ("someone thinks you're disgusting"), and it
 * makes everyone wonder who wrote what, which is corrosive even when nothing
 * was written. The request to "be people-smart" is exactly right, and the
 * answer is not a warning label — it's building the thing so those two failure
 * modes are structurally hard to reach.
 *
 * Four design moves do that:
 *
 *   1. It's about a *thing*, not a person. Submissions are keyed to a shared
 *      area — the kitchen, noise, guests, bills — never to a housemate. There
 *      is no "who is this about" field, on purpose. You can raise "the kitchen's
 *      been rough", you cannot raise "Pete is gross".
 *
 *   2. It aggregates into consensus, not gripes. Everyone who raises the same
 *      area joins one thread. So the house sees "three people quietly flagged
 *      the kitchen", which is a shared problem worth a calm conversation — not
 *      "someone is annoyed", which reads as a snipe. Anonymity is pointed at
 *      building agreement, not at hiding an attacker.
 *
 *   3. A lone voice waits. A single raise doesn't hit the agenda instantly; it
 *      sits for a cooling window first. That removes the weapon — you can't fire
 *      off an anonymous jab in the heat of an argument and have it land that
 *      night. If it's real, it still surfaces; it just isn't a same-day strike.
 *      If others quietly agree, the weight carries it to the agenda immediately,
 *      because then it's consensus, not an ambush.
 *
 *   4. It's anonymous to the house, not to the system. The author is kept
 *      server-side so the same person can't inflate the weight and so genuine
 *      abuse could be traced if it ever came to that — the house just never sees
 *      it. Anonymity is a social affordance, not a place to hide from everyone.
 *
 * Everything here is pure and deterministic. The author id is opaque; the route
 * keeps the real member id server-side and passes something the house can't
 * reverse.
 */

export interface AnonymousConfig {
  /** Distinct raisers before it goes to the agenda immediately (as consensus). */
  minWeightForAgenda: number;
  /** How long a lone raise waits before surfacing, so it can't be a same-day jab. */
  coolingHours: number;
  /** Cap on a note, so it stays a flag rather than a rant. */
  maxNoteLength: number;
}

export const DEFAULT_ANON_CONFIG: AnonymousConfig = {
  minWeightForAgenda: 2,
  coolingHours: 24,
  maxNoteLength: 240,
};

/** The shared areas an issue can be about. Deliberately not people. */
export const ISSUE_AREAS = [
  { id: 'kitchen', label: 'Kitchen & dishes' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'common', label: 'Common areas' },
  { id: 'bins', label: 'Bins & recycling' },
  { id: 'noise', label: 'Noise & sleep' },
  { id: 'guests', label: 'Guests & overnight' },
  { id: 'bills', label: 'Bills & shared costs' },
  { id: 'other', label: 'Something else' },
] as const;

export type IssueArea = typeof ISSUE_AREAS[number]['id'];

const AREA_LABEL = new Map<string, string>(ISSUE_AREAS.map((a) => [a.id, a.label]));

export interface Contribution {
  /** Opaque, stable per person. Never shown to the house. */
  author: string;
  note?: string;
  at: string;
}

export interface AnonymousIssue {
  id: string;
  area: IssueArea;
  contributions: Contribution[];
  createdAt: string;
}

/**
 * Soften a note before the house ever sees it.
 *
 * Structural de-escalation, not censorship: strip any housemate's name so the
 * issue stays about the area and can't become a callout, flatten ALL-CAPS
 * shouting to normal case, and cap the length so it's a flag not a rant. Facts
 * are left intact — the point is to lower the temperature, not to rewrite what
 * was said.
 */
export function softenNote(
  note: string, houseNames: string[], config: AnonymousConfig = DEFAULT_ANON_CONFIG,
): string {
  let out = note.trim();

  // Drop direct address of a housemate by name. Word-boundary, case-insensitive.
  for (const name of houseNames) {
    if (!name) continue;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), 'someone');
  }

  // Flatten a shouted note (mostly caps) to a calm one.
  const letters = out.replace(/[^a-z]/gi, '');
  if (letters.length > 6 && letters === letters.toUpperCase()) {
    out = out.toLowerCase();
    out = out.charAt(0).toUpperCase() + out.slice(1);
  }

  // Collapse repeated punctuation ("!!!", "???") that only carries heat.
  out = out.replace(/([!?.])\1{1,}/g, '$1');

  if (out.length > config.maxNoteLength) {
    out = `${out.slice(0, config.maxNoteLength - 1).trimEnd()}…`;
  }
  return out;
}

/**
 * Add a raise to the set, joining the existing thread for that area.
 *
 * One open issue per area, so raising the kitchen a third time builds weight on
 * the one kitchen thread instead of spawning a third near-duplicate. A person
 * raising the same area again updates their own contribution (so weight counts
 * distinct people, never the same person twice) but can add a fresh note.
 */
export function raiseAnonymous(
  issues: AnonymousIssue[],
  input: { area: IssueArea; author: string; note?: string; now: string },
): AnonymousIssue[] {
  const trimmedNote = input.note?.trim() || undefined;
  const existing = issues.find((i) => i.area === input.area);

  const contribution: Contribution = {
    author: input.author, note: trimmedNote, at: input.now,
  };

  if (!existing) {
    return [...issues, {
      id: `anon-${input.area}-${input.now.slice(0, 10)}`,
      area: input.area,
      contributions: [contribution],
      createdAt: input.now,
    }];
  }

  return issues.map((issue) => {
    if (issue !== existing) return issue;
    const others = issue.contributions.filter((c) => c.author !== input.author);
    return { ...issue, contributions: [...others, contribution] };
  });
}

/** Distinct people who have raised this area. */
export function weightOf(issue: AnonymousIssue): number {
  return new Set(issue.contributions.map((c) => c.author)).size;
}

export type AnonymousStatus = 'building' | 'agenda';

export interface AnonymousOutcome {
  id: string;
  area: IssueArea;
  areaLabel: string;
  weight: number;
  status: AnonymousStatus;
  /** True once it should be discussed at the meeting. */
  onAgenda: boolean;
  /** Neutral, author-stripped notes for the house. */
  notes: string[];
  /** One line for the agenda or the dashboard. */
  summary: string;
}

/**
 * Decide whether an issue is ready for the house, and phrase it for them.
 *
 * Consensus (enough distinct raisers) goes to the agenda at once. A lone raise
 * waits out the cooling window, then surfaces as a gentle "one person
 * mentioned" — real, but never a same-day strike, and never named.
 */
export function resolveAnonymous(
  issue: AnonymousIssue,
  houseNames: string[],
  now: string,
  config: AnonymousConfig = DEFAULT_ANON_CONFIG,
): AnonymousOutcome {
  const weight = weightOf(issue);
  const label = AREA_LABEL.get(issue.area) ?? 'Something else';

  const ageHours = (Date.parse(now) - Date.parse(issue.createdAt)) / 3_600_000;
  const isConsensus = weight >= config.minWeightForAgenda;
  const cooled = ageHours >= config.coolingHours;
  const onAgenda = isConsensus || cooled;

  const notes = issue.contributions
    .map((c) => c.note)
    .filter((n): n is string => Boolean(n))
    .map((n) => softenNote(n, houseNames, config));

  let summary: string;
  if (isConsensus) {
    summary = `${weight} housemates quietly flagged ${label.toLowerCase()}. Worth a calm word as a house.`;
  } else if (onAgenda) {
    summary = `Someone raised ${label.toLowerCase()}. Not urgent — just worth airing.`;
  } else {
    const wait = Math.max(1, Math.ceil(config.coolingHours - ageHours));
    summary = `One quiet flag on ${label.toLowerCase()}. Held ${wait}h in case it's the heat of the moment; `
      + `surfaces on its own, sooner if anyone else agrees.`;
  }

  return {
    id: issue.id, area: issue.area, areaLabel: label,
    weight, status: onAgenda ? 'agenda' : 'building', onAgenda, notes, summary,
  };
}

/** Everything ready for the meeting agenda, most-supported first. */
export function anonymousAgenda(
  issues: AnonymousIssue[],
  houseNames: string[],
  now: string,
  config: AnonymousConfig = DEFAULT_ANON_CONFIG,
): AnonymousOutcome[] {
  return issues
    .map((issue) => resolveAnonymous(issue, houseNames, now, config))
    .filter((o) => o.onAgenda)
    .sort((a, b) => b.weight - a.weight);
}
