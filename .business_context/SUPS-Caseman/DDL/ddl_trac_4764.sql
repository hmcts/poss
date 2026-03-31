WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds new column to the CASES table to hold the preferred court code.
|				  RFS 3719
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

SPOOL ddl_trac_4764.log

PROMPT ************************************************************************
PROMPT Alter Table CASES
PROMPT ************************************************************************

ALTER TABLE cases
ADD pref_court_code NUMBER(3);

COMMENT ON COLUMN cases.pref_court_code
   IS 'The preferred court code for the case';

PROMPT ************************************************************************
PROMPT CASES Table altered
PROMPT ************************************************************************

SPOOL OFF
