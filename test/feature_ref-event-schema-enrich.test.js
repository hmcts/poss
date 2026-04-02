/**
 * Tests for feature: ref-event-schema-enrich
 * Run: node --test test/feature_ref-event-schema-enrich.test.js
 *
 * T-E1..E6   RefEventSchema: optional enrichment fields with defaults
 * T-E7..E10  blobToEvents: propagates enriched fields from RefEvent
 * T-E11..E14 eventsFromIngested: forwards isSystemEvent+notes, omits actors+hasOpenQuestions
 */

import { suite, test } from 'node:test';
import assert from 'node:assert/strict';

let RefEventSchema, blobToEvents, eventsFromIngested;
try { ({ RefEventSchema } = await import('../src/ref-data/index.js')); } catch { RefEventSchema = null; }
try { ({ blobToEvents } = await import('../src/ref-data/adapter.js')); } catch { blobToEvents = null; }
try { ({ eventsFromIngested } = await import('../src/ref-data/seed.js')); } catch { eventsFromIngested = null; }

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MIN_EV = { id: 'ev-1', name: 'Minimal', description: 'desc' };
const FULL_EV = { ...MIN_EV, id: 'ev-2', actors: { Judge: true }, isSystemEvent: true, hasOpenQuestions: true, notes: 'note' };

const BLOB = {
  states: [{ id: 'st-1', name: 'S', description: '', claimType: 'MCE' }],
  events: [
    { id: 'ev-rich', name: 'Rich', description: '', actors: { Judge: true }, isSystemEvent: true, hasOpenQuestions: false, notes: 'a' },
    { id: 'ev-plain', name: 'Plain', description: '' },
  ],
  waTasks: [], personas: [],
  stateEventAssocs: [{ stateId: 'st-1', eventId: 'ev-rich' }, { stateId: 'st-1', eventId: 'ev-plain' }],
  eventTaskAssocs: [], personaStateAssocs: [], personaEventAssocs: [], personaTaskAssocs: [],
};

const INGESTED = [{ claimType: 'MCE', events: [
  { id: 'ev-sys',   name: 'Sys',   claimType: 'MCE', state: 'X', actors: {}, isSystemEvent: true,  notes: '',           hasOpenQuestions: false },
  { id: 'ev-noted', name: 'Noted', claimType: 'MCE', state: 'X', actors: {}, isSystemEvent: false, notes: 'check this', hasOpenQuestions: false },
]}];

// ── Suite 1: RefEventSchema enrichment ───────────────────────────────────────

suite('RefEventSchema enrichment', () => {
  test('T-E1: minimal event parses without error', () => {
    assert.ok(RefEventSchema, 'RefEventSchema must be exported');
    assert.doesNotThrow(() => RefEventSchema.parse(MIN_EV));
  });
  test('T-E2: fully enriched event parses correctly', () => {
    assert.ok(RefEventSchema, 'RefEventSchema must be exported');
    const r = RefEventSchema.parse(FULL_EV);
    assert.deepEqual(r.actors, { Judge: true });
    assert.equal(r.isSystemEvent, true);
    assert.equal(r.hasOpenQuestions, true);
    assert.equal(r.notes, 'note');
  });
  test('T-E3: actors defaults to {}', () => {
    assert.ok(RefEventSchema, 'RefEventSchema must be exported');
    assert.deepEqual(RefEventSchema.parse(MIN_EV).actors, {});
  });
  test('T-E4: isSystemEvent defaults to false', () => {
    assert.ok(RefEventSchema, 'RefEventSchema must be exported');
    assert.equal(RefEventSchema.parse(MIN_EV).isSystemEvent, false);
  });
  test('T-E5: hasOpenQuestions defaults to false', () => {
    assert.ok(RefEventSchema, 'RefEventSchema must be exported');
    assert.equal(RefEventSchema.parse(MIN_EV).hasOpenQuestions, false);
  });
  test('T-E6: notes defaults to empty string', () => {
    assert.ok(RefEventSchema, 'RefEventSchema must be exported');
    assert.equal(RefEventSchema.parse(MIN_EV).notes, '');
  });
});

// ── Suite 2: blobToEvents enriched field propagation ─────────────────────────

suite('blobToEvents enriched field propagation', () => {
  test('T-E7: Event.actors populated from RefEvent.actors when present', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported');
    const rich = blobToEvents(BLOB, 'MCE').find(e => e.id === 'ev-rich');
    assert.ok(rich, 'ev-rich must be in result');
    assert.deepEqual(rich.actors, { Judge: true });
  });
  test('T-E8: Event.isSystemEvent=true from RefEvent.isSystemEvent=true', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported');
    const rich = blobToEvents(BLOB, 'MCE').find(e => e.id === 'ev-rich');
    assert.ok(rich, 'ev-rich must be in result');
    assert.equal(rich.isSystemEvent, true);
  });
  test('T-E9: Event.actors defaults to {} when RefEvent.actors absent', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported');
    const plain = blobToEvents(BLOB, 'MCE').find(e => e.id === 'ev-plain');
    assert.ok(plain, 'ev-plain must be in result');
    assert.deepEqual(plain.actors, {});
  });
  test('T-E10: Event.isSystemEvent defaults to false when absent', () => {
    assert.ok(blobToEvents, 'blobToEvents must be exported');
    const plain = blobToEvents(BLOB, 'MCE').find(e => e.id === 'ev-plain');
    assert.ok(plain, 'ev-plain must be in result');
    assert.equal(plain.isSystemEvent, false);
  });
});

// ── Suite 3: eventsFromIngested carries isSystemEvent + notes ─────────────────

suite('eventsFromIngested carries isSystemEvent + notes', () => {
  test('T-E11: emits isSystemEvent=true when input has it', () => {
    assert.ok(eventsFromIngested, 'eventsFromIngested must be exported');
    const sys = eventsFromIngested(INGESTED).find(e => e.id === 'ev-sys');
    assert.ok(sys, 'ev-sys must be in result');
    assert.equal(sys.isSystemEvent, true);
  });
  test('T-E12: emits notes="check this" when input has it', () => {
    assert.ok(eventsFromIngested, 'eventsFromIngested must be exported');
    const noted = eventsFromIngested(INGESTED).find(e => e.id === 'ev-noted');
    assert.ok(noted, 'ev-noted must be in result');
    assert.equal(noted.notes, 'check this');
  });
  test('T-E13: actors not sourced from ingestion — remains empty {}', () => {
    assert.ok(eventsFromIngested, 'eventsFromIngested must be exported');
    for (const ev of eventsFromIngested(INGESTED)) {
      assert.deepEqual(ev.actors, {}, `"${ev.id}" actors must be {} — not sourced from ingestion`);
    }
  });
  test('T-E14: hasOpenQuestions not sourced from ingestion — remains false', () => {
    assert.ok(eventsFromIngested, 'eventsFromIngested must be exported');
    for (const ev of eventsFromIngested(INGESTED)) {
      assert.equal(ev.hasOpenQuestions, false, `"${ev.id}" hasOpenQuestions must be false — not sourced from ingestion`);
    }
  });
});
