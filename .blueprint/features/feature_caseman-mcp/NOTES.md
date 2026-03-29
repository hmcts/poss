# MCP Server for SUPS-Caseman Source Data

## Recommendation

A lightweight MCP server exposing the Caseman reference data as queryable tables would reduce friction for ongoing cross-referencing between the legacy system and the new possession service.

## When it's worth building

- Iterative gap analysis across 497 events — querying "does the new service cover Caseman event X?" repeatedly via Grep is slow
- Cross-referencing CSVs in one call (e.g. "all tasks associated with event 260" across `standard_events.csv`, `tasks.csv`, `pre_req_events.csv`)
- Navigating the large SQL files (`create_packages.sql` 36,702 lines; `create_triggers.sql` 19,366 lines) — semantic access (e.g. "show me all procedures in CCBC_STATUSES") is much faster than Read/Grep

## Not needed for

- The visualization / gap analysis task — the existing `SUPS-Caseman-Analysis.md` + filesystem access is sufficient for that

## Suggested approach

SQLite backend loaded from the CSVs at startup, exposed via MCP. Estimated effort: a few hours. Files to ingest:

| File | Rows | Purpose |
|------|------|---------|
| `standard_events.csv` | 497 | Event catalogue |
| `tasks.csv` | 513 | BMS task definitions |
| `pre_req_events.csv` | 32 | Event dependency chains |

SQL files (`create_packages.sql`, `create_triggers.sql`) could be parsed for procedure/trigger definitions if deeper querying is needed.
