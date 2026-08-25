/**
 * Banksia house dashboard.
 *
 * Runs the same engine bundle as the Worker. In demo mode (no group id in the
 * URL) it seeds the actual house — including Isaac's Monday football clash and
 * Pete's attendance record — so the mechanics that matter can be seen working
 * before any of it is deployed.
 */

import {
  generateGrid, formatSlot, scoreSlots, recommendAnchor, evaluateRefix,
  collidesWithStandingConflict,
  settleWeek, resolveDisputes, resolveIssue, offenderTable, buildAgenda,
  describeIssueOutcome,
  formatMoney, DEFAULT_CHORE_CONFIG,
  openPot, applyWeekFines, potState, distributePot, recommendPot,
} from '../shared/engine.js';

const TZ = 'Australia/Sydney';
const TIMES = ['18:30', '19:30', '20:30'];
const BANDS = ['6:30', '7:30', '8:30'];

const HOUSE = [
  { id: 'hassaan', name: 'Hassaan', attendanceRate: 1.0 },
  { id: 'isaac', name: 'Isaac', attendanceRate: 0.9,
    standingConflicts: [{ weekday: 1, startMin: 19 * 60, endMin: 21 * 60, label: 'football practice' }] },
  { id: 'kez', name: 'Kez', attendanceRate: 0.9 },
  { id: 'ross', name: 'Ross', attendanceRate: 0.8 },
  { id: 'eyong', name: 'Eyong', attendanceRate: 0.8 },
  { id: 'pete', name: 'Pete', attendanceRate: 0.2 },
  { id: 'manan', name: 'Manan', attendanceRate: 0.7 },
];

const TASKS = [
  ['kitchen-bench', 'Wipe kitchen bench'],
  ['sink-drain', 'Clear sink + drain'],
  ['bins-out', 'Bins out'],
  ['bathroom', 'Bathroom'],
  ['vacuum-common', 'Vacuum common areas'],
  ['fridge-clear', 'Clear out fridge'],
  ['mop-kitchen', 'Mop kitchen'],
  ['recycling', 'Recycling'],
].map(([id, label]) => ({ id, label }));

const CHORE_CONFIG = { ...DEFAULT_CHORE_CONFIG, tasks: TASKS };
const WEEK = mondayOf(new Date());

const slots = generateGrid({
  startDate: WEEK, days: 14, times: TIMES, durationMins: 60, timeZone: TZ,
});

/* ── Seeded demo state ────────────────────────────────────────────────────── */

const state = {
  me: 'hassaan',
  tab: 'meeting',
  responses: seedResponses(),
  claims: seedClaims(),
  issueAnswers: {},
  refixNote: null,
  veto: Object.fromEntries(HOUSE.map((p) => [p.id, { used: p.id === 'pete' ? 2 : 0, budget: 2 }])),
  // The pot. Buy-in and fine are what the user tunes; distribution is how the
  // surplus is shared when the period closes.
  pot: { buyInCents: 4000, finePerMissedTaskCents: 500, distribution: 'split-clean' },
};

function mondayOf(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}

function seedResponses() {
  const map = {};
  HOUSE.forEach((person, i) => {
    map[person.id] = {};
    slots.forEach((slot, j) => {
      // Pete answers almost nothing — that is the behaviour, not a data gap.
      if (person.id === 'pete' && (i + j) % 4 !== 0) return;
      const seed = (i * 5 + j * 3) % 9;
      map[person.id][slot.id] = seed < 5 ? 'yes' : seed < 7 ? 'ifneed' : 'no';
    });
  });
  return map;
}

