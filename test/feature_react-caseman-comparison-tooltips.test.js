import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getTooltipText,
  buildDomainTooltip,
} from '../src/ui-caseman-tooltips/index.js';

// ── Static tooltip strings ────────────────────────────────────────────────

describe('getTooltipText — summary card labels (tooltip 1)', () => {
  it('TT-1: covered card → similarity >0.8 threshold string', () => {
    const text = getTooltipText('covered');
    assert.equal(text, 'Similarity > 0.8 — near-identical event name wording.');
  });

  it('TT-2: partial card → similarity 0.5–0.8 threshold string', () => {
    const text = getTooltipText('partial');
    assert.equal(text, 'Similarity 0.5–0.8 — related events but different granularity or phrasing.');
  });

  it('TT-3: gap card → similarity <0.5 threshold string', () => {
    const text = getTooltipText('gap');
    assert.equal(text, 'Similarity < 0.5 — no close match found in the new service model.');
  });
});

describe('getTooltipText — events tab controls (tooltips 3, 4, 9, 10)', () => {
  it('TT-4: italicRows → italic-rows legend verbatim', () => {
    const text = getTooltipText('italicRows');
    assert.equal(text, 'Italic rows are auto-derived by name similarity. Normal weight = manually curated by a BA. Click any row to edit.');
  });

  it('TT-5: exportJson → export button verbatim', () => {
    const text = getTooltipText('exportJson');
    assert.equal(text, 'Downloads in-session edits as caseman-mappings.json. Commit to repo to make curated mappings the new team baseline.');
  });

  it('TT-11: sourceAuto → source auto label verbatim', () => {
    const text = getTooltipText('sourceAuto');
    assert.equal(text, 'Classification derived by name similarity. May be inaccurate — click Edit to override.');
  });

  it('TT-12: unclassifiedOption → 83% domain filter option verbatim', () => {
    const text = getTooltipText('unclassifiedOption');
    assert.equal(text, 'Events with no BMS task code. Represents 83% of all events.');
  });
});

describe('getTooltipText — states tab badges (tooltips 5, 6)', () => {
  it('TT-6: badgeNew → new-service-only badge verbatim', () => {
    const text = getTooltipText('badgeNew');
    assert.equal(text, 'Exists in new service model only — may be new functionality or a finer-grained breakdown of a Caseman status.');
  });

  it('TT-7: badgeNoMatch → no-match badge verbatim', () => {
    const text = getTooltipText('badgeNoMatch');
    assert.equal(text, 'No similar-named new service state found. May be a genuine gap or simply a naming difference.');
  });
});

describe('getTooltipText — tasks tab unclassified block (tooltip 8)', () => {
  it('TT-10: unclassifiedBlock → data-quality message verbatim', () => {
    const text = getTooltipText('unclassifiedBlock');
    assert.equal(text, '413 of 497 Caseman events have no BMS task code and cannot be classified by domain. This is a data quality issue in Caseman\'s source data, not a gap in the new service.');
  });
});

describe('getTooltipText — structural', () => {
  it('TT-13: all known keys return non-empty strings', () => {
    const keys = ['covered', 'partial', 'gap', 'italicRows', 'exportJson', 'badgeNew', 'badgeNoMatch', 'unclassifiedBlock', 'sourceAuto', 'unclassifiedOption'];
    for (const key of keys) {
      const text = getTooltipText(key);
      assert.ok(typeof text === 'string' && text.length > 0, `key '${key}' returned empty or non-string`);
    }
  });

  it('TT-14: unknown key returns empty string', () => {
    const text = getTooltipText('__unknown_key__');
    assert.equal(typeof text, 'string');
    assert.equal(text, '');
  });
});

// ── Dynamic domain block tooltip builder (tooltip 7) ──────────────────────

describe('buildDomainTooltip — domain blocks (tooltip 7)', () => {
  it('TT-8: named domain with WA tasks → lists task names', () => {
    const result = buildDomainTooltip('Issue', 24, ['Review Defendant response', 'Review application']);
    assert.equal(result, 'Issue: 24 events — WA tasks: Review Defendant response, Review application');
  });

  it('TT-9: domain with no WA tasks → fallback message', () => {
    const result = buildDomainTooltip('CCBC', 47, []);
    assert.equal(result, 'CCBC: 47 events — No WA tasks covering this domain');
  });

  it('TT-9b: domain with null/undefined tasks → fallback message', () => {
    const result = buildDomainTooltip('Enforcement', 12, null);
    assert.equal(result, 'Enforcement: 12 events — No WA tasks covering this domain');
  });

  it('TT-8b: single WA task → no trailing comma', () => {
    const result = buildDomainTooltip('Issue', 5, ['Review application']);
    assert.equal(result, 'Issue: 5 events — WA tasks: Review application');
  });
});
