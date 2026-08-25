/**
 * What to actually do, what it costs, and in what order.
 *
 * Three things get arbitraged here, not one:
 *
 *   what    approval voting across everyone who can make that time
 *   money   a per-person cap, because "let's do X" dies quietly when one
 *           person cannot afford it and will not say so in the group chat
 *   order   food before drinks before a club — a night is usually a sequence,
 *           and pretending it is a single choice is why plans stall
 *
 * Costs are per person in AUD and deliberately conservative: a plan that comes
 * in under is a good night, a plan that comes in over is someone quietly not
 * coming next time.
 */

import type { Slot } from '../core/types.ts';
import type { HubRanking, Member } from './geo.ts';
import { rankHubs } from './geo.ts';

export type ActivityCategory =
  | 'food' | 'drinks' | 'games' | 'nightlife' | 'outdoors' | 'culture' | 'wellness';

export interface Activity {
  id: string;
  label: string;
  emoji: string;
  /** Typical per-person spend, AUD. */
  estCostAud: number;
  durationMins: number;
  category: ActivityCategory;
  /** What to hand the Places API when looking for real venues. */
  placesQuery: string;
  timeOfDay: 'day' | 'night' | 'any';
  /** Where this sits in a night. Lower goes first. */
  sequenceRank: number;
  tags: string[];
  /** Curated Ripple event rather than a generic activity type. */
  rippleEvent?: boolean;
}

/**
 * The default catalogue. Ripple's own event directory is layered on top of
 * this at runtime (see `mergeRippleEvents`), so a curated warehouse jazz night
 * competes head-to-head with "go bowling" instead of living in a separate tab.
 */
export const ACTIVITIES: Activity[] = [
  { id: 'eats-casual', label: 'Casual eats', emoji: '🍜', estCostAud: 28, durationMins: 90,
    category: 'food', placesQuery: 'casual restaurant', timeOfDay: 'any', sequenceRank: 1,
    tags: ['food', 'chill', 'always-works'] },
  { id: 'eats-nice', label: 'Somewhere nicer', emoji: '🍝', estCostAud: 55, durationMins: 120,
    category: 'food', placesQuery: 'restaurant', timeOfDay: 'night', sequenceRank: 1,
    tags: ['food', 'occasion'] },
  { id: 'yum-cha', label: 'Yum cha', emoji: '🥟', estCostAud: 25, durationMins: 90,
    category: 'food', placesQuery: 'yum cha dim sum', timeOfDay: 'day', sequenceRank: 1,
    tags: ['food', 'day', 'group'] },
  { id: 'bakery-hop', label: 'Bakery hopping', emoji: '🥐', estCostAud: 18, durationMins: 90,
    category: 'food', placesQuery: 'bakery', timeOfDay: 'day', sequenceRank: 1,
    tags: ['food', 'day', 'cheap'] },
  { id: 'coffee', label: 'Coffee', emoji: '☕', estCostAud: 8, durationMins: 60,
    category: 'food', placesQuery: 'cafe', timeOfDay: 'day', sequenceRank: 1,
    tags: ['cheap', 'day'] },

  { id: 'pub', label: 'Pub', emoji: '🍺', estCostAud: 35, durationMins: 120,
    category: 'drinks', placesQuery: 'pub', timeOfDay: 'night', sequenceRank: 3,
    tags: ['drinks', 'always-works'] },
  { id: 'cocktails', label: 'Cocktail bar', emoji: '🍸', estCostAud: 50, durationMins: 120,
    category: 'drinks', placesQuery: 'cocktail bar', timeOfDay: 'night', sequenceRank: 3,
    tags: ['drinks', 'occasion'] },
  { id: 'trivia', label: 'Pub trivia', emoji: '🧠', estCostAud: 25, durationMins: 120,
    category: 'drinks', placesQuery: 'pub trivia night', timeOfDay: 'night', sequenceRank: 3,
    tags: ['drinks', 'games', 'weeknight'] },

  { id: 'bowling', label: 'Bowling', emoji: '🎳', estCostAud: 25, durationMins: 90,
    category: 'games', placesQuery: 'bowling alley', timeOfDay: 'any', sequenceRank: 2,
    tags: ['games', 'group'] },
  { id: 'pool', label: 'Pool', emoji: '🎱', estCostAud: 15, durationMins: 90,
    category: 'games', placesQuery: 'pool hall billiards', timeOfDay: 'any', sequenceRank: 2,
    tags: ['games', 'cheap'] },
  { id: 'karaoke', label: 'Karaoke', emoji: '🎤', estCostAud: 30, durationMins: 120,
    category: 'games', placesQuery: 'karaoke', timeOfDay: 'night', sequenceRank: 2,
    tags: ['games', 'group', 'loud'] },
  { id: 'arcade', label: 'Arcade', emoji: '🕹️', estCostAud: 25, durationMins: 90,
    category: 'games', placesQuery: 'arcade', timeOfDay: 'any', sequenceRank: 2,
    tags: ['games'] },
  { id: 'mini-golf', label: 'Mini golf', emoji: '⛳', estCostAud: 25, durationMins: 75,
    category: 'games', placesQuery: 'mini golf', timeOfDay: 'any', sequenceRank: 2,
    tags: ['games', 'group'] },
  { id: 'board-games', label: 'Board game cafe', emoji: '🎲', estCostAud: 18, durationMins: 120,
    category: 'games', placesQuery: 'board game cafe', timeOfDay: 'any', sequenceRank: 2,
    tags: ['games', 'cheap', 'chill'] },

  { id: 'clubbing', label: 'Clubbing', emoji: '🪩', estCostAud: 45, durationMins: 180,
    category: 'nightlife', placesQuery: 'nightclub', timeOfDay: 'night', sequenceRank: 4,
    tags: ['nightlife', 'late', 'weekend'] },
  { id: 'live-music', label: 'Live music', emoji: '🎸', estCostAud: 35, durationMins: 150,
    category: 'nightlife', placesQuery: 'live music venue', timeOfDay: 'night', sequenceRank: 4,
    tags: ['nightlife', 'culture'] },
  { id: 'comedy', label: 'Comedy', emoji: '🎙️', estCostAud: 30, durationMins: 120,
    category: 'culture', placesQuery: 'comedy club', timeOfDay: 'night', sequenceRank: 4,
    tags: ['culture'] },
  { id: 'cinema', label: 'Cinema', emoji: '🎬', estCostAud: 22, durationMins: 150,
    category: 'culture', placesQuery: 'cinema', timeOfDay: 'any', sequenceRank: 2,
    tags: ['culture', 'chill'] },

  { id: 'beach', label: 'Beach', emoji: '🏖️', estCostAud: 0, durationMins: 180,
    category: 'outdoors', placesQuery: 'beach', timeOfDay: 'day', sequenceRank: 1,
    tags: ['free', 'day', 'summer'] },
  { id: 'picnic', label: 'Picnic', emoji: '🧺', estCostAud: 15, durationMins: 150,
    category: 'outdoors', placesQuery: 'park', timeOfDay: 'day', sequenceRank: 1,
    tags: ['cheap', 'day'] },
  { id: 'coastal-walk', label: 'Coastal walk', emoji: '🥾', estCostAud: 0, durationMins: 150,
    category: 'outdoors', placesQuery: 'coastal walk', timeOfDay: 'day', sequenceRank: 1,
    tags: ['free', 'day'] },
  { id: 'bathhouse', label: 'Bathhouse', emoji: '♨️', estCostAud: 60, durationMins: 120,
    category: 'wellness', placesQuery: 'bathhouse sauna', timeOfDay: 'any', sequenceRank: 2,
    tags: ['wellness', 'occasion'] },
];

