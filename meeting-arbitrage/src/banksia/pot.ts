/**
 * The pot — how a fine becomes real without anyone chasing money.
 *
 * The house already had a rule (four chores a week or a fine) and it never
 * worked, for one reason: enforcing it means somebody has to personally demand
 * cash from a housemate, and nobody wants to. A $100 fine makes that worse, not
 * better — the bigger the number, the more awkward the ask, so the less likely
 * anyone collects, and the more the whole system reads as a bluff.
 *
 * So the money goes in *first*. Everyone stakes a buy-in at the start of a
 * period into a shared pot. A fine is not an invoice sent after the fact — it
 * is a deduction from a stake that is already sitting there. Nobody asks anybody
 * for anything. At the end of the period what's left of your stake is yours, and
 * the fines everyone racked up become a surplus that goes somewhere good.
 *
 * That flips the incentive from punitive to positive: staying clean isn't
 * "avoid a bill", it's "get your stake back *and* a cut of everyone else's
 * slip-ups". The fine can be large and still humane, because it is bounded by a
 * stake you already agreed to put up — you can lose your buy-in, but the system
 * never manufactures a debt you didn't opt into. The one case where it would
 * (fined past your stake) is surfaced loudly rather than pretended away, because
 * that is exactly the moment the pot stops being able to enforce itself.
 *
 * Pure functions, no clock, no database — the numbers decide who gets what and
 * they have to be arguable at the table.
 */

export interface PotConfig {
  /** What each person puts in at the start of a period, in cents. */
  buyInCents: number;
  /** Deducted from a stake per task short of the weekly target. */
  finePerMissedTaskCents: number;
  /**
   * Where the fines collected over the period go when it closes:
   *   split-clean  divided among everyone who finished the period clean
   *   house-fund   pooled for a house thing (dinner, a new pan, the bond)
   *   roll-over    carried into the next period's pot
   */
  distribution: 'split-clean' | 'house-fund' | 'roll-over';
}

export const DEFAULT_POT_CONFIG: PotConfig = {
  buyInCents: 4000,               // $40 stake
  finePerMissedTaskCents: 500,    // $5 per task short — see recommendPot() on $100
  distribution: 'split-clean',
};

export interface Stake {
  memberId: string;
  /** The buy-in, in cents. */
  openingCents: number;
  /** Total fined this period, before the stake cap. */
  finedCents: number;
}

export interface StakeState extends Stake {
  /** What's left of this person's stake, floored at zero. */
  remainingCents: number;
  /**
   * Amount fined beyond the stake — a real debt the pot cannot cover. Should
   * normally be zero; non-zero means this person has spent their whole buy-in
   * and the pot can no longer enforce against them without a top-up.
   */
  overflowCents: number;
  clean: boolean;
  exhausted: boolean;
}

export interface PotState {
  /** Sum of every buy-in — the whole pot. */
  totalCents: number;
  stakes: StakeState[];
  /**
   * Fines that stuck (capped at each person's stake). This is the surplus that
   * gets distributed; it never leaves the pot, it just changes whose it is.
   */
  surplusCents: number;
  /** People fined past their stake — the pot's blind spot, named. */
  overflows: Array<{ memberId: string; overflowCents: number }>;
}

/** Open a period: everyone's stake starts at the buy-in. */
export function openPot(memberIds: string[], config: PotConfig): Stake[] {
  return memberIds.map((memberId) => ({
    memberId,
    openingCents: config.buyInCents,
    finedCents: 0,
  }));
}

/**
 * Apply a week's fines to the stakes.
 *
 * Fines accumulate across weeks within a period. A fine larger than what's left
 * of a stake is recorded in full (so the overflow is visible) but can only ever
 * remove what's actually there — you cannot take $100 out of a $40 stake and
 * pretend the pot grew by $100.
 */
export function applyWeekFines(
  stakes: Stake[], finesByMember: Record<string, number>,
): Stake[] {
  return stakes.map((stake) => {
    const fine = Math.max(0, finesByMember[stake.memberId] ?? 0);
    return { ...stake, finedCents: stake.finedCents + fine };
  });
}

/** Compute the live state of the pot from the stakes. */
export function potState(stakes: Stake[]): PotState {
  const states: StakeState[] = stakes.map((stake) => {
    const capped = Math.min(stake.finedCents, stake.openingCents);
    const overflowCents = Math.max(0, stake.finedCents - stake.openingCents);
    return {
      ...stake,
      remainingCents: stake.openingCents - capped,
      overflowCents,
      clean: stake.finedCents === 0,
      exhausted: stake.finedCents >= stake.openingCents,
    };
  });

  return {
    totalCents: stakes.reduce((sum, s) => sum + s.openingCents, 0),
    stakes: states,
    surplusCents: states.reduce((sum, s) => sum + (s.openingCents - s.remainingCents), 0),
    overflows: states
      .filter((s) => s.overflowCents > 0)
      .map((s) => ({ memberId: s.memberId, overflowCents: s.overflowCents })),
  };
}

