WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Script to update a row on the DOCUMENT_VARIABLES table so the 
|                 query used by several Oracle Reports doesn't cause a full table 
|                 scan of the GIVEN_ADDRESSES table.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
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

SPOOL dml_trac_3329.log

PROMPT ************************************************************************
PROMPT Update the reference data on the Document Variables table
PROMPT ************************************************************************

UPDATE document_variables dv
SET dv.select_clause = 'SUPS_REPORTS_PACK.SUPERINITCAP(a.NAME)'
WHERE dv.code = 'CO_DEBT_CREDITOR';

COMMIT;

SPOOL OFF