import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { blobToWaTasks, blobToWaMappings } from '../src/ref-data/adapter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGE_PATH = resolve(__dirname, '../app/event-matrix/page.tsx');

// ── Fixtures ────────────────────────────────────────────────────────

const validBlob = {
  waTasks: [
    { id: 'task-1', name: 'Review Claim', category: 'JUDICIAL' },
    { id: 'task-2', name: 'Issue Directions', category: 'JUDICIAL' },
  ],
  states: [],
  events: [],
  stateEventAssocs: [],
  eventTaskAssocs: [],
  personas: [],
  personaStateAssocs: [],
  personaEventAssocs: [],
  personaTaskAssocs: [],
};

// ── Tests ────────────────────────────────────────────────────────────

describe('event-matrix-from-blob', () => {
  describe('T-G1: blobToWaTasks(null) returns []', () => {
    it('returns an empty array for null blob', () => {
      const result = blobToWaTasks(null);
      assert.deepEqual(result, []);
    });
  });

  describe('T-G2: blobToWaTasks(validBlob) returns blob.waTasks', () => {
    it('returns the waTasks array from the blob', () => {
      const result = blobToWaTasks(validBlob);
      assert.deepEqual(result, validBlob.waTasks);
    });
  });

  describe('T-G3: blobToWaMappings(null) returns []', () => {
    it('returns an empty array for null blob', () => {
      const result = blobToWaMappings(null);
      assert.deepEqual(result, []);
    });
  });

  describe('T-G4: page.tsx does NOT import from data/wa-tasks.json', () => {
    it('page source does not contain wa-tasks.json import', () => {
      const src = readFileSync(PAGE_PATH, 'utf8');
      assert.ok(
        !src.includes('wa-tasks.json'),
        'Expected page.tsx to not import wa-tasks.json but it does',
      );
    });
  });

  describe('T-G5: page.tsx does NOT import from data/wa-mappings.json', () => {
    it('page source does not contain wa-mappings.json import', () => {
      const src = readFileSync(PAGE_PATH, 'utf8');
      assert.ok(
        !src.includes('wa-mappings.json'),
        'Expected page.tsx to not import wa-mappings.json but it does',
      );
    });
  });

  describe('T-G6: page.tsx DOES import blobToWaTasks or blobToWaMappings', () => {
    it('page source contains blobToWaTasks or blobToWaMappings', () => {
      const src = readFileSync(PAGE_PATH, 'utf8');
      assert.ok(
        src.includes('blobToWaTasks') || src.includes('blobToWaMappings'),
        'Expected page.tsx to import blobToWaTasks or blobToWaMappings but neither found',
      );
    });
  });
});
