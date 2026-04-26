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
|                   Family Enforcement output FE19
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

SPOOL dml_trac_5886_fe19.log

PROMPT ************************************************************************
PROMPT Inserting FE19 records into ORDER_TYPES
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
('FE19'
,'Order for Attendance at an Adjourned Hearing of Attachment of Earnings Application (maintenance)'
,'FE19'
,'O'
,'DEBTOR'
,'.ae'
,'ORD1'
,'Order for debtor''s attendance at an adjourned hearing of an attachment of earnings application (maintenance) '
,'AE'
,'CM_ORD_1'
,2
,'D'
,'R25'
,'B'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE19 records into OUTPUT_DETAILS
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
,'FE19'
,'10'
,1
,'10'
,'Before CMF_AE_JUDGE_NAME sitting at CMF_FAM_HRG_VENUE_ADDR'
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
,'FE19'
,'10'
,2
,'10'
,'UPON CMF_AE_HRG_ATTENDEES'
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
,'FE19'
,'10'
,3
,'10'
,'You failed to attend the court on the day and time fixed for the hearing of an application for an attachment of earnings order, after being served with the notice of application'
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
,'FE19'
,'10'
,4
,'10'
,'The application has been adjourned to CMF_NEW_HEARDATE at CMF_NEW_HEARTIME at'
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
,'FE19'
,'10'
,5
,'10'
,'CMF_FAM_COURT_HEAR'
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
,'FE19'
,'10'
,6
,'10'
,'You must attend at that time on that day'
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
,font2
,item3
,font3)
VALUES
(output_detail_seq.NEXTVAL
,'FE19'
,'10'
,7
,'10'
,'You must also complete the enclosed form of reply and statement of means and send it to reach the court office'
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
,'FE19'
,'10'
,8
,'20'
,'IF YOU DO NOT ATTEND YOU MAY BE SENT TO PRISON FOR UP TO 14 DAYS OR ARRESTED AND BROUGHT BEFORE THE COURT'
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
,'FE19'
,'10'
,9
,'10'
,'Dated: CMF_TODAY'
,'10');

PROMPT ************************************************************************
PROMPT Inserting FE19 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

INSERT INTO document_variables
(code
,description
,select_clause
,from_where_clause)
SELECT
	'CMF_FAM_HRG_VENUE_ADDR'
	,dv2.description
	,REPLACE(dv2.select_clause,'County Court','Family Court')
	,dv2.from_where_clause
FROM document_variables dv2
WHERE code = 'CMF_AE_HRG_VENUE_ADDR';

PROMPT ************************************************************************
PROMPT Inserting FE19 records into SUB_DETAIL_VARIABLES
PROMPT ************************************************************************

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'1'
	,'CMF_FAM_HRG_VENUE_ADDR'
FROM output_details od
WHERE od.order_type_id = 'FE19'
AND od.code = 1;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'1'
	,'CMF_AE_JUDGE_NAME'
FROM output_details od
WHERE od.order_type_id = 'FE19'
AND od.code = 1;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'1'
	,'CMF_AE_HRG_ATTENDEES'
FROM output_details od
WHERE od.order_type_id = 'FE19'
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
	,'CMF_NEW_HEARDATE'
FROM output_details od
WHERE od.order_type_id = 'FE19'
AND od.code = 4;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'1'
	,'CMF_NEW_HEARTIME'
FROM output_details od
WHERE od.order_type_id = 'FE19'
AND od.code = 4;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'1'
	,'CMF_FAM_COURT_HEAR'
FROM output_details od
WHERE od.order_type_id = 'FE19'
AND od.code = 5;

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
WHERE od.order_type_id = 'FE19'
AND od.code = 9;
	
COMMIT;

SPOOL OFF