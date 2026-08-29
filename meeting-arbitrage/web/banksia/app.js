/**
 * Banksia.
 *
 * Runs the same engine bundle the Worker runs, so what the house sees here and
 * what the deployed system decides are the same code. In demo mode (no group
 * id in the URL) it seeds the real house — Isaac's Monday football clash, Pete
 * with one chore ticked — so the mechanics can be seen working before anything
 * is deployed.
 *
 * Three screens and no more. Everything that used to be a tab of its own —
 * ledger, pot, offender table — either folded into one line on the Board or was
 * cut. A house tool that requires reading does not get opened.
 */

import {
  generateGrid, formatSlot, scoreSlots, recommendAnchor, collidesWithStandingConflict,
  DEFAULT_TASKS, boardStanding, behind,
  validateJoin, describeAvailability, DATA_USE,
  reminderPolicy, DEFAULT_REMINDER_CONFIG,
  raiseAnonymous, anonymousAgenda, resolveAnonymous, softenNote, ISSUE_AREAS,
} from '../shared/engine.js';

const TZ = 'Australia/Sydney';
const TIMES = ['18:30', '19:30', '20:30'];
const BANDS = { '18:30': '6:30', '19:30': '7:30', '20:30': '8:30' };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const REQUIRED = DEFAULT_REMINDER_CONFIG.tasksRequired;
const STAKE = DEFAULT_REMINDER_CONFIG.stakeCents / 100;

const HOUSE = [
  { id: 'hassaan', name: 'Hassaan', attendanceRate: 1.0 },
  {
    id: 'isaac', name: 'Isaac', attendanceRate: 0.9,
    standingConflicts: [{ weekday: 1, startMin: 19 * 60, endMin: 21 * 60, label: 'football' }],
  },
  { id: 'kez', name: 'Kez', attendanceRate: 0.9 },
  { id: 'ross', name: 'Ross', attendanceRate: 0.8 },
  { id: 'eyong', name: 'Eyong', attendanceRate: 0.8 },
  { id: 'pete', name: 'Pete', attendanceRate: 0.2 },
  { id: 'manan', name: 'Manan', attendanceRate: 0.7 },
];

const WEEK = mondayOf(new Date());
const slots = generateGrid({
  startDate: WEEK, days: 14, times: TIMES, durationMins: 60, timeZone: TZ,
});

const state = {
  me: 'hassaan',
  tab: 'board',
  board: { weekOf: WEEK, tasks: DEFAULT_TASKS, ticks: seedTicks() },
  responses: seedResponses(),
  anon: seedAnon(),
  issues: [{
    id: 'issue-pan',
    description: 'Pan of noodles left on the stove since Tuesday.',
    answers: { hassaan: 'not-me', kez: 'not-me', isaac: 'not-me' },
  }],
  draft: { name: '', phone: '', email: '', slots: [], varies: false, calendar: false },
  step: 0,
};

/* ── Small helpers ────────────────────────────────────────────────────────── */

const $ = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function toast(message) {
  const node = $('toast');
  node.textContent = message;
  node.setAttribute('data-show', '');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.removeAttribute('data-show'), 2400);
}

function mondayOf(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().slice(0, 10);
}

function nameOf(id) {
  return HOUSE.find((m) => m.id === id)?.name ?? id;
}

/* ── Onboarding ───────────────────────────────────────────────────────────── */
/* Four questions. The order matters: the message-volume promise is on screen
   at the moment the phone number is asked for, not two steps later, because a
   promise made after the fact is not a promise. */

function renderOnboarding() {
  const policy = $('policy');
  policy.replaceChildren(...reminderPolicy().map((line) => {
    const li = el('li');
    li.append(el('b', null, line));
    return li;
  }));

  const uses = $('uses');
  uses.replaceChildren(...DATA_USE.map((use) => {
    const li = el('li');
    li.append(el('b', null, use.label), el('span', null, use.detail));
    return li;
  }));

  const grid = $('ob-grid');
  grid.replaceChildren(...[1, 2, 3, 4, 0].map((weekday) => {
    const wrap = el('div', 'day');
    wrap.append(el('span', null, DAYS[weekday] === 'Sun' ? 'Sunday' : fullDay(weekday)));
    const chips = el('div', 'chips');
    for (const time of TIMES) {
      const chip = el('button', 'chip', BANDS[time]);
      chip.type = 'button';
      chip.setAttribute('aria-pressed', 'false');
      chip.addEventListener('click', () => {
        const key = `${weekday}@${time}`;
        const at = state.draft.slots.indexOf(key);
        if (at === -1) state.draft.slots.push(key); else state.draft.slots.splice(at, 1);
        chip.setAttribute('aria-pressed', String(at === -1));
      });
      chips.append(chip);
    }
    wrap.append(chips);
    return wrap;
  }));

  // Picking a calendar sync means the grid is no longer the thing answering,
  // so it stops pretending to be required.
  $('ob-calendar').addEventListener('change', (event) => {
    state.draft.calendar = event.target.checked;
    $('opt-calendar').toggleAttribute('data-on', event.target.checked);
    grid.style.opacity = event.target.checked ? '.45' : '1';
  });
  $('ob-varies').addEventListener('change', (event) => {
    state.draft.varies = event.target.checked;
    $('opt-varies').toggleAttribute('data-on', event.target.checked);
  });
  $('ob-consent').addEventListener('change', (event) => {
    $('opt-consent').toggleAttribute('data-on', event.target.checked);
  });

  for (const button of document.querySelectorAll('[data-next]')) {
    button.addEventListener('click', () => goStep(Number(button.dataset.next) + 1));
  }
  for (const button of document.querySelectorAll('[data-back]')) {
    button.addEventListener('click', () => goStep(Number(button.dataset.back) - 1));
  }
  $('ob-join').addEventListener('click', finishOnboarding);
}

function fullDay(weekday) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday];
}

function goStep(next) {
  state.step = Math.max(0, Math.min(3, next));
  for (let i = 0; i <= 3; i++) {
    $(`step-${i}`).toggleAttribute('data-active', i === state.step);
    $('steps').children[i].toggleAttribute('data-on', i <= state.step);
  }
  window.scrollTo({ top: 0 });
}

function collectDraft() {
  return {
    name: $('ob-name').value,
    phone: $('ob-phone').value || undefined,
    email: $('ob-email').value || undefined,
    availability: {
      mode: state.draft.calendar ? 'calendar' : (state.draft.varies ? 'varies' : 'fixed'),
      slots: state.draft.slots.map((key) => {
        const [weekday, time] = key.split('@');
        return { weekday: Number(weekday), time };
      }),
    },
    acceptedDataUse: $('ob-consent').checked,
  };
}

/**
 * Validate with the same function the Worker uses, so the form cannot accept
 * something the server will then reject — the classic way a join flow strands
 * someone on a screen with no explanation.
 */
function finishOnboarding() {
  const draft = collectDraft();
  const result = validateJoin(draft, []);
  const error = $('ob-err');

  if (!result.ok) {
    error.textContent = result.errors[0];
    error.hidden = false;
    return;
  }
  error.hidden = true;

  // Demo mode: the new housemate joins the seeded house rather than replacing
  // it, so the board immediately has someone on it who is short.
  const id = result.member.name.toLowerCase().replace(/[^a-z]/g, '') || 'you';
  if (!HOUSE.some((m) => m.id === id)) {
    HOUSE.push({ id, name: result.member.name, attendanceRate: 1 });
  }
  state.me = id;

  $('onboard').hidden = true;
  $('app').hidden = false;
  renderApp();
  toast(`Welcome, ${result.member.name} — ${describeAvailability(result.member.availability)}`);
}

/* ── Board ────────────────────────────────────────────────────────────────── */

