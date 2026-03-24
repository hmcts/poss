import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getUncertaintyLevel,
  getUncertaintyColor,
  getCompletenessLabel,
  getCompletenessBadge,
  getEventIndicator,
  classifyStates,
  getUncertaintySummary,
} from '../src/uncertainty-display/index.js';

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

// ── 1. getUncertaintyLevel ──────────────────────────────────────────

describe('getUncertaintyLevel', () => {
  it('UD-1: completeness=100 returns complete', () => {
    assert.equal(getUncertaintyLevel(100), 'complete');
  });

  it('UD-2: completeness=50 returns partial', () => {
    assert.equal(getUncertaintyLevel(50), 'partial');
  });

  it('UD-3: completeness=99 returns partial', () => {
    assert.equal(getUncertaintyLevel(99), 'partial');
  });

  it('UD-4: completeness=49 returns low', () => {
    assert.equal(getUncertaintyLevel(49), 'low');
  });

  it('UD-5: completeness=1 returns low', () => {
    assert.equal(getUncertaintyLevel(1), 'low');
  });

  it('UD-6: completeness=0 returns unknown', () => {
    assert.equal(getUncertaintyLevel(0), 'unknown');
  });
});

// ── 2. getUncertaintyColor ──────────────────────────────────────────

describe('getUncertaintyColor', () => {
  it('UD-7: complete returns green palette', () => {
    const color = getUncertaintyColor('complete');
    assert.equal(color.background, '#D1FAE5');
    assert.equal(color.border, '#10B981');
    assert.equal(color.text, '#000000');
  });

  it('UD-8: partial returns amber palette', () => {
    const color = getUncertaintyColor('partial');
    assert.equal(color.background, '#FEF3C7');
    assert.equal(color.border, '#F59E0B');
    assert.equal(color.text, '#000000');
  });

  it('UD-9: low returns amber-muted palette', () => {
    const color = getUncertaintyColor('low');
    assert.equal(color.background, '#FDE68A');
    assert.equal(color.border, '#D97706');
    assert.equal(color.text, '#000000');
  });

  it('UD-10: unknown returns grey palette', () => {
    const color = getUncertaintyColor('unknown');
    assert.equal(color.background, '#F3F4F6');
    assert.equal(color.border, '#9CA3AF');
    assert.equal(color.text, '#000000');
  });

  it('UD-11: unrecognised level returns grey palette', () => {
    const color = getUncertaintyColor('nonsense');
    assert.equal(color.background, '#F3F4F6');
    assert.equal(color.border, '#9CA3AF');
  });
});

// ── 3. getCompletenessLabel ─────────────────────────────────────────

describe('getCompletenessLabel', () => {
  it('UD-12: 100 returns "100%"', () => {
    assert.equal(getCompletenessLabel(100), '100%');
  });

  it('UD-13: 0 returns "0%"', () => {
    assert.equal(getCompletenessLabel(0), '0%');
  });

  it('UD-14: 75 returns "75%"', () => {
    assert.equal(getCompletenessLabel(75), '75%');
  });
});

// ── 4. getCompletenessBadge ─────────────────────────────────────────

describe('getCompletenessBadge', () => {
  it('UD-15: state with completeness=100 returns complete badge', () => {
    const badge = getCompletenessBadge(mkState({ completeness: 100 }));
    assert.equal(badge.label, '100%');
    assert.equal(badge.level, 'complete');
    assert.equal(badge.color.background, '#D1FAE5');
  });

  it('UD-16: state with completeness=0 returns unknown badge', () => {
    const badge = getCompletenessBadge(mkState({ completeness: 0 }));
    assert.equal(badge.label, '0%');
    assert.equal(badge.level, 'unknown');
    assert.equal(badge.color.background, '#F3F4F6');
  });

  it('UD-17: state with completeness=60 returns partial badge', () => {
    const badge = getCompletenessBadge(mkState({ completeness: 60 }));
    assert.equal(badge.label, '60%');
    assert.equal(badge.level, 'partial');
    assert.equal(badge.color.background, '#FEF3C7');
  });
});

