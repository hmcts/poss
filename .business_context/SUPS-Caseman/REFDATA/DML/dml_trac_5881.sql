WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes required for the 
|                   introduction of a new Family Enforcement case event D50K 
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

SPOOL dml_trac_5881.log

PROMPT ************************************************************************
PROMPT Inserting into STANDARD_EVENTS table
PROMPT ************************************************************************

INSERT INTO standard_events
(event_id, category, description, database_event, edit_details)
VALUES
(430,'C','D50K ENFORCEMENT APPLICATION','N','O');

PROMPT ************************************************************************
PROMPT Inserting into TASKS table
PROMPT ************************************************************************
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA003','B','Order to attend for questioning (D50K)','E');
	
COMMIT;

SPOOL OFF