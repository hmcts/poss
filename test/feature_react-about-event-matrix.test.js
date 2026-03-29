import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  PANEL_TITLE,
  SECTION_WHAT_IT_DOES,
  SECTION_OPEN_QUESTIONS,
  SECTION_ACTOR_GRID,
  SECTION_SYSTEM_FLAG,
  SECTION_WA_TASK,
} from '../src/ui-about-event-matrix/index.js';

// ── Content String Tests ─────────────────────────────────────────────

describe('AboutPanel content strings', () => {
  it('CS-1: SECTION_WHAT_IT_DOES is a non-empty string', () => {
    assert.equal(typeof SECTION_WHAT_IT_DOES, 'string');
    assert.ok(SECTION_WHAT_IT_DOES.length > 0);
  });

  it('CS-2: SECTION_OPEN_QUESTIONS is a non-empty string', () => {
    assert.equal(typeof SECTION_OPEN_QUESTIONS, 'string');
    assert.ok(SECTION_OPEN_QUESTIONS.length > 0);
  });

  it('CS-3: SECTION_ACTOR_GRID is a non-empty string', () => {
    assert.equal(typeof SECTION_ACTOR_GRID, 'string');
    assert.ok(SECTION_ACTOR_GRID.length > 0);
  });

  it('CS-4: SECTION_SYSTEM_FLAG is a non-empty string', () => {
    assert.equal(typeof SECTION_SYSTEM_FLAG, 'string');
    assert.ok(SECTION_SYSTEM_FLAG.length > 0);
  });

  it('CS-5: SECTION_WA_TASK is a non-empty string', () => {
    assert.equal(typeof SECTION_WA_TASK, 'string');
    assert.ok(SECTION_WA_TASK.length > 0);
  });

  it('CS-6: PANEL_TITLE is a non-empty string', () => {
    assert.equal(typeof PANEL_TITLE, 'string');
    assert.ok(PANEL_TITLE.length > 0);
  });
});

// ── Content Accuracy Tests ───────────────────────────────────────────

describe('AboutPanel content accuracy', () => {
  it('CA-1: SECTION_OPEN_QUESTIONS references the hand-authored assumption', () => {
    const lower = SECTION_OPEN_QUESTIONS.toLowerCase();
    assert.ok(
      lower.includes('hand-authored') || lower.includes('hasopenquestions'),
      'Expected reference to hand-authored flag or hasOpenQuestions field',
    );
  });

  it('CA-2: SECTION_ACTOR_GRID references model incompleteness', () => {
    const lower = SECTION_ACTOR_GRID.toLowerCase();
    assert.ok(
      lower.includes('incomplete') || lower.includes('not defined'),
      'Expected reference to incompleteness or not defined roles',
    );
  });

  it('CA-3: SECTION_WA_TASK references wa-mappings', () => {
    const lower = SECTION_WA_TASK.toLowerCase();
    assert.ok(
      lower.includes('wa-mappings') || lower.includes('mapping'),
      'Expected reference to wa-mappings or mapping',
    );
  });

  it('CA-4: SECTION_SYSTEM_FLAG references systemTriggered', () => {
    assert.ok(
      SECTION_SYSTEM_FLAG.includes('systemTriggered') || SECTION_SYSTEM_FLAG.toLowerCase().includes('system-triggered'),
      'Expected reference to systemTriggered field or system-triggered',
    );
  });
});
