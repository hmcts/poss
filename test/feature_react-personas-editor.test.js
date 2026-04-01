import { test, suite } from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePersonaId,
  isPersonaDeletable,
  applyPersonaEdit,
  addNewPersona,
  deletePersona,
  rolesToString,
  rolesFromString,
} from '../src/ref-data/personas-editor-logic.js';

const makePersona = (id, roles = [], isCrossCutting = false) => ({ id, roles, isCrossCutting });

const emptyAssocs = { personaStateAssocs: [], personaEventAssocs: [], personaTaskAssocs: [] };

// ── generatePersonaId ─────────────────────────────────────────────────────────

suite('generatePersonaId', () => {
  test('returns a string', () => {
    assert.equal(typeof generatePersonaId(), 'string');
  });

  test('starts with "persona-"', () => {
    assert.match(generatePersonaId(), /^persona-/);
  });

  test('two successive calls return different values', () => {
    assert.notEqual(generatePersonaId(), generatePersonaId());
  });
});

// ── isPersonaDeletable ────────────────────────────────────────────────────────

suite('isPersonaDeletable', () => {
  test('returns true when all assoc arrays are empty', () => {
    assert.equal(isPersonaDeletable('persona-1', emptyAssocs), true);
  });

  test('returns false when personaId appears in personaStateAssocs', () => {
    const assocs = {
      ...emptyAssocs,
      personaStateAssocs: [{ personaId: 'persona-1', stateId: 'state-1' }],
    };
    assert.equal(isPersonaDeletable('persona-1', assocs), false);
  });

  test('returns false when personaId appears in personaEventAssocs', () => {
    const assocs = {
      ...emptyAssocs,
      personaEventAssocs: [{ personaId: 'persona-1', eventId: 'event-1' }],
    };
    assert.equal(isPersonaDeletable('persona-1', assocs), false);
  });

  test('returns false when personaId appears in personaTaskAssocs', () => {
    const assocs = {
      ...emptyAssocs,
      personaTaskAssocs: [{ personaId: 'persona-1', waTaskId: 'task-1' }],
    };
    assert.equal(isPersonaDeletable('persona-1', assocs), false);
  });

  test('returns false when personaId appears in all three assoc arrays', () => {
    const assocs = {
      personaStateAssocs: [{ personaId: 'persona-1', stateId: 'state-1' }],
      personaEventAssocs: [{ personaId: 'persona-1', eventId: 'event-1' }],
      personaTaskAssocs: [{ personaId: 'persona-1', waTaskId: 'task-1' }],
    };
    assert.equal(isPersonaDeletable('persona-1', assocs), false);
  });

  test('returns true when assocs reference a different personaId', () => {
    const assocs = {
      personaStateAssocs: [{ personaId: 'persona-2', stateId: 'state-1' }],
      personaEventAssocs: [{ personaId: 'persona-2', eventId: 'event-1' }],
      personaTaskAssocs: [{ personaId: 'persona-2', waTaskId: 'task-1' }],
    };
    assert.equal(isPersonaDeletable('persona-1', assocs), true);
  });
});

// ── applyPersonaEdit ──────────────────────────────────────────────────────────

suite('applyPersonaEdit', () => {
  const personas = [
    makePersona('persona-1', ['Judge'], false),
    makePersona('persona-2', ['Caseworker'], true),
  ];

  test('returns a new array reference (no mutation)', () => {
    const result = applyPersonaEdit(personas, 'persona-1', { roles: ['Admin'] });
    assert.notEqual(result, personas);
  });

  test('updates roles of matching persona', () => {
    const result = applyPersonaEdit(personas, 'persona-1', { roles: ['Admin', 'Judge'] });
    assert.deepEqual(result[0].roles, ['Admin', 'Judge']);
  });

  test('updates isCrossCutting of matching persona', () => {
    const result = applyPersonaEdit(personas, 'persona-1', { isCrossCutting: true });
    assert.equal(result[0].isCrossCutting, true);
  });

  test('does not modify other personas', () => {
    const result = applyPersonaEdit(personas, 'persona-1', { roles: ['Changed'] });
    assert.deepEqual(result[1].roles, ['Caseworker']);
    assert.equal(result[1].isCrossCutting, true);
  });

  test('does not mutate original array items', () => {
    applyPersonaEdit(personas, 'persona-1', { roles: ['Mutated'] });
    assert.deepEqual(personas[0].roles, ['Judge']);
  });

  test('returns same-length array', () => {
    const result = applyPersonaEdit(personas, 'persona-1', { roles: [] });
    assert.equal(result.length, personas.length);
  });

  test('returns unchanged array when id not found', () => {
    const result = applyPersonaEdit(personas, 'persona-999', { roles: ['X'] });
    assert.equal(result.length, personas.length);
    assert.deepEqual(result[0].roles, ['Judge']);
  });
});

