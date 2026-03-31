WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_4157.sql $:
|
| SYNOPSIS      : Updates the RETURN_CODES table so that for FN,NP and NV the return class is 1 and not U.
|
|
|                 As the return class is not set correctly, they do not appear on the outstanding warrant list.
|
| $Author: mistrynl $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : This is a pre-requisite for the live CaseMan Defect #2050.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
| $Id: dml_trac_891.sql 3319 2009-07-10 09:33:12Z vincentcp $:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4157.log

PROMPT ************************************************************************
PROMPT Update table RETURN_CODES for return_class reference data change
PROMPT ************************************************************************


UPDATE return_codes rc
SET rc.return_class = '1'
WHERE rc.return_code IN ('FN','NP','NV');

PROMPT ************************************************************************
PROMPT Updated table RETURN_CODES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF

EXIT