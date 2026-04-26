/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : validate_set_asides
| SYNOPSIS      : This packages validates the set_asides submitted via MCOL and 
|               : creates CASEMAN event for all valid defence events
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

CREATE OR REPLACE PACKAGE validate_set_asides_pkg IS

PROCEDURE  bc_sa_u1( p_username IN VARCHAR2, p_court_code IN VARCHAR2, p_debug IN VARCHAR2, p_load_failed IN OUT NUMBER );

END; -- end of validate_set_asides_pkg
/
/***********************************************************************************************************\
*                                                 P A C K A G E                                            *
\***********************************************************************************************************/
CREATE OR REPLACE PACKAGE BODY validate_set_asides_pkg IS

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : f_case_invalid                                                                            *
* DESCRIPTION   : Checks to if the case referred to in the submitted defence exists in CASEMAN              *
*               : Returns TRUE if case cannot be found                                                      *
\***********************************************************************************************************/
FUNCTION f_case_invalid ( l_case_no  VARCHAR2) RETURN BOOLEAN IS

valid_case  VARCHAR2(8) := NULL;

BEGIN
    SELECT case_number
    INTO valid_case
    FROM cases
    WHERE case_number = l_case_no;
    
    RETURN FALSE;
    
    EXCEPTION
    WHEN NO_DATA_FOUND THEN
       RETURN TRUE;

END; -- end of f_case_invalid function

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                  *
* NAME          : p_defendant_invalid                                                                       *
* DESCRIPTION   : Checks to if the defendant referred to in the submitted defence exists in CASEMAN         * 
*               : Returns TRUE if defendant cannot be found                                                 *
\***********************************************************************************************************/
PROCEDURE p_defendant_invalid   ( 
                                l_case_no           IN  VARCHAR2, 
                                l_defendant_id      IN  NUMBER,
                                lv_case_party_no    OUT NUMBER,
                                lv_reject_code      OUT VARCHAR2
                                ) IS

BEGIN

    SELECT  cpr.case_party_no
    INTO    lv_case_party_no
    FROM    case_party_roles cpr
    WHERE   cpr.case_number     = l_case_no
    AND     cpr.case_party_no   =  l_defendant_id
    AND     cpr.party_role_code = 'DEFENDANT';
    
    lv_reject_code := NULL; -- defendant found, so don't set reject code

    EXCEPTION
    WHEN NO_DATA_FOUND THEN
       lv_reject_code := 90; -- Quoted Defendant Id does not exist on system

END; -- end of p_defendant_invalid procedure

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : f_get_judgement_seq                                                                       *
* DESCRIPTION   : Gets the sequence number of the latest ACTIVE or VARIED Judgement for a party				*                                                       *
*				: returns sequence_number or -1 if no ACTIVE or VARIED judgement is found					*
*               : Also returns the MCOL_REFERENCE if one exists or NULL if not present                      *
\***********************************************************************************************************/
PROCEDURE p_get_judgement_seq 
						( 
						p_case_no			IN	VARCHAR2, 
						p_case_party_no 	IN	NUMBER,
						p_judgment_seq		OUT	NUMBER,
                        p_mcol_judg_ref     OUT VARCHAR2,
                        p_reject_code  		OUT VARCHAR2
                        ) IS

BEGIN

	p_judgment_seq := 0;
    p_mcol_judg_ref := NULL;
    
    -- note: since for CCBC cases, there can only be one active or
    -- varied judgment for each defendent, this will only ever return 
    -- one record, even with the group by clause.

	SELECT 	jg.judg_seq,
            jg.mcol_judg_ref
    INTO    p_judgment_seq,
            p_mcol_judg_ref
    FROM    judgments jg
    WHERE   jg.judg_seq =
            (SELECT MAX(judg1.judg_seq)
            FROM judgments judg1
            WHERE judg1.case_number                     = p_case_no
            AND judg1.against_case_party_no             = p_case_party_no
            AND judg1.against_party_role_code           = 'DEFENDANT'
            AND (judg1.status IS NULL or judg1.status   = 'VARIED'));


	
    p_reject_code := NULL;
    
    EXCEPTION
    WHEN NO_DATA_FOUND THEN
		-- no active or varied judgement found, so reject
		p_reject_code   := 97;
		p_judgment_seq := NULL;
        p_mcol_judg_ref := NULL;
