WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script creates the new DEFENCE_DOC_EVENTS table.
|                   
|                   It also adds new column VIA_SDT to the 
|                   LOAD_JUDGEMENTS, LOAD_WARRANTS and LOAD_ PAID_WO_DETAILS  
|                   This column is a VARCHAR2(1) with a default values of
|                   'Y' with a constraint restricting possible values to 'Y' or 'N'
|
|                   Note: the VIA_SDT column is added to the LOAD_CASES table by the CPT
|                   changes
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

SPOOL ddl_trac_5118.log

-- Set audit context
CALL sys.set_sups_app_ctx('support','0','defence_reject_reasons');


PROMPT ************************************************************************
PROMPT Creating the DEFENCE_DOC_EVENT table
PROMPT ************************************************************************
-- Create table
CREATE TABLE defence_doc_event
    (
    case_number              VARCHAR2(8) NOT NULL,
    type                     VARCHAR2(2),
    defendant_id             NUMBER(1),
    defendant_addr_1         VARCHAR2(30),
    defendant_addr_2         VARCHAR2(30),
    defendant_addr_3         VARCHAR2(30),
    defendant_addr_4         VARCHAR2(30),
    defendant_postcode       VARCHAR2(8),
    defendant_dob            DATE,
    telephone_number         VARCHAR2(20),
    email                    VARCHAR2(255),
    cust_file_sequence       VARCHAR2(3),
    validated                VARCHAR2(1) DEFAULT 'N' NOT NULL, 
CONSTRAINT ded_v_check  CHECK (validated    IN ('Y', 'N')),
    via_sdt                  VARCHAR2(1) DEFAULT 'N' NOT NULL
CONSTRAINT ded_vs_check CHECK (via_sdt      IN ('Y', 'N'))
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
 
PROMPT ************************************************************************
PROMPT adding VIA_SDT column and constraint to LOAD_JUDGMENTS table
PROMPT ************************************************************************ 

ALTER TABLE load_judgments
ADD (via_sdt VARCHAR2(1) DEFAULT 'N' NOT NULL );

ALTER TABLE load_judgments
ADD CONSTRAINT lj_vs_check CHECK (via_sdt      IN ('Y', 'N'));

PROMPT ************************************************************************
PROMPT adding VIA_SDT column and constraint to LOAD_WARRANTS table
PROMPT ************************************************************************ 

ALTER TABLE load_warrants
ADD (via_sdt VARCHAR2(1) DEFAULT 'N' NOT NULL );

ALTER TABLE load_warrants
ADD CONSTRAINT lw_vs_check CHECK (via_sdt      IN ('Y', 'N'));

PROMPT ************************************************************************
PROMPT adding VIA_SDT column and constraint to LOAD_PAID_WO_DETAILS table
PROMPT ************************************************************************ 

ALTER TABLE load_paid_wo_details
ADD (via_sdt VARCHAR2(1) DEFAULT 'N' NOT NULL );

ALTER TABLE load_paid_wo_details
ADD CONSTRAINT lpwo_vs_check CHECK (via_sdt      IN ('Y', 'N'));

COMMIT;

SPOOL OFF

EXIT

