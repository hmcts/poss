WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Schema changes required for Case Numbering including increasing
|				  the size of the MCOL_DATA.WARRANT_NUMBER column from 7 to 8
|				  characters in length and creating a new database sequence to be
|				  used by the new next_warrant_number_sequence function.
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

SPOOL ddl_trac_4908.log

PROMPT ************************************************************************
PROMPT Alter Table MCOL_DATA
PROMPT ************************************************************************

ALTER TABLE
   mcol_data
MODIFY
   warrant_number VARCHAR2(8);

PROMPT ************************************************************************
PROMPT MCOL_DATA Table altered
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create new database sequence
PROMPT ************************************************************************

CREATE SEQUENCE WARRANT_NUMBER_SEQUENCE
  MINVALUE 1
  MAXVALUE 999999999999999999999999999
  START WITH 1
  INCREMENT BY 1
  CACHE 20;

PROMPT ************************************************************************
PROMPT Database sequence created
PROMPT ************************************************************************

SPOOL OFF
