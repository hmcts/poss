import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { blobToWaTasks, blobToWaMappings } from '../src/ref-data/adapter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGE_PATH = resolve(__dirname, '../app/digital-twin/page.tsx');

// Minimal valid blob for testing
function makeBlob(waTasks = [], eventTaskAssocs = []) {
  return {
    states: [],
    events: [],
    waTasks,
    personas: [],
    stateEventAssocs: [],
    eventTaskAssocs,
    personaStateAssocs: [],
    personaEventAssocs: [],
    personaTaskAssocs: [],
  };
}

test('T-H1: blobToWaTasks(null) returns []', () => {
  const result = blobToWaTasks(null);
  assert.ok(Array.isArray(result), 'result should be an array');
  assert.equal(result.length, 0, 'result should be empty');
});

test('T-H2: blobToWaTasks(validBlob) returns blob.waTasks array', () => {
  const waTasks = [
    { id: 'task-1', taskName: 'Review Application', role: 'Caseworker', context: 'Review', alignmentStatus: 'Aligned' },
    { id: 'task-2', taskName: 'Issue Order', role: 'Judge', context: 'Decision', alignmentStatus: 'Partial' },
  ];
  const blob = makeBlob(waTasks);
  const result = blobToWaTasks(blob);
  assert.equal(result.length, 2, 'should return 2 tasks');
  assert.equal(result[0].id, 'task-1');
  assert.equal(result[1].id, 'task-2');
});

test('T-H3: blobToWaMappings(null) returns []', () => {
  const result = blobToWaMappings(null);
  assert.ok(Array.isArray(result), 'result should be an array');
  assert.equal(result.length, 0, 'result should be empty');
});

test('T-H4: page.tsx does NOT import from data/wa-tasks.json', () => {
  const content = readFileSync(PAGE_PATH, 'utf-8');
  assert.ok(
    !content.includes('data/wa-tasks.json'),
    'page.tsx must not import from data/wa-tasks.json',
  );
});

test('T-H5: page.tsx does NOT import from data/wa-mappings.json', () => {
  const content = readFileSync(PAGE_PATH, 'utf-8');
  assert.ok(
    !content.includes('data/wa-mappings.json'),
    'page.tsx must not import from data/wa-mappings.json',
  );
});

test('T-H6: page.tsx DOES import blobToWaTasks or blobToWaMappings', () => {
  const content = readFileSync(PAGE_PATH, 'utf-8');
  assert.ok(
    content.includes('blobToWaTasks') || content.includes('blobToWaMappings'),
    'page.tsx must import blobToWaTasks or blobToWaMappings',
  );
});
