import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getOpenQuestionCount,
  getLowCompletenessStates,
  getUnreachableStates,
  canReachEndState,
  getModelHealthSummary,
} from '../src/model-health/index.js';

// ── Fixtures ────────────────────────────────────────────────────────

const makeState = (overrides) => ({
  id: 'state-1',
  technicalName: 'STATE_ONE',
  uiLabel: 'State One',
  claimType: 'MAIN_CLAIM_ENGLAND',
  isDraftLike: false,
  isLive: true,
  isEndState: false,
  completeness: 75,
  ...overrides,
});

const makeEvent = (overrides) => ({
  id: 'evt-1',
  name: 'Some Event',
  claimType: 'MAIN_CLAIM_ENGLAND',
  state: 'STATE_ONE',
  isSystemEvent: false,
  notes: '',
  hasOpenQuestions: false,
  actors: { Judge: false },
  ...overrides,
});

const makeTransition = (from, to, overrides) => ({
  from,
  to,
  condition: null,
  isSystemTriggered: false,
  isTimeBased: false,
  ...overrides,
});

// ── 1. getOpenQuestionCount ──────────────────────────────────────────

describe('getOpenQuestionCount', () => {
  it('OQ-1: returns 0 for empty array', () => {
    assert.equal(getOpenQuestionCount([]), 0);
  });

  it('OQ-2: returns 0 when no events have open questions', () => {
    const events = [
      makeEvent({ id: 'e1', hasOpenQuestions: false }),
      makeEvent({ id: 'e2', hasOpenQuestions: false }),
    ];
    assert.equal(getOpenQuestionCount(events), 0);
  });

  it('OQ-3: counts correctly when some events have open questions', () => {
    const events = [
      makeEvent({ id: 'e1', hasOpenQuestions: true }),
      makeEvent({ id: 'e2', hasOpenQuestions: false }),
      makeEvent({ id: 'e3', hasOpenQuestions: true }),
    ];
    assert.equal(getOpenQuestionCount(events), 2);
  });

  it('OQ-4: counts correctly when all events have open questions', () => {
    const events = [
      makeEvent({ id: 'e1', hasOpenQuestions: true }),
      makeEvent({ id: 'e2', hasOpenQuestions: true }),
    ];
    assert.equal(getOpenQuestionCount(events), 2);
  });
});

// ── 2. getLowCompletenessStates ──────────────────────────────────────

describe('getLowCompletenessStates', () => {
  it('LC-1: returns empty for empty states array', () => {
    assert.deepStrictEqual(getLowCompletenessStates([]), []);
  });

  it('LC-2: default threshold (50) filters correctly', () => {
    const states = [
      makeState({ id: 's1', completeness: 25 }),
      makeState({ id: 's2', completeness: 50 }),
      makeState({ id: 's3', completeness: 75 }),
    ];
    const result = getLowCompletenessStates(states);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 's1');
  });

  it('LC-3: custom threshold filters correctly', () => {
    const states = [
      makeState({ id: 's1', completeness: 25 }),
      makeState({ id: 's2', completeness: 50 }),
      makeState({ id: 's3', completeness: 75 }),
    ];
    const result = getLowCompletenessStates(states, 80);
    assert.equal(result.length, 3);
  });

  it('LC-4: states at exactly threshold are NOT included (strictly below)', () => {
    const states = [
      makeState({ id: 's1', completeness: 50 }),
    ];
    const result = getLowCompletenessStates(states, 50);
    assert.equal(result.length, 0);
  });

  it('LC-5: all states below threshold returns all', () => {
    const states = [
      makeState({ id: 's1', completeness: 0 }),
      makeState({ id: 's2', completeness: 10 }),
    ];
    const result = getLowCompletenessStates(states);
    assert.equal(result.length, 2);
  });
});

// ── 3. getUnreachableStates ──────────────────────────────────────────

describe('getUnreachableStates', () => {
  it('UR-1: empty arrays return empty', () => {
    assert.deepStrictEqual(getUnreachableStates([], []), []);
  });

  it('UR-2: state with incoming transition is reachable', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
      makeState({ id: 's2' }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    const result = getUnreachableStates(states, transitions);
    assert.equal(result.length, 0);
  });

  it('UR-3: state with no incoming transition and not isDraftLike is unreachable', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
      makeState({ id: 's2' }),
      makeState({ id: 's3' }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    const result = getUnreachableStates(states, transitions);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 's3');
  });

  it('UR-4: isDraftLike state with no incoming transition is NOT unreachable', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
    ];
    const result = getUnreachableStates(states, []);
    assert.equal(result.length, 0);
  });

  it('UR-5: multiple unreachable states detected', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
      makeState({ id: 's2' }),
      makeState({ id: 's3' }),
      makeState({ id: 's4' }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    const result = getUnreachableStates(states, transitions);
    assert.equal(result.length, 2);
    const ids = result.map(s => s.id).sort();
    assert.deepStrictEqual(ids, ['s3', 's4']);
  });
});

