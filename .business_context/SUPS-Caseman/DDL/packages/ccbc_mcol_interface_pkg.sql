/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : ccbc_mcol_interface_pkg
| SYNOPSIS      : This package provides an interface to transfer data between the MCOL and CASEMAN
|                  applications via a database link, using the MCOL staging area.
|
|                  Data can be pushed from CASEMAN to MCOL or
|                  Data can be fetched from MCOL to CASEMAN
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

CREATE OR REPLACE PACKAGE ccbc_mcol_interface_pkg IS

PROCEDURE mcol_push( p_username IN VARCHAR2, p_court_code IN VARCHAR2 );

PROCEDURE mcol_pull( p_username IN VARCHAR2, p_court_code IN VARCHAR2, p_debug IN VARCHAR2 );

END; -- end of ccbc_mcol_interface_pkg header
/

/***********************************************************************************************************\
*                                                 P A C K A G E                                            *
\***********************************************************************************************************/
CREATE OR REPLACE PACKAGE BODY ccbc_mcol_interface_pkg IS
/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : mcol_push                                                                                 *
* DESCRIPTION   : Selects data from the local CCBC mcol_data table and pushes it to the matching MCOL_DATA  *
*               : in MCOL's CCBC staging area via database link                                             *
*               :                                                                                           *
*               : The source and destination tables are identical in function, but two columns have         *
*               : diffent names in the MCOL version of the MCOL_DATA table.                                 *
*               :                                                                                           *
*               :   CASEMAN MCOL_DATA column        MCOL MCOL_DATA column                                   *
*               :   ========================        =====================                                   *
*               :   previous_creditor               ncp_id_from                                             *
*               :   new_creditor                    ncp_id_to                                               *
*               :                                                                                           *
*               : Note: Since Oracle does not support pushing bulk collections over a database link         *
*               :       this procedure uses single row processing                                           * 
\***********************************************************************************************************/
PROCEDURE mcol_push( p_username IN VARCHAR2, p_court_code IN VARCHAR2 ) IS   

CURSOR cur_push IS
SELECT
    md.rowid,
    md.claim_number, 
    md.deft_id, 
    md.type, 
    md.event_date, 
    md.reject_code, 
    md.warrant_number, 
    md.return_code, 
    md.return_info, 
    md.addr_1, 
    md.addr_2, 
    md.addr_3, 
    md.addr_4, 
    md.addr_5, 
    md.postcode, 
    md.date_sent, 
    md.previous_creditor, 
    md.new_creditor, 
    md.judgment_type, 
    md.joint_judgment, 
    md.total, 
    md.instalment_amount, 
    md.frequency, 
    md.first_payment_date,
    md.mcol_reference, 
    md.judgment_reference,
	md.paid_date
FROM mcol_data md
ORDER BY md.time_stamp;

pushed_count NUMBER := 0;
failed_count NUMBER := 0;
        
BEGIN -- start of mcol push
    
        -- set application context
        
        SET_SUPS_APP_CTX(p_username, p_court_code,'mcol_push' );
    
        FOR push_rec    IN cur_push
            LOOP
                BEGIN
                    INSERT INTO mcol_data@ccbc_mcol_link md -- live link 
                        (
                        md.claim_number, 
                        md.deft_id, 
                        md.type, 
                        md.event_date, 
                        md.reject_code, 
                        md.warrant_number, 
                        md.return_code, 
                        md.return_info, 
                        md.addr_1, 
                        md.addr_2, 
                        md.addr_3, 
                        md.addr_4, 
                        md.addr_5, 
                        md.postcode, 
                        md.date_sent, 
                        md.ncp_id_from, 
                        md.ncp_id_to, 
                        md.judgment_type, 
                        md.joint_judgment, 
                        md.total, 
                        md.instalment_amount, 
                        md.frequency, 
                        md.first_payment_date,
                        md.mcol_reference, 
                        md.judgment_reference,
						md.paid_date
                        )
                        VALUES
                        (
                        push_rec.claim_number, 
                        push_rec.deft_id, 
                        push_rec.type, 
                        push_rec.event_date, 
                        push_rec.reject_code, 
                        push_rec.warrant_number, 
                        push_rec.return_code, 
                        push_rec.return_info, 
                        push_rec.addr_1, 
                        push_rec.addr_2, 
                        push_rec.addr_3, 
                        push_rec.addr_4, 
                        push_rec.addr_5, 
                        push_rec.postcode, 
                        push_rec.date_sent, 
                        push_rec.previous_creditor, 
                        push_rec.new_creditor, 
                        push_rec.judgment_type, 
                        push_rec.joint_judgment, 
                        push_rec.total, 
                        push_rec.instalment_amount, 
                        push_rec.frequency, 
                        push_rec.first_payment_date,
                        push_rec.mcol_reference, 
                        push_rec.judgment_reference,
						push_rec.paid_date
                        );
                        
                        -- having copied the record to MCOL, delete it from
                        -- the local caseman table
                        DELETE FROM mcol_data md
                        WHERE md.rowid = push_rec.rowid;
                        
                        pushed_count := pushed_count + 1;
                        COMMIT;
                    EXCEPTION
                        WHEN OTHERS THEN
                            DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
                            DBMS_OUTPUT.PUT_LINE('while sending data to MCOL in procedure mcol_push');
                            DBMS_OUTPUT.PUT_LINE('for Case Number '||push_rec.claim_number);
                            DBMS_OUTPUT.PUT_LINE('Rolling Back changes');
                            failed_count := failed_count + 1;
                            ROLLBACK;
                            -- re-raise exception so autosys sees failure
                            RAISE;
                END;    
            END LOOP;
        DBMS_OUTPUT.PUT_LINE('Pushed '||pushed_count||' mcol_data records to MCOL');
        DBMS_OUTPUT.PUT_LINE('Failed to push '||failed_count||' mcol_data records to MCOL');

        IF pushed_count > 0 THEN
            -- tell mcol that data has been pushed and needs to be processed
            exec_ols_ccbc_package.exec_p_data_to_ols@ccbc_mcol_link;
        END IF;
        
END; -- end of mcol_push

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : valid_case                                                                                *
* DESCRIPTION   : Checks to see if the case can be found in caseman                                         *
*               : Return FALSE if case cannot be found in caseman                                           *
\***********************************************************************************************************/
FUNCTION f_valid_case (l_case_number VARCHAR2) RETURN BOOLEAN IS

ln_case_number  cases.case_number%TYPE;

BEGIN
    SELECT  c.case_number
    INTO    ln_case_number
    FROM    cases c
    WHERE   c.case_number = l_case_number;
    -- claimant found so return party id
    RETURN TRUE;
    
    EXCEPTION
    WHEN NO_DATA_FOUND THEN            
            -- case not found
           RETURN FALSE;
 
END; -- end of check_for_claimant
    
/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : check_for_claimant                                                                        *
* DESCRIPTION   : Checks to see if the claimant on the case can be found in caseman                         *
*               :                                                                                           *
\***********************************************************************************************************/
FUNCTION check_for_claimant (l_case_number VARCHAR2) RETURN NUMBER IS

ln_party_id NUMBER := 0;

BEGIN
    SELECT  cpr.party_id
    INTO    ln_party_id
    FROM    case_party_roles cpr
    WHERE   cpr.case_number     = l_case_number
    AND     cpr.case_party_no   = 1
    AND     cpr.party_role_code = 'CLAIMANT';
    -- claimant found so return party id
    RETURN ln_party_id;
    
    EXCEPTION
    WHEN NO_DATA_FOUND THEN            -- claimant not found
            DBMS_OUTPUT.PUT_LINE('No Claimant details found for case '||
           l_case_number||
           ' - address cannot be updated.');
           RETURN 0;
 
END; -- end of check_for_claimant
    
/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : get_current_address                                                             *
* DESCRIPTION   : Checks given_addresses table for the current address for a party                          *
*               :                                                                                           *
\***********************************************************************************************************/
 FUNCTION   get_current_address ( ln_party_id NUMBER ) RETURN NUMBER IS 
 
 ln_addr_id NUMBER := 0;
 
 BEGIN
    SELECT  addr.address_id
    INTO    ln_addr_id
    FROM    given_addresses addr
    WHERE   addr.party_id = ln_party_id
    AND     addr.valid_to is null;
    RETURN ln_addr_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            -- This Should never happen, but do nothing if it does
            -- as we are going to add a new addresses
            RETURN 0;
END;

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : solicitor_check                                                                           *
* DESCRIPTION   : Checks to see if the solictor already exists. If solicitor doesn't already exist, creates *
*               : the solicitor                                                                             *
*               :                                                                                           *
\***********************************************************************************************************/
PROCEDURE check_for_solicitor ( ln_case_number     IN VARCHAR2,
                                ln_party_id     OUT    NUMBER,
                                ln_solicitor_no OUT    NUMBER
                                )  IS


