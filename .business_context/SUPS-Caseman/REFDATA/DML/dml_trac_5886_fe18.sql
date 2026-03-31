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
|                   Family Enforcement output FE18
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

SPOOL dml_trac_5886_fe18.log

PROMPT ************************************************************************
PROMPT Inserting FE18 records into ORDER_TYPES
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
('FE18'
,'Notice of Application for Attachment of Earnings Order (maintenance)'
,'FE18'
,'O'
,'DEBTOR'
,'.ae'
,'ORD1'
,'Notice of application for attachment of earnings order (maintenance) '
,'AE'
,'CM_ORD_1'
,2
,'D'
,'R25'
,'P'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE18 records into OUTPUT_DETAILS
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
,'FE18'
,'10'
,1
,'10'
,'To the debtor'
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
,'FE18'
,'10'
,2
,'10'
,'The creditor obtained an order against you in this court'
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
,font2)
VALUES
(output_detail_seq.NEXTVAL
,'FE18'
,'10'
,3
,'10'
,'And'
,'20'
,'as you have failed to pay as ordered, the creditor has applied for an attachment of earnings order requiring your employer to make deductions from your earnings for payment of the arrears and for future maintenance'
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
,font2)
VALUES
(output_detail_seq.NEXTVAL
,'FE18'
,'10'
,4
,'10'
,'The application will be heard'
,'20'
,'by this court on the CMF_NEW_HEARDATE at CMF_NEW_HEARTIME at CMF_FAM_COURT_HEAR'
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
,font3)
VALUES
(output_detail_seq.NEXTVAL
,'FE18'
,'10'
,5
,'10'
,'You must also complete the enclosed form of reply and statement of means and send it to reach the court office'
,'10'
,'within 8 days'
,'20'
,'after you receive this notice'
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
,'FE18'
,'10'
,6
,'10'
,'FAILURE TO RETURN THE REPLY FORM AND STATEMENT OF MEANS IS A PUNISHABLE OFFENCE. IT WILL RESULT IN YOUR EMPLOYER BEING CONTACTED AND IT MAY RESULT IN YOU BEING ORDERED TO ATTEND COURT'
,'20');

PROMPT ************************************************************************
PROMPT Inserting FE18 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

INSERT INTO document_variables
(code
,description
,select_clause
,from_where_clause)
SELECT
	'CMF_FAM_COURT_HEAR'
	,dv2.description
	,REPLACE(dv2.select_clause,'County Court','Family Court')
	,dv2.from_where_clause
FROM document_variables dv2
WHERE code = 'CMF_NEW_COURT_HEAR';

PROMPT ************************************************************************
PROMPT Inserting FE18 records into SUB_DETAIL_VARIABLES
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
	,'CMF_FAM_COURT_HEAR'
FROM output_details od
WHERE od.order_type_id = 'FE18'
AND od.code = 4;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'2'
	,'CMF_NEW_HEARDATE'
FROM output_details od
WHERE od.order_type_id = 'FE18'
AND od.code = 4;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'2'
	,'CMF_NEW_HEARTIME'
FROM output_details od
WHERE od.order_type_id = 'FE18'
AND od.code = 4;
	
COMMIT;

SPOOL OFF