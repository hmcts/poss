WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes for the new case
|                   type for Debtors Petition Reform 
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
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

SPOOL dml_trac_5737.log

PROMPT ************************************************************************
PROMPT Inserting into CCBC_REF_CODES table
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('APP ON DEBT PETITION'
	,'INSOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Application on Debtor''s Petition');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('DEBTORS PETITION'
	,'INSOLVENCY'
	,'CASE_TYPE_OBSOLETE_BY_IIT'
	,'DEBTORS PETITION - Desc');
	
DELETE FROM ccbc_ref_codes
WHERE rv_low_value = 'DEBTORS PETITION'
AND rv_domain = 'CURRENT_CASE_TYPE';
	
PROMPT ************************************************************************
PROMPT Inserting into TASKS table
PROMPT ************************************************************************
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('IN29'
	,'B'
	,'ISSUE OF APP ON DEBTOR''S PETITION'
	,'E');
	
COMMIT;

SPOOL OFF