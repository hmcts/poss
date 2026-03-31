WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script inserts two new rejection reasons into the
|                   caseman reject_reasons table to support the validation of
|                   set_aside_requests supplied from MCOL
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

SPOOL dml_trac_5461.log

-- Set audit context
CALL sys.set_sups_app_ctx('support','0','defence_reject_reasons');

PROMPT ************************************************************************
PROMPT Insert two new reject_reasons for BIF changes into REJECT_REASON table
PROMPT ************************************************************************
INSERT INTO reject_reasons rr
    (
    rr.reject_code, 
    rr.reject_text
    )
VALUES
    (
    97,
    'Judgment status is not active or VARIED'
    );
INSERT INTO reject_reasons rr
    (
    rr.reject_code, 
    rr.reject_text
    )
VALUES
    (
    98,
    'Application to set aside is already applied for or granted'
    );
    
 INSERT INTO reject_reasons rr
    (
    rr.reject_code, 
    rr.reject_text
    )
VALUES
    (
    99,
    'missing MCOL Reference'
    );   
	    
 -- add new order types for set_aside applications
 
 INSERT INTO order_types
    (
    order_id, 
    order_description, 
    display_order_id, 
    document_type, 
    legal_description,
    module_name, 
    printer_type,
    report_type, 
    tray
    )
VALUES
    (
    'CCBC_N244',
    'Application to set aside judgment',
    'N244',
    'O',
    'Application to set aside judgment',
    'CCBC_N244',
    'D',
    'R25',
    2
    );
 
INSERT INTO order_types
    (
    order_id, 
    order_description, 
    display_order_id, 
    document_type, 
    legal_description,
    module_name, 
    printer_type,
    report_type, 
    tray
    )
VALUES
    (
    'CCBC_N9SDT',
    'Acknowledgment of service',
    'N9SDT',
    'O',
    'Acknowledgment of service',
    'CCBC_N9SDT',
    'D',
    'R25',
    2
    );
    
INSERT INTO order_types
    (
    order_id, 
    order_description, 
    display_order_id, 
    document_type, 
    legal_description,
    module_name, 
    printer_type,
    report_type, 
    tray
    )
VALUES
    (
    'CCBC_N9A',
    'Form of admission (specified amount)',
    'N9A',
    'O',
    'Form of admission (specified amount)',
    'CCBC_N9A',
    'D',
    'R25',
    2
    );

INSERT INTO order_types
    (
    order_id, 
    order_description, 
    display_order_id, 
    document_type, 
    legal_description,
    module_name, 
    printer_type,
    report_type, 
    tray
    )
VALUES
    (
    'CCBC_N9B',
    'Defence and Counterclaim (specified amount)',
    'N9B',
    'O',
    'Defence and Counterclaim (specified amount)',
    'CCBC_N9B',
    'D',
    'R25',
    2
    );
    
COMMIT;

SPOOL OFF

EXIT
