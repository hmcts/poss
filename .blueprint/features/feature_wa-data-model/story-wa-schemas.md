# Story — WA Zod Schemas and Type Exports

## User story

As a downstream feature developer, I want Zod schemas for WA tasks and task-to-event mappings so that all WA data is validated at parse time and produces correctly typed objects.

---

## Context / scope

- Module: `src/data-model/` (new file `wa-schemas.ts`)
- Follows the existing pattern in `src/data-model/schemas.ts` (Zod schema + `z.infer` type export)
- Two schemas defined:
  - `WaTaskSchema`: `id` (string), `triggerDescription` (string), `taskName` (string), `taskContext` (WaTaskContext enum), `alignment` (WaAlignmentStatus enum)
  - `WaTaskMappingSchema`: `waTaskId` (string), `eventIds` (array of strings), `alignmentNotes` (string, required but may be empty)
- Referential integrity between `eventIds` and `Event.id` is NOT enforced at schema level (wa-ingestion responsibility)
- Gap tasks have an empty `eventIds` array; the schema does not enforce non-empty
- `alignmentNotes` is required (not optional) but may be an empty string for fully aligned tasks
- Consumes enums from `wa-enums.ts` (see story-wa-enums.md)
- Full feature spec: `.blueprint/features/feature_wa-data-model/FEATURE_SPEC.md`

---

## Acceptance criteria

**AC-1 -- WaTaskSchema accepts a valid task object**
- Given a task object with all required fields (`id`, `triggerDescription`, `taskName`, `taskContext` set to a valid WaTaskContext value, `alignment` set to a valid WaAlignmentStatus value),
- When `WaTaskSchema.parse()` is called,
- Then it returns a typed `WaTask` object with all fields intact and no error is thrown.

**AC-2 -- WaTaskSchema rejects missing required fields**
- Given a task object missing one or more required fields (e.g. no `taskName`, no `alignment`),
- When `WaTaskSchema.parse()` is called,
- Then a Zod parse error is thrown identifying the missing field(s).

**AC-3 -- WaTaskSchema rejects invalid enum values**
- Given a task object where `taskContext` is set to a value not in `WaTaskContext` (e.g. `"unknown"`), or `alignment` is set to a value not in `WaAlignmentStatus` (e.g. `"full"`),
- When `WaTaskSchema.parse()` is called,
- Then a Zod parse error is thrown identifying the invalid enum value.

**AC-4 -- WaTaskMappingSchema accepts a valid mapping with event IDs**
- Given a mapping object with `waTaskId` (string), `eventIds` (non-empty array of strings), and `alignmentNotes` (string),
- When `WaTaskMappingSchema.parse()` is called,
- Then it returns a typed `WaTaskMapping` object with all fields intact and no error is thrown.

**AC-5 -- WaTaskMappingSchema accepts a mapping with an empty eventIds array**
- Given a mapping object with `waTaskId` (string), `eventIds` set to an empty array `[]`, and `alignmentNotes` (string describing the gap),
- When `WaTaskMappingSchema.parse()` is called,
- Then it returns a typed `WaTaskMapping` object without error (empty `eventIds` is valid for gap tasks).

**AC-6 -- WaTaskMappingSchema accepts an empty alignmentNotes string**
- Given a mapping object with `alignmentNotes` set to `""` (empty string),
- When `WaTaskMappingSchema.parse()` is called,
- Then it returns a typed `WaTaskMapping` object without error (empty notes are valid for fully aligned tasks).

**AC-7 -- TypeScript types are inferred and exported**
- Given the schemas are defined,
- When I import `WaTask` and `WaTaskMapping` types from `wa-schemas.ts`,
- Then TypeScript enforces the correct field types (e.g. `WaTask.alignment` is `WaAlignmentStatusValue`, `WaTaskMapping.eventIds` is `string[]`).

---

## Out of scope

- Referential integrity validation between `eventIds` and `Event.id` (wa-ingestion concern)
- Enforcing non-empty `alignmentNotes` for partial/gap tasks (wa-ingestion concern)
- Enforcing non-empty `eventIds` for aligned/partial tasks (wa-ingestion concern)
- Populating schemas with real R1A data (wa-ingestion concern)
- Store operations (covered in story-wa-store.md)
