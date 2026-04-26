# Caseman Database Analysis — Possession Service

> Analysis of the CCBC/Caseman Oracle database source code to extract the state model, event model, task definitions, and transition mechanisms relevant to the HMCTS Possession Proceedings Service.

## Source Files Analysed

| File | Records / Lines | Purpose |
|------|----------------|---------|
| `SUPS-Caseman/app/caseman_database_source/reference_data/data/common/standard_events.csv` | 497 events | Canonical event catalogue |
| `SUPS-Caseman/app/caseman_database_source/reference_data/data/common/tasks.csv` | 513 tasks | BMS task definitions mapped to events |
| `SUPS-Caseman/app/caseman_database_source/reference_data/data/common/pre_req_events.csv` | 32 dependencies | Event prerequisite chains |
| `SUPS-Caseman/DDL/triggers/set_statuses.sql` | Trigger | AFTER INSERT trigger on CASE_EVENTS |
| `SUPS-Caseman/app/database/baseline/CASEMAN/create_packages.sql` | 36,702 lines | CCBC_STATUSES package (line 7907+) |
| `SUPS-Caseman/app/database/baseline/CASEMAN/create_triggers.sql` | 19,366 lines | All database triggers |

---

## 1. Case Status States

Cases in Caseman have a `CASES.STATUS` column managed exclusively through the `ccbc_statuses.case_status_dbp()` procedure. The states are:

| Status Value | Meaning | Trigger Events |
|-------------|---------|----------------|
| `NULL` (empty) | Active / initial case state | Default on case creation |
| `PAID` | Case fully paid | Set via `chk_judg_dbp` when no current judgment exists |
| `SETTLED` | Case settled pre-judgment | Events 73 (Settled Pre Judgment), 76 (Case Settled Withdrawn Post-Judgment) |
| `SETTLED/WDRN` | Case discontinued or written off | Event 74 (Case Discontinued/Written Off) |
| `STAYED` | Case stayed — no further action | Events 752 (Case Stayed No Action), 754 (Case Stayed Not Served) |
| `''` (empty string) | Status cleared (stay lifted) | Event 756 (N24 Order Lifting Stay) |

### State Transitions Diagram

```
                    ┌──────────┐
    Case Created ──►│  NULL     │ (active)
                    └────┬─────┘
                         │
            ┌────────────┼────────────────┬──────────────┐
            ▼            ▼                ▼              ▼
      ┌──────────┐ ┌──────────┐   ┌────────────┐  ┌─────────┐
      │  PAID    │ │ SETTLED  │   │SETTLED/WDRN│  │ STAYED  │
      └──────────┘ └──────────┘   └────────────┘  └────┬────┘
                                                       │
                                                       ▼ (event 756)
                                                  ┌──────────┐
                                                  │  NULL     │
                                                  └──────────┘
```

---

## 2. Transition Mechanism — Three-Level Architecture

Case status changes are controlled through a three-level architecture:

### Level 1: Database Trigger (`set_statuses`)

The `set_statuses` trigger fires **AFTER INSERT** on the `CASE_EVENTS` table. It:

1. **Filters by user** — only processes events for `CCBC_BATCH`, `CCBC_OPS`, `CCBC_CAT` users
2. **Tracks instigators** — inserts `CASE_EVENT_INSTIGATORS` records (CASE_PARTY_NO = 1, always CLAIMANT)
3. **Dispatches by event ID** — routes to the appropriate status-setting logic:

| Event ID | Action |
|----------|--------|
| 74 | If `discon_flag = 'Y'`, reset to `'N'`. Set `bar_judgment = 'Y'`. Set status to `SETTLED/WDRN`. Insert MCOL_DATA type `DI`. |
| 73, 76 | If `settled_flag = 'Y'`, reset to `'N'`. Set `bar_judgment = 'Y'`. Set status to `SETTLED`. Insert MCOL_DATA type `WD`. |
| 160 | Lift judgment bar (`bar_judg_dbp` sets to `'N'`). No status change. |
| 752, 754 | Set status to `STAYED`. |
| 756 | Clear status to empty string (lifts stay). |
| 50, 52, 60 | Set judgment bar for MCOL submissions only. No status change. |

### Level 2: Package Procedures (`CCBC_STATUSES`)

The `CCBC_STATUSES` package (create_packages.sql, line 7907) provides the procedural API:

