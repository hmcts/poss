# Feature Spec: react-about-work-allocation

## Summary
Add an expandable About panel to the Work Allocation Dashboard explaining what the page does, how alignment categories are derived, scope assumptions, and known limitations.

## Problem
The Work Allocation Dashboard shows alignment status for 17 R1A tasks but provides no explanation of methodology, scope, or what "aligned/partial/gap" means in this context.

## Solution
Inline `AboutPanel` component (same pattern as `caseman-comparison/page.tsx`) placed directly below the page subtitle. Collapsed by default. Four sections with h3 headings.

## Sections

| # | Heading | Key content |
|---|---------|-------------|
| 1 | What this page does | Maps 17 R1A WA tasks against the possession event model; shows alignment per task |
| 2 | Alignment categories | Aligned=direct counterpart exists; Partial=related event at different granularity/context; Gap=no event modelled |
| 3 | Scope assumption | Only the 17 tasks from R1A WA Task Names document; not full caseworker task coverage |
| 4 | By Context view assumption | Context classification from R1A document, not derived from event model |

## Content source
Exported string constants from `src/ui-about-work-allocation/index.js`.

## Scope
- `src/ui-about-work-allocation/index.js` — content constants
- `app/work-allocation/page.tsx` — inline AboutPanel component below page subtitle
- `test/feature_react-about-work-allocation.test.js` — content string assertions
