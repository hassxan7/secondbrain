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
  const { participants: participants2, responses, slots } = input;
  const ranked = slots.map((slot) => scoreOneSlot(slot, participants2, responses, cfg)).sort(compareSlotScores);
  const nonResponders = participants2.filter((p) => Object.keys(responses[p.id] ?? {}).length === 0).map((p) => p.id);
  return {
    ranked,
    recommendation: recommend(ranked, cfg),
    nonResponders
  };
}
function scoreOneSlot(slot, participants2, responses, cfg) {
  const attendees = [];
  const ifNeeded = [];
  const absent = [];
  const unknown = [];
  const blockedBy = [];
  const conflicts = [];
  const reasons = [];
  let score = 0;
  for (const p of participants2) {
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
  const { participants: participants2, responses } = input;
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
  const ranked = [...groups.values()].map(({ pattern, slots }) => scorePattern(pattern, slots, participants2, responses, cfg)).sort((a, b) => b.score - a.score || b.expectedHeads - a.expectedHeads);
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
      rationale: `${best.label} is the strongest standing slot (${best.expectedHeads.toFixed(1)} of ${participants2.length} in a typical week).`
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
function scorePattern(pattern, slots, participants2, responses, cfg) {
  const conflicts = [];
  const wouldExclude = [];
  const unknown = [];
  const reasons = [];
  let score = 0;
  let expectedHeads = 0;
  let blocked = false;
  for (const p of participants2) {
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
    emoji: "\u{1F37D}\uFE0F",
    estCostAud: 28,
    durationMins: 90,
    category: "food",
    placesQuery: "casual restaurant",
    timeOfDay: "any",
    sequenceRank: 1,
    tags: ["food", "chill", "always-works"]
  },
  {
    id: "ramen",
    label: "Ramen",
    emoji: "\u{1F35C}",
    estCostAud: 24,
    durationMins: 75,
    category: "food",
    placesQuery: "ramen",
    timeOfDay: "any",
    sequenceRank: 1,
    tags: ["food", "cheap"]
  },
  {
    id: "pizza",
    label: "Pizza",
    emoji: "\u{1F355}",
    estCostAud: 25,
    durationMins: 90,
    category: "food",
    placesQuery: "pizza restaurant",
    timeOfDay: "any",
    sequenceRank: 1,
    tags: ["food", "group"]
  },
  {
    id: "thai",
    label: "Thai",
    emoji: "\u{1F35B}",
    estCostAud: 28,
    durationMins: 90,
    category: "food",
    placesQuery: "thai restaurant",
    timeOfDay: "any",
    sequenceRank: 1,
    tags: ["food", "group"]
  },
  {
    id: "korean-bbq",
    label: "Korean BBQ",
    emoji: "\u{1F969}",
    estCostAud: 48,
    durationMins: 120,
    category: "food",
    placesQuery: "korean bbq",
    timeOfDay: "night",
    sequenceRank: 1,
    tags: ["food", "group", "occasion"]
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
    id: "yochi",
    label: "Yochi",
    emoji: "\u{1F366}",
    estCostAud: 12,
    durationMins: 40,
    category: "dessert",
    placesQuery: "Yochi frozen yogurt",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["dessert", "cheap", "always-works"]
  },
  {
    id: "gelato",
    label: "Gelato",
    emoji: "\u{1F368}",
    estCostAud: 10,
    durationMins: 40,
    category: "dessert",
    placesQuery: "gelato",
    timeOfDay: "any",
    sequenceRank: 2,
    tags: ["dessert", "cheap"]
  },
  {
    id: "dessert-bar",
    label: "Dessert bar",
    emoji: "\u{1F370}",
    estCostAud: 20,
    durationMins: 60,
    category: "dessert",
    placesQuery: "dessert bar",
    timeOfDay: "night",
    sequenceRank: 2,
    tags: ["dessert"]
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

// src/ripple/suggestions.ts
function openBallots(catalogue, now) {
  return catalogue.map((activity) => ({
    activityId: activity.id,
    seen: [],
    approvals: [],
    origin: { kind: "catalogue" },
    addedAt: now
  }));
}
function recordAnswers(ballots, memberId, shown, approved) {
  const shownSet = new Set(shown);
  const approvedSet = new Set(approved.filter((id) => shownSet.has(id)));
  return ballots.map((ballot) => {
    if (!shownSet.has(ballot.activityId))
      return ballot;
    const seen = ballot.seen.includes(memberId) ? ballot.seen : [...ballot.seen, memberId];
    const wants = approvedSet.has(ballot.activityId);
    const approvals = wants ? ballot.approvals.includes(memberId) ? ballot.approvals : [...ballot.approvals, memberId] : ballot.approvals.filter((id) => id !== memberId);
    return { ...ballot, seen, approvals };
  });
}
function addSuggestion(ballots, activity, by, now, origin) {
  if (ballots.some((b) => b.activityId === activity.id)) {
    return recordAnswers(ballots, by, [activity.id], [activity.id]);
  }
  return [...ballots, {
    activityId: activity.id,
    seen: [by],
    approvals: [by],
    origin: origin ?? { kind: "suggested", by },
    addedAt: now
  }];
}
function pendingAsksFor(ballots, memberId, catalogue) {
  const hasStarted = ballots.some((b) => b.seen.includes(memberId));
  if (!hasStarted)
    return [];
  return ballots.filter((b) => !b.seen.includes(memberId)).map((b) => catalogue.get(b.activityId)).filter((a) => Boolean(a));
}
function participants(ballots) {
  const ids = /* @__PURE__ */ new Set();
  for (const ballot of ballots)
    for (const id of ballot.seen)
      ids.add(id);
  return [...ids];
}
function outstandingAsks(ballots, catalogue) {
  return participants(ballots).map((memberId) => ({ memberId, activities: pendingAsksFor(ballots, memberId, catalogue) })).filter((row) => row.activities.length > 0);
}
function rankBallots(ballots, catalogue, attendees, options = {}) {
  const pricedOutPenalty = options.pricedOutPenalty ?? 1.5;
  const coverageThreshold = options.coverageThreshold ?? 1;
  const everyone = participants(ballots);
  const attendeeIds = new Set(attendees.map((m) => m.id));
  return ballots.map((ballot) => {
    const activity = catalogue.get(ballot.activityId);
    if (!activity)
      return null;
    const seen = ballot.seen.filter((id) => attendeeIds.has(id));
    const approvals = ballot.approvals.filter((id) => attendeeIds.has(id));
    const relevant = everyone.filter((id) => attendeeIds.has(id));
    const pending = relevant.filter((id) => !seen.includes(id));
    const coverage = relevant.length === 0 ? 0 : seen.length / relevant.length;
    const pricedOut = attendees.filter((m) => m.budgetAud < activity.estCostAud).map((m) => m.id);
    const eligible = coverage >= coverageThreshold;
    const score = approvals.length - pricedOutPenalty * pricedOut.length;
    const reasons = [];
    if (!eligible) {
      reasons.push(pending.length === 1 ? `waiting on 1 person to see it` : `waiting on ${pending.length} people to see it`);
    }
    if (pricedOut.length > 0) {
      reasons.push(`over budget for ${pricedOut.length} ${pricedOut.length === 1 ? "person" : "people"}`);
    }
    if (ballot.origin.kind === "suggested")
      reasons.push("suggested mid-plan");
    if (ballot.origin.kind === "link")
      reasons.push(`added from ${ballot.origin.platform}`);
    if (activity.rippleEvent)
      reasons.push("curated Ripple event");
    return {
      activity,
      approvals,
      seen,
      pending,
      coverage: Math.round(coverage * 100) / 100,
      pricedOut,
      eligible,
      origin: ballot.origin,
      score: Math.round(score * 1e3) / 1e3,
      reasons
    };
  }).filter((o) => o !== null).sort((a, b) => {
    if (a.eligible !== b.eligible)
      return a.eligible ? -1 : 1;
    if (a.score !== b.score)
      return b.score - a.score;
    if (a.approvals.length !== b.approvals.length)
      return b.approvals.length - a.approvals.length;
    if (a.activity.estCostAud !== b.activity.estCostAud) {
      return a.activity.estCostAud - b.activity.estCostAud;
    }
    return a.activity.id.localeCompare(b.activity.id);
  });
}

// src/ripple/event-links.ts
var RULES = [
  {
    platform: "luma",
    hosts: ["lu.ma", "www.lu.ma", "luma.com", "www.luma.com"],
    // lu.ma/abc123, and luma.com/e/abc123
    extract: (p) => {
      const m = p.match(/^\/(?:e\/)?([A-Za-z0-9-]{3,64})\/?$/);
      return m ? m[1] : null;
    }
  },
  {
    platform: "partiful",
    hosts: ["partiful.com", "www.partiful.com"],
    extract: (p) => {
      const m = p.match(/^\/e\/([A-Za-z0-9_-]{3,64})\/?$/);
      return m ? m[1] : null;
    }
  },
  {
    platform: "eventbrite",
    hosts: [
      "eventbrite.com",
      "www.eventbrite.com",
      "eventbrite.com.au",
      "www.eventbrite.com.au"
    ],
    // .../some-event-title-tickets-1234567890
    extract: (p) => {
      const m = p.match(/-(\d{8,20})\/?$/);
      return m ? m[1] : null;
    }
  },
  {
    platform: "humanitix",
    hosts: ["humanitix.com", "www.humanitix.com", "events.humanitix.com"],
    extract: (p) => {
      const m = p.match(/^\/([A-Za-z0-9-]{3,120})\/?$/);
      return m ? m[1] : null;
    }
  },
  {
    platform: "meetup",
    hosts: ["meetup.com", "www.meetup.com"],
    extract: (p) => {
      const m = p.match(/^\/[^/]+\/events\/(\d{6,20})\/?$/);
      return m ? m[1] : null;
    }
  }
];
var STRIP_PARAMS = /^(utm_|fbclid|gclid|igshid|ref|source|mc_|_ga)/i;
function parseEventUrl(raw) {
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:")
    return null;
  const host = url.hostname.toLowerCase();
  const rule = RULES.find((r) => r.hosts.includes(host));
  if (!rule)
    return null;
  const sourceId = rule.extract(url.pathname);
  if (!sourceId)
    return null;
  const canonical = new URL(`https://${host}${url.pathname.replace(/\/$/, "")}`);
  for (const [key, value] of url.searchParams) {
    if (!STRIP_PARAMS.test(key))
      canonical.searchParams.set(key, value);
  }
  return { platform: rule.platform, sourceId, canonicalUrl: canonical.toString() };
}
var OG = /<meta[^>]+(?:property|name)=["'](og:[a-z:]+|description)["'][^>]+content=["']([^"']*)["'][^>]*>/gi;
var OG_REVERSED = /<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["'](og:[a-z:]+|description)["'][^>]*>/gi;
async function fetchEventMeta(parsed, fetchImpl = fetch) {
  try {
    const res = await fetchImpl(parsed.canonicalUrl, {
      headers: { accept: "text/html" },
      redirect: "follow"
    });
    if (!res.ok)
      return {};
    const html = (await res.text()).slice(0, 2e5);
    const found = {};
    for (const re of [OG, OG_REVERSED]) {
      re.lastIndex = 0;
      for (const m of html.matchAll(re)) {
        const [key, value] = re === OG ? [m[1], m[2]] : [m[2], m[1]];
        if (!found[key])
          found[key] = decodeEntities(value);
      }
    }
    const meta = {};
    const title = found["og:title"];
    const description = found["og:description"] ?? found.description;
    const imageUrl = found["og:image"];
    const startsAt = found["og:start_time"] ?? found["event:start_time"];
    if (title)
      meta.title = title;
    if (description)
      meta.description = description;
    if (imageUrl)
      meta.imageUrl = imageUrl;
    if (startsAt)
      meta.startsAt = startsAt;
    return meta;
  } catch {
    return {};
  }
}
function decodeEntities(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}
var PLATFORM_LABEL = {
  luma: "Luma",
  partiful: "Partiful",
  eventbrite: "Eventbrite",
  humanitix: "Humanitix",
  meetup: "Meetup"
};
function platformLabel(platform) {
  return PLATFORM_LABEL[platform];
}
function toActivity(parsed, meta, fallbackCostAud) {
  const title = (meta.title ?? "").trim();
  return {
    id: `link-${parsed.platform}-${parsed.sourceId}`,
    label: title.length > 0 ? truncate(title, 42) : `${platformLabel(parsed.platform)} event`,
    emoji: "\u{1F39F}\uFE0F",
    estCostAud: Math.max(0, Math.round(fallbackCostAud)),
    durationMins: 150,
    category: "culture",
    placesQuery: "",
    timeOfDay: "night",
    sequenceRank: 3,
    tags: ["link", parsed.platform],
    rippleEvent: false
  };
}
function truncate(s, max) {
  return s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}\u2026`;
}
function toDirectorySubmission(parsed, meta, submittedBy) {
  return {
    platform: parsed.platform,
    sourceId: parsed.sourceId,
    canonicalUrl: parsed.canonicalUrl,
    title: (meta.title ?? `${platformLabel(parsed.platform)} event`).trim(),
    imageUrl: meta.imageUrl,
    submittedBy,
    status: "pending_review"
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

// src/banksia/pot.ts
var DEFAULT_POT_CONFIG = {
  buyInCents: 4e3,
  // $40 stake
  finePerMissedTaskCents: 500,
  // $5 per task short — see recommendPot() on $100
  distribution: "split-clean"
};
function openPot(memberIds, config) {
  return memberIds.map((memberId) => ({
    memberId,
    openingCents: config.buyInCents,
    finedCents: 0
  }));
}
function applyWeekFines(stakes, finesByMember) {
  return stakes.map((stake) => {
    const fine = Math.max(0, finesByMember[stake.memberId] ?? 0);
    return { ...stake, finedCents: stake.finedCents + fine };
  });
}
function potState(stakes) {
  const states = stakes.map((stake) => {
    const capped = Math.min(stake.finedCents, stake.openingCents);
    const overflowCents = Math.max(0, stake.finedCents - stake.openingCents);
    return {
      ...stake,
      remainingCents: stake.openingCents - capped,
      overflowCents,
      clean: stake.finedCents === 0,
      exhausted: stake.finedCents >= stake.openingCents
    };
  });
  return {
    totalCents: stakes.reduce((sum, s) => sum + s.openingCents, 0),
    stakes: states,
    surplusCents: states.reduce((sum, s) => sum + (s.openingCents - s.remainingCents), 0),
    overflows: states.filter((s) => s.overflowCents > 0).map((s) => ({ memberId: s.memberId, overflowCents: s.overflowCents }))
  };
}
function distributePot(stakes, config) {
  const state = potState(stakes);
  const clean = state.stakes.filter((s) => s.clean);
  const base = state.stakes.map((s) => ({
    memberId: s.memberId,
    stakeBackCents: s.remainingCents,
    bonusCents: 0,
    totalCents: s.remainingCents,
    owesCents: s.overflowCents
  }));
  const money2 = (cents) => `$${(cents / 100).toFixed(2)}`;
  if (config.distribution === "split-clean" && clean.length > 0 && state.surplusCents > 0) {
    const share = Math.floor(state.surplusCents / clean.length);
    const remainder = state.surplusCents - share * clean.length;
    const cleanIds = new Set(clean.map((s) => s.memberId));
    let first = true;
    for (const payout of base) {
      if (!cleanIds.has(payout.memberId))
        continue;
      payout.bonusCents = share + (first ? remainder : 0);
      payout.totalCents = payout.stakeBackCents + payout.bonusCents;
      first = false;
    }
    return {
      payouts: base,
      houseFundCents: 0,
      rolloverCents: 0,
      summary: `${money2(state.surplusCents)} in fines split among ${clean.length} clean ${clean.length === 1 ? "housemate" : "housemates"} \u2014 ${money2(share)} each.`
    };
  }
  if (config.distribution === "house-fund") {
    return {
      payouts: base,
      houseFundCents: state.surplusCents,
      rolloverCents: 0,
      summary: `${money2(state.surplusCents)} of fines into the house fund.`
    };
  }
  if (config.distribution === "roll-over") {
    return {
      payouts: base,
      houseFundCents: 0,
      rolloverCents: state.surplusCents,
      summary: `${money2(state.surplusCents)} of fines rolled into next period.`
    };
  }
  return {
    payouts: base,
    houseFundCents: state.surplusCents,
    rolloverCents: 0,
    summary: state.surplusCents > 0 ? `Nobody finished clean \u2014 ${money2(state.surplusCents)} to the house fund.` : "Everyone clean. Full stakes back, no fines."
  };
}
function recommendPot(config, tasksRequired = 4) {
  const worstWeeklyFine = config.finePerMissedTaskCents * tasksRequired;
  const weeks = worstWeeklyFine > 0 ? Math.floor(config.buyInCents / worstWeeklyFine) : Infinity;
  const money2 = (cents) => `$${(cents / 100).toFixed(0)}`;
  if (weeks >= 3) {
    return {
      weeksOfRunway: weeks,
      ok: true,
      note: `A ${money2(config.buyInCents)} stake absorbs ${weeks} bad weeks before it's gone. Healthy.`
    };
  }
  if (weeks >= 1) {
    return {
      weeksOfRunway: weeks,
      ok: true,
      note: `A bad week costs up to ${money2(worstWeeklyFine)}, so the ${money2(config.buyInCents)} stake lasts about ${weeks} of them. Steep but workable \u2014 expect top-ups.`
    };
  }
  return {
    weeksOfRunway: 0,
    ok: false,
    note: `A single bad week (${money2(worstWeeklyFine)}) wipes the ${money2(config.buyInCents)} stake, so the pot can't enforce past week one. Either raise the buy-in or lower the fine \u2014 a $100 fine wants a stake nearer ${money2(worstWeeklyFine * 3)}.`
  };
}

// src/banksia/anonymous.ts
var DEFAULT_ANON_CONFIG = {
  minWeightForAgenda: 2,
  coolingHours: 24,
  maxNoteLength: 240
};
var ISSUE_AREAS = [
  { id: "kitchen", label: "Kitchen & dishes" },
  { id: "bathroom", label: "Bathroom" },
  { id: "common", label: "Common areas" },
  { id: "bins", label: "Bins & recycling" },
  { id: "noise", label: "Noise & sleep" },
  { id: "guests", label: "Guests & overnight" },
  { id: "bills", label: "Bills & shared costs" },
  { id: "other", label: "Something else" }
];
var AREA_LABEL = new Map(ISSUE_AREAS.map((a) => [a.id, a.label]));
function softenNote(note, houseNames, config = DEFAULT_ANON_CONFIG) {
  let out = note.trim();
  for (const name of houseNames) {
    if (!name)
      continue;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "someone");
  }
  const letters = out.replace(/[^a-z]/gi, "");
  if (letters.length > 6 && letters === letters.toUpperCase()) {
    out = out.toLowerCase();
    out = out.charAt(0).toUpperCase() + out.slice(1);
  }
  out = out.replace(/([!?.])\1{1,}/g, "$1");
  if (out.length > config.maxNoteLength) {
    out = `${out.slice(0, config.maxNoteLength - 1).trimEnd()}\u2026`;
  }
  return out;
}
function raiseAnonymous(issues, input) {
  const trimmedNote = input.note?.trim() || void 0;
  const existing = issues.find((i) => i.area === input.area);
  const contribution = {
    author: input.author,
    note: trimmedNote,
    at: input.now
  };
  if (!existing) {
    return [...issues, {
      id: `anon-${input.area}-${input.now.slice(0, 10)}`,
      area: input.area,
      contributions: [contribution],
      createdAt: input.now
    }];
  }
  return issues.map((issue) => {
    if (issue !== existing)
      return issue;
    const others = issue.contributions.filter((c) => c.author !== input.author);
    return { ...issue, contributions: [...others, contribution] };
  });
}
function weightOf(issue) {
  return new Set(issue.contributions.map((c) => c.author)).size;
}
function resolveAnonymous(issue, houseNames, now, config = DEFAULT_ANON_CONFIG) {
  const weight = weightOf(issue);
  const label = AREA_LABEL.get(issue.area) ?? "Something else";
  const ageHours = (Date.parse(now) - Date.parse(issue.createdAt)) / 36e5;
  const isConsensus = weight >= config.minWeightForAgenda;
  const cooled = ageHours >= config.coolingHours;
  const onAgenda = isConsensus || cooled;
  const notes = issue.contributions.map((c) => c.note).filter((n) => Boolean(n)).map((n) => softenNote(n, houseNames, config));
  let summary;
  if (isConsensus) {
    summary = `${weight} housemates quietly flagged ${label.toLowerCase()}. Worth a calm word as a house.`;
  } else if (onAgenda) {
    summary = `Someone raised ${label.toLowerCase()}. Not urgent \u2014 just worth airing.`;
  } else {
    const wait = Math.max(1, Math.ceil(config.coolingHours - ageHours));
    summary = `One quiet flag on ${label.toLowerCase()}. Held ${wait}h in case it's the heat of the moment; surfaces on its own, sooner if anyone else agrees.`;
  }
  return {
    id: issue.id,
    area: issue.area,
    areaLabel: label,
    weight,
    status: onAgenda ? "agenda" : "building",
    onAgenda,
    notes,
    summary
  };
}
function anonymousAgenda(issues, houseNames, now, config = DEFAULT_ANON_CONFIG) {
  return issues.map((issue) => resolveAnonymous(issue, houseNames, now, config)).filter((o) => o.onAgenda).sort((a, b) => b.weight - a.weight);
}

// src/banksia/board.ts
var DEFAULT_TASKS = [
  { id: "plants", label: "Water the plants", cap: 2 },
  { id: "dishes", label: "Unstack the dishes" },
  { id: "bins", label: "Take the bins out" },
  { id: "kitchen", label: "Clean the kitchen" },
  { id: "vacuum", label: "Vacuum everything" },
  { id: "sunday-bins", label: "Sunday bins out" },
  { id: "bathrooms", label: "Bathrooms" },
  { id: "bin-bags", label: "Large bin bags" }
];
function slugTask(label) {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  return slug || "task";
}
function matchTask(label, known) {
  const needle = fold(label);
  if (!needle)
    return null;
  const tiers = [
    (t) => fold(t.label) === needle,
    (t) => t.id === slugTask(label),
    (t) => needle.length >= 4 && (fold(t.label).includes(needle) || needle.includes(fold(t.label)))
  ];
  for (const test of tiers) {
    const hits = known.filter(test);
    if (hits.length === 1)
      return hits[0];
    if (hits.length > 1)
      return null;
  }
  return null;
}
function fold(s) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}
function withinOneEdit(a, b) {
  if (a === b)
    return true;
  if (Math.abs(a.length - b.length) > 1)
    return false;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1)
      return false;
    if (short.length === long.length) {
      i++;
      j++;
    } else {
      j++;
    }
  }
  return edits + (long.length - j) + (short.length - i) <= 1;
}
function matchName(raw, members) {
  const needle = fold(raw);
  if (!needle)
    return null;
  const tiers = [
    (m) => fold(m.name) === needle,
    (m) => fold(m.name.split(/\s+/)[0]) === needle,
    (m) => fold(m.name).startsWith(needle) && needle.length >= 3,
    (m) => withinOneEdit(fold(m.name.split(/\s+/)[0]), needle) && needle.length >= 3
  ];
  for (const test of tiers) {
    const hits = members.filter(test);
    if (hits.length === 1)
      return hits[0].id;
    if (hits.length > 1)
      return null;
  }
  return null;
}
function parseBoardPayload(payload, members, weekOf, knownTasks = DEFAULT_TASKS) {
  const rows = extractRows(payload);
  if (rows.length === 0)
    throw new Error("no rows found on that board");
  const tasks = [];
  const newTasks = [];
  const ticks = [];
  const unmatched = [];
  const seenTick = /* @__PURE__ */ new Set();
  for (const row of rows) {
    const label = row.task.replace(/\s+/g, " ").trim();
    if (!label)
      continue;
    const known = matchTask(label, knownTasks);
    const task = known ?? { id: slugTask(label), label, ...row.cap ? { cap: row.cap } : {} };
    if (!known)
      newTasks.push(task);
    if (!tasks.some((t) => t.id === task.id))
      tasks.push(task);
    for (const rawName of row.names) {
      const name = rawName.replace(/\s+/g, " ").trim();
      if (!name)
        continue;
      const memberId = matchName(name, members);
      if (!memberId) {
        unmatched.push({ name, task: label });
        continue;
      }
      const key = `${task.id}:${memberId}`;
      if (seenTick.has(key))
        continue;
      seenTick.add(key);
      ticks.push({ taskId: task.id, memberId });
    }
  }
  return { board: { weekOf, tasks, ticks }, unmatched, newTasks, ticksFound: ticks.length };
}
function extractRows(payload) {
  const source = Array.isArray(payload) ? payload : payload && typeof payload === "object" && Array.isArray(payload.rows) ? payload.rows : null;
  if (!source)
    throw new Error("expected an array of rows");
  const rows = [];
  for (const entry of source) {
    if (!entry || typeof entry !== "object")
      continue;
    const { task, names, cap } = entry;
    if (typeof task !== "string")
      continue;
    const list = Array.isArray(names) ? names.filter((n) => typeof n === "string") : [];
    rows.push({
      task,
      names: list,
      ...typeof cap === "number" && cap > 0 ? { cap: Math.floor(cap) } : {}
    });
  }
  return rows;
}
function mergeBoard(existing, imported) {
  if (existing.weekOf !== imported.weekOf) {
    throw new Error("refusing to merge boards from different weeks");
  }
  const has = (list, t) => list.some((x) => x.taskId === t.taskId && x.memberId === t.memberId);
  const added = imported.ticks.filter((t) => !has(existing.ticks, t));
  const keptDespiteAbsence = existing.ticks.filter((t) => !has(imported.ticks, t));
  const tasks = [...existing.tasks];
  for (const t of imported.tasks)
    if (!tasks.some((x) => x.id === t.id))
      tasks.push(t);
  return {
    board: { weekOf: existing.weekOf, tasks, ticks: [...existing.ticks, ...added] },
    added,
    keptDespiteAbsence
  };
}
function boardStanding(board, members, tasksRequired = 4) {
  const validTasks = new Set(board.tasks.map((t) => t.id));
  return members.map((m) => {
    const mine = new Set(
      board.ticks.filter((t) => t.memberId === m.id && validTasks.has(t.taskId)).map((t) => t.taskId)
    );
    const done = mine.size;
    return {
      memberId: m.id,
      name: m.name,
      done,
      required: tasksRequired,
      short: Math.max(0, tasksRequired - done),
      remaining: board.tasks.filter((t) => !mine.has(t.id)).map((t) => t.id)
    };
  });
}
function behind(standings) {
  return standings.filter((s) => s.short > 0).sort((a, b) => b.short - a.short || a.name.localeCompare(b.name));
}

