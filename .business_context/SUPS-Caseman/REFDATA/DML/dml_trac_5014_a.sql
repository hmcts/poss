WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_5014_a.sql $:
|
| SYNOPSIS      : Reference data updates for the Single Court release
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2013 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : This data will be used as reference data.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5014_a.log

PROMPT ************************************************************************
PROMPT Update table COURTS to include Welsh Court names
PROMPT ************************************************************************

CALL sys.set_sups_app_ctx('support','0','trac 5014');

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: ABERYSTWYTH'
WHERE	code = 102;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH COED DUON',
		welsh_county_court_name = 'YN LLYS SIROL YN: COED DUON'
WHERE	code = 132;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH BRYCHEINIOG',
		welsh_county_court_name = 'YN LLYS SIROL YN: BRYCHEINIOG'
WHERE	code = 143;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: PEN-Y-BONT AR OGWR'
WHERE	code = 146;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: CAERNARFON'
WHERE	code = 159;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: CAERDYDD'
WHERE	code = 164;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: CAERFYRDDIN'
WHERE	code = 166;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CONWY A CHOLWYN',
		welsh_county_court_name = 'YN LLYS SIROL YN: CONWY A CHOLWYN'
WHERE	code = 178;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: HWLFFORDD'
WHERE	code = 217;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: LLANELLI'
WHERE	code = 253;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: LLANGEFNI'
WHERE	code = 254;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: MERTHYR TUDFUL'
WHERE	code = 269;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: YR WYDDGRUG'
WHERE	code = 271;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: CASTELL-NEDD A PHORT TALBOT'
WHERE	code = 274;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: CASNEWYDD'
WHERE	code = 280;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: PONTYPRIDD'
WHERE	code = 299;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: Y RHYL'
WHERE	code = 308;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: ABERTAWE'
WHERE	code = 344;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: Y TRALLWNG A' || '''' || 'R DRENEWYDD'
WHERE	code = 366;

UPDATE 	courts
SET 	welsh_county_court_name = 'YN LLYS SIROL YN: WRECSAM'
WHERE	code = 384;

UPDATE 	courts
SET		name = 'COUNTY COURT BUSINESS CENTRE'
WHERE	code = 335;

UPDATE 	courts
SET		name = 'CCMCC'
WHERE	code = 390;

UPDATE 	courts
SET		name = 'CCMCC (WALES)'
WHERE	code = 391;

UPDATE 	courts
SET		name = 'MAYORS ' || '&' || ' CITY OF LONDON COURT'
WHERE	code = 266;

PROMPT ************************************************************************
PROMPT Updated table COURTS
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update table GIVEN_ADDRESSES
PROMPT ************************************************************************

UPDATE 	given_addresses
SET		address_line1 = 'PO BOX 527'
		,address_line2 = 'SALFORD'
		,address_line3 = NULL
		,address_line4 = NULL
		,address_line5 = NULL
		,postcode = 'M5 0BY'
WHERE 	address_type_code IN ('OFFICE','WELSH_OFFICE')
AND		court_code IN (390,391)
AND		valid_to IS NULL;

PROMPT ************************************************************************
PROMPT Updated table GIVEN_ADDRESSES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update table OUTPUT_DETAILS
PROMPT ************************************************************************

UPDATE output_details od
SET od.item3 = 'is in arrears under an order of the CO_COURT_NAME and earnings are payable by you to the Debtor.'
WHERE od.order_type_id = 'CO06'
AND od.code = 2;

PROMPT ************************************************************************
PROMPT Updated table OUTPUT_DETAILS
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update table DOCUMENT_VARIABLES
PROMPT ************************************************************************

UPDATE document_variables dv 
SET dv.select_clause = '/*+ RULE */ decode(co.admin_court_code, 335, ''County Court Business Centre'', 390, ''County Court Money Claims Centre'', 391, ''County Court Money Claims Centre'', ''County Court at '' ||sups_reports_pack.superinitcap(crt.name))'
WHERE dv.code = 'CO_COURT_NAME';

UPDATE document_variables dv 
SET dv.select_clause = '/*+ RULE */ rtrim(replace(decode(ti.co_text_value, null, null ,''the County Court at '' || sups_reports_pack.superinitcap(ti.co_text_value) || '', '' ||sups_reports_pack.superinitcap(ti1.co_text_value) || '', '' ||sups_reports_pack.superinitcap(ti2.co_text_value)), '',,'', '',''), '','')'
WHERE dv.code = 'CO_HRG_VENUE_ADDR_PART_1';

UPDATE document_variables dv
SET dv.select_clause = '/*+ RULE */ ''the County Court at '' || replace(decode(report_value_7, null, null ,sups_reports_pack.superinitcap(report_value_7) || '', '' ||sups_reports_pack.superinitcap(report_value_8) || '', '' ||sups_reports_pack.superinitcap(report_value_9)|| decode(report_value_10, null,'''','', '' ||sups_reports_pack.superinitcap(report_value_10))|| decode(report_value_11, null,'''','', '' ||sups_reports_pack.superinitcap(report_value_11))|| decode(report_value_14, null,'''','', '' ||sups_reports_pack.superinitcap(report_value_14))|| decode(report_value_12, null,'''','', '' ||report_value_12)), '',,'', '','')'
WHERE dv.code = 'CMF_AE_HRG_VENUE_ADDR';

UPDATE document_variables dv
SET dv.select_clause = '''the County Court at '' || REPLACE(REPLACE(INITCAP(hrg.venue), ''And'',''and''),''''''S'',''''''s'')||'', ''||REPLACE(REPLACE(INITCAP(ga.address_line1),''And'',''and''),''''''S'',''''''s'')||'', '' ||REPLACE(REPLACE(INITCAP(ga.address_line2),''And'',''and''),''''''S'',''''''s'')|| DECODE(ga.address_line3,NULL,'''','', ''||REPLACE(REPLACE(INITCAP(ga.address_line3),''And'',''and''),''''''S'',''''''s''))|| DECODE(ga.address_line4,NULL,'''','', ''||REPLACE(REPLACE(INITCAP(ga.address_line4),''And'',''and''),''''''S'',''''''s''))|| DECODE(ga.address_line5,NULL,'''','', ''||REPLACE(REPLACE(INITCAP(ga.address_line5),''And'',''and''),''''''S'',''''''s''))|| DECODE(ga.postcode,NULL,'''','', ''||ga.postcode)'
WHERE dv.code = 'CMF_NEW_COURT_HEAR';

UPDATE document_variables dv 
SET dv.select_clause = 'DECODE(CRT.CODE,UC.COURT_CODE,''this court'',DECODE(CRT.NAME,''HIGH COURT'',''the High Court'',DECODE(CRT.CODE,335,''the County Court Business Centre'',390,''the County Court Money Claims Centre'',391,''the County Court Money Claims Centre'',''the County Court at ''||initcap(CRT.NAME))))'
WHERE dv.code = 'CMF_JUDGMENT_COURT';

UPDATE document_variables dv
SET dv.select_clause = '''the County Court at ''||REPLACE(REPLACE(INITCAP(hrg.venue), ''And'',''and''),''''''S'',''''''s'')||'', ''||REPLACE(REPLACE(INITCAP(ga.address_line1),''And'',''and''),''''''S'',''''''s'')||'', '' ||REPLACE(REPLACE(INITCAP(ga.address_line2),''And'',''and''),''''''S'',''''''s'')|| DECODE(ga.address_line3,NULL,'''','', ''||REPLACE(REPLACE(INITCAP(ga.address_line3),''And'',''and''),''''''S'',''''''s''))|| DECODE(ga.address_line4,NULL,'''','', ''||REPLACE(REPLACE(INITCAP(ga.address_line4),''And'',''and''),''''''S'',''''''s''))|| DECODE(ga.address_line5,NULL,'''','', ''||REPLACE(REPLACE(INITCAP(ga.address_line5),''And'',''and''),''''''S'',''''''s''))|| DECODE(ga.postcode,NULL,'''','', ''||ga.postcode)'
WHERE dv.code = 'CMF_LAST_COURT_HEAR';

PROMPT ************************************************************************
PROMPT Updated table DOCUMENT_VARIABLES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF