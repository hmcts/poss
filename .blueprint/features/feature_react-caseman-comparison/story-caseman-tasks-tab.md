# Story: caseman-tasks-tab

## User Story

As a Business Analyst or Stakeholder reviewing task-level coverage,
I want a Tasks tab with a block chart showing Caseman's 12 BMS task domains sized by task count and the 17 R1A WA tasks overlaid as coverage bands, plus a summary table below the chart,
so that I can understand at a glance where the new service covers, partially covers, or misses the legacy task granularity.

---

## Acceptance Criteria

### AC1 — Block chart renders 12 Caseman domains with width proportional to task count

**Given** the user navigates to `/caseman-comparison` and selects the Tasks tab

**When** the tab loads

**Then** a block chart renders where each of the 12 Caseman BMS task prefix domains (BC, CA, CO, DR, EN, FM, IN, IS, JH, LS, PA, SM) is represented as a block whose width is proportional to the number of BMS task codes in that domain (totalling 513 across all blocks); each block displays its domain label and task count.

---

### AC2 — WA task bands are overlaid across the blocks they cover

**Given** the 17 R1A WA tasks and their domain coverage derived from `data/wa-mappings.json`

**When** the block chart renders

**Then** each WA task that covers one or more Caseman domains is shown as a coloured horizontal band spanning the blocks for those domains; WA tasks are visually distinguishable from one another (e.g. by colour or label); and a WA task covers a domain when at least one of its mapped events falls within that domain (auto-derived via event domain linkage).

---

### AC3 — Block colouring reflects domain coverage status

**Given** the computed WA coverage for each Caseman domain block

**When** the block chart renders

**Then**:
- Blocks with no WA task coverage are coloured red
- Blocks with partial WA task coverage are coloured amber
- Blocks with full WA task coverage are coloured green
- The chart includes a legend explaining the three colours

---

### AC4 — Block chart has an accessible table fallback

**Given** the Tasks tab is rendered

**When** a user cannot or does not use the visual block chart (e.g. screen reader, reduced-motion preference)

**Then** a table below the chart lists all 12 Caseman domains with columns: Domain | Task Count | WA Tasks Covering | Coverage Status; the table conveys the same information as the visual chart and is always visible (not hidden).

---

### AC5 — Summary table lists all 17 R1A WA tasks with alignment status

**Given** the `data/wa-mappings.json` file is present

**When** the Tasks tab renders the section below the block chart

**Then** a table displays all 17 R1A WA tasks with columns: WA Task Name | Caseman Domains Covered | Alignment Status; and a summary line reads "X of 12 Caseman domains have at least partial WA coverage."

---

### AC6 — Summary count card reflects domain-level coverage

**Given** the coverage computation for all 12 domains is complete

**When** the Tasks tab renders

**Then** a summary card at the top of the tab shows: total Caseman domains (12), domains with at least partial WA coverage (green + amber), domains with no WA coverage (red), and the percentage of domains with at least partial coverage.

---

## Out of Scope

- Editing WA task mappings from this tab (the Tasks tab is read-only)
- Exporting the Tasks tab as CSV or JSON
- Manually assigning WA tasks to Caseman domains (coverage is auto-derived via event domains only)
- Displaying individual BMS task code names within the chart blocks
- Comparing task count at a sub-domain granularity beyond the 12 prefix groups