// ── addNewPersona ─────────────────────────────────────────────────────────────

suite('addNewPersona', () => {
  test('returns a new array reference', () => {
    const personas = [makePersona('persona-1')];
    const result = addNewPersona(personas);
    assert.notEqual(result, personas);
  });

  test('returns array with one more element', () => {
    const personas = [makePersona('persona-1')];
    const result = addNewPersona(personas);
    assert.equal(result.length, 2);
  });

  test('new persona id starts with "persona-"', () => {
    const result = addNewPersona([]);
    assert.match(result[0].id, /^persona-/);
  });

  test('new persona has empty roles array', () => {
    const result = addNewPersona([]);
    assert.deepEqual(result[0].roles, []);
  });

  test('new persona has isCrossCutting set to false', () => {
    const result = addNewPersona([]);
    assert.equal(result[0].isCrossCutting, false);
  });

  test('existing personas are unchanged', () => {
    const personas = [makePersona('persona-1', ['Judge'], true)];
    const result = addNewPersona(personas);
    assert.equal(result[0].id, 'persona-1');
    assert.deepEqual(result[0].roles, ['Judge']);
    assert.equal(result[0].isCrossCutting, true);
  });

  test('works with empty array', () => {
    const result = addNewPersona([]);
    assert.equal(result.length, 1);
    assert.match(result[0].id, /^persona-/);
  });
});

// ── deletePersona ─────────────────────────────────────────────────────────────

suite('deletePersona', () => {
  const personas = [
    makePersona('persona-1'),
    makePersona('persona-2'),
    makePersona('persona-3'),
  ];

  test('returns a new array reference', () => {
    const result = deletePersona(personas, 'persona-2');
    assert.notEqual(result, personas);
  });

  test('removes the targeted persona', () => {
    const result = deletePersona(personas, 'persona-2');
    assert.equal(result.length, 2);
    assert.ok(!result.find((p) => p.id === 'persona-2'));
  });

  test('leaves other personas unchanged', () => {
    const result = deletePersona(personas, 'persona-2');
    assert.ok(result.find((p) => p.id === 'persona-1'));
    assert.ok(result.find((p) => p.id === 'persona-3'));
  });

  test('returns same-length array if id not found', () => {
    const result = deletePersona(personas, 'persona-999');
    assert.equal(result.length, personas.length);
  });

  test('can delete first element', () => {
    const result = deletePersona(personas, 'persona-1');
    assert.equal(result[0].id, 'persona-2');
  });

  test('can delete last element', () => {
    const result = deletePersona(personas, 'persona-3');
    assert.equal(result[result.length - 1].id, 'persona-2');
  });

  test('returns empty array when sole element is deleted', () => {
    const result = deletePersona([makePersona('persona-1')], 'persona-1');
    assert.equal(result.length, 0);
  });
});

// ── rolesToString ─────────────────────────────────────────────────────────────

suite('rolesToString', () => {
  test('returns empty string for empty array', () => {
    assert.equal(rolesToString([]), '');
  });

  test('returns single role without separator', () => {
    assert.equal(rolesToString(['Judge']), 'Judge');
  });

  test('joins multiple roles with ", "', () => {
    assert.equal(rolesToString(['Judge', 'Caseworker']), 'Judge, Caseworker');
  });

  test('joins three roles correctly', () => {
    assert.equal(rolesToString(['A', 'B', 'C']), 'A, B, C');
  });
});

// ── rolesFromString ───────────────────────────────────────────────────────────

suite('rolesFromString', () => {
  test('returns empty array for empty string', () => {
    assert.deepEqual(rolesFromString(''), []);
  });

  test('returns array with single role for single value', () => {
    assert.deepEqual(rolesFromString('Judge'), ['Judge']);
  });

  test('splits on comma', () => {
    assert.deepEqual(rolesFromString('Judge,Caseworker'), ['Judge', 'Caseworker']);
  });

  test('trims whitespace from each role', () => {
    assert.deepEqual(rolesFromString('Judge, Caseworker , Admin'), ['Judge', 'Caseworker', 'Admin']);
  });

  test('filters out empty entries from trailing/double commas', () => {
    assert.deepEqual(rolesFromString('Judge,,Caseworker'), ['Judge', 'Caseworker']);
  });

  test('filters out whitespace-only entries', () => {
    assert.deepEqual(rolesFromString('Judge,  , Caseworker'), ['Judge', 'Caseworker']);
  });

  test('round-trips through rolesToString', () => {
    const roles = ['Judge', 'Caseworker', 'Admin'];
    assert.deepEqual(rolesFromString(rolesToString(roles)), roles);
  });
});