function renderBoard() {
  const panel = $('panel-board');
  const standings = boardStanding(state.board, HOUSE, REQUIRED);
  const mine = standings.find((s) => s.memberId === state.me);

  panel.replaceChildren();

  // The whole money rule, in two lines. It used to be a fine, a dishonour
  // table, a pot and a distribution policy spread across four tabs; a rule
  // nobody can restate from memory is a rule nobody follows.
  const rule = el('div', 'rule');
  rule.append(
    el('b', null, `${REQUIRED} tasks a week, or it costs you $${STAKE}.`),
    el('span', null,
      `Everyone puts $${STAKE} in at the start of term. Do ${REQUIRED} tasks and you get it back. `
      + 'Nothing is invoiced and nobody has to chase anyone.'),
  );
  panel.append(rule);

  const you = el('p', 'sub',
    mine.short === 0
      ? `You're clear this week — ${mine.done} of ${REQUIRED} done.`
      : `You've done ${mine.done} of ${REQUIRED}. ${mine.short} to go.`);
  panel.append(you);

  panel.append(buildGrid());

  const tally = el('div', 'tally');
  for (const standing of standings) {
    const row = el('div', 'row');
    if (standing.short > 0) row.setAttribute('data-short', '');
    row.append(el('span', null, standing.name));
    const pips = el('div', 'pips');
    for (let i = 0; i < REQUIRED; i++) {
      const pip = el('i');
      if (i < standing.done) pip.setAttribute('data-on', '');
      pips.append(pip);
    }
    row.append(pips, el('span', 'n', `${standing.done}/${REQUIRED}`));
    tally.append(row);
  }
  panel.append(tally);

  const actions = el('div', 'btn-row');
  const upload = el('button', 'btn', '📷  Upload a photo of the board');
  upload.addEventListener('click', () => $('board-photo').click());
  actions.append(upload);
  panel.append(actions);

  const shortList = behind(standings);
  const note = el('p', 'hint', shortList.length === 0
    ? 'Everyone is on track. Banksia has nothing to send this week.'
    : `Banksia will nudge ${shortList.map((s) => s.name).join(', ')} on Thursday, `
      + 'and once more on Sunday if they are still short. Nothing else.');
  panel.append(note);

  panel.append(demoNote(
    'Tap any cell in your own column to tick a job off. The photo button reads a '
    + 'picture of the real whiteboard and adds whatever it can see — it never '
    + 'removes a tick, because a wiped board is not evidence that nothing happened.',
  ));
}

/**
 * The whiteboard, as drawn: jobs down the left, names across the top.
 *
 * The chore column is sticky and the names scroll, because seven columns do not
 * fit a phone and the row label is the half of a cell that carries the meaning.
 */
function buildGrid() {
  const scroll = el('div', 'board-scroll');
  const table = el('table', 'board');

  const head = el('tr');
  head.append(el('th', 'chore', 'This week'));
  for (const member of HOUSE) {
    const th = el('th', null, member.name.split(' ')[0]);
    if (member.id === state.me) th.setAttribute('data-me', '');
    head.append(th);
  }
  const thead = document.createElement('thead');
  thead.append(head);
  table.append(thead);

  const body = document.createElement('tbody');
  for (const task of state.board.tasks) {
    const tr = el('tr');
    const label = el('th', 'chore');
    label.append(document.createTextNode(task.label));
    if (task.cap) label.append(el('span', 'cap', `max ${task.cap}×`));
    tr.append(label);

    for (const member of HOUSE) {
      const td = el('td');
      const on = state.board.ticks.some(
        (t) => t.taskId === task.id && t.memberId === member.id,
      );
      const cell = el('button', 'cell', on ? '✓' : '');
      if (on) cell.setAttribute('data-on', '');
      if (member.id === state.me) cell.setAttribute('data-mine', '');
      cell.setAttribute('aria-label', `${task.label} — ${member.name}`);

      // Only your own column is tappable. Ticking a job off for someone else is
      // how a shared board turns into an argument about who ticked what.
      if (member.id === state.me) {
        cell.addEventListener('click', () => toggleTick(task.id));
      } else {
        cell.disabled = true;
      }
      td.append(cell);
      tr.append(td);
    }
    body.append(tr);
  }
  table.append(body);
  scroll.append(table);

  // Seven columns do not fit a phone, and the one column that matters to the
  // person holding it is their own — which for whoever joined last is the one
  // furthest off-screen. Bring it into view rather than leaving them to
  // discover the board scrolls.
  requestAnimationFrame(() => {
    const mine = table.querySelector('thead th[data-me]');
    if (!mine) return;
    const overflow = mine.offsetLeft + mine.offsetWidth - scroll.clientWidth;
    if (overflow > 0) scroll.scrollLeft = overflow + 12;
  });

  return scroll;
}

function toggleTick(taskId) {
  const at = state.board.ticks.findIndex(
    (t) => t.taskId === taskId && t.memberId === state.me,
  );
  if (at === -1) state.board.ticks.push({ taskId, memberId: state.me });
  else state.board.ticks.splice(at, 1);
  renderBoard();
}

/* ── Meeting ──────────────────────────────────────────────────────────────── */