// src/banksia/onboarding.ts
var DATA_USE = [
  {
    id: "reminders",
    label: "Reminders about chores and the house meeting",
    detail: "At most three messages a week, never between 9pm and 8am."
  },
  {
    id: "board",
    label: "Your name on the chore board",
    detail: "Everyone in the house sees who ticked what. That is the point of it."
  },
  {
    id: "scheduling",
    label: "Working out a meeting time that suits the house",
    detail: "Your weekly availability, and nothing else from your calendar."
  },
  {
    id: "not",
    label: "Not used for anything else",
    detail: "No ads, no third parties, no selling. Ask and it is deleted."
  }
];
var WEEKDAY_NAMES2 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function normaliseEmail(raw) {
  if (!raw)
    return null;
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed)
    return null;
  if (/\s/.test(trimmed))
    return null;
  const at = trimmed.indexOf("@");
  if (at <= 0 || at !== trimmed.lastIndexOf("@"))
    return null;
  const domain = trimmed.slice(at + 1);
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith("."))
    return null;
  return trimmed;
}
function normalisePhone(raw) {
  if (!raw)
    return null;
  const cleaned = raw.replace(/[\s()\-.]/g, "");
  if (!cleaned)
    return null;
  if (/^\+\d{8,15}$/.test(cleaned))
    return cleaned;
  if (/^0[45]\d{8}$/.test(cleaned))
    return `+61${cleaned.slice(1)}`;
  if (/^61[45]\d{8}$/.test(cleaned))
    return `+${cleaned}`;
  if (/^[45]\d{8}$/.test(cleaned))
    return `+61${cleaned}`;
  return null;
}
function normaliseName(raw) {
  if (!raw)
    return null;
  const trimmed = raw.replace(/\s+/g, " ").trim();
  if (trimmed.length < 2 || trimmed.length > 40)
    return null;
  return trimmed;
}
function validPattern(p) {
  if (!p || typeof p !== "object")
    return false;
  const { weekday, time } = p;
  return Number.isInteger(weekday) && weekday >= 0 && weekday <= 6 && typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}
