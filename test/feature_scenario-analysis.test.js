import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  toggleState,
  toggleRole,
  toggleEvent,
  findUnreachableStates,
  findBlockedEvents,
  canReachEndState,
  analyzeImpact,
} from '../src/scenario-analysis/index.js';

// ── Fixtures ────────────────────────────────────────────────────────

const CLAIM = 'MAIN_CLAIM_ENGLAND';

const states = [
  { id: 's1', technicalName: 'AWAITING_SUBMISSION', uiLabel: 'Awaiting Submission', claimType: CLAIM, isDraftLike: true, isLive: false, isEndState: false, completeness: 80 },
  { id: 's2', technicalName: 'CASE_ISSUED', uiLabel: 'Case Issued', claimType: CLAIM, isDraftLike: false, isLive: true, isEndState: false, completeness: 100 },
  { id: 's3', technicalName: 'CLOSED', uiLabel: 'Closed', claimType: CLAIM, isDraftLike: false, isLive: false, isEndState: true, completeness: 100 },
  { id: 's4', technicalName: 'ALTERNATE', uiLabel: 'Alternate', claimType: CLAIM, isDraftLike: false, isLive: true, isEndState: false, completeness: 60 },
  { id: 's5', technicalName: 'ORPHAN', uiLabel: 'Orphan', claimType: CLAIM, isDraftLike: false, isLive: true, isEndState: false, completeness: 50 },
];

const transitions = [
  { from: 's1', to: 's2', condition: 'Submitted', isSystemTriggered: false, isTimeBased: false },
  { from: 's2', to: 's3', condition: 'Closed', isSystemTriggered: false, isTimeBased: false },
  { from: 's2', to: 's4', condition: 'Alternate path', isSystemTriggered: false, isTimeBased: false },
];

const events = [
  { id: 'e1', name: 'Submit case', claimType: CLAIM, state: 's1', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: false, Claimant: true } },
  { id: 'e2', name: 'Close case', claimType: CLAIM, state: 's2', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: true, Claimant: false } },
  { id: 'e3', name: 'Review case', claimType: CLAIM, state: 's2', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Judge: true, Claimant: true } },
  { id: 'e4', name: 'Auto tick', claimType: CLAIM, state: 's4', isSystemEvent: true, notes: '', hasOpenQuestions: false, actors: { Judge: false, Claimant: false } },
];

// ── 1. toggleState ──────────────────────────────────────────────────

describe('toggleState', () => {
  it('SA-01: removes state and its transitions', () => {
    const result = toggleState(states, transitions, events, 's2');
    assert.equal(result.states.find(s => s.id === 's2'), undefined);
    assert.equal(result.transitions.filter(t => t.from === 's2' || t.to === 's2').length, 0);
  });

  it('SA-02: removes events in toggled state', () => {
    const result = toggleState(states, transitions, events, 's2');
    assert.equal(result.events.filter(e => e.state === 's2').length, 0);
  });

  it('SA-17: toggling initial state makes all non-initial states unreachable', () => {
    const result = toggleState(states, transitions, events, 's1');
    const unreachable = findUnreachableStates(result.states, result.transitions);
    // s2, s3, s4 should be unreachable (s5 was already orphaned)
    assert.ok(unreachable.includes('s2'));
    assert.ok(unreachable.includes('s3'));
    assert.ok(unreachable.includes('s4'));
  });
});

// ── 2. toggleRole ───────────────────────────────────────────────────

describe('toggleRole', () => {
  it('SA-03: removes sole-performer events for that role', () => {
    // e1 has only Claimant=true, so toggling Claimant removes e1
    const result = toggleRole(events, 'Claimant');
    assert.equal(result.find(e => e.id === 'e1'), undefined);
  });

  it('SA-04: keeps multi-performer events', () => {
    // e3 has Judge=true AND Claimant=true, toggling Claimant keeps e3
    const result = toggleRole(events, 'Claimant');
    assert.ok(result.find(e => e.id === 'e3'));
  });

  it('SA-18: toggling role with no sole events changes nothing', () => {
    // No event has Caseworker as sole performer
    const result = toggleRole(events, 'Caseworker');
    assert.equal(result.length, events.length);
  });
});

