WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: $:
|
| SYNOPSIS      : Warrant Return code reference data update
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2015 CGI UK Limited.
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

SPOOL dml_trac_5536.log

PROMPT ************************************************************************
PROMPT Update table RETURN_CODES 
PROMPT ************************************************************************

CALL sys.set_sups_app_ctx('support','0','trac 5536');

UPDATE  return_codes
SET   	return_code_description = 'The bailiff has taken control of goods belonging to the debtor. The bailiff is entitled to remove and sell the goods if the debtor '
|| 'does not pay. If the proceeds of sale do not cover the costs of removal and sale you are liable for the shortfall. The goods taken into control are:'
,		return_code_summary = 'TAKING CONTROL (WITH THE BAILIFF)'
WHERE	return_code = 'AB';

UPDATE  return_codes
SET  	return_code_description = 'The debtor has made an application for the warrant to be suspended or varied: if you have not already received a copy of the application '
|| 'one will be sent to you shortly.'
,		return_code_summary = 'LEVY/APPLICATION TO SUSPEND OR VARY: CONTROL WARRANT'
WHERE	return_code = 'AE';

UPDATE  return_codes
SET   	return_code_description = 'The debtor has made an application for judgment to be set aside: if you have not already received a copy of the application one will be '
|| 'sent to you shortly.'
,		return_code_summary = 'TAKING CONTROL/APPLICATION TO SET ASIDE JUDGMENT: CONTROL WARRANT'
WHERE	return_code = 'AD';

UPDATE  return_codes
SET   	return_code_description = 'The application about which you have already been notified was unsuccessful. If you have not yet received a copy of the court order, one '
|| 'will be sent to you shortly. The bailiff will continue to execute the warrant.'
WHERE	return_code = 'AM';

UPDATE  return_codes
SET   	return_code_description = 'The claim about which you have already been notified was unsuccessful. If you have not yet received a copy of the court order, one '
|| 'will be sent to you shortly. The bailiff will continue to execute the warrant.'
WHERE	return_code = 'AN';

UPDATE	return_codes
SET		current_return = 'N'
,		user_list = 'N'
WHERE	return_code = 'AG';

UPDATE	return_codes
SET   	return_code_description = 'The bailiff has taken control of goods belonging to the debtor. We require you now to provide confirmation of indemnity for the costs of removal '
|| 'and sale should the proceeds of sale be insufficient. If you do not provide the indemnity within 14 days, the warrant will be filed away and you may have to pay a fee '
|| 'to re-issue it. The goods taken into control are:'
WHERE	return_code = 'AF';

PROMPT ************************************************************************
PROMPT Updated table RETURN_CODES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF