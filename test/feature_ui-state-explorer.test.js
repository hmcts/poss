import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  prepareGraphData,
  prepareNodeWithBadge,
  prepareStateDetailPanel,
  getGraphLegend,
  getEdgeLegend,
  calculateAutoLayout,
} from '../src/ui-state-explorer/index.js';

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

// ── 1. prepareGraphData ─────────────────────────────────────────────

describe('prepareGraphData', () => {
  it('USE-1: returns nodes and edges from valid states/transitions', () => {
    const states = [
      mkState({ id: 'S1' }),
      mkState({ id: 'S2' }),
    ];
    const transitions = [mkTransition({ from: 'S1', to: 'S2' })];
    const result = prepareGraphData(states, transitions);
    assert.equal(result.nodes.length, 2);
    assert.equal(result.edges.length, 1);
  });

  it('USE-2: returned nodes have non-default positions after layout', () => {
    const states = [
      mkState({ id: 'S1' }),
      mkState({ id: 'S2' }),
    ];
    const transitions = [mkTransition({ from: 'S1', to: 'S2' })];
    const result = prepareGraphData(states, transitions);
    // At least one node should not be at position (0,0) since S2 depends on S1
    const s2Node = result.nodes.find((n) => n.id === 'S2');
    assert.ok(s2Node, 'S2 node should exist');
    assert.ok(s2Node.position.y > 0, 'S2 should be in a later layer (y > 0)');
  });

  it('USE-3: empty inputs return empty graph', () => {
    const result = prepareGraphData([], []);
    assert.deepEqual(result.nodes, []);
    assert.deepEqual(result.edges, []);
  });
});

// ── 2. calculateAutoLayout ──────────────────────────────────────────

describe('calculateAutoLayout', () => {
  it('USE-4: root nodes (no incoming edges) are placed at layer 0', () => {
    const nodes = [
      { id: 'A', position: { x: 0, y: 0 } },
      { id: 'B', position: { x: 0, y: 0 } },
    ];
    const edges = [{ source: 'A', target: 'B' }];
    const laid = calculateAutoLayout(nodes, edges);
    const nodeA = laid.find((n) => n.id === 'A');
    assert.equal(nodeA.position.y, 0, 'Root node A should be at y=0');
  });

  it('USE-5: dependent nodes are placed in subsequent layers', () => {
    const nodes = [
      { id: 'A', position: { x: 0, y: 0 } },
      { id: 'B', position: { x: 0, y: 0 } },
      { id: 'C', position: { x: 0, y: 0 } },
    ];
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
    ];
    const laid = calculateAutoLayout(nodes, edges);
    const yA = laid.find((n) => n.id === 'A').position.y;
    const yB = laid.find((n) => n.id === 'B').position.y;
    const yC = laid.find((n) => n.id === 'C').position.y;
    assert.ok(yB > yA, 'B should be below A');
    assert.ok(yC > yB, 'C should be below B');
  });

  it('USE-6: nodes in the same layer are spread horizontally', () => {
    const nodes = [
      { id: 'A', position: { x: 0, y: 0 } },
      { id: 'B', position: { x: 0, y: 0 } },
      { id: 'C', position: { x: 0, y: 0 } },
    ];
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
    ];
    const laid = calculateAutoLayout(nodes, edges);
    const xB = laid.find((n) => n.id === 'B').position.x;
    const xC = laid.find((n) => n.id === 'C').position.x;
    assert.notEqual(xB, xC, 'B and C should have different x positions');
  });

  it('USE-7: single node returns position {x:0, y:0}', () => {
    const nodes = [{ id: 'A', position: { x: 99, y: 99 } }];
    const laid = calculateAutoLayout(nodes, []);
    assert.equal(laid[0].position.x, 0);
    assert.equal(laid[0].position.y, 0);
  });

  it('USE-8: disconnected nodes all go to layer 0', () => {
    const nodes = [
      { id: 'A', position: { x: 0, y: 0 } },
      { id: 'B', position: { x: 0, y: 0 } },
      { id: 'C', position: { x: 0, y: 0 } },
    ];
    const laid = calculateAutoLayout(nodes, []);
    assert.equal(laid[0].position.y, 0);
    assert.equal(laid[1].position.y, 0);
    assert.equal(laid[2].position.y, 0);
  });
});

// ── 3. prepareNodeWithBadge ─────────────────────────────────────────

