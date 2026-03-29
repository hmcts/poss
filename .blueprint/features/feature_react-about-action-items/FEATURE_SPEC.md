# Feature Spec: react-about-action-items

## Summary
Add an expandable About panel to the Action Items page explaining the two data sources, priority algorithm, model health score, WA alignment percentage, suggestions, and persistence assumptions.

## Problem
The Action Items page surfaces prioritised issues from two sources with a scoring algorithm, but without explanation users cannot interpret priority bands, understand what is included or excluded, or know how to act on suggestions.

## Solution
Inline `AboutPanel` component (same pattern as `caseman-comparison/page.tsx`) placed directly below the page subtitle. Collapsed by default. Seven sections with h3 headings.

## Sections

| # | Heading | Key content |
|---|---------|-------------|
| 1 | What this page does | Consolidated list from model completeness checks and WA task alignment gaps |
| 2 | Two sources | Model completeness from model-health/uncertainty-display on live data; WA alignment from wa-task-engine on wa-mappings.json; neither is exhaustive |
| 3 | Priority algorithm | High = gap tasks with no event mapping, unreachable states, end-state not reachable; Medium = partial alignment, low-completeness states (<50%), open questions; Low = informational items |
| 4 | Model health score | Composite of open question count, low-completeness state count, unreachable state count, end-state reachability. Bands: Good ≥80%, Fair 50–79%, Poor <50%. Heuristic thresholds |
| 5 | WA alignment % | (aligned + partial × 0.5) / 17. Partial counts as half-aligned |
| 6 | Suggestions | Auto-generated from templates — a starting point, may not capture full context |
| 7 | Items not persisted | Recalculated on every page load; no mark-as-resolved — items disappear when underlying data changes |

## Content source
Exported string constants from `src/ui-about-action-items/index.js`.

## Scope
- `src/ui-about-action-items/index.js` — content constants
- `app/action-items/page.tsx` — inline AboutPanel component below page subtitle
- `test/feature_react-about-action-items.test.js` — content string assertions
