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
|                   Family Enforcement output FE24
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

SPOOL dml_trac_5886_fe24.log

PROMPT ************************************************************************
PROMPT Inserting FE24 records into ORDER_TYPES
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
('FE24'
,'Suspended Committal Order (attachment of earnings)'
,'FE24'
,'O'
,'DEBTOR'
,'.ae'
,'ORD1'
,'Notice to defendant where committal order made, but directed to be suspended under Attachment of Earnings Act 1971 '
,'AE'
,'CM_ORD_1'
,1
,'D'
,'R25'
,'B'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE24 records into OUTPUT_DETAILS
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
,'FE24'
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
,'FE24'
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
,font1
,item2
,font2)
VALUES
(output_detail_seq.NEXTVAL
,'FE24'
,'10'
,3
,'10'
,'Take notice'
,'20'
,'that today the judge made a committal order for your imprisonment for CMF_COMMITAL_PERIOD days'
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
,'FE24'
,'10'
,4
,'10'
,'This order will not be put into force so long as you attend this court'
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
,'FE24'
,'10'
,5
,'10'
,'on'
,'20'
,'CMF_NEW_HEARDATE'
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
,'FE24'
,'10'
,6
,'10'
,'at'
,'20'
,'CMF_FAM_COURT_HEAR'
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
,'FE24'
,'10'
,7
,'10'
,'at'
,'20'
,'CMF_NEW_HEARTIME'
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
,'FE24'
,'10'
,8
,'10'
,'You must also complete the enclosed form of reply and statement of means and send it to reach the court office'
,'10'
,'within CMF_RETURN_INFO days'
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
,font1
,item2
,font2)
VALUES
(output_detail_seq.NEXTVAL
,'FE24'
,'10'
,9
,'10'
,'Dated'
,'20'
,'CMF_TODAY'
,'10');

PROMPT ************************************************************************
PROMPT Inserting FE24 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE24 records into SUB_DETAIL_VARIABLES
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
WHERE od.order_type_id = 'FE24'
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
WHERE od.order_type_id = 'FE24'
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
WHERE od.order_type_id = 'FE24'
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
	,'CMF_COMMITAL_PERIOD'
FROM output_details od
WHERE od.order_type_id = 'FE24'
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
	,'CMF_NEW_HEARDATE'
FROM output_details od
WHERE od.order_type_id = 'FE24'
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
	,'CMF_FAM_COURT_HEAR'
FROM output_details od
WHERE od.order_type_id = 'FE24'
AND od.code = 6;

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
WHERE od.order_type_id = 'FE24'
AND od.code = 7;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'2'
	,'CMF_RETURN_INFO'
FROM output_details od
WHERE od.order_type_id = 'FE24'
AND od.code = 8;

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
WHERE od.order_type_id = 'FE24'
AND od.code = 9;
	
COMMIT;

SPOOL OFF