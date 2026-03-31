WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script adds a new column to the MCOL_DATA table with a default
|                   value of SYSDATE for ordering events when transferring to MCOL.
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

SPOOL ddl_trac_5436.log
 
PROMPT ************************************************************************
PROMPT adding TIME_STAMP column to MCOL_DATA table
PROMPT ************************************************************************ 

ALTER TABLE mcol_data
ADD
(time_stamp DATE DEFAULT SYSDATE);

SPOOL OFF

EXIT

