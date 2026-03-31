WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| TITLE    : dbup_0486_a
|
| FILENAME : dbup_0486_a.sql
|
| SYNOPSIS : Performs DDL actions to implement changes required for RFC 0486
|
| AUTHOR   : Mark West
|
| VERSION  : 1.01
|
| PROJECT   : SUPS Development
|
| COPYRIGHT : (c) 2008 Logica UK Ltd.
|             This file contains information which is confidential and of
|             value to Logica. It may be used only for the specific purpose for
|             which it has been provided. Logica's prior written consent is
|             required before any part is reproduced.
|
| COMMENTS  : Script 1 of 2 for RFC 0486
|
|---------------------------------------------------------------------------------
|
| 11/09/2008 - Initial
| 16/09/2008 - Modified post code review
--------------------------------------------------------------------------------*/

SPOOL dbup_0486_a.log


PROMPT ************************************************************************
PROMPT Modify CASES table
PROMPT ************************************************************************

ALTER TABLE cases ADD (insolvency_number VARCHAR2(8 CHAR));

PROMPT ************************************************************************
PROMPT Adding insolvency_number index to cases table
PROMPT ************************************************************************

CREATE INDEX cases_insolvency_number ON cases (insolvency_number);

PROMPT ************************************************************************
PROMPT insolvency_number added to schema
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Drop MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

DROP MATERIALIZED VIEW mv_cman_party_addresses;

PROMPT ************************************************************************
PROMPT Dropped MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

CREATE MATERIALIZED VIEW mv_cman_party_addresses
REFRESH NEXT TRUNC(SYSDATE + 1) + 6.5/24
AS
SELECT  c.admin_crt_code     admin_crt_code
       ,c.case_number        case_number
       ,cpr.case_party_no    case_party_no
       ,cpr.party_id         party_id
       ,ga.address_line1     address_line1
       ,ga.address_line2     address_line2
       ,ga.address_line3     address_line3
       ,ga.address_line4     address_line4
       ,ga.address_line5     address_line5
       ,ga.postcode          postcode
       ,ga.address_type_code address_type_code
       ,cpr.party_role_code  party_role_code
       ,c.insolvency_number  insolvency_number
  FROM  cases            c
       ,given_addresses  ga
       ,case_party_roles cpr
 WHERE  c.admin_crt_code != '335'
   AND  cpr.case_number = c.case_number
   AND  ga.valid_to IS NULL
   AND (
           (DECODE (ga.address_type_code
                    ,'CODED PARTY'
                    ,'CODED PARTY'
                    ,ga.address_type_code
                    ) = 'CODED PARTY'
            AND  ga.party_id = cpr.party_id)
            OR 	(     cpr.case_number = ga.case_number
                 AND  cpr.case_party_no = ga.case_party_no
                 AND  cpr.party_role_code = ga.party_role_code
                )
       )
 ORDER BY 1
         ,2;

PROMPT ************************************************************************
PROMPT Created MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create Index IDX1MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

CREATE INDEX idx1mv_cman_party_addresses
ON mv_cman_party_addresses
(admin_crt_code, case_number, case_party_no);

PROMPT ************************************************************************
PROMPT Created Index IDX1MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create INDEX IDX2MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

CREATE INDEX idx2mv_cman_party_addresses
ON mv_cman_party_addresses
(case_number, party_role_code, case_party_no);

PROMPT ************************************************************************
PROMPT Created INDEX IDX2MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Refresh MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

EXEC DBMS_MVIEW.REFRESH('MV_CMAN_PARTY_ADDRESSES','COMPLETE');

PROMPT ************************************************************************
PROMPT Refreshed MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

SHOW ERRORS

SPOOL OFF
