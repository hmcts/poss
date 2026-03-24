# Test Specification — data-model

## Understanding

This feature defines the foundational TypeScript interfaces, Zod validation schemas, and Zustand store skeleton for the HMCTS possession process domain. It covers five core domain concepts (ClaimType, State, Transition, Event, Role) plus a ClaimTypeId enum with 7 members. All types must be JSON-serialisable. No runtime behaviour exists — tests validate type contracts, schema validation, and store shape. The Role type starts as `string` with a `KNOWN_ROLES` constant. Completeness is required (0-100, default 0). Condition on Transition is `string | null`.

## Rule/Invariant to Test ID Mapping

| Rule / Invariant | Test IDs | Focus |
|---|---|---|
| R2: ClaimType enum — exactly 7 members | CT-1, CT-2 | Enum completeness, correct identifiers |
| R1: State interface completeness (Spec s5) | ST-1, ST-2, ST-3, ST-4 | Required fields, completeness range, boolean flags, JSON round-trip |
| R1: Transition interface completeness | TR-1, TR-2, TR-3 | from/to refs, condition string/null, trigger flags |
| R1: Event interface completeness | EV-1, EV-2, EV-3 | actors record, hasOpenQuestions, notes field |
| R3: Role type / KNOWN_ROLES | RO-1, RO-2 | KNOWN_ROLES exists and is non-empty array |
| R4: Zod schema — accept valid data | ZV-1 to ZV-5 | Valid ClaimType, State, Transition, Event, Role pass |
| R4: Zod schema — reject malformed data | ZR-1 to ZR-8 | Missing fields, wrong types, out-of-range, unknown enum |
| Store skeleton shape | SS-1, SS-2 | Correct initial shape, empty collections |

## Key Assumptions

- Module exports from `../src/data-model/index.js` (barrel file)
- Zod is the chosen schema validation library (per spec recommendation)
- `ClaimTypeId` is an object/enum with 7 string members, not a plain array
- Zustand store created via `createStore` or `create`; tested by calling it and inspecting initial state
- `KNOWN_ROLES` is an exported constant array of strings (not exhaustive, but non-empty)
- `completeness` defaults to 0 and is required, not optional
- `condition` on Transition is `string | null` (null = unconditional)
- All schema objects are named exports (e.g. `StateSchema`, `EventSchema`, etc.)
