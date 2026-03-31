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
|                   Family Enforcement output FE22
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

SPOOL dml_trac_5886_fe22.log

PROMPT ************************************************************************
PROMPT Inserting FE22 records into ORDER_TYPES
PROMPT ************************************************************************

INSERT INTO order_types
(order_id
,order_description
,display_order_id
,document_type
,doc_payee
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
('FE22'
,'Order for Production of Statement of Means'
,'FE22'
,'O'
,'COURT'
,'DEBTOR'
,'.ae'
,'ORD1'
,'Order for production of statement of means '
,'AE'
,'CM_ORD_1'
,2
,'D'
,'R25'
,'B'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE22 records into OUTPUT_DETAILS
PROMPT ************************************************************************

INSERT INTO output_details
(od_seq
,order_type_id
,layout_group
,code
,format_style
,item1
,font1)
VALUES
(output_detail_seq.NEXTVAL
,'FE22'
,'10'
,1
,'10'
,'You have failed to return the statement of means sent to you'
,'10');

INSERT INTO output_details
(od_seq
,order_type_id
,layout_group
,code
,format_style
,item1
,font1
,item2
,font2
,item3
,font3
,item4
,font4
,item5
,font5
,item6
,font6)
VALUES
(output_detail_seq.NEXTVAL
,'FE22'
,'10'
,2
,'10'
,'It is ordered that'
,'20'
,'unless you pay the amount now due to the court office (CMF_AE_OUTSTANDING_BAL   *['
,'10'
,'see below'
,'30'
,'] ) you must complete the enclosed form of reply, including the statement of means, and send it to reach the court office'
,'10'
,'within 8 days'
,'20'
,'after you receive this order'
,'10');

INSERT INTO output_details
(od_seq
,order_type_id
,layout_group
,code
,format_style
,item1
,font1)
VALUES
(output_detail_seq.NEXTVAL
,'FE22'
,'10'
,3
,'10'
,'Unless you pay the amount now due to the court office, or return the completed reply form and statement of means, you may be ordered to attend court to show why you should not be sent to prison for up to 14 days or fined up to £250 under Section 23 of the Attachment of Earnings Act 1971'
,'20');

INSERT INTO output_details
(od_seq
,order_type_id
,layout_group
,code
,format_style
,item1
,font1)
VALUES
(output_detail_seq.NEXTVAL
,'FE22'
,'10'
,4
,'10'
,'Dated: CMF_TODAY'
,'10');

PROMPT ************************************************************************
PROMPT Inserting FE22 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE22 records into SUB_DETAIL_VARIABLES
PROMPT ************************************************************************

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'2'
	,'CMF_AE_OUTSTANDING_BAL'
FROM output_details od
WHERE od.order_type_id = 'FE22'
AND od.code = 2;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'1'
	,'CMF_TODAY'
FROM output_details od
WHERE od.order_type_id = 'FE22'
AND od.code = 4;
	
COMMIT;

SPOOL OFF