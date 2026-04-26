WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_5297.sql $:
|
| SYNOPSIS      : Reference data updates to correct court fee bands
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2013 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : This data will be used as reference data.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5297.log

PROMPT ************************************************************************
PROMPT Update table CCBC_REF_CODES to update court fee bands
PROMPT ************************************************************************

UPDATE 	ccbc_ref_codes
SET 	rv_high_value = '20000'
WHERE	rv_low_value = '300'
AND		rv_domain = 'COURT_FEE_BAND';

PROMPT ************************************************************************
PROMPT Updated table CCBC_REF_CODES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF