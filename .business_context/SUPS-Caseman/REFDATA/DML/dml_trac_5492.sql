/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : dml_trac_5492.sql
| SYNOPSIS      : Adds four new events to cdr_mcol_event_mapping
|                 to support te BIF changes  
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) CGI.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/


PROMPT ************************************************************************
PROMPT Insert cdr_mcol_event_mapping reference data for BIF Changes
PROMPT ************************************************************************

INSERT INTO cdr_mcol_event_mapping
    (
    std_event_id, 
    mcol_type
    )
VALUES
    (
    103,
    'LC'
    );
    
INSERT INTO cdr_mcol_event_mapping
    (
    std_event_id, 
    mcol_type
    )
VALUES
    (
    196,
	'LD'
    );
    
INSERT INTO cdr_mcol_event_mapping
    (
    std_event_id, 
    mcol_type
    )
VALUES
    (
    197,
	'LE'
    );
INSERT INTO cdr_mcol_event_mapping
    (
    std_event_id, 
    mcol_type
    )
VALUES
    (
    333,
    'LF'
    );

COMMIT;

EXIT;