WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds new column to the CASES table to hold the Track
|				  (small claims, fast or multi track).  Same column also
|				  added to the CASE_EVENTS table.  RFS 3719
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
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_4763_b.log

PROMPT ************************************************************************
PROMPT Alter Table CASES
PROMPT ************************************************************************

ALTER TABLE cases
ADD track VARCHAR2(12);

COMMENT ON COLUMN cases.track
   IS 'Holds the track that the case is provisionally allocated to';

PROMPT ************************************************************************
PROMPT CASES Table altered
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Alter Table CASE_EVENTS
PROMPT ************************************************************************

ALTER TABLE case_events
ADD track VARCHAR2(12);

COMMENT ON COLUMN case_events.track
   IS 'Holds the track associated with the case event';

PROMPT ************************************************************************
PROMPT CASE_EVENTS Table altered
PROMPT ************************************************************************

SPOOL OFF
