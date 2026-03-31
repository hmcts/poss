WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This adds the new SDT BMS codes to the tasks table
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

SPOOL dml_trac_5102.log

PROMPT ************************************************************************
PROMPT Insert new BMS Tasks into the TASKS table
PROMPT ************************************************************************

INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC073',
    'B',
    'Acknowledgment of service filed via SDT',
    'E'
    );
	
INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC074',
    'B',
    'Entry of defence and counterclaim via SDT - MCOL only',
    'E'
    );
	
INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC075',
    'B',
    'Receipt of defence via SDT',
    'E'
    );
	
INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC076',
    'B',
    'Entry of defence and counterclaim via SDT',
    'E'
    );
	
INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC077',
    'B',
    'Receipt of (Part) Admission via SDT',
    'E'
    );
	
INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC078',
    'B',
    'Notice of change of address/withdrawal via SDT - MCOL only',
    'E'
    );
	
INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC079',
    'B',
    'Notice of change of address/withdrawal via SDT',
    'E'
    );
	
INSERT INTO TASKS
    (
    task_number, 
    task_type, 
    task_description, 
    action_event_ind
    )
VALUES
    (
    'BC080',
    'B',
    'Paid in full notification via SDT',
    'E'
    );
	
PROMPT ************************************************************************
PROMPT TASKS table updated
PROMPT ************************************************************************

COMMIT;

SPOOL OFF