function seedClaims() {
  const claims = [];
  const give = (member, taskIds, challengedBy) => {
    for (const taskId of taskIds) {
      claims.push({
        participantId: member, taskId, weekOf: WEEK,
        claimedAt: `${WEEK}T10:00:00Z`,
        challengedBy: challengedBy?.[taskId],
      });
    }
  };
  give('hassaan', ['kitchen-bench', 'bins-out', 'bathroom', 'recycling']);
  give('isaac', ['vacuum-common', 'mop-kitchen', 'fridge-clear', 'kitchen-bench']);
  give('kez', ['bathroom', 'bins-out', 'recycling', 'sink-drain']);
  give('ross', ['mop-kitchen', 'vacuum-common', 'fridge-clear']);
  give('eyong', ['kitchen-bench', 'sink-drain', 'bins-out', 'bathroom']);
  give('manan', ['recycling', 'fridge-clear']);
  give('pete', ['sink-drain'], { 'sink-drain': ['hassaan'] });
  return claims;
}

const DEMO_ISSUE = {
  id: 'noodles',
  raisedBy: 'hassaan',
  description: 'Sink blocked with noodles again, third time this fortnight',
  createdAt: new Date(Date.now() - 20 * 3600_000).toISOString(),
  closesAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
};

/* ── DOM helpers ──────────────────────────────────────────────────────────── */

const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
};
const nameOf = (id) => HOUSE.find((p) => p.id === id)?.name ?? id;

/* ── Derived state ────────────────────────────────────────────────────────── */

function meetingState() {
  const config = { timezone: TZ, quorum: 5 };
  const timing = scoreSlots({ slots, participants: HOUSE, responses: state.responses, config });
  const anchor = recommendAnchor({
    slots, participants: HOUSE, responses: state.responses,
    incumbent: { weekday: 1, time: '19:30' }, config,
  });
  return { timing, anchor };
}

function ledgerState() {
  const settlements = settleWeek({
    weekOf: WEEK, participantIds: HOUSE.map((p) => p.id),
    claims: state.claims, config: CHORE_CONFIG,
  });
  // Pete disputes but does not come to the meeting; Ross disputes and does.
  const present = HOUSE.filter((p) => p.id !== 'pete').map((p) => p.id);
  const outcomes = resolveDisputes({
    settlements,
    disputes: [
      { participantId: 'pete', weekOf: WEEK, argument: 'the board was wrong', raisedAt: 'x' },
      { participantId: 'manan', weekOf: WEEK, argument: 'I did the bins on Sunday', raisedAt: 'x' },
    ],
    presentAtMeeting: present,
  });

  const issueOutcome = resolveIssue(
    DEMO_ISSUE,
    Object.entries(state.issueAnswers).map(([participantId, answer]) => ({
      issueId: DEMO_ISSUE.id, participantId, answer, at: new Date().toISOString(),
    })),
    HOUSE.map((p) => p.id),
    new Date().toISOString(),
  );

  const offenders = offenderTable({
    participantIds: HOUSE.map((p) => p.id),
    outcomes: [issueOutcome],
    settlements: outcomes,
    meetingsMissed: { pete: 6, manan: 2, ross: 1 },
  });

  const agenda = buildAgenda({ outcomes: [issueOutcome], settlements: outcomes, offenders, nameOf });
  return { settlements, outcomes, issueOutcome, offenders, agenda };
}

/* ── Panels ───────────────────────────────────────────────────────────────── */

