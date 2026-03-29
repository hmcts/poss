## Handoff Summary
**For:** Nigel
**Feature:** wa-task-toggles

### Key Decisions
- The core blocking logic is a single pure function `computeEffectiveEnabledEvents` that takes both toggle sets and returns the effective enabled event set -- all ACs test this function
- `showWaTasks: false` fully disengages task blocking (effective set equals `enabledEvents`)
- Event-level and task-level toggles are independent: disabling/re-enabling a parent event preserves child task toggle state
- Events with no WA task mappings are never affected by `disabledTasks`
- Story 2 adds helper functions (`isTaskCheckboxDisabled`, `getEventBlockedReason`, `getEffectiveDisabledCount`) for visual state derivation

### Files Created
- `.blueprint/features/feature_wa-task-toggles/story-wa-task-checkbox-blocking.md` (Story 1: core blocking logic, 7 ACs)
- `.blueprint/features/feature_wa-task-toggles/story-wa-task-visual-feedback.md` (Story 2: parent override and state metadata, 6 ACs)
- `.blueprint/features/feature_wa-task-toggles/story-wa-task-reachability-integration.md` (Story 3: integration and edge cases, 6 ACs)

### Open Questions
- None

### Critical Context
All ACs are testable against pure functions using the Node.js test runner. The key function to test is `computeEffectiveEnabledEvents` which wraps `getTasksForEvent` from `src/wa-task-engine/index.ts`. Tests need sample event arrays, WA task/mapping fixtures, and `Set<string>` inputs -- no DOM or React required. The function signatures are specified in each story file.
