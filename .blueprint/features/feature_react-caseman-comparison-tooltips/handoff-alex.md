# Handoff: react-caseman-comparison-tooltips

**To:** Cass (architecture review) → Codey (implementation)
**Feature:** Add contextual tooltips to `/caseman-comparison`
**Effort:** S — 1 new file, 4 existing files modified, no logic changes

## What to build

1. `app/caseman-comparison/Tooltip.tsx` — shared component, CSS group-hover only, no JS state, no external lib
2. 10 tooltips across 4 existing components (see FEATURE_SPEC.md for exact locations and verbatim content)

## Key decisions

- Use `<Tooltip>` for badges and buttons; use `title` attribute for `<option>` elements (browser limitation)
- Domain block tooltips (Tasks tab) are dynamic — built from props already in scope, no new data fetching
- "Unclassified" domain block gets its own verbatim override message (not the generic domain template)
- "Coverage %" tooltip is deferred — the % figure is not currently rendered outside the About panel
- Do not break StatesTab SVG line refs — badge wrapper must not displace DOM ref elements

## File map

| File | Tooltips |
|------|----------|
| `Tooltip.tsx` | New shared component |
| `page.tsx` | #1 — Covered / Partial / Gap card labels |
| `EventsTab.tsx` | #3 ⓘ icon, #4 Export JSON button, #9 Source:auto, #10 Unclassified option |
| `StatesTab.tsx` | #5 New badge, #6 No match badge |
| `TasksTab.tsx` | #7 domain blocks, #8 Unclassified block |

## No-touch list

`src/`, all data JSON files, all test files, navigation, routes.
