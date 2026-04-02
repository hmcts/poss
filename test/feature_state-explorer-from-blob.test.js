/**
 * feature_state-explorer-from-blob.test.js
 *
 * Tests for the state-explorer-from-blob feature.
 * Covers:
 *  1. Pure function behaviour of blobToWaTasks / blobToWaMappings
 *  2. Static analysis of app/state-explorer/page.tsx to verify correct wiring
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

import { blobToWaTasks, blobToWaMappings } from '../src/ref-data/adapter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGE_PATH = join(__dirname, '../app/state-explorer/page.tsx');

// ── Fixtures ────────────────────────────────────────────────────────────────

const validBlob = {
  waTasks: [
    { id: 'task-1', name: 'Review claim', roleCategory: 'JUDICIAL' },
    { id: 'task-2', name: 'Issue notice', roleCategory: 'CTSC' },
  ],
  eventTaskAssocs: [
    { waTaskId: 'task-1', eventId: 'evt-001', alignmentNotes: 'Triggered on claim submission' },
    { waTaskId: 'task-1', eventId: 'evt-002', alignmentNotes: 'Triggered on claim submission' },
    { waTaskId: 'task-2', eventId: 'evt-003', alignmentNotes: 'On issue' },
  ],
  states: [],
  events: [],
  stateEventAssocs: [],
  personas: [],
  personaStateAssocs: [],
  personaEventAssocs: [],
  personaTaskAssocs: [],
};

// ── T-F1: blobToWaTasks(null) returns [] ────────────────────────────────────

describe('blobToWaTasks', () => {
  it('T-F1: returns [] when blob is null', () => {
    const result = blobToWaTasks(null);
    assert.deepEqual(result, []);
  });

  it('T-F1b: returns [] when blob is undefined', () => {
    const result = blobToWaTasks(undefined);
    assert.deepEqual(result, []);
  });

  // ── T-F2: blobToWaTasks(validBlob) returns blob.waTasks ─────────────────

  it('T-F2: returns blob.waTasks when blob is valid', () => {
    const result = blobToWaTasks(validBlob);
    assert.deepEqual(result, validBlob.waTasks);
  });

  it('T-F2b: returns the exact same array reference from blob.waTasks', () => {
    const result = blobToWaTasks(validBlob);
    assert.equal(result, validBlob.waTasks, 'Should return the same waTasks array');
  });
});

// ── T-F3: blobToWaMappings(null) returns [] ─────────────────────────────────

describe('blobToWaMappings', () => {
  it('T-F3: returns [] when blob is null', () => {
    const result = blobToWaMappings(null);
    assert.deepEqual(result, []);
  });

  it('T-F3b: returns [] when blob is undefined', () => {
    const result = blobToWaMappings(undefined);
    assert.deepEqual(result, []);
  });

  it('T-F3c: returns [] when blob has empty eventTaskAssocs', () => {
    const emptyAssocBlob = { ...validBlob, eventTaskAssocs: [] };
    const result = blobToWaMappings(emptyAssocBlob);
    assert.deepEqual(result, []);
  });

  it('T-F3d: returns grouped mappings when blob has eventTaskAssocs', () => {
    const result = blobToWaMappings(validBlob);
    // Should have 2 entries (one per unique waTaskId)
    assert.equal(result.length, 2);
    const task1 = result.find(m => m.waTaskId === 'task-1');
    assert.ok(task1, 'task-1 mapping should exist');
    assert.deepEqual(task1.eventIds, ['evt-001', 'evt-002']);
  });
});

// ── Static import checks ─────────────────────────────────────────────────────

describe('app/state-explorer/page.tsx static import checks', () => {
  let pageSource;

  try {
    pageSource = readFileSync(PAGE_PATH, 'utf8');
  } catch (err) {
    throw new Error(`Could not read page.tsx at ${PAGE_PATH}: ${err.message}`);
  }

  // T-F4: page.tsx does NOT import from data/wa-tasks.json

  it('T-F4: does not import from data/wa-tasks.json', () => {
    const hasStaticImport = pageSource.includes('data/wa-tasks.json');
    assert.equal(
      hasStaticImport,
      false,
      'page.tsx must not import from data/wa-tasks.json — use blobToWaTasks(refData) instead',
    );
  });

  // T-F5: page.tsx does NOT import from data/wa-mappings.json

  it('T-F5: does not import from data/wa-mappings.json', () => {
    const hasStaticImport = pageSource.includes('data/wa-mappings.json');
    assert.equal(
      hasStaticImport,
      false,
      'page.tsx must not import from data/wa-mappings.json — use blobToWaMappings(refData) instead',
    );
  });

  // T-F6: page.tsx DOES import blobToWaTasks or blobToWaMappings

  it('T-F6: imports blobToWaTasks or blobToWaMappings from src/ref-data/adapter', () => {
    const hasAdapterImport =
      pageSource.includes('blobToWaTasks') || pageSource.includes('blobToWaMappings');
    assert.equal(
      hasAdapterImport,
      true,
      'page.tsx must import blobToWaTasks and/or blobToWaMappings from src/ref-data/adapter',
    );
  });
});
