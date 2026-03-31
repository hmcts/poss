/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : cdr_package
| SYNOPSIS      : This packages checks the MCOL CASE_DATA_REQUEST view
|                 for case data requests. If it finds un fulfilled requests
|                 it will validate the request, and if it is valid, queries the 
|                 CaseMan database for the case data and passes it back to MCOL
|
|                  
|                Note: some debugging dbms_output statements have been left in the code
|                      commented out
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

CREATE OR REPLACE PACKAGE cdr_package IS

PROCEDURE process_case_data_requests;

END; -- end of cdr_package
/
/***********************************************************************************************************\
*                                                 P A C K A G E                                            *
\***********************************************************************************************************/
CREATE OR REPLACE PACKAGE BODY cdr_package IS

/******************************************************************************************************************/
/* TYPE            : PROCEDURE                                                                                     */
/* NAME            : p_create_case_reset_event                                                                         */
/* DESCRIPTION     : Inserts a case level reset event                                                                   */
/******************************************************************************************************************/
PROCEDURE p_create_case_reset_event 
    (
    p_case_no       IN  cases.case_number%TYPE,
    p_cred_code     IN  cases.cred_code%TYPE,
    p_valid         IN OUT VARCHAR2,
    p_reason        IN OUT case_data_request.reason@CCBC_MCOL_LINK%TYPE
    )
IS

CURSOR cur_event_data IS
SELECT  
	ce.case_number,
	ce.std_event_id
FROM    case_events ce
WHERE   ce.case_number     = p_case_no
AND     ce.deleted_flag = 'N'
AND     ce.std_event_id IN (72,73,74,75,76,78,79)
AND     ce.case_flag = 'Y'
AND     ce.event_seq = 
			(
			SELECT  MAX(ce2.event_seq)
			FROM    case_events ce2
			WHERE   ce2.case_number = p_case_no
			AND     ce2.deleted_flag = 'N'
			AND        ce.case_flag = 'Y'
			AND     ce2.std_event_id IN (72,73,74,75,76,78,79)
			);

BEGIN

	FOR event_rec    IN cur_event_data
		LOOP
			BEGIN

				INSERT INTO mcol_mig_event_data@CCBC_MCOL_LINK
							(
							case_number,
							cred_code, 
							mcol_event_type, 
							event_date, 
							case_party_no, 
							warrant_number, 
							return_code, 
							return_info
							)
						VALUES
						(						
							event_rec.case_number,
							p_cred_code,
							DECODE(event_rec.std_event_id,72,'K0',73,'H0',74,'B0',75,'H0',76,'H0',78,'M0',79,'M0'),
							TRUNC(SYSDATE),
							NULL,
							NULL,
							NULL,
							NULL
						);
					
			EXCEPTION
				WHEN OTHERS THEN
					BEGIN
						p_valid     := 'F';
						p_reason    := 'Oracle Error';
						DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
						DBMS_OUTPUT.PUT_LINE('while passing warrants to MCOL for case '||p_case_no);   
					END;
			END; 
	END LOOP;
				
END p_create_case_reset_event;

/******************************************************************************************************************/
/* TYPE            : PROCEDURE                                                                                     */
/* NAME            : p_create_def_reset_event                                                                         */
/* DESCRIPTION     : Inserts a defendant level reset event                                                                   */
/******************************************************************************************************************/
PROCEDURE p_create_def_reset_event 
    (
    p_case_no       IN  cases.case_number%TYPE,
    p_cred_code     IN  cases.cred_code%TYPE,
    f_case_party_no IN  case_events.case_party_no%TYPE,
    p_valid         IN OUT VARCHAR2,
    p_reason        IN OUT case_data_request.reason@CCBC_MCOL_LINK%TYPE
    )
IS

CURSOR cur_event_data IS
SELECT  
	ce.case_number,
	ce.std_event_id
FROM    case_events ce
WHERE   ce.case_number     = p_case_no
AND     ce.deleted_flag = 'N'
AND     ce.std_event_id IN (72,73,74,75,76,78,79)
AND     ce.case_party_no = f_case_party_no
AND     ce.event_seq = 
			(
			SELECT  MAX(ce2.event_seq)
			FROM    case_events ce2
			WHERE   ce2.case_number = p_case_no
			AND     ce2.deleted_flag = 'N'
			AND     ce2.std_event_id IN (72,73,74,75,76,78,79)
			AND     ce2.case_party_no = f_case_party_no
			);

BEGIN

	FOR event_rec    IN cur_event_data
		LOOP
			BEGIN

				INSERT INTO mcol_mig_event_data@CCBC_MCOL_LINK
							(
							case_number,
							cred_code, 
							mcol_event_type, 
							event_date, 
							case_party_no, 
							warrant_number, 
							return_code, 
							return_info
							)
						VALUES
						(
							event_rec.case_number,
							p_cred_code,
							DECODE(event_rec.std_event_id,72,'K0',73,'H0',74,'B0',75,'H0',76,'H0',78,'M0',79,'M0'),
							TRUNC(SYSDATE),
							f_case_party_no,
							NULL,
							NULL,
							NULL
						);
             
       EXCEPTION
            WHEN OTHERS THEN
                BEGIN
                    p_valid     := 'F';
                    p_reason    := 'Oracle Error';
                    DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
                    DBMS_OUTPUT.PUT_LINE('while passing warrants to MCOL for case '||p_case_no);
				END;
		END;    
	END LOOP;     
