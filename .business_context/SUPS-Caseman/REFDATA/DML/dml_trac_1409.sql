WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_891.sql $:
|
| SYNOPSIS      : Updates the RETURN_CODES table to amend incorrect warrant return
|			code reference data.
|
|                 The return codes DO and FE currently have a class of 'I', but should be '1' (one).
|                 This applies to both the CCBC (335) and global (0) versions of the return code in
|                 the RETURN_CODES table so four records will be updated in total.
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Live USD reference is 520409.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
| $Id: dml_trac_891.sql 3319 2009-07-10 09:33:12Z vincentcp $:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_1409.log

PROMPT ************************************************************************
PROMPT Update table RETURN_CODES for reference data change
PROMPT ************************************************************************

UPDATE 	return_codes rc
SET 	rc.return_class = '1'
WHERE	rc.return_code in ('DO','FE');

PROMPT ************************************************************************
PROMPT Updated table RETURN_CODES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF

EXIT