# Possessions Process Tool — Specification v0.1

## What this tool is

An internal web application for a small group of business analysts to explore, interrogate, and stress-test the HMCTS Civil Possession process model. It is not a case management tool — it is a thinking and design tool.

The tool has three integrated modes:

1. **State Explorer** — interactive visualisation of state diagrams per claim type
2. **Event Matrix** — searchable, filterable view of the event model (replacing the Excel)
3. **Digital Twin** — simulation of a single case, with scenario toggling to test viability

---

## Data sources

| Source | What it provides |
|---|---|
| `Event Model Possession Service V0.1.xlsx` | States, events per state, actor permissions, notes |
| `State model and dependencies v0.10.pdf` | State transitions with conditions, valid end states |
| `Breathing space and stayed matrix.xlsx` | What state a case returns to after leaving BREATHING_SPACE or CASE_STAYED |

State transition data will be **hand-coded into JSON** from the PDF diagrams — there is no more authoritative machine-readable source.

**Seven claim types:**
- Main Claim (England) — PDF diagram
- Accelerated Claim (Wales) — PDF diagram
- Counter Claim — PDF diagram
- Counter Claim (Main Claim Closed) — Visio file (`States & Event (Counter Claim).vsdx`)
- Enforcement — PDF diagram
- Appeals — PDF diagram
- General Applications (March 2026, latest) — PDF diagram

**Shared cross-cutting states** (can interrupt any live state in any claim type):

| State | Technical name | Returns to after exit |
|---|---|---|
| Breathing space | `BREATHING_SPACE` | Varies by claim type and state — see matrix |
| Case stayed | `CASE_STAYED` | Varies by claim type and state — see matrix |

The breathing space / stayed matrix defines, per claim type, which state a case enters when the interruption ends. Some return-to states are conditional (e.g. "CASE_PROGRESSION or DECISION_OUTCOME depending on whether a hearing has taken place"). Several entries in the matrix carry open questions for judges.

**Universal end state**: `CLOSED` (and `DRAFT_DISCARDED` for abandoned/timed-out drafts). Valid end states are inferred from the model (states with no outgoing transitions).

---

## Core data model

```
ClaimType
  id, name, description

State
  id, technicalName, uiLabel, claimType
  isDraftLike: boolean        // yellow in diagrams
  isLive: boolean             // green in diagrams
  isEndState: boolean         // inferred
  completeness: 0–100%        // % of events/transitions with resolved notes

Transition
  from: State, to: State
  condition: string           // e.g. "Payment settled", "Timeout 30 days"
  isSystemTriggered: boolean
  isTimeBased: boolean

Event
  id, name, claimType, state
  isSystemEvent: boolean
  notes: string
  hasOpenQuestions: boolean   // flagged when notes contain questions or placeholders
  actors: Map<Role, boolean>  // ~30 roles from the Excel columns
```

---

## Mode 1: State Explorer

An interactive flowchart for each claim type, closely mirroring the PDF diagrams but interactive.

**Features:**
- Select claim type from a sidebar or top nav
- Nodes = states, edges = transitions with condition labels
- Click a state → drawer opens showing: UI label, technical name, available events, actor permissions
- States colour-coded: draft (amber), live (green), end (dark/closed), uncertain (muted/striped)
- Transitions colour-coded by type: system-triggered (dashed), time-based (dotted), user action (solid)
- Completeness badge on each state node

**Library**: React Flow (best-fit for node/edge diagrams in React with interaction support)

---

## Mode 2: Event Matrix

A clean, filterable table replacing the Excel spreadsheet.

**Features:**
- Filter by: claim type, state, actor/role, system vs user events
- Search by event name or notes keyword
- Columns: State | Event | System? | Notes | [Actor columns toggle-able]
- Actor columns shown as icon-grid (Y/N) rather than raw Y/N text
- Rows with open questions flagged with a visual indicator (e.g. amber dot)
- Export to CSV

---

## Mode 3: Digital Twin

