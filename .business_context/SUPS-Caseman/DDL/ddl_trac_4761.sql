WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds new column to the CASE_EVENTS table to hold the transfer
|				  reason associated with the event (will be used on events 340
|				  and 350).
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

SPOOL ddl_trac_4761.log

PROMPT ************************************************************************
PROMPT Alter Table CASE_EVENTS
PROMPT ************************************************************************

ALTER TABLE case_events
ADD transfer_reason VARCHAR2(20);

COMMENT ON COLUMN case_events.transfer_reason
   IS 'Holds the transfer reason associated with the case event';

PROMPT ************************************************************************
PROMPT CASE_EVENTS Table altered
PROMPT ************************************************************************

SPOOL OFF
