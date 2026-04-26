WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script adds a new column to the AE_EVENTS table to store 
|                   the AE Start of Day reference.  Index also added for new column
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

SPOOL ddl_trac_5430.log
 
PROMPT ************************************************************************
PROMPT adding AE Start of Day reference column to AE_EVENTS table
PROMPT ************************************************************************ 

ALTER TABLE ae_events
ADD
(sod_reference	NUMBER);

PROMPT ************************************************************************
PROMPT Adding indexes to AE_EVENTS
PROMPT ************************************************************************	

CREATE INDEX ae_events_fx4 ON ae_events
    (NVL(sod_reference, -1 ));

SPOOL OFF