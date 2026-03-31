WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script inserts reference data required for the two new 
|				  directions questionnaire case events in RFS 3719.  This includes
|				  new event data, obligation data and bms changes.
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

SPOOL dml_trac_4763.log

	-- Set audit context
CALL sys.set_sups_app_ctx('support','0','rfs 3719');

PROMPT ************************************************************************
PROMPT Insert new case events into the STANDARD_EVENTS table
PROMPT ************************************************************************
	
INSERT INTO standard_events 
	(event_id
	,category
	,description
	,database_event
	,addressee
	,edit_details)
VALUES
	(196
	,'C'
	,'N149 DIRECTIONS QUESTIONNAIRE SENT'
	,'N'
	,'D'
	,'O');
	   
INSERT INTO standard_events 
	(event_id
	,category
	,description
	,database_event
	,addressee
	,edit_details)
VALUES
	(197
	,'C'
	,'DIRECTIONS QUESTIONNAIRE FILED'
	,'N'
	,'D'
	,'O');
	
PROMPT ************************************************************************
PROMPT Update existing events in the STANDARD_EVENTS table
PROMPT ************************************************************************

UPDATE standard_events se
SET se.category = 'c'
WHERE se.event_id = 214;

UPDATE standard_events se
SET se.description = 'N* NOTICE OF DELAY IN SENDING DQ'
WHERE se.event_id = 51;

UPDATE standard_events se
SET se.description = 'N173 NOTICE TO PAY DQ/LQ FEE'
WHERE se.event_id = 770;

PROMPT ************************************************************************
PROMPT Insert new event descriptions in the CHANGED_EVENTS table
PROMPT ************************************************************************

INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 51;

INSERT INTO changed_events
VALUES 
	(51
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'N* NOTICE OF DELAY IN SENDING DQ');

INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 770;

INSERT INTO changed_events
VALUES 
	(770
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'N173 NOTICE TO PAY DQ/LQ FEE');

PROMPT ************************************************************************
PROMPT Insert new obligation_types into the OBLIGATION_TYPES table
PROMPT ************************************************************************

INSERT INTO obligation_types
VALUES
	(32
	,'DQ DUE - SCT'
	,'N');
	
INSERT INTO obligation_types
VALUES
	(33
	,'DQ DUE - FT/MT'
	,'N');

PROMPT ************************************************************************
PROMPT Update obligation type description in the OBLIGATION_TYPES table
PROMPT ************************************************************************
	
UPDATE obligation_types 
SET obligation_text = 'TIME EXPIRED FOR PAYMENT OF DQ/LQ FEES'
WHERE obligation_type = 21;

PROMPT ************************************************************************
PROMPT Delete event 756 entry from OBLIGATION_EVENTS table
PROMPT ************************************************************************

DELETE FROM obligation_events WHERE event_id = '756';
	
PROMPT ************************************************************************
PROMPT Insert new obligation_rules into the OBLIGATION_RULES table
PROMPT ************************************************************************

DELETE FROM obligation_rules WHERE event_id = '756';

INSERT INTO obligation_rules
VALUES
	(1
	,'A'
	,'D'
	,null
	,null
	,'196S');
	
INSERT INTO obligation_rules
VALUES
	(32
	,'M'
	,'C'
	,17
	,null
	,'196S');
	
INSERT INTO obligation_rules
VALUES
	(1
	,'A'
	,'D'
	,null
	,null
	,'196F');
	
INSERT INTO obligation_rules
VALUES
	(33
	,'M'
	,'C'
	,31
	,null
	,'196F');
	
INSERT INTO obligation_rules
VALUES
	(1
	,'A'
	,'D'
	,null
	,null
	,'196M');
	
INSERT INTO obligation_rules
VALUES
	(33
	,'M'
	,'C'
	,31
	,null
	,'196M');
	
PROMPT ************************************************************************
PROMPT Update BMS Tasks
PROMPT ************************************************************************

UPDATE tasks
SET task_description = 'Dispatch directions questionnaire'
WHERE task_number = 'JH77';

UPDATE tasks
SET task_description = 'Dispatch directions questionnaire'
WHERE task_number = 'DR56';

UPDATE tasks
SET task_description = 'Despatch directions questionnaire'
WHERE task_number = 'BC040';

UPDATE tasks
SET task_description = 'Filing directions questionnaire'
WHERE task_number = 'JH59';

UPDATE tasks
SET task_description = 'Directions questionnaire filed'
WHERE task_number = 'DR41';

PROMPT ************************************************************************
PROMPT Obligation Type 21 Notes Reference Data in CCBC_REF_CODES table
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('DQ'
	,'DMS_TYPE_21_NOTES'
	,'FILING OF YOUR DIRECTIONS QUESTIONNAIRE');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('LQ'
	,'DMS_TYPE_21_NOTES'
	,'FILING OF YOUR LISTING QUESTIONNAIRE');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('AC'
	,'DMS_TYPE_21_NOTES'
	,'ALLOCATION OF YOUR CLAIM');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('ACC'
	,'DMS_TYPE_21_NOTES'
	,'ALLOCATION OF YOUR COUNTERCLAIM');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('LC'
	,'DMS_TYPE_21_NOTES'
	,'LISTING OF YOUR CLAIM');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('LCC'
	,'DMS_TYPE_21_NOTES'
	,'LISTING OF YOUR COUNTERCLAIM');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('HC'
	,'DMS_TYPE_21_NOTES'
	,'CLAIM HEARING FEE');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('HCC'
	,'DMS_TYPE_21_NOTES'
	,'COUNTERCLAIM HEARING FEE');
	
PROMPT ************************************************************************
PROMPT Update Oracle Report Content in OUTPUT_DETAILS and DOCUMENT_VARIABLES
PROMPT ************************************************************************

UPDATE output_details od 
SET od.item1 = REPLACE(od.item1, 'Allocation','Directions')
WHERE od.order_type_id IN ('JREF6','JREF19','JREF20','JREF21')
AND od.code = 1;

UPDATE output_details od 
SET od.item1 = REPLACE(od.item1, 'Allocation','Directions')
WHERE od.order_type_id = 'JREF12'
AND od.code = 2;

UPDATE document_variables dv
SET dv.select_clause = REPLACE(dv.select_clause, 'Allocation','Directions')
WHERE dv.code = 'CMF_AQ_FEE_NOT_PAID_NAME';

UPDATE document_variables dv
set dv.select_clause = REPLACE(dv.select_clause, 'allocation','directions')
WHERE dv.code = 'CMF_AQ_FEE_NOT_PAID_NAME';

PROMPT ************************************************************************
PROMPT Insert new BMS Tasks into TASKS table
PROMPT ************************************************************************

INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('BC068'
	,'B'
	,'Filing a directions questionnaire'
	,'E');
	
COMMIT;

SPOOL OFF