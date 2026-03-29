# Feature Spec: react-about-event-matrix

## Overview
Add an expandable AboutPanel to the Event Matrix page that explains what the page shows and documents the assumptions behind key columns and indicators.

## Goal
Give analysts and developers a clear, in-page reference for interpreting Event Matrix data without needing to consult external docs.

## Scope

### In scope
- Inline `AboutPanel` component in `app/event-matrix/page.tsx`
- Collapsed by default, toggled by chevron button
- Five sections covering: page purpose, open question indicator, actor grid, system flag, and WA task column
- Content exported as named string constants from `src/ui-about-event-matrix/index.js`
- Tests verifying all content strings are non-empty

### Out of scope
- Changes to filter logic or table rendering
- Server-side rendering concerns

## Placement
Directly below the page subtitle (`<p>` with event count summary), inside the existing header flex container.

## Content Sections
1. **What this page does** — all events for the selected claim type, filterable by state, role, and WA task; each row is one event with its actor grid and open question status
2. **Open question indicator** — ⚠ icon when `hasOpenQuestions` is true; hand-authored flag; absence does not mean fully resolved
3. **Actor grid** — filled cell = role assigned in model; empty = not defined in model; assignments may be incomplete
4. **System flag** — marks system-triggered events; set by `systemTriggered` field; may not be exhaustive
5. **WA task column** — derived from `wa-mappings.json`; "—" means no mapping; may mean no task needed OR mapping not yet authored

## Pattern
Follows the `AboutPanel` pattern established in `app/caseman-comparison/page.tsx`.
