/**
 * Ripple plan builder.
 *
 * Imports the same engine bundle the Worker runs (web/shared/engine.js), so the
 * prototype decides what the product would decide rather than approximating it.
 *
 * Two flows off one welcome screen:
 *   guest  someone sent you a link — answer, see the plan, add it to a calendar
 *   host   you're making the plan — add people, seed options, send, then chase
 *
 * Screens are addressed by name rather than index because the two flows are
 * different lengths and an index-based stepper silently mislabels one of them.
 */

import {
  generateGrid, formatSlot, scoreSlots, SUBURBS, rankHubs,
  mergeRippleEvents, ACTIVITY_BY_ID, buildItinerary, buildBrief, renderChatMessage,
  openBallots, recordAnswers, addSuggestion, rankBallots,
  parseEventUrl, linkToActivity, platformLabel,
} from '../shared/engine.js';

const TZ = 'Australia/Sydney';
const TIMES = ['14:00', '18:30', '21:00'];
const BAND_LABELS = ['Arvo', 'Dinner', 'Late'];

/* ── Demo cast ────────────────────────────────────────────────────────────── */

const DEMO_RIPPLE_EVENTS = [
  { id: 'rip-jazz', label: 'Warehouse jazz', emoji: '🎷', estCostAud: 30, durationMins: 180,
    category: 'nightlife', placesQuery: '', timeOfDay: 'night', sequenceRank: 4, tags: ['ripple'] },
  { id: 'rip-trivia', label: 'Ripple trivia', emoji: '🧠', estCostAud: 20, durationMins: 120,
    category: 'culture', placesQuery: '', timeOfDay: 'night', sequenceRank: 2, tags: ['ripple'] },
  { id: 'rip-picnic', label: 'Bouquet picnic', emoji: '💐', estCostAud: 25, durationMins: 150,
    category: 'outdoors', placesQuery: '', timeOfDay: 'day', sequenceRank: 1, tags: ['ripple'] },
];

const CATALOGUE = mergeRippleEvents(DEMO_RIPPLE_EVENTS);

const DEMO_FRIENDS = [
  { id: 'isaac', name: 'Isaac', suburb: 'newtown',        budgetAud: 60, approvals: ['eats-casual', 'pub', 'pool', 'rip-jazz', 'ramen'] },
  { id: 'kez',   name: 'Kez',   suburb: 'bondi-junction', budgetAud: 90, approvals: ['korean-bbq', 'cocktails', 'clubbing', 'rip-jazz', 'dessert-bar'] },
  { id: 'ross',  name: 'Ross',  suburb: 'marrickville',   budgetAud: 35, approvals: ['pub', 'pool', 'ramen', 'yochi', 'board-games'] },
  { id: 'eyong', name: 'Eyong', suburb: 'chatswood',      budgetAud: 55, approvals: ['bowling', 'pizza', 'karaoke', 'pool', 'yochi'] },
  { id: 'manan', name: 'Manan', suburb: 'ultimo',         budgetAud: 40, approvals: ['pool', 'ramen', 'rip-trivia', 'pub', 'yochi'] },
];

const slots = generateGrid({
  startDate: new Date().toISOString().slice(0, 10),
  days: 7, times: TIMES, durationMins: 180, timeZone: TZ,
});

function demoResponses() {
  const map = {};
  DEMO_FRIENDS.forEach((friend, personIndex) => {
    map[friend.id] = {};
    slots.forEach((slot, slotIndex) => {
      const seed = (personIndex * 7 + slotIndex * 3) % 10;
      const band = slotIndex % TIMES.length;
      map[friend.id][slot.id] = band === 0 ? (seed < 3 ? 'yes' : 'no')
        : seed < 5 ? 'yes' : seed < 7 ? 'ifneed' : 'no';
    });
  });
  return map;
}

/** Something a friend adds after you've answered, to show the delta-ask. */
const LATE_SUGGESTION = {
  id: 'ding-dong-karaoke', label: 'Karaoke at Ding Dong', emoji: '🎤',
  estCostAud: 28, durationMins: 120, category: 'games',
  placesQuery: 'karaoke', timeOfDay: 'night', sequenceRank: 2, tags: ['suggested'],
};

/* ── State ────────────────────────────────────────────────────────────────── */

