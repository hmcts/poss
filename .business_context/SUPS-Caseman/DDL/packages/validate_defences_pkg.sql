/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : validate_defences
| SYNOPSIS      : This packages validates the defences submitted via MCOL and 
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

CREATE OR REPLACE PACKAGE validate_defences_pkg IS

PROCEDURE bc_de_u1( p_username IN VARCHAR2, p_court_code IN VARCHAR2, p_debug IN VARCHAR2, p_load_failed IN OUT NUMBER );

END; -- end of validate_defences_pkg
/
/***********************************************************************************************************\
*                                                 P A C K A G E                                            *
\***********************************************************************************************************/
CREATE OR REPLACE PACKAGE BODY validate_defences_pkg IS

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
                                lv_case_party_no    OUT VARCHAR2,
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
* TYPE          : FUNCTION                                                                                  *
* NAME          : f_active_judgement                                                                        *
* DESCRIPTION   : Checks to see if there active judgement recorded against the defendant                    *
*               : Returns TRUE if judgement be found                                                        *
\***********************************************************************************************************/
FUNCTION f_active_judgement ( p_case_no  VARCHAR2, p_case_party_no VARCHAR2) RETURN BOOLEAN IS

nv_judgement_count NUMBER;

BEGIN
    SELECT COUNT(judg.judg_seq)
    INTO    nv_judgement_count
    FROM    judgments judg
    WHERE   judg.case_number = p_case_no
    AND     judg.against_party_role_code = 'DEFENDANT'
    AND     judg.against_case_party_no = p_case_party_no
    AND     (judg.status IS NULL OR  judg.status IN ('SATISFIED','CANCELLED'));
    
    IF nv_judgement_count > 0 THEN
    -- at least one judgement exists so
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
    
    EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN FALSE;
END; -- end of f_active_judgement function

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : f_case_stayed                                                                             *
* DESCRIPTION   : Checks to see if the case has been STAYED                                                 *
\***********************************************************************************************************/
FUNCTION f_case_stayed ( l_case_no  VARCHAR2) RETURN BOOLEAN IS

lv_valid_case  VARCHAR2(8) := NULL;

BEGIN
    SELECT  c.case_number
    INTO    lv_valid_case  
    FROM    cases c
    WHERE   c.case_number = l_case_no
    AND     c.status = 'STAYED';
    
    -- case has been stayed
    RETURN TRUE;

    EXCEPTION
    WHEN NO_DATA_FOUND THEN
        -- case has not been stayed
        RETURN FALSE;
END;
/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : bc_de_u1                                                                         *
* DESCRIPTION   : Checks to see if the defences submitted via MCOL are valid                                *
*               : If the defence is valid, create a CASEMAN event and tell MCOL the defence has been        *
*               : accepted by CASEMAN                                                                       *
*               : If defence is not valid, do not create a event. Tell MCOL the defence has rejeced         *
*               : Returns TRUE if judgement be found                                                        *
\***********************************************************************************************************/

PROCEDURE bc_de_u1( p_username IN VARCHAR2, p_court_code IN VARCHAR2, p_debug IN VARCHAR2, p_load_failed IN OUT NUMBER ) IS

CURSOR  cur_defences IS
SELECT  dde.case_number, 
        dde.type, 
        dde.defendant_id, 
        dde.defendant_addr_1, 
        dde.defendant_addr_2, 
        dde.defendant_addr_3, 
        dde.defendant_addr_4, 
        dde.defendant_postcode, 
        dde.defendant_dob, 
        dde.telephone_number, 
        dde.email, 
        dde.cust_file_sequence,
        dde.fee,
        dde.pdf_file_name,
        dde.print_now,
        dde.reject_code,
        dde.via_sdt,
        dde.validated
FROM    defence_doc_event dde
WHERE   validated = 'N'
FOR UPDATE OF dde.validated;

nv_reject_code  NUMBER          := NULL;
caseman_event   NUMBER          := 0;