function renderMeeting() {
  const wrap = $('#panel-meeting');
  wrap.replaceChildren();

  const { timing, anchor } = meetingState();

  wrap.appendChild(el('h2', { text: 'The standing time' }));
  const moving = anchor.action === 'move';
  wrap.appendChild(el('div', { class: `card ${moving ? 'bad' : 'good'}` }, [
    el('h3', { text: moving ? `Move it to ${anchor.best.label}` : `Keep ${anchor.incumbent?.label ?? anchor.best?.label}` }),
    el('p', { text: anchor.rationale }),
  ]));

  if (moving) {
    const monday = anchor.ranked.find((c) => c.pattern.weekday === 1);
    if (monday) {
      wrap.appendChild(el('p', { class: 'hint' },
        `Monday scores ${monday.score.toFixed(2)} against ${anchor.best.score.toFixed(2)}. `
        + `A clash that repeats every week is not outvoted by one week of goodwill.`));
    }
  }

  wrap.appendChild(el('h2', { text: 'This round' }));
  const top = timing.ranked.slice(0, 4);
  const table = el('table', {}, [
    el('thead', {}, el('tr', {}, [
      el('th', { text: 'Slot' }), el('th', { class: 'num', text: 'In' }),
      el('th', { class: 'num', text: 'Score' }), el('th', { text: '' }),
    ])),
    el('tbody', {}, top.map((r) => el('tr', {}, [
      el('td', { text: formatSlot(r.slot, TZ) }),
      el('td', { class: 'num', text: `${r.attendees.length + r.ifNeeded.length}/${HOUSE.length}` }),
      el('td', { class: 'num', text: r.score.toFixed(2) }),
      el('td', {}, el('span', {
        class: `tag ${r.viable ? 'clear' : 'upheld'}`,
        text: r.viable ? 'viable' : 'short',
      })),
    ]))),
  ]);
  wrap.appendChild(el('div', { class: 'scroll-x' }, table));

  if (timing.nonResponders.length) {
    wrap.appendChild(el('p', { class: 'hint' },
      `Not answered at all: ${timing.nonResponders.map(nameOf).join(', ')}. `
      + `They score as zero, so chasing them is the fastest way to change the answer.`));
  }

  wrap.appendChild(el('h2', { text: 'Your availability' }));
  wrap.appendChild(el('p', { class: 'hint' }, 'Tap to cycle: yes → if needed → no → clear. Dashed means it clashes with something you declared.'));
  wrap.appendChild(renderGrid());

  wrap.appendChild(el('h2', { text: 'Can’t make the fixed time?' }));
  wrap.appendChild(el('p', { class: 'hint' },
    'A recurring clash is free and re-picks the standing time permanently. '
    + 'An ad-hoc one spends from a budget of two per period.'));

  const me = HOUSE.find((p) => p.id === state.me);
  const veto = state.veto[state.me];
  wrap.appendChild(el('div', { class: 'card' }, [
    el('p', {}, `${me.name} has used ${veto.used} of ${veto.budget} ad-hoc moves this period.`),
    el('div', { class: 'btn-row' }, [
      el('button', {
        class: 'btn', type: 'button',
        onclick: () => {
          const decision = evaluateRefix(
            { participantId: state.me, reason: 'something came up' },
            { ...veto, participantId: state.me, periodStart: WEEK }, me,
          );
          if (decision.consumedToken) veto.used += 1;
          state.refixNote = decision;
          renderMeeting();
        },
      }, 'Something came up (ad-hoc)'),
      el('button', {
        class: 'btn', type: 'button',
        onclick: () => {
          state.refixNote = evaluateRefix(
            { participantId: state.me, reason: 'recurring commitment', standingConflict: true },
            { ...veto, participantId: state.me, periodStart: WEEK }, me,
          );
          renderMeeting();
        },
      }, 'It’s every week (recurring)'),
    ]),
  ]));

  if (state.refixNote) {
    const d = state.refixNote;
    wrap.appendChild(el('div', {
      class: `card ${d.outcome === 'proceed-without' ? 'bad' : 'accent'}`,
    }, [
      el('h3', { text: d.outcome.replace(/-/g, ' ') }),
      el('p', { text: d.rationale }),
    ]));
  }

  wrap.appendChild(el('h2', { text: 'Agenda' }));
  const { agenda } = ledgerState();
  if (agenda.length === 0) {
    wrap.appendChild(el('p', { class: 'empty', text: 'Nothing outstanding. Short meeting.' }));
  } else {
    const box = el('div', { class: 'card' });
    for (const item of agenda) {
      box.appendChild(el('div', { class: 'agenda-item' }, [
        el('div', { class: 'k', text: item.kind.replace(/-/g, ' ') }),
        el('div', { class: 't', text: item.title }),
        el('div', { class: 'd', text: item.detail }),
      ]));
    }
    wrap.appendChild(box);
  }
}

