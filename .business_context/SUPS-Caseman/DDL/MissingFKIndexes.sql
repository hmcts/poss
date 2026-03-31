/*-------------------------------------------------------------------------------
|
| FILENAME      : MissingFKIndexes.sql
|
| SYNOPSIS      : A caddy to apply scalability changes to the CaseMan database
|
|
| $Author: westm $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2008 Logica plc.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Part 1 of 2
|
|---------------------------------------------------------------------------------
|
| $Rev: 1308 $:          Revision of last commit
| $Date: 2009-01-05 13:03:46 +0000 (Mon, 05 Jan 2009) $:         Date of last commit
| $Id: MissingFKIndexes.sql 1308 2009-01-05 13:03:46Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

PROMPT Adding indexes to AE_APPLICATIONS
CREATE INDEX ae_applications_ix7 ON ae_applications
    (case_number
    ,party_against_case_party_no
    ,party_against_party_role_code
    );

CREATE INDEX ae_applications_ix8 ON ae_applications
    (case_number
    ,party_for_case_party_no
    ,party_for_party_role_code
    );

CREATE INDEX ae_applications_ix9 ON ae_applications (judg_seq);

PROMPT Adding indexes to CANDIDATE_DIVIDEND_PAYMENTS
CREATE INDEX candidate_dividend_pmts_ix2 ON candidate_dividend_payments
    (cdp_transaction_number
    ,admin_court_code
    );

PROMPT Adding indexes to CASE_EVENTS

CREATE INDEX case_events_ix14 ON case_events
    (case_number
    ,case_party_no
    ,party_role_code
    );

CREATE INDEX case_events_ix15 ON case_events (hrg_seq);

PROMPT Adding indexes to CO_EVENTS
CREATE INDEX co_events_ix8 ON co_events (hrg_seq);

PROMPT Adding indexes to COPS_MERGE_FIELDS
CREATE INDEX cops_merge_fields_ix1 ON cops_merge_fields (dv_code);
CREATE INDEX cops_merge_fields_ix2 ON cops_merge_fields (order_id);

PROMPT Adding indexes to CPR_TO_CPR_RELATIONSHIP
CREATE INDEX cpr_to_cpr_relationship_ix3 ON cpr_to_cpr_relationship
    (cpr_b_case_number
    ,cpr_b_case_party_no
    ,cpr_b_party_role_code
    );

PROMPT Adding indexes to EVENT_OUTPUTS
CREATE INDEX event_outputs_ix1 ON event_outputs (order_type_id);

PROMPT Adding indexes to GIVEN_ADDRESSES
CREATE INDEX given_addresses_ix8 ON given_addresses
    (case_number
    ,case_party_no
    ,party_role_code
    );

PROMPT Adding indexes to JUDGMENTS
CREATE INDEX judgments_ix6 ON judgments
    (case_number
    ,against_case_party_no
    ,against_party_role_code
    );

PROMPT Adding indexes to OBLIGATIONS
CREATE INDEX obligations_ix4 ON obligations (obligation_type);

PROMPT Adding indexes to PAYABLE_ORDER_ITEMS
CREATE INDEX payable_order_items_ix1 ON payable_order_items
    (transaction_number
    ,admin_court_code
    );

PROMPT Adding indexes to REPRINTS
CREATE INDEX reprints_ix1 ON reprints (case_number);

PROMPT Adding indexes to REPORT_REPRINTS_XREF
CREATE INDEX report_reprints_xref_ix4 ON report_reprints_xref
    (username
    ,report_reprints_id
    );

PROMPT Adding indexes to SUB_DETAIL_VARIABLES
CREATE INDEX sub_detail_variables_ix1 ON sub_detail_variables (variable_code);
CREATE INDEX sub_detail_variables_ix2 ON sub_detail_variables (od_seq);

PROMPT Adding indexes to TASK_COUNTS
CREATE INDEX task_counts_ix5 ON task_counts (age_category);

PROMPT Adding indexes to USERS_PRINTERS
CREATE INDEX users_printers_ix1 ON users_printers (printer_id);

PROMPT Adding indexes to WARRANTS
CREATE INDEX warrants_ix15 ON warrants
    (case_number
    ,def1_case_party_no
    ,def1_party_role_code
    );

CREATE INDEX warrants_ix16 ON warrants
    (case_number
    ,def2_case_party_no
    ,def2_party_role_code
    );

CREATE INDEX warrants_ix17 ON warrants
    (case_number
    ,rep_case_party_no
    ,rep_party_role_code
    );

PROMPT Adding indexes to WARRANT_RETURNS
CREATE INDEX warrant_returns_ix5 ON warrant_returns
    (return_code
    ,return_code_court_code
    );