| Procedure | Purpose |
|-----------|---------|
| `case_status_dbp(status, case_number)` | Directly updates `CASES.STATUS` |
| `bar_judg_dbp(case_number, defendant_id, flag)` | Sets/unsets bar for a specific defendant |
| `bar_judg_all_dbp(case_number, flag)` | Sets/unsets bar for all defendants |
| `chk_judg_dbp(case_number)` | Validates no judgment exists, then sets `PAID` + bars all |
| `date_service_dbp(case_number, defendant_id)` | Nullifies service dates and sets bar |
| `set_flag_dbp` | Initialises `paid_flag = 'Y'` |
| `set_warrant_dbp(case_number, defendant_id)` | Inserts final return on warrant for paid case |
| `set_warrant_all_dbp(case_number)` | Updates final return type on all warrants |
| `set_paid_wo_type_dbp(paid_wo_type)` | Sets the paid-without-type variable |

### Level 3: Application-Level Flags

Package-level variables coordinate multi-step processing:

| Flag | Type | Purpose |
|------|------|---------|
| `paid_flag` | `VARCHAR2(1)` | Indicates case should be marked paid |
| `discon_flag` | `VARCHAR2(1)` | Discontinuation in progress |
| `settled_flag` | `VARCHAR2(1)` | Settlement in progress |
| `paid_wo_type` | `VARCHAR2(1)` | Paid-without-type classification |

---

## 3. Judgment Bar Mechanism

The `bar_judgment` flag is managed at the **defendant level** (`CASE_PARTY_ROLES.DEFT_BAR_JUDGMENT`), enabling multi-defendant cases where each defendant has separate judgment bar status.

### Events That Set the Bar

| Event | Name | Context |
|-------|------|---------|
| 10 | Summons Not Served | Service failure |
| 12 | Documents Not Served | Service failure |
| 50 | Defence Filed | Defendant response |
| 52 | Defence and Counterclaim | Defendant response |
| 60 | Receipt of Part Admission | Defendant response |
| 73 | Settled Pre Judgment | Case resolution |
| 74 | Case Discontinued/Written Off | Case resolution |
| 76 | Case Settled Withdrawn (Post-Jgmt) | Case resolution |

### Events That Lift the Bar

| Event | Name | Context |
|-------|------|---------|
| 160 | Application to Set Aside Judgment | Judgment challenge |

---

## 4. Event Model — Standard Events

The `standard_events.csv` defines 497 events across the full case lifecycle. Key possession-relevant events:

### Case Lifecycle Events

| ID | Event Name | Classification |
|----|-----------|----------------|
| 1 | CASE RECORD CREATED | System (S) |
| 10 | SUMMONS NOT SERVED | Service |
| 12 | DOCUMENTS NOT SERVED | Service |
| 50 | DEFENCE FILED | Response |
| 52 | DEFENCE AND COUNTERCLAIM | Response |
| 60 | RECEIPT OF PART ADMISSION | Response |
| 73 | SETTLED PRE JUDGMENT | Settlement |
| 74 | CASE DISCONTINUED/WRITTEN OFF | Discontinuation |
| 76 | CASE SETTLED WITHDRAWN (POST-JGMT) | Post-judgment settlement |
| 78 | CASE PAID (PRE-JUDGMENT) | Payment |
| 79 | CASE PAID (POST-JUDGMENT) | Payment |

### Judgment Events

| ID | Event Name |
|----|-----------|
| 160 | APPLICATION TO SET ASIDE JUDGMENT |
| 230 | N30 JUDGMENT BY DEFAULT |
| 240 | N30(1) JUDGMENT ON ACCEPTANCE |
| 250 | N30(2) JUDGMENT BY DETERMINATION |
| 260 | N26 ORDER FOR POSSESSION |

### Enforcement Events

| ID | Event Name |
|----|-----------|
| 752 | CASE STAYED NO ACTION |
| 754 | CASE STAYED NOT SERVED |
| 756 | N24 ORDER LIFTING STAY |

### MCOL Integration

The trigger inserts `MCOL_DATA` records for external system communication:

| MCOL Type | Meaning | Triggering Event |
|-----------|---------|-----------------|
| `DI` | Discontinued | Event 74 |
| `WD` | Withdrawn | Events 73, 76 |

---

## 5. Event Prerequisites

The `pre_req_events.csv` defines 32 event dependency rules. Events cannot be raised unless their prerequisite events have already occurred on the case.

