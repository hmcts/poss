WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script updates all CaseMan court reference data to reflect
|				  the latest court opening times. 
|
| $Author:$       Author of last commit
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
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4714.log

BEGIN

	-- Set audit context
	sys.set_sups_app_ctx('support','0','update courts');

	-- All courts to 10:00 - 14:00
	UPDATE personalise p
	SET p.open_from = 36000
		,p.closed_at = 50400
	WHERE p.crt_code IN
		(SELECT c.code
		 FROM courts c
		 WHERE c.sups_centralised_flag = 'Y'
		 AND c.caseman_inservice = 'Y')
	AND p.crt_code NOT IN (335,390,391);

	-- CCMCC Courts to 08:30 - 17:00
	UPDATE personalise p
	SET p.open_from = 30600
		,p.closed_at = 61200
	WHERE p.crt_code IN (390,391);

	-- CCBC to 10:00 - 16:00
	UPDATE personalise p
	SET p.open_from = 36000
		,p.closed_at = 57600
	WHERE p.crt_code = 335;

END;

/

SPOOL OFF