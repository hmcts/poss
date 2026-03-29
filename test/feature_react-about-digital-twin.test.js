import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ABOUT_WHAT_PAGE_DOES,
  ABOUT_AVAILABLE_EVENTS,
  ABOUT_DEAD_END_DETECTION,
  ABOUT_AUTO_WALK,
  ABOUT_WA_TASK_CARDS,
  ABOUT_ROLE_FILTER,
} from '../src/ui-about-digital-twin/index.js';

describe('ui-about-digital-twin content constants', () => {
  it('ABOUT_WHAT_PAGE_DOES is a non-empty string', () => {
    assert.equal(typeof ABOUT_WHAT_PAGE_DOES, 'string');
    assert.ok(ABOUT_WHAT_PAGE_DOES.length > 0);
  });

  it('ABOUT_AVAILABLE_EVENTS is a non-empty string', () => {
    assert.equal(typeof ABOUT_AVAILABLE_EVENTS, 'string');
    assert.ok(ABOUT_AVAILABLE_EVENTS.length > 0);
  });

  it('ABOUT_DEAD_END_DETECTION is a non-empty string', () => {
    assert.equal(typeof ABOUT_DEAD_END_DETECTION, 'string');
    assert.ok(ABOUT_DEAD_END_DETECTION.length > 0);
  });

  it('ABOUT_AUTO_WALK is a non-empty string', () => {
    assert.equal(typeof ABOUT_AUTO_WALK, 'string');
    assert.ok(ABOUT_AUTO_WALK.length > 0);
  });

  it('ABOUT_WA_TASK_CARDS is a non-empty string', () => {
    assert.equal(typeof ABOUT_WA_TASK_CARDS, 'string');
    assert.ok(ABOUT_WA_TASK_CARDS.length > 0);
  });

  it('ABOUT_ROLE_FILTER is a non-empty string', () => {
    assert.equal(typeof ABOUT_ROLE_FILTER, 'string');
    assert.ok(ABOUT_ROLE_FILTER.length > 0);
  });

  it('each constant mentions a key concept from the Digital Twin about section', () => {
    assert.ok(ABOUT_WHAT_PAGE_DOES.toLowerCase().includes('state machine'));
    assert.ok(ABOUT_AVAILABLE_EVENTS.toLowerCase().includes('unmodelled'));
    assert.ok(ABOUT_DEAD_END_DETECTION.toLowerCase().includes('isendstate') || ABOUT_DEAD_END_DETECTION.toLowerCase().includes('isendstate()') || ABOUT_DEAD_END_DETECTION.includes('isEndState'));
    assert.ok(ABOUT_AUTO_WALK.toLowerCase().includes('auto-walk') || ABOUT_AUTO_WALK.toLowerCase().includes('first available event'));
    assert.ok(ABOUT_WA_TASK_CARDS.toLowerCase().includes('wa-mappings') || ABOUT_WA_TASK_CARDS.toLowerCase().includes('r1a'));
    assert.ok(ABOUT_ROLE_FILTER.toLowerCase().includes('role'));
  });
});