const GUEST = ['welcome', 'name', 'suburb', 'budget', 'vibe', 'when', 'result', 'install'];
const HOST = ['welcome', 'host-what', 'host-who', 'host-options', 'host-send', 'host-track'];

const state = {
  screen: 'welcome',
  history: [],
  // guest
  name: '', suburb: '', budget: 50,
  ballots: null,
  extraActivities: new Map(),
  responses: {},
  suburbFilter: '',
  answeredOnce: false,
  lateAskShown: false,
  lateAskAnswer: null,
  // host
  planTitle: '', invitees: [], hostPicks: new Set(), sent: false,
};

function catalogueMap() {
  const map = new Map(CATALOGUE.map((a) => [a.id, a]));
  for (const [id, a] of state.extraActivities) map.set(id, a);
  return map;
}

function allActivities() {
  return [...CATALOGUE, ...state.extraActivities.values()];
}

/** Seed the ballots with the five friends' answers. */
function initBallots() {
  const ids = CATALOGUE.map((a) => a.id);
  let ballots = openBallots(CATALOGUE, new Date().toISOString());
  for (const friend of DEMO_FRIENDS) {
    ballots = recordAnswers(ballots, friend.id, ids, friend.approvals);
  }
  state.ballots = ballots;
}

/* ── DOM helpers ──────────────────────────────────────────────────────────── */

const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
};

function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.setAttribute('data-show', '');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.removeAttribute('data-show'), 2400);
}

/* ── Navigation ───────────────────────────────────────────────────────────── */

function go(name, { replace = false } = {}) {
  if (!replace && state.screen !== name) state.history.push(state.screen);
  state.screen = name;

  document.querySelectorAll('.screen').forEach((screen) => {
    screen.toggleAttribute('data-active', screen.id === `screen-${name}`);
  });

  render();
  updateChrome();
  const body = $(`#screen-${name} .screen-body`);
  if (body) body.scrollTop = 0;
}

function back() {
  const previous = state.history.pop();
  if (previous) go(previous, { replace: true });
}

function updateChrome() {
  const flow = HOST.includes(state.screen) && state.screen !== 'welcome' ? HOST : GUEST;
  const questions = flow.slice(1, flow.indexOf('result') > 0 ? flow.indexOf('result') : flow.length - 1);
  const index = questions.indexOf(state.screen);

  $('#step-count').textContent = index >= 0 ? `${index + 1} of ${questions.length}` : '';
  $('#progress-bar').style.width = index >= 0
    ? `${((index + 1) / questions.length) * 100}%` : '0%';
  $('.progress').toggleAttribute('data-hidden', index < 0);
}

/* ── Guest: suburb ────────────────────────────────────────────────────────── */

function renderSuburbs() {
  const list = $('#suburb-list');
  list.replaceChildren();
  const query = state.suburbFilter.trim().toLowerCase();
  const entries = Object.entries(SUBURBS)
    .filter(([, s]) => !query || s.name.toLowerCase().includes(query))
    .sort((a, b) => a[1].name.localeCompare(b[1].name));

  if (entries.length === 0) {
    list.appendChild(el('p', { class: 'sub', text: 'No suburb by that name yet.' }));
    return;
  }
  for (const [key, suburb] of entries) {
    list.appendChild(el('button', {
      class: 'suburb', type: 'button',
      'aria-pressed': String(state.suburb === key),
      onclick: (e) => {
        state.suburb = key;
        list.querySelectorAll('.suburb').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        e.currentTarget.setAttribute('aria-pressed', 'true');
        gate();
      },
    }, [
      el('span', { text: suburb.name }),
      suburb.hub ? el('span', { class: 'hub-tag', text: 'venues' }) : null,
    ]));
  }
}

/* ── Guest: budget ────────────────────────────────────────────────────────── */

const BUDGET_NOTES = [
  [0,   'Free only — beach, a walk, someone’s balcony. <b>Still a night out.</b>'],
  [20,  'Yochi, a game of pool, a bakery crawl. <b>Nobody gets priced out.</b>'],
  [40,  'Dinner plus one thing after. <b>The weeknight sweet spot.</b>'],
  [70,  'Dinner, drinks, and something with a door charge. <b>A proper Friday.</b>'],
  [110, 'Anything on the list, bathhouse included. <b>Big night.</b>'],
];

