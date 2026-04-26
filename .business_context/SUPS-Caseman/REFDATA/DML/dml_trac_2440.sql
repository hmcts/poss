WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Updating the category of a list of AE Events normally created
|		        automatically by CAPS to prevent them from being entered 
|		        manually via the AE Events screen.
|
|                         To make the events non enterable, the category must be changed
|                         to lower case in the STANDARD_EVENTS table.
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

SPOOL dml_trac_2440.log

PROMPT ************************************************************************
PROMPT Update table STANDARD_EVENTS to mark AE CAPS events as non enterable
PROMPT ************************************************************************

UPDATE standard_events SET category = 'e' WHERE event_id = 822;
UPDATE standard_events SET category = 'a' WHERE event_id = 824;
UPDATE standard_events SET category = 'a' WHERE event_id = 825;
UPDATE standard_events SET category = 'a' WHERE event_id = 826;
UPDATE standard_events SET category = 'a' WHERE event_id = 832;
UPDATE standard_events SET category = 'a' WHERE event_id = 835;
UPDATE standard_events SET category = 'a' WHERE event_id = 850;

PROMPT ************************************************************************
PROMPT Updated table STANDARD_EVENTS
PROMPT ************************************************************************

COMMIT;

SPOOL OFF

EXIT