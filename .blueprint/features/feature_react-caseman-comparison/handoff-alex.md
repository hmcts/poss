## Handoff Summary
**For:** Cass
**Feature:** react-caseman-comparison

### Key Decisions
- Three-tab page at `/caseman-comparison`: States (side-by-side + SVG connection lines), Events (filterable table), Tasks (block chart)
- Auto-derived baseline on load (string similarity matching); BA can edit classifications in-browser and export JSON
- `data/caseman-mappings.json` takes precedence over auto-match where entries exist (incremental curation)
- Dual audience: dense detail for BAs, legible summary cards for stakeholders
- Read-only except for BA mapping edits (component state → export JSON → commit to repo)

### Files Created
- `.blueprint/features/feature_react-caseman-comparison/FEATURE_SPEC.md`

### Open Questions
- States tab: confirm max state count per claim type before building SVG layout
- Tasks tab: confirm whether WA-domain linkage should be via events (auto) or manual mapping

### Critical Context
Four stories in dependency order: data-prep → states-tab → events-tab → tasks-tab.

Events tab (Story 3) is most complex: filterable table + inline BA editing + two exports (mappings JSON + CSV).

Tasks tab (Story 4) introduces a block chart — no existing pattern in codebase; Nigel should treat it as a custom SVG component.

Data sources: Caseman CSVs in `.business_context/SUPS-Caseman/...reference_data/data/common/`. New service data from Zustand store. WA data from `data/wa-tasks.json` + `data/wa-mappings.json`.
