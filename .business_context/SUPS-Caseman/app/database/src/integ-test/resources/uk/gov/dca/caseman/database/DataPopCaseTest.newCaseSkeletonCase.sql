SET TRIMSPOOL ON
SET FEEDBACK ON
SET PAGES 60
SET LINESIZE 1000
SET SERVEROUTPUT ON 1000000

ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-YYYY HH24:MI:SS';

SPOOL ./test/out/DataPopCaseTest.newCaseSkeletonCase.out

PROMPT p_user    = &&1
PROMPT p_pwd     = &&2
PROMPT p_sid     = &&3
PROMPT fourth parameter  = &&4


DEFINE p_user    = &&1
DEFINE p_pwd     = &&2
DEFINE p_sid     = &&3
 
PROMPT -- Make any necessary changes to the database contents for the test to work.
PROMPT
@@CommonDeleteMcolCcbcData.sql
@@CommonDeleteMcolData.sql

PROMPT -- Reset ALL MCOL and MCOL_CCBC sequences to ensure consistent ids in the .out files when comparing against the .out.good files.
@@DataPopResetSequence.sql

PROMPT ========================================================================
PROMPT == POPULATE MCOL TABLES 
PROMPT ========================================================================
PROMPT
PROMPT ====================================================
PROMPT == DISABLE PARTY AND PARTY_DETAILS CONSTRAINTS
PROMPT ====================================================
PROMPT
PROMPT -- ALTER TABLE mcol.party ENABLE CONSTRAINT fk_party;
ALTER TABLE mcol.party DISABLE CONSTRAINT fk_party;

PROMPT -- ALTER TABLE mcol.party DISABLE CONSTRAINT fk_party_2;
ALTER TABLE mcol.party DISABLE CONSTRAINT fk_party_2;

PROMPT ====================================================
PROMPT == Set up a registered Organisational SDT user
PROMPT ====================================================
PROMPT
PROMPT -- INSERT INTO mcol.party    
INSERT INTO mcol.party
    ( party_id, version, party_details_id, party_type, solicitor, direct_debit_details_id, current_direct_debit_status, ncp_id, bulk_customer_case_code, hmrc )
VALUES
    ( 200, 0, 300, 'ORG', 0, 400, 'G', 1700, 'VV', NULL ); 

PROMPT -- INSERT INTO mcol.party_details
INSERT INTO mcol.party_details
    ( party_details_id, version, party_id, title, first_name, second_name, date_of_birth, addressline1, addressline2, addressline3, addressline4, postcode, addressline5, dxnumber, faxnumber, telephone_number, email, marital_status, marital_status_other, address_update )