BEGIN

    -- check to see if solicitor already exist. Add the solicitor if not found
    SELECT  cpr.party_id,
            cpr.case_party_no
    INTO    ln_party_id,
            ln_solicitor_no
    FROM    cpr_to_cpr_relationship  cpr2,
            case_party_roles cpr
    WHERE   cpr2.cpr_a_case_number      = ln_case_number
    AND     cpr2.cpr_a_case_party_no  = 1
    AND     cpr2.cpr_a_party_role_code  = 'CLAIMANT'
    AND     cpr2.cpr_b_case_number      = ln_case_number
    AND     cpr2.cpr_b_party_role_code  = 'SOLICITOR'
    AND     cpr2.deleted_flag           = 'N'
    AND     cpr.case_number             = ln_case_number
    AND     cpr.case_party_no           = cpr2.cpr_b_case_party_no
    AND     cpr.party_role_code         = 'SOLICITOR';
    -- DBMS_OUTPUT.PUT_LINE(' found Solicitor = '||ln_party_id);
    EXCEPTION
    WHEN NO_DATA_FOUND THEN
        BEGIN
            -- solicitor not found , so we need to add the solicitor
            
            -- Insert PARTIES record for the new solicitor 

            SELECT      parties_sequence.NEXTVAL
            INTO        ln_party_id 
            FROM        dual;
            
            INSERT INTO parties
                (
                party_id, 
                party_type_code
                )
            VALUES
                (
                ln_party_id, 
                'SOLICITOR'
                );
                
            -- It is possible that there may have been previous solicitors
            -- on the case who have been removed. So need to add 1 to any
            -- previous solicitor no, if it exists
            
            SELECT     NVL(MAX(case_party_no),0) + 1
            INTO     ln_solicitor_no
            FROM    case_party_roles
            WHERE   case_number = ln_case_number
            AND     party_role_code = 'SOLICITOR';

            -- Insert CASE_PARTY_ROLES record for the new solicitor
            
            INSERT INTO CASE_PARTY_ROLES
                (
                case_number, 
                case_party_no, 
                party_role_code, 
                party_id
                )
            VALUES
                (
                ln_case_number, 
                ln_solicitor_no, 
                'SOLICITOR',
                ln_party_id
                );
                
            -- Insert CPR_TO_CPR_RELATIONSHIP record for the claimant representative 
            
            INSERT INTO CPR_TO_CPR_RELATIONSHIP
                (
                cpr_a_case_number, 
                cpr_a_case_party_no, 
                cpr_a_party_role_code, 
                cpr_b_case_number,
                cpr_b_case_party_no,  
                cpr_b_party_role_code,
                deleted_flag
                )
             VALUES
                (
                ln_case_number, 
                1, 
                'CLAIMANT', 
                ln_case_number, 
                ln_solicitor_no, 
                'SOLICITOR',
                'N'
                );
            -- DBMS_OUTPUT.PUT_LINE('added Solicitor = '||ln_party_id);

        END; -- end of no_data_found
END; -- end of solicitor_check


/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : check_for_def_solicitor                                                                   *
* DESCRIPTION   : Checks to see if the defendant solictor already exists. If solicitor doesn't already      *
*               : exist, creates the solicitor                                                                *
*               :                                                                                           *
\***********************************************************************************************************/
PROCEDURE check_for_def_solicitor ( ln_case_number  IN VARCHAR2,
                                    ln_def_id       IN NUMBER,
									ln_def_name		IN VARCHAR2,
                                    ln_party_id     OUT    NUMBER,
                                    ln_solicitor_no OUT    NUMBER
                                    )  IS


BEGIN

    -- check to see if solicitor already exist. Add the solicitor if not found
    SELECT  cpr.party_id,
            cpr.case_party_no
    INTO    ln_party_id,
            ln_solicitor_no
    FROM    cpr_to_cpr_relationship  cpr2,
            case_party_roles cpr
    WHERE   cpr2.cpr_a_case_number      = ln_case_number
    AND     cpr2.cpr_a_case_party_no      = ln_def_id
    AND     cpr2.cpr_a_party_role_code  = 'DEFENDANT'
    AND     cpr2.cpr_b_case_number      = ln_case_number
    AND     cpr2.cpr_b_party_role_code  = 'SOLICITOR'
    AND     cpr2.deleted_flag           = 'N'
    AND     cpr.case_number             = ln_case_number
    AND     cpr.case_party_no           = cpr2.cpr_b_case_party_no
    AND     cpr.party_role_code         = 'SOLICITOR';
    -- DBMS_OUTPUT.PUT_LINE(' found Solicitor = '||ln_party_id);
    EXCEPTION
    WHEN NO_DATA_FOUND THEN
        BEGIN
            -- solicitor not found , so we need to add the solicitor
            
            -- Insert PARTIES record for the new solicitor 

            SELECT      parties_sequence.NEXTVAL
            INTO        ln_party_id 
            FROM        dual;
            
            INSERT INTO parties
                (
                party_id, 
                party_type_code,
				person_requested_name
                )
            VALUES
                (
                ln_party_id, 
                'SOLICITOR',
				ln_def_name
                );
                
            -- It is possible that there may have been previous solicitors
            -- on the case who have been removed. So need to add 1 to any
            -- previous solicitor no, if it exists
            
            SELECT     NVL(MAX(case_party_no),0) + 1
            INTO     ln_solicitor_no
            FROM    case_party_roles
            WHERE   case_number = ln_case_number
            AND     party_role_code = 'SOLICITOR';

            -- Insert CASE_PARTY_ROLES record for the new solicitor
            
            INSERT INTO CASE_PARTY_ROLES
                (
                case_number, 
                case_party_no, 
                party_role_code, 
                party_id
                )
            VALUES
                (
                ln_case_number, 
                ln_solicitor_no, 
                'SOLICITOR',
                ln_party_id
                );
                
            -- Insert CPR_TO_CPR_RELATIONSHIP record for the claimant representative 
            
            INSERT INTO CPR_TO_CPR_RELATIONSHIP
                (
                cpr_a_case_number, 
                cpr_a_case_party_no, 
                cpr_a_party_role_code, 
                cpr_b_case_number,
                cpr_b_case_party_no,  
                cpr_b_party_role_code,
                deleted_flag
                )
             VALUES
                (
                ln_case_number, 
                ln_def_id, 
                'DEFENDANT', 
                ln_case_number, 
                ln_solicitor_no, 
                'SOLICITOR',
                'N'
                );
            -- DBMS_OUTPUT.PUT_LINE('added Solicitor = '||ln_party_id);

        END; -- end of no_data_found
