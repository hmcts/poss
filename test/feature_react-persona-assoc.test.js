import { test, suite } from 'node:test';
import assert from 'node:assert/strict';
import {
  getPersonaCounts,
  toggleStateAssoc,
  toggleEventAssoc,
  toggleTaskAssoc,
  filterItems,
  isStateAssociated,
  isEventAssociated,
  isTaskAssociated,
} from '../src/ref-data/persona-assoc-logic.js';

// Fixtures
const stateAssocs = [
  { personaId: 'p1', stateId: 's1' },
  { personaId: 'p1', stateId: 's2' },
  { personaId: 'p2', stateId: 's1' },
];

const eventAssocs = [
  { personaId: 'p1', eventId: 'e1' },
  { personaId: 'p2', eventId: 'e2' },
];

const taskAssocs = [
  { personaId: 'p1', waTaskId: 't1' },
];

const refStates = [
  { id: 's1', name: 'Claim Issued', description: '' },
  { id: 's2', name: 'Awaiting Hearing', description: '' },
  { id: 's3', name: 'Judgment Made', description: '' },
];

const refEvents = [
  { id: 'e1', name: 'Submit Claim', description: '' },
  { id: 'e2', name: 'Cancel Case', description: '' },
];

const waTasks = [
  { id: 't1', taskName: 'Review Application', triggerDescription: '', taskContext: 'PRE_HEARING', alignment: 'ALIGNED' },
  { id: 't2', taskName: 'Issue Directions', triggerDescription: '', taskContext: 'PRE_HEARING', alignment: 'ALIGNED' },
];

suite('getPersonaCounts', () => {
  test('returns zero counts when no assocs exist', () => {
    const result = getPersonaCounts('p99', [], [], []);
    assert.deepEqual(result, { states: 0, events: 0, tasks: 0 });
  });

  test('returns correct counts for persona with assocs', () => {
    const result = getPersonaCounts('p1', stateAssocs, eventAssocs, taskAssocs);
    assert.deepEqual(result, { states: 2, events: 1, tasks: 1 });
  });

  test('ignores assocs for other personas', () => {
    const result = getPersonaCounts('p2', stateAssocs, eventAssocs, taskAssocs);
    assert.deepEqual(result, { states: 1, events: 1, tasks: 0 });
  });
});

suite('toggleStateAssoc', () => {
  test('adds assoc when not present', () => {
    const result = toggleStateAssoc('p1', 's3', stateAssocs);
    assert.equal(result.length, stateAssocs.length + 1);
    assert.ok(result.some(a => a.personaId === 'p1' && a.stateId === 's3'));
  });

  test('removes assoc when already present', () => {
    const result = toggleStateAssoc('p1', 's1', stateAssocs);
    assert.equal(result.length, stateAssocs.length - 1);
    assert.ok(!result.some(a => a.personaId === 'p1' && a.stateId === 's1'));
  });

  test('does not mutate the input array', () => {
    const input = [{ personaId: 'p1', stateId: 's1' }];
    const original = [...input];
    toggleStateAssoc('p1', 's1', input);
    assert.deepEqual(input, original);
  });
});

suite('toggleEventAssoc', () => {
  test('adds assoc when not present', () => {
    const result = toggleEventAssoc('p1', 'e2', eventAssocs);
    assert.ok(result.some(a => a.personaId === 'p1' && a.eventId === 'e2'));
  });

  test('removes assoc when already present', () => {
    const result = toggleEventAssoc('p1', 'e1', eventAssocs);
    assert.ok(!result.some(a => a.personaId === 'p1' && a.eventId === 'e1'));
  });
});

suite('toggleTaskAssoc', () => {
  test('adds assoc when not present', () => {
    const result = toggleTaskAssoc('p1', 't2', taskAssocs);
    assert.ok(result.some(a => a.personaId === 'p1' && a.waTaskId === 't2'));
  });

  test('removes assoc when already present', () => {
    const result = toggleTaskAssoc('p1', 't1', taskAssocs);
    assert.ok(!result.some(a => a.personaId === 'p1' && a.waTaskId === 't1'));
  });
});

suite('filterItems', () => {
  test('returns all items when query is empty string', () => {
    assert.equal(filterItems(refStates, '').length, refStates.length);
  });

  test('filters RefState by name (case-insensitive)', () => {
    const result = filterItems(refStates, 'claim');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 's1');
  });

  test('filters RefEvent by name (case-insensitive)', () => {
    const result = filterItems(refEvents, 'CANCEL');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 'e2');
  });

  test('filters WaTask by taskName', () => {
    const result = filterItems(waTasks, 'review');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 't1');
  });

  test('returns empty array when no match', () => {
    const result = filterItems(refStates, 'zzznomatch');
    assert.equal(result.length, 0);
  });

  test('partial match works', () => {
    const result = filterItems(refStates, 'hear');
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 's2');
  });
});

suite('isStateAssociated', () => {
  test('returns true when assoc exists', () => {
    assert.ok(isStateAssociated('p1', 's1', stateAssocs));
  });

  test('returns false when assoc does not exist', () => {
    assert.ok(!isStateAssociated('p1', 's3', stateAssocs));
  });

  test('returns false for different personaId', () => {
    assert.ok(!isStateAssociated('p99', 's1', stateAssocs));
  });
});

suite('isEventAssociated', () => {
  test('returns true when assoc exists', () => {
    assert.ok(isEventAssociated('p1', 'e1', eventAssocs));
  });

  test('returns false when assoc does not exist', () => {
    assert.ok(!isEventAssociated('p1', 'e2', eventAssocs));
  });
});

suite('isTaskAssociated', () => {
  test('returns true when assoc exists', () => {
    assert.ok(isTaskAssociated('p1', 't1', taskAssocs));
  });

  test('returns false when assoc does not exist', () => {
    assert.ok(!isTaskAssociated('p1', 't2', taskAssocs));
  });

  test('returns false for different personaId', () => {
    assert.ok(!isTaskAssociated('p99', 't1', taskAssocs));
  });
});
