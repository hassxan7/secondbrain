// src/core/types.ts
var DEFAULT_CONFIG = {
  quorum: 5,
  anchorBonus: 0.75,
  switchMargin: 1,
  ifNeedValue: 0.5,
  minWeight: 0.5,
  fairnessPenalty: 0.4,
  standingConflictPenalty: 3,
  timezone: "Australia/Sydney"
};

// src/core/slots.ts
var WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};
var partsCache = /* @__PURE__ */ new Map();
function formatterFor(timeZone) {
  let fmt = partsCache.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    partsCache.set(timeZone, fmt);
  }
  return fmt;
}
function localParts(instant, timeZone) {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  if (Number.isNaN(date.getTime()))
    throw new RangeError(`invalid instant: ${String(instant)}`);
  const bag = {};
  for (const p of formatterFor(timeZone).formatToParts(date)) {
    if (p.type !== "literal")
      bag[p.type] = p.value;
  }
  const hour = Number(bag.hour) % 24;
  const minute = Number(bag.minute);
  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    hour,
    minute,
    weekday: WEEKDAY_INDEX[bag.weekday] ?? 0,
    minutesOfDay: hour * 60 + minute
  };
}
function offsetMinutes(instant, timeZone) {
  const p = localParts(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return Math.round((asUtc - instant.getTime()) / 6e4);
}
function zonedTimeToUtc(year, month, day, hour, minute, timeZone) {
  const naive = Date.UTC(year, month - 1, day, hour, minute);
  let guess = new Date(naive - offsetMinutes(new Date(naive), timeZone) * 6e4);
  const refined = naive - offsetMinutes(guess, timeZone) * 6e4;
  if (refined !== guess.getTime())
    guess = new Date(refined);
  return guess;
}
function formatSlot(slot, timeZone) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(slot.startUtc)).replace(/ /g, " ");
}
function generateGrid(opts) {
  const [y, m, d] = opts.startDate.split("-").map(Number);
  if (!y || !m || !d)
    throw new RangeError(`invalid startDate: ${opts.startDate}`);
  const slots = [];
  const allowed = opts.weekdays ? new Set(opts.weekdays) : null;
  for (let dayIndex = 0; dayIndex < opts.days; dayIndex++) {
    const probe = new Date(Date.UTC(y, m - 1, d + dayIndex, 12, 0));
    const local = localParts(probe, opts.timeZone);
    if (allowed && !allowed.has(local.weekday))
      continue;
    for (const time of opts.times) {
      const [hh, mm] = time.split(":").map(Number);
      const startUtc = zonedTimeToUtc(local.year, local.month, local.day, hh, mm, opts.timeZone);
      const id = `${local.year}-${pad(local.month)}-${pad(local.day)}T${pad(hh)}:${pad(mm)}`;
      slots.push({ id, startUtc: startUtc.toISOString(), durationMins: opts.durationMins });
    }
  }
  return slots;
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function collidesWithStandingConflict(slot, conflict, timeZone) {
  const p = localParts(slot.startUtc, timeZone);
  if (p.weekday !== conflict.weekday)
    return false;
  const slotStart = p.minutesOfDay;
  const slotEnd = slotStart + slot.durationMins;
  return slotStart < conflict.endMin && slotEnd > conflict.startMin;
}

// src/core/arbitrage.ts
function schedulingWeight(p, cfg) {
  const rate = p.attendanceRate ?? 1;
  const clamped = Math.min(1, Math.max(0, rate));
  return cfg.minWeight + (1 - cfg.minWeight) * clamped;
}
function resolveConfig(partial) {
  return { ...DEFAULT_CONFIG, ...partial };
}
function resolveAvailability(p, slot, responses, tz) {
  const explicit = responses[p.id]?.[slot.id];
  const clash = (p.standingConflicts ?? []).find((c) => collidesWithStandingConflict(slot, c, tz));
  if (explicit)
    return { value: explicit, conflict: clash?.label };
  if (clash)
    return { value: "no", conflict: clash.label };
  return { value: "unknown" };
}
function scoreSlots(input) {
  const cfg = resolveConfig(input.config);
  const { participants, responses, slots } = input;
  const ranked = slots.map((slot) => scoreOneSlot(slot, participants, responses, cfg)).sort(compareSlotScores);
  const nonResponders = participants.filter((p) => Object.keys(responses[p.id] ?? {}).length === 0).map((p) => p.id);
  return {
    ranked,
    recommendation: recommend(ranked, cfg),
    nonResponders
  };
}
function scoreOneSlot(slot, participants, responses, cfg) {
  const attendees = [];
  const ifNeeded = [];
  const absent = [];
  const unknown = [];
  const blockedBy = [];
  const conflicts = [];
  const reasons = [];
  let score = 0;
  for (const p of participants) {
    const { value, conflict } = resolveAvailability(p, slot, responses, cfg.timezone);
    const weight = schedulingWeight(p, cfg);
    if (conflict)
      conflicts.push({ participantId: p.id, label: conflict });
    switch (value) {
      case "yes":
        attendees.push(p.id);
        score += weight;
        break;
      case "ifneed":
        ifNeeded.push(p.id);
        score += weight * cfg.ifNeedValue;
        break;
      case "no":
        absent.push(p.id);
        if (p.required)
          blockedBy.push(p.id);
        score -= cfg.fairnessPenalty * (p.excludedRecently ?? 0);
        break;
      case "unknown":
        unknown.push(p.id);
        if (p.required)
          blockedBy.push(p.id);
        break;
    }
  }
  const heads = attendees.length + ifNeeded.length;
  const isAnchor = slot.id === cfg.anchorSlotId;
  if (isAnchor) {
    score += cfg.anchorBonus;
    reasons.push(`current fixed time (+${cfg.anchorBonus.toFixed(2)} stability bonus)`);
  }
  const viable = heads >= cfg.quorum && blockedBy.length === 0;
  if (heads < cfg.quorum)
    reasons.push(`below quorum: ${heads}/${cfg.quorum}`);
  if (blockedBy.length)
    reasons.push(`missing required: ${blockedBy.join(", ")}`);
  if (unknown.length)
    reasons.push(`${unknown.length} yet to answer`);
  for (const c of conflicts)
    reasons.push(`${c.participantId}: ${c.label}`);
  return {
    slot,
    score: round(score),
    attendees,
    ifNeeded,
    absent,
    unknown,
    blockedBy,
    conflicts,
    viable,
    reasons
  };
}
function compareSlotScores(a, b) {
  if (b.score !== a.score)
    return b.score - a.score;
  const heads = b.attendees.length + b.ifNeeded.length - (a.attendees.length + a.ifNeeded.length);
  if (heads !== 0)
    return heads;
  return a.slot.startUtc.localeCompare(b.slot.startUtc);
}
function recommend(ranked, cfg) {
  const viable = ranked.filter((r) => r.viable);
  if (viable.length === 0) {
    const best = ranked[0];
    return {
      slotId: null,
      action: "no-viable-slot",
      margin: 0,
      rationale: best ? `Nothing clears quorum. Closest is ${best.slot.id} (${best.reasons.join("; ")}).` : "No candidate slots were supplied."
    };
  }
  const winner = viable[0];
  if (!cfg.anchorSlotId) {
    return {
      slotId: winner.slot.id,
      action: "switch",
      margin: round(winner.score - (viable[1]?.score ?? 0)),
      rationale: `No fixed time set yet. ${winner.slot.id} is the strongest option.`
    };
  }
  const anchor = ranked.find((r) => r.slot.id === cfg.anchorSlotId);
  if (!anchor || !anchor.viable) {
    return {
      slotId: winner.slot.id,
      action: "switch",
      margin: round(winner.score - (anchor?.score ?? 0)),
      rationale: anchor ? `Fixed time is not viable this round (${anchor.reasons.join("; ")}). Moving to ${winner.slot.id}.` : `Fixed time is not among this round's options. Moving to ${winner.slot.id}.`
    };
  }
  const margin = round(winner.score - anchor.score);
  if (winner.slot.id === anchor.slot.id || margin <= cfg.switchMargin) {
    return {
      slotId: anchor.slot.id,
      action: "keep-anchor",
      margin,
      rationale: margin <= 0 ? "Fixed time is still the best option. Keeping it." : `Best alternative only beats the fixed time by ${margin.toFixed(2)}, under the ${cfg.switchMargin.toFixed(2)} margin needed to justify moving. Keeping it.`
    };
  }
  return {
    slotId: winner.slot.id,
    action: "switch",
    margin,
    rationale: `${winner.slot.id} beats the fixed time by ${margin.toFixed(2)}, clearing the ${cfg.switchMargin.toFixed(2)} margin. Worth moving.`
  };
}
function round(n) {
  return Math.round(n * 1e3) / 1e3;
}

// src/core/anchor.ts
var WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
function patternKey(p) {
  return `${p.weekday}T${p.time}`;
}
function patternLabel(p) {
  const [hh, mm] = p.time.split(":").map(Number);
  const suffix = hh < 12 ? "am" : "pm";
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  const minutes = mm === 0 ? "" : `:${String(mm).padStart(2, "0")}`;
  return `${WEEKDAY_NAMES[p.weekday]} ${hour12}${minutes} ${suffix}`;
}
var NUMERIC = { yes: 1, ifneed: 0.5, no: 0 };
function recommendAnchor(input) {
  const cfg = { ...DEFAULT_CONFIG, ...input.config };
  const { participants, responses } = input;
  const groups = /* @__PURE__ */ new Map();
  for (const slot of input.slots) {
    const lp = localParts(slot.startUtc, cfg.timezone);
    const pattern = {
      weekday: lp.weekday,
      time: `${String(lp.hour).padStart(2, "0")}:${String(lp.minute).padStart(2, "0")}`
    };
    const key = patternKey(pattern);
    const existing = groups.get(key);
    if (existing)
      existing.slots.push(slot);
    else
      groups.set(key, { pattern, slots: [slot] });
  }
  const ranked = [...groups.values()].map(({ pattern, slots }) => scorePattern(pattern, slots, participants, responses, cfg)).sort((a, b) => b.score - a.score || b.expectedHeads - a.expectedHeads);
  const viable = ranked.filter((c) => c.viable);
  const incumbentKey = input.incumbent ? patternKey(input.incumbent) : null;
  const incumbent = incumbentKey ? ranked.find((c) => c.key === incumbentKey) ?? null : null;
  if (viable.length === 0) {
    return {
      ranked,
      best: null,
      incumbent,
      action: "none-viable",
      rationale: "No weekly pattern clears quorum in a typical week. Either the quorum is too high or the group needs to offer more times."
    };
  }
  const best = viable[0];
  if (!incumbent) {
    return {
      ranked,
      best,
      incumbent: null,
      action: "adopt",
      rationale: `${best.label} is the strongest standing slot (${best.expectedHeads.toFixed(1)} of ${participants.length} in a typical week).`
    };
  }
  if (incumbent.conflicts.length > 0) {
    return {
      ranked,
      best,
      incumbent,
      action: "move",
      rationale: `${incumbent.label} runs into ${incumbent.conflicts.map((c) => `${c.name}'s ${c.label}`).join(", ")} every week. Move to ${best.label}.`
    };
  }
  const margin = best.score - incumbent.score;
  if (!incumbent.viable) {
    return {
      ranked,
      best,
      incumbent,
      action: "move",
      rationale: `${incumbent.label} no longer clears quorum (${incumbent.reasons.join("; ")}). Move to ${best.label}.`
    };
  }
  if (margin <= cfg.switchMargin) {
    return {
      ranked,
      best: incumbent,
      incumbent,
      action: "keep",
      rationale: `${incumbent.label} still holds up. The best alternative (${best.label}) is only ${margin.toFixed(2)} better, under the ${cfg.switchMargin.toFixed(2)} margin needed to justify moving a fixed time.`
    };
  }
  return {
    ranked,
    best,
    incumbent,
    action: "move",
    rationale: `${best.label} beats ${incumbent.label} by ${margin.toFixed(2)}, clearing the ${cfg.switchMargin.toFixed(2)} margin.`
  };
}
function scorePattern(pattern, slots, participants, responses, cfg) {
  const conflicts = [];
  const wouldExclude = [];
  const unknown = [];
  const reasons = [];
  let score = 0;
  let expectedHeads = 0;
  let blocked = false;
  for (const p of participants) {
    const clash = (p.standingConflicts ?? []).find(
      (c) => c.weekday === pattern.weekday && overlapsTime(pattern, c.startMin, c.endMin, slots)
    );
    if (clash) {
      conflicts.push({ participantId: p.id, name: p.name, label: clash.label });
      wouldExclude.push(p.id);
      score -= cfg.standingConflictPenalty;
      if (p.required)
        blocked = true;
      continue;
    }
    const answered = slots.map((s) => responses[p.id]?.[s.id]).filter((v) => Boolean(v));
    if (answered.length === 0) {
      unknown.push(p.id);
      if (p.required)
        blocked = true;
      continue;
    }
    const reliability = answered.reduce((sum, v) => sum + NUMERIC[v], 0) / answered.length;
    expectedHeads += reliability;
    score += schedulingWeightFor(p, cfg) * reliability;
    if (reliability < 0.5) {
      wouldExclude.push(p.id);
      if (p.required)
        blocked = true;
    }
  }
  const viable = expectedHeads >= cfg.quorum && !blocked;
  if (expectedHeads < cfg.quorum) {
    reasons.push(`expected ${expectedHeads.toFixed(1)} heads, need ${cfg.quorum}`);
  }
  if (blocked)
    reasons.push("a required person cannot reliably make it");
  for (const c of conflicts)
    reasons.push(`${c.name}: ${c.label} (every week)`);
  if (unknown.length)
    reasons.push(`${unknown.length} never answered for this slot`);
  return {
    pattern,
    key: patternKey(pattern),
    label: patternLabel(pattern),
    score: Math.round(score * 1e3) / 1e3,
    expectedHeads: Math.round(expectedHeads * 100) / 100,
    conflicts,
    wouldExclude,
    unknown,
    viable,
    reasons
  };
}
function overlapsTime(pattern, startMin, endMin, slots) {
  const [hh, mm] = pattern.time.split(":").map(Number);
  const start = hh * 60 + mm;
  const duration = slots[0]?.durationMins ?? 60;
  return start < endMin && start + duration > startMin;
}
function schedulingWeightFor(p, cfg) {
  const rate = Math.min(1, Math.max(0, p.attendanceRate ?? 1));
  return cfg.minWeight + (1 - cfg.minWeight) * rate;
}
function evaluateRefix(request, state, participant) {
  if (request.standingConflict) {
    return {
      granted: true,
      consumedToken: false,
      tokensRemaining: Math.max(0, state.budget - state.used),
      outcome: "repick-anchor",
      rationale: "Declared as a recurring commitment, so this re-picks the standing time rather than moving one meeting. Recurring clashes are free."
    };
  }
  const remaining = Math.max(0, state.budget - state.used);
  if (remaining > 0) {
    return {
      granted: true,
      consumedToken: true,
      tokensRemaining: remaining - 1,
      outcome: "refix-poll",
      rationale: `Re-fix poll opened. ${remaining - 1} of ${state.budget} ad-hoc moves left this period. If this clash is actually recurring, declare it as a standing conflict instead \u2014 those are free.`
    };
  }
  if (participant?.required) {
    return {
      granted: true,
      consumedToken: false,
      tokensRemaining: 0,
      outcome: "refix-poll",
      rationale: "Ad-hoc budget is spent, but this person is marked required, so the meeting cannot proceed without them. Re-fix poll opened and flagged."
    };
  }
  return {
    granted: false,
    consumedToken: false,
    tokensRemaining: 0,
    outcome: "proceed-without",
    rationale: `No ad-hoc moves left this period (${state.budget} used). The meeting goes ahead at the fixed time. Anything decided in your absence stands.`
  };
}

// src/ripple/geo.ts
var SUBURBS = {
  "sydney-cbd": { name: "Sydney CBD", lat: -33.8688, lng: 151.2093, hub: true },
  "haymarket": { name: "Haymarket", lat: -33.8797, lng: 151.2044, hub: true },
  "surry-hills": { name: "Surry Hills", lat: -33.8845, lng: 151.2119, hub: true },
  "darlinghurst": { name: "Darlinghurst", lat: -33.8797, lng: 151.2199, hub: true },
  "potts-point": { name: "Potts Point", lat: -33.8697, lng: 151.2255 },
  "newtown": { name: "Newtown", lat: -33.8963, lng: 151.1794, hub: true },
  "enmore": { name: "Enmore", lat: -33.8983, lng: 151.1738 },
  "erskineville": { name: "Erskineville", lat: -33.9028, lng: 151.1859 },
  "st-peters": { name: "St Peters", lat: -33.9114, lng: 151.181 },
  "redfern": { name: "Redfern", lat: -33.8926, lng: 151.2043 },
  "chippendale": { name: "Chippendale", lat: -33.8886, lng: 151.1985 },
  "ultimo": { name: "Ultimo", lat: -33.8797, lng: 151.1976 },
  "pyrmont": { name: "Pyrmont", lat: -33.87, lng: 151.195 },
  "glebe": { name: "Glebe", lat: -33.8796, lng: 151.1867 },
  "camperdown": { name: "Camperdown", lat: -33.8895, lng: 151.175 },
  "leichhardt": { name: "Leichhardt", lat: -33.8836, lng: 151.156 },
  "balmain": { name: "Balmain", lat: -33.8578, lng: 151.1795 },
  "marrickville": { name: "Marrickville", lat: -33.9111, lng: 151.1547, hub: true },
  "dulwich-hill": { name: "Dulwich Hill", lat: -33.9047, lng: 151.1394 },
  "ashfield": { name: "Ashfield", lat: -33.8886, lng: 151.1256 },
  "burwood": { name: "Burwood", lat: -33.8776, lng: 151.1039, hub: true },
  "strathfield": { name: "Strathfield", lat: -33.8736, lng: 151.0951 },
  "homebush": { name: "Homebush", lat: -33.8657, lng: 151.0827 },
  "lidcombe": { name: "Lidcombe", lat: -33.8646, lng: 151.0442 },
  "auburn": { name: "Auburn", lat: -33.8496, lng: 151.0329 },
  "parramatta": { name: "Parramatta", lat: -33.815, lng: 151.0011, hub: true },
  "rhodes": { name: "Rhodes", lat: -33.8306, lng: 151.087 },
  "ryde": { name: "Ryde", lat: -33.8148, lng: 151.1055 },
  "macquarie-park": { name: "Macquarie Park", lat: -33.7772, lng: 151.1246 },
  "epping": { name: "Epping", lat: -33.7726, lng: 151.0817 },
  "hornsby": { name: "Hornsby", lat: -33.7048, lng: 151.0993 },
  "chatswood": { name: "Chatswood", lat: -33.7969, lng: 151.1803, hub: true },
  "north-sydney": { name: "North Sydney", lat: -33.839, lng: 151.207, hub: true },
  "neutral-bay": { name: "Neutral Bay", lat: -33.832, lng: 151.218 },
  "manly": { name: "Manly", lat: -33.7969, lng: 151.2874, hub: true },
  "bondi-junction": { name: "Bondi Junction", lat: -33.8912, lng: 151.2504, hub: true },
  "bondi-beach": { name: "Bondi Beach", lat: -33.8908, lng: 151.2743 },
  "coogee": { name: "Coogee", lat: -33.9205, lng: 151.254 },
  "randwick": { name: "Randwick", lat: -33.9146, lng: 151.2437 },
  "kensington": { name: "Kensington", lat: -33.9089, lng: 151.2226 },
  "kingsford": { name: "Kingsford", lat: -33.9245, lng: 151.228 },
  "zetland": { name: "Zetland", lat: -33.9066, lng: 151.2087 },
  "waterloo": { name: "Waterloo", lat: -33.899, lng: 151.209 },
  "alexandria": { name: "Alexandria", lat: -33.9007, lng: 151.1954 },
  "mascot": { name: "Mascot", lat: -33.9235, lng: 151.1889 },
  "rockdale": { name: "Rockdale", lat: -33.9522, lng: 151.1379 },
  "kogarah": { name: "Kogarah", lat: -33.9633, lng: 151.1345 },
  "hurstville": { name: "Hurstville", lat: -33.9673, lng: 151.1027, hub: true },
  "bankstown": { name: "Bankstown", lat: -33.9171, lng: 151.0349 },
  "liverpool": { name: "Liverpool", lat: -33.9203, lng: 150.9238, hub: true }
};
var R_EARTH_KM = 6371;
var toRad = (deg) => deg * Math.PI / 180;
var toDeg = (rad) => rad * 180 / Math.PI;
function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}
function centroid(points) {
  if (points.length === 0)
    throw new RangeError("centroid of nothing");
  let x = 0, y = 0, z = 0;
  for (const p of points) {
    const lat = toRad(p.lat);
    const lng = toRad(p.lng);
    x += Math.cos(lat) * Math.cos(lng);
    y += Math.cos(lat) * Math.sin(lng);
    z += Math.sin(lat);
  }
  const n = points.length;
  x /= n;
  y /= n;
  z /= n;
  const hyp = Math.sqrt(x * x + y * y);
  return { lat: toDeg(Math.atan2(z, hyp)), lng: toDeg(Math.atan2(y, x)) };
}
function estimateTravelMinutes(km) {
  const WALK_END_KM = 2;
  const MID_END_KM = 8;
  if (km <= WALK_END_KM)
    return Math.round(5 + km * 7.5);
  const atWalkEnd = 5 + WALK_END_KM * 7.5;
  if (km <= MID_END_KM)
    return Math.round(atWalkEnd + (km - WALK_END_KM) * 2.5);
  const atMidEnd = atWalkEnd + (MID_END_KM - WALK_END_KM) * 2.5;
  return Math.round(atMidEnd + (km - MID_END_KM) * 1.2);
}
var FAIRNESS_WEIGHT = 2;
function resolveSuburb(key) {
  const s = SUBURBS[key];
  if (!s)
    throw new RangeError(`unknown suburb: ${key}`);
  return s;
}
function groupCentroid(members) {
  return centroid(members.map((m) => resolveSuburb(m.suburb)));
}
function rankHubs(members, limit = 6) {
  if (members.length === 0)
    return [];
  const centre = groupCentroid(members);
  const hubs = Object.entries(SUBURBS).filter(([, s]) => s.hub);
  return hubs.map(([hubKey, hub]) => {
    const perMember = members.map((m) => {
      const home = resolveSuburb(m.suburb);
      const km = haversineKm(home, hub);
      return { memberId: m.id, km: round2(km, 2), minutes: estimateTravelMinutes(km) };
    });
    const minutes = perMember.map((p) => p.minutes);
    const totalMinutes = minutes.reduce((a, b) => a + b, 0);
    const meanMinutes = totalMinutes / members.length;
    const maxMinutes = Math.max(...minutes);
    return {
      hubKey,
      name: hub.name,
      location: { lat: hub.lat, lng: hub.lng },
      perMember,
      totalMinutes,
      meanMinutes: round2(meanMinutes, 1),
      maxMinutes,
      spreadMinutes: maxMinutes - Math.min(...minutes),
      kmFromCentroid: round2(haversineKm(centre, hub), 2),
      cost: round2(totalMinutes + FAIRNESS_WEIGHT * (maxMinutes - meanMinutes), 1)
    };
  }).sort((a, b) => a.cost - b.cost || a.maxMinutes - b.maxMinutes).slice(0, limit);
}
function round2(n, dp) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

