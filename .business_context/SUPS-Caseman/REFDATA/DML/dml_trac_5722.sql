WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes for the new charging
|                   order case event. 
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

SPOOL dml_trac_5722.log

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
	(445
	,'C'
	,'PARTY CONTESTS INTERIM CHARGING ORDER'
	,'N'
	,'Y'
	,'M');
	
PROMPT ************************************************************************
PROMPT Inserting into PRE_REQ_EVENTS table
PROMPT ************************************************************************
	
INSERT INTO pre_req_events
	(pre_req_event_id1
	,def_dependant
	,std_event_id)
VALUES
	(440
	,'Y'
	,445);
	
PROMPT ************************************************************************
PROMPT Inserting into CCBC_REF_CODES table
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'PAID');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'STRUCK OUT');

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'SETTLED');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'WITHDRAWN');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'WRITTEN OFF');

INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'SETTLED/WDRN');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'DISCONTINUED');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'STAYED');
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
	,rv_domain
	,rv_meaning)
VALUES
	('445'
	,'EVT_PRECONDIT_NOT_CASE_STATUS'
	,'NOT SERVED');
	
PROMPT ************************************************************************
PROMPT Delete event 440 entries from the OBLIGATION_EVENTS table
PROMPT ************************************************************************
	
DELETE FROM obligation_events WHERE event_id = '440';

PROMPT ************************************************************************
PROMPT Inserting into OBLIGATION_RULES table
PROMPT ************************************************************************
	
INSERT INTO obligation_rules
	(obligation_type
	,mechanism
	,action
	,default_days
	,event_id)
VALUES
	(14
	,'M'
	,'C'
	,49
	,'440');
	
COMMIT;

SPOOL OFF