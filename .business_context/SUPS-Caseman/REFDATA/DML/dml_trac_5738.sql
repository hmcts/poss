WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes for the case party
|                   type TRUSTEE 
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2016 CGI Limited.
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

SPOOL dml_trac_5738.log

CALL sys.set_sups_app_ctx('support','0','Trac 5738');

PROMPT ************************************************************************
PROMPT Inserting into PARTY_ROLES table
PROMPT ************************************************************************

INSERT INTO party_roles
	(party_role_code
	,party_role_description
	,reporting_role_code)
VALUES
	('TRUSTEE'
	,'Trustee'
	,'OTHER');
	
COMMIT;

SPOOL OFF