describe('prepareNodeWithBadge', () => {
  it('USE-9: returns stateId, label, completeness, and badge', () => {
    const result = prepareNodeWithBadge(mkState());
    assert.equal(result.stateId, 'MC:CASE_ISSUED');
    assert.equal(result.label, 'Case Issued');
    assert.equal(result.completeness, 75);
    assert.ok(result.badge, 'badge should be present');
    assert.ok(result.badge.label, 'badge should have a label');
    assert.ok(result.badge.level, 'badge should have a level');
    assert.ok(result.badge.color, 'badge should have a color');
  });

  it('USE-10: badge level reflects completeness (100% -> complete)', () => {
    const result = prepareNodeWithBadge(mkState({ completeness: 100 }));
    assert.equal(result.badge.level, 'complete');
  });

  it('USE-11: badge level for 0% completeness -> unknown', () => {
    const result = prepareNodeWithBadge(mkState({ completeness: 0 }));
    assert.equal(result.badge.level, 'unknown');
  });
});

// ── 4. prepareStateDetailPanel ──────────────────────────────────────

describe('prepareStateDetailPanel', () => {
  it('USE-12: returns state detail with formatted events', () => {
    const events = [mkEvent({ state: 'MC:CASE_ISSUED' })];
    const result = prepareStateDetailPanel('MC:CASE_ISSUED', [mkState()], events);
    assert.ok(result.state, 'state should be present');
    assert.equal(result.formattedEvents.length, 1);
    assert.ok(result.actorSummary, 'actorSummary should be present');
  });

  it('USE-13: each formatted event has name, actors, and indicator', () => {
    const events = [mkEvent()];
    const result = prepareStateDetailPanel('MC:CASE_ISSUED', [mkState()], events);
    const fe = result.formattedEvents[0];
    assert.ok(fe.name, 'formatted event should have name');
    assert.ok(Array.isArray(fe.actors), 'formatted event should have actors array');
    assert.ok(fe.indicator, 'formatted event should have indicator');
    assert.ok('hasOpenQuestions' in fe.indicator, 'indicator should have hasOpenQuestions');
  });

  it('USE-14: events with open questions get warning indicator', () => {
    const events = [mkEvent({ hasOpenQuestions: true })];
    const result = prepareStateDetailPanel('MC:CASE_ISSUED', [mkState()], events);
    assert.equal(result.formattedEvents[0].indicator.indicatorType, 'warning');
  });

  it('USE-15: missing state returns undefined state in panel', () => {
    const result = prepareStateDetailPanel('NONEXISTENT', [mkState()], []);
    assert.equal(result.state, undefined);
    assert.equal(result.formattedEvents.length, 0);
  });
});

// ── 5. getGraphLegend ───────────────────────────────────────────────

describe('getGraphLegend', () => {
  it('USE-16: returns exactly 4 legend entries with label, color, description', () => {
    const legend = getGraphLegend();
    assert.equal(legend.length, 4);
    for (const entry of legend) {
      assert.ok(entry.label, 'entry should have label');
      assert.ok(entry.color, 'entry should have color');
      assert.ok(entry.description, 'entry should have description');
    }
  });
});

// ── 6. getEdgeLegend ────────────────────────────────────────────────

describe('getEdgeLegend', () => {
  it('USE-17: returns exactly 3 legend entries with label, style, description', () => {
    const legend = getEdgeLegend();
    assert.equal(legend.length, 3);
    for (const entry of legend) {
      assert.ok(entry.label, 'entry should have label');
      assert.ok('style' in entry, 'entry should have style');
      assert.ok(entry.description, 'entry should have description');
    }
  });

  it('USE-18: legend entries cover solid, dashed, and dotted styles', () => {
    const legend = getEdgeLegend();
    const styles = legend.map((e) => e.style);
    // One should be solid (undefined dasharray), one dashed, one dotted
    const hasUndefined = styles.some((s) => s.strokeDasharray === undefined);
    const hasDashed = styles.some((s) => s.strokeDasharray === '5 5');
    const hasDotted = styles.some((s) => s.strokeDasharray === '2 2');
    assert.ok(hasUndefined, 'should have solid style (undefined strokeDasharray)');
    assert.ok(hasDashed, 'should have dashed style (5 5)');
    assert.ok(hasDotted, 'should have dotted style (2 2)');
  });
});
