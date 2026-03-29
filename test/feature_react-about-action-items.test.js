import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getAboutSection,
  getAboutSections,
} from '../src/ui-about-action-items/index.js';

const KNOWN_KEYS = [
  'whatItDoes',
  'twoSources',
  'priorityAlgorithm',
  'modelHealthScore',
  'waAlignmentPct',
  'suggestions',
  'notPersisted',
];

// ── Group A: getAboutSection — content strings are non-empty ──────────────

describe('getAboutSection — whatItDoes section', () => {
  it('A-1: heading is a non-empty string', () => {
    const section = getAboutSection('whatItDoes');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-2: body is a non-empty string', () => {
    const section = getAboutSection('whatItDoes');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — twoSources section', () => {
  it('A-3: heading is a non-empty string', () => {
    const section = getAboutSection('twoSources');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-4: body is a non-empty string', () => {
    const section = getAboutSection('twoSources');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — priorityAlgorithm section', () => {
  it('A-5: heading is a non-empty string', () => {
    const section = getAboutSection('priorityAlgorithm');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-6: body is a non-empty string', () => {
    const section = getAboutSection('priorityAlgorithm');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — modelHealthScore section', () => {
  it('A-7: heading is a non-empty string', () => {
    const section = getAboutSection('modelHealthScore');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-8: body is a non-empty string', () => {
    const section = getAboutSection('modelHealthScore');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — waAlignmentPct section', () => {
  it('A-9: heading is a non-empty string', () => {
    const section = getAboutSection('waAlignmentPct');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-10: body is a non-empty string', () => {
    const section = getAboutSection('waAlignmentPct');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — suggestions section', () => {
  it('A-11: heading is a non-empty string', () => {
    const section = getAboutSection('suggestions');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-12: body is a non-empty string', () => {
    const section = getAboutSection('suggestions');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — notPersisted section', () => {
  it('A-13: heading is a non-empty string', () => {
    const section = getAboutSection('notPersisted');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-14: body is a non-empty string', () => {
    const section = getAboutSection('notPersisted');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

// ── Group B: getAboutSection — structural ────────────────────────────────

describe('getAboutSection — structural', () => {
  it('B-1: all known section keys return objects with heading and body', () => {
    for (const key of KNOWN_KEYS) {
      const section = getAboutSection(key);
      assert.ok(section, `Section '${key}' must exist`);
      assert.ok(typeof section.heading === 'string' && section.heading.length > 0, `'${key}'.heading must be non-empty`);
      assert.ok(typeof section.body === 'string' && section.body.length > 0, `'${key}'.body must be non-empty`);
    }
  });

  it('B-2: unknown key returns null', () => {
    const result = getAboutSection('__unknown__');
    assert.equal(result, null, 'Unknown key must return null');
  });
});

// ── Group C: getAboutSections — ordered list ─────────────────────────────

describe('getAboutSections — ordered list', () => {
  it('C-1: returns array of 7 section objects', () => {
    const sections = getAboutSections();
    assert.ok(Array.isArray(sections), 'Must return an array');
    assert.equal(sections.length, 7, 'Must have exactly 7 sections');
  });

  it('C-2: every entry has non-empty heading and body', () => {
    const sections = getAboutSections();
    for (const section of sections) {
      assert.ok(typeof section.heading === 'string' && section.heading.length > 0,
        `Section '${section.key}' heading must be non-empty`);
      assert.ok(typeof section.body === 'string' && section.body.length > 0,
        `Section '${section.key}' body must be non-empty`);
    }
  });

  it('C-3: first section is whatItDoes', () => {
    const sections = getAboutSections();
    assert.equal(sections[0].key, 'whatItDoes', 'First section must be whatItDoes');
  });
});
