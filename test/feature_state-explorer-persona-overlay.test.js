import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getPersonasForState } from '../src/state-explorer/persona-helpers.js';

const makeBlob = (overrides = {}) => ({
  states: [],
  events: [],
  waTasks: [],
  personas: [
    { id: 'p1', roles: ['Judge', 'Caseworker'], isCrossCutting: false },
    { id: 'p2', roles: ['Claimant'], isCrossCutting: true },
    { id: 'p3', roles: ['Defendant'], isCrossCutting: false },
  ],
  stateEventAssocs: [],
  eventTaskAssocs: [],
  personaStateAssocs: [
    { personaId: 'p1', stateId: 's1' },
    { personaId: 'p2', stateId: 's1' },
    { personaId: 'p3', stateId: 's2' },
  ],
  personaEventAssocs: [],
  personaTaskAssocs: [],
  ...overrides,
});

describe('getPersonasForState', () => {
  it('T-P1: returns correct personas when assocs exist for stateId', () => {
    const blob = makeBlob();
    const result = getPersonasForState(blob, 's1');
    assert.equal(result.length, 2);
    assert.deepEqual(result.map((p) => p.id).sort(), ['p1', 'p2']);
    assert.deepEqual(result.find((p) => p.id === 'p1')?.roles, ['Judge', 'Caseworker']);
  });

  it('T-P2: returns empty array when no assocs match the stateId', () => {
    const blob = makeBlob();
    const result = getPersonasForState(blob, 'no-such-state');
    assert.deepEqual(result, []);
  });

  it('T-P3: returns empty array when blob is null', () => {
    const result = getPersonasForState(null, 's1');
    assert.deepEqual(result, []);
  });

  it('T-P4: persona chip shows roles as comma-separated string', () => {
    const blob = makeBlob();
    const result = getPersonasForState(blob, 's1');
    const p1 = result.find((p) => p.id === 'p1');
    assert.ok(p1, 'persona p1 should be present');
    assert.equal(p1.roles.join(', '), 'Judge, Caseworker');
  });

  it('T-P5: isCrossCutting=true persona is identified correctly', () => {
    const blob = makeBlob();
    const result = getPersonasForState(blob, 's1');
    const crossCutting = result.find((p) => p.isCrossCutting === true);
    assert.ok(crossCutting, 'should find a cross-cutting persona');
    assert.equal(crossCutting.id, 'p2');
  });
});
