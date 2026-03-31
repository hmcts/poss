PROMPT ************************************************************************
PROMPT Create Table tmp_mcol_mig_event_mapping
PROMPT ************************************************************************

CREATE TABLE cdr_mcol_event_mapping
    (
    std_event_id    NUMBER(3)     PRIMARY KEY,
    mcol_type       VARCHAR2(2)
    );

PROMPT ************************************************************************
PROMPT Table tmp_mcol_mig_event_mapping created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table tmp_mcol_mig_status_mapping
PROMPT ************************************************************************

CREATE TABLE cdr_mcol_status_mapping
    (
    claim_status    VARCHAR2(12)     PRIMARY KEY,
    mcol_type       VARCHAR2(2)
    );

PROMPT ************************************************************************
PROMPT Table tmp_mcol_mig_status_mapping created
PROMPT ************************************************************************