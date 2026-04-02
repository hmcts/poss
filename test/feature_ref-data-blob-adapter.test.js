/**
 * Tests for feature: ref-data-blob-adapter
 *
 * Runnable: node --test test/feature_ref-data-blob-adapter.test.js
 *
 * What is tested here:
 *   T-D1   blobToEvents returns Event[] with id, name, claimType, state
 *   T-D2   blobToEvents filters to the requested claimTypeId
 *   T-D3   blobToEvents returns [] when no events match claimTypeId
 *   T-D4   blobToEvents deduplicates by eventId (first wins)
 *   T-D5   blobToEvents returns [] when blob is null
 *   T-D6   blobToEvents applies safe defaults for absent fields
 *   T-D7   blobToWaMappings returns { waTaskId, eventIds[], alignmentNotes }
 *   T-D8   blobToWaMappings groups multiple assocs with same waTaskId
 *   T-D9   blobToWaMappings returns [] when blob is null
 *   T-D10  blobToWaMappings returns [] when eventTaskAssocs is empty
 *   T-D11  blobToEvents(null) → []
 *   T-D12  blobToEvents(emptyBlob, 'ANY') → []
 *   T-D13  blobToWaMappings(null) → []
 *   T-D14  blobToWaMappings(emptyBlob) → []
 */

import { suite, test } from 'node:test';
import assert from 'node:assert/strict';

// ── Module under test (contract-first — may not exist yet) ────────────────────

let blobToEvents, blobToWaMappings;
try {
  const mod = await import('../src/ref-data/adapter.js');
  blobToEvents = mod.blobToEvents;
  blobToWaMappings = mod.blobToWaMappings;
} catch {
  blobToEvents = null;
  blobToWaMappings = null;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SAMPLE_BLOB = {
  states: [
    { id: 'st-england', name: 'England State', description: '', claimType: 'MAIN_CLAIM_ENGLAND' },
    { id: 'st-wales',   name: 'Wales State',   description: '', claimType: 'ACCELERATED_CLAIM_WALES' },
  ],
  events: [
    { id: 'e1', name: 'Event One',   description: 'desc-e1' },
    { id: 'e2', name: 'Event Two',   description: 'desc-e2' },
    { id: 'e3', name: 'Event Three', description: 'desc-e3' },
  ],
  waTasks: [],
  personas: [],
  stateEventAssocs: [
    { stateId: 'st-england', eventId: 'e1' },
    { stateId: 'st-england', eventId: 'e2' },
    { stateId: 'st-wales',   eventId: 'e2' },
    { stateId: 'st-wales',   eventId: 'e3' },
  ],
  eventTaskAssocs: [
    { eventId: 'e1', waTaskId: 'task1', alignmentNotes: 'note-a' },
    { eventId: 'e2', waTaskId: 'task1', alignmentNotes: 'note-b' },
    { eventId: 'e2', waTaskId: 'task2', alignmentNotes: 'note-c' },
  ],
  personaStateAssocs: [],
  personaEventAssocs: [],
  personaTaskAssocs: [],
};

const EMPTY_BLOB = {
  states: [], events: [], waTasks: [], personas: [],
  stateEventAssocs: [], eventTaskAssocs: [],
  personaStateAssocs: [], personaEventAssocs: [], personaTaskAssocs: [],
};

// ── Suite 1: blobToEvents ─────────────────────────────────────────────────────

suite('blobToEvents(blob, claimTypeId)', () => {

  test('T-D1: returns Event[] with id, name, claimType, state from RefEvent', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    const result = blobToEvents(SAMPLE_BLOB, 'MAIN_CLAIM_ENGLAND');
    assert.ok(Array.isArray(result), 'result must be an array');
    assert.ok(result.length > 0, 'must return at least one event for MAIN_CLAIM_ENGLAND');
    const e = result[0];
    assert.ok(typeof e.id === 'string' && e.id.length > 0, 'event.id must be a non-empty string');
    assert.ok(typeof e.name === 'string' && e.name.length > 0, 'event.name must be a non-empty string');
    assert.equal(e.claimType, 'MAIN_CLAIM_ENGLAND', 'event.claimType must equal the requested claimTypeId');
    assert.ok(typeof e.state === 'string' && e.state.length > 0, 'event.state must be a non-empty string');
  });

  test('T-D2: filters to claimTypeId — excludes events linked only to other claim types', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    const englandEvents = blobToEvents(SAMPLE_BLOB, 'MAIN_CLAIM_ENGLAND');
    const ids = englandEvents.map(e => e.id);
    assert.ok(ids.includes('e1'), 'e1 must appear (linked to st-england)');
    assert.ok(!ids.includes('e3'), 'e3 must NOT appear (linked only to st-wales)');
    englandEvents.forEach(e => assert.equal(e.claimType, 'MAIN_CLAIM_ENGLAND'));
  });

  test('T-D3: returns [] when no events match claimTypeId', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    const result = blobToEvents(SAMPLE_BLOB, 'UNKNOWN_CLAIM_TYPE');
    assert.deepEqual(result, []);
  });

  test('T-D4: deduplicates by eventId — first stateEventAssoc wins, no duplicate rows', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    // Add a duplicate assoc for e1 under the same claim type
    const blobWithDupe = {
      ...SAMPLE_BLOB,
      stateEventAssocs: [
        ...SAMPLE_BLOB.stateEventAssocs,
        { stateId: 'st-england', eventId: 'e1' }, // duplicate
      ],
    };
    const result = blobToEvents(blobWithDupe, 'MAIN_CLAIM_ENGLAND');
    const e1Rows = result.filter(e => e.id === 'e1');
    assert.equal(e1Rows.length, 1, 'e1 must appear exactly once despite duplicate stateEventAssoc');
  });

  test('T-D5: returns [] when blob is null', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    const result = blobToEvents(null, 'MAIN_CLAIM_ENGLAND');
    assert.deepEqual(result, []);
  });

  test('T-D6: applies safe defaults — isSystemEvent=false, actors={}, hasOpenQuestions=false, notes=""', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    const result = blobToEvents(SAMPLE_BLOB, 'MAIN_CLAIM_ENGLAND');
    assert.ok(result.length > 0, 'must return events to inspect defaults');
    const e = result[0];
    assert.equal(e.isSystemEvent, false, 'isSystemEvent must default to false');
    assert.deepEqual(e.actors, {}, 'actors must default to {}');
    assert.equal(e.hasOpenQuestions, false, 'hasOpenQuestions must default to false');
    assert.equal(e.notes, '', 'notes must default to empty string');
  });
});

