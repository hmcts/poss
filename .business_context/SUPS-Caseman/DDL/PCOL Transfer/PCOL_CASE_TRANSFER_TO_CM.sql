/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : pcol_case_transfer_to_cm
| SYNOPSIS      : This packages moves data from the PCOL staging tables in the 
|                 CaseMan database to the main CaseMan database tables.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) CGI.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

CREATE OR REPLACE PACKAGE pcol_case_transfer_to_cm IS

/*--------------------------------------------------------------------------------
|                              P A C K A G E                                  	 |
--------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_start_PCOL_transfer
| DESCRIPTION   : Main procedure handling the transfer of cases/warrants from 
|				  staging tables to the main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_start_PCOL_transfer;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_case
| DESCRIPTION   : Handles the insert of case data (including possession addresses)
|				  from staging tables to the main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_case (pv_case_number IN VARCHAR2,
						 pv_trans_seq	IN NUMBER,
						 p_valid        IN OUT VARCHAR2,
						 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_claimant
| DESCRIPTION   : Handles the insert of claimant data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_claimant (pv_case_number IN VARCHAR2,
							 pv_trans_seq	IN NUMBER,
							 p_valid        IN OUT VARCHAR2,
							 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_defendants
| DESCRIPTION   : Handles the insert of defendant data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_defendants (pv_case_number IN VARCHAR2,
							   pv_trans_seq	IN NUMBER,
							   p_valid        IN OUT VARCHAR2,
							   p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_case_events
| DESCRIPTION   : Handles the insert of case event data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_case_events (pv_case_number IN VARCHAR2,
								pv_trans_seq	IN NUMBER,
								p_valid        IN OUT VARCHAR2,
								p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_judgments
| DESCRIPTION   : Handles the insert of judgment data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_judgments (pv_case_number IN VARCHAR2,
							  pv_trans_seq	IN NUMBER,
							  p_valid        IN OUT VARCHAR2,
							  p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_variations
| DESCRIPTION   : Handles the insert of variation data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_variations (pv_case_number IN VARCHAR2,
							   pv_trans_seq	IN NUMBER,
							   p_valid        IN OUT VARCHAR2,
							   p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);

/*--------------------------------------------------------------------------------
| TYPE       	: FUNCTION
| NAME       	: f_check_warrants
| DESCRIPTION   : Determines for a given case number whether a warrant is to be
|				  transferred.
--------------------------------------------------------------------------------*/
FUNCTION f_check_warrants(fv_case_number IN VARCHAR2,
						  fv_trans_seq 	 IN NUMBER) RETURN BOOLEAN;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_warrants