function normaliseAvailability(raw) {
  if (!raw || typeof raw !== "object")
    return null;
  const { mode, slots } = raw;
  if (mode !== "fixed" && mode !== "varies" && mode !== "calendar")
    return null;
  const list = Array.isArray(slots) ? slots.filter(validPattern) : [];
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  for (const s of list) {
    const key = `${s.weekday}@${s.time}`;
    if (seen.has(key))
      continue;
    seen.add(key);
    unique.push({ weekday: s.weekday, time: s.time });
  }
  unique.sort((a, b) => a.weekday - b.weekday || a.time.localeCompare(b.time));
  if (mode !== "calendar" && unique.length === 0)
    return null;
  return { mode, slots: unique };
}
function impliedAnswer(availability, slot) {
  if (availability.mode === "calendar")
    return null;
  const matches = availability.slots.some(
    (s) => s.weekday === slot.weekday && s.time === slot.time
  );
  if (!matches)
    return null;
  return availability.mode === "fixed" ? "yes" : "ifneed";
}
function describeAvailability(availability) {
  if (availability.mode === "calendar") {
    return availability.slots.length > 0 ? `Calendar synced, plus ${availability.slots.length} time(s) picked by hand` : "Calendar synced \u2014 free/busy read at poll time";
  }
  const byDay = /* @__PURE__ */ new Map();
  for (const s of availability.slots) {
    const list = byDay.get(s.weekday) ?? [];
    list.push(s.time);
    byDay.set(s.weekday, list);
  }
  const parts = [...byDay.entries()].sort((a, b) => a[0] - b[0]).map(([weekday, times]) => `${WEEKDAY_NAMES2[weekday]} ${times.join(", ")}`);
  const suffix = availability.mode === "varies" ? " (not every week)" : "";
  return parts.join(" \xB7 ") + suffix;
}
function validateJoin(draft, existing = []) {
  const errors = [];
  const name = normaliseName(draft.name);
  if (!name)
    errors.push("Give a name between 2 and 40 characters.");
  const email = normaliseEmail(draft.email);
  const phone = normalisePhone(draft.phone);
  if (draft.email && !email)
    errors.push("That email address does not look right.");
  if (draft.phone && !phone)
    errors.push("That looks off \u2014 use a mobile like 0412 345 678.");
  if (!email && !phone)
    errors.push("One way to reach you: a mobile or an email.");
  const availability = normaliseAvailability(draft.availability);
  if (!availability) {
    errors.push("Pick at least one time you are usually free, or sync a calendar.");
  }
  if (!draft.acceptedDataUse)
    errors.push("Tick the box to say what this is used for.");
  if (errors.length > 0 || !name || !availability)
    return { ok: false, errors };
  const matched = existing.find(
    (m) => email && normaliseEmail(m.email) === email || phone && normalisePhone(m.phone) === phone
  );
  return {
    ok: true,
    errors: [],
    member: { name, email, phone, availability },
    matchedExisting: matched?.id
  };
}
function toParticipant(member, attendanceRate = 1) {
  return { id: member.id, name: member.name, attendanceRate };
}

