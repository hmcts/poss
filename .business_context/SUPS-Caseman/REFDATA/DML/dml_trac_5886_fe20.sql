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
|                   Family Enforcement output FE20
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

SPOOL dml_trac_5886_fe20.log

PROMPT ************************************************************************
PROMPT Inserting FE20 records into ORDER_TYPES
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
('FE20'
,'Order and warrant for debtor to be Arrested and brought before the court'
,'FE20'
,'O'
,'DEBTOR'
,'.ae'
,'ORD1'
,'Order and warrant for debtor to be arrested and brought before the court '
,'AE'
,'CM_ORD_1'
,1
,'D'
,'R25'
,'B'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE20 records into OUTPUT_DETAILS
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
,'FE20'
,'10'
,1
,'10'
,'To the bailiffs of the court'
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
,'FE20'
,'10'
,2
,'10'
,'The debtor was ordered to attend on a specified day for the adjourned hearing of an application for an attachment of earnings order and has failed to do so'
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
,'FE20'
,'10'
,3
,'10'
,'On CMF_TODAY CMF_AE_JUDGE_NAME_INITCAP'
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
,'FE20'
,'10'
,4
,'10'
,'sitting at CMF_FAM_HRG_VENUE_ADDR'
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
,'FE20'
,'10'
,5
,'10'
,'CMF_AE_HRG_ATTENDEES'
,'10');

INSERT INTO output_details
(od_seq
,order_type_id
,layout_group
,code
,format_style
,item1
,font1
,item2)
VALUES
(output_detail_seq.NEXTVAL
,'FE20'
,'10'
,6
,'10'
,'and the court orders'
,'20'
,'that the debtor be arrested and brought before this court immediately.');

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
,'FE20'
,'10'
,7
,'10'
,'You, the bailiffs are therefore required to arrest the debtor and to bring them before this court'
,'10');

PROMPT ************************************************************************
PROMPT Inserting FE20 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE20 records into SUB_DETAIL_VARIABLES
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
	,'CMF_TODAY'
FROM output_details od
WHERE od.order_type_id = 'FE20'
AND od.code = 3;

INSERT INTO sub_detail_variables
(sdv_seq
,od_seq
,sub_item_number
,variable_code)
SELECT
	sub_detail_var_seq.NEXTVAL
	,od.od_seq
	,'1'
	,'CMF_AE_JUDGE_NAME_INITCAP'
FROM output_details od
WHERE od.order_type_id = 'FE20'
AND od.code = 3;

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
WHERE od.order_type_id = 'FE20'
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
	,'CMF_AE_HRG_ATTENDEES'
FROM output_details od
WHERE od.order_type_id = 'FE20'
AND od.code = 5;
	
COMMIT;

SPOOL OFF