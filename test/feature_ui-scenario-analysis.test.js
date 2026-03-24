import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getToggleableStates,
  getToggleableRoles,
  getToggleableEvents,
  applyToggles,
  getImpactSummary,
  getImpactHighlights,
  createEmptyToggleState,
} from '../src/ui-scenario-analysis/index.js';

// ── Fixtures ────────────────────────────────────────────────────────

const CLAIM = 'MAIN_CLAIM_ENGLAND';

const states = [
  { id: 's1', technicalName: 'DRAFT', uiLabel: 'Draft', claimType: CLAIM, isDraftLike: true, isLive: false, isEndState: false, completeness: 80 },
  { id: 's2', technicalName: 'ISSUED', uiLabel: 'Issued', claimType: CLAIM, isDraftLike: false, isLive: true, isEndState: false, completeness: 100 },
  { id: 's3', technicalName: 'CLOSED', uiLabel: 'Closed', claimType: CLAIM, isDraftLike: false, isLive: false, isEndState: true, completeness: 100 },
  { id: 's4', technicalName: 'ORPHAN', uiLabel: 'Orphan', claimType: CLAIM, isDraftLike: false, isLive: true, isEndState: false, completeness: 50 },
];

const transitions = [
  { from: 's1', to: 's2', condition: 'Submit', isSystemTriggered: false, isTimeBased: false },
  { from: 's2', to: 's3', condition: 'Close', isSystemTriggered: false, isTimeBased: false },
];

const events = [
  { id: 'e1', name: 'Submit case', claimType: CLAIM, state: 's1', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Claimant: true, Judge: false } },
  { id: 'e2', name: 'Close case', claimType: CLAIM, state: 's2', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: true, Claimant: false } },
  { id: 'e3', name: 'Review case', claimType: CLAIM, state: 's2', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: true, Caseworker: true } },
];

const roles = ['Judge', 'Claimant', 'Caseworker'];

// ── 1. getToggleableStates ──────────────────────────────────────────

describe('getToggleableStates', () => {
  it('USA-01: returns correct shape with id, label, isToggled for each state', () => {
    const result = getToggleableStates(states);
    assert.equal(result.length, 4);
    assert.equal(result[0].id, 's1');
    assert.equal(result[0].label, 'Draft');
    assert.equal(result[0].isToggled, false);
  });

  it('USA-02: preserves input ordering', () => {
    const result = getToggleableStates(states);
    assert.deepEqual(result.map((r) => r.id), ['s1', 's2', 's3', 's4']);
  });

  it('USA-03: returns empty array for empty input', () => {
    const result = getToggleableStates([]);
    assert.deepEqual(result, []);
  });
});

// ── 2. getToggleableRoles ───────────────────────────────────────────

describe('getToggleableRoles', () => {
  it('USA-04: returns correct shape for each role', () => {
    const result = getToggleableRoles(roles);
    assert.equal(result.length, 3);
    assert.equal(result[0].id, 'Judge');
    assert.equal(result[0].label, 'Judge');
    assert.equal(result[0].isToggled, false);
  });

  it('USA-05: returns empty array for empty input', () => {
    const result = getToggleableRoles([]);
    assert.deepEqual(result, []);
  });
});

// ── 3. getToggleableEvents ──────────────────────────────────────────

describe('getToggleableEvents', () => {
  it('USA-06: returns correct shape with id, label, state, isToggled', () => {
    const result = getToggleableEvents(events);
    assert.equal(result.length, 3);
    assert.equal(result[0].id, 'e1');
    assert.equal(result[0].label, 'Submit case');
    assert.equal(result[0].state, 's1');
    assert.equal(result[0].isToggled, false);
  });

  it('USA-07: preserves input ordering', () => {
    const result = getToggleableEvents(events);
    assert.deepEqual(result.map((r) => r.id), ['e1', 'e2', 'e3']);
  });
});

// ── 4. applyToggles ────────────────────────────────────────────────

