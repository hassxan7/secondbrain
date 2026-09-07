/**
 * Shared domain types for the meeting-arbitrage engine.
 *
 * Both products in this repo run on the same engine:
 *   - Banksia  : a fixed weekly house meeting with an instant re-fix path.
 *   - Ripple   : ad-hoc Sydney hangouts arbitraged on time x activity x place.
 *
 * The engine is deterministic. No model is ever consulted to decide a time,
 * a quorum, or a fine. LLM output is confined to prose (see ripple/brief.ts).
 */

/** What one person said about one slot. */
export type AvailabilityValue = 'yes' | 'ifneed' | 'no';

/** A candidate meeting time. `id` is stable and safe to put in a URL. */
export interface Slot {
  id: string;
  /** ISO-8601 instant, always UTC (trailing `Z`). */
  startUtc: string;
  durationMins: number;
}

/**
 * A recurring, verifiable commitment — Isaac's Monday football practice.
 *
 * Standing conflicts are the load-bearing distinction in this system. A slot
 * that collides with one fails *every single week*, so it must never be chosen
 * as the anchor. Declaring one is free and permanent; it never costs a veto
 * token, because it is not a dodge. Compare `RefixRequest`.
 */
export interface StandingConflict {
  /** 0 = Sunday .. 6 = Saturday, in the group's timezone. */
  weekday: number;
  /** Minutes from local midnight. */
  startMin: number;
  endMin: number;
  label: string;
}

export interface Participant {
  id: string;
  name: string;
  /** The meeting is not viable without this person. Use sparingly. */
  required?: boolean;
  /** 0..1 share of recent meetings actually attended. Drives scheduling weight. */
  attendanceRate?: number;
  /** How many recent rounds this person was the one the schedule excluded. */
  excludedRecently?: number;
  standingConflicts?: StandingConflict[];
}

/** responses[participantId][slotId] — absent keys mean "did not answer". */
export type ResponseMap = Record<string, Record<string, AvailabilityValue>>;

/**
 * A recurring weekly slot, e.g. `{ weekday: 1, time: '19:30' }` for Monday
 * 7:30pm. Lives here rather than in anchor.ts because a group's persisted
 * settings carry one, and types.ts must not import from anchor.ts.
 */
export interface WeeklyPattern {
  /** 0 = Sunday .. 6 = Saturday, in the group's timezone. */
  weekday: number;
  /** Local start time, `HH:MM`. */
  time: string;
}

export interface ArbitrageConfig {
  /** Minimum heads (yes + ifneed) for a slot to be viable at all. */
  quorum: number;
  /** The incumbent fixed slot for this round, if one is already set. */
  anchorSlotId?: string;
  /** The standing weekly pattern in force, independent of any dated slot. */
  anchorPattern?: WeeklyPattern;
  /**
   * Stability bonus, in person-units, granted to the incumbent slot.
   * This is deliberate hysteresis: a recurring meeting that drifts every week
   * stops being a schelling point and attendance collapses.
   */
  anchorBonus: number;
  /** An alternative must beat the anchor by this much to justify moving. */
  switchMargin: number;
  /** Score contribution of an "if needed" response. */
  ifNeedValue: number;
  /** Weight floor, so a chronic no-show never drops to literally zero pull. */
  minWeight: number;
  /** Score penalty per recent exclusion, to rotate who gets left out. */
  fairnessPenalty: number;
  /** Penalty applied to a slot colliding with a standing conflict. */
  standingConflictPenalty: number;
  timezone: string;
}

export const DEFAULT_CONFIG: ArbitrageConfig = {
  quorum: 5,
  anchorBonus: 0.75,
  switchMargin: 1.0,
  ifNeedValue: 0.5,
  minWeight: 0.5,
  fairnessPenalty: 0.4,
  standingConflictPenalty: 3.0,
  timezone: 'Australia/Sydney',
};

export interface SlotScore {
  slot: Slot;
  score: number;
  /** Said yes. */
  attendees: string[];
  /** Said "if needed". */
  ifNeeded: string[];
  /** Said no. */
  absent: string[];
  /** Never answered for this slot. Counted as 0, surfaced for chasing. */
  unknown: string[];
  /** Required participants who cannot make it — forces `viable: false`. */
  blockedBy: string[];
  conflicts: Array<{ participantId: string; label: string }>;
  viable: boolean;
  /** Human-readable notes explaining the score, for the UI and the bot. */
  reasons: string[];
}

export type RecommendationAction = 'keep-anchor' | 'switch' | 'no-viable-slot';

export interface ArbitrageResult {
  ranked: SlotScore[];
  recommendation: {
    slotId: string | null;
    action: RecommendationAction;
    /** How far the winner beat the incumbent. 0 when there is no anchor. */
    margin: number;
    rationale: string;
  };
  /** People who have not responded to anything at all. Chase these first. */
  nonResponders: string[];
}
