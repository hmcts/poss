# System Specification — HMCTS Possessions Process Tool

## 1. Purpose & Intent

**Problem:** HMCTS business analysts need to explore, interrogate, and stress-test the civil possession process model — a complex, incomplete, and evolving state machine spanning seven claim types. The source material exists only in disconnected spreadsheets, PDFs, and Visio files, making it difficult to reason about the model holistically, identify gaps, or assess the impact of changes.

**Who it exists for:** A small group of internal HMCTS business analysts working on the possession proceedings service design.

**Success looks like:**
- Analysts can visualise any claim type's state model interactively
- Analysts can search and filter events across all claim types without opening Excel
- Analysts can simulate a case journey and see where the model breaks or is incomplete
- Analysts can toggle model elements on/off and immediately see system-wide impact
- Uncertainty and incompleteness are visible, not hidden

**Must not be compromised:**
- Fidelity to the source data — the tool must reflect the model as-is, including its gaps
- Uncertainty as first-class content — incomplete data must never be silently smoothed over

---

## 2. Business & Domain Context

The system operates within HMCTS Civil Possession proceedings. The domain covers how possession claims move through court processes from creation to closure, including hearings, judicial decisions, enforcement, appeals, and ancillary applications.

Key domain drivers:
- Seven distinct claim types, each with its own state/transition model
- Two cross-cutting interruption states (BREATHING_SPACE, CASE_STAYED) that can suspend any live state
- The model is a working document — actively evolving, with open questions for judges and incomplete areas
- Source data comes from three formats: Excel (events/actors), PDF diagrams (states/transitions), and one Visio file (counter claim variant)

**Assumptions:**
- ASSUMPTION: The tool is read-only with respect to the process model — analysts explore but do not edit the model through this tool
- ASSUMPTION: The user group is small enough (fewer than ~20) that performance at scale is not a concern
- ASSUMPTION: Model data changes infrequently and can be updated via code/JSON changes and redeployment
- The model will continue to evolve; the tool must accommodate additions without architectural change

---

## 3. System Boundaries

### In Scope
- Interactive visualisation of state diagrams per claim type (State Explorer)
- Searchable, filterable event matrix replacing the Excel spreadsheet (Event Matrix)
- Step-through case simulation with dead-end detection (Case Walk)
- Scenario analysis — toggle events/roles/states and see micro/meso/macro impact (Scenario Analysis)
- Model health and uncertainty reporting across all modes
- CSV export of event data

### Out of Scope
- Case management or operational case tracking
- Public-facing or citizen-facing functionality
- Editing or authoring the process model through the UI
- Integration with live court systems or databases
- User authentication (internal tool, small group)
- Persistent storage — no database; all data is static JSON at build time

---

## 4. Actors & Roles

### Business Analyst (primary user)
- **Description:** HMCTS staff member designing or reviewing the possession process model
- **Goals:** Understand the current model, find gaps, test scenarios, assess change impact
- **Authority:** Can explore all modes, run simulations, toggle scenarios. Cannot modify source data.

### The Model (data actor)
- **Description:** The possession process model itself, represented as static JSON
- **Role:** Provides states, transitions, events, and actor/role data consumed by all three modes
- **Note:** ~30 roles are defined within the model data (e.g. Judge, Caseworker, Bailiff, Claimant, Defendant). These are domain roles within the model, not system users.

---

## 5. Core Domain Concepts

### ClaimType
- **Definition:** A category of possession proceeding with its own state machine
- **Key attributes:** id, name, description
- **Seven types:** Main Claim (England), Accelerated Claim (Wales), Counter Claim, Counter Claim (Main Claim Closed), Enforcement, Appeals, General Applications

### State
- **Definition:** A stage in a claim's lifecycle within a specific claim type
- **Key attributes:** id, technicalName, uiLabel, claimType, isDraftLike, isLive, isEndState, completeness (0-100%)
- **Colour coding:** Draft/amber, Live/green, End/dark, Uncertain/muted-striped
- **Universal end states:** CLOSED, DRAFT_DISCARDED