function renderMeeting() {
  const panel = $('panel-meeting');
  panel.replaceChildren();

  const scored = scoreSlots({
    slots, participants: HOUSE, responses: state.responses, config: { timezone: TZ },
  });
  const anchor = recommendAnchor({
    slots, participants: HOUSE, responses: state.responses, config: { timezone: TZ },
  });

  const card = el('div', 'card');
  card.append(el('h3', null, 'Standing house meeting'));
  card.append(el('p', 'big', anchor.best ? anchor.best.label : 'Not set yet'));
  card.append(el('p', null, anchor.rationale));
  panel.append(card);

  // Who a proposed time actually excludes, named, because "quorum met" hides
  // the fact that it is the same person every week.
  const next = scored.ranked[0];
  if (next) {
    const detail = el('div', 'card');
    detail.append(el('h3', null, `Next: ${formatSlot(next.slot, TZ)}`));
    detail.append(el('p', null,
      `Coming: ${next.attendees.map(nameOf).join(', ') || 'nobody yet'}`));
    // Silence and a flat no are different facts and are shown as different
    // facts — one is chaseable, the other is settled.
    if (next.unknown.length > 0) {
      detail.append(el('p', null,
        `Waiting on: ${next.unknown.map(nameOf).join(', ')}`));
    }
    if (next.absent.length > 0) {
      detail.append(el('p', null, `Can't make it: ${next.absent.map(nameOf).join(', ')}`));
    }
    panel.append(detail);
  }

  const clash = HOUSE.filter((m) => (m.standingConflicts ?? []).length > 0);
  if (clash.length > 0) {
    const card2 = el('div', 'card');
    card2.append(el('h3', null, 'Standing commitments'));
    for (const member of clash) {
      for (const conflict of member.standingConflicts) {
        card2.append(el('p', null,
          `${member.name} — ${fullDay(conflict.weekday)} `
          + `${Math.floor(conflict.startMin / 60)}:${String(conflict.startMin % 60).padStart(2, '0')}, `
          + `${conflict.label}. Every slot that clashes is ruled out permanently.`));
      }
    }
    panel.append(card2);
  }

  panel.append(demoNote(
    'Declaring a recurring commitment is free and permanent — it is not a dodge, '
    + 'so it never costs anyone anything. Skipping a meeting you said you could '
    + 'make is what reduces your say over when the next one is.',
  ));
}

/* ── Raise ────────────────────────────────────────────────────────────────── */

function renderRaise() {
  const panel = $('panel-raise');
  panel.replaceChildren();

  panel.append(el('h2', null, 'Raise something, anonymously'));
  panel.append(el('p', 'sub',
    'Pick the area, not the person. If someone else raises the same thing it '
    + 'goes on the meeting agenda as a house issue rather than a callout.'));

  const bar = el('div', 'anon');
  const chips = el('div', 'chips');
  let picked = null;
  for (const area of ISSUE_AREAS) {
    const chip = el('button', 'chip', area.label);
    chip.type = 'button';
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      picked = picked === area.id ? null : area.id;
      for (const other of chips.children) other.setAttribute('aria-pressed', 'false');
      chip.setAttribute('aria-pressed', String(picked === area.id));
    });
    chips.append(chip);
  }
  bar.append(chips);

  const note = el('textarea', 'field');
  note.placeholder = 'Optional — one line about what is going on.';
  note.maxLength = 240;
  bar.append(note);

  const send = el('button', 'btn primary wide', 'Send anonymously');
  send.style.marginTop = '12px';
  send.addEventListener('click', () => {
    if (!picked) { toast('Pick an area first'); return; }
    const softened = note.value
      ? softenNote(note.value, HOUSE.map((m) => m.name))
      : undefined;
    state.anon = raiseAnonymous(state.anon, {
      area: picked, author: state.me, note: softened, now: new Date().toISOString(),
    });
    note.value = '';
    renderRaise();
    toast('Sent. Your name is not attached.');
  });
  bar.append(send);

  bar.append(el('div', 'anon-note',
    'Names are stripped from the note before it is stored, not before it is shown.'));
  panel.append(bar);

  panel.append(renderWhoDidThis());

  panel.append(el('h2', null, 'What the house can see'));
  const now = new Date().toISOString();
  const names = HOUSE.map((m) => m.name);
  const open = anonymousAgenda(state.anon, names, now);

  // Your own held flag, shown only to you. Without it a lone raise vanishes for
  // a day and the natural response is to assume it failed and raise it again —
  // or, worse, to say it out loud at dinner instead, which is the thing this
  // channel exists to avoid.
  const held = state.anon
    .filter((issue) => issue.contributions.some((c) => c.author === state.me))
    .map((issue) => resolveAnonymous(issue, names, now))
    .filter((outcome) => !outcome.onAgenda);
  for (const outcome of held) {
    const mine = el('div', 'issue');
    const head = el('div', 'head');
    head.append(el('span', 'area', outcome.areaLabel));
    head.append(el('span', 'status', 'Only you can see this'));
    mine.append(head, el('p', null, outcome.summary));
    panel.append(mine);
  }

  for (const outcome of open) {
    const issue = el('div', 'issue');
    const head = el('div', 'head');
    head.append(el('span', 'area', outcome.areaLabel));
    const status = el('span', 'status', 'On the agenda');
    status.setAttribute('data-agenda', '');
    head.append(status);
    issue.append(head, el('p', null, outcome.summary));
    panel.append(issue);
  }

  if (open.length === 0 && held.length === 0) {
    panel.append(el('p', 'empty', 'Nothing raised. Quiet week.'));
  }

  panel.append(demoNote(
    'A single raise waits 24 hours before it surfaces, so it cannot be a same-day '
    + 'jab at whoever you just argued with. Two people raising the same area is '
    + 'consensus and goes up immediately.',
  ));
}

