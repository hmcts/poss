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

SPOOL sdt_migrate_failures.&timestring..log

DECLARE
	
	-- Collection variables for the tables affected
	TYPE TMigClaims IS TABLE OF mcol_mig_claim_data%ROWTYPE;
	migClaims TMigClaims;
	
	TYPE TMigParties IS TABLE OF mcol_mig_party_data%ROWTYPE;
	migParties TMigParties;			-- Use this collection for processing
	migPartiesTemp TMigParties;		-- Use this collection for appending to the main collection
	
	TYPE TMigJudgments IS TABLE OF mcol_mig_judgment_data%ROWTYPE;
	migJudgments TMigJudgments;
	
	TYPE TMigWarrants IS TABLE OF mcol_mig_warrant_data%ROWTYPE;
	migWarrants TMigWarrants;
	
	TYPE TMigEvents IS TABLE OF mcol_mig_event_data%ROWTYPE;
	migEvents TMigEvents;		-- Use this collection for processing
	migEventsTemp TMigEvents;	-- Use this collection for appending to the main collection
	
	CURSOR c_get_claim(
		v_case_number cases.case_number%TYPE
		,v_cred_code cases.cred_code%TYPE
		,v_batch_number NUMBER) IS
		SELECT 	v_case_number
				,v_cred_code
				,ts.mcol_type
				,c.amount_claimed
				,c.court_fee
				,c.solicitors_costs
				,c.date_of_issue
				,c.particulars_of_claim
				,v_batch_number
		FROM   	cases c
				,tmp_mcol_mig_status_mapping ts
		WHERE  	c.case_number = v_case_number
		AND		ts.claim_status = NVL(c.status, 'BLANK');
		
	CURSOR c_get_claim_parties(
		v_case_number cases.case_number%TYPE
		,v_cred_code cases.cred_code%TYPE) IS
		SELECT 	v_case_number
				,v_cred_code
				,cpr.party_role_code
				,cpr.case_party_no
				,cpr.deft_bar_judgment
				,cpr.reference
				,cpr.deft_date_of_service
				,p.person_requested_name
				,p.person_dob
				,SUBSTR(ga.address_line1,1,30)
				,SUBSTR(ga.address_line2,1,30)
				,SUBSTR(ga.address_line3,1,30)
				,SUBSTR(ga.address_line4,1,30)
				,SUBSTR(ga.address_line5,1,30)
				,ga.postcode
				,NULL
				,NULL
				,NULL
				,NULL
				,NULL
				,NULL
				,NULL
		FROM   	case_party_roles cpr
				,parties p
				,given_addresses ga
		WHERE  	cpr.case_number = v_case_number
		AND		cpr.party_role_code IN ('CLAIMANT','DEFENDANT')
		AND		p.party_id = cpr.party_id
		AND		ga.party_id = cpr.party_id
		AND		ga.address_type_code = 'SERVICE'
		AND		ga.valid_to IS NULL;
		
	CURSOR c_get_claim_ncp_party(
		v_case_number cases.case_number%TYPE
		,v_cred_code cases.cred_code%TYPE) IS
		SELECT 	v_case_number
				,v_cred_code
				,cpr.party_role_code
				,cpr.case_party_no
				,cpr.deft_bar_judgment
				,cpr2cpr.personal_reference
				,cpr.deft_date_of_service
				,p.person_requested_name
				,p.person_dob
				,SUBSTR(ga.address_line1,1,30)
				,SUBSTR(ga.address_line2,1,30)
				,SUBSTR(ga.address_line3,1,30)
				,SUBSTR(ga.address_line4,1,30)
				,SUBSTR(ga.address_line5,1,30)
				,ga.postcode
				,p2.person_requested_name
				,SUBSTR(ga2.address_line1,1,30)
				,SUBSTR(ga2.address_line2,1,30)
				,SUBSTR(ga2.address_line3,1,30)
				,SUBSTR(ga2.address_line4,1,30)
				,SUBSTR(ga2.address_line5,1,30)
				,ga2.postcode
		FROM   	case_party_roles cpr
				,parties p
				,given_addresses ga
				,cpr_to_cpr_relationship cpr2cpr
				,parties p2
				,given_addresses ga2
				,party_to_party_relationship ptpr
		WHERE  	cpr.case_number = v_case_number
		AND		cpr.party_role_code = 'SOLICITOR'
		AND		cpr2cpr.cpr_a_case_number = cpr.case_number
		AND		cpr2cpr.cpr_a_party_role_code = 'CLAIMANT'
		AND		cpr2cpr.cpr_b_case_party_no = cpr.case_party_no
		AND		cpr2cpr.deleted_flag = 'N'
		AND		p.party_id = cpr.party_id
		AND		ga.party_id = cpr.party_id
		AND		ga.address_type_code = 'CODED PARTY'
		AND		ga.valid_to IS NULL
		AND		ptpr.party_a_id (+)= cpr.party_id
		AND		ptpr.party_a_role_code (+)= 'SOLICITOR'
		AND		ptpr.party_b_role_code (+)= 'NCP PAYEE'
		AND		p2.party_id (+)= ptpr.party_b_id
		AND		ga2.party_id (+)= ptpr.party_b_id;
		
	CURSOR c_get_claim_judgments(
		v_case_number cases.case_number%TYPE
		,v_cred_code cases.cred_code%TYPE) IS
		SELECT 	v_case_number
				,v_cred_code
				,j.against_case_party_no
				,j.judgment_type
				,j.judgment_date
				,j.status
				,j.joint_judgment
				,j.judgment_amount
				,j.paid_before_judgment
				,j.total_costs
				,v.determination_amount
				,v.determination_period
				,j.first_payment_date
		FROM   	judgments j, variations v
		WHERE  	j.case_number = v_case_number
		AND		j.against_party_role_code = 'DEFENDANT'
		AND 	j.judg_seq = (
					SELECT 	MAX(j2.judg_seq)
					FROM 	judgments j2
					WHERE 	j2.case_number = j.case_number
					AND		j2.against_party_role_code = j.against_party_role_code
					AND		j2.against_case_party_no = j.against_case_party_no)
		AND   v.judg_seq = j.judg_seq
		AND   v.vary_seq = (
			  SELECT MAX(v2.vary_seq)
			  FROM variations v2
			  WHERE v2.judg_seq = j.judg_seq
			  AND   v2.result IN ('GRANTED','DETERMINED'))
		UNION
        SELECT  v_case_number
				,v_cred_code
				,j.against_case_party_no
				,j.judgment_type
				,j.judgment_date
				,j.status
				,j.joint_judgment
				,j.judgment_amount
				,j.paid_before_judgment
				,j.total_costs
				,j.instalment_amount
				,j.instalment_period
				,j.first_payment_date
		FROM     judgments j
		WHERE    j.case_number = v_case_number
		AND    	 j.against_party_role_code = 'DEFENDANT'
		AND   	 j.judg_seq = (
					SELECT   MAX(j2.judg_seq)
					FROM   judgments j2
					WHERE   j2.case_number = j.case_number
					AND    j2.against_party_role_code = j.against_party_role_code
					AND    j2.against_case_party_no = j.against_case_party_no)
		AND NOT EXISTS (
			SELECT 	NULL 
			FROM 	variations v 
			WHERE 	v.judg_seq = j.judg_seq 
			AND 	v.result IN ('GRANTED','DETERMINED'));
					
	CURSOR c_get_claim_warrants(
		v_case_number cases.case_number%TYPE
		,v_cred_code cases.cred_code%TYPE) IS
		SELECT 	v_case_number
				,w.warrant_number
				,v_cred_code
				,w.balance_after_paid
				,w.warrant_amount
				,w.warrant_fee
				,w.solicitor_costs
				,w.notes
				,w.executed_by
				,w.def1_case_party_no
				,w.warrant_issue_date
		FROM   	warrants w
		WHERE  	w.case_number = v_case_number
		AND		w.local_warrant_number IS NULL
		AND		w.original_warrant_number IS NULL
		AND		w.warrant_type IN ('EXECUTION','CONTROL')
		AND		w.issued_by = 335
		AND		w.currently_owned_by = 335;
		
	CURSOR c_get_claim_events(
		v_case_number cases.case_number%TYPE
		,v_cred_code cases.cred_code%TYPE) IS
		SELECT 	v_case_number
				,v_cred_code
				,t.mcol_type
				,ce.event_date
				,ce.case_party_no
				,NULL
				,NULL
				,NULL
		FROM   	case_events ce
				,tmp_mcol_mig_event_mapping t
		WHERE  	ce.case_number = v_case_number
		AND		ce.deleted_flag = 'N'
		AND		ce.result IS NULL
		AND		ce.std_event_id IN (
					SELECT 	tm.std_event_id
					FROM 	tmp_mcol_mig_event_mapping tm
					WHERE	tm.std_event_id != 620)
		AND		t.std_event_id = ce.std_event_id
		UNION
		SELECT 	v_case_number
				,v_cred_code
				,t.mcol_type
				,ce.event_date
				,ce.case_party_no
				,w.warrant_number
				,wr.return_code
				,wr.additional_information
		FROM   	case_events ce
				,warrants w
				,warrant_returns wr
				,tmp_mcol_mig_event_mapping t
		WHERE  	ce.case_number = v_case_number
		AND		ce.deleted_flag = 'N'
		AND		ce.std_event_id = 620
		AND		t.std_event_id = ce.std_event_id
		AND		w.warrant_id (+)= ce.warrant_id
		AND    	w.local_warrant_number IS NULL
		AND    	w.original_warrant_number IS NULL
		AND		w.warrant_type IN ('EXECUTION','CONTROL')
		AND		wr.event_seq (+)= ce.event_seq;
		
	CURSOR c_get_claim_events_reset(
		v_case_number cases.case_number%TYPE
		,v_cred_code cases.cred_code%TYPE) IS
		SELECT 	v_case_number
				,v_cred_code
				,DECODE(ce.std_event_id,72,'K0',73,'H0',74,'B0',75,'H0',76,'H0',78,'M0',79,'M0')
				,TRUNC(SYSDATE)
				,NULL
				,NULL
				,NULL
				,NULL
		FROM	case_events ce
		WHERE   ce.case_number = v_case_number
		AND    	ce.deleted_flag = 'N'
		AND    	ce.std_event_id IN (72,73,74,75,76,78,79)
		AND    	ce.event_seq = (
					SELECT MAX(ce2.event_seq)
					FROM case_events ce2
					WHERE ce2.case_number = v_case_number
					AND    ce2.deleted_flag = 'N'
					AND    ce2.std_event_id IN (72,73,74,75,76,78,79));
		
	CURSOR	c_failed_claims IS
	SELECT	case_number
			,cred_code
	FROM	tmp_mcol_mig_failures;
	
	v_batch_size			NUMBER;		-- Variable batch size determined by user parameter
	
	l_cred_code				tmp_mcol_mig_info.cred_code%TYPE;
	l_case_number			tmp_mcol_mig_cred_claims.case_number%TYPE;
	l_count_parties			NUMBER;
	l_count_judgments		NUMBER;
	l_count_warrants		NUMBER;
	l_count_events			NUMBER;
	l_claim_valid			BOOLEAN;
	l_current_batch_no		NUMBER;
	l_batch_count			NUMBER;

