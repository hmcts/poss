WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/ddl_trac_4927.sql $:
|
| SYNOPSIS      : Modify size of warrent_number column on load_warrants and
|                 reject_warrants tables.
|
|
| $Author: ridoutp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2013 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Part of case renumbering changes.
|
|---------------------------------------------------------------------------------
|
| $Rev: 9953 $:          Revision of last commit
| $Date: 2013-08-28 10:32:27 +0100 (Wed, 28 Aug 2013) $:         Date of last commit
| $Id: ddl_trac_4927.sql 9953 2013-08-28 09:32:27Z ridoutp $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_4927.log

PROMPT ************************************************************************
PROMPT Modify Table LOAD_WARRANTS - Increase warrant_number column size
PROMPT ************************************************************************

ALTER TABLE load_warrants
MODIFY      (warrant_number VARCHAR2(8));

PROMPT ************************************************************************
PROMPT Table LOAD_WARRANTS altered
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Modify Table REJECT_WARRANTS - Increase warrant_number column size
PROMPT ************************************************************************

ALTER TABLE reject_warrants
MODIFY      (warrant_number VARCHAR2(8));

PROMPT ************************************************************************
PROMPT Table REJECT_WARRANTS altered
PROMPT ************************************************************************

SPOOL OFF
