# Feature Specification — wa-task-toggles

| Field | Value |
|-------|-------|
| **Slug** | wa-task-toggles |
| **Priority** | P1 |
| **Effort** | L |
| **Status** | Ready |
| **Date** | 2026-03-27 |

---

## 1. Intent

**What:** Add per-task toggle checkboxes to WA task cards in the Digital Twin, so that unchecking all WA tasks for an event blocks that event from the simulation — affecting the auto-walk path and terminal state reachability.

**Why:** The Digital Twin already lets analysts toggle events on/off to explore "what if this event were unavailable?" scenarios. WA task toggles extend this to a finer-grained question: "what if specific caseworker tasks were not staffed or not available?" An event with WA task mappings should only fire if at least one of its associated caseworker tasks is active. This lets analysts model caseworker availability constraints and immediately see the system-wide impact on reachable states and dead ends — directly serving the System Spec goal of enabling analysts to "toggle model elements on/off and immediately see system-wide impact" (Section 1).

---

## 2. Actors

### Business Analyst (primary user)
- **What they can do:** Toggle individual WA task checkboxes on/off within the Digital Twin. Observe how blocking caseworker tasks affects event availability, auto-walk paths, and reachability.
- **What they cannot do:** Edit WA task data, change alignment status, or modify task-to-event mappings.

### The Model (data actor)
- **What it does:** Provides `WaTask[]` and `WaTaskMapping[]` consumed by wa-task-engine and ui-wa-tasks functions to resolve which tasks map to which events.

---

## 3. Scope

### In Scope
- Checkbox on each WA task card beneath an event in the Digital Twin events panel (checked by default)
- Deriving event enabled/disabled status from task toggle state: an event with WA task mappings is blocked when ALL its tasks are unchecked; events with no WA tasks are unaffected
- Feeding the derived enabled/disabled event set into the existing auto-walk and reachability calculation
- WA task checkboxes only visible when the "Show WA Tasks" toggle is on
- When a parent event is disabled via its event-level checkbox, WA task checkboxes beneath it are greyed out (visually muted, not interactive)
- Summary indicator showing count of disabled WA tasks (e.g. "3 tasks disabled")
- Reset Simulation clears all task toggles back to checked
- Visual transition of event styling when task toggles cause it to become blocked/unblocked
- Disabled-events count banner updates when task toggles change the effective event set