| DESCRIPTION   : Handles the insert of warrant data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_warrants (pv_case_number IN VARCHAR2,
							 pv_trans_seq	IN NUMBER,
							 p_valid        IN OUT VARCHAR2,
							 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_cleardown_cases
| DESCRIPTION   : Clears any processed cases and child records from the PCOL  
|				  staging tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_cleardown_cases;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_populate_trans_seq
| DESCRIPTION   : For any records to be transferred this procedure adds a transfer 
|				  sequence.
--------------------------------------------------------------------------------*/
PROCEDURE p_populate_trans_seq;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_transfer_log
| DESCRIPTION   : Inserts transfer log record for a case or a warrant from PCOL
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_transfer_log (p_trans_type 	IN VARCHAR2,
								 p_trans_no		IN VARCHAR2,
								 p_trans_seq	IN NUMBER);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_error_log
| DESCRIPTION   : Inserts error log record for a case or a warrant transferred 
|				  from PCOL.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_error_log (p_trans_type 	IN VARCHAR2,
							  p_case_no		IN VARCHAR2,
							  p_trans_seq	IN NUMBER,
							  p_reason		IN VARCHAR2);

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_check_existing_case
| DESCRIPTION   : Determines if the case being transferred from PCOL already exists 
|				  in the CaseMan tables and if so, delete the case and all child
|				  records.
--------------------------------------------------------------------------------*/
PROCEDURE p_check_existing_case (pv_case_number	IN VARCHAR2,
								 p_warrant_upd	IN OUT VARCHAR2,
								 p_valid        IN OUT VARCHAR2,
								 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE);
								 
/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_update_existing_warrants
| DESCRIPTION   : Returns any existing warrants that were updated in  p_check_existing_case
|				  to their previous state using the SUPS_AMENDMENTS table
--------------------------------------------------------------------------------*/
PROCEDURE p_update_existing_warrants (pv_case_number	IN VARCHAR2);

END pcol_case_transfer_to_cm;

/

CREATE OR REPLACE PACKAGE BODY pcol_case_transfer_to_cm IS

/*--------------------------------------------------------------------------------
|                       P A C K A G E   B O D Y                               	 |
--------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_start_PCOL_transfer
| DESCRIPTION   : Main procedure handling the transfer of cases/warrants from 
|				  staging tables to the main CaseMan tables.
--------------------------------------------------------------------------------*/ 
PROCEDURE p_start_PCOL_transfer IS                                              

	CURSOR 	get_PCOL_cases_to_transfer IS 
	SELECT 	case_number, trans_seq
	FROM 	pcol_cases
	ORDER BY case_number, trans_seq;

	v_case_number 		cases.case_number%TYPE; 
	v_trans_seq			pcol_cases.trans_seq%TYPE;
	v_claim_valid		VARCHAR2(1);
	v_failure_reason	VARCHAR2(4000)  := NULL;
	v_trans_type		VARCHAR2(1);
	v_warrant_update	VARCHAR2(1);
	
BEGIN

	-- Populate the transfer sequence for any new records
	p_populate_trans_seq();

	-- Clear Down any records (including child records) where the processed column is 'Y'
	p_cleardown_cases();

	OPEN get_PCOL_cases_to_transfer;                                             
	LOOP                                                                         
		FETCH get_PCOL_cases_to_transfer
		INTO
			v_case_number, v_trans_seq;
		EXIT WHEN get_PCOL_cases_to_transfer%notfound;
		
		v_claim_valid := 'Y';
		v_warrant_update := 'N';
	  
		IF f_check_warrants(v_case_number, v_trans_seq) THEN                                   
			-- Check if warrants have been sent for transfer.  Warrants will always be 
			-- accompanied by case details but we do not want to transfer the case details.
			set_sups_app_ctx('PCOL', 0,'WarrantPCOLToCM');
			v_trans_type := 'W';
			p_insert_warrants (v_case_number, v_trans_seq, v_claim_valid, v_failure_reason);
		ELSE
			-- If no warrants for the case sent for transfer, process case details only
			v_trans_type := 'C';
			set_sups_app_ctx('PCOL', 0,'CasePCOLToCM');
			
			-- If the case already exists then delete the existing data
			p_check_existing_case(v_case_number, v_warrant_update, v_claim_valid, v_failure_reason);
			
			IF v_claim_valid = 'Y' THEN
				p_insert_case (v_case_number, v_trans_seq, v_claim_valid, v_failure_reason);
			END IF;
			
			IF v_claim_valid = 'Y' THEN
				p_insert_claimant (v_case_number, v_trans_seq, v_claim_valid, v_failure_reason);
			END IF;
			
			IF v_claim_valid = 'Y' THEN
				p_insert_defendants (v_case_number, v_trans_seq, v_claim_valid, v_failure_reason);
			END IF;
		    
			IF v_claim_valid = 'Y' THEN
				p_insert_judgments (v_case_number, v_trans_seq, v_claim_valid, v_failure_reason);
			END IF;
			
			IF v_claim_valid = 'Y' THEN
				p_insert_variations (v_case_number, v_trans_seq, v_claim_valid, v_failure_reason);
			END IF;
		    
			IF v_claim_valid = 'Y' THEN
				p_insert_case_events (v_case_number, v_trans_seq, v_claim_valid, v_failure_reason);
			END IF;
	    END IF;
		
		IF v_claim_valid = 'Y' THEN
			-- Claim valid.  Log the cases/warrants that are transferred
			p_insert_transfer_log(v_trans_type, v_case_number, v_trans_seq);
			
			IF v_warrant_update = 'Y' THEN
				p_update_existing_warrants(v_case_number);
			END IF;
			
		ElSE
			-- Claim not valid, roll back previous changes and record failure reason in table
			ROLLBACK;
			
			-- Record failure reason in table
			p_insert_error_log(v_trans_type, v_case_number, v_trans_seq, v_failure_reason);
		END IF;
		
		-- Update PCOL_CASES record processed column 
		UPDATE 	pcol_cases
		SET 	processed = v_claim_valid
		WHERE	case_number = v_case_number
		AND		trans_seq = v_trans_seq;
		
		COMMIT;
		
	END LOOP;
	CLOSE get_PCOL_cases_to_transfer;
END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_case
| DESCRIPTION   : Handles the insert of case data (including possession addresses)
|				  from staging tables to the main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_case (pv_case_number IN VARCHAR2,
						 pv_trans_seq	IN NUMBER,
						 p_valid        IN OUT VARCHAR2,
						 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE) IS                     

	v_addr_id		given_addresses.address_id%TYPE;
	v_addr1			given_addresses.address_line1%TYPE;
	v_addr2			given_addresses.address_line2%TYPE;
	v_addr3			given_addresses.address_line3%TYPE;
	v_addr4			given_addresses.address_line4%TYPE;
	v_addr5			given_addresses.address_line5%TYPE;
	v_postcode		given_addresses.postcode%TYPE;
	v_valid_from	given_addresses.valid_from%TYPE;
	v_valid_to		given_addresses.valid_to%TYPE;
	v_court			given_addresses.court_code%TYPE;
	
	CURSOR 	get_possession_addresses IS
	SELECT	addr_1,
			addr_2,
			addr_3,
			addr_4,
			addr_5,
			postcode,
			TO_DATE(valid_from,'YYYY-MM-DD'),
			TO_DATE(valid_to,'YYYY-MM-DD')
	FROM 	pcol_addresses
	WHERE 	deft_case_number = pv_case_number
	AND		trans_seq = pv_trans_seq
	AND		addr_type = 'POSS';

BEGIN                                                                           
	
	-- Insert CASES record
	INSERT INTO cases
		(case_number,
		case_type,
		admin_crt_code,
		amount_claimed,
		court_fee,
		solicitors_costs,
		total,
		date_of_issue,
		date_transferred_in,
		receipt_date)
	SELECT	pv_case_number,
			case_type,
			admin_crt_code,
			amount_claimed,
			court_fee,
			solicitors_costs,
			total,
			TO_DATE(date_of_issue,'YYYY-MM-DD'),
			TRUNC(SYSDATE),
			TO_DATE(date_of_issue,'YYYY-MM-DD')
	FROM 	pcol_cases
	WHERE 	case_number = pv_case_number
	AND		trans_seq = pv_trans_seq;
	
	-- Insert Possession GIVEN_ADDRESSES records for the case
	OPEN get_possession_addresses;
	LOOP                                                                         
		FETCH get_possession_addresses
		INTO 	v_addr1,
				v_addr2,
				v_addr3,
				v_addr4,
				v_addr5,
				v_postcode,
				v_valid_from,
				v_valid_to;
		EXIT WHEN get_possession_addresses%notfound;
		
		-- Get next sequences for the address record
		SELECT addr_sequence.NEXTVAL INTO v_addr_id FROM DUAL;
		
		-- Get the address court code
		SELECT admin_crt_code INTO v_court 
		FROM pcol_cases 
		WHERE case_number = pv_case_number
		AND	trans_seq = pv_trans_seq;
		
		INSERT INTO given_addresses
			(address_id,
			address_line1,
			address_line2,
			address_line3,
			address_line4,
			address_line5,
			postcode,
			valid_from,
			valid_to,
			case_number,
			address_type_code,
			court_code,
			updated_by)
		VALUES	
			(v_addr_id,
			v_addr1,
			v_addr2,
			v_addr3,
			v_addr4,
			v_addr5,
			v_postcode,
			v_valid_from,
			v_valid_to,
			pv_case_number,
			'POSSESSION',
			v_court,
			'LEGACY_TRANSFER');
		
	END LOOP;
	CLOSE get_possession_addresses;	
	
EXCEPTION                                                                       
	WHEN OTHERS THEN
		p_valid := 'F';
		p_reason := 'p_insert_case '||SQLERRM;
		dbms_output.put_line('p_insert_case '||SQLERRM);

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_claimant
| DESCRIPTION   : Handles the insert of claimant data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_claimant (pv_case_number IN VARCHAR2,
							 pv_trans_seq	IN NUMBER,
							 p_valid        IN OUT VARCHAR2,
							 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE) IS

	v_party_id		parties.party_id%TYPE;
	v_addr_id		given_addresses.address_id%TYPE;
	v_name			parties.person_requested_name%TYPE;
	v_addr1			given_addresses.address_line1%TYPE;
	v_addr2			given_addresses.address_line2%TYPE;
	v_addr3			given_addresses.address_line3%TYPE;
	v_addr4			given_addresses.address_line4%TYPE;
	v_addr5			given_addresses.address_line5%TYPE;
	v_postcode		given_addresses.postcode%TYPE;
	v_tel_no		parties.tel_no%TYPE;
	v_dx			parties.dx_number%TYPE;
	v_reference		case_party_roles.reference%TYPE;
	v_court			given_addresses.court_code%TYPE;
	v_sol_party_id	parties.party_id%TYPE;
	v_sol_addr_id	given_addresses.address_id%TYPE;
	v_sol_name		parties.person_requested_name%TYPE;
	v_sol_addr1		given_addresses.address_line1%TYPE;
	v_sol_addr2		given_addresses.address_line2%TYPE;
	v_sol_addr3		given_addresses.address_line3%TYPE;
	v_sol_addr4		given_addresses.address_line4%TYPE;
	v_sol_addr5		given_addresses.address_line5%TYPE;
	v_sol_postcode	given_addresses.postcode%TYPE;
	v_sol_tel_no	parties.tel_no%TYPE;
	v_sol_dx		parties.dx_number%TYPE;
	v_sol_reference	cpr_to_cpr_relationship.personal_reference%TYPE;
	v_sol_no		case_party_roles.case_party_no%TYPE;
	v_payee_flag	case_party_roles.payee_flag%TYPE := NULL;
	
	CURSOR 	claimant_details IS
	SELECT	plaintiff_details_1,
			plaintiff_details_2,
			plaintiff_details_3,
			plaintiff_details_4,
			plaintiff_details_5,
			plaintiff_details_6,
			plaintiff_details_7,
			pltf_tel_no,
			pltf_dx,
			plaintiff_reference,
			admin_crt_code,
			rep_name,
			rep_addr_1,
			rep_addr_2,
			rep_addr_3,
			rep_addr_4,
			rep_addr_5,
			rep_postcode,
			rep_tel_no,
			rep_dx,
			reference
	FROM 	pcol_cases
	WHERE	case_number = pv_case_number
	AND		trans_seq = pv_trans_seq;

BEGIN

	OPEN claimant_details;
	FETCH 	claimant_details                                                     
	INTO 	v_name,
			v_addr1,
			v_addr2,
			v_addr3,
			v_addr4,
			v_addr5,
			v_postcode,
			v_tel_no,
			v_dx,
			v_reference,
			v_court,
			v_sol_name,
			v_sol_addr1,
			v_sol_addr2,
			v_sol_addr3,
			v_sol_addr4,
			v_sol_addr5,
			v_sol_postcode,
			v_sol_tel_no,
			v_sol_dx,
			v_sol_reference;  

	-- Get next sequences for the party and address records
	SELECT parties_sequence.NEXTVAL INTO v_party_id FROM DUAL;
	SELECT addr_sequence.NEXTVAL INTO v_addr_id FROM DUAL;
	
	-- Insert PARTIES record for the Claimant
	INSERT INTO parties
		(party_id,
		party_type_code,
		person_requested_name,
		tel_no,
		dx_number,
		welsh_indicator)
	VALUES	
		(v_party_id,
		'CLAIMANT',
		v_name,
		v_tel_no,
		v_dx,
		'N');
		
	IF v_sol_name IS NOT NULL THEN
		v_payee_flag := 'Y';
	END IF;
		
	-- Insert CASE_PARTY_ROLES record for the Claimant
	INSERT INTO case_party_roles
		(case_number,
		party_id,
		party_role_code,
		case_party_no,
		reference,
		payee_flag)
	VALUES	
		(pv_case_number,
		v_party_id,
		'CLAIMANT',
		1,
		v_reference,
		v_payee_flag);
	
	-- Insert GIVEN_ADDRESSES record for the Claimant
	INSERT INTO given_addresses
		(address_id,
		address_line1,
		address_line2,
		address_line3,
		address_line4,
		address_line5,
		postcode,
		valid_from,
		party_id,
		case_number,
		party_role_code,
		address_type_code,
		court_code,
		updated_by,
		case_party_no)
	VALUES	
		(v_addr_id,
		v_addr1,
		v_addr2,
		v_addr3,
		v_addr4,
		v_addr5,
		v_postcode,
		TRUNC(SYSDATE),
		v_party_id,
		pv_case_number,
		'CLAIMANT',
		'SERVICE',
		v_court,
		'LEGACY_TRANSFER',
		1);
	
	IF v_sol_name IS NOT NULL THEN
		-- Claimant has a Solicitor
		-- Get next sequences for the party and address records
		SELECT parties_sequence.NEXTVAL INTO v_sol_party_id FROM DUAL;
		SELECT addr_sequence.NEXTVAL INTO v_sol_addr_id FROM DUAL;
		
		-- Get the solicitor number
		SELECT NVL(MAX(case_party_no),0)+1 INTO v_sol_no
		FROM case_party_roles
		WHERE case_number = pv_case_number
		AND party_role_code = 'SOLICITOR';
		
		-- Insert PARTIES record for the Claimant Solicitor
		INSERT INTO parties
			(party_id,
			party_type_code,
			person_requested_name,
			tel_no,
			dx_number,
			welsh_indicator)
		VALUES	
			(v_sol_party_id,
			'SOLICITOR',
			v_sol_name,
			v_sol_tel_no,
			v_sol_dx,
			'N');
			
		-- Insert CASE_PARTY_ROLES record for the Claimant Solicitor
		INSERT INTO case_party_roles
			(case_number,
			party_id,
			party_role_code,
			case_party_no,
			reference)
		VALUES	
			(pv_case_number,
			v_sol_party_id,
			'SOLICITOR',
			v_sol_no,
			v_sol_reference);
		
		-- Insert GIVEN_ADDRESSES record for the Claimant Solicitor
		INSERT INTO given_addresses
			(address_id,
			address_line1,
			address_line2,
			address_line3,
			address_line4,
			address_line5,
			postcode,
			valid_from,
			party_id,
			case_number,
			party_role_code,
			address_type_code,
			court_code,
			updated_by,
			case_party_no)
		VALUES	
			(v_sol_addr_id,
			v_sol_addr1,
			v_sol_addr2,
			v_sol_addr3,
			v_sol_addr4,
			v_sol_addr5,
			v_sol_postcode,
			TRUNC(SYSDATE),
			v_sol_party_id,
			pv_case_number,
			'SOLICITOR',
			'SOLICITOR',
			v_court,
			'LEGACY_TRANSFER',
			v_sol_no);
		
		-- Insert CPR_TO_CPR_RELATIONSHIP record for the Claimant Solicitor
		INSERT INTO cpr_to_cpr_relationship
			(cpr_a_case_number,
			cpr_a_party_role_code,
			cpr_b_party_role_code,
			cpr_b_case_number,
			cpr_b_case_party_no,
			cpr_a_case_party_no,
			deleted_flag,
			personal_reference)
		VALUES 
			(pv_case_number,
			'CLAIMANT',
			'SOLICITOR',
			pv_case_number,
			v_sol_no,
			1,
			'N',
			v_sol_reference);
	
	END IF;
	
EXCEPTION 
	WHEN OTHERS THEN
		p_valid := 'F';
		p_reason := 'p_insert_claimant '||SQLERRM;
		dbms_output.put_line('p_insert_claimant '||SQLERRM);

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_defendants
| DESCRIPTION   : Handles the insert of defendant data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_defendants (pv_case_number	IN VARCHAR2,
							   pv_trans_seq		IN NUMBER,
							   p_valid        	IN OUT VARCHAR2,
							   p_reason			IN OUT pcol_trans_failures.failure_reason%TYPE) IS

	v_party_id		parties.party_id%TYPE;
	v_addr_id		given_addresses.address_id%TYPE;
	v_name			parties.person_requested_name%TYPE;
	v_def_no		case_party_roles.case_party_no%TYPE;
	v_addr1			given_addresses.address_line1%TYPE;
	v_addr2			given_addresses.address_line2%TYPE;
	v_addr3			given_addresses.address_line3%TYPE;
	v_addr4			given_addresses.address_line4%TYPE;
	v_addr5			given_addresses.address_line5%TYPE;
	v_postcode		given_addresses.postcode%TYPE;
	v_valid_from	given_addresses.valid_from%TYPE;
	v_valid_to		given_addresses.valid_to%TYPE;
	v_date_service	case_party_roles.deft_date_of_service%TYPE;
	v_court			given_addresses.court_code%TYPE;
	v_sol_party_id	parties.party_id%TYPE;
	v_sol_addr_id	given_addresses.address_id%TYPE;
	v_sol_name		parties.person_requested_name%TYPE;
	v_sol_addr1		given_addresses.address_line1%TYPE;
	v_sol_addr2		given_addresses.address_line2%TYPE;
	v_sol_addr3		given_addresses.address_line3%TYPE;
	v_sol_addr4		given_addresses.address_line4%TYPE;
	v_sol_addr5		given_addresses.address_line5%TYPE;
	v_sol_postcode	given_addresses.postcode%TYPE;
	v_sol_tel_no	parties.tel_no%TYPE;
	v_sol_dx		parties.dx_number%TYPE;
	v_sol_no		case_party_roles.case_party_no%TYPE;
	
	CURSOR 	get_defendant_details IS
	SELECT	pd.name,
			pd.id,
			pa.addr_1,
			pa.addr_2,
			pa.addr_3,
			pa.addr_4,
			pa.addr_5,
			pa.postcode,
			TO_DATE(pa.valid_from,'YYYY-MM-DD'),
			TO_DATE(pa.valid_to,'YYYY-MM-DD'),
			pc.admin_crt_code,
			TO_DATE(pd.date_of_service_other,'YYYY-MM-DD'),
			pd.solicitor_name,
			pd.solicitor_addr_1,
			pd.solicitor_addr_2,
			pd.solicitor_addr_3,
			pd.solicitor_addr_4,
			pd.solicitor_addr_5,
			pd.solicitor_postcode,
			pd.solicitor_tel_no,
			pd.sol_dx
	FROM 	pcol_defendants pd, pcol_addresses pa, pcol_cases pc
	WHERE	pc.case_number = pv_case_number
	AND		pc.trans_seq = pv_trans_seq
	AND		pd.case_number = pc.case_number
	AND		pd.trans_seq = pc.trans_seq
	AND		pa.deft_case_number = pd.case_number
	AND		pa.trans_seq = pd.trans_seq
	AND		pa.deft_id = pd.id
	AND		pa.addr_type = 'SERVICE'
	AND		pa.valid_to IS NULL;

BEGIN

	OPEN get_defendant_details;
	LOOP     
		FETCH 	get_defendant_details                                                     
		INTO 	v_name,
				v_def_no,
				v_addr1,
				v_addr2,
				v_addr3,
				v_addr4,
				v_addr5,
				v_postcode,
				v_valid_from,
				v_valid_to,
				v_court,
				v_date_service,
				v_sol_name,
				v_sol_addr1,
				v_sol_addr2,
				v_sol_addr3,
				v_sol_addr4,
				v_sol_addr5,
				v_sol_postcode,
				v_sol_tel_no,
				v_sol_dx;
		EXIT WHEN get_defendant_details%notfound;

		-- Get next sequences for the party and address records
		SELECT parties_sequence.NEXTVAL INTO v_party_id FROM DUAL;
		SELECT addr_sequence.NEXTVAL INTO v_addr_id FROM DUAL;
		
		-- Insert PARTIES record for the Defendant
		INSERT INTO parties
			(party_id,
			party_type_code,
			person_requested_name,
			welsh_indicator)
		VALUES	
			(v_party_id,
			'DEFENDANT',
			v_name,
			'N');
			
		-- Insert CASE_PARTY_ROLES record for the Defendant
		INSERT INTO case_party_roles
			(case_number,
			party_id,
			party_role_code,
			case_party_no,
			deft_date_of_service)
		VALUES	
			(pv_case_number,
			v_party_id,
			'DEFENDANT',
			v_def_no,
			v_date_service);
		
		-- Insert GIVEN_ADDRESSES record for the Defendant
		INSERT INTO given_addresses
			(address_id,
			address_line1,
			address_line2,
			address_line3,
			address_line4,
			address_line5,
			postcode,
			valid_from,
			valid_to,
			party_id,
			case_number,
			party_role_code,
			address_type_code,
			court_code,
			updated_by,
			case_party_no)
		VALUES	
			(v_addr_id,
			v_addr1,
			v_addr2,
			v_addr3,
			v_addr4,
			v_addr5,
			v_postcode,
			v_valid_from,
			v_valid_to,
			v_party_id,
			pv_case_number,
			'DEFENDANT',
			'SERVICE',
			v_court,
			'LEGACY_TRANSFER',
			v_def_no);
		
		IF v_sol_name IS NOT NULL THEN
			-- Defendant has a Solicitor
			-- Get next sequences for the party and address records
			SELECT parties_sequence.NEXTVAL INTO v_sol_party_id FROM DUAL;
			SELECT addr_sequence.NEXTVAL INTO v_sol_addr_id FROM DUAL;
			
			-- Get the solicitor number
			SELECT NVL(MAX(case_party_no),0)+1 INTO v_sol_no
			FROM case_party_roles 
			WHERE case_number = pv_case_number
			AND party_role_code = 'SOLICITOR';
			
				-- Insert PARTIES record for the Defendant Solicitor
			INSERT INTO parties
				(party_id,
				party_type_code,
				person_requested_name,
				tel_no,
				dx_number,
				welsh_indicator)
			VALUES	
				(v_sol_party_id,
				'SOLICITOR',
				v_sol_name,
				v_sol_tel_no,
				v_sol_dx,
				'N');
				
			-- Insert CASE_PARTY_ROLES record for the Defendant Solicitor
			INSERT INTO case_party_roles
				(case_number,
				party_id,
				party_role_code,
				case_party_no)
			VALUES	
				(pv_case_number,
				v_sol_party_id,
				'SOLICITOR',
				v_sol_no);
			
			-- Insert GIVEN_ADDRESSES record for the Defendant Solicitor
			INSERT INTO given_addresses
				(address_id,
				address_line1,
				address_line2,
				address_line3,
				address_line4,
				address_line5,
				postcode,
				party_id,
				case_number,
				party_role_code,
				address_type_code,
				court_code,
				updated_by,
				case_party_no)
			VALUES	
				(v_sol_addr_id,
				v_sol_addr1,
				v_sol_addr2,
				v_sol_addr3,
				v_sol_addr4,
				v_sol_addr5,
				v_sol_postcode,
				v_sol_party_id,
				pv_case_number,
				'SOLICITOR',
				'SOLICITOR',
				v_court,
				'LEGACY_TRANSFER',
				v_sol_no);
			
			-- Insert CPR_TO_CPR_RELATIONSHIP record for the Defendant Solicitor
			INSERT INTO cpr_to_cpr_relationship
				(cpr_a_case_number,
				cpr_a_party_role_code,
				cpr_b_party_role_code,
				cpr_b_case_number,
				cpr_b_case_party_no,
				cpr_a_case_party_no,
				deleted_flag)
			VALUES 
				(pv_case_number,
				'DEFENDANT',
				'SOLICITOR',
				pv_case_number,
				v_sol_no,
				v_def_no,
				'N');
		
		END IF;
		
	END LOOP;
	CLOSE get_defendant_details;

EXCEPTION 
	WHEN OTHERS THEN
		p_valid := 'F';
		p_reason := 'p_insert_defendants '||SQLERRM;
		dbms_output.put_line('p_insert_defendants '||SQLERRM);	

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_judgments
| DESCRIPTION   : Handles the insert of judgment data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_judgments (pv_case_number	IN VARCHAR2,
							  pv_trans_seq		IN NUMBER,
							  p_valid        	IN OUT VARCHAR2,
							  p_reason			IN OUT pcol_trans_failures.failure_reason%TYPE) IS

	CURSOR 	c_get_judg IS
	SELECT 	judg_seq,
			deft_case_number,
			deft_id,
			DECODE(judgment_for,'PLAINTIFF','CLAIMANT',judgment_for) judgment_for,
			judgment_type,
			joint_judgment,
			TO_DATE(judgment_date,'YYYY-MM-DD') judgment_date,
			TO_DATE(sent_to_rtl, 'YYYY-MM-DD') sent_to_rtl,
			status_to_rtl,
			TO_DATE(date_of_final_payment,'YYYY-MM-DD') date_of_final_payment,
			DECODE(status, 'REGISTERED', NULL, status) status,
			judgment_amount,
			total_costs,
			paid_before_judgment,
			total,
			instalment_amount,
			instalment_period,
			TO_DATE(first_payment_date,'YYYY-MM-DD') first_payment_date,
			payee_name,
			payee_addr_1,
			payee_addr_2,
			payee_addr_3,
			payee_addr_4,
			payee_addr_5,
			payee_postcode,
			payee_tel_no,
			judgment_court_code
	FROM 	pcol_judgments
	WHERE 	deft_case_number =  pv_case_number
	AND		trans_seq = pv_trans_seq;
	
	v_judg_seq	judgments.judg_seq%TYPE;
	v_judgment_amount	judgments.judgment_amount%TYPE;
	v_total_costs	judgments.total_costs%TYPE;
	v_paid_before_judgment	judgments.paid_before_judgment%TYPE;

BEGIN                                                                        
	FOR c_judgments_loop IN c_get_judg LOOP                                   
		
		-- Get the next Judgment Sequence
		SELECT judg_sequence.NEXTVAL INTO v_judg_seq FROM DUAL;
		
		-- Update PCOL_EVENTS with the updated judgment sequence
		UPDATE 	pcol_events
		SET		judg_seq = v_judg_seq
		WHERE	case_number = pv_case_number
		AND		trans_seq = pv_trans_seq
		AND		judg_seq = c_judgments_loop.judg_seq;
		
		-- Update PCOL_VARIATIONS with the updated judgment sequence
		UPDATE 	pcol_variations
		SET		judg_seq = v_judg_seq
		WHERE	case_number = pv_case_number
		AND		trans_seq = pv_trans_seq
		AND		judg_seq = c_judgments_loop.judg_seq;
		
		-- PAID_BEFORE_JUDG_CHK workaround
		IF 	c_judgments_loop.judgment_amount = 0
			AND c_judgments_loop.total_costs = 0
			AND c_judgments_loop.paid_before_judgment = 0 THEN
			
			-- If these three figures are all 0 then set paid_before_judgment to NULL in the main table
			v_judgment_amount := c_judgments_loop.judgment_amount;
			v_total_costs := c_judgments_loop.total_costs;
			v_paid_before_judgment := NULL;
		ELSE
			-- No issue, use the figures given
			v_judgment_amount := c_judgments_loop.judgment_amount;
			v_total_costs := c_judgments_loop.total_costs;
			v_paid_before_judgment := c_judgments_loop.paid_before_judgment;
		END IF;
		
		-- Insert JUDGMENTS record
		INSERT INTO judgments
			(judg_seq,
			judgment_type,
			joint_judgment,
			judgment_date,
			sent_to_rtl,
			status_to_rtl,
			date_of_final_payment,
			status,
			judgment_amount,
			total_costs,
			paid_before_judgment,
			total,
			instalment_amount,
			instalment_period,
			first_payment_date,
			payee_name,
			payee_addr_1,
			payee_addr_2,
			payee_addr_3,
			payee_addr_4,
			payee_addr_5,
			payee_postcode,
			payee_tel_no,
			judgment_court_code,
			judgment_amount_currency,
			total_costs_currency,
			paid_before_judgment_currency,
			total_currency,
			instalment_amount_currency,
			case_number,
			against_party_role_code,
			against_case_party_no)
		VALUES
			(v_judg_seq,
			c_judgments_loop.judgment_type,
			c_judgments_loop.joint_judgment,
			c_judgments_loop.judgment_date,
			c_judgments_loop.sent_to_rtl,
			c_judgments_loop.status_to_rtl,
			c_judgments_loop.date_of_final_payment,
			c_judgments_loop.status,
			v_judgment_amount,
			v_total_costs,
			v_paid_before_judgment,
			c_judgments_loop.total,
			c_judgments_loop.instalment_amount,
			c_judgments_loop.instalment_period,
			c_judgments_loop.first_payment_date,
			c_judgments_loop.payee_name,
			c_judgments_loop.payee_addr_1,
			c_judgments_loop.payee_addr_2,
			c_judgments_loop.payee_addr_3,
			c_judgments_loop.payee_addr_4,
			c_judgments_loop.payee_addr_5,
			c_judgments_loop.payee_postcode,
			c_judgments_loop.payee_tel_no,
			c_judgments_loop.judgment_court_code,
			'GBP',
			'GBP',
			'GBP',
			'GBP',
			'GBP',
			c_judgments_loop.deft_case_number,
			'DEFENDANT',
			c_judgments_loop.deft_id);
			
		-- Insert INFAVOUR_PARTIES record for the Judgment
		INSERT INTO infavour_parties
			(judg_seq,
			case_number,
			case_party_no,
			party_role_code,
			deleted_flag)
		VALUES
			(v_judg_seq,
			c_judgments_loop.deft_case_number,
			1,
			c_judgments_loop.judgment_for,
			'N');

	END LOOP;

EXCEPTION
	WHEN OTHERS THEN
		p_valid := 'F';
		p_reason := 'p_insert_judgments '||SQLERRM;
		dbms_output.put_line('p_insert_judgments '||SQLERRM);
END;                                                                            

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_variations
| DESCRIPTION   : Handles the insert of variation data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_variations (pv_case_number	IN VARCHAR2,
							   pv_trans_seq		IN NUMBER,
							   p_valid        	IN OUT VARCHAR2,
							   p_reason			IN OUT pcol_trans_failures.failure_reason%TYPE) IS

	CURSOR c_get_variations IS
	SELECT
		case_number,
		vary_seq,
		judg_seq,
		TO_DATE(application_date,'YYYY-MM-DD') application_date,
		DECODE(requester,'PLAINTIFF','CLAIMANT',requester) requester,
		offer_amount,
		offer_period,
		TO_DATE(first_payment_date,'YYYY-MM-DD') first_payment_date,
		plaintiff_response,
		result,
		TO_DATE(result_date,'YYYY-MM-DD') result_date,
		determination_amount,
		determination_period,
		objection,
		DECODE(objector,'PLAINTIFF','CLAIMANT',objector) objector
	FROM pcol_variations
	WHERE case_number = pv_case_number
	AND	trans_seq = pv_trans_seq;
	
	v_vary_seq	variations.vary_seq%TYPE;

BEGIN

	FOR c_variations_rec IN c_get_variations LOOP
	
		-- Get the next Variations Sequence
		SELECT vary_sequence.NEXTVAL INTO v_vary_seq FROM DUAL;
		
		-- Update PCOL_EVENTS with the updated variations sequence
		UPDATE 	pcol_events
		SET		vary_seq = v_vary_seq
		WHERE	case_number = pv_case_number
		AND		trans_seq = pv_trans_seq
		AND		vary_seq = c_variations_rec.vary_seq;
	
		-- Insert VARIATIONS record
		INSERT INTO variations
		(vary_seq,
		judg_seq,
		application_date,
		requester,
		offer_amount,
		offer_period,
		first_payment_date,
		plaintiff_response,
		result,
		result_date,
		determination_amount,
		determination_period,
		objection,
		objector,
		offer_amount_currency,
		determination_amount_currency)
		VALUES
		(v_vary_seq,
		c_variations_rec.judg_seq,
		c_variations_rec.application_date,
		c_variations_rec.requester,
		c_variations_rec.offer_amount,
		c_variations_rec.offer_period,
		c_variations_rec.first_payment_date,
		c_variations_rec.plaintiff_response,
		c_variations_rec.result,
		c_variations_rec.result_date,
		c_variations_rec.determination_amount,
		c_variations_rec.determination_period,
		c_variations_rec.objection,
		c_variations_rec.objector,
		'GBP',
		'GBP');

	END LOOP;

EXCEPTION
	WHEN OTHERS THEN
		p_valid := 'F';
		p_reason := 'p_insert_variations '||SQLERRM;
		dbms_output.put_line('p_insert_variations'||SQLERRM);
END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_case_events
| DESCRIPTION   : Handles the insert of case event data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_case_events (pv_case_number 	IN VARCHAR2,
								pv_trans_seq	IN NUMBER,
								p_valid        	IN OUT VARCHAR2,
								p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE) IS

	CURSOR get_case_events IS
	SELECT 	case_number,
			std_event_id,
			deft_id,
			DECODE(requester,'PLAINTIFF','CLAIMANT',requester),
			details,
			TO_DATE(event_date,'YYYY-MM-DD'),
			result,
			judg_seq,
			vary_seq,
			deleted_flag,
			username,
			TO_DATE(receipt_date,'YYYY-MM-DD'),
			crt_code
	FROM 	pcol_events
	WHERE 	case_number = pv_case_number
	AND		trans_seq = pv_trans_seq
	ORDER BY event_seq;

	v_event_seq		case_events.event_seq%TYPE;
	v_case_number	case_events.case_number%TYPE;	
	v_std_event_id	case_events.std_event_id%TYPE;
	v_deft_id		case_events.case_party_no%TYPE;
	v_requester		case_events.requester%TYPE;
	v_details		case_events.details%TYPE;
	v_event_date	case_events.event_date%TYPE;
	v_result		case_events.result%TYPE;
	v_judg_seq		case_events.judg_seq%TYPE;
	v_vary_seq		case_events.vary_seq%TYPE;
	v_deleted_flag	case_events.deleted_flag%TYPE;
	v_username		case_events.username%TYPE;
	v_receipt_date	case_events.receipt_date%TYPE;
	v_crt_code		case_events.crt_code%TYPE;

BEGIN                                                                           
	OPEN get_case_events;
	LOOP
		FETCH 	get_case_events
		INTO	v_case_number,
				v_std_event_id,
				v_deft_id,
				v_requester,
				v_details,
				v_event_date,
				v_result,
				v_judg_seq,
				v_vary_seq,
				v_deleted_flag,
				v_username,
				v_receipt_date,
				v_crt_code;
		EXIT WHEN get_case_events%notfound;

		-- Get the next Case Event Sequence
		SELECT event_sequence.NEXTVAL INTO v_event_seq FROM DUAL;

		INSERT INTO case_events
			(event_seq,
			case_number,
			std_event_id,
			requester,
			details,
			event_date,
			result,
			judg_seq,
			vary_seq,
			deleted_flag,
			username,
			receipt_date,
			crt_code,
			party_role_code,
			case_party_no)
		VALUES
			(v_event_seq,
			v_case_number,
			v_std_event_id,
			v_requester,
			v_details,
			v_event_date,
			v_result,
			v_judg_seq,
			v_vary_seq,
			v_deleted_flag,
			v_username,
			v_receipt_date,
			v_crt_code,
			DECODE(v_deft_id,NULL,NULL,'DEFENDANT'),
			v_deft_id);
			
	END LOOP;
	CLOSE get_case_events;

EXCEPTION
	WHEN OTHERS THEN
		p_valid := 'F';
		p_reason := 'p_insert_case_events '||SQLERRM;
		dbms_output.put_line('p_insert_case_events '||SQLERRM);
END;

/*--------------------------------------------------------------------------------
| TYPE       	: FUNCTION
| NAME       	: f_check_warrants
| DESCRIPTION   : Determines for a given case number whether a warrant is to be
|				  transferred.
--------------------------------------------------------------------------------*/
FUNCTION f_check_warrants (fv_case_number IN VARCHAR2
						  ,fv_trans_seq IN NUMBER) RETURN BOOLEAN IS        
	
	dummy VARCHAR2(1);
	
	CURSOR c_warrant_exists IS                                                   
	SELECT 'Y'
	FROM pcol_warrants
	WHERE case_number = fv_case_number
	AND   trans_seq = fv_trans_seq;
	
BEGIN

	OPEN c_warrant_exists;
	FETCH c_warrant_exists
	INTO dummy;
	
	IF c_warrant_exists%notfound THEN
		RETURN(FALSE);
	ELSE
		RETURN(TRUE);
	END IF;
	
EXCEPTION
	WHEN OTHERS THEN
		dbms_output.put_line('check warrants '||SQLERRM);
END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_warrants
| DESCRIPTION   : Handles the insert of warrant data from staging tables to the 
|				  main CaseMan tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_warrants (pv_case_number IN VARCHAR2,
							 pv_trans_seq	IN NUMBER,
							 p_valid        IN OUT VARCHAR2,
							 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE) IS

	CURSOR 	get_warrants IS
	SELECT 	local_warrant_number,
			warrant_number,
			issued_by,
			case_number,
			balance_after_paid,
			NVL(warrant_amount,0),
			TO_DATE(warrant_issue_date,'YYYY-MM-DD'),
			warrant_type,
			executed_by,
			plaintiff_name,
			rep_code,
			rep_name,
			rep_addr_1,
			rep_addr_2,
			rep_addr_3,
			rep_addr_4,
			rep_addr_5,
			rep_postcode,
			rep_tel,
			rep_dx,
			reference,
			defendant1,
			def1_addr_1,
			def1_addr_2,
			def1_addr_3,
			def1_addr_4,
			def1_addr_5,
			def1_postcode,
			defendant2,
			def2_addr_1,
			def2_addr_2,
			def2_addr_3,
			def2_addr_4,
			def2_addr_5,
			def2_postcode,
			TO_DATE(home_court_issue_date,'YYYY-MM-DD'),
			bailiff_identifier,
			land_registry_fee,
			original_warrant_number,
			warrant_fee,
			solicitor_costs,
			preissue_balance,
			TO_DATE(date_printed,'YYYY-MM-DD'),
			TO_DATE(date_reprinted,'YYYY-MM-DD'),
			reprinted_by,
			notes
	FROM 	pcol_warrants
	WHERE 	case_number = pv_case_number
	AND		trans_seq = pv_trans_seq;
	
	v_warrant_id			warrants.warrant_id%TYPE;
	v_local_warrant_number 	warrants.local_warrant_number%TYPE;
	v_warrant_number      	warrants.warrant_number%TYPE;
	v_issued_by           	warrants.issued_by%TYPE;
	v_case_number 			warrants.case_number%TYPE;
	v_balance_after_paid	warrants.balance_after_paid%TYPE;
	v_warrant_amount		warrants.warrant_amount%TYPE;
	v_warrant_issue_date	warrants.warrant_issue_date%TYPE;
	v_warrant_type 			warrants.warrant_type%TYPE;
	v_executed_by 			warrants.executed_by%TYPE;
	v_plaintiff_name		warrants.plaintiff_name%TYPE;
	v_rep_code				warrants.coded_party_rep_code%TYPE;
	v_rep_name				warrants.rep_name%TYPE;
	v_rep_addr_1			warrants.rep_addr_1%TYPE;
	v_rep_addr_2			warrants.rep_addr_2%TYPE;
	v_rep_addr_3			warrants.rep_addr_3%TYPE;
	v_rep_addr_4			warrants.rep_addr_4%TYPE;
	v_rep_addr_5			warrants.rep_addr_5%TYPE;
	v_rep_postcode			warrants.rep_postcode%TYPE;
	v_rep_tel				warrants.rep_tel_no%TYPE;
	v_rep_dx				warrants.rep_dx_number%TYPE;
	v_reference				warrants.reference%TYPE;
	v_defendant1			warrants.defendant1%TYPE;
	v_def1_addr_1			warrants.def1_addr_1%TYPE;
	v_def1_addr_2			warrants.def1_addr_2%TYPE;
	v_def1_addr_3			warrants.def1_addr_3%TYPE;
	v_def1_addr_4			warrants.def1_addr_4%TYPE;
	v_def1_addr_5			warrants.def1_addr_5%TYPE;
	v_def1_postcode			warrants.def1_postcode%TYPE;
	v_defendant2			warrants.defendant2%TYPE;
	v_def2_addr_1			warrants.def2_addr_1%TYPE;
	v_def2_addr_2			warrants.def2_addr_2%TYPE;
	v_def2_addr_3			warrants.def2_addr_3%TYPE;
	v_def2_addr_4			warrants.def2_addr_4%TYPE;
	v_def2_addr_5			warrants.def2_addr_5%TYPE;
	v_def2_postcode			warrants.def2_postcode%TYPE;
	v_home_court_issue_date	warrants.home_court_issue_date%TYPE;
	v_bailiff_identifier	warrants.bailiff_identifier%TYPE;
	v_land_registry_fee		warrants.land_registry_fee%TYPE;
	v_original_warrant_number	warrants.original_warrant_number%TYPE;
	v_warrant_fee			warrants.warrant_fee%TYPE;
	v_solicitor_costs		warrants.solicitor_costs%TYPE;
	v_preissue_balance		warrants.preissue_balance%TYPE;
	v_date_printed			warrants.date_printed%TYPE;
	v_date_reprinted		warrants.date_reprinted%TYPE;
	v_reprinted_by			warrants.reprinted_by%TYPE;
	v_notes					warrants.notes%TYPE;
	v_fees_paid_id			fees_paid.fees_paid_id%TYPE;

BEGIN

	OPEN get_warrants;
	LOOP
		FETCH 	get_warrants
		INTO 	v_local_warrant_number,
				v_warrant_number      ,
				v_issued_by           ,
				v_case_number         ,
				v_balance_after_paid  ,
				v_warrant_amount      ,
				v_warrant_issue_date  ,
				v_warrant_type        ,
				v_executed_by         ,
				v_plaintiff_name      ,
				v_rep_code            ,
				v_rep_name            ,
				v_rep_addr_1          ,
				v_rep_addr_2          ,
				v_rep_addr_3          ,
				v_rep_addr_4          ,
				v_rep_addr_5          ,
				v_rep_postcode        ,
				v_rep_tel             ,
				v_rep_dx              ,
				v_reference           ,
				v_defendant1          ,
				v_def1_addr_1         ,
				v_def1_addr_2         ,
				v_def1_addr_3         ,
				v_def1_addr_4         ,
				v_def1_addr_5         ,
				v_def1_postcode       ,
				v_defendant2          ,
				v_def2_addr_1         ,
				v_def2_addr_2         ,
				v_def2_addr_3         ,
				v_def2_addr_4         ,
				v_def2_addr_5         ,
				v_def2_postcode       ,
				v_home_court_issue_date,
				v_bailiff_identifier   ,
				v_land_registry_fee    ,
				v_original_warrant_number,
				v_warrant_fee            ,
				v_solicitor_costs        ,
				v_preissue_balance       ,
				v_date_printed           ,
				v_date_reprinted         ,
				v_reprinted_by           ,
				v_notes;
		EXIT WHEN get_warrants%notfound;
		
		IF v_issued_by != v_executed_by THEN
			-- For foreign warrants, populate the local warrant number with the same value as the warrant number
			v_local_warrant_number := v_warrant_number;
		END IF;
		
		-- Get the next Warrant Sequence
		SELECT warrants_sequence.NEXTVAL INTO v_warrant_id FROM DUAL;

		INSERT INTO warrants
			(warrant_id,
			local_warrant_number,
			warrant_number,
			issued_by,
			balance_after_paid,
			warrant_amount,
			warrant_issue_date,
			warrant_type,
			executed_by,
			plaintiff_name,
			reference,
			defendant1,
			def1_addr_1,
			def1_addr_2,
			def1_addr_3,
			def1_addr_4,
			def1_addr_5,
			def1_postcode,
			defendant2,
			def2_addr_1,
			def2_addr_2,
			def2_addr_3,
			def2_addr_4,
			def2_addr_5,
			def2_postcode,
			home_court_issue_date,
			bailiff_identifier,
			land_registry_fee,
			original_warrant_number,
			warrant_fee,
			solicitor_costs,
			preissue_balance,
			date_printed,
			date_reprinted,
			reprinted_by,
			notes,
			to_transfer,
			balance_after_paid_currency,
			warrant_amount_currency,
			land_registry_fee_currency,
			warrant_fee_currency,
			solicitor_costs_currency,
			preissue_balance_currency,
			currently_owned_by,
			case_number,
			def1_party_role_code,
			def2_party_role_code,
			rep_party_role_code,
			rep_name,
			rep_addr_1,
			rep_addr_2,
			rep_addr_3,
			rep_addr_4,
			rep_addr_5,
			rep_postcode,
			rep_tel_no,
			rep_dx_number,
			coded_party_rep_code)
		VALUES
			(v_warrant_id,
			v_local_warrant_number,
			v_warrant_number,
			v_issued_by,
			v_balance_after_paid,
			v_warrant_amount,
			v_warrant_issue_date,
			v_warrant_type,
			v_executed_by,
			v_plaintiff_name,
			v_reference,
			v_defendant1,
			v_def1_addr_1,
			v_def1_addr_2,
			v_def1_addr_3,
			v_def1_addr_4,
			v_def1_addr_5,
			v_def1_postcode,
			v_defendant2,
			v_def2_addr_1,
			v_def2_addr_2,
			v_def2_addr_3,
			v_def2_addr_4,
			v_def2_addr_5,
			v_def2_postcode,
			v_home_court_issue_date,
			NULL, -- Clear the Bailiff Identifier field
			v_land_registry_fee,
			v_original_warrant_number,
			v_warrant_fee,
			v_solicitor_costs,
			v_preissue_balance,
			v_date_printed,
			v_date_reprinted,
			v_reprinted_by,
			v_notes,
			'0',
			'GBP',
			'GBP',
			'GBP',
			'GBP',
			'GBP',
			'GBP',
			v_executed_by,
			v_case_number,
			'DEFENDANT',
			DECODE(v_defendant2,NULL,NULL,'DEFENDANT'),
			'SOLICITOR',
			v_rep_name,
			v_rep_addr_1,
			v_rep_addr_2,
			v_rep_addr_3,
			v_rep_addr_4,
			v_rep_addr_5,
			v_rep_postcode,
			v_rep_tel,
			v_rep_dx,
			v_rep_code);
			
		-- If a Home Warrant, then add the FEES_PAID record
		IF v_local_warrant_number IS NULL THEN 
		
			-- Get the next Fees Paid Sequence
			SELECT fees_paid_sequence.NEXTVAL INTO v_fees_paid_id FROM DUAL;
			
			INSERT INTO fees_paid
				(fees_paid_id,
				process_number,
				process_type,
				allocation_date,
				amount,
				issuing_court,
				deleted_flag,
				user_id,
				date_created
				)
			VALUES
				(v_fees_paid_id,
				v_warrant_number,
				'W',
				v_warrant_issue_date,
				v_warrant_fee,
				v_issued_by,
				'N',
				'PCOL_BATCH',
				v_warrant_issue_date);
			
		END IF;

	END LOOP;
	CLOSE get_warrants;

EXCEPTION 
	WHEN OTHERS THEN
		p_valid := 'F';
		p_reason := 'p_insert_warrants '||SQLERRM;
		dbms_output.put_line('p_insert_warrants '||SQLERRM);

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_cleardown_cases
| DESCRIPTION   : Clears any processed cases and child records from the PCOL  
|				  staging tables.
--------------------------------------------------------------------------------*/
PROCEDURE p_cleardown_cases IS                     

	CURSOR 	get_processed_cases IS
	SELECT	case_number, trans_seq
	FROM 	pcol_cases
	WHERE 	NVL(processed,'N') = 'Y';
	
	v_case_number	pcol_cases.case_number%TYPE;
	v_trans_seq		pcol_cases.trans_seq%TYPE;

BEGIN                                                                           
	
	-- Delete all cases that have been processed
	OPEN get_processed_cases;
	LOOP                                                                         
		FETCH 	get_processed_cases
		INTO	v_case_number, v_trans_seq;
		EXIT WHEN get_processed_cases%notfound;
		
		DELETE FROM pcol_variations WHERE case_number = v_case_number AND trans_seq = v_trans_seq;
		DELETE FROM pcol_warrants WHERE case_number = v_case_number AND trans_seq = v_trans_seq;
		DELETE FROM pcol_judgments WHERE deft_case_number = v_case_number AND trans_seq = v_trans_seq;
		DELETE FROM pcol_events WHERE case_number = v_case_number AND trans_seq = v_trans_seq;
		DELETE FROM pcol_addresses WHERE deft_case_number = v_case_number AND trans_seq = v_trans_seq;
		DELETE FROM pcol_defendants WHERE case_number = v_case_number AND trans_seq = v_trans_seq;
		DELETE FROM pcol_cases WHERE case_number = v_case_number AND trans_seq = v_trans_seq;
		DELETE FROM pcol_trans_failures WHERE case_number = v_case_number AND trans_seq = v_trans_seq;
		
	END LOOP;
	CLOSE get_processed_cases;
	
	COMMIT;

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_populate_trans_seq
| DESCRIPTION   : For any records to be transferred this procedure adds a transfer 
|				  sequence.
--------------------------------------------------------------------------------*/
PROCEDURE p_populate_trans_seq IS                     

	CURSOR 	get_new_cases IS
	SELECT	case_number
	FROM 	pcol_cases
	WHERE 	trans_seq IS NULL;
	
	v_case_number	pcol_cases.case_number%TYPE;
	v_trans_seq		pcol_cases.trans_seq%TYPE;

BEGIN                                                                           
	
	-- Add a transfer sequence to any new cases to be transferred that do not already have a sequence
	OPEN get_new_cases;
	LOOP                                                                         
		FETCH 	get_new_cases
		INTO	v_case_number;
		EXIT WHEN get_new_cases%notfound;
		
		-- Determine the correct transfer sequence i.e. if case is being transferred twice
		-- and case is already present in the PCOL_CASES table
		SELECT NVL(MAX(trans_seq),0)+1 INTO v_trans_seq
		FROM pcol_cases
		WHERE case_number = v_case_number;
		
		UPDATE pcol_variations SET trans_seq = v_trans_seq WHERE case_number = v_case_number AND trans_seq IS NULL;
		UPDATE pcol_warrants SET trans_seq = v_trans_seq WHERE case_number = v_case_number AND trans_seq IS NULL;
		UPDATE pcol_judgments SET trans_seq = v_trans_seq WHERE deft_case_number = v_case_number AND trans_seq IS NULL;
		UPDATE pcol_events SET trans_seq = v_trans_seq WHERE case_number = v_case_number AND trans_seq IS NULL;
		UPDATE pcol_addresses SET trans_seq = v_trans_seq WHERE deft_case_number = v_case_number AND trans_seq IS NULL;
		UPDATE pcol_defendants SET trans_seq = v_trans_seq WHERE case_number = v_case_number AND trans_seq IS NULL;
		UPDATE pcol_cases SET trans_seq = v_trans_seq WHERE case_number = v_case_number AND trans_seq IS NULL;
		
	END LOOP;
	CLOSE get_new_cases;
	
	COMMIT;

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_transfer_log
| DESCRIPTION   : Inserts transfer log record for a case or a warrant from PCOL
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_transfer_log (p_trans_type 	IN VARCHAR2,
								 p_trans_no		IN VARCHAR2,
								 p_trans_seq	IN NUMBER) IS                     

BEGIN                                                                           
	
	INSERT INTO pcol_transfer_control
		(transfer_type,
		 transfer_number,
		 transfer_date,
		 trans_seq)
	VALUES
		(p_trans_type,
		p_trans_no,
		TRUNC(SYSDATE),
		p_trans_seq);

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_insert_error_log
| DESCRIPTION   : Inserts error log record for a case or a warrant transferred 
|				  from PCOL.
--------------------------------------------------------------------------------*/
PROCEDURE p_insert_error_log (p_trans_type 	IN VARCHAR2,
							  p_case_no		IN VARCHAR2,
							  p_trans_seq	IN NUMBER,
							  p_reason		IN VARCHAR2) IS                     

BEGIN                                                                           
	
	INSERT INTO pcol_trans_failures
		(transfer_type,
		 case_number,
		 trans_seq,
		 failure_date,
		 failure_reason)
	VALUES
		(p_trans_type,
		p_case_no,
		p_trans_seq,
		TRUNC(SYSDATE),
		p_reason);

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_check_existing_case
| DESCRIPTION   : Determines if the case being transferred from PCOL already exists 
|				  in the CaseMan tables and if so, delete the case and all child
|				  records.
--------------------------------------------------------------------------------*/
PROCEDURE p_check_existing_case (pv_case_number	IN VARCHAR2,
								 p_warrant_upd	IN OUT VARCHAR2,
								 p_valid        IN OUT VARCHAR2,
								 p_reason		IN OUT pcol_trans_failures.failure_reason%TYPE) IS

	CURSOR 	get_ae_data IS
	SELECT	ae_number,
			debtors_employers_party_id
	FROM 	ae_applications
	WHERE 	case_number = pv_case_number;
	
	CURSOR	get_judg_data IS
	SELECT 	judg_seq
	FROM 	judgments
	WHERE	case_number = pv_case_number;
	
	CURSOR	get_party_data IS
	SELECT	cpr.party_id,
			cpr.party_role_code,
			cpr.case_party_no
	FROM 	case_party_roles cpr
	WHERE	cpr.case_number = pv_case_number
	AND	NOT EXISTS (
		SELECT NULL FROM coded_parties cp
		WHERE cp.party_id = cpr.party_id);
		
	CURSOR	get_party_data_cp IS
	SELECT	cpr.party_role_code,
			cpr.case_party_no
	FROM 	case_party_roles cpr
	WHERE	cpr.case_number = pv_case_number
	AND EXISTS (
		SELECT NULL FROM coded_parties cp
		WHERE cp.party_id = cpr.party_id);
		
	CURSOR 	get_warrant_data IS
	SELECT	warrant_id
	FROM 	warrants
	WHERE 	case_number = pv_case_number;
	
	v_case_exists	VARCHAR2(1) := 'N';
	v_wrnt_exists	VARCHAR2(1) := 'N';
	v_ae_number		ae_applications.ae_number%TYPE;
	v_emp_id		ae_applications.debtors_employers_party_id%TYPE;
	v_judg_seq		judgments.judg_seq%TYPE;
	v_party_id		parties.party_id%TYPE;
	v_party_role	case_party_roles.party_role_code%TYPE;
	v_case_party_no	case_party_roles.case_party_no%TYPE;
	v_warrant_id	warrants.warrant_id%TYPE;

BEGIN

	SELECT DECODE(COUNT(*), 0, 'N', 'Y') INTO v_case_exists
	FROM cases
	WHERE case_number = pv_case_number;
	
	IF v_case_exists = 'Y' THEN
	
		-- Check for warrants (get constraint error if delete CASE_PARTY_ROLE referenced on Warrant)
		SELECT DECODE(COUNT(*), 0, 'N', 'Y') INTO v_wrnt_exists
		FROM warrants
		WHERE case_number = pv_case_number;
		
		-- If warrant, remove the case party numbers so can delete CASE_PARTY_ROLE safely
		-- It is reinstated below after all deletes completed
		IF v_wrnt_exists = 'Y' THEN
		
			OPEN get_warrant_data;
			LOOP                                                                         
				FETCH 	get_warrant_data
				INTO	v_warrant_id;
				EXIT WHEN get_warrant_data%notfound;
				
				UPDATE warrants
				SET rep_case_party_no = NULL,
					def1_case_party_no = NULL,
					def2_case_party_no = NULL
				WHERE warrant_id = v_warrant_id;
				
			END LOOP;
			CLOSE get_warrant_data;
			
			p_warrant_upd := 'Y';
			
		END IF;
	
		-- Delete WFT, ECHR and obligation data
		DELETE FROM wft_exclusions WHERE wfe_wft_case_number = pv_case_number;
		DELETE FROM window_for_trial WHERE wft_case_number = pv_case_number;
		DELETE FROM obligations WHERE case_number = pv_case_number;
		DELETE FROM echr_article_protocol WHERE deft_case_number = pv_case_number;
		DELETE FROM echr_details WHERE deft_case_number = pv_case_number;
		
		-- Delete AE data
		OPEN get_ae_data;
		LOOP                                                                         
			FETCH 	get_ae_data
			INTO	v_ae_number,
					v_emp_id;
			EXIT WHEN get_ae_data%notfound;
			
			DELETE FROM ae_per_items WHERE ae_number = v_ae_number;
			DELETE FROM ae_events WHERE ae_number = v_ae_number;
			DELETE FROM ae_applications WHERE ae_number = v_ae_number;
			DELETE FROM given_addresses WHERE party_id = v_emp_id;
			DELETE FROM parties WHERE party_id = v_emp_id;
			
		END LOOP;
		CLOSE get_ae_data;
		
		-- Delete case event and hearing data
		DELETE FROM case_event_instigators WHERE case_number = pv_case_number;
		DELETE FROM case_events WHERE case_number = pv_case_number;
		DELETE FROM hearings WHERE case_number = pv_case_number;
		
		-- Delete Judgment data
		OPEN get_judg_data;
		LOOP                                                                         
			FETCH 	get_judg_data
			INTO	v_judg_seq;
			EXIT WHEN get_judg_data%notfound;
			
			DELETE FROM variations WHERE judg_seq = v_judg_seq;
			DELETE FROM infavour_parties WHERE judg_seq = v_judg_seq;
			DELETE FROM judgments WHERE judg_seq = v_judg_seq;
			
		END LOOP;
		CLOSE get_judg_data;
		
		-- Delete CPR relationship and certain addresses
		DELETE FROM cpr_to_cpr_relationship WHERE cpr_a_case_number = pv_case_number;
		DELETE FROM given_addresses WHERE address_type_code IN ('POSSESSION','WORKPLACE','SUBSERV') and case_number = pv_case_number;
		
		-- Delete party data (Non Coded Parties only)
		OPEN get_party_data;
		LOOP                                                                         
			FETCH 	get_party_data
			INTO	v_party_id,
					v_party_role,
					v_case_party_no;
			EXIT WHEN get_party_data%notfound;
			
			DELETE FROM given_addresses WHERE party_id = v_party_id;
			DELETE FROM given_addresses WHERE case_number = pv_case_number AND party_role_code = v_party_role AND case_party_no = v_case_party_no;
			DELETE FROM case_party_roles WHERE case_number = pv_case_number AND party_role_code = v_party_role AND case_party_no = v_case_party_no;
			DELETE FROM parties WHERE party_id = v_party_id;
			
		END LOOP;
		CLOSE get_party_data;
		
		-- Delete coded party case specific data
		OPEN get_party_data_cp;
		LOOP                                                                         
			FETCH 	get_party_data_cp
			INTO	v_party_role,
					v_case_party_no;
			EXIT WHEN get_party_data_cp%notfound;
			
			DELETE FROM case_party_roles WHERE case_number = pv_case_number AND party_role_code = v_party_role AND case_party_no = v_case_party_no;
			
		END LOOP;
		CLOSE get_party_data_cp;
		
		-- Delete any other addresses linked and the main case record
		DELETE FROM given_addresses WHERE case_number = pv_case_number;
		DELETE FROM cases WHERE case_number = pv_case_number;
		
	END IF;
	
EXCEPTION 
	WHEN OTHERS THEN
		p_warrant_upd := 'N';
		p_valid := 'F';
		p_reason := 'p_check_existing_case '||SQLERRM;
		dbms_output.put_line('p_check_existing_case '||SQLERRM);

END;

/*--------------------------------------------------------------------------------
| TYPE       	: PROCEDURE
| NAME       	: p_update_existing_warrants
| DESCRIPTION   : Returns any existing warrants that were updated in  p_check_existing_case
|				  to their previous state using the SUPS_AMENDMENTS table
--------------------------------------------------------------------------------*/
PROCEDURE p_update_existing_warrants (pv_case_number	IN VARCHAR2) IS

	CURSOR 	get_warrant_data IS
	SELECT	warrant_id
	FROM 	warrants
	WHERE 	case_number = pv_case_number;
	
	v_warrant_id	warrants.warrant_id%TYPE;
	v_orig_wd1_cpn	warrants.def1_case_party_no%TYPE;
	v_orig_wd2_cpn	warrants.def2_case_party_no%TYPE;

BEGIN

	OPEN get_warrant_data;
	LOOP                                                                         
		FETCH 	get_warrant_data
		INTO	v_warrant_id;
		EXIT WHEN get_warrant_data%notfound;
		
		-- Retrieve the previous values from the SUPS_AMENDMENTS table
		-- Representative party role code is not returned as there is no guarantee
		-- that the same case party number will be used when the new case is inserted
		BEGIN
		
			SELECT TO_NUMBER(old_value) INTO v_orig_wd1_cpn
			FROM sups_amendments 
			WHERE table_name = 'WARRANTS'
			AND pk01 = v_warrant_id
			AND amendment_type = 'Updated'
			AND column_name = 'DEF1_CASE_PARTY_NO'
			AND user_id = 'PCOL'
			AND TRUNC(date_of_change) = TRUNC(SYSDATE)
			AND ROWNUM = 1
			ORDER BY time_stamp DESC;
		
		EXCEPTION
			WHEN NO_DATA_FOUND THEN
				v_orig_wd1_cpn := NULL;
		END;
		
		BEGIN
		
			SELECT TO_NUMBER(old_value) INTO v_orig_wd2_cpn
			FROM sups_amendments 
			WHERE table_name = 'WARRANTS'
			AND pk01 = v_warrant_id
			AND amendment_type = 'Updated'
			AND column_name = 'DEF2_CASE_PARTY_NO'
			AND user_id = 'PCOL'
			AND TRUNC(date_of_change) = TRUNC(SYSDATE)
			AND ROWNUM = 1
			ORDER BY time_stamp DESC;
						
		EXCEPTION
			WHEN NO_DATA_FOUND THEN
				v_orig_wd2_cpn := NULL;
		END;
		
		UPDATE warrants
		SET def1_case_party_no = v_orig_wd1_cpn,
			def2_case_party_no = v_orig_wd2_cpn
		WHERE warrant_id = v_warrant_id;
		
	END LOOP;
	CLOSE get_warrant_data;

EXCEPTION 
	WHEN OTHERS THEN NULL;
	
END;

END pcol_case_transfer_to_cm; 

/