WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds new CASE_NUMBER column on Obligations_Purge_Errors table.
|
|                 Change is part of the Scalability enhancements to CaseMan.
|                 This new column is used to store the other half of the 
|				  Obligations primary key (other one being obligations_seq)
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

SPOOL ddl_trac_2616_b.log

PROMPT ************************************************************************
PROMPT Alter Table OBLIGATIONS_PURGE_ERRORS
PROMPT ************************************************************************

ALTER TABLE obligations_purge_errors
ADD case_number VARCHAR2(8 CHAR);

PROMPT ************************************************************************
PROMPT OBLIGATIONS_PURGE_ERRORS Table Altered
PROMPT ************************************************************************

SPOOL OFF
