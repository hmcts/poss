# Handoff -- react-wa-state-overlay

**From:** Cass (BA Agent)
**To:** Nigel (Tester) / Codey (Developer)
**Date:** 2026-03-27

## Stories written

1. **story-wa-state-explorer-overlay** -- WA task count badge on graph nodes (worst-alignment colour) + "Work Allocation Tasks" section in state detail panel. 6 ACs covering badge rendering, colour logic, empty states, detail panel, and accessibility.
2. **story-wa-event-matrix-overlay** -- WA Task column with task name and colour dot + filter dropdown with task name, "No WA Task", and "WA Gaps" options. 7 ACs covering column rendering, filter behaviour, and accessibility.

## Key decisions

- Node badge colour uses worst-alignment rule: gap (red) > partial (amber) > aligned (green).
- Event Matrix WA column shows first matching task only; full task list available in State Explorer detail panel.
- Filter special tokens: `'__none__'` for "No WA Task", `'__gaps__'` for "WA Gaps", empty string for "All".
- When WA data arrays are empty, no WA UI elements render (graceful degradation handled at helper layer).

## Watch points for implementation

- 5 helper functions in `state-overlay-helpers.ts` drive all display logic; React layer should not duplicate logic.
- `getNodeWaBadge` must return null when task count is 0 so the React layer knows to skip rendering.
- `filterEventsByWaTask` must handle the special `__none__` and `__gaps__` tokens correctly.
- Badge text labels must always accompany colours for WCAG AA.