function renderBudget() {
  $('#budget-figure').textContent = `$${state.budget}`;
  const note = [...BUDGET_NOTES].reverse().find(([t]) => state.budget >= t);
  $('#budget-hint').innerHTML = `${note[1]}<br><span style="opacity:.7">`
    + `The plan is capped by whoever picks lowest, so this is a floor for the group.</span>`;
}

/* ── Guest: what you're up for ────────────────────────────────────────────── */

function renderVibe() {
  const wrap = $('#vibe-list');
  wrap.replaceChildren();

  const items = allActivities();
  const affordable = items.filter((a) => a.estCostAud <= state.budget);
  const over = items.filter((a) => a.estCostAud > state.budget);

  const section = (label, list, note) => {
    if (list.length === 0) return;
    wrap.appendChild(el('p', { class: 'section-label', text: label }));
    if (note) wrap.appendChild(el('p', { class: 'section-note', text: note }));
    const grid = el('div', { class: 'chip-grid' });
    for (const activity of list) grid.appendChild(chipFor(activity));
    wrap.appendChild(grid);
  };

  const curated = affordable.filter((a) => a.rippleEvent);
  const rest = affordable.filter((a) => !a.rippleEvent);

  section('On Ripple this week', curated);
  section(`Within your $${state.budget}`, rest);
  section('Over your budget', over, 'You can still tick these — we’ll flag it.');
}

function chipFor(activity) {
  const over = activity.estCostAud > state.budget;
  const ballot = state.ballots?.find((b) => b.activityId === activity.id);
  const suggestedBy = ballot?.origin.kind === 'suggested' ? ballot.origin.by : null;
  const fromLink = ballot?.origin.kind === 'link' ? ballot.origin.platform : null;

  return el('button', {
    class: 'chip', type: 'button',
    'data-over': String(over),
    'aria-pressed': String(state.picks?.has(activity.id) ?? false),
    onclick: (event) => {
      state.picks ??= new Set();
      if (state.picks.has(activity.id)) state.picks.delete(activity.id);
      else {
        state.picks.add(activity.id);
        if (over) toast(`${activity.label} is over your $${state.budget}`);
      }
      event.currentTarget.setAttribute('aria-pressed', String(state.picks.has(activity.id)));
      gate();
    },
  }, [
    activity.rippleEvent ? el('span', { class: 'ripple-badge', text: 'Ripple' }) : null,
    el('span', { class: 'emoji', text: activity.emoji }),
    el('span', { class: 'name', text: activity.label }),
    el('span', {
      class: 'cost',
      text: activity.estCostAud === 0 ? 'free' : `~$${activity.estCostAud}`,
    }),
    suggestedBy ? el('span', { class: 'cost', text: `${nameOf(suggestedBy)} added this` }) : null,
    fromLink ? el('span', { class: 'cost', text: `from ${platformLabel(fromLink)}` }) : null,
  ]);
}

function nameOf(id) {
  if (id === 'you') return state.name || 'You';
  return DEMO_FRIENDS.find((f) => f.id === id)?.name ?? id;
}

/* ── Guest: when ──────────────────────────────────────────────────────────── */

function renderWhen() {
  const wrap = $('#when-grid');
  wrap.replaceChildren();
  const cycle = { undefined: 'yes', yes: 'ifneed', ifneed: 'no', no: undefined };

  const byDay = new Map();
  for (const slot of slots) {
    const key = slot.id.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(slot);
  }

  for (const [day, daySlots] of byDay) {
    const date = new Date(`${day}T12:00:00Z`);
    const row = el('div', { class: 'day-row' }, [
      el('div', { class: 'day-label' }, [
        new Intl.DateTimeFormat('en-AU', { weekday: 'short', timeZone: TZ }).format(date),
        el('small', {
          text: new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', timeZone: TZ }).format(date),
        }),
      ]),
    ]);
    daySlots.forEach((slot, bandIndex) => {
      row.appendChild(el('button', {
        class: 'slot-btn', type: 'button',
        'data-v': state.responses[slot.id] ?? '',
        title: formatSlot(slot, TZ),
        onclick: (event) => {
          const next = cycle[String(state.responses[slot.id])];
          if (next) state.responses[slot.id] = next;
          else delete state.responses[slot.id];
          event.currentTarget.setAttribute('data-v', state.responses[slot.id] ?? '');
          gate();
        },
      }, BAND_LABELS[bandIndex]));
    });
    wrap.appendChild(row);
  }
}

