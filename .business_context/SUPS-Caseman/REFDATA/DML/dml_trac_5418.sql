WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes for the BIF item 5
|                   (Mediation).
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

SPOOL dml_trac_5418.log

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
	(541
	,'C'
	,'REFERRED TO MEDIATION (PRE ALLOCATION)'
	,'N'
	,'Y'
	,'O');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(542
	,'C'
	,'REFERRED TO MEDIATION (POST ALLOCATION)'
	,'N'
	,'Y'
	,'O');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(543
	,'C'
	,'MEDIATION TELEPHONE CALL OUT'
	,'N'
	,'Y'
	,'M');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(544
	,'C'
	,'MEDIATION TELEPHONE CALL IN'
	,'N'
	,'Y'
	,'M');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(545
	,'C'
	,'MEDIATION EMAIL RECEIVED'
	,'N'
	,'Y'
	,'M');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(546
	,'C'
	,'MEDIATION APPOINTMENT BOOKED'
	,'N'
	,'Y'
	,'N');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(547
	,'C'
	,'SETTLED AT MEDIATION'
	,'N'
	,'Y'
	,'N');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(548
	,'C'
	,'NOT SETTLED AT MEDIATION'
	,'N'
	,'Y'
	,'N');
	
INSERT INTO standard_events
	(event_id
	,category
	,description
	,database_event
	,record_card
	,edit_details)
VALUES
	(549
	,'C'
	,'MEDIATION NOT CONDUCTED'
	,'N'
	,'Y'
	,'N');
	
PROMPT ************************************************************************
PROMPT Inserting into TASKS table
PROMPT ************************************************************************

INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME1'
	,'B'
	,'REFERRED TO MEDIATION (PRE ALLOCATION)'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC1'
	,'B'
	,'REFERRED TO MEDIATION (PRE ALLOCATION)'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME2'
	,'B'
	,'REFERRED TO MEDIATION (POST ALLOCATION)'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC2'
	,'B'
	,'REFERRED TO MEDIATION (POST ALLOCATION)'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME3'
	,'B'
	,'MEDIATION TELEPHONE CALL OUT'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC3'
	,'B'
	,'MEDIATION TELEPHONE CALL OUT'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME4'
	,'B'
	,'MEDIATION TELEPHONE CALL IN'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC4'
	,'B'
	,'MEDIATION TELEPHONE CALL IN'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME5'
	,'B'
	,'MEDIATION EMAIL RECEIVED'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC5'
	,'B'
	,'MEDIATION EMAIL RECEIVED'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME6'
	,'B'
	,'MEDIATION APPOINTMENT BOOKED'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC6'
	,'B'
	,'MEDIATION APPOINTMENT BOOKED'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME7'
	,'B'
	,'SETTLED AT MEDIATION'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC7'
	,'B'
	,'SETTLED AT MEDIATION'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME8'
	,'B'
	,'NOT SETTLED AT MEDIATION'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC8'
	,'B'
	,'NOT SETTLED AT MEDIATION'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('ME9'
	,'B'
	,'MEDIATION NOT CONDUCTED'
	,'E');
	
INSERT INTO tasks
	(task_number
	,task_type
	,task_description
	,action_event_ind)
VALUES
	('MC9'
	,'B'
	,'MEDIATION NOT CONDUCTED'
	,'E');
	
PROMPT ************************************************************************
PROMPT Inserting into ORDER_TYPES table
PROMPT ************************************************************************

INSERT INTO order_types
	(order_id
	,order_description
	,display_order_id
	,document_type
	,legal_description
	,module_name
	,printer_type
	,report_type
	,tray)
VALUES
	('CM_MED_STATS'
	,'Produce Mediation Statistics Report'
	,'MSTATS'
	,'N'
	,'Produce Mediation Statistics Report'
	,'CM_MED_STATS'
	,'P'
	,'R25'
	,'2');
	
PROMPT ************************************************************************
PROMPT Inserting into CCBC_REF_CODES table
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('1'
	,'CASE_EVT_546'
	,'COMPANY -V- COMPANY');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('2'
	,'CASE_EVT_546'
	,'COMPANY -V- LIP');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('3'
	,'CASE_EVT_546'
	,'LIP -V- COMPANY');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('4'
	,'CASE_EVT_546'
	,'LIP -V- LIP');

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('1'
	,'CASE_EVT_548'
	,'PARTIES TOO FAR APART');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('2'
	,'CASE_EVT_548'
	,'NOT IN GOOD FAITH');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('3'
	,'CASE_EVT_548'
	,'NO AUTHORITY TO GO FURTHER');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('4'
	,'CASE_EVT_548'
	,'FURTHER EVIDENCE REQUIRED');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('5'
	,'CASE_EVT_548'
	,'SETTLEMENT BREAK DOWN');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('6'
	,'CASE_EVT_548'
	,'WRONG PARTY');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('7'
	,'CASE_EVT_548'
	,'INAPPROPRIATE CASE');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('8'
	,'CASE_EVT_548'
	,'UNKNOWN ISSUES RAISED');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('1'
	,'CASE_EVT_549'
	,'NOT ATTENDED - PARTY/IES NOT CONTACTABLE');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('2'
	,'CASE_EVT_549'
	,'NOT ATTENDED - PARTY/IES NOT INFORMED');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('3'
	,'CASE_EVT_549'
	,'CANCELLED - ADMIN ERROR');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('4'
	,'CASE_EVT_549'
	,'CANCELLED BY PARTY/IES');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('5'
	,'CASE_EVT_549'
	,'CANCELLED - COURT ORDER');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('6'
	,'CASE_EVT_549'
	,'ABANDONED - ETHICAL REASONS');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('7'
	,'CASE_EVT_549'
	,'ABANDONED BY PARTY/IES');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('8'
	,'CASE_EVT_549'
	,'ABANDONED - BEHAVIOUR OF PARTY/IES');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('9'
	,'CASE_EVT_549'
	,'ABANDONED - LOST CONTACT WITH PARTY/IES');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('10'
	,'CASE_EVT_549'
	,'ABANDONED - NO AUTHORITY');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('11'
	,'CASE_EVT_549'
	,'ABANDONED - PARTY/IES NOT AVAILABLE');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('12'
	,'CASE_EVT_549'
	,'ABANDONED - PARTY/IES DO NOT ACCEPT TERMS');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('13'
	,'CASE_EVT_549'
	,'ABANDONED - NOT SUITABLE');		

COMMIT;

SPOOL OFF