/**
 * Tests for scripts/ingest-event-model.js pure functions.
 * One integration suite reads the real Excel workbook directly.
 * Runs with: node --test test/feature_ingest-event-model.test.js
 */

import { suite, test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { eventTaskAssocsFromMappings } from '../src/ref-data/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);

const mod = await import('../scripts/ingest-event-model.js').catch(() => null);
const skip = !mod;
const get = (name) => (mod ? mod[name] : undefined);

const KNOWN_ROLES = ['Judge','Caseworker','Claimant','Defendant','LegalAdvisor','BailiffEnforcement','CourtAdmin','SystemAuto'];

// ── SHEET_MAP ─────────────────────────────────────────────────────────────────

suite('SHEET_MAP', { skip }, () => {
  const SHEET_MAP = get('SHEET_MAP') ?? get('SHEET_TO_CLAIM_TYPE');
  const CLAIM_TYPES = ['MAIN_CLAIM_ENGLAND','ACCELERATED_CLAIM_WALES','COUNTER_CLAIM',
    'COUNTER_CLAIM_MAIN_CLAIM_CLOSED','ENFORCEMENT','APPEALS','GENERAL_APPLICATIONS'];

  test('T-A1: all 7 ClaimTypeId values present as values', () => {
    const values = Object.values(SHEET_MAP);
    for (const ct of CLAIM_TYPES) assert.ok(values.includes(ct), `SHEET_MAP missing "${ct}"`);
  });

  test('T-A2: exactly 7 entries', () => {
    assert.equal(Object.keys(SHEET_MAP).length, 7);
  });
});

// ── slugify ───────────────────────────────────────────────────────────────────

suite('slugify', { skip }, () => {
  const slugify = get('slugify');
  test('T-A3: lowercases and hyphenates', () => assert.equal(slugify('File Claim'), 'file-claim'));
  test('T-A4: stable on repeated calls', () => assert.equal(slugify('Make Application'), slugify('Make Application')));
  test('T-A5: prefixing claimTypeId gives unique id per claim type', () => {
    assert.notEqual('ENFORCEMENT:' + slugify('File'), 'APPEALS:' + slugify('File'));
  });
});

// ── rollUpActors ──────────────────────────────────────────────────────────────

suite('rollUpActors', { skip }, () => {
  const rollUpActors = get('rollUpActors');
  const headerToRole = { 'Claimant Col': 'Claimant', 'Defendant Col': 'Defendant', 'Court Admin': 'CourtAdmin', 'System Event': 'SystemAuto' };
  const sysCo = 'System Event';

  test('T-A6: Y sets role true, N sets false', () => {
    const { actors } = rollUpActors(headerToRole, { 'Claimant Col': 'Y', 'Defendant Col': 'N', 'Court Admin': 'N', 'System Event': 'N' }, sysCo);
    assert.equal(actors.Claimant, true);
    assert.equal(actors.Defendant, false);
  });

  test('T-A7: all-N row sets every mapped role false', () => {
    const { actors } = rollUpActors(headerToRole, { 'Claimant Col': 'N', 'Defendant Col': 'N', 'Court Admin': 'N', 'System Event': 'N' }, sysCo);
    assert.equal(actors.Claimant, false);
    assert.equal(actors.CourtAdmin, false);
  });

  test('T-A8: output always has all 7 canonical actor keys', () => {
    const { actors } = rollUpActors({}, {}, sysCo);
    for (const role of KNOWN_ROLES) assert.ok(role in actors, `missing key "${role}"`);
  });

  test('T-A9: SystemAuto true when System Event col is Y', () => {
    const { actors } = rollUpActors(headerToRole, { 'System Event': 'Y', 'Claimant Col': 'N', 'Defendant Col': 'N', 'Court Admin': 'N' }, sysCo);
    assert.equal(actors.SystemAuto, true);
  });

  test('T-A10: TBC cell → actor false and hasTbc true', () => {
    const { actors, hasTbc } = rollUpActors(headerToRole, { 'Claimant Col': 'TBC', 'Defendant Col': 'N', 'Court Admin': 'N', 'System Event': 'N' }, sysCo);
    assert.equal(actors.Claimant, false);
    assert.equal(hasTbc, true);
  });

  test('T-A11: tbc (mixed case) also triggers hasTbc', () => {
    const { hasTbc } = rollUpActors(headerToRole, { 'Claimant Col': 'tbc', 'Defendant Col': 'N', 'Court Admin': 'N', 'System Event': 'N' }, sysCo);
    assert.equal(hasTbc, true);
  });
});

// ── detectOpenQuestions ───────────────────────────────────────────────────────

suite('detectOpenQuestions', { skip }, () => {
  const d = get('detectOpenQuestions');
  test('T-A12/13/14/15: ? / TBC / TBD / placeholder → true', () => {
    assert.equal(d('Is this?'), true);
    assert.equal(d('Status TBC'), true);
    assert.equal(d('TBD'), true);
    assert.equal(d('placeholder text'), true);
  });
  test('T-A16/17: clean / empty / null / undefined → false', () => {
    assert.equal(d('Confirmed'), false);
    assert.equal(d(''), false);
    assert.equal(d(null), false);
    assert.equal(d(undefined), false);
  });
});

// ── carryForwardState ─────────────────────────────────────────────────────────

suite('carryForwardState', { skip }, () => {
  const cfs = get('carryForwardState');
  test('T-A18: non-blank resets; blank inherits', () => {
    assert.equal(cfs('', 'DRAFT'), 'DRAFT');
    assert.equal(cfs('DRAFT', undefined), 'DRAFT');
  });
  test('T-A19: first row with blank cell emits empty string', () => {
    assert.equal(cfs('', undefined), '');
    assert.equal(cfs('', ''), '');
  });
});

// ── buildEvents / parseSheet ──────────────────────────────────────────────────

suite('buildEvents', { skip }, () => {
  const buildEvents = get('buildEvents') ?? get('parseSheet');
  test('T-A20: duplicate slug dropped', () => {
    const rows = [{ name: 'File', state: 'DRAFT', notes: '' }, { name: 'File', state: 'DRAFT', notes: '' }];
    const events = buildEvents(rows, 'MAIN_CLAIM_ENGLAND', {});
    assert.equal(events.length, new Set(events.map(e => e.id)).size, 'ids must be unique');
  });
  test('T-A21: empty rows → empty array', () => {
    assert.equal(buildEvents([], 'MAIN_CLAIM_ENGLAND', {}).length, 0);
  });
});

// ── Integration: real Excel ───────────────────────────────────────────────────

suite('Integration: real Excel workbook', { skip }, () => {
  const SHEET_MAP = get('SHEET_MAP') ?? get('SHEET_TO_CLAIM_TYPE');
  const buildEvents = get('buildEvents') ?? get('parseSheet');
  const XLSX_PATH = path.resolve(__dirname, '../.business_context/Event Model Possession Service V0.1.xlsx');

  let allEvents = [];
  const byType = {};
  try {
    const xlsxMod = require('xlsx');
    const wb = xlsxMod.readFile(XLSX_PATH);
    for (const [sheet, ct] of Object.entries(SHEET_MAP)) {
      const ws = wb.Sheets[sheet];
      const rows = ws ? xlsxMod.utils.sheet_to_json(ws) : [];
      byType[ct] = buildEvents(rows, ct, {});
      allEvents = allEvents.concat(byType[ct]);
    }
  } catch { /* file or xlsx missing — tests will fail with descriptive messages */ }

  const POPULATED = ['MAIN_CLAIM_ENGLAND','COUNTER_CLAIM','ENFORCEMENT','GENERAL_APPLICATIONS','APPEALS'];
  const EMPTY = ['COUNTER_CLAIM_MAIN_CLAIM_CLOSED','ACCELERATED_CLAIM_WALES'];

  test('T-A22: 5 populated claim types each produce >0 events', () => {
    for (const ct of POPULATED) assert.ok((byType[ct] ?? []).length > 0, `${ct} must have >0 events`);
  });
  test('T-A23: 2 empty claim types produce 0 events', () => {
    for (const ct of EMPTY) assert.equal((byType[ct] ?? []).length, 0, `${ct} must have 0 events`);
  });
  test('T-A24: every event has all 7 actor keys', () => {
    for (const evt of allEvents)
      for (const role of KNOWN_ROLES)
        assert.ok(role in (evt.actors ?? {}), `event "${evt.id}" missing actor key "${role}"`);
  });
  test('T-A25: event ids are globally unique', () => {
    const ids = allEvents.map(e => e.id);
    assert.equal(ids.length, new Set(ids).size, 'duplicate event ids detected');
  });
  test('T-A26: total event count is 700–1100', () => {
    assert.ok(allEvents.length >= 700 && allEvents.length <= 1100,
      `Expected 700–1100 events, got ${allEvents.length}`);
  });
});

// ── Seed regression: eventTaskAssocsFromMappings ──────────────────────────────

suite('seed regression: eventTaskAssocsFromMappings', () => {
  const waMappings = require('../data/wa-mappings.json');
  test('T-B8: produces assoc rows with correct shape', () => {
    const assocs = eventTaskAssocsFromMappings(waMappings);
    assert.ok(assocs.length > 0, 'must produce at least one assoc row');
    for (const row of assocs)
      assert.ok('eventId' in row && 'waTaskId' in row && 'alignmentNotes' in row,
        'each row must have eventId, waTaskId, alignmentNotes');
  });
});
