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

(All features implemented.)

---

## Dependency Order

```
P0: data-model --> data-ingestion --> app-shell           ✓
P1: state-explorer, event-matrix, case-walk               ✓
P2: scenario-analysis, model-health, uncertainty-display   ✓
```

---

## Notes

- All features grounded in `.business_context/spec.md` v0.3
- State transition data must be hand-coded from PDF diagrams -- this is a manual effort within data-ingestion
- Items removed automatically when pipeline completes successfully
