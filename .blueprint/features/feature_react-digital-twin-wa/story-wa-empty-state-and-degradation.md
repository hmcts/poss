# Story -- WA Empty State and Graceful Degradation

## User story

As a business analyst, I want to see an info note when the current state has no WA-triggering events, and I want the Digital Twin to work normally when WA data is unavailable, so that the simulation remains useful regardless of WA data completeness.

---

## Context / scope

- Layer 3 (React component) additions within `app/digital-twin/page.tsx`
- "No caseworker tasks" info note uses `getStateWaTaskCount` from ui-wa-tasks: when `total === 0` for the current state, display the note
- Graceful degradation: when the WA data provider returns no data (empty arrays or undefined), the WA toggle must be disabled or hidden and the Digital Twin must behave identically to its pre-feature state
- This ensures the feature is safe to ship before the WA data provider is fully wired

---

## Acceptance criteria

**AC-1 -- Info note shown at states with no WA-triggering events**
- Given the WA toggle is on and the simulation is at a state where `getStateWaTaskCount` returns `total === 0`,
- When the available events panel renders,
- Then an info note is displayed with the text "No caseworker tasks at this state".

**AC-2 -- Info note hidden when state has WA tasks**
- Given the WA toggle is on and the simulation is at a state where `getStateWaTaskCount` returns `total > 0`,
- When the available events panel renders,
- Then no "No caseworker tasks" info note is displayed.

**AC-3 -- Info note hidden when WA toggle is off**
- Given the WA toggle is off,
- When the simulation is at any state (including states with no WA tasks),
- Then no "No caseworker tasks" info note is displayed.

**AC-4 -- WA toggle disabled when WA data is unavailable**
- Given the WA data provider returns no data (empty arrays or undefined for tasks/mappings),
- When the simulation view renders,
- Then the "Show WA Tasks" toggle is either disabled (greyed out, not interactive) or hidden entirely, and no WA UI elements are rendered.

**AC-5 -- Digital Twin functions normally without WA data**
- Given WA data is unavailable (provider not wired or returns empty),
- When the analyst starts and runs a simulation,
- Then all existing Digital Twin functionality (state display, event toggling, timeline, auto-walk, simulation status) works identically to the pre-feature behaviour with no errors or visual differences.

---

## Out of scope

- Implementing the WA data provider itself (assumed to be a separate concern)
- Displaying a reason why WA data is unavailable (e.g. loading state or error message)
- WA toggle implementation details (covered in story-wa-toggle-and-task-cards)
- Modifying wa-task-engine or ui-wa-tasks functions