END; -- end of p_get_judgement_seq procedure

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : f_check_for_sar_events                                                                    *
* DESCRIPTION   : check to see if there is a previous 160 set aside event already existing for the case     *
\***********************************************************************************************************/
FUNCTION f_check_for_sar_events
			( 
			p_case_no  		IN	VARCHAR2,
			p_case_party_no IN	VARCHAR2
			) RETURN BOOLEAN IS

nv_event_id	case_events.std_event_id%TYPE := 0;

BEGIN

	SELECT 	distinct ce.std_event_id -- 
	INTO	nv_event_id
	FROM	case_events ce
	WHERE	ce.case_number 		= p_case_no
	AND		ce.case_party_no	= p_case_party_no
    AND     ce.party_role_code  = 'DEFENDANT'
    AND     ce.std_event_id     = 160
    AND     ce.deleted_flag     = 'N';
	
	RETURN	TRUE;
	
	EXCEPTION
		WHEN NO_DATA_FOUND THEN
			RETURN FALSE;
	
END; -- end of f_check_for_sar_events
/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : bc_sa_u1                                                                        			*
* DESCRIPTION   : Checks to see if the set_asides submitted via MCOL are valid                              *
*               : If the defence is valid, create a CASEMAN event and tell MCOL the defence has been        *
*               : accepted by CASEMAN                                                                       *
*               : If defence is not valid, do not create a event. Tell MCOL the defence has rejeced         *
*               : Returns TRUE if judgement be found                                                        *
\***********************************************************************************************************/

PROCEDURE bc_sa_u1( p_username IN VARCHAR2, p_court_code IN VARCHAR2, p_debug IN VARCHAR2, p_load_failed IN OUT NUMBER ) IS

CURSOR  cur_set_asides IS
    SELECT	sar.case_number, 
			sar.party_role_code, 
			sar.defendant_id, 
			sar.fee, 
			sar.pdf_file_name, 
			sar.cust_file_sequence, 
			sar.reject_code,
			sar.validated,
			sar.via_sdt,
            sar.mcol_reference
    FROM    set_aside_requests sar
    WHERE   sar.validated = 'N'
    ORDER BY sar.case_number, sar.defendant_id
	FOR UPDATE OF sar.validated;

nv_reject_code  NUMBER          := NULL;
caseman_event   NUMBER          := 0;

sar_party_no    	case_party_roles.case_party_no%TYPE	:= 0;
sar_case_number  	cases.case_number%TYPE			    := NULL;
sar_judgment_seq	judgments.judg_seq%TYPE 		    := 0;
sar_file_loaded		VARCHAR2(1)						    := 'N';
sar_requester       case_events.requester%TYPE          := NULL;

