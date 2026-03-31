CREATE OR REPLACE PACKAGE sdt_mcol_mig_pack IS
    /******************************************************************************************************************/
    /*                                                 P A C K A G E                                                  */
    /******************************************************************************************************************/

	/******************************************************************************************************************/
    /* Module     : SDT_MCOL_MIG_PACK.pck                                                                             */
    /* Description: Package used to store common procedures used to migrate data from CaseMan to MCOL                 */
    /*              as part of the CCBC SDT solution.                                                                 */
    /*                                                                                                                */
    /* Amendment History                                                                                              */
    /*                                                                                                                */
    /* Date         Name             Amendment                                                                        */
    /* ------------------------------------------------------------------------                                       */
    /*                                                                                                                */
	/******************************************************************************************************************/
	
    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_clean_tables                                                                                  */
    /* DESCRIPTION	: Truncates all the migration tables ready for population                                         */
    /******************************************************************************************************************/
    PROCEDURE p_clean_tables;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_populate_creditor_claims                                                                      */
    /* DESCRIPTION	: Populates the tmp_mcol_mig_cred_claims table                                                    */
    /******************************************************************************************************************/
    PROCEDURE p_populate_creditor_claims(
        p_cred_code             IN cases.cred_code%TYPE);

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_filter_creditor_claims                                                                        */
    /* DESCRIPTION	: Filters the creditor claims to be processed by looking for those with event activity            */
    /******************************************************************************************************************/
    PROCEDURE p_filter_creditor_claims;
	
    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_delete_inactive_claims                                                                        */
    /* DESCRIPTION	: Deletes any records from tmp_mcol_mig_cred_claims with no activity in the last 3 years          */
    /******************************************************************************************************************/
    PROCEDURE p_delete_inactive_claims;
	
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_parties                                                                             */
    /* DESCRIPTION	: Returns the number of Defendant and Claimant parties on a case record                           */
    /******************************************************************************************************************/
    FUNCTION f_get_count_parties(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER;
		
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_judgments                                                                           */
    /* DESCRIPTION	: Returns the number of Judgments to be migrated on a case                                        */
	/*				  note that only one Judgment (the latest) per defendant can be migrated						  */
    /******************************************************************************************************************/
    FUNCTION f_get_count_judgments(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER;
		
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_warrants                                                                            */
    /* DESCRIPTION	: Returns the number of Warrants to be migrated on a case                                         */
	/*				  We're only interested in home warrants (not foreign or reissued) with the type EXECUTION		  */
    /******************************************************************************************************************/
    FUNCTION f_get_count_warrants(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER;
		
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_events                                                                              */
    /* DESCRIPTION	: Returns the number of Case Events to be migrated on a case                                      */
	/*				  For 620 events, need to exclude those linked to final returns 147 and 156						  */
    /******************************************************************************************************************/
    FUNCTION f_get_count_events(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER;
		
	/******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_validate_claim                                                                                */
    /* DESCRIPTION	: Validates the claim and writes a row to the tmp_mcol_mig_failures if needed                     */
    /******************************************************************************************************************/
    PROCEDURE p_validate_claim(
		p_case_number		IN cases.case_number%TYPE,
		p_cred_code         IN cases.cred_code%TYPE,
		p_write_db			IN BOOLEAN,
		p_valid         	OUT BOOLEAN);
		
	/******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_claim_exception                                                                        */
    /* DESCRIPTION	: Inserts a row to the tmp_mcol_mig_failures table							                      */
    /******************************************************************************************************************/
    PROCEDURE p_insert_claim_exception(
		p_case_number		IN cases.case_number%TYPE,
		p_cred_code         IN cases.cred_code%TYPE,
		p_error				IN tmp_mcol_mig_failures.failure_reason%TYPE,
		p_write_db			IN BOOLEAN);
		
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_status_reset_event_required                                                                   */
    /* DESCRIPTION	: Indicates whether or not the case status has been changed via an event 72,73,74,75,76,78,79     */
	/*				  but the status has since been reset to NULL.													  */
    /******************************************************************************************************************/
    FUNCTION f_status_reset_event_required(
		f_case_number		IN cases.case_number%TYPE) RETURN BOOLEAN;
                                                         
END sdt_mcol_mig_pack;
/
CREATE OR REPLACE PACKAGE BODY sdt_mcol_mig_pack IS
    /******************************************************************************************************************/
    /*                                            P A C K A G E  B O D Y                                              */
    /******************************************************************************************************************/

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_clean_tables                                                                                  */
    /* DESCRIPTION	: Truncates all the migration tables ready for population                                         */
    /******************************************************************************************************************/
    PROCEDURE p_clean_tables
    IS
    BEGIN
        EXECUTE IMMEDIATE 'TRUNCATE TABLE mcol_mig_claim_data';
		EXECUTE IMMEDIATE 'TRUNCATE TABLE mcol_mig_party_data';
		EXECUTE IMMEDIATE 'TRUNCATE TABLE mcol_mig_judgment_data';
		EXECUTE IMMEDIATE 'TRUNCATE TABLE mcol_mig_warrant_data';
		EXECUTE IMMEDIATE 'TRUNCATE TABLE mcol_mig_event_data';
    END p_clean_tables;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_populate_creditor_claims                                                                      */
    /* DESCRIPTION	: Populates the tmp_mcol_mig_cred_claims table                                                    */
    /******************************************************************************************************************/
    PROCEDURE p_populate_creditor_claims(
        p_cred_code             IN cases.cred_code%TYPE)
    IS

		TYPE ARRAY IS TABLE OF tmp_mcol_mig_cred_claims%ROWTYPE;
		l_data ARRAY;

        CURSOR c_cred_claims
        IS
            SELECT 	c.case_number
					,c.date_of_issue
					,'N'
					,'N'
					,'N'
					,'N'
            FROM   	cases c
            WHERE  	NVL(c.cred_code,-1) = p_cred_code
			AND		c.admin_crt_code = 335;

    BEGIN
	
		-- Truncate the tmp_mcol_mig_cred_claims table
		EXECUTE IMMEDIATE 'TRUNCATE TABLE tmp_mcol_mig_cred_claims';
	
        OPEN c_cred_claims;
		LOOP
			-- Bulk collect all claims for the coded creditor
			FETCH c_cred_claims BULK COLLECT INTO l_data LIMIT 1000;

			-- Insert into the tmp_mcol_mig_cred_claims table
			FORALL i IN 1..l_data.COUNT
			INSERT INTO tmp_mcol_mig_cred_claims VALUES l_data(i);

			EXIT WHEN c_cred_claims%NOTFOUND;
		END LOOP;
		CLOSE c_cred_claims;
		
		-- Update all claims to indicate whether or not have been created in the last three years
		UPDATE 	tmp_mcol_mig_cred_claims
		SET		created_in_range = 'Y'
		WHERE	date_of_issue > ADD_MONTHS(SYSDATE, -36);
		
		COMMIT;
    END p_populate_creditor_claims;


    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_filter_creditor_claims                                                                        */
    /* DESCRIPTION	: Filters the creditor claims to be processed by looking for those with event activity            */
    /******************************************************************************************************************/
    PROCEDURE p_filter_creditor_claims
    IS
    BEGIN
        -- Update all tmp_mcol_mig_cred_claims to state whether or not there has been any
		-- relevant case event activity in the last three years.
		UPDATE tmp_mcol_mig_cred_claims t
        SET    t.event_activity = 'Y'
        WHERE  t.created_in_range = 'N'
        AND EXISTS (SELECT 	NULL
					FROM 	case_events ce
					WHERE 	ce.case_number = t.case_number
					AND	  	ce.std_event_id IN 	(30
												,36
												,38
												,45
												,49
												,50
												,52
												,57
												,60
												,72
												,73
												,74
												,75
												,76
												,78
												,79
												,132
												,140
												,150
												,155
												,160
												,170
												,174
												,230
												,240
												,250
												,251
												,254
												,380
												,620)
					AND		ce.deleted_flag = 'N'
					AND		ce.event_date > ADD_MONTHS(SYSDATE, -36));

        COMMIT;

    END p_filter_creditor_claims;
	
    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_delete_inactive_claims                                                                        */
    /* DESCRIPTION	: Deletes any records from tmp_mcol_mig_cred_claims with no activity in the last 3 years          */
    /******************************************************************************************************************/
    PROCEDURE p_delete_inactive_claims
    IS
    BEGIN
        DELETE FROM tmp_mcol_mig_cred_claims t
		WHERE 	t.created_in_range = 'N'
		AND		t.event_activity = 'N';
		
		COMMIT;
    END p_delete_inactive_claims;
	
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_parties                                                                             */
    /* DESCRIPTION	: Returns the number of Defendant and Claimant parties on a case record                           */
    /******************************************************************************************************************/
    FUNCTION f_get_count_parties(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER
    IS
	
		l_count		NUMBER;

    BEGIN

		SELECT COUNT(*) INTO l_count
		FROM 	case_party_roles cpr
		WHERE 	cpr.case_number = f_case_number
		AND		cpr.party_role_code IN ('DEFENDANT','CLAIMANT');
		
		-- Return the number of defendants and claimants + 1 which is for the national coded party solicitor
		RETURN l_count + 1;
		
    END f_get_count_parties;
	
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_judgments                                                                           */
    /* DESCRIPTION	: Returns the number of Judgments to be migrated on a case                                        */
	/*				  note that only one Judgment (the latest) per defendant can be migrated						  */
    /******************************************************************************************************************/
    FUNCTION f_get_count_judgments(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER
    IS
	
		l_count		NUMBER;

    BEGIN

		SELECT COUNT(*) INTO l_count
		FROM 	judgments j
		WHERE 	j.case_number = f_case_number
		AND		j.against_party_role_code = 'DEFENDANT'
		AND 	j.judg_seq = (
						SELECT 	MAX(j2.judg_seq)
						FROM 	judgments j2
						WHERE 	j2.case_number = j.case_number
						AND		j2.against_party_role_code = j.against_party_role_code
						AND		j2.against_case_party_no = j.against_case_party_no);
		
		RETURN l_count;
		
    END f_get_count_judgments;
	
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_warrants                                                                            */
    /* DESCRIPTION	: Returns the number of Warrants to be migrated on a case                                         */
	/*				  We're only interested in home warrants (not foreign or reissued) with the type EXECUTION		  */
    /******************************************************************************************************************/
    FUNCTION f_get_count_warrants(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER
    IS
	
		l_count		NUMBER;

    BEGIN

		SELECT COUNT(*) INTO l_count
		FROM   	warrants w
		WHERE  	w.case_number = f_case_number
		AND		w.local_warrant_number IS NULL
		AND		w.original_warrant_number IS NULL
		AND		w.warrant_type IN ('EXECUTION','CONTROL')
		AND		w.issued_by = 335
		AND		w.currently_owned_by = 335;
		
		RETURN l_count;
		
    END f_get_count_warrants;
	
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_get_count_events                                                                              */
    /* DESCRIPTION	: Returns the number of Case Events to be migrated on a case                                      */
	/*				  For 620 events, need to exclude those linked to final returns 147 and 156						  */
    /******************************************************************************************************************/
    FUNCTION f_get_count_events(
		f_case_number		IN cases.case_number%TYPE) RETURN NUMBER
    IS
	
		l_count			NUMBER;
		l_count_fr		NUMBER;
		l_bad_returns	NUMBER;

    BEGIN

		SELECT COUNT(*) INTO l_count
		FROM   	case_events ce
		WHERE  	ce.case_number = f_case_number
		AND		ce.deleted_flag = 'N'
		AND		ce.result IS NULL
		AND		ce.std_event_id IN (
					SELECT 	tm.std_event_id
					FROM 	tmp_mcol_mig_event_mapping tm
					WHERE	tm.std_event_id != 620);
		
		SELECT COUNT(*) INTO l_count_fr
		FROM   	case_events ce, warrants w
		WHERE  	ce.case_number = f_case_number
		AND		ce.deleted_flag = 'N'
		AND		ce.std_event_id = 620
		AND   	w.warrant_id (+)= ce.warrant_id
		AND    	w.local_warrant_number IS NULL
		AND    	w.original_warrant_number IS NULL
		AND		w.warrant_type IN ('EXECUTION','CONTROL');
		
		IF l_count_fr > 0 THEN

			-- Get number of 620 events linked to unwanted warrant returns 147 and 156
			SELECT COUNT(*) INTO l_bad_returns
			FROM 	case_events ce, warrant_returns wr, warrants w
			WHERE 	ce.case_number = f_case_number
			AND		ce.deleted_flag = 'N'
			AND		ce.std_event_id = 620
			AND		wr.event_seq(+) = ce.event_seq
			AND		wr.return_code IN ('147','156')
			AND   	w.warrant_id (+)= ce.warrant_id
			AND    	w.local_warrant_number IS NULL
			AND    	w.original_warrant_number IS NULL
			AND		w.warrant_type IN ('EXECUTION','CONTROL');
		
		ELSE
		
			-- No final returns on the warrant, don't bother with the bad returns count
			l_bad_returns := 0;
		
		END IF;
		
		-- Check if need to add an additional event for the case status reset
		IF f_status_reset_event_required(f_case_number) = TRUE THEN
			l_count := l_count + 1;
		END IF;
		
		RETURN l_count + (l_count_fr - l_bad_returns);
		
    END f_get_count_events;
	
	/******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_validate_claim                                                                                */
    /* DESCRIPTION	: Validates the claim and writes a row to the tmp_mcol_mig_failures if needed                     */
    /******************************************************************************************************************/
    PROCEDURE p_validate_claim(
		p_case_number		IN cases.case_number%TYPE,
		p_cred_code         IN cases.cred_code%TYPE,
		p_write_db			IN BOOLEAN,
		p_valid         	OUT BOOLEAN)
    IS
	
		l_case_status			cases.status%TYPE;
		l_case_type				cases.case_type%TYPE;
		l_amount				cases.amount_claimed%TYPE;
		l_date					cases.date_of_issue%TYPE;
		l_partic_length			NUMBER;
		--l_invalid_postcode		VARCHAR2(1);
		l_invalid_warrant		VARCHAR2(1);
		l_payee_length			NUMBER;
		l_ncp_length			NUMBER;
		l_invalid_party_name	VARCHAR2(1);
		l_number_claimants		NUMBER;
		l_number_defendants		NUMBER;

    BEGIN
	
		-- Assume case is valid from the start and remove any existing failures on the case
		p_valid := TRUE;
		IF p_write_db = TRUE THEN
			DELETE FROM tmp_mcol_mig_failures
			WHERE case_number = p_case_number;
		END IF;
	
		SELECT	c.status, c.case_type, c.amount_claimed, c.date_of_issue, length(c.particulars_of_claim)
		INTO	l_case_status, l_case_type, l_amount, l_date, l_partic_length
		FROM   	cases c
		WHERE  	c.case_number = p_case_number;
		
		--SELECT	DECODE(COUNT(*),0,'N','Y')
		--INTO 	l_invalid_postcode
		--FROM   	case_party_roles cpr, given_addresses ga
		--WHERE  	cpr.case_number = p_case_number
		--AND    	cpr.party_role_code = 'DEFENDANT'
		--AND    	ga.party_id = cpr.party_id
		--AND    	ga.address_type_code = 'SERVICE'
		--AND    	ga.valid_to IS NULL
		--AND		ga.postcode IS NULL;
		
		SELECT	DECODE(COUNT(*),0,'N','Y')
		INTO	l_invalid_warrant
		FROM	warrants w
		WHERE	w.case_number = p_case_number
		AND		w.issued_by = 335
		AND		w.currently_owned_by = 335
		AND		w.local_warrant_number IS NULL
		AND		w.original_warrant_number IS NULL
		AND		w.defendant2 IS NOT NULL;
		
		SELECT 	LENGTH(p.person_requested_name), LENGTH(p2.person_requested_name)
		INTO	l_payee_length, l_ncp_length
		FROM 	coded_parties cp, parties p, party_to_party_relationship ptpr, parties p2
		WHERE 	cp.code = p_cred_code
		AND    	ptpr.party_a_id (+)= cp.party_id
		AND    	ptpr.party_a_role_code (+)= 'SOLICITOR'
		AND		ptpr.party_b_role_code (+)= 'NCP PAYEE'
		AND		p.party_id (+)= ptpr.party_b_id
		AND		p2.party_id = cp.party_id;
		
		SELECT 	DECODE(COUNT(*),0,'N','Y')
		INTO	l_invalid_party_name
		FROM	parties p, case_party_roles cpr
		WHERE	cpr.case_number = p_case_number
		AND		cpr.party_role_code IN ('DEFENDANT','CLAIMANT')
		AND		p.party_id = cpr.party_id
		AND		LENGTH(p.person_requested_name) > 60;
		
		SELECT	COUNT(*)
		INTO	l_number_claimants
		FROM	case_party_roles cpr, parties p, given_addresses ga
		WHERE	cpr.case_number = p_case_number
		AND		cpr.party_role_code = 'CLAIMANT'
		AND		p.party_id = cpr.party_id
		AND		ga.party_id = cpr.party_id;
		
		SELECT	COUNT(*)
		INTO	l_number_defendants
		FROM	case_party_roles cpr, parties p, given_addresses ga
		WHERE	cpr.case_number = p_case_number
		AND		cpr.party_role_code = 'DEFENDANT'
		AND		p.party_id = cpr.party_id
		AND		ga.party_id = cpr.party_id;
		
		-- Check case is not stuck in transfer limbo
		IF l_case_status = 'TRANSFERRED' THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'TRANSFER ISSUE'
									,p_write_db);
		END IF;
		
		-- Check the case type - must be equal to CLAIM - SPEC ONLY
		IF 	l_case_type != 'CLAIM - SPEC ONLY' THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'INVALID CLAIM TYPE'
									,p_write_db);
		END IF;
		
		-- Amount claimed on the case cannot exceed 99,999.99
		IF 	l_amount >= 100000 THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'INVALID AMOUNT CLAIMED'
									,p_write_db);
		END IF;
		
		-- Date of Issue cannot be NULL
		IF 	l_date IS NULL THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'BLANK ISSUE DATE'
									,p_write_db);
		END IF;
		
		-- Particulars of Claim cannot exceed 1080 characters in length
		IF	l_partic_length > 1080 THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'INVALID PARTICULARS OF CLAIM'
									,p_write_db);
		END IF;
		
		-- Defendant postcode cannot be NULL
		--IF	l_invalid_postcode = 'Y' THEN
		--	p_valid := FALSE;
		--	p_insert_claim_exception(p_case_number
		--							,p_cred_code
		--							,'MISSING DEFENDANT POSTCODE'
		--							,p_write_db);
		--END IF;
		
		-- Warrants cannot have two parties against recorded on them
		IF	l_invalid_warrant = 'Y' THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'WARRANT AGAINST TWO DEFENDANTS'
									,p_write_db);
		END IF;
		
		-- NCP Payee party name is over 60 characters in length
		IF	l_payee_length > 60 THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'CREDITOR PAYEE NAME LENGTH > 60'
									,p_write_db);
		END IF;
		
		-- NCP party name is over 60 characters in length
		IF	l_ncp_length > 60 THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'CREDITOR NAME LENGTH > 60'
									,p_write_db);
		END IF;
		
		-- Claimant/Defendant parties exist on case with name > 60 characters in length
		IF	l_invalid_party_name = 'Y' THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'CLAIMANT/DEFENDANT NAME LENGTH > 60'
									,p_write_db);
		END IF;
		
		-- There can only be one claimant party on the case
		IF	l_number_claimants != 1 THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'INVALID NUMBERS OF CLAIMANT PARTIES'
									,p_write_db);
		END IF;
		
		-- There can only be one or two defendant parties on the case
		IF	l_number_defendants NOT IN (1,2) THEN
			p_valid := FALSE;
			p_insert_claim_exception(p_case_number
									,p_cred_code
									,'INVALID NUMBERS OF DEFENDANT PARTIES'
									,p_write_db);
		END IF;

    END p_validate_claim;
	
	/******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_claim_exception                                                                        */
    /* DESCRIPTION	: Inserts a row to the tmp_mcol_mig_failures table							                      */
    /******************************************************************************************************************/
    PROCEDURE p_insert_claim_exception(
		p_case_number		IN cases.case_number%TYPE,
		p_cred_code         IN cases.cred_code%TYPE,
		p_error				IN tmp_mcol_mig_failures.failure_reason%TYPE,
		p_write_db			IN BOOLEAN)
    IS

    BEGIN
	
		IF p_write_db = TRUE THEN
			
			-- Write to the tmp_mcol_mig_failures table
			INSERT INTO tmp_mcol_mig_failures
				(case_number
				,cred_code
				,failure_reason)
			VALUES
				(p_case_number
				,p_cred_code
				,p_error);
			
		ELSE
			-- Write to DBMS_OUTPUT
			dbms_output.put_line('Case ' || p_case_number || ' failed: ' || p_error);
		
		END IF;

    END p_insert_claim_exception;
	
	/******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                                        */
    /* NAME			: f_status_reset_event_required                                                                   */
    /* DESCRIPTION	: Indicates whether or not the case status has been changed via an event 72,73,74,75,76,78,79     */
	/*				  but the status has since been reset to NULL.													  */
    /******************************************************************************************************************/
    FUNCTION f_status_reset_event_required(
		f_case_number		IN cases.case_number%TYPE) RETURN BOOLEAN
    IS
	
		l_case_status	cases.status%TYPE;
		l_status_set	VARCHAR2(1);	
		l_reset_event	BOOLEAN;

    BEGIN
	
		l_reset_event := FALSE;
	
		-- Retrieve Case Status
		SELECT 	status 
		INTO 	l_case_status
		FROM 	cases 
		WHERE 	case_number = f_case_number;
		
		-- Check if a valid status changing event exists
		SELECT 	DECODE(COUNT(*),0,'N','Y')
		INTO 	l_status_set
		FROM 	case_events
		WHERE 	case_number = f_case_number
		AND   	std_event_id IN (72,73,74,75,76,78,79)
		AND	  	deleted_flag = 'N';
		
		IF l_status_set = 'Y' AND l_case_status IS NULL THEN
			-- A status changing event exists, but the status is NULL so has been reset
			l_reset_event := TRUE;
		END IF;
		
		RETURN l_reset_event;
		
    END f_status_reset_event_required;

END sdt_mcol_mig_pack;
/
