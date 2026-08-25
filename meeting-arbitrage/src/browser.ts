/**
 * Browser bundle entry.
 *
 * Re-exports the engine so the web UIs and the standalone prototype run the
 * *same* arbitration code the Worker runs. The alternative — a simplified copy
 * of the scoring in the page — is how a demo ends up disagreeing with the
 * product it is demonstrating.
 *
 * Build:  npm run build:web
 */

export { scoreSlots, schedulingWeight } from './core/arbitrage.ts';
export { recommendAnchor, evaluateRefix, patternLabel, patternKey } from './core/anchor.ts';
export { generateGrid, formatSlot, localParts, collidesWithStandingConflict } from './core/slots.ts';
export { DEFAULT_CONFIG } from './core/types.ts';
export type {
  Slot, Participant, ResponseMap, AvailabilityValue, ArbitrageConfig,
  ArbitrageResult, SlotScore, StandingConflict, WeeklyPattern,
} from './core/types.ts';

export {
  ACTIVITIES, ACTIVITY_BY_ID, mergeRippleEvents, rankActivities, buildItinerary,
  scorePlan, DEFAULT_HANGOUT_CONFIG,
} from './ripple/activities.ts';
export type { Activity, HangoutMember, Itinerary, ActivityOutcome } from './ripple/activities.ts';

export { SUBURBS, rankHubs, haversineKm, centroid, estimateTravelMinutes, groupCentroid } from './ripple/geo.ts';
export type { Member, HubRanking, LatLng } from './ripple/geo.ts';

export {
  openBallots, recordAnswers, addSuggestion, pendingAsksFor, outstandingAsks,
  participants, rankBallots,
} from './ripple/suggestions.ts';
export type { Ballot, BallotOutcome, BallotOrigin } from './ripple/suggestions.ts';

export {
  parseEventUrl, fetchEventMeta, toActivity as linkToActivity,
  toDirectorySubmission, platformLabel,
} from './ripple/event-links.ts';
export type { ParsedEventUrl, EventPlatform } from './ripple/event-links.ts';

export { buildBrief, renderChatMessage } from './ripple/brief.ts';
export type { EventBrief } from './ripple/brief.ts';

export {
  settleWeek, resolveDisputes, resolveIssue, offenderTable, buildAgenda,
  describeIssueOutcome, formatMoney, DEFAULT_CHORE_CONFIG,
} from './banksia/accountability.ts';
