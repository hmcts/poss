WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| FILENAME      : ddl_trac_5587_n1_claim_pack.sql
|
| SYNOPSIS      : Database updates to CPT_PRINT_CLAIMS and REPORT_SEQUENCES
|                 tables for N1 Claim Pack and CaseMan BIF changes.
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2015 CGI IT UK Ltd
|                 This file contains information which is confidential and of
|                 value to CGI IT UK Ltd. It may be used only for the specific
|                 purpose for which it has been provided. CGI IT UK Ltd's prior
|                 written consent is required before any part is reproduced.
|
| COMMENTS      : TRAC 5597 N1 Claim Pack and CaseMan BIF database updates.
|---------------------------------------------------------------------------------
|
| $Revision: 11905 $
| $Author: vincentcp $
| $Date: 2015-05-08 14:18:32 +0100 (Fri, 08 May 2015) $
| $Id: ddl_trac_5587_n1_claim_pack.sql 11905 2015-05-08 13:18:32Z vincentcp $
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_5587_n1_claim_pack.log

PROMPT ************************************************************************
PROMPT Modify CPT_PRINT_CLAIMS table AMOUNT, COSTS, FEE and TOTAL lengths
PROMPT ************************************************************************

ALTER TABLE CPT_PRINT_CLAIMS MODIFY AMOUNT VARCHAR2(10);
ALTER TABLE CPT_PRINT_CLAIMS MODIFY COSTS VARCHAR2(10);
ALTER TABLE CPT_PRINT_CLAIMS MODIFY FEE VARCHAR2(10);
ALTER TABLE CPT_PRINT_CLAIMS MODIFY TOTAL VARCHAR2(10);

PROMPT ************************************************************************
PROMPT CPT_PRINT_CLAIMS table AMOUNT, COSTS, FEE and TOTAL lengths modified
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Modify CPT_PRINT_CLAIMS table primary key to be a composite key
PROMPT ************************************************************************

ALTER TABLE CPT_PRINT_CLAIMS DROP CONSTRAINT PRINT_CLAIMS_PK;
ALTER TABLE CPT_PRINT_CLAIMS ADD CONSTRAINT PRINT_CLAIMS_PK PRIMARY KEY (ISSUE_DATE, REC_NO);

PROMPT ************************************************************************
PROMPT CPT_PRINT_CLAIMS table primary key modified to be a composite key
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Insert new record for CPT_N1 report into REPORT_SEQUENCES table
PROMPT ************************************************************************

INSERT ALL INTO REPORT_SEQUENCES VALUES ('CPT_N1', 0, NULL)
SELECT * FROM DUAL
WHERE NOT EXISTS (
SELECT 1 FROM REPORT_SEQUENCES WHERE FORM_NAME='CPT_N1'
);

PROMPT ************************************************************************
PROMPT New record for CPT_N1 report into REPORT_SEQUENCES table inserted
PROMPT ************************************************************************

COMMIT;

SPOOL OFF