// ── 5. getEventIndicator ────────────────────────────────────────────

describe('getEventIndicator', () => {
  it('UD-18: event with hasOpenQuestions=true returns warning', () => {
    const indicator = getEventIndicator(mkEvent({ hasOpenQuestions: true }));
    assert.equal(indicator.hasOpenQuestions, true);
    assert.equal(indicator.indicatorType, 'warning');
    assert.equal(indicator.indicatorColor, '#F59E0B');
  });

  it('UD-19: event with hasOpenQuestions=false returns none', () => {
    const indicator = getEventIndicator(mkEvent({ hasOpenQuestions: false }));
    assert.equal(indicator.hasOpenQuestions, false);
    assert.equal(indicator.indicatorType, 'none');
    assert.equal(indicator.indicatorColor, 'transparent');
  });
});

// ── 6. classifyStates ───────────────────────────────────────────────

describe('classifyStates', () => {
  it('UD-20: mixed states are bucketed correctly', () => {
    const states = [
      mkState({ id: 's1', completeness: 100 }),
      mkState({ id: 's2', completeness: 75 }),
      mkState({ id: 's3', completeness: 25 }),
      mkState({ id: 's4', completeness: 0 }),
    ];
    const result = classifyStates(states);
    assert.equal(result.complete.length, 1);
    assert.equal(result.partial.length, 1);
    assert.equal(result.low.length, 1);
    assert.equal(result.unknown.length, 1);
    assert.equal(result.complete[0].id, 's1');
    assert.equal(result.partial[0].id, 's2');
    assert.equal(result.low[0].id, 's3');
    assert.equal(result.unknown[0].id, 's4');
  });

  it('UD-21: empty array returns empty buckets', () => {
    const result = classifyStates([]);
    assert.deepEqual(result.complete, []);
    assert.deepEqual(result.partial, []);
    assert.deepEqual(result.low, []);
    assert.deepEqual(result.unknown, []);
  });
});

// ── 7. getUncertaintySummary ────────────────────────────────────────

describe('getUncertaintySummary', () => {
  it('UD-22: aggregates counts correctly', () => {
    const states = [
      mkState({ completeness: 100 }),
      mkState({ completeness: 50 }),
      mkState({ completeness: 0 }),
    ];
    const events = [
      mkEvent({ hasOpenQuestions: true }),
      mkEvent({ hasOpenQuestions: false }),
      mkEvent({ hasOpenQuestions: true }),
    ];
    const summary = getUncertaintySummary(states, events);
    assert.equal(summary.totalStates, 3);
    assert.equal(summary.completeCount, 1);
    assert.equal(summary.uncertainCount, 2);
    assert.equal(summary.openQuestionEvents, 2);
  });

  it('UD-23: overallLevel reflects worst state', () => {
    const allComplete = [mkState({ completeness: 100 }), mkState({ completeness: 100 })];
    assert.equal(getUncertaintySummary(allComplete, []).overallLevel, 'complete');

    const hasPartial = [mkState({ completeness: 100 }), mkState({ completeness: 50 })];
    assert.equal(getUncertaintySummary(hasPartial, []).overallLevel, 'partial');

    const hasLow = [mkState({ completeness: 100 }), mkState({ completeness: 10 })];
    assert.equal(getUncertaintySummary(hasLow, []).overallLevel, 'low');

    const hasUnknown = [mkState({ completeness: 100 }), mkState({ completeness: 0 })];
    assert.equal(getUncertaintySummary(hasUnknown, []).overallLevel, 'unknown');
  });

  it('UD-24: empty arrays return zero counts with unknown level', () => {
    const summary = getUncertaintySummary([], []);
    assert.equal(summary.totalStates, 0);
    assert.equal(summary.completeCount, 0);
    assert.equal(summary.uncertainCount, 0);
    assert.equal(summary.openQuestionEvents, 0);
    assert.equal(summary.overallLevel, 'unknown');
  });
});