// ── Suite 2: blobToWaMappings ─────────────────────────────────────────────────

suite('blobToWaMappings(blob)', () => {

  test('T-D7: returns array of { waTaskId, eventIds[], alignmentNotes } objects', () => {
    assert.ok(blobToWaMappings, 'blobToWaMappings must be exported from src/ref-data/adapter.js');
    const result = blobToWaMappings(SAMPLE_BLOB);
    assert.ok(Array.isArray(result), 'result must be an array');
    assert.ok(result.length > 0, 'must return at least one mapping');
    const m = result[0];
    assert.ok(typeof m.waTaskId === 'string', 'waTaskId must be a string');
    assert.ok(Array.isArray(m.eventIds), 'eventIds must be an array');
    assert.ok(typeof m.alignmentNotes === 'string', 'alignmentNotes must be a string');
  });

  test('T-D8: groups multiple assocs with same waTaskId — one entry, first-wins for alignmentNotes', () => {
    assert.ok(blobToWaMappings, 'blobToWaMappings must be exported from src/ref-data/adapter.js');
    const result = blobToWaMappings(SAMPLE_BLOB);
    // task1 has two assocs (e1 and e2)
    const task1 = result.find(m => m.waTaskId === 'task1');
    assert.ok(task1, 'task1 mapping must exist');
    assert.equal(task1.eventIds.length, 2, 'task1 must collect both e1 and e2');
    assert.ok(task1.eventIds.includes('e1'), 'task1.eventIds must include e1');
    assert.ok(task1.eventIds.includes('e2'), 'task1.eventIds must include e2');
    assert.equal(task1.alignmentNotes, 'note-a', 'alignmentNotes must be from first-encountered assoc');
    // Two distinct waTaskIds → two entries
    assert.equal(result.length, 2, 'must produce one entry per unique waTaskId');
  });

  test('T-D9: returns [] when blob is null', () => {
    assert.ok(blobToWaMappings, 'blobToWaMappings must be exported from src/ref-data/adapter.js');
    const result = blobToWaMappings(null);
    assert.deepEqual(result, []);
  });

  test('T-D10: returns [] when eventTaskAssocs is empty', () => {
    assert.ok(blobToWaMappings, 'blobToWaMappings must be exported from src/ref-data/adapter.js');
    const result = blobToWaMappings(EMPTY_BLOB);
    assert.deepEqual(result, []);
  });
});

// ── Suite 3: null/empty safety ────────────────────────────────────────────────

suite('null/empty safety', () => {

  test('T-D11: blobToEvents(null, claimTypeId) → []', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    let result;
    assert.doesNotThrow(() => { result = blobToEvents(null, 'MAIN_CLAIM_ENGLAND'); });
    assert.deepEqual(result, []);
  });

  test('T-D12: blobToEvents(emptyBlob, "ANY") → []', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported from src/ref-data/adapter.js');
    let result;
    assert.doesNotThrow(() => { result = blobToEvents(EMPTY_BLOB, 'ANY'); });
    assert.deepEqual(result, []);
  });

  test('T-D13: blobToWaMappings(null) → []', () => {
    assert.ok(blobToWaMappings, 'blobToWaMappings must be exported from src/ref-data/adapter.js');
    let result;
    assert.doesNotThrow(() => { result = blobToWaMappings(null); });
    assert.deepEqual(result, []);
  });

  test('T-D14: blobToWaMappings(emptyBlob) → []', () => {
    assert.ok(blobToWaMappings, 'blobToWaMappings must be exported from src/ref-data/adapter.js');
    let result;
    assert.doesNotThrow(() => { result = blobToWaMappings(EMPTY_BLOB); });
    assert.deepEqual(result, []);
  });
});
