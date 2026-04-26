import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getAboutSection,
  getAboutSections,
} from '../src/ui-about-state-explorer/index.js';

const KNOWN_KEYS = ['whatItDoes', 'graphLayout', 'nodeColour', 'completenessBadge', 'waTaskBadge', 'edgeStyle'];

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

describe('getAboutSection — graphLayout section', () => {
  it('A-3: heading is a non-empty string', () => {
    const section = getAboutSection('graphLayout');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-4: body is a non-empty string', () => {
    const section = getAboutSection('graphLayout');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — nodeColour section', () => {
  it('A-5: heading is a non-empty string', () => {
    const section = getAboutSection('nodeColour');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-6: body is a non-empty string', () => {
    const section = getAboutSection('nodeColour');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — completenessBadge section', () => {
  it('A-7: heading is a non-empty string', () => {
    const section = getAboutSection('completenessBadge');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-8: body is a non-empty string', () => {
    const section = getAboutSection('completenessBadge');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — waTaskBadge section', () => {
  it('A-9: heading is a non-empty string', () => {
    const section = getAboutSection('waTaskBadge');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-10: body is a non-empty string', () => {
    const section = getAboutSection('waTaskBadge');
    assert.ok(typeof section.body === 'string' && section.body.length > 0, 'body must be non-empty');
  });
});

describe('getAboutSection — edgeStyle section', () => {
  it('A-11: heading is a non-empty string', () => {
    const section = getAboutSection('edgeStyle');
    assert.ok(section, 'Section must exist');
    assert.ok(typeof section.heading === 'string' && section.heading.length > 0, 'heading must be non-empty');
  });

  it('A-12: body is a non-empty string', () => {
    const section = getAboutSection('edgeStyle');
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
  it('C-1: returns array of 6 section objects', () => {
    const sections = getAboutSections();
    assert.ok(Array.isArray(sections), 'Must return an array');
    assert.equal(sections.length, 6, 'Must have exactly 6 sections');
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
