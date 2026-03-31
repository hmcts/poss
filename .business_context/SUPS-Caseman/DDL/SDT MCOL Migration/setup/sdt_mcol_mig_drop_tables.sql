PROMPT ************************************************************************
PROMPT Drop SDT MCOL Migration tables
PROMPT ************************************************************************

DROP TABLE tmp_mcol_mig_info;
DROP TABLE tmp_mcol_mig_cred_claims;
DROP TABLE tmp_mcol_mig_failures;
DROP TABLE tmp_mcol_mig_event_mapping;
DROP TABLE tmp_mcol_mig_status_mapping;
DROP TABLE mcol_mig_claim_data;
DROP TABLE mcol_mig_party_data;
DROP TABLE mcol_mig_judgment_data;
DROP TABLE mcol_mig_warrant_data;
DROP TABLE mcol_mig_event_data;

PROMPT ************************************************************************
PROMPT SDT MCOL Migration tables dropped
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Drop SDT MCOL Migration packages
PROMPT ************************************************************************

DROP PACKAGE sdt_mcol_mig_pack;

PROMPT ************************************************************************
PROMPT SDT MCOL Migration packages dropped
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Drop Indexes created specifically for SDT migration packages
PROMPT ************************************************************************

DROP INDEX cases_fx3;

PROMPT ************************************************************************
PROMPT Indexes dropped
PROMPT ************************************************************************