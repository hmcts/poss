WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script creates the new tables and indexes required
|                     by the BIF changes specified in the following document
|                    PD.4158 CCBC Batch Design for BIF 
|                   
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. Logica's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$   Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_5461.log

-- Set audit context
CALL sys.set_sups_app_ctx('support','0','BIF Table Creation');

PROMPT ************************************************************************
PROMPT Creating the MCOL_PDF_STATUS table
PROMPT ************************************************************************

CREATE TABLE mcol_pdf_status
    (
    created_ts      TIMESTAMP       DEFAULT SYSTIMESTAMP    NOT NULL,
    pdf_file_name   VARCHAR(25)                             NOT NULL,
    loaded          VARCHAR(1)      DEFAULT    'N'          NOT NULL,
    CONSTRAINT      mps_loaded_chk  CHECK   (loaded    IN ('Y', 'N')),
    printed         VARCHAR(1)      DEFAULT    'N'          NOT NULL,
    CONSTRAINT      mps_printed_chk CHECK   (printed   IN ('Y', 'N')),
    deleted         VARCHAR(1)      DEFAULT    'N'          NOT NULL,
    CONSTRAINT      mps_deleted_chk CHECK   (deleted   IN ('Y', 'N')),
    print_now       VARCHAR2(1)     DEFAULT 'Y'             NOT NULL,
    CONSTRAINT      mps_print_chk   CHECK   (print_now IN ('Y', 'N')),   
    event_seq       NUMBER(9),
    case_number     VARCHAR2(8)     NOT NULL,
    order_id        VARCHAR2(20)    NOT NULL
    )
TABLESPACE users
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64K
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );
  
PROMPT 'mcol_pdf_status table created'

  
PROMPT ************************************************************************
PROMPT Creating the SET_ASIDE_REQUESTS table
PROMPT ************************************************************************

CREATE TABLE set_aside_requests
    (
    case_number            VARCHAR2(8)                    NOT NULL,
    party_role_code        VARCHAR2(10)                NOT NULL,
    CONSTRAINT             sar_prc_chk      CHECK (party_role_code         IN ('DEFENDANT', 'CLAIMANT')),
    defendant_id        NUMBER(1)                    NOT NULL,
    CONSTRAINT             sar_def_chk      CHECK (defendant_id         IN ( 1 , 2 )),
    fee                    NUMBER(10,2)                NOT NULL,
    pdf_file_name        VARCHAR(25)                    NOT NULL,
    cust_file_sequence    VARCHAR2(3)                    NOT NULL,
    reject_code            NUMBER(2)                            ,
    validated            VARCHAR2(1)        DEFAULT 'N'    NOT NULL,
    CONSTRAINT             sar_valid_chk   CHECK (validated            IN ('Y', 'N')),
    via_sdt                VARCHAR2(1)        DEFAULT 'Y'    NOT NULL
    CONSTRAINT             sar_via_chk      CHECK (via_sdt              IN ('Y', 'N')),
    mcol_reference      VARCHAR2(12)    NOT NULL
    )
TABLESPACE users
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64K
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );
  
PROMPT 'set_aside_requests table created'

PROMPT ************************************************************************
PROMPT Adding new BIF columns to DEFENCE_DOC_EVENT TABLE
PROMPT ************************************************************************

ALTER TABLE defence_doc_event
ADD (
    fee             NUMBER(10,2),
    pdf_file_name    VARCHAR(25),
    print_now       VARCHAR2(1)     DEFAULT 'Y'              NOT NULL,
    CONSTRAINT      dde_print_chk   CHECK   (print_now  IN  ('Y', 'N')),
    reject_code     NUMBER(2)
    );

prompt 'four new columns added to defence_doc_events'
     
  
COMMIT;

SPOOL OFF

EXIT

