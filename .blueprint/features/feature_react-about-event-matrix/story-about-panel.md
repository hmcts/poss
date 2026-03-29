# Story: About Panel for Event Matrix

## Story
As an analyst using the Event Matrix page,
I want an expandable "About this page" panel
So that I can understand what the data means and what assumptions have been made.

## Acceptance Criteria

- AC-1: An "About this page" toggle button appears below the event count subtitle
- AC-2: The panel is collapsed by default
- AC-3: Clicking the toggle expands/collapses the panel with a rotating chevron icon
- AC-4: The panel contains a section explaining what the page does
- AC-5: The panel explains the open question indicator (⚠ icon, hand-authored flag, absence caveat)
- AC-6: The panel explains the actor grid (filled = assigned in model, empty = not defined, may be incomplete)
- AC-7: The panel explains the system flag (system-triggered events, `systemTriggered` field, may not be exhaustive)
- AC-8: The panel explains the WA task column (derived from wa-mappings.json, "—" = no mapping, may mean no task OR not authored)
- AC-9: All section content is non-empty strings
- AC-10: Styling matches the Tailwind dark theme pattern (slate-900/40 background, border-slate-700/30)

## Implementation Notes
- Component defined inline in `app/event-matrix/page.tsx`
- Content imported from `src/ui-about-event-matrix/index.js`
- Uses `useState(false)` for toggle state
