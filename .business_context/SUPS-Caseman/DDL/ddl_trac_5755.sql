WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      :  Indexes to improve the BMS report
|
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2015 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Indexes to improve the document cleardown process
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_5755.log

PROMPT ************************************************************************
PROMPT Create Indexes 
PROMPT ************************************************************************

CREATE INDEX cman.case_events_ix17 ON cman.case_events
    (creating_court
	,event_date) ONLINE;
	
CREATE INDEX cman.co_events_ix10 ON cman.co_events
    (creating_court
	,event_date) ONLINE;

CREATE INDEX cman.task_counts_ix6 ON cman.task_counts
    (creating_court
	,task_date) ONLINE;

PROMPT ************************************************************************
PROMPT Indexes created
PROMPT ************************************************************************

SPOOL OFF