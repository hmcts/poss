# Story -- WA Event Matrix Overlay

## User story

As a business analyst, I want to see a "WA Task" column in the Event Matrix table and a filter dropdown so that I can identify which events trigger caseworker tasks and filter to events with alignment gaps.

---

## Context / scope

- Layer 3 (React component) modification to `app/event-matrix/page.tsx`
- New helper functions in `src/ui-wa-tasks/state-overlay-helpers.ts`: `getEventMatrixWaColumn`, `getWaTaskFilterOptions`, `filterEventsByWaTask`
- WA data loaded from `data/wa-tasks.json` and `data/wa-mappings.json`
- Column shows first matching WA task name and alignment colour dot
- Filter dropdown lists all WA task names plus special entries: "No WA Task" and "WA Gaps"
- Filter tokens: `''` (all), task name (exact match), `'__none__'` (no mapping), `'__gaps__'` (gap alignment)

---

## Acceptance criteria

**AC-1 -- WA Task column shows task name and colour dot for mapped events**
- Given an event triggers a WA task,
- When the Event Matrix table renders,
- Then the "WA Task" column shows the task name and a small colour dot (green/amber/red by alignment).

**AC-2 -- WA Task column shows "--" for events with no WA task**
- Given an event does not trigger any WA task,
- When the table renders,
- Then the "WA Task" column shows "--".

**AC-3 -- WA Task filter dropdown lists task names plus special options**
- When the filter bar renders,
- Then a "WA Task" dropdown appears with options: "All WA Tasks" (default), each unique task name, "No WA Task", and "WA Gaps".

**AC-4 -- Filtering by task name shows only events mapped to that task**
- Given the analyst selects a WA task name from the filter,
- When the filter applies,
- Then only events mapped to that specific WA task are shown.

**AC-5 -- Filtering by "No WA Task" shows unmapped events**
- Given the analyst selects "No WA Task",
- When the filter applies,
- Then only events with no WA task mapping are shown.

**AC-6 -- Filtering by "WA Gaps" shows events with gap-aligned tasks**
- Given the analyst selects "WA Gaps",
- When the filter applies,
- Then only events mapped to WA tasks with `alignment === 'gap'` are shown.

**AC-7 -- Colour dot always has adjacent text label for accessibility**
- All colour dots in the WA Task column have adjacent text (the task name) ensuring meaning is not conveyed by colour alone.

---

## Dependencies
- `src/ui-wa-tasks/state-overlay-helpers.ts` (new, created by this feature)
- `src/ui-wa-tasks/index.ts` (existing: `getWaTaskBadge`, `enrichEventWithWaTask`)
- `src/wa-task-engine/index.ts` (existing: `getTasksForEvent`)
- `data/wa-tasks.json`, `data/wa-mappings.json`
