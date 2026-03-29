# Feature Spec: react-about-digital-twin

## Overview
Add an expandable About panel to the Digital Twin page that explains the page's purpose, key assumptions, and limitations for users who need context on how to interpret the simulation output.

## Motivation
The Digital Twin page presents simulation data that depends on several modelling assumptions (dead-end detection, auto-walk behaviour, WA task coverage, role filters). Without explanation, users may misread model gaps as process truth.

## Scope

### In scope
- Inline `AboutPanel` component added to `app/digital-twin/page.tsx`
- Collapsed by default; toggle via chevron button
- Six content sections covering: what the page does, available events assumption, dead-end detection, auto-walk, WA task cards, and role filter
- Content extracted to `src/ui-about-digital-twin/index.js` as exported string constants
- Tests in `test/feature_react-about-digital-twin.test.js` asserting all constants are non-empty strings with expected keywords

### Out of scope
- Persistence of open/closed state
- Changes to simulation logic or WA task engine

## Design
Follows the same pattern as `app/caseman-comparison/page.tsx`:
- `bg-slate-900/40 border border-slate-700/30 rounded-xl` container
- Toggle button with animated chevron SVG
- Sections use `h3` headings (`text-slate-200 font-medium`) and `<p>` body text (`text-slate-400 text-sm`)
- Panel placed directly below the page subtitle

## Acceptance Criteria
- Panel renders below subtitle on the Digital Twin page
- Panel is collapsed by default
- Clicking the button expands/collapses the panel
- All six sections are present with non-empty content
- All unit tests pass
