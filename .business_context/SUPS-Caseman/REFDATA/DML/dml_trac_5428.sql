WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes for the BIF item 19
|                   (BMS changes).
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

SPOOL dml_trac_5428.log

PROMPT ************************************************************************
PROMPT Inserting into STANDARD_EVENTS table
PROMPT ************************************************************************

INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(4
	,'C'
	,'FILE SENT TO COURT (CCMCC ONLY)'
	,'N'
	,'Y'
	,'M');
	
PROMPT ************************************************************************
PROMPT Inserting into TASKS table
PROMPT ************************************************************************

INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('JH90'
	,'B'
	,'CCMCC TRANSFER CHECKLIST'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('PA18'
	,'B'
	,'CREATION OF A FUND (CFO FORM 212)'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('BC083'
	,'B'
	,'CREATION OF A FUND (CFO FORM 212)'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('BC082'
	,'B'
	,'ACKNOWLEDGMENT FROM CFO'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('DR26'
	,'B'
	,'ISSUE OF CLAIM - MERCANTILE'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('JH91'
	,'B'
	,'DOCUMENT FORWARDED POST TRANSFER'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('BC072'
	,'B'
	,'DOCUMENT FORWARDED POST TRANSFER'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('IS25'
	,'B'
	,'TCC CLAIM ISSUED IN THE COUNTY COURT'
	,'E');

PROMPT ************************************************************************
PROMPT Updating TASKS table
PROMPT ************************************************************************

UPDATE tasks
SET task_description = 'ACKNOWLEDGMENT FROM CFO'
WHERE task_number = 'PA11';

UPDATE tasks
SET task_description = 'ISSUE OF CLAIM - TECHNOLOGY AND CONSTRUCTION COURT'
WHERE task_number = 'DR13';

PROMPT ************************************************************************
PROMPT Inserting into CCBC_REF_CODES table
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('TCC - SPEC ONLY'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Specified Only'
	,'Q'
	,'T');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('TCC - MULTI/OTHER'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Multiple/Other Remedy'
	,'Q'
	,'T');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('TCC - UNSPEC'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Unspecified Only'
	,'Q'
	,'T');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('TCC - ARBITRATION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Arbitration'
	,'Q'
	,'T');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('TCC - PRE ACTION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Pre Action'
	,'Q'
	,'T');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('TCC - ADJUDICATION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Adjudication'
	,'Q'
	,'T');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('MERC - SPEC ONLY'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Mercantile - Specified Only'
	,'Q'
	,'M');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('MERC - MULTI/OTHER'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Mercantile - Multiple/Other Remedy'
	,'Q'
	,'M');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('MERC - UNSPEC'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Mercantile - Unspecified Only'
	,'Q'
	,'M');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('MERC - ARBITRATION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Mercantile - Arbitration'
	,'Q'
	,'M');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning
	,rv_iit_code_1
	,rv_iit_code_2)
VALUES
	('MERC - PRE ACTION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Mercantile - Pre Action'
	,'Q'
	,'M');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('CLAIM – TCC SPEC ONLY'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Specified Only');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('CLAIM – TCC MULTI/OTHER'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Multiple/Other Remedy');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('CLAIM – TCC UNSPEC'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Unspecified Only');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('CLAIM – TCC ARBITRATION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Arbitration');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('CLAIM – TCC PRE ACTION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Pre Action');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_high_value
	,rv_domain
	,rv_meaning)
VALUES
	('CLAIM – TCC ADJUDICATION'
	,'SOLVENCY'
	,'CURRENT_CASE_TYPE'
	,'Technology and Construction Court - Adjudication');

COMMIT;

SPOOL OFF