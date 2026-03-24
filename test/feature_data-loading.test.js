import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getAllClaimTypeIds,
  getModelDataForClaimType,
  populateStore,
  createPopulatedStore,
} from '../src/data-loading/index.js';

import { createPossessionsStore } from '../src/data-model/index.js';

// ── Inline Fixture Data ─────────────────────────────────────────────

const CLAIM_TYPES = [
  { id: 'MAIN_CLAIM_ENGLAND', name: 'Main Claim (England)', description: 'Main possession claim in England' },
  { id: 'ACCELERATED_CLAIM_WALES', name: 'Accelerated Claim (Wales)', description: 'Accelerated possession claim in Wales' },
];

const STATES = [
  { id: 'S1', technicalName: 'draft', uiLabel: 'Draft', claimType: 'MAIN_CLAIM_ENGLAND', isDraftLike: true, isLive: false, isEndState: false, completeness: 0 },
  { id: 'S2', technicalName: 'issued', uiLabel: 'Issued', claimType: 'MAIN_CLAIM_ENGLAND', isDraftLike: false, isLive: true, isEndState: false, completeness: 50 },
  { id: 'S3', technicalName: 'closed', uiLabel: 'Closed', claimType: 'MAIN_CLAIM_ENGLAND', isDraftLike: false, isLive: false, isEndState: true, completeness: 100 },
  { id: 'S4', technicalName: 'draft_wales', uiLabel: 'Draft (Wales)', claimType: 'ACCELERATED_CLAIM_WALES', isDraftLike: true, isLive: false, isEndState: false, completeness: 0 },
  { id: 'S5', technicalName: 'issued_wales', uiLabel: 'Issued (Wales)', claimType: 'ACCELERATED_CLAIM_WALES', isDraftLike: false, isLive: true, isEndState: false, completeness: 50 },
];

const TRANSITIONS = [
  { from: 'S1', to: 'S2', condition: null, isSystemTriggered: false, isTimeBased: false },
  { from: 'S2', to: 'S3', condition: 'order granted', isSystemTriggered: false, isTimeBased: false },
  { from: 'S4', to: 'S5', condition: null, isSystemTriggered: false, isTimeBased: false },
];

const EVENTS = [
  { id: 'E1', name: 'Create Claim', claimType: 'MAIN_CLAIM_ENGLAND', state: 'S1', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Claimant: true } },
  { id: 'E2', name: 'Issue Claim', claimType: 'MAIN_CLAIM_ENGLAND', state: 'S2', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Caseworker: true } },
  { id: 'E3', name: 'File Wales', claimType: 'ACCELERATED_CLAIM_WALES', state: 'S4', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: { Claimant: true } },
];

// ── 1. getAllClaimTypeIds ────────────────────────────────────────────

describe('getAllClaimTypeIds', () => {
  it('DL-1: returns exactly 7 IDs', () => {
    const ids = getAllClaimTypeIds();
    assert.equal(ids.length, 7);
  });

  it('DL-2: contains all expected ClaimTypeId values', () => {
    const ids = getAllClaimTypeIds();
    const expected = [
      'MAIN_CLAIM_ENGLAND',
      'ACCELERATED_CLAIM_WALES',
      'COUNTER_CLAIM',
      'COUNTER_CLAIM_MAIN_CLAIM_CLOSED',
      'ENFORCEMENT',
      'APPEALS',
      'GENERAL_APPLICATIONS',
    ];
    for (const id of expected) {
      assert.ok(ids.includes(id), `Missing ID: ${id}`);
    }
  });

  it('DL-3: returns strings, not objects', () => {
    const ids = getAllClaimTypeIds();
    for (const id of ids) {
      assert.equal(typeof id, 'string');
    }
  });
});

// ── 2. getModelDataForClaimType ─────────────────────────────────────

