# Story -- WA State Explorer Overlay

## User story

As a business analyst, I want to see WA task count badges on State Explorer graph nodes and a "Work Allocation Tasks" section in the state detail panel so that I can quickly identify which states have caseworker tasks and assess their alignment quality.

---

## Context / scope

- Layer 3 (React component) modification to `app/state-explorer/page.tsx`
- Helper functions in `src/ui-wa-tasks/state-overlay-helpers.ts`: `getNodeWaBadge`, `getStateDetailWaTasks`, `getTransitionWaTasks`
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

**AC-4 -- State detail panel shows "Next States & WA Tasks" section**
- Given the analyst clicks a state node that has outgoing transitions,
- When the detail panel opens,
- Then a "Next States & WA Tasks" section appears showing each outgoing transition as a card with: target state name, transition condition, system/timed indicators, and any WA tasks triggered by events at the current state.

**AC-4a -- Each transition card shows WA tasks with alignment badges**
- Given a transition card is displayed and events at the current state trigger WA tasks,
- Then each WA task is listed with its alignment badge (Aligned/Partial/Gap) and tooltip.
- Transitions where no events trigger WA tasks show "No WA tasks for this transition".

**AC-5 -- No "Next States & WA Tasks" section for states with no outgoing transitions**
- Given the analyst clicks a state node that has no outgoing transitions (e.g. end state),
- When the detail panel opens,
- Then no "Next States & WA Tasks" section appears.

**AC-6 -- Badge text always accompanies colour for accessibility**
- All badge elements include a text label (e.g. "Aligned", "Partial", "Gap") alongside the colour, ensuring meaning is not conveyed by colour alone.

---

## Dependencies
- `src/ui-wa-tasks/state-overlay-helpers.ts` (`getNodeWaBadge`, `getStateDetailWaTasks`, `getTransitionWaTasks`)
- `src/ui-wa-tasks/index.ts` (existing: `getWaTaskBadge`, `getWaTaskTooltip`)
- `src/wa-task-engine/index.ts` (existing: `getTasksForState`, `getTasksForEvent`)
- `data/wa-tasks.json`, `data/wa-mappings.json`
