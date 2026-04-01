/**
 * Tests for src/ref-data/seed.ts pure transformation functions.
 *
 * Import strategy: imports from `../src/ref-data/seed.js` (bridge file).
 * This file will fail at import time until Codey creates seed.ts and seed.js.
 * All tests are pure — no I/O, no mocking, no side effects.
 *
 * Ground truth data sourced from:
 *   data/wa-tasks.json          — 17 WA task objects
 *   data/persona-role-mapping.json — 23 persona keys
 *   data/wa-mappings.json       — 17 mapping entries, 25 total non-empty eventIds, 16 unique events
 *   src/data-ingestion/states/MAIN_CLAIM_ENGLAND.json — 2 states
 */

import { suite, test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

import {
  slugify,
  personasFromMap,
  eventTaskAssocsFromMappings,
  eventsFromMappings,
  statesFromIngested,
} from '../src/ref-data/seed.js';

// ── Shared fixtures (loaded once, not I/O in test sense — static JSON) ────────

const require = createRequire(import.meta.url);

const waTasks = require('../data/wa-tasks.json');
const personaRoleMapping = require('../data/persona-role-mapping.json');
const waMappings = require('../data/wa-mappings.json');
const mainClaimEngland = require('../src/data-ingestion/states/MAIN_CLAIM_ENGLAND.json');

// ── Suite: slugify ─────────────────────────────────────────────────────────────

suite('slugify', () => {
  test('slugify: Case Issued → case-issued', () => {
    assert.equal(slugify('Case Issued'), 'case-issued');
  });

  test('slugify: Respond to Claim → respond-to-claim', () => {
    assert.equal(slugify('Respond to Claim'), 'respond-to-claim');
  });

  test('slugify: Make an application → make-an-application', () => {
    assert.equal(slugify('Make an application'), 'make-an-application');
  });

  test('slugify: stable across multiple calls', () => {
    const inputs = [
      'Case Issued',
      'Respond to Claim',
      'Make an application',
      'Upload your documents',
      'Allocate hearing centre',
    ];
    for (const input of inputs) {
      assert.equal(slugify(input), slugify(input), `slugify("${input}") must return same value on every call`);
    }
  });
});

// ── Suite: seed-waTasks ────────────────────────────────────────────────────────

suite('seed-waTasks', () => {
  test('waTasks: direct copy produces 17 items', () => {
    // waTasks is a direct copy — no transformation needed.
    // Verify the fixture itself so any seed function that reads the same source also yields 17.
    assert.equal(waTasks.length, 17, 'wa-tasks.json must contain 17 entries');
  });

  test('waTasks: first item has id wa-task-01', () => {
    assert.equal(waTasks[0].id, 'wa-task-01', 'First WA task must have id wa-task-01');
  });
});

// ── Suite: seed-personas ───────────────────────────────────────────────────────

suite('seed-personas', () => {
  test('personas: 23 items from map with 23 keys', () => {
    const result = personasFromMap(personaRoleMapping);
    assert.equal(result.length, 23, 'personasFromMap must return 23 personas');
  });

  test('personas: object key becomes id field', () => {
    const result = personasFromMap(personaRoleMapping);
    const judge = result.find((p) => p.id === 'judge');
    assert.ok(judge !== undefined, 'persona with id "judge" must exist');
    assert.equal(judge.id, 'judge');
  });

  test('personas: value fields preserved', () => {
    const result = personasFromMap(personaRoleMapping);
    const judge = result.find((p) => p.id === 'judge');
    assert.ok(judge !== undefined, 'persona with id "judge" must exist');
    assert.deepEqual(judge.roles, ['Judge'], 'roles must be preserved from source value');
    assert.equal(judge.isCrossCutting, false, 'isCrossCutting must be preserved from source value');
  });

  test('personas: every item has id matching original key', () => {
    const result = personasFromMap(personaRoleMapping);
    const originalKeys = Object.keys(personaRoleMapping);
    assert.equal(result.length, originalKeys.length, 'result length must match source key count');
    for (const persona of result) {
      assert.ok(
        originalKeys.includes(persona.id),
        `persona id "${persona.id}" must match an original key in the source map`,
      );
    }
  });
});

// ── Suite: seed-events-and-assocs ──────────────────────────────────────────────

suite('seed-events-and-assocs', () => {
  test('events: no duplicate event ids', () => {
    const events = eventsFromMappings(waMappings);
    const ids = events.map((e) => e.id);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size, 'events array must not contain duplicate ids');
  });

  test('events: 16 unique events from wa-mappings', () => {
    const events = eventsFromMappings(waMappings);
    assert.equal(events.length, 16, 'eventsFromMappings must return exactly 16 unique events');
  });

  test('events: Make an application appears once', () => {
    const events = eventsFromMappings(waMappings);
    const matches = events.filter((e) => e.name === 'Make an application');
    assert.equal(matches.length, 1, '"Make an application" must appear exactly once in events array');
  });

  test('eventTaskAssocs: 25 rows from 17 mappings', () => {
    const assocs = eventTaskAssocsFromMappings(waMappings);
    assert.equal(assocs.length, 25, 'eventTaskAssocsFromMappings must return 25 rows');
  });

  test('eventTaskAssocs: wa-task-17 zero rows', () => {
    const assocs = eventTaskAssocsFromMappings(waMappings);
    const wa17Rows = assocs.filter((a) => a.waTaskId === 'wa-task-17');
    assert.equal(wa17Rows.length, 0, 'wa-task-17 has empty eventIds — must produce zero assoc rows');
  });

  test('eventTaskAssocs: row shape is correct', () => {
    const assocs = eventTaskAssocsFromMappings(waMappings);
    assert.ok(assocs.length > 0, 'must have at least one assoc row to inspect');
    for (const row of assocs) {
      assert.ok('eventId' in row, 'each row must have eventId');
      assert.ok('waTaskId' in row, 'each row must have waTaskId');
      assert.ok('alignmentNotes' in row, 'each row must have alignmentNotes');
      assert.equal(typeof row.eventId, 'string', 'eventId must be a string');
      assert.equal(typeof row.waTaskId, 'string', 'waTaskId must be a string');
      assert.equal(typeof row.alignmentNotes, 'string', 'alignmentNotes must be a string');
    }
  });

  test('eventTaskAssocs: all eventIds exist in events array', () => {
    const events = eventsFromMappings(waMappings);
    const assocs = eventTaskAssocsFromMappings(waMappings);
    const eventIdSet = new Set(events.map((e) => e.id));
    for (const row of assocs) {
      assert.ok(
        eventIdSet.has(row.eventId),
        `assoc eventId "${row.eventId}" must match an id in the events array`,
      );
    }
  });
});