END p_create_def_reset_event;

/******************************************************************************************************************/
/* TYPE            : PROCEDURE                                                                                    */
/* NAME            : p_status_reset_event_required                                                                */
/* DESCRIPTION    : decides whether or not the case status has been changed via an event 72,73,74,75,76,78,79     */
/*                  but the status has since been reset to NULL.                                                  */
/******************************************************************************************************************/
    PROCEDURE p_status_reset_event_required
        (
        p_case_number   IN cases.case_number%TYPE,
        p_cred_code     IN cases.cred_code%TYPE,
        p_valid         IN OUT VARCHAR2,
        p_reason        IN OUT case_data_request.reason@CCBC_MCOL_LINK%TYPE
        )
    IS
    
        l_case_status       cases.status%TYPE;
        l_status_set        VARCHAR2(1);    
        l_reset_event       BOOLEAN;
        l_defendant_count    NUMBER := 0;

    BEGIN
    
        l_reset_event := FALSE;
        
        -- retrieve number of defendants on case
        SELECT     count(*)
        INTO     l_defendant_count
        FROM     case_party_roles cpr
        WHERE     cpr.party_role_code = 'DEFENDANT'
        AND     cpr.case_number     = p_case_number;
        
        -- Retrieve Case Status
        SELECT     status 
        INTO     l_case_status
        FROM     cases 
        WHERE     case_number = p_case_number;
        
        IF  l_case_status IS NULL THEN
        
            -- Check if a valid status changing event exists for whole event
            SELECT  DECODE(COUNT(*),0,'N','Y')
            INTO    l_status_set
            FROM    case_events ce
            WHERE   ce.case_number = p_case_number
            AND     ce.std_event_id IN (72,73,74,75,76,78,79)
            AND     ce.deleted_flag = 'N'
            AND        ce.case_flag = 'Y'
            AND     ROWNUM = 1;
            
            IF l_status_set = 'Y' THEN
                -- insert a case level reset event                
                p_create_case_reset_event ( p_case_number, p_cred_code, p_valid, p_reason );
            ELSE    
                -- if no case level eveny, check that all defendants on case have 
                -- an event in the range 72-79

                -- Check if a valid status changing event exists
                -- for defendant 1
                SELECT  DECODE(COUNT(*),0,'N','Y')
                INTO    l_status_set
                FROM    case_events ce
                WHERE   ce.case_number = p_case_number
                AND     ce.std_event_id IN (72,73,74,75,76,78,79)
                AND     ce.deleted_flag = 'N'
                AND        ce.party_role_code = 'DEFENDANT'
                AND        ce.case_party_no = 1
                AND     ROWNUM = 1;
                
                IF  l_defendant_count = 2     AND
                    l_status_set = 'Y'        THEN
                    -- two defendants
                    -- Check if a valid status changing event exists for both defendants
                    SELECT  DECODE(COUNT(*),0,'N','Y')
                    INTO    l_status_set
                    FROM    case_events ce
                    WHERE   ce.case_number = p_case_number
                    AND     ce.std_event_id IN (72,73,74,75,76,78,79)
                    AND     ce.deleted_flag = 'N'
                    AND        ce.party_role_code = 'DEFENDANT'
                    AND     ce.case_party_no = 2
                    AND     ROWNUM = 1;
                END IF; -- 2nd defendant check.
             
                IF  l_status_set        = 'Y' THEN
                    IF  l_defendant_count   = 1 THEN
                        -- create reset event for defendant 1
                        p_create_def_reset_event ( p_case_number, p_cred_code, 1, p_valid, p_reason );
                    ELSIF l_defendant_count = 2 THEN
                        -- create reset event for both defendants
                        p_create_def_reset_event ( p_case_number, p_cred_code, 1, p_valid, p_reason );
                        IF p_valid = 'C' THEN
                            -- only insert event for second defendant if 1st insert succeeded
                            p_create_def_reset_event ( p_case_number, p_cred_code, 2, p_valid, p_reason );
                        END IF;
                    END IF; -- no of defendants check
                END IF; -- check for status_set
            
            END IF; -- check all defendants on case have events        
        END IF; -- null status check
        
    END p_status_reset_event_required;

    