### Transition
- **Definition:** A directed connection between two states, representing how a case moves
- **Key attributes:** from (State), to (State), condition (string), isSystemTriggered, isTimeBased
- **Visual coding:** System-triggered/dashed, Time-based/dotted, User action/solid

### Event
- **Definition:** An action or occurrence available at a specific state for a specific claim type
- **Key attributes:** id, name, claimType, state, isSystemEvent, notes, hasOpenQuestions, actors (Map of ~30 roles to boolean)
- **Source:** Excel event model

### Actor/Role (domain)
- **Definition:** A role within the court process that can perform events (e.g. Judge, Caseworker, Bailiff)
- **Key attributes:** Approximately 30 roles defined as columns in the Excel event model
- **Usage:** Events map to which roles can perform them; used for role-toggle scenario analysis

---

## 6. High-Level Lifecycle & State Model

All seven claim types follow a broadly similar lifecycle with claim-specific variations:

**Phases:**
1. **Draft** — Case created, awaiting submission (isDraftLike states, amber). Timeout of 30 days applies.
2. **Submission & Payment** — Awaiting submission to HMCTS, pending payment settlement
3. **Live Processing** — Case issued, progressing through judicial referral, case progression, hearings, decisions (isLive states, green)
4. **Resolution** — Final orders issued, case closed (isEndState)

**Terminal states:** CLOSED (normal completion), DRAFT_DISCARDED (abandoned/timed-out drafts). ASSUMPTION: REQUESTED_FOR_DELETION is also terminal based on PDF diagrams.

**Cross-cutting interruptions** (can enter from any live state):
- **BREATHING_SPACE** — Entered when user enters breathing space; return state varies by claim type and originating state per the breathing space/stayed matrix
- **CASE_STAYED** — Entered when permission granted to stay case; return state varies similarly

**Common states observed across most claim types** (from PDF diagrams):
AWAITING_SUBMISSION_TO_HMCTS, PENDING_CASE_ISSUED, CASE_ISSUED, JUDICIAL_REFERRAL, CASE_PROGRESSION, HEARING_READINESS, PREPARE_FOR_HEARING_CONDUCT_HEARING, DECISION_OUTCOME, ALL_FINAL_ORDERS_ISSUED, CLOSED

**Known complexity:**
- Return states from BREATHING_SPACE / CASE_STAYED are sometimes conditional (e.g. depends on whether a hearing has taken place)
- Enforcement has additional states: AWAITING_BAILIFF_ALLOCATION, AWAITING_SCHEDULING, AWAITING_PROPERTY_VISIT, AWAITING_ENFORCEMENT_OUTCOME, WRIT_ISSUED
- Accelerated Claim has two placeholder technical names (see section 10)

---

## 7. Governing Rules & Invariants

1. A case must be in exactly one state at any time per claim type
2. Transitions are only valid along edges defined in the model — no arbitrary state jumps
3. End states (CLOSED, DRAFT_DISCARDED) have no outgoing transitions
4. BREATHING_SPACE and CASE_STAYED can be entered from any state marked as eligible (live states marked in the PDF diagrams)
5. When exiting BREATHING_SPACE or CASE_STAYED, the return state is determined by claim type and originating state per the matrix — where conditional, both options must be presented
6. Draft states timeout after 30 days to DRAFT_DISCARDED
7. Completeness is calculated per state as the percentage of events/transitions with resolved notes (no open questions)
8. Events flagged hasOpenQuestions when notes contain questions, "TBC", or placeholder text

---

## 8. Cross-Cutting Concerns

### Uncertainty Handling
Uncertainty is first-class content throughout the system. Every mode must surface:
- hasOpenQuestions flags on events
- Completeness indicators on states
- Model Health panel accessible from any mode (total open questions, states below 50% completeness, claim types with no valid path to end state)

