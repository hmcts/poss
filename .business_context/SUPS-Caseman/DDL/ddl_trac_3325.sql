WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Remove the appropriate DDL commands where necessary.
|
|
| $Author$:       kumarat
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Adds an index to the table CASE_EVENTS
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_3325.log

PROMPT ************************************************************************
PROMPT Create Index CASE_EVENTS_IX16 on Table CASE_EVENTS
PROMPT ************************************************************************
CREATE INDEX case_events_ix16 ON case_events
    (crt_code
    ,event_date
    ,stats_module
    );

PROMPT ************************************************************************
PROMPT Index CASE_EVENTS_IX16 on Table CASE_EVENTS created
PROMPT ************************************************************************

SPOOL OFF