// src/ripple/activities.ts
var ACTIVITIES = [
  {
    id: "eats-casual",
    label: "Casual eats",
    emoji: "\u{1F35C}",
    estCostAud: 28,
    durationMins: 90,
    category: "food",
    placesQuery: "casual restaurant",
    timeOfDay: "any",
    sequenceRank: 1,
    tags: ["food", "chill", "always-works"]
  },
  {
    id: "eats-nice",
    label: "Somewhere nicer",
    emoji: "\u{1F35D}",
    estCostAud: 55,
    durationMins: 120,
    category: "food",
    placesQuery: "restaurant",
    timeOfDay: "night",
    sequenceRank: 1,
    tags: ["food", "occasion"]
  },
  {
    id: "yum-cha",
    label: "Yum cha",
    emoji: "\u{1F95F}",
    estCostAud: 25,
    durationMins: 90,
    category: "food",
    placesQuery: "yum cha dim sum",
    timeOfDay: "day",
    sequenceRank: 1,
    tags: ["food", "day", "group"]
  },
  {
    id: "bakery-hop",
    label: "Bakery hopping",
    emoji: "\u{1F950}",
    estCostAud: 18,
    durationMins: 90,
    category: "food",
    placesQuery: "bakery",
    timeOfDay: "day",
    sequenceRank: 1,
    tags: ["food", "day", "cheap"]
  },
  {
    id: "coffee",
    label: "Coffee",
    emoji: "\u2615",
    estCostAud: 8,
    durationMins: 60,
    category: "food",
    placesQuery: "cafe",
    timeOfDay: "day",
    sequenceRank: 1,
    tags: ["cheap", "day"]
  },
  {
    id: "pub",
    label: "Pub",
    emoji: "\u{1F37A}",
    estCostAud: 35,
    durationMins: 120,
    category: "drinks",
    placesQuery: "pub",
    timeOfDay: "night",
    sequenceRank: 3,
    tags: ["drinks", "always-works"]
  },
  {
    id: "cocktails",
    label: "Cocktail bar",
    emoji: "\u{1F378}",
    estCostAud: 50,
    durationMins: 120,
    category: "drinks",
    placesQuery: "cocktail bar",
    timeOfDay: "night",
    sequenceRank: 3,
    tags: ["drinks", "occasion"]
  },
  {
    id: "trivia",
    label: "Pub trivia",
    emoji: "\u{1F9E0}",
    estCostAud: 25,
    durationMins: 120,
    category: "drinks",
    placesQuery: "pub trivia night",
    timeOfDay: "night",
    sequenceRank: 3,
    tags: ["drinks", "games", "weeknight"]
  },
  {
    id: "bowling",
    label: "Bowling",
    emoji: "\u{1F3B3}",
    estCostAud: 25,
    durationMins: 90,
    category: "games",
    placesQuery: "bowling alley",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["games", "group"]
  },
  {
    id: "pool",
    label: "Pool",
    emoji: "\u{1F3B1}",
    estCostAud: 15,
    durationMins: 90,
    category: "games",
    placesQuery: "pool hall billiards",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["games", "cheap"]
  },
  {
    id: "karaoke",
    label: "Karaoke",
    emoji: "\u{1F3A4}",
    estCostAud: 30,
    durationMins: 120,
    category: "games",
    placesQuery: "karaoke",
    timeOfDay: "night",
    sequenceRank: 2,
    tags: ["games", "group", "loud"]
  },
  {
    id: "arcade",
    label: "Arcade",
    emoji: "\u{1F579}\uFE0F",
    estCostAud: 25,
    durationMins: 90,
    category: "games",
    placesQuery: "arcade",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["games"]
  },
  {
    id: "mini-golf",
    label: "Mini golf",
    emoji: "\u26F3",
    estCostAud: 25,
    durationMins: 75,
    category: "games",
    placesQuery: "mini golf",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["games", "group"]
  },
  {
    id: "board-games",
    label: "Board game cafe",
    emoji: "\u{1F3B2}",
    estCostAud: 18,
    durationMins: 120,
    category: "games",
    placesQuery: "board game cafe",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["games", "cheap", "chill"]
  },
  {
    id: "clubbing",
    label: "Clubbing",
    emoji: "\u{1FAA9}",
    estCostAud: 45,
    durationMins: 180,
    category: "nightlife",
    placesQuery: "nightclub",
    timeOfDay: "night",
    sequenceRank: 4,
    tags: ["nightlife", "late", "weekend"]
  },
  {
    id: "live-music",
    label: "Live music",
    emoji: "\u{1F3B8}",
    estCostAud: 35,
    durationMins: 150,
    category: "nightlife",
    placesQuery: "live music venue",
    timeOfDay: "night",
    sequenceRank: 4,
    tags: ["nightlife", "culture"]
  },
  {
    id: "comedy",
    label: "Comedy",
    emoji: "\u{1F399}\uFE0F",
    estCostAud: 30,
    durationMins: 120,
    category: "culture",
    placesQuery: "comedy club",
    timeOfDay: "night",
    sequenceRank: 4,
    tags: ["culture"]
  },
  {
    id: "cinema",
    label: "Cinema",
    emoji: "\u{1F3AC}",
    estCostAud: 22,
    durationMins: 150,
    category: "culture",
    placesQuery: "cinema",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["culture", "chill"]
  },
  {
    id: "beach",
    label: "Beach",
    emoji: "\u{1F3D6}\uFE0F",
    estCostAud: 0,
    durationMins: 180,
    category: "outdoors",
    placesQuery: "beach",
    timeOfDay: "day",
    sequenceRank: 1,
    tags: ["free", "day", "summer"]
  },
  {
    id: "picnic",
    label: "Picnic",
    emoji: "\u{1F9FA}",
    estCostAud: 15,
    durationMins: 150,
    category: "outdoors",
    placesQuery: "park",
    timeOfDay: "day",
    sequenceRank: 1,
    tags: ["cheap", "day"]
  },
  {
    id: "coastal-walk",
    label: "Coastal walk",
    emoji: "\u{1F97E}",
    estCostAud: 0,
    durationMins: 150,
    category: "outdoors",
    placesQuery: "coastal walk",
    timeOfDay: "day",
    sequenceRank: 1,
    tags: ["free", "day"]
  },
  {
    id: "bathhouse",
    label: "Bathhouse",
    emoji: "\u2668\uFE0F",
    estCostAud: 60,
    durationMins: 120,
    category: "wellness",
    placesQuery: "bathhouse sauna",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["wellness", "occasion"]
  }
];
var ACTIVITY_BY_ID = new Map(ACTIVITIES.map((a) => [a.id, a]));
function mergeRippleEvents(events, base = ACTIVITIES) {
  return [...base, ...events.map((e) => ({ ...e, rippleEvent: true }))];
}
var DEFAULT_HANGOUT_CONFIG = {
  minAttendees: 3,
  wantWeight: 1,
  pricedOutPenalty: 1.5,
  travelWeight: 0.5,
  maxStops: 3,
  timezone: "Australia/Sydney"
};
function rankActivities(attendees, catalogue = ACTIVITIES, config = DEFAULT_HANGOUT_CONFIG) {
  if (attendees.length === 0)
    return [];
  return catalogue.map((activity) => {
    const approvals = attendees.filter((m) => m.approvals.includes(activity.id)).map((m) => m.id);
    const pricedOut = attendees.filter((m) => m.budgetAud < activity.estCostAud).map((m) => m.id);
    const approvalRate = approvals.length / attendees.length;
    const score = config.wantWeight * approvals.length - config.pricedOutPenalty * pricedOut.length;
    const reasons = [];
    if (approvals.length === 0)
      reasons.push("nobody picked it");
    if (pricedOut.length > 0) {
      reasons.push(`over budget for ${pricedOut.length} ${pricedOut.length === 1 ? "person" : "people"}`);
    }
    if (activity.rippleEvent)
      reasons.push("curated Ripple event");
    return {
      activity,
      approvals,
      pricedOut,
      approvalRate: Math.round(approvalRate * 100) / 100,
      score: Math.round(score * 1e3) / 1e3,
      reasons
    };
  }).sort((a, b) => b.score - a.score || b.approvalRate - a.approvalRate);
}
function buildItinerary(ranked, attendees, config = DEFAULT_HANGOUT_CONFIG) {
  const ceiling = attendees.length ? Math.min(...attendees.map((m) => m.budgetAud)) : 0;
  const affordable = ranked.filter(
    (o) => o.approvals.length > 0 && o.activity.estCostAud <= ceiling
  );
  const byCategory = /* @__PURE__ */ new Map();
  for (const outcome of affordable) {
    const held = byCategory.get(outcome.activity.category);
    if (!held || outcome.score > held.score)
      byCategory.set(outcome.activity.category, outcome);
  }
  const candidates = [...byCategory.values()];
  const combinations = [];
  const walk = (start, picks) => {
    if (picks.length > 0)
      combinations.push([...picks]);
    if (picks.length >= config.maxStops)
      return;
    for (let i = start; i < candidates.length; i++) {
      picks.push(candidates[i]);
      walk(i + 1, picks);
      picks.pop();
    }
  };
  walk(0, []);
  const costOf = (picks) => picks.reduce((sum, p) => sum + p.activity.estCostAud, 0);
  const approvalsOf = (picks) => picks.reduce((sum, p) => sum + p.approvals.length, 0);
  const chosen = combinations.filter((picks) => costOf(picks) <= ceiling).reduce((bestSoFar, picks) => {
    if (bestSoFar.length === 0)
      return picks;
    const a = approvalsOf(picks);
    const b = approvalsOf(bestSoFar);
    if (a !== b)
      return a > b ? picks : bestSoFar;
    if (picks.length !== bestSoFar.length) {
      return picks.length > bestSoFar.length ? picks : bestSoFar;
    }
    return costOf(picks) < costOf(bestSoFar) ? picks : bestSoFar;
  }, []);
  const stops = chosen.map((outcome) => ({
    activity: outcome.activity,
    approvals: outcome.approvals,
    estCostAud: outcome.activity.estCostAud
  }));
  stops.sort((a, b) => a.activity.sequenceRank - b.activity.sequenceRank);
  const spend = stops.reduce((sum, s) => sum + s.estCostAud, 0);
  const totalMins = stops.reduce((sum, s) => sum + s.activity.durationMins, 0);
  const pricedOut = attendees.filter((m) => m.budgetAud < spend).map((m) => m.id);
  return {
    stops,
    totalCostAud: spend,
    totalMins,
    pricedOut,
    budgetCeilingAud: ceiling,
    summary: stops.length === 0 ? "No combination fits everyone\u2019s budget. Raise a cap or pick something free." : `${stops.map((s) => `${s.activity.emoji} ${s.activity.label}`).join(" \u2192 ")} \xB7 ~$${spend} each \xB7 ~${Math.round(totalMins / 60)}h`
  };
}
function scorePlan(args) {
  const config = { ...DEFAULT_HANGOUT_CONFIG, ...args.config };
  const { slot, attendees } = args;
  if (attendees.length < config.minAttendees)
    return null;
  const ranked = rankActivities(attendees, args.catalogue ?? ACTIVITIES, config);
  const itinerary = buildItinerary(ranked, attendees, config);
  const hub = rankHubs(attendees, 1)[0];
  if (!hub)
    return null;
  const totalApprovals = itinerary.stops.reduce((sum, s) => sum + s.approvals.length, 0);
  const score = attendees.length + config.wantWeight * totalApprovals - config.pricedOutPenalty * itinerary.pricedOut.length - config.travelWeight * (hub.meanMinutes / 10);
  const reasons = [
    `${attendees.length} coming`,
    `~$${itinerary.totalCostAud} each (cap $${itinerary.budgetCeilingAud})`,
    `${hub.name}, ~${hub.meanMinutes} min average travel`
  ];
  if (itinerary.pricedOut.length)
    reasons.push(`${itinerary.pricedOut.length} priced out`);
  if (hub.maxMinutes > 45)
    reasons.push(`longest trip ${hub.maxMinutes} min`);
  return {
    slot,
    attendees: attendees.map((m) => m.id),
    itinerary,
    hub,
    score: Math.round(score * 1e3) / 1e3,
    reasons
  };
}

