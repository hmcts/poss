import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  createSimulation,
  getAvailableEvents,
  applyEvent,
  isDeadEnd,
  isEndState,
  getHistory,
  filterEventsByRole,
  getReturnStates,
} from '../src/case-walk/index.js';

// ── Fixtures ────────────────────────────────────────────────────────

const CLAIM = 'MAIN_CLAIM_ENGLAND';

const states = [
  { id: 's1', technicalName: 'AWAITING_SUBMISSION', uiLabel: 'Awaiting Submission', claimType: CLAIM, isDraftLike: true, isLive: false, isEndState: false, completeness: 80 },
  { id: 's2', technicalName: 'CASE_ISSUED', uiLabel: 'Case Issued', claimType: CLAIM, isDraftLike: false, isLive: true, isEndState: false, completeness: 100 },
  { id: 's3', technicalName: 'CLOSED', uiLabel: 'Closed', claimType: CLAIM, isDraftLike: false, isLive: false, isEndState: true, completeness: 100 },
  { id: 's4', technicalName: 'ORPHAN', uiLabel: 'Orphan', claimType: CLAIM, isDraftLike: false, isLive: true, isEndState: false, completeness: 50 },
  { id: 's5', technicalName: 'BREATHING_SPACE', uiLabel: 'Breathing Space', claimType: CLAIM, isDraftLike: false, isLive: false, isEndState: false, completeness: 100 },
];

const transitions = [
  { from: 's1', to: 's2', condition: 'Submitted', isSystemTriggered: false, isTimeBased: false },
  { from: 's2', to: 's3', condition: 'Closed', isSystemTriggered: false, isTimeBased: false },
  { from: 's2', to: 's5', condition: 'Enter breathing space', isSystemTriggered: false, isTimeBased: false },
];

const events = [
  { id: 'e1', name: 'Submit case', claimType: CLAIM, state: 's1', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: false, Claimant: true } },
  { id: 'e2', name: 'Close case', claimType: CLAIM, state: 's2', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: true, Claimant: false } },
  { id: 'e3', name: 'System tick', claimType: CLAIM, state: 's2', isSystemEvent: true, notes: '', hasOpenQuestions: false, actors: { Judge: false, Claimant: false } },
];

const breathingSpaceEntries = [
  { stateFrom: 's5', stateTo: 's2', isConditional: false, conditions: [] },
];

// ── 1. createSimulation ─────────────────────────────────────────────

describe('createSimulation', () => {
  it('CW-01: creates simulation at initial state', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    assert.equal(sim.currentStateId, 's1');
    assert.equal(sim.claimTypeId, CLAIM);
  });
});

// ── 2. getAvailableEvents ───────────────────────────────────────────

describe('getAvailableEvents', () => {
  it('CW-02: returns events for current state', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const avail = getAvailableEvents(sim);
    assert.equal(avail.length, 1);
    assert.equal(avail[0].id, 'e1');
  });

  it('CW-03: returns empty array at end state', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const sim2 = applyEvent(sim, 'e1');
    const sim3 = applyEvent(sim2, 'e2');
    const avail = getAvailableEvents(sim3);
    assert.equal(avail.length, 0);
  });
});

// ── 3. applyEvent ───────────────────────────────────────────────────

describe('applyEvent', () => {
  it('CW-04: transitions to next state on valid event', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const sim2 = applyEvent(sim, 'e1');
    assert.equal(sim2.currentStateId, 's2');
  });

  it('CW-05: throws on invalid event ID', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    assert.throws(() => applyEvent(sim, 'e999'), /not found|invalid/i);
  });
});

// ── 4. isDeadEnd ────────────────────────────────────────────────────

describe('isDeadEnd', () => {
  it('CW-06: true when no events and not end state', () => {
    // Manually place sim at orphan state s4 (no events, not end state)
    const sim = createSimulation(CLAIM, states, transitions, events);
    const stuck = { ...sim, currentStateId: 's4' };
    assert.equal(isDeadEnd(stuck), true);
  });

  it('CW-07: false at end state with no events', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const end = { ...sim, currentStateId: 's3' };
    assert.equal(isDeadEnd(end), false);
  });

  it('CW-08: false when events are available', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    assert.equal(isDeadEnd(sim), false);
  });
});

// ── 5. isEndState ───────────────────────────────────────────────────

describe('isEndState', () => {
  it('CW-09: true for end state', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const end = { ...sim, currentStateId: 's3' };
    assert.equal(isEndState(end), true);
  });

  it('CW-10: false for non-end state', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    assert.equal(isEndState(sim), false);
  });
});

// ── 6. getHistory ───────────────────────────────────────────────────

describe('getHistory', () => {
  it('CW-11: tracks all visited states in order', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const sim2 = applyEvent(sim, 'e1');
    const sim3 = applyEvent(sim2, 'e2');
    const history = getHistory(sim3);
    assert.equal(history.length, 3);
    assert.equal(history[0].stateId, 's1');
    assert.equal(history[1].stateId, 's2');
    assert.equal(history[2].stateId, 's3');
    assert.equal(history[0].stateName, 'Awaiting Submission');
  });
});

// ── 7. filterEventsByRole ───────────────────────────────────────────

describe('filterEventsByRole', () => {
  it('CW-12: returns events for matching role', () => {
    const filtered = filterEventsByRole(events, 'Claimant');
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].id, 'e1');
  });

  it('CW-13: returns empty for role with no events', () => {
    const filtered = filterEventsByRole(events, 'Bailiff');
    assert.equal(filtered.length, 0);
  });
});

// ── 8. getReturnStates ──────────────────────────────────────────────

describe('getReturnStates', () => {
  it('CW-14: returns return states from breathing space', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const bsSim = { ...sim, currentStateId: 's5' };
    const returns = getReturnStates(bsSim, breathingSpaceEntries);
    assert.equal(returns.length, 1);
    assert.equal(returns[0].id, 's2');
  });

  it('CW-15: returns empty when no matching entries', () => {
    const sim = createSimulation(CLAIM, states, transitions, events);
    const returns = getReturnStates(sim, breathingSpaceEntries);
    assert.equal(returns.length, 0);
  });
});
