/**
 * Ripple hangout onboarding.
 *
 * Imports the same engine the Worker runs (web/shared/engine.js), so what the
 * prototype shows is what the product would actually decide — no simplified
 * demo maths that drifts from the real thing.
 *
 * Two modes:
 *   live   served at /r/:pollId — talks to the Worker API
 *   demo   opened standalone — five friends have already answered, and you
 *          are the sixth. Everything is computed locally by the real engine.
 */

import {
  generateGrid, formatSlot, scoreSlots, SUBURBS, rankHubs,
  mergeRippleEvents, rankActivities, buildItinerary, buildBrief, renderChatMessage,
} from '../shared/engine.js';

const TZ = 'Australia/Sydney';
const TIMES = ['14:00', '18:30', '21:00'];
const BAND_LABELS = ['Arvo', 'Dinner', 'Late'];

/* ── Demo cast ────────────────────────────────────────────────────────────── */

/**
 * Illustrative curated events, so the prototype shows the thing that makes
 * Ripple different: its own directory competing head-to-head with "go bowling"
 * rather than sitting in a separate tab.
 *
 * These are placeholders in the shape of what Ripple actually runs, not real
 * listings. In production this array is replaced by the `ripple_events` table.
 */
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
  { id: 'isaac', name: 'Isaac',  suburb: 'newtown',        budgetAud: 60,  approvals: ['eats-casual', 'pub', 'pool', 'live-music', 'rip-jazz'] },
  { id: 'kez',   name: 'Kez',    suburb: 'bondi-junction', budgetAud: 90,  approvals: ['eats-nice', 'cocktails', 'clubbing', 'eats-casual', 'rip-jazz'] },
  { id: 'ross',  name: 'Ross',   suburb: 'marrickville',   budgetAud: 35,  approvals: ['pub', 'pool', 'eats-casual', 'board-games'] },
  { id: 'eyong', name: 'Eyong',  suburb: 'chatswood',      budgetAud: 55,  approvals: ['bowling', 'eats-casual', 'karaoke', 'pool'] },
  { id: 'manan', name: 'Manan',  suburb: 'ultimo',         budgetAud: 40,  approvals: ['pool', 'eats-casual', 'trivia', 'pub', 'rip-trivia'] },
];

const slots = generateGrid({
  startDate: new Date().toISOString().slice(0, 10),
  days: 7, times: TIMES, durationMins: 180, timeZone: TZ,
});

/** Deterministic pseudo-availability, so the demo is stable across reloads. */
function demoResponses() {
  const map = {};
  DEMO_FRIENDS.forEach((friend, personIndex) => {
    map[friend.id] = {};
    slots.forEach((slot, slotIndex) => {
      const seed = (personIndex * 7 + slotIndex * 3) % 10;
      const band = slotIndex % TIMES.length;
      // Weeknight arvos are mostly out; weekend evenings mostly in.
      const value = band === 0 ? (seed < 3 ? 'yes' : 'no')
        : seed < 5 ? 'yes'
        : seed < 7 ? 'ifneed'
        : 'no';
      map[friend.id][slot.id] = value;
    });
  });
  return map;
}

/* ── State ────────────────────────────────────────────────────────────────── */

const state = {
  step: 0,
  name: '',
  suburb: '',
  budget: 50,
  approvals: new Set(),
  responses: {},
  suburbFilter: '',
  brief: null,
};

const STEPS = ['welcome', 'name', 'suburb', 'budget', 'vibe', 'when', 'result'];

const $ = (sel) => document.querySelector(sel);
const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child) node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
};

function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.setAttribute('data-show', '');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.removeAttribute('data-show'), 2200);
}

/* ── Navigation ───────────────────────────────────────────────────────────── */

function go(step) {
  const previous = state.step;
  state.step = Math.max(0, Math.min(STEPS.length - 1, step));
  render();

  const screens = document.querySelectorAll('.screen');
  screens.forEach((screen, i) => {
    screen.toggleAttribute('data-active', i === state.step);
    screen.toggleAttribute('data-leaving', i < state.step);
  });

  $('#progress-bar').style.width = `${(state.step / (STEPS.length - 1)) * 100}%`;
  // Only the question screens are numbered — the welcome and the result are not
  // steps you are "on N of" and counting them produced "6 of 5".
  const lastQuestion = STEPS.length - 2;
  $('#step-count').textContent = (state.step === 0 || state.step > lastQuestion)
    ? ''
    : `${state.step} of ${lastQuestion}`;
  if (previous !== state.step) $('.screens').scrollTop = 0;
}

