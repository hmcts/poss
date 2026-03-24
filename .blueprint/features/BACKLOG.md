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
| Ready | P2 | XL | scenario-analysis | Toggle events/roles/states on/off, see micro/meso/macro impact with visual output |
| Ready | P2 | M | model-health | Model health panel: open questions count, low-completeness states, unreachable end states |
| Ready | P2 | M | uncertainty-display | Visual uncertainty indicators (hasOpenQuestions, completeness badges) across all modes |

---

## Details

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
