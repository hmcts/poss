# Feature Specification — react-caseman-comparison

| Field | Value |
|-------|-------|
| Slug | `react-caseman-comparison` |
| Priority | P2 |
| Effort | L |
| Status | Ready |

---

## 1. Feature Intent

The new possession service was designed independently of the legacy Caseman system. There is no UI that answers: "What does the legacy system do, and how much of that does the new model cover?"

`react-caseman-comparison` adds a `/caseman-comparison` page with three tabs — **States**, **Events**, **Tasks** — each surfacing a different dimension of the gap between legacy Caseman and the new service. The audience is internal SMEs and BAs (primary) and stakeholders (secondary). The page is read-only but BAs can edit auto-derived mappings in-browser and export them as JSON, which becomes the new baseline on next load.

---

## 2. Scope

### In Scope

- New route `/caseman-comparison` with three tabs: States | Events | Tasks
- **States tab:** Caseman's 6 case statuses vs new service state model per claim type — side-by-side with connection lines and gap indicators
- **Events tab:** Caseman's 497 events vs new service event model — filterable table with alignment status (covered / partial / gap), groupable by domain
- **Tasks tab:** Caseman's 513 BMS task codes (grouped by prefix) vs 17 R1A WA tasks — block chart showing domain coverage and granularity mismatch
- Auto-derived baseline for all three tabs: structural matching on load, no manual curation required to start
- BA-editable mappings in-browser: BAs can override any auto-derived classification and add notes
- Export-to-JSON persists edits; if `data/caseman-mappings.json` exists it takes precedence over auto-derived baseline on load
- CSV export of the full Events tab comparison table
- Summary cards on each tab: counts by alignment status

### Out of Scope

- Editing the Caseman source data or the new model
- LLM/AI-assisted matching
- Consuming the large SQL files (`create_packages.sql`, `create_triggers.sql`)
- Automatically creating Action Items from gaps (link to Action Items page is in scope; creation is not)

---

## 3. Actors

### Business Analyst (primary)
- Views all three tabs, filters/searches, expands rows for detail
- Edits auto-derived mappings in-browser, adds notes, exports JSON
- Exports Events tab as CSV

### Stakeholder (secondary)
- Views summary cards and high-level coverage percentages
- May drill into the Tasks block chart to understand granularity mismatch

---

## 4. Behaviour Overview

### Tab 1 — States

Caseman has 6 case statuses: `NULL (active)`, `PAID`, `SETTLED`, `SETTLED/WDRN`, `STAYED`, and empty-string (stay lifted). The new service has a richer per-claim-type state model.

