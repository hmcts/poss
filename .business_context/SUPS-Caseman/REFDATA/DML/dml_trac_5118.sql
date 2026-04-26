WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script inserts three new rejection reasons into the
|                   caseman reject_reasons table to support the validation of
|                   defence events supplied from MCOL
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

SPOOL dml_trac_5118.log

-- Set audit context
CALL sys.set_sups_app_ctx('support','0','defence_reject_reasons');

PROMPT ************************************************************************
PROMPT Insert three new reject_reasons into REJECT_REASON table
PROMPT ************************************************************************
INSERT INTO reject_reasons rr
    (
    rr.reject_code, 
    rr.reject_text
    )
VALUES
    (
    93,
    'Active judgment found for defendant'
    );
INSERT INTO reject_reasons rr
    (
    rr.reject_code, 
    rr.reject_text
    )
VALUES
    (
    94,
    'Case status is ''STAYED'''
    );
INSERT INTO reject_reasons rr
    (
    rr.reject_code, 
    rr.reject_text
    )
VALUES
    (
    95,
    'Defendant Id must be blank when Type is ''D'''
    );
INSERT INTO reject_reasons rr
    (
    rr.reject_code, 
    rr.reject_text
    )
VALUES
    (
    96,
    'Invalid Defence Event Type'
    );
    
-- add new report
INSERT INTO report_sequences
    (
    form_name, 
    last_seqno, 
    last_time_stamp
    )
VALUES
    (
    'CPT_ISSUE',
    1,
    NULL
    );
    
    
COMMIT;

SPOOL OFF

EXIT