/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : p_validate_claim                                                                          *
* DESCRIPTION   : Validates the case data request                                                           *
*               : Returns TRUE if case data request is valid with a null reason                             *
*               : Returns False with a failure reason for invalid case data request                 *
\***********************************************************************************************************/
    PROCEDURE p_validate_claim
        (
        p_case_number   IN  cases.case_number%TYPE,
        p_cred_code     OUT cases.cred_code%TYPE,
        p_valid         OUT VARCHAR2,
        p_reason        OUT case_data_request.reason@CCBC_MCOL_LINK%TYPE
        )
    IS
        
    l_cred_code             cases.cred_code%TYPE;
    l_court_code            cases.admin_crt_code%TYPE;
    l_case_status           cases.status%TYPE;
    l_case_type             cases.case_type%TYPE;
    l_amount                cases.amount_claimed%TYPE;
    l_date                  cases.date_of_issue%TYPE;
    l_partic_length         NUMBER;
    l_invalid_warrant       VARCHAR2(1);
    l_number_claimants      NUMBER;
    l_number_defendants     NUMBER;
    l_claimant_judgments    NUMBER;
    
    l_error_loc             VARCHAR2(20) := NULL;

    BEGIN
        
        -- Assume case is valid 
        p_valid := 'C';
        
        BEGIN            
            -- check case exists and get basic data for validation checks
            SELECT  c.cred_code, c.admin_crt_code,c.status, c.case_type, c.amount_claimed, c.date_of_issue, length(c.particulars_of_claim)
            INTO    p_cred_code, l_court_code, l_case_status, l_case_type, l_amount, l_date, l_partic_length
            FROM    cases c
            WHERE   c.case_number = p_case_number;
            
            -- check case belongs to a bulk customer
            IF  p_valid = 'C' AND  
                (p_cred_code = 1999 OR p_cred_code IS NULL )    THEN
                -- not a bulk claim customer
                p_valid     := 'F';
                p_reason    := 'NOT BULK CUSTOMER';
            END IF;            

            -- check case belongs to a northampton bulk code
/*  commented out for trac #5358 
            IF p_valid = 'C' AND l_court_code != 335 THEN
                -- not a bulk claim customer
                p_valid     := 'F';
                p_reason    := 'INVALID COURT';
            END IF;            
*/            
            -- Check case is not stuck in transfer limbo
            IF  p_valid = 'C' AND l_case_status = 'TRANSFERRED' THEN
                p_valid     := 'F';
                p_reason    := 'TRANSFER ISSUE';
            END IF;
            
            -- Check the case type - must be equal to CLAIM - SPEC ONLY
            IF  p_valid = 'C' AND l_case_type != 'CLAIM - SPEC ONLY' THEN
                p_valid     := 'F';
                p_reason    := 'INVALID CLAIM TYPE';
            END IF;

            -- Amount claimed on the case cannot exceed 99,999.99
            IF  p_valid = 'C' AND l_amount >= 100000 THEN
                p_valid     := 'F';
                p_reason    := 'INVALID AMOUNT CLAIMED';
            END IF;

            -- Date of Issue cannot be NULL
            IF  p_valid = 'C' AND l_date IS NULL THEN
                p_valid     := 'F';
                p_reason    := 'BLANK ISSUE DATE';
            END IF;
            
            -- Particulars of Claim cannot exceed 1080 characters in length
            IF  p_valid = 'C' AND l_partic_length > 1080 THEN
                p_valid     := 'F';
                p_reason    := 'INVALID PARTICULARS OF CLAIM';
            END IF;
        
        EXCEPTION 
            WHEN NO_DATA_FOUND THEN
                -- case not found 
                p_valid     := 'F';
                p_reason    := 'NON-EXISTANT CASE';
            WHEN OTHERS THEN
                p_valid     := 'F';
                p_reason    := 'Oracle Error';
                DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
                DBMS_OUTPUT.PUT_LINE('while checking case');
        END;
        
        BEGIN
            IF p_valid = 'C' THEN
            
                l_error_loc := 'warrant';
                
                SELECT  DECODE(COUNT(*),0,'N','Y')
                INTO    l_invalid_warrant
                FROM    warrants w
                WHERE   w.case_number = p_case_number
                AND     w.issued_by = 335
                AND     w.currently_owned_by = 335
                AND     w.local_warrant_number IS NULL
                AND     w.original_warrant_number IS NULL
                AND     w.defendant2 IS NOT NULL;

                -- Warrants cannot have two parties against recorded on them
                IF  l_invalid_warrant = 'Y' THEN
                    p_valid     := 'F';
                    p_reason    := 'WARRANT AGAINST TWO DEFENDANTS';
                END IF;
            END IF;

            IF p_valid = 'C' THEN
            
                l_error_loc := 'claimants';
                
                SELECT  COUNT(*)
                INTO    l_number_claimants
                FROM    case_party_roles cpr, parties p, given_addresses ga
                WHERE   cpr.case_number = p_case_number
                AND     cpr.party_role_code = 'CLAIMANT'
                AND     p.party_id = cpr.party_id
                AND     ga.party_id = cpr.party_id
                AND ga.address_type_code = 'SERVICE'
                AND     ga.valid_to IS NULL;
                
                -- There can only be one claimant party on the case
                IF  p_valid = 'C' AND l_number_claimants != 1 THEN
                    p_valid     := 'F';
                    p_reason    := 'INVALID NUMBERS OF CLAIMANT PARTIES';
                END IF;
            END IF;

            IF p_valid = 'C' THEN
            
                l_error_loc := 'defendants';
                
                SELECT    COUNT(*)
                INTO    l_number_defendants
                FROM    case_party_roles cpr, parties p, given_addresses ga
                WHERE   cpr.case_number = p_case_number
                AND     cpr.party_role_code = 'DEFENDANT'
                AND     p.party_id = cpr.party_id
                AND     ga.party_id = cpr.party_id
                AND ga.address_type_code = 'SERVICE'
                AND     ga.valid_to IS NULL;        
                        
                -- There can only be one or two defendant parties on the case
                IF  p_valid = 'C' AND l_number_defendants NOT IN (1,2) THEN
                    p_valid     := 'F';
                    p_reason    := 'INVALID NUMBERS OF DEFENDANT PARTIES';
                END IF;
            END IF;
            
            IF p_valid = 'C' THEN 
               
                l_error_loc := 'defendants';
               
                SELECT  COUNT(*)
                INTO    l_claimant_judgments
                FROM    judgments
                WHERE   case_number = p_case_number
                AND     against_party_role_code != 'DEFENDANT';
                
                -- MCOL does not allow cases with a judgment against the claimant
                IF  p_valid = 'C' AND l_number_defendants NOT IN (1,2) THEN
                    p_valid     := 'F';
                    p_reason    := 'INVALID CASE - Judgment against claimant found';
                END IF;
                
            END IF;
               
               
        END;
    EXCEPTION
        WHEN OTHERS THEN
            BEGIN
                p_valid     := 'F';
                p_reason    := 'Oracle Error';
                DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
                DBMS_OUTPUT.PUT_LINE('while checking '||l_error_loc);    
            END;
    END p_validate_claim;