Layout:
- Caseman states listed on the left (6 rows)
- New service states listed on the right (per active claim type selector)
- SVG connection lines drawn between matched pairs
- Unmatched Caseman states: red gap indicator on the left
- Unmatched new service states: amber indicator on the right (new model has states Caseman didn't need)
- Claim type selector at the top of the tab (reuses existing active claim type from store)

Auto-derivation: match Caseman status names to new service state names by normalised string similarity. Fallback: all unmatched (BA edits from there).

### Tab 2 — Events

Caseman has 497 events across functional domains. The new model has events per claim type.

Layout:
- Filterable/sortable table: ID | Event Name | Domain | Status badge | New Model Event | Notes
- Default sort: gap → partial → covered, then by ID
- Filters: Status (covered / partial / gap), Domain, text search across name + notes
- Expand row: shows Caseman event prerequisites, associated BMS task codes, mapping notes, deep link to Event Matrix or State Explorer
- Summary cards at top: total (497), covered (green), partial (amber), gap (red), coverage %

Auto-derivation: match Caseman event names to new service event names by normalised string similarity (lowercase, strip punctuation). Threshold >0.8 = covered, 0.5–0.8 = partial, <0.5 = gap. BAs can override any row.

BA editing: clicking the status badge on any row opens an inline edit form — status dropdown, new event name field, notes textarea, Save/Cancel. Saved edits are held in component state. "Export Mappings JSON" button downloads `caseman-mappings.json`.

### Tab 3 — Tasks

Caseman has 513 BMS task codes grouped by prefix (BC, CA, CO, DR, EN, FM, IN, IS, JH, LS, PA, SM). The new service has 17 R1A WA tasks.

Layout:
- Block chart: each Caseman domain is a block, width proportional to task count
- R1A WA tasks overlaid as coloured bands across the blocks they cover
- A WA task covers a domain if any of its mapped events fall in that domain
- Blocks with no WA coverage are red; partial coverage is amber; full coverage is green
- Below the chart: table of R1A WA tasks with alignment status from `data/wa-mappings.json` (reuses existing WA data)
- Summary: X of 12 Caseman domains have at least partial WA coverage

---

## 5. State & Lifecycle Interactions

Read-only. Does not modify the new model or Caseman source data.

BA edits are held in React component state until exported. They do not modify the Zustand store.

---

## 6. Rules & Decision Logic

### Rule 1: CasemanEvent (parsed from CSV)

```
CasemanEvent {
  id: number
  name: string
  domain: string              // derived from first associated BMS task prefix
  taskCodes: string[]
  prerequisiteIds: number[]
}
```

### Rule 2: CasemanMapping (from data/caseman-mappings.json or auto-derived)

```
CasemanMapping {
  casemanEventId: number
  status: 'covered' | 'partial' | 'gap'
  newEventName: string | null
  newStateName: string | null
  notes: string
  source: 'auto' | 'curated'   // 'auto' = derived, 'curated' = BA-edited
}
```

### Rule 3: Coverage percentage

`(covered + partial * 0.5) / total * 100` — partial counts as half-covered.

### Rule 4: Domain derivation

From the first BMS task prefix of associated tasks. If no task: `'Unclassified'`.

Prefix → domain: BC=CCBC, EN=Enforcement, JH=Judgments&Hearings, IS=Issue, PA=Payments, LS=Listing, CA=Accounts, CO=Complaints, DR=DistrictRegistry, FM=Family, IN=Insolvency, SM=Statistics.

### Rule 5: Auto-matching algorithm

1. Normalise both sides: lowercase, strip punctuation, trim
2. Compute string similarity (Levenshtein ratio or Jaccard on word tokens)
3. Best match score >0.8 → `covered`, 0.5–0.8 → `partial`, <0.5 → `gap`
4. Source = `'auto'`; BAs can override to source = `'curated'`

### Rule 6: Mapping file precedence

On load: if `data/caseman-mappings.json` exists, use it for any event IDs present in the file. Auto-derive for any events not present. This allows incremental curation.

### Rule 7: CSV export columns

`ID, Event Name, Domain, Status, New Model Event, New State, Notes, Source`

### Rule 8: Deep links

covered/partial with newEventName → `/event-matrix?search={newEventName}`
covered/partial with newStateName → `/state-explorer?highlight={newStateName}`
gap → no link

---

## 7. Dependencies

| Module | Usage |
|--------|-------|
| `app-shell` | Extend `ROUTES` with `/caseman-comparison`; reuse `CLAIM_TYPES` |
| `event-matrix` | Reuse `csvEscape` pattern |
| `wa-task-engine` | Reuse WA task/mapping data for Tasks tab |

### New files

| File | Purpose |
|------|---------|
| `src/caseman-comparison/index.ts` | Pure functions: parse, join, auto-match, filter, search, export |
| `src/caseman-comparison/index.js` | Bridge re-export |
| `data/caseman-events.json` | Pre-processed CSVs (one-time script, checked in) |
| `app/caseman-comparison/page.tsx` | React page: three tabs, summary cards, editable mappings |

### Data files consumed

| File | Purpose |
|------|---------|
| `.business_context/SUPS-Caseman/.../standard_events.csv` | 497 Caseman events |
| `.business_context/SUPS-Caseman/.../tasks.csv` | 513 BMS task codes |
| `.business_context/SUPS-Caseman/.../pre_req_events.csv` | 32 prerequisite rules |
| `data/wa-tasks.json` | R1A WA tasks (Tasks tab) |
| `data/wa-mappings.json` | WA task-to-event mappings (Tasks tab) |
| `data/caseman-mappings.json` | BA-curated overrides (optional, partial OK) |

---

## 8. Non-Functional Considerations

- **Performance:** 497 rows, client-side filter/sort, no pagination needed.
- **Auto-match quality:** First-pass matches will be imperfect — that's expected. The BA editing flow exists to fix them. `source: 'auto'` rows are visually distinguished (italic or faded) so BAs know what needs review.
- **Accessibility:** Status badges always have text labels. Expandable rows use accessible disclosure. Block chart has a table fallback below it.

---

## 9. Assumptions & Open Questions

### Assumptions

- CSVs are pre-processed to `data/caseman-events.json` via a one-time dev script (not at runtime).
- `data/caseman-mappings.json` need not cover all 497 events — unmapped events auto-derive.
- Partial counts as 0.5 coverage. If the team prefers 0 or 1, update `getCoverageSummary`.

### Open Questions

1. **States tab connection lines:** SVG lines between matched states work well for 6 Caseman statuses vs ~10 new service states per claim type. If a claim type has many more states, this may become crowded. Confirm max state count before building.
2. **Tasks tab block chart:** Confirm whether "WA task covers a domain" should be based on event domain or a direct manual mapping. Auto-derivation via events is indirect but requires no extra data.
3. **Gaps → Action Items link:** Should gap rows have a "View in Action Items" link? (Action Items page is in scope separately.) Recommended: yes, as a deep link, but do not auto-create items.

---

## 10. Impact on System Specification

- Adds one new route to `ROUTES`
- New pure logic module `src/caseman-comparison/` follows existing patterns
- Does not modify any existing modules or store

---

## 11. Story Candidates

### Story 1: caseman-data-prep (M)
- One-time script: read three CSVs → `data/caseman-events.json`
- Pure functions: `parseCasemanEvents`, `joinWithMappings`, `autoMatchEvents`, `getCoverageSummary`, `filterRows`, `searchRows`, `exportComparisonCsv`
- Unit tests for auto-match, join, domain derivation, mapping precedence rule

### Story 2: caseman-states-tab (M)
- Side-by-side States view with SVG connection lines
- Claim type selector, gap indicators, summary card

### Story 3: caseman-events-tab (L)
- Filterable/searchable table with coverage badges
- Expandable rows with prerequisites, task codes, deep links
- Inline BA editing (status override, notes), Export Mappings JSON, Export CSV

### Story 4: caseman-tasks-tab (M)
- Block chart: Caseman domains sized by task count, WA task bands overlaid
- Coverage colouring, summary table of WA tasks below chart

---

## 12. Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-29 | Initial specification | Legacy coverage gap analysis identified as P2 priority |