// ── 4. canReachEndState ──────────────────────────────────────────────

describe('canReachEndState', () => {
  it('CR-1: empty states returns false', () => {
    assert.equal(canReachEndState([], []), false);
  });

  it('CR-2: connected path from initial to end returns true', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
      makeState({ id: 's2', isEndState: true }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    assert.equal(canReachEndState(states, transitions), true);
  });

  it('CR-3: disconnected graph returns false', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
      makeState({ id: 's2' }),
      makeState({ id: 's3', isEndState: true }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    assert.equal(canReachEndState(states, transitions), false);
  });

  it('CR-4: no end state returns false', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
      makeState({ id: 's2' }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    assert.equal(canReachEndState(states, transitions), false);
  });

  it('CR-5: no initial state returns false', () => {
    const states = [
      makeState({ id: 's1' }),
      makeState({ id: 's2', isEndState: true }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    assert.equal(canReachEndState(states, transitions), false);
  });

  it('CR-6: multi-hop path works', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true }),
      makeState({ id: 's2' }),
      makeState({ id: 's3' }),
      makeState({ id: 's4', isEndState: true }),
    ];
    const transitions = [
      makeTransition('s1', 's2'),
      makeTransition('s2', 's3'),
      makeTransition('s3', 's4'),
    ];
    assert.equal(canReachEndState(states, transitions), true);
  });
});

// ── 5. getModelHealthSummary ─────────────────────────────────────────

describe('getModelHealthSummary', () => {
  it('MS-1: perfect model returns score good', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true, completeness: 100 }),
      makeState({ id: 's2', isEndState: true, completeness: 100 }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    const events = [makeEvent({ hasOpenQuestions: false })];
    const summary = getModelHealthSummary(states, transitions, events);
    assert.equal(summary.openQuestions, 0);
    assert.equal(summary.lowCompletenessStates.length, 0);
    assert.equal(summary.unreachableStates.length, 0);
    assert.equal(summary.hasValidEndPath, true);
    assert.equal(summary.overallScore, 'good');
  });

  it('MS-2: model with no valid end path returns score poor', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true, completeness: 100 }),
      makeState({ id: 's2', completeness: 100 }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    const events = [];
    const summary = getModelHealthSummary(states, transitions, events);
    assert.equal(summary.hasValidEndPath, false);
    assert.equal(summary.overallScore, 'poor');
  });

  it('MS-3: model with only open questions returns score fair', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true, completeness: 100 }),
      makeState({ id: 's2', isEndState: true, completeness: 100 }),
    ];
    const transitions = [makeTransition('s1', 's2')];
    const events = [makeEvent({ hasOpenQuestions: true })];
    const summary = getModelHealthSummary(states, transitions, events);
    assert.equal(summary.openQuestions, 1);
    assert.equal(summary.overallScore, 'fair');
  });

  it('MS-4: aggregates all sub-metrics correctly', () => {
    const states = [
      makeState({ id: 's1', isDraftLike: true, completeness: 100 }),
      makeState({ id: 's2', completeness: 25 }),
      makeState({ id: 's3', isEndState: true, completeness: 100 }),
      makeState({ id: 's4', completeness: 10 }),
    ];
    const transitions = [
      makeTransition('s1', 's2'),
      makeTransition('s2', 's3'),
    ];
    const events = [
      makeEvent({ id: 'e1', hasOpenQuestions: true }),
      makeEvent({ id: 'e2', hasOpenQuestions: false }),
    ];
    const summary = getModelHealthSummary(states, transitions, events);
    assert.equal(summary.openQuestions, 1);
    assert.equal(summary.lowCompletenessStates.length, 2);
    assert.equal(summary.unreachableStates.length, 1);
    assert.equal(summary.hasValidEndPath, true);
    // unreachableStates.length > 0 => poor
    assert.equal(summary.overallScore, 'poor');
  });
});

// ── 6. Edge Cases ────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('EC-1: single isDraftLike state, no transitions', () => {
    const states = [makeState({ id: 's1', isDraftLike: true, completeness: 100 })];
    assert.deepStrictEqual(getUnreachableStates(states, []), []);
    assert.equal(canReachEndState(states, []), false);
  });
});