/* ── The plan ─────────────────────────────────────────────────────────────── */

function computePlan() {
  const entered = (state.name || 'You').trim();
  const collides = DEMO_FRIENDS.some((f) => f.name.toLowerCase() === entered.toLowerCase());
  const me = {
    id: 'you',
    name: collides ? `${entered} (you)` : entered,
    suburb: state.suburb || 'sydney-cbd',
    budgetAud: state.budget,
    approvals: [...(state.picks ?? [])],
  };
  const members = [...DEMO_FRIENDS, me];

  const timing = scoreSlots({
    slots,
    participants: members.map((m) => ({ id: m.id, name: m.name })),
    responses: { ...demoResponses(), you: state.responses },
    config: { quorum: Math.ceil(members.length / 2), timezone: TZ },
  });

  const best = timing.ranked.find((r) => r.viable) ?? timing.ranked[0];
  const attendingIds = new Set([...best.attendees, ...best.ifNeeded]);
  const attending = members.filter((m) => attendingIds.has(m.id));
  if (attending.length === 0) return { timing, best, attending, members, brief: null };

  const catalogue = catalogueMap();
  const outcomes = rankBallots(state.ballots, catalogue, attending);

  // Only options the whole group has actually seen can be booked.
  const eligible = outcomes.filter((o) => o.eligible);
  const waiting = outcomes.filter((o) => !o.eligible && o.approvals.length > 0);

  const itinerary = buildItinerary(eligible, attending);
  const hub = rankHubs(attending, 1)[0];

  const brief = buildBrief({
    slot: best.slot, itinerary, hub, venues: [],
    names: Object.fromEntries(members.map((m) => [m.id, m.name])),
    attendeeIds: attending.map((m) => m.id),
    absentIds: members.filter((m) => !attendingIds.has(m.id)).map((m) => m.id),
    timezone: TZ,
  });

  return { timing, best, attending, members, outcomes, eligible, waiting, itinerary, hub, brief };
}

