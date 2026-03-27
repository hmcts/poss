# Story -- WA Toggle and Task Cards

## User story

As a business analyst, I want a "Show WA Tasks" toggle in the Digital Twin simulation controls that reveals collapsible WA task cards beneath events so that I can see which caseworker tasks each event triggers and inspect their alignment status.

---

## Context / scope

- Layer 3 (React component) modification to `app/digital-twin/page.tsx`
- Adds `showWaTasks` boolean as local React state (default: `false`)
- WA task and mapping data (`WaTask[]`, `WaTaskMapping[]`) consumed from a React context provider (mechanism TBD, assumed available)
- Task cards use `enrichEventWithWaTask` from `ui-wa-tasks` to resolve which events trigger WA tasks
- Badge colours use `getWaTaskBadge` from `ui-wa-tasks`: green (aligned), amber (partial), red (gap)
- Collapsed card shows task name + alignment badge; expanded card shows trigger description, alignment notes, and context label
- When toggle is off, no WA UI elements render and the Digital Twin behaves exactly as before

---

## Acceptance criteria

**AC-1 -- Toggle renders in simulation controls with default off**
- Given the analyst has started a simulation,
- When the simulation view renders,
- Then a "Show WA Tasks" toggle control is visible in the simulation controls area with its initial state set to off (unchecked/inactive).

**AC-2 -- Toggling on reveals task cards beneath events that trigger WA tasks**
- Given the simulation is running and the WA toggle is off,
- When the analyst toggles "Show WA Tasks" on,
- Then for each event in the available events panel where `enrichEventWithWaTask` returns a `waTask` property, a task card appears beneath that event row.

**AC-3 -- Collapsed task card shows task name and alignment badge**
- Given the WA toggle is on and an event has a WA task card,
- When the card is in its default collapsed state,
- Then the card displays the task name (from `waTask.taskName`) and an alignment badge with the correct colour and text label (e.g. green/"Aligned", amber/"Partial", red/"Gap") as returned by `getWaTaskBadge`.

**AC-4 -- Expanding a task card reveals trigger, notes, and context**
- Given a collapsed WA task card is visible,
- When the analyst clicks the task card to expand it,
- Then the card expands to show: the trigger description (from the underlying `WaTask.triggerDescription`), alignment notes (from `waTask.notes`, if non-empty), and the context label (from `waTask.context`, e.g. "claim", "gen-app") if present.

**AC-5 -- Events without WA tasks show no card**
- Given the WA toggle is on,
- When an event in the available events panel has no WA task mapping (`enrichEventWithWaTask` returns `waTask` as `undefined`),
- Then no task card is rendered beneath that event row.

**AC-6 -- Toggling off hides all WA elements**
- Given the WA toggle is on and task cards are visible,
- When the analyst toggles "Show WA Tasks" off,
- Then all WA task cards are removed from the available events panel and no WA UI elements are rendered.

**AC-7 -- Task card is keyboard accessible with aria attributes**
- Given a WA task card is visible,
- When the analyst navigates using the keyboard,
- Then the card's expand/collapse control is focusable via Tab, activatable via Enter/Space, and uses `aria-expanded` to indicate its current state.

---

## Out of scope

- Implementing the WA data provider (assumed available via React context)
- WA task chips on timeline entries (separate story)
- Alignment warning boxes and gap banners (separate story)
- "No caseworker tasks" info note (separate story)
- Modifying wa-task-engine or ui-wa-tasks functions
- Persisting the toggle state across navigation or page reloads