// src/ripple/brief.ts
function buildBrief(input) {
  const nameOf = (id) => input.names[id] ?? id;
  const stops = input.itinerary.stops.map((s, i) => ({
    label: s.activity.label,
    emoji: s.activity.emoji,
    estCostAud: s.estCostAud,
    venue: input.venues[i]
  }));
  const travel = input.hub.perMember.filter((p) => input.attendeeIds.includes(p.memberId)).map((p) => ({ name: nameOf(p.memberId), minutes: p.minutes })).sort((a, b) => b.minutes - a.minutes);
  const whenLocal = formatSlot(input.slot, input.timezone);
  const title = input.title ?? (stops.length ? `${stops.map((s) => s.label).join(" + ")} in ${input.hub.name}` : "Hangout");
  const attendees = input.attendeeIds.map(nameOf);
  const absent = input.absentIds.map(nameOf);
  const longestTripMins = travel[0]?.minutes ?? 0;
  const summary = [
    `${whenLocal} in ${input.hub.name}.`,
    stops.length ? input.itinerary.summary : "Nothing settled yet.",
    `${attendees.length} coming${absent.length ? `, ${absent.length} out` : ""}.`
  ].join(" ");
  const brief = {
    title,
    whenLocal,
    startUtc: input.slot.startUtc,
    where: input.hub.name,
    stops,
    costPerPersonAud: input.itinerary.totalCostAud,
    totalMins: input.itinerary.totalMins,
    attendees,
    absent,
    travel,
    longestTripMins,
    calendar: {
      googleUrl: googleCalendarUrl(input, title),
      ics: buildIcs(input, title, summary)
    },
    summary,
    chatMessage: ""
  };
  brief.chatMessage = renderChatMessage(brief);
  return brief;
}
function renderChatMessage(brief) {
  const lines = [
    `\u{1F4CD} ${brief.title}`,
    `\u{1F5D3}\uFE0F ${brief.whenLocal}`
  ];
  for (const stop of brief.stops) {
    const venue = stop.venue && stop.venue.source === "google" ? ` \u2014 ${stop.venue.name}` : "";
    lines.push(`${stop.emoji} ${stop.label}${venue} (~$${stop.estCostAud})`);
  }
  lines.push(`\u{1F4B8} ~$${brief.costPerPersonAud} each`);
  lines.push(`\u{1F465} ${brief.attendees.join(", ")}`);
  if (brief.absent.length)
    lines.push(`\u{1F6AB} Out: ${brief.absent.join(", ")}`);
  if (brief.longestTripMins > 40)
    lines.push(`\u{1F683} Longest trip ~${brief.longestTripMins} min`);
  return lines.join("\n");
}
function stampUtc(iso) {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
function googleCalendarUrl(input, title) {
  const start = new Date(input.slot.startUtc);
  const end = new Date(start.getTime() + Math.max(input.itinerary.totalMins, input.slot.durationMins) * 6e4);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stampUtc(start.toISOString())}/${stampUtc(end.toISOString())}`,
    details: input.itinerary.summary,
    location: input.hub.name + ", Sydney NSW"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
function buildIcs(input, title, summary) {
  const start = new Date(input.slot.startUtc);
  const end = new Date(start.getTime() + Math.max(input.itinerary.totalMins, input.slot.durationMins) * 6e4);
  const uid = `${input.slot.id}-${input.hub.hubKey}@ripple.local`;
  const esc = (s) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ripple//Hangout//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stampUtc((/* @__PURE__ */ new Date(0)).toISOString())}`,
    `DTSTART:${stampUtc(start.toISOString())}`,
    `DTEND:${stampUtc(end.toISOString())}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(summary)}`,
    `LOCATION:${esc(input.hub.name + ", Sydney NSW")}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

// src/banksia/accountability.ts
var DEFAULT_CHORE_CONFIG = {
  tasksRequired: 4,
  finePerMissedTaskCents: 500
};
function settleWeek(args) {
  const { weekOf, participantIds, claims, config } = args;
  const validTaskIds = new Set(config.tasks.map((t) => t.id));
  return participantIds.map((participantId) => {
    const mine = claims.filter(
      (c) => c.participantId === participantId && c.weekOf === weekOf && validTaskIds.has(c.taskId)
    );
    const byTask = /* @__PURE__ */ new Map();
    for (const c of mine) {
      const alreadyChallenged = byTask.get(c.taskId) ?? false;
      byTask.set(c.taskId, alreadyChallenged || Boolean(c.challengedBy?.length));
    }
    let completed = 0;
    let challenged = 0;
    for (const isChallenged of byTask.values()) {
      if (isChallenged)
        challenged++;
      else
        completed++;
    }
    const shortfall = Math.max(0, config.tasksRequired - completed);
    const fineCents = shortfall * config.finePerMissedTaskCents;
    return {
      participantId,
      weekOf,
      completed,
      challenged,
      required: config.tasksRequired,
      shortfall,
      fineCents,
      state: fineCents > 0 ? "pending" : "waived",
      note: buildNote(completed, config.tasksRequired, challenged, shortfall)
    };
  });
}
function buildNote(completed, required, challenged, shortfall) {
  if (shortfall === 0)
    return `${completed}/${required} done. Clear.`;
  const base = `${completed}/${required} done, ${shortfall} short.`;
  return challenged > 0 ? `${base} ${challenged} claim(s) challenged and not counted pending the meeting.` : base;
}
function resolveDisputes(args) {
  const present = new Set(args.presentAtMeeting);
  return args.settlements.map((s) => {
    if (s.fineCents === 0) {
      return { ...s, heard: false, outcomeNote: "Nothing owed." };
    }
    const dispute = args.disputes.find(
      (d) => d.participantId === s.participantId && d.weekOf === s.weekOf
    );
    if (!dispute) {
      return {
        ...s,
        state: "upheld",
        heard: false,
        outcomeNote: "Not disputed, so it stands. No one had to chase it."
      };
    }
    if (!present.has(s.participantId)) {
      return {
        ...s,
        state: "upheld",
        heard: false,
        outcomeNote: "Disputed, but the disputant was not at the meeting. Forfeited \u2014 you have to be there to argue it."
      };
    }
    return {
      ...s,
      state: "disputed",
      heard: true,
      outcomeNote: `Heard at the meeting: "${dispute.argument}" \u2014 house to vote.`
    };
  });
}
function resolveIssue(issue, responses, participantIds, now) {
  const mine = responses.filter((r) => r.issueId === issue.id);
  const latest = /* @__PURE__ */ new Map();
  for (const r of mine.sort((a, b) => a.at.localeCompare(b.at))) {
    latest.set(r.participantId, r.answer);
  }
  const owners = participantIds.filter((p) => latest.get(p) === "was-me");
  const denied = participantIds.filter((p) => latest.get(p) === "not-me");
  const closed = now >= issue.closesAt;
  const silent = closed ? participantIds.filter((p) => !latest.has(p) && p !== issue.raisedBy) : [];
  if (owners.length === 1) {
    return {
      issueId: issue.id,
      status: "owned",
      owners,
      denied,
      silent,
      summary: `${owners[0]} owned it. Closed, no meeting time needed.`,
      escalate: false
    };
  }
  if (owners.length > 1) {
    return {
      issueId: issue.id,
      status: "shared",
      owners,
      denied,
      silent,
      summary: `${owners.join(" and ")} both owned it. Closed.`,
      escalate: false
    };
  }
  if (!closed) {
    return {
      issueId: issue.id,
      status: "unresolved-silence",
      owners: [],
      denied,
      silent: [],
      summary: `Still open. ${denied.length} said not me, ${participantIds.length - denied.length - 1} yet to answer.`,
      escalate: false
    };
  }
  if (silent.length > 0) {
    return {
      issueId: issue.id,
      status: "unresolved-silence",
      owners: [],
      denied,
      silent,
      summary: `Nobody owned this. Everyone answered except: ${silent.join(", ")}. Going on the agenda.`,
      escalate: true
    };
  }
  return {
    issueId: issue.id,
    status: "no-owner",
    owners: [],
    denied,
    silent: [],
    summary: 'Everyone answered "not me". Going on the agenda as unresolved.',
    escalate: true
  };
}
function describeIssueOutcome(outcome, nameOf) {
  const names = (ids) => ids.map(nameOf);
  switch (outcome.status) {
    case "owned":
      return `${nameOf(outcome.owners[0])} owned it. Closed, no meeting time needed.`;
    case "shared": {
      const owners = names(outcome.owners);
      const last = owners.pop();
      return `${owners.join(", ")} and ${last} both owned it. Closed.`;
    }
    case "no-owner":
      return 'Everyone answered "not me". Going on the agenda as unresolved.';
    case "unresolved-silence":
      if (outcome.silent.length === 0) {
        const waiting = outcome.denied.length;
        return `Still open. ${waiting} said not me.`;
      }
      return `Nobody owned this. Everyone answered except: ${names(outcome.silent).join(", ")}. Going on the agenda.`;
  }
}
function offenderTable(args) {
  return args.participantIds.map((participantId) => {
    const ownedIssues = args.outcomes.filter((o) => o.owners.includes(participantId)).length;
    const unresolvedNearMisses = args.outcomes.filter((o) => o.escalate && o.silent.includes(participantId)).length;
    const upheld = args.settlements.filter((s) => s.participantId === participantId && s.state === "upheld");
    const finesOwedCents = upheld.reduce((sum, s) => sum + s.fineCents, 0);
    const meetingsMissed = args.meetingsMissed[participantId] ?? 0;
    return {
      participantId,
      ownedIssues,
      unresolvedNearMisses,
      upheldFines: upheld.length,
      finesOwedCents,
      meetingsMissed,
      score: ownedIssues * 3 + unresolvedNearMisses * 2 + upheld.length * 2 + meetingsMissed
    };
  }).sort((a, b) => b.score - a.score);
}
function buildAgenda(args) {
  const items = [];
  const { nameOf } = args;
  for (const s of args.settlements.filter((x) => x.state === "disputed")) {
    items.push({
      kind: "dispute",
      title: `${nameOf(s.participantId)} is contesting a ${formatMoney(s.fineCents)} fine`,
      detail: s.outcomeNote,
      concerns: [s.participantId]
    });
  }
  for (const o of args.outcomes.filter((x) => x.escalate)) {
    items.push({
      kind: "unresolved-issue",
      title: "Unowned issue",
      detail: o.summary,
      concerns: o.silent
    });
  }
  const repeat = args.offenders.filter((o) => o.score >= 5);
  for (const o of repeat) {
    items.push({
      kind: "repeat-offender",
      title: `Recurring: ${nameOf(o.participantId)}`,
      detail: `${o.ownedIssues} owned issue(s), ${o.upheldFines} upheld fine(s), ${o.meetingsMissed} meeting(s) missed, ${formatMoney(o.finesOwedCents)} outstanding.`,
      concerns: [o.participantId]
    });
  }
  const owed = args.settlements.filter((s) => s.state === "upheld" && s.fineCents > 0);
  if (owed.length) {
    items.push({
      kind: "ledger",
      title: "Ledger",
      detail: owed.map((s) => `${nameOf(s.participantId)}: ${formatMoney(s.fineCents)} (${s.note})`).join(" \xB7 "),
      concerns: owed.map((s) => s.participantId)
    });
  }
  return items;
}
function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
export {
  ACTIVITIES,
  ACTIVITY_BY_ID,
  DEFAULT_CHORE_CONFIG,
  DEFAULT_CONFIG,
  DEFAULT_HANGOUT_CONFIG,
  SUBURBS,
  buildAgenda,
  buildBrief,
  buildItinerary,
  centroid,
  collidesWithStandingConflict,
  describeIssueOutcome,
  estimateTravelMinutes,
  evaluateRefix,
  formatMoney,
  formatSlot,
  generateGrid,
  groupCentroid,
  haversineKm,
  localParts,
  mergeRippleEvents,
  offenderTable,
  patternKey,
  patternLabel,
  rankActivities,
  rankHubs,
  recommendAnchor,
  renderChatMessage,
  resolveDisputes,
  resolveIssue,
  schedulingWeight,
  scorePlan,
  scoreSlots,
  settleWeek
};
