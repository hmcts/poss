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
|                   Family Enforcement output FE23
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

SPOOL dml_trac_5886_fe23.log

PROMPT ************************************************************************
PROMPT Inserting FE23 records into ORDER_TYPES
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
('FE23'
,'Failure to Provide Statement of Means'
,'FE23'
,'O'
,'DEBTOR'
,'.ae'
,'ORD1'
,'Failure to provide statement of means '
,'AE'
,'CM_ORD_1'
,2
,'D'
,'R25'
,'B'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE23 records into OUTPUT_DETAILS
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
,'FE23'
,'10'
,1
,'10'
,'You have failed to give the court within the time specified a statement of your earnings, resources and means in accordance with section 14 of the Attachment of Earnings Act 1971.'
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
,'FE23'
,'10'
,2
,'10'
,'You are therefore ordered to attend court in person at'
,'20'
,'CMF_FAM_COURT_HEAR on the CMF_NEW_HEARDATE at CMF_NEW_HEARTIME'
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
,'FE23'
,'10'
,3
,'10'
,'to give good reasons why you should not be sent to prison for up to 14 days or fined up to £250 under section 23 of the Attachment of Earnings Act 1971.'
,'20');

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
,'FE23'
,'10'
,4
,'10'
,'Dated:'
,'20'
,'CMF_TODAY'
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
,'FE23'
,'10'
,5
,'10'
,'If you immediately return'
,'20'
,'the completed and signed form of reply and statement of means to the court'
,'10'
,'or pay into the court office'
,'20'
,'(CMF_AE_OUTSTANDING_BAL *['
,'10'
,'see below'
,'30'
,'] ) the sum remaining due, you may not have to attend.'
,'10');

PROMPT ************************************************************************
PROMPT Inserting FE23 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE23 records into SUB_DETAIL_VARIABLES
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
WHERE od.order_type_id = 'FE23'
AND od.code = 2;

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
WHERE od.order_type_id = 'FE23'
AND od.code = 2;

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
WHERE od.order_type_id = 'FE23'
AND od.code = 2;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'2'
	,'CMF_TODAY'
FROM output_details od
WHERE od.order_type_id = 'FE23'
AND od.code = 4;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'4'
	,'CMF_AE_OUTSTANDING_BAL'
FROM output_details od
WHERE od.order_type_id = 'FE23'
AND od.code = 5;
	
COMMIT;

SPOOL OFF