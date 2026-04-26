import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getHealthSummaryCard,
  getOpenQuestionsList,
  getLowCompletenessPanel,
  getUnreachableStatesPanel,
  getEndStateReachability,
  getOverallHealthColor,
} from '../src/ui-model-health/index.js';

// ── Test fixtures ───────────────────────────────────────────────────

const mkState = (overrides = {}) => ({
  id: 'MC:CASE_ISSUED',
  technicalName: 'CASE_ISSUED',
  uiLabel: 'Case Issued',
  claimType: 'MAIN_CLAIM_ENGLAND',
  isDraftLike: false,
  isLive: true,
  isEndState: false,
  completeness: 75,
  ...overrides,
});

const mkTransition = (overrides = {}) => ({
  from: 'MC:DRAFT',
  to: 'MC:CASE_ISSUED',
  condition: null,
  isSystemTriggered: false,
  isTimeBased: false,
  ...overrides,
});

const mkEvent = (overrides = {}) => ({
  id: 'evt-1',
  name: 'Issue Case',
  claimType: 'MAIN_CLAIM_ENGLAND',
  state: 'MC:CASE_ISSUED',
  isSystemEvent: false,
  notes: '',
  hasOpenQuestions: false,
  actors: { Judge: true, Caseworker: true, Claimant: false },
  ...overrides,
});

// Helper: build a minimal healthy graph (draft -> live -> end, all complete)
function buildHealthyGraph() {
  const states = [
    mkState({ id: 'MC:DRAFT', technicalName: 'DRAFT', uiLabel: 'Draft', isDraftLike: true, isLive: false, isEndState: false, completeness: 100 }),
    mkState({ id: 'MC:LIVE', technicalName: 'LIVE', uiLabel: 'Live', isDraftLike: false, isLive: true, isEndState: false, completeness: 100 }),
    mkState({ id: 'MC:CLOSED', technicalName: 'CLOSED', uiLabel: 'Closed', isDraftLike: false, isLive: false, isEndState: true, completeness: 100 }),
  ];
  const transitions = [
    mkTransition({ from: 'MC:DRAFT', to: 'MC:LIVE' }),
    mkTransition({ from: 'MC:LIVE', to: 'MC:CLOSED' }),
  ];
  return { states, transitions };
}

// ── 1. getHealthSummaryCard ─────────────────────────────────────────

describe('getHealthSummaryCard', () => {
  it('UMH-1: returns correct shape with all expected keys', () => {
    const { states, transitions } = buildHealthyGraph();
    const events = [mkEvent()];
    const card = getHealthSummaryCard(states, transitions, events);
    assert.ok('score' in card);
    assert.ok('scoreColor' in card);
    assert.ok('scoreLabel' in card);
    assert.ok('openQuestions' in card);
    assert.ok('lowCompletenessCount' in card);
    assert.ok('unreachableCount' in card);
    assert.ok('hasValidEndPath' in card);
  });

  it('UMH-2: good score when all healthy', () => {
    const { states, transitions } = buildHealthyGraph();
    const events = [mkEvent({ hasOpenQuestions: false })];
    const card = getHealthSummaryCard(states, transitions, events);
    assert.equal(card.score, 'good');
    assert.equal(card.scoreLabel, 'Good');
    assert.equal(card.openQuestions, 0);
    assert.equal(card.lowCompletenessCount, 0);
    assert.equal(card.unreachableCount, 0);
    assert.equal(card.hasValidEndPath, true);
  });

  it('UMH-3: poor score when unreachable states exist', () => {
    const states = [
      mkState({ id: 'MC:DRAFT', isDraftLike: true, completeness: 100 }),
      mkState({ id: 'MC:ORPHAN', isDraftLike: false, completeness: 100 }),
      mkState({ id: 'MC:END', isEndState: true, completeness: 100 }),
    ];
    const transitions = [mkTransition({ from: 'MC:DRAFT', to: 'MC:END' })];
    const events = [];
    const card = getHealthSummaryCard(states, transitions, events);
    assert.equal(card.score, 'poor');
    assert.equal(card.scoreLabel, 'Poor');
    assert.ok(card.unreachableCount > 0);
  });

  it('UMH-4: fair score when open questions exist but no structural problems', () => {
    const { states, transitions } = buildHealthyGraph();
    const events = [mkEvent({ hasOpenQuestions: true })];
    const card = getHealthSummaryCard(states, transitions, events);
    assert.equal(card.score, 'fair');
    assert.equal(card.scoreLabel, 'Fair');
    assert.equal(card.openQuestions, 1);
  });
});

// ── 2. getOpenQuestionsList ─────────────────────────────────────────

describe('getOpenQuestionsList', () => {
  it('UMH-5: filters to only events with open questions', () => {
    const events = [
      mkEvent({ id: 'e1', hasOpenQuestions: true, notes: 'Unclear' }),
      mkEvent({ id: 'e2', hasOpenQuestions: false }),
      mkEvent({ id: 'e3', hasOpenQuestions: true, notes: 'TBD' }),
    ];
    const result = getOpenQuestionsList(events);
    assert.equal(result.events.length, 2);
    assert.equal(result.events[0].id, 'e1');
    assert.equal(result.events[1].id, 'e3');
  });

  it('UMH-6: count matches filtered events length', () => {
    const events = [
      mkEvent({ hasOpenQuestions: true }),
      mkEvent({ hasOpenQuestions: true }),
    ];
    const result = getOpenQuestionsList(events);
    assert.equal(result.count, result.events.length);
    assert.equal(result.count, 2);
  });

  it('UMH-7: empty events returns count 0 and empty array', () => {
    const result = getOpenQuestionsList([]);
    assert.equal(result.count, 0);
    assert.deepEqual(result.events, []);
  });

  it('UMH-8: each returned event has id, name, state, notes', () => {
    const events = [
      mkEvent({ id: 'e1', name: 'Submit', state: 'MC:DRAFT', notes: 'Check this', hasOpenQuestions: true }),
    ];
    const result = getOpenQuestionsList(events);
    const evt = result.events[0];
    assert.equal(evt.id, 'e1');
    assert.equal(evt.name, 'Submit');
    assert.equal(evt.state, 'MC:DRAFT');
    assert.equal(evt.notes, 'Check this');
  });
});

