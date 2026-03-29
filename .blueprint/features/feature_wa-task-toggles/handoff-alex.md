## Handoff Summary
**For:** Cass
**Feature:** wa-task-toggles

### Key Decisions
- Task toggle state is a single `Set<string>` of disabled task IDs in local React state — no new modules or stores needed
- Event blocking is derived: an event with WA mappings is blocked only when ALL its tasks are unchecked; events without WA tasks are never affected by task toggles
- The existing `autoWalk` function already accepts an enabled event set, so the integration point is computing the effective set by subtracting task-blocked events from the event-level enabled set
- WA task checkboxes are only visible/active when the "Show WA Tasks" toggle is on; turning the WA toggle off fully disengages task-level blocking
- Parent event disable (event-level checkbox) takes priority over task toggles — task checkboxes are greyed out when the parent event is off

### Files Created
- `.blueprint/features/feature_wa-task-toggles/FEATURE_SPEC.md`

### Open Questions
- None. The feature is well-bounded. All consumed functions already exist. The only file modified is `app/digital-twin/page.tsx`.

### Critical Context
This feature extends the existing event toggle pattern already implemented in the Digital Twin. The key architectural insight is that `autoWalk` already consumes an `enabledIds: Set<string>` — so task toggles just need to compute a derived set where events with all-tasks-unchecked are removed. No changes to wa-task-engine, ui-wa-tasks, or the simulation engine are required. The `getTasksForEvent` function from wa-task-engine is the bridge: it resolves which tasks map to each event, and the component checks those task IDs against the `disabledTasks` set to determine if the event should be blocked. Stories 1 and 2 are the core work; Story 3 is verification.
