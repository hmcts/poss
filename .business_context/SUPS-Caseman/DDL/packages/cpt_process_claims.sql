/*-------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : cpt_claims_pack
| SYNOPSIS      : This procedure fetches all unprocessed claims from the
|                 from the MCOL proxy CLAIMS_REQUEST_T table using a remote database
|                 link. This will include all claims created via the MCOL screens, 
|                 plus all the bulk claims submitted via the STD internet gateway
|
|                 It then carries out the following processing for all claim
|
|                  1.) checks the coded creditor is valid. Claims with
|                      invalid coded creditors are rejected.
|                  2.) Creates record in the MCOL_DATA table for each claim
|                    
|                 The following additional steps are carried out for claims
|                 from valid coded creditors
|                 1.) Determines how many defendants there for each valid claim
|                 2.) Generates a MCOL password for each defendant
|                 3.) updates the claim_request with the passwords
|                 4.) creates a record in the defendants table to each defendant
|                 5.) Creates record in the claims table for each valid claim
|                 6.) Creates record in the statistics table for each valid claim
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
| COMMENTS      : This procedure uses the following tables in the MCOL_PROXY
|                 via a remote database link
|                 
|                 MCOL_DATA
|                 CLAIM_REQUESTS
|                 TAPE_FILES
|
|                 It stores data in the following CPT ( claims print and transfers)
|                 schema
|
|                 CLAIMS
|                 DEFENDANTS
|                 STATISTICS
|
|                 It insert records INTO the LOAD_CASES table in the CASEMAN
|                 schema.
|
|                 This procedure assumes that the CASEMAN and CPT schemas will
|                 be installed on the CASEMAN database. No database link will
|                 be required to access these tables.
|
|                  Version 2 
|                  =========
|                  updated for review comments
|                    
|                  Tables moved into caseman schema and renamed with cpt_
|                  prefix.
|                  Added cpt_print_table for N1 Claims generation
|                  Added limit to bulk collection loop        
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

CREATE OR REPLACE PACKAGE cpt_claims_pack IS

/***********************************************************************************************************\
*                                                 P A C K A G E                                            *
\***********************************************************************************************************/

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : cpt_process_claims                                                                        *
* DESCRIPTION   : Moves claims from MCOL to CASEMAN and generates N1 claims pack and MCOL Issue reports     * 
\***********************************************************************************************************/
PROCEDURE cpt_process_claims;

/***********************************************************************************************************\
* TYPE          : FUNCTION                                                                                  *
* NAME          : generate_password                                                                         *
* DESCRIPTION   : Generates MCOL passwords                                                                  * 
*                 Note: reuse of CPC code from SP_MCOL_P1.sql (mcol_sups_cpc_package)                       *
\***********************************************************************************************************/
FUNCTION generate_password (in_string VARCHAR2) RETURN VARCHAR2;

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : format_court_seal                                                                         *
* DESCRIPTION   : formats court name into two centered lines for use on court seal for N1 claims pack       *
*                 Note: reuses code from the CPC SP_BO_U1 shellscript                                       *
\***********************************************************************************************************/
PROCEDURE format_court_seal ( 
                            court_name  IN  VARCHAR2,
                            seal_1      OUT VARCHAR2,
                            seal_2      OUT VARCHAR2
                            );

END cpt_claims_pack;
/


CREATE OR REPLACE PACKAGE BODY cpt_claims_pack IS



PROCEDURE format_court_seal ( 
                            court_name  IN  VARCHAR2,
                            seal_1      OUT VARCHAR2,
                            seal_2      OUT VARCHAR2
                            ) IS
                            
cv_crt_name        VARCHAR2(30);                            

-- cursor copied from SP_BO_U1 shell script