// src/banksia/reminders.ts
var DEFAULT_REMINDER_CONFIG = {
  maxPerWeek: 3,
  quietEndMin: 8 * 60,
  quietStartMin: 21 * 60,
  tasksRequired: 4,
  stakeCents: 1e4
};
function pickChannel(target) {
  if (target.whatsapp)
    return "whatsapp";
  if (target.email)
    return "email";
  if (target.phone)
    return "sms";
  return null;
}
function withinSendingHours(minuteOfDay, config) {
  return minuteOfDay >= config.quietEndMin && minuteOfDay < config.quietStartMin;
}
function money(cents) {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}
function dueReminders(input) {
  const config = { ...DEFAULT_REMINDER_CONFIG, ...input.config };
  if (!withinSendingHours(input.minuteOfDay, config))
    return [];
  const byId = new Map(input.targets.map((t) => [t.memberId, t]));
  const standingOf = new Map(input.standings.map((s) => [s.memberId, s]));
  const candidates = [];
  const push = (memberId, kind, subject, body, suffix = "") => {
    const target = byId.get(memberId);
    if (!target)
      return;
    const channel = pickChannel(target);
    if (!channel)
      return;
    candidates.push({
      id: `${kind}:${memberId}:${input.weekOf}${suffix}`,
      memberId,
      kind,
      channel,
      subject,
      body
    });
  };
  if (input.meetingTomorrow) {
    for (const memberId of input.meetingTomorrow.attendees) {
      const name = byId.get(memberId)?.name ?? "there";
      push(
        memberId,
        "meeting-tomorrow",
        "House meeting tomorrow",
        `${name} \u2014 house meeting ${input.meetingTomorrow.label}. You said you were free. Anything to raise, add it before then.`
      );
    }
  }
  for (const issue of input.openIssues ?? []) {
    for (const memberId of issue.awaiting) {
      push(
        memberId,
        "issue-poll",
        "Was this you?",
        `${issue.description}

Reply "was me" or "not me". Not answering counts as not answering \u2014 it does not count as no.`,
        `:${issue.id}`
      );
    }
  }
  for (const memberId of input.awaitingPoll ?? []) {
    push(
      memberId,
      "meeting-poll",
      "Two taps: when are you free?",
      "The house is picking a meeting time and you are the one it is waiting on. Silence scores as unavailable, so the time gets picked around you."
    );
  }
  const lastCall = input.weekday === 0;
  const nudgeDay = input.weekday === 4;
  if (lastCall || nudgeDay) {
    for (const target of input.targets) {
      const standing = standingOf.get(target.memberId);
      if (!standing || standing.short === 0)
        continue;
      if (lastCall) {
        push(
          target.memberId,
          "chore-last-call",
          "Week closes tonight",
          `${standing.done}/${standing.required} done \u2014 ${standing.short} short. The week settles at midnight and ${money(config.stakeCents)} of your stake is on it. Anything ticked before then counts.`
        );
      } else {
        push(
          target.memberId,
          "chore-nudge",
          `${standing.short} to go`,
          `${standing.done}/${standing.required} on the board, three days left. Quickest ones still open: ` + standing.remaining.slice(0, 3).join(", ") + "."
        );
      }
    }
  }
  const spent = { ...input.sentThisWeek ?? {} };
  const out = [];
  for (const reminder of candidates) {
    const used = spent[reminder.memberId] ?? 0;
    if (used >= config.maxPerWeek)
      continue;
    spent[reminder.memberId] = used + 1;
    out.push(reminder);
  }
  return out;
}
function reminderPolicy(config = DEFAULT_REMINDER_CONFIG) {
  return [
    `At most ${config.maxPerWeek} messages a week.`,
    "Nothing between 9pm and 8am.",
    "Never about something you have already done.",
    "One chore nudge on Thursday, one on Sunday if you are still short. That is it."
  ];
}
export {
  ACTIVITIES,
  ACTIVITY_BY_ID,
  DATA_USE,
  DEFAULT_ANON_CONFIG,
  DEFAULT_CHORE_CONFIG,
  DEFAULT_CONFIG,
  DEFAULT_HANGOUT_CONFIG,
  DEFAULT_POT_CONFIG,
  DEFAULT_REMINDER_CONFIG,
  DEFAULT_TASKS,
  ISSUE_AREAS,
  SUBURBS,
  addSuggestion,
  anonymousAgenda,
  applyWeekFines,
  behind,
  boardStanding,
  buildAgenda,
  buildBrief,
  buildItinerary,
  centroid,
  collidesWithStandingConflict,
  describeAvailability,
  describeIssueOutcome,
  distributePot,
  dueReminders,
  estimateTravelMinutes,
  evaluateRefix,
  fetchEventMeta,
  formatMoney,
  formatSlot,
  generateGrid,
  groupCentroid,
  haversineKm,
  impliedAnswer,
  toActivity as linkToActivity,
  localParts,
  matchName,
  matchTask,
  mergeBoard,
  mergeRippleEvents,
  normaliseAvailability,
  normaliseEmail,
  normaliseName,
  normalisePhone,
  offenderTable,
  openBallots,
  openPot,
  outstandingAsks,
  parseBoardPayload,
  parseEventUrl,
  participants,
  patternKey,
  patternLabel,
  pendingAsksFor,
  pickChannel,
  platformLabel,
  potState,
  raiseAnonymous,
  rankActivities,
  rankBallots,
  rankHubs,
  recommendAnchor,
  recommendPot,
  recordAnswers,
  reminderPolicy,
  renderChatMessage,
  resolveAnonymous,
  resolveDisputes,
  resolveIssue,
  schedulingWeight,
  scorePlan,
  scoreSlots,
  settleWeek,
  slugTask,
  softenNote,
  toDirectorySubmission,
  toParticipant,
  validateJoin,
  weightOf,
  withinSendingHours
};