function renderGrid() {
  const box = el('div');
  const cycle = { undefined: 'yes', yes: 'ifneed', ifneed: 'no', no: undefined };
  const me = HOUSE.find((p) => p.id === state.me);

  const byDay = new Map();
  for (const slot of slots.slice(0, 21)) {
    const key = slot.id.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(slot);
  }

  for (const [day, daySlots] of byDay) {
    const date = new Date(`${day}T12:00:00Z`);
    const row = el('div', { class: 'grid-row' }, [
      el('div', { class: 'd', text: new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', timeZone: TZ }).format(date) }),
    ]);

    daySlots.forEach((slot, i) => {
      const value = state.responses[state.me]?.[slot.id];
      // Use the engine's own overlap check rather than re-deriving weekdays
      // here — this is the same predicate that decides scoring, so the dashed
      // border can never disagree with the score.
      const clash = (me.standingConflicts ?? [])
        .find((c) => collidesWithStandingConflict(slot, c, TZ));

      row.appendChild(el('button', {
        class: 'slot', type: 'button',
        'data-v': value ?? '',
        'data-conflict': clash ? '' : null,
        title: clash ? `${formatSlot(slot, TZ)} — clashes with ${clash.label}` : formatSlot(slot, TZ),
        onclick: (e) => {
          const next = cycle[String(state.responses[state.me]?.[slot.id])];
          state.responses[state.me] ??= {};
          if (next) state.responses[state.me][slot.id] = next;
          else delete state.responses[state.me][slot.id];
          e.currentTarget.setAttribute('data-v', state.responses[state.me][slot.id] ?? '');
        },
      }, BANDS[i]));
    });

    box.appendChild(row);
  }
  return box;
}

function renderChores() {
  const wrap = $('#panel-chores');
  wrap.replaceChildren();

  const { settlements } = ledgerState();
  const mine = state.claims.filter((c) => c.participantId === state.me);
  const mineTaskIds = new Set(mine.map((c) => c.taskId));

  wrap.appendChild(el('h2', { text: `Board — week of ${WEEK}` }));
  wrap.appendChild(el('p', { class: 'hint' },
    `Four of eight. ${formatMoney(CHORE_CONFIG.finePerMissedTaskCents)} per task short. `
    + `Nobody has to accuse anyone — the week just closes.`));

  const grid = el('div', { class: 'chore-grid' });
  for (const task of TASKS) {
    const claimants = state.claims.filter((c) => c.taskId === task.id);
    const challenged = claimants.some((c) => c.challengedBy?.length);
    grid.appendChild(el('div', {
      class: 'chore',
      'data-mine': mineTaskIds.has(task.id) ? '' : null,
      'data-challenged': challenged ? '' : null,
    }, [
      el('button', {
        class: 'btn', type: 'button',
        onclick: () => {
          if (mineTaskIds.has(task.id)) {
            state.claims = state.claims.filter(
              (c) => !(c.participantId === state.me && c.taskId === task.id));
          } else {
            state.claims.push({
              participantId: state.me, taskId: task.id, weekOf: WEEK,
              claimedAt: new Date().toISOString(),
            });
          }
          renderChores();
        },
      }, mineTaskIds.has(task.id) ? '✓ Done' : 'Tick'),
      el('span', { class: 'name', text: task.label }),
      el('span', { class: 'who', text: claimants.length ? claimants.map((c) => nameOf(c.participantId)).join(', ') : '—' }),
    ]));
  }
  wrap.appendChild(grid);

  wrap.appendChild(el('h2', { text: 'Where everyone is' }));
  const people = el('div', { class: 'progress-people' });
  for (const s of settlements) {
    people.appendChild(el('div', { class: 'pp', 'data-short': s.shortfall > 0 ? '' : null }, [
      el('span', { text: nameOf(s.participantId) }),
      el('span', { class: 'track' }, el('i', {
        style: `width:${Math.min(100, (s.completed / CHORE_CONFIG.tasksRequired) * 100)}%`,
      })),
      el('span', { class: 'n', text: `${s.completed}/${s.required}` }),
    ]));
  }
  wrap.appendChild(people);

  const challengedNote = settlements.find((s) => s.challenged > 0);
  if (challengedNote) {
    wrap.appendChild(el('p', { class: 'hint' },
      `${nameOf(challengedNote.participantId)} has a challenged claim. It does not count until the `
      + `meeting resolves it, and re-ticking the box will not clear the challenge.`));
  }
}

function renderIssues() {
  const wrap = $('#panel-issues');
  wrap.replaceChildren();

  const { issueOutcome } = ledgerState();

  wrap.appendChild(el('h2', { text: 'Open issue' }));
  wrap.appendChild(el('div', { class: 'card accent' }, [
    el('h3', { text: DEMO_ISSUE.description }),
    el('p', { text: `Raised by ${nameOf(DEMO_ISSUE.raisedBy)}. Poll has closed.` }),
  ]));

  wrap.appendChild(el('p', { class: 'hint' },
    'Answering costs nothing. Not answering is the part that gets named.'));

  const row = el('div', { class: 'btn-row' }, [
    el('button', {
      class: `btn ${state.issueAnswers[state.me] === 'was-me' ? 'primary' : ''}`,
      type: 'button',
      onclick: () => { state.issueAnswers[state.me] = 'was-me'; renderIssues(); },
    }, 'Was me'),
    el('button', {
      class: `btn ${state.issueAnswers[state.me] === 'not-me' ? 'primary' : ''}`,
      type: 'button',
      onclick: () => { state.issueAnswers[state.me] = 'not-me'; renderIssues(); },
    }, 'Not me'),
  ]);
  wrap.appendChild(row);

  wrap.appendChild(el('h2', { text: 'Outcome' }));
  wrap.appendChild(el('div', {
    class: `card ${issueOutcome.escalate ? 'bad' : 'good'}`,
  }, [
    el('h3', { text: issueOutcome.status.replace(/-/g, ' ') }),
    el('p', { text: describeIssueOutcome(issueOutcome, nameOf) }),
  ]));

  if (issueOutcome.silent.length) {
    wrap.appendChild(el('p', { class: 'hint' },
      `Silence is not an exit: ${issueOutcome.silent.map(nameOf).join(', ')} `
      + `${issueOutcome.silent.length === 1 ? 'is' : 'are'} named, and it goes on the agenda.`));
  }
}

function renderLedger() {
  const wrap = $('#panel-ledger');
  wrap.replaceChildren();

  const { outcomes, offenders } = ledgerState();

  wrap.appendChild(el('h2', { text: `Fines — week of ${WEEK}` }));
  wrap.appendChild(el('p', { class: 'hint' },
    'Undisputed fines uphold themselves. A dispute is heard only from someone who was at the meeting.'));

  wrap.appendChild(el('div', { class: 'scroll-x' }, el('table', {}, [
    el('thead', {}, el('tr', {}, [
      el('th', { text: 'Who' }), el('th', { class: 'num', text: 'Done' }),
      el('th', { class: 'num', text: 'Owes' }), el('th', { text: 'State' }),
      el('th', { text: 'Note' }),
    ])),
    el('tbody', {}, outcomes.map((o) => el('tr', {}, [
      el('td', { text: nameOf(o.participantId) }),
      el('td', { class: 'num', text: `${o.completed}/${o.required}` }),
      el('td', { class: 'num', text: o.fineCents ? formatMoney(o.fineCents) : '—' }),
      el('td', {}, el('span', {
        class: `tag ${o.state === 'upheld' ? 'upheld' : o.state === 'disputed' ? 'disputed' : 'clear'}`,
        text: o.state,
      })),
      el('td', { text: o.outcomeNote }),
    ]))),
  ])));

  wrap.appendChild(el('h2', { text: 'Who the house keeps relitigating' }));
  wrap.appendChild(el('p', { class: 'hint' },
    'Orders the agenda so recurring problems get discussed while people are still in the room. Not a verdict.'));
  wrap.appendChild(el('div', { class: 'scroll-x' }, el('table', {}, [
    el('thead', {}, el('tr', {}, [
      el('th', { text: 'Who' }), el('th', { class: 'num', text: 'Owned' }),
      el('th', { class: 'num', text: 'Silent' }), el('th', { class: 'num', text: 'Fines' }),
      el('th', { class: 'num', text: 'Missed' }), el('th', { class: 'num', text: 'Score' }),
    ])),
    el('tbody', {}, offenders.filter((o) => o.score > 0).map((o) => el('tr', {}, [
      el('td', { text: nameOf(o.participantId) }),
      el('td', { class: 'num', text: String(o.ownedIssues) }),
      el('td', { class: 'num', text: String(o.unresolvedNearMisses) }),
      el('td', { class: 'num', text: String(o.upheldFines) }),
      el('td', { class: 'num', text: String(o.meetingsMissed) }),
      el('td', { class: 'num', text: String(o.score) }),
    ]))),
  ])));
}

/* ── Shell ────────────────────────────────────────────────────────────────── */

function renderAll() {
  const { anchor } = meetingState();
  $('#standing').innerHTML = anchor.action === 'move'
    ? `standing time <b>should move</b> to ${anchor.best.label}`
    : `standing time <b>${anchor.incumbent?.label ?? '—'}</b>`;

  document.querySelectorAll('nav.tabs button').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.tab === state.tab));
  });
  document.querySelectorAll('.panel').forEach((p) => {
    p.toggleAttribute('data-active', p.id === `panel-${state.tab}`);
  });

  if (state.tab === 'meeting') renderMeeting();
  if (state.tab === 'chores') renderChores();
  if (state.tab === 'issues') renderIssues();
  if (state.tab === 'ledger') renderLedger();
  if (state.tab === 'pot') renderPot();
}

