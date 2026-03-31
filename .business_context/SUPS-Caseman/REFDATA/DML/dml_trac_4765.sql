WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script inserts reference data required for the new transfer 
|				  reason required for RFS 3719.
|
| $Author:$       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4765.log

	-- Set audit context
CALL sys.set_sups_app_ctx('support','0','rfs 3719');

PROMPT ************************************************************************
PROMPT Insert new transfer reason refdata into the CCBC_REF_CODES table
PROMPT ************************************************************************
	
INSERT INTO ccbc_ref_codes 
	(rv_low_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('INTERLOC JUDGMT'
	,'TRANS_REASON'
	,'INTERLOCUTORY JUDGMENT'
	,'POST'
	,'CJR018M');
	
COMMIT;

SPOOL OFF