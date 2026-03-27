# Story — Filter WA Tasks by Context Type

## User story

As a downstream UI feature, I want to filter WA tasks by their context type (claim, counterclaim, gen-app, claim-counterclaim, general) so that analysts can view tasks relevant to a specific domain context.

---

## Context / scope

- Layer 1 (pure logic) function: `filterTasksByContext`
- Signature: `filterTasksByContext(tasks, context: WaTaskContextValue): WaTask[]`
- Context values are defined in `WaTaskContext` enum: `'claim'`, `'counterclaim'`, `'gen-app'`, `'claim-counterclaim'`, `'general'`
- Simple enum equality match -- no fuzzy matching, no hierarchy, no fallback

---

## Acceptance criteria

**AC-1 -- Filter by 'gen-app' returns only gen-app tasks**
- Given the full tasks array (17 tasks),
- When `filterTasksByContext(tasks, 'gen-app')` is called,
- Then it returns exactly 4 tasks with ids `"wa-task-06"`, `"wa-task-07"`, `"wa-task-08"`, and `"wa-task-11"`.

**AC-2 -- Filter by 'general' returns only general-context tasks**
- Given the full tasks array,
- When `filterTasksByContext(tasks, 'general')` is called,
- Then it returns exactly 6 tasks: `"wa-task-03"`, `"wa-task-13"`, `"wa-task-14"`, `"wa-task-15"`, `"wa-task-16"`, and `"wa-task-17"`.

**AC-3 -- Filter by 'claim' returns only claim-context tasks**
- Given the full tasks array,
- When `filterTasksByContext(tasks, 'claim')` is called,
- Then it returns exactly 3 tasks: `"wa-task-01"`, `"wa-task-02"`, and `"wa-task-10"`.

**AC-4 -- Filter by 'counterclaim' returns only counterclaim-context tasks**
- Given the full tasks array,
- When `filterTasksByContext(tasks, 'counterclaim')` is called,
- Then it returns exactly 2 tasks: `"wa-task-05"` and `"wa-task-12"`.

**AC-5 -- Filter by 'claim-counterclaim' returns only claim-counterclaim tasks**
- Given the full tasks array,
- When `filterTasksByContext(tasks, 'claim-counterclaim')` is called,
- Then it returns exactly 2 tasks: `"wa-task-04"` and `"wa-task-09"`.

**AC-6 -- Empty tasks array returns empty result**
- Given an empty tasks array `[]`,
- When `filterTasksByContext([], 'general')` is called,
- Then it returns an empty array `[]`.

---

## Out of scope

- Hierarchical or grouped context filtering (e.g. "all claim-related" combining claim + claim-counterclaim)
- Adding new context values to the enum (that belongs to wa-data-model)
- Combining context filtering with alignment filtering (consumers compose these themselves)
- UI rendering of filtered task lists
