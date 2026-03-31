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
|				  Provisional assessment of costs case events in RFS 3719. 
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

SPOOL dml_trac_4762.log

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
	(395
	,'C'
	,'REQUEST FOR PROVISIONAL ASSESSMENT'
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
	(396
	,'C'
	,'N253A NOTICE OF PROVISIONAL ASSESSMENT'
	,'N'
	,'D'
	,'O');

PROMPT ************************************************************************
PROMPT Insert new case event instigator labels into CCBC_REF_CODES table
PROMPT ************************************************************************
	
INSERT INTO ccbc_ref_codes
	(rv_low_value
    ,rv_domain
    ,rv_meaning)
VALUES
	('395'
    ,'INSTIGATOR_LABEL'
    ,'Select Respondent(s)');

INSERT INTO ccbc_ref_codes
	(rv_low_value
    ,rv_domain
    ,rv_meaning)
VALUES
	('396'
    ,'INSTIGATOR_LABEL'
    ,'Select Respondent(s)');
	
COMMIT;

SPOOL OFF