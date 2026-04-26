WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds new column to the CASES table to hold the docketed/reserved
|				  Judge name for the case.  RFS 3719
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

SPOOL ddl_trac_4768.log

PROMPT ************************************************************************
PROMPT Alter Table CASES
PROMPT ************************************************************************

ALTER TABLE cases
ADD judge VARCHAR2(70);

COMMENT ON COLUMN cases.judge
   IS 'Holds the docketed or reserved judge name for the case';

PROMPT ************************************************************************
PROMPT CASES Table altered
PROMPT ************************************************************************

SPOOL OFF
