# R1A Work Allocation Tasks vs Event Model Alignment Analysis

> Analysis comparing the R1A Work Allocation Task Names document against the Event Model Possession Service V0.1.

## Alignment Table

| # | WA Trigger (Action/Event) | WA Task Name | Matching Event Model Event(s) | Alignment |
|---|---|---|---|---|
| 1 | New claim received -- system auto-assigns hearing centre | New Claim -- Listing required | `Case Issued` (system event, PENDING_CASE_ISSUED) | **Aligned** -- Case Issued is a system event that triggers post-payment; hearing centre allocation (`Allocate hearing centre`) exists in CASE_ISSUED state |
| 2 | New claim received -- system cannot auto-assign hearing centre | New Claim -- Hearing Centre Update | `Allocate hearing centre` (caseworker event, CASE_ISSUED state) | **Aligned** -- explicit caseworker event exists for manual hearing centre assignment |
| 3 | Response submitted | Review Defendant response | `Respond to Claim` (appears in CASE_PROGRESSION, JUDICIAL_REFERRAL, and other live states) | **Aligned** -- event exists across multiple states; also `Paper Response - Admission` / `Paper Response - Reviewed` for paper channel |
| 4 | Response and counterclaim submitted | Review Defendant response and counterclaim | `Respond to Claim` + counterclaim events (Sheet 2: `Respond to counter claim`, `Update Counter Claim`) | **Partial** -- response and counterclaim are modelled as separate events in the event model, not a single combined event. The WA task treats them as one action |
| 5 | Counterclaim submitted | Review Counterclaim | Sheet 2: `Update Counter Claim`, `Respond to counter claim` | **Partial** -- counterclaim events exist on Sheet 2 but there is no single "Submit Counterclaim" event. The counterclaim lifecycle is modelled separately from main claim |
| 6 | General application -- adjourned submitted | Review adjourn gen app | `Make an application` (present in nearly all live states) | **Partial** -- `Make an application` is a generic event. The event model does not distinguish adjournment, set-aside, or other gen app types as separate events |
| 7 | General application -- set aside order submitted | Review set aside gen app | `Make an application` | **Partial** -- same issue; no sub-typed gen app events in the model |
| 8 | General application -- something else submitted | Review gen app | `Make an application` | **Aligned** -- this is the generic catch-all, which maps directly |
| 9 | Further evidence -- claim/counterclaim | Review additional documents -- claim/counterclaim | `Upload your documents` (present in most states for claimants/reps) | **Partial** -- `Upload your documents` exists but is not sub-typed by claim vs counterclaim vs gen app. The WA doc expects 4 distinct task types based on document context |
| 10 | Further evidence -- claim | Review additional documents -- claim | `Upload your documents` | **Partial** -- same as above |
| 11 | Further evidence -- general application | Review additional documents -- gen app | `Upload your documents` | **Partial** -- same as above |
| 12 | Further evidence -- counterclaim | Review additional documents -- counterclaim | `Upload your documents` | **Partial** -- same as above |
| 13 | Case Flags requested -- professional user | Review Case Flag request | `Create case flags` / `Manage case flags` (present in most states) | **Aligned** -- events exist; WA task would trigger on the professional-user variant |
| 14 | User selects Welsh Language Flag | Welsh Translation | `Create case flags` (flag type = Welsh Language) | **Aligned** -- this is a specific case flag type; the event model supports it via case flags events |
| 15 | WLU uploads translated document | Review Translated document | `Upload translated document` (present across nearly all states, HMCTS-only) | **Aligned** -- dedicated event exists in the model |
| 16 | Judge makes an order on a digital case | Review judicial order | `Issue order` / `Directions Order Drawn` / order-related events (Make an order, Seal the order, etc.) | **Partial** -- multiple order events exist but the judicial order workflow (Make/Draft/Amend/Seal/Notify order) is still marked as "to be determined" in the event model |
| 17 | User makes a payment but it fails | Review Failed Payment | No explicit event | **Gap** -- there is no "Failed Payment" event in the event model. Payment is implied in `Submit and Pay` / `Case Issued` flow but failure handling is not modelled |

## Summary

| Status | Count | Details |
|---|---|---|
| **Fully Aligned** | 7 | Tasks 1, 2, 3, 8, 13, 14, 15 -- direct event model counterparts exist |
| **Partially Aligned** | 9 | Tasks 4, 5, 6, 7, 9--12, 16 -- events exist but at a coarser granularity (e.g. single `Make an application` vs typed gen apps, single `Upload your documents` vs document-context variants) |
| **Gap** | 1 | Task 17 (Failed Payment) -- no corresponding event in the model |

## Key Issues to Resolve

### 1. General application sub-typing

The WA doc expects 3 distinct task names (adjourn / set aside / other) but the event model has a single `Make an application`. The event model needs either sub-typed events or a classification field to drive WA task routing.

### 2. Document upload context

The WA doc expects 4 task variants based on what the evidence relates to (claim / counterclaim / gen app / both). The event model's `Upload your documents` does not capture this distinction. The footnote in the WA doc hints that professional users will have a more structured upload event, but this is not yet reflected.

### 3. Counterclaim combined response

WA task 4 treats "response + counterclaim" as a single action, but the event model separates these across two sheets.

### 4. Failed payment

Needs a new event or system event added to the event model to trigger the WA task.

### 5. Judicial orders

The order lifecycle events (Make/Draft/Seal/Notify) are partially stubbed in the event model -- these need firming up to support the "Review judicial order" WA task.

## Notes

- The WA document includes a footnote: work allocation tasks for further evidence are only created when documents are uploaded by citizens via the citizen dashboard. Professional users will have a more structured event where they select the document type, which automatically places documents into the correct CFV folder. A WA task is only created if they choose "other".
- This analysis is based on Event Model Possession Service V0.1 (Sheet 1: main claim, Sheet 2: counterclaim).