/*********** ************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : get_case_data                                                                             *
* DESCRIPTION   : Obtains the requested case data from the caseman application tables                       *
*               : and passes it to the MCOL proxy database migration staging tables                         *
\***********************************************************************************************************/
PROCEDURE get_case_data
        (
        p_case_number   IN cases.case_number%TYPE,
        p_cred_code     IN cases.cred_code%TYPE,
        p_valid         IN OUT VARCHAR2,
        p_reason        OUT case_data_request.reason@CCBC_MCOL_LINK%TYPE
        )
    IS

CURSOR cur_claim_data IS
SELECT  c.case_number,
		c.cred_code,
		ts.mcol_type,
		c.amount_claimed,
		c.court_fee,
		c.solicitors_costs,
		c.date_of_issue,
		c.particulars_of_claim
FROM    cases c,
		cdr_mcol_status_mapping ts
WHERE   c.case_number   = p_case_number
AND     ts.claim_status = NVL(c.status, 'BLANK');

CURSOR cur_party_data IS
SELECT  cpr.case_number,
		cpr.party_role_code,
		cpr.case_party_no,
		cpr.deft_bar_judgment,
		cpr.reference,
		cpr.deft_date_of_service,
		p.person_requested_name,
		p.person_dob,
		ga.address_line1,
		ga.address_line2,
		ga.address_line3,
		ga.address_line4,
		ga.address_line5,
		ga.postcode
FROM    case_party_roles cpr,
	parties p,
	given_addresses ga
WHERE   cpr.case_number = p_case_number
AND     cpr.party_role_code IN ('CLAIMANT','DEFENDANT')
AND     p.party_id = cpr.party_id
AND     ga.party_id = cpr.party_id
AND     ga.address_type_code = 'SERVICE'
AND     ga.valid_to IS NULL;

CURSOR cur_creditor_data IS
SELECT  cpr.case_number,
		cpr.party_role_code,
		cpr.case_party_no,
		cpr.deft_bar_judgment,
		cpr2cpr.personal_reference,
		cpr.deft_date_of_service,
		p.person_requested_name,
		p.person_dob,
		ga.address_line1,
		ga.address_line2,
		ga.address_line3,
		ga.address_line4,
		ga.address_line5,
		ga.postcode,
		p2.person_requested_name as payee_name,
		ga2.address_line1 as payee_address_line1,
		ga2.address_line2 as payee_address_line2,
		ga2.address_line3 as payee_address_line3,
		ga2.address_line4 as payee_address_line4,
		ga2.address_line5 as payee_address_line5,
		ga2.postcode as payee_postcode
FROM    case_party_roles cpr,
		parties p,
		given_addresses ga,
		cpr_to_cpr_relationship cpr2cpr,
		parties p2,
		given_addresses ga2,
		party_to_party_relationship ptpr