/**
 * "Who did this?" — the not-me poll.
 *
 * Separate from the anonymous channel on purpose. The anonymous channel is for
 * a pattern ("the kitchen keeps being left"); this is for one specific thing
 * that is sitting there right now, and it is not anonymous, because the point
 * is that somebody owns it.
 *
 * The mechanic that makes it work is that not answering is its own answer. A
 * poll that only counts the people who reply lets the person responsible win by
 * ignoring it, which is the exact behaviour it exists to price.
 */
function renderWhoDidThis() {
  const wrap = document.createDocumentFragment();
  wrap.append(el('h2', null, 'Who did this?'));
  wrap.append(el('p', 'sub',
    'For one specific thing, right now. Everyone gets asked once; whoever does '
    + 'not answer is listed as not having answered.'));

  for (const issue of state.issues) {
    const card = el('div', 'card');
    card.append(el('h3', null, issue.description));

    const answered = Object.entries(issue.answers);
    const owned = answered.find(([, value]) => value === 'was-me');
    const silent = HOUSE.filter((m) => !(m.id in issue.answers)).map((m) => m.name);

    if (owned) {
      card.append(el('p', null, `${nameOf(owned[0])} owned it. Closed, nothing further.`));
    } else if (silent.length === 0) {
      card.append(el('p', null,
        'Everyone answered "not me". It goes to the meeting as a house problem, '
        + 'not as an accusation.'));
    } else {
      card.append(el('p', null, `Still to answer: ${silent.join(', ')}`));
      if (!(state.me in issue.answers)) {
        const row = el('div', 'btn-row');
        const was = el('button', 'btn', 'Was me');
        was.addEventListener('click', () => answerIssue(issue, 'was-me'));
        const not = el('button', 'btn', 'Not me');
        not.addEventListener('click', () => answerIssue(issue, 'not-me'));
        row.append(was, not);
        card.append(row);
      } else {
        card.append(el('p', null, issue.answers[state.me] === 'was-me'
          ? 'You owned this one.' : 'You said it was not you.'));
      }
    }
    wrap.append(card);
  }

  const ask = el('button', 'btn wide', 'Ask the house about something');
  ask.addEventListener('click', () => {
    const description = prompt('What has been left? Keep it factual.');
    if (!description?.trim()) return;
    state.issues.unshift({
      id: `issue-${Date.now()}`, description: description.trim(), answers: {},
    });
    renderRaise();
    toast('Asked. Everyone gets it once.');
  });
  wrap.append(ask);
  return wrap;
}

function answerIssue(issue, value) {
  issue.answers[state.me] = value;
  renderRaise();
  toast(value === 'was-me' ? 'Owned. That closes it.' : 'Noted.');
}

function demoNote(text) {
  return el('p', 'demo', text);
}

/* ── Photo import ─────────────────────────────────────────────────────────── */

