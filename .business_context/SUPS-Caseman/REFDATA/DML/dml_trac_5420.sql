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
|				  CaseMan BIF Item 8. 
|
| $Author:$       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2015 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
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

SPOOL dml_trac_5420.log

PROMPT ************************************************************************
PROMPT Reference data updates to the CHANGED_EVENTS table
PROMPT ************************************************************************

UPDATE 	changed_events
SET 	event_description = 'N173 NOTICE TO PAY AQ/LQ FEE'
WHERE	std_event_id = 770
AND		release_date = TO_DATE('01-Jan-1900','DD-Mon-YYYY');

UPDATE 	changed_events
SET 	event_description = 'N173 NOTICE TO PAY DQ/LQ FEE'
,		final_date = TRUNC(SYSDATE-1)
WHERE	std_event_id = 770
AND		final_date = TO_DATE('31-Dec-2100','DD-Mon-YYYY');

INSERT INTO changed_events
VALUES 
	(770
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'N173 NOTICE TO PAY LQ FEE');

PROMPT ************************************************************************
PROMPT Update existing events in the STANDARD_EVENTS table
PROMPT ************************************************************************

UPDATE standard_events se
SET se.description = 'N173 NOTICE TO PAY LQ FEE'
WHERE se.event_id = 770;

PROMPT ************************************************************************
PROMPT Update Obligation type 21 options in CCBC_REF_CODES table
PROMPT ************************************************************************

DELETE FROM ccbc_ref_codes 
WHERE rv_domain = 'DMS_TYPE_21_NOTES'
AND rv_low_value = 'DQ';

PROMPT ************************************************************************
PROMPT Update obligation ref data in the OBLIGATION_TYPES table
PROMPT ************************************************************************

UPDATE obligation_types
SET obligation_text = 'TIME EXPIRED FOR PAYMENT OF LQ FEES'
WHERE obligation_type = 21;

COMMIT;

/

SPOOL OFF