describe('getModelDataForClaimType', () => {
  it('DL-4: filters states by claimType', () => {
    const result = getModelDataForClaimType(STATES, TRANSITIONS, EVENTS, 'MAIN_CLAIM_ENGLAND');
    assert.equal(result.states.length, 3);
    for (const s of result.states) {
      assert.equal(s.claimType, 'MAIN_CLAIM_ENGLAND');
    }
  });

  it('DL-5: filters transitions by matching from-state IDs', () => {
    const result = getModelDataForClaimType(STATES, TRANSITIONS, EVENTS, 'MAIN_CLAIM_ENGLAND');
    assert.equal(result.transitions.length, 2);
    const stateIds = new Set(result.states.map((s) => s.id));
    for (const t of result.transitions) {
      assert.ok(stateIds.has(t.from), `Transition from ${t.from} not in state set`);
    }
  });

  it('DL-6: filters events by claimType', () => {
    const result = getModelDataForClaimType(STATES, TRANSITIONS, EVENTS, 'MAIN_CLAIM_ENGLAND');
    assert.equal(result.events.length, 2);
    for (const e of result.events) {
      assert.equal(e.claimType, 'MAIN_CLAIM_ENGLAND');
    }
  });

  it('DL-7: unknown claimType returns empty arrays', () => {
    const result = getModelDataForClaimType(STATES, TRANSITIONS, EVENTS, 'NONEXISTENT');
    assert.equal(result.states.length, 0);
    assert.equal(result.transitions.length, 0);
    assert.equal(result.events.length, 0);
  });

  it('DL-8: empty input arrays return empty arrays', () => {
    const result = getModelDataForClaimType([], [], [], 'MAIN_CLAIM_ENGLAND');
    assert.equal(result.states.length, 0);
    assert.equal(result.transitions.length, 0);
    assert.equal(result.events.length, 0);
  });

  it('DL-9: does not include transitions from other claim types', () => {
    const result = getModelDataForClaimType(STATES, TRANSITIONS, EVENTS, 'ACCELERATED_CLAIM_WALES');
    assert.equal(result.transitions.length, 1);
    assert.equal(result.transitions[0].from, 'S4');
  });

  it('DL-10: mixed claim types -- only returns requested type', () => {
    const engResult = getModelDataForClaimType(STATES, TRANSITIONS, EVENTS, 'MAIN_CLAIM_ENGLAND');
    const walesResult = getModelDataForClaimType(STATES, TRANSITIONS, EVENTS, 'ACCELERATED_CLAIM_WALES');
    // No overlap in states
    const engStateIds = new Set(engResult.states.map((s) => s.id));
    const walesStateIds = new Set(walesResult.states.map((s) => s.id));
    for (const id of engStateIds) {
      assert.ok(!walesStateIds.has(id), `State ${id} appears in both results`);
    }
  });
});

// ── 3. populateStore ────────────────────────────────────────────────

describe('populateStore', () => {
  it('DL-11: populates store with claimTypes', () => {
    const store = createPossessionsStore();
    populateStore(store, { claimTypes: CLAIM_TYPES });
    const state = store.getState();
    assert.equal(state.claimTypes.length, 2);
    assert.equal(state.claimTypes[0].id, 'MAIN_CLAIM_ENGLAND');
  });

  it('DL-12: populates store with states, transitions, events', () => {
    const store = createPossessionsStore();
    populateStore(store, { states: STATES, transitions: TRANSITIONS, events: EVENTS });
    const state = store.getState();
    assert.equal(state.states.length, 5);
    assert.equal(state.transitions.length, 3);
    assert.equal(state.events.length, 3);
  });

  it('DL-13: partial populate only updates provided fields', () => {
    const store = createPossessionsStore();
    populateStore(store, { states: STATES });
    populateStore(store, { events: EVENTS });
    const state = store.getState();
    // States should still be there from first call
    assert.equal(state.states.length, 5);
    // Events should be set from second call
    assert.equal(state.events.length, 3);
    // Transitions should still be empty (never populated)
    assert.equal(state.transitions.length, 0);
  });

  it('DL-14: overwrites previous data for provided fields', () => {
    const store = createPossessionsStore();
    populateStore(store, { states: STATES });
    assert.equal(store.getState().states.length, 5);
    populateStore(store, { states: [STATES[0]] });
    assert.equal(store.getState().states.length, 1);
  });
});

// ── 4. createPopulatedStore ─────────────────────────────────────────

describe('createPopulatedStore', () => {
  it('DL-15: creates store with all data accessible via getState()', () => {
    const store = createPopulatedStore(CLAIM_TYPES, STATES, TRANSITIONS, EVENTS);
    const state = store.getState();
    assert.ok(state.claimTypes.length > 0);
    assert.ok(state.states.length > 0);
    assert.ok(state.transitions.length > 0);
    assert.ok(state.events.length > 0);
  });

  it('DL-16: store has correct claimTypes count', () => {
    const store = createPopulatedStore(CLAIM_TYPES, STATES, TRANSITIONS, EVENTS);
    assert.equal(store.getState().claimTypes.length, 2);
  });

  it('DL-17: store has correct states count', () => {
    const store = createPopulatedStore(CLAIM_TYPES, STATES, TRANSITIONS, EVENTS);
    assert.equal(store.getState().states.length, 5);
  });

  it('DL-18: created store has default activeClaimType of null', () => {
    const store = createPopulatedStore(CLAIM_TYPES, STATES, TRANSITIONS, EVENTS);
    assert.equal(store.getState().activeClaimType, null);
  });
});
