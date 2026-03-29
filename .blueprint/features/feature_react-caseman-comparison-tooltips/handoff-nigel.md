# Handoff: react-caseman-comparison-tooltips

**From:** Nigel (Tester)
**To:** Codey (Implementation)
**Date:** 2026-03-29

## Tests written

- `test/feature_react-caseman-comparison-tooltips.test.js` — 16 tests, all passing
- `test/artifacts/feature_react-caseman-comparison-tooltips/test-spec.md` — AC-to-test mapping

## Helper module (already created — import in your React components)

`src/ui-caseman-tooltips/index.js` — exports two functions:
- `getTooltipText(key)` — returns the static tooltip string for keys: `covered`, `partial`, `gap`, `italicRows`, `exportJson`, `sourceAuto`, `unclassifiedOption`, `badgeNew`, `badgeNoMatch`, `unclassifiedBlock`
- `buildDomainTooltip(domain, count, waTaskNames)` — builds the dynamic Tooltip 7 string

## Key notes for Codey

- Import `getTooltipText` / `buildDomainTooltip` from `src/ui-caseman-tooltips/index.js` in your JSX — do not inline the strings.
- Tooltip 8 (Unclassified block): use `getTooltipText('unclassifiedBlock')`, not `buildDomainTooltip`.
- Tooltip 9 (Source: auto): wrap source `<p>` in `<Tooltip>` only when `row.source === 'auto'`.
- Tooltip 10 (Unclassified option): use `title` attribute on `<option>`, not `<Tooltip>`.
- Do not break existing tests — run `node --test` before committing.
