WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes for the BIF item 4
|                   Bulk Print of EX77 and EX98
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

SPOOL dml_trac_5417.log

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
	('CM_EX77_WE'
	,'Interim Report On Warrant - EX77'
	,'EX77'
	,'N'
	,'Interim Report On Warrant - EX77'
	,'CM_EX77'
	,'5'
	,'R25'
	,'1');
	
PROMPT ************************************************************************
PROMPT Updating ORDER_TYPES table
PROMPT ************************************************************************

UPDATE 	order_types
SET 	printer_type = 'P'
		,tray = '2'
WHERE	order_id = 'CM_EX77';

COMMIT;

SPOOL OFF