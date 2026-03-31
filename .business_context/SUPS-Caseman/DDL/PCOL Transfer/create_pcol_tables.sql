WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script creates the new PCOL transfer tables.
|                   
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. Logica's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$   Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_XXXX.log

PROMPT ************************************************************************
PROMPT Creating the PCOL_CASES table
PROMPT ************************************************************************

CREATE TABLE pcol_cases
(
	rectype				VARCHAR2(2),
	case_number			VARCHAR2(8) 	NOT NULL,
	case_type			VARCHAR2(20),
	admin_crt_code		NUMBER(3),
	amount_claimed		NUMBER(8,2),
	court_fee			NUMBER(6,2),
	solicitors_costs	NUMBER(5,2),
	total				NUMBER(9,2),
	date_of_issue		VARCHAR2(15),
	rep_code			NUMBER(4),
	rep_name			VARCHAR2(70),
	rep_addr_1			VARCHAR2(35),
	rep_addr_2			VARCHAR2(35),
	rep_addr_3			VARCHAR2(35),
	rep_addr_4			VARCHAR2(35),
	rep_addr_5			VARCHAR2(35),
	rep_postcode		VARCHAR2(8),
	rep_tel_no			VARCHAR2(24),
	reference			VARCHAR2(24),
	rep_dx				VARCHAR2(30),
	pltf_code			NUMBER(4),
	plaintiff_details_1	VARCHAR2(70),
	plaintiff_details_2	VARCHAR2(35),
	plaintiff_details_3	VARCHAR2(35),
	plaintiff_details_4	VARCHAR2(35),
	plaintiff_details_5	VARCHAR2(35),
	plaintiff_details_6	VARCHAR2(35),
	plaintiff_details_7	VARCHAR2(35),
	pltf_tel_no			VARCHAR2(24),
	plaintiff_reference	VARCHAR2(24),
	pltf_dx				VARCHAR2(30),
	trans_crt_code		NUMBER(3),
	transfer_reason		VARCHAR2(20),
	processed			VARCHAR2(1),
	trans_seq			NUMBER(3)
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_DEFENDANTS table
PROMPT ************************************************************************
		
CREATE TABLE pcol_defendants
(
	rectype					VARCHAR2(2),
	case_number				VARCHAR2(8)		NOT NULL,
	id						NUMBER(1)		NOT NULL,
	name					VARCHAR2(70),
	date_of_service_other	VARCHAR2(15),
	sol_code				NUMBER(4),
	solicitor_name			VARCHAR2(70),
	solicitor_addr_1		VARCHAR2(35),
	solicitor_addr_2		VARCHAR2(35),
	solicitor_addr_3		VARCHAR2(35),
	solicitor_addr_4		VARCHAR2(35),
	solicitor_addr_5		VARCHAR2(35),
	solicitor_postcode		VARCHAR2(8),
	solicitor_tel_no		VARCHAR2(24),
	sol_dx					VARCHAR2(30),
	method_of_service		VARCHAR2(10),
	trans_seq				NUMBER(3)
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_ADDRESSES table
PROMPT ************************************************************************
			
CREATE TABLE pcol_addresses
(
	rectype				VARCHAR2(2),
	deft_case_number	VARCHAR2(8),
	deft_id				NUMBER(1),
	addr_type			VARCHAR2(10),
	addr_1				VARCHAR2(35),
	addr_2				VARCHAR2(35),
	addr_3				VARCHAR2(35),
	addr_4				VARCHAR2(35),
	addr_5				VARCHAR2(35),
	postcode			VARCHAR2(8),
	username			VARCHAR2(20),
	valid_from			VARCHAR2(15),
	valid_to			VARCHAR2(15),
	dx					VARCHAR2(30),
	tel_no				VARCHAR2(24),
	trans_seq			NUMBER(3)
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_EVENTS table
PROMPT ************************************************************************
		
CREATE TABLE pcol_events
(
	rectype				VARCHAR2(2),
	event_seq			NUMBER,
	case_number			VARCHAR2(8),
	std_event_id		NUMBER(3),
	deft_case_number	VARCHAR2(8),
	deft_id				NUMBER(1),
	requester			VARCHAR2(20),
	details				VARCHAR2(2000),
	event_date			VARCHAR2(15),
	result				VARCHAR2(12),
	wrt_number			VARCHAR2(8),
	judg_seq			NUMBER(9),
	vary_seq			NUMBER(9),
	hrg_seq				NUMBER(9),
	deleted_flag		VARCHAR2(1),
	username			VARCHAR2(30),
	receipt_date		VARCHAR2(15),
	bms_task_number		VARCHAR2(5),
	stats_module		VARCHAR2(5),
	age_category		VARCHAR2(10),
	crt_code			NUMBER(3),
	result_date			VARCHAR2(15),
	trans_seq			NUMBER(3)
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_JUDGMENTS table
PROMPT ************************************************************************
			
CREATE TABLE pcol_judgments
(
	rectype					VARCHAR2(2),
	judg_seq				NUMBER(9)		NOT NULL,
	deft_case_number		VARCHAR2(8),
	deft_id					NUMBER(1),
	judgment_for			VARCHAR2(10),
	judgment_type			VARCHAR2(16),
	joint_judgment			VARCHAR2(1),
	judgment_date			VARCHAR2(15),
	sent_to_rtl				VARCHAR2(15),
	status_to_rtl			VARCHAR2(1),
	date_of_final_payment	VARCHAR2(15),
	status					VARCHAR2(15),
	judgment_amount			NUMBER(8,2),
	total_costs				NUMBER(7,2),
	paid_before_judgment	NUMBER(8,2),
	total					NUMBER(9,2),
	instalment_amount		NUMBER(9,2),
	instalment_period		VARCHAR2(3),
	first_payment_date		VARCHAR2(15),
	payee_name				VARCHAR2(70),
	payee_addr_1			VARCHAR2(35),
	payee_addr_2			VARCHAR2(35),
	payee_addr_3			VARCHAR2(35),
	payee_addr_4			VARCHAR2(35),
	payee_addr_5			VARCHAR2(35),
	payee_postcode			VARCHAR2(8),
	payee_tel_no			VARCHAR2(24),
	judgment_court_code		NUMBER(3),
	trans_seq				NUMBER(3)
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_WARRANTS table
PROMPT ************************************************************************
			
CREATE TABLE pcol_warrants
(
	rectype					VARCHAR2(2),
	local_warrant_number	VARCHAR2(8),
	warrant_number			VARCHAR2(8)		NOT NULL,
	issued_by				NUMBER(3)		NOT NULL,
	case_number				VARCHAR2(8),
	balance_after_paid		NUMBER(10,2),
	warrant_amount			NUMBER(7,2),
	warrant_issue_date		VARCHAR2(15),
	warrant_type			VARCHAR2(10),
	executed_by				NUMBER(3),
	plaintiff_name			VARCHAR2(70),
	rep_code				NUMBER(4),
	rep_name				VARCHAR2(70),
	rep_addr_1				VARCHAR2(35),
	rep_addr_2				VARCHAR2(35),
	rep_addr_3				VARCHAR2(35),
	rep_addr_4				VARCHAR2(35),
	rep_addr_5				VARCHAR2(35),
	rep_postcode			VARCHAR2(8),
	rep_tel					VARCHAR2(24),
	rep_dx					VARCHAR2(35),
	reference				VARCHAR2(24),
	defendant1_id			NUMBER(1),
	defendant1				VARCHAR2(70),
	def1_addr_1				VARCHAR2(35),
	def1_addr_2				VARCHAR2(35),
	def1_addr_3				VARCHAR2(35),
	def1_addr_4				VARCHAR2(35),
	def1_addr_5				VARCHAR2(35),
	def1_postcode			VARCHAR2(8),
	def1_tel				VARCHAR2(24),
	def1_dx					VARCHAR2(30),
	defendant2_id			NUMBER(1),
	defendant2				VARCHAR2(70),
	def2_addr_1				VARCHAR2(35),
	def2_addr_2				VARCHAR2(35),
	def2_addr_3				VARCHAR2(35),
	def2_addr_4				VARCHAR2(35),
	def2_addr_5				VARCHAR2(35),
	def2_postcode			VARCHAR2(8),
	def2_tel				VARCHAR2(24),
	def2_dx					VARCHAR2(30),
	home_court_issue_date	VARCHAR2(15),
	bailiff_identifier		NUMBER(2),
	land_registry_fee		NUMBER(4,2),
	original_warrant_number	VARCHAR2(8),
	warrant_fee				NUMBER(5,2),
	solicitor_costs			NUMBER(5,2),
	preissue_balance		NUMBER(7,2),
	date_printed			VARCHAR2(15),
	date_reprinted			VARCHAR2(15),
	reprinted_by			VARCHAR2(15),
	notes					VARCHAR2(120),
	trans_seq				NUMBER(3)	
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_VARIATIONS table
PROMPT ************************************************************************
			
CREATE TABLE pcol_variations
(
	rectype					VARCHAR2(2),
	vary_seq				NUMBER(9)		NOT NULL,
	judg_seq				NUMBER(9)		NOT NULL,
	case_number				VARCHAR2(8)		NOT NULL,
	application_date		VARCHAR2(15)	NOT NULL,
	requester				VARCHAR2(20)	NOT NULL,
	offer_amount			NUMBER(8,2)		NOT NULL,
	offer_period			VARCHAR2(3)		NOT NULL,
	first_payment_date		VARCHAR2(15),
	plaintiff_response		VARCHAR2(20),
	result					VARCHAR2(12),
	result_date				VARCHAR2(15),
	determination_amount	NUMBER(8,2),
	determination_period	VARCHAR2(3),
	objection				VARCHAR2(1),
	objector				VARCHAR2(20),
	response_date			VARCHAR2(15),
	hearing_reqd			VARCHAR2(1),
	objection_date			VARCHAR2(15),
	trans_seq				NUMBER(3)
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_TRANS_FAILURES table
PROMPT ************************************************************************
			
CREATE TABLE pcol_trans_failures
(
	transfer_type			VARCHAR2(1)		NOT NULL,
	case_number				VARCHAR2(8)		NOT NULL,
	trans_seq				NUMBER(3)		NOT NULL,
	failure_date			DATE			NOT NULL,
	failure_reason			VARCHAR2(4000)	NOT NULL
);

PROMPT ************************************************************************
PROMPT Creating the PCOL_TRANSFER_CONTROL table
PROMPT ************************************************************************

CREATE TABLE pcol_transfer_control
(
	transfer_type		VARCHAR2(1)		NOT NULL,
	transfer_number		VARCHAR2(8)		NOT NULL,
	transfer_date		DATE			NOT NULL,
	trans_seq			NUMBER(3)		NOT NULL
);

SPOOL OFF