/**
 * The pot. Seeds each stake with the buy-in, deducts this week's fines from the
 * chore ledger, and previews the end-of-period split — so the mechanic that
 * makes a fine collectable-without-chasing is visible before it's deployed.
 */
function renderPot() {
  const wrap = $('#panel-pot');
  wrap.replaceChildren();

  const cfg = state.pot;
  const money = (cents) => `$${(cents / 100).toFixed(2)}`;

  // Fines come straight from the chore board — same numbers as the Ledger tab.
  const settlements = settleWeek({
    weekOf: WEEK, participantIds: HOUSE.map((p) => p.id),
    claims: state.claims, config: { ...CHORE_CONFIG, finePerMissedTaskCents: cfg.finePerMissedTaskCents },
  });
  const finesByMember = Object.fromEntries(settlements.map((s) => [s.participantId, s.fineCents]));

  let stakes = openPot(HOUSE.map((p) => p.id), cfg);
  stakes = applyWeekFines(stakes, finesByMember);
  const state_ = potState(stakes);
  const dist = distributePot(stakes, cfg);
  const advice = recommendPot(cfg, CHORE_CONFIG.tasksRequired);

  wrap.appendChild(el('h2', { text: 'The pot' }));
  wrap.appendChild(el('p', { class: 'hint' },
    'Everyone stakes a buy-in up front. Fines come out of the stake — nobody sends anyone '
    + 'an invoice. What’s left is yours; the fines get shared out when the term closes.'));

  // Controls: buy-in and fine, with the runway warning.
  const controls = el('div', { class: 'card' }, [
    el('div', { class: 'rows' }, [
      potSlider('Buy-in per person', cfg.buyInCents, 1000, 30000, 1000, (v) => { cfg.buyInCents = v; renderPot(); }),
      potSlider('Fine per task missed', cfg.finePerMissedTaskCents, 100, 10000, 100, (v) => { cfg.finePerMissedTaskCents = v; renderPot(); }),
    ]),
    el('div', {
      class: `card ${advice.ok ? 'good' : 'bad'}`,
      style: 'margin:10px 0 0',
    }, [el('p', { text: advice.note })]),
  ]);
  wrap.appendChild(controls);

  wrap.appendChild(el('h2', { text: `This week — pot holds ${money(state_.totalCents)}` }));
  const people = el('div', { class: 'progress-people' });
  for (const s of state_.stakes) {
    const pct = Math.round((s.remainingCents / s.openingCents) * 100);
    people.appendChild(el('div', { class: 'pp', 'data-short': s.clean ? null : '' }, [
      el('span', { text: nameOf(s.memberId) }),
      el('span', { class: 'track' }, el('i', { style: `width:${pct}%` })),
      el('span', { class: 'n', text: s.overflowCents > 0 ? `-${money(s.overflowCents)}!` : money(s.remainingCents) }),
    ]));
  }
  wrap.appendChild(people);

  if (state_.overflows.length) {
    wrap.appendChild(el('p', { class: 'hint' },
      `${state_.overflows.map((o) => nameOf(o.memberId)).join(', ')} `
      + `${state_.overflows.length === 1 ? 'has' : 'have'} been fined past the stake — that part is a real `
      + `debt the pot can’t cover. This is exactly the case a $100 fine on a small buy-in creates.`));
  }

  wrap.appendChild(el('h2', { text: 'If the term closed now' }));
  wrap.appendChild(el('div', { class: 'card good' }, [el('p', { text: dist.summary })]));
  wrap.appendChild(el('div', { class: 'scroll-x' }, el('table', {}, [
    el('thead', {}, el('tr', {}, [
      el('th', { text: 'Who' }), el('th', { class: 'num', text: 'Stake back' }),
      el('th', { class: 'num', text: 'Bonus' }), el('th', { class: 'num', text: 'Gets' }),
    ])),
    el('tbody', {}, dist.payouts.map((p) => el('tr', {}, [
      el('td', { text: nameOf(p.memberId) }),
      el('td', { class: 'num', text: money(p.stakeBackCents) }),
      el('td', { class: 'num', text: p.bonusCents ? `+${money(p.bonusCents)}` : '—' }),
      el('td', { class: 'num', text: money(p.totalCents) }),
    ]))),
  ])));

  wrap.appendChild(el('p', { class: 'hint' },
    'Distribution: fines go to whoever finished the week clean — the tidy housemates are '
    + 'literally paid out of the messy ones, and no one had to ask for a cent. Switch it to a '
    + 'house fund (a dinner, the bond) if that feels friendlier.'));
}

function potSlider(label, valueCents, minCents, maxCents, stepCents, onInput) {
  const out = el('span', { class: 'v', text: `$${(valueCents / 100).toFixed(0)}` });
  const input = el('input', {
    type: 'range', min: String(minCents), max: String(maxCents), step: String(stepCents),
    value: String(valueCents), style: 'width:140px',
    oninput: (e) => onInput(Number(e.target.value)),
  });
  return el('div', { class: 'row' }, [
    el('span', { class: 'k', text: label }),
    el('span', { style: 'display:flex;align-items:center;gap:10px' }, [input, out]),
  ]);
}

document.addEventListener('DOMContentLoaded', () => {
  const picker = $('#me');
  for (const person of HOUSE) {
    picker.appendChild(el('option', { value: person.id, text: person.name }));
  }
  picker.value = state.me;
  picker.addEventListener('change', (e) => { state.me = e.target.value; state.refixNote = null; renderAll(); });

  document.querySelectorAll('nav.tabs button').forEach((b) => {
    b.addEventListener('click', () => { state.tab = b.dataset.tab; renderAll(); });
  });

  renderAll();
});