VALUES
    ( 300, 0, 200, 'Mr', 'SdtOrgUser', 'OrgSurname', NULL, '200 Org Avenue', 'Org Bridge', 'Orgton', 'Orgshire', 'ORGC ODE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0 );    

PROMPT -- INSERT INTO mcol.direct_debit_details
INSERT INTO mcol.direct_debit_details
    ( direct_debit_details_id, version, aramis_address_id, aramis_customer_id, aramis_customer_ref, party_id )
VALUES
    ( 400, 0, 1000000000, 1000000000, 'AR1000000000000', 200 );

PROMPT -- INSERT INTO mcol.muser 
INSERT INTO mcol.muser
    ( muser_id, version, party_id, emailaddress, type, credential_id, administrator )
VALUES
    ( 100, 0, 200, 'sdtuser@org.com', 0, 'SDTORG1', 1 );
    
    
PROMPT ====================================================
PROMPT == Set up a registered Solicitor SDT user
PROMPT ====================================================
PROMPT
PROMPT -- INSERT INTO mcol.party
INSERT INTO mcol.party
    ( party_id, version, party_details_id, party_type, solicitor, direct_debit_details_id, current_direct_debit_status, ncp_id, bulk_customer_case_code, hmrc )
VALUES
    ( 201, 0, 301, 'ORG', 1, 401, 'G', 1701, 'VV', NULL ); 

PROMPT -- INSERT INTO mcol.party_details
INSERT INTO mcol.party_details
    ( party_details_id, version, party_id, title, first_name, second_name, date_of_birth, addressline1, addressline2, addressline3, addressline4, postcode, addressline5, dxnumber, faxnumber, telephone_number, email, marital_status, marital_status_other, address_update )
VALUES
    ( 301, 0, 201, 'Mr', 'SdtSolUser', 'SolSurname', NULL, '201 Sol Avenue', 'Sol Bridge', 'Solton', 'Solshire', 'SOLC ODE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0 );

PROMPT -- INSERT INTO mcol.direct_debit_details
INSERT INTO mcol.direct_debit_details
    ( direct_debit_details_id, version, aramis_address_id, aramis_customer_id, aramis_customer_ref, party_id )
VALUES
    ( 401, 0, 1000000001, 1000000001, 'AR1000000000001', 201 );

PROMPT -- INSERT INTO mcol.muser
INSERT INTO mcol.muser
    ( muser_id, version, party_id, emailaddress, type, credential_id, administrator )
VALUES
    ( 101, 0, 201, 'sdtuser@sol.com', 0, 'SDTSOL1', 1 );

PROMPT ====================================================
PROMPT == ENABLE PARTY AND PARTY_DETAILS CONSTRAINTS
PROMPT ====================================================
PROMPT

PROMPT -- ALTER TABLE mcol.party ENABLE CONSTRAINT fk_party;
ALTER TABLE mcol.party ENABLE CONSTRAINT fk_party;

PROMPT -- ALTER TABLE mcol.party ENABLE CONSTRAINT fk_party_2;
ALTER TABLE mcol.party ENABLE CONSTRAINT fk_party_2;
    
PROMPT ====================================================
PROMPT == Set up the Organisational SDT skeletal case
PROMPT ====================================================
PROMPT
PROMPT -- INSERT INTO mcol.case
INSERT INTO mcol.case
    ( case_id, version, claim_number, amount_claimed, amount_claimed_currency_code, claim_court_fee, claim_court_fee_currency_code, solicitor_cost, solicitor_cost_currency_code, claim_total, claim_total_currency_code, claim_description, sdt_request_id)
VALUES
    ( 500, 0, '2QA09836', 100, 'GBP', 50,'GBP', 20, 'GBP', 170, 'GBP', 'Organisation skeletal case', NULL );

PROMPT -- INSERT INTO mcol.case_party_role (Claimant)
INSERT INTO mcol.case_party_role
    ( case_party_role_id, version, case_id, user_id, party_id, reference, role_type, role_number, defendant_password, first_name, second_name, archived, last_updated, last_claim_document_status, last_document_type, last_event_code, last_claim_status_date, claim_issue_date )
VALUES
    ( 600, 0, 500, NULL, NULL, NULL, 0, NULL, NULL, 'A', 'Claimant', '0', TO_DATE('2013-03-01 11:30:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:30:00','YYYY-MM-DD HH24:MI:SS') );
    
PROMPT -- INSERT INTO mcol.case_party_role (Defendant 1)
INSERT INTO mcol.case_party_role
    ( case_party_role_id, version, case_id, user_id, party_id, reference, role_type, role_number, defendant_password, first_name, second_name, archived, last_updated, last_claim_document_status, last_document_type, last_event_code, last_claim_status_date, claim_issue_date )
VALUES
    ( 601, 0, 500, NULL, NULL, NULL, 1, 1, 'Password', 'A', 'Defendant1', '0', TO_DATE('2013-03-01 11:31:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:31:00','YYYY-MM-DD HH24:MI:SS') );

PROMPT -- INSERT INTO mcol.case_party_role (Defendant 2)
INSERT INTO mcol.case_party_role
    ( case_party_role_id, version, case_id, user_id, party_id, reference, role_type, role_number, defendant_password, first_name, second_name, archived, last_updated, last_claim_document_status, last_document_type, last_event_code, last_claim_status_date, claim_issue_date )
VALUES
    ( 602, 0, 500, NULL, NULL, NULL, 1, 2, 'Password2', 'A', 'Defendant2', '0', TO_DATE('2013-03-01 11:32:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:32:00','YYYY-MM-DD HH24:MI:SS') );

PROMPT -- INSERT INTO mcol.case_party_role_event (Claimant)
INSERT INTO mcol.case_party_role_event
    ( case_party_role_event_id, version, case_party_role_id, event_date, event_code, event_reject_code , event_return_code, event_return_info, claim_transfer_court_name, warrant_number, created_on, sdt_request_id, ncp_id_from, ncp_id_to, judgment_type, joint_judgment, total, payment_type, instalment_amount, frequency, first_payment_date, in_full_by_date )
VALUES
    ( 700, 0, 600 , TO_DATE('2013-03-27 11:33:00','YYYY-MM-DD HH24:MI:SS'), 'CI', NULL, NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:33:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, NULL, NULL , NULL, NULL, NULL, NULL, NULL );
    
    
PROMPT ====================================================
PROMPT == Set up the Solicitor SDT skeletal case
PROMPT ====================================================
PROMPT
PROMPT -- INSERT INTO mcol.case
INSERT INTO mcol.case
    ( case_id, version, claim_number, amount_claimed, amount_claimed_currency_code, claim_court_fee, claim_court_fee_currency_code, solicitor_cost, solicitor_cost_currency_code, claim_total, claim_total_currency_code, claim_description, sdt_request_id)
VALUES
    ( 501, 0, 'A0JW1234', 0, 'GBP', 0,'GBP', 0, 'GBP', 0, 'GBP', 'Solicitor skeletal case', NULL );

PROMPT -- INSERT INTO mcol.case_party_role (Claimant)
INSERT INTO mcol.case_party_role
    ( case_party_role_id, version, case_id, user_id, party_id, reference, role_type, role_number, defendant_password, first_name, second_name, archived, last_updated, last_claim_document_status, last_document_type, last_event_code, last_claim_status_date, claim_issue_date )
VALUES
    ( 610, 0, 501, NULL, NULL, NULL, 0, NULL, NULL, 'A', 'Claimant', '0', TO_DATE('2013-03-01 11:30:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:30:00','YYYY-MM-DD HH24:MI:SS') );
    
PROMPT -- INSERT INTO mcol.case_party_role (Defendant 1)
INSERT INTO mcol.case_party_role
    ( case_party_role_id, version, case_id, user_id, party_id, reference, role_type, role_number, defendant_password, first_name, second_name, archived, last_updated, last_claim_document_status, last_document_type, last_event_code, last_claim_status_date, claim_issue_date )
VALUES
    ( 611, 0, 501, NULL, NULL, NULL, 1, 1, 'Password', 'A', 'Defendant1', '0', TO_DATE('2013-03-01 11:31:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:31:00','YYYY-MM-DD HH24:MI:SS') );

PROMPT -- INSERT INTO mcol.case_party_role (Defendant 2)
INSERT INTO mcol.case_party_role
    ( case_party_role_id, version, case_id, user_id, party_id, reference, role_type, role_number, defendant_password, first_name, second_name, archived, last_updated, last_claim_document_status, last_document_type, last_event_code, last_claim_status_date, claim_issue_date )
VALUES
    ( 612, 0, 501, NULL, NULL, NULL, 1, 2, 'Password2', 'A', 'Defendant2', '0', TO_DATE('2013-03-01 11:32:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:32:00','YYYY-MM-DD HH24:MI:SS') );

PROMPT -- INSERT INTO mcol.case_party_role_event (Claimant)
INSERT INTO mcol.case_party_role_event
    ( case_party_role_event_id, version, case_party_role_id, event_date, event_code, event_reject_code , event_return_code, event_return_info, claim_transfer_court_name, warrant_number, created_on, sdt_request_id, ncp_id_from, ncp_id_to, judgment_type, joint_judgment, total, payment_type, instalment_amount, frequency, first_payment_date, in_full_by_date )
VALUES
    ( 710, 0, 610 , TO_DATE('2013-03-01 11:33:00','YYYY-MM-DD HH24:MI:SS'), 'CI', NULL, NULL, NULL, NULL, NULL, TO_DATE('2013-03-01 11:33:00','YYYY-MM-DD HH24:MI:SS'), NULL, NULL, NULL, NULL, NULL, NULL , NULL, NULL, NULL, NULL, NULL );


PROMPT ========================================================================
PROMPT == POPULATE MCOL_CCBC TABLES 
PROMPT ========================================================================
PROMPT
PROMPT ========================================================================
PROMPT  Test 1 Data Description: 
PROMPT      A new Case data is created if there is no existing record in MCOL for
PROMPT      the exported CaseMan case.
PROMPT      New Case record.
PROMPT      New Case Party Records (linked to Registeredd user and party records).
PROMPT      New Case Party Role Events are created.
PROMPT                                
PROMPT ========================================================================
PROMPT
PROMPT -- INSERT INTO mcol_ccbc.case_data_request_t 
INSERT INTO mcol_ccbc.case_data_request_t 
    (request_id, case_number, caseman_status, mcol_populated, last_updated, reason)
VALUES (1, '2QA09811', 'C', NULL, TO_DATE('2014-04-01 00:00:00','YYYY-MM-DD HH24:MI:SS'), NULL);

PROMPT -- INSERT INTO mcol_ccbc.awaiting_data
INSERT INTO mcol_ccbc.awaiting_data
    ( sdt_request_id, case_number )
VALUES ( 1, '2QA09811' );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_claim_data_t 
INSERT INTO mcol_ccbc.mcol_mig_claim_data_t
       (case_number, cred_code, status, amount_claimed, court_fee, solicitors_costs, date_of_issue                                         , particulars_of_claim)
VALUES ('2QA09811' , 1700     , 'CI'  , 100           , 10       , 20              , TO_DATE('2013-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS'), RPAD('Particulars of claim  = 1172 chars.', 1172,' Particulars of claim  = 1172 chars.'));

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** CLAIMANT **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number , cred_code, party_role_code, case_party_no, bar_judgment, reference           , date_of_service, person_requested_name                  , person_dob                                            , address_line1     , address_line2     , address_line3, address_line4, address_line5, postcode , payee_name, payee_address_line1, payee_address_line2, payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('2QA09811', 1700     , 'CLAIMANT'     , '1'          , NULL        , 'CLAIMANT REFERENCE', NULL           , 'CLAIMANT FIRSTNAME            SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-03-31 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'CLAIMANT ADLINE1', 'CLAIMANT ADLINE2', NULL         , NULL         , NULL         , 'B13 9PP', NULL      , NULL               , NULL               , NULL               , NULL               , NULL               , NULL );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** DEFENDANT 1 **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number, cred_code, party_role_code, case_party_no, bar_judgment, reference, date_of_service                                       , person_requested_name                 , person_dob                                            , address_line1        , address_line2        , address_line3        , address_line4        , address_line5, postcode , payee_name, payee_address_line1, payee_address_line2, payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('2QA09811', 1700    , 'DEFENDANT'    , '1'          , 'N'         , NULL     , TO_DATE('2013-01-01 00:01:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 1 FIRSTNAME         SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-04-01 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 1 ADLINE1', 'DEFENDANT 1 ADLINE2', 'DEFENDANT 1 ADLINE3', 'DEFENDANT 1 ADLINE4', NULL         , 'B13 9PP', NULL       , NULL              , NULL               , NULL               , NULL               , NULL               , NULL );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** DEFENDANT 2 **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number, cred_code, party_role_code, case_party_no, bar_judgment, reference, date_of_service                                       , person_requested_name                 , person_dob                                            , address_line1        , address_line2        , address_line3        , address_line4        , address_line5, postcode , payee_name, payee_address_line1, payee_address_line2, payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('2QA09811', 1700    , 'DEFENDANT'    , '2'          , 'N'         , NULL     , TO_DATE('2013-01-01 00:02:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 2 FIRSTNAME         SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-04-02 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 2 ADLINE1', 'DEFENDANT 2 ADLINE2', 'DEFENDANT 2 ADLINE3', 'DEFENDANT 2 ADLINE4', NULL         , 'B13 9PP', NULL       , NULL              , NULL               , NULL               , NULL               , NULL               , NULL );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** SOLICITOR **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number, cred_code, party_role_code, case_party_no, bar_judgment, reference            , date_of_service, person_requested_name                  , person_dob                                            , address_line1      , address_line2      , address_line3, address_line4, address_line5, postcode , payee_name, payee_address_line1, payee_address_line2, payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('2QA09811', 1700    , 'SOLICITOR'    , '1'          , NULL        , 'SOLICITOR REFERENCE', NULL           , 'SOLICITOR FIRSTNAME           SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-03-30 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'SOLICITOR ADLINE1', 'SOLICITOR ADLINE2', NULL         , NULL         , NULL         , 'B37 7ES', NULL      , NULL               , NULL               , NULL               , NULL               , NULL               , NULL );
     

PROMPT ========================================================================
PROMPT  Test 2 Data Description: 
PROMPT      The data population process overwrites existing MCOL CASE table 
PROMPT       values with the data from CaseMan where it is different. 
PROMPT      Link Case party role(s) to registered user and party records.
PROMPT   
PROMPT  Expected Outcome:
PROMPT      Case: amount_claimed, court_fee, solicitors_costs, claim_total
PROMPT      are updated.
PROMPT       
PROMPT ========================================================================
PROMPT
PROMPT -- INSERT INTO mcol_ccbc.case_data_request_t 
INSERT INTO mcol_ccbc.case_data_request_t 
    (request_id, case_number, caseman_status, mcol_populated, last_updated, reason)
VALUES (2, 'A0JW1234', 'C', NULL, TO_DATE('2014-04-01 00:00:00','YYYY-MM-DD HH24:MI:SS'), NULL);

PROMPT -- INSERT INTO mcol_ccbc.awaiting_data
INSERT INTO mcol_ccbc.awaiting_data
    ( sdt_request_id, case_number )
VALUES ( 2, 'A0JW1234' );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_claim_data_t 
INSERT INTO mcol_ccbc.mcol_mig_claim_data_t
       (case_number, cred_code, status, amount_claimed, court_fee, solicitors_costs, date_of_issue                                         , particulars_of_claim)
VALUES ('A0JW1234' , 1701     , 'CI'  , 100           , 10       , 20              , TO_DATE('2013-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS'), RPAD('Particulars of claim  = 1172 chars.', 1172,' Particulars of claim  = 1172 chars.'));

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** CLAIMANT **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number , cred_code, party_role_code, case_party_no, bar_judgment, reference           , date_of_service, person_requested_name                  , person_dob                                            , address_line1     , address_line2     , address_line3, address_line4, address_line5, postcode , payee_name, payee_address_line1, payee_address_line2, payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('A0JW1234', 1701     , 'CLAIMANT'     , '1'          , NULL        , 'CLAIMANT REFERENCE', NULL           , 'CLAIMANT FIRSTNAME            SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-03-31 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'CLAIMANT ADLINE1', 'CLAIMANT ADLINE2', NULL         , NULL         , NULL         , 'B13 9PP', NULL      , NULL               , NULL               , NULL               , NULL               , NULL               , NULL );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** DEFENDANT 1 **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number, cred_code, party_role_code, case_party_no, bar_judgment, reference, date_of_service                                       , person_requested_name                  , person_dob                                            , address_line1        , address_line2        , address_line3        , address_line4        , address_line5, postcode , payee_name, payee_address_line1, payee_address_line2, payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('A0JW1234', 1701    , 'DEFENDANT'    , '1'          , 'N'         , NULL     , TO_DATE('2013-02-01 00:01:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 1 FIRSTNAME         SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-04-01 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 1 ADLINE1', 'DEFENDANT 1 ADLINE2', 'DEFENDANT 1 ADLINE3', 'DEFENDANT 1 ADLINE4', NULL         , 'B13 9PP', NULL       , NULL              , NULL               , NULL               , NULL               , NULL               , NULL );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** DEFENDANT 2 **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number, cred_code, party_role_code, case_party_no, bar_judgment, reference, date_of_service                                       , person_requested_name                  , person_dob                                            , address_line1        , address_line2        , address_line3        , address_line4        , address_line5, postcode , payee_name, payee_address_line1, payee_address_line2, payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('A0JW1234', 1701    , 'DEFENDANT'    , '2'          , 'N'         , NULL     , TO_DATE('2013-02-01 00:02:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 2 FIRSTNAME         SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-04-02 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'DEFENDANT 2 ADLINE1', 'DEFENDANT 2 ADLINE2', 'DEFENDANT 2 ADLINE3', 'DEFENDANT 2 ADLINE4', NULL         , 'B13 9PP', NULL       , NULL              , NULL               , NULL               , NULL               , NULL               , NULL );

PROMPT -- INSERT INTO mcol_ccbc.mcol_mig_party_data_t (** SOLICITOR **) 
INSERT INTO mcol_ccbc.mcol_mig_party_data_t
    ( case_number, cred_code, party_role_code, case_party_no, bar_judgment, reference            , date_of_service, person_requested_name        , person_dob                                                      , address_line1      , address_line2      , address_line3, address_line4, address_line5, postcode , payee_name            , payee_address_line1     , payee_address_line2     , payee_address_line3, payee_address_line4, payee_address_line5, payee_postcode )
VALUES ('A0JW1234', 1701    , 'SOLICITOR'    , '1'          , NULL        , 'SOLICITOR REFERENCE', NULL           , 'SOLICITOR FIRSTNAME           SURNAME0123456789X0123456789Y0123456789Z', TO_DATE('1974-03-30 00:00:00','YYYY-MM-DD HH24:MI:SS'), 'SOLICITOR ADLINE1', 'SOLICITOR ADLINE2', NULL         , NULL         , NULL         , 'B37 7ES', 'CORRESPONDANCE PAYEE', 'CORRESPONDANCE ADLINE1', 'CORRESPONDANCE ADLINE2', NULL               , NULL               , NULL               , 'CORR COD' );
     
COMMIT;    
	
-- Mark start of test so that results can be compared from this point onwards.
PROMPT '#####################'
PROMPT '##  Tests Started  ##'
PROMPT '#####################'

PROMPT =========================================================================
PROMPT  TABLES *** BEFORE *** DATA POPULATION
PROMPT =========================================================================
PROMPT
-- Do pre-test checks so that state of the database is part of the 'good' file 
-- and can be checked as part of the test results.
@@CommonSelectMcolCcbcData.sql
@@CommonSelectMcolData.sql

PROMPT =============================================================
PROMPT  CALL DATA POPULATION: mcol_ccbc.mcol_pop_main.populate_mcol
PROMPT =============================================================

VAR  o_cases_completed_pop_count   VARCHAR2(8)
VAR  o_cases_completed_excep_count VARCHAR2(8)
VAR  o_cases_failed_no_pop_count   VARCHAR2(8)

exec mcol_ccbc.mcol_pop_main.populate_mcol -
         ( :o_cases_completed_pop_count -
         , :o_cases_completed_excep_count -
         , :o_cases_failed_no_pop_count -
         );

PROMPT ===
PROMPT  OUTPUT PARAMETERS FOR: mcol_ccbc.mcol_pop_main.populate_mcol
PROMPT ===

PRINT o_cases_completed_pop_count
PRINT o_cases_completed_excep_count
PRINT o_cases_failed_no_pop_count


PROMPT =========================================================================
PROMPT  TABLES *** AFTER *** DATA POPULATION
PROMPT =========================================================================
PROMPT
-- Check contents of database AFTER THE TEST HAS RUN to ensure all is well. Again, 
-- this is captured in a good file and is checked as part of the test results. 
-- Do pre-test checks so that the state of the database is part of the 'good' 
-- file and can be checked as part of the test results.
@@CommonSelectMcolCcbcData.sql
@@CommonSelectMcolData.sql

-- Mark end of test so that results are not compared after this point.
PROMPT '#####################'
PROMPT '## Tests Completed ##'
PROMPT '#####################'

-- Always end test script with the following.
SPOOL OFF
EXIT
/
SHOW ERRORS