mcol_type       VARCHAR2(2)     := NULL;
def_party_no    VARCHAR2(4)     := 0;
def_order_id    order_types.order_id%TYPE := NULL;

-- variable for error handling exception
nv_sql_code_num             NUMBER;              -- SQL Error Code Number.
cv_sql_err_mess             VARCHAR2(100);       -- SQL Error Message Text.
cv_error_loc                VARCHAR2(10)    := NULL;
cv_case_number              VARCHAR2(8)     := NULL;
cv_details                  case_events.details%TYPE := NULL;
def_file_loaded		        VARCHAR2(1)		:= 'N';

    BEGIN
    
        -- set application context
        SET_SUPS_APP_CTX(p_username, p_court_code,'BC_DE_U1' );
        
        DBMS_OUTPUT.PUT_LINE('**START** of defence validation ');
        
        FOR def_rec IN cur_defences
        LOOP
            nv_reject_code  :=  NULL;
            caseman_event   :=  NULL;
            mcol_type       :=  NULL;
            def_party_no    :=  NULL;
            def_file_loaded := 'N';
            cv_case_number  :=  def_rec.case_number;
            cv_details      := NULL;
            
            IF p_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('**START Defense validation **  Claim is '||def_rec.case_number||' Reject = '||nv_reject_code||' type is '||def_rec.type); 
                DBMS_OUTPUT.PUT_LINE(' validated = '||def_rec.validated);

            END IF;
            
            CASE    def_rec.type
            WHEN 'AS' THEN
            -- validate Acknowledgement of Service event
                BEGIN
                    -- default to failed event
                    mcol_type := 'A0';
                    
                    IF f_case_invalid ( cv_case_number ) THEN
                        cv_error_loc       := 'VAL_AO_CAS';
                        nv_reject_code     := 48; -- Quoted Case Number does not exist on system
                    END IF;

                    IF nv_reject_code IS NULL THEN
                        -- verify the defendant exists 
                        p_defendant_invalid
                        ( 
                        cv_case_number,
                        def_rec.defendant_id,
                        def_party_no,
                        nv_reject_code
                        );
                    END IF;
                    
                    IF nv_reject_code IS NULL THEN
                        -- passed validation so
                        -- set successful mcol_type
                        -- and caseman_event.
                        cv_error_loc       := 'VAL_AS_OK';
                        mcol_type      := 'AS';
                        caseman_event   := 38;
                        def_order_id    := 'CCBC_N9SDT';
                    END IF;

                END; 
            WHEN 'DE' THEN
                -- validate defence event
                 
                BEGIN
                    -- default to failed mcol event
                    mcol_type := 'E0';
                    IF f_case_invalid ( cv_case_number ) THEN
                        cv_error_loc       := 'VAL_EO_CAS';
                        nv_reject_code     := 48; -- Quoted Case Number does not exist on system
                    END IF;

                    IF nv_reject_code IS NULL THEN
                        -- verify the defendant exists 
                        p_defendant_invalid
                        ( 
                        cv_case_number,
                        def_rec.defendant_id,
                        def_party_no,
                        nv_reject_code
                        );
                    END IF;
                    
                    IF  nv_reject_code IS NULL AND
                        f_active_judgement( cv_case_number, def_party_no ) THEN
                        -- active judgment has been found
                        cv_error_loc       := 'VAL_EO_JUG';
                        nv_reject_code     := 93; -- Active judgment found for defendant
                    END IF;
                                    
                    IF nv_reject_code IS NULL THEN
                        -- passed validation so
                        -- set successful mcol_type
                        -- and caseman_event.
                        cv_error_loc    := 'VAL_DE_OK';
                        mcol_type       := 'DE';
                        caseman_event   := 50;
                        def_order_id    := 'CCBC_N9B';
                    END IF;                   
                END;
            WHEN 'DC' THEN 
                -- Defence and Counterclaim event
                               
                BEGIN 
                    -- default to failed mcol event
                    mcol_type := 'D0';
                    
                    IF f_case_invalid ( cv_case_number ) THEN
                        cv_error_loc       := 'VAL_DO_CAS';
                        nv_reject_code     := 48; -- Quoted Case Number does not exist on system
                    END IF;

                    IF nv_reject_code IS NULL THEN
                        -- verify the defendant exists 
                        p_defendant_invalid
                        ( 
                        cv_case_number,
                        def_rec.defendant_id,
                        def_party_no,
                        nv_reject_code
                        );
                    END IF;
                    
                    IF  nv_reject_code IS NULL AND
                        f_active_judgement( cv_case_number, def_party_no ) THEN
                        -- active judgment has been found
                        cv_error_loc       := 'VAL_D0_JUG';
                        nv_reject_code     := 93; -- Active judgment found for defendant
                    END IF;
                    
                    IF  nv_reject_code IS NULL AND
                        f_case_stayed( cv_case_number ) THEN
                        cv_error_loc       := 'VAL_DO_STA';
                        nv_reject_code     := 94; -- Case status is STAYED
                    END IF;
                    
                    IF nv_reject_code IS NULL THEN
                        -- passed validation so
                        -- set successful mcol_type
                        -- and caseman_event.
                        cv_error_loc       := 'VAL_DC_OK';
                        mcol_type      := 'DC';
                        caseman_event   := 52;
                        def_order_id    := 'CCBC_N9B';
                        IF  def_rec.fee     IS NOT NULL AND 
                            def_rec.fee > 0 THEN
                            -- set event description
                            cv_details  := 'Fee Paid';
                        END IF;                            
                    END IF;
                END; 
            WHEN 'PA' THEN 
                -- part admission event
                BEGIN
                    -- default to failed mcol event
                    mcol_type := 'P0';
                    
                    IF f_case_invalid ( cv_case_number ) THEN
                        cv_error_loc       := 'VAL_PO_CAS';
                        nv_reject_code     := 48; -- Quoted Case Number does not exist on system
                    END IF;

                    IF nv_reject_code IS NULL THEN
                        -- verify the defendant exists 
                        p_defendant_invalid
                        ( 
                        cv_case_number,
                        def_rec.defendant_id,
                        def_party_no,
                        nv_reject_code
                        );
                    END IF;
                    
                    IF  nv_reject_code IS NULL AND
                        f_active_judgement( cv_case_number, def_party_no ) THEN
                        -- active judgment has been found
                        cv_error_loc       := 'VAL_P0_JUG';
                        nv_reject_code     := 93; -- Active judgment found for defendant
                    END IF;
                    
                    IF nv_reject_code IS NULL THEN
                        -- passed validation so
                        -- set successful mcol_type
                        -- and caseman_event.
                        cv_error_loc       := 'VAL_PA_OK';
                        mcol_type      := 'PA';
                        caseman_event   := 60;
                        def_order_id    := 'CCBC_N9A';
                        IF  def_rec.fee     IS NOT NULL AND 
                            def_rec.fee > 0 THEN
                            -- set event description
                            cv_details  := 'Fee Paid';
                        END IF;    
                    END IF;
                END; 
            ELSE
                -- unknown data table
                -- log an error message
                mcol_type      := def_rec.type;
                nv_reject_code := 96; -- invalid defence event type
            END CASE;
            
            IF p_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('Validated defence Claim is '||cv_case_number||' Reject = '||nv_reject_code||' type is '||mcol_type||' cust seq = '||def_rec.cust_file_sequence);
            END IF;
            
            IF nv_reject_code IS NULL THEN
                cv_error_loc := 'INS_EVNT';
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('adding defendant event for '||cv_case_number||' event '||caseman_event||' defendant '||def_rec.defendant_id);
                END IF;
                ccbc_events.insert_event_dbp
                    (
                    cv_case_number, 
                    caseman_event, 
                    def_rec.defendant_id,
                    'DEFENDANT',            -- party role code
                    '',                     -- requester
                    cv_details,             -- event details free text field
                    '',                     -- warrant id
                    '',                     -- judgement seq
                    '',                     -- vary seq
                    'N',                    --  deleted flag
                    ''                      -- result
                    );
                -- returned accepted record to mcol
                    
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('new def event id is '||ccbc_events.last_event_seq);
                    DBMS_OUTPUT.PUT_LINE('about to load defence document '||def_rec.pdf_file_name||' order id '||def_order_id||' mcol_type '||mcol_type);
                END IF; -- debug
                
                -- load the PDF Document associated with the event.
                				-- now try to load the MCOL PDF file
				-- Note: last_event_seq is a global populated with the event_seq
				-- by the ccbc_events.insert_event_dbp procedure
				-- load_document_for_event function will return Y or N
				document_load_pkg.load_document_for_event
					(
                    cv_case_number,
					def_rec.pdf_file_name,
					ccbc_events.last_event_seq,
					def_order_id,
                    p_debug,
                    def_file_loaded
                    );
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('load document into caseman result = '||def_file_loaded);
                END IF; -- debug

                IF def_file_loaded = 'N' THEN 
                    -- increment the load_failed_count
                    -- if this count is non-zero, the
                    -- ccbc_mcol_interface pkg will exit with
                    -- a failure , so autosys will report 
                    -- a failure which the operators need to
                    -- investigate
                    p_load_failed := p_load_failed + 1;
                END IF; 

                -- caseman event has been added so set event date
                INSERT INTO mcol_data md
                    (
                    md.claim_number, 
                    md.deft_id, 
                    md.type,
                    md.event_date
                    )
                VALUES
                    (
                    cv_case_number, 
                    def_rec.defendant_id, 
                    mcol_type,
                    SYSDATE
                    );
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('accepted  '||SQL%ROWCOUNT);
                END IF; -- debug
            ELSE
                -- defence rejected, so record rejection in mcol data
                -- no caseman event is logged so do not set event date
                cv_error_loc := 'MCOL_INS';
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('inserting mcol data record for '||cv_case_number||' '||def_rec.defendant_id);
                END IF; -- debug
                INSERT INTO mcol_data md
                    (
                    md.claim_number, 
                    md.deft_id, 
                    md.type, 
                    md.reject_code
                    )
                VALUES
                    (
                    cv_case_number, 
                    def_rec.defendant_id, 
                    mcol_type, 
                    nv_reject_code
                    );                
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('rejected  '||SQL%ROWCOUNT);
                END IF; -- debug    
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
				def_rec.pdf_file_name,
				def_file_loaded, -- this will be Y if validated and file has loaded successfully or N 
                'N',
                'N',
                def_rec.print_now,           -- yes, for MCOL defence events. No for CCBC defence events
				decode(nv_reject_code,null, ccbc_events.last_event_seq,null),	-- NULL if rejected or event_seq if request is validated and loaded successfully
                def_rec.case_number,
                def_order_id
				);
			
            IF p_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('processed pdf status records '||SQL%ROWCOUNT);
            END IF; -- debug

            cv_error_loc       := 'UPD_DEF';
            UPDATE  defence_doc_event
            SET     validated = 'Y',
                    reject_code = nv_reject_code
            WHERE CURRENT OF cur_defences;
            
        END LOOP; -- finish processing current batch of defences
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('** Finished validating defences ** ');
            
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
                IF cur_defences%ISOPEN THEN
                    CLOSE cur_defences;
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
                    'BC_DE_U1', 
                    nv_sql_code_num, 
                    SYSDATE, 
                    cv_error_loc, 
                    cv_sql_err_mess, 
                    cv_case_number 
                    );
                COMMIT;
                RAISE;
            END;    
    END; -- end of bc_de_u1
END; -- end of validate_defences_pkg
/