BEGIN
	-- Drop the external table if it already exists        
	EXECUTE IMMEDIATE 'DROP TABLE tmp_mcol_mig_info_ext';
	
	EXCEPTION
	
	WHEN OTHERS THEN
		   NULL;
END;
/

-- Load the Coded Parties in the CSV file to the external table
CREATE TABLE tmp_mcol_mig_info_ext (
	cred_code		NUMBER(4)
)
organization EXTERNAL
(
	DEFAULT directory EXTERNAL_DIR
	ACCESS PARAMETERS
	(
		records delimited BY newline
		fields terminated BY ','
		missing field VALUES ARE NULL
		(
			CRED_CODE
		)
	)
	location ('coded_creditors.csv')
) reject LIMIT 1;

DECLARE

	-- Local variables
	n_count_completed	NUMBER;
	n_count_total  		NUMBER;
	n_count_ncp			NUMBER;
	n_count_ncpt		NUMBER;
	n_coded_cred		NUMBER;
	
	-- Declare user exceptions
	e_not_a_coded_creditor	EXCEPTION;
	e_creditor_already_loaded	EXCEPTION;
	PRAGMA EXCEPTION_INIT(e_not_a_coded_creditor, -20000);
	PRAGMA EXCEPTION_INIT(e_creditor_already_loaded, -20001);

	-- Cursor to retrieve all the coded parties loaded into the external table
	CURSOR c_get_new_coded_creditors IS
	SELECT 	cred_code
	FROM tmp_mcol_mig_info_ext;

BEGIN
	
	-- Get the total number of Coded Parties to add and initialise variable holding number completed.
	SELECT COUNT(*)
	INTO n_count_total
	FROM c_get_new_coded_creditors;
	
	n_count_completed := 0;

	-- Loop through all coded parties loaded into the external table
	FOR rec_ncp IN c_get_new_coded_creditors
	LOOP
	
		n_coded_cred := rec_ncp.cred_code;
	
		-- Test to see if the coded creditor is a coded creditor
		SELECT COUNT(*)
		INTO 	n_count_ncp
		FROM 	national_coded_parties
		WHERE 	code = rec_ncp.cred_code;
		
		IF n_count_ncp = 0 THEN
			RAISE e_not_a_coded_creditor;
		END IF;
		
		-- Test to see if the coded creditor has not been loaded previously
		SELECT COUNT(*)
		INTO 	n_count_ncpt
		FROM 	tmp_mcol_mig_info
		WHERE 	cred_code = rec_ncp.cred_code;
		
		IF n_count_ncpt > 0 THEN
			RAISE e_creditor_already_loaded;
		END IF;

		-- Insert tmp_mcol_mig_info row
		INSERT INTO tmp_mcol_mig_info (
			cred_code
			,migration_complete
		)
		VALUES (
			rec_ncp.cred_code
			,'N'
		);
		
		n_count_completed := n_count_completed + 1;
	
	END LOOP;
	
	-- Information line on number of coded creditors added
	dbms_output.put_line(n_count_completed || ' coded creditors added');
	
	COMMIT;
	
EXCEPTION

		-- Coded Party is not a National Coded Party
		WHEN e_not_a_coded_creditor THEN        
			dbms_output.put_line('Error: The Creditor Code: ' || n_coded_cred || ' is not a National Coded Party.');
			RAISE;
			
		-- Coded Creditor has already been loaded previously
		WHEN e_creditor_already_loaded THEN        
			dbms_output.put_line('Error: The Creditor Code: ' || n_coded_cred || ' has already been loaded.');
			RAISE;

		WHEN OTHERS THEN
			dbms_output.put_line('Unknown error has occurred!!!');
			dbms_output.put_line(n_count_completed || ' out of ' ||  n_count_total || ' completed.');
			dbms_output.put_line(SUBSTR(SQLERRM,1,500));
			ROLLBACK;
			RAISE;
	
END;

/

-- Drop the external table
BEGIN
        
	EXECUTE IMMEDIATE 'DROP TABLE tmp_mcol_mig_info_ext';
	
	EXCEPTION
	
	WHEN OTHERS THEN
		   NULL;
END;
/