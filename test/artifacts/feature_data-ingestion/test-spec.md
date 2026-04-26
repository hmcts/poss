# Test Spec: data-ingestion

## Scope
Pure-function unit tests for the build-time data ingestion pipeline.
All tests use synthetic data -- no real Excel files.

## Test Groups

### 1. Format A Parser (parseFormatASheet)
- Converts rows with Y/N actor columns into Event[] with actors Record<string,boolean>
- Blank cells treated as N (false)
- Event IDs generated as `{claimTypeId}:{index}` (0-based)
- Output conforms to EventSchema

### 2. Format B Parser (parseFormatBSheet)
- Converts rows with free-text "Who/Permissions" into Event[] with parsed actors
- Multiple roles in one cell (comma/semicolon separated) each become a key
- Unrecognised role text does NOT throw (permissive)
- Known roles matched case-insensitively

### 3. Open Question Detector (detectOpenQuestions)
- Returns true for notes containing: ?, TBC, TBD, placeholder, question, Alex to check
- Case-insensitive matching
- Returns false for empty string and clean notes

### 4. Completeness Calculator (computeCompleteness)
- (events without open questions / total) * 100, rounded to integer
- Empty array returns 0
- All-clean events return 100
- Mixed returns correct percentage

### 5. Breathing Space / Stayed Parser
- parseBreathingSpaceMatrix and parseStayedMatrix produce arrays
- Conditional "State after" values produce isConditional: true
- Output validates against BreathingSpaceEntrySchema

### 6. State/Transition Loader (loadStatesAndTransitions)
- Returns { states, transitions } that conform to schemas
- Each state has required fields (id, technicalName, completeness, etc.)

### 7. Schema Conformance
- Format A output validates against EventSchema
- Completeness value is integer 0-100

## Edge Cases
- Empty sheet (0 data rows) yields empty Event[]
- Notes with no markers yield hasOpenQuestions = false
- Format B cell with unknown role logs warning, does not throw

## Assumptions
- Event index is 0-based
- BreathingSpaceEntry has fields: stateFrom, stateTo, isConditional, conditions
- Role matching in Format B is case-insensitive substring against KNOWN_ROLES
