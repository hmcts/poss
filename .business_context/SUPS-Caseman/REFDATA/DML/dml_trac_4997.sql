WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script provides all the reference data updates required for
|				  the the CCBC SDT changes. 
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

SPOOL dml_trac_4997.log

CALL sys.set_sups_app_ctx('support','0','ccbc sdt');

PROMPT ************************************************************************
PROMPT Reference data updates to the CHANGED_EVENTS table
PROMPT ************************************************************************

INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 74;

INSERT INTO changed_events
VALUES 
	(74
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'CASE DISCONTINUED');
	
INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 76;

INSERT INTO changed_events
VALUES 
	(76
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'CASE SETTLED (POST-JGMT)');

PROMPT ************************************************************************
PROMPT Update existing events in the STANDARD_EVENTS table
PROMPT ************************************************************************

UPDATE standard_events se
SET se.category = 'c'
WHERE se.event_id = 75;

UPDATE standard_events se
SET se.description = 'CASE DISCONTINUED'
WHERE se.event_id = 74;

UPDATE standard_events se
SET se.description = 'CASE SETTLED (POST-JGMT)'
WHERE se.event_id = 76;

PROMPT ************************************************************************
PROMPT Update case event case status updates in CCBC_REF_CODES table
PROMPT ************************************************************************

UPDATE ccbc_ref_codes c
SET c.rv_iit_code_1 = 'SETTLED/WDRN'
WHERE c.rv_domain = 'EVENT_SETTING_CASE_STATUS'
AND	c.rv_low_value = '74';

UPDATE ccbc_ref_codes c
SET c.rv_iit_code_1 = 'SETTLED'
WHERE c.rv_domain = 'EVENT_SETTING_CASE_STATUS'
AND	c.rv_low_value = '76';

COMMIT;

/

SPOOL OFF