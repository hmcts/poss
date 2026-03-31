WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:     
|
| SYNOPSIS      : This script corrects variation data incorrectly set as lower case
|				  by CCBC Batch as part of the BIF release.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL trac_5708_data_fix.log

UPDATE 	variations vary
SET    	vary.plaintiff_response = 'NO RESPONSE',
		vary.result             = 'GRANTED'
WHERE 	vary.plaintiff_response = 'no response'
OR	 	vary.result             = 'granted';

COMMIT;

SPOOL OFF