# Feature Backlog

## Definitions

| Priority | Meaning |
|----------|---------|
| P0 | Critical -- foundation, blocks everything |
| P1 | High -- core modes, do soon |
| P2 | Medium -- cross-cutting enhancements |
| P3 | Low -- future refinement |

| Effort | Meaning |
|--------|---------|
| S | Small -- < 1 hour |
| M | Medium -- 1-3 hours |
| L | Large -- 3-8 hours |
| XL | Extra Large -- 1+ days |

| Status | Meaning |
|--------|---------|
| Ready | Ready to implement |
| WIP | In progress |
| Clarify | Needs clarification |

---

## Backlog

| Status | P | E | Slug | Description |
|--------|---|---|------|-------------|
| Ready | P0 | L | data-model | Core TypeScript types and JSON schema for ClaimType, State, Transition, Event, Role |
| Ready | P0 | L | data-ingestion | Parse Excel event model and hand-coded state/transition JSON into unified data layer |
| Ready | P0 | L | app-shell | Next.js 15 app shell with layout, navigation, dark mode, Tailwind + shadcn/ui setup |
| Ready | P1 | XL | state-explorer | Interactive React Flow state diagram per claim type with node/edge rendering and inspection |
| Ready | P1 | L | event-matrix | Filterable, searchable event table with actor icon grid and CSV export |
| Ready | P1 | XL | case-walk | Step-through case simulation: select claim type, walk events, history trail, dead-end detection |
| Ready | P2 | XL | scenario-analysis | Toggle events/roles/states on/off, see micro/meso/macro impact with visual output |
| Ready | P2 | M | model-health | Model health panel: open questions count, low-completeness states, unreachable end states |
| Ready | P2 | M | uncertainty-display | Visual uncertainty indicators (hasOpenQuestions, completeness badges) across all modes |

---

## Details

### data-model

Define the canonical TypeScript interfaces and types that all features consume:
- `ClaimType` with id, name, description
- `State` with technicalName, uiLabel, isDraftLike, isLive, isEndState, completeness, claimType reference
- `Transition` with from/to State references, condition, isSystemTriggered, isTimeBased
- `Event` with name, state, isSystemEvent, notes, hasOpenQuestions, actors map (~30 roles)
- `Role` type extracted from Excel column headers
- JSON schema for validation of hand-coded data files
- Zustand store skeleton for shared state

Source: `.business_context/spec.md` core data model section.

### data-ingestion

Build the data pipeline that produces the static JSON consumed at runtime:
- Parse `Event Model Possession Service V0.1.xlsx` into Event records per claim type
- Hand-code state/transition JSON for each of the 7 claim types from PDF diagrams (see `.business_context/pdf_images/`)
- Parse or hand-code the breathing space/stayed matrix from `Breathing space and stayed matrix.xlsx`
- Auto-detect hasOpenQuestions from notes containing "?", "TBC", placeholder patterns
- Compute completeness percentages per state
- Output: typed JSON files importable at build time

ASSUMPTION: Excel parsing happens at build time via a script (e.g. using xlsx library), not at runtime.

### app-shell

Set up the foundational application structure:
- Next.js 15 with App Router, TypeScript
- Tailwind CSS + shadcn/ui component library
- Three-mode navigation: State Explorer, Event Matrix, Digital Twin
- Claim type selector (sidebar or top nav) shared across modes
- Dark mode toggle (Linear/Raycast aesthetic: sharp typography, high information density)
- Monospace for technical state names, sans-serif for UI labels
- Port 3000 for development
- Zustand store provider

### state-explorer

Interactive flowchart visualisation per claim type using React Flow:
- Nodes represent states with colour coding: draft/amber, live/green, end/dark, uncertain/muted-striped
- Edges represent transitions with condition labels and type coding: system/dashed, time-based/dotted, user/solid
- Completeness badge on each state node
- Click state node to open detail drawer: UI label, technical name, events list, actor permissions
- Claim type switcher to navigate between diagrams
- Layout should mirror the structure of the PDF source diagrams where practical

Depends on: data-model, data-ingestion, app-shell.

### event-matrix

Filterable table replacing the Excel spreadsheet:
- Filters: claim type, state, actor/role, system vs user events
- Search: event name or notes keyword
- Columns: State, Event, System?, Notes, actor columns (toggle-able)
- Actor columns rendered as icon grid (not raw Y/N text)
- Rows with hasOpenQuestions flagged with visual indicator (amber dot)
- CSV export of current filtered view

Depends on: data-model, data-ingestion, app-shell.

### case-walk

Step-through simulation of a single case journey:
- Select claim type; case starts at the initial state (AWAITING_SUBMISSION_TO_HMCTS or equivalent)
- Display available events for current state, optionally filtered by a selected actor/role
- User selects an event; case transitions to the next state per the transition model
- History trail shown as breadcrumb on the left
- Dead-end detection: if no available events and not in a valid end state, flag the case as stuck
- Handle cross-cutting states: when entering BREATHING_SPACE or CASE_STAYED, show return options per the matrix; if conditional, present both with "conditional" label

Depends on: data-model, data-ingestion, app-shell.
Clarify: How to handle conditional return states from BREATHING_SPACE/CASE_STAYED in simulation -- present both options as user choice is the current approach per spec.md gap table.

### scenario-analysis

Toggle model elements and assess impact at three levels:
- **Toggle types:** Remove event, remove role (all sole-performer events become unavailable), remove state (sever transitions)
- **Micro level:** Which specific events are affected/unavailable
- **Meso level:** Which paths through the process are blocked or degraded
- **Macro level:** Which states become unreachable, which claim types cannot reach a valid end state
- **Visual output:** Blocked transitions (red), unreachable states (greyed/strikethrough), degraded paths (amber), viable paths (green)
- Summary panel: "X states unreachable, Y events blocked, Z claim types affected"

Depends on: data-model, data-ingestion, app-shell, state-explorer (reuses graph rendering).

### model-health

A panel accessible from any mode showing aggregate model quality:
- Total open questions count across all claim types
- States with completeness below 50%
- Claim types with no valid path from initial state to a valid end state
- List of unreachable states (states with no incoming transitions except the initial state)

Depends on: data-model, data-ingestion.

### uncertainty-display

Visual indicators for incomplete/uncertain data, applied consistently across all three modes:
- hasOpenQuestions flag shown as amber dot/icon on events (Event Matrix rows, State Explorer drawer, Case Walk event list)
- Completeness percentage badge on state nodes (State Explorer) and state references (Event Matrix, Case Walk)
- Muted/striped styling for uncertain states in State Explorer
- Consistent colour language: amber = uncertain, green = complete, grey = unknown

Depends on: data-model, app-shell. Enhances: state-explorer, event-matrix, case-walk.

---

## Dependency Order

```
P0: data-model --> data-ingestion --> app-shell
P1: state-explorer, event-matrix, case-walk (parallel, all depend on P0)
P2: scenario-analysis (depends on P1 state-explorer), model-health, uncertainty-display
```

---

## Notes

- All features grounded in `.business_context/spec.md` v0.3
- State transition data must be hand-coded from PDF diagrams -- this is a manual effort within data-ingestion
- Items removed automatically when pipeline completes successfully
