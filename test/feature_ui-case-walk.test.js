import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  initializeSimulation,
  getAvailableActionsPanel,
  advanceSimulation,
  getSimulationTimeline,
  getSimulationStatus,
  getRoleFilterOptions,
  getBreathingSpaceInfo,
} from '../src/ui-case-walk/index.js';

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
  { id: 'e2', name: 'Close case', claimType: CLAIM, state: 's2', isSystemEvent: false, notes: '', hasOpenQuestions: true, actors: { Judge: true, Claimant: false } },
  { id: 'e3', name: 'System tick', claimType: CLAIM, state: 's2', isSystemEvent: true, notes: '', hasOpenQuestions: false, actors: { Judge: false, Claimant: false } },
];

const breathingSpaceEntries = [
  { stateFrom: 's5', stateTo: 's2', isConditional: false, conditions: [] },
];

// ── 1. initializeSimulation ─────────────────────────────────────────

describe('initializeSimulation', () => {
  it('UCW-01: returns enriched simulation with currentState object', () => {
    const result = initializeSimulation(CLAIM, states, transitions, events);
    assert.ok(result.currentState);
    assert.equal(result.currentState.id, 's1');
    assert.equal(result.currentState.uiLabel, 'Awaiting Submission');
  });

  it('UCW-02: returns completeness badge for initial state', () => {
    const result = initializeSimulation(CLAIM, states, transitions, events);
    assert.ok(result.badge);
    assert.equal(result.badge.label, '80%');
    assert.equal(result.badge.level, 'partial');
    assert.ok(result.badge.color);
  });

  it('UCW-03: underlying simulation has correct claimTypeId and currentStateId', () => {
    const result = initializeSimulation(CLAIM, states, transitions, events);
    assert.ok(result.simulation);
    assert.equal(result.simulation.claimTypeId, CLAIM);
    assert.equal(result.simulation.currentStateId, 's1');
  });
});

// ── 2. getAvailableActionsPanel ─────────────────────────────────────

describe('getAvailableActionsPanel', () => {
  it('UCW-04: returns enriched events with event indicators', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const sim2 = advanceSimulation(enriched, 'e1');
    const panel = getAvailableActionsPanel(sim2.simulation);
    assert.ok(panel.events.length > 0);
    const ev = panel.events.find((e) => e.id === 'e2');
    assert.ok(ev);
    assert.ok(ev.indicator);
    assert.equal(ev.indicator.hasOpenQuestions, true);
  });

  it('UCW-05: filters events by role when roleFilter provided', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const panel = getAvailableActionsPanel(enriched.simulation, 'Claimant');
    assert.equal(panel.events.length, 1);
    assert.equal(panel.events[0].id, 'e1');
  });

  it('UCW-06: returns hasDeadEnd and hasEndState flags correctly', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const panel = getAvailableActionsPanel(enriched.simulation);
    assert.equal(panel.hasDeadEnd, false);
    assert.equal(panel.hasEndState, false);
    // Dead-end state
    const deadSim = { ...enriched.simulation, currentStateId: 's4' };
    const deadPanel = getAvailableActionsPanel(deadSim);
    assert.equal(deadPanel.hasDeadEnd, true);
    assert.equal(deadPanel.hasEndState, false);
    // End state
    const endSim = { ...enriched.simulation, currentStateId: 's3' };
    const endPanel = getAvailableActionsPanel(endSim);
    assert.equal(endPanel.hasEndState, true);
    assert.equal(endPanel.hasDeadEnd, false);
  });
});

// ── 3. advanceSimulation ────────────────────────────────────────────

describe('advanceSimulation', () => {
  it('UCW-07: transitions to next state and returns enriched simulation', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const result = advanceSimulation(enriched, 'e1');
    assert.equal(result.currentState.id, 's2');
    assert.equal(result.simulation.currentStateId, 's2');
  });

  it('UCW-08: new enriched simulation has updated badge for new current state', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const result = advanceSimulation(enriched, 'e1');
    assert.equal(result.badge.label, '100%');
    assert.equal(result.badge.level, 'complete');
  });
});

// ── 4. getSimulationTimeline ────────────────────────────────────────

describe('getSimulationTimeline', () => {
  it('UCW-09: returns timeline entries with step numbers starting at 1', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const sim2 = advanceSimulation(enriched, 'e1');
    const timeline = getSimulationTimeline(sim2.simulation);
    assert.equal(timeline.length, 2);
    assert.equal(timeline[0].stepNumber, 1);
    assert.equal(timeline[1].stepNumber, 2);
    assert.equal(timeline[0].stateId, 's1');
    assert.equal(timeline[1].stateId, 's2');
  });

  it('UCW-10: each timeline entry has a completeness badge', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const sim2 = advanceSimulation(enriched, 'e1');
    const timeline = getSimulationTimeline(sim2.simulation);
    assert.ok(timeline[0].badge);
    assert.equal(timeline[0].badge.label, '80%');
    assert.ok(timeline[1].badge);
    assert.equal(timeline[1].badge.label, '100%');
  });
});

// ── 5. getSimulationStatus ──────────────────────────────────────────

describe('getSimulationStatus', () => {
  it('UCW-11: returns active for simulation with available events', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const result = getSimulationStatus(enriched.simulation);
    assert.equal(result.status, 'active');
    assert.ok(typeof result.message === 'string');
    assert.ok(result.message.length > 0);
  });

  it('UCW-12: returns dead-end for stuck simulation', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const stuck = { ...enriched.simulation, currentStateId: 's4' };
    const result = getSimulationStatus(stuck);
    assert.equal(result.status, 'dead-end');
    assert.ok(result.message.length > 0);
  });

  it('UCW-13: returns completed for end state simulation', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const end = { ...enriched.simulation, currentStateId: 's3' };
    const result = getSimulationStatus(end);
    assert.equal(result.status, 'completed');
    assert.ok(result.message.length > 0);
  });
});

// ── 6. getRoleFilterOptions ─────────────────────────────────────────

describe('getRoleFilterOptions', () => {
  it('UCW-14: extracts unique roles sorted alphabetically', () => {
    const roles = getRoleFilterOptions(events);
    assert.ok(Array.isArray(roles));
    assert.ok(roles.includes('Claimant'));
    assert.ok(roles.includes('Judge'));
    // Should be sorted
    const sorted = [...roles].sort();
    assert.deepEqual(roles, sorted);
  });

  it('UCW-15: returns empty array when no actors have true values', () => {
    const noActorEvents = [
      { id: 'x1', name: 'No one', claimType: CLAIM, state: 's1', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: false, Claimant: false } },
    ];
    const roles = getRoleFilterOptions(noActorEvents);
    assert.equal(roles.length, 0);
  });
});

// ── 7. getBreathingSpaceInfo ────────────────────────────────────────

describe('getBreathingSpaceInfo', () => {
  it('UCW-16: detects breathing space with return states', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const bsSim = { ...enriched.simulation, currentStateId: 's5' };
    const info = getBreathingSpaceInfo(bsSim, breathingSpaceEntries);
    assert.equal(info.isInBreathingSpace, true);
    assert.equal(info.returnStates.length, 1);
    assert.equal(info.returnStates[0].id, 's2');
  });

  it('UCW-17: returns isInBreathingSpace false when not in breathing space', () => {
    const enriched = initializeSimulation(CLAIM, states, transitions, events);
    const info = getBreathingSpaceInfo(enriched.simulation, breathingSpaceEntries);
    assert.equal(info.isInBreathingSpace, false);
    assert.equal(info.returnStates.length, 0);
  });
});
