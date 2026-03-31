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
|                   Family Enforcement output FE17
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

SPOOL dml_trac_5886_fe17.log

PROMPT ************************************************************************
PROMPT Inserting FE17 records into ORDER_TYPES
PROMPT ************************************************************************

INSERT INTO order_types
(order_id
,order_description
,display_order_id
,document_type
,doc_recipient
,file_extension
,file_prefix
,legal_description
,module_group
,module_name
,no_of_copies
,printer_type
,report_type
,service_type
,tray)
VALUES
('FE17'
,'Form for Replying to an Attachment of Earnings Application'
,'FE17'
,'O'
,'DEBTOR'
,'.ae'
,'ORD2'
,'Statement of means-attachment of earnings '
,'AE'
,'CM_ORD_2'
,1
,'D'
,'R25'
,'P'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE17 records into OUTPUT_DETAILS
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE17 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE17 records into SUB_DETAIL_VARIABLES
PROMPT ************************************************************************
	
COMMIT;

SPOOL OFF