WHERE      cpr.case_number = p_case_number
AND        cpr.party_role_code = 'SOLICITOR'
AND        cpr2cpr.cpr_a_case_number = cpr.case_number
AND        cpr2cpr.cpr_a_party_role_code = 'CLAIMANT'
AND        cpr2cpr.cpr_b_case_party_no = cpr.case_party_no
AND        cpr2cpr.deleted_flag = 'N'
AND        p.party_id = cpr.party_id
AND        ga.party_id = cpr.party_id
AND        ga.address_type_code = 'CODED PARTY'
AND        ga.valid_to IS NULL
AND        ptpr.party_a_id (+)= cpr.party_id
AND        ptpr.party_a_role_code (+)= 'SOLICITOR'
AND        ptpr.party_b_role_code (+)= 'NCP PAYEE'
AND        p2.party_id (+)= ptpr.party_b_id
AND        ga2.party_id (+)= ptpr.party_b_id;

CURSOR cur_judg_data IS
SELECT  
	j.case_number,
	j.against_case_party_no,
	j.judgment_type,
	j.judgment_date,
	j.status,
	j.joint_judgment,
	NVL(j.judgment_amount, 0) + NVL(j.total_costs,0) - NVL(j.paid_before_judgment,0) as judgment_amount,
	j.paid_before_judgment,
	j.total_costs,
	NVL(v.determination_amount,v.offer_amount) as instalment_amount,
	NVL(v.determination_period,v.offer_period) as instalment_period,
	j.first_payment_date
FROM    judgments j, variations v
WHERE   j.case_number = p_case_number
AND     j.against_party_role_code = 'DEFENDANT'
AND     j.judg_seq = 
			(
			SELECT  MAX(j2.judg_seq)
			FROM    judgments j2
			WHERE   j2.case_number = j.case_number
			AND     j2.against_party_role_code = j.against_party_role_code
			AND     j2.against_case_party_no = j.against_case_party_no
			)
AND   v.judg_seq = j.judg_seq
AND   v.vary_seq = 
			(
			SELECT MAX(v2.vary_seq)
			FROM variations v2
			WHERE v2.judg_seq = j.judg_seq
			AND   v2.result IN ('GRANTED','DETERMINED')
			)
UNION
SELECT  
	j.case_number,
	j.against_case_party_no,
	j.judgment_type,
	j.judgment_date,
	j.status,
	j.joint_judgment,
	NVL(j.judgment_amount, 0) + NVL(j.total_costs,0) - NVL(j.paid_before_judgment,0) as judgment_amount,
	j.paid_before_judgment,
	j.total_costs,
	j.instalment_amount,
	j.instalment_period,
	j.first_payment_date
FROM    judgments j
WHERE   j.case_number = p_case_number -- '9JS00023'
AND     j.against_party_role_code = 'DEFENDANT'
AND     j.judg_seq = 
			(
			SELECT   MAX(j2.judg_seq)
			FROM   judgments j2
			WHERE   j2.case_number = j.case_number
			AND    j2.against_party_role_code = j.against_party_role_code
			AND    j2.against_case_party_no = j.against_case_party_no
			)
AND NOT EXISTS 
			(
			SELECT     NULL 
			FROM     variations v 
			WHERE     v.judg_seq = j.judg_seq 
			AND     v.result IN ('GRANTED','DETERMINED')
			);
			
CURSOR cur_warrant_data IS
SELECT  w.case_number,
		w.warrant_number,
		w.balance_after_paid,
		w.warrant_amount,
		w.warrant_fee,
		w.solicitor_costs,
		w.notes,
		w.executed_by,
		w.def1_case_party_no,
		w.warrant_issue_date
FROM    warrants w
WHERE   w.case_number = p_case_number
AND     w.local_warrant_number IS NULL
AND     w.original_warrant_number IS NULL
AND     w.warrant_type IN ('EXECUTION','CONTROL')
AND     w.issued_by = 335
AND     w.currently_owned_by = 335;

CURSOR  cur_event_data IS
SELECT  ce.case_number,
        t.mcol_type,
        ce.event_date,
        ce.case_party_no,
        NULL as warrant_number,
        NULL as return_code,
        NULL as additional_information,
        DECODE( ce.std_event_id, 78, ce.event_date , NULL)  as paid_date
FROM    case_events ce,
        cdr_mcol_event_mapping t
WHERE   ce.case_number = p_case_number
AND     ce.deleted_flag = 'N'
AND     ce.result IS NULL
AND     ce.std_event_id IN 
             (
             SELECT   tm.std_event_id
             FROM     cdr_mcol_event_mapping tm
             WHERE    tm.std_event_id NOT IN ( 620, 79 )
             )
AND     t.std_event_id = ce.std_event_id
UNION
SELECT     
        ce.case_number,
        t.mcol_type,
        ce.event_date,
        ce.case_party_no,
        w.warrant_number,
        wr.return_code,
        wr.additional_information,
        NULL as paid_date
FROM    case_events ce,
        warrants w,
        warrant_returns wr,
        cdr_mcol_event_mapping t
WHERE   ce.case_number = p_case_number
AND     ce.deleted_flag = 'N'
AND     ce.std_event_id = 620
AND     t.std_event_id = ce.std_event_id
AND     w.warrant_id (+)= ce.warrant_id
AND     w.local_warrant_number IS NULL
AND     w.original_warrant_number IS NULL
AND     w.warrant_type IN ('EXECUTION','CONTROL')
AND     wr.event_seq (+)= ce.event_seq
UNION
SELECT  ce.case_number,
        t.mcol_type,
        ce.event_date,
        ce.case_party_no,
        NULL as warrant_number,
        NULL as return_code,
        NULL as additional_information,
        NVL(j.date_of_final_payment, ce.event_date)  AS paid_date
