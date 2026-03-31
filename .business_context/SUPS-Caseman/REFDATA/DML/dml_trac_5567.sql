WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : add new judgment reports to file_sequence table 
|
| $Author:$       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5567.log

PROMPT ************************************************************************
PROMPT Inserting new judgment reports into the file_sequence table
PROMPT ************************************************************************

/* generic judgment by default report */
INSERT INTO file_sequences
    (
    report_id, 
    report_sequence, 
    report_occurrence
    )
VALUES
    (
    'BC_PJ_DFS',
    1,
    0
    );
/* generic judgment acceptence report */
INSERT INTO file_sequences
    (
    report_id, 
    report_sequence, 
    report_occurrence
    )
VALUES
    (
    'BC_PJ_ACS',
    1,
    0
    );
/* Anglian judgment by default report */
INSERT INTO file_sequences
    (
    report_id, 
    report_sequence, 
    report_occurrence
    )
VALUES
    (
    'BC_PJ_DFD',
    1,
    0
    );
/* Anglian judgment acceptence report */
INSERT INTO file_sequences
    (
    report_id, 
    report_sequence, 
    report_occurrence
    )
VALUES
    (
    'BC_PJ_ACD',
    1,
    0
    );        

COMMIT;

SPOOL OFF