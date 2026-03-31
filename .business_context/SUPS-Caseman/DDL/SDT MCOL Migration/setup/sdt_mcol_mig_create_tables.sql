PROMPT ************************************************************************
PROMPT Create Table tmp_mcol_mig_info
PROMPT ************************************************************************

CREATE TABLE tmp_mcol_mig_info
	(cred_code 				NUMBER(4) 	PRIMARY KEY
	,count_claims 			NUMBER(8)
	,transferred_claims 	NUMBER(8)
	,count_judgments 		NUMBER(8)
	,transferred_judgments	NUMBER(8)
	,count_warrants			NUMBER(8)
	,transferred_warrants	NUMBER(8)
	,count_parties			NUMBER(8)
	,transferred_parties	NUMBER(8)
	,count_events			NUMBER(8)
	,transferred_events		NUMBER(8)
	,failed_claims			NUMBER(8)
	,migration_date			DATE
	,migration_complete		VARCHAR2(1)
	);

PROMPT ************************************************************************
PROMPT Table tmp_mcol_mig_info created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table tmp_mcol_mig_cred_claims
PROMPT ************************************************************************

CREATE TABLE tmp_mcol_mig_cred_claims
	(case_number 		VARCHAR2(8) 	PRIMARY KEY
	,date_of_issue		DATE
	,created_in_range 	VARCHAR2(1)
	,event_activity 	VARCHAR2(1)
	,failed 			VARCHAR2(1)
	,processed			VARCHAR2(1)
	);

PROMPT ************************************************************************
PROMPT Table tmp_mcol_mig_cred_claims created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table tmp_mcol_mig_failures
PROMPT ************************************************************************

CREATE TABLE tmp_mcol_mig_failures
	(case_number 		VARCHAR2(8)
	,cred_code 			NUMBER(4)
	,failure_reason 	VARCHAR2(80)
	);
	
ALTER TABLE tmp_mcol_mig_failures
	ADD CONSTRAINT  tmp_mcol_mig_failures_pk PRIMARY KEY (case_number,failure_reason);

PROMPT ************************************************************************
PROMPT Table tmp_mcol_mig_failures created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table tmp_mcol_mig_event_mapping
PROMPT ************************************************************************

CREATE TABLE tmp_mcol_mig_event_mapping
	(std_event_id 	NUMBER(3) 	PRIMARY KEY
	,mcol_type 		VARCHAR2(2)
	);

PROMPT ************************************************************************
PROMPT Table tmp_mcol_mig_event_mapping created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table tmp_mcol_mig_status_mapping
PROMPT ************************************************************************

CREATE TABLE tmp_mcol_mig_status_mapping
	(claim_status	VARCHAR2(12) 	PRIMARY KEY
	,mcol_type 		VARCHAR2(2)
	);

PROMPT ************************************************************************
PROMPT Table tmp_mcol_mig_status_mapping created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table mcol_mig_claim_data
PROMPT ************************************************************************

CREATE TABLE mcol_mig_claim_data
	(case_number 				VARCHAR2(8) 	PRIMARY KEY
	,cred_code 					NUMBER(4)		NOT NULL
	,status 					VARCHAR2(2)
	,amount_claimed 			NUMBER(*,2)
	,court_fee 					NUMBER(*,2)
	,solicitors_costs 			NUMBER(*,2)
	,date_of_issue 				DATE
	,particulars_of_claim 		VARCHAR2(2000)
	,batch_number				NUMBER(4)		NOT NULL
	);
	
CREATE INDEX mcol_mig_claim_data_idx1 ON mcol_mig_claim_data
    (cred_code);
	
CREATE INDEX mcol_mig_claim_data_idx2 ON mcol_mig_claim_data
    (batch_number);

PROMPT ************************************************************************
PROMPT Table mcol_mig_claim_data created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table mcol_mig_party_data
PROMPT ************************************************************************

