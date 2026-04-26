import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getNextConfig,
  getTailwindThemeTokens,
  getThemeProviderConfig,
  getPathAliases,
  getAppMetadata,
} from '../src/next-app-setup/index.js';

import { getDefaultTheme } from '../src/app-shell/index.js';

// -- 1. Next.js Configuration -------------------------------------------------

describe('Next.js configuration (getNextConfig)', () => {
  it('NAS-1: returns a non-null object', () => {
    const config = getNextConfig();
    assert.equal(typeof config, 'object');
    assert.notEqual(config, null);
  });

  it('NAS-2: port is set to 3000', () => {
    const config = getNextConfig();
    assert.equal(config.port, 3000);
  });

  it('NAS-3: output is set to export for static site', () => {
    const config = getNextConfig();
    assert.equal(config.output, 'export');
  });

  it('NAS-4: images.unoptimized is true for static export', () => {
    const config = getNextConfig();
    assert.equal(config.images.unoptimized, true);
  });
});

// -- 2. Tailwind Theme Tokens -------------------------------------------------

describe('Tailwind theme tokens (getTailwindThemeTokens)', () => {
  it('NAS-5: returns all 5 domain colour keys', () => {
    const tokens = getTailwindThemeTokens();
    const expected = ['draft', 'live', 'end', 'uncertain', 'warning'];
    for (const key of expected) {
      assert.ok(key in tokens, `Missing token key: ${key}`);
      assert.equal(typeof tokens[key], 'string', `${key} must be a string`);
      assert.ok(tokens[key].length > 0, `${key} must not be empty`);
    }
  });

  it('NAS-6: draft maps to an amber colour', () => {
    const tokens = getTailwindThemeTokens();
    const val = tokens.draft.toLowerCase();
    assert.ok(
      val.includes('amber') || val.includes('f59e0b') || val.includes('d97706'),
      `Expected draft to be amber, got: ${val}`
    );
  });

  it('NAS-7: live maps to a green colour', () => {
    const tokens = getTailwindThemeTokens();
    const val = tokens.live.toLowerCase();
    assert.ok(
      val.includes('green') || val.includes('22c55e') || val.includes('16a34a') || val.includes('10b981'),
      `Expected live to be green, got: ${val}`
    );
  });

  it('NAS-8: end maps to a dark colour', () => {
    const tokens = getTailwindThemeTokens();
    const val = tokens.end.toLowerCase();
    assert.ok(
      val.includes('slate') || val.includes('dark') || val.includes('1e293b') || val.includes('334155'),
      `Expected end to be a dark colour, got: ${val}`
    );
  });

  it('NAS-9: uncertain maps to a grey colour', () => {
    const tokens = getTailwindThemeTokens();
    const val = tokens.uncertain.toLowerCase();
    assert.ok(
      val.includes('gray') || val.includes('grey') || val.includes('6b7280') || val.includes('9ca3af'),
      `Expected uncertain to be grey, got: ${val}`
    );
  });

  it('NAS-10: draft and warning are in the same amber family', () => {
    const tokens = getTailwindThemeTokens();
    assert.equal(tokens.draft, tokens.warning, 'draft and warning should map to the same amber value');
  });
});

// -- 3. Theme Provider Config -------------------------------------------------

describe('Theme provider config (getThemeProviderConfig)', () => {
  it('NAS-11: returns a non-null object', () => {
    const config = getThemeProviderConfig();
    assert.equal(typeof config, 'object');
    assert.notEqual(config, null);
  });

  it('NAS-12: defaultTheme matches app-shell getDefaultTheme()', () => {
    const config = getThemeProviderConfig();
    assert.equal(config.defaultTheme, getDefaultTheme());
  });

  it('NAS-13: themes array contains light and dark', () => {
    const config = getThemeProviderConfig();
    assert.ok(Array.isArray(config.themes), 'themes must be an array');
    assert.ok(config.themes.includes('light'), 'themes must include light');
    assert.ok(config.themes.includes('dark'), 'themes must include dark');
  });

  it('NAS-14: storageKey is a non-empty string', () => {
    const config = getThemeProviderConfig();
    assert.equal(typeof config.storageKey, 'string');
    assert.ok(config.storageKey.length > 0, 'storageKey must not be empty');
  });
});

// -- 4. Path Aliases ----------------------------------------------------------

describe('Path aliases (getPathAliases)', () => {
  it('NAS-15: has @/src/* key', () => {
    const aliases = getPathAliases();
    assert.ok('@/src/*' in aliases, 'Missing @/src/* alias key');
  });

  it('NAS-16: @/src/* resolves to ./src/*', () => {
    const aliases = getPathAliases();
    assert.deepEqual(aliases['@/src/*'], ['./src/*']);
  });
});

// -- 5. App Metadata ----------------------------------------------------------

describe('App metadata (getAppMetadata)', () => {
  it('NAS-17: title is a non-empty string', () => {
    const meta = getAppMetadata();
    assert.equal(typeof meta.title, 'string');
    assert.ok(meta.title.length > 0, 'title must not be empty');
  });

  it('NAS-18: description is a non-empty string', () => {
    const meta = getAppMetadata();
    assert.equal(typeof meta.description, 'string');
    assert.ok(meta.description.length > 0, 'description must not be empty');
  });

  it('NAS-19: title includes HMCTS or Possessions', () => {
    const meta = getAppMetadata();
    const t = meta.title;
    assert.ok(
      /hmcts/i.test(t) || /possession/i.test(t),
      `Title should include HMCTS or Possessions, got: ${t}`
    );
  });
});
