# Handoff -- react-digital-twin-wa

**From:** Cass (BA Agent)
**To:** Nigel (Tester) / Codey (Developer)
**Date:** 2026-03-27

## Stories written

1. **story-wa-toggle-and-task-cards** -- WA toggle (default off) + collapsible task cards beneath events. 7 ACs covering toggle behaviour, card collapsed/expanded states, no-task events, and keyboard accessibility.
2. **story-wa-timeline-chips** -- WA task name chips on timeline entries with alignment-coloured backgrounds. 6 ACs covering chip rendering, auto-walk population, and WCAG compliance.
3. **story-wa-alignment-warnings** -- Amber info box for partial alignment inside expanded cards + red gap banner at payment-related states. 6 ACs covering both warning types, state heuristic, and accessibility.
4. **story-wa-empty-state-and-degradation** -- "No caseworker tasks" info note + graceful degradation when WA data is unavailable. 5 ACs covering empty state, toggle disabling, and pre-feature parity.

## Key decisions

- Toggle is local React state, not persisted -- sufficient for prototype stage.
- Timeline chips require a local `Map<number, WaTaskMeta | undefined>` since `TimelineEntry` does not track the applied event. Stories call this out explicitly.
- Payment-related state heuristic (`technicalName` contains PAYMENT or equals PENDING_CASE_ISSUED) is documented as a pragmatic rule, not a model-driven approach.
- All WA display data sourced from ui-wa-tasks; no logic duplication in the React layer.

## Watch points for implementation

- WA data provider mechanism is assumed but not yet built. Story 4 AC-4/AC-5 ensure the component degrades safely without it.
- Auto-walk mode must populate WA task data for all steps (Story 2 AC-5), not just the final state.
- Badge colours must always include text labels for WCAG AA (Stories 1, 2, 3).
