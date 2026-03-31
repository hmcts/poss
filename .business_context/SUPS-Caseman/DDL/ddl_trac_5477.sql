WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script adds a SOLICITOR_FLAG column to the  
|                   DEFENCE_DOC_EVENT table.
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

SPOOL ddl_trac_5477.log
 
PROMPT ************************************************************************
PROMPT adding SOLICITOR_FLAG column to DEFENCE_DOC_EVENT table
PROMPT ************************************************************************ 

ALTER TABLE defence_doc_event
ADD
(solicitor_flag	VARCHAR2(1));

SPOOL OFF

EXIT

