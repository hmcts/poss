# Story -- WA Alignment Warnings

## User story

As a business analyst, I want partial alignment amber info boxes inside expanded task cards and a red gap banner at payment-related states so that I can immediately see where the WA task model is incomplete or misaligned with the event model.

---

## Context / scope

- Layer 3 (React component) additions within `app/digital-twin/page.tsx`
- Amber info box: rendered inside the expanded view of a WA task card when `waTask.alignment === 'partial'`. Content sourced from `waTask.notes` (populated by `enrichEventWithWaTask` which delegates to `getEventWaContext`)
- Red gap banner (`WaGapBanner` component): rendered at the top of the main simulation panel when the current state is payment-related and gap tasks exist
- Payment-related state heuristic: `state.technicalName` contains "PAYMENT" or equals "PENDING_CASE_ISSUED"
- Gap task detection uses `getUnmappedTasks` from wa-task-engine
- Both elements only render when the WA toggle is on
- Supports the "uncertainty as first-class content" system invariant

---

## Acceptance criteria

**AC-1 -- Partial alignment task card shows amber info box when expanded**
- Given the WA toggle is on and a task card with `alignment === 'partial'` is visible,
- When the analyst expands that task card,
- Then an amber-styled info box is displayed within the expanded card containing the alignment notes text from `waTask.notes`.

**AC-2 -- Aligned task cards do not show amber info box**
- Given the WA toggle is on and a task card with `alignment === 'aligned'` is expanded,
- When the analyst views the expanded content,
- Then no amber info box is rendered within that card.

**AC-3 -- Red banner appears at payment-related states when gap tasks exist**
- Given the WA toggle is on and the simulation is at a state whose `technicalName` contains "PAYMENT" or equals "PENDING_CASE_ISSUED",
- When `getUnmappedTasks` returns one or more gap tasks,
- Then a red banner is displayed prominently in the simulation panel with text including the gap task name (e.g. "WA task 'Review Failed Payment' has no corresponding event in the model").

**AC-4 -- Red banner does not appear at non-payment states**
- Given the WA toggle is on and the simulation is at a state whose `technicalName` does not contain "PAYMENT" and does not equal "PENDING_CASE_ISSUED",
- When the simulation panel renders,
- Then no red gap banner is displayed, regardless of whether gap tasks exist in the overall model.

**AC-5 -- Neither warning element renders when WA toggle is off**
- Given the WA toggle is off,
- When the simulation is at any state (including payment-related states with gap tasks),
- Then no amber info boxes and no red gap banners are rendered.

**AC-6 -- Amber info box and red banner are accessible**
- Given an amber info box or red gap banner is visible,
- When the analyst views or navigates to it,
- Then the element uses a semantic role (e.g. `role="alert"` or `role="status"`) and includes a text label that does not rely solely on colour to convey its meaning.

---

## Out of scope

- Modifying `getUnmappedTasks` in wa-task-engine or `enrichEventWithWaTask` in ui-wa-tasks
- Gap banners for non-payment gap tasks (only the Failed Payment gap is in scope for this prototype)
- Changing the payment-related state heuristic to a data-driven approach (noted as a future consideration)
- WA toggle implementation (covered in story-wa-toggle-and-task-cards)
