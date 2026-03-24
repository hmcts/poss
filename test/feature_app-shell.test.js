import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  ROUTES,
  CLAIM_TYPES,
  getDefaultTheme,
  toggleTheme,
  getThemeClass,
  createAppStore,
} from '../src/app-shell/index.js';

import { ClaimTypeId } from '../src/data-model/enums.ts';

// -- 1. Route Configuration --------------------------------------------------

describe('Route configuration (ROUTES)', () => {
  it('RT-1: ROUTES has exactly 3 entries for the three modes', () => {
    assert.ok(Array.isArray(ROUTES), 'ROUTES must be an array');
    assert.equal(ROUTES.length, 3, `Expected 3 routes, got ${ROUTES.length}`);
  });

  it('RT-2: each route has path, label, and icon as non-empty strings', () => {
    for (const route of ROUTES) {
      for (const key of ['path', 'label', 'icon']) {
        assert.equal(typeof route[key], 'string', `route.${key} must be a string`);
        assert.ok(route[key].length > 0, `route.${key} must not be empty`);
      }
    }
  });

  it('RT-3: paths match the three expected routes', () => {
    const paths = ROUTES.map((r) => r.path);
    const expected = ['/state-explorer', '/event-matrix', '/digital-twin'];
    for (const p of expected) {
      assert.ok(paths.includes(p), `Missing expected path: ${p}`);
    }
  });

  it('RT-4: first route is /state-explorer (default landing)', () => {
    assert.equal(ROUTES[0].path, '/state-explorer');
  });
});

// -- 2. Claim Types -----------------------------------------------------------

describe('Claim types (CLAIM_TYPES)', () => {
  it('CL-1: CLAIM_TYPES has exactly 7 entries', () => {
    assert.ok(Array.isArray(CLAIM_TYPES), 'CLAIM_TYPES must be an array');
    assert.equal(CLAIM_TYPES.length, 7, `Expected 7 claim types, got ${CLAIM_TYPES.length}`);
  });

  it('CL-2: each entry has id and name as non-empty strings', () => {
    for (const ct of CLAIM_TYPES) {
      assert.equal(typeof ct.id, 'string', 'id must be a string');
      assert.ok(ct.id.length > 0, 'id must not be empty');
      assert.equal(typeof ct.name, 'string', 'name must be a string');
      assert.ok(ct.name.length > 0, 'name must not be empty');
    }
  });

  it('CL-3: IDs match every value in ClaimTypeId enum', () => {
    const enumValues = Object.values(ClaimTypeId);
    const ids = CLAIM_TYPES.map((ct) => ct.id);
    for (const v of enumValues) {
      assert.ok(ids.includes(v), `Missing ClaimTypeId value in CLAIM_TYPES: ${v}`);
    }
    for (const id of ids) {
      assert.ok(enumValues.includes(id), `Unexpected id in CLAIM_TYPES: ${id}`);
    }
  });

  it('CL-4: every entry has a human-readable name distinct from the raw enum key', () => {
    for (const ct of CLAIM_TYPES) {
      assert.notEqual(ct.name, ct.id, `name should differ from raw id for ${ct.id}`);
    }
  });
});

// -- 3. Theme Utilities -------------------------------------------------------

describe('Theme utilities', () => {
  it('TH-1: getDefaultTheme() returns dark', () => {
    assert.equal(getDefaultTheme(), 'dark');
  });

  it('TH-2: toggleTheme(dark) returns light', () => {
    assert.equal(toggleTheme('dark'), 'light');
  });

  it('TH-3: toggleTheme(light) returns dark', () => {
    assert.equal(toggleTheme('light'), 'dark');
  });

  it('TH-4: getThemeClass(dark) returns a non-empty string', () => {
    const cls = getThemeClass('dark');
    assert.equal(typeof cls, 'string');
    assert.ok(cls.length > 0);
  });

  it('TH-5: getThemeClass(light) returns a non-empty string', () => {
    const cls = getThemeClass('light');
    assert.equal(typeof cls, 'string');
    assert.ok(cls.length > 0);
  });

  it('TH-6: dark and light theme classes differ', () => {
    assert.notEqual(getThemeClass('dark'), getThemeClass('light'));
  });
});

// -- 4. Store Integration -----------------------------------------------------

describe('App store (createAppStore)', () => {
  it('AS-1: createAppStore is a callable function', () => {
    assert.equal(typeof createAppStore, 'function');
  });

  it('AS-2: store initialises activeClaimType to null', () => {
    const store = createAppStore();
    assert.equal(store.getState().activeClaimType, null);
  });

  it('AS-3: store exposes setActiveClaimType action', () => {
    const store = createAppStore();
    assert.equal(typeof store.getState().setActiveClaimType, 'function');
  });

  it('AS-4: setActiveClaimType updates the store state', () => {
    const store = createAppStore();
    store.getState().setActiveClaimType('ENFORCEMENT');
    assert.equal(store.getState().activeClaimType, 'ENFORCEMENT');
  });

  it('AS-5: setActiveClaimType(null) resets activeClaimType', () => {
    const store = createAppStore();
    store.getState().setActiveClaimType('APPEALS');
    store.getState().setActiveClaimType(null);
    assert.equal(store.getState().activeClaimType, null);
  });
});