describe('applyToggles', () => {
  it('USA-08: removes toggled states and their transitions/events', () => {
    const result = applyToggles(states, transitions, events, ['s2'], [], []);
    assert.ok(!result.states.find((s) => s.id === 's2'));
    assert.ok(!result.transitions.find((t) => t.from === 's2' || t.to === 's2'));
    assert.ok(!result.events.find((e) => e.state === 's2'));
  });

  it('USA-09: removes events when sole-performer role is toggled', () => {
    const result = applyToggles(states, transitions, events, [], ['Claimant'], []);
    // e1 has only Claimant as active actor, should be removed
    assert.ok(!result.events.find((e) => e.id === 'e1'));
    // e2 and e3 should remain (Judge is active)
    assert.ok(result.events.find((e) => e.id === 'e2'));
    assert.ok(result.events.find((e) => e.id === 'e3'));
  });

  it('USA-10: removes toggled events directly', () => {
    const result = applyToggles(states, transitions, events, [], [], ['e2']);
    assert.ok(!result.events.find((e) => e.id === 'e2'));
    assert.ok(result.events.find((e) => e.id === 'e1'));
  });

  it('USA-11: returns unmodified data when no toggles applied', () => {
    const result = applyToggles(states, transitions, events, [], [], []);
    assert.equal(result.states.length, states.length);
    assert.equal(result.transitions.length, transitions.length);
    assert.equal(result.events.length, events.length);
  });
});

// ── 5. getImpactSummary ────────────────────────────────────────────

describe('getImpactSummary', () => {
  it('USA-12: returns correct micro count and items for toggled event', () => {
    const result = getImpactSummary(states, transitions, events, ['s2'], [], []);
    assert.ok(result.micro.count > 0);
    assert.ok(Array.isArray(result.micro.items));
    assert.equal(result.micro.count, result.micro.items.length);
  });

  it('USA-13: returns correct meso count and items', () => {
    const result = getImpactSummary(states, transitions, events, ['s2'], [], []);
    assert.ok(typeof result.meso.count === 'number');
    assert.ok(Array.isArray(result.meso.items));
    assert.equal(result.meso.count, result.meso.items.length);
  });

  it('USA-14: returns correct macro count, items, and canReachEnd', () => {
    const result = getImpactSummary(states, transitions, events, ['s2'], [], []);
    assert.ok(typeof result.macro.count === 'number');
    assert.ok(Array.isArray(result.macro.items));
    assert.equal(typeof result.macro.canReachEnd, 'boolean');
  });

  it('USA-15: returns summary string', () => {
    const result = getImpactSummary(states, transitions, events, [], [], []);
    assert.ok(typeof result.summary === 'string');
    assert.ok(result.summary.length > 0);
  });
});

// ── 6. getImpactHighlights ─────────────────────────────────────────

describe('getImpactHighlights', () => {
  it('USA-16: maps removed states to removed', () => {
    const result = getImpactSummary(states, transitions, events, ['s2'], [], []);
    const highlights = getImpactHighlights(states, result);
    assert.equal(highlights.get('s2'), 'removed');
  });

  it('USA-17: maps unreachable states to unreachable', () => {
    // Removing s2 breaks path from s1 to s3, making s3 unreachable
    const result = getImpactSummary(states, transitions, events, ['s2'], [], []);
    const highlights = getImpactHighlights(states, result);
    assert.equal(highlights.get('s3'), 'unreachable');
  });

  it('USA-18: maps unaffected states to normal', () => {
    const result = getImpactSummary(states, transitions, events, [], [], []);
    const highlights = getImpactHighlights(states, result);
    assert.equal(highlights.get('s1'), 'normal');
    assert.equal(highlights.get('s2'), 'normal');
  });
});

// ── 7. createEmptyToggleState ──────────────────────────────────────

describe('createEmptyToggleState', () => {
  it('USA-19: returns empty arrays for all three fields', () => {
    const result = createEmptyToggleState();
    assert.deepEqual(result.stateIds, []);
    assert.deepEqual(result.roles, []);
    assert.deepEqual(result.eventIds, []);
  });
});
