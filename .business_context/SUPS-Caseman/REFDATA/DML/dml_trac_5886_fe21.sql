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
|                   Family Enforcement output FE21
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

SPOOL dml_trac_5886_fe21.log

PROMPT ************************************************************************
PROMPT Inserting FE21 records into ORDER_TYPES
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
('FE21'
,'Warrant of Committal to Prison (Section 23 Attachment of Earnings Act 1971)'
,'FE21'
,'O'
,'DEBTOR'
,'.ae'
,'ORD2'
,'Warrant of Committal under section 23 of the Attachment of Earnings Act 1971 '
,'AE'
,'CM_ORD_2'
,1
,'D'
,'R25'
,'B'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE21 records into OUTPUT_DETAILS
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
,'FE21'
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
,'FE21'
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
,'FE21'
,'10'
,3
,'10'
,'CMF_FREE_TEXT'
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
,'FE21'
,'10'
,4
,'10'
,'IT IS ORDERED'
,'20'
,'that the debtor be committed to prison for CMF_COMMITAL_PERIOD days.'
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
,'FE21'
,'10'
,5
,'10'
,'You the Judge and Bailiffs'
,'20'
,'are therefore required to arrest the debtor and to deliver him to the prison and you the Governor to receive the debtor and safely keep him in prison for CMF_COMMITAL_PERIOD days from the arrest under this order or until he shall be sooner discharged by due course of law.'
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
,'FE21'
,'10'
,6
,'10'
,'Dated'
,'20'
,'CMF_TODAY'
,'10');

PROMPT ************************************************************************
PROMPT Inserting FE21 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE21 records into SUB_DETAIL_VARIABLES
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
WHERE od.order_type_id = 'FE21'
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
WHERE od.order_type_id = 'FE21'
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
WHERE od.order_type_id = 'FE21'
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
	,'CMF_FREE_TEXT'
FROM output_details od
WHERE od.order_type_id = 'FE21'
AND od.code = 3;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'2'
	,'CMF_COMMITAL_PERIOD'
FROM output_details od
WHERE od.order_type_id = 'FE21'
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
	,'CMF_COMMITAL_PERIOD'
FROM output_details od
WHERE od.order_type_id = 'FE21'
AND od.code = 5;

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
WHERE od.order_type_id = 'FE21'
AND od.code = 6;
	
COMMIT;

SPOOL OFF