### Key Dependency Chains

| Event | Requires | Description |
|-------|----------|-------------|
| 31 | 450 | — |
| 32 | 451 | — |
| 61 | 60 | Response to part admission requires part admission |
| 77 | 173 | — |
| 335 | 334 | — |
| 440 | 439 | Sequential order processing |
| 441 | 440 | Sequential order processing |
| 442 | 440 | Sequential order processing |
| 443 | 440 | Sequential order processing |
| 852–872 | Various | Judgment summons / attachment of earnings chains |

---

## 6. Tasks Reference Data

The `tasks.csv` defines 513 BMS (Business Management System) task codes mapped to court operations. Tasks are grouped by functional domain:

| Prefix | Domain | Example Tasks |
|--------|--------|---------------|
| `BC*` | CCBC | Entry of judgment, receipt of defence, warrant execution, transfer out/in |
| `CA*` | Accounts | Combined account creation, payment allocation, address changes, suspense |
| `CO*` | Complaints | Letters of complaint by category (Judgments, Issue, Enforcement, Payments) |
| `DR*` | District Registry | QBD/Chancery writs, summons, taxation, costs, appeals, transfers |
| `EN*` | Enforcement | Warrants, charging orders, third-party debt, attachment of earnings, admin orders |
| `FM*` | Family | Adoption, divorce, maintenance, child support, injunctions |
| `IN*` | Insolvency | Bankruptcy, winding-up, administration orders, receivership |
| `IS*` | Issue | Default summons, originating applications, amendments, reissue |
| `JH*` | Judgments & Hearings | Judgments, orders, variations, applications, allocations, costs |
| `LS*` | Listing | Fast/multi/small claims track listing |
| `PA*` | Payments | Receipt, processing, payout procedures, CFO forms |
| `SM*` | Statistics & Metrics | Mortgage possession, 3rd party debt, charging orders, warrants |

Task status codes: `E` = External, `A` = Admin, `T` = Transfer.

---

## 7. Work Allocation Alignment

Cross-referencing the Caseman model with the R1A Work Allocation task definitions (see `R1A_WA_Tasks_vs_Event_Model_Analysis.md`):

### Fully Aligned (7 tasks)

New claim listing, hearing centre assignment, defendant response, case flags, Welsh translation, translated documents, generic general applications.

### Partially Aligned (9 tasks)

- **Response + counterclaim**: WA combines these; Caseman has separate events (50, 52)
- **Counterclaim types**: WA is coarse-grained; Caseman distinguishes variants
- **Adjourn / set-aside / other general applications**: WA groups; Caseman has fine-grained events
- **Document upload context**: WA lacks claim/counterclaim/general application variant context
- **Judicial order workflows**: WA simplifies multi-step Caseman sequences

### Gaps (1 task)

- **Failed payment**: WA defines this task but no explicit Caseman event exists in the standard events model

---

## 8. Key Findings

1. **Event-driven state machine**: Case status transitions are entirely driven by the insertion of events into `CASE_EVENTS`, with the `set_statuses` trigger dispatching to appropriate procedures.

2. **Three-level control**: Database triggers → package procedures → application flags. This layered approach provides both automated processing and manual override capability.

3. **Defendant-specific tracking**: The judgment bar operates per-defendant via `CASE_PARTY_ROLES.DEFT_BAR_JUDGMENT`, enabling multi-defendant cases with independent status tracking.

4. **MCOL integration points**: Key settlement/discontinuation events generate `MCOL_DATA` records (`DI`/`WD`) for external system communication — these are integration seams.

5. **Event dependency chains**: The prerequisite model (`pre_req_events.csv`) enforces sequential workflows, particularly in enforcement (charging orders, attachment of earnings, judgment summons).

6. **Task granularity mismatch**: Caseman's 513 task codes are significantly more granular than the R1A Work Allocation model. The new possession service needs to decide its level of task granularity — likely somewhere between the two.

7. **Limited terminal states**: Only `PAID`, `SETTLED`, `SETTLED/WDRN` are true terminal states. `STAYED` is reversible via event 756. This is a relatively simple state model given the complexity of the event model.

8. **User-scoped automation**: The trigger only fires for specific system users (`CCBC_BATCH`, `CCBC_OPS`, `CCBC_CAT`), meaning manual/interactive users bypass the automated status logic — an important distinction for the new service design.
