CREATE OR REPLACE PACKAGE wft_export_pkg AS

/*------------------------------------------------------------------------------------------------------
|                                          Package Header                                        
------------------------------------------------------------------------------------------------------*/

-- TO DO: procedures to run process for a single court in isolation and another to load all the CSV files in isolation

-- TO DO: Insert into TRANSFER_ERROR_LOG table

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_run_wft_export
| DESCRIPTION  : Runs the WFT Export job
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_run_wft_export (p_debug IN  VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_run_wft_export_single_court
| DESCRIPTION  : Runs the WFT Export job for a single court after the WFT records have been updated
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_run_wft_export_single_court (p_grouping_crt	IN courts.wft_grouping_court%TYPE
										,p_export_date	IN VARCHAR2
										,p_debug IN  VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_delete_old_exports
| DESCRIPTION  : Deletes any exports that have passed their retention period
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_delete_old_exports;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_post_extract_updates
| DESCRIPTION  : Performs the post extract updates on the window_for_trial records
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_post_extract_updates;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_insert_csv_file
| DESCRIPTION  : Loads the WFT file contents into the report_queue, document_store, content_store
|				 and the wft_exports tables
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_insert_csv_file (p_filename 	IN VARCHAR2
							,p_grouping_crt	IN courts.wft_grouping_court%TYPE
							,p_content_store_id	IN content_store.id%TYPE
							,p_file_loaded  OUT VARCHAR2);
				
END wft_export_pkg;
/

/*------------------------------------------------------------------------------------------------------
|                                            Package Body                                         
------------------------------------------------------------------------------------------------------*/

CREATE OR REPLACE PACKAGE BODY wft_export_pkg AS

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_write_to_blob
| DESCRIPTION  : Writes the CSV content to the CONTENT_STORE.DATA BLOB column
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_write_to_blob (p_destLob IN OUT BLOB, p_buffer IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_write_clob_to_blob
| DESCRIPTION  : Writes the CSV content to the CONTENT_STORE.DATA BLOB column
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_write_clob_to_blob (p_destLob IN OUT BLOB, p_buffer IN CLOB);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : append_large_varchar
| DESCRIPTION  : Appends a varchar2 which when gets too big, gets written to a CLOB instead
------------------------------------------------------------------------------------------------------*/
PROCEDURE append_large_varchar(v_clob IN OUT NOCOPY CLOB, v_vc IN OUT NOCOPY VARCHAR2, v_app VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : get_csv_header
| DESCRIPTION  : Writes the standard file header
------------------------------------------------------------------------------------------------------*/
FUNCTION get_csv_header RETURN VARCHAR2;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_no_data_line
| DESCRIPTION  : Writes the no data line
------------------------------------------------------------------------------------------------------*/
FUNCTION get_no_data_line (p_code IN courts.code%TYPE) RETURN VARCHAR2;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_curr_crt_wft_line
| DESCRIPTION  : Writes a WFT record line for the current court
------------------------------------------------------------------------------------------------------*/
FUNCTION get_curr_crt_wft_line (p_crt_code IN courts.code%TYPE
								  ,p_case_number IN cases.case_number%TYPE
								  ,p_wft_id IN window_for_trial.wft_id%TYPE) RETURN CLOB;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_prev_crt_wft_line
| DESCRIPTION  : Writes a WFT record line for the previous court
------------------------------------------------------------------------------------------------------*/
FUNCTION get_prev_crt_wft_line (p_crt_code IN courts.code%TYPE
								  ,p_case_number IN cases.case_number%TYPE
								  ,p_wft_id IN window_for_trial.wft_id%TYPE) RETURN CLOB;
								  
/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_log_error
| DESCRIPTION  : Writes an error message to the TRANSFER_ERROR_LOG table
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_log_error (p_court_code IN NUMBER, p_err IN VARCHAR2);

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_run_wft_export
| DESCRIPTION  : Runs the WFT Export job
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_run_wft_export (p_debug IN  VARCHAR2) IS

	CURSOR c_get_grouping_courts IS
	SELECT DISTINCT wft_grouping_court 
	FROM courts 
	WHERE caseman_inservice = 'Y' 
	AND sups_centralised_flag = 'Y'
	AND wft_grouping_court IS NOT NULL 
	ORDER BY wft_grouping_court;
	
	CURSOR c_get_courts_in_group (p_grouping_court NUMBER) IS
	SELECT code 
	FROM courts 
	WHERE caseman_inservice = 'Y' 
	AND sups_centralised_flag = 'Y' 
	AND  wft_grouping_court = p_grouping_court
	ORDER BY code;
	
	CURSOR c_get_current_wft_records (p_court_code NUMBER) IS
	SELECT wft_id, wft_case_number 
	FROM window_for_trial 
	WHERE wft_extracted_for_dm IS NULL
	AND  wft_current_court = p_court_code;
	
	CURSOR c_get_previous_wft_records (p_court_code NUMBER) IS
	SELECT wft_id, wft_case_number  FROM window_for_trial 
	WHERE wft_extracted_for_dm IS NULL
	AND  wft_previous_court = p_court_code;

	l_prev_crt_count	NUMBER	:= 0;
	l_curr_crt_count	NUMBER	:= 0;
	l_loaded    VARCHAR2(1);
	l_wft_file_name	VARCHAR2(30);
	l_tmp_str	VARCHAR2(2000);
	l_error    VARCHAR2(1) := 'N';
	
	l_dataLOB	BLOB;
	l_tempLOB	CLOB;
	
	l_content_store_id	content_store.id%TYPE;
	
BEGIN

	-- Delete wft export records older than x days (using SYSTEM_DATA item to hold retention period)
	p_delete_old_exports();
	
	-- Set audit context
	set_sups_app_ctx('CCBC_BATCH', 0, 'WFTExport' );

	FOR grp_crt IN c_get_grouping_courts LOOP
	
		BEGIN
	
			IF p_debug = 'Y' THEN
				DBMS_OUTPUT.PUT_LINE('Grouping Court: '||grp_crt.wft_grouping_court);
			END IF;
		
			-- Generate the file name
			SELECT grp_crt.wft_grouping_court||'WFT'||TO_CHAR(SYSDATE,'YYYYMMDD_HH24MI')||'.csv' INTO l_wft_file_name FROM dual;
			
			SELECT  content_sequence.NEXTVAL
			INTO    l_content_store_id
			FROM    dual;
			
			-- create a record with an empty blob into which the file will be loaded
			INSERT INTO content_store (id, data)
			VALUES ( l_content_store_id, EMPTY_BLOB() )
			RETURNING DATA INTO l_dataLOB;
			
			-- Write the file header
			l_tmp_str := get_csv_header();
			p_write_to_blob( l_dataLOB, l_tmp_str );

			FOR court_rec IN c_get_courts_in_group(grp_crt.wft_grouping_court) LOOP

				-- Get count of unextracted WFT records for the court
				SELECT COUNT(*) INTO l_prev_crt_count FROM window_for_trial WHERE wft_extracted_for_dm IS NULL AND wft_previous_court  = court_rec.code;
				SELECT COUNT(*) INTO l_curr_crt_count FROM window_for_trial WHERE wft_extracted_for_dm IS NULL AND wft_current_court = court_rec.code;
			
				IF p_debug = 'Y' THEN
					DBMS_OUTPUT.PUT_LINE('Court: '||court_rec.code||' ('||l_prev_crt_count||' + '||l_curr_crt_count||') records');
				END IF;
				
				IF l_curr_crt_count > 0 THEN
					-- Retrieve WFT Records for Current Court
					FOR curr_wft_rec IN c_get_current_wft_records(court_rec.code) LOOP 
						l_tempLOB := get_curr_crt_wft_line(court_rec.code, curr_wft_rec.wft_case_number, curr_wft_rec.wft_id);
						p_write_clob_to_blob(l_dataLOB, l_tempLOB);
					END LOOP;
				END IF;
				
				IF l_prev_crt_count > 0 THEN
					-- Retrieve WFT Records for Previous Court
					FOR prev_wft_rec IN c_get_previous_wft_records(court_rec.code) LOOP 
						l_tempLOB := get_prev_crt_wft_line(court_rec.code, prev_wft_rec.wft_case_number, prev_wft_rec.wft_id);
						p_write_clob_to_blob(l_dataLOB, l_tempLOB);
					END LOOP;
				END IF;
				
				IF l_prev_crt_count = 0 AND l_curr_crt_count = 0 THEN
					-- No records for this court
					l_tmp_str := get_no_data_line(court_rec.code);
					p_write_to_blob(l_dataLOB, l_tmp_str);
				END IF;
			
			END LOOP;
			
			-- Write the CSV file to the database
			l_loaded := 'N';
			p_insert_csv_file(l_wft_file_name, grp_crt.wft_grouping_court, l_content_store_id, l_loaded);
			
			IF l_loaded = 'N' THEN
				DBMS_OUTPUT.PUT_LINE('Loading of '||l_wft_file_name||' for court '||grp_crt.wft_grouping_court||' failed!');
				l_error := 'Y';
			ELSE	
				DBMS_OUTPUT.PUT_LINE('Loading of '||l_wft_file_name||' for court '||grp_crt.wft_grouping_court||' complete');
			END IF;
		
		EXCEPTION
			WHEN OTHERS THEN
				ROLLBACK;
				l_error := 'Y';
				DBMS_OUTPUT.PUT_LINE('Loading of '||l_wft_file_name||' for court '||grp_crt.wft_grouping_court||' failed! ' || SQLERRM);
				p_log_error(grp_crt.wft_grouping_court, SQLERRM);
		END;

	END LOOP;
	
	-- Update the WFT records so are not processed again
	p_post_extract_updates();
	
	IF l_error = 'Y' THEN
		-- Error processing at least one of the Grouping Courts
		RAISE_APPLICATION_ERROR(-20001,'Exception generating WFT Export');
	END IF;
	
EXCEPTION
	WHEN OTHERS THEN
		DBMS_OUTPUT.PUT_LINE('Error in p_run_wft_export: ' ||SQLERRM);
		ROLLBACK;
		RAISE;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_run_wft_export_single_court
| DESCRIPTION  : Runs the WFT Export job for a single court after the WFT records have been updated
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_run_wft_export_single_court (p_grouping_crt	IN courts.wft_grouping_court%TYPE
										,p_export_date	IN VARCHAR2
										,p_debug IN  VARCHAR2) IS
	
	CURSOR c_get_courts_in_group IS
	SELECT code 
	FROM courts 
	WHERE caseman_inservice = 'Y' 
	AND sups_centralised_flag = 'Y' 
	AND  wft_grouping_court = p_grouping_crt
	ORDER BY code;
	
	CURSOR c_get_current_wft_records (p_court_code NUMBER) IS
	SELECT wft_id, wft_case_number 
	FROM window_for_trial 
	WHERE TRUNC(wft_extracted_for_dm) = TO_DATE(p_export_date,'DD-Mon-YYYY')
	AND  wft_current_court = p_court_code;
	
	CURSOR c_get_previous_wft_records (p_court_code NUMBER) IS
	SELECT wft_id, wft_case_number  FROM window_for_trial 
	WHERE TRUNC(wft_extracted_for_dm) = TO_DATE(p_export_date,'DD-Mon-YYYY')
	AND  wft_previous_court = p_court_code;

	l_prev_crt_count	NUMBER	:= 0;
	l_curr_crt_count	NUMBER	:= 0;
	l_loaded    VARCHAR2(1);
	l_wft_file_name	VARCHAR2(30);
	l_tmp_str	VARCHAR2(2000);
	l_error    VARCHAR2(1) := 'N';
	l_export_date	DATE;
	
	l_dataLOB	BLOB;
	l_tempLOB	CLOB;
	
	l_content_store_id	content_store.id%TYPE;
	
BEGIN
	
	-- Set audit context
	set_sups_app_ctx('CCBC_BATCH', 0, 'WFTExport' );
	
	l_export_date := TO_DATE(p_export_date,'DD-Mon-YYYY');
	
	IF p_debug = 'Y' THEN
		DBMS_OUTPUT.PUT_LINE('Grouping Court: '||p_grouping_crt);
	END IF;

	-- Generate the file name
	SELECT p_grouping_crt||'WFT'||TO_CHAR(l_export_date,'YYYYMMDD_HH24MI')||'.csv' INTO l_wft_file_name FROM dual;
	
	SELECT  content_sequence.NEXTVAL
	INTO    l_content_store_id
	FROM    dual;
	
	-- create a record with an empty blob into which the file will be loaded
	INSERT INTO content_store (id, data)
	VALUES ( l_content_store_id, EMPTY_BLOB() )
	RETURNING DATA INTO l_dataLOB;
	
	-- Write the file header
	l_tmp_str := get_csv_header();
	p_write_to_blob( l_dataLOB, l_tmp_str );

	FOR court_rec IN c_get_courts_in_group LOOP

		-- Get count of unextracted WFT records for the court
		SELECT COUNT(*) INTO l_prev_crt_count FROM window_for_trial WHERE TRUNC(wft_extracted_for_dm) = TRUNC(l_export_date) AND wft_previous_court  = court_rec.code;
		SELECT COUNT(*) INTO l_curr_crt_count FROM window_for_trial WHERE TRUNC(wft_extracted_for_dm) = TRUNC(l_export_date) AND wft_current_court = court_rec.code;
	
		IF p_debug = 'Y' THEN
			DBMS_OUTPUT.PUT_LINE('Court: '||court_rec.code||' ('||l_prev_crt_count||' + '||l_curr_crt_count||') records');
		END IF;
		
		IF l_curr_crt_count > 0 THEN
			-- Retrieve WFT Records for Current Court
			FOR curr_wft_rec IN c_get_current_wft_records(court_rec.code) LOOP 
				l_tempLOB := get_curr_crt_wft_line(court_rec.code, curr_wft_rec.wft_case_number, curr_wft_rec.wft_id);
				p_write_clob_to_blob(l_dataLOB, l_tempLOB);
			END LOOP;
		END IF;
		
		IF l_prev_crt_count > 0 THEN
			-- Retrieve WFT Records for Previous Court
			FOR prev_wft_rec IN c_get_previous_wft_records(court_rec.code) LOOP 
				l_tempLOB := get_prev_crt_wft_line(court_rec.code, prev_wft_rec.wft_case_number, prev_wft_rec.wft_id);
				p_write_clob_to_blob(l_dataLOB, l_tempLOB);
			END LOOP;
		END IF;
		
		IF l_prev_crt_count = 0 AND l_curr_crt_count = 0 THEN
			-- No records for this court
			l_tmp_str := get_no_data_line(court_rec.code);
			p_write_to_blob(l_dataLOB, l_tmp_str);
		END IF;
	
	END LOOP;
	
	-- Write the CSV file to the database
	l_loaded := 'N';
	p_insert_csv_file(l_wft_file_name, p_grouping_crt, l_content_store_id, l_loaded);
	
	IF l_loaded = 'N' THEN
		DBMS_OUTPUT.PUT_LINE('Loading of '||l_wft_file_name||' for court '||p_grouping_crt||' failed!');
		l_error := 'Y';
	ELSE	
		DBMS_OUTPUT.PUT_LINE('Loading of '||l_wft_file_name||' for court '||p_grouping_crt||' complete');
	END IF;
	
	IF l_error = 'Y' THEN
		-- Error processing at least one of the Grouping Courts
		RAISE_APPLICATION_ERROR(-20001,'Exception generating WFT Export');
	END IF;
	
EXCEPTION
	WHEN OTHERS THEN
		DBMS_OUTPUT.PUT_LINE('Error in p_run_wft_export_single_court: ' ||SQLERRM);
		ROLLBACK;
		RAISE;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_delete_old_exports
| DESCRIPTION  : Deletes any exports that have passed their retention period
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_delete_old_exports IS

	CURSOR c_get_old_exports (p_ret_period NUMBER) IS
	SELECT report_queue_id
	FROM wft_exports
	WHERE export_date <= TRUNC(SYSDATE - p_ret_period);
	
	l_rq_id	report_queue.id%TYPE;
	l_retention_period NUMBER;

BEGIN

	-- Extract the retention period of the WFT documents
	SELECT item_value INTO l_retention_period
	FROM system_data WHERE item = 'WFT_DOC_RETENTION' AND admin_court_code = 0;

	FOR rec IN c_get_old_exports(l_retention_period) LOOP

		-- Update the REPORT_QUEUE record so that the output is deleted
		-- as part of the sups_sheduled_jobs.cc_clear_document_store() batch job
		UPDATE report_queue SET storage_duration = 1 WHERE id = rec.report_queue_id;
	
	END LOOP;
	
	-- Delete the out of date WFT_EXPORTS records
	DELETE FROM wft_exports
	WHERE export_date <= TRUNC(SYSDATE - l_retention_period);
	
	COMMIT;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_post_extract_updates
| DESCRIPTION  : Performs the post extract updates on the window_for_trial records 
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_post_extract_updates IS

BEGIN

	UPDATE window_for_trial SET wft_extracted_for_dm = SYSDATE
	WHERE wft_extracted_for_dm IS NULL;

	COMMIT;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_insert_csv_file
| DESCRIPTION  : Loads the WFT file contents into the report_queue, document_store, content_store
|				 and the wft_exports tables
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_insert_csv_file (p_filename 	IN VARCHAR2
							,p_grouping_crt	IN courts.wft_grouping_court%TYPE
							,p_content_store_id	IN content_store.id%TYPE
							,p_file_loaded  OUT VARCHAR2) IS

	n_content_store_id  NUMBER;
	n_document_store_id NUMBER;
	n_report_id         NUMBER;
	v_mime_type         VARCHAR2(15) := 'text/csv'; 
	n_user_id           VARCHAR2(10 CHAR);
	n_court_id          VARCHAR2(3 CHAR);
	v_metadata			VARCHAR2(250);

BEGIN
	p_file_loaded := 'Y';
	
	-- get the user id and court id 
	n_user_id   := 'CCBC_BATCH';
	n_court_id  := TO_CHAR(p_grouping_crt);
	
	-- get the report id immediately as its needed to record errors
	SELECT  report_queue_sequence.NEXTVAL
	INTO    n_report_id
	FROM    dual;
	
	SELECT document_sequence.NEXTVAL
	INTO n_document_store_id
	FROM dual;                    
	
	-- populate Document_store
	v_metadata := '<document-headers><document-header><type>Content-Disposition</type><value>attachment;filename='||p_filename||'</value></document-header></document-headers>';
	
	INSERT INTO document_store (id, user_id , court_id, mime_type, is_viewed, is_persistent, content_store_id, created_date, metadata)
	VALUES     ( n_document_store_id  ,n_user_id , n_court_id , v_mime_type ,'F', 'T', p_content_store_id, SYSDATE, TO_CLOB(v_metadata));
	
	-- populate report_queue
	INSERT INTO report_queue (id, parent_id, status , mime_type, type , parameters, user_id , court_id, created_date, storage_duration, is_parent, document_id, send_status, print_status)
	VALUES      (n_report_id, n_report_id, 2, v_mime_type , 0 , '<params />', n_user_id , n_court_id , SYSDATE,  -1, 0, n_document_store_id, 0, 0);
	
	-- populate wft_exports
	INSERT INTO wft_exports (court_code, export_date, report_queue_id, filename)
	VALUES		(p_grouping_crt, TRUNC(SYSDATE), n_report_id, p_filename);

	COMMIT;
	
EXCEPTION
	WHEN OTHERS THEN
		ROLLBACK;
		p_file_loaded := 'N';
		DBMS_OUTPUT.PUT_LINE('Error in p_insert_csv_file for court '||n_court_id||': '||SQLERRM);
		p_log_error(p_grouping_crt, SQLERRM);

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_write_to_blob
| DESCRIPTION  : Writes the CSV content to the CONTENT_STORE.DATA BLOB column
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_write_to_blob (p_destLob IN OUT BLOB, p_buffer IN VARCHAR2) IS

	amt BINARY_INTEGER;
	l_buffer RAW(32000);

BEGIN

	DBMS_LOB.OPEN(p_destLob, DBMS_LOB.LOB_READWRITE);
	
	l_buffer := UTL_RAW.CAST_TO_RAW(p_buffer);
	amt := UTL_RAW.LENGTH(l_buffer);
	
	DBMS_LOB.WRITEAPPEND(p_destLob, amt, l_buffer);
	
	DBMS_LOB.CLOSE(p_destLob);
	
EXCEPTION
	WHEN OTHERS THEN
		DBMS_OUTPUT.PUT_LINE('p_write_to_blob: ' ||SQLERRM);
		RAISE;
	
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_write_clob_to_blob
| DESCRIPTION  : Writes the CSV content to the CONTENT_STORE.DATA BLOB column
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_write_clob_to_blob (p_destLob IN OUT BLOB, p_buffer IN CLOB) IS

	v_offset NUMBER DEFAULT 1;
	v_amount NUMBER DEFAULT 4096;
	v_amountwrite NUMBER;
	v_buffer VARCHAR2(4096 CHAR);
	
BEGIN

	DBMS_LOB.OPEN(p_destLob, DBMS_LOB.LOB_READWRITE);

	BEGIN
	LOOP
		DBMS_LOB.READ (lob_loc => p_buffer,
					   amount  => v_amount,
					   offset  => v_offset,
					   buffer  => v_buffer);

		v_amountwrite := UTL_RAW.LENGTH (r => UTL_RAW.CAST_TO_RAW(c => v_buffer));

		DBMS_LOB.WRITEAPPEND( p_destLob, v_amountwrite, UTL_RAW.CAST_TO_RAW(v_buffer) );

		v_offset := v_offset + v_amount;
		v_amount := 4096;
	END LOOP;
	EXCEPTION
		WHEN NO_DATA_FOUND THEN
			NULL;
	END;
	
	DBMS_LOB.CLOSE(p_destLob);
	
EXCEPTION
	WHEN OTHERS THEN
		DBMS_OUTPUT.PUT_LINE('p_write_clob_to_blob: ' ||SQLERRM);
		RAISE;
	
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : append_large_varchar
| DESCRIPTION  : Appends a varchar2 which when gets too big, gets written to a CLOB instead
------------------------------------------------------------------------------------------------------*/
PROCEDURE append_large_varchar(v_clob IN OUT NOCOPY CLOB, v_vc IN OUT NOCOPY VARCHAR2, v_app VARCHAR2) IS
BEGIN
	v_vc := v_vc || v_app;
EXCEPTION 
	WHEN VALUE_ERROR THEN
		IF v_clob IS NULL THEN
			v_clob := v_vc;
		ELSE
			DBMS_LOB.APPEND(v_clob, v_vc);
		END IF;
		v_vc := v_app;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_csv_header
| DESCRIPTION  : Writes the standard file header
------------------------------------------------------------------------------------------------------*/
FUNCTION get_csv_header RETURN VARCHAR2 IS
						  
	pv_file_line VARCHAR2(500);
	
BEGIN

	pv_file_line := 'CLAIM NUMBER,any ZDIARYMAIN CLAIMANT,any ZDIARYMAIN DEFENDANT,Track,DAYS,HOURS,MINUTES,From,To,COURT,' ||
					'STATUS,OUTCOME DATE,JUDGES NAME,REASON FOR ADJOURNMENT,CMC FLAG,CMC DATE,NOTES,EXCLUDED DATES'||CHR(13);
	
	RETURN pv_file_line;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_no_data_line
| DESCRIPTION  : Writes the no data line
------------------------------------------------------------------------------------------------------*/
FUNCTION get_no_data_line (p_code IN courts.code%TYPE) RETURN VARCHAR2 IS
							 
	pv_file_line VARCHAR(500);
	
BEGIN

	SELECT 'No_records_retrieved_for_ ' || name || ',,,,,,,,,,,,,,,,,' || CHR(13)
	INTO pv_file_line
	FROM courts
	WHERE code = p_code;

	RETURN pv_file_line;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_curr_crt_wft_line
| DESCRIPTION  : Writes a WFT record line for the current court
------------------------------------------------------------------------------------------------------*/
FUNCTION get_curr_crt_wft_line (p_crt_code IN courts.code%TYPE
								  ,p_case_number IN cases.case_number%TYPE
								  ,p_wft_id IN window_for_trial.wft_id%TYPE) RETURN CLOB IS
								  
	CURSOR	c_get_exclusions IS
	SELECT 	TO_CHAR( wfe.wfe_exclusion_date,'DD/MM/YYYY')||'; '
	FROM   	wft_exclusions wfe, window_for_trial w
	WHERE  	wfe.wfe_wft_case_number = w.wft_case_number
	AND 	w.wft_case_number = p_case_number
	AND 	w.wft_id = p_wft_id
	AND 	wfe.wfe_wft_id = w.wft_id
	AND 	w.wft_current_court=p_crt_code;
	
	TYPE t_exclusions IS TABLE OF VARCHAR2(15);
	lst_exclusions t_exclusions;
							   
	pv_file_line VARCHAR(4000);
	l_curr_crt_excl_count	NUMBER;
	pc_CLOB CLOB;
	
BEGIN

	pc_CLOB := NULL;
	
	SELECT 
		w.wft_case_number ||',"'||
		(SELECT dc.person_requested_name FROM parties dc, window_for_trial wc, case_party_roles cpc, courts coc
			WHERE wc.wft_case_number	= cpc.case_number
			AND   wc.wft_case_number	= w.wft_case_number
			AND   wc.wft_id			= w.wft_id
			AND   dc.party_id		= cpc.party_id
			AND   cpc.party_role_code	= 'CLAIMANT'
			AND   cpc.case_party_no		= 1
			AND   wc.wft_current_court       = coc.code
			AND   wc.wft_current_court	= p_crt_code) ||'","' ||
		(SELECT dc.person_requested_name FROM parties dc, window_for_trial wc, case_party_roles cpc, courts coc
			WHERE wc.wft_case_number	= cpc.case_number
			AND   wc.wft_case_number	= w.wft_case_number
			AND   wc.wft_id			= w.wft_id
			AND   dc.party_id		= cpc.party_id
			AND   cpc.party_role_code	= 'DEFENDANT'
			AND   cpc.case_party_no		= 1
			AND   wc.wft_current_court       = coc.code
			AND   wc.wft_current_court	= p_crt_code) ||'",' ||
		DECODE(w.wft_track,'MULTI','Multi','FAST','Fast',w.wft_track) ||',' ||
		TO_CHAR(w.wft_estimated_days) ||',' ||
		TO_CHAR(w.wft_estimated_hours) ||',' ||
		TO_CHAR(w.wft_estimated_mins) ||',' ||
		TO_CHAR(w.wft_start_date,'DD/MM/YYYY') ||',' ||
		TO_CHAR(w.wft_end_date,'DD/MM/YYYY') ||',' ||
		DECODE(co.code, 238, 'KINGS LYNN', co.name) ||',' ||
		w.wft_status ||',' ||
		TO_CHAR(w.wft_outcome_date,'DD/MM/YYYY') ||',' ||
		w.wft_judges_name ||',' ||
		w.wft_reason_for_adj ||',' ||
		w.wft_case_manage_conf_flag ||',' ||
		TO_CHAR(w.wft_case_manage_conf_date,'DD/MM/YYYY') ||',"' ||
		w.wft_notes ||'",'
	INTO pv_file_line
	FROM  window_for_trial w, courts co
	WHERE w.wft_current_court       = co.code
	AND   w.wft_current_court	= p_crt_code
	AND   w.wft_case_number = p_case_number
	AND   w.wft_id = p_wft_id
	ORDER BY w.wft_case_number, w.wft_id;
	
	-- Retrieve WFT Exclusions Date Count (Current Court)
	SELECT 	COUNT(*) INTO l_curr_crt_excl_count
	FROM   	wft_exclusions wfe, window_for_trial w
	WHERE  	wfe.wfe_wft_case_number = w.wft_case_number
	AND 	w.wft_case_number = p_case_number
	AND 	w.wft_id = p_wft_id
	AND 	wfe.wfe_wft_id = w.wft_id
	AND 	w.wft_current_court = p_crt_code;

	-- If exclusion dates exist, extract them
	IF l_curr_crt_excl_count > 0 THEN
		OPEN c_get_exclusions;
		FETCH c_get_exclusions
		BULK COLLECT INTO lst_exclusions;

		FOR i IN 1..lst_exclusions.COUNT
		LOOP
			append_large_varchar(pc_CLOB, pv_file_line, lst_exclusions(i));
		END LOOP;

		lst_exclusions.DELETE;
		CLOSE c_get_exclusions;
	END IF;
	
	append_large_varchar(pc_CLOB, pv_file_line, ',' || CHR(13));
	pc_CLOB := pc_CLOB || pv_file_line;

	RETURN pc_CLOB;

END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : FUNCTION
| NAME         : get_prev_crt_wft_line
| DESCRIPTION  : Writes a WFT record line for the previous court
------------------------------------------------------------------------------------------------------*/
FUNCTION get_prev_crt_wft_line (p_crt_code IN courts.code%TYPE
								  ,p_case_number IN cases.case_number%TYPE
								  ,p_wft_id IN window_for_trial.wft_id%TYPE) RETURN CLOB IS
								  
	CURSOR	c_get_exclusions IS
	SELECT 	TO_CHAR( wfe.wfe_exclusion_date,'DD/MM/YYYY')||'; '
	FROM   	wft_exclusions wfe, window_for_trial w
	WHERE  	wfe.wfe_wft_case_number = w.wft_case_number
	AND 	w.wft_case_number = p_case_number
	AND 	w.wft_id = p_wft_id
	AND 	wfe.wfe_wft_id = w.wft_id
	AND 	w.wft_previous_court=p_crt_code;
	
	TYPE t_exclusions IS TABLE OF VARCHAR2(15);
	lst_exclusions t_exclusions;
							   
	pv_file_line VARCHAR(4000);
	l_prev_crt_excl_count	NUMBER;
	pc_CLOB CLOB;
	
BEGIN

	pc_CLOB := NULL;
	
	SELECT 
		w.wft_case_number || ',"' ||
		(SELECT dc.person_requested_name FROM parties dc, window_for_trial wc, case_party_roles cpc, courts coc
			WHERE wc.wft_case_number	= cpc.case_number
			AND   wc.wft_case_number	= w.wft_case_number
			AND   wc.wft_id			= w.wft_id
			AND   dc.party_id		= cpc.party_id
			AND   cpc.party_role_code	= 'CLAIMANT'
			AND   cpc.case_party_no		= 1
			AND   wc.wft_previous_court       = coc.code
			AND   wc.wft_previous_court	= p_crt_code) || '","' ||
		(SELECT dc.person_requested_name FROM parties dc, window_for_trial wc, case_party_roles cpc, courts coc
			WHERE wc.wft_case_number	= cpc.case_number
			AND   wc.wft_case_number	= w.wft_case_number
			AND   wc.wft_id			= w.wft_id
			AND   dc.party_id		= cpc.party_id
			AND   cpc.party_role_code	= 'DEFENDANT'
			AND   cpc.case_party_no		= 1
			AND   wc.wft_previous_court       = coc.code
			AND   wc.wft_previous_court	= p_crt_code) || '",' ||
		DECODE(w.wft_track,'MULTI','Multi','FAST','Fast',w.wft_track) || ',' ||
		TO_CHAR(w.wft_estimated_days) || ',' ||
		TO_CHAR(w.wft_estimated_hours) || ',' ||
		TO_CHAR(w.wft_estimated_mins) || ',' ||
		TO_CHAR(w.wft_start_date,'DD/MM/YYYY') || ',' ||
		TO_CHAR(w.wft_end_date,'DD/MM/YYYY') || ',' ||
		DECODE(co.code, 238, 'KINGS LYNN', co.name) || ',' ||
		'TRANSFERRED' || ',' ||
		TO_CHAR(w.wft_outcome_date,'DD/MM/YYYY') || ',' ||
		w.wft_judges_name || ',' ||
		w.wft_reason_for_adj || ',' ||
		w.wft_case_manage_conf_flag || ',' ||
		TO_CHAR(w.wft_case_manage_conf_date,'DD/MM/YYYY') || ',"' ||
		w.wft_notes||'",'
	INTO pv_file_line
	FROM  window_for_trial w, courts co
	WHERE w.wft_previous_court       = co.code
	AND   w.wft_previous_court	= p_crt_code
	AND   w.wft_case_number = p_case_number
	AND   w.wft_id = p_wft_id
	ORDER BY w.wft_case_number, w.wft_id;
	
	-- Retrieve WFT Exclusions Date Count (Previous Court)
	SELECT 	COUNT(*) INTO l_prev_crt_excl_count
	FROM   	wft_exclusions wfe, window_for_trial w
	WHERE  	wfe.wfe_wft_case_number = w.wft_case_number
	AND 	w.wft_case_number = p_case_number
	AND 	w.wft_id = p_wft_id
	AND 	wfe.wfe_wft_id = w.wft_id
	AND 	w.wft_previous_court = p_crt_code;
	
	-- If exclusion dates exist, extract them and build them into a string
	IF l_prev_crt_excl_count > 0 THEN
		OPEN c_get_exclusions;
		FETCH c_get_exclusions
		BULK COLLECT INTO lst_exclusions;

		FOR i IN 1..lst_exclusions.COUNT
		LOOP
			append_large_varchar(pc_CLOB, pv_file_line, lst_exclusions(i));
		END LOOP;

		lst_exclusions.DELETE;
		CLOSE c_get_exclusions;
	END IF;
	
	append_large_varchar(pc_CLOB, pv_file_line, ',' || CHR(13));
	pc_CLOB := pc_CLOB || pv_file_line;

	RETURN pc_CLOB;
END;

/*------------------------------------------------------------------------------------------------------
| TYPE         : PROCEDURE
| NAME         : p_log_error
| DESCRIPTION  : Writes an error message to the TRANSFER_ERROR_LOG table
------------------------------------------------------------------------------------------------------*/
PROCEDURE p_log_error (p_court_code IN NUMBER, p_err IN VARCHAR2) IS

BEGIN

	INSERT INTO transfer_error_log
	(transfer_date, transfer_type, sending_court, case_number, error_message)
	VALUES 
	(TRUNC(SYSDATE), NULL, p_court_code, 'WFTExprt', p_err);

	COMMIT;
END;

END wft_export_pkg;
/
