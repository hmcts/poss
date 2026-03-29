# Story: caseman-data-prep

## User Story

As a developer setting up the Caseman comparison feature,
I want a one-time data preparation script and a pure logic module that parse, join, auto-match, and summarise Caseman data,
so that all three comparison tabs have a consistent, testable data foundation that degrades gracefully to auto-derived baseline when no curated mappings file exists.

---

## Acceptance Criteria

### AC1 — CSV pre-processing script produces valid `caseman-events.json`

**Given** the three source CSVs are present at:
- `.business_context/SUPS-Caseman/.../standard_events.csv` (497 rows)
- `.business_context/SUPS-Caseman/.../tasks.csv` (513 rows)
- `.business_context/SUPS-Caseman/.../pre_req_events.csv` (32 rows)

**When** the one-time dev script is executed

**Then** `data/caseman-events.json` is written containing an array of `CasemanEvent` objects, each with `id`, `name`, `domain` (derived from the first associated BMS task prefix per Rule 4), `taskCodes`, and `prerequisiteIds`; and the array contains exactly 497 entries.

---

### AC2 — `parseCasemanEvents` derives domain correctly from BMS task prefix

**Given** a `CasemanEvent` whose `taskCodes` array begins with `"JH-001"`

**When** `parseCasemanEvents` processes that event

**Then** the returned object's `domain` field is `"Judgments&Hearings"`; events with no associated task codes receive domain `"Unclassified"`.

---

### AC3 — `autoMatchEvents` applies coverage thresholds correctly

**Given** a Caseman event name `"Issue claim"` and new-service event names `["Issue Claim", "File Response", "Submit Application"]`

**When** `autoMatchEvents` runs with a Levenshtein-ratio or Jaccard similarity algorithm

**Then**:
- The best match `"Issue Claim"` scores above 0.8 and is assigned status `"covered"` with `source: "auto"`
- A candidate scoring between 0.5 and 0.8 is assigned status `"partial"` with `source: "auto"`
- A candidate scoring below 0.5 is assigned status `"gap"` with `source: "auto"`

---

### AC4 — `joinWithMappings` applies mapping file precedence (Rule 6)

**Given** `data/caseman-mappings.json` contains a curated entry for event ID 42 with `status: "covered"` and `source: "curated"`

**When** `joinWithMappings` is called with the parsed events and the mappings file

**Then**:
- Event ID 42 uses the curated mapping (status and source are preserved)
- All other event IDs not present in the file receive auto-derived mappings
- No event appears twice in the output

---

### AC5 — `getCoverageSummary` computes the partial-as-half-covered percentage

**Given** a dataset of 100 events: 40 covered, 20 partial, 40 gap

**When** `getCoverageSummary` is called

**Then** the returned object contains `{ total: 100, covered: 40, partial: 20, gap: 40, coveragePercent: 50 }` (formula: `(40 + 20 * 0.5) / 100 * 100 = 50`).

---

### AC6 — `filterRows` and `searchRows` return correct subsets

**Given** a mixed dataset of covered, partial, and gap events across multiple domains

**When** `filterRows` is called with `status: "gap"` and domain `"Enforcement"`

**Then** only rows matching both criteria are returned; and when `searchRows` is called with a text query that matches an event name, only rows whose `name` or `notes` fields contain the query (case-insensitive) are returned.

---

## Out of Scope

- Runtime CSV parsing in the browser (CSVs are pre-processed to JSON at dev time)
- LLM or AI-assisted matching
- Consuming `create_packages.sql` or `create_triggers.sql`
- Modifying the Caseman source data or the new service model
- Automatically creating Action Items from gap events
