SET TERMOUT OFF
SET TIME OFF
SET TIMING OFF
SET FEEDBACK OFF
SET ECHO OFF
SET TRIMSPOOL ON
SET TRIMOUT ON
SET PAGESIZE 0
SET VERIFY OFF
SET SERVEROUTPUT ON
SET LINESIZE 2000

COLUMN dt new_val timestring
SELECT TO_CHAR(SYSDATE, 'YYYYMMDD-HH24MISS') dt FROM dual;

SPOOL sdt_migration_info_only.&timestring..log

DECLARE
	
	TYPE TCredList IS TABLE OF tmp_mcol_mig_info.cred_code%TYPE;
	creditorList TCredList;
	
	TYPE TClaimList IS TABLE OF tmp_mcol_mig_cred_claims.case_number%TYPE;
	claimList TClaimList;		-- Use this collection for processing
	emptyClaimList TClaimList;	-- Use this empty collection to reset the main one for each creditor
	
	CURSOR c_claims_to_be_migrated IS
	SELECT 	case_number
	FROM	tmp_mcol_mig_cred_claims;
	
	l_cred_code				tmp_mcol_mig_info.cred_code%TYPE;
	l_case_number			tmp_mcol_mig_cred_claims.case_number%TYPE;
	l_count_claims			NUMBER;
	l_count_parties			NUMBER;
	l_count_judgments		NUMBER;
	l_count_warrants		NUMBER;
	l_count_events			NUMBER;
	l_count_mig_claims		NUMBER;
	l_count_failed			NUMBER;
	l_claim_valid			BOOLEAN;
	l_timestring			VARCHAR2(30);

BEGIN

	-- Retrieve all coded creditors to be migrated
	SELECT  t.cred_code BULK COLLECT 
	INTO 	creditorList
	FROM 	tmp_mcol_mig_info t
	WHERE	t.migration_complete = 'N'
	ORDER BY t.cred_code;
	
	-- Clear down the database tables to be exported
	sdt_mcol_mig_pack.p_clean_tables();
	
	FOR i IN 1 .. creditorList.COUNT
	LOOP
	
		l_cred_code := creditorList(i);
		
		SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
		dbms_output.put_line(l_timestring || ' Start Coded Party ' || l_cred_code);
	
		-- Load all 335 owned cases for the creditor into the temporary table
		sdt_mcol_mig_pack.p_populate_creditor_claims(l_cred_code);
		
		-- Filter out any with no activity in the last three years
		sdt_mcol_mig_pack.p_filter_creditor_claims();
		
		-- Remove any inactive cases so left with only those that can be migrated
		sdt_mcol_mig_pack.p_delete_inactive_claims();
		
		-- Initialise record counts
		l_count_claims := 0;
		l_count_parties := 0;
		l_count_judgments := 0;
		l_count_warrants := 0;
		l_count_events := 0;
		l_count_failed := 0;
		l_count_mig_claims := 0;

        OPEN c_claims_to_be_migrated;
		LOOP
			-- Bulk collect the creditor cases
			FETCH c_claims_to_be_migrated BULK COLLECT INTO claimList LIMIT 1000;

			FOR x IN 1 .. claimList.COUNT
			LOOP

				-- For each case, count the number of child records and increment the creditor record count variables
				l_case_number := claimList(x);
				l_count_claims := l_count_claims + 1;
				l_count_parties := l_count_parties + sdt_mcol_mig_pack.f_get_count_parties(l_case_number);
				l_count_judgments := l_count_judgments + sdt_mcol_mig_pack.f_get_count_judgments(l_case_number);
				l_count_warrants := l_count_warrants + sdt_mcol_mig_pack.f_get_count_warrants(l_case_number);
				l_count_events := l_count_events + sdt_mcol_mig_pack.f_get_count_events(l_case_number);
				
				-- Validate the case, passing TRUE in to write exception to database table
				sdt_mcol_mig_pack.p_validate_claim(l_case_number, l_cred_code, TRUE, l_claim_valid);
				
				IF l_claim_valid = TRUE THEN

				l_count_mig_claims := l_count_mig_claims + 1;
					
				ELSE
				
					l_count_failed := l_count_failed + 1;
				
				END IF;
			
			END LOOP;
			
			COMMIT;
		
			EXIT WHEN c_claims_to_be_migrated%NOTFOUND;
		END LOOP;
		
		CLOSE c_claims_to_be_migrated;
				
		-- Initialise the collections to the empty equivalents
		claimList := emptyClaimList;
		
		-- Update the creditor row with migration statistics now migration is complete
		UPDATE 	tmp_mcol_mig_info
		SET		count_claims = l_count_claims
				,transferred_claims = l_count_mig_claims
				,count_judgments = l_count_judgments
				,count_warrants = l_count_warrants
				,count_parties = l_count_parties
				,count_events = l_count_events
				,failed_claims = l_count_failed
				,migration_date = SYSDATE
				,migration_complete = 'Y'
		WHERE	cred_code = l_cred_code;
		
		COMMIT;
		
		SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
		dbms_output.put_line(l_timestring || ' Completed Coded Party ' || l_cred_code);
		
	END LOOP;

	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Migration (Cases Only) Complete.');

END;

/

SPOOL OFF