export interface Payout {
  memberId: string;
  /** Their remaining stake. */
  stakeBackCents: number;
  /** Their share of the distributed surplus (0 unless split-clean and clean). */
  bonusCents: number;
  totalCents: number;
  /** Still owed beyond their stake — the pot could not absorb this. */
  owesCents: number;
}

export interface Distribution {
  payouts: Payout[];
  /** Money set aside for a house thing (house-fund), or carried on (roll-over). */
  houseFundCents: number;
  rolloverCents: number;
  /** One-line summary for the meeting. */
  summary: string;
}

/**
 * Close the period and work out who gets what.
 *
 * Everyone always gets their remaining stake back — that money was theirs, it
 * only ever sat in the pot as collateral. The surplus (the fines) then goes
 * where the house agreed:
 *
 *   split-clean  the people who finished clean share it. This is the strongest
 *                positive incentive: the tidy housemates are literally paid out
 *                of the messy ones' slip-ups, and nobody had to send an invoice.
 *   house-fund   it buys something everyone benefits from, so even the fined
 *                get a little of it back and it feels less like a punishment.
 *   roll-over    it seeds next period's pot.
 */
export function distributePot(stakes: Stake[], config: PotConfig): Distribution {
  const state = potState(stakes);
  const clean = state.stakes.filter((s) => s.clean);

  const base: Payout[] = state.stakes.map((s) => ({
    memberId: s.memberId,
    stakeBackCents: s.remainingCents,
    bonusCents: 0,
    totalCents: s.remainingCents,
    owesCents: s.overflowCents,
  }));

  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (config.distribution === 'split-clean' && clean.length > 0 && state.surplusCents > 0) {
    // Integer cents split; the remainder goes to the first clean member so the
    // books balance exactly rather than leaving stray cents in the pot.
    const share = Math.floor(state.surplusCents / clean.length);
    const remainder = state.surplusCents - share * clean.length;
    const cleanIds = new Set(clean.map((s) => s.memberId));
    let first = true;
    for (const payout of base) {
      if (!cleanIds.has(payout.memberId)) continue;
      payout.bonusCents = share + (first ? remainder : 0);
      payout.totalCents = payout.stakeBackCents + payout.bonusCents;
      first = false;
    }
    return {
      payouts: base, houseFundCents: 0, rolloverCents: 0,
      summary: `${money(state.surplusCents)} in fines split among ${clean.length} clean `
        + `${clean.length === 1 ? 'housemate' : 'housemates'} — ${money(share)} each.`,
    };
  }

  if (config.distribution === 'house-fund') {
    return {
      payouts: base, houseFundCents: state.surplusCents, rolloverCents: 0,
      summary: `${money(state.surplusCents)} of fines into the house fund.`,
    };
  }

  if (config.distribution === 'roll-over') {
    return {
      payouts: base, houseFundCents: 0, rolloverCents: state.surplusCents,
      summary: `${money(state.surplusCents)} of fines rolled into next period.`,
    };
  }

  // split-clean but nobody was clean: the surplus has nowhere fair to go, so it
  // becomes the house fund rather than rewarding no one or vanishing.
  return {
    payouts: base, houseFundCents: state.surplusCents, rolloverCents: 0,
    summary: state.surplusCents > 0
      ? `Nobody finished clean — ${money(state.surplusCents)} to the house fund.`
      : 'Everyone clean. Full stakes back, no fines.',
  };
}

/**
 * A sanity check on a proposed pot, for the setup screen.
 *
 * The point is to catch the "$100 fine" trap. A fine that can wipe a stake in a
 * single week isn't a deterrent, it's a cliff: one bad week and someone has
 * nothing left to lose, so the pot stops working on them for the rest of the
 * period. This reports how many bad weeks the stake survives and warns when
 * that's under two.
 */
export interface PotAdvice {
  weeksOfRunway: number;
  ok: boolean;
  note: string;
}

export function recommendPot(config: PotConfig, tasksRequired = 4): PotAdvice {
  // Worst case: someone does nothing, so they're fined the full weekly amount.
  const worstWeeklyFine = config.finePerMissedTaskCents * tasksRequired;
  const weeks = worstWeeklyFine > 0
    ? Math.floor(config.buyInCents / worstWeeklyFine)
    : Infinity;

  const money = (cents: number) => `$${(cents / 100).toFixed(0)}`;

  if (weeks >= 3) {
    return {
      weeksOfRunway: weeks, ok: true,
      note: `A ${money(config.buyInCents)} stake absorbs ${weeks} bad weeks before it's gone. Healthy.`,
    };
  }
  if (weeks >= 1) {
    return {
      weeksOfRunway: weeks, ok: true,
      note: `A bad week costs up to ${money(worstWeeklyFine)}, so the ${money(config.buyInCents)} `
        + `stake lasts about ${weeks} of them. Steep but workable — expect top-ups.`,
    };
  }
  return {
    weeksOfRunway: 0, ok: false,
    note: `A single bad week (${money(worstWeeklyFine)}) wipes the ${money(config.buyInCents)} stake, `
      + `so the pot can't enforce past week one. Either raise the buy-in or lower the fine — `
      + `a $100 fine wants a stake nearer ${money(worstWeeklyFine * 3)}.`,
  };
}
