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
|                   Family Enforcement existing output changes
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

SPOOL dml_trac_5886.log

PROMPT ************************************************************************
PROMPT Inserting into STANDARD_EVENTS table
PROMPT ************************************************************************

INSERT INTO standard_events 
(event_id
,category
,description
,database_event
,addressee
,edit_details)
VALUES
(841
,'A'
,'FULL ORDER ARREARS OF MAINTENANCE (MEBC)'
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
(842
,'A'
,'PRIORITY MAINTENANCE ORDER (MEBC)'
,'N'
,'D'
,'O');

PROMPT ************************************************************************
PROMPT Inserting into CCBC_REF_CODES table
PROMPT ************************************************************************
	
INSERT INTO ccbc_ref_codes
(rv_low_value
,rv_domain
,rv_type)
VALUES
('841'
,'AE_CASE_EVENTS'
,'CG');

INSERT INTO ccbc_ref_codes
(rv_low_value
,rv_domain
,rv_type)
VALUES
('842'
,'AE_CASE_EVENTS'
,'CG');

INSERT INTO ccbc_ref_codes
(rv_low_value
,rv_domain
,rv_meaning)
VALUES
('841'
,'EVENT_AE_TYPE'
,'MN');
	
INSERT INTO ccbc_ref_codes
(rv_low_value
,rv_domain
,rv_meaning)
VALUES
('842'
,'EVENT_AE_TYPE'
,'PM');

PROMPT ************************************************************************
PROMPT Amending into DOCUMENT_VARIABLES table
PROMPT ************************************************************************

UPDATE document_variables dv
SET dv.select_clause = REPLACE(dv.select_clause,'County',''' || DECODE(P_JURISDICTION,''F'',''Family'',''County'') || ''')
WHERE dv.code = 'CMF_NEW_COURT_HEAR';

UPDATE document_variables dv
SET dv.select_clause = REPLACE(dv.select_clause,'County',''' || DECODE(P_JURISDICTION,''F'',''Family'',''County'') || ''')
WHERE dv.code = 'CMF_LAST_COURT_HEAR';

UPDATE document_variables dv
SET dv.select_clause = REPLACE(dv.select_clause,'County Court at',''' || DECODE(P_JURISDICTION,''F'',''Family'',''County'') || '' Court at')
WHERE dv.code = 'CMF_JUDGMENT_COURT';

UPDATE document_variables dv
SET dv.select_clause = REPLACE(dv.select_clause,'County',''' || DECODE(P_JURISDICTION,''F'',''Family'',''County'') || ''')
WHERE dv.code = 'CMF_AE_HRG_VENUE_ADDR';

COMMIT;

SPOOL OFF