### Multi-Claim-Type Consistency
The tool must support all seven claim types with a uniform data model while respecting per-type differences in states, transitions, and events. Switching between claim types must be seamless.

### Cross-Cutting State Interruptions
BREATHING_SPACE and CASE_STAYED affect all claim types. Their return logic must be consistently modelled and visually surfaced, including conditional return paths and unresolved questions.

### Accessibility
ASSUMPTION: As an internal tool for a small group, WCAG AA compliance is a goal but not a hard launch blocker. The UI is dark-only (slate/indigo theme with Inter font). Light mode was considered and removed as unnecessary for this user group.

---

## 9. Non-Functional Expectations (System-Level)

- **Performance:** Fast — small dataset (hundreds of states/events, not thousands), small user group. All data is static JSON loaded at build time. No server-side computation at runtime.
- **Reliability:** Standard web application reliability. No database means no data-layer failures. Static deployment.
- **Storage:** No database. JSON data parsed from Excel at build time. State transition data hand-coded from PDFs.
- **Scalability:** Not a concern — designed for a small internal team.
- **Security:** Internal tool. ASSUMPTION: No authentication required; network-level access control is sufficient.
- **Deployment:** Next.js 16 static/hybrid deployment. Port 3000 for development.

---

## 10. Known Gaps, Risks & Open Questions

| # | Gap | Impact | Mitigation |
|---|-----|--------|------------|
| 1 | Conditional return states from BREATHING_SPACE / CASE_STAYED (e.g. "CASE_PROGRESSION or DECISION_OUTCOME depending on whether a hearing took place") | Case Walk simulation cannot auto-resolve the return state | Present both options with "conditional" label; do not auto-resolve |
| 2 | Breathing space matrix entries marked "Question for Judges" or "Alex to check" | Incomplete model data | Surface with hasOpenQuestions flag inline |
| 3 | Counter Claim (Main Claim Closed) sourced from Visio (.vsdx), not PDF | Transitions inferred, not confirmed; extraction uncertainty | Flag completeness as lower; mark inferred transitions explicitly |
| 4 | Accelerated Claim placeholder technical names (AWAITING_DEFENDANT_RESPONSE, CLAIMANT_INTENT_PENDING) | Names may change when formally agreed | Use placeholders; flag in UI as provisional |
| 5 | ~30 actor/role columns in Excel — exact role list not formally defined | Role toggle scenario analysis depends on complete role data | Extract roles from Excel columns at build time; flag any ambiguous roles |
| 6 | No machine-readable source for state transitions — hand-coded from PDF | Risk of transcription error | Cross-reference with event model; flag inconsistencies in Model Health |

---

## 11. Architecture



### Architecture Layers

The system is built in three layers:

1. **Logic Layer** (`src/`) — 9 pure TypeScript modules with 194 tests. Domain logic: schemas, parsing, graph building, simulation, scenario analysis, health metrics, uncertainty display.
2. **UI Helper Layer** (`src/ui-*/`) — 8 pure TypeScript modules with 145 tests. View-model functions that compose logic modules into UI-ready data structures. No DOM or React dependencies.
3. **React Component Layer** (`app/`) — Next.js 16 App Router pages and components. Consumes UI helper modules. Tailwind CSS 3, React Flow for graph visualisation. Dark-only slate/indigo theme with Inter font.

All three layers are TypeScript. Layers 1 and 2 are tested with `node:test` (339 tests total). Layer 3 uses sample data for prototyping; real data integration via the ingestion pipeline is pending.

---

## 12. Change Log (System-Level)

| Date | Change | Reason | Approved By |
|------|--------|--------|-------------|
| 2026-03-24 | Initial system specification created from spec.md v0.3 | Project inception | Alex (System Spec Agent) |
| 2026-03-24 | Updated tech stack (Next.js 16, Tailwind 3, dark-only), added architecture layers section | React component layer built | Manual update |
