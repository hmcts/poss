# Feature Specification — data-model

## 1. Feature Intent

**Why this feature exists.**

The entire application depends on a shared, type-safe representation of the HMCTS possession process domain. Without a canonical set of TypeScript interfaces and types, downstream features (data-ingestion, state-explorer, event-matrix, case-walk, scenario-analysis) would each invent their own representations, leading to inconsistency, duplication, and integration failures.

This feature establishes the **foundational data contracts** that all other features consume. It defines the shape of the domain — not the data itself, but the types, interfaces, enumerations, and validation schemas that govern how data is structured, referenced, and validated throughout the system.

**Alignment:** Directly implements the core domain concepts defined in System Spec section 5 (see `.blueprint/system_specification/SYSTEM_SPEC.md`). Also provides the Zustand store skeleton referenced in the tech stack (System Spec section 9, business context spec.md tech stack section).

---

## 2. Scope

### In Scope

- **TypeScript interfaces/types** for all five core domain concepts:
  - `ClaimType` — id, name, description
  - `State` — id, technicalName, uiLabel, claimType (reference), isDraftLike, isLive, isEndState, completeness (number 0-100)
  - `Transition` — from (State ref), to (State ref), condition (string), isSystemTriggered, isTimeBased
  - `Event` — id, name, claimType (reference), state (reference), isSystemEvent, notes, hasOpenQuestions, actors (Map/Record of Role to boolean)
  - `Role` — string literal union type or enum extracted from the ~30 Excel column headers
- **ClaimTypeId enum or string literal union** for the 7 claim types
- **JSON Schema** (e.g. using Zod or JSON Schema draft) for validating hand-coded JSON data files against the TypeScript types
- **Zustand store skeleton** — store shape definition with typed slices for: loaded model data (claim types, states, transitions, events), active claim type selection, and UI state placeholders for downstream features
- **Type utility helpers** — e.g. `getEventsForState()`, `getTransitionsFrom()`, `getRolesForEvent()` type signatures (implementation stubs returning empty/placeholder data)
- **Export barrel files** for clean imports

### Out of Scope

- Actual data population (that is `data-ingestion`)
- Excel parsing or PDF transcription
- UI components, layouts, or rendering
- Zustand store actions/logic beyond skeleton shape
- Completeness calculation logic (belongs to `data-ingestion`; this feature defines only the `completeness` field type)
- Runtime data fetching — all data is static JSON at build time per system spec

---

## 3. Actors Involved

### Developer (internal, build-time)
- **Can do:** Import types and interfaces; use JSON schema to validate hand-coded data files; extend the Zustand store skeleton with feature-specific slices
- **Cannot do:** Modify type definitions without considering downstream impact across all consuming features

### The Model (data actor, as defined in System Spec section 4)
- **Role in this feature:** The data model feature defines the *shape* that The Model's data must conform to. The Model is the eventual consumer of these types once populated by `data-ingestion`.

---

## 4. Behaviour Overview

This is an infrastructure/type-definition feature. There is no runtime user-facing behaviour.

**What it produces:**
- A set of `.ts` files defining interfaces, types, enums, and Zod schemas (or equivalent)
- A Zustand store definition file with typed initial state
- Type utility function signatures

**Validation behaviour (build-time):**
- JSON schema / Zod schemas can be used by the `data-ingestion` feature to validate that produced JSON conforms to the defined types
- TypeScript compiler enforces type safety across all consuming features

**Key design decisions:**
- References between types (e.g. Event.state referencing a State) should use string IDs rather than direct object references, to support JSON serialisation. The ID format should be `claimType:technicalName` for states, allowing unique identification across claim types.
- The `actors` field on Event should be `Record<Role, boolean>` rather than `Map` for JSON serialisability.
- `completeness` is a number (0-100), not a calculated getter — it is pre-computed by `data-ingestion` and stored in the data.

---

## 5. State & Lifecycle Interactions

This feature is **state-defining** — it defines the types that represent the system's state model, but does not itself create, transition, or constrain runtime state.

- Defines the `State` interface including lifecycle flags: `isDraftLike`, `isLive`, `isEndState`
- Defines the `Transition` interface including `isSystemTriggered` and `isTimeBased` flags
- Defines the Zustand store shape which will hold the active claim type selection and loaded model data
- Does not itself populate or transition any state

**Lifecycle phases represented** (from System Spec section 6):
- Draft phase: states where `isDraftLike === true`
- Live phase: states where `isLive === true`
- End phase: states where `isEndState === true`
- Cross-cutting interruptions (BREATHING_SPACE, CASE_STAYED): represented as regular State objects; their special return-state logic is a concern for `case-walk` and `scenario-analysis`, not this feature

---

## 6. Rules & Decision Logic

### R1: Type completeness rule
- **Description:** Every field defined in System Spec section 5 for each domain concept must have a corresponding typed field in the TypeScript interface
- **Inputs:** System Spec section 5 definitions
- **Outputs:** TypeScript interfaces
- **Deterministic:** Yes

### R2: ClaimType enumeration
- **Description:** Exactly 7 claim types must be defined, matching those listed in System Spec section 5
- **Inputs:** System Spec section 5 (seven types listed)
- **Outputs:** ClaimTypeId enum/union with 7 members
- **Deterministic:** Yes

### R3: Role enumeration
- **Description:** ~30 roles extracted from Excel column headers must be represented as a string literal union or enum
- **Inputs:** Excel column headers (exact list to be confirmed during `data-ingestion`)
- **Outputs:** `Role` type
- **Deterministic:** Partially — the exact list depends on Excel column extraction. See Open Questions.

