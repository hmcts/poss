import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const CLAIM_TYPE_IDS = [
  'MAIN_CLAIM_ENGLAND',
  'ACCELERATED_CLAIM_WALES',
  'COUNTER_CLAIM',
  'COUNTER_CLAIM_MAIN_CLAIM_CLOSED',
  'ENFORCEMENT',
  'APPEALS',
  'GENERAL_APPLICATIONS',
];

function loadFile(id) {
  const path = resolve(root, `src/data-ingestion/states/${id}.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

// ── File existence and parseability ────────────────────────────────────
describe('AC-1/AC-2 — ingested state files exist and are valid JSON', () => {
  for (const id of CLAIM_TYPE_IDS) {
    it(`${id} file parses without error`, () => {
      assert.doesNotThrow(() => loadFile(id));
    });
  }
});

// ── Non-empty arrays ────────────────────────────────────────────────────
describe('AC-1/AC-2 — each file has non-empty states and transitions', () => {
  for (const id of CLAIM_TYPE_IDS) {
    it(`${id} has at least one state and one transition`, () => {
      const { states, transitions } = loadFile(id);
      assert.ok(Array.isArray(states), 'states must be an array');
      assert.ok(Array.isArray(transitions), 'transitions must be an array');
      assert.ok(states.length > 0, 'states must not be empty');
      assert.ok(transitions.length > 0, 'transitions must not be empty');
    });
  }
});

// ── State shape ─────────────────────────────────────────────────────────
describe('AC-1/AC-2 — every state has required fields with correct types', () => {
  const STATE_FIELDS = ['id', 'technicalName', 'uiLabel', 'claimType', 'isDraftLike', 'isLive', 'isEndState', 'completeness'];
  for (const id of CLAIM_TYPE_IDS) {
    it(`${id} states have all required fields`, () => {
      const { states } = loadFile(id);
      for (const state of states) {
        for (const field of STATE_FIELDS) {
          assert.ok(field in state, `state "${state.id ?? '?'}" missing field "${field}"`);
        }
        assert.equal(typeof state.id, 'string');
        assert.equal(typeof state.technicalName, 'string');
        assert.equal(typeof state.uiLabel, 'string');
        assert.equal(typeof state.isDraftLike, 'boolean');
        assert.equal(typeof state.isLive, 'boolean');
        assert.equal(typeof state.isEndState, 'boolean');
        assert.equal(typeof state.completeness, 'number');
      }
    });
  }
});

// ── Transition shape ────────────────────────────────────────────────────
describe('AC-1/AC-2 — every transition has required fields with correct types', () => {
  const TRANSITION_FIELDS = ['from', 'to', 'condition', 'isSystemTriggered', 'isTimeBased'];
  for (const id of CLAIM_TYPE_IDS) {
    it(`${id} transitions have all required fields`, () => {
      const { transitions } = loadFile(id);
      for (const t of transitions) {
        for (const field of TRANSITION_FIELDS) {
          assert.ok(field in t, `transition "${t.from ?? '?'}->${t.to ?? '?'}" missing field "${field}"`);
        }
        assert.equal(typeof t.from, 'string');
        assert.equal(typeof t.to, 'string');
        assert.equal(typeof t.isSystemTriggered, 'boolean');
        assert.equal(typeof t.isTimeBased, 'boolean');
      }
    });
  }
});

// ── claimType field matches file name ───────────────────────────────────
describe('AC-1/AC-2 — states claimType field matches ClaimTypeId', () => {
  for (const id of CLAIM_TYPE_IDS) {
    it(`${id} states each have claimType === "${id}"`, () => {
      const { states } = loadFile(id);
      for (const state of states) {
        assert.equal(state.claimType, id, `state "${state.id}" has wrong claimType`);
      }
    });
  }
});

// ── AC-5 — providers.tsx no longer contains synthetic data ──────────────
describe('AC-5 — providers.tsx does not contain createSampleData or CLAIM_DATA', () => {
  const source = readFileSync(resolve(root, 'app/providers.tsx'), 'utf8');

  it('createSampleData is absent from providers.tsx', () => {
    assert.ok(!source.includes('createSampleData'), 'providers.tsx still contains createSampleData');
  });

  it('CLAIM_DATA is absent from providers.tsx', () => {
    assert.ok(!source.includes('CLAIM_DATA'), 'providers.tsx still contains CLAIM_DATA');
  });
});
