# Handoff Summary — ui-wa-tasks

**From:** Alex (System Spec Agent)
**To:** Cass (BA), then Codey (Implementation)
**Date:** 2026-03-27

## What this feature does
UI orchestration layer producing view-model data for WA task display. Six pure functions that bridge wa-task-engine query results to React-ready structures: enriched events, badges, tooltips, panel data, and state-level counts.

## Key decisions made
- Follows the ui-case-walk enrichment pattern exactly (additive properties, no DOM dependencies)
- Badge mapping is a static lookup: aligned=green/check, partial=amber/warning, gap=red/cross
- Tooltip uses a fixed template with conditional alignment notes suffix
- Recommended type name `WaEnrichedEvent` to avoid collision with ui-case-walk's `EnrichedEvent`
- Colour values should be hex or semantic tokens (framework-agnostic), not Tailwind classes

## Upstream dependencies
- wa-task-engine (`src/wa-task-engine/index.ts`) -- all 7 query functions
- wa-data-model types from `src/data-model/schemas.ts` and `src/data-model/enums.ts`
- Event type from `src/data-model/schemas.ts`

## Open questions for Cass
1. Type naming: confirm `WaEnrichedEvent` vs alternative
2. Badge colour format: hex values vs semantic tokens
3. Whether a combined enrichment function (WA + uncertainty) is needed or left to React layer

## Module location
`src/ui-wa-tasks/index.ts` with bridge `index.js` file, following existing `src/ui-*/` pattern.
