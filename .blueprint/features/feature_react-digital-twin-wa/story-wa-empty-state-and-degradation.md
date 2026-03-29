# Story -- WA Graceful Degradation

## User story

As a business analyst, I want the Digital Twin to work normally when WA data is unavailable, so that the simulation remains useful regardless of WA data completeness.

---

## Context / scope

- Layer 3 (React component) additions within `app/digital-twin/page.tsx`
- The "No caseworker tasks at this state" info note has been **removed** — it was confusing when WA task cards were visible under events from other states in the events panel. Individual events already show WA tasks (or not) inline, making a state-level message redundant.
- Graceful degradation: when the WA data provider returns no data (empty arrays or undefined), the WA toggle must be disabled or hidden and the Digital Twin must behave identically to its pre-feature state
- This ensures the feature is safe to ship before the WA data provider is fully wired

---

## Acceptance criteria

**AC-1 -- WA toggle disabled when WA data is unavailable**
- Given the WA data provider returns no data (empty arrays or undefined for tasks/mappings),
- When the simulation view renders,
- Then the "Show WA Tasks" toggle is either disabled (greyed out, not interactive) or hidden entirely, and no WA UI elements are rendered.

**AC-2 -- Digital Twin functions normally without WA data**
- Given WA data is unavailable (provider not wired or returns empty),
- When the analyst starts and runs a simulation,
- Then all existing Digital Twin functionality (state display, event toggling, timeline, auto-walk, simulation status) works identically to the pre-feature behaviour with no errors or visual differences.

---

## Removed

- **Empty-state info note** ("No caseworker tasks at [state]") — removed because the events panel shows all events across all states with their WA task cards inline, making a separate state-level message redundant and potentially confusing.

---

## Out of scope

- Implementing the WA data provider itself (assumed to be a separate concern)
- Displaying a reason why WA data is unavailable (e.g. loading state or error message)
- WA toggle implementation details (covered in story-wa-toggle-and-task-cards)
