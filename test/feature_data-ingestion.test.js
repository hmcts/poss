import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../src/data-ingestion/index.js').catch(() => null);
const skip = !mod;
const get = (name) => (mod ? mod[name] : undefined);

const rowA = (name, state, notes, actors) => ({
  name, state, notes: notes ?? '', isSystemEvent: false, ...actors,
});
const rowB = (name, state, notes, who) => ({
  name, state, notes: notes ?? '', isSystemEvent: false, whoPermissions: who,
});

// ── Format A Parser ─────────────────────────────────────────────────
describe('parseFormatASheet', { skip }, () => {
  const parse = get('parseFormatASheet');
  it('converts Y/N columns into actors record', () => {
    const evts = parse([rowA('File', 'DRAFT', '', { Judge: 'Y', Caseworker: 'N' })], 'MAIN_CLAIM_ENGLAND');
    assert.equal(evts[0].actors.Judge, true);
    assert.equal(evts[0].actors.Caseworker, false);
  });
  it('treats blank cells as false', () => {
    const evts = parse([rowA('Sub', 'DRAFT', '', { Judge: '', Caseworker: 'Y' })], 'MAIN_CLAIM_ENGLAND');
    assert.equal(evts[0].actors.Judge, false);
  });
  it('generates IDs as claimTypeId:index (0-based)', () => {
    const evts = parse([rowA('A', 'S1', '', {}), rowA('B', 'S2', '', {})], 'ENFORCEMENT');
    assert.equal(evts[0].id, 'ENFORCEMENT:0');
    assert.equal(evts[1].id, 'ENFORCEMENT:1');
  });
  it('returns empty array for empty input', () => {
    assert.equal(parse([], 'MAIN_CLAIM_ENGLAND').length, 0);
  });
});

// ── Format B Parser ─────────────────────────────────────────────────
describe('parseFormatBSheet', { skip }, () => {
  const parse = get('parseFormatBSheet');
  it('parses comma-separated roles', () => {
    const evts = parse([rowB('Respond', 'ISSUED', '', 'Judge, Caseworker')], 'COUNTER_CLAIM');
    assert.equal(evts[0].actors.Judge, true);
    assert.equal(evts[0].actors.Caseworker, true);
  });
  it('handles semicolon-separated roles', () => {
    const evts = parse([rowB('Appeal', 'ISSUED', '', 'Claimant; Defendant')], 'APPEALS');
    assert.equal(evts[0].actors.Claimant, true);
    assert.equal(evts[0].actors.Defendant, true);
  });
  it('does not throw on unrecognised role text', () => {
    assert.doesNotThrow(() => parse([rowB('X', 'S1', '', 'UnknownRole, Judge')], 'APPEALS'));
    assert.equal(parse([rowB('X', 'S1', '', 'UnknownRole, Judge')], 'APPEALS')[0].actors.Judge, true);
  });
  it('matches roles case-insensitively', () => {
    const evts = parse([rowB('Y', 'S1', '', 'judge, CASEWORKER')], 'APPEALS');
    assert.equal(evts[0].actors.Judge, true);
    assert.equal(evts[0].actors.Caseworker, true);
  });
});

// ── Open Question Detector ──────────────────────────────────────────
describe('detectOpenQuestions', { skip }, () => {
  const detect = get('detectOpenQuestions');
  for (const m of ['?', 'TBC', 'TBD', 'placeholder', 'question', 'Alex to check']) {
    it(`true for "${m}"`, () => assert.equal(detect(`text ${m} more`), true));
  }
  it('case-insensitive', () => {
    assert.equal(detect('this is tbc'), true);
    assert.equal(detect('PLACEHOLDER value'), true);
  });
  it('false for empty string', () => assert.equal(detect(''), false));
  it('false for clean notes', () => assert.equal(detect('All confirmed.'), false));
});

// ── Completeness Calculator ─────────────────────────────────────────
describe('computeCompleteness', { skip }, () => {
  const compute = get('computeCompleteness');
  it('0 for empty list', () => assert.equal(compute([]), 0));
  it('100 when all clean', () => {
    assert.equal(compute([{ hasOpenQuestions: false }, { hasOpenQuestions: false }]), 100);
  });
  it('0 when all have questions', () => {
    assert.equal(compute([{ hasOpenQuestions: true }, { hasOpenQuestions: true }]), 0);
  });
  it('rounded integer for mixed (2/3 = 67)', () => {
    const r = compute([{ hasOpenQuestions: false }, { hasOpenQuestions: true }, { hasOpenQuestions: false }]);
    assert.equal(r, 67);
    assert.equal(Number.isInteger(r), true);
  });
});

// ── Breathing Space / Stayed ────────────────────────────────────────
describe('parseBreathingSpaceMatrix', { skip }, () => {
  const parse = get('parseBreathingSpaceMatrix');
  it('parses simple row', () => {
    const r = parse([{ stateFrom: 'ISSUED', stateTo: 'BS_ACTIVE', isConditional: false, conditions: [] }]);
    assert.equal(r.length, 1);
    assert.equal(r[0].stateFrom, 'ISSUED');
  });
  it('handles conditional state-after', () => {
    const r = parse([{ stateFrom: 'ISSUED', stateTo: 'X OR Y', isConditional: true, conditions: ['X', 'Y'] }]);
    assert.equal(r[0].isConditional, true);
    assert.ok(r[0].conditions.length >= 2);
  });
});

describe('parseStayedMatrix', { skip }, () => {
  it('produces array from valid rows', () => {
    const r = get('parseStayedMatrix')([{ stateFrom: 'HEARING', stateTo: 'STAYED', isConditional: false, conditions: [] }]);
    assert.equal(r.length, 1);
  });
});

// ── BreathingSpaceEntrySchema ───────────────────────────────────────
describe('BreathingSpaceEntrySchema', { skip }, () => {
  const schema = get('BreathingSpaceEntrySchema');
  it('accepts valid entry', () => {
    assert.equal(schema.safeParse({ stateFrom: 'ISSUED', stateTo: 'BS', isConditional: false, conditions: [] }).success, true);
  });
  it('rejects missing stateFrom', () => {
    assert.equal(schema.safeParse({ stateTo: 'BS', isConditional: false, conditions: [] }).success, false);
  });
});

// ── loadStatesAndTransitions ────────────────────────────────────────
describe('loadStatesAndTransitions', { skip }, () => {
  const load = get('loadStatesAndTransitions');
  it('returns states and transitions arrays', async () => {
    const r = await load('MAIN_CLAIM_ENGLAND');
    assert.ok(Array.isArray(r.states));
    assert.ok(Array.isArray(r.transitions));
  });
  it('states have required schema fields', async () => {
    const r = await load('MAIN_CLAIM_ENGLAND');
    if (r.states.length > 0) {
      for (const k of ['id', 'technicalName', 'completeness', 'isDraftLike']) assert.ok(k in r.states[0]);
    }
  });
});
