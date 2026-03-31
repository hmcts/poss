WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_5721_2.sql $  
|
| SYNOPSIS      :   This script updates protected earnings rates
|
| $Author: vincentcp $         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2015 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. CGI's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision: 12189 $   Revision of last commit
| $Date: 2015-12-16 15:42:57 +0000 (Wed, 16 Dec 2015) $       Date of last commit
| $Id: dml_trac_5721.sql 12189 2015-12-16 15:42:57Z vincentcp $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5721_2.log

PROMPT ************************************************************************
PROMPT Updating PER_DETAILS table
PROMPT ************************************************************************
	
UPDATE 	per_details
SET 	amount_allowed_editable = 'N'
WHERE 	detail_code = 'ADO18';

COMMIT;

SPOOL OFF