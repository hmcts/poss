WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes required for the 
|                   introduction of a new Family Enforcement case event D50K 
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. CGI's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$   Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5885.log

PROMPT ************************************************************************
PROMPT Inserting into ORDER_TYPES table
PROMPT ************************************************************************

INSERT INTO order_types
	(order_id
	,order_description
	,display_order_id
	,document_type
	,legal_description
	,module_name
	,printer_type
	,report_type
	,tray)
VALUES
	('CM_FAMSTATS'
	,'Produce Family Statistics Report'
	,'FSTATS'
	,'N'
	,'Produce Family Statistics Report'
	,'CM_FAMSTATS'
	,'P'
	,'R25'
	,'2');
	
COMMIT;

SPOOL OFF