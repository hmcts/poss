import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getNavigationItems,
  getClaimTypeSelectorOptions,
  getThemeToggleState,
  getHealthBadge,
  getLayoutConfig,
  isRouteActive,
} from '../src/ui-app-shell/index.js';

import { ROUTES, CLAIM_TYPES, getThemeClass } from '../src/app-shell/index.js';

// -- 1. Navigation Items ------------------------------------------------------

describe('Navigation items (getNavigationItems)', () => {
  it('UAS-1: returns an array of at least 3 navigation items', () => {
    const items = getNavigationItems();
    assert.ok(Array.isArray(items), 'Must return an array');
    assert.ok(items.length >= 3);
  });

  it('UAS-2: each item has path, label, icon as non-empty strings', () => {
    const items = getNavigationItems();
    for (const item of items) {
      assert.equal(typeof item.path, 'string', 'path must be a string');
      assert.ok(item.path.length > 0, 'path must not be empty');
      assert.equal(typeof item.label, 'string', 'label must be a string');
      assert.ok(item.label.length > 0, 'label must not be empty');
      assert.equal(typeof item.icon, 'string', 'icon must be a string');
      assert.ok(item.icon.length > 0, 'icon must not be empty');
    }
  });

  it('UAS-3: each item has an isActive function', () => {
    const items = getNavigationItems();
    for (const item of items) {
      assert.equal(typeof item.isActive, 'function', 'isActive must be a function');
    }
  });

  it('UAS-4: isActive returns true for matching path', () => {
    const items = getNavigationItems();
    for (const item of items) {
      assert.equal(item.isActive(item.path), true, `isActive should be true for ${item.path}`);
    }
  });

  it('UAS-5: isActive returns false for non-matching path', () => {
    const items = getNavigationItems();
    const first = items[0];
    const second = items[1];
    assert.equal(first.isActive(second.path), false, 'isActive should be false for different path');
  });
});

// -- 2. Claim Type Selector ---------------------------------------------------

describe('Claim type selector (getClaimTypeSelectorOptions)', () => {
  it('UAS-6: returns 7 options (one per claim type)', () => {
    const options = getClaimTypeSelectorOptions();
    assert.ok(Array.isArray(options), 'Must return an array');
    assert.equal(options.length, 7);
  });

  it('UAS-7: each option has value and label as non-empty strings', () => {
    const options = getClaimTypeSelectorOptions();
    for (const opt of options) {
      assert.equal(typeof opt.value, 'string', 'value must be a string');
      assert.ok(opt.value.length > 0, 'value must not be empty');
      assert.equal(typeof opt.label, 'string', 'label must be a string');
      assert.ok(opt.label.length > 0, 'label must not be empty');
    }
  });

  it('UAS-8: option values match CLAIM_TYPES ids', () => {
    const options = getClaimTypeSelectorOptions();
    const expectedIds = CLAIM_TYPES.map(ct => ct.id);
    const actualValues = options.map(o => o.value);
    assert.deepEqual(actualValues, expectedIds);
  });
});

// -- 3. Theme Toggle ----------------------------------------------------------

describe('Theme toggle (getThemeToggleState)', () => {
  it('UAS-9: dark theme returns nextTheme=light', () => {
    const state = getThemeToggleState('dark');
    assert.equal(state.currentTheme, 'dark');
    assert.equal(state.nextTheme, 'light');
  });

  it('UAS-10: light theme returns nextTheme=dark', () => {
    const state = getThemeToggleState('light');
    assert.equal(state.currentTheme, 'light');
    assert.equal(state.nextTheme, 'dark');
  });

  it('UAS-11: cssClass matches getThemeClass for current theme', () => {
    const darkState = getThemeToggleState('dark');
    assert.equal(darkState.cssClass, getThemeClass('dark'));
    const lightState = getThemeToggleState('light');
    assert.equal(lightState.cssClass, getThemeClass('light'));
  });

  it('UAS-12: icon differs between dark and light themes', () => {
    const darkState = getThemeToggleState('dark');
    const lightState = getThemeToggleState('light');
    assert.notEqual(darkState.icon, lightState.icon, 'Icons should differ between themes');
  });
});

// -- 4. Health Badge ----------------------------------------------------------

