# Story -- WA Timeline Chips

## User story

As a business analyst, I want WA task chips displayed on timeline entries when the applied event triggered a caseworker task so that I can trace which WA tasks fired at each step of the simulation journey.

---

## Context / scope

- Layer 3 (React component) modification to the timeline rendering in `app/digital-twin/page.tsx`
- Requires the component to track which event was applied at each simulation step, since the existing `TimelineEntry` type stores `stateId` and `stateName` but not the triggering event
- Recommended approach: maintain a local `Map<number, WaTaskMeta | undefined>` keyed by step index, populated when each event is applied via `enrichEventWithWaTask`
- The chip uses the alignment badge colour (from `getWaTaskBadge`) as its background and displays the WA task name
- Chips only render when the WA toggle is on
- The existing auto-walk mode must also populate the per-step WA task map

---

## Acceptance criteria

**AC-1 -- Timeline entry shows WA task chip when applied event triggered a task**
- Given the WA toggle is on and the simulation has advanced through an event that triggers a WA task,
- When the timeline renders,
- Then the timeline entry for that step includes a small chip displaying the WA task name.

**AC-2 -- Chip colour matches alignment badge**
- Given a timeline entry has a WA task chip,
- When the chip renders,
- Then its background colour matches the alignment badge colour returned by `getWaTaskBadge` for that task's alignment status (green for aligned, amber for partial, red for gap).

**AC-3 -- Timeline entries for events without WA tasks show no chip**
- Given the WA toggle is on and the simulation advanced through an event that does not trigger a WA task,
- When the timeline renders,
- Then that timeline entry does not display a WA task chip.

**AC-4 -- Chips hidden when WA toggle is off**
- Given the WA toggle is off,
- When the timeline renders,
- Then no WA task chips appear on any timeline entry, regardless of whether the applied events triggered WA tasks.

**AC-5 -- Auto-walk populates WA task data for all timeline steps**
- Given the simulation runs in auto-walk mode (all events enabled),
- When the WA toggle is turned on after auto-walk completes,
- Then every timeline entry that corresponds to a WA-task-triggering event displays the correct WA task chip.

**AC-6 -- Chip includes text label not just colour**
- Given a WA task chip is rendered on a timeline entry,
- When the analyst views it,
- Then the chip displays the task name as readable text and does not rely solely on colour to convey meaning (WCAG AA compliance).

---

## Out of scope

- Expanding task details from the timeline chip (task detail is available via the events panel cards)
- Modifying the `TimelineEntry` type in ui-case-walk (local component state is used instead)
- WA toggle implementation (covered in story-wa-toggle-and-task-cards)
- Modifying wa-task-engine or ui-wa-tasks functions
