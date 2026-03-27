# Story -- WA State Explorer Overlay

## User story

As a business analyst, I want to see WA task count badges on State Explorer graph nodes and a "Work Allocation Tasks" section in the state detail panel so that I can quickly identify which states have caseworker tasks and assess their alignment quality.

---

## Context / scope

- Layer 3 (React component) modification to `app/state-explorer/page.tsx`
- New helper functions in `src/ui-wa-tasks/state-overlay-helpers.ts`: `getNodeWaBadge`, `getStateDetailWaTasks`
- WA data loaded from `data/wa-tasks.json` and `data/wa-mappings.json`
- Badge colours follow existing convention: green (#22C55E) aligned, amber (#F59E0B) partial, red (#EF4444) gap
- Delegates to existing `getTasksForState`, `getAlignmentSummary`, `getWaTaskBadge` from upstream modules

---

## Acceptance criteria

**AC-1 -- Node badge shows WA task count for states with WA tasks**
- Given a state has events that trigger WA tasks,
- When the State Explorer graph renders,
- Then the node displays a small badge showing the task count (e.g. "3 tasks", "1 task").

**AC-2 -- Node badge colour reflects worst alignment at that state**
- Given a state has WA tasks with mixed alignment,
- When any task has `alignment === 'gap'`, the badge is red (#EF4444).
- When no gap but any `partial`, the badge is amber (#F59E0B).
- When all `aligned`, the badge is green (#22C55E).

**AC-3 -- No badge shown for states with no WA tasks**
- Given a state has no events that trigger any WA task,
- When the graph renders,
- Then no WA task badge appears on that node.

**AC-4 -- State detail panel shows Work Allocation Tasks section**
- Given the analyst clicks a state node that has WA tasks,
- When the detail panel opens,
- Then a "Work Allocation Tasks" section appears listing each task with its name and alignment badge.

**AC-5 -- State detail panel WA section is empty for states without WA tasks**
- Given the analyst clicks a state node that has no WA tasks,
- When the detail panel opens,
- Then no "Work Allocation Tasks" section appears (or it shows "No WA tasks at this state").

**AC-6 -- Badge text always accompanies colour for accessibility**
- All badge elements include a text label (e.g. "Aligned", "Partial", "Gap") alongside the colour, ensuring meaning is not conveyed by colour alone.

---

## Dependencies
- `src/ui-wa-tasks/state-overlay-helpers.ts` (new, created by this feature)
- `src/ui-wa-tasks/index.ts` (existing: `getWaTaskBadge`, `getStateWaTaskCount`, `prepareWaTaskPanel`)
- `src/wa-task-engine/index.ts` (existing: `getTasksForState`)
- `data/wa-tasks.json`, `data/wa-mappings.json`
