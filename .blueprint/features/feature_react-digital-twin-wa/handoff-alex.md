# Handoff — react-digital-twin-wa

**From:** Alex (System Spec Agent)
**To:** Cass (BA Agent)
**Date:** 2026-03-27

## What this feature does
Integrates WA task cards into the Digital Twin (Case Walk) simulation. Each event that triggers a WA task shows a collapsible card with task name, alignment badge (green/amber/red), and context. Timeline entries gain WA task chips. A "Show WA Tasks" toggle (default off) controls visibility. Partial alignment gets amber info boxes; the Failed Payment gap gets a red banner at payment-related states.

## Key dependencies
- **ui-wa-tasks** provides all display data: `enrichEventWithWaTask`, `getWaTaskBadge`, `getStateWaTaskCount`
- **wa-task-engine** provides `getUnmappedTasks` for the gap banner
- **app/digital-twin/page.tsx** is the existing component being extended
- WA data (tasks + mappings) must be available via React context -- provider mechanism is an open question

## Component structure
- Extend `CaseWalkPage` with `showWaTasks` toggle state and WA data from context
- Extend `EventsList` to accept WA props and render `WaTaskCard` beneath events
- New `WaTaskCard` component: collapsed (name + badge) / expanded (trigger, notes, context)
- Timeline entries conditionally render a WA task chip using alignment badge colour
- `WaGapBanner` component for the Failed Payment red banner
- `WaInfoNote` for "No caseworker tasks at this state"

## Watch points for stories
1. Timeline chips need the component to track which event was applied at each step -- not currently stored
2. Failed Payment banner uses a state-name heuristic (`technicalName` contains PAYMENT or equals PENDING_CASE_ISSUED)
3. When WA data is unavailable, toggle should be disabled and Digital Twin must work as before
4. Sample/mock WA data needed for prototyping (real data integration is separate)