export const ACTIVITY_BY_ID = new Map(ACTIVITIES.map((a) => [a.id, a]));

/** Fold Ripple's curated events into the catalogue so they compete directly. */
export function mergeRippleEvents(events: Activity[], base = ACTIVITIES): Activity[] {
  return [...base, ...events.map((e) => ({ ...e, rippleEvent: true }))];
}

export interface HangoutMember extends Member {
  /** Most they want to spend per person for the whole outing, AUD. */
  budgetAud: number;
  /** Approval voting: tick everything you would be up for, not just one. */
  approvals: string[];
}

export interface HangoutConfig {
  minAttendees: number;
  wantWeight: number;
  /**
   * Charged per person priced out. High on purpose: a plan half the group
   * cannot afford is not a plan, it is a smaller plan with hurt feelings.
   */
  pricedOutPenalty: number;
  /** Charged per 10 minutes of mean travel. */
  travelWeight: number;
  maxStops: number;
  timezone: string;
}

export const DEFAULT_HANGOUT_CONFIG: HangoutConfig = {
  minAttendees: 3,
  wantWeight: 1,
  pricedOutPenalty: 1.5,
  travelWeight: 0.5,
  maxStops: 3,
  timezone: 'Australia/Sydney',
};

export interface ActivityOutcome {
  activity: Activity;
  /** Attendees who ticked it. */
  approvals: string[];
  approvalRate: number;
  /** Attendees whose budget will not cover it. */
  pricedOut: string[];
  score: number;
  reasons: string[];
}

/**
 * Rank activities for a specific set of attendees.
 *
 * Scoped to attendees rather than the whole group on purpose: the best thing
 * to do on Thursday depends on who can actually make Thursday. A club night
 * five people want is irrelevant if the three who can come all want pool.
 */