### R4: JSON schema validation
- **Description:** Hand-coded JSON data files must be validatable against the defined schemas
- **Inputs:** JSON data files (produced by `data-ingestion`)
- **Outputs:** Pass/fail with error messages identifying non-conforming fields
- **Deterministic:** Yes

### R5: ID uniqueness
- **Description:** State IDs must be unique within a claim type. Event IDs must be globally unique. ClaimType IDs must be globally unique.
- **Inputs:** Type definitions (enforced by convention and validated by schema)
- **Outputs:** Validation errors on duplicate IDs
- **Deterministic:** Yes

---

## 7. Dependencies

### Upstream
- **System Specification** (`.blueprint/system_specification/SYSTEM_SPEC.md`) — defines the domain concepts this feature implements as types
- **Business Context** (`.business_context/spec.md`) — authoritative source for the data model shape
- **Excel Event Model** (`.business_context/Event Model Possession Service V0.1.xlsx`) — needed to confirm the exact ~30 role names. INFERRED: The Role type may initially be defined with placeholder names and finalised when `data-ingestion` extracts the actual column headers.

### Downstream (consumers)
- `data-ingestion` — produces data conforming to these types
- `app-shell` — consumes Zustand store skeleton
- `state-explorer`, `event-matrix`, `case-walk`, `scenario-analysis`, `model-health`, `uncertainty-display` — all consume these types

### Technical
- TypeScript (language)
- Zod (or equivalent) for runtime schema validation
- Zustand for store definition

---

## 8. Non-Functional Considerations

- **Type safety:** All interfaces must be strict — no `any` types, no implicit optionals. Fields that may be absent in the source data should be explicitly typed as `T | null` with documentation explaining when null is expected.
- **JSON serialisability:** All types must be JSON-serialisable (no `Map`, `Set`, `Date`, or class instances). Use `Record<K, V>` instead of `Map`, ISO strings instead of `Date`.
- **Extensibility:** The type definitions must accommodate additions (new claim types, new states, new roles) without structural changes — this is an explicit system requirement (System Spec section 2).
- **Bundle size:** Types are erased at compile time; Zod schemas have a small runtime cost but are acceptable given the small dataset.

---

## 9. Assumptions & Open Questions

### Assumptions
- ASSUMPTION: Zod is the preferred schema validation library (aligns with TypeScript-first approach and Next.js ecosystem). Alternative: JSON Schema with ajv. Decision deferred to implementation.
- ASSUMPTION: State IDs follow the format `claimTypeId:TECHNICAL_NAME` to ensure cross-claim-type uniqueness. This is an interpretation — the system spec does not prescribe an ID format.
- ASSUMPTION: The Role type can initially be defined as a broad string union with known roles (e.g. "Judge", "Caseworker", "Bailiff", "Claimant", "Defendant") and extended once `data-ingestion` extracts the full ~30 from Excel.

### Open Questions
- **OQ1:** What is the exact list of ~30 roles? The system spec says "approximately 30 roles defined as columns in the Excel event model" but does not enumerate them. The `data-ingestion` feature will need to extract these. Should the Role type be a loose `string` until then, or should we define a preliminary enum from known roles? **Recommendation:** Define as `string` initially with a `KNOWN_ROLES` constant array for the roles we can identify, then tighten to a union type once data-ingestion confirms the full list.
- **OQ2:** Should the `completeness` field on State be optional (allowing states with no completeness data yet) or required with a default of 0? **Recommendation:** Required, default 0 — uncertainty should be explicit per system spec principles.
- **OQ3:** The `condition` field on Transition — can it be null/empty for unconditional transitions, or should unconditional transitions omit the field? **Recommendation:** `condition: string | null` where null means unconditional.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions. It is a direct implementation of System Spec section 5 (Core Domain Concepts) as TypeScript types.

**No contradictions identified.**

**Minor interpretive extensions:**
- ID format convention (`claimTypeId:TECHNICAL_NAME`) is not specified in the system spec but is a reasonable implementation detail. If this convention proves problematic, it can be revised without system spec changes.
- `Record<Role, boolean>` instead of `Map<Role, boolean>` is a serialisation pragmatism that does not alter the domain semantics.
- Zustand store skeleton shape is not detailed in the system spec beyond "Zustand" being the state management choice. The store shape defined here becomes a de facto system-level decision — downstream features must work within it.

**Proposed system spec annotation (not a change):** None required. The system spec is sufficient for this feature.

---

## 11. Handover to Tester (Nigel)

This is a **technical/infrastructure feature** with no user-facing behaviour. There are no user stories to write, so this skips Cass (BA) and goes directly to Nigel for test specification.

**What Nigel should test:**
- **Type completeness:** Every field from System Spec section 5 has a corresponding typed field
- **Schema validation:** Zod/JSON schemas correctly accept valid data and reject malformed data (missing required fields, wrong types, invalid enum values)
- **Seven claim types:** ClaimType enum/union contains exactly 7 members matching the system spec
- **Zustand store:** Store initialises with correct shape and typed defaults
- **JSON serialisability:** All types round-trip through `JSON.parse(JSON.stringify(x))` without data loss
- **Edge cases for validation:** Empty strings, negative completeness values, completeness > 100, unknown role names, duplicate IDs

---

## 12. Change Log (Feature-Level)

| Date | Change | Reason | Raised By |
|------|--------|--------|-----------|
| 2026-03-24 | Initial feature specification created | P0 foundation feature — first in dependency chain | Alex |
