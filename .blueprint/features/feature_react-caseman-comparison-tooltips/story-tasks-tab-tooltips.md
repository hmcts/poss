# Story: Tasks Tab Domain Block Tooltips

**Feature:** react-caseman-comparison-tooltips
**File:** `app/caseman-comparison/TasksTab.tsx`
**Tooltips:** #7 domain blocks (dynamic); #8 Unclassified block (verbatim override)

---

## User Story

As a business analyst or developer inspecting task coverage by domain,
I want hover tooltips on each domain block in the proportional block chart,
so that I can quickly see the event count and which WA tasks cover that domain without switching views.

---

## Acceptance Criteria

**AC1 — Named domain block shows domain name, event count, and WA tasks**
Given I am on the Tasks tab and hover a named domain block (e.g. "Issue"),
when the tooltip is visible,
then it shows the domain name, event count, and the names of WA tasks covering that domain — for example: *"Issue: 24 events — WA tasks: Review Defendant response, Review application"*

**AC2 — Domain block with no WA tasks shows "No WA tasks" fallback**
Given I hover a domain block that has no WA tasks mapped to it,
when the tooltip is visible,
then it shows the domain name and event count followed by *"No WA tasks covering this domain"* — for example: *"CCBC: 47 events — No WA tasks covering this domain"*

**AC3 — Unclassified block shows verbatim data quality message**
Given I hover the "Unclassified" domain block,
when the tooltip is visible,
then it shows exactly: *"413 of 497 Caseman events have no BMS task code and cannot be classified by domain. This is a data quality issue in Caseman's source data, not a gap in the new service."*

**AC4 — Flex layout of domain blocks is preserved**
Given the domain block divs are wrapped in a Tooltip component,
when the Tasks tab renders,
then the proportional block chart retains its correct flex sizing and visual layout.

**AC5 — Existing bare `title` attributes are removed**
Given domain blocks previously carried a `title` attribute,
when the Tooltip component is in place,
then the bare `title` attribute is removed from each block so only the styled tooltip is shown.

---

## Out of Scope

- Changes to domain assignment logic or WA task mapping data
- Tooltip content for the legend or filter controls in TasksTab
- Changes to `src/` data files
- Modifying the block proportions or colour coding
