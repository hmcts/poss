WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Altering the Reference column on the Warrants table to match
|		        the maximum length of the Reference on the Case_Party_Roles table.
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

SPOOL ddl_trac_3716.log

PROMPT ************************************************************************
PROMPT Alter Table WARRANTS
PROMPT ************************************************************************

ALTER TABLE warrants
MODIFY
(
	reference VARCHAR2(25)
);


PROMPT ************************************************************************
PROMPT WARRANTS Table altered
PROMPT ************************************************************************

COMMIT;

SPOOL OFF