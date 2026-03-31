CREATE OR REPLACE PACKAGE rtl_export_pkg AS

/*------------------------------------------------------------------------------------------------------
|                                                 Package                                         
------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_run_rtl_export 
| DESCRIPTION   : Runs the RTL Export job
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_run_rtl_export;

/*--------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_init_tmp_rtl_table
| DESCRIPTION  : Initialize the TMP_RTL_JUDGMENTS table
--------------------------------------------------------------------------------*/
PROCEDURE p_init_tmp_rtl_table;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_pop_tmp_rtl_table
| DESCRIPTION  : Populates the TMP_RTL_JUDGMENTS table prior to the export
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_pop_tmp_rtl_table;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_dereg_case_evts
| DESCRIPTION  : Retrieve Deregistration Case Events for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_dereg_case_evts (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_reg_case_evts
| DESCRIPTION  : Retrieve Registration Case Events for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_reg_case_evts (pn_count IN OUT NUMBER
								  ,pv_filename IN VARCHAR2
								  ,pv_dir IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_reg_case_evt233
| DESCRIPTION  : Retrieve Registration Case Event 233 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_reg_case_evt233 (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_amnd_case_evts
| DESCRIPTION  : Retrieve Amendment Case Events for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_amnd_case_evts (pn_count IN OUT NUMBER
								   ,pv_filename IN VARCHAR2
								   ,pv_dir IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_dereg_co_evts
| DESCRIPTION  : Retrieve Deregistration CO Events 927 and 928 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_dereg_co_evts (pn_count IN OUT NUMBER
								  ,pv_filename IN VARCHAR2
								  ,pv_dir IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_dereg_co_evt935
| DESCRIPTION  : Retrieve Deregistration CO Event 935 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_dereg_co_evt935 (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_reg_co_evts
| DESCRIPTION  : Retrieve Registration CO Event 920 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_reg_co_evts (pn_count IN OUT NUMBER
								,pv_filename IN VARCHAR2
								,pv_dir IN VARCHAR2);
				
/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_post_extract_updates
| DESCRIPTION  : Performs the post extract updates on the case events, co events, judgments and
|				 consolidated orders.
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_post_extract_updates;
				
END rtl_export_pkg;
/
CREATE OR REPLACE PACKAGE BODY rtl_export_pkg AS

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : f_calc_co_balance
| DESCRIPTION  : Calculates the outstanding balance on the consolidated order
------------------------------------------------------------------------------------------------------*/
FUNCTION f_calc_co_balance (p_co_number IN consolidated_orders.co_number%TYPE) RETURN NUMBER;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : check_invalid_char
| DESCRIPTION  : Function to check for invalid characters
------------------------------------------------------------------------------------------------------*/
FUNCTION check_invalid_char(string_in IN VARCHAR2) RETURN BOOLEAN;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_replacement_char
| DESCRIPTION  : For a given invalid ASCII character code, determines the replacement character
------------------------------------------------------------------------------------------------------*/
FUNCTION get_replacement_char(p_ascii_code NUMBER) RETURN VARCHAR2;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : parse_string
| DESCRIPTION  : Parses a string and checks if it contains an invalid XML character, returning a 
|				 replacement string with any invalid characters removed.
------------------------------------------------------------------------------------------------------*/
FUNCTION parse_string(string_in IN VARCHAR2, maxlength IN NUMBER) RETURN VARCHAR2;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_file_line
| DESCRIPTION  : Common function to generate a file line 
------------------------------------------------------------------------------------------------------*/
FUNCTION get_file_line (p_court IN NUMBER, p_enf_no IN VARCHAR2, p_total IN VARCHAR2, p_judg_date IN VARCHAR2, p_status IN VARCHAR2, p_canc_date IN VARCHAR2,
						p_name IN VARCHAR2, p_add1 IN VARCHAR2, p_add2 IN VARCHAR2, p_add3 IN VARCHAR2, p_add4 IN VARCHAR2, p_add5 IN VARCHAR2,
						p_postcode IN VARCHAR2, p_dob IN VARCHAR2) RETURN VARCHAR2;

/*--------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_run_rtl_export
| DESCRIPTION  : Runs the RTL Export job
--------------------------------------------------------------------------------*/
PROCEDURE p_run_rtl_export IS

	l_record_count		NUMBER	:= 0;
	l_det_file_name		VARCHAR2(30);
	l_hdr_file_name		VARCHAR2(30);
	l_datestring		VARCHAR2(30);
	l_datestring_hdr	VARCHAR2(30);
	l_dir_name			VARCHAR2(30);
	f_handle 			UTL_FILE.FILE_TYPE;

BEGIN

	-- Prepare the TMP_RTL_JUDGMENTS table
	p_init_tmp_rtl_table;
	p_pop_tmp_rtl_table;
	
	-- Prepare the file names based on the system date
	SELECT TO_CHAR(SYSDATE,'YYYYMMDD')
	INTO l_datestring
	FROM DUAL;
	
	SELECT TO_CHAR(SYSDATE,'DDMMYYYY')
	INTO l_datestring_hdr
	FROM DUAL;
	
	l_det_file_name := 'SUPS' || l_datestring || '.det';
	l_hdr_file_name := 'SUPS' || l_datestring || '.hdr';
	l_dir_name := 'SOURCE_DIR';

	-- Set audit context
	set_sups_app_ctx('CCBC_BATCH', 0, 'RtlExport' );
	
	-- Process the different RTL events
	p_process_dereg_case_evts (l_record_count, l_det_file_name, l_dir_name);
	p_process_reg_case_evts (l_record_count, l_det_file_name, l_dir_name);
	p_process_reg_case_evt233 (l_record_count, l_det_file_name, l_dir_name);
	p_process_amnd_case_evts (l_record_count, l_det_file_name, l_dir_name);
	p_process_dereg_co_evts (l_record_count, l_det_file_name, l_dir_name);
	p_process_dereg_co_evt935 (l_record_count, l_det_file_name, l_dir_name);
	p_process_reg_co_evts (l_record_count, l_det_file_name, l_dir_name);
	
	-- Run updates to judgments, events and consolidated orders
	p_post_extract_updates;
	
	-- Create header file
	f_handle := UTL_FILE.FOPEN(l_dir_name, l_hdr_file_name, 'W');
	UTL_FILE.PUT_LINE(f_handle, RPAD(l_record_count,10) || l_datestring_hdr);
	UTL_FILE.FCLOSE(f_handle);
   
EXCEPTION
	WHEN OTHERS THEN
		dbms_output.put_line('p_run_rtl_export: ' ||SQLERRM);
		ROLLBACK;
		RAISE;
END;

/*--------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_init_tmp_rtl_table
| DESCRIPTION  : Initialize the TMP_RTL_JUDGMENTS table
--------------------------------------------------------------------------------*/
PROCEDURE p_init_tmp_rtl_table IS

BEGIN

	EXECUTE IMMEDIATE 'TRUNCATE TABLE tmp_rtl_judgments';
   
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_pop_tmp_rtl_table
| DESCRIPTION  : Populates the TMP_RTL_JUDGMENTS table prior to the export
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_pop_tmp_rtl_table IS

BEGIN

	INSERT INTO tmp_rtl_judgments 
	SELECT 	j.* 
	FROM 	judgments j, case_events ce 
	WHERE 	j.judgment_date > ADD_MONTHS(TRUNC(SYSDATE), -72) 
	AND 	ce.judg_seq = j.judg_seq 
	AND 	NVL(ce.deleted_flag, 'N') = 'N' 
	AND 	ce.date_to_rtl IS NULL 
	AND 	( (ce.std_event_id IN (79, 170, 600, 230, 240, 250, 251, 254, 375, 233, 253) AND ce.register_judgment = 'Y') 
			OR ce.std_event_id = 236);
		  
	COMMIT;
	
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_dereg_case_evts
| DESCRIPTION  : Retrieve Deregistration Case Events for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_dereg_case_evts (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2) IS

	CURSOR c_dereg_case_evts IS
	SELECT 
		CAS.admin_crt_code
		,eve.event_seq
		,judg.judg_seq
		,CAS.CASE_NUMBER
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE" 
		,DECODE(eve.std_event_id
			,600, DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,79,DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,170,DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,'C') "STATUS"
		,DECODE(eve.std_event_id
			,79,TO_CHAR(JUDG.DATE_OF_FINAL_PAYMENT,'DDMMYYYY')
			,600,TO_CHAR(NVL(JUDG.DATE_OF_FINAL_PAYMENT,EVE.EVENT_DATE),'DDMMYYYY')
			,TO_CHAR(EVE.EVENT_DATE,'DDMMYYYY')) "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM	CASES             	CAS
			,CASE_PARTY_ROLES  	CPR
			,PARTIES           	PAR
			,GIVEN_ADDRESSES   	ADDR
			,TMP_RTL_JUDGMENTS  JUDG
			,CASE_EVENTS       	EVE
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'DEFENDANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    ADDR.PARTY_ROLE_CODE         = CPR.PARTY_ROLE_CODE
	AND    ADDR.CASE_PARTY_NO           = CPR.CASE_PARTY_NO
	AND    ADDR.ADDRESS_TYPE_CODE       = 'SERVICE'
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.ADDRESS_ID       		= JUDG.AGAINST_PARTY_ADDR_ID_JUDG_REG
	AND    NVL(EVE.DELETED_FLAG,'N')    = 'N' 
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    EVE.REGISTER_JUDGMENT        = 'Y'     
	AND		(EVE.STD_EVENT_ID           = 600 OR (EVE.STD_EVENT_ID IN (79,170) AND CAS.ADMIN_CRT_CODE= 335))
	AND    JUDG.JUDG_SEQ               	= EVE.JUDG_SEQ
	UNION
	(SELECT 
		CAS.admin_crt_code
		,eve.event_seq
		,judg.judg_seq
		,CAS.CASE_NUMBER
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE"
		,DECODE(eve.std_event_id
			,600, DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,79,DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,170,DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,'C') "STATUS"
		,DECODE(eve.std_event_id
			,79,TO_CHAR(JUDG.DATE_OF_FINAL_PAYMENT,'DDMMYYYY')
			,600,TO_CHAR(NVL(JUDG.DATE_OF_FINAL_PAYMENT,EVE.EVENT_DATE),'DDMMYYYY')
			,TO_CHAR(EVE.EVENT_DATE,'DDMMYYYY')) "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM	CASES             	CAS
			,CASE_PARTY_ROLES  	CPR
			,PARTIES           	PAR
			,GIVEN_ADDRESSES   	ADDR
			,TMP_RTL_JUDGMENTS 	JUDG
			,CASE_EVENTS       	EVE
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'CLAIMANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    ADDR.PARTY_ROLE_CODE         = CPR.PARTY_ROLE_CODE
	AND    ADDR.CASE_PARTY_NO           = CPR.CASE_PARTY_NO
	AND    ADDR.ADDRESS_TYPE_CODE       = 'SERVICE'
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.ADDRESS_ID       		= JUDG.AGAINST_PARTY_ADDR_ID_JUDG_REG
	AND    NVL(EVE.DELETED_FLAG,'N')    = 'N'      
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    EVE.REGISTER_JUDGMENT        = 'Y'     
	AND    (EVE.STD_EVENT_ID            = 600 OR (EVE.STD_EVENT_ID IN (79,170) AND CAS.ADMIN_CRT_CODE= 335))
	AND    JUDG.JUDG_SEQ              	= EVE.JUDG_SEQ                   
	) 
	UNION
	(SELECT 
		CAS.admin_crt_code
		,eve.event_seq
		,judg.judg_seq
		,CAS.CASE_NUMBER
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE"
		,DECODE(eve.std_event_id
			,600, DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,79,DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,170,DECODE(JUDG.STATUS,'SET ASIDE','C','CANCELLED','C','SATISFIED','S','C')
			,'C') "STATUS"
		,DECODE(eve.std_event_id
			,79,TO_CHAR(JUDG.DATE_OF_FINAL_PAYMENT,'DDMMYYYY')
			,600,TO_CHAR(NVL(JUDG.DATE_OF_FINAL_PAYMENT,EVE.EVENT_DATE),'DDMMYYYY')
			,TO_CHAR(EVE.EVENT_DATE,'DDMMYYYY')) "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CASES             	CAS
			,CASE_PARTY_ROLES  	CPR
			,PARTIES           	PAR
			,GIVEN_ADDRESSES   	ADDR
			,TMP_RTL_JUDGMENTS  JUDG
			,CASE_EVENTS       	EVE
			,CODED_PARTIES  	CPAR
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'CLAIMANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER      		IS NULL
	AND    ADDR.ADDRESS_TYPE_CODE       = 'CODED PARTY'
	AND    ADDR.PARTY_ID      			= CPAR.PARTY_ID
	AND    CPR.PARTY_ID      			= CPAR.PARTY_ID
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.ADDRESS_ID       		= JUDG.AGAINST_PARTY_ADDR_ID_JUDG_REG
	AND    NVL(EVE.DELETED_FLAG,'N')    = 'N'       
	AND    EVE.DATE_TO_RTL              IS NULL     
	AND    EVE.REGISTER_JUDGMENT        = 'Y'                                                                                
	AND    (EVE.STD_EVENT_ID            = 600 OR (EVE.STD_EVENT_ID IN (79,170) AND CAS.ADMIN_CRT_CODE= 335))
	AND    JUDG.JUDG_SEQ               	= EVE.JUDG_SEQ);
	
	f_handle UTL_FILE.FILE_TYPE;
	pv_file_line VARCHAR(500);

BEGIN

	f_handle := UTL_FILE.FOPEN(pv_dir, pv_filename, 'A');
	
	FOR rec IN c_dereg_case_evts LOOP
	
		-- Generate the line for the RTL file
		pv_file_line := get_file_line (rec.admin_crt_code
									  ,rec.case_number
									  ,rec.judg_total
									  ,rec.judg_date
									  ,rec.status
									  ,rec.canc_date
									  ,rec.person_requested_name
									  ,rec.address_line1
									  ,rec.address_line2
									  ,rec.address_line3
									  ,rec.address_line4
									  ,rec.address_line5
									  ,rec.postcode
									  ,rec.person_dob);
		
		-- Output the line in the file
		UTL_FILE.PUT_LINE(f_handle, pv_file_line);
		
		pn_count := pn_count + 1;
		
	END LOOP;
	
	UTL_FILE.FCLOSE(f_handle);
	
EXCEPTION
	WHEN OTHERS THEN
		IF f_handle.id IS NOT NULL THEN
			UTL_FILE.FCLOSE(f_handle);
		END IF;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_reg_case_evts
| DESCRIPTION  : Retrieve Registration Case Events for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_reg_case_evts (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2) IS

	CURSOR c_reg_case_evts IS
	SELECT 
		CAS.admin_crt_code
		,CAS.CASE_NUMBER,judg.judg_seq
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE",'R' AS "STATUS"
		,NULL AS "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_ID
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CASES             CAS
			,CASE_PARTY_ROLES  CPR
			,PARTIES           PAR
			,GIVEN_ADDRESSES   ADDR
			,TMP_RTL_JUDGMENTS         JUDG
			,CASE_EVENTS       EVE
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'DEFENDANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    ADDR.PARTY_ROLE_CODE         = CPR.PARTY_ROLE_CODE
	AND    ADDR.CASE_PARTY_NO           = CPR.CASE_PARTY_NO
	AND    ADDR.ADDRESS_TYPE_CODE       = 'SERVICE'
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.VALID_TO IS NULL
	AND   (EVE.DELETED_FLAG             = 'N' OR     EVE.DELETED_FLAG             IS NULL)       
	AND    EVE.DATE_TO_RTL              IS NULL 
	AND    EVE.REGISTER_JUDGMENT        = 'Y'
	AND    EVE.STD_EVENT_ID             IN (230,240,250,251,254,375)
	AND    JUDG.JUDG_SEQ               = EVE.JUDG_SEQ
	UNION (
	SELECT 
		CAS.admin_crt_code
		,CAS.CASE_NUMBER
		,judg.judg_seq
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE"
		,'R' AS "STATUS"
		,NULL AS "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_ID
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CASES             CAS
			,CASE_PARTY_ROLES  CPR
			,PARTIES           PAR
			,GIVEN_ADDRESSES   ADDR
			,TMP_RTL_JUDGMENTS         JUDG
			,CASE_EVENTS       EVE
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'CLAIMANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    ADDR.PARTY_ROLE_CODE         = CPR.PARTY_ROLE_CODE
	AND    ADDR.CASE_PARTY_NO           = CPR.CASE_PARTY_NO
	AND    ADDR.ADDRESS_TYPE_CODE       = 'SERVICE'
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.VALID_TO IS NULL AND   (EVE.DELETED_FLAG             = 'N' OR     EVE.DELETED_FLAG             IS NULL)       
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    EVE.REGISTER_JUDGMENT        = 'Y'                          
	AND    EVE.STD_EVENT_ID             IN (230,240,250,251,254,375)                                                   
	AND    JUDG.JUDG_SEQ               = EVE.JUDG_SEQ)    
	UNION (
	SELECT 
		CAS.admin_crt_code
		,CAS.CASE_NUMBER
		,judg.judg_seq
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE"
		,'R' AS "STATUS"
		,NULL AS "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_ID
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM	CASES             CAS
			,CASE_PARTY_ROLES  CPR
			,PARTIES           PAR
			,GIVEN_ADDRESSES   ADDR
			,TMP_RTL_JUDGMENTS         JUDG
			,CASE_EVENTS       EVE,CODED_PARTIES CPAR
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'CLAIMANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER     IS NULL
	AND    ADDR.ADDRESS_TYPE_CODE       = 'CODED PARTY'
	AND    ADDR.PARTY_ID    = CPAR.PARTY_ID
	AND    CPR.PARTY_ID    = CPAR.PARTY_ID
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.VALID_TO IS NULL
	AND   (EVE.DELETED_FLAG             = 'N' OR     EVE.DELETED_FLAG             IS NULL)
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    EVE.REGISTER_JUDGMENT        = 'Y' 
	AND    EVE.STD_EVENT_ID             IN (230,240,250,251,254,375)
	AND    JUDG.JUDG_SEQ               = EVE.JUDG_SEQ);
	
	f_handle UTL_FILE.FILE_TYPE;
	pv_file_line VARCHAR(500);

BEGIN

	f_handle := UTL_FILE.FOPEN(pv_dir, pv_filename, 'A');
	
	FOR rec IN c_reg_case_evts LOOP
	
		-- Generate the line for the RTL file
		pv_file_line := get_file_line (rec.admin_crt_code
									  ,rec.case_number
									  ,rec.judg_total
									  ,rec.judg_date
									  ,rec.status
									  ,rec.canc_date
									  ,rec.person_requested_name
									  ,rec.address_line1
									  ,rec.address_line2
									  ,rec.address_line3
									  ,rec.address_line4
									  ,rec.address_line5
									  ,rec.postcode
									  ,rec.person_dob);
		
		-- Output the line in the file
		UTL_FILE.PUT_LINE(f_handle, pv_file_line);
		
		-- Update the Judgment address id at registration
		UPDATE judgments SET AGAINST_PARTY_ADDR_ID_JUDG_REG = rec.address_id WHERE judg_seq = rec.judg_seq;
		COMMIT;
		
		pn_count := pn_count + 1;
		
	END LOOP;
	
	UTL_FILE.FCLOSE(f_handle);
	
EXCEPTION
	WHEN OTHERS THEN
		IF f_handle.id IS NOT NULL THEN
			UTL_FILE.FCLOSE(f_handle);
		END IF;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_reg_case_evt233
| DESCRIPTION  : Retrieve Registration Case Event 233 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_reg_case_evt233 (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2) IS

	CURSOR c_reg_case_evt233 IS
	SELECT 	
		CAS.admin_crt_code
		,cas.case_number
		,judg.judg_seq
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR(JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE"
		,'R' AS "STATUS"
		,NULL AS "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_ID
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM	CASES CAS
			,CASE_PARTY_ROLES  CPR
			,PARTIES           PAR
			,GIVEN_ADDRESSES   ADDR
			,TMP_RTL_JUDGMENTS         JUDG
			,CASE_EVENTS       EVE
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'CLAIMANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    ADDR.PARTY_ROLE_CODE         = CPR.PARTY_ROLE_CODE
	AND    ADDR.CASE_PARTY_NO           = CPR.CASE_PARTY_NO
	AND    ADDR.ADDRESS_TYPE_CODE       = 'SERVICE'
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.VALID_TO IS NULL
	AND   (EVE.DELETED_FLAG             = 'N'
	OR     EVE.DELETED_FLAG             IS NULL)       
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    EVE.REGISTER_JUDGMENT  		= 'Y'
	AND    EVE.STD_EVENT_ID             = 233
	AND    JUDG.JUDG_SEQ                = EVE.JUDG_SEQ;
	
	f_handle UTL_FILE.FILE_TYPE;
	pv_file_line VARCHAR(500);

BEGIN

	f_handle := UTL_FILE.FOPEN(pv_dir, pv_filename, 'A');
	
	FOR rec IN c_reg_case_evt233 LOOP
	
		-- Generate the line for the RTL file
		pv_file_line := get_file_line (rec.admin_crt_code
									  ,rec.case_number
									  ,rec.judg_total
									  ,rec.judg_date
									  ,rec.status
									  ,rec.canc_date
									  ,rec.person_requested_name
									  ,rec.address_line1
									  ,rec.address_line2
									  ,rec.address_line3
									  ,rec.address_line4
									  ,rec.address_line5
									  ,rec.postcode
									  ,rec.person_dob);
		
		-- Output the line in the file
		UTL_FILE.PUT_LINE(f_handle, pv_file_line);
		
		-- Update the Judgment address id at registration
		UPDATE judgments SET AGAINST_PARTY_ADDR_ID_JUDG_REG = rec.address_id WHERE judg_seq = rec.judg_seq;
		COMMIT;
		
		pn_count := pn_count + 1;
		
	END LOOP;
	
	UTL_FILE.FCLOSE(f_handle);
	
EXCEPTION
	WHEN OTHERS THEN
		IF f_handle.id IS NOT NULL THEN
			UTL_FILE.FCLOSE(f_handle);
		END IF;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_amnd_case_evts
| DESCRIPTION  : Retrieve Amendment Case Events for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_amnd_case_evts (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2) IS

	CURSOR c_amnd_case_evts IS
	SELECT 
		CAS.admin_crt_code
		,cas.case_number
		,eve.std_event_id
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE"
		,'M' AS "STATUS"
		,NULL AS "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CASES             CAS
			,CASE_PARTY_ROLES  CPR
			,PARTIES           PAR
			,GIVEN_ADDRESSES   ADDR
			,TMP_RTL_JUDGMENTS         JUDG
			,CASE_EVENTS       EVE
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'CLAIMANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    ADDR.ADDRESS_TYPE_CODE    = 'SERVICE'
	AND    ADDR.PARTY_ROLE_CODE         = CPR.PARTY_ROLE_CODE
	AND    ADDR.CASE_PARTY_NO           = CPR.CASE_PARTY_NO
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.ADDRESS_ID     = JUDG.AGAINST_PARTY_ADDR_ID_JUDG_REG
	AND   (EVE.DELETED_FLAG             = 'N' OR     EVE.DELETED_FLAG             IS NULL)
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    (EVE.STD_EVENT_ID = 236 OR (EVE.STD_EVENT_ID= 253    AND EVE.REGISTER_JUDGMENT = 'Y'))
	AND    JUDG.JUDG_SEQ               = EVE.JUDG_SEQ
	UNION (
	SELECT 
		CAS.admin_crt_code
		,cas.case_number
		,eve.std_event_id
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY')"JUDG_DATE"
		,'M' AS "STATUS"
		,NULL AS "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CASES             CAS
			,CASE_PARTY_ROLES  CPR
			,PARTIES           PAR
			,GIVEN_ADDRESSES   ADDR
			,TMP_RTL_JUDGMENTS         JUDG
			,CASE_EVENTS       EVE
			,CODED_PARTIES CPAR
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'CLAIMANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER     IS NULL
	AND    ADDR.ADDRESS_TYPE_CODE    = 'CODED PARTY'
	AND    ADDR.PARTY_ID            = CPAR.PARTY_ID
	AND    CPR.PARTY_ID    = CPAR.PARTY_ID
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.ADDRESS_ID     = JUDG.AGAINST_PARTY_ADDR_ID_JUDG_REG
	AND   (EVE.DELETED_FLAG             = 'N' OR     EVE.DELETED_FLAG             IS NULL)
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    (EVE.STD_EVENT_ID             = 236 OR (EVE.STD_EVENT_ID= 253    AND EVE.REGISTER_JUDGMENT = 'Y'))
	AND    JUDG.JUDG_SEQ               = EVE.JUDG_SEQ)
	UNION (
	SELECT 
		CAS.admin_crt_code
		,cas.case_number
		,eve.std_event_id
		,LTRIM(TO_CHAR(NVL(JUDG.JUDGMENT_AMOUNT,0) + NVL(JUDG.TOTAL_COSTS,0) - NVL(JUDG.PAID_BEFORE_JUDGMENT,0),'00000000.00')) "JUDG_TOTAL"
		,JUDG.TOTAL_CURRENCY
		,TO_CHAR (JUDG.JUDGMENT_DATE,'DDMMYYYY') "JUDG_DATE"
		,'M' AS "STATUS"
		,NULL AS "CANC_DATE"
		,PAR.PERSON_REQUESTED_NAME
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CASES             CAS
			,CASE_PARTY_ROLES  CPR
			,PARTIES           PAR
			,GIVEN_ADDRESSES   ADDR
			,TMP_RTL_JUDGMENTS         JUDG
			,CASE_EVENTS       EVE
	WHERE  CAS.CASE_NUMBER              = CPR.CASE_NUMBER
	AND    CPR.PARTY_ROLE_CODE          = 'DEFENDANT'
	AND    PAR.PARTY_ID                 = CPR.PARTY_ID
	AND    ADDR.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    ADDR.ADDRESS_TYPE_CODE    = 'SERVICE'
	AND    ADDR.PARTY_ROLE_CODE         = CPR.PARTY_ROLE_CODE
	AND    ADDR.CASE_PARTY_NO           = CPR.CASE_PARTY_NO
	AND    JUDG.CASE_NUMBER             = CPR.CASE_NUMBER
	AND    JUDG.AGAINST_PARTY_ROLE_CODE = CPR.PARTY_ROLE_CODE
	AND    JUDG.AGAINST_CASE_PARTY_NO   = CPR.CASE_PARTY_NO
	AND    JUDG.JUDGMENT_DATE           > ADD_MONTHS(SYSDATE,-72)
	AND    ADDR.ADDRESS_ID     = JUDG.AGAINST_PARTY_ADDR_ID_JUDG_REG
	AND   (EVE.DELETED_FLAG             = 'N' OR     EVE.DELETED_FLAG IS NULL)
	AND    EVE.DATE_TO_RTL              IS NULL
	AND    (EVE.STD_EVENT_ID             = 236 OR (EVE.STD_EVENT_ID= 253 AND EVE.REGISTER_JUDGMENT = 'Y'))
	AND    JUDG.JUDG_SEQ = EVE.JUDG_SEQ);
	
	f_handle UTL_FILE.FILE_TYPE;
	pv_file_line VARCHAR(500);

BEGIN

	f_handle := UTL_FILE.FOPEN(pv_dir, pv_filename, 'A');
	
	FOR rec IN c_amnd_case_evts LOOP
	
		-- Generate the line for the RTL file
		pv_file_line := get_file_line (rec.admin_crt_code
									  ,rec.case_number
									  ,rec.judg_total
									  ,rec.judg_date
									  ,rec.status
									  ,rec.canc_date
									  ,rec.person_requested_name
									  ,rec.address_line1
									  ,rec.address_line2
									  ,rec.address_line3
									  ,rec.address_line4
									  ,rec.address_line5
									  ,rec.postcode
									  ,rec.person_dob);
		
		-- Output the line in the file
		UTL_FILE.PUT_LINE(f_handle, pv_file_line);
		
		pn_count := pn_count + 1;
		
	END LOOP;
	
	UTL_FILE.FCLOSE(f_handle);
	
EXCEPTION
	WHEN OTHERS THEN
		IF f_handle.id IS NOT NULL THEN
			UTL_FILE.FCLOSE(f_handle);
		END IF;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_dereg_co_evts
| DESCRIPTION  : Retrieve Deregistration CO Events 927 and 928 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_dereg_co_evts (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2) IS

	CURSOR c_dereg_co_evts IS
	SELECT 
		CO.admin_court_code
		,CO.CO_NUMBER
		,COE.STD_EVENT_ID
		,NULL AS "TOTAL"
		,TO_CHAR(COE.EVENT_DATE,'DDMMYYYY') "ORDER_DATE"
		,DECODE(COE.STD_EVENT_ID,'927','V','928','K',NULL) "STATUS"
		,TO_CHAR(COE.EVENT_DATE,'DDMMYYYY') "CANC_DATE"
		,CO.DEBTOR_NAME
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CONSOLIDATED_ORDERS  CO
			,GIVEN_ADDRESSES   ADDR
			,PARTIES PAR
			,CO_EVENTS COE
	WHERE  ADDR.CO_NUMBER = CO.CO_NUMBER 
	AND   ADDR.ADDRESS_ID = CO.AGAINST_PARTY_ADDR_ID_CO_REG 
	AND   ADDR.ADDRESS_TYPE_CODE = 'CO DEBTOR'
	AND   COE.CO_NUMBER = CO.CO_NUMBER 
	AND   COE.STD_EVENT_ID IN (927,928) 
	AND   CO.ORDER_DATE > ADD_MONTHS(SYSDATE,-72) 
	AND   PAR.PARTY_ID = ADDR.PARTY_ID 
	AND   COE.DATE_TO_RTL IS NULL 
	AND   COE.ERROR_INDICATOR = 'N';
	
	f_handle 		UTL_FILE.FILE_TYPE;
	pv_file_line 	VARCHAR(500);
	pn_co_balance	NUMBER;

BEGIN

	f_handle := UTL_FILE.FOPEN(pv_dir, pv_filename, 'A');
	
	FOR rec IN c_dereg_co_evts LOOP
	
		-- Retrieve the CO balance
		pn_co_balance := f_calc_co_balance(rec.co_number);
		
		-- Generate the line for the RTL file
		pv_file_line := get_file_line (rec.admin_court_code
									  ,rec.co_number
									  ,LTRIM(TO_CHAR(pn_co_balance,'00000000.00'))
									  ,rec.order_date
									  ,rec.status
									  ,rec.canc_date
									  ,rec.debtor_name
									  ,rec.address_line1
									  ,rec.address_line2
									  ,rec.address_line3
									  ,rec.address_line4
									  ,rec.address_line5
									  ,rec.postcode
									  ,rec.person_dob);
		
		-- Output the line in the file
		UTL_FILE.PUT_LINE(f_handle, pv_file_line);
		
		pn_count := pn_count + 1;
		
	END LOOP;
	
	UTL_FILE.FCLOSE(f_handle);
	
EXCEPTION
	WHEN OTHERS THEN
		IF f_handle.id IS NOT NULL THEN
			UTL_FILE.FCLOSE(f_handle);
		END IF;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_dereg_co_evt935
| DESCRIPTION  : Retrieve Deregistration CO Event 935 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_dereg_co_evt935 (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2) IS

	CURSOR c_dereg_co_evt935 IS
	SELECT
		CO.admin_court_code
		,CO.CO_NUMBER
		,T2.CO_TEXT_VALUE AS "TOTAL"
		,TO_CHAR(TO_DATE(T3.CO_TEXT_VALUE,'DD-Mon-YYYY'),'DDMMYYYY') "ORDER_DATE"
		,DECODE(T1.CO_TEXT_VALUE, 'CNL' ,'C','SAT','S','SET','C', NULL) "STATUS"
		,TO_CHAR(TO_DATE(T4.CO_TEXT_VALUE,'DD-Mon-YYYY'),'DDMMYYYY') "CANC_DATE"
		,CO.DEBTOR_NAME
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CONSOLIDATED_ORDERS       CO
			,GIVEN_ADDRESSES   ADDR
			,CO_EVENTS COE
			,PARTIES PAR
			,CO_TEXT_ITEMS T2
			,CO_TEXT_ITEMS T1
			,CO_TEXT_ITEMS T3
			,CO_TEXT_ITEMS T4
	WHERE  ADDR.CO_NUMBER = CO.CO_NUMBER 
	AND   ADDR.ADDRESS_TYPE_CODE = 'CO DEBTOR' 
	AND   COE.DATE_TO_RTL IS NULL 
	AND   ADDR.ADDRESS_ID = CO.AGAINST_PARTY_ADDR_ID_CO_REG  
	AND   COE.CO_NUMBER = CO.CO_NUMBER 
	AND   COE.ERROR_INDICATOR = 'N' 
	AND   COE.STD_EVENT_ID = 935 
	AND   CO.ORDER_DATE >ADD_MONTHS(SYSDATE,-72) 
	AND   PAR.PARTY_ID = ADDR.PARTY_ID 
	AND   T2.CO_TEXT_DETAIL_CODE = '12535' 
	AND   T2.CO_TEXT_EVENT_SEQ IN ( SELECT MAX(CE.CO_EVENT_SEQ) FROM CO_EVENTS CE WHERE CE.STD_EVENT_ID = '935' AND CE.CO_NUMBER = CO.CO_NUMBER) 
	AND   T1.CO_TEXT_DETAIL_CODE = '12515' 
	AND   T1.CO_TEXT_EVENT_SEQ IN ( SELECT MAX(CE.CO_EVENT_SEQ) FROM CO_EVENTS CE WHERE CE.STD_EVENT_ID = '935' AND CE.CO_NUMBER = CO.CO_NUMBER) 
	AND   T3.CO_TEXT_DETAIL_CODE = '12530' 
	AND   T3.CO_TEXT_EVENT_SEQ IN ( SELECT MAX(CE.CO_EVENT_SEQ) FROM CO_EVENTS CE WHERE CE.STD_EVENT_ID = '935' AND CE.CO_NUMBER = CO.CO_NUMBER) 
	AND   T4.CO_TEXT_DETAIL_CODE = '12520' 
	AND   T4.CO_TEXT_EVENT_SEQ IN ( SELECT MAX(CE.CO_EVENT_SEQ) FROM CO_EVENTS CE WHERE CE.STD_EVENT_ID = '935' AND CE.CO_NUMBER = CO.CO_NUMBER);

	f_handle UTL_FILE.FILE_TYPE;
	pv_file_line VARCHAR(500);

BEGIN

	f_handle := UTL_FILE.FOPEN(pv_dir, pv_filename, 'A');

	FOR rec IN c_dereg_co_evt935 LOOP
	
		-- Generate the line for the RTL file
		pv_file_line := get_file_line (rec.admin_court_code
									  ,rec.co_number
									  ,LTRIM(TO_CHAR(rec.total,'00000000.00'))
									  ,rec.order_date
									  ,rec.status
									  ,rec.canc_date
									  ,rec.debtor_name
									  ,rec.address_line1
									  ,rec.address_line2
									  ,rec.address_line3
									  ,rec.address_line4
									  ,rec.address_line5
									  ,rec.postcode
									  ,rec.person_dob);
		
		-- Output the line in the file
		UTL_FILE.PUT_LINE(f_handle, pv_file_line);
		
		pn_count := pn_count + 1;
		
	END LOOP;
	
	UTL_FILE.FCLOSE(f_handle);
	
EXCEPTION
	WHEN OTHERS THEN
		IF f_handle.id IS NOT NULL THEN
			UTL_FILE.FCLOSE(f_handle);
		END IF;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_process_reg_co_evts
| DESCRIPTION  : Retrieve Registration CO Event 920 for RTL and write to the details file
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_process_reg_co_evts (pn_count IN OUT NUMBER
									,pv_filename IN VARCHAR2
									,pv_dir IN VARCHAR2) IS

	CURSOR c_reg_co_evts IS
	SELECT 
		CO.admin_court_code
		,CO.CO_NUMBER
		,COE.STD_EVENT_ID
		,NULL AS "Total"
		,TO_CHAR(COE.EVENT_DATE,'DDMMYYYY') "ORDER_DATE"
		,'A' AS "STATUS"
		,NULL AS "CANC_DATE"
		,CO.DEBTOR_NAME
		,ADDR.ADDRESS_ID
		,ADDR.ADDRESS_LINE1
		,ADDR.ADDRESS_LINE2
		,ADDR.ADDRESS_LINE3
		,ADDR.ADDRESS_LINE4
		,ADDR.ADDRESS_LINE5
		,ADDR.POSTCODE
		,TO_CHAR(PAR.PERSON_DOB,'DDMMYYYY') "PERSON_DOB"
	FROM   	CONSOLIDATED_ORDERS  CO
			,GIVEN_ADDRESSES   ADDR
			,PARTIES PAR
			,CO_EVENTS COE
	WHERE  ADDR.CO_NUMBER = CO.CO_NUMBER 
	AND   ADDR.ADDRESS_TYPE_CODE = 'CO DEBTOR' 
	AND   ADDR.VALID_TO IS NULL 
	AND   COE.CO_NUMBER = CO.CO_NUMBER 
	AND   COE.STD_EVENT_ID = 920
	AND   CO.ORDER_DATE > ADD_MONTHS(SYSDATE,-72) 
	AND   PAR.PARTY_ID = ADDR.PARTY_ID 
	AND   COE.DATE_TO_RTL IS NULL 
	AND   COE.ERROR_INDICATOR = 'N';

	f_handle 		UTL_FILE.FILE_TYPE;
	pv_file_line 	VARCHAR(500);
	pn_co_balance	NUMBER;

BEGIN

	f_handle := UTL_FILE.FOPEN(pv_dir, pv_filename, 'A');
	
	FOR rec IN c_reg_co_evts LOOP
	
		-- Retrieve the CO balance
		pn_co_balance := f_calc_co_balance(rec.co_number);
		
		-- Generate the line for the RTL file
		pv_file_line := get_file_line (rec.admin_court_code
									  ,rec.co_number
									  ,LTRIM(TO_CHAR(pn_co_balance,'00000000.00'))
									  ,rec.order_date
									  ,rec.status
									  ,rec.canc_date
									  ,rec.debtor_name
									  ,rec.address_line1
									  ,rec.address_line2
									  ,rec.address_line3
									  ,rec.address_line4
									  ,rec.address_line5
									  ,rec.postcode
									  ,rec.person_dob);
		
		-- Output the line in the file
		UTL_FILE.PUT_LINE(f_handle, pv_file_line);
		
		-- Update the Consolidated Order address id at registration
		UPDATE consolidated_orders SET AGAINST_PARTY_ADDR_ID_CO_REG = rec.address_id WHERE co_number = rec.co_number;
		COMMIT;
		
		pn_count := pn_count + 1;
		
	END LOOP;
	
	UTL_FILE.FCLOSE(f_handle);
	
EXCEPTION
	WHEN OTHERS THEN
		IF f_handle.id IS NOT NULL THEN
			UTL_FILE.FCLOSE(f_handle);
		END IF;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_post_extract_updates
| DESCRIPTION  : Performs the post extract updates on the case events, co events, judgments and
|				 consolidated orders.
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_post_extract_updates IS

BEGIN

	-- Update newly registered judgments
	UPDATE	JUDGMENTS JUDG
	SET		JUDG.SENT_TO_RTL = TRUNC(SYSDATE),
			JUDG.STATUS_TO_RTL = 'Y'
	WHERE	JUDG.JUDG_SEQ IN (
			SELECT	EVE.JUDG_SEQ
			FROM	CASE_EVENTS EVE
			WHERE	EVE.DELETED_FLAG = 'N'
			AND		EVE.DATE_TO_RTL IS NULL
			AND		EVE.REGISTER_JUDGMENT = 'Y' 
			AND		EVE.STD_EVENT_ID IN (230, 240, 233, 250, 251, 253, 254, 375)
			AND		JUDG.JUDGMENT_DATE > ADD_MONTHS(SYSDATE,-72));

	-- Update deregistration and amendment case events
	UPDATE	CASE_EVENTS EVE
	SET		EVE.DATE_TO_RTL = TRUNC(SYSDATE)
	WHERE	EVE.DELETED_FLAG = 'N'
	AND		EVE.DATE_TO_RTL IS NULL
	AND 	((EVE.STD_EVENT_ID IN (79 ,170 ,375 ,600 ,253) AND EVE.REGISTER_JUDGMENT = 'Y')
			OR (EVE.STD_EVENT_ID = 236))
	AND EXISTS
		(SELECT	j.judg_seq
		 FROM	TMP_RTL_JUDGMENTS j
		 WHERE	j.judg_seq = eve.judg_seq
	);

	-- Update registration case events
	UPDATE	CASE_EVENTS EVE
	SET		EVE.DATE_TO_RTL = TRUNC(SYSDATE)
	WHERE	EVE.DELETED_FLAG = 'N'
	AND		EVE.DATE_TO_RTL IS NULL
	AND		EVE.REGISTER_JUDGMENT = 'Y'
	AND		EVE.STD_EVENT_ID IN (254 ,251, 230, 240, 233, 250 )
	AND	EXISTS
		(SELECT null
		 FROM TMP_RTL_JUDGMENTS trj
		 WHERE trj.judg_seq = eve.judg_seq
	);
	
	-- Update newly registered consolidated orders
	UPDATE	CONSOLIDATED_ORDERS CO
	SET		CO.SENT_TO_RTL = TRUNC(SYSDATE),
			CO.STATUS_TO_RTL = 'Y'
	WHERE	CO.CO_NUMBER IN (
			SELECT 	COE.CO_NUMBER
			FROM	CO_EVENTS COE
			WHERE	COE.ERROR_INDICATOR = 'N'
			AND		COE.DATE_TO_RTL IS NULL
			AND		COE.STD_EVENT_ID = 920
	);
	
	-- Update registration and deregistration CO events
	UPDATE	CO_EVENTS COE
	SET		COE.DATE_TO_RTL = TRUNC(SYSDATE)
	WHERE	COE.ERROR_INDICATOR = 'N'
	AND		COE.DATE_TO_RTL IS NULL
	AND		COE.STD_EVENT_ID IN (920 ,927 ,928 ,935);
	
	COMMIT;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : f_calc_co_balance
| DESCRIPTION  : Calculates the outstanding balance on the consolidated order
------------------------------------------------------------------------------------------------------*/
FUNCTION f_calc_co_balance (p_co_number 	IN consolidated_orders.co_number%TYPE) RETURN NUMBER IS

	v_return_val 		NUMBER := 0;
	v_fee_amount		NUMBER := 0;
	v_total_paid_out	NUMBER := 0;
	v_total_passthrough	NUMBER := 0;
	v_total_fees_paid	NUMBER := 0;
	v_total_debts		NUMBER := 0;
	v_money_in_court	NUMBER := 0;

BEGIN
	
	-- FEE AMOUNT
	SELECT NVL(fee_amount, 0)
	INTO v_fee_amount 
	FROM consolidated_orders 
	WHERE co_number = p_co_number;

	-- TOTAL PAID OUT
	SELECT NVL(SUM(dd.dd_amount), 0) 
	INTO v_total_paid_out 
	FROM debt_dividends dd, allowed_debts ald
	WHERE dd.dd_co_number = p_co_number
	AND dd.dd_ald_seq = ald.debt_seq
	AND ald.debt_status IN ('LIVE','SCHEDULE2','PAID')
	AND dd.created = 'Y';

	-- TOTAL PASSTHROUGH
	SELECT NVL(SUM(pay.amount), 0) 
	INTO v_total_passthrough 
	FROM payments pay, allowed_debts ald
	WHERE ald.debt_seq = pay.ald_debt_seq
	AND pay.passthrough = 'Y'
	AND ald.debt_co_number = p_co_number
	AND ald.debt_status IN ('LIVE', 'PAID', 'SCHEDULE2')
	AND pay.error_indicator = 'N';

	-- TOTAL FEES PAID
	SELECT NVL(SUM(div.div_fee), 0)
	INTO v_total_fees_paid 
	FROM dividends div
	WHERE div.div_co_number = p_co_number
	AND div.created = 'Y';

	-- TOTAL DEBTS
	SELECT NVL(SUM(debt_amount_allowed), 0)
	INTO v_total_debts
	FROM allowed_debts ald
	WHERE ald.debt_status IN ('LIVE', 'PAID', 'SCHEDULE2')
	AND debt_co_number = p_co_number;

	-- MONIES IN COURT
	SELECT NVL(SUM(pay.amount), 0)
	INTO v_money_in_court
	FROM payments pay
	WHERE pay.payout_date IS NULL
	AND pay.rd_date IS NULL
	AND pay.passthrough = 'N'
	AND pay.retention_type = 'AO/CAEO'
	AND pay.payment_for = 'CO'
	AND pay.subject_no = p_co_number;
	
	-- Calculate the outstanding balance
	v_return_val := (v_total_debts + v_fee_amount) - (v_total_paid_out + v_total_fees_paid + v_total_passthrough + v_money_in_court);
	IF v_return_val < 0.00 THEN
		v_return_val := 0.00;
	END IF;

	RETURN v_return_val;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : check_invalid_char
| DESCRIPTION  : Function to check for invalid characters
------------------------------------------------------------------------------------------------------*/
FUNCTION check_invalid_char(string_in IN VARCHAR2) RETURN BOOLEAN IS
	b_invalid_character_found BOOLEAN := FALSE;
BEGIN
	IF string_in IS NOT NULL
	THEN
		FOR i in 1..LENGTH(string_in)
		LOOP
			IF b_invalid_character_found = FALSE
			THEN
				IF ASCII(SUBSTR(string_in,i,1)) NOT BETWEEN 32 AND 127 THEN
					b_invalid_character_found := TRUE;
					EXIT;
				END IF;
			END IF;
		END LOOP;
	END IF;
	RETURN b_invalid_character_found;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_replacement_char
| DESCRIPTION  : For a given invalid ASCII character code, determines the replacement character
------------------------------------------------------------------------------------------------------*/
FUNCTION get_replacement_char(p_ascii_code NUMBER) RETURN VARCHAR2 IS
	v_new_char VARCHAR2(3);
BEGIN

	SELECT NVL(t.replacement_char,'')
	INTO v_new_char
	FROM tmp_rtl_character_map t
	WHERE t.ascii_code = p_ascii_code;

	RETURN v_new_char;

EXCEPTION
	WHEN NO_DATA_FOUND THEN
		RETURN '';
	WHEN OTHERS THEN
		RETURN '';
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : parse_string
| DESCRIPTION  : Parses a string and checks if it contains an invalid XML character, returning a 
|				 replacement string with any invalid characters removed.
------------------------------------------------------------------------------------------------------*/
FUNCTION parse_string(string_in IN VARCHAR2, maxlength IN NUMBER) RETURN VARCHAR2 IS
	v_new_string parties.person_requested_name%TYPE := NULL;
	n_ascii      NUMBER;
BEGIN

	IF string_in IS NOT NULL
	THEN
		FOR i in 1..LENGTH(string_in)
		LOOP
			-- Get ASCII code for the character
			n_ascii := ASCII(SUBSTR(string_in,i,1));
			IF n_ascii NOT BETWEEN 32 AND 127 THEN
				-- Invalid character identified, replace it with a valid one
				v_new_string := v_new_string || get_replacement_char(n_ascii);
			ELSE
				-- Character is valid
				v_new_string := v_new_string || SUBSTR(string_in,i,1);
			END IF;
		END LOOP;

		-- Check if new string generated exceeds the maximum length
		IF LENGTH(v_new_string) > maxlength THEN
			v_new_string := '';
			FOR i in 1..LENGTH(string_in)
			LOOP
				-- Get ASCII code for the character
				n_ascii := ASCII(SUBSTR(string_in,i,1));
				IF n_ascii NOT BETWEEN 32 AND 127 THEN
					-- As replacement process exceeds the maximum length, replace with blanks now
					v_new_string := v_new_string || '';
				ELSE
					-- Character is valid
					v_new_string := v_new_string || SUBSTR(string_in,i,1);
				END IF;
			END LOOP;
		END IF;
	END IF;

	RETURN v_new_string;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_file_line
| DESCRIPTION  : Common function to generate a file line 
------------------------------------------------------------------------------------------------------*/
FUNCTION get_file_line (p_court IN NUMBER, p_enf_no IN VARCHAR2, p_total IN VARCHAR2, p_judg_date IN VARCHAR2, p_status IN VARCHAR2, p_canc_date IN VARCHAR2,
						p_name IN VARCHAR2, p_add1 IN VARCHAR2, p_add2 IN VARCHAR2, p_add3 IN VARCHAR2, p_add4 IN VARCHAR2, p_add5 IN VARCHAR2,
						p_postcode IN VARCHAR2, p_dob IN VARCHAR2) RETURN VARCHAR2 IS
						
	v_file_line		VARCHAR(500);
	v_name        	parties.person_requested_name%TYPE;
    v_addr_1      	given_addresses.address_line1%TYPE;
    v_addr_2      	given_addresses.address_line2%TYPE;
    v_addr_3		given_addresses.address_line3%TYPE;
    v_addr_4		given_addresses.address_line4%TYPE;
    v_addr_5		given_addresses.address_line5%TYPE;
    v_postcode		given_addresses.postcode%TYPE;
    b_found			BOOLEAN := FALSE;
	
BEGIN

	-- For name and address lines, check for invalid characters (e.g. Welsh characters) and replace them
	b_found := check_invalid_char(p_name);
	IF b_found = TRUE THEN
		v_name := parse_string(p_name, 70);
	ELSE
		v_name := p_name;
	END IF;

	b_found := check_invalid_char(p_add1);
	IF b_found = TRUE THEN
		v_addr_1 := parse_string(p_add1, 35);
	ELSE
		v_addr_1 := p_add1;
	END IF;

	b_found := check_invalid_char(p_add2);
	IF b_found = TRUE THEN
		v_addr_2 := parse_string(p_add2, 35);
	ELSE
		v_addr_2 := p_add2;
	END IF;

	b_found := check_invalid_char(p_add3);
	IF b_found = TRUE THEN
		v_addr_3 := parse_string(p_add3, 35);
	ELSE
		v_addr_3 := p_add3;
	END IF;

	b_found := check_invalid_char(p_add4);
	IF b_found = TRUE THEN
		v_addr_4 := parse_string(p_add4, 35);
	ELSE
		v_addr_4 := p_add4;
	END IF;

	b_found := check_invalid_char(p_add5);
	IF b_found = TRUE THEN
		v_addr_5 := parse_string(p_add5, 35);
	ELSE
		v_addr_5 := p_add5;
	END IF;

	b_found := check_invalid_char(p_postcode);
	IF b_found = TRUE THEN
		v_postcode := parse_string(p_postcode, 8);
	ELSE
		v_postcode := p_postcode;
	END IF;
	
	-- Generate the file line
	v_file_line := p_court || p_enf_no || p_total || p_judg_date || p_status || RPAD(NVL(p_canc_date,' '),8) || RPAD(v_name,70) || RPAD(v_addr_1,35) || RPAD(v_addr_2,35) 
					|| RPAD(NVL(v_addr_3,' '),35) || RPAD(NVL(v_addr_4,' '),35)|| RPAD(NVL(v_addr_5,' '),35) || RPAD(NVL(v_postcode,' '),8) || RPAD(NVL(p_dob,' '),8);
					
	RETURN v_file_line;

END;

END rtl_export_pkg;
/