export function rankActivities(
  attendees: HangoutMember[],
  catalogue: Activity[] = ACTIVITIES,
  config: HangoutConfig = DEFAULT_HANGOUT_CONFIG,
): ActivityOutcome[] {
  if (attendees.length === 0) return [];

  return catalogue
    .map((activity) => {
      const approvals = attendees.filter((m) => m.approvals.includes(activity.id)).map((m) => m.id);
      const pricedOut = attendees.filter((m) => m.budgetAud < activity.estCostAud).map((m) => m.id);
      const approvalRate = approvals.length / attendees.length;

      const score = config.wantWeight * approvals.length
        - config.pricedOutPenalty * pricedOut.length;

      const reasons: string[] = [];
      if (approvals.length === 0) reasons.push('nobody picked it');
      if (pricedOut.length > 0) {
        reasons.push(`over budget for ${pricedOut.length} ${pricedOut.length === 1 ? 'person' : 'people'}`);
      }
      if (activity.rippleEvent) reasons.push('curated Ripple event');

      return {
        activity, approvals, pricedOut,
        approvalRate: Math.round(approvalRate * 100) / 100,
        score: Math.round(score * 1000) / 1000,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score || b.approvalRate - a.approvalRate);
}

export interface ItineraryStop {
  activity: Activity;
  approvals: string[];
  estCostAud: number;
}

export interface Itinerary {
  stops: ItineraryStop[];
  totalCostAud: number;
  totalMins: number;
  /** Attendees the full itinerary prices out. Should normally be empty. */
  pricedOut: string[];
  /** The tightest budget in the group — the number the itinerary must respect. */
  budgetCeilingAud: number;
  summary: string;
}

/**
 * Chain the top-approved activities into a night that fits the tightest budget.
 *
 * The ceiling is the *minimum* budget among attendees, not the average. Using
 * an average silently prices out whoever is broke this fortnight, which is the
 * exact failure this is meant to prevent. One stop per category so the night
 * has a shape, ordered by `sequenceRank` so food lands before the club.
 */
export function buildItinerary(
  ranked: ActivityOutcome[],
  attendees: HangoutMember[],
  config: HangoutConfig = DEFAULT_HANGOUT_CONFIG,
): Itinerary {
  const ceiling = attendees.length
    ? Math.min(...attendees.map((m) => m.budgetAud))
    : 0;

  const stops: ItineraryStop[] = [];
  const usedCategories = new Set<ActivityCategory>();
  let spend = 0;

  for (const outcome of ranked) {
    if (stops.length >= config.maxStops) break;
    if (outcome.approvals.length === 0) continue;
    if (usedCategories.has(outcome.activity.category)) continue;
    if (spend + outcome.activity.estCostAud > ceiling) continue;

    stops.push({
      activity: outcome.activity,
      approvals: outcome.approvals,
      estCostAud: outcome.activity.estCostAud,
    });
    usedCategories.add(outcome.activity.category);
    spend += outcome.activity.estCostAud;
  }

  stops.sort((a, b) => a.activity.sequenceRank - b.activity.sequenceRank);

  const totalMins = stops.reduce((sum, s) => sum + s.activity.durationMins, 0);
  const pricedOut = attendees.filter((m) => m.budgetAud < spend).map((m) => m.id);

  return {
    stops, totalCostAud: spend, totalMins, pricedOut,
    budgetCeilingAud: ceiling,
    summary: stops.length === 0
      ? 'No combination fits everyone’s budget. Raise a cap or pick something free.'
      : `${stops.map((s) => `${s.activity.emoji} ${s.activity.label}`).join(' → ')} · `
        + `~$${spend} each · ~${Math.round(totalMins / 60)}h`,
  };
}

export interface HangoutPlan {
  slot: Slot;
  attendees: string[];
  itinerary: Itinerary;
  hub: HubRanking;
  score: number;
  reasons: string[];
}

/**
 * Score one candidate night end to end: who comes, what they do, where.
 *
 * Kept separate from slot scoring in core/arbitrage.ts because the time
 * question is genuinely independent — that engine decides who is in the room,
 * and this one decides what the room does once it is full.
 */
export function scorePlan(args: {
  slot: Slot;
  attendees: HangoutMember[];
  catalogue?: Activity[];
  config?: Partial<HangoutConfig>;
}): HangoutPlan | null {
  const config = { ...DEFAULT_HANGOUT_CONFIG, ...args.config };
  const { slot, attendees } = args;

  if (attendees.length < config.minAttendees) return null;

  const ranked = rankActivities(attendees, args.catalogue ?? ACTIVITIES, config);
  const itinerary = buildItinerary(ranked, attendees, config);
  const hub = rankHubs(attendees, 1)[0];
  if (!hub) return null;

  const totalApprovals = itinerary.stops.reduce((sum, s) => sum + s.approvals.length, 0);
  const score = attendees.length
    + config.wantWeight * totalApprovals
    - config.pricedOutPenalty * itinerary.pricedOut.length
    - config.travelWeight * (hub.meanMinutes / 10);

  const reasons: string[] = [
    `${attendees.length} coming`,
    `~$${itinerary.totalCostAud} each (cap $${itinerary.budgetCeilingAud})`,
    `${hub.name}, ~${hub.meanMinutes} min average travel`,
  ];
  if (itinerary.pricedOut.length) reasons.push(`${itinerary.pricedOut.length} priced out`);
  if (hub.maxMinutes > 45) reasons.push(`longest trip ${hub.maxMinutes} min`);

  return {
    slot, attendees: attendees.map((m) => m.id), itinerary, hub,
    score: Math.round(score * 1000) / 1000,
    reasons,
  };
}
