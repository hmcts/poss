WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes required for the 
|                   introduction of new Family Enforcement case types 
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

SPOOL dml_trac_5879.log

PROMPT ************************************************************************
PROMPT Inserting into CCBC_REF_CODES table
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1)
VALUES
	('FAMILY ENF - FAMILY COURT'
	,'FAMILY'
	,'CURRENT_CASE_TYPE'
	,'Family Enforcement - Order Made in Family Court'
	,'F');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1)
VALUES
	('FAMILY ENF - REMO'
	,'FAMILY'
	,'CURRENT_CASE_TYPE'
	,'Family Enforcement - Reciprocal (REMO) Cases'
	,'F');
	
PROMPT ************************************************************************
PROMPT Inserting into TASKS table
PROMPT ************************************************************************

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA001','B','Issue UK Family Enforcement Application','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA002','B','Issue Reciprocal Family Enforcement Application','E');
		
COMMIT;

SPOOL OFF