END; -- end of check_for_def_solicitor

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : process_defences                                                                          *
* DESCRIPTION   : transfers defence doc events from MCOL to CCBC staging tables where the rec_seq           *
*               : matches the cust_file_sequence                                                            *
*               :                                                                                           *
\***********************************************************************************************************/
FUNCTION process_defences ( batch_user VARCHAR2, rec_seq  VARCHAR2, l_debug VARCHAR2 ) RETURN BOOLEAN IS

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
            'N' validated,
            'Y' via_sdt,
            NVL(dde.solicitor_flag,'N') solicitor_flag,
            dde.fee,
            dde.pdf_file_name,
            dde.print_now,
            NULL reject_code,
			dde.defendant_name
    FROM    defence_doc_event@ccbc_mcol_link dde -- live link
    WHERE   dde.cust_file_sequence = rec_seq
    ORDER BY dde.case_number, dde.defendant_id;
    
    -- declare table of records for bulk fetch of defences  
    TYPE defences_tab IS TABLE OF cur_defences%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_defences        defences_tab;
    empty_defences      defences_tab;
    
    -- declare table of records for new address  
    TYPE addresses_tab IS TABLE OF given_addresses%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_addresses       addresses_tab;
    empty_addresses     addresses_tab;
    
    -- declare table address ids to update to out of date  
    TYPE addr_id_tab IS TABLE OF given_addresses.address_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_addr_ids        addr_id_tab;
    empty_addr_ids      addr_id_tab;
    
    -- declare tables and collections for date of birth
    TYPE dob_tab IS TABLE OF parties.person_dob%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_dobs            dob_tab;
    empty_dobs          dob_tab;

    TYPE dob_parties_tab IS TABLE OF parties.party_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_dob_parties     dob_parties_tab;
    empty_dob_parties   dob_parties_tab;

    -- declare tables and collections for email address
    TYPE email_tab IS TABLE OF parties.email_address%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_emails          email_tab;
    empty_emails        email_tab;

    TYPE email_parties_tab IS TABLE OF parties.party_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_email_parties   email_parties_tab;
    empty_email_parties email_parties_tab;

    -- declare tables and collections for telephone numbers
    TYPE tel_no_tab IS TABLE OF parties.tel_no%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_tel_nos         tel_no_tab;
    empty_tel_nos       tel_no_tab;
    
    TYPE tel_tab IS TABLE OF parties.party_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_tel_parties     tel_tab;
    empty_tel_parties   tel_tab;
    
    -- set of column collections for updating solicitor addresses
    -- solicitor address id
    TYPE solicitor_addr_id_tab IS TABLE OF given_addresses.address_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_ids        solicitor_addr_id_tab;
    empty_soladdr_ids      solicitor_addr_id_tab;

    -- solicitor address line 1 collection
    TYPE solicitor_addr_1_tab IS TABLE OF given_addresses.address_line1 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_1        solicitor_addr_1_tab;
    empty_soladdr_1      solicitor_addr_1_tab;

    -- solicitor address line 2 collection
    TYPE solicitor_addr_2_tab IS TABLE OF given_addresses.address_line2 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_2        solicitor_addr_2_tab;
    empty_soladdr_2      solicitor_addr_2_tab;
    
    -- solicitor address line 3 collection
    TYPE solicitor_addr_3_tab IS TABLE OF given_addresses.address_line3 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_3        solicitor_addr_3_tab;
    empty_soladdr_3      solicitor_addr_3_tab;
    
    -- solicitor address line 4 collection
    TYPE solicitor_addr_4_tab IS TABLE OF given_addresses.address_line4 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_4        solicitor_addr_4_tab;
    empty_soladdr_4      solicitor_addr_4_tab;
    
    -- solicitor postcode collection
    TYPE solicitor_postcode_tab IS TABLE OF given_addresses.postcode %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_sol_postcode        solicitor_postcode_tab;
    empty_sol_postcode      solicitor_postcode_tab;
    
    address_index       NUMBER  := 0;
    dob_index           NUMBER  := 0;
    email_index         NUMBER  := 0;
    telephone_index     NUMBER  := 0;
    sol_addr_index        NUMBER    := 0;
    
    vn_addr_id          NUMBER  := 0;
    vn_party_id         NUMBER  := 0;
    vn_solicitor_id        NUMBER := 0;
    vn_sol_party_id        NUMBER := 0;

    defence_count       NUMBER  := 0;
    
    valid_defences      NUMBER  := 0;
    invalid_defences    NUMBER  := 0;
    
    last_defendant       case_party_roles.party_id%TYPE := -1;

    BEGIN
        OPEN cur_defences;
        LOOP
            -- this will process all defences in batchs of up to 5000 claims at time.
            -- This value may need to be adjusted depending on memory available and 
            -- performance on the live environment. 
            FETCH cur_defences BULK COLLECT INTO lst_defences LIMIT 5000;
            -- process current batch of defences
            EXIT WHEN lst_defences.COUNT = 0;
            IF lst_defences.COUNT > 0 THEN
               defence_count := defence_count + lst_defences.COUNT;
            END IF;
            FOR def_idx IN 1..lst_defences.COUNT
                LOOP
                    BEGIN
                                            
                    /* Retrieve the party ID for the defendant*/    
                    SELECT  cpr.party_id
                    INTO    vn_party_id
                    FROM    case_party_roles cpr
                    WHERE   cpr.case_number     = lst_defences(def_idx).case_number
                    AND     cpr.case_party_no   = lst_defences(def_idx).defendant_id
                    AND     cpr.party_role_code = 'DEFENDANT';
                    IF SQL%FOUND THEN
                        -- we have a valid defendant, so check for changes to address, tel_no, email and date of birth
                        -- if there is address data for the defendant, record this in caseman.
                        IF lst_defences(def_idx).defendant_addr_1 IS NOT NULL THEN
                            -- only process the address, if the defendant is a new one
                            -- we have not previously processed.
                            IF vn_party_id != last_defendant THEN
                                
                                IF lst_defences(def_idx).solicitor_flag = 'Y' THEN
                                    -- Determine if a solicitor exists for the defendant and if not, create one
                                    check_for_def_solicitor (lst_defences(def_idx).case_number,lst_defences(def_idx).defendant_id,lst_defences(def_idx).defendant_name,vn_sol_party_id,vn_solicitor_id);
                                
                                    vn_addr_id := get_current_address(vn_sol_party_id);
                                    IF vn_addr_id != 0 THEN
                                        -- update the existing solicitor address
                                        sol_addr_index                   := sol_addr_index + 1;
                                        lst_soladdr_ids(sol_addr_index)  := vn_addr_id;
                                        lst_soladdr_1(sol_addr_index)    := lst_defences(def_idx).defendant_addr_1;
                                        lst_soladdr_2(sol_addr_index)    := lst_defences(def_idx).defendant_addr_2;
                                        lst_soladdr_3(sol_addr_index)    := lst_defences(def_idx).defendant_addr_3;
                                        lst_soladdr_4(sol_addr_index)    := lst_defences(def_idx).defendant_addr_4;
                                        lst_sol_postcode(sol_addr_index) := lst_defences(def_idx).defendant_postcode; 
                                    ELSE
                                        -- new solicitor so add new address
                                        -- get a new address id
                                        address_index := address_index + 1;
                                        SELECT addr_sequence.NEXTVAL INTO lst_addresses(address_index).address_id FROM DUAL;    
                                        lst_addresses(address_index).address_line1      := lst_defences(def_idx).defendant_addr_1; 
                                        lst_addresses(address_index).address_line2      := lst_defences(def_idx).defendant_addr_2; 
                                        lst_addresses(address_index).address_line3      := lst_defences(def_idx).defendant_addr_3; 
                                        lst_addresses(address_index).address_line4      := lst_defences(def_idx).defendant_addr_4; 
                                        lst_addresses(address_index).address_line5      := NULL; 
                                        lst_addresses(address_index).postcode           := lst_defences(def_idx).defendant_postcode; 
                                        lst_addresses(address_index).valid_from         := TRUNC(SYSDATE); 
                                        lst_addresses(address_index).valid_to           := NULL; 
                                        lst_addresses(address_index).party_id           := vn_sol_party_id; 
                                        lst_addresses(address_index).reference          := NULL; 
                                        lst_addresses(address_index).case_number        := lst_defences(def_idx).case_number; 
                                        lst_addresses(address_index).party_role_code    := 'SOLICITOR'; 
                                        lst_addresses(address_index).address_type_code  := 'SOLICITOR'; 
                                        lst_addresses(address_index).co_number          := NULL; 
                                        lst_addresses(address_index).addr_type_seq      := NULL; 
                                        lst_addresses(address_index).ald_seq            := NULL; 
                                        lst_addresses(address_index).court_code         := NULL; 
                                        lst_addresses(address_index).updated_by         := batch_user; 
                                        lst_addresses(address_index).case_party_no      := vn_solicitor_id;
                                        
                                    END IF;
                                    
                                    -- check for a new solicitor phone number
                                    IF lst_defences(def_idx).telephone_number IS NOT NULL THEN
                                        -- store the number in collecton for updating party record
                                        telephone_index                     := telephone_index + 1;
                                        lst_tel_nos(telephone_index)        := lst_defences(def_idx).telephone_number;
                                        lst_tel_parties(telephone_index)    := vn_sol_party_id;
                                    END IF;

                                    -- check for a new solicitor email
                                    IF lst_defences(def_idx).email IS NOT NULL THEN
                                        -- store the email in collecton for updating party record
                                        email_index                         := email_index + 1;
                                        lst_emails(email_index)             := lst_defences(def_idx).email;
                                        lst_email_parties(email_index)     := vn_sol_party_id;                        
                                    END IF;

                                ELSE
                                    address_index := address_index + 1;
                                    vn_addr_id := get_current_address(vn_party_id);
                                    IF vn_addr_id != 0 THEN
                                        -- store existing address id in a collection
                                        -- for updates to mark as an old address
                                        lst_addr_ids(address_index) := vn_addr_id;                            
                                    END IF;

                                    -- store the new address in a collection
                                    -- Do not store the address for the same defendant more than once.

                                    -- get a new address id
                                    SELECT addr_sequence.NEXTVAL INTO lst_addresses(address_index).address_id FROM DUAL;
                                                                
                                    lst_addresses(address_index).address_line1      := lst_defences(def_idx).defendant_addr_1; 
                                    lst_addresses(address_index).address_line2      := lst_defences(def_idx).defendant_addr_2; 
                                    lst_addresses(address_index).address_line3      := lst_defences(def_idx).defendant_addr_3; 
                                    lst_addresses(address_index).address_line4      := lst_defences(def_idx).defendant_addr_4; 
                                    lst_addresses(address_index).address_line5      := NULL; 
                                    lst_addresses(address_index).postcode           := lst_defences(def_idx).defendant_postcode; 
                                    lst_addresses(address_index).valid_from         := TRUNC(SYSDATE); 
                                    lst_addresses(address_index).valid_to           := NULL; 
                                    lst_addresses(address_index).party_id           := vn_party_id; 
                                    lst_addresses(address_index).reference          := NULL; 
                                    lst_addresses(address_index).case_number        := lst_defences(def_idx).case_number; 
                                    lst_addresses(address_index).party_role_code    := 'DEFENDANT'; 
                                    lst_addresses(address_index).address_type_code  := 'SERVICE'; 
                                    lst_addresses(address_index).co_number          := NULL; 
                                    lst_addresses(address_index).addr_type_seq      := NULL; 
                                    lst_addresses(address_index).ald_seq            := NULL; 
                                    lst_addresses(address_index).court_code         := NULL; 
                                    lst_addresses(address_index).updated_by         := batch_user; 
                                    lst_addresses(address_index).case_party_no      := lst_defences(def_idx).defendant_id;
                                END IF; -- end of is solicitor address
                            END IF; -- end of check for new defendant
                        END IF;  -- end of check for address line 1 not null  

                        -- check for a new phone number
                        IF lst_defences(def_idx).telephone_number IS NOT NULL AND lst_defences(def_idx).solicitor_flag = 'N' THEN
                            -- store the number in collecton for updating party record
                            telephone_index                     := telephone_index + 1;
                            lst_tel_nos(telephone_index)        := lst_defences(def_idx).telephone_number;
                            lst_tel_parties(telephone_index)    := vn_party_id;
                        END IF;

                        -- check for a new email
                        IF lst_defences(def_idx).email IS NOT NULL AND lst_defences(def_idx).solicitor_flag = 'N' THEN
                            -- store the email in collecton for updating party record
                            email_index                         := email_index + 1;
                            lst_emails(email_index)             := lst_defences(def_idx).email;
                            lst_email_parties(email_index)     := vn_party_id;                        
                        END IF;

                        -- check for a new date of birth
                        IF lst_defences(def_idx).defendant_dob IS NOT NULL THEN
                            -- store the dob in collection for updating party record
                            dob_index                       := dob_index + 1;
                            lst_dobs(dob_index)             := lst_defences(def_idx).defendant_dob;
                            lst_dob_parties(dob_index)      := vn_party_id;
                        END IF;
                    
                        -- store the defendant_id to compare with the next one.
                        last_defendant := vn_party_id;
                        
                    END IF; -- end of defendant found                   

                    IF l_debug = 'Y' THEN
                        DBMS_OUTPUT.PUT_LINE('** Pulled defence ** case = '||lst_defences(def_idx).case_number||
                                             ' Type = '||lst_defences(def_idx).type||
                                             ' seq no = '||lst_defences(def_idx).cust_file_sequence||
                                             ' Validated = '||lst_defences(def_idx).validated||
                                             ' via = '||lst_defences(def_idx).via_sdt);
                        DBMS_OUTPUT.PUT_LINE('defendant id = '||lst_defences(def_idx).defendant_id);
                        DBMS_OUTPUT.PUT_LINE('fees = '||lst_defences(def_idx).fee);
                        DBMS_OUTPUT.PUT_LINE('reject = '||lst_defences(def_idx).reject_code||'|');
                        DBMS_OUTPUT.PUT_LINE('DOB = '||lst_defences(def_idx).defendant_dob);
                    END IF; -- end debug                
                    EXCEPTION
                        WHEN NO_DATA_FOUND THEN
                            -- defendant not found
                            DBMS_OUTPUT.PUT_LINE('No defendant details for defendant '||lst_defences(def_idx).defendant_id||' found for case '||
                                        lst_defences(def_idx).case_number||
                                        ' - address cannot be updated.');
                    END;
            END LOOP; -- end of processing for current batch of defences

            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('about to insert into local defence doc events ');
            END IF;            
            -- copy the defences we just got from mcol into the local caseman staging table
            FORALL i IN INDICES OF lst_defences
            INSERT INTO defence_doc_event VALUES lst_defences(i);           
                DBMS_OUTPUT.PUT_LINE('after insert into local defence doc events ');            
            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('inserted in defence doc events '||SQL%ROWCOUNT);
                SELECT  sum(DECODE(VALIDATED, 'Y',1,0)),  sum(DECODE(VALIDATED, 'N',1,0))
                INTO    valid_defences, invalid_defences
                FROM defence_doc_event;
                DBMS_OUTPUT.PUT_LINE('** BEFORE UPDATE ** valid = '||valid_defences||' invalid defences = '||invalid_defences);
            END IF;

            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('updated flags in defence doc events '||SQL%ROWCOUNT);
                SELECT  sum(DECODE(VALIDATED, 'Y',1,0)),  sum(DECODE(VALIDATED, 'N',1,0))
                INTO    valid_defences, invalid_defences
                FROM defence_doc_event;
                DBMS_OUTPUT.PUT_LINE('** after update UPDATE ** valid = '||valid_defences||' invalid defences = '||invalid_defences);
            END IF;
            
            -- update the old addresses to make them out of date
            FORALL i IN INDICES OF lst_addr_ids
            UPDATE  given_addresses ga
            SET     valid_to        = TRUNC(SYSDATE)
            WHERE   address_id      = lst_addr_ids(i);
            
            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('updated in given_addresses '||SQL%ROWCOUNT);
            END IF;
            
            -- add the new addresses to caseman
            FORALL i IN INDICES OF lst_addresses
            INSERT INTO given_addresses VALUES lst_addresses(i);
            
            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('inserted in given_addresses '||SQL%ROWCOUNT);
            END IF;
            
            -- update the parties table with any new telephone numbers
            FORALL i IN INDICES OF lst_tel_nos
            UPDATE  parties p
            SET     tel_no          = lst_tel_nos(i)
            WHERE   p.party_id      = lst_tel_parties(i);
            
            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('updating tele_phone_nos ' ||SQL%ROWCOUNT);
            END IF;
            
            -- update the parties table with any new emails
            FORALL i IN INDICES OF lst_emails
            UPDATE  parties p
            SET     email_address   = lst_emails(i)
            WHERE   p.party_id      = lst_email_parties(i);

            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('updating emails ' ||SQL%ROWCOUNT);
            END IF;
            
            -- update the parties table with dates of birth
            FORALL i IN INDICES OF lst_dobs
            UPDATE  parties p
            SET     person_dob      = lst_dobs(i)
            WHERE   p.party_id      = lst_dob_parties(i);
            
            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('updating DOB ' ||SQL%ROWCOUNT);
            END IF;
            
            -- update the solicitor addresses
            FORALL i IN INDICES OF lst_soladdr_ids
            UPDATE  given_addresses ga
            SET
                ga.address_line1    = lst_soladdr_1(i),
                ga.address_line2    = lst_soladdr_2(i),
                ga.address_line3    = lst_soladdr_3(i),
                ga.address_line4    = lst_soladdr_4(i),
                ga.address_line5    = NULL,
                ga.postcode         = lst_sol_postcode(i),            
                ga.valid_from       = TRUNC(SYSDATE),
                ga.updated_by       = batch_user
            WHERE address_id        = lst_soladdr_ids(i);
            
            IF l_debug = 'Y' THEN
                DBMS_OUTPUT.PUT_LINE('updating Sol Address ' ||SQL%ROWCOUNT);
            END IF;

            -- clear the collections for the next loop iteration
            lst_defences        := empty_defences;
            lst_addresses       := empty_addresses;
            lst_addr_ids        := empty_addr_ids;
            lst_dobs            := empty_dobs;
            lst_emails          := empty_emails;
            lst_tel_nos         := empty_tel_nos;
            lst_dob_parties     := empty_dob_parties;
            lst_email_parties   := empty_email_parties;
            lst_tel_parties     := empty_tel_parties;
            lst_soladdr_ids     := empty_soladdr_ids;
            lst_soladdr_1       := empty_soladdr_1;
            lst_soladdr_2       := empty_soladdr_2;
            lst_soladdr_3       := empty_soladdr_3;
            lst_soladdr_4       := empty_soladdr_4;
            lst_sol_postcode    := empty_sol_postcode; 
            
            -- reset indexes to 0
            address_index   := 0;
            sol_addr_index    := 0;
            dob_index       := 0;
            email_index     := 0;
            telephone_index := 0;
        END LOOP;
        DBMS_OUTPUT.PUT_LINE('Pulled '||defence_count||' defences');
        
        
        -- update the validated and via_sdt flags
        -- this is done to avoid an issue where the insert puts the wrong values in the 
        -- via_sdt and validated colunms, switching the values between the two columns
        -- Not sure why or when this oracle feature occurs , so added defensive manual
        -- update of flags as a workaround for intermintant Oracle bug.
        UPDATE defence_doc_event dde
            SET validated = 'N',
                via_sdt     = 'Y'
        WHERE   dde.cust_file_sequence = rec_seq;
        
        IF l_debug = 'Y' THEN
            DBMS_OUTPUT.PUT_LINE('after flag update ');
            
        END IF;
        RETURN TRUE;  -- defences loaded successfully
        
    END; -- end of process defences

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : process_set_asides                                                                        *
* DESCRIPTION   : transfers set aside requests from MCOL to CCBC staging tables where the rec_seq           *
*               : matches the cust_file_sequence                                                            *
*               :                                                                                           *
\***********************************************************************************************************/
FUNCTION process_set_asides ( batch_user IN VARCHAR2, rec_seq  IN VARCHAR2, l_debug IN VARCHAR2 ) RETURN BOOLEAN IS

    CURSOR  cur_set_asides IS
    SELECT  sar.case_number, 
            sar.party_role_code, 
            sar.defendant_id, 
            sar.fee, 
            sar.pdf_file_name, 
            sar.cust_file_sequence,
            NULL reject_code,
            'N' validated,
            'Y' via_sdt,
			sar.mcol_reference
    FROM    set_aside_requests@ccbc_mcol_link sar -- live link
    WHERE   sar.cust_file_sequence = rec_seq
    ORDER BY sar.case_number, sar.defendant_id;
    
    -- declare table of records for bulk fetch of defences  
    TYPE set_asides_tab IS TABLE OF cur_set_asides%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_set_asides        set_asides_tab;
    empty_set_asides      set_asides_tab;

    set_asides_count       NUMBER  := 0;
    
    valid_set_asides      NUMBER  := 0;
    invalid_set_asides    NUMBER  := 0;
    
    last_defendant       case_party_roles.party_id%TYPE := -1;

    BEGIN
        OPEN cur_set_asides;
        LOOP
            -- this will process all set_asides in batchs of up to 5000 claims at time.
            -- This value may need to be adjusted depending on memory available and 
            -- performance on the live environment. 
            FETCH cur_set_asides BULK COLLECT INTO lst_set_asides LIMIT 5000;
            -- process current batch of set_asides
            EXIT WHEN lst_set_asides.COUNT = 0;
            IF lst_set_asides.COUNT > 0 THEN
               set_asides_count := set_asides_count + lst_set_asides.COUNT;
            END IF;            
            
            -- copy the set aside requests we just got from mcol into the local caseman staging table
            FORALL i IN INDICES OF lst_set_asides
                INSERT INTO set_aside_requests VALUES lst_set_asides(i);
                
            -- clear the collections for the next loop iteration
    
            lst_set_asides        := empty_set_asides;
        END LOOP;
        DBMS_OUTPUT.PUT_LINE('Pulled '||set_asides_count||' set aside requests');
        
        RETURN TRUE;  -- set asides loaded successfully
        
    END; -- end of process_set_asides
