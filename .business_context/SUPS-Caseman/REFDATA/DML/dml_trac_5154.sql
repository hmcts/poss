WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_5025.sql $:
|
| SYNOPSIS      : Reference data changes for the CaseMan TCE release
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

SPOOL dml_trac_5154.log

PROMPT ************************************************************************
PROMPT Update table RETURN_CODES with revised wording for TCE release
PROMPT ************************************************************************

CALL sys.set_sups_app_ctx('support','0','trac 5154');

UPDATE   return_codes
SET   return_code_description = 'The bailiff has visited the debtor''s address and spoken with the debtor who has refused to allow the bailiff peaceful entry. '
|| 'The bailiff manager has also visited the address and met with a similar response. The debtor is entitled to refuse the bailiff entry to domestic premises and in '
|| 'the circumstances, the bailiff has not had an opportunity to establish whether the debtor has goods which can be taken into control. The bailiff can take no further '
|| 'action unless you are able to provide further information to re-issue the warrant (for example, giving a description and location of other goods which belong to '
|| 'the debtor). You may have to pay a fee to re-issue the warrant.'
WHERE	return_code = '121';
							   
PROMPT ************************************************************************
PROMPT Updated table RETURN_CODES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF