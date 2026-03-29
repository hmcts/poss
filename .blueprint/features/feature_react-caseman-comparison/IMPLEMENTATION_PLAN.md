# Implementation Plan — react-caseman-comparison

## Summary

Pure logic (29/29 tests), data files, and the `/caseman-comparison` route are already in place. The remaining work is four React files: a shell page with tab switching and shared state, then one component per tab (States, Events, Tasks). Each tab component is independent and receives all data it needs via props.

## Files to Create / Modify

| Path | Action | Purpose |
|------|--------|---------|
| `app/caseman-comparison/page.tsx` | Create | Shell: tab switcher, data loading, shared state, passes props to each tab |
| `app/caseman-comparison/StatesTab.tsx` | Create | States tab: side-by-side Caseman statuses vs new model states, SVG lines, gap indicators |
| `app/caseman-comparison/EventsTab.tsx` | Create | Events tab: filterable table, inline BA edit, Export CSV, Export Mappings JSON |
| `app/caseman-comparison/TasksTab.tsx` | Create | Tasks tab: block chart (SVG), WA summary table, domain coverage colouring |

## Implementation Steps

1. **page.tsx — shell only.** Controlled `activeTab` state (`'states' | 'events' | 'tasks'`). Load `caseman-events.json` + `caseman-mappings.json` + `wa-tasks.json` + `wa-mappings.json` via static imports. Derive `rows: JoinedRow[]` with `parseCasemanEvents` → `autoMatchEvents` → `joinWithMappings` (all from `src/caseman-comparison/index.ts`). Hold `editedMappings: CasemanMapping[]` state for BA overrides. Render tab bar + `{activeTab === 'states' && <StatesTab …/>}` etc. No tab UI content in this file.

2. **StatesTab.tsx.** Accept `props: StatesTabProps`. Render claim type selector (reuse `CLAIM_TYPES` from `src/app-shell`). Left column: 6 Caseman statuses. Right column: states for selected claim type from `modelData`. SVG overlay for connection lines between matched pairs. Red gap indicator for unmatched Caseman statuses; amber for unmatched new service states. Summary card (matched / unmatched counts).

3. **EventsTab.tsx.** Accept `props: EventsTabProps`. Summary cards via `getCoverageSummary`. Filter bar: status select, domain select, text search. Table sorted gap → partial → covered then by ID. Expandable rows showing task codes, prerequisite IDs, deep link (via `deepLink()`). Click status badge → inline edit form (status dropdown, newEventName input, notes textarea, Save/Cancel). Save merges edit into `editedMappings` via `onMappingEdit` callback. Export Mappings JSON button. Export CSV button (uses `exportComparisonCsv`).

4. **TasksTab.tsx.** Accept `props: TasksTabProps`. Derive domain → task count from `caseman-events.json` grouping. Derive which WA tasks cover which domains via `wa-mappings.json` event names cross-referenced to row domains. SVG block chart: each Caseman domain a proportional-width block; WA task bands overlaid; green/amber/red fill by coverage level. Accessible table below chart listing all 12 domains with coverage status. WA task summary table reusing data from `wa-tasks.json`. Summary card: X of 12 domains with at least partial coverage.

5. **Wire up in page.tsx.** Pass `rows`, `editedMappings`, `onMappingEdit`, `modelData`, `waTasks`, `waMappings` as props to the relevant tab components.

## Key Props / Interfaces (shared contract)

```ts
// Shared — defined once in page.tsx, imported by each tab
interface StatesTabProps {
  modelData: AppModelData;           // from useApp()
}

interface EventsTabProps {
  rows: JoinedRow[];                 // from joinWithMappings (includes edits)
  editedMappings: CasemanMapping[];  // BA overrides held in page state
  onMappingEdit: (m: CasemanMapping) => void;
}

interface TasksTabProps {
  rows: JoinedRow[];                 // for domain derivation
  waTasks: WaTask[];
  waMappings: WaMapping[];
}
```

`JoinedRow`, `CasemanMapping`, `CoverageSummary` are re-exported from `src/caseman-comparison/index.ts` — import from there, do not redefine.
