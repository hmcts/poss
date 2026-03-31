WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script updates the PAYMENT_SUMMARY table to reduce the court
|				  balances following the archiving of active payments at these
|				  courts.  Adjustments supplied by MoJ.
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

SPOOL dml_trac_4573_b.log

PROMPT ************************************************************************
PROMPT Update PAYMENT_SUMMARY table
PROMPT ************************************************************************

UPDATE 	payment_summary ps
SET		ps.cheque = ps.cheque - 30
		,ps.ordinary = ps.ordinary - 45.45
WHERE	ps.admin_court_code = 184
AND		ps.report_id LIKE 'B/F%';

UPDATE 	payment_summary ps
SET		ps.jgmt1000 = ps.jgmt1000 - 152.25
		,ps.ordinary = ps.ordinary - 150
WHERE	ps.admin_court_code = 267
AND		ps.report_id LIKE 'B/F%';

UPDATE 	payment_summary ps
SET		ps.miscellaneous = ps.miscellaneous - 250
WHERE	ps.admin_court_code = 305
AND		ps.report_id LIKE 'B/F%';

UPDATE 	payment_summary ps
SET		ps.ordinary = ps.ordinary - 442.25
WHERE	ps.admin_court_code = 321
AND		ps.report_id LIKE 'B/F%';
	 
PROMPT ************************************************************************
PROMPT Updated table PAYMENT_SUMMARY
PROMPT ************************************************************************

COMMIT;

SPOOL OFF