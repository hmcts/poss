WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF


/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script creates the modifies the CPT_PRINT_CLAIMS
|                   by icreasing the size of the court_name and court_name_seal
|                   to comply with the single court changes
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. Logica's prior written consent is
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

SPOOL ddl_trac_5278.log

PROMPT ************************************************************************
PROMPT Modify Table PRINT_CLAIMS expand Court Name
PROMPT ************************************************************************

ALTER TABLE CPT_PRINT_CLAIMS
MODIFY (COURT_NAME VARCHAR2(30),
		COURT_NAME_SEAL_1 VARCHAR2(15), 
		COURT_NAME_SEAL_2 VARCHAR2(15));

PROMPT ************************************************************************
PROMPT Table PRINT_CLAIMS modified
PROMPT ************************************************************************

SPOOL OFF
