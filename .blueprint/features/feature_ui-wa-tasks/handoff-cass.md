# Handoff Summary -- ui-wa-tasks

**From:** Cass (Story Writer)
**To:** Codey (Implementation)
**Date:** 2026-03-27

## Stories written

1. **story-badge-and-tooltip.md** -- `getWaTaskBadge` (static lookup for 3 tiers + defensive default) and `getWaTaskTooltip` (fixed template with conditional notes suffix). 7 ACs with concrete expected values.
2. **story-event-enrichment.md** -- `enrichEventWithWaTask` (single event) and `enrichAvailableActions` (batch). 6 ACs covering mapped events, unmapped events, additive enrichment, and type naming (`WaEnrichedEvent`).
3. **story-panel-and-counts.md** -- `prepareWaTaskPanel` and `getStateWaTaskCount`. 6 ACs covering mixed-alignment states, empty states, deduplication, and the `hasGaps` flag.

## Decisions made

- Type name confirmed as `WaEnrichedEvent` to avoid collision with ui-case-walk's `EnrichedEvent`
- Badge colours are hex values: `#22C55E` (green/aligned), `#F59E0B` (amber/partial), `#EF4444` (red/gap), `#6B7280` (grey/unknown fallback)
- Composition of WA + uncertainty enrichment is left to the React layer -- no combined function in this module
- Tooltip template: `"{taskName} -- Triggered by: {triggerDescription}"` with optional `" | Note: {alignmentNotes}"` suffix

## Notes for Codey

- Follow the `src/ui-case-walk/index.ts` pattern: pure functions, exported types, bridge `.js` file
- All functions delegate to wa-task-engine for resolution -- do not re-implement matching logic
- Export types: `WaEnrichedEvent`, `WaTaskBadge`, `WaTaskPanelData`, `WaTaskCountSummary`
- Unknown alignment values must not throw -- fall through to the neutral grey badge