// ── 3. getLowCompletenessPanel ──────────────────────────────────────

describe('getLowCompletenessPanel', () => {
  it('UMH-9: default threshold of 50 filters correctly', () => {
    const states = [
      mkState({ id: 's1', completeness: 100 }),
      mkState({ id: 's2', completeness: 49 }),
      mkState({ id: 's3', completeness: 50 }),
    ];
    const panel = getLowCompletenessPanel(states);
    assert.equal(panel.threshold, 50);
    assert.equal(panel.states.length, 1);
    assert.equal(panel.states[0].id, 's2');
  });

  it('UMH-10: custom threshold filters correctly', () => {
    const states = [
      mkState({ id: 's1', completeness: 80 }),
      mkState({ id: 's2', completeness: 70 }),
      mkState({ id: 's3', completeness: 50 }),
    ];
    const panel = getLowCompletenessPanel(states, 75);
    assert.equal(panel.threshold, 75);
    assert.equal(panel.states.length, 2);
  });

  it('UMH-11: empty states returns empty array', () => {
    const panel = getLowCompletenessPanel([]);
    assert.equal(panel.states.length, 0);
  });

  it('UMH-12: each state entry has id, label, completeness, level, color', () => {
    const states = [mkState({ id: 's1', uiLabel: 'Draft', completeness: 25 })];
    const panel = getLowCompletenessPanel(states);
    const entry = panel.states[0];
    assert.equal(entry.id, 's1');
    assert.equal(entry.label, 'Draft');
    assert.equal(entry.completeness, 25);
    assert.ok('level' in entry);
    assert.ok('color' in entry);
    assert.ok('background' in entry.color);
    assert.ok('text' in entry.color);
    assert.ok('border' in entry.color);
  });
});

// ── 4. getUnreachableStatesPanel ────────────────────────────────────

describe('getUnreachableStatesPanel', () => {
  it('UMH-13: returns unreachable non-draft states', () => {
    const states = [
      mkState({ id: 'MC:DRAFT', isDraftLike: true }),
      mkState({ id: 'MC:ORPHAN', uiLabel: 'Orphan', isDraftLike: false }),
      mkState({ id: 'MC:LIVE', isDraftLike: false }),
    ];
    const transitions = [mkTransition({ from: 'MC:DRAFT', to: 'MC:LIVE' })];
    const panel = getUnreachableStatesPanel(states, transitions);
    assert.equal(panel.count, 1);
    assert.equal(panel.states[0].id, 'MC:ORPHAN');
    assert.equal(panel.states[0].label, 'Orphan');
  });

  it('UMH-14: empty result when all states are reachable', () => {
    const { states, transitions } = buildHealthyGraph();
    const panel = getUnreachableStatesPanel(states, transitions);
    assert.equal(panel.count, 0);
    assert.deepEqual(panel.states, []);
  });
});

// ── 5. getEndStateReachability ──────────────────────────────────────

describe('getEndStateReachability', () => {
  it('UMH-15: returns entry per claim type in map', () => {
    const { states, transitions } = buildHealthyGraph();
    const map = {
      MAIN_CLAIM_ENGLAND: { states, transitions },
      APPEALS: { states: [], transitions: [] },
    };
    const result = getEndStateReachability(map);
    assert.equal(result.length, 2);
    const ids = result.map(r => r.claimTypeId);
    assert.ok(ids.includes('MAIN_CLAIM_ENGLAND'));
    assert.ok(ids.includes('APPEALS'));
  });

  it('UMH-16: correct icon for reachable vs unreachable claim types', () => {
    const { states, transitions } = buildHealthyGraph();
    const map = {
      MAIN_CLAIM_ENGLAND: { states, transitions },
      APPEALS: { states: [], transitions: [] },
    };
    const result = getEndStateReachability(map);
    const reachable = result.find(r => r.claimTypeId === 'MAIN_CLAIM_ENGLAND');
    const unreachable = result.find(r => r.claimTypeId === 'APPEALS');
    assert.equal(reachable.canReach, true);
    assert.equal(unreachable.canReach, false);
    assert.notEqual(reachable.icon, unreachable.icon);
  });

  it('UMH-17: empty map returns empty array', () => {
    const result = getEndStateReachability({});
    assert.deepEqual(result, []);
  });
});

// ── 6. getOverallHealthColor ────────────────────────────────────────

describe('getOverallHealthColor', () => {
  it('UMH-18: returns correct colour objects for good, fair, poor', () => {
    const good = getOverallHealthColor('good');
    assert.ok(good.background);
    assert.ok(good.text);
    assert.ok(good.border);

    const fair = getOverallHealthColor('fair');
    assert.ok(fair.background);
    assert.ok(fair.text);
    assert.ok(fair.border);

    const poor = getOverallHealthColor('poor');
    assert.ok(poor.background);
    assert.ok(poor.text);
    assert.ok(poor.border);

    // Verify they are different from each other
    assert.notEqual(good.background, fair.background);
    assert.notEqual(good.background, poor.background);
    assert.notEqual(fair.background, poor.background);
  });
});