describe('Health badge (getHealthBadge)', () => {
  const goodStates = [
    { id: 's1', technicalName: 's1', uiLabel: 'S1', claimType: 'X', isDraftLike: true, isLive: false, isEndState: false, completeness: 100 },
    { id: 's2', technicalName: 's2', uiLabel: 'S2', claimType: 'X', isDraftLike: false, isLive: true, isEndState: false, completeness: 100 },
    { id: 's3', technicalName: 's3', uiLabel: 'S3', claimType: 'X', isDraftLike: false, isLive: false, isEndState: true, completeness: 100 },
  ];
  const goodTransitions = [
    { from: 's1', to: 's2', condition: null, isSystemTriggered: false, isTimeBased: false },
    { from: 's2', to: 's3', condition: null, isSystemTriggered: false, isTimeBased: false },
  ];
  const goodEvents = [
    { id: 'e1', name: 'E1', claimType: 'X', state: 's1', isSystemEvent: false, notes: '', hasOpenQuestions: false, actors: {} },
  ];

  const poorStates = [
    { id: 's1', technicalName: 's1', uiLabel: 'S1', claimType: 'X', isDraftLike: true, isLive: false, isEndState: false, completeness: 20 },
    { id: 's2', technicalName: 's2', uiLabel: 'S2', claimType: 'X', isDraftLike: false, isLive: true, isEndState: false, completeness: 10 },
  ];
  const poorTransitions = [];
  const poorEvents = [
    { id: 'e1', name: 'E1', claimType: 'X', state: 's1', isSystemEvent: false, notes: '', hasOpenQuestions: true, actors: {} },
  ];

  it('UAS-13: good score returns green-ish color', () => {
    const badge = getHealthBadge(goodStates, goodTransitions, goodEvents);
    assert.equal(badge.score, 'good');
    assert.ok(
      badge.color.toLowerCase().includes('green') || badge.color.includes('22c55e') || badge.color.includes('16a34a') || badge.color.includes('10b981'),
      `Expected green-ish color, got: ${badge.color}`
    );
  });

  it('UAS-14: poor score returns red-ish color', () => {
    const badge = getHealthBadge(poorStates, poorTransitions, poorEvents);
    assert.equal(badge.score, 'poor');
    assert.ok(
      badge.color.toLowerCase().includes('red') || badge.color.includes('ef4444') || badge.color.includes('dc2626') || badge.color.includes('f87171'),
      `Expected red-ish color, got: ${badge.color}`
    );
  });

  it('UAS-15: label is always a non-empty string', () => {
    const goodBadge = getHealthBadge(goodStates, goodTransitions, goodEvents);
    assert.equal(typeof goodBadge.label, 'string');
    assert.ok(goodBadge.label.length > 0, 'label must not be empty');

    const poorBadge = getHealthBadge(poorStates, poorTransitions, poorEvents);
    assert.equal(typeof poorBadge.label, 'string');
    assert.ok(poorBadge.label.length > 0, 'label must not be empty');
  });
});

// -- 5. Layout Config ---------------------------------------------------------

describe('Layout config (getLayoutConfig)', () => {
  it('UAS-16: returns numeric sidebarWidth, headerHeight, breakpoint', () => {
    const config = getLayoutConfig();
    assert.equal(typeof config.sidebarWidth, 'number', 'sidebarWidth must be a number');
    assert.ok(config.sidebarWidth > 0, 'sidebarWidth must be positive');
    assert.equal(typeof config.headerHeight, 'number', 'headerHeight must be a number');
    assert.ok(config.headerHeight > 0, 'headerHeight must be positive');
    assert.equal(typeof config.breakpoint, 'number', 'breakpoint must be a number');
    assert.ok(config.breakpoint > 0, 'breakpoint must be positive');
  });
});

// -- 6. Route Active ----------------------------------------------------------

describe('Route active (isRouteActive)', () => {
  it('UAS-17: exact match returns true, mismatch returns false', () => {
    assert.equal(isRouteActive('/state-explorer', '/state-explorer'), true);
    assert.equal(isRouteActive('/state-explorer', '/event-matrix'), false);
  });

  it('UAS-18: prefix match for nested routes returns true', () => {
    assert.equal(isRouteActive('/state-explorer', '/state-explorer/details'), true);
  });
});