CREATE TABLE mcol_mig_party_data
	(case_number 			VARCHAR2(8)		NOT NULL
	,cred_code 				NUMBER(4)		NOT NULL
	,party_role_code 		VARCHAR2(10)	NOT NULL
	,case_party_no 			NUMBER(4)		NOT NULL
	,bar_judgment 			VARCHAR2(1)
	,reference 				VARCHAR2(25)
	,date_of_service 		DATE
	,person_requested_name 	VARCHAR2(70)
	,person_dob 			DATE
	,address_line1 			VARCHAR2(35)
	,address_line2 			VARCHAR2(35)
	,address_line3 			VARCHAR2(35)
	,address_line4 			VARCHAR2(35)
	,address_line5 			VARCHAR2(35)
	,postcode 				VARCHAR2(8)
	,payee_name 			VARCHAR2(70)
	,payee_address_line1 	VARCHAR2(35)
	,payee_address_line2 	VARCHAR2(35)
	,payee_address_line3 	VARCHAR2(35)
	,payee_address_line4 	VARCHAR2(35)
	,payee_address_line5 	VARCHAR2(35)
	,payee_postcode 		VARCHAR2(8)
	);
	
ALTER TABLE mcol_mig_party_data
	ADD CONSTRAINT  mcol_mig_party_data_pk PRIMARY KEY (case_number,case_party_no,party_role_code);
	
CREATE INDEX mcol_mig_party_data_idx1 ON mcol_mig_party_data
    (cred_code);

PROMPT ************************************************************************
PROMPT Table mcol_mig_party_data created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table mcol_mig_judgment_data
PROMPT ************************************************************************

CREATE TABLE mcol_mig_judgment_data
	(case_number 					VARCHAR2(8)		NOT NULL
	,cred_code 						NUMBER(4)		NOT NULL
	,against_case_party_no 			NUMBER(4)		NOT NULL
	,judgment_type 					VARCHAR2(16)
	,judgment_date 					DATE			NOT NULL
	,status 						VARCHAR2(15)
	,joint_judgment					VARCHAR2(1)
	,judgment_amount 				NUMBER(*,2)
	,paid_before_judgment 			NUMBER(*,2)
	,total_costs 					NUMBER(*,2)
	,instalment_amount 				NUMBER(*,2)
	,instalment_period 				VARCHAR2(3)
	,first_payment_date 			DATE
	);
	
ALTER TABLE mcol_mig_judgment_data
	ADD CONSTRAINT  mcol_mig_judgment_data_pk PRIMARY KEY (case_number,against_case_party_no);
	
CREATE INDEX mcol_mig_judgment_data_idx1 ON mcol_mig_judgment_data
    (cred_code);

PROMPT ************************************************************************
PROMPT Table mcol_mig_judgment_data created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table mcol_mig_warrant_data
PROMPT ************************************************************************

CREATE TABLE mcol_mig_warrant_data
	(case_number 					VARCHAR2(8)		NOT NULL
	,warrant_number					VARCHAR2(8)		NOT NULL
	,cred_code 						NUMBER(4)		NOT NULL
	,balance_after_paid 			NUMBER(*,2)
	,warrant_amount 				NUMBER(*,2)
	,warrant_fee 					NUMBER(*,2)
	,solicitor_costs 				NUMBER(*,2)
	,notes							VARCHAR2(120)
	,executing_court 				NUMBER(3)
	,def1_case_party_no 			NUMBER(4)
	,warrant_issue_date 			DATE
	);
	
ALTER TABLE mcol_mig_warrant_data
	ADD CONSTRAINT  mcol_mig_warrant_data_pk PRIMARY KEY (case_number,warrant_number);
	
CREATE INDEX mcol_mig_warrant_data_idx1 ON mcol_mig_warrant_data
    (cred_code);

PROMPT ************************************************************************
PROMPT Table mcol_mig_warrant_data created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Table mcol_mig_event_data
PROMPT ************************************************************************

CREATE TABLE mcol_mig_event_data
	(case_number 		VARCHAR2(8)		NOT NULL
	,cred_code 			NUMBER(4)		NOT NULL
	,mcol_event_type	VARCHAR2(2)
	,event_date 		DATE			NOT NULL
	,case_party_no 		NUMBER(4)
	,warrant_number		VARCHAR2(8)
	,return_code 		VARCHAR2(3)
	,return_info 		VARCHAR2(140)
	);
	
CREATE INDEX mcol_mig_event_data_idx1 ON mcol_mig_event_data
    (case_number);
	
CREATE INDEX mcol_mig_event_data_idx2 ON mcol_mig_event_data
    (cred_code);

PROMPT ************************************************************************
PROMPT Table mcol_mig_event_data created
PROMPT ************************************************************************