function renderResult() {
  const wrap = $('#result-body');
  wrap.replaceChildren();
  const plan = computePlan();
  state.plan = plan;

  if (!plan.brief || plan.brief.stops.length === 0) {
    wrap.appendChild(el('div', { class: 'card' }, [
      el('h3', { text: 'Not enough overlap yet' }),
      el('p', { class: 'meta', text: plan.timing.recommendation.rationale }),
    ]));
    return;
  }

  const { brief, itinerary, hub, waiting, attending, members } = plan;

  // Lead with the answer. Everything else is available but folded away.
  wrap.appendChild(el('div', { class: 'lead' }, [
    el('p', { class: 'kicker', text: 'Best plan' }),
    el('h2', { text: brief.title }),
    el('p', { class: 'when', text: brief.whenLocal }),
    el('div', { class: 'facts' }, [
      el('span', { text: `~$${brief.costPerPersonAud} each` }),
      el('span', { text: `${brief.attendees.length} of ${members.length} in` }),
      el('span', { text: `~${hub.meanMinutes} min away` }),
    ]),
  ]));

  const stops = el('ul', { class: 'stops' });
  for (const stop of brief.stops) {
    stops.appendChild(el('li', { class: 'stop' }, [
      el('span', { class: 'n', text: stop.emoji }),
      el('span', {}, [
        el('div', { class: 'label', text: stop.label }),
        el('div', { class: 'venue', text: `in ${hub.name}` }),
      ]),
      el('span', { class: 'price', text: stop.estCostAud === 0 ? 'free' : `$${stop.estCostAud}` }),
    ]));
  }
  wrap.appendChild(stops);

  // A friend adds something after you've answered: one question, not a re-run.
  if (state.answeredOnce && !state.lateAskShown) wrap.appendChild(lateAskCard());

  if (waiting.length > 0) {
    const top = waiting[0];
    wrap.appendChild(el('div', { class: 'pending-note' }, [
      el('span', {}, [
        el('b', { text: top.activity.label }),
        ` has ${top.approvals.length} vote${top.approvals.length === 1 ? '' : 's'} but `,
        el('b', { text: `${top.pending.length} ${top.pending.length === 1 ? 'person hasn’t' : 'people haven’t'}` }),
        ' seen it yet. It can’t be picked until they do.',
      ]),
    ]));
  }

  wrap.appendChild(el('details', { class: 'disclosure' }, [
    el('summary', { text: 'Who’s in' }),
    el('div', { class: 'disclosure-body' }, [
      el('div', { class: 'people' }, [
        ...brief.attendees.map((n) => el('span', { class: 'pill', text: n })),
        ...brief.absent.map((n) => el('span', { class: 'pill out', text: n })),
      ]),
    ]),
  ]));

  wrap.appendChild(el('details', { class: 'disclosure' }, [
    el('summary', { text: 'Why this' }),
    el('div', { class: 'disclosure-body' }, [
      el('p', { class: 'why' }, [
        'Capped at ', el('b', { text: `$${itinerary.budgetCeilingAud}` }),
        ` — the lowest budget among the ${attending.length} who can make it, not the average. `,
        el('b', { text: hub.name }), ' won on travel across everyone coming.',
      ]),
      el('div', { class: 'rows' }, [
        row('Longest trip', `${brief.longestTripMins} min`),
        row('Budget ceiling', `$${itinerary.budgetCeilingAud}`),
      ]),
    ]),
  ]));

  wrap.appendChild(el('details', { class: 'disclosure' }, [
    el('summary', { text: 'Message for the chat' }),
    el('div', { class: 'disclosure-body' }, [
      el('div', { class: 'chat-preview', text: renderChatMessage(brief) }),
    ]),
  ]));

  const ics = $('#ics-link');
  if (ics) {
    ics.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(brief.calendar.ics)}`;
    ics.setAttribute('download', 'ripple-plan.ics');
  }
}

function lateAskCard() {
  return el('div', { class: 'card' }, [
    el('p', { class: 'kicker', text: 'One more thing' }),
    el('h3', { text: `Ross added ${LATE_SUGGESTION.label}` }),
    el('p', { class: 'meta', text: `~$${LATE_SUGGESTION.estCostAud}. You in? Everyone else who already answered gets asked this too.` }),
    el('div', { class: 'actions row', style: 'margin-top:4px' }, [
      el('button', {
        class: 'btn ghost', type: 'button',
        onclick: () => answerLateAsk(false),
      }, 'Not for me'),
      el('button', {
        class: 'btn', type: 'button',
        onclick: () => answerLateAsk(true),
      }, 'I’m in'),
    ]),
  ]);
}

function answerLateAsk(yes) {
  state.extraActivities.set(LATE_SUGGESTION.id, LATE_SUGGESTION);
  state.ballots = addSuggestion(state.ballots, LATE_SUGGESTION, 'ross', new Date().toISOString());
  // Everyone but you has now seen it, so your answer is the one that unblocks it.
  for (const friend of DEMO_FRIENDS) {
    state.ballots = recordAnswers(
      state.ballots, friend.id, [LATE_SUGGESTION.id],
      ['ross', 'eyong'].includes(friend.id) ? [LATE_SUGGESTION.id] : [],
    );
  }
  state.ballots = recordAnswers(
    state.ballots, 'you', [LATE_SUGGESTION.id], yes ? [LATE_SUGGESTION.id] : []);
  if (yes) (state.picks ??= new Set()).add(LATE_SUGGESTION.id);

  state.lateAskShown = true;
  state.lateAskAnswer = yes;
  renderResult();

  // Say what actually happened. Voting for something is not the same as it
  // winning — it still has to fit the ceiling and beat the alternatives, and
  // claiming otherwise would be the one lie the whole result screen tells.
  if (!yes) {
    toast('Noted — everyone still gets asked');
  } else {
    const madeIt = state.plan?.itinerary?.stops
      ?.some((stop) => stop.activity.id === LATE_SUGGESTION.id);
    toast(madeIt ? 'Added to the plan' : 'Counted — but it doesn’t fit the budget');
  }
}

function row(k, v) {
  return el('div', { class: 'row' }, [
    el('span', { class: 'k', text: k }),
    el('span', { class: 'v', text: v }),
  ]);
}

/* ── Sheets: suggest / paste a link ───────────────────────────────────────── */

function openSheet(id) { $(`#${id}`).setAttribute('data-open', ''); }
function closeSheets() {
  document.querySelectorAll('.sheet').forEach((s) => s.removeAttribute('data-open'));
}

function commitSuggestion(activity, origin) {
  state.extraActivities.set(activity.id, activity);
  state.ballots = addSuggestion(
    state.ballots, activity, 'you', new Date().toISOString(), origin);
  (state.picks ??= new Set()).add(activity.id);

  const pending = state.ballots.find((b) => b.activityId === activity.id)?.seen ?? [];
  const waiting = DEMO_FRIENDS.length + 1 - pending.length;
  closeSheets();
  renderVibe();
  gate();
  toast(waiting > 0 ? `Added — asking the other ${waiting}` : 'Added');
}

/* ── Host flow ────────────────────────────────────────────────────────────── */

function parseContact(raw) {
  const text = raw.trim();
  if (!text) return null;

  const emailMatch = text.match(/([^\s,<>]+@[^\s,<>]+\.[a-z]{2,})/i);
  if (emailMatch) {
    return {
      name: text.replace(emailMatch[0], '').replace(/[,<>]/g, '').trim() || emailMatch[1],
      contact: emailMatch[1].toLowerCase(),
      channel: 'email',
    };
  }

  const phoneMatch = text.match(/(\+?\d[\d\s()-]{7,})/);
  if (phoneMatch) {
    const digits = phoneMatch[1].replace(/[^\d+]/g, '');
    return {
      name: text.replace(phoneMatch[0], '').replace(/,/g, '').trim() || digits,
      contact: digits,
      channel: 'sms',
    };
  }
  return null;
}

function renderInvitees() {
  const list = $('#invitee-list');
  list.replaceChildren();
  for (const person of state.invitees) {
    list.appendChild(el('span', { class: 'invitee' }, [
      el('span', { text: person.name }),
      el('small', { text: person.channel === 'sms' ? 'text' : 'email' }),
      el('button', {
        type: 'button', 'aria-label': `Remove ${person.name}`,
        onclick: () => {
          state.invitees = state.invitees.filter((p) => p !== person);
          renderInvitees(); gate();
        },
      }, '×'),
    ]));
  }
  $('#who-count').textContent = state.invitees.length === 0
    ? 'Number or email. They don’t need the app.'
    : `${state.invitees.length} invited`;
}

function renderHostOptions() {
  const wrap = $('#host-options-list');
  wrap.replaceChildren();
  const grid = el('div', { class: 'chip-grid' });
  for (const activity of CATALOGUE.slice(0, 12)) {
    grid.appendChild(el('button', {
      class: 'chip', type: 'button',
      'aria-pressed': String(state.hostPicks.has(activity.id)),
      onclick: (e) => {
        if (state.hostPicks.has(activity.id)) state.hostPicks.delete(activity.id);
        else state.hostPicks.add(activity.id);
        e.currentTarget.setAttribute('aria-pressed', String(state.hostPicks.has(activity.id)));
      },
    }, [
      el('span', { class: 'emoji', text: activity.emoji }),
      el('span', { class: 'name', text: activity.label }),
      el('span', { class: 'cost', text: activity.estCostAud === 0 ? 'free' : `~$${activity.estCostAud}` }),
    ]));
  }
  wrap.appendChild(grid);
}

function renderHostSend() {
  const wrap = $('#host-send-body');
  wrap.replaceChildren();
  const title = state.planTitle.trim() || 'Friday night';
  const link = `ripple.app/p/${Math.random().toString(36).slice(2, 8)}`;

  wrap.appendChild(el('p', { class: 'eyebrow', text: 'Making a plan' }));
  wrap.appendChild(el('h1', { text: 'Ready to send' }));
  wrap.appendChild(el('p', { class: 'sub', text: `${state.invitees.length} people. One link each.` }));

  wrap.appendChild(el('div', { class: 'link-box' }, [
    el('code', { text: link }),
    el('button', {
      class: 'btn small ghost', type: 'button',
      style: 'width:auto;padding:7px 12px;font-size:13px',
      onclick: async () => {
        try { await navigator.clipboard.writeText(`https://${link}`); toast('Link copied'); }
        catch { toast('Copy it from the box'); }
      },
    }, 'Copy'),
  ]));

  wrap.appendChild(el('p', { class: 'section-label', text: 'They’ll get' }));
  wrap.appendChild(el('div', { class: 'chat-preview', text:
    `${state.name || 'Hassaan'} wants to hang — ${title}.\n`
    + `Takes 30 seconds, no app needed:\nhttps://${link}` }));

  wrap.appendChild(el('p', { class: 'section-label', text: 'Going to' }));
  const list = el('div', { class: 'invitees' });
  for (const person of state.invitees) {
    list.appendChild(el('span', { class: 'invitee' }, [
      el('span', { text: person.name }),
      el('small', { text: person.contact }),
    ]));
  }
  wrap.appendChild(list);
}

function renderHostTrack() {
  const wrap = $('#host-track-body');
  wrap.replaceChildren();
  const answered = state.invitees.filter((_, i) => i % 2 === 0);
  const missing = state.invitees.filter((p) => !answered.includes(p));

  wrap.appendChild(el('p', { class: 'eyebrow', text: state.planTitle.trim() || 'Friday night' }));
  wrap.appendChild(el('h1', { text: 'Sent' }));
  wrap.appendChild(el('p', { class: 'sub', text: 'You’ll get a nudge when everyone’s answered.' }));

  wrap.appendChild(el('div', { class: 'stat-strip' }, [
    el('div', { class: 'stat' }, [
      el('span', { class: 'n', text: String(answered.length) }),
      el('span', { class: 'l', text: 'answered' }),
    ]),
    el('div', { class: 'stat' }, [
      el('span', { class: 'n', text: String(missing.length) }),
      el('span', { class: 'l', text: 'waiting' }),
    ]),
    el('div', { class: 'stat' }, [
      el('span', { class: 'n', text: String(state.invitees.length) }),
      el('span', { class: 'l', text: 'invited' }),
    ]),
  ]));

  if (missing.length > 0) {
    wrap.appendChild(el('p', { class: 'section-label', text: 'Still waiting on' }));
    const list = el('div', { class: 'invitees' });
    for (const person of missing) {
      list.appendChild(el('span', { class: 'invitee' }, [
        el('span', { text: person.name }),
        el('small', { text: person.channel === 'sms' ? 'text' : 'email' }),
      ]));
    }
    wrap.appendChild(list);
  } else {
    wrap.appendChild(el('div', { class: 'empty-box' }, [
      el('h4', { text: 'Everyone’s answered' }),
      el('p', { text: 'Lock it in whenever you’re ready.' }),
    ]));
  }
}

/* ── Gating ───────────────────────────────────────────────────────────────── */

function gate() {
  const answered = Object.values(state.responses).filter((v) => v === 'yes' || v === 'ifneed').length;
  const picks = state.picks?.size ?? 0;

  const set = (id, ok) => { const b = $(id); if (b) b.disabled = !ok; };
  set('#next-name', state.name.trim().length > 0);
  set('#next-suburb', Boolean(state.suburb));
  set('#next-vibe', picks > 0);
  set('#next-when', answered > 0);
  set('#next-who', state.invitees.length > 0);

  const vibeCount = $('#vibe-count');
  if (vibeCount) {
    vibeCount.textContent = picks === 0 ? 'Pick anything you’d say yes to' : `${picks} picked`;
  }
  const whenCount = $('#when-count');
  if (whenCount) {
    whenCount.textContent = answered === 0
      ? 'Tap the times that work'
      : `${answered} time${answered === 1 ? '' : 's'} marked`;
  }
}

function render() {
  if (state.screen === 'suburb') renderSuburbs();
  if (state.screen === 'budget') renderBudget();
  if (state.screen === 'vibe') renderVibe();
  if (state.screen === 'when') renderWhen();
  if (state.screen === 'result') {
    if (!state.answeredOnce) {
      state.ballots = recordAnswers(
        state.ballots, 'you', allActivities().map((a) => a.id), [...(state.picks ?? [])]);
      state.answeredOnce = true;
    }
    renderResult();
  }
  if (state.screen === 'host-who') renderInvitees();
  if (state.screen === 'host-options') renderHostOptions();
  if (state.screen === 'host-send') renderHostSend();
  if (state.screen === 'host-track') renderHostTrack();
  gate();
}

/* ── Wiring ───────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initBallots();

  $('#name-input').addEventListener('input', (e) => { state.name = e.target.value; gate(); });
  $('#suburb-search').addEventListener('input', (e) => {
    state.suburbFilter = e.target.value; renderSuburbs();
  });
  $('#budget-range').addEventListener('input', (e) => {
    state.budget = Number(e.target.value); renderBudget();
  });
  $('#plan-title').addEventListener('input', (e) => { state.planTitle = e.target.value; });

  document.querySelectorAll('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.dataset.go));
  });
  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', back);
  });
  document.querySelectorAll('[data-close-sheet]').forEach((btn) => {
    btn.addEventListener('click', closeSheets);
  });
  document.querySelectorAll('.sheet').forEach((sheet) => {
    sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheets(); });
  });

  $('#open-suggest').addEventListener('click', () => openSheet('sheet-suggest'));
  $('#open-link').addEventListener('click', () => openSheet('sheet-link'));

  $('#suggest-add').addEventListener('click', () => {
    const label = $('#suggest-name').value.trim();
    if (!label) return toast('Give it a name');
    const cost = Math.max(0, Number($('#suggest-cost').value) || 0);

    // Typing the name of something already on the list must not create a rival.
    const existing = allActivities()
      .find((a) => a.label.toLowerCase() === label.toLowerCase());
    if (existing) {
      commitSuggestion(existing, undefined);
      $('#suggest-name').value = ''; $('#suggest-cost').value = '';
      return;
    }

    commitSuggestion({
      id: `sug-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}`,
      label, emoji: '✨', estCostAud: cost, durationMins: 90,
      category: 'culture', placesQuery: label, timeOfDay: 'any',
      sequenceRank: 2, tags: ['suggested'],
    }, undefined);
    $('#suggest-name').value = ''; $('#suggest-cost').value = '';
  });

  const linkInput = $('#link-url');
  const linkFeedback = $('#link-feedback');
  linkInput.addEventListener('input', () => {
    const parsed = parseEventUrl(linkInput.value);
    linkFeedback.replaceChildren(el('p', {
      class: 'why',
      text: linkInput.value.trim() === '' ? ''
        : parsed ? `Looks like a ${platformLabel(parsed.platform)} event.`
        : 'Not a link we recognise yet.',
    }));
  });

  $('#link-add').addEventListener('click', () => {
    const parsed = parseEventUrl(linkInput.value);
    if (!parsed) return toast('Paste a Luma, Partiful, Eventbrite, Humanitix or Meetup link');
    // The real app reads the page's title server-side; offline we name it by platform.
    const activity = linkToActivity(parsed, {}, state.budget);
    commitSuggestion(activity, {
      kind: 'link', by: 'you', url: parsed.canonicalUrl, platform: parsed.platform,
    });
    linkInput.value = ''; linkFeedback.replaceChildren();
  });

  $('#add-invitee').addEventListener('click', addInvitee);
  $('#invitee-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addInvitee(); }
  });

  $('#send-invites').addEventListener('click', () => {
    state.sent = true;
    toast(`Sent to ${state.invitees.length}`);
    go('host-track');
  });

  $('#blast-btn').addEventListener('click', () => {
    const missing = state.invitees.filter((_, i) => i % 2 !== 0);
    toast(missing.length === 0 ? 'Nobody to chase' : `Nudged ${missing.length}`);
  });

  $('#result-copy').addEventListener('click', async () => {
    if (!state.plan?.brief) return;
    try {
      await navigator.clipboard.writeText(renderChatMessage(state.plan.brief));
      toast('Copied');
    } catch { toast('Open "Message for the chat" and copy it'); }
  });

  $('#install-btn').addEventListener('click', () => toast('Would open the App Store'));

  go('welcome', { replace: true });
});

function addInvitee() {
  const input = $('#invitee-input');
  const person = parseContact(input.value);
  if (!person) return toast('Add a number or an email');
  if (state.invitees.some((p) => p.contact === person.contact)) return toast('Already on the list');
  state.invitees.push(person);
  input.value = '';
  renderInvitees();
  gate();
}