BEGIN

	-- Assign parameters passed in to local variables
	v_batch_size := &1;

	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Start migration of previous failures');
	
	-- Retrieve the batch number from the existing data in the MCOL_MIG_CLAIM_DATA table
	SELECT NVL(MAX(batch_number),1) INTO l_current_batch_no FROM mcol_mig_claim_data;
	SELECT COUNT(*) INTO l_batch_count FROM mcol_mig_claim_data WHERE batch_number = l_current_batch_no;
	-- If have reached the limit of the batch number, start on next batch number
	IF l_batch_count = v_batch_size THEN
		l_batch_count := 0;
		l_current_batch_no := l_current_batch_no + 1;
	END IF;

	-- Loop through all migration failure records
	FOR failed_rec IN c_failed_claims LOOP
	
		l_case_number 	:= failed_rec.case_number;
		l_cred_code		:= failed_rec.cred_code;
		
		-- Retrieve counts of child records for each case
		l_count_parties := sdt_mcol_mig_pack.f_get_count_parties(l_case_number);
		l_count_judgments := sdt_mcol_mig_pack.f_get_count_judgments(l_case_number);
		l_count_warrants := sdt_mcol_mig_pack.f_get_count_warrants(l_case_number);
		l_count_events := sdt_mcol_mig_pack.f_get_count_events(l_case_number);
		
		-- Validate the case, passing TRUE in to write exception to database table
		sdt_mcol_mig_pack.p_validate_claim(l_case_number, l_cred_code, TRUE, l_claim_valid);
		
		IF l_claim_valid = TRUE THEN
		
			-- Increment number of cases for this batch
			l_batch_count := l_batch_count + 1;
		
			-- Claim is valid, write the child records to the export tables
			OPEN 	c_get_claim(l_case_number, l_cred_code, l_current_batch_no);
			FETCH 	c_get_claim BULK COLLECT INTO migClaims;
			CLOSE 	c_get_claim;
			
			-- Claimant + Defendant parties
			OPEN 	c_get_claim_parties(l_case_number, l_cred_code);
			FETCH 	c_get_claim_parties BULK COLLECT INTO migParties;
			CLOSE 	c_get_claim_parties;
			
			-- Fetch the National Coded Party Solicitor party and append to the migParties collection
			OPEN 	c_get_claim_ncp_party(l_case_number, l_cred_code);
			FETCH 	c_get_claim_ncp_party BULK COLLECT INTO migPartiesTemp;
			CLOSE 	c_get_claim_ncp_party;
			migParties := migParties MULTISET UNION ALL migPartiesTemp;
			
			OPEN 	c_get_claim_judgments(l_case_number, l_cred_code);
			FETCH 	c_get_claim_judgments BULK COLLECT INTO migJudgments;
			CLOSE 	c_get_claim_judgments;
			
			OPEN 	c_get_claim_warrants(l_case_number, l_cred_code);
			FETCH 	c_get_claim_warrants BULK COLLECT INTO migWarrants;
			CLOSE 	c_get_claim_warrants;
			
			OPEN 	c_get_claim_events(l_case_number, l_cred_code);
			FETCH 	c_get_claim_events BULK COLLECT INTO migEvents;
			CLOSE 	c_get_claim_events;
			
			-- Check if need to add an additional event for the case status reset
			IF sdt_mcol_mig_pack.f_status_reset_event_required(l_case_number) = TRUE THEN
				
				OPEN 	c_get_claim_events_reset(l_case_number, l_cred_code);
				FETCH 	c_get_claim_events_reset BULK COLLECT INTO migEventsTemp;
				CLOSE 	c_get_claim_events_reset;
				migEvents := migEvents MULTISET UNION ALL migEventsTemp;
				
			END IF;
			
			-- Is possible that all claims failed so collection might be NULL
			IF migClaims IS NOT NULL THEN
			
				-- Use FORALL to insert the collections into the database tables
				FORALL claim_idx IN 1..migClaims.COUNT
				INSERT INTO mcol_mig_claim_data VALUES migClaims(claim_idx);

				-- There will always be parties if there are cases (exceptions prevent otherwise)
				FORALL parties_idx IN 1..migParties.COUNT
				INSERT INTO mcol_mig_party_data VALUES migParties(parties_idx);
				
				-- There might not be any Judgments to insert
				IF migJudgments IS NOT NULL THEN
					FORALL jgmts_idx IN 1..migJudgments.COUNT
					INSERT INTO mcol_mig_judgment_data VALUES migJudgments(jgmts_idx);
				END IF;
				
				-- There might not be any Warrants to insert
				IF migWarrants IS NOT NULL THEN
					FORALL warrant_idx IN 1..migWarrants.COUNT
					INSERT INTO mcol_mig_warrant_data VALUES migWarrants(warrant_idx);
				END IF;

				-- There might not be any events to insert
				IF migEvents IS NOT NULL THEN
					FORALL event_idx IN 1..migEvents.COUNT
					INSERT INTO mcol_mig_event_data VALUES migEvents(event_idx);
				END IF;
			
			END IF;
			
			-- Clean up any unwanted final returns
			DELETE 
			FROM 	mcol_mig_event_data
			WHERE 	mcol_event_type = 'FR'
			AND		return_code IN ('147','156');
			
			-- Remove the failure
			DELETE 
			FROM 	tmp_mcol_mig_failures
			WHERE	case_number = l_case_number;
			
			-- Update the coded creditor figures
			UPDATE 	tmp_mcol_mig_info
			SET		transferred_claims = transferred_claims + 1
					,transferred_judgments = transferred_judgments + l_count_judgments
					,transferred_warrants = transferred_warrants + l_count_warrants
					,transferred_parties = transferred_parties + l_count_parties
					,transferred_events = transferred_events + l_count_events
					,failed_claims = failed_claims - 1
			WHERE	cred_code = l_cred_code;
			
			COMMIT;
			
			-- Handle allocation of next case's batch number
			IF l_batch_count = v_batch_size THEN
				-- Number of cases in the batch has reached it's limit, increment batch number and reset count for the batch
				l_current_batch_no := l_current_batch_no + 1;
				l_batch_count := 0;
			END IF;
		
		END IF;

    END LOOP;
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Completed migration of previous failures');
	
END;

/

SPOOL OFF