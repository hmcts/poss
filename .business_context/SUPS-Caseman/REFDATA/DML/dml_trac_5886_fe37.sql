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
|                   Family Enforcement output FE37
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

SPOOL dml_trac_5886_fe37.log

PROMPT ************************************************************************
PROMPT Inserting FE37 records into ORDER_TYPES
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
('FE37'
,'General Form of Judgment or Order'
,'FE37'
,'O'
,'DEBTOR'
,'.ae'
,'ORD1'
,'General Form of Judgment or Order '
,'AE'
,'CM_ORD_1'
,3
,'P'
,'R25'
,'P'
,'2');

PROMPT ************************************************************************
PROMPT Inserting FE37 records into OUTPUT_DETAILS
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
,'FE37'
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
,'FE37'
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
,'FE37'
,'10'
,3
,'10'
,'It is ordered that the Attachment of Earnings Application be heard on CMF_NEW_HEARDATE at CMF_NEW_HEARTIME at CMF_FAM_COURT_HEAR'
,'10');

PROMPT ************************************************************************
PROMPT Inserting FE37 records into DOCUMENT_VARIABLES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Inserting FE37 records into SUB_DETAIL_VARIABLES
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
WHERE od.order_type_id = 'FE37'
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
WHERE od.order_type_id = 'FE37'
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
WHERE od.order_type_id = 'FE37'
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
	,'CMF_FAM_COURT_HEAR'
FROM output_details od
WHERE od.order_type_id = 'FE37'
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
	,'CMF_NEW_HEARDATE'
FROM output_details od
WHERE od.order_type_id = 'FE37'
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
	,'CMF_NEW_HEARTIME'
FROM output_details od
WHERE od.order_type_id = 'FE37'
AND od.code = 3;

COMMIT;

SPOOL OFF