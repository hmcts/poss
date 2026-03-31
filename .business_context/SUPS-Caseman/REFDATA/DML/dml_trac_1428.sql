WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Correcting reference data issue in the CHANGED_EVENTS table.
|		        For a number of events, the start date (release_date) is after the
|		        end date (final_date).
|
|                 For specific events, the release_date is set to 01/01/1900 where the
|                 release_date is currently 01/01/2000.
|                 In addition, the final_date is set to 31/12/2100 where the final_date
|		is currently 31/12/2000.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_1428.log

PROMPT ************************************************************************
PROMPT Update table CHANGED_EVENTS set the release_date to 01/01/1900
PROMPT ************************************************************************

UPDATE changed_events ce
SET ce.release_date = TO_DATE('01-Jan-1900','DD-Mon-YYYY')
WHERE ce.std_event_id IN (20, 30, 134, 191, 328, 334, 335, 336, 440, 441, 442, 450, 452, 470, 471, 472, 473, 861, 928)
AND ce.release_date = TO_DATE('01-Jan-2000','DD-Mon-YYYY');

PROMPT ************************************************************************
PROMPT Updated table CHANGED_EVENTS
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update table CHANGED_EVENTS set the final_date to 31/12/2100
PROMPT ************************************************************************

UPDATE changed_events ce
SET ce.final_date = TO_DATE('31-Dec-2100','DD-Mon-YYYY')
WHERE ce.std_event_id IN (20, 30, 134, 191, 328, 334, 335, 336, 440, 441, 442, 450, 452, 470, 471, 472, 473, 861, 928)
AND ce.final_date = TO_DATE('31-Dec-2000','DD-Mon-YYYY');

PROMPT ************************************************************************
PROMPT Updated table CHANGED_EVENTS
PROMPT ************************************************************************

COMMIT;

SPOOL OFF

EXIT