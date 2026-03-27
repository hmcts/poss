# Test Spec -- wa-ingestion

## Understanding

This feature produces two static JSON files (`data/wa-tasks.json`, `data/wa-mappings.json`) containing all 17 R1A work allocation tasks and their event model mappings, plus a validation script (`src/wa-ingestion/index.js`). Tests verify:
- Correct record counts and structure against Zod schemas
- Alignment tier distribution (7 aligned, 9 partial, 1 gap)
- Task context groupings match the spec
- Referential integrity between mappings and tasks
- Citizen-only footnote metadata on tasks 9-12
- Validation function behaviour for valid and invalid data

## AC to Test ID Mapping

| Story | AC | Test ID | What it checks |
|-------|-----|---------|----------------|
| wa-task-data | AC-1 | TD-1 | 17 tasks present, unique IDs wa-task-01..17 |
| wa-task-data | AC-2 | TD-2 | Each task validates against WaTaskSchema |
| wa-task-data | AC-3 | TD-3 | Alignment tier counts: 7/9/1 |
| wa-task-data | AC-4 | TD-4 | Task context groupings match spec |
| wa-task-data | AC-5 | TD-5 | taskName and triggerDescription non-empty |
| wa-task-data | AC-6 | TD-6 | JSON parseable (implicit in require()) |
| wa-mapping-data | AC-1 | MD-1 | 17 mappings, each waTaskId valid and unique |
| wa-mapping-data | AC-2 | MD-2 | Aligned tasks have non-empty eventIds |
| wa-mapping-data | AC-3 | MD-3 | Partial tasks have eventIds and explanatory notes |
| wa-mapping-data | AC-4 | MD-4 | Gap task (17) has empty eventIds with note |
| wa-mapping-data | AC-5 | MD-5 | Citizen-only footnote on tasks 9-12 |
| wa-mapping-data | AC-6 | MD-6 | JSON parseable (implicit in require()) |
| wa-validation | AC-1 | VD-1 | validateWaData succeeds for valid tasks |
| wa-validation | AC-2 | VD-2 | validateWaData succeeds for valid mappings |
| wa-validation | AC-3 | VD-3 | Validation returns errors for invalid records |
| wa-validation | AC-4 | VD-4 | Validation checks record counts |
| wa-validation | AC-5 | VD-5 | Validation checks waTaskId referential integrity |
| wa-validation | AC-6 | VD-6 | Return value distinguishes success/failure |

## Key Assumptions

- Task IDs follow `wa-task-NN` pattern (zero-padded two digits: 01-17)
- `eventIds` contain event names (strings like "Case Issued"), not generated IDs
- `validateWaData` is a named export from `src/wa-ingestion/index.js` returning `{ success, errors }`
- Citizen-only footnote text is detectable by substring match (e.g. "citizen")
- The validation function accepts tasks and mappings arrays as arguments
