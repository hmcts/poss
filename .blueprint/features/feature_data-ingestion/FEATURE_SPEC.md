# Feature Specification — data-ingestion

## 1. Feature Intent

The data model (see `src/data-model/schemas.ts`) defines the *shape* of the domain. This feature populates it. It is the build-time pipeline that reads the authoritative Excel/PDF source material from `.business_context/`, normalises it, validates it against the Zod schemas, and outputs typed JSON files that every downstream feature consumes.

Without this feature the application has types but no data.

**Alignment:** Implements the data population step referenced in the data-model feature spec (`.blueprint/features/feature_data-model/FEATURE_SPEC.md` section 2, "Out of Scope").

---

## 2. Scope

### In Scope
- Parse **Event Model Excel** (7 sheets) into `Event[]` per claim type, handling two distinct sheet formats (see Section 6, R1/R2)
- Hand-code **State/Transition JSON** per claim type, transcribed from PDF state diagrams
- Parse **Breathing Space/Stayed matrix** Excel into typed arrays
- Auto-detect `hasOpenQuestions` from event notes; compute per-state `completeness`
- Validate all output against Zod schemas (`src/data-model/schemas.ts`)
- `npm run ingest` script writing JSON to `data/`

### Out of Scope
- Runtime data fetching; UI rendering; Zustand store population (downstream features)
- Modifying the Zod schemas themselves (owned by data-model)
- Automated PDF diagram parsing (states/transitions are hand-coded)

---

## 3. Actors Involved

### Developer (build-time)
- **Can do:** Run `npm run ingest`; edit hand-coded state/transition JSON
- **Cannot do:** Change output schema shape (owned by data-model)

### CI Pipeline (automated)
- **Can do:** Run the ingest script as a build step; fail the build on validation errors

---

## 4. Behaviour Overview

**Pipeline steps (in order):**

1. **Read hand-coded JSON** — Load `src/data-ingestion/states/*.json` (one per claim type) containing `State[]` and `Transition[]` transcribed from the PDF diagrams.
2. **Parse Event Model Excel** — For each of the 7 sheets, detect the format variant (A or B) and extract `Event[]`. Auto-generate event IDs as `{claimTypeId}:{index}`.
3. **Parse Breathing Space/Stayed Excel** — Extract both sheets into `BreathingSpaceEntry[]` arrays, mapping UI state labels to technical state names using the hand-coded state data.
4. **Detect open questions** — Scan each event's notes for markers: `?`, `TBC`, `TBD`, `placeholder`, `question`, `Alex to check`. Set `hasOpenQuestions` accordingly.
5. **Compute completeness** — For each state: `(events without open questions / total events) * 100`, rounded to integer. States with zero events get completeness 0.
6. **Validate** — Run all output through Zod schemas. Fail with diagnostics on any error.
7. **Write JSON** — Output to `data/claim-types.json`, `data/states/{claimTypeId}.json`, `data/events/{claimTypeId}.json`, `data/transitions/{claimTypeId}.json`, `data/breathing-space.json`, `data/stayed.json`.

**Edge cases:**
- "Counter Claim - Main Claim Closed" sheet is empty (1 row, no data). Output an empty event array; log a warning.
- Format B sheets: parse free-text "Who/Permissions" column into `Record<string, boolean>` by matching against `KNOWN_ROLES` from `src/data-model/enums.ts`. Unrecognised role text is logged as a warning.

---

## 5. State & Lifecycle Interactions

This feature is **state-populating** — it creates the static dataset that defines states, transitions, and events. It does not transition or constrain runtime state.

- Populates `isDraftLike`, `isLive`, `isEndState` flags based on PDF diagram colour conventions (amber = draft-like, green = live, dark = end state)
- Populates `completeness` on each State
- Populates `isSystemTriggered` and `isTimeBased` on Transitions from the hand-coded JSON

---

## 6. Rules & Decision Logic

### R1: Format A parsing (Main Claim, Enforcement, General Applications)
- **Inputs:** Sheet with ~27-30 individual actor columns containing Y/N
- **Outputs:** `Event.actors` as `Record<string, boolean>` with one key per actor column
- **Deterministic:** Yes

### R2: Format B parsing (Counter Claim, Accelerated Claims, Appeals)
- **Inputs:** Sheet with free-text "Who/Permissions" column
- **Outputs:** `Event.actors` as `Record<string, boolean>` by fuzzy-matching role names against `KNOWN_ROLES`
- **Deterministic:** Partially — depends on matching heuristics. Unmatched text logged as warning.

### R3: Open question detection
- **Inputs:** `Event.notes` string
- **Outputs:** `hasOpenQuestions` boolean
- **Deterministic:** Yes — case-insensitive substring match against fixed marker list

### R4: Completeness computation
- **Inputs:** All events for a given state
- **Outputs:** Integer 0-100
- **Deterministic:** Yes

### R5: State label resolution (Breathing Space/Stayed)
- **Inputs:** UI label strings from matrix sheets
- **Outputs:** Technical state name references
- **Deterministic:** Yes, but requires a UI-label-to-technical-name lookup table derived from hand-coded state JSON

---

## 7. Dependencies

### Upstream
- **data-model** (`src/data-model/schemas.ts`, `src/data-model/enums.ts`) — Zod schemas and enums this feature validates against
- **Business context files** (`.business_context/`) — Excel and PDF source material
- **exceljs** or equivalent — NPM package for reading .xlsx files

### Downstream
- All features reading from `data/` (state-explorer, event-matrix, case-walk, scenario-analysis, etc.)

---

## 8. Non-Functional Considerations

- **Determinism:** Same inputs must produce byte-identical output (sorted keys, stable ordering)
- **Error reporting:** Validation failures must identify the specific file, sheet, row, and field
- **Performance:** Not critical (build time only, small dataset). No secrets or network access required.

---

## 9. Assumptions & Open Questions

### Assumptions
- The ~27 actor role names from Excel Format A headers are the canonical role list. `KNOWN_ROLES` in `src/data-model/enums.ts` is a preliminary subset and will be extended by this feature.
- State/transition JSON is hand-maintained. If the PDF diagrams change, a developer manually updates the JSON files.
- Conditional "State after" values in the matrix (e.g. "X OR Y") use `isConditional: true` and `conditions: string[]`.

### Open Questions
- **OQ1:** Should Format B role matching be strict (fail on unrecognised text) or permissive (warn and skip)? **Recommendation:** Permissive with warnings, since the source data is informal.
- **OQ2:** The empty "Counter Claim - Main Claim Closed" sheet — is this expected to be populated later, or is it permanently empty? **Recommendation:** Treat as known gap; output empty array; document in model-health.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions. It directly implements build-time data population.

**One extension:** `BreathingSpaceEntry` type is new — must be added to `src/data-model/schemas.ts` or raised as a data-model amendment.

---

## 11. Handover to Tester (Nigel)

This is a **technical feature** — no user stories. Skips Cass; goes directly to Nigel.

**What Nigel should test:** See `handoff-alex.md` in this directory.

---

## 12. Change Log (Feature-Level)

| Date | Change | Reason | Raised By |
|------|--------|--------|-----------|
| 2026-03-24 | Initial feature specification created | Build-time data pipeline — second in dependency chain after data-model | Alex |