FROM    case_events ce,
        judgments j,
        cdr_mcol_event_mapping t
WHERE   ce.case_number            = p_case_number
AND     ce.deleted_flag           = 'N'
AND     ce.std_event_id          =  79
AND     t.std_event_id            = ce.std_event_id
AND     j.case_number             = p_case_number 
AND     j.against_party_role_code = 'DEFENDANT'
AND     j.judg_seq = ce.judg_seq;

BEGIN

    -- pass the claims data to mcol
    
	FOR claim_rec    IN cur_claim_data
		LOOP
	
			BEGIN

				INSERT INTO mcol_mig_claim_data@CCBC_MCOL_LINK
					(
					case_number, 
					cred_code, 
					status, 
					amount_claimed, 
					court_fee, 
					solicitors_costs, 
					date_of_issue, 
					particulars_of_claim
					)
				VALUES
					(
					claim_rec.case_number,
					claim_rec.cred_code,
					claim_rec.mcol_type,
					claim_rec.amount_claimed,
					claim_rec.court_fee,
					claim_rec.solicitors_costs,
					claim_rec.date_of_issue,
					claim_rec.particulars_of_claim
					);

			EXCEPTION
				WHEN OTHERS THEN
					BEGIN
						p_valid     := 'F';
						p_reason    := 'Oracle Error';
						DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
						DBMS_OUTPUT.PUT_LINE('while passing data to MCOL for case '||p_case_number);    
					END;            
			END;
	END LOOP; 

    -- pass the claimant and defendants parties for this case to MCOL
    -- DBMS_OUTPUT.PUT_LINE('case after claims = '||p_valid|| 'inserted '||SQL%ROWCOUNT);     
    IF p_valid = 'C' THEN
	
		FOR party_rec    IN cur_party_data
			LOOP
	
				BEGIN
					INSERT INTO mcol_mig_party_data@CCBC_MCOL_LINK
						(
						case_number, 
						cred_code, 
						party_role_code, 
						case_party_no, 
						bar_judgment, 
						reference, 
						date_of_service, 
						person_requested_name, 
						person_dob, 
						address_line1, 
						address_line2, 
						address_line3, 
						address_line4, 
						address_line5, 
						postcode, 
						payee_name, 
						payee_address_line1, 
						payee_address_line2, 
						payee_address_line3, 
						payee_address_line4, 
						payee_address_line5, 
						payee_postcode
						)
					VALUES
						(
						party_rec.case_number,
						p_cred_code,
						party_rec.party_role_code,
						party_rec.case_party_no,
						party_rec.deft_bar_judgment,
						party_rec.reference,
						party_rec.deft_date_of_service,
						party_rec.person_requested_name,
						party_rec.person_dob,
						SUBSTR(party_rec.address_line1,1,30),
						SUBSTR(party_rec.address_line2,1,30),
						SUBSTR(party_rec.address_line3,1,30),
						SUBSTR(party_rec.address_line4,1,30),
						SUBSTR(party_rec.address_line5,1,30),
						party_rec.postcode,
						NULL,
						NULL,
						NULL,
						NULL,
						NULL,
						NULL,
						NULL
						);
					
				EXCEPTION
					WHEN OTHERS THEN
						BEGIN
							p_valid     := 'F';
							p_reason    := 'Oracle Error';
							DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
							DBMS_OUTPUT.PUT_LINE('while passing claimant and defendants to MCOL for case '||p_case_number);    
						END;        
				END;
		END LOOP; 
		
    END IF;
    
    -- DBMS_OUTPUT.PUT_LINE('case after party data = '||p_valid|| 'inserted '||SQL%ROWCOUNT);      
    
    -- pass the National Coded Party Solicitor party to MCOL
    IF p_valid = 'C' THEN
	
		FOR creditor_rec    IN cur_creditor_data
			LOOP
	
				BEGIN
					INSERT INTO mcol_mig_party_data@CCBC_MCOL_LINK
						(
						case_number, 
						cred_code, 
						party_role_code, 
						case_party_no, 
						bar_judgment, 
						reference, 
						date_of_service, 
						person_requested_name, 
						person_dob, 
						address_line1, 
						address_line2, 
						address_line3, 
						address_line4, 
						address_line5, 
						postcode, 
						payee_name, 
						payee_address_line1, 
						payee_address_line2, 
						payee_address_line3, 
						payee_address_line4, 
						payee_address_line5, 
						payee_postcode
						)
					VALUES
						(
						creditor_rec.case_number,
						p_cred_code,
						creditor_rec.party_role_code,
						creditor_rec.case_party_no,
						creditor_rec.deft_bar_judgment,
						creditor_rec.personal_reference,
						creditor_rec.deft_date_of_service,
						creditor_rec.person_requested_name,
						creditor_rec.person_dob,
						SUBSTR(creditor_rec.address_line1,1,30),
						SUBSTR(creditor_rec.address_line2,1,30),
						SUBSTR(creditor_rec.address_line3,1,30),
						SUBSTR(creditor_rec.address_line4,1,30),
						SUBSTR(creditor_rec.address_line5,1,30),
						creditor_rec.postcode,
						creditor_rec.payee_name,
						SUBSTR(creditor_rec.payee_address_line1,1,30),
						SUBSTR(creditor_rec.payee_address_line2,1,30),
						SUBSTR(creditor_rec.payee_address_line3,1,30),
						SUBSTR(creditor_rec.payee_address_line4,1,30),
						SUBSTR(creditor_rec.payee_address_line5,1,30),
						creditor_rec.payee_postcode
						);
						
				EXCEPTION
					WHEN OTHERS THEN
						BEGIN
							p_valid     := 'F';
							p_reason    := 'Oracle Error';
							DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
							DBMS_OUTPUT.PUT_LINE('while passing NCP solicitor to MCOL for case '||p_case_number);    
						END;        
				END;
		END LOOP;
    END IF;

    -- DBMS_OUTPUT.PUT_LINE('case after NCP = '||p_valid|| 'inserted '||SQL%ROWCOUNT);      
    
    -- pass the judgments for the current case ( if any ) to MCOL.
    IF p_valid = 'C' THEN
	
		FOR judg_rec    IN cur_judg_data
			LOOP
	
				BEGIN

					INSERT INTO mcol_mig_judgment_data@CCBC_MCOL_LINK 
						(
						case_number, 
						cred_code, 
						against_case_party_no, 
						judgment_type, 
						judgment_date, 
						status, 
						joint_judgment, 
						judgment_amount, 
						paid_before_judgment, 
						total_costs, 
						instalment_amount, 
						instalment_period, 
						first_payment_date
						)
					VALUES
						(
						judg_rec.case_number,
						p_cred_code,
						judg_rec.against_case_party_no,
						judg_rec.judgment_type,
						judg_rec.judgment_date,
						judg_rec.status,
						judg_rec.joint_judgment,
						judg_rec.judgment_amount,
						judg_rec.paid_before_judgment,
						judg_rec.total_costs,
						judg_rec.instalment_amount,
						judg_rec.instalment_period,
						judg_rec.first_payment_date
						);

				EXCEPTION
					WHEN OTHERS THEN
						BEGIN
							p_valid     := 'F';
							p_reason    := 'Oracle Error';
							DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
							DBMS_OUTPUT.PUT_LINE('while passing judgments to MCOL for case '||p_case_number);    
						END;        
				END;
		END LOOP;
    END IF;

    -- DBMS_OUTPUT.PUT_LINE('case after judgments = '||p_valid|| 'inserted '||SQL%ROWCOUNT);      

    -- pass the warrants for the current case ( if any ) to MCOL.
    IF p_valid = 'C' THEN
	
		FOR warrant_rec    IN cur_warrant_data
			LOOP
	
				BEGIN
					INSERT INTO mcol_mig_warrant_data@CCBC_MCOL_LINK
						(
						case_number, 
						warrant_number, 
						cred_code, 
						balance_after_paid, 
						warrant_amount, 
						warrant_fee, 
						solicitor_costs, 
						notes, 
						executing_court, 
						def1_case_party_no, 
						warrant_issue_date
						)
					VALUES
						(
						warrant_rec.case_number,
						warrant_rec.warrant_number,
						p_cred_code,
						warrant_rec.balance_after_paid,
						warrant_rec.warrant_amount,
						warrant_rec.warrant_fee,
						warrant_rec.solicitor_costs,
						warrant_rec.notes,
						warrant_rec.executed_by,
						warrant_rec.def1_case_party_no,
						warrant_rec.warrant_issue_date
						);
					
				EXCEPTION
					WHEN OTHERS THEN
						BEGIN
							p_valid     := 'F';
							p_reason    := 'Oracle Error';
							DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
							DBMS_OUTPUT.PUT_LINE('while passing warrants to MCOL for case '||p_case_number);    
						END;        
				END;
		END LOOP;
    END IF;

    -- DBMS_OUTPUT.PUT_LINE('case after warrants = '||p_valid|| 'inserted '||SQL%ROWCOUNT);      

    -- pass the events for the current case ( if any ) to MCOL.
    IF p_valid = 'C' THEN
	
		FOR event_rec    IN cur_event_data
			LOOP
				BEGIN
					INSERT INTO mcol_mig_event_data@CCBC_MCOL_LINK
						(
						case_number,
						cred_code, 
						mcol_event_type, 
						event_date, 
						case_party_no, 
						warrant_number, 
						return_code, 
						return_info,
                        paid_date
						)
					VALUES
						(
						event_rec.case_number,
						p_cred_code,
						event_rec.mcol_type,
						event_rec.event_date,
						event_rec.case_party_no,
						event_rec.warrant_number,
						event_rec.return_code,
						event_rec.additional_information,
                        event_rec.paid_date
						);
						
				EXCEPTION
					WHEN OTHERS THEN
						BEGIN
							p_valid     := 'F';
							p_reason    := 'Oracle Error';
							DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
							DBMS_OUTPUT.PUT_LINE('while passing warrants to MCOL for case '||p_case_number);    
						END;        
				END;
		END LOOP;
    END IF;

    -- DBMS_OUTPUT.PUT_LINE('case after events = '||p_valid|| 'inserted '||SQL%ROWCOUNT);      
    
    -- Check if an additional event or events for the case status reset is required
    IF  p_valid = 'C'  THEN
        p_status_reset_event_required(p_case_number, p_cred_code, p_valid, p_reason );
    END IF;

    -- DBMS_OUTPUT.PUT_LINE('case after reset events = '||p_valid|| 'inserted '||SQL%ROWCOUNT);      
    
    -- Remove any events linked to final returns 147 or 156
    IF p_valid = 'C' THEN
        DELETE FROM mcol_mig_event_data@CCBC_MCOL_LINK
        WHERE       mcol_event_type = 'FR'
        AND         (return_code IN ('147','156') OR return_code IS NULL);
    END IF; 
    -- DBMS_OUTPUT.PUT_LINE('case after delete events = '||p_valid|| 'inserted '||SQL%ROWCOUNT);      