### Out of Scope
- WA task toggles on State Explorer or Event Matrix (Digital Twin only)
- Modifications to wa-task-engine or ui-wa-tasks pure functions (this feature is React component layer only, consuming existing helpers)
- Persisting toggle state across navigation or page reloads
- New logic-layer or UI-helper-layer modules (all logic can be expressed in the component using existing functions)
- Scenario analysis integration (the scenario-analysis module has its own toggle mechanism; this feature operates within the Digital Twin's local state)

---

## 4. Key Behaviours

### Behaviour 1: Task checkbox defaults and visibility
Each WA task card rendered beneath an event contains a checkbox. All task checkboxes default to checked (active). Task checkboxes are only visible when the "Show WA Tasks" toggle is on. When the WA toggle is off, task toggles have no effect on event availability — all events revert to their event-level toggle state only.

### Behaviour 2: Event blocking derived from task toggles
For each event that has WA task mappings (i.e. `getTasksForEvent` returns one or more tasks), the event is considered available only if **at least one** of its associated WA tasks is checked. If all tasks for that event are unchecked, the event is effectively disabled — it is removed from the enabled event set used by auto-walk.

Events with **no WA task mappings** are entirely unaffected by task toggles. Their availability depends solely on the event-level checkbox, as it does today.

### Behaviour 3: Auto-walk and reachability recalculation
The existing `autoWalk` function in `app/digital-twin/page.tsx` accepts an enabled event set (`enabledIds: Set<string>`). When task toggles cause an event to become blocked, that event's ID is removed from the enabled set. When task toggles restore an event, its ID is added back. The auto-walk recalculates on every change, so blocked events naturally prevent transitions and affect which terminal states are reachable.

### Behaviour 4: Parent event disabled overrides task toggles
When an event is disabled via its own event-level checkbox (the existing toggle mechanism), the WA task checkboxes beneath it are rendered in a greyed-out, non-interactive state. The event is already blocked at a higher level, so task-level toggles are irrelevant. If the event is re-enabled, task checkboxes become interactive again and their current checked/unchecked state takes effect.

### Behaviour 5: Visual feedback on event state change
When unchecking a WA task causes an event to become blocked (because it was the last checked task for that event), the event row visually transitions to the disabled style — the same style used when the event-level checkbox is unchecked (reduced opacity, red-tinted border). The disabled-events count banner at the top of the events panel updates accordingly.

When re-checking a task restores an event, the event returns to the enabled style and the count updates.

### Behaviour 6: Disabled task count indicator
A summary indicator appears in the simulation controls area (near the "Show WA Tasks" toggle) showing how many WA tasks are currently unchecked, e.g. "3 tasks disabled". This indicator is only visible when the WA toggle is on and at least one task is disabled.

### Behaviour 7: Reset clears task toggles
The existing "Reset Simulation" button clears all WA task checkboxes back to checked, in addition to its existing behaviour of resetting the simulation state, enabled events, and role filter.

---

## 5. Flow Description

### Primary flow — analyst disables a WA task

1. Analyst starts a simulation in the Digital Twin and enables "Show WA Tasks".
2. WA task cards appear beneath events that have WA task mappings, each with a checked checkbox.
3. Analyst unchecks a specific WA task checkbox (e.g. "Review Defendant response" under "Respond to Claim").
4. If the event still has other checked tasks, the event remains enabled. The "1 task disabled" indicator appears.
5. Analyst unchecks the remaining task(s) for that event.
6. The event transitions to disabled style. The auto-walk recalculates, potentially changing the reachable path and terminal state. The disabled-events count banner updates.
7. Analyst observes the new reachable path in the timeline.

### Secondary flow — analyst re-enables a task

1. Analyst re-checks a previously unchecked task for a blocked event.
2. The event transitions back to enabled style. Auto-walk recalculates. Disabled count updates.

### Secondary flow — parent event disabled

1. Analyst unchecks an event via its event-level checkbox (existing behaviour).
2. The WA task checkboxes beneath that event become greyed out and non-interactive.
3. Analyst re-enables the event. Task checkboxes become interactive again with their previous checked/unchecked state preserved.

### Reset flow

1. Analyst clicks "Reset Simulation".
2. All task toggles reset to checked. All event toggles reset. Simulation returns to the start screen.

---

## 6. Dependencies

### System components consumed
| Module | Functions / Types | Purpose |
|--------|------------------|---------|
| `src/wa-task-engine/index.ts` | `getTasksForEvent` | Resolve which WA tasks map to a given event name |
| `src/ui-wa-tasks/digital-twin-helpers.ts` | `getEventTaskCards`, `shouldShowWaToggle` | Existing task card rendering data; WA toggle visibility |
| `src/ui-case-walk/index.ts` | `initializeSimulation`, `getAvailableActionsPanel`, `advanceSimulation`, `getSimulationTimeline`, `getSimulationStatus` | Existing simulation engine consumed by auto-walk |
| `data/wa-tasks.json` | Static WA task data | Task definitions |
| `data/wa-mappings.json` | Static WA mapping data | Event-to-task mappings |
| `app/digital-twin/page.tsx` | Existing Digital Twin page | Component being modified |
| `app/providers.tsx` | `useApp()` hook | Model data and active claim type |

### What this feature modifies
- `app/digital-twin/page.tsx` — adds task toggle state, derives effective enabled event set, passes task-disabled state to `EventsList`, adds disabled-task-count indicator, updates `handleReset`

### Bridge file pattern
No new modules are created. If any new helper functions are extracted to `src/ui-wa-tasks/`, the existing `.js` bridge file pattern must be maintained.

---

## 7. Story Candidates

### Story 1: WA task checkboxes and event blocking logic
**Scope:** Add a `disabledTasks: Set<string>` state to the Digital Twin page. Render a checkbox on each WA task card. Derive the effective enabled event set by checking whether each event with WA mappings has at least one active task. Feed the derived set into `autoWalk`. Include the disabled-task-count indicator near the WA toggle.

**Key acceptance criteria:**
- Task checkboxes render inside WA task cards (only when WA toggle is on)
- Unchecking all tasks for an event blocks it; auto-walk recalculates
- Events with no WA tasks are unaffected
- Disabled task count indicator shows correct count
- Reset clears all task toggles

### Story 2: Parent event override and visual feedback
**Scope:** When an event is disabled via its event-level checkbox, grey out the WA task checkboxes beneath it. Ensure visual transitions (enabled-to-disabled and back) work correctly when task toggles cause events to change state. Ensure the disabled-events count banner reflects both event-level and task-level disabling.

**Key acceptance criteria:**
- Task checkboxes are greyed out and non-interactive when parent event is disabled
- Event row transitions to disabled style when last task is unchecked
- Event row transitions back to enabled style when a task is re-checked
- Disabled count banner accounts for task-blocked events

### Story 3: Integration testing and edge cases
**Scope:** Verify behaviour across all seven claim types with sample data. Verify that events with partial and gap alignment WA tasks behave correctly with toggles. Verify that the WA toggle off state fully disengages task-level blocking. Verify keyboard accessibility of task checkboxes.

**Key acceptance criteria:**
- Task toggles work for all claim types
- Toggling WA tasks off reverts to event-level-only blocking
- Task checkboxes are keyboard accessible (Tab, Space/Enter)
- Edge case: event with a single WA task — unchecking it immediately blocks the event

---

## 8. Change Log

| Date | Change | Reason | Raised By |
|------|--------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for WA task toggles in Digital Twin | Alex (System Spec Agent) |
