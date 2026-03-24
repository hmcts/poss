import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getStateColor,
  getEdgeStyle,
  statesToNodes,
  transitionsToEdges,
  getStateDetail,
  buildGraph,
} from '../src/state-explorer/index.js';

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
  from: 'MC:CASE_ISSUED',
  to: 'MC:JUDICIAL_REFERRAL',
  condition: 'Case issued successfully',
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

// ── 1. getStateColor ────────────────────────────────────────────────

describe('getStateColor', () => {
  it('SE-1: draft state returns amber palette', () => {
    const color = getStateColor(mkState({ isDraftLike: true, isLive: false }));
    assert.equal(color.background, '#FEF3C7');
    assert.equal(color.border, '#F59E0B');
  });

  it('SE-2: live state returns green palette', () => {
    const color = getStateColor(mkState({ isLive: true }));
    assert.equal(color.background, '#D1FAE5');
    assert.equal(color.border, '#10B981');
  });

  it('SE-3: end state returns dark palette', () => {
    const color = getStateColor(mkState({ isEndState: true, isLive: false }));
    assert.equal(color.background, '#1F2937');
    assert.equal(color.border, '#374151');
    assert.equal(color.text, '#FFFFFF');
  });

  it('SE-4: uncertain state (completeness<50, no flags) returns muted palette', () => {
    const color = getStateColor(mkState({
      isDraftLike: false, isLive: false, isEndState: false, completeness: 30,
    }));
    assert.equal(color.background, '#F3F4F6');
    assert.equal(color.border, '#9CA3AF');
  });

  it('SE-5: end state priority overrides draft flag', () => {
    const color = getStateColor(mkState({ isEndState: true, isDraftLike: true, isLive: false }));
    assert.equal(color.background, '#1F2937');
  });
});

// ── 2. getEdgeStyle ─────────────────────────────────────────────────

describe('getEdgeStyle', () => {
  it('SE-6: system-triggered returns dashed style', () => {
    const style = getEdgeStyle(mkTransition({ isSystemTriggered: true }));
    assert.equal(style.strokeDasharray, '5 5');
    assert.equal(style.animated, false);
  });

  it('SE-7: time-based returns dotted animated style', () => {
    const style = getEdgeStyle(mkTransition({ isTimeBased: true }));
    assert.equal(style.strokeDasharray, '2 2');
    assert.equal(style.animated, true);
  });

  it('SE-8: user action (neither flag) returns solid style', () => {
    const style = getEdgeStyle(mkTransition());
    assert.equal(style.strokeDasharray, undefined);
    assert.equal(style.animated, false);
  });

  it('SE-9: both flags true, time-based wins', () => {
    const style = getEdgeStyle(mkTransition({ isSystemTriggered: true, isTimeBased: true }));
    assert.equal(style.strokeDasharray, '2 2');
    assert.equal(style.animated, true);
  });
});

// ── 3. statesToNodes ────────────────────────────────────────────────

describe('statesToNodes', () => {
  it('SE-10: maps state fields to node descriptor', () => {
    const nodes = statesToNodes([mkState()]);
    assert.equal(nodes.length, 1);
    const n = nodes[0];
    assert.equal(n.id, 'MC:CASE_ISSUED');
    assert.equal(n.data.label, 'Case Issued');
    assert.equal(n.data.technicalName, 'CASE_ISSUED');
    assert.equal(n.data.completeness, 75);
    assert.equal(n.type, 'default');
    assert.ok(n.style, 'style object should be present');
    assert.ok(n.style.background, 'style.background should be set');
  });

  it('SE-11: empty array returns empty array', () => {
    const nodes = statesToNodes([]);
    assert.deepEqual(nodes, []);
  });
});

// ── 4. transitionsToEdges ───────────────────────────────────────────

describe('transitionsToEdges', () => {
  it('SE-12: maps transition fields to edge descriptor', () => {
    const edges = transitionsToEdges([mkTransition()]);
    assert.equal(edges.length, 1);
    const e = edges[0];
    assert.equal(e.source, 'MC:CASE_ISSUED');
    assert.equal(e.target, 'MC:JUDICIAL_REFERRAL');
    assert.equal(e.label, 'Case issued successfully');
    assert.ok(e.id, 'edge should have an id');
    assert.ok('style' in e || 'animated' in e, 'edge should have style or animated');
  });

  it('SE-13: null condition maps to empty string label', () => {
    const edges = transitionsToEdges([mkTransition({ condition: null })]);
    assert.equal(edges[0].label, '');
  });
});

// ── 5. getStateDetail ───────────────────────────────────────────────

describe('getStateDetail', () => {
  it('SE-14: filters events by stateId', () => {
    const events = [
      mkEvent({ id: 'e1', state: 'MC:CASE_ISSUED' }),
      mkEvent({ id: 'e2', state: 'MC:CLOSED' }),
    ];
    const detail = getStateDetail('MC:CASE_ISSUED', [mkState()], events);
    assert.equal(detail.events.length, 1);
    assert.equal(detail.events[0].id, 'e1');
  });

  it('SE-15: actor summary counts events per actor', () => {
    const events = [
      mkEvent({ id: 'e1', actors: { Judge: true, Caseworker: false } }),
      mkEvent({ id: 'e2', actors: { Judge: true, Caseworker: true } }),
    ];
    const detail = getStateDetail('MC:CASE_ISSUED', [mkState()], events);
    assert.equal(detail.actorSummary['Judge'], 2);
    assert.equal(detail.actorSummary['Caseworker'], 1);
  });

  it('SE-16: missing state returns undefined state', () => {
    const detail = getStateDetail('NONEXISTENT', [mkState()], []);
    assert.equal(detail.state, undefined);
  });
});

// ── 6. buildGraph ───────────────────────────────────────────────────

describe('buildGraph', () => {
  it('SE-17: combines nodes and edges', () => {
    const graph = buildGraph([mkState()], [mkTransition()]);
    assert.equal(graph.nodes.length, 1);
    assert.equal(graph.edges.length, 1);
  });

  it('SE-18: empty inputs return empty graph', () => {
    const graph = buildGraph([], []);
    assert.deepEqual(graph.nodes, []);
    assert.deepEqual(graph.edges, []);
  });
});