/**
 * Demo path. A real deployment posts the image to /api/g/:id/board/photo, which
 * runs the same parse and merge server-side; here the file is accepted and the
 * merge is explained, because there is no API key in a static page.
 */
function wirePhotoUpload() {
  $('board-photo').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    toast(`Reading ${file.name}… (demo — a deployed house sends this to the Worker)`);
  });
}

/* ── Shell ────────────────────────────────────────────────────────────────── */

function renderApp() {
  const select = $('me');
  select.replaceChildren(...HOUSE.map((member) => {
    const option = el('option', null, member.name);
    option.value = member.id;
    if (member.id === state.me) option.selected = true;
    return option;
  }));

  renderBoard();
  renderMeeting();
  renderRaise();
}

function boot() {
  renderOnboarding();
  wirePhotoUpload();

  for (const button of document.querySelectorAll('nav.tabs button')) {
    button.addEventListener('click', () => {
      state.tab = button.dataset.tab;
      for (const other of document.querySelectorAll('nav.tabs button')) {
        other.setAttribute('aria-selected', String(other === button));
      }
      for (const panel of document.querySelectorAll('.panel')) {
        panel.toggleAttribute('data-active', panel.id === `panel-${state.tab}`);
      }
      window.scrollTo({ top: 0 });
    });
  }

  $('me').addEventListener('change', (event) => {
    state.me = event.target.value;
    renderApp();
  });

  // A returning housemate skips onboarding. In the demo that is anyone who
  // arrives with ?skip, so the board can be shown without filling the form.
  if (new URLSearchParams(location.search).has('skip')) {
    $('onboard').hidden = true;
    $('app').hidden = false;
    renderApp();
  }
}

/* ── Seeds ────────────────────────────────────────────────────────────────── */

function seedTicks() {
  return [
    { taskId: 'dishes', memberId: 'hassaan' },
    { taskId: 'kitchen', memberId: 'hassaan' },
    { taskId: 'bins', memberId: 'hassaan' },
    { taskId: 'vacuum', memberId: 'hassaan' },
    { taskId: 'dishes', memberId: 'isaac' },
    { taskId: 'bathrooms', memberId: 'isaac' },
    { taskId: 'plants', memberId: 'isaac' },
    { taskId: 'bins', memberId: 'kez' },
    { taskId: 'kitchen', memberId: 'kez' },
    { taskId: 'sunday-bins', memberId: 'kez' },
    { taskId: 'bin-bags', memberId: 'kez' },
    { taskId: 'vacuum', memberId: 'ross' },
    { taskId: 'bathrooms', memberId: 'eyong' },
    { taskId: 'plants', memberId: 'manan' },
    { taskId: 'bin-bags', memberId: 'manan' },
    // Pete: one, which is the whole reason any of this exists.
    { taskId: 'dishes', memberId: 'pete' },
  ];
}

function seedResponses() {
  const responses = {};
  for (const member of HOUSE) {
    responses[member.id] = {};
    for (const slot of slots) {
      if (member.id === 'pete') continue; // answers nothing; scores zero
      // One conflict at a time: the engine takes a single commitment, and
      // handing it the array silently compares against an undefined weekday,
      // which reads as "no clash" and puts Isaac at his own football night.
      const clash = (member.standingConflicts ?? []).some(
        (conflict) => collidesWithStandingConflict(slot, conflict, TZ),
      );
      if (clash) { responses[member.id][slot.id] = 'no'; continue; }
      const hour = Number(slot.id.slice(-5, -3));
      responses[member.id][slot.id] = hour === 19 ? 'yes' : 'ifneed';
    }
  }
  return responses;
}

function seedAnon() {
  const dayAgo = new Date(Date.now() - 30 * 3600 * 1000).toISOString();
  let issues = raiseAnonymous([], {
    area: 'kitchen', author: 'kez', now: dayAgo,
    note: 'Pans are being left overnight and it is always the same ones.',
  });
  issues = raiseAnonymous(issues, {
    area: 'kitchen', author: 'ross', now: new Date().toISOString(),
  });
  // Raised by whoever is viewing, so the "held, only you can see this" state is
  // visible on first load rather than being a code path nobody ever sees.
  return raiseAnonymous(issues, {
    area: 'bins', author: 'hassaan', now: new Date().toISOString(),
    note: 'Recycling has not gone out for two weeks.',
  });
}

boot();
