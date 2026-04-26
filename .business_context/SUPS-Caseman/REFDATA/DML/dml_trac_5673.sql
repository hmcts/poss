WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script updates reference data changes for the BIF item 19
|                   (BMS changes).
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2015 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. CGI's prior written consent is
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

SPOOL dml_trac_5673.log

PROMPT ************************************************************************
PROMPT Updating CCBC_REF_CODES table
PROMPT ************************************************************************
	
UPDATE 	ccbc_ref_codes
SET 	rv_low_value = 'CLAIM - TCC SPEC ONLY'
WHERE 	rv_domain = 'CURRENT_CASE_TYPE'
AND 	rv_meaning = 'Technology and Construction Court - Specified Only'
AND 	rv_iit_code_1 IS NULL;

UPDATE 	ccbc_ref_codes
SET 	rv_low_value = 'CLAIM - TCC MULTI/OTHER'
WHERE 	rv_domain = 'CURRENT_CASE_TYPE'
AND 	rv_meaning = 'Technology and Construction Court - Multiple/Other Remedy'
AND 	rv_iit_code_1 IS NULL;

UPDATE 	ccbc_ref_codes
SET 	rv_low_value = 'CLAIM - TCC UNSPEC'
WHERE 	rv_domain = 'CURRENT_CASE_TYPE'
AND 	rv_meaning = 'Technology and Construction Court - Unspecified Only'
AND 	rv_iit_code_1 IS NULL;

UPDATE 	ccbc_ref_codes
SET 	rv_low_value = 'CLAIM - TCC ARBITRATION'
WHERE 	rv_domain = 'CURRENT_CASE_TYPE'
AND 	rv_meaning = 'Technology and Construction Court - Arbitration'
AND 	rv_iit_code_1 IS NULL;

UPDATE 	ccbc_ref_codes
SET 	rv_low_value = 'CLAIM - TCC PRE ACTION'
WHERE 	rv_domain = 'CURRENT_CASE_TYPE'
AND 	rv_meaning = 'Technology and Construction Court - Pre Action'
AND 	rv_iit_code_1 IS NULL;

UPDATE 	ccbc_ref_codes
SET 	rv_low_value = 'CLAIM - TCC ADJUDICATION'
WHERE 	rv_domain = 'CURRENT_CASE_TYPE'
AND 	rv_meaning = 'Technology and Construction Court - Adjudication'
AND 	rv_iit_code_1 IS NULL;

COMMIT;

SPOOL OFF