// ── Suite: seed-states ─────────────────────────────────────────────────────────

suite('seed-states', () => {
  test('states: 2 states from single ingestion file', () => {
    const result = statesFromIngested([mainClaimEngland]);
    assert.equal(result.length, 2, 'statesFromIngested([MAIN_CLAIM_ENGLAND]) must return 2 states');
  });

  test('states: field mapping technicalName→name, description empty', () => {
    const result = statesFromIngested([mainClaimEngland]);
    const draft = result.find((s) => s.id === 'MCE_DRAFT');
    assert.ok(draft !== undefined, 'MCE_DRAFT state must be present');
    assert.equal(draft.id, 'MCE_DRAFT', 'id must be preserved');
    assert.equal(draft.name, 'DRAFT', 'name must be set from technicalName ("DRAFT")');
    assert.equal(draft.description, '', 'description must be empty string');
  });

  test('states: multiple files aggregate', () => {
    // Simulate two ingestion files by passing the same file twice with different state ids.
    const fileA = {
      states: [{ id: 'ACW_DRAFT', technicalName: 'DRAFT', uiLabel: 'Draft', claimType: 'ACCELERATED_CLAIM_WALES' }],
      transitions: [],
    };
    const fileB = {
      states: [{ id: 'MCE_DRAFT', technicalName: 'DRAFT', uiLabel: 'Draft', claimType: 'MAIN_CLAIM_ENGLAND' }],
      transitions: [],
    };
    const result = statesFromIngested([fileA, fileB]);
    assert.equal(result.length, 2, 'aggregating two single-state files must produce 2 states');
    const ids = result.map((s) => s.id);
    assert.ok(ids.includes('ACW_DRAFT'), 'ACW_DRAFT must be present');
    assert.ok(ids.includes('MCE_DRAFT'), 'MCE_DRAFT must be present');
  });
});

// ── Suite: seed-validation ─────────────────────────────────────────────────────

suite('seed-validation', () => {
  test('validation: Zod parse throws on missing waTasks field', async () => {
    const { ReferenceDataBlobSchema } = await import('../src/ref-data/index.js');

    const blobMissingWaTasks = {
      states: [],
      events: [],
      // waTasks intentionally omitted
      personas: [],
      stateEventAssocs: [],
      eventTaskAssocs: [],
      personaStateAssocs: [],
      personaEventAssocs: [],
      personaTaskAssocs: [],
    };

    assert.throws(
      () => ReferenceDataBlobSchema.parse(blobMissingWaTasks),
      (err) => {
        assert.ok(err.name === 'ZodError', `Expected ZodError, got: ${err.name}`);
        return true;
      },
      'Zod parse must throw ZodError when waTasks field is missing',
    );
  });

  test('validation: four empty assoc arrays present and pass Zod', async () => {
    const { ReferenceDataBlobSchema } = await import('../src/ref-data/index.js');

    const blobWithEmptyAssocs = {
      states: [],
      events: [],
      waTasks: [],
      personas: [],
      stateEventAssocs: [],
      eventTaskAssocs: [],
      personaStateAssocs: [],
      personaEventAssocs: [],
      personaTaskAssocs: [],
    };

    const result = ReferenceDataBlobSchema.safeParse(blobWithEmptyAssocs);
    assert.ok(result.success, `Blob with four empty assoc arrays must pass Zod: ${JSON.stringify(result.error?.issues)}`);

    // Verify the four user-populated assoc arrays are present (not omitted)
    const parsed = result.data;
    assert.ok(Array.isArray(parsed.stateEventAssocs), 'stateEventAssocs must be present and an array');
    assert.ok(Array.isArray(parsed.personaStateAssocs), 'personaStateAssocs must be present and an array');
    assert.ok(Array.isArray(parsed.personaEventAssocs), 'personaEventAssocs must be present and an array');
    assert.ok(Array.isArray(parsed.personaTaskAssocs), 'personaTaskAssocs must be present and an array');
  });
});
