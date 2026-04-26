# Test Specification — ref-data-schema

## Understanding

This feature defines Zod schemas and inferred TypeScript types for the reference data blob used by the Reference Data Editor layer. It introduces eight new schemas (`RefStateSchema`, `RefEventSchema`, `PersonaSchema`, `StateEventAssocSchema`, `EventTaskAssocSchema`, `PersonaStateAssocSchema`, `PersonaEventAssocSchema`, `PersonaTaskAssocSchema`) plus re-exports `WaTaskSchema` from `src/data-model/`. The top-level `ReferenceDataBlobSchema` wraps nine named arrays. `PersonaSchema` is new — it does not exist elsewhere in the codebase. All association fields are required with no optionals; `alignmentNotes` in `EventTaskAssocSchema` is required but may be an empty string. This is a pure schema feature — no runtime logic, no React.

## Schema to Test ID Mapping

| Schema | Test IDs | Focus |
|---|---|---|
| `RefStateSchema` | RS-1, RS-2 | Valid parse, missing required fields rejected |
| `RefEventSchema` | RE-1, RE-2 | Valid parse, missing required fields rejected |
| `PersonaSchema` | PE-1, PE-2, PE-3 | Valid parse, roles must be array, isCrossCutting must be boolean |
| `WaTaskSchema` (re-export) | WT-1, WT-2 | Re-exported correctly, invalid enum value rejected |
| `StateEventAssocSchema` | SA-1, SA-2 | Valid parse, missing stateId/eventId rejected |
| `EventTaskAssocSchema` | ET-1, ET-2, ET-3 | Valid parse, empty alignmentNotes accepted, missing field rejected |
| `PersonaStateAssocSchema` | PS-1, PS-2 | Valid parse, missing fields rejected |
| `PersonaEventAssocSchema` | PEV-1, PEV-2 | Valid parse, missing fields rejected |
| `PersonaTaskAssocSchema` | PT-1, PT-2 | Valid parse, missing fields rejected |
| `ReferenceDataBlobSchema` | RDB-1, RDB-2, RDB-3 | Full valid blob, empty arrays accepted, missing array rejected |
| Bridge files / exports | BF-1, BF-2, BF-3 | index.js exports all schemas, schema.js bridge present, types exist |

## Key Assumptions

- `src/ref-data/` module does not exist yet; all import tests will fail until Codey implements it — this is intentional (contract-first tests)
- All symbols are exported from `src/ref-data/index.js` (bridge file pattern)
- `WaTaskSchema` is re-exported from `src/data-model/` — not redefined in `src/ref-data/`
- `ReferenceDataBlobSchema` accepts empty arrays for all nine keys (no minimum length constraint)
- `alignmentNotes` in `EventTaskAssocSchema` accepts empty string (`""`) but not `undefined` or `null`
- `PersonaSchema.roles` is `z.array(z.string())` — an empty array is valid
- All association schemas have exactly two required string fields (plus `alignmentNotes` for EventTaskAssoc)
- `RefStateSchema` and `RefEventSchema` each have exactly three fields: `id`, `name`, `description`