CURSOR c_crt_name IS
    SELECT decode(ltrim(translate
                        (cv_crt_name,'''ABCDEFGHIJKLMNOPQRSTUVWXYZ()&.,',' ')),
           null,
             lpad(substr(cv_crt_name,1,instr(rpad(cv_crt_name,30),' ',-15)),
               (15 - length(substr(cv_crt_name,1,instr
                                          (rpad(cv_crt_name,30),' ',-15)))) / 2
                   + length(substr(cv_crt_name,1,instr
                                             (rpad(cv_crt_name,30),' ',-15)))),
           lpad(substr(cv_crt_name,1,instr(rpad(cv_crt_name,30),'-',-15)),
             (15 - length(substr(cv_crt_name,1,instr
                                          (rpad(cv_crt_name,30),'-',-15)))) / 2
                 + length(substr(cv_crt_name,1,instr
                                            (rpad(cv_crt_name,30),'-',-15))))),
         decode(ltrim(translate
                        (cv_crt_name,'''ABCDEFGHIJKLMNOPQRSTUVWXYZ()&.,',' ')),
           null,
             lpad(substr(cv_crt_name,instr(rpad(cv_crt_name,30),' ',-15) + 1),
               (15 - length(substr(cv_crt_name,instr
                                      (rpad(cv_crt_name,30),' ',-15) + 1))) / 2
                   + length(substr(cv_crt_name,instr
                                         (rpad(cv_crt_name,30),' ',-15) + 1))),
             lpad(substr(cv_crt_name,instr(rpad(cv_crt_name,30),'-',-15) + 1),
               (15 - length(substr(cv_crt_name,instr
                                      (rpad(cv_crt_name,30),'-',-15) + 1))) / 2
                   + length(substr(cv_crt_name,instr
                                         (rpad(cv_crt_name,30),'-',-15) + 1))))
  FROM DUAL;
  
/* old version of code retained, as safety measure 
    SELECT decode(ltrim(translate
                        (cv_crt_name,'''ABCDEFGHIJKLMNOPQRSTUVWXYZ()&.,',' ')),
           null,
             lpad(substr(cv_crt_name,1,instr(rpad(cv_crt_name,28),' ',-14)),
               (14 - length(substr(cv_crt_name,1,instr
                                          (rpad(cv_crt_name,28),' ',-14)))) / 2
                   + length(substr(cv_crt_name,1,instr
                                             (rpad(cv_crt_name,28),' ',-14)))),
           lpad(substr(cv_crt_name,1,instr(rpad(cv_crt_name,28),'-',-14)),
             (14 - length(substr(cv_crt_name,1,instr
                                          (rpad(cv_crt_name,28),'-',-14)))) / 2
                 + length(substr(cv_crt_name,1,instr
                                            (rpad(cv_crt_name,28),'-',-14))))),
         decode(ltrim(translate
                        (cv_crt_name,'''ABCDEFGHIJKLMNOPQRSTUVWXYZ()&.,',' ')),
           null,
             lpad(substr(cv_crt_name,instr(rpad(cv_crt_name,28),' ',-14) + 1),
               (14 - length(substr(cv_crt_name,instr
                                      (rpad(cv_crt_name,28),' ',-14) + 1))) / 2
                   + length(substr(cv_crt_name,instr
                                         (rpad(cv_crt_name,28),' ',-14) + 1))),
             lpad(substr(cv_crt_name,instr(rpad(cv_crt_name,28),'-',-14) + 1),
               (14 - length(substr(cv_crt_name,instr
                                      (rpad(cv_crt_name,28),'-',-14) + 1))) / 2
                   + length(substr(cv_crt_name,instr
                                         (rpad(cv_crt_name,28),'-',-14) + 1))))
  FROM DUAL;
*/

BEGIN

    cv_crt_name := court_name;
    OPEN    c_crt_name;
    FETCH   c_crt_name INTO seal_1, seal_2;
    CLOSE   c_crt_name;

    -- if second seal is blank, only print the 1st seal line
    -- at the second seal line position.
    IF  seal_2 IS NULL THEN
        seal_2 := seal_1;
        seal_1 := NULL;
    END IF;

END format_court_seal;

FUNCTION generate_password (in_string VARCHAR2) RETURN VARCHAR2 IS

/* 8-character input string is used as a seed to generate a random 
 * 8 characters and returns it 
 */

    nv_1        NUMBER        := 0;
    cv_str      VARCHAR2(8);
    cv_upper    VARCHAR2(8);
    cv_result   VARCHAR2(8)   := NULL;

  BEGIN

    cv_str := lpad(in_string,8,'vT7kQ3sP');

    dbms_random.seed(cv_str);
    cv_upper := dbms_random.string('X',8);

    FOR i IN 1 .. 8
    LOOP
       nv_1 := floor(dbms_random.value(0,2));  
       IF nv_1 > 0 THEN
          cv_result := cv_result||lower(substr(cv_upper,i,1));
       ELSE
          cv_result := cv_result||substr(cv_upper,i,1);             
       END IF;
    END LOOP;
    
    -- The two dbms_output statement outputing cv_result are 
    -- for testing only. These should be commented out in live

    --DBMS_OUTPUT.PUT_LINE('Original unmodified password = '||cv_result);

/* pre-BIF password modifications
    cv_result := replace(cv_result,'1','2');
    cv_result := replace(cv_result,'l','L');
    cv_result := replace(cv_result,'0','9');
    cv_result := replace(cv_result,'O','P');
*/    
    -- BIF password modifications specified in section 3 of PD.4158 v1.0
    cv_result := replace(cv_result,'0','9');
    cv_result := replace(cv_result,'1','2');
    cv_result := replace(cv_result,'I','J');
    cv_result := replace(cv_result,'i','j');
    cv_result := replace(cv_result,'L','M');
    cv_result := replace(cv_result,'l','m');
    cv_result := replace(cv_result,'O','P');
    cv_result := replace(cv_result,'o','p');
    
    
    --DBMS_OUTPUT.PUT_LINE('Modified password = '||cv_result);

    RETURN cv_result;
  END generate_password;

PROCEDURE cpt_process_claims
AS

-- count number of claims
CURSOR      cur_claim_count IS
  SELECT      COUNT(*)
  FROM      claim_requests@cpt_mcol_link cr,
            tape_files@cpt_mcol_link tf
  WHERE     cr.tape_file_seq = tf.tape_file_seq
  AND       tf.status = 'L'
  ORDER BY  cr.tape_file_seq;

  -- get claim details for processing
  
  CURSOR    cur_requests IS
    SELECT  cr.tape_file_seq,
            cr.coded_creditor,
            cr.claim_number, 
            cr.court_code, 
            cr.claim_amount, 
            cr.court_fee,
            cr.solicitors_costs, 
            cr.total_amount,
            cr.claimant_name_1, 
            cr.claimant_name_2,
            cr.claimant_addr_1, 
            cr.claimant_addr_2,
            cr.claimant_addr_3, 
            cr.claimant_addr_4,
            cr.claimant_addr_5, 
            cr.claimant_postcode,
            cr.solicitor_reference,
            cr.def1_name_1, 
            cr.def1_name_2, 
            cr.def1_addr_1, 
            cr.def1_addr_2,
            cr.def1_addr_3, 
            cr.def1_addr_4, 
            cr.def1_addr_5, 
            cr.def1_postcode,
            cr.def2_name_1, 
            cr.def2_name_2, 
            cr.def2_addr_1, 
            cr.def2_addr_2,
            cr.def2_addr_3, 
            cr.def2_addr_4, 
            cr.def2_addr_5, 
            cr.def2_postcode,
            cr.def1_password, 
            cr.def2_password,
            cr.claim_particulars_1, 
            cr.claim_particulars_2,
            cr.claim_particulars_3, 
            cr.claim_particulars_4,
            cr.claim_particulars_5, 
            cr.claim_particulars_6,
            cr.claim_particulars_7, 
            cr.claim_particulars_8,
            cr.claim_particulars_9,
            cr.claim_particulars_10,
            cr.claim_particulars_11,
            cr.claim_particulars_12,
            cr.claim_particulars_13,
            cr.claim_particulars_14,
            cr.claim_particulars_15,
            cr.claim_particulars_16,
            cr.claim_particulars_17,
            cr.claim_particulars_18,
            cr.claim_particulars_19,
            cr.claim_particulars_20,
            cr.claim_particulars_21,
            cr.claim_particulars_22,
            cr.claim_particulars_23, 
            cr.claim_particulars_24,
            cr.corres_rep_name, 
            cr.corres_rep_addr_1,
            cr.corres_rep_addr_2, 
            cr.corres_rep_addr_3,
            cr.corres_rep_addr_4, 
            cr.corres_rep_addr_5, 
            cr.corres_rep_postcode,
            cr.solicitor, 
            cr.name_on_partics,
            cr.claimant_rep_fax_no, 
            cr.claimant_rep_email,
            cr.status
  FROM      claim_requests@cpt_mcol_link cr,
            tape_files@cpt_mcol_link tf
  WHERE     cr.tape_file_seq = tf.tape_file_seq
  AND       tf.status = 'L'
  ORDER BY  cr.tape_file_seq;

-- declare table of records for bulk fetch of claims  
TYPE requests_tab IS TABLE OF cur_requests%ROWTYPE
INDEX BY PLS_INTEGER;
      
lst_requests    requests_tab;
empty_requests  requests_tab; 



-- declare table of records for tape_file_seq numbers  
TYPE tape_seq_tab IS TABLE OF tape_files.tape_file_seq@cpt_mcol_link%TYPE
INDEX BY PLS_INTEGER;

lst_tape_seq    tape_seq_tab;
empty_tape_seq    tape_seq_tab;

-- index used for accessing above array
tape_idx    NUMBER    := 1;

--cursor to check that coded_creditor exists in CASEMAN
CURSOR cur_party_chk (creditor NUMBER) IS
    SELECT ncp.code
    FROM   national_coded_parties ncp
    WHERE  ncp.code = creditor;

n_ncp_code   national_coded_parties.code%TYPE;

CURSOR  cur_get_dates IS
SELECT  TRUNC(SYSDATE) issue_date,
        TRUNC(SYSDATE + 5 ) service_date
FROM    dual;

rec_date    cur_get_dates%ROWTYPE;

-- cursor to get the number of records to be loaded from the
-- mcol tape files table

CURSOR  cur_get_tape_file_seq IS
SELECT  SUM(no_records)
FROM    tape_files@cpt_mcol_link tf
WHERE   STATUS = 'L';

-- cursor to get mcol address
CURSOR cur_get_mcol_addr IS
    SELECT  'Money Claims Online' name,
        cp.address_line1,
        cp.address_line2,
        cp.address_line3,
        cp.address_line4,
        cp.address_line5,
        cp.postcode,
        p.tel_no
    FROM    coded_parties cp,
            parties p
    WHERE   p.party_id = cp.party_id
    AND     code = 1999;

-- cursor to get bulk address
 
CURSOR cur_get_bulk_addr IS
    SELECT  c.name,
        ga.address_line1,
        ga.address_line2,
        ga.address_line3,
        ga.address_line4,
        ga.address_line5,
        ga.postcode,
        c.tel_no
    FROM    courts c,
            given_addresses ga
    WHERE   ga.court_code = c.code
    AND     ga.address_type_code = 'OFFICE'
    AND     c.code = 335;

-- cursor get claimant phone for bulk claims
CURSOR cur_get_claimant_tel (coded_party VARCHAR2) IS
    SELECT p.tel_no
    FROM    parties p,
            coded_parties cp
    WHERE   p.party_id = cp.party_id
    AND     cp.code = coded_party;
    
n_rejected_count    NUMBER  := 0;
n_accepted_count    NUMBER  := 0;
n_rej_code          NUMBER  := 24;  -- new rejected code indicating that coded creditor is not
                                    -- found in CASEMAN
                                    
n_accepted_court_fees_total NUMBER  := 0;
n_rejected_court_fees_total NUMBER  := 0;
                                    
v_password_1          VARCHAR2(8);
v_password_2          VARCHAR2(8);

-- Declare collections to store records which will be inserted into database
-- using bulk collection inserts
-- Note: empty collections are created to be used in clearing the main collections
--       for reuse

-- Declare collections to store records which will be inserted into database
-- using bulk collection inserts

TYPE mcol_data_tab IS TABLE OF mcol_data@cpt_mcol_link%ROWTYPE
INDEX BY PLS_INTEGER;
      
lst_mcol    mcol_data_tab;
empty_mcol    mcol_data_tab;

TYPE statistics_tab IS TABLE OF cpt_statistics%ROWTYPE
INDEX BY PLS_INTEGER;
      
lst_statistics      statistics_tab;
empty_statistics    statistics_tab;

TYPE claims_tab IS TABLE OF cpt_claims%ROWTYPE
INDEX BY PLS_INTEGER;
      
lst_claims          claims_tab;
empty_claims        claims_tab;

TYPE defendants_tab IS TABLE OF cpt_defendants%ROWTYPE
INDEX BY PLS_INTEGER;
      
lst_defendants      defendants_tab;
empty_defendants    defendants_tab;

TYPE caseman_tab IS TABLE OF load_cases%ROWTYPE
INDEX BY PLS_INTEGER;
      
lst_cases           caseman_tab;
empty_cases         caseman_tab;

TYPE printed_tab IS TABLE OF cpt_print_claims%ROWTYPE
INDEX BY PLS_INTEGER;

lst_printed         printed_tab;
empty_printed       printed_tab;

-- declare address record 

TYPE address_rec IS RECORD 
    (
    name                courts.name%TYPE,
    address_line1       given_addresses.address_line1%TYPE,
    address_line2       given_addresses.address_line2%TYPE,
    address_line3       given_addresses.address_line3%TYPE,
    address_line4       given_addresses.address_line4%TYPE,
    address_line5       given_addresses.address_line5%TYPE,
    postcode            given_addresses.postcode%TYPE,
    telephone_no        courts.tel_no%TYPE
    );
    
mcol_address    address_rec;
bulk_address    address_rec;

-- offset and index used to store second defendant in lst_defendants 
-- without overwriting 1st defendant

deft2_index_offset  NUMBER := 0;
deft2_idx           NUMBER := 0;

-- strings used to store current operation details
-- used in writing error messages

current_statement     VARCHAR2(200)     := NULL;
current_claim         VARCHAR2(10)      :=NULL;

claim_count            NUMBER            := NULL;
expected_claims     NUMBER          := NULL;
nv_omr_code         NUMBER          := 1;
nv_rec_no            NUMBER            := 1;

-- court seal variables

court_seal_1         VARCHAR2(15)       := NULL;
court_seal_2         VARCHAR2(15)       := NULL;

BEGIN

    DBMS_OUTPUT.ENABLE(1000000);
    DBMS_OUTPUT.PUT_LINE('Starting to process claims at '||TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('.');
 
    current_statement := 'getting count of claims';
    
    OPEN    cur_claim_count;
    FETCH   cur_claim_count INTO claim_count;
    CLOSE   cur_claim_count;
    
    -- get expected  no of records from the MCOL tape files table.
    
    current_statement := 'getting expected claims';
    
    OPEN    cur_get_tape_file_seq;
    FETCH   cur_get_tape_file_seq INTO expected_claims;
    CLOSE   cur_get_tape_file_seq;
    
    current_statement := 'Comparing expected claims to actual claims found';
    
    IF claim_count != expected_claims THEN
        -- We have a mismatch so raise an error and exit
        DBMS_OUTPUT.PUT_LINE('ERROR Expected Claims '||expected_claims||' Actual Claims '||claim_count);
        RAISE_APPLICATION_ERROR(-20001,'Expected Number of Claims not found');
    END IF;
    
    current_statement := 'Setting dates';
    
    OPEN  cur_get_dates;
    FETCH cur_get_dates INTO rec_date;
    CLOSE cur_get_dates;
    
    DBMS_OUTPUT.PUT_LINE('issue date   is  '||TO_CHAR(rec_date.issue_date, 'DD/MM/YYYY HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('Service date is  '||TO_CHAR(rec_date.service_date, 'DD/MM/YYYY HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('.');
    
    -- populate the MCOL Claims addresses.
    -- using MCOL party id of 1999
    
    OPEN    cur_get_mcol_addr;
    FETCH   cur_get_mcol_addr INTO mcol_address;
    CLOSE   cur_get_mcol_addr;
    
    -- populate the bulk claims address
    -- using court code of 335 for northampton bulk claims court

    OPEN    cur_get_bulk_addr;
    FETCH   cur_get_bulk_addr INTO bulk_address;
    CLOSE   cur_get_bulk_addr;
    
    -- generate the court seal lines
    -- Note: Both MCOL and the BULK claims use the same court name
    -- for court 335
    
    format_court_seal   (
                        bulk_address.name,
                        court_seal_1,
                        court_seal_2
                        );
    
    -- get all unprocessed claims, 
    
    current_statement := 'Bulk collect fetch of claims';
    
    OPEN cur_requests;
    LOOP
        -- this will process all claims in batchs of up to 5000 claims at time.
        -- This value may need to be adjusted depending on memory available and 
        -- performance on the live environment. It is currently set to 5000 which
        -- should process all the claims we expect to get in a day in a single batch.
        FETCH cur_requests BULK COLLECT INTO lst_requests LIMIT 5000;
            
        deft2_index_offset := lst_requests.count + 100;
        
        -- process the claims we found
        FOR request_idx IN 1..lst_requests.COUNT
            LOOP
                -- record tape_file_seq
                
                IF      lst_tape_seq.EXISTS(tape_idx) = FALSE THEN
                        -- record the 1st tape file sequence
                        current_statement := 'recording 1st tape file seq tape idx = '||tape_idx;
                        lst_tape_seq(tape_idx) := lst_requests(request_idx).tape_file_seq;
                ELSIF   lst_tape_seq(tape_idx) != lst_requests(request_idx).tape_file_seq THEN
                        -- when the tape file seq changes record the new tape file seq
                        current_statement := 'recording new tape file seq tape idx = '||tape_idx;
                        tape_idx := tape_idx + 1;
                        lst_tape_seq(tape_idx) := lst_requests(request_idx).tape_file_seq;    
                END IF;
                
                -- record claim for use in exception handler.
                current_claim := TO_CHAR(lst_requests(request_idx).claim_number);
                
                -- make sure the coded creditor is known to CASEMAN
                
                current_statement := 'Checking coded creditor for claim '||TO_CHAR(lst_requests(request_idx).claim_number);

                OPEN cur_party_chk ( lst_requests(request_idx).coded_creditor);
                FETCH cur_party_chk INTO n_ncp_code;
                IF cur_party_chk%FOUND THEN
                    --coded creditor has been found on CASEMAN, so process the claim
                    
                    -- clear any old passwords
                    v_password_1 := NULL;
                    v_password_2 := NULL;
                    
                    -- generate new passwords for the 1st mandatory defendant
                    v_password_1 := generate_password
                                        (substr(lst_requests(request_idx).def1_name_1||lst_requests(request_idx).def1_name_2,4,4)||
                                        substr(lst_requests(request_idx).claim_number,6,3)||'1');
                    lst_requests(request_idx).def1_password := v_password_1;                    
                    -- generate password for optional second defendant if they exist                    
                    IF lst_requests(request_idx).def2_name_1||lst_requests(request_idx).def2_name_2 IS NOT NULL THEN    
                        v_password_2 := generate_password
                                        (substr(lst_requests(request_idx).def2_name_1||lst_requests(request_idx).def2_name_2,4,4)||
                                        substr(lst_requests(request_idx).claim_number,6,3)||'2');
                        lst_requests(request_idx).def2_password := v_password_2;                                           
                    END IF; -- def2 if statement
                        
                    -- add the claim to the statistics collection

                    current_statement := 'Storing Statistics for '||TO_CHAR(lst_requests(request_idx).claim_number);
                    
                    lst_statistics(request_idx).claim_number    := lst_requests(request_idx).claim_number; 
                    lst_statistics(request_idx).issue_date      := rec_date.issue_date; 
                    lst_statistics(request_idx).valid           := 'Y'; 
                    lst_statistics(request_idx).creditor_code   := lst_requests(request_idx).coded_creditor;
                    lst_statistics(request_idx).court_code      := lst_requests(request_idx).court_code; 
                    lst_statistics(request_idx).claim_amount    := lst_requests(request_idx).claim_amount; 
                    lst_statistics(request_idx).court_fee       := lst_requests(request_idx).court_fee;
                    

                    -- add claim to the claims collection which will be inserted into
                    -- This claims table which is used by the various
                    -- reports, so is retained to avoid the need to recode the 
                    -- reports
                    
                    current_statement := 'storing claim for '||TO_CHAR(lst_requests(request_idx).claim_number);
                    
                    lst_claims(request_idx).status                  :=  'I';
                    lst_claims(request_idx).claim_number            :=  lst_requests(request_idx).claim_number;
                    lst_claims(request_idx).creditor_code           :=  lst_requests(request_idx).coded_creditor;
                    lst_claims(request_idx).court_code              :=  lst_requests(request_idx).court_code;
                    lst_claims(request_idx).claimant_name_1         :=  lst_requests(request_idx).claimant_name_1;
                    lst_claims(request_idx).claimant_name_2         :=  lst_requests(request_idx).claimant_name_2;
                    lst_claims(request_idx).claimant_addr_1         :=  lst_requests(request_idx).claimant_addr_1;
                    lst_claims(request_idx).claimant_addr_2         :=  lst_requests(request_idx).claimant_addr_2;
                    lst_claims(request_idx).claimant_addr_3         :=  lst_requests(request_idx).claimant_addr_3;
                    lst_claims(request_idx).claimant_addr_4         :=  lst_requests(request_idx).claimant_addr_4;
                    lst_claims(request_idx).claimant_addr_5         :=  lst_requests(request_idx).claimant_addr_5;                
                    lst_claims(request_idx).claimant_postcode       :=  lst_requests(request_idx).claimant_postcode;
                    lst_claims(request_idx).solicitor_reference     :=  lst_requests(request_idx).solicitor_reference;
                    lst_claims(request_idx).claim_amount            :=  lst_requests(request_idx).claim_amount;
                    lst_claims(request_idx).court_fee               :=  lst_requests(request_idx).court_fee;
                    lst_claims(request_idx).solicitors_costs        :=  lst_requests(request_idx).solicitors_costs;
                    lst_claims(request_idx).total_amount            :=  lst_requests(request_idx).total_amount;
                    lst_claims(request_idx).issue_date              :=  rec_date.issue_date;
                    lst_claims(request_idx).service_date            :=  rec_date.service_date;
                    lst_claims(request_idx).particulars_1           :=  lst_requests(request_idx).claim_particulars_1;
                    lst_claims(request_idx).particulars_2           :=  lst_requests(request_idx).claim_particulars_2;
                    lst_claims(request_idx).particulars_3           :=  lst_requests(request_idx).claim_particulars_3;
                    lst_claims(request_idx).particulars_4           :=  lst_requests(request_idx).claim_particulars_4;
                    lst_claims(request_idx).particulars_5           :=  lst_requests(request_idx).claim_particulars_5;
                    lst_claims(request_idx).particulars_6           :=  lst_requests(request_idx).claim_particulars_6;
                    lst_claims(request_idx).particulars_7           :=  lst_requests(request_idx).claim_particulars_7;
                    lst_claims(request_idx).particulars_8           :=  lst_requests(request_idx).claim_particulars_8;
                    lst_claims(request_idx).particulars_9           :=  lst_requests(request_idx).claim_particulars_9;
                    lst_claims(request_idx).particulars_10          :=  lst_requests(request_idx).claim_particulars_10;
                    lst_claims(request_idx).particulars_11          :=  lst_requests(request_idx).claim_particulars_11;
                    lst_claims(request_idx).particulars_12          :=  lst_requests(request_idx).claim_particulars_12;
                    lst_claims(request_idx).particulars_13          :=  lst_requests(request_idx).claim_particulars_13;
                    lst_claims(request_idx).particulars_14          :=  lst_requests(request_idx).claim_particulars_14;
                    lst_claims(request_idx).particulars_15          :=  lst_requests(request_idx).claim_particulars_15;
                    lst_claims(request_idx).particulars_16          :=  lst_requests(request_idx).claim_particulars_16;
                    lst_claims(request_idx).particulars_17          :=  lst_requests(request_idx).claim_particulars_17;
                    lst_claims(request_idx).particulars_18          :=  lst_requests(request_idx).claim_particulars_18;
                    lst_claims(request_idx).particulars_19          :=  lst_requests(request_idx).claim_particulars_19;
                    lst_claims(request_idx).particulars_20          :=  lst_requests(request_idx).claim_particulars_20;
                    lst_claims(request_idx).particulars_21          :=  lst_requests(request_idx).claim_particulars_21;
                    lst_claims(request_idx).particulars_22          :=  lst_requests(request_idx).claim_particulars_22;
                    lst_claims(request_idx).particulars_23          :=  lst_requests(request_idx).claim_particulars_23;
                    lst_claims(request_idx).particulars_24          :=  lst_requests(request_idx).claim_particulars_24;
                    lst_claims(request_idx).corres_rep_name         :=  lst_requests(request_idx).corres_rep_name;
                    lst_claims(request_idx).corres_rep_addr_1       :=  lst_requests(request_idx).corres_rep_addr_1;
                    lst_claims(request_idx).corres_rep_addr_2       :=  lst_requests(request_idx).corres_rep_addr_2;
                    lst_claims(request_idx).corres_rep_addr_3       :=  lst_requests(request_idx).corres_rep_addr_3;
                    lst_claims(request_idx).corres_rep_addr_4       :=  lst_requests(request_idx).corres_rep_addr_4;
                    lst_claims(request_idx).corres_rep_addr_5       :=  lst_requests(request_idx).corres_rep_addr_5;
                    lst_claims(request_idx).corres_rep_postcode     :=  lst_requests(request_idx).corres_rep_postcode;
                    lst_claims(request_idx).solicitor               :=  lst_requests(request_idx).solicitor;
                    lst_claims(request_idx).name_on_partics         :=  lst_requests(request_idx).name_on_partics;
                    lst_claims(request_idx).claimant_rep_fax_no     :=  lst_requests(request_idx).claimant_rep_fax_no;
                    lst_claims(request_idx).claimant_rep_email      :=  lst_requests(request_idx).claimant_rep_email;
                            
                    -- insert first defendant collection will be loaded
                    -- into the defendant table which is used by the various reports, so is 
                    -- retained to avoid the need to recode the reports

                    current_statement := 'storing defendants for '||TO_CHAR(lst_requests(request_idx).claim_number);
                    
                    lst_defendants(request_idx).claim_number    := lst_requests(request_idx).claim_number; 
                    lst_defendants(request_idx).id              := 1; 
                    lst_defendants(request_idx).name            := RPAD(lst_requests(request_idx).def1_name_1,35)||
                                                                lst_requests(request_idx).def1_name_2; 
                    lst_defendants(request_idx).addr_1          := lst_requests(request_idx).def1_addr_1;
                    lst_defendants(request_idx).addr_2          := lst_requests(request_idx).def1_addr_2;
                    lst_defendants(request_idx).addr_3          := lst_requests(request_idx).def1_addr_3;
                    lst_defendants(request_idx).addr_4          := lst_requests(request_idx).def1_addr_4;
                    lst_defendants(request_idx).addr_5          := lst_requests(request_idx).def1_addr_5;
                    lst_defendants(request_idx).postcode        := lst_requests(request_idx).def1_postcode;
                    lst_defendants(request_idx).mcol_password   := lst_requests(request_idx).def1_password;
                            
                    -- add second defendant if there is one
                    -- need to use a different index so 1st defendant details are
                    -- not overwritten in the collection
                    
                    deft2_idx := request_idx + deft2_index_offset;
                    
                    IF lst_requests(request_idx).def2_name_1||lst_requests(request_idx).def2_name_2 IS NOT NULL THEN
                        
                        -- 2nd defendant is present
                        
                        lst_defendants(deft2_idx).claim_number    := lst_requests(request_idx).claim_number; 
                        lst_defendants(deft2_idx).id              := 2; 
                        lst_defendants(deft2_idx).name            := RPAD(lst_requests(request_idx).def2_name_1,35)||
                                                                  lst_requests(request_idx).def2_name_2; 
                        lst_defendants(deft2_idx).addr_1          := lst_requests(request_idx).def2_addr_1;
                        lst_defendants(deft2_idx).addr_2          := lst_requests(request_idx).def2_addr_2;
                        lst_defendants(deft2_idx).addr_3          := lst_requests(request_idx).def2_addr_3;
                        lst_defendants(deft2_idx).addr_4          := lst_requests(request_idx).def2_addr_4;
                        lst_defendants(deft2_idx).addr_5          := lst_requests(request_idx).def2_addr_5;
                        lst_defendants(deft2_idx).postcode        := lst_requests(request_idx).def2_postcode;
                        lst_defendants(deft2_idx).mcol_password   := lst_requests(request_idx).def2_password;
                    END IF; -- end of second defendant if statement
                                         
                    current_statement := 'storing case in collection for loading into CASEMAN for  '
                                         ||TO_CHAR(lst_requests(request_idx).claim_number);

                    lst_cases(request_idx).despatch_number      :=  NULL; -- dispatch number is not used in CPT/STD
                    lst_cases(request_idx).case_number          :=  lst_requests(request_idx).claim_number;
                    lst_cases(request_idx).cred_code            :=  lst_requests(request_idx).coded_creditor;
                    lst_cases(request_idx).claimant_details_1   :=  lst_requests(request_idx).claimant_name_1||' '||
                                                                    lst_requests(request_idx).claimant_name_2;
                    lst_cases(request_idx).claimant_details_2   :=  lst_requests(request_idx).claimant_addr_1;
                    lst_cases(request_idx).claimant_details_3   :=  lst_requests(request_idx).claimant_addr_2;
                    lst_cases(request_idx).claimant_details_4   :=  lst_requests(request_idx).claimant_addr_3; 
                    lst_cases(request_idx).claimant_details_5   :=  lst_requests(request_idx).claimant_addr_4;
                    lst_cases(request_idx).claimant_details_6   :=  lst_requests(request_idx).claimant_addr_5;
                    lst_cases(request_idx).claimant_details_7   :=  lst_requests(request_idx).claimant_postcode; 
                    lst_cases(request_idx).reference            :=  lst_requests(request_idx).solicitor_reference;
                    lst_cases(request_idx).defendant_1_name     :=  lst_requests(request_idx).def1_name_1||' '||lst_requests(request_idx).def1_name_2;
                    lst_cases(request_idx).defendant_1_addr_1   :=  lst_requests(request_idx).def1_addr_1;
                    lst_cases(request_idx).defendant_1_addr_2   :=  lst_requests(request_idx).def1_addr_2;
                    lst_cases(request_idx).defendant_1_addr_3   :=  lst_requests(request_idx).def1_addr_3; 
                    lst_cases(request_idx).defendant_1_addr_4   :=  lst_requests(request_idx).def1_addr_4; 
                    lst_cases(request_idx).defendant_1_addr_5   :=  lst_requests(request_idx).def1_addr_5;
                    lst_cases(request_idx).defendant_1_postcode :=  lst_requests(request_idx).def1_postcode;
                    lst_cases(request_idx).defendant_1_password :=  lst_requests(request_idx).def1_password;
                    lst_cases(request_idx).defendant_2_name     :=  lst_requests(request_idx).def2_name_1||' '||lst_requests(request_idx).def2_name_2;
                    lst_cases(request_idx).defendant_2_addr_1   :=  lst_requests(request_idx).def2_addr_1;
                    lst_cases(request_idx).defendant_2_addr_2   :=  lst_requests(request_idx).def2_addr_2;
                    lst_cases(request_idx).defendant_2_addr_3   :=  lst_requests(request_idx).def2_addr_3; 
                    lst_cases(request_idx).defendant_2_addr_4   :=  lst_requests(request_idx).def2_addr_4; 
                    lst_cases(request_idx).defendant_2_addr_5   :=  lst_requests(request_idx).def2_addr_5;
                    lst_cases(request_idx).defendant_2_postcode :=  lst_requests(request_idx).def2_postcode;
                    lst_cases(request_idx).defendant_2_password :=  lst_requests(request_idx).def2_password;
                    lst_cases(request_idx).amount_claimed       :=  lst_requests(request_idx).claim_amount;
                    lst_cases(request_idx).court_fee            :=  lst_requests(request_idx).court_fee;
                    lst_cases(request_idx).solicitors_costs     :=  lst_requests(request_idx).solicitors_costs;
                    lst_cases(request_idx).total                :=  lst_requests(request_idx).total_amount;
                    lst_cases(request_idx).date_of_issue        :=  rec_date.issue_date;
                    lst_cases(request_idx).date_of_service_other := rec_date.service_date; 
                    lst_cases(request_idx).particulars_of_claim :=  RPAD(NVL(lst_requests(request_idx).claim_particulars_1,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_2,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_3,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_4,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_5,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_6,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_7,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_8,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_9,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_10,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_11,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_12,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_13,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_14,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_15,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_16,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_17,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_18,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_19,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_20,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_21,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_22,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_23,' '),45)
                                                                   ||RPAD(NVL(lst_requests(request_idx).claim_particulars_24,' '),45); -- PARTICULARS_OF_CLAIM,
                    lst_cases(request_idx).corres_rep_name      :=  lst_requests(request_idx).corres_rep_name;
                    lst_cases(request_idx).corres_rep_addr_1    :=  lst_requests(request_idx).corres_rep_addr_1;
                    lst_cases(request_idx).corres_rep_addr_2    :=  lst_requests(request_idx).corres_rep_addr_2; 
                    lst_cases(request_idx).corres_rep_addr_3    :=  lst_requests(request_idx).corres_rep_addr_3;
                    lst_cases(request_idx).corres_rep_addr_4    :=  lst_requests(request_idx).corres_rep_addr_4; 
                    lst_cases(request_idx).corres_rep_addr_5    :=  lst_requests(request_idx).corres_rep_addr_5; 
                    lst_cases(request_idx).corres_rep_postcode  :=  lst_requests(request_idx).corres_rep_postcode;
                    lst_cases(request_idx).claimant_rep_fax_no  :=  lst_requests(request_idx).claimant_rep_fax_no; 
                    lst_cases(request_idx).claimant_rep_email   :=  lst_requests(request_idx).claimant_rep_email;
                    lst_cases(request_idx).via_sdt              :=  'Y'; -- set flag to show case loaded via SDT

                    -- insert record into the print claims table used to
                    -- produced the N1 claims packs
                    -- Note: the formating of values and page calculations are extracted from the old
                    -- CPC SP_BO_U1.sh script which populated the print_claims table in the CPC application.
                    
                    
                    lst_printed(request_idx).rec_no                 :=  nv_rec_no;
                    lst_printed(request_idx).omr_code               :=  nv_omr_code;
                    -- note: Welsh language message is no longer printed
                    lst_printed(request_idx).welsh_1                :=  NULL;
                    lst_printed(request_idx).welsh_2                :=  NULL;
                    lst_printed(request_idx).welsh_3                :=  NULL;
                    lst_printed(request_idx).welsh_4                :=  NULL;
                    lst_printed(request_idx).creditor_code          :=  lst_requests(request_idx).coded_creditor;
                    lst_printed(request_idx).bar_code               :=  lst_requests(request_idx).claim_number||TO_CHAR(1);
                    lst_printed(request_idx).claim_number           :=  lst_requests(request_idx).claim_number;
                    lst_printed(request_idx).court_code             :=  lst_requests(request_idx).court_code;
                    lst_printed(request_idx).court_name             :=  bulk_address.name;
                    lst_printed(request_idx).court_name_seal_1      :=  court_seal_1;
                    lst_printed(request_idx).court_name_seal_2      :=  court_seal_2;
                    lst_printed(request_idx).amount                 :=  LPAD(TO_CHAR(lst_requests(request_idx).claim_amount,'fm9999990.00'),10);
                    lst_printed(request_idx).fee                    :=  LPAD(TO_CHAR(lst_requests(request_idx).court_fee,'fm9999990.00'),10);
                    lst_printed(request_idx).costs                  :=  LPAD(TO_CHAR(lst_requests(request_idx).solicitors_costs,'fm9999990.00'),10);
                    lst_printed(request_idx).total                  :=  LPAD(TO_CHAR(lst_requests(request_idx).total_amount,'fm9999990.00'),10);
					lst_printed(request_idx).issue_date             :=  rec_date.issue_date;
                    lst_printed(request_idx).court_section          :=  lst_requests(request_idx).coded_creditor;
                    lst_printed(request_idx).claimant_dets_1        :=  lst_requests(request_idx).claimant_name_1;
                    lst_printed(request_idx).claimant_dets_2        :=  lst_requests(request_idx).claimant_name_2;
                    lst_printed(request_idx).claimant_dets_3        :=  lst_requests(request_idx).claimant_addr_1;
                    lst_printed(request_idx).claimant_dets_4        :=  lst_requests(request_idx).claimant_addr_2;
                    lst_printed(request_idx).claimant_dets_5        :=  lst_requests(request_idx).claimant_addr_3;
                    lst_printed(request_idx).claimant_dets_6        :=  lst_requests(request_idx).claimant_addr_4;
                    lst_printed(request_idx).claimant_dets_7        :=  lst_requests(request_idx).claimant_addr_5;
                    lst_printed(request_idx).claimant_postcode      :=  lst_requests(request_idx).claimant_postcode;
                    lst_printed(request_idx).payment_address_1      :=  substr(lst_requests(request_idx).corres_rep_name, 1, 30 );
                    lst_printed(request_idx).payment_address_2      :=  lst_requests(request_idx).corres_rep_addr_1;
                    lst_printed(request_idx).payment_address_3      :=  lst_requests(request_idx).corres_rep_addr_2;
                    lst_printed(request_idx).payment_address_4      :=  lst_requests(request_idx).corres_rep_addr_3;
                    lst_printed(request_idx).payment_address_5      :=  lst_requests(request_idx).corres_rep_addr_4;
                    lst_printed(request_idx).payment_postcode       :=  lst_requests(request_idx).corres_rep_postcode;
                    lst_printed(request_idx).reference              :=  lst_requests(request_idx).solicitor_reference;
                    lst_printed(request_idx).particulars_name       :=  lst_requests(request_idx).name_on_partics;
                    lst_printed(request_idx).deft_1_dets_1          :=  lst_requests(request_idx).def1_name_1;
                    lst_printed(request_idx).deft_1_dets_2          :=  lst_requests(request_idx).def1_name_2;
                    lst_printed(request_idx).deft_1_dets_3          :=  lst_requests(request_idx).def1_addr_1;
                    lst_printed(request_idx).deft_1_dets_4          :=  lst_requests(request_idx).def1_addr_2;
                    lst_printed(request_idx).deft_1_dets_5          :=  lst_requests(request_idx).def1_addr_3;
                    lst_printed(request_idx).deft_1_dets_6          :=  lst_requests(request_idx).def1_addr_4;
                    lst_printed(request_idx).deft_1_dets_7          :=  lst_requests(request_idx).def1_addr_5;
                    lst_printed(request_idx).deft_1_dets_8          :=  lst_requests(request_idx).def1_postcode;
                    -- cannot use decode so use IF statement
                    IF  lst_requests(request_idx).solicitor = 'N' THEN
                        lst_printed(request_idx).claimant_x         :=  NULL;
                        lst_printed(request_idx).solicitor_x        :=  'XXXXXXXXXXXXXXX';
                    ELSIF lst_requests(request_idx).solicitor = 'Y' THEN
                        lst_printed(request_idx).claimant_x         :=  'XXXXXXXX';
                        lst_printed(request_idx).solicitor_x        :=  NULL;
                    ELSE -- solicitor is NULL or other non Y/N value   
                        lst_printed(request_idx).claimant_x         :=  NULL;
                        lst_printed(request_idx).solicitor_x        :=  NULL;
                    END IF;
                    lst_printed(request_idx).deft_2_dets_1          :=  lst_requests(request_idx).def2_name_1;
                    lst_printed(request_idx).deft_2_dets_2          :=  lst_requests(request_idx).def2_name_2;
                    lst_printed(request_idx).deft_2_dets_3          :=  lst_requests(request_idx).def2_addr_1;
                    lst_printed(request_idx).deft_2_dets_4          :=  lst_requests(request_idx).def2_addr_2;
                    lst_printed(request_idx).deft_2_dets_5          :=  lst_requests(request_idx).def2_addr_3;
                    lst_printed(request_idx).deft_2_dets_6          :=  lst_requests(request_idx).def2_addr_4;
                    lst_printed(request_idx).deft_2_dets_7          :=  lst_requests(request_idx).def2_addr_5;
                    lst_printed(request_idx).deft_2_dets_8          :=  lst_requests(request_idx).def2_postcode;
                    lst_printed(request_idx).particulars_1          :=  lst_requests(request_idx).claim_particulars_1;
                    lst_printed(request_idx).particulars_2          :=  lst_requests(request_idx).claim_particulars_2;
                    lst_printed(request_idx).particulars_3          :=  lst_requests(request_idx).claim_particulars_3;
                    lst_printed(request_idx).particulars_4          :=  lst_requests(request_idx).claim_particulars_4;
                    lst_printed(request_idx).particulars_5          :=  lst_requests(request_idx).claim_particulars_5;
                    lst_printed(request_idx).particulars_6          :=  lst_requests(request_idx).claim_particulars_6;
                    lst_printed(request_idx).particulars_7          :=  lst_requests(request_idx).claim_particulars_7;
                    lst_printed(request_idx).particulars_8          :=  lst_requests(request_idx).claim_particulars_8;
                    lst_printed(request_idx).particulars_9          :=  lst_requests(request_idx).claim_particulars_9;
                    lst_printed(request_idx).particulars_10         :=  lst_requests(request_idx).claim_particulars_10;
                    lst_printed(request_idx).particulars_11         :=  lst_requests(request_idx).claim_particulars_11;
                    lst_printed(request_idx).particulars_12         :=  lst_requests(request_idx).claim_particulars_12;
                    lst_printed(request_idx).particulars_13         :=  lst_requests(request_idx).claim_particulars_13;
                    lst_printed(request_idx).particulars_14         :=  lst_requests(request_idx).claim_particulars_14;
                    lst_printed(request_idx).particulars_15         :=  lst_requests(request_idx).claim_particulars_15;
                    lst_printed(request_idx).particulars_16         :=  lst_requests(request_idx).claim_particulars_16;
                    lst_printed(request_idx).particulars_17         :=  lst_requests(request_idx).claim_particulars_17;
                    lst_printed(request_idx).particulars_18         :=  lst_requests(request_idx).claim_particulars_18;
                    lst_printed(request_idx).particulars_19         :=  lst_requests(request_idx).claim_particulars_19;
                    lst_printed(request_idx).particulars_20         :=  lst_requests(request_idx).claim_particulars_20;
                    lst_printed(request_idx).particulars_21         :=  lst_requests(request_idx).claim_particulars_21;
                    lst_printed(request_idx).particulars_22         :=  lst_requests(request_idx).claim_particulars_22;
                    lst_printed(request_idx).particulars_23         :=  lst_requests(request_idx).claim_particulars_23;
                    lst_printed(request_idx).particulars_24         :=  lst_requests(request_idx).claim_particulars_24;
                    lst_printed(request_idx).amount_currency        :=  NULL;
                    lst_printed(request_idx).fee_currency           :=  NULL;
                    lst_printed(request_idx).costs_currency         :=  NULL;
                    lst_printed(request_idx).total_currency         :=  NULL;
                    lst_printed(request_idx).help_text_1            :=  'Important Note';
                    lst_printed(request_idx).help_text_2            :=  '.';
                    lst_printed(request_idx).help_text_3            :=  'You have a limited time in which to reply to';
                    lst_printed(request_idx).help_text_4            :=  'this claim form';
                    lst_printed(request_idx).help_text_5            :=  '.';
                    lst_printed(request_idx).help_text_6            :=  'Please read all the guidance notes on the';
                    lst_printed(request_idx).help_text_7            :=  'back of this form - they set out the time limits';
                    lst_printed(request_idx).help_text_8            :=  'and tell you what you can do about the claim';
                    lst_printed(request_idx).help_text_9            :=  '.';
                    lst_printed(request_idx).help_text_10           :=  'You can respond to this claim online. Log on';
                    lst_printed(request_idx).help_text_11           :=  'to' ;
                    lst_printed(request_idx).help_text_12           :=  'www.moneyclaim.gov.uk';
                    lst_printed(request_idx).help_text_13           :=  '.' ;
                    lst_printed(request_idx).help_text_14           :=  'You will need the claim number';
                    lst_printed(request_idx).help_text_15           :=  '(see above)';
                    lst_printed(request_idx).help_text_16           :=  'and the following password';
                    lst_printed(request_idx).help_text_17           :=  lst_requests(request_idx).def1_password;
                    lst_printed(request_idx).p2_claimant_name_1     :=  lst_requests(request_idx).claimant_name_1;
                    lst_printed(request_idx).p2_claimant_name_2     :=  lst_requests(request_idx).claimant_name_2;
                    lst_printed(request_idx).p2_deft_name_1         :=  lst_requests(request_idx).def1_name_1;
                    lst_printed(request_idx).p2_deft_name_2         :=  lst_requests(request_idx).def1_name_2;
                    lst_printed(request_idx).p2_help_text_1         := 'If you want to defend all or part of this claim or request';
                    lst_printed(request_idx).p2_help_text_2         := 'additional time to prepare your defence you can respond';
                    lst_printed(request_idx).p2_help_text_3         := 'online, by logging on to';
                    lst_printed(request_idx).p2_help_text_4         := 'www.moneyclaim.gov.uk';
                    lst_printed(request_idx).p2_help_text_5         := 'You will need the claim number and password from the';
                    lst_printed(request_idx).p2_help_text_6         := 'front of the claim form.';
                    lst_printed(request_idx).p2_help_text_7         := 'More help and information can be found online or by';
                    lst_printed(request_idx).p2_help_text_8         := 'telephoning the court on the number shown on the front';
                    lst_printed(request_idx).p2_help_text_9         := 'of the claim form.';
                    -- calculate N1 page counts
                    lst_printed(request_idx).page_1_count           := (request_idx * 4) - 3;
                    lst_printed(request_idx).page_2_count           := (request_idx * 4) - 2;
                    lst_printed(request_idx).page_3_count           := (request_idx * 4) - 1;
                    lst_printed(request_idx).page_4_count           := (request_idx * 4);

                    -- set court address to either the MCOL address if the coded_creditor is 1999
                    -- or the bulk claims court. Note: legacy code puts postcode in address 5 so 
                    -- we have to do the same
                    IF lst_requests(request_idx).coded_creditor = 1999 THEN
                        -- use the mcol address
                        lst_printed(request_idx).court_address_1        :=  mcol_address.name;
                        lst_printed(request_idx).court_address_2        :=  mcol_address.address_line1;
                        lst_printed(request_idx).court_address_3        :=  mcol_address.address_line2;
                        lst_printed(request_idx).court_address_4        :=  mcol_address.address_line3;
                        lst_printed(request_idx).court_address_5        :=  mcol_address.postcode;
                        lst_printed(request_idx).court_postcode         :=  NULL;
                        lst_printed(request_idx).p2_court_address       :=  mcol_address.name||' '||
                                                                            mcol_address.address_line1||' '||
                                                                            mcol_address.address_line2||' '||
                                                                            mcol_address.address_line3||' '||
                                                                            mcol_address.postcode;
                        lst_printed(request_idx).court_tel_number       :=  mcol_address.telephone_no;
                        -- no claimant telephone for MCOL claims
                        lst_printed(request_idx).claimant_tel_number    := NULL;
                    ELSE
                        -- use the bulk claims address
                        lst_printed(request_idx).court_address_1        :=  bulk_address.name;
                        lst_printed(request_idx).court_address_2        :=  bulk_address.address_line1;
                        lst_printed(request_idx).court_address_3        :=  bulk_address.address_line2;
                        lst_printed(request_idx).court_address_4        :=  bulk_address.address_line3;
                        lst_printed(request_idx).court_address_5        :=  bulk_address.postcode;
                        lst_printed(request_idx).court_postcode         :=  NULL;
                        lst_printed(request_idx).p2_court_address       :=  bulk_address.name||' '||
                                                                            bulk_address.address_line1||' '||
                                                                            bulk_address.address_line2||' '||
                                                                            bulk_address.address_line3||' '||
                                                                            mcol_address.postcode;
                        lst_printed(request_idx).court_tel_number       :=  bulk_address.telephone_no;
                        -- claimant telephone is set for  bulk claims
                        OPEN cur_get_claimant_tel (lst_requests(request_idx).coded_creditor);
                        FETCH cur_get_claimant_tel INTO lst_printed(request_idx).claimant_tel_number;
                        CLOSE cur_get_claimant_tel;

                    END IF;

                    -- increment omr code and rec_no in preparation for
                    -- inserting the next print claims record
                    nv_rec_no := nv_rec_no + 1;
                    IF nv_omr_code = 7 THEN
                        nv_omr_code := 1;
                    ELSE
                        nv_omr_code := nv_omr_code + 1;
                    END IF;

                    IF lst_requests(request_idx).def2_name_1||lst_requests(request_idx).def2_name_2 IS NOT NULL THEN
                        -- if there is a second defendant, insert a second record with the 1st and 2nd defendant details 
                        -- swapped over. use the deft2_idx offset to avoid overwriting the 1st printed_claim record
                        lst_printed(deft2_idx).rec_no                 :=  nv_rec_no;
                        lst_printed(deft2_idx).omr_code               :=  nv_omr_code;
                        -- note: Welsh language message is no longer printed
                        lst_printed(deft2_idx).welsh_1                :=  NULL;
                        lst_printed(deft2_idx).welsh_2                :=  NULL;
                        lst_printed(deft2_idx).welsh_3                :=  NULL;
                        lst_printed(deft2_idx).welsh_4                :=  NULL;
                        lst_printed(deft2_idx).creditor_code          :=  lst_requests(request_idx).coded_creditor;
                        lst_printed(deft2_idx).bar_code               :=  lst_requests(request_idx).claim_number||TO_CHAR(2);
                        lst_printed(deft2_idx).claim_number           :=  lst_requests(request_idx).claim_number;
                        lst_printed(deft2_idx).court_code             :=  lst_requests(request_idx).court_code;
                        lst_printed(deft2_idx).court_name             :=  bulk_address.name;
                        lst_printed(deft2_idx).court_name_seal_1      :=  court_seal_1;
                        lst_printed(deft2_idx).court_name_seal_2      :=  court_seal_2;
                        lst_printed(deft2_idx).amount                 :=  LPAD(TO_CHAR(lst_requests(request_idx).claim_amount,'fm9999990.00'),10);
                        lst_printed(deft2_idx).fee                    :=  LPAD(TO_CHAR(lst_requests(request_idx).court_fee,'fm9999990.00'),10);
                        lst_printed(deft2_idx).costs                  :=  LPAD(TO_CHAR(lst_requests(request_idx).solicitors_costs,'fm9999990.00'),10);
                        lst_printed(deft2_idx).total                  :=  LPAD(TO_CHAR(lst_requests(request_idx).total_amount,'fm9999990.00'),10);
                        lst_printed(deft2_idx).issue_date             :=  rec_date.issue_date;
                        lst_printed(deft2_idx).court_section          :=  lst_requests(request_idx).coded_creditor;
                        lst_printed(deft2_idx).claimant_dets_1        :=  lst_requests(request_idx).claimant_name_1;
                        lst_printed(deft2_idx).claimant_dets_2        :=  lst_requests(request_idx).claimant_name_2;
                        lst_printed(deft2_idx).claimant_dets_3        :=  lst_requests(request_idx).claimant_addr_1;
                        lst_printed(deft2_idx).claimant_dets_4        :=  lst_requests(request_idx).claimant_addr_2;
                        lst_printed(deft2_idx).claimant_dets_5        :=  lst_requests(request_idx).claimant_addr_3;
                        lst_printed(deft2_idx).claimant_dets_6        :=  lst_requests(request_idx).claimant_addr_4;
                        lst_printed(deft2_idx).claimant_dets_7        :=  lst_requests(request_idx).claimant_addr_5;
                        lst_printed(deft2_idx).claimant_postcode      :=  lst_requests(request_idx).claimant_postcode;
                        lst_printed(deft2_idx).payment_address_1      :=  substr(lst_requests(request_idx).corres_rep_name, 1, 30 );
                        lst_printed(deft2_idx).payment_address_2      :=  lst_requests(request_idx).corres_rep_addr_1;
                        lst_printed(deft2_idx).payment_address_3      :=  lst_requests(request_idx).corres_rep_addr_2;
                        lst_printed(deft2_idx).payment_address_4      :=  lst_requests(request_idx).corres_rep_addr_3;
                        lst_printed(deft2_idx).payment_address_5      :=  lst_requests(request_idx).corres_rep_addr_4;
                        lst_printed(deft2_idx).payment_postcode       :=  lst_requests(request_idx).corres_rep_postcode;
                        lst_printed(deft2_idx).reference              :=  lst_requests(request_idx).solicitor_reference;
                        lst_printed(deft2_idx).particulars_name       :=  lst_requests(request_idx).name_on_partics;
                        lst_printed(deft2_idx).deft_1_dets_1          :=  lst_requests(request_idx).def2_name_1;
                        lst_printed(deft2_idx).deft_1_dets_2          :=  lst_requests(request_idx).def2_name_2;
                        lst_printed(deft2_idx).deft_1_dets_3          :=  lst_requests(request_idx).def2_addr_1;
                        lst_printed(deft2_idx).deft_1_dets_4          :=  lst_requests(request_idx).def2_addr_2;
                        lst_printed(deft2_idx).deft_1_dets_5          :=  lst_requests(request_idx).def2_addr_3;
                        lst_printed(deft2_idx).deft_1_dets_6          :=  lst_requests(request_idx).def2_addr_4;
                        lst_printed(deft2_idx).deft_1_dets_7          :=  lst_requests(request_idx).def2_addr_5;
                        lst_printed(deft2_idx).deft_1_dets_8          :=  lst_requests(request_idx).def2_postcode;
                        -- cannot use decode so use IF statement
                        IF  lst_requests(request_idx).solicitor = 'N' THEN
                            lst_printed(deft2_idx).claimant_x         :=  NULL;
                            lst_printed(deft2_idx).solicitor_x        :=  'XXXXXXXXXXXXXXX';
                        ELSIF lst_requests(request_idx).solicitor = 'Y' THEN
                            lst_printed(deft2_idx).claimant_x         :=  'XXXXXXXX';
                            lst_printed(deft2_idx).solicitor_x        :=  NULL;
                        ELSE -- solicitor is NULL or other non Y/N value   
                            lst_printed(deft2_idx).claimant_x         :=  NULL;
                            lst_printed(deft2_idx).solicitor_x        :=  NULL;
                        END IF;
                        lst_printed(deft2_idx).deft_2_dets_1          :=  lst_requests(request_idx).def1_name_1;
                        lst_printed(deft2_idx).deft_2_dets_2          :=  lst_requests(request_idx).def1_name_2;
                        lst_printed(deft2_idx).deft_2_dets_3          :=  lst_requests(request_idx).def1_addr_1;
                        lst_printed(deft2_idx).deft_2_dets_4          :=  lst_requests(request_idx).def1_addr_2;
                        lst_printed(deft2_idx).deft_2_dets_5          :=  lst_requests(request_idx).def1_addr_3;
                        lst_printed(deft2_idx).deft_2_dets_6          :=  lst_requests(request_idx).def1_addr_4;
                        lst_printed(deft2_idx).deft_2_dets_7          :=  lst_requests(request_idx).def1_addr_5;
                        lst_printed(deft2_idx).deft_2_dets_8          :=  lst_requests(request_idx).def1_postcode;
                        lst_printed(deft2_idx).particulars_1          :=  lst_requests(request_idx).claim_particulars_1;
                        lst_printed(deft2_idx).particulars_2          :=  lst_requests(request_idx).claim_particulars_2;
                        lst_printed(deft2_idx).particulars_3          :=  lst_requests(request_idx).claim_particulars_3;
                        lst_printed(deft2_idx).particulars_4          :=  lst_requests(request_idx).claim_particulars_4;
                        lst_printed(deft2_idx).particulars_5          :=  lst_requests(request_idx).claim_particulars_5;
                        lst_printed(deft2_idx).particulars_6          :=  lst_requests(request_idx).claim_particulars_6;
                        lst_printed(deft2_idx).particulars_7          :=  lst_requests(request_idx).claim_particulars_7;
                        lst_printed(deft2_idx).particulars_8          :=  lst_requests(request_idx).claim_particulars_8;
                        lst_printed(deft2_idx).particulars_9          :=  lst_requests(request_idx).claim_particulars_9;
                        lst_printed(deft2_idx).particulars_10         :=  lst_requests(request_idx).claim_particulars_10;
                        lst_printed(deft2_idx).particulars_11         :=  lst_requests(request_idx).claim_particulars_11;
                        lst_printed(deft2_idx).particulars_12         :=  lst_requests(request_idx).claim_particulars_12;
                        lst_printed(deft2_idx).particulars_13         :=  lst_requests(request_idx).claim_particulars_13;
                        lst_printed(deft2_idx).particulars_14         :=  lst_requests(request_idx).claim_particulars_14;
                        lst_printed(deft2_idx).particulars_15         :=  lst_requests(request_idx).claim_particulars_15;
                        lst_printed(deft2_idx).particulars_16         :=  lst_requests(request_idx).claim_particulars_16;
                        lst_printed(deft2_idx).particulars_17         :=  lst_requests(request_idx).claim_particulars_17;
                        lst_printed(deft2_idx).particulars_18         :=  lst_requests(request_idx).claim_particulars_18;
                        lst_printed(deft2_idx).particulars_19         :=  lst_requests(request_idx).claim_particulars_19;
                        lst_printed(deft2_idx).particulars_20         :=  lst_requests(request_idx).claim_particulars_20;
                        lst_printed(deft2_idx).particulars_21         :=  lst_requests(request_idx).claim_particulars_21;
                        lst_printed(deft2_idx).particulars_22         :=  lst_requests(request_idx).claim_particulars_22;
                        lst_printed(deft2_idx).particulars_23         :=  lst_requests(request_idx).claim_particulars_23;
                        lst_printed(deft2_idx).particulars_24         :=  lst_requests(request_idx).claim_particulars_24;
                        lst_printed(deft2_idx).amount_currency        :=  NULL;
                        lst_printed(deft2_idx).fee_currency           :=  NULL;
                        lst_printed(deft2_idx).costs_currency         :=  NULL;
                        lst_printed(deft2_idx).total_currency         :=  NULL;
                        lst_printed(deft2_idx).help_text_1            :=  'Important Note';
                        lst_printed(deft2_idx).help_text_2            :=  '.';
                        lst_printed(deft2_idx).help_text_3            :=  'You have a limited time in which to reply to';
                        lst_printed(deft2_idx).help_text_4            :=  'this claim form';
                        lst_printed(deft2_idx).help_text_5            :=  '.';
                        lst_printed(deft2_idx).help_text_6            :=  'Please read all the guidance notes on the';
                        lst_printed(deft2_idx).help_text_7            :=  'back of this form - they set out the time limits';
                        lst_printed(deft2_idx).help_text_8            :=  'and tell you what you can do about the claim';
                        lst_printed(deft2_idx).help_text_9            :=  '.';
                        lst_printed(deft2_idx).help_text_10           :=  'You can respond to this claim online. Log on';
                        lst_printed(deft2_idx).help_text_11           :=  'to' ;
                        lst_printed(deft2_idx).help_text_12           :=  'www.moneyclaim.gov.uk';
                        lst_printed(deft2_idx).help_text_13           :=  '.' ;
                        lst_printed(deft2_idx).help_text_14           :=  'You will need the claim number';
                        lst_printed(deft2_idx).help_text_15           :=  '(see above)';
                        lst_printed(deft2_idx).help_text_16           :=  'and the following password';
                        lst_printed(deft2_idx).help_text_17           :=  lst_requests(request_idx).def2_password;
                        lst_printed(deft2_idx).p2_claimant_name_1     :=  lst_requests(request_idx).claimant_name_1;
                        lst_printed(deft2_idx).p2_claimant_name_2     :=  lst_requests(request_idx).claimant_name_2;
                        lst_printed(deft2_idx).p2_deft_name_1         :=  lst_requests(request_idx).def2_name_1;
                        lst_printed(deft2_idx).p2_deft_name_2         :=  lst_requests(request_idx).def2_name_2;
                        lst_printed(deft2_idx).p2_help_text_1         := 'If you want to defend all or part of this claim or request';
                        lst_printed(deft2_idx).p2_help_text_2         := 'additional time to prepare your defence you can respond';
                        lst_printed(deft2_idx).p2_help_text_3         := 'online, by logging on to';
                        lst_printed(deft2_idx).p2_help_text_4         := 'www.moneyclaim.gov.uk';
                        lst_printed(deft2_idx).p2_help_text_5         := 'You will need the claim number and password from the';
                        lst_printed(deft2_idx).p2_help_text_6         := 'front of the claim form.';
                        lst_printed(deft2_idx).p2_help_text_7         := 'More help and information can be found online or by';
                        lst_printed(deft2_idx).p2_help_text_8         := 'telephoning the court on the number shown on the front';
                        lst_printed(deft2_idx).p2_help_text_9         := 'of the claim form.';
                        -- calculate N1 page counts
                        lst_printed(deft2_idx).page_1_count           := (request_idx * 4) - 3;
                        lst_printed(deft2_idx).page_2_count           := (request_idx * 4) - 2;
                        lst_printed(deft2_idx).page_3_count           := (request_idx * 4) - 1;
                        lst_printed(deft2_idx).page_4_count           := (request_idx * 4);

                        -- set court address to either the MCOL address if the coded_creditor is 1999
                        -- or the bulk claims court. Note: legacy code puts postcode in address 5 so 
                        -- we have to do the same
                        IF lst_requests(request_idx).coded_creditor = 1999 THEN
                            -- use the mcol address
                            lst_printed(deft2_idx).court_address_1        :=  mcol_address.name;
                            lst_printed(deft2_idx).court_address_2        :=  mcol_address.address_line1;
                            lst_printed(deft2_idx).court_address_3        :=  mcol_address.address_line2;
                            lst_printed(deft2_idx).court_address_4        :=  mcol_address.address_line3;
                            lst_printed(deft2_idx).court_address_5        :=  mcol_address.postcode;
                            lst_printed(deft2_idx).court_postcode         :=  NULL;
                            lst_printed(deft2_idx).p2_court_address       :=  mcol_address.name||' '||
                                                                                mcol_address.address_line1||' '||
                                                                                mcol_address.address_line2||' '||
                                                                                mcol_address.address_line3||' '||
                                                                                mcol_address.postcode;
                            lst_printed(deft2_idx).court_tel_number       :=  mcol_address.telephone_no;
                            -- no claimant telephone for MCOL claims
                            lst_printed(deft2_idx).claimant_tel_number    := NULL;
                        ELSE
                            -- use the bulk claims address
                            lst_printed(deft2_idx).court_address_1        :=  bulk_address.name;
                            lst_printed(deft2_idx).court_address_2        :=  bulk_address.address_line1;
                            lst_printed(deft2_idx).court_address_3        :=  bulk_address.address_line2;
                            lst_printed(deft2_idx).court_address_4        :=  bulk_address.address_line3;
                            lst_printed(deft2_idx).court_address_5        :=  bulk_address.postcode;
                            lst_printed(deft2_idx).court_postcode         :=  NULL;
                            lst_printed(deft2_idx).p2_court_address       :=  bulk_address.name||' '||
                                                                                bulk_address.address_line1||' '||
                                                                                bulk_address.address_line2||' '||
                                                                                bulk_address.address_line3||' '||
                                                                                mcol_address.postcode;
                            lst_printed(deft2_idx).court_tel_number       :=  bulk_address.telephone_no;
                            -- claimant telephone is set for  bulk claims
                            OPEN cur_get_claimant_tel (lst_requests(request_idx).coded_creditor);
                            FETCH cur_get_claimant_tel INTO lst_printed(deft2_idx).claimant_tel_number;
                            CLOSE cur_get_claimant_tel;

                        END IF;

                        -- increment omr code and rec_no in preparation for
                        -- inserting the next print claims record
                        nv_rec_no := nv_rec_no + 1;
                        IF nv_omr_code = 7 THEN
                            nv_omr_code := 1;
                        ELSE
                            nv_omr_code := nv_omr_code + 1;
                        END IF;

                    END IF;
                    -- Insert record into the MCOL_DATA table with 'I'ssued status
                    -- Note: it is not possible to use FORALL bulk collection syntax
                    -- with a database link, so we have do a single row insert
                    -- An on-insert trigger on the table fires to populate the primary key
                    -- column of mcol_data_t_id
                    
                    current_statement := 'Inserting MCOL data for '||TO_CHAR(lst_requests(request_idx).claim_number);
                    
                    INSERT INTO mcol_data@cpt_mcol_link
                        (
                        claim_number,
                        claim_status,
                        issue_date,
                        reject_code,
                        claimant_name_1,
                        claimant_name_2,
                        deft1_name_1,
                        deft1_name_2,
                        deft1_password,
                        deft2_name_1,
                        deft2_name_2,
                        deft2_password,
                        claim_amount,
                        court_fee,
                        solicitors_costs,
                        total_amount
                        )
                    VALUES
                        (
                        lst_requests(request_idx).claim_number,
                        'I',
                        rec_date.issue_date,
                        NULL, -- reject code
                        lst_requests(request_idx).claimant_name_1,
                        lst_requests(request_idx).claimant_name_2,
                        lst_requests(request_idx).def1_name_1,
                        lst_requests(request_idx).def1_name_2,
                        v_password_1,
                        lst_requests(request_idx).def2_name_1,
                        lst_requests(request_idx).def2_name_2,
                        v_password_2,
                        lst_requests(request_idx).claim_amount,
                        lst_requests(request_idx).court_fee,
                        lst_requests(request_idx).solicitors_costs,
                        lst_requests(request_idx).total_amount
                        );
                    
                    -- record the  number of accepted claims and
                    -- keep a running total of court fees for all
                    -- accepted claims
                    n_accepted_count := n_accepted_count + 1;
                    n_accepted_court_fees_total := n_accepted_court_fees_total + lst_requests(request_idx).court_fee;
                    
                    
                    
                ELSE
                    -- coded party not known to CASEMAN
                    -- This is never expected to happen in practice
                            
                    DBMS_OUTPUT.PUT_LINE('ERROR : coded_creditor '||
                                         lst_requests(request_idx).coded_creditor||
                                         ' not known to CASEMAN. Claim number '||
                                         lst_requests(request_idx).claim_number||
                                         ' will not be processed');

                    -- record the  number of rejected claims and
                    -- keep a running total of court fees for all
                    -- rejected claims
                                              
                    n_rejected_count := n_rejected_count + 1;
                    -- DBMS_OUTPUT.PUT_LINE('Rejected count = '||TO_CHAR(n_rejected_count));
                    
                    n_rejected_court_fees_total := n_rejected_court_fees_total + lst_requests(request_idx).court_fee;
                            
                    /*  Since we do have a valid coded creditor, we cannot add a record to the statistics
                     *   table for this claim
                     */  

                    -- Insert record into the MCOL_DATA table with 'R'ejected status
                    -- Note: it is not possible to use FORALL bulk collection syntax
                    -- with a database link, so we have do a single row insert
                    -- An on-insert trigger on the table fires to populate the primary key
                    -- column of mcol_data_t_id

                    current_statement := 'rejecting claim in MCOL for '||TO_CHAR(lst_requests(request_idx).claim_number);

                    INSERT INTO mcol_data@cpt_mcol_link
                        (
                        claim_number,
                        claim_status,
                        issue_date,
                        reject_code,
                        court_fee
                        )
                    VALUES
                        (
                        lst_requests(request_idx).claim_number,
                        'R', -- rejected status
                        NULL,
                        24,
                        lst_requests(request_idx).court_fee
                        );
                        
                END IF; -- end of coded creditor check

                CLOSE cur_party_chk;
                                
            END LOOP; --end of claims processing loop
            
        DBMS_OUTPUT.PUT_LINE('.');

        -- DBMS_OUTPUT.PUT_LINE('All claims processed. About to do bulk inserts');
        -- all claims have been processed or rejected
        -- report on number of claims processed or rejected
        
        -- store the collected data into the database
        
        -- NOTE: where collections could be sparsely populated
        -- if one or more claims have been rejected, the FORALL
        -- indices syntax is used

        --DBMS_OUTPUT.PUT_LINE('Bulk Insert into claims '||lst_claims.COUNT);
        --DBMS_OUTPUT.PUT_LINE('accepted claims '||n_accepted_count);
        
        
        current_statement := 'Bulk Insert of CLAIMS';       
        
        FORALL i IN INDICES OF lst_claims
            INSERT INTO cpt_claims VALUES lst_claims(i);
        
        -- DBMS_OUTPUT.PUT_LINE('Bulk Insert into defendants');

        current_statement := 'Bulk Insert of DEFENDANTS';
        
        FORALL i IN INDICES OF lst_defendants
            INSERT INTO cpt_defendants VALUES lst_defendants(i);

        -- DBMS_OUTPUT.PUT_LINE('Bulk Insert into statistics');
        
        current_statement := 'Bulk Insert of STATISTICS';
        
        FORALL i IN INDICES OF lst_statistics
            INSERT INTO cpt_statistics VALUES lst_statistics(i);

        current_statement := 'Bulk Insert of cases into CASEMAN ';
        
        FORALL i IN INDICES OF lst_cases
            INSERT INTO load_cases VALUES lst_cases(i);

        current_statement := 'Bulk Insert of printed_claims ';
        
        FORALL i IN INDICES OF lst_printed
            INSERT INTO cpt_print_claims VALUES lst_printed(i);
        
        -- clear collections for next iteration of loop
        lst_cases       := empty_cases;
        lst_defendants  := empty_defendants;
        lst_claims      := empty_claims;
        lst_statistics  := empty_statistics;
        lst_printed     := empty_printed;
        
        --DBMS_OUTPUT.PUT_LINE(' case collection cleared count = '||lst_cases.count);
        --DBMS_OUTPUT.PUT_LINE(' defendants collection cleared count = '||lst_defendants.count);
        --DBMS_OUTPUT.PUT_LINE(' claims collection cleared count = '||lst_claims.count);
        --DBMS_OUTPUT.PUT_LINE(' stats collection cleared count = '||lst_statistics.count);
        --DBMS_OUTPUT.PUT_LINE(' printed collection cleared count = '||lst_printed.count);
        
        COMMIT;
        EXIT WHEN cur_requests%NOTFOUND;  
    END LOOP; -- end of cursor processing loop

    -- mark the claim requests as having been processed
    -- by updating the tape_files table.

    current_statement := 'update of tape_files in MCOL';
    
    -- have to use individual updates on remote table

    IF lst_tape_seq.COUNT > 0 THEN
        -- We have at least one tape file record to update
        FOR i IN lst_tape_seq.FIRST..lst_tape_seq.LAST
            LOOP
                UPDATE      tape_files@cpt_mcol_link
                SET         status          = 'T',
                            comments        = 'Transferred on '||TO_CHAR(rec_date.issue_date, 'DD-MON-YYYY ')
                WHERE       status          = 'L'
                AND         tape_file_seq     = lst_tape_seq(i);    
            END LOOP;
    END IF;
    
    DBMS_OUTPUT.PUT_LINE('SDT CPC - has processed '||n_accepted_count||' claims on '||TO_CHAR(rec_date.issue_date, 'DD/MON/YYYY '));
            
    IF n_rejected_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('SDT CPT - rejected '||n_rejected_count||' claims on '||TO_CHAR(rec_date.issue_date, 'DD/MON/YYYY'));
    END IF;
            
    --DBMS_OUTPUT.PUT_LINE('Insert into liberata_total_fees');
        
    current_statement := 'insert into LIBERATA_TOTAL_FEES';

    INSERT INTO cpt_liberata_total_fees
        (
        issue_date,
        report_line_string
        )
    VALUES
        (
        rec_date.issue_date,
        TO_CHAR(rec_date.issue_date,'DD-MON-YYYY')||','||
        TO_CHAR(n_accepted_count)||','||
        TO_CHAR(n_accepted_court_fees_total, '999999990.00')||','||
        TO_CHAR(n_rejected_count)||','||
        TO_CHAR(n_rejected_court_fees_total,'999999990.00')
        );
    
    IF  n_accepted_count + n_rejected_count = 0 THEN 
        -- no claims have been been found for processing
        DBMS_OUTPUT.PUT_LINE('SDT CPT - No Claims found for processing ');
    END IF; -- end of lst_requests.count if statement
    
    IF  expected_claims != n_accepted_count + n_rejected_count THEN
        -- we have a mismatch between the expected claims reported in
        -- the tape_files table and actual claims found in the claims.
        -- report the problem, but continune to process claims
        DBMS_OUTPUT.PUT_LINE('Warning: Expected claims = '||TO_CHAR(expected_claims)||
                                 ' Actual claims found = '||TO_CHAR(n_accepted_count + n_rejected_count));
    END IF;


    CLOSE cur_requests;
    
    IF  (n_accepted_count + n_rejected_count) > 0 THEN
        -- If we have processed claims tell MCOL by calling the following MCOL procedure
        exec_ols_cpc_package.exec_p_data_to_mcol@cpt_mcol_link;
    END IF;
    -- all done so commit
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('.');
    DBMS_OUTPUT.PUT_LINE('SDT CPT - Finished processing claims at '||TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('No Claims found to process at '||TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));
        IF cur_requests%ISOPEN THEN
            CLOSE cur_requests;
        END IF;
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
        DBMS_OUTPUT.PUT_LINE('while executing procedure cpt_process_claims at '||current_statement);
        DBMS_OUTPUT.PUT_LINE('processing claim '||current_claim);
        DBMS_OUTPUT.PUT_LINE('Rolling Back changes');
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('SDT CPT - Claims processing Failed at '||TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI:SS'));
        IF cur_requests%ISOPEN THEN
            CLOSE cur_requests;
        END IF;
        -- re-raise exception so control.sh and autosys picks up the failure
        RAISE;
END; -- end of cpt_process_claims procedure
END; -- cpt_claims_pack
/