// ── 3. toggleEvent ──────────────────────────────────────────────────

describe('toggleEvent', () => {
  it('SA-05: removes specific event', () => {
    const result = toggleEvent(events, 'e2');
    assert.equal(result.length, events.length - 1);
    assert.equal(result.find(e => e.id === 'e2'), undefined);
  });

  it('SA-06: non-existent ID returns same events', () => {
    const result = toggleEvent(events, 'e999');
    assert.equal(result.length, events.length);
  });
});

// ── 4. findUnreachableStates ────────────────────────────────────────

describe('findUnreachableStates', () => {
  it('SA-07: finds disconnected states', () => {
    // s5 (ORPHAN) has no transitions to/from it
    const unreachable = findUnreachableStates(states, transitions);
    assert.ok(unreachable.includes('s5'));
  });

  it('SA-08: returns empty when all reachable', () => {
    const reachableStates = states.filter(s => s.id !== 's5');
    const unreachable = findUnreachableStates(reachableStates, transitions);
    assert.equal(unreachable.length, 0);
  });
});

// ── 5. findBlockedEvents ────────────────────────────────────────────

describe('findBlockedEvents', () => {
  it('SA-09: finds events in missing states', () => {
    const reducedStates = states.filter(s => s.id !== 's2');
    const blocked = findBlockedEvents(events, reducedStates);
    // e2 and e3 are in state s2 which is missing
    assert.equal(blocked.length, 2);
    assert.ok(blocked.some(e => e.id === 'e2'));
    assert.ok(blocked.some(e => e.id === 'e3'));
  });

  it('SA-10: returns empty when all states present', () => {
    const blocked = findBlockedEvents(events, states);
    assert.equal(blocked.length, 0);
  });
});

// ── 6. canReachEndState ─────────────────────────────────────────────

describe('canReachEndState', () => {
  it('SA-11: true for connected graph with end state', () => {
    assert.equal(canReachEndState(states, transitions), true);
  });

  it('SA-12: false when path to end state is severed', () => {
    // Remove the transition s2->s3 (the only path to end state)
    const severed = transitions.filter(t => !(t.from === 's2' && t.to === 's3'));
    assert.equal(canReachEndState(states, severed), false);
  });

  it('SA-13: false for empty model', () => {
    assert.equal(canReachEndState([], []), false);
  });
});

// ── 7. analyzeImpact ────────────────────────────────────────────────

describe('analyzeImpact', () => {
  it('SA-14: computes all three levels with state toggle', () => {
    const result = analyzeImpact(states, transitions, events, { states: ['s2'] });
    // Micro: events in s2 are removed (e2, e3)
    assert.ok(result.micro.removedEvents.length >= 2);
    assert.ok(result.micro.unavailableCount >= 2);
    // Macro: s3 and s4 become unreachable (no path from s1 through s2)
    assert.ok(result.macro.unreachableStates.includes('s3'));
    assert.ok(result.macro.unreachableStates.includes('s4'));
    assert.equal(result.macro.canReachEnd, false);
  });

  it('SA-15: with no toggles returns clean result', () => {
    const result = analyzeImpact(states, transitions, events, {});
    // Only s5 is unreachable (orphan), no events removed
    assert.equal(result.micro.removedEvents.length, 0);
    assert.equal(result.macro.canReachEnd, true);
  });

  it('SA-16: summary string contains counts', () => {
    const result = analyzeImpact(states, transitions, events, { states: ['s2'] });
    assert.ok(typeof result.summary === 'string');
    assert.ok(result.summary.length > 0);
    // Summary should mention unreachable states and blocked events
    assert.match(result.summary, /unreachable/i);
    assert.match(result.summary, /blocked/i);
  });
});
