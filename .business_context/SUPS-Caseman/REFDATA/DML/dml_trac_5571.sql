WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : dml_trac_5571.sql
| SYNOPSIS      : Updates the Welsh Translation Cover letter content for Oracle
|				  Reports.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) CGI.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5571.log

PROMPT ************************************************************************
PROMPT Update Welsh Translation Cover letter contents
PROMPT ************************************************************************

UPDATE	output_details
SET 	item1 = 'www.gov.uk'
WHERE 	order_type_id = 'WELSH_COVER_LETTER'
AND 	code = 2;
	
COMMIT;