END ; -- end of get_case_data

/*********** ************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : process_case_data_requests                                                                *
* DESCRIPTION   : Checks to see if any waiting case data requests                                           *
*               : If the case date request is valid, get the case data and pass it to MCOL                  *
*               : If defence is not valid, tell MCOL the case data request has failed                       *
*               : Returns TRUE if judgement be found                                                        *
\***********************************************************************************************************/

PROCEDURE process_case_data_requests IS

CURSOR cur_get_requests IS
SELECT  request_id, 
        case_number, 
        caseman_status, 
        mcol_populated, 
        last_updated, 
        reason
FROM    case_data_request@CCBC_MCOL_LINK
WHERE   caseman_status = 'R';

l_failure_reason        VARCHAR2(4000)  := NULL;

l_claim_valid           VARCHAR2(1)     := 'C';

l_completed_requests    NUMBER := 0;
l_failed_requests       NUMBER := 0;

l_cred_code             cases.cred_code%TYPE;

    BEGIN
    
        -- set application context
        SET_SUPS_APP_CTX('CCBC_BATCH', 335,'process_case_data_requests' );

        -- check for waiting case data requests
        FOR cdr_rec IN cur_get_requests
            LOOP
                -- validate the request
                -- DBMS_OUTPUT.PUT_LINE('Processing CDR for case '||cdr_rec.case_number||
                --                     ' started at '||TO_CHAR(SYSTIMESTAMP,  'DD-MM-YY HH:MI:SS.FF4'));
                p_validate_claim(cdr_rec.case_number, l_cred_code, l_claim_valid, l_failure_reason);
                
                -- DBMS_OUTPUT.PUT_LINE('case number '||cdr_rec.case_number||' valid = '||l_claim_valid||' reason = '||l_failure_reason);
                
                IF l_claim_valid = 'C' THEN
                    -- valid claim so get the case data requested
                    get_case_data(cdr_rec.case_number, l_cred_code, l_claim_valid, l_failure_reason);
                END IF;
                
                IF l_claim_valid = 'F' THEN
                    -- claim has failed
                    cdr_rec.caseman_status  := l_claim_valid;
                    cdr_rec.reason          := l_failure_reason;
                    l_failed_requests       := l_failed_requests + 1;
                ELSE
                    -- claim data has been sent to MCOL
                    cdr_rec.caseman_status  := l_claim_valid;
                    l_completed_requests    := l_completed_requests + 1;
                END IF;
                
                -- update case data request with results
                UPDATE case_data_request@CCBC_MCOL_LINK
                    SET caseman_status  = cdr_rec.caseman_status,
                        reason          = cdr_rec.reason,
                        last_updated    = SYSTIMESTAMP
                WHERE   request_id      = cdr_rec.request_id;
                
                -- commit the changes
                COMMIT;
                DBMS_OUTPUT.PUT_LINE('Processed CDR for case '||cdr_rec.case_number||
                                     ' finished at '||TO_CHAR(SYSTIMESTAMP,  'DD-MM-YY HH:MI:SS.FF4'));

            END LOOP;
        
        DBMS_OUTPUT.PUT_LINE('Completed '||l_completed_requests||' Case Data Requests');
        DBMS_OUTPUT.PUT_LINE('Failed '||l_failed_requests||' Case Data Requests');
        
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
                DBMS_OUTPUT.PUT_LINE('while processing case data requests.');                            
                DBMS_OUTPUT.PUT_LINE('Rolling Back changes');
                ROLLBACK;
                -- re-raise exception so autosys picks up the failure
                RAISE;    
    END; -- end of process_case_data_requests
END; -- end of cdr_package
/