Two sub-modes, both operating on a selected claim type.

### 3a. Case Walk (step-through simulation)

The user walks a single case through the process manually:

1. Select claim type → case starts at the initial state
2. Available events shown for the current state (filtered by a selected actor/role if desired)
3. User selects an event → case moves to the next state per the transition model
4. History trail shown on the left (breadcrumb of states visited)
5. Dead ends highlighted: if no available events and not in a valid end state, the case is flagged as stuck

### 3b. Scenario Analysis (impact assessment)

The user toggles elements of the model on/off and sees impact at three levels simultaneously:

| Level | Scope | What is shown |
|---|---|---|
| **Micro** | Event | Which specific events are affected / unavailable |
| **Meso** | Journey | Which paths through the process are blocked or degraded |
| **Macro** | System | Which states become unreachable; which claim types are impacted |

**Toggle types:**
- **Event toggle**: Remove a specific event from the model
- **Role toggle**: Remove a role/actor (e.g. "what if Bailiffs are removed") → all events that actor is sole performer of become unavailable
- **State toggle**: Mark a state as removed → transitions through it are severed

**Visual output:**
- Blocked transitions: red
- Unreachable states: greyed out with strikethrough label
- Degraded paths (reachable but only via system events, no user agency): amber
- Viable paths to end state: green
- Summary panel: "X states unreachable, Y events blocked, Z claim types cannot reach a valid end state"

---

## Handling incomplete/uncertain data

The model is a working document. Uncertainty is treated as first-class content, not hidden.

- Events where the notes column contains a question, "TBC", or placeholder text are flagged `hasOpenQuestions: true`
- States with a significant proportion of uncertain events show a completeness indicator
- A **Model Health** panel (accessible from any mode) shows: total open questions, states with <50% completeness, claim types with no valid path to end state
- This helps analysts identify where the model needs more work before committing to system design

---

## Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SPA-like with API routes for data parsing |
| Language | TypeScript | Type safety for the complex data model |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, component-level |
| Diagrams | React Flow | Best-fit for interactive state machine visualisation |
| Data | JSON (parsed from xlsx at build time) | Fast, no DB needed for static model data |
| State | Zustand | Lightweight, good for scenario toggle state |

**Design direction**: Clean, minimal, high information density without clutter. Think Linear / Raycast aesthetic — dark mode capable, sharp typography, monospace for technical state names, sans-serif for UI labels. Avoid GOV.UK Design System patterns; this is internal tooling, not a public service.

---

## Accelerated Claim placeholder state names

The Accelerated Claim (Wales) PDF diagram has two states with UI labels but no technical names defined in the PDF. The breathing space matrix uses the following labels for them — these will be used as placeholders until agreed formally:

| UI Label | Placeholder technical name |
|---|---|
| Awaiting defendant response | `AWAITING_DEFENDANT_RESPONSE` |
| Claimant intent pending | `CLAIMANT_INTENT_PENDING` |

---

## Known gaps and design decisions

| Gap | Decision |
|---|---|
| Several breathing space/stayed matrix entries have conditional return states (e.g. "CASE_PROGRESSION or DECISION_OUTCOME depending on whether a hearing took place") | Flag as known gap in the UI. When a case exits breathing space/stay and the return state is ambiguous, present both options and label them "conditional — depends on hearing status". Do not attempt to auto-resolve. |
| Breathing space/stayed matrix entries marked "Question for Judges" or "Alex to check" | Surface inline with the same `hasOpenQuestions` flag as other uncertain data. |
| Counter Claim (Main Claim Closed) state model sourced from Visio (.vsdx), not PDF | States and events extracted from the Visio XML. Transitions will need to be inferred and confirmed. |
| Accelerated Claim placeholder technical names | `AWAITING_DEFENDANT_RESPONSE` and `CLAIMANT_INTENT_PENDING` are placeholders derived from the breathing space matrix labels. |

---

*spec.md v0.3 — ready for build*