/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : process_judgments                                                                         *
* DESCRIPTION   : transfers judgments from MCOL to CCBC staging tables where the rec_seq                    *
*               : matches the cust_file_sequence                                                            *
*               :                                                                                           *
\***********************************************************************************************************/
FUNCTION process_judgments ( batch_user VARCHAR2,rec_seq  VARCHAR2 ) RETURN BOOLEAN IS

    CURSOR  cur_judgments IS
    SELECT  jg.cred_code, 
            jg.defendant_tel_no, 
            jg.case_number, 
            jg.defendant_fax_no, 
            jg.defendant_id, 
            jg.payee_dx_no, 
            jg.defendant_email, 
            jg.defendant_addr_1, 
            jg.payee_fax_no, 
            jg.defendant_pcm, 
            jg.defendant_addr_2, 
            jg.payee_email, 
            jg.defendant_addr_3, 
            jg.payee_pcm, 
            jg.defendant_addr_4, 
            jg.defendant_dob, 
            jg.defendant_dx_no, 
            jg.defendant_addr_5, 
            jg.defendant_postcode, 
            jg.registered_office, 
            jg.judgment_type, 
            jg.joint_judgment, 
            jg.judgment_amount, 
            jg.interest, 
            jg.total_costs, 
            jg.paid_before_judgment, 
            jg.total, 
            jg.instalment_amount, 
            jg.frequency, 
            jg.first_payment_date, 
            jg.reject_code, 
            jg.payee_name, 
            jg.payee_addr_1, 
            jg.payee_addr_2, 
            jg.payee_addr_3, 
            jg.payee_addr_4, 
            jg.payee_addr_5, 
            jg.payee_postcode, 
            jg.payee_tel_no, 
            jg.payee_reference, 
            jg.validated, 
            jg.claimant_addr_1, 
            jg.slip_codeline_1, 
            jg.slip_codeline_2, 
            jg.payee_bank_sort_code, 
            jg.payee_acc_holder, 
            jg.payee_bank_name, 
            jg.payee_bank_info_1, 
            jg.claimant_addr_2, 
            jg.payee_bank_info_2, 
            jg.payee_bank_acc_no, 
            jg.claimant_addr_3, 
            jg.payee_giro_acc_no, 
            jg.payee_giro_trans_code_1, 
            jg.claimant_addr_4, 
            jg.payee_giro_trans_code_2, 
            jg.payee_apacs_trans_code, 
            jg.claimant_addr_5, 
            jg.cust_file_sequence, 
            jg.judgment_amount_currency, 
            jg.interest_currency, 
            jg.claimant_postcode, 
            jg.total_costs_currency, 
            jg.paid_before_judgment_currency, 
            jg.solicitor_addr_1, 
            jg.total_currency, 
            jg.instalment_amount_currency, 
            jg.solicitor_addr_2, 
            jg.solicitor_addr_3, 
            jg.solicitor_addr_4, 
            jg.solicitor_addr_5, 
            jg.solicitor_postcode,
            'Y' via_sdt,
			jg.mcol_reference
    FROM    load_judgments@ccbc_mcol_link jg -- live_link
    WHERE   jg.cust_file_sequence = rec_seq
    ORDER BY jg.case_number;
    
    -- declare table of records for bulk fetch of warrants  
    TYPE judgments_tab IS TABLE OF cur_judgments%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_judgments        judgments_tab;
    empty_judgments      judgments_tab;
    
    -- Note. Use single item/column collections for the
    -- bulk updates to avoid the PLS-00436: 
    -- implementation restriction: cannot reference fields of
    -- BULK In-BIND table of records problem
    
    -- declare table of records for new address  
    TYPE addresses_tab IS TABLE OF given_addresses%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_addresses       addresses_tab;
    empty_addresses     addresses_tab;
    
    -- declare table address ids to update to out of date claimant
    -- addresses
    TYPE addr_id_tab IS TABLE OF given_addresses.address_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_addr_ids        addr_id_tab;
    empty_addr_ids      addr_id_tab;
    
    -- Note. Use single item/column collections for the
    -- bulk updates to avoid the PLS-00436: 
    -- implementation restriction: cannot reference fields of
    -- BULK In-BIND table of records problem
    
    -- set of column collections for updating solicitor addresses
    
    -- solicitor address id
    TYPE solicitor_addr_id_tab IS TABLE OF given_addresses.address_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_ids        solicitor_addr_id_tab;
    empty_soladdr_ids      solicitor_addr_id_tab;

    -- solicitor address line 1 collection
    TYPE solicitor_addr_1_tab IS TABLE OF given_addresses.address_line1 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_1        solicitor_addr_1_tab;
    empty_soladdr_1      solicitor_addr_1_tab;

    -- solicitor address line 2 collection
    TYPE solicitor_addr_2_tab IS TABLE OF given_addresses.address_line2 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_2        solicitor_addr_2_tab;
    empty_soladdr_2      solicitor_addr_2_tab;
    
    -- solicitor address line 3 collection
    TYPE solicitor_addr_3_tab IS TABLE OF given_addresses.address_line3 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_3        solicitor_addr_3_tab;
    empty_soladdr_3      solicitor_addr_3_tab;
    
    -- solicitor address line 4 collection
    TYPE solicitor_addr_4_tab IS TABLE OF given_addresses.address_line4 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_4        solicitor_addr_4_tab;
    empty_soladdr_4      solicitor_addr_4_tab;
    address_index       NUMBER := 0;
    
    -- solicitor address line 5 collection
    TYPE solicitor_addr_5_tab IS TABLE OF given_addresses.address_line5 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_5        solicitor_addr_5_tab;
    empty_soladdr_5      solicitor_addr_5_tab;
    
    -- solicitor address line 5 collection
    TYPE solicitor_postcode_tab IS TABLE OF given_addresses.postcode %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_sol_postcode        solicitor_postcode_tab;
    empty_sol_postcode      solicitor_postcode_tab;
    
    vn_addr_id          NUMBER := 0;
    vn_party_id         NUMBER := 0;
    vn_solicitor_id        NUMBER := 0;
    
    judgments_count NUMBER := 0;

    previous_case       load_judgments.case_number%TYPE := 'NOCASE';
    
    BEGIN
        OPEN cur_judgments;
        LOOP
            -- this will process all judgments in batchs of up to 5000 claims at time.
            -- This value may need to be adjusted depending on memory available and 
            -- performance on the live environment. 
            FETCH cur_judgments BULK COLLECT INTO lst_judgments LIMIT 5000;
            EXIT WHEN lst_judgments.COUNT = 0;
            IF lst_judgments.COUNT > 0 THEN
               judgments_count := judgments_count + lst_judgments.COUNT;
            END IF;

            -- process current batch of judgments
            FOR jdg_idx IN 1..lst_judgments.COUNT
                LOOP
                -- reset variables 
                vn_addr_id  := 0;
                vn_party_id := 0;
                IF previous_case != lst_judgments(jdg_idx).case_number THEN
                    -- we have a new case, so check to see if we need to
                    -- store claimant and solicitor addresses information
                    -- do not store address information if the case_number is
                    -- the same, so we only store the address data from the 1st judgment
                    -- on associated with a case.

                    -- if there is address data for the claimant, record this in caseman.
                    IF lst_judgments(jdg_idx).claimant_addr_1 IS NOT NULL THEN
                        -- check the claimant exists
                        vn_party_id := check_for_claimant(lst_judgments(jdg_idx).case_number);
                        IF vn_party_id != 0 THEN
                            -- claimant found so check for current address
                            address_index := address_index + 1;
                            vn_addr_id := get_current_address(vn_party_id);
                            IF vn_addr_id != 0 THEN
                                -- store existing address id in a collection
                                -- for marking address out of date
                                DBMS_OUTPUT.PUT_LINE('marking old judgement claimant address out of date');
                                lst_addr_ids(address_index) := vn_addr_id;
                            END IF;
                            -- stash the new address in collection for inserting
                            -- get a new address id
                            
                            DBMS_OUTPUT.PUT_LINE('adding new judgement claimant address');
                            
                            SELECT addr_sequence.NEXTVAL INTO lst_addresses(address_index).address_id FROM DUAL;
                            -- then store the new address in a collection to be inserted
                            lst_addresses(address_index).address_line1      := lst_judgments(jdg_idx).claimant_addr_1; 
                            lst_addresses(address_index).address_line2      := lst_judgments(jdg_idx).claimant_addr_2; 
                            lst_addresses(address_index).address_line3      := lst_judgments(jdg_idx).claimant_addr_3; 
                            lst_addresses(address_index).address_line4      := lst_judgments(jdg_idx).claimant_addr_4; 
                            lst_addresses(address_index).address_line5      := lst_judgments(jdg_idx).claimant_addr_5; 
                            lst_addresses(address_index).postcode           := lst_judgments(jdg_idx).claimant_postcode; 
                            lst_addresses(address_index).valid_from         := TRUNC(SYSDATE); 
                            lst_addresses(address_index).valid_to           := NULL; 
                            lst_addresses(address_index).party_id           := vn_party_id; 
                            lst_addresses(address_index).reference          := NULL; 
                            lst_addresses(address_index).case_number        := lst_judgments(jdg_idx).case_number; 
                            lst_addresses(address_index).party_role_code    := 'DEFENDANT'; 
                            lst_addresses(address_index).address_type_code  := 'SERVICE'; 
                            lst_addresses(address_index).co_number          := NULL; 
                            lst_addresses(address_index).addr_type_seq      := NULL; 
                            lst_addresses(address_index).ald_seq            := NULL; 
                            lst_addresses(address_index).court_code         := NULL; 
                            lst_addresses(address_index).updated_by         := batch_user; 
                            lst_addresses(address_index).case_party_no      := 1;

                        END IF; -- claimant check
                    END IF; -- end of check for claimant address line 1 not null

                            

                    -- check for solicitors address, if case is valid
                    -- invalid cases are reject by validation when moving data from load_judgments to
                    -- caseman application tables.
                    IF lst_judgments(jdg_idx).solicitor_addr_1 IS NOT NULL AND f_valid_case(lst_judgments(jdg_idx).case_number) THEN
                       -- reset variables 
                       vn_addr_id  := 0;
                       vn_party_id := 0;
                        -- need to record the solicitors address
                        -- increment index to avoid overwriting claimant address.
                        address_index := address_index + 1;

                        -- get the solicitors party id
                        check_for_solicitor(lst_judgments(jdg_idx).case_number, vn_party_id, vn_solicitor_id);

                        -- solicitor has been found, so find existing address if there it exists.
                        vn_addr_id := get_current_address(vn_party_id);
                        IF vn_addr_id != 0 THEN
                            -- store existing address id in a collection
                            -- for marking address out of date
                            -- update the old address
                            DBMS_OUTPUT.PUT_LINE('preparing to update existing judgement solicitor address '||vn_addr_id||' for case '||lst_judgments(jdg_idx).case_number);
                            lst_soladdr_ids(address_index)  := vn_addr_id;
                            lst_soladdr_1(address_index)    := lst_judgments(jdg_idx).solicitor_addr_1;
                            lst_soladdr_2(address_index)    := lst_judgments(jdg_idx).solicitor_addr_2;
                            lst_soladdr_3(address_index)    := lst_judgments(jdg_idx).solicitor_addr_3;
                            lst_soladdr_4(address_index)    := lst_judgments(jdg_idx).solicitor_addr_4;
                            lst_soladdr_5(address_index)    := lst_judgments(jdg_idx).solicitor_addr_5;
                            lst_sol_postcode(address_index) := lst_judgments(jdg_idx).solicitor_postcode; 
                        ELSE
                            
                            -- get a new address id
                            SELECT addr_sequence.NEXTVAL INTO lst_addresses(address_index).address_id FROM DUAL;
                            -- add the new address to the solicitor
                            DBMS_OUTPUT.PUT_LINE('Preparing to insert new judgement solicitor address '||lst_addresses(address_index).address_id
                                                 ||' for case '||lst_judgments(jdg_idx).case_number);
                            lst_addresses(address_index).address_line1      := lst_judgments(jdg_idx).solicitor_addr_1; 
                            lst_addresses(address_index).address_line2      := lst_judgments(jdg_idx).solicitor_addr_2; 
                            lst_addresses(address_index).address_line3      := lst_judgments(jdg_idx).solicitor_addr_3; 
                            lst_addresses(address_index).address_line4      := lst_judgments(jdg_idx).solicitor_addr_4; 
                            lst_addresses(address_index).address_line5      := lst_judgments(jdg_idx).solicitor_addr_5; 
                            lst_addresses(address_index).postcode           := lst_judgments(jdg_idx).solicitor_postcode; 
                            lst_addresses(address_index).valid_from         := TRUNC(SYSDATE); 
                            lst_addresses(address_index).valid_to           := NULL; 
                            lst_addresses(address_index).party_id           := vn_party_id; 
                            lst_addresses(address_index).reference          := NULL; 
                            lst_addresses(address_index).case_number        := lst_judgments(jdg_idx).case_number; 
                            lst_addresses(address_index).party_role_code    := 'SOLICITOR'; 
                            lst_addresses(address_index).address_type_code  := 'SOLICITOR'; 
                            lst_addresses(address_index).co_number          := NULL; 
                            lst_addresses(address_index).addr_type_seq      := NULL; 
                            lst_addresses(address_index).ald_seq            := NULL; 
                            lst_addresses(address_index).court_code         := NULL; 
                            lst_addresses(address_index).updated_by         := batch_user; 
                            lst_addresses(address_index).case_party_no      := vn_solicitor_id;
                        END IF;
                    END IF; -- end of solicitors address check
                END IF; -- end of case comparison check
                
                -- store case number for use in case comparision
                previous_case := lst_judgments(jdg_idx).case_number;
                
            END LOOP; -- end of processing for current batch of judgments
            
            -- copy the judgments we just got from mcol into the local caseman staging table.   
            
            FORALL i IN INDICES OF lst_judgments
            INSERT INTO load_judgments VALUES lst_judgments(i);
                        
            -- update the old claimant addresses to make them out of date
            DBMS_OUTPUT.PUT_LINE('claimant addresses marked as out of date count = '||lst_addr_ids.COUNT);            
            FORALL i IN INDICES OF lst_addr_ids
            UPDATE  given_addresses ga
            SET     valid_to        = TRUNC(SYSDATE)
            WHERE   address_id      = lst_addr_ids(i);
            
            -- update the old solicitor addresses
            DBMS_OUTPUT.PUT_LINE('updated solicitor address count = '||lst_soladdr_ids.COUNT);            
            FORALL i IN INDICES OF lst_soladdr_ids
            UPDATE  given_addresses ga
            SET
                ga.address_line1    = lst_soladdr_1(i),
                ga.address_line2    = lst_soladdr_2(i),
                ga.address_line3    = lst_soladdr_3(i),
                ga.address_line4    = lst_soladdr_4(i),
                ga.address_line5    = lst_soladdr_5(i),
                ga.postcode         = lst_sol_postcode(i),            
                ga.valid_from       = TRUNC(SYSDATE),
                ga.updated_by       = batch_user
            WHERE address_id        = lst_soladdr_ids(i);

            DBMS_OUTPUT.PUT_LINE('new address count = '||lst_addresses.COUNT);
            -- add the new addresses to caseman ( this inserts
            -- both claimant and solicitor new addresses )
            FORALL i IN INDICES OF lst_addresses
            INSERT INTO given_addresses VALUES lst_addresses(i);
            
            -- clear the collections for the next loop iteration
            lst_judgments       := empty_judgments;
            lst_addresses       := empty_addresses;
            lst_addr_ids        := empty_addr_ids;
            lst_soladdr_ids     := empty_soladdr_ids;
            lst_soladdr_1       := empty_soladdr_1;
            lst_soladdr_2       := empty_soladdr_2;
            lst_soladdr_3       := empty_soladdr_3;
            lst_soladdr_4       := empty_soladdr_4;
            lst_soladdr_5       := empty_soladdr_5;
            lst_sol_postcode    := empty_sol_postcode;        
            
            -- reset indexes to 0
            address_index   := 0;
            
        END LOOP;
        DBMS_OUTPUT.PUT_LINE('Processed '||judgments_count||' judgments');
        RETURN TRUE;  -- judgments loaded successfully        
    END; -- end of process judgments

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : process_warrants                                                                          *
* DESCRIPTION   : transfers warrants from MCOL to CCBC staging tables where the rec_seq                     *
*               : matches the cust_file_sequence                                                            *
*               :                                                                                           *
\***********************************************************************************************************/
FUNCTION process_warrants ( batch_user VARCHAR2, rec_seq  VARCHAR2 ) RETURN BOOLEAN IS

    CURSOR  cur_warrants IS
    SELECT  lw.cred_code, 
            lw.defendant_tel_no, 
            lw.case_number, 
            lw.defendant_fax_no, 
            lw.warrant_number, 
            lw.defendant_email, 
            lw.claimant_details, 
            lw.reference, 
            lw.defendant_pcm, 
            lw.defendant_name, 
            lw.defendant_addr_1, 
            lw.defendant_addr_2, 
            lw.defendant_addr_3, 
            lw.defendant_addr_4, 
            lw.defendant_addr_5, 
            lw.defendant_postcode, 
            lw.defendant_dx_no, 
            lw.balance_of_debt, 
            lw.amount, 
            lw.fee, 
            lw.costs, 
            lw.enforcing_crt_code, 
            lw.cust_file_sequence, 
            lw.reject_code, 
            lw.validated, 
            lw.notes, 
            lw.balance_of_debt_currency, 
            lw.amount_currency, 
            lw.fee_currency, 
            lw.costs_currency, 
            lw.claimant_addr_1, 
            lw.claimant_addr_2, 
            lw.claimant_addr_3, 
            lw.claimant_addr_4, 
            lw.claimant_addr_5, 
            lw.claimant_postcode, 
            lw.solicitor_addr_1, 
            lw.solicitor_addr_2, 
            lw.solicitor_addr_3, 
            lw.solicitor_addr_4, 
            lw.solicitor_addr_5, 
            lw.solicitor_postcode,
            'Y' via_sdt
    FROM    load_warrants@ccbc_mcol_link lw -- live link
    WHERE   lw.cust_file_sequence = rec_seq
    ORDER BY lw.case_number;
    
    -- declare table of records for bulk fetch of warrants 
    TYPE warrants_tab IS TABLE OF cur_warrants%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_warrants        warrants_tab;
    empty_warrants      warrants_tab;
    
    -- Note. Use single item/column collections for the
    -- bulk updates to avoid the PLS-00436: 
    -- implementation restriction: cannot reference fields of
    -- BULK In-BIND table of records problem
    
    -- declare table of records for new address  
    TYPE addresses_tab IS TABLE OF given_addresses%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_addresses       addresses_tab;
    empty_addresses     addresses_tab;
    
    -- declare table address ids to update to out of date claimant
    -- addresses
    TYPE addr_id_tab IS TABLE OF given_addresses.address_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_addr_ids        addr_id_tab;
    empty_addr_ids      addr_id_tab;
    
    -- Note. Use single item/column collections for the
    -- bulk updates to avoid the PLS-00436: 
    -- implementation restriction: cannot reference fields of
    -- BULK In-BIND table of records problem
    
    -- set of column collections for updating solictor
    
    -- solicitor address id
    TYPE solicitor_addr_id_tab IS TABLE OF given_addresses.address_id%TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_ids        solicitor_addr_id_tab;
    empty_soladdr_ids      solicitor_addr_id_tab;

    -- solicitor address line 1 collection
    TYPE solicitor_addr_1_tab IS TABLE OF given_addresses.address_line1 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_1        solicitor_addr_1_tab;
    empty_soladdr_1      solicitor_addr_1_tab;

    -- solicitor address line 2 collection
    TYPE solicitor_addr_2_tab IS TABLE OF given_addresses.address_line2 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_2        solicitor_addr_2_tab;
    empty_soladdr_2      solicitor_addr_2_tab;
    
    -- solicitor address line 3 collection
    TYPE solicitor_addr_3_tab IS TABLE OF given_addresses.address_line3 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_3        solicitor_addr_3_tab;
    empty_soladdr_3      solicitor_addr_3_tab;
    
    -- solicitor address line 4 collection
    TYPE solicitor_addr_4_tab IS TABLE OF given_addresses.address_line4 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_4        solicitor_addr_4_tab;
    empty_soladdr_4      solicitor_addr_4_tab;
    address_index       NUMBER := 0;
    
    -- solicitor address line 5 collection
    TYPE solicitor_addr_5_tab IS TABLE OF given_addresses.address_line5 %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_soladdr_5        solicitor_addr_5_tab;
    empty_soladdr_5      solicitor_addr_5_tab;
    
    -- solicitor address line 5 collection
    TYPE solicitor_postcode_tab IS TABLE OF given_addresses.postcode %TYPE
    INDEX BY PLS_INTEGER;
    
    lst_sol_postcode        solicitor_postcode_tab;
    empty_sol_postcode      solicitor_postcode_tab;
    
    vn_addr_id          NUMBER := 0;
    vn_party_id         NUMBER := 0;
    vn_solicitor_id        NUMBER := 0;

    warrants_count      NUMBER := 0;
    
    previous_case       load_warrants.case_number%TYPE := 'NOCASE';
    
    BEGIN
        OPEN cur_warrants;
        LOOP
            -- reset variables 
            vn_addr_id  := 0;
            vn_party_id := 0;        
            -- this will process all warrants in batchs of up to 5000 claims at time.
            -- This value may need to be adjusted depending on memory available and 
            -- performance on the live environment. 
            FETCH cur_warrants BULK COLLECT INTO lst_warrants LIMIT 5000;
            EXIT WHEN lst_warrants.COUNT = 0;
            IF lst_warrants.COUNT > 0 THEN
               warrants_count := warrants_count + lst_warrants.COUNT;
            END IF;            
            -- process current batch of warrants
            FOR war_idx IN 1..lst_warrants.COUNT
                LOOP
                IF previous_case != lst_warrants(war_idx).case_number THEN
                    -- we have a new case, so check to see if we need to
                    -- store claimant and solicitor addresses information
                    -- do not store address information if the case_number is
                    -- the same, so we only store the address data from the 1st warrant
                    -- on associated with a case.
                    
                    -- if there is address data for the claimant, record this in caseman.
                    IF lst_warrants(war_idx).claimant_addr_1 IS NOT NULL THEN
                        -- check the claimant exists
                        vn_party_id := check_for_claimant(lst_warrants(war_idx).case_number);
                        IF vn_party_id != 0 THEN
                            address_index := address_index + 1;
                        
                            -- claimant found so check for current address
                            vn_addr_id := get_current_address(vn_party_id);
                            IF vn_addr_id != 0 THEN
                                -- store existing address id in a collection
                                -- for marking address out of date
                                lst_addr_ids(address_index) := vn_addr_id;
                            END IF;
                            -- stash the new address in collection for inserting
                            
                            -- get a new address id
                            SELECT addr_sequence.NEXTVAL INTO lst_addresses(address_index).address_id FROM DUAL;
                            
                            -- store the new address in a collection to be inserted
                            lst_addresses(address_index).address_line1      := lst_warrants(war_idx).claimant_addr_1; 
                            lst_addresses(address_index).address_line2      := lst_warrants(war_idx).claimant_addr_2; 
                            lst_addresses(address_index).address_line3      := lst_warrants(war_idx).claimant_addr_3; 
                            lst_addresses(address_index).address_line4      := lst_warrants(war_idx).claimant_addr_4; 
                            lst_addresses(address_index).address_line5      := lst_warrants(war_idx).claimant_addr_5; 
                            lst_addresses(address_index).postcode           := lst_warrants(war_idx).claimant_postcode; 
                            lst_addresses(address_index).valid_from         := TRUNC(SYSDATE); 
                            lst_addresses(address_index).valid_to           := NULL; 
                            lst_addresses(address_index).party_id           := vn_party_id; 
                            lst_addresses(address_index).reference          := NULL; 
                            lst_addresses(address_index).case_number        := lst_warrants(war_idx).case_number; 
                            lst_addresses(address_index).party_role_code    := 'DEFENDANT'; 
                            lst_addresses(address_index).address_type_code  := 'SERVICE'; 
                            lst_addresses(address_index).co_number          := NULL; 
                            lst_addresses(address_index).addr_type_seq      := NULL; 
                            lst_addresses(address_index).ald_seq            := NULL; 
                            lst_addresses(address_index).court_code         := NULL; 
                            lst_addresses(address_index).updated_by         := batch_user; 
                            lst_addresses(address_index).case_party_no      := 1;

                        END IF; -- claimant check
                    END IF; -- end of check for claimant address line 1 not null

                    -- check for solictors address, if case is valid
                    -- invalid cases are reject by validation when moving data from load_judgments to
                    -- caseman application tables.
                    IF lst_warrants(war_idx).solicitor_addr_1 IS NOT NULL AND f_valid_case(lst_warrants(war_idx).case_number) THEN
                        -- reset variables 
                        vn_addr_id  := 0;
                        vn_party_id := 0;
                        -- need to record the solicitors address
                        -- increment to avoid overwriting claimant address.
                        address_index := address_index + 1;
                        -- get the solicitors party id
                        check_for_solicitor(lst_warrants(war_idx).case_number, vn_party_id, vn_solicitor_id);

                        -- solicitor has been found, so find existing address if there it exists.
                        vn_addr_id := get_current_address(vn_party_id);
                        IF vn_addr_id != 0 THEN
                            -- update the old address
                            -- with the new address information
                            lst_soladdr_ids(address_index)  := vn_addr_id;
                            lst_soladdr_1(address_index)    := lst_warrants(war_idx).solicitor_addr_1;
                            lst_soladdr_2(address_index)    := lst_warrants(war_idx).solicitor_addr_2;
                            lst_soladdr_3(address_index)    := lst_warrants(war_idx).solicitor_addr_3;
                            lst_soladdr_4(address_index)    := lst_warrants(war_idx).solicitor_addr_4;
                            lst_soladdr_5(address_index)    := lst_warrants(war_idx).solicitor_addr_5;
                            lst_sol_postcode(address_index) := lst_warrants(war_idx).solicitor_postcode;  
                        ELSE
                            -- insert a new address

                            -- increment to avoid overwriting claimant address.
                            address_index := address_index + 1;
                            -- get a new address id
                            SELECT addr_sequence.NEXTVAL INTO lst_addresses(address_index).address_id FROM DUAL;

                            -- add the new address to the solicitor
                            lst_addresses(address_index).address_line1      := lst_warrants(war_idx).solicitor_addr_1; 
                            lst_addresses(address_index).address_line2      := lst_warrants(war_idx).solicitor_addr_2; 
                            lst_addresses(address_index).address_line3      := lst_warrants(war_idx).solicitor_addr_3; 
                            lst_addresses(address_index).address_line4      := lst_warrants(war_idx).solicitor_addr_4; 
                            lst_addresses(address_index).address_line5      := lst_warrants(war_idx).solicitor_addr_5; 
                            lst_addresses(address_index).postcode           := lst_warrants(war_idx).solicitor_postcode; 
                            lst_addresses(address_index).valid_from         := NULL; 
                            lst_addresses(address_index).valid_to           := NULL; 
                            lst_addresses(address_index).party_id           := vn_party_id; 
                            lst_addresses(address_index).reference          := NULL; 
                            lst_addresses(address_index).case_number        := lst_warrants(war_idx).case_number; 
                            lst_addresses(address_index).party_role_code    := 'SOLICITOR'; 
                            lst_addresses(address_index).address_type_code  := 'SOLICITOR'; 
                            lst_addresses(address_index).co_number          := NULL; 
                            lst_addresses(address_index).addr_type_seq      := NULL; 
                            lst_addresses(address_index).ald_seq            := NULL; 
                            lst_addresses(address_index).court_code         := NULL; 
                            lst_addresses(address_index).updated_by         := batch_user; 
                            lst_addresses(address_index).case_party_no      := vn_solicitor_id;

                        END IF;
                    END IF; -- end of solicitors address check
                END IF; -- end of comparision previous case comparision
                
                -- record case number for comparision with next case
                previous_case := lst_warrants(war_idx).case_number;
                
            END LOOP; -- end of processing for current batch of warrants
            
            -- copy the warrants we just got from mcol into the local caseman staging table.   
            
            FORALL i IN INDICES OF lst_warrants
            INSERT INTO load_warrants VALUES lst_warrants(i);
            
            -- add the new addresses to caseman ( this inserts
            -- both claimant and solicitor new addresses )
            FORALL i IN INDICES OF lst_addresses
            INSERT INTO given_addresses VALUES lst_addresses(i);
            
            -- update the old claimant addresses to make them out of date
            FORALL i IN INDICES OF lst_addr_ids
            UPDATE  given_addresses ga
            SET     valid_to        = TRUNC(SYSDATE)
            WHERE   address_id      = lst_addr_ids(i);
            
            -- update the old solicitor addresses
            -- with new address data
            FORALL i IN INDICES OF lst_soladdr_ids
            UPDATE  given_addresses ga
            SET
                ga.address_line1    = lst_soladdr_1(i),
                ga.address_line2    = lst_soladdr_2(i),
                ga.address_line3    = lst_soladdr_3(i),
                ga.address_line4    = lst_soladdr_4(i),
                ga.address_line5    = lst_soladdr_5(i),
                ga.postcode         = lst_sol_postcode(i),            
                ga.valid_from       = TRUNC(SYSDATE),
                ga.updated_by       = batch_user
            WHERE   address_id      = lst_soladdr_ids(i);
            
            -- clear the collections for the next loop iteration
            lst_warrants      := empty_warrants;
            lst_addresses       := empty_addresses;
            lst_addr_ids        := empty_addr_ids;
            lst_soladdr_ids     := empty_soladdr_ids;
            lst_soladdr_1       := empty_soladdr_1;
            lst_soladdr_2       := empty_soladdr_2;
            lst_soladdr_3       := empty_soladdr_3;
            lst_soladdr_4       := empty_soladdr_4;
            lst_soladdr_5       := empty_soladdr_5;
            lst_sol_postcode    := empty_sol_postcode;        
            
            -- reset indexes to 0
            address_index   := 0;
            
        END LOOP;
        DBMS_OUTPUT.PUT_LINE('Processed '||warrants_count||' warrants');
        RETURN TRUE;  -- warrants loaded successfully
        
    END; -- end of process warrants

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : process_pwo                                                                               *
* DESCRIPTION   : transfers pwo from MCOL to CCBC staging tables where the rec_seq                          *
*               : matches the cust_file_sequence                                                            *
*               :                                                                                           *
\***********************************************************************************************************/
FUNCTION process_pwo ( batch_user VARCHAR2, rec_seq  VARCHAR2 ) RETURN BOOLEAN IS

    CURSOR  cur_pwo IS
    SELECT  cred_code, 
            pwo.case_number, 
            pwo.type, 
            pwo.defendant_id, 
            pwo.date_paid, 
            pwo.reject_code, 
            pwo.validated, 
            pwo.cust_file_sequence,
            'Y' via_sdt
    FROM    load_paid_wo_details@ccbc_mcol_link pwo -- live link
    WHERE   pwo.cust_file_sequence = rec_seq;
    
    -- declare table of records for bulk fetch of pwo's  
    TYPE pwo_tab IS TABLE OF cur_pwo%ROWTYPE
    INDEX BY PLS_INTEGER;
    
    lst_pwo     pwo_tab;
    empty_pwo   pwo_tab;
    
    pwo_count   NUMBER := 0;
    BEGIN
        OPEN cur_pwo;
        LOOP
            -- this will process all pwo in batchs of up to 5000 claims at time.
            -- This value may need to be adjusted depending on memory available and 
            -- performance on the live environment. 
            FETCH cur_pwo BULK COLLECT INTO lst_pwo LIMIT 5000;
            EXIT WHEN lst_pwo.COUNT = 0;
            IF lst_pwo.COUNT > 0 THEN
               pwo_count := pwo_count + lst_pwo.COUNT;
            END IF;            
            -- copy the warrants we just got from mcol into the local caseman staging table.   
            
            FORALL i IN INDICES OF lst_pwo
            INSERT INTO load_paid_wo_details VALUES lst_pwo(i);
            
            -- clear the collections for the next loop iteration
            lst_pwo      := empty_pwo;
            
            END LOOP;
        DBMS_OUTPUT.PUT_LINE('Processed '||pwo_count||' pwos');
        RETURN TRUE;  -- pwo loaded successfully
        
    END; -- end of process pwo

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : mcol_pull                                                                                 *
* DESCRIPTION   : Pulls data from one of four data tables in the MCOL ccbc staging tables                   *
*               : and copies the data to local staging tables in CCBC                                       *
*               :                                                                                           *
*               : These tables are                                                                          *
*               :                   TABLE_NAME              INDICATOR                                       *
*               :                   ==========              =========                                       *
*               :                   DEFENCE_DOC_EVENT       DD                                              *
*               :                   LOAD_JUDGMENTS          JG                                              *
*               :                   LOAD_PAID_WO_DETAILS    PD                                              *
*               :                   LOAD_WARRANTS           WT                                              *
*               :                                                                                           *
*               : This procedure searches the MCOL staging table TAPE_FILES looking for records with a      *
*               : of 'L' indicating there is data which needs to be copied to CCBC.                         *
*               :                                                                                           *
*               : The procedure identifies the data table to be processed by looking at the 5th and 6th     *
*               : of the filename in the TAPE_FILES record to find the indicator listed above.              *
*               :                                                                                           *
*               : For example a TAPE_FILE record with a status of 'L' and a file_name of 1999JG.123         *
*               : indicates that there is date waiting to be processed in the JG (LOAD_judgments table      *
*               :                                                                                           *
*               : Note: Since Oracle does not support pushing bulk collections over a database link         *
*               :       this procedure uses single row processing                                           * 
\***********************************************************************************************************/
PROCEDURE mcol_pull( p_username IN VARCHAR2, p_court_code IN VARCHAR2, p_debug IN VARCHAR2 ) IS
    
    -- cursor to find data which is ready to load
    CURSOR cur_waiting IS
        SELECT  orderseq,
                seqno,
                file_name,
                substr(file_name, 5, 2 ) table_indicator,
                substr(file_name, 8, 3 ) cust_seq,
                date_processed,
                outputs,
                no_records,
                fees,
                status,
                fees_currency
        FROM    tape_files@ccbc_mcol_link tf -- live link
        WHERE   tf.status = 'L';
            
    loaded                  BOOLEAN     := TRUE;
    defences_found          BOOLEAN     := FALSE;
    set_aside_req_found     BOOLEAN     := FALSE;
    load_failed             NUMBER      := 0;
        
    BEGIN
        DBMS_OUTPUT.PUT_LINE('Starting MCOL_PULL at '||TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));
        DBMS_OUTPUT.PUT_LINE('.');
        DBMS_OUTPUT.PUT_LINE('.');
        DBMS_OUTPUT.PUT_LINE('===================================================================');
        
        -- set application context
        SET_SUPS_APP_CTX(p_username, p_court_code,'MCOL_PULL' );
        -- loop round and identify all data which is waiting to be loaded
        FOR waiting_rec in cur_waiting
            LOOP
                CASE  waiting_rec.table_indicator
                WHEN 'DD' THEN
                    -- defence documents to load
                    BEGIN
                        DBMS_OUTPUT.PUT_LINE('processing defences for seq '||waiting_rec.cust_seq);
                        loaded := process_defences(p_username,waiting_rec.cust_seq, p_debug);
                        defences_found := TRUE;
                    END; 
                WHEN 'JG' THEN
                    -- judgments to load
                    BEGIN
                        DBMS_OUTPUT.PUT_LINE('processing judgments for seq '||waiting_rec.cust_seq);
                        loaded := process_judgments(p_username,waiting_rec.cust_seq);
                    END;
                WHEN 'PD' THEN 
                    -- paid and written off to load
                    BEGIN
                        DBMS_OUTPUT.PUT_LINE('processing paid and written off for seq '||waiting_rec.cust_seq);
                        loaded := process_pwo(p_username,waiting_rec.cust_seq);
                    END; 
                WHEN 'WT' THEN 
                    -- warrants  to load
                    BEGIN
                        DBMS_OUTPUT.PUT_LINE('processing warrants for seq '||waiting_rec.cust_seq);
                        loaded := process_warrants(p_username, waiting_rec.cust_seq);
                    END; 
                WHEN 'SA' THEN 
                    -- set aside requests to load
                    BEGIN
                        DBMS_OUTPUT.PUT_LINE('processing set aside requests for seq '||waiting_rec.cust_seq);
                        loaded := process_set_asides(p_username, waiting_rec.cust_seq, p_debug);
                        set_aside_req_found := TRUE;
                    END; 
                ELSE
                    -- unknown data table
                    -- log an error message
                    
                    DBMS_OUTPUT.PUT_LINE('unknown mcol event type');
                    LOADED := FALSE;
                END CASE;
                
                IF loaded = TRUE THEN
                    BEGIN
                        -- tell mcol we have got the data
                        UPDATE  tape_files@ccbc_mcol_link tf
                        SET     status          = 'T'
                        WHERE   tf.orderseq = waiting_rec.orderseq;
                        
                        COMMIT;
                    EXCEPTION
                        WHEN OTHERS THEN
                        DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
                        DBMS_OUTPUT.PUT_LINE('while pulling data to MCOL in procedure mcol_pull  for orderseq '||waiting_rec.orderseq);                            
                        DBMS_OUTPUT.PUT_LINE('Rolling Back changes');
                        ROLLBACK;
                        -- re-raise exception so autosys sees failure
                        RAISE;
                    END;
                END IF;
                
                DBMS_OUTPUT.PUT_LINE('.');
                DBMS_OUTPUT.PUT_LINE('===================================================================');                
                DBMS_OUTPUT.PUT_LINE('.');
            END LOOP; -- end of cur_waiting loop
            -- if defences were found, then validate them
            IF defences_found THEN
                validate_defences_pkg.bc_de_u1(p_username, p_court_code, p_debug, load_failed );
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('validate defences returned load failed count = '||load_failed);
                END IF;
            END IF;
            IF set_aside_req_found THEN
                validate_set_asides_pkg.bc_sa_u1(p_username, p_court_code, p_debug, load_failed );
                IF p_debug = 'Y' THEN
                    DBMS_OUTPUT.PUT_LINE('validate set asides returned load failed count = '||load_failed);
                END IF;
            END IF;
            
            COMMIT;

            IF load_failed != 0 THEN
                -- one or more files associated with an event could not be
                -- loaded into the database and was not printed.
                -- so raise a failure condition , so autosys detectes the failure.
                DBMS_OUTPUT.PUT_LINE('One or more MCOL PDF files could not be loaded');
                raise_application_error( -20001,'MCOL PDF File Load failure');
            END IF;            
            -- all other data is validated by existing validation run by an autosys job
            
            DBMS_OUTPUT.PUT_LINE('Finished MCOL_PULL at '||TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));

    END; -- end of mcol_pull procedure
END; -- end of ccbc_mcol_interface_pkg
/