-- variable for error handling exception
nv_sql_code_num             NUMBER;              -- SQL Error Code Number.
cv_sql_err_mess             VARCHAR2(100);       -- SQL Error Message Text.
cv_error_loc                VARCHAR2(20)                        := NULL;
cv_judgment_ref             mcol_data.judgment_reference%TYPE   := NULL;

    BEGIN
    
        -- set application context
        SET_SUPS_APP_CTX(p_username, p_court_code,'BC_SA_U1' );
        
        DBMS_OUTPUT.PUT_LINE('**START** of set asides validation ');
        
        FOR sar_rec IN cur_set_asides
        LOOP
            nv_reject_code  	:=  NULL;
			sar_judgment_seq	:=	NULL;
            sar_case_number  	:= 	sar_rec.case_number;
			sar_file_loaded		:= 	'N';
            sar_requester       :=  NULL; -- requester type who made the set aside application
            
            IF p_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('** START Set Aside validation **  Claim is '	||sar_rec.case_number
																					||' Reject = '
																					||nv_reject_code
																					||' pdf_file_name is '||sar_rec.pdf_file_name); 
                DBMS_OUTPUT.PUT_LINE(' validated = '||sar_rec.validated);
            END IF;
            
            -- check for invalid case
            IF f_case_invalid ( sar_rec.case_number ) THEN
                cv_error_loc       := 'SAR_CAS_FAIL';
                nv_reject_code     := 48; -- Quoted Case Number does not exist on system
            END IF;
            
            IF p_debug = 'Y' AND nv_reject_code IS NOT NULL THEN
                DBMS_OUTPUT.PUT_LINE('case '||sar_rec.case_number||' not  found, so rejecting with '||nv_reject_code);
            END IF;
            
            -- check that MCOL reference has been supplied    
            IF sar_rec.mcol_reference IS NULL THEN
                cv_error_loc       := 'SAR_MIS_REF';
                nv_reject_code     := 99; -- missing MCOL case reference
            END IF;
            
            IF p_debug = 'Y' AND nv_reject_code IS NOT NULL THEN
                DBMS_OUTPUT.PUT_LINE('MCOL refeence not  found, so rejecting with '||nv_reject_code);
            END IF;
            
			-- validate the defendant
			IF 	nv_reject_code IS NULL THEN
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('checking defendant');
                END IF;
                cv_error_loc       := 'SAR_DEF_CHK';
				p_defendant_invalid
							( 
							sar_case_number,
							sar_rec.defendant_id,
							sar_party_no,
							nv_reject_code
							);
                IF p_debug = 'Y' THEN
                    IF  nv_reject_code IS NOT NULL THEN
                        DBMS_OUTPUT.PUT_LINE('Defendant '||sar_rec.defendant_id||' not  found, so rejecting with '||nv_reject_code);
                    ELSE
                        DBMS_OUTPUT.PUT_LINE('Defendant party no is'||sar_party_no);
                    END IF;
                END IF;
            END IF;
            
            -- set requester
            IF  sar_rec.party_role_code = 'DEFENDANT' THEN
                -- request for set aside from defendant
                sar_requester   :=  'PARTY_AGAINST';
            ELSE
                -- request for set aside from claimant
                sar_requester   :=  'PARTY_FOR';
			END IF;
			
			-- check for a VARIED/ACTIVE Judgement
            -- Note: The judgment to be set aside will always be
            -- vs the defendant, regardless of whether the claimant or
            -- defendant applied for the judgement to be set aside
			IF 	nv_reject_code 	IS NULL 	THEN
                cv_error_loc       := 'SAR_JUG_CHK';
				p_get_judgement_seq 
						( 
						sar_case_number, 
						sar_rec.defendant_id,
						sar_judgment_seq,
                        cv_judgment_ref,
                        nv_reject_code
                        );
                IF sar_judgment_seq = -1 THEN
                    -- no valid judgement found 
                    nv_reject_code := 97;
                ELSIF cv_judgment_ref IS NULL THEN
                    -- we have a valid judgement without an
                    -- pre-existing mcol judgment reference, so create one
                    cv_judgment_ref := 'CJ'||TO_CHAR(sar_judgment_seq);
                    DBMS_OUTPUT.PUT_LINE('created mcol reference of '||cv_judgment_ref);
                END IF;
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('defendant no is '||sar_rec.defendant_id);
                    DBMS_OUTPUT.PUT_LINE('Judgment seq is '||sar_judgment_seq);
                    DBMS_OUTPUT.PUT_LINE('Judgment ref is '||cv_judgment_ref);
                    DBMS_OUTPUT.PUT_LINE('Judgment nv_reject_code is '||nv_reject_code);
                END IF;
			END IF;
            
			-- check for previous set aside events
			IF 	nv_reject_code 	IS NULL AND
				f_check_for_sar_events( sar_case_number, sar_party_no)	THEN
				-- previous 160 event has been found so reject request
				nv_reject_code := 98;
                cv_error_loc       := 'SAR_EVT_FAIL';
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('160 event found, so rejecting with '||nv_reject_code);
                END IF;
			END IF;
			
            IF p_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('validated Set Aside  is '	||sar_rec.case_number
																||' Reject = '
																||nv_reject_code
																||' pdf_file_name is '||sar_rec.pdf_file_name); 
            END IF;
            
            IF nv_reject_code IS NULL THEN
                cv_error_loc := 'SAR_INS_EVNT';
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('adding Set Aside Request event for '||sar_case_number||' party '||sar_rec.party_role_code||' id '||sar_rec.defendant_id);
                END IF;
                    
                -- create event in caseman using overloaded procedure
                -- with mcol_reference as the last parameter
                ccbc_events.insert_event_dbp
                        (
                        sar_case_number, 
                        160,                -- std_event_id
                        sar_rec.defendant_id, 
                        'DEFENDANT',
                        sar_requester,      -- requester
                        'Fee Paid',         -- details
                        '',                 -- warrant_number
                        sar_judgment_seq,  -- judgement_seq
                        '', 
                        'N', 
                        '',
                        sar_rec.mcol_reference
                        );

                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('new event id is '||ccbc_events.last_event_seq);
                    DBMS_OUTPUT.PUT_LINE('about to load document '||sar_rec.pdf_file_name);
                END IF; -- debug               
                
				-- now try to load the MCOL PDF file
				-- Note: last_event_seq is a global populated with the event_seq
				-- by the ccbc_events.insert_event_dbp procedure
				-- load_document_for_event function will return Y or N
				document_load_pkg.load_document_for_event
					(
                    sar_case_number,
					sar_rec.pdf_file_name,
					ccbc_events.last_event_seq,
					'CCBC_N244',
                    p_debug,
                    sar_file_loaded
                    );
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('load document into caseman result = '||sar_file_loaded);
                END IF; -- debug

                IF sar_file_loaded = 'N' THEN 
                    -- increment the load_failed_count
                    -- if this count is non-zero, the
                    -- ccbc_mcol_interface pkg will exit with
                    -- a failure , so autosys will report 
                    -- a failure which the operators need to
                    -- investigate
                    p_load_failed := p_load_failed + 1;
                END IF;    

                -- returned accepted record to mcol
                INSERT INTO mcol_data md
                    (
                    md.claim_number, 
                    md.deft_id, 
                    md.type,
                    md.event_date,
                    md.mcol_reference,
                    md.judgment_reference
                    )
                VALUES
                    (
                    sar_case_number, 
                    sar_rec.defendant_id, 
                    'X1',
                    SYSDATE,
                    sar_rec.mcol_reference,
                    cv_judgment_ref
                    );
                
            ELSE
                -- set aside request  rejected, so record rejection in mcol data
                -- no caseman event is logged so do not set event date
                cv_error_loc := 'MCOL_INS';
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('rejecting Set Aside Request event for '||sar_case_number||' party '||sar_rec.party_role_code||' id '||sar_rec.defendant_id);
                END IF; -- debug
                INSERT INTO mcol_data md
                    (
                    md.claim_number, 
                    md.deft_id, 
                    md.type, 
                    md.reject_code,
                    md.mcol_reference,
                    md.judgment_reference
                    )
                VALUES
                    (
                    sar_case_number, 
                    sar_rec.defendant_id, 
                    'X0',
					nv_reject_code,
                    sar_rec.mcol_reference,
                    cv_judgment_ref
                    );
            END IF;
						
			IF 	p_debug = 'Y' THEN
				DBMS_OUTPUT.PUT_LINE(' Last Judgment Seq is  '||ccbc_events.last_event_seq);
			END IF;

    		-- add a record to the MCOL_PDF_TABLE

			INSERT INTO mcol_pdf_status
				(
                created_ts,
				pdf_file_name,
				loaded,
                printed,
                deleted,
                print_now,
				event_seq,
                case_number,
                order_id
				)
			VALUES
				(
                SYSTIMESTAMP,
				sar_rec.pdf_file_name,
				sar_file_loaded, -- this will be Y if validated and file has loaded successfully or N 
                'N',
                'N',
				'Y',
                decode(nv_reject_code,null, ccbc_events.last_event_seq,null),	-- NULL if rejected or event_seq if request is validated and loaded successfully
                sar_case_number,
                'CCBC_N244' -- order id
				);
			
            IF p_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('loaded pdf file records '||SQL%ROWCOUNT);
            END IF; -- debug
           
            cv_error_loc       := 'UPD_SAR';
            UPDATE  set_aside_requests
            SET     validated = 'Y',
                    reject_code = nv_reject_code -- this will be NULL if the record is valid.
            WHERE CURRENT OF cur_set_asides;
            
        END LOOP; -- finish processing current batch of set_asides
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('** Finished validating set_asides ** ');
            
        /*------------------------------------------------------------------------------*
         *  Trap all errors and report them in the VALIDATE_ERRORS table, after         *
         * rolling back any incomplete inserts or updates.                              *
         *------------------------------------------------------------------------------*/
        EXCEPTION
        WHEN OTHERS THEN
            BEGIN
                nv_sql_code_num := SQLCODE;
                cv_sql_err_mess := substr(SQLERRM,1,100);
                DBMS_OUTPUT.PUT_LINE(nv_sql_code_num||' '||cv_sql_err_mess);
                ROLLBACK;
                IF cur_set_asides%ISOPEN THEN
                    CLOSE cur_set_asides;
                END IF;
                
                INSERT INTO validate_errors 
                    ( 
                    module_id, 
                    err_number, 
                    err_date, 
                    location,   
                    description,  
                    record_id 
                    )
                VALUES 
                    ( 
                    'BC_SA_U1', 
                    nv_sql_code_num, 
                    SYSDATE, 
                    cv_error_loc, 
                    cv_sql_err_mess, 
                    sar_case_number 
                    );
                COMMIT;
                RAISE;
            END;    
    END; -- end of bc_sa_u1
END; -- end of validate_set_asides_pkg
/