/* ── Step renderers ───────────────────────────────────────────────────────── */

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
      class: 'suburb',
      type: 'button',
      'aria-pressed': String(state.suburb === key),
      onclick: () => { state.suburb = key; renderSuburbs(); updateNav(); },
    }, [
      el('span', { text: suburb.name }),
      suburb.hub ? el('span', { class: 'hub-tag', text: 'venues' }) : null,
    ]));
  }
}

const BUDGET_NOTES = [
  [0,  'Free only. Beach, a walk, someone’s balcony. <b>Still a night out.</b>'],
  [20, 'Coffee, a bakery crawl, or a game of pool. <b>Nobody gets priced out.</b>'],
  [40, 'Dinner plus one thing after. <b>The sweet spot for a weeknight.</b>'],
  [70, 'Dinner, drinks, and something with an entry fee. <b>A proper Friday.</b>'],
  [110, 'Anything on the list, including the bathhouse. <b>Big night energy.</b>'],
];

function renderBudget() {
  $('#budget-figure').textContent = state.budget === 0 ? '$0' : `$${state.budget}`;
  const note = [...BUDGET_NOTES].reverse().find(([threshold]) => state.budget >= threshold);
  $('#budget-hint').innerHTML = note[1]
    + '<br><span style="opacity:.65">The plan is capped by whoever picks the lowest number, '
    + 'so this is a floor for the group, not just for you.</span>';
}

function renderVibe() {
  const wrap = $('#vibe-list');
  wrap.replaceChildren();

  const curated = CATALOGUE.filter((a) => a.rippleEvent);
  const rest = CATALOGUE.filter((a) => !a.rippleEvent);

  const addSection = (label, items) => {
    if (items.length === 0) return;
    wrap.appendChild(el('p', { class: 'section-label', text: label }));
    const grid = el('div', { class: 'chip-grid' });
    for (const activity of items) {
      const overBudget = activity.estCostAud > state.budget;
      grid.appendChild(el('button', {
        class: 'chip',
        type: 'button',
        'data-over': String(overBudget),
        'aria-pressed': String(state.approvals.has(activity.id)),
        onclick: (event) => {
          const chip = event.currentTarget;
          if (state.approvals.has(activity.id)) {
            state.approvals.delete(activity.id);
          } else {
            state.approvals.add(activity.id);
            if (overBudget) toast(`${activity.label} is over your $${state.budget} cap`);
          }
          // Toggle in place rather than re-rendering the section: a full
          // re-render destroys the button that was just tapped, which drops
          // keyboard focus and jumps the scroll position on a long list.
          chip.setAttribute('aria-pressed', String(state.approvals.has(activity.id)));
          updateNav();
        },
      }, [
        activity.rippleEvent ? el('span', { class: 'ripple-badge', text: 'Ripple' }) : null,
        el('span', { class: 'emoji', text: activity.emoji }),
        el('span', { class: 'name', text: activity.label }),
        el('span', {
          class: 'cost',
          text: activity.estCostAud === 0 ? 'free' : `~$${activity.estCostAud}`,
        }),
      ]));
    }
    wrap.appendChild(grid);
  };

  addSection('On Ripple this week', curated);
  addSection('Anything', rest);
}

function renderWhen() {
  const wrap = $('#when-grid');
  wrap.replaceChildren();

  const byDay = new Map();
  for (const slot of slots) {
    const key = slot.id.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(slot);
  }

  const cycle = { undefined: 'yes', yes: 'ifneed', ifneed: 'no', no: undefined };

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
      const value = state.responses[slot.id];
      row.appendChild(el('button', {
        class: 'slot-btn',
        type: 'button',
        'data-v': value ?? '',
        title: formatSlot(slot, TZ),
        onclick: (event) => {
          const button = event.currentTarget;
          const next = cycle[String(state.responses[slot.id])];
          if (next) state.responses[slot.id] = next;
          else delete state.responses[slot.id];
          button.setAttribute('data-v', state.responses[slot.id] ?? '');
          updateNav();
        },
      }, BAND_LABELS[bandIndex]));
    });

    wrap.appendChild(row);
  }
}

/* ── The actual arbitration ───────────────────────────────────────────────── */

function computePlan() {
  // Distinguish the viewer when their name matches someone already answering,
  // otherwise the attendee list shows the same name twice and reads as a bug.
  const entered = (state.name || 'You').trim();
  const collides = DEMO_FRIENDS.some(
    (f) => f.name.toLowerCase() === entered.toLowerCase(),
  );
  const me = {
    id: 'you',
    name: collides ? `${entered} (you)` : entered,
    suburb: state.suburb,
    budgetAud: state.budget,
    approvals: [...state.approvals],
  };
  const members = [...DEMO_FRIENDS, me];

  const participants = members.map((m) => ({ id: m.id, name: m.name }));
  const responses = { ...demoResponses(), you: state.responses };

  const timing = scoreSlots({
    slots, participants, responses,
    config: { quorum: Math.ceil(members.length / 2), timezone: TZ },
  });

  const best = timing.ranked.find((r) => r.viable) ?? timing.ranked[0];
  const attendingIds = new Set([...best.attendees, ...best.ifNeeded]);
  const attending = members.filter((m) => attendingIds.has(m.id));

  if (attending.length === 0) return { timing, best, attending, brief: null };

  const ranked = rankActivities(attending, CATALOGUE);
  const itinerary = buildItinerary(ranked, attending);
  const hub = rankHubs(attending, 1)[0];

  const brief = buildBrief({
    slot: best.slot, itinerary, hub, venues: [],
    names: Object.fromEntries(members.map((m) => [m.id, m.name])),
    attendeeIds: attending.map((m) => m.id),
    absentIds: members.filter((m) => !attendingIds.has(m.id)).map((m) => m.id),
    timezone: TZ,
  });

  return { timing, best, attending, members, ranked, itinerary, hub, brief };
}

function renderResult() {
  const wrap = $('#result-body');
  wrap.replaceChildren();

  const plan = computePlan();
  state.brief = plan.brief;

  if (!plan.brief || plan.brief.stops.length === 0) {
    wrap.appendChild(el('div', { class: 'card' }, [
      el('h3', { text: 'Not enough overlap yet' }),
      el('p', { class: 'meta', text: plan.timing.recommendation.rationale }),
    ]));
    wrap.appendChild(el('button', {
      class: 'btn ghost', type: 'button', onclick: () => go(5),
    }, 'Add more times'));
    return;
  }

  const { brief, itinerary, hub, ranked, attending, members } = plan;

  wrap.appendChild(el('div', { class: 'card hero' }, [
    el('h3', { text: brief.title }),
    el('p', { class: 'meta', text: brief.whenLocal }),
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

  wrap.appendChild(el('div', { class: 'card' }, [
    el('div', { class: 'rows' }, [
      row('Per person', `~$${brief.costPerPersonAud}`),
      row('Budget ceiling', `$${itinerary.budgetCeilingAud}`),
      row('Average travel', `${hub.meanMinutes} min`),
      row('Longest trip', `${brief.longestTripMins} min`),
    ]),
  ]));

  const people = el('div', { class: 'people' });
  for (const name of brief.attendees) people.appendChild(el('span', { class: 'pill', text: name }));
  for (const name of brief.absent) people.appendChild(el('span', { class: 'pill out', text: name }));
  wrap.appendChild(el('div', { class: 'card' }, [
    el('p', { class: 'section-label', text: `${brief.attendees.length} of ${members.length} in` }),
    people,
  ]));

  // Why this time, not just this plan. The time is the hard part, so the
  // runner-up slot and its headcount are shown rather than implied.
  const runnerUp = plan.timing.ranked.find((r) => r.slot.id !== plan.best.slot.id);
  const chosenHeads = plan.best.attendees.length + plan.best.ifNeeded.length;

  const timeCard = el('div', { class: 'card' }, [
    el('p', { class: 'section-label', text: 'Why this time' }),
    el('div', { class: 'rows' }, [
      row(brief.whenLocal, `${chosenHeads} free`),
      runnerUp
        ? row(
            formatSlotShort(runnerUp.slot),
            `${runnerUp.attendees.length + runnerUp.ifNeeded.length} free`,
          )
        : null,
    ].filter(Boolean)),
    el('div', { class: 'bar' }, [
      el('i', { style: `width:${Math.round((chosenHeads / members.length) * 100)}%` }),
    ]),
    plan.timing.nonResponders.length
      ? el('p', { class: 'why' }, [
          raw(`${plan.timing.nonResponders.length} ${plan.timing.nonResponders.length === 1 ? 'person has' : 'people have'} `
            + `not answered. A slot nobody confirms counts as a no, so chasing them can still change this.`),
        ])
      : null,
  ]);
  wrap.appendChild(timeCard);

  // Why this plan, and not the runner-up activity.
  const second = ranked.filter((r) => !itinerary.stops.some((s) => s.activity.id === r.activity.id))[0];
  const why = el('div', { class: 'card' }, [
    el('p', { class: 'section-label', text: 'Why this' }),
    el('p', { class: 'why' }, [
      raw(`Capped at <b>$${itinerary.budgetCeilingAud}</b> because that is the lowest budget among the `
        + `${attending.length} people who can make it — not the average, so nobody is quietly priced out. `
        + `<b>${hub.name}</b> won on travel across everyone actually coming.`),
    ]),
    second ? el('p', { class: 'why' }, [
      raw(second.pricedOut.length
        ? `<b>${second.activity.label}</b> lost because it prices out `
          + `${second.pricedOut.length} of the group.`
        : `<b>${second.activity.label}</b> was the runner-up on votes.`),
    ]) : null,
  ]);
  wrap.appendChild(why);

  wrap.appendChild(el('div', { class: 'card' }, [
    el('p', { class: 'section-label', text: 'Paste into the chat' }),
    el('div', { class: 'chat-preview', text: renderChatMessage(brief) }),
  ]));

  const buttons = el('div', { class: 'actions row' }, [
    el('button', {
      class: 'btn', type: 'button',
      onclick: async () => {
        try {
          await navigator.clipboard.writeText(renderChatMessage(brief));
          toast('Copied');
        } catch { toast('Select and copy the text above'); }
      },
    }, 'Copy'),
    el('a', {
      class: 'btn ghost', href: brief.calendar.googleUrl,
      target: '_blank', rel: 'noopener',
      style: 'text-align:center;text-decoration:none;display:block',
    }, 'Add to calendar'),
  ]);
  wrap.appendChild(buttons);

  wrap.appendChild(el('button', {
    class: 'btn ghost', type: 'button',
    onclick: () => { state.step = 0; go(1); },
  }, 'Change my answers'));
}

function formatSlotShort(slot) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: TZ, weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(slot.startUtc));
}

function row(k, v) {
  return el('div', { class: 'row' }, [
    el('span', { class: 'k', text: k }),
    el('span', { class: 'v', text: v }),
  ]);
}

function raw(html) {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span;
}

/* ── Nav gating ───────────────────────────────────────────────────────────── */

function updateNav() {
  const answered = Object.values(state.responses).filter((v) => v === 'yes' || v === 'ifneed').length;
  const gates = {
    1: state.name.trim().length > 0,
    2: Boolean(state.suburb),
    3: true,
    4: state.approvals.size > 0,
    5: answered > 0,
  };
  const next = $(`#next-${state.step}`);
  if (next) next.disabled = gates[state.step] === false;

  const counter = $('#vibe-count');
  if (counter) {
    counter.textContent = state.approvals.size === 0
      ? 'Pick anything you would say yes to'
      : `${state.approvals.size} picked`;
  }
  const whenCount = $('#when-count');
  if (whenCount) {
    whenCount.textContent = answered === 0
      ? 'Tap the times that work'
      : `${answered} time${answered === 1 ? '' : 's'} marked`;
  }
}

function render() {
  if (state.step === 2) renderSuburbs();
  if (state.step === 3) renderBudget();
  if (state.step === 4) renderVibe();
  if (state.step === 5) renderWhen();
  if (state.step === 6) renderResult();
  updateNav();
}

/* ── Wiring ───────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  $('#name-input').addEventListener('input', (e) => {
    state.name = e.target.value;
    updateNav();
  });
  $('#suburb-search').addEventListener('input', (e) => {
    state.suburbFilter = e.target.value;
    renderSuburbs();
  });
  $('#budget-range').addEventListener('input', (e) => {
    state.budget = Number(e.target.value);
    renderBudget();
  });

  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => go(state.step + 1));
  });
  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => go(state.step - 1));
  });

  go(0);
});
