/******************************************************************************/
/*  Start of Package Header                                                   */
/******************************************************************************/
CREATE OR REPLACE PACKAGE sups_Reports_Pack IS
/*******************************************************************************
 *      Module:         SUPS_REPORTS_PACKAGE.sql                               *
 *                                                                             *
 *      Description:    Script to create the database package SUPS_REPORTS_PACK*
 *                      which contains the functions and procedures used by    *
 *                      converted CaseMan Reports.                             *
 *                                                                             *
 *      (c) copyright EDS 2005                                                 *
 *                                                                             *
 *      Amendment History:                                                     *
 *      Version   Date     Changed By   Description                            *
 *      1.0      09/05/05  David Holder Original Version                       *
 *      1.1      23/09/05  David Holder Added Relese 3/4/5/6/7 functions and   *
 *                                  procedures.                *
 *      1.2      11/10/05  Mark Godley  changed cmp_get_deft_or_sol and        *
 *                                      cmp_get_plaint_or_sol to swap Claimant *
 *                                      and Defendant to judgment creditor and *
 *                                      Debtor Respectively                    *
 *      1.3      25/10/05  Simon Wenham Amend cmp_employer to include test for *
 *                                      'CO EMPLOYER' address type             *
 *      1.4      27/10/05  Simon Wenham Amend query in cmp_employer to use the *
 *                                      debtors_employers_party_id             *
 *      1.5      28/10/05  David Holder Added pop_pay_sum + f_pscheck          *
 *      1.6  31/10/05  David Holder Added more missing procedures          *
 *      1.7      01/11/05  Mike Brock   Added stub for pop_amr_reports         *
 *      1.8      02/11/05  Mike Brock   Changes to cmp_declare_dividends       *
 *      1.9      03/11/05  Mike Brock   Add pop_amr_reports                    *
 *      1.10     09/11/05  Mike Brock   Schema CR 86 (post rel 5)              *
 *      1.11     15/11/05  David Holder Changed lookeup from PARTY_ROLE_CODE   *
 *                                      to REPORTING_ROLE_CODE for direct match*
 *                                      of party types                         *
 *      1.12     18/11/05  Mark Godley change jgmt500 to jgmt1000 in CR70      *
 *      1.13     18/11/05  Simon Wenham Add commit to end of pop_amr_reports   *
 *      1.14     21/11/05  Simon Wenham Remove insert into user_information    *
 *      1.15     30/11/05  Simon Wenham Remove cmp_solicitor from spec, changed*
 *                                      query and added parameter              *
 *                                      Modify procedure calls                 *
 *                                      Get_warrant_info to return correct     *
 *                                      reference is no solicitor              *
 *      1.16     01/12/05  Paul Scanlon Added new function                     *
 *                                      f_reporting_party_N_name to return the *
 *                                      nth party on a given case              *
 *      1.17     02/12/05  Simon Wenham CR92 Modify pop_amr_reports to add new *
 *                                      lodgment party columns                 *
 *      1.18     02/12/05  Paul Scanlon CR92 added function                    *
 *                                      f_party_role_short_code to retrieve    *
 *                                      abbreviated version of party_role_code *
 *                                      and party_no                           *
 *      1.19     06/12/05  Paul Scanlon CR36 Removed all references to         *
 *                                      AE_APPLICATIONS.NAMED_EMPLOYER         *
 *                                                                             *
 *      1.20     14/12/05  Paul Scanlon Moved this comment to after create     *
 *                                      or replace bit                         *
 *                                                                             *
 *      1.21     20/12/05  Mike Brock   Changes to cmp_insert_ae_event to add  *
 *                                      legacy trigger functionality re        *
 *                                      Case_events (caseman report defect 71  *
 *                                      and Caseman defect 2022)               *
 *                                      Removed pop_cfo_payments (redundant)   *
 *                                                                             *
 *      1.22     10/01/06  Mike Brock   Add p_submitted_by to various functions*
 *                                      instead of USER built in. Add params   *
 *                                      to cmp_insert_event for the BMS        *
 *                                      court and section                      *
 *                                      Remove redundant pop_dcs and           *
 *                                      populate_dcs_data functions            *
 *                                                                             *
 *      1.23     16/01/06  Mike Brock   Add report no to pop_pay_sum params    *
 *                                                                             *
 *      1.24     26/01/06  Mike Brock   Defect 80 changes for cross court      *
 *                                      payments                               *
 *                                                                             *
 *      1.25     02/02/06  Mike Brock   Defect 2076 cmp_insert_event BMS cols  *
 *                                      back to front                          *
 *                                                                             *
 *      1.26     09/02/06  Mike Brock   Defect 2148/2149 changes to Warrant    *
 *                                      fees and payment functions             *
 *      1.27     16/02/06  Simon Wenham Defect 2224/2227 changes to            *
 *                                      f_calculate_otustanding_bal and        *
 *                                                                             *
 *      1.28     24/02/06  Mike Brock   Defect 2313 cmp_declare_dividend.      *
 *                                      Remove ad.debt_admin_court_code        *
 *                                                                             *
 *      1.29     08/03/06  Mike Brock   Defect 2449 cmp_get_user_info return   *
 *                                      user id if no such user and add        *
 *                                      cmp_get_user_alias                     *
 *      1.30     13/03/06  Simon Wenham Defect 2332 cmp_declare_dividend       *
 *                                      Add admin_court_code to join in delete *
 *                                      statement                              *
 *      1.31     17/03/06  P Scanlon    Defect 2562 - function f_defendant has *
 *                                      now been restricted further to only    *
 *                                      count defendants for address_type_code *
 *                                      = 'SERVICE'                            *
 *      1.32     20/03/06  P Scanlon    Defect 1553 - cmp_get_warrant_info     *
 *                                      sets wrong value to p_debtor_sol_ref - *
 *                                      changing from l_reference to           *
 *                                      l_plaintiff_reference                  *
 *                                      Defect 2597 - return address line 5    *
 *                                      for plaintiff's and defendant's sol    *
 *                                      addresses. cmp_get_plaint_or_sol and   *
 *                                      cmp_get_deft_or_sol                    *
 *      1.33     21/03/06  S Wenham     Defect 2559 cmp_party_service add      *
 *                                      CODED PARTY address type to            *
 *                                      c_party_serv cursor                    *
 *      1.34     23/03/06  S Wenham     Defect 2548 solicitor reference not    *
 *                                      returned - cmp_solicitor               *
 *      1.35     28/03/06  S Wenham     Defect 2600 Foreign warrant payments   *
 *      1.36     23/05/06  S Wenham     Defects 3394/3395 bms                  *
 *      1.37     19/06/06  S Wenham     Defect 3630 Amend queries in pop_amr_  *
 *                                      reports to restrict fields that are not*
 *                                      audited in legacy                      *
 *      1.38     17/07/06  S Wenham     Defect 3909 cmp_party_service to return*
 *                                      defendant's solicitor's reference      *
 *      1.39     11/08/06  S Wenham     Defect 4191 f_new_return_code now uses *
 *                                      a cusror to return local code (if it   *
 *                                      exists) or the global code (court 0)   *
 *      1.40     06/12/06  P Scanlon    UAT Defect 890. Add new functions      *
 *                                      f_payee_payee and f_payee_exists       *
 *                                       to return payee party id              *
 *                                      if  present for a debt.                *
 *      1.41     19/04/07  J Buchanan   Defect CaseMan 6145 Add new function   *
 *                                      cmf_dom_os_bal to include PENDING debts*
 *      1.42     08/02/10  C Vincent    Change to cmf_solicitor_exists to      *
 *                                      join on CPR_TO_CPR_RELATIONSHIP party_a*
 *                                      columns instead of party_b. Trac 2371. *
 *      1.43     15/02/10  C Vincent    TRAC 2851. Change to pop_amr_reports to*
 *                                      wrap court_code param in to_char call  *
 *                                      to prevent full table scans.           *
 *      1.44     22/04/10  I.A. Jumani  Amendments for Trac #2618 - Welsh      *
 *                                      Language Requirements:                 *
 *                                      - New proc cmp_court_2 to retrieve     *
 *                                        dx_number from COURTS.               *
 *                                      - New proc cmp_doc_recipient_2 to      *
 *                                        retrieve dx_number.                  * 
 *                                      - New proc cmp_get_user_information_2  *
 *                                        to retrieve users title, fornames    *
 *                                        and surname                          *
 *                                      - New proc cmp_get_welsh_indicator to  *
 *                                        retrieve the welsh_indicator for a   *
 *                                        specified AE, CO, Case or            *
 *                                        Warrant-related party.               *
 *                                      - New proc cmp_get_deft_or_sol_2 to    *
 *                                        retrieve dx_number.                  *
 *                                      - New proc cmp_get_plaint_or_sol_2 to  *
 *                                        retrieve dx_number.                  * 
 *                                      - Added cmp_employer_2 which,          *
 *                                        additonally, returns the dx_number   *
 *                                        of the employer.                     *
 *                                      - Added cmp_party_service_2 which,     *
 *                                        additonally, returns the dx_number   *
 *                                        of the employer. 					   *
 * 										- Added cmp_get_employer_named_person  *
 *										  which returns an employer named 	   *
 *										  person named.						   *
 *		1.45	30/07/10	C Vincent	- Updated cursor c_ae_details in 	   *
 *										  procedure cmp_doc_payee so returns   *
 *										  case owning court instead of ae      *
 *										  issuing court.  Trac 2918.		   *
 *		1.46	07/09/12	C Vincent	- Added CMP_COURT_3 as part of Trac    *
 *										  4718.								   *
 *		1.47	11/10/16	C Vincent	- Family Enforcement changes.  Trac    *
 *										  5883.								   *
 *******************************************************************************
*/

FUNCTION F_NEW_RETURN_CODE (p_return_code VARCHAR2, p_admin_court_code NUMBER) RETURN VARCHAR2;

FUNCTION return_time_from_sec (sec IN NUMBER) RETURN CHAR ;

FUNCTION f_working_day_count (start_date IN DATE, end_date IN DATE, check_nwd IN CHAR DEFAULT 'FALSE' ) RETURN NUMBER;

FUNCTION f_calculate_warrant_fees (f_warr_number IN WARRANTS.warrant_number%TYPE, f_issued_by IN WARRANTS.issued_by%TYPE) RETURN NUMBER;

FUNCTION f_calculate_warrant_payments
  (p_warrant_number       IN WARRANTS.warrant_number%TYPE,
   p_local_warrant_number IN WARRANTS.local_warrant_number%TYPE,
   p_issuing_court        IN WARRANTS.issued_by%TYPE,
   p_currently_owned_by   IN WARRANTS.currently_owned_by%TYPE
  )
RETURN NUMBER;

FUNCTION superinitcap (val VARCHAR2) RETURN VARCHAR2;

FUNCTION f_court_type(p_case_number IN VARCHAR2) RETURN VARCHAR2;

FUNCTION f_division(p_case_number IN VARCHAR2) RETURN VARCHAR2;

FUNCTION cmf_co_os_balance (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE, p_schedule2 VARCHAR2 DEFAULT 'Y') RETURN NUMBER;

FUNCTION cmf_dom_os_balance (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE, p_schedule2 VARCHAR2 DEFAULT 'Y') RETURN NUMBER;

FUNCTION f_defendant (p_case_number IN VARCHAR2) RETURN VARCHAR2;

FUNCTION cmf_system_data (p_item IN SYSTEM_DATA.item%TYPE, p_update IN VARCHAR2, p_court_code IN COURTS.code%TYPE) RETURN NUMBER;

FUNCTION cmf_today RETURN VARCHAR2;

PROCEDURE cmp_court (p_court_code IN COURTS.code%TYPE,
         p_name OUT COURTS.name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no OUT COURTS.tel_no%TYPE,
         p_fax_no OUT COURTS.fax_no%TYPE,
         p_open OUT PERSONALISE.open_from%TYPE,
         p_close OUT PERSONALISE.closed_at%TYPE,
         p_error OUT VARCHAR2);

PROCEDURE cmp_court_2 
        (p_court_code IN COURTS.code%TYPE,
         p_name OUT COURTS.name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no OUT COURTS.tel_no%TYPE,
         p_fax_no OUT COURTS.fax_no%TYPE,
         p_dx_no  OUT COURTS.dx_number%TYPE,
         p_open OUT PERSONALISE.open_from%TYPE,
         p_close OUT PERSONALISE.closed_at%TYPE,
         p_error OUT VARCHAR2);
		 
PROCEDURE cmp_court_3 
        (p_court_code IN COURTS.code%TYPE,
         p_name OUT COURTS.name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no OUT COURTS.tel_no%TYPE,
         p_fax_no OUT COURTS.fax_no%TYPE,
         p_dx_no  OUT COURTS.dx_number%TYPE,
         p_open OUT PERSONALISE.open_from%TYPE,
         p_close OUT PERSONALISE.closed_at%TYPE,
		 p_dr_open OUT PERSONALISE.dr_open_from%TYPE,
		 p_dr_close OUT PERSONALISE.dr_closed_at%TYPE,
		 p_by_appointment OUT PERSONALISE.by_appointment_ind%TYPE,
		 p_dr_tel_no OUT COURTS.dr_tel_no%TYPE,
         p_error OUT VARCHAR2);

PROCEDURE cmp_get_user_information
        (p_user_id   IN USER_INFORMATION.user_id%TYPE,
         p_name      OUT USER_INFORMATION.name%TYPE,
         p_section   OUT USER_INFORMATION.SECTION%TYPE,
         p_extension OUT USER_INFORMATION.extension%TYPE,
         p_error     OUT VARCHAR2);

PROCEDURE cmp_get_user_information_2
        (p_user_id   IN  dca_user.user_id%TYPE,
         p_title     OUT dca_user.title%TYPE,
         p_forenames OUT dca_user.forenames%TYPE,
         p_surname   OUT dca_user.surname%TYPE,
         p_error     OUT VARCHAR2);

FUNCTION cmp_get_user_alias
        (p_user_id   IN USER_INFORMATION.user_id%TYPE)
RETURN VARCHAR2;

PROCEDURE cmp_order_details
        (p_order_id IN ORDER_TYPES.order_id%TYPE,
         p_display_order_id   OUT ORDER_TYPES.display_order_id%TYPE,
         p_previous_order_id  OUT ORDER_TYPES.previous_order_id%TYPE,
         p_order_description  OUT ORDER_TYPES.order_description%TYPE,
         p_legal_description  OUT ORDER_TYPES.legal_description%TYPE,
         p_document_type      OUT ORDER_TYPES.document_type%TYPE,
         p_report_type        OUT ORDER_TYPES.report_type%TYPE,
         p_module_name        OUT ORDER_TYPES.module_name%TYPE,
         p_module_group       OUT ORDER_TYPES.module_group%TYPE,
         p_selection_criteria OUT ORDER_TYPES.selection_criteria%TYPE,
         p_doc_recipient  OUT ORDER_TYPES.doc_recipient%TYPE,
         p_doc_payee      OUT ORDER_TYPES.doc_payee%TYPE,
         p_printer_type   OUT ORDER_TYPES.printer_type%TYPE,
         p_user_edit      OUT ORDER_TYPES.user_edit%TYPE,
         p_file_prefix    OUT ORDER_TYPES.file_prefix%TYPE,
         p_file_extension OUT ORDER_TYPES.file_extension%TYPE,
         p_error     OUT VARCHAR2);

PROCEDURE cmp_report_initialisation
      (p_event_seq    IN AE_EVENTS.ae_event_seq%TYPE,
       p_order_id     IN ORDER_TYPES.order_id%TYPE,
       p_submitted_by IN USER_INFORMATION.user_id%TYPE,
       p_display_order_id   OUT ORDER_TYPES.display_order_id%TYPE,
       p_legal_description  OUT ORDER_TYPES.legal_description%TYPE,
       p_order_description  OUT ORDER_TYPES.order_description%TYPE,
       p_document_type      OUT ORDER_TYPES.document_type%TYPE,
       p_selection_criteria OUT ORDER_TYPES.selection_criteria%TYPE,
       p_doc_recipient  OUT ORDER_TYPES.doc_recipient%TYPE,
       p_doc_payee      OUT ORDER_TYPES.doc_payee%TYPE,
       p_file_prefix    OUT ORDER_TYPES.file_prefix%TYPE,
       p_file_extension OUT ORDER_TYPES.file_extension%TYPE,
       p_name      OUT USER_INFORMATION.name%TYPE,
       p_section   OUT USER_INFORMATION.SECTION%TYPE,
       p_extension OUT USER_INFORMATION.extension%TYPE,
       p_error     OUT VARCHAR2);

PROCEDURE cmp_ae_details
        (p_ae_number    IN AE_APPLICATIONS.ae_number%TYPE,
         p_case_number  OUT AE_APPLICATIONS.case_number%TYPE,
         p_ae_type      OUT AE_APPLICATIONS.ae_type%TYPE,
         p_ae_fee       OUT AE_APPLICATIONS.ae_fee%TYPE,
         p_amount_of_ae OUT AE_APPLICATIONS.amount_of_ae%TYPE,
         p_per    OUT AE_APPLICATIONS.protected_earnings_rate%TYPE,
         p_ndr    OUT AE_APPLICATIONS.normal_deduction_rate%TYPE,
         p_pep    OUT AE_APPLICATIONS.protected_earnings_period%TYPE,
         p_ndp    OUT AE_APPLICATIONS.normal_deduction_period%TYPE,
         p_date_of_issue OUT AE_APPLICATIONS.date_of_issue%TYPE,
         p_error         OUT VARCHAR2);

PROCEDURE cmp_run_variable_functions
         (p_event_seq      IN NUMBER,
          p_variable_code  IN DOCUMENT_VARIABLES.code%TYPE,
          p_variable_value OUT VARCHAR2,
          p_error          OUT VARCHAR2);

FUNCTION cmf_replace_variables
        (p_event_seq IN AE_EVENTS.ae_event_seq%TYPE,
         p_od_seq    IN OUTPUT_DETAILS.od_seq%TYPE,
         p_sub_text  IN VARCHAR2,
         p_sub_text_no IN NUMBER) RETURN VARCHAR2;

PROCEDURE cmp_get_co_per_totals
        (p_co_number     CONSOLIDATED_ORDERS.co_number%TYPE,
           p_a_total     OUT NUMBER,
           p_b_total     OUT NUMBER,
           p_c_total     OUT NUMBER,
           p_d_total     OUT NUMBER,
           p_g_total     OUT NUMBER);

FUNCTION cmf_solicitor_exists
        (p_ae_number          IN AE_APPLICATIONS.ae_number%TYPE,
         p_type               IN VARCHAR2,
         p_cmp_doc_payee_flag IN VARCHAR2) RETURN BOOLEAN;

PROCEDURE cmp_party_service
        (p_number IN CASES.case_number%TYPE,
       p_party_for_party_role_code IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
         p_deft_id IN  CASE_PARTY_ROLES.case_party_no%TYPE,
         p_stage  IN  AE_EVENTS.issue_stage%TYPE,
         p_code   OUT CODED_PARTIES.code%TYPE,
         p_name   OUT PARTIES.person_requested_name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no    OUT PARTIES.tel_no %TYPE,
         p_plaintiff_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error  OUT VARCHAR2);

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_party_service_2
        (p_number IN CASES.case_number%TYPE,
         p_party_for_party_role_code IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
         p_deft_id IN  CASE_PARTY_ROLES.case_party_no%TYPE,
         p_stage  IN  AE_EVENTS.issue_stage%TYPE,
         p_code   OUT CODED_PARTIES.code%TYPE,
         p_name   OUT PARTIES.person_requested_name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no    OUT PARTIES.tel_no %TYPE,
         p_dx_no     OUT PARTIES.dx_Number%TYPE,
         p_plaintiff_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error  OUT VARCHAR2);

PROCEDURE cmp_employer
        (p_number  IN  AE_APPLICATIONS.ae_number%TYPE,
         p_type    IN  VARCHAR2,
         p_party_id IN  AE_APPLICATIONS.DEBTORS_EMPLOYERS_PARTY_ID%TYPE,
         p_name    OUT PARTIES.PERSON_REQUESTED_NAME%TYPE,
         p_addr_1  OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2  OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3  OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4  OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5  OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error     OUT VARCHAR2);

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_employer_2
        (p_number  IN  AE_APPLICATIONS.ae_number%TYPE,
         p_type    IN  VARCHAR2,
         p_party_id IN  AE_APPLICATIONS.DEBTORS_EMPLOYERS_PARTY_ID%TYPE,
         p_name    OUT PARTIES.PERSON_REQUESTED_NAME%TYPE,
         p_addr_1  OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2  OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3  OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4  OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5  OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_dx_no     OUT PARTIES.dx_number%TYPE,
         p_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error     OUT VARCHAR2);

PROCEDURE cmp_get_plaint_or_sol
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_party_role IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
       P_case_party_no IN AE_APPLICATIONS.party_for_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_error    OUT VARCHAR2);

PROCEDURE cmp_get_plaint_or_sol_2
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_party_role IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
         P_case_party_no IN AE_APPLICATIONS.party_for_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_dx_no    OUT case_parties.dx_number%TYPE,
         p_error    OUT VARCHAR2);

PROCEDURE cmp_get_deft_or_sol
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
       p_party_role IN AE_APPLICATIONS.party_against_party_role_code%TYPE,
       P_case_party_no IN AE_APPLICATIONS.party_against_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_error    OUT VARCHAR2);

PROCEDURE cmp_get_deft_or_sol_2
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_party_role IN AE_APPLICATIONS.party_against_party_role_code%TYPE,
         P_case_party_no IN AE_APPLICATIONS.party_against_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_dx_no    OUT case_parties.dx_number%TYPE,
         p_error    OUT VARCHAR2);

PROCEDURE cmp_chk_char_ref_codes(p_value   IN OUT CCBC_REF_CODES.rv_low_value%TYPE,
                                 p_domain  IN CCBC_REF_CODES.rv_domain%TYPE,
                                 p_meaning OUT CCBC_REF_CODES.rv_meaning%TYPE,
                                 p_error   OUT VARCHAR2);

FUNCTION f_calculate_outstanding_bal (f_ae_number IN AE_EVENTS.ae_number%TYPE) RETURN NUMBER;

FUNCTION F_GET_EVENT_TASK (p_case_no VARCHAR2   := NULL,
                           p_case_type VARCHAR2 := NULL,
                           p_event_id NUMBER    := NULL,
                           p_task_type VARCHAR2 := NULL,
                           p_p1 VARCHAR2        := NULL,
                           p_p2 VARCHAR2        := NULL,
                           p_p3 VARCHAR2        := NULL,
                           p_p4 VARCHAR2        := NULL,
                           p_event_type_flag VARCHAR2 := 'O') RETURN CHAR;

FUNCTION f_task_age(p_receipt_date IN DATE, p_processing_date IN DATE) RETURN CHAR;

PROCEDURE cmp_get_warrant_info
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_creditor_name         OUT case_parties.name%TYPE,
         p_creditor_sol_code     OUT case_parties.coded_party_no%TYPE,
         p_creditor_sol_name     OUT case_parties.name%TYPE,
         p_creditor_sol_addr_1   OUT case_parties.address_line1%TYPE,
         p_creditor_sol_addr_2   OUT case_parties.address_line2%TYPE,
         p_creditor_sol_addr_3   OUT case_parties.address_line3%TYPE,
         p_creditor_sol_addr_4   OUT case_parties.address_line4%TYPE,
       p_creditor_sol_addr_5   OUT case_parties.address_line5%TYPE,
         p_creditor_sol_postcode OUT case_parties.postcode%TYPE,
         p_creditor_sol_tel      OUT case_parties.tel_no%TYPE,
         p_creditor_sol_ref      OUT case_parties.reference%TYPE,
         p_creditor_sol_dx       OUT case_parties.dx_number%TYPE,
         p_debtor_id       OUT case_parties.coded_party_no%TYPE,
         p_debtor          OUT case_parties.name%TYPE,
         p_debtor_addr_1   OUT case_parties.address_line1%TYPE,
         p_debtor_addr_2   OUT case_parties.address_line2%TYPE,
         p_debtor_addr_3   OUT case_parties.address_line3%TYPE,
         p_debtor_addr_4   OUT case_parties.address_line4%TYPE,
         p_debtor_addr_5   OUT case_parties.address_line5%TYPE,
         p_debtor_postcode OUT case_parties.postcode%TYPE,
         p_debtor_sol_ref  OUT case_parties.reference%TYPE,
         p_error OUT VARCHAR2);

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_get_welsh_indicator
        (p_ae_number       IN  ae_applications.ae_number%TYPE,
         p_party_role_type IN  VARCHAR2,
         p_welsh_indicator OUT case_party_roles.welsh_indicator%TYPE,
         p_error           OUT VARCHAR2);
		 
-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_get_employer_named_person
        (p_enf_type IN VARCHAR2,										-- Enforcement Type (AE or CO)
		 p_enf_number IN  consolidated_orders.co_number%TYPE,			-- Enforcement Number (AE Number or CO Number)
		 p_named_person OUT consolidated_orders.named_employer%TYPE,	-- Employer named person name
         p_error           OUT VARCHAR2);

PROCEDURE cmp_doc_payee
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_ae_type   IN VARCHAR2,
         p_doc_payee IN ORDER_TYPES.doc_payee%TYPE,
         p_name     OUT VARCHAR2,
         p_addr_1   OUT VARCHAR2,
         p_addr_2   OUT VARCHAR2,
         p_addr_3   OUT VARCHAR2,
         p_addr_4   OUT VARCHAR2,
         p_addr_5   OUT VARCHAR2,
         p_postcode OUT VARCHAR2,
         p_error    OUT VARCHAR2);
		 
PROCEDURE cmp_doc_payee2
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_ae_type   IN VARCHAR2,
         p_doc_payee IN ORDER_TYPES.doc_payee%TYPE,
		 p_crt_code OUT NUMBER,
         p_name     OUT VARCHAR2,
         p_addr_1   OUT VARCHAR2,
         p_addr_2   OUT VARCHAR2,
         p_addr_3   OUT VARCHAR2,
         p_addr_4   OUT VARCHAR2,
         p_addr_5   OUT VARCHAR2,
         p_postcode OUT VARCHAR2,
         p_error    OUT VARCHAR2);

PROCEDURE cmp_get_ae_per_totals
        (p_ae_number  AE_APPLICATIONS.ae_number%TYPE,
         p_a_total  OUT NUMBER,
         p_b_total  OUT NUMBER,
         p_c_total  OUT NUMBER,
         p_d_total  OUT NUMBER,
         p_g_total  OUT NUMBER,
         p_error  OUT VARCHAR2);

PROCEDURE cmp_doc_recipient
        (p_ae_number     IN  AE_APPLICATIONS.ae_number%TYPE,
         p_ae_type       IN  VARCHAR2,
         p_doc_recipient IN  ORDER_TYPES.doc_recipient%TYPE,
         p_stage         IN  AE_EVENTS.issue_stage%TYPE,
         p_party    OUT VARCHAR2,
         p_name     OUT VARCHAR2,
         p_addr_1   OUT VARCHAR2,
         p_addr_2   OUT VARCHAR2,
         p_addr_3   OUT VARCHAR2,
         p_addr_4   OUT VARCHAR2,
         p_addr_5   OUT VARCHAR2,
         p_postcode OUT VARCHAR2,
         p_error    OUT VARCHAR2);

PROCEDURE cmp_doc_recipient_2
         (p_ae_number     IN AE_APPLICATIONS.ae_number%TYPE,
          p_ae_type       IN VARCHAR2,
          p_doc_recipient IN ORDER_TYPES.doc_recipient%TYPE,
          p_stage         IN AE_EVENTS.issue_stage%TYPE,
          p_party    OUT VARCHAR2,
          p_name     OUT VARCHAR2,
          p_addr_1   OUT VARCHAR2,
          p_addr_2   OUT VARCHAR2,
          p_addr_3   OUT VARCHAR2,
          p_addr_4   OUT VARCHAR2,
          p_addr_5   OUT VARCHAR2,
          p_postcode OUT VARCHAR2,
          p_dx_no    OUT VARCHAR2,
          p_error    OUT VARCHAR2);

PROCEDURE cmp_ae_party_details
        (p_ae_number  IN  AE_APPLICATIONS.ae_number%TYPE,
         p_party      IN  VARCHAR2,
         p_code       OUT case_parties.coded_party_no%TYPE,
         p_name       OUT case_parties.name%TYPE,
         p_addr_1     OUT case_parties.address_line1%TYPE,
         p_addr_2     OUT case_parties.address_line2%TYPE,
         p_addr_3     OUT case_parties.address_line3%TYPE,
         p_addr_4     OUT case_parties.address_line4%TYPE,
         p_addr_5     OUT case_parties.address_line5%TYPE,
         p_postcode   OUT case_parties.postcode%TYPE,
         p_tel_no     OUT case_parties.tel_no%TYPE,
         p_dx_no      OUT case_parties.dx_number%TYPE,
         p_reference  OUT case_parties.reference%TYPE,
         p_error      OUT VARCHAR2);

FUNCTION cmf_ald_debt_balance (p_debt_seq ALLOWED_DEBTS.debt_seq%TYPE) RETURN NUMBER;

FUNCTION cmf_money_in_court(  p_co_number CONSOLIDATED_ORDERS.co_number%TYPE,
        p_releasable_ind VARCHAR2 DEFAULT 'Y') RETURN NUMBER;

FUNCTION f_get_case_number
 (p_admin_court_code       IN COURTS.code%TYPE,    -- payment owner
  p_enforcement_court_code IN COURTS.code%TYPE,    -- enforcement owner
  p_subject_no             IN PAYMENTS.subject_no%TYPE,
  p_subject_type           IN PAYMENTS.payment_for%TYPE)
RETURN VARCHAR2;

PROCEDURE p_del_gen_repno(p_court_code NUMBER, p_userid VARCHAR2, p_report_id VARCHAR2);

PROCEDURE p_final_dcs(p_report_id IN DCS.report_id%TYPE, p_court_code IN DCS.admin_court_code%TYPE);

FUNCTION cmf_co_target_amount (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE) RETURN NUMBER;

FUNCTION cmf_outstanding_fee (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE) RETURN NUMBER;

FUNCTION f_next_working_day(p_date IN DATE) RETURN DATE;

FUNCTION f_prior_working_day(n_date IN DATE,num_prior IN NUMBER) RETURN DATE;

PROCEDURE cmp_insert_event (p_co_number CO_EVENTS.co_number%TYPE,
                            p_std_event_id CO_EVENTS.std_event_id%TYPE,
                            p_issue_stage CO_EVENTS.issue_stage%TYPE,
                            p_details CO_EVENTS.details%TYPE,
                            p_bailiff_identifier CO_EVENTS.bailiff_identifier%TYPE,
                            p_service_status CO_EVENTS.service_status%TYPE,
                            p_service_date DATE,
                            p_process_stage CO_EVENTS.process_stage%TYPE,
                            p_process_date DATE,
                            p_receipt_date DATE,
                            p_hrg_seq CO_EVENTS.hrg_seq%TYPE,
                            p_warrant_id WARRANTS.warrant_id%TYPE,
                            p_ald_debt_seq CO_EVENTS.ald_debt_seq%TYPE,
                            p_report_val_1 CO_EVENTS.report_value_1%TYPE,
                            p_user_id          IN user_information.name%TYPE,
                            p_bms_court_code   IN COURTS.code%TYPE,              -- court code and section for BMS counting
                            p_bms_section      IN user_information.SECTION%TYPE
);

PROCEDURE p_eoap(p_report_no IN VARCHAR2, p_court_code IN PAYMENT_SUMMARY.admin_court_code%TYPE);

PROCEDURE cmp_declare_dividends
  (p_court_code   IN COURTS.code%TYPE,
   p_release_date IN DATE,
   p_report_id    IN DIVIDENDS.div_report_id%TYPE,
   p_user_id      IN DIVIDENDS.div_created_by%TYPE);

FUNCTION cmf_chk_single_live_ae
        (p_case_number  IN CASES.case_number%TYPE,
       p_party_role_code IN AE_APPLICATIONS.party_against_party_role_code%TYPE,
         p_case_party_no IN AE_APPLICATIONS.party_against_case_party_no%TYPE,
         p_ae_number IN AE_EVENTS.ae_number%TYPE) RETURN BOOLEAN;

PROCEDURE cmp_insert_ae_event
        (p_ae_number    IN AE_APPLICATIONS.ae_number%TYPE,
         p_event_date   IN AE_EVENTS.event_date%TYPE,
         p_date_entered IN AE_EVENTS.date_entered%TYPE,
         p_std_event_id IN AE_EVENTS.std_event_id%TYPE,
         p_stage        IN AE_EVENTS.issue_stage%TYPE,
         p_details      IN AE_EVENTS.details%TYPE,
         p_hrg_seq      IN AE_EVENTS.hrg_seq%TYPE,
         p_bailiff_identifier IN AE_EVENTS.bailiff_identifier%TYPE,
         p_service_status IN AE_EVENTS.service_status%TYPE,
         p_service_date   IN AE_EVENTS.service_date%TYPE,
         p_warrant_id     IN AE_EVENTS.warrant_id%TYPE,
         p_report_value_1 IN AE_EVENTS.report_value_1%TYPE,
         p_report_value_2 IN AE_EVENTS.report_value_2%TYPE,
         p_report_value_3 IN AE_EVENTS.report_value_3%TYPE,
         p_process_stage  IN AE_EVENTS.process_stage%TYPE,
         p_admin_court_code IN COURTS.code%TYPE,
         p_user_id          IN user_information.name%TYPE,
         p_bms_court_code   IN COURTS.code%TYPE,              -- court code and section for BMS counting
         p_bms_section      IN user_information.SECTION%TYPE,
         p_error          OUT VARCHAR2);

PROCEDURE pop_pay_sum (p_user_id IN VARCHAR2,
                       p_report_no IN VARCHAR2,
                       p_court_code IN NUMBER
                      );

PROCEDURE pop_amr_reports(p_user_id IN VARCHAR2,
                          p_report_no IN VARCHAR2,
                          p_court_code IN NUMBER
                         );

FUNCTION f_pscheck(p_ps_date IN DATE, p_court_code NUMBER) RETURN VARCHAR2;

PROCEDURE p_del_dsum_repno (p_court_code IN NUMBER, p_user_id IN REPORT_DATA.user_id%TYPE);

FUNCTION f_get_party_name (p_case_number IN VARCHAR2, p_reporting_party_role_code IN VARCHAR2, p_case_party_no IN NUMBER DEFAULT 1) RETURN VARCHAR2;

FUNCTION f_reporting_party_n_name
        (p_case_number IN CASES.CASE_NUMBER%TYPE,
     p_reporting_role_code IN PARTY_ROLES.REPORTING_ROLE_CODE%TYPE,
     p_number IN NUMBER) RETURN VARCHAR2;

FUNCTION f_party_role_short_code (p_party_role_code IN case_PARTIES.party_role_code%TYPE,
                                  p_case_party_no IN case_PARTIES.case_party_no%TYPE) RETURN VARCHAR;
FUNCTION f_payee_party (p_ald_seq  IN NUMBER) RETURN NUMBER;
FUNCTION f_payee_exists (p_ald_seq in number) RETURN VARCHAR2;

END sups_Reports_Pack;

/
SHOW ERRORS;

/******************************************************************************/
/* Start of Package Body                                                      */
/******************************************************************************/
CREATE OR REPLACE PACKAGE BODY sups_Reports_Pack IS

/******************************************************************************/
/* FUNCION: F_NEW_RETURN_CODE                                                 */
/******************************************************************************/

FUNCTION F_NEW_RETURN_CODE (p_return_code VARCHAR2, p_admin_court_code NUMBER) RETURN VARCHAR2 IS

 l_ret_order INTEGER;
 ret_value RETURN_CODES.new_return_code%TYPE:=NULL;

  /*
   * replace singleton select staement wih cursor which selects local court return code first
   * or if it does not exist the global return code from court 0
   * fetch only first row if two are found (i.e. the local court first)
   */
  CURSOR c_ret_code IS
    SELECT 1 ret_order,
           DECODE(current_return,'Y',return_code, DECODE(new_return_code,NULL,return_code, new_return_code))
    FROM   RETURN_CODES
    WHERE  return_code = p_return_code
    AND    admin_court_code = p_admin_court_code
    UNION
    SELECT 2 ret_order,
           DECODE(current_return,'Y',return_code, DECODE(new_return_code,NULL,return_code, new_return_code))
    FROM   RETURN_CODES
    WHERE  return_code = p_return_code
    AND    admin_court_code = 0
    ORDER BY ret_order;

BEGIN
  OPEN c_ret_code;
  FETCH c_ret_code INTO l_ret_order, ret_value;
  CLOSE c_ret_code;

  RETURN(ret_value);
END;

/******************************************************************************/
/* FUNCTION: RETURN_TIME_FROM_SEC                                             */
/******************************************************************************/

FUNCTION return_time_from_sec ( sec IN NUMBER ) RETURN CHAR IS

CURSOR c1 IS
SELECT DECODE(TO_CHAR(TRUNC( sec /60/60)),
              '0','12',
              '1','01',
              '2','02',
              '3','03',
              '4','04',
              '5','05',
              '6','06',
              '7','07',
              '8','08',
              '9','09',
              '10','10',
              '11','11',
              '12','12',
              '13','01',
              '14','02',
              '15','03',
              '16','04',
              '17','05',
              '18','06',
              '19','07',
              '20','08',
              '21','09',
              '22','10',
              '23','11')
||'.'||
      DECODE(TO_CHAR(TRUNC((sec - (TRUNC(sec/60/60)*60*60) )/60)),
                 '0','00',
                 '1','01',
                 '2','02',
                 '3','03',
                 '4','04',
                 '5','05',
                 '6','06',
                 '7','07',
                 '8','08',
                 '9','09',
         TO_CHAR(TRUNC((sec - (TRUNC(sec/60/60)*60*60) )/60)))
||' '||DECODE(TO_CHAR(TRUNC(sec/60/60)),'0','am',
                                       '1','am',
                                       '2','am',
                                       '3','am',
                                       '4','am',
                                       '5','am',
                                       '6','am',
                                       '7','am',
                                       '8','am',
                                       '9','am',
                                       '10','am',
                                       '11','am',
                                       '12','pm',
                                       '13','pm',
                                       '14','pm',
                                       '15','pm',
                                       '16','pm',
                                       '17','pm',
                                       '18','pm',
                                       '19','pm',
                                       '20','pm',
                                       '21','pm',
                                       '22','pm',
                                       '23','pm')
TIME
FROM dual;


BEGIN
  FOR rec IN c1 LOOP
    RETURN rec.TIME;
  END LOOP;


END return_time_from_sec;

/******************************************************************************/
/* FUNCTION: F_WORKING_DAY_COUNT                                              */
/******************************************************************************/

FUNCTION f_working_day_count ( start_date IN DATE ,
                               end_date IN DATE ,check_NWD IN CHAR
                               DEFAULT 'FALSE'  )
RETURN NUMBER IS
/*//////////////////////////////////////////////////////////////////////////
 Purpose      :  To return number of days between two date values
     excluding WEEKEND days and PUBLIC holidays.
     It has two mandatory parameters (start_date and end_ date) and
     one optional parameter (Check_NWD).
     With two parameters ( start_date and end_date ),
     function returns number of days excluding WEEKEND day alone.

*/

  lv_no_of_days     NUMBER;
  lv_temp1                NUMBER;
  lv_temp2                NUMBER;
  lv_temp3                NUMBER;
  lv_temp4                NUMBER;
  lv_nwd                  NUMBER;

BEGIN

  SELECT (TRUNC(end_date,'D')-TRUNC(start_date+6,'D'))
  INTO lv_temp1
  FROM dual;

  SELECT (((TRUNC(end_date,'D')-TRUNC(start_date+6,'D'))/7)*2)
  INTO lv_temp2
  FROM dual;

  SELECT DECODE(TO_NUMBER(TO_CHAR(end_date,'D')),3,1,4,2,5,3,6,4,7,5,0)
  INTO lv_temp3
  FROM dual;

  SELECT LEAST(7-DECODE(TO_NUMBER(TO_CHAR(start_date,'D')),1,7,
         TO_NUMBER(TO_CHAR(start_date,'D'))),5)
  INTO lv_temp4
  FROM dual;

  lv_no_of_days := lv_temp1 - lv_temp2 + lv_temp3 + lv_temp4;

  SELECT COUNT(*)
  INTO lv_nwd
  FROM NON_WORKING_DAYS
  WHERE non_working_date BETWEEN start_date AND end_date
  AND error_indicator = 'N';

  IF check_nwd = 'TRUE' THEN
    RETURN lv_no_of_days - lv_nwd;
  ELSE
    RETURN lv_no_of_days;
  END IF;

END f_working_day_count ;

/******************************************************************************/
/* FUNCTION F_CALCULATE_WARRANT_FEES                                          */
/******************************************************************************/

-- Note that FEES_PAID can only be attached to Home Warrant records and therefore
-- FEES_PAID can be linked to WARRANTS using
--   W.Issued_by = F.issuing_court
--   W.warrant_number = f.process_number
--  Where W.local_warrant_number IS NULL

FUNCTION f_calculate_warrant_fees
(f_warr_number IN WARRANTS.warrant_number%TYPE,
f_issued_by IN  WARRANTS.issued_by%TYPE)
RETURN NUMBER IS
  CURSOR c_tot_fees IS
    SELECT SUM(fp.amount)
    FROM FEES_PAID fp
    WHERE fp.process_number = f_warr_number
    AND fp.process_type = 'W'
    AND fp.issuing_court = f_issued_by
                AND fp.deleted_flag  = 'N';
  v_fees_sum_amount   NUMBER(11,2);
  BEGIN
    OPEN c_tot_fees;
    FETCH c_tot_fees
    INTO v_fees_sum_amount;
    CLOSE c_tot_fees;
    RETURN v_fees_sum_amount;

END f_calculate_warrant_fees;

/******************************************************************************/
/* FUNCTION: F_CALCULATE_WARRANT_PAYMENTS                                     */
/******************************************************************************/

FUNCTION f_calculate_warrant_payments
  (p_warrant_number       IN WARRANTS.warrant_number%TYPE,
   p_local_warrant_number IN WARRANTS.local_warrant_number%TYPE,
   p_issuing_court        IN WARRANTS.issued_by%TYPE,
   p_currently_owned_by   IN WARRANTS.currently_owned_by%TYPE
  )
RETURN NUMBER
IS

  CURSOR c_tot_h_payments IS
  SELECT SUM(p.amount)
  FROM PAYMENTS p
  WHERE p.subject_no = p_warrant_number
  AND p.payment_for = 'HOME WARRANT'
  AND p.enforcement_court_code = p_issuing_court
  AND p.rd_date IS NULL
  AND p.error_indicator = 'N';

  CURSOR c_tot_f_payments IS
  SELECT SUM(p.amount)
  FROM PAYMENTS p
  WHERE p.subject_no = p_local_warrant_number
  AND p.payment_for = 'FOREIGN WARRANT'
  AND p.enforcement_court_code = p_currently_owned_by
  AND p.rd_date IS NULL
  AND p.error_indicator = 'N';

  v_payments_sum_amount   NUMBER(11,2);

BEGIN

  IF p_local_warrant_number IS NULL THEN

    -- Home Warrant

    OPEN c_tot_h_payments;
    FETCH c_tot_h_payments
    INTO v_payments_sum_amount;
    CLOSE c_tot_h_payments;

  ELSE

    OPEN c_tot_f_payments;
    FETCH c_tot_f_payments
    INTO v_payments_sum_amount;
    CLOSE c_tot_f_payments;

  END IF;

  RETURN v_payments_sum_amount;

END f_calculate_warrant_payments;

/******************************************************************************/
/* FUNCTION: SUPERINITCAP                                                     */
/******************************************************************************/

FUNCTION superinitcap (val  VARCHAR2) RETURN VARCHAR2 IS

vc_value  VARCHAR2(2000);

BEGIN

  vc_value := val;

  vc_value := INITCAP(vc_value);
  vc_value := REPLACE(vc_value,' And ',' and ');
  vc_value := REPLACE(vc_value,' Of ',' of ');
  vc_value := REPLACE(vc_value,' On ',' on ');
  vc_value := REPLACE(vc_value,'Mck','McK');
  vc_value := REPLACE(vc_value,'Mca','McA');
  vc_value := REPLACE(vc_value,'Mcc','McC');
  vc_value := REPLACE(vc_value,'Mcd','McD');
  vc_value := REPLACE(vc_value,'Mcg','McG');
  vc_value := REPLACE(vc_value,'Mci','McI');
  vc_value := REPLACE(vc_value,'''S ','''s ');

  RETURN vc_value;

END superinitcap;

/******************************************************************************/
/* FUNCTION: F_COURT_TYPE                                                     */
/******************************************************************************/

FUNCTION f_court_type(p_case_number IN VARCHAR2) RETURN VARCHAR2 IS

           CURSOR c_court_type IS
              SELECT DECODE(rc.rv_iit_code_1, NULL, 'County Court', 'F', 'Family Court', 'District Registry')
              FROM   CCBC_REF_CODES rc,
                     CASES cas
              WHERE  cas.case_type = rc.rv_low_value
              AND    rc.rv_domain  = 'CURRENT_CASE_TYPE'
              AND    cas.case_number = p_case_number;

           l_court_type         VARCHAR2(20);

        BEGIN

           OPEN  c_court_type;
           FETCH c_court_type INTO l_court_type;

              IF c_court_type%NOTFOUND THEN
                 RETURN ('County Court');
              ELSE
                 RETURN (l_court_type);
              END IF;

           CLOSE c_court_type;

END f_court_type;

/******************************************************************************/
/* FUNCTION: F_DIVISION                                                       */
/******************************************************************************/

FUNCTION f_division(p_case_number IN VARCHAR2) RETURN VARCHAR2 IS

           CURSOR c_division IS
              SELECT  DECODE(rc.rv_iit_code_1, NULL, NULL, 'F', NULL,
                            'Q', 'High Court of Justice               Queen''s Bench Division',
                            'C', 'High Court of Justice               Chancery Division')
              FROM    CCBC_REF_CODES rc,
                      CASES cas
              WHERE   cas.case_type = rc.rv_low_value
              AND     rc.rv_domain   = 'CURRENT_CASE_TYPE'
              AND     cas.case_number = p_case_number;

           l_division   VARCHAR2(100);

        BEGIN

           OPEN  c_division;
           FETCH c_division INTO l_division;

              IF c_division%NOTFOUND THEN
                 RETURN (NULL);
              ELSE
                 RETURN (l_division);
              END IF;

           CLOSE c_division;

END f_division;

/******************************************************************************/
/* FUNCTION: CMF_CO_OS_BALANCE                                                */
/******************************************************************************/

FUNCTION CMF_CO_OS_BALANCE (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE, p_schedule2 VARCHAR2 DEFAULT 'Y') RETURN NUMBER IS

l_live_pass NUMBER(12,2) :=0;
l_s2_pass   NUMBER(12,2) :=0;
l_pass NUMBER(12, 2) := 0;
l_paid NUMBER(12, 2) := 0;
l_paid_fees  NUMBER(12,2) := 0;
l_debt NUMBER(12, 2) := 0;
l_included_debts NUMBER(12, 2) := 0;
l_total_debts NUMBER(12, 2) := 0;
l_fee_element NUMBER(12, 2) := 0;
l_balance NUMBER(12,2) := 0;

CURSOR c_paid IS
   SELECT NVL(SUM(dd.dd_amount), 0)
   FROM   DEBT_DIVIDENDS dd, ALLOWED_DEBTS ald
   WHERE  dd.dd_ald_seq = ald.debt_seq
   AND    ald.debt_co_number = p_co_number
   AND    ((ald.debt_status IN ('LIVE', 'SCHEDULE2','PAID') AND p_schedule2 = 'Y') OR (ald.debt_status IN ('LIVE','PAID') AND p_schedule2 = 'N'))
   AND   dd.created = 'Y';

CURSOR c_paid_fees IS
   SELECT NVL(SUM(d.div_fee),0)
   FROM   DIVIDENDS d
   WHERE  d.div_co_number = p_co_number
   AND    d.created = 'Y';

CURSOR c_live_pass IS
   SELECT NVL(SUM(pay.amount), 0)
   FROM   PAYMENTS pay, ALLOWED_DEBTS ald
   WHERE  ald.debt_seq = pay.ald_debt_seq
   AND    pay.passthrough = 'Y'
   AND    ald.debt_co_number = p_co_number
   AND    ald.debt_status IN ('LIVE', 'PAID')
   AND    pay.error_indicator = 'N';

CURSOR c_s2_pass IS
   SELECT NVL(SUM(pay.amount), 0)
   FROM   PAYMENTS pay, ALLOWED_DEBTS ald
   WHERE  ald.debt_seq = pay.ald_debt_seq
   AND    pay.passthrough = 'Y'
   AND    ald.debt_co_number = p_co_number
   AND    ald.debt_status = 'SCHEDULE2'
   AND    pay.error_indicator = 'N';
CURSOR c_included_debts IS
   SELECT NVL(SUM(ald.debt_amount_allowed), 0)
   FROM   ALLOWED_DEBTS ald
   WHERE  ald.debt_co_number = p_co_number
   AND    ((ald.debt_status IN ('LIVE', 'SCHEDULE2', 'PAID') AND p_schedule2 = 'Y') OR (ald.debt_status IN ('LIVE','PAID') AND p_schedule2 = 'N'));
CURSOR c_total_debts IS
   SELECT SUM(ald.debt_amount_allowed)
   FROM   ALLOWED_DEBTS ald
   WHERE  ald.debt_co_number = p_co_number
   AND    ald.debt_status IN ('LIVE', 'SCHEDULE2','PAID');
CURSOR c_fee_element IS
   SELECT NVL(co.fee_amount,0)
   FROM   CONSOLIDATED_ORDERS co
   WHERE  co.co_number = p_co_number;
BEGIN
  -- Get amount paid
  OPEN c_paid;
  FETCH c_paid INTO l_paid;
  CLOSE c_paid;
    IF l_paid > 0 THEN
    -- Get fees paid to date
    OPEN c_paid_fees;
    FETCH c_paid_fees INTO l_paid_fees;
    CLOSE c_paid_fees;
    -- Add the fee amount to the creditor payments to get total paid out
    l_paid := l_paid + l_paid_fees;
  END IF;
  -- Get passthroughs
  OPEN c_live_pass;
  FETCH c_live_pass INTO l_live_pass;
  CLOSE c_live_pass;
  IF p_schedule2 = 'Y' THEN
    -- Get s2 passthroughs if required
    OPEN c_s2_pass;
    FETCH c_s2_pass INTO l_s2_pass;
    CLOSE c_s2_pass;
  ELSE l_s2_pass := 0;
  END IF;
  -- get live debts
  OPEN c_included_debts;
  FETCH c_included_debts INTO l_included_debts;
  CLOSE c_included_debts;
  -- schedule 2 included?
  IF p_schedule2 = 'Y' THEN
    l_total_debts := l_included_debts;
    l_pass := l_live_pass + l_s2_pass;
  ELSE
    l_pass := l_live_pass;
    -- get total debts
    OPEN c_total_debts;
    FETCH c_total_debts INTO l_total_debts;
    CLOSE c_total_debts;
  END IF;
  OPEN c_fee_element;
  FETCH c_fee_element INTO l_fee_element;
  -- only calculate a proportion if there are valid debts
  IF (l_total_debts - l_pass) > 0 THEN
    l_fee_element := l_fee_element * (l_included_debts - l_pass)/(l_total_debts - l_pass);
  END IF;
  CLOSE c_fee_element;
  -- RETURN balance
  l_balance := (l_included_debts + l_fee_element) - (l_paid + l_pass);
  RETURN l_balance;

END CMF_CO_OS_BALANCE;

/******************************************************************************/
/* FUNCTION: CMF_DOM_OS_BALANCE                                                */
/* Based on cmf_co_os_balance but to include PENDING debts                     */
/* Defect CaseMan 6145                                                         */
/******************************************************************************/

FUNCTION CMF_DOM_OS_BALANCE (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE, p_schedule2 VARCHAR2 DEFAULT 'Y') RETURN NUMBER IS

l_live_pass NUMBER(12,2) :=0;
l_s2_pass   NUMBER(12,2) :=0;
l_pass NUMBER(12, 2) := 0;
l_paid NUMBER(12, 2) := 0;
l_paid_fees  NUMBER(12,2) := 0;
l_debt NUMBER(12, 2) := 0;
l_included_debts NUMBER(12, 2) := 0;
l_total_debts NUMBER(12, 2) := 0;
l_fee_element NUMBER(12, 2) := 0;
l_balance NUMBER(12,2) := 0;
l_fee_rate consolidated_orders.fee_rate%TYPE := 0;
l_total_fee NUMBER(12, 2) := 0;
l_fee_exc_s2 NUMBER(12,2) := 0;
l_fee_s2 NUMBER(12,2) := 0;
l_debt_exc_s2 NUMBER(12,2) := 0;
l_debt_s2 NUMBER(12,2) := 0;

CURSOR c_paid IS
   SELECT NVL(SUM(dd.dd_amount), 0)
   FROM   DEBT_DIVIDENDS dd, ALLOWED_DEBTS ald
   WHERE  dd.dd_ald_seq = ald.debt_seq
   AND    ald.debt_co_number = p_co_number
   AND    ((ald.debt_status IN ('LIVE', 'SCHEDULE2','PAID', 'PENDING') AND p_schedule2 = 'Y') OR (ald.debt_status IN ('LIVE','PAID', 'PENDING') AND p_schedule2 = 'N'))
   AND   dd.created = 'Y';

CURSOR c_paid_fees IS
   SELECT NVL(SUM(d.div_fee),0)
   FROM   DIVIDENDS d
   WHERE  d.div_co_number = p_co_number
   AND    d.created = 'Y';

CURSOR c_live_pass IS
   SELECT NVL(SUM(pay.amount), 0)
   FROM   PAYMENTS pay, ALLOWED_DEBTS ald
   WHERE  ald.debt_seq = pay.ald_debt_seq
   AND    pay.passthrough = 'Y'
   AND    ald.debt_co_number = p_co_number
   AND    ald.debt_status IN ('LIVE', 'PAID', 'PENDING')
   AND    pay.error_indicator = 'N';

CURSOR c_s2_pass IS
   SELECT NVL(SUM(pay.amount), 0)
   FROM   PAYMENTS pay, ALLOWED_DEBTS ald
   WHERE  ald.debt_seq = pay.ald_debt_seq
   AND    pay.passthrough = 'Y'
   AND    ald.debt_co_number = p_co_number
   AND    ald.debt_status = 'SCHEDULE2'
   AND    pay.error_indicator = 'N';
CURSOR c_included_debts IS
   SELECT NVL(SUM(ald.debt_amount_allowed), 0)
   FROM   ALLOWED_DEBTS ald
   WHERE  ald.debt_co_number = p_co_number
   AND    ((ald.debt_status IN ('LIVE', 'SCHEDULE2', 'PAID', 'PENDING') AND p_schedule2 = 'Y') OR (ald.debt_status IN ('LIVE','PAID', 'PENDING') AND p_schedule2 = 'N'));
CURSOR c_total_debts IS
   SELECT SUM(ald.debt_amount_allowed)
   FROM   ALLOWED_DEBTS ald
   WHERE  ald.debt_co_number = p_co_number
   AND    ald.debt_status IN ('LIVE', 'SCHEDULE2','PAID', 'PENDING');
/* Defect 6145 3 new cursors for fee calculation, as table consolidated_orders holds  */
/* fee as calculated for screen (excludes PENDING)                                    */
CURSOR c_fee_rate IS
   SELECT fee_rate
   FROM CONSOLIDATED_ORDERS
   WHERE co_number = p_co_number;
CURSOR c_debt_exc_s2 IS
   SELECT NVL(SUM(ald.debt_amount_allowed),0)
   FROM allowed_debts ald
   WHERE ald.debt_co_number = p_co_number
   AND ald.debt_status in ('LIVE','PAID','PENDING');
CURSOR c_debt_s2 IS
   SELECT NVL(SUM(ald.debt_amount_allowed),0)
   FROM allowed_debts ald
   WHERE ald.debt_co_number = p_co_number
   AND ald.debt_status = 'SCHEDULE2';

BEGIN
  -- Get amount paid
  OPEN c_paid;
  FETCH c_paid INTO l_paid;
  CLOSE c_paid;
    IF l_paid > 0 THEN
    -- Get fees paid to date
    OPEN c_paid_fees;
    FETCH c_paid_fees INTO l_paid_fees;
    CLOSE c_paid_fees;
    -- Add the fee amount to the creditor payments to get total paid out
    l_paid := l_paid + l_paid_fees;
  END IF;
  -- Get passthroughs
  OPEN c_live_pass;
  FETCH c_live_pass INTO l_live_pass;
  CLOSE c_live_pass;
  IF p_schedule2 = 'Y' THEN
    -- Get s2 passthroughs if required
    OPEN c_s2_pass;
    FETCH c_s2_pass INTO l_s2_pass;
    CLOSE c_s2_pass;
  ELSE l_s2_pass := 0;
  END IF;
  -- get live debts
  OPEN c_included_debts;
  FETCH c_included_debts INTO l_included_debts;
  CLOSE c_included_debts;
  -- schedule 2 included?
  IF p_schedule2 = 'Y' THEN
    l_total_debts := l_included_debts;
    l_pass := l_live_pass + l_s2_pass;
  ELSE
    l_pass := l_live_pass;
    -- get total debts
    OPEN c_total_debts;
    FETCH c_total_debts INTO l_total_debts;
    CLOSE c_total_debts;
  END IF;
/* Defect CaseMan 6145 fee calculation  */
-- Get fee rate
  OPEN c_fee_rate;
  FETCH c_fee_rate into l_fee_rate;
  CLOSE c_fee_rate;
-- Get total debts excluding schedule2
  OPEN c_debt_exc_s2;
  FETCH c_debt_exc_s2 INTO l_debt_exc_s2;
  CLOSE c_debt_exc_s2;
-- Get schedule2 debts
  OPEN c_debt_s2;
  FETCH c_debt_s2 INTO l_debt_s2;
  CLOSE c_debt_s2;
-- Calculate individual fees for debts excluding schedule 2, schedule2. If the combined
-- total is more than the total fee deduct 0.05 from each fee, to cater for rounding errors.
-- This is consistent with the fee calculation in the CO screen (except CO screen does
-- not count PENDING debts)
  l_fee_exc_s2 := round(ceil(l_debt_exc_s2 - l_live_pass)*l_fee_rate/100,2);
  l_fee_s2 := round(ceil(l_debt_s2 - l_s2_pass)*l_fee_rate/100,2);
  l_total_fee := round(ceil(l_included_debts - l_pass)*l_fee_rate/100,2);
  IF l_fee_exc_s2 + l_fee_s2 > l_total_fee THEN
     l_fee_exc_s2 := l_fee_exc_s2 - 0.05;
     l_fee_s2 := l_fee_s2 - 0.05;
  END IF;
  l_fee_element := l_fee_exc_s2 + l_fee_s2;
  l_balance := (l_included_debts + l_fee_element) - (l_paid + l_pass);
  RETURN l_balance;

END CMF_DOM_OS_BALANCE;

/******************************************************************************/
/* FUNCTION: CMF_SYSTEM_DATA                                                  */
/******************************************************************************/

FUNCTION cmf_system_data (p_item IN SYSTEM_DATA.item%TYPE, p_update IN VARCHAR2, p_court_code IN COURTS.code%TYPE) RETURN NUMBER IS

CURSOR c_system_data IS
  SELECT item_value
  FROM SYSTEM_DATA
  WHERE item = p_item
  AND admin_court_code = p_court_code;

  l_item_value SYSTEM_DATA.item_value%TYPE;

BEGIN
  -- Retrieve system_data details
  OPEN c_system_data;
  FETCH c_system_data INTO l_item_value;
  IF c_system_data%NOTFOUND THEN
    CLOSE c_system_data;
    RETURN -1;
  ELSE
    CLOSE c_system_data;
    IF p_update = 'Y' THEN
      UPDATE SYSTEM_DATA
      SET item_value = item_value + 1
      WHERE item = p_item
      AND admin_court_code = p_court_code;
      IF SQL%NOTFOUND THEN
        RETURN -2;
      ELSE
        COMMIT;
        RETURN l_item_value;
      END IF;
    ELSE
      RETURN l_item_value;
    END IF;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RETURN SQLCODE;
END cmf_system_data;

/******************************************************************************/
/* FUNCTION: CMF_TODAY                                                        */
/******************************************************************************/

FUNCTION cmf_today RETURN VARCHAR2 IS

BEGIN
  RETURN TO_CHAR(SYSDATE,'DD-MON-YYYY');

END cmf_today;

/******************************************************************************/
/* FUNCTION: CMP_COURT                                                        */
/******************************************************************************/

PROCEDURE cmp_court (p_court_code IN COURTS.code%TYPE,
         p_name OUT COURTS.name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no OUT COURTS.tel_no%TYPE,
         p_fax_no OUT COURTS.fax_no%TYPE,
         p_open OUT PERSONALISE.open_from%TYPE,
         p_close OUT PERSONALISE.closed_at%TYPE,
         p_error OUT VARCHAR2) IS
   CURSOR c_court IS
      SELECT
         crt.name,
         addr.address_line1,
         addr.address_line2,
         addr.address_line3,
         addr.address_line4,
         addr.address_line5,
         addr.postcode,
         crt.tel_no,
         crt.fax_no,
         per.open_from,
         per.closed_at
      FROM
         COURTS crt,
         PERSONALISE per,
         GIVEN_ADDRESSES addr
      WHERE crt.code = p_court_code
      AND   per.crt_code = crt.code
      AND   addr.court_code = crt.code
      AND   addr.valid_to IS NULL
      AND   addr.address_type_code = 'OFFICE';
      l_name   COURTS.name%TYPE;
      l_addr_1 GIVEN_ADDRESSES.address_line1%TYPE;
      l_addr_2 GIVEN_ADDRESSES.address_line2%TYPE;
      l_addr_3 GIVEN_ADDRESSES.address_line3%TYPE;
      l_addr_4 GIVEN_ADDRESSES.address_line4%TYPE;
      l_addr_5 GIVEN_ADDRESSES.address_line5%TYPE;
      l_postcode GIVEN_ADDRESSES.postcode%TYPE;
      l_tel_no   COURTS.tel_no%TYPE;
      l_fax_no   COURTS.fax_no%TYPE;
      l_open     PERSONALISE.open_from%TYPE;
      l_close    PERSONALISE.closed_at%TYPE;
   BEGIN
      -- Select court details
      OPEN c_court;
      FETCH c_court INTO l_name,
                         l_addr_1,
                         l_addr_2,
                         l_addr_3,
                         l_addr_4,
                         l_addr_5,
                         l_postcode,
                         l_tel_no,
                         l_fax_no,
                         l_open,
                         l_close;
      IF c_court%NOTFOUND THEN
         p_error := 'cmp_court court details not found';
      ELSE
         p_name   :=  l_name;
         p_addr_1 :=  l_addr_1;
         p_addr_2 :=  l_addr_2;
         p_addr_3 :=  l_addr_3;
         p_addr_4 :=  l_addr_4;
         p_addr_5 :=  l_addr_5;
         p_postcode :=  l_postcode;
         p_tel_no   :=  l_tel_no;
         p_fax_no   :=  l_fax_no;
         p_open     :=  l_open;
         p_close    :=  l_close;
      END IF;
   CLOSE c_court;
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_court '||SQLERRM;
END cmp_court;

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_court_2 (p_court_code IN COURTS.code%TYPE,
         p_name OUT COURTS.name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no OUT COURTS.tel_no%TYPE,
         p_fax_no OUT COURTS.fax_no%TYPE,
         p_dx_no OUT COURTS.dx_number%TYPE,
         p_open OUT PERSONALISE.open_from%TYPE,
         p_close OUT PERSONALISE.closed_at%TYPE,
         p_error OUT VARCHAR2) IS

    CURSOR c_court IS
    SELECT crt.name,
           addr.address_line1,
           addr.address_line2,
           addr.address_line3,
           addr.address_line4,
           addr.address_line5,
           addr.postcode,
           crt.tel_no,
           crt.fax_no,
           crt.dx_number,
           per.open_from,
           per.closed_at
    FROM   COURTS crt,
           PERSONALISE per,
           GIVEN_ADDRESSES addr
    WHERE  crt.code = p_court_code
    AND    per.crt_code = crt.code
    AND    addr.court_code = crt.code
    AND    addr.valid_to IS NULL
    AND    addr.address_type_code = 'OFFICE';
    
    l_name   COURTS.name%TYPE;
    l_addr_1 GIVEN_ADDRESSES.address_line1%TYPE;
    l_addr_2 GIVEN_ADDRESSES.address_line2%TYPE;
    l_addr_3 GIVEN_ADDRESSES.address_line3%TYPE;
    l_addr_4 GIVEN_ADDRESSES.address_line4%TYPE;
    l_addr_5 GIVEN_ADDRESSES.address_line5%TYPE;
    l_postcode GIVEN_ADDRESSES.postcode%TYPE;
    l_tel_no   COURTS.tel_no%TYPE;
    l_fax_no   COURTS.fax_no%TYPE;
    l_dx_no    COURTS.dx_number%TYPE;
    l_open     PERSONALISE.open_from%TYPE;
    l_close    PERSONALISE.closed_at%TYPE;

BEGIN
    -- Select court details
    OPEN c_court;
    FETCH c_court INTO l_name,
                       l_addr_1,
                       l_addr_2,
                       l_addr_3,
                       l_addr_4,
                       l_addr_5,
                       l_postcode,
                       l_tel_no,
                       l_fax_no,
                       l_dx_no,
                       l_open,
                       l_close;
 
    IF c_court%NOTFOUND THEN
        p_error := 'cmp_court_2 court details not found';
    ELSE
        p_name     :=  l_name;
        p_addr_1   :=  l_addr_1;
        p_addr_2   :=  l_addr_2;
        p_addr_3   :=  l_addr_3;
        p_addr_4   :=  l_addr_4;
        p_addr_5   :=  l_addr_5;
        p_postcode :=  l_postcode;
        p_tel_no   :=  l_tel_no;
        p_fax_no   :=  l_fax_no;
        p_dx_no    :=  l_dx_no;
        p_open     :=  l_open;
        p_close    :=  l_close;
    END IF;
    CLOSE c_court;

EXCEPTION
    WHEN OTHERS THEN
        p_error := 'cmp_court_2 '||SQLERRM;
END cmp_court_2;

/******************************************************************************/
/* PROCEDURE: CMP_COURT_3                                                     */
/* Added as part of Trac 4718.												  */
/******************************************************************************/

PROCEDURE cmp_court_3 (p_court_code IN COURTS.code%TYPE,
         p_name OUT COURTS.name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no OUT COURTS.tel_no%TYPE,
         p_fax_no OUT COURTS.fax_no%TYPE,
         p_dx_no OUT COURTS.dx_number%TYPE,
         p_open OUT PERSONALISE.open_from%TYPE,
         p_close OUT PERSONALISE.closed_at%TYPE,
		 p_dr_open OUT PERSONALISE.dr_open_from%TYPE,
		 p_dr_close OUT PERSONALISE.dr_closed_at%TYPE,
		 p_by_appointment OUT PERSONALISE.by_appointment_ind%TYPE,
		 p_dr_tel_no OUT COURTS.dr_tel_no%TYPE,
         p_error OUT VARCHAR2) IS

    CURSOR c_court IS
    SELECT crt.name,
           addr.address_line1,
           addr.address_line2,
           addr.address_line3,
           addr.address_line4,
           addr.address_line5,
           addr.postcode,
           crt.tel_no,
           crt.fax_no,
           crt.dx_number,
           per.open_from,
           per.closed_at,
		   per.dr_open_from,
		   per.dr_closed_at,
		   NVL(per.by_appointment_ind, 'N'),
		   crt.dr_tel_no
    FROM   COURTS crt,
           PERSONALISE per,
           GIVEN_ADDRESSES addr
    WHERE  crt.code = p_court_code
    AND    per.crt_code = crt.code
    AND    addr.court_code = crt.code
    AND    addr.valid_to IS NULL
    AND    addr.address_type_code = 'OFFICE';
    
    l_name   COURTS.name%TYPE;
    l_addr_1 GIVEN_ADDRESSES.address_line1%TYPE;
    l_addr_2 GIVEN_ADDRESSES.address_line2%TYPE;
    l_addr_3 GIVEN_ADDRESSES.address_line3%TYPE;
    l_addr_4 GIVEN_ADDRESSES.address_line4%TYPE;
    l_addr_5 GIVEN_ADDRESSES.address_line5%TYPE;
    l_postcode GIVEN_ADDRESSES.postcode%TYPE;
    l_tel_no   COURTS.tel_no%TYPE;
    l_fax_no   COURTS.fax_no%TYPE;
    l_dx_no    COURTS.dx_number%TYPE;
    l_open     PERSONALISE.open_from%TYPE;
    l_close    PERSONALISE.closed_at%TYPE;
	l_dr_open PERSONALISE.dr_open_from%TYPE;
	l_dr_close PERSONALISE.dr_closed_at%TYPE;
	l_by_appointment PERSONALISE.by_appointment_ind%TYPE;
	l_dr_tel_no COURTS.dr_tel_no%TYPE;

BEGIN
    -- Select court details
    OPEN c_court;
    FETCH c_court INTO l_name,
                       l_addr_1,
                       l_addr_2,
                       l_addr_3,
                       l_addr_4,
                       l_addr_5,
                       l_postcode,
                       l_tel_no,
                       l_fax_no,
                       l_dx_no,
                       l_open,
                       l_close,
					   l_dr_open,
					   l_dr_close,
					   l_by_appointment,
					   l_dr_tel_no;
 
    IF c_court%NOTFOUND THEN
        p_error := 'cmp_court_3 court details not found';
    ELSE
        p_name     := l_name;
        p_addr_1   := l_addr_1;
        p_addr_2   := l_addr_2;
        p_addr_3   := l_addr_3;
        p_addr_4   := l_addr_4;
        p_addr_5   := l_addr_5;
        p_postcode := l_postcode;
        p_tel_no   := l_tel_no;
        p_fax_no   := l_fax_no;
        p_dx_no    := l_dx_no;
        p_open     := l_open;
        p_close    := l_close;
		p_dr_open  := l_dr_open;
		p_dr_close := l_dr_close;
		p_by_appointment := l_by_appointment;
		p_dr_tel_no := l_dr_tel_no;
    END IF;
    CLOSE c_court;

EXCEPTION
    WHEN OTHERS THEN
        p_error := 'cmp_court_3 '||SQLERRM;
END cmp_court_3;

/******************************************************************************/
/* PROCEDURE: CMP_GET_USER_INFORMATION                                        */
/******************************************************************************/

PROCEDURE cmp_get_user_information
        (p_user_id   IN USER_INFORMATION.user_id%TYPE,
         p_name      OUT USER_INFORMATION.name%TYPE,
         p_section   OUT USER_INFORMATION.SECTION%TYPE,
         p_extension OUT USER_INFORMATION.extension%TYPE,
         p_error     OUT VARCHAR2) IS
   CURSOR c_user IS
      SELECT
         name,
         SECTION,
         extension
      FROM
         USER_INFORMATION
      WHERE user_id = p_user_id;
   l_name      USER_INFORMATION.name%TYPE;
   l_section   USER_INFORMATION.SECTION%TYPE;
   l_extension USER_INFORMATION.extension%TYPE;
BEGIN
   OPEN c_user;
   FETCH c_user INTO l_name,
                     l_section,
                     l_extension;
   IF c_user%NOTFOUND THEN
      p_name := p_user_id;
      p_section := NULL;
      p_extension := NULL;
   ELSE
      p_name := l_name;
      p_section := l_section;
      p_extension := l_extension;
   END IF;
   CLOSE c_user;
EXCEPTION
   WHEN OTHERS THEN
      p_error := 'cmp_get_user_information '||SQLERRM;
END cmp_get_user_information;

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_get_user_information_2
        (p_user_id   IN  dca_user.user_id%TYPE,
         p_title     OUT dca_user.title%TYPE,
         p_forenames OUT dca_user.forenames%TYPE,
         p_surname   OUT dca_user.surname%TYPE,
         p_error     OUT VARCHAR2) IS

    CURSOR c_user IS
    SELECT u.title,
           u.forenames,
           u.surname
    FROM   dca_user u
    WHERE  u.user_id = p_user_id;

   l_title     dca_user.title%TYPE;
   l_forenames dca_user.forenames%TYPE;
   l_surname   dca_user.surname%TYPE;
   
BEGIN
    OPEN c_user;
    FETCH c_user INTO l_title,
                      l_forenames,
                      l_surname;
    IF c_user%NOTFOUND THEN
        p_forenames := p_user_id;
        p_surname   := NULL;
        p_title     := NULL;
    ELSE
        p_title     := l_title;
        p_forenames := l_forenames;
        p_surname   := l_surname;
    END IF;
    CLOSE c_user;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'cmp_get_user_information_2 '||SQLERRM;
END cmp_get_user_information_2;

/******************************************************************************/
/* PROCEDURE: CMP_GET_USER_ALIAS                                             */
/******************************************************************************/

FUNCTION cmp_get_user_alias
        (p_user_id   IN USER_INFORMATION.user_id%TYPE)
RETURN VARCHAR2
IS
   CURSOR c_user IS
      SELECT
         name
      FROM
         USER_INFORMATION
      WHERE user_id = p_user_id;

   l_name      USER_INFORMATION.name%TYPE;

BEGIN
   OPEN c_user;
   FETCH c_user INTO l_name;
   IF c_user%NOTFOUND THEN
      l_name := p_user_id;
   END IF;
   CLOSE c_user;

   RETURN l_name;
END cmp_get_user_alias;

/******************************************************************************/
/* PROCEDURE: CMP_ORDER_DETAILS                                               */
/******************************************************************************/

PROCEDURE cmp_order_details
        (p_order_id IN ORDER_TYPES.order_id%TYPE,
         p_display_order_id   OUT ORDER_TYPES.display_order_id%TYPE,
         p_previous_order_id  OUT ORDER_TYPES.previous_order_id%TYPE,
         p_order_description  OUT ORDER_TYPES.order_description%TYPE,
         p_legal_description  OUT ORDER_TYPES.legal_description%TYPE,
         p_document_type      OUT ORDER_TYPES.document_type%TYPE,
         p_report_type        OUT ORDER_TYPES.report_type%TYPE,
         p_module_name        OUT ORDER_TYPES.module_name%TYPE,
         p_module_group       OUT ORDER_TYPES.module_group%TYPE,
         p_selection_criteria OUT ORDER_TYPES.selection_criteria%TYPE,
         p_doc_recipient      OUT ORDER_TYPES.doc_recipient%TYPE,
         p_doc_payee      OUT ORDER_TYPES.doc_payee%TYPE,
         p_printer_type   OUT ORDER_TYPES.printer_type%TYPE,
         p_user_edit      OUT ORDER_TYPES.user_edit%TYPE,
         p_file_prefix    OUT ORDER_TYPES.file_prefix%TYPE,
         p_file_extension OUT ORDER_TYPES.file_extension%TYPE,
         p_error     OUT VARCHAR2) IS
   CURSOR c_ord IS
      SELECT
         display_order_id,
         previous_order_id,
         order_description,
         legal_description,
         document_type,
         report_type,
         module_name,
         module_group,
         selection_criteria,
         doc_recipient,
         doc_payee,
         printer_type,
         user_edit,
         file_prefix,
         file_extension
      FROM
         ORDER_TYPES
      WHERE order_id = p_order_id;
      l_display_order_id   ORDER_TYPES.display_order_id%TYPE;
      l_previous_order_id  ORDER_TYPES.previous_order_id%TYPE;
      l_order_description  ORDER_TYPES.order_description%TYPE;
      l_legal_description  ORDER_TYPES.legal_description%TYPE;
      l_document_type      ORDER_TYPES.document_type%TYPE;
      l_report_type        ORDER_TYPES.report_type%TYPE;
      l_module_name        ORDER_TYPES.module_name%TYPE;
      l_module_group       ORDER_TYPES.module_group%TYPE;
      l_selection_criteria ORDER_TYPES.selection_criteria%TYPE;
      l_doc_recipient      ORDER_TYPES.doc_recipient%TYPE;
      l_doc_payee      ORDER_TYPES.doc_payee%TYPE;
      l_printer_type   ORDER_TYPES.printer_type%TYPE;
      l_user_edit      ORDER_TYPES.user_edit%TYPE;
      l_file_prefix    ORDER_TYPES.file_prefix%TYPE;
      l_file_extension ORDER_TYPES.file_extension%TYPE;
   BEGIN
      -- Select order type details
      OPEN c_ord;
      FETCH c_ord INTO l_display_order_id,
                       l_previous_order_id,
                       l_order_description,
                       l_legal_description,
                       l_document_type,
                       l_report_type,
                       l_module_name,
                       l_module_group,
                       l_selection_criteria,
                       l_doc_recipient,
                       l_doc_payee,
                       l_printer_type,
                       l_user_edit,
                       l_file_prefix,
                       l_file_extension;
      IF c_ord%NOTFOUND THEN
         p_error := 'cmp_order_details order details not found';
      ELSE
         p_display_order_id  := l_display_order_id;
         p_previous_order_id := l_previous_order_id;
         p_order_description := l_order_description;
         p_legal_description := l_legal_description;
         p_document_type     := l_document_type;
         p_report_type       := l_report_type;
         p_module_name       := l_module_name;
         p_module_group      := l_module_group;
         p_selection_criteria := l_selection_criteria;
         p_doc_recipient  := l_doc_recipient;
         p_doc_payee      := l_doc_payee;
         p_printer_type   := l_printer_type;
         p_user_edit      := l_user_edit;
         p_file_prefix    := l_file_prefix;
         p_file_extension := l_file_extension;
      END IF;
      CLOSE c_ord;
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_order_details '||SQLERRM;
END cmp_order_details;

/******************************************************************************/
/* PROCEDURE: CMP_REPORT_INITIALISATION                                       */
/******************************************************************************/

PROCEDURE cmp_report_initialisation
        (p_event_seq    IN AE_EVENTS.ae_event_seq%TYPE,
         p_order_id     IN ORDER_TYPES.order_id%TYPE,
         p_submitted_by IN USER_INFORMATION.user_id%TYPE,
         p_display_order_id   OUT ORDER_TYPES.display_order_id%TYPE,
         p_legal_description  OUT ORDER_TYPES.legal_description%TYPE,
         p_order_description  OUT ORDER_TYPES.order_description%TYPE,
         p_document_type      OUT ORDER_TYPES.document_type%TYPE,
         p_selection_criteria OUT ORDER_TYPES.selection_criteria%TYPE,
         p_doc_recipient  OUT ORDER_TYPES.doc_recipient%TYPE,
         p_doc_payee      OUT ORDER_TYPES.doc_payee%TYPE,
         p_file_prefix    OUT ORDER_TYPES.file_prefix%TYPE,
         p_file_extension OUT ORDER_TYPES.file_extension%TYPE,
         p_name      OUT USER_INFORMATION.name%TYPE,
         p_section   OUT USER_INFORMATION.SECTION%TYPE,
         p_extension OUT USER_INFORMATION.extension%TYPE,
         p_error     OUT VARCHAR2) IS
   -- cmp_order_details
   l_display_order_id  ORDER_TYPES.display_order_id%TYPE;
   l_previous_order_id ORDER_TYPES.previous_order_id%TYPE;
   l_order_description ORDER_TYPES.order_description%TYPE;
   l_legal_description ORDER_TYPES.legal_description%TYPE;
   l_document_type ORDER_TYPES.document_type%TYPE;
   l_report_type   ORDER_TYPES.report_type%TYPE;
   l_module_name   ORDER_TYPES.module_name%TYPE;
   l_module_group  ORDER_TYPES.module_group%TYPE;
   l_selection_criteria ORDER_TYPES.selection_criteria%TYPE;
   l_doc_recipient  ORDER_TYPES.doc_recipient%TYPE;
   l_doc_payee      ORDER_TYPES.doc_payee%TYPE;
   l_printer_type   ORDER_TYPES.printer_type%TYPE;
   l_user_edit      ORDER_TYPES.user_edit%TYPE;
   l_file_prefix    ORDER_TYPES.file_prefix%TYPE;
   l_file_extension ORDER_TYPES.file_extension%TYPE;
   l_error VARCHAR2(2000);
   -- cmp_get_user_information
   l_name      USER_INFORMATION.name%TYPE;
   l_section   USER_INFORMATION.SECTION%TYPE;
   l_extension USER_INFORMATION.extension%TYPE;
   BEGIN
      -- n.b. p_event_seq doesn't appear to be required at the moment
      -- but will be left for now, just in case
      cmp_order_details(p_order_id,
                        l_display_order_id,
                        l_previous_order_id,
                        l_order_description,
                        l_legal_description,
                        l_document_type,
                        l_report_type,
                        l_module_name,
                        l_module_group,
                        l_selection_criteria,
                        l_doc_recipient,
                        l_doc_payee,
                        l_printer_type,
                        l_user_edit,
                        l_file_prefix,
                        l_file_extension,
                        l_error);
      IF l_error IS NOT NULL THEN
         p_error := 'cmp_report_initialisation '||l_error;
      ELSE
         p_display_order_id   := l_display_order_id;
         p_legal_description  := l_legal_description;
         p_order_description  := l_order_description;
         p_document_type      := l_document_type;
         p_selection_criteria := l_selection_criteria;
         p_doc_recipient      := l_doc_recipient;
         p_doc_payee          := l_doc_payee;
         p_file_prefix        := l_file_prefix;
         p_file_extension     := l_file_extension;
      END IF;
      cmp_get_user_information(p_submitted_by,
                               l_name,
                               l_section,
                               l_extension,
                               l_error);
      IF l_error IS NOT NULL THEN
         p_error := 'cmp_report_initialisation '||l_error;
      ELSE
         p_name      := l_name;
         p_section   := l_section;
         p_extension := l_extension;
      END IF;
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_report_initialisation '||SQLERRM;
END cmp_report_initialisation;

/******************************************************************************/
/* PROCEDURE: CMP_AE_DETAILS                                                  */
/******************************************************************************/

PROCEDURE cmp_ae_details
        (p_ae_number    IN AE_APPLICATIONS.ae_number%TYPE,
         p_case_number  OUT AE_APPLICATIONS.case_number%TYPE,
         p_ae_type      OUT AE_APPLICATIONS.ae_type%TYPE,
         p_ae_fee       OUT AE_APPLICATIONS.ae_fee%TYPE,
         p_amount_of_ae OUT AE_APPLICATIONS.amount_of_ae%TYPE,
         p_per    OUT AE_APPLICATIONS.protected_earnings_rate%TYPE,
         p_ndr    OUT AE_APPLICATIONS.normal_deduction_rate%TYPE,
         p_pep    OUT AE_APPLICATIONS.protected_earnings_period%TYPE,
         p_ndp    OUT AE_APPLICATIONS.normal_deduction_period%TYPE,
         p_date_of_issue OUT AE_APPLICATIONS.date_of_issue%TYPE,
         p_error         OUT VARCHAR2) IS
   CURSOR c_ae IS
      SELECT
         ae_type,
         case_number,
         ae_fee,
         amount_of_ae,
         protected_earnings_rate,
         normal_deduction_rate,
         protected_earnings_period,
         normal_deduction_period,
         date_of_issue
      FROM
         AE_APPLICATIONS
      WHERE ae_number = p_ae_number;
      l_case_number   AE_APPLICATIONS.case_number%TYPE;
      l_ae_type       AE_APPLICATIONS.ae_type%TYPE;
      l_ae_fee        AE_APPLICATIONS.ae_fee%TYPE;
      l_amount_of_ae  AE_APPLICATIONS.amount_of_ae%TYPE;
      l_per  AE_APPLICATIONS.protected_earnings_rate%TYPE;
      l_ndr  AE_APPLICATIONS.normal_deduction_rate%TYPE;
      l_pep  AE_APPLICATIONS.protected_earnings_period%TYPE;
      l_ndp  AE_APPLICATIONS.normal_deduction_period%TYPE;
      l_date_of_issue AE_APPLICATIONS.date_of_issue%TYPE;
   BEGIN
      -- Select ae application details
      OPEN c_ae;
      FETCH c_ae INTO l_ae_type,
                      l_case_number,
                      l_ae_fee,
                      l_amount_of_ae,
                      l_per,
                      l_ndr,
                      l_pep,
                      l_ndp,
                      l_date_of_issue;
      IF c_ae%NOTFOUND THEN
         p_error := 'cmp_ae_details ae application not found';
      ELSE
         p_case_number  := l_case_number;
         p_ae_type      := l_ae_type;
         p_ae_fee       := l_ae_fee;
         p_amount_of_ae := l_amount_of_ae;
         p_per := l_per;
         p_ndr := l_ndr;
         p_pep := l_pep;
         p_ndp := l_ndp;
         p_date_of_issue := l_date_of_issue;
      END IF;
      CLOSE c_ae;
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_ae_details '||SQLERRM;
END cmp_ae_details;

/******************************************************************************/
/* PROCEDURE: CMP_RUN_VARIABLE_FUNCTIONS                                      */
/******************************************************************************/

PROCEDURE cmp_run_variable_functions
           (p_event_seq      IN NUMBER,
            p_variable_code  IN DOCUMENT_VARIABLES.code%TYPE,
            p_variable_value OUT VARCHAR2,
            p_error          OUT VARCHAR2)  IS
   CURSOR c_doc_var IS
      SELECT
         select_clause,
         REPLACE(from_where_clause,'P_EVENT_SEQ',':b_event_seq')
      FROM
         DOCUMENT_VARIABLES
      WHERE code = p_variable_code;
   l_source_cursor      INTEGER;
   l_destination_cursor INTEGER;
   l_rows_processed     INTEGER;
   l_variable_value     VARCHAR2(2000);
   l_select_clause      DOCUMENT_VARIABLES.select_clause%TYPE;
   l_from_where_clause  DOCUMENT_VARIABLES.from_where_clause%TYPE;
   BEGIN
      OPEN c_doc_var;
      FETCH c_doc_var INTO l_select_clause,
                           l_from_where_clause;
      IF c_doc_var%NOTFOUND THEN
         CLOSE c_doc_var;
         p_error := 'cmp_run_variable_functions document variable not found';
      ELSE
         l_source_cursor := dbms_sql.open_cursor;
         dbms_sql.parse(l_source_cursor,
                        'begin select ' || l_select_clause || ' into ' || ':b_variable_value' ||
                        ' from ' || l_from_where_clause ||
                        '; end;' ,2);
         dbms_sql.bind_variable(l_source_cursor,
                                'b_variable_value',
                                l_variable_value,
                                2000);
         dbms_sql.bind_variable(l_source_cursor,
                                'b_event_seq',
                                p_event_seq);
         l_rows_processed := dbms_sql.EXECUTE(l_source_cursor);
         dbms_sql.variable_value(l_source_cursor,
                                 'b_variable_value',
                                 l_variable_value);
         dbms_sql.close_cursor(l_source_cursor);
         p_variable_value := l_variable_value;
         CLOSE c_doc_var;
      END IF;
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_run_variable_functions '||SQLERRM;
END cmp_run_variable_functions;

/******************************************************************************/
/* FUNCTION: CMF_REPLACE_VARIABLES                                            */
/******************************************************************************/

FUNCTION cmf_replace_variables
        (p_event_seq   IN AE_EVENTS.ae_event_seq%TYPE,
         p_od_seq      IN OUTPUT_DETAILS.od_seq%TYPE,
         p_sub_text    IN VARCHAR2,
         p_sub_text_no IN NUMBER) RETURN VARCHAR2 IS
   CURSOR c_get_vars IS
      SELECT
         variable_code,
         sdv_seq
      FROM
         SUB_DETAIL_VARIABLES
      WHERE od_seq =  p_od_seq
      AND sub_item_number = p_sub_text_no;
   l_variable_value  VARCHAR2(2000);
   l_variable_code   SUB_DETAIL_VARIABLES.variable_code%TYPE;
   l_sub_detail_text VARCHAR2(2000) := p_sub_text;
   l_error           VARCHAR2(2000);
   r_get_vars        c_get_vars%ROWTYPE;
   BEGIN
      <<vars>>
      FOR r_get_vars IN c_get_vars LOOP
         l_variable_code := r_get_vars.variable_code;
         cmp_run_variable_functions(p_event_seq,
                                    l_variable_code,
                                    l_variable_value,
                                    l_error);
         IF l_error IS NULL THEN
            SELECT
               REPLACE(l_sub_detail_text,l_variable_code,l_variable_value)
            INTO
               l_sub_detail_text
            FROM SUB_DETAIL_VARIABLES
            WHERE sdv_seq = r_get_vars.sdv_seq;
         END IF;
      END LOOP vars;
      RETURN l_sub_detail_text;
   EXCEPTION
      WHEN OTHERS THEN
         RETURN l_sub_detail_text;
END cmf_replace_variables;

/******************************************************************************/
/* PROCEDURE: CMP_GET_co_PER_TOTALS                                              */
/******************************************************************************/

PROCEDURE cmp_get_co_per_totals
        (p_co_number     CONSOLIDATED_ORDERS.co_number%TYPE,
         p_a_total       OUT NUMBER,
         p_b_total       OUT NUMBER,
         p_c_total       OUT NUMBER,
         p_d_total       OUT NUMBER,
         p_g_total       OUT NUMBER) IS

   CURSOR c_get_per_totals IS
   SELECT pdet.per_category,
          NVL(SUM(pite.amount_allowed),0) total
   FROM   PER_DETAILS pdet,
          CO_PER_ITEMS pite
   WHERE  pdet.detail_code = pite.detail_code
   AND    pite.co_number = p_co_number
   AND    pite.error_indicator = 'N'
   GROUP  BY pdet.per_category;
   l_a_total    NUMBER(9,2);
   l_b_total    NUMBER(9,2);
   l_c_total    NUMBER(9,2);
   l_d_total    NUMBER(9,2);
   l_g_total    NUMBER(9,2);
BEGIN
   l_a_total := 0;
   l_b_total := 0;
   l_c_total := 0;
   l_d_total := 0;
   l_g_total := 0;
   FOR r1 IN c_get_per_totals LOOP
       IF r1.per_category = 'A' THEN
          l_a_total := r1.total;
       ELSIF r1.per_category = 'B' THEN
             l_b_total := r1.total;
       ELSIF r1.per_category = 'C' THEN
             l_c_total := r1.total;
       ELSIF r1.per_category = 'D' THEN
             l_d_total := r1.total;
       END IF;
   END LOOP;
   l_g_total := l_a_total + l_b_total + l_c_total - l_d_total;
   p_a_total := l_a_total;
   p_b_total := l_b_total;
   p_c_total := l_c_total;
   p_d_total := l_d_total;
   p_g_total := l_g_total;
EXCEPTION
   WHEN OTHERS THEN
   IF SQLCODE BETWEEN -20999 AND -20000 THEN
        RAISE;
   ELSE
        RAISE_APPLICATION_ERROR(-20101, 'cmp_get_per_totals'||SQLERRM);
   END IF;
END cmp_get_co_per_totals;

/******************************************************************************/
/* PROCEDURE: CMP_SOLICITOR                                              */
/******************************************************************************/

PROCEDURE cmp_solicitor
        (p_number          IN  AE_APPLICATIONS.ae_number%TYPE,
         p_party_role_code IN  AE_APPLICATIONS.party_for_party_role_code%TYPE,
         p_case_party_no   IN  CASE_PARTIES.case_party_no%TYPE,
         p_name            OUT CASE_PARTIES.name%TYPE,
         p_code            OUT CASE_PARTIES.coded_party_no%TYPE,
         p_addr_1          OUT CASE_PARTIES.address_line1%TYPE,
         p_addr_2          OUT CASE_PARTIES.address_line2%TYPE,
         p_addr_3          OUT CASE_PARTIES.address_line3%TYPE,
         p_addr_4          OUT CASE_PARTIES.address_line4%TYPE,
         p_addr_5          OUT CASE_PARTIES.address_line5%TYPE,
         p_reference       OUT CASE_PARTIES.reference%TYPE,
         p_postcode        OUT CASE_PARTIES.postcode%TYPE,
         p_tel_no          OUT CASE_PARTIES.tel_no%TYPE,
         p_dx_no           OUT CASE_PARTIES.dx_number%TYPE,
         p_error           OUT VARCHAR2) IS

 CURSOR c_solicitor IS
    SELECT cpb.coded_party_no,
           cpb.name,
           cpb.address_line1,
           cpb.address_line2,
           cpb.address_line3,
           cpb.address_line4,
           cpb.address_line5,
           cpb.postcode,
           ccr.personal_reference,
           cpb.tel_no,
           cpb.dx_number
    FROM   AE_APPLICATIONS ae,
           CPR_TO_CPR_RELATIONSHIP ccr,
           case_parties cpa,
           case_parties cpb
    WHERE  ae.ae_number = p_number
    AND    ccr.cpr_a_case_number = ae.case_number
    AND    ccr.cpr_a_party_role_code = p_party_role_code
    AND    ccr.cpr_a_case_party_no = p_case_party_no
    AND    ccr.cpr_b_party_role_code = 'SOLICITOR'
    AND    NVL(ccr.DELETED_FLAG, 'N') = 'N'
    AND    cpa.case_number = ccr.cpr_a_case_number
    AND    cpa.party_role_code = ccr.cpr_a_party_role_code
    AND    cpa.case_party_no = ccr.cpr_a_case_party_no
    AND    cpb.case_number = ccr.cpr_b_case_number
    AND    cpb.party_role_code = ccr.cpr_b_party_role_code
    AND    cpb.case_party_no = ccr.cpr_b_case_party_no;

   l_name      case_parties.name%TYPE;
   l_code      case_parties.coded_party_no%TYPE;
   l_addr_1    case_parties.address_line1%TYPE;
   l_addr_2    case_parties.address_line2%TYPE;
   l_addr_3    case_parties.address_line3%TYPE;
   l_addr_4    case_parties.address_line4%TYPE;
   l_addr_5    case_parties.address_line5%TYPE;
   l_reference case_parties.reference%TYPE;
   l_postcode  case_parties.postcode%TYPE;
   l_tel_no    case_parties.tel_no%TYPE;
   l_dx_no     case_parties.dx_number%TYPE;

BEGIN
   OPEN c_solicitor;
   FETCH c_solicitor INTO l_code,
                          l_name,
                          l_addr_1,
                          l_addr_2,
                          l_addr_3,
                          l_addr_4,
                          l_addr_5,
                          l_postcode,
                          l_reference,
                          l_tel_no,
                          l_dx_no;
   IF c_solicitor%NOTFOUND THEN
      p_error := 'cmp_solicitor solicitor not found for case';
   ELSE
      p_name      := l_name;
      p_code      := l_code;
      p_addr_1    := l_addr_1;
      p_addr_2    := l_addr_2;
      p_addr_3    := l_addr_3;
      p_addr_4    := l_addr_4;
      p_addr_5    := l_addr_5;
      p_reference := l_reference;
      p_postcode  := l_postcode;
      p_tel_no    := l_tel_no;
      p_dx_no     := l_dx_no;
   END IF;
   CLOSE c_solicitor;
EXCEPTION
   WHEN OTHERS THEN
      p_error := 'cmp_solicitor '||SQLERRM;
END cmp_solicitor;

/******************************************************************************/
/* FUNCTION: CMF_SOLICITOR_EXISTS                                             */
/******************************************************************************/

FUNCTION cmf_solicitor_exists
        (p_ae_number          IN AE_APPLICATIONS.ae_number%TYPE,
         p_type               IN VARCHAR2,
         p_cmp_doc_payee_flag IN VARCHAR2) RETURN BOOLEAN IS
CURSOR soliCitor IS
  SELECT  cprc.payee_flag
  FROM  AE_APPLICATIONS ae,
    CPR_TO_CPR_RELATIONSHIP ccrc,
    CASE_PARTY_ROLES cprc,
    PARTY_ROLES pr
  WHERE ae.ae_number = p_ae_number
  AND ccrc.cpr_a_case_number = ae.case_number
  AND ccrc.cpr_a_party_role_code = DECODE(p_type, 'FOR', ae.party_for_party_role_code, ae.party_against_party_role_code)
  AND ccrc.cpr_a_case_party_no = DECODE(p_type, 'FOR', ae.party_for_case_party_no, ae.party_against_case_party_no)
  AND ccrc.cpr_b_party_role_code = pr.party_role_code
  AND NVL(ccrc.deleted_flag,'N') = 'N'
  AND pr.reporting_role_code = 'SOLICITOR'
  AND cprc.case_number = ccrc.cpr_a_case_number
  AND cprc.party_role_code = ccrc.cpr_a_party_role_code
  AND cprc.case_party_no = ccrc.cpr_a_case_party_no;

   l_payee_flag   CASE_PARTY_ROLES.payee_flag%TYPE;
   l_solicitor_exists BOOLEAN;
   l_no_solicitors  BOOLEAN;
   BEGIN
  BEGIN
    OPEN solicitor;
    FETCH solicitor INTO l_payee_flag;
    IF solicitor%NOTFOUND THEN
      l_payee_flag := NULL;
      l_solicitor_exists := FALSE;
    ELSE
      l_solicitor_exists := TRUE;
    END IF;
    CLOSE solicitor;
    IF (l_payee_flag IS NULL) AND (l_solicitor_exists = FALSE) THEN
      l_no_solicitors := TRUE;
    ELSE
      l_no_solicitors := FALSE;
    END IF;
  END;

      -- Check for existence of solicitors
      IF l_no_solicitors = TRUE THEN
         RETURN FALSE;
      ELSE
         IF (p_type = 'FOR' AND p_cmp_doc_payee_flag = 'Y' AND NVL(l_payee_flag,'N') = 'Y') OR (p_type = 'FOR' AND p_cmp_doc_payee_flag = 'N' AND l_solicitor_exists = TRUE) OR (p_type = 'AGAINST' AND l_solicitor_exists = TRUE) THEN
            RETURN TRUE;
         ELSE
            RETURN FALSE;
         END IF;
      END IF;
   EXCEPTION
      WHEN OTHERS THEN
         RETURN FALSE;
END cmf_solicitor_exists;

PROCEDURE cmp_party_service
        (p_number IN CASES.case_number%TYPE,
         p_party_for_party_role_code IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
         p_deft_id IN  CASE_PARTY_ROLES.case_party_no%TYPE,
         p_stage  IN  AE_EVENTS.issue_stage%TYPE,
         p_code   OUT CODED_PARTIES.code%TYPE,
         p_name   OUT PARTIES.person_requested_name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no    OUT PARTIES.tel_no %TYPE,
         p_plaintiff_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error  OUT VARCHAR2) IS


CURSOR c_party_serv IS
  SELECT NAME,
         ADDRESS_LINE1,
         ADDRESS_LINE2,
         ADDRESS_LINE3,
         ADDRESS_LINE4,
         ADDRESS_LINE5,
         POSTCODE,
         TEL_NO,
         REFERENCE
  FROM   CASE_PARTIES
  WHERE  CASE_NUMBER = P_NUMBER
  AND    PARTY_ROLE_CODE = P_PARTY_FOR_PARTY_ROLE_CODE
  AND    CASE_PARTY_NO = P_DEFT_ID
  AND    ADDRESS_TYPE_CODE IN ('SERVICE', 'CODED PARTY');

CURSOR c_party_subserv IS
  SELECT  NAME,
          ADDRESS_LINE1,
          ADDRESS_LINE2,
          ADDRESS_LINE3,
          ADDRESS_LINE4,
          ADDRESS_LINE5,
          POSTCODE,
          TEL_NO,
          REFERENCE
  FROM    CASE_PARTIES
  WHERE   CASE_NUMBER = P_NUMBER
  AND     PARTY_ROLE_CODE = P_PARTY_FOR_PARTY_ROLE_CODE
  AND     CASE_PARTY_NO = P_DEFT_ID
  AND     ADDRESS_TYPE_CODE = 'SUBSERV';

-- 17/7/6 SW added new cursor to retrieve solitor reference
CURSOR c_sol_ref IS
  SELECT rel.personal_reference
  FROM   CPR_TO_CPR_RELATIONSHIP rel, case_parties cpr
  WHERE  rel.cpr_a_case_number         = p_number
  AND    rel.cpr_a_party_role_code     = p_party_for_party_role_code
  AND    rel.cpr_a_case_party_no       = p_deft_id
  AND    rel.cpr_b_case_number         = cpr.case_number
  AND    rel.cpr_b_party_role_code     = cpr.party_role_code
  AND    rel.cpr_b_case_party_no       = cpr.case_party_no
  AND    cpr.reporting_party_role_code = 'SOLICITOR'
  AND    NVL(rel.deleted_flag, 'N')    != 'Y';

  l_name   PARTIES.person_requested_name%TYPE;
  l_addr_1 GIVEN_ADDRESSES.address_line1%TYPE;
  l_addr_2 GIVEN_ADDRESSES.address_line2%TYPE;
  l_addr_3 GIVEN_ADDRESSES.address_line3%TYPE;
  l_addr_4 GIVEN_ADDRESSES.address_line4%TYPE;
  l_addr_5 GIVEN_ADDRESSES.address_line5%TYPE;
  l_postcode  GIVEN_ADDRESSES.postcode%TYPE;
  l_tel_no    PARTIES.tel_no%TYPE;
  l_plaintiff_reference GIVEN_ADDRESSES.reference%TYPE;

BEGIN
  IF p_stage = 'S/S' THEN
    OPEN c_party_subserv;
    FETCH c_party_subserv INTO  l_name,
            l_addr_1,
            l_addr_2,
            l_addr_3,
            l_addr_4,
            l_addr_5,
            l_postcode,
            l_tel_no,
            l_plaintiff_reference;
    IF c_party_subserv%NOTFOUND THEN
      OPEN c_party_serv;
      FETCH c_party_serv INTO   l_name,
              l_addr_1,
              l_addr_2,
              l_addr_3,
              l_addr_4,
              l_addr_5,
              l_postcode,
              l_tel_no,
              l_plaintiff_reference;
      IF c_party_serv%NOTFOUND THEN
        p_error := 'cmp_party_service service address not found for case';
      ELSE
        p_name := l_name;
        p_addr_1 := l_addr_1;
        p_addr_2 := l_addr_2;
        p_addr_3 := l_addr_3;
        p_addr_4 := l_addr_4;
        p_addr_5 := l_addr_5;
        p_postcode := l_postcode;
        p_tel_no := l_tel_no;
        p_plaintiff_reference := l_plaintiff_reference;
      END IF;
      CLOSE c_party_serv;
    ELSE
      p_name := l_name;
      p_addr_1 := l_addr_1;
      p_addr_2 := l_addr_2;
      p_addr_3 := l_addr_3;
      p_addr_4 := l_addr_4;
      p_addr_5 := l_addr_5;
      p_postcode := l_postcode;
      p_tel_no := l_tel_no;
      p_plaintiff_reference := l_plaintiff_reference;
    END IF;
    CLOSE c_party_subserv;
  ELSE
    OPEN c_party_serv;
    FETCH c_party_serv INTO l_name,
          l_addr_1,
          l_addr_2,
          l_addr_3,
          l_addr_4,
          l_addr_5,
          l_postcode,
          l_tel_no,
          l_plaintiff_reference;
    IF c_party_serv%NOTFOUND THEN
      p_error := 'cmp_party_service service address not found for case';
    ELSE
      p_name := l_name;
      p_addr_1 := l_addr_1;
      p_addr_2 := l_addr_2;
      p_addr_3 := l_addr_3;
      p_addr_4 := l_addr_4;
      p_addr_5 := l_addr_5;
      p_postcode := l_postcode;
      p_tel_no := l_tel_no;
      p_plaintiff_reference := l_plaintiff_reference;
    END IF;
    CLOSE c_party_serv;
  END IF;

  -- retrieve solicitor reference, if none just use the plaintiff one
  OPEN c_sol_ref;
  FETCH c_sol_ref INTO l_plaintiff_reference;
  IF c_sol_ref%FOUND THEN
    p_plaintiff_reference := l_plaintiff_reference;
  END IF;
  CLOSE c_sol_ref;

EXCEPTION
  WHEN OTHERS THEN
    P_error := 'cmp_party_service '||SQLERRM;
END cmp_party_service;

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_party_service_2
        (p_number IN CASES.case_number%TYPE,
         p_party_for_party_role_code IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
         p_deft_id IN  CASE_PARTY_ROLES.case_party_no%TYPE,
         p_stage  IN  AE_EVENTS.issue_stage%TYPE,
         p_code   OUT CODED_PARTIES.code%TYPE,
         p_name   OUT PARTIES.person_requested_name%TYPE,
         p_addr_1 OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2 OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3 OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4 OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5 OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_tel_no    OUT PARTIES.tel_no %TYPE,
         p_dx_no     OUT PARTIES.dx_Number%TYPE,
         p_plaintiff_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error  OUT VARCHAR2) IS

    CURSOR c_party_serv IS
    SELECT p.name,
           p.address_line1,
           p.address_line2,
           p.address_line3,
           p.address_line4,
           p.address_line5,
           p.postcode,
           p.tel_no,
           p.dx_number,
           p.reference
    FROM   case_parties p
    WHERE  p.case_number = p_number
    AND    p.party_role_code = p_party_for_party_role_code
    AND    p.case_party_no = p_deft_id
    AND    p.address_type_code IN ('SERVICE', 'CODED PARTY');

    CURSOR c_party_subserv IS
    SELECT cp.name,
           cp.address_line1,
           cp.address_line2,
           cp.address_line3,
           cp.address_line4,
           cp.address_line5,
           cp.postcode,
           cp.tel_no,
           cp.dx_number,
           cp.reference
    FROM   case_parties cp
    WHERE  cp.case_number = p_number
    AND    cp.party_role_code = p_party_for_party_role_code
    AND    cp.case_party_no = p_deft_id
    AND    cp.address_type_code = 'SUBSERV';

    -- 17/7/6 SW added new cursor to retrieve solitor reference
    CURSOR c_sol_ref IS
    SELECT rel.personal_reference
    FROM   cpr_to_cpr_relationship rel, 
           case_parties cpr
    WHERE  rel.cpr_a_case_number         = p_number
    AND    rel.cpr_a_party_role_code     = p_party_for_party_role_code
    AND    rel.cpr_a_case_party_no       = p_deft_id
    AND    rel.cpr_b_case_number         = cpr.case_number
    AND    rel.cpr_b_party_role_code     = cpr.party_role_code
    AND    rel.cpr_b_case_party_no       = cpr.case_party_no
    AND    cpr.reporting_party_role_code = 'SOLICITOR'
    AND    NVL(rel.deleted_flag, 'N')    != 'Y';

    l_name      parties.person_requested_name%TYPE;
    l_addr_1    given_addresses.address_line1%TYPE;
    l_addr_2    given_addresses.address_line2%TYPE;
    l_addr_3    given_addresses.address_line3%TYPE;
    l_addr_4    given_addresses.address_line4%TYPE;
    l_addr_5    given_addresses.address_line5%TYPE;
    l_postcode  given_addresses.postcode%TYPE;
    l_tel_no    parties.tel_no%TYPE;
    l_dx_no     parties.dx_Number%TYPE;
    l_plaintiff_reference given_addresses.reference%TYPE;

BEGIN
    IF p_stage = 'S/S' THEN
        OPEN c_party_subserv;
        FETCH c_party_subserv INTO  l_name,
                l_addr_1,
                l_addr_2,
                l_addr_3,
                l_addr_4,
                l_addr_5,
                l_postcode,
                l_tel_no,
                l_dx_no,
                l_plaintiff_reference;
        IF c_party_subserv%NOTFOUND THEN
            OPEN c_party_serv;
            FETCH c_party_serv INTO   l_name,
                    l_addr_1,
                    l_addr_2,
                    l_addr_3,
                    l_addr_4,
                    l_addr_5,
                    l_postcode,
                    l_tel_no,
                    l_dx_no,
                    l_plaintiff_reference;
            IF c_party_serv%NOTFOUND THEN
                p_error := 'cmp_party_service_2 service address not found for case';
            ELSE
                p_name := l_name;
                p_addr_1 := l_addr_1;
                p_addr_2 := l_addr_2;
                p_addr_3 := l_addr_3;
                p_addr_4 := l_addr_4;
                p_addr_5 := l_addr_5;
                p_postcode := l_postcode;
                p_tel_no := l_tel_no;
                p_dx_no  := l_dx_no;
                p_plaintiff_reference := l_plaintiff_reference;
            END IF;
            CLOSE c_party_serv;
        ELSE
            p_name := l_name;
            p_addr_1 := l_addr_1;
            p_addr_2 := l_addr_2;
            p_addr_3 := l_addr_3;
            p_addr_4 := l_addr_4;
            p_addr_5 := l_addr_5;
            p_postcode := l_postcode;
            p_tel_no := l_tel_no;
            p_dx_no  := l_dx_no;
            p_plaintiff_reference := l_plaintiff_reference;
        END IF;
        CLOSE c_party_subserv;
    ELSE
        OPEN c_party_serv;
        FETCH c_party_serv INTO l_name,
              l_addr_1,
              l_addr_2,
              l_addr_3,
              l_addr_4,
              l_addr_5,
              l_postcode,
              l_tel_no,
              l_dx_no,
              l_plaintiff_reference;
        IF c_party_serv%NOTFOUND THEN
            p_error := 'cmp_party_service_2 service address not found for case';
        ELSE
            p_name := l_name;
            p_addr_1 := l_addr_1;
            p_addr_2 := l_addr_2;
            p_addr_3 := l_addr_3;
            p_addr_4 := l_addr_4;
            p_addr_5 := l_addr_5;
            p_postcode := l_postcode;
            p_tel_no := l_tel_no;
            p_dx_no  := l_dx_no;
            p_plaintiff_reference := l_plaintiff_reference;
        END IF;
        CLOSE c_party_serv;
    END IF;
    
    -- retrieve solicitor reference, if none just use the plaintiff one
    OPEN c_sol_ref;
    FETCH c_sol_ref INTO l_plaintiff_reference;
    IF c_sol_ref%FOUND THEN
        p_plaintiff_reference := l_plaintiff_reference;
    END IF;
    CLOSE c_sol_ref;

EXCEPTION
    WHEN OTHERS THEN
        P_error := 'cmp_party_service_2 '||SQLERRM;
END cmp_party_service_2;

PROCEDURE cmp_employer
        (p_number  IN  AE_APPLICATIONS.ae_number%TYPE,
         p_type    IN  VARCHAR2,
         p_party_id IN  AE_APPLICATIONS.DEBTORS_EMPLOYERS_PARTY_ID%TYPE,
         p_name    OUT PARTIES.PERSON_REQUESTED_NAME%TYPE,
         p_addr_1  OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2  OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3  OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4  OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5  OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error     OUT VARCHAR2) IS

   CURSOR c_addr_ae IS
      SELECT
         p.person_requested_name,
         addr.address_line1,
         addr.address_line2,
         addr.address_line3,
         addr.address_line4,
         addr.address_line5,
         addr.postcode,
         addr.reference
      FROM
         AE_APPLICATIONS ae,
         GIVEN_ADDRESSES addr,
     PARTIES p
      WHERE ae.ae_number = p_number
      AND   addr.PARTY_ID = ae.DEBTORS_EMPLOYERS_PARTY_ID
      AND   addr.address_type_code IN ('EMPLOYER', 'CO EMPLOYER')
      AND   addr.valid_to IS NULL
    AND   addr.party_id = p.party_id;

   l_name      PARTIES.person_requested_name%TYPE;
   l_addr_1    GIVEN_ADDRESSES.address_line1%TYPE;
   l_addr_2    GIVEN_ADDRESSES.address_line2%TYPE;
   l_addr_3    GIVEN_ADDRESSES.address_line3%TYPE;
   l_addr_4    GIVEN_ADDRESSES.address_line4%TYPE;
   l_addr_5    GIVEN_ADDRESSES.address_line5%TYPE;
   l_postcode  GIVEN_ADDRESSES.postcode%TYPE;
   l_reference GIVEN_ADDRESSES.reference%TYPE;

   BEGIN
     -- if type is AE then select from
     -- from addresses where addr_type is EMPLOYER
     IF p_type = 'AE' THEN
        OPEN c_addr_ae;
        FETCH c_addr_ae INTO l_name,
                             l_addr_1,
                             l_addr_2,
                             l_addr_3,
                             l_addr_4,
                             l_addr_5,
                             l_postcode,
                             l_reference;
        IF c_addr_ae%NOTFOUND THEN
           p_error := 'cmp_employer employer address not found';
        ELSE
           p_name      := l_name;
           p_addr_1    := l_addr_1;
           p_addr_2    := l_addr_2;
           p_addr_3    := l_addr_3;
           p_addr_4    := l_addr_4;
           p_addr_5    := l_addr_5;
           p_postcode  := l_postcode;
           p_reference := l_reference;
        END IF;
        CLOSE c_addr_ae;
     -- error if p_type is CASE
     ELSE
         p_error := 'cmp_employer invalid p_type';
     END IF;
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_employer '||SQLERRM;
   END cmp_employer;

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_employer_2
        (p_number  IN  AE_APPLICATIONS.ae_number%TYPE,
         p_type    IN  VARCHAR2,
         p_party_id IN  AE_APPLICATIONS.DEBTORS_EMPLOYERS_PARTY_ID%TYPE,
         p_name    OUT PARTIES.PERSON_REQUESTED_NAME%TYPE,
         p_addr_1  OUT GIVEN_ADDRESSES.address_line1%TYPE,
         p_addr_2  OUT GIVEN_ADDRESSES.address_line2%TYPE,
         p_addr_3  OUT GIVEN_ADDRESSES.address_line3%TYPE,
         p_addr_4  OUT GIVEN_ADDRESSES.address_line4%TYPE,
         p_addr_5  OUT GIVEN_ADDRESSES.address_line5%TYPE,
         p_postcode  OUT GIVEN_ADDRESSES.postcode%TYPE,
         p_dx_no     OUT PARTIES.dx_number%TYPE,
         p_reference OUT GIVEN_ADDRESSES.reference%TYPE,
         p_error     OUT VARCHAR2) IS

    CURSOR c_addr_ae IS
    SELECT p.person_requested_name,
           addr.address_line1,
           addr.address_line2,
           addr.address_line3,
           addr.address_line4,
           addr.address_line5,
           addr.postcode,
           p.dx_number,
           addr.reference
    FROM   AE_APPLICATIONS ae,
           GIVEN_ADDRESSES addr,
           PARTIES p
    WHERE  ae.ae_number = p_number
    AND    addr.PARTY_ID = ae.DEBTORS_EMPLOYERS_PARTY_ID
    AND    addr.address_type_code IN ('EMPLOYER', 'CO EMPLOYER')
    AND    addr.valid_to IS NULL
    AND    addr.party_id = p.party_id;

    l_name      PARTIES.person_requested_name%TYPE;
    l_addr_1    GIVEN_ADDRESSES.address_line1%TYPE;
    l_addr_2    GIVEN_ADDRESSES.address_line2%TYPE;
    l_addr_3    GIVEN_ADDRESSES.address_line3%TYPE;
    l_addr_4    GIVEN_ADDRESSES.address_line4%TYPE;
    l_addr_5    GIVEN_ADDRESSES.address_line5%TYPE;
    l_postcode  GIVEN_ADDRESSES.postcode%TYPE;
    l_dx_no     PARTIES.dx_number%TYPE;
    l_reference GIVEN_ADDRESSES.reference%TYPE;

BEGIN
    -- if type is AE then select from
    -- from addresses where addr_type is EMPLOYER
    IF p_type = 'AE' THEN
        OPEN c_addr_ae;
        FETCH c_addr_ae INTO l_name,
                             l_addr_1,
                             l_addr_2,
                             l_addr_3,
                             l_addr_4,
                             l_addr_5,
                             l_postcode,
                             l_dx_no,
                             l_reference;
        IF c_addr_ae%NOTFOUND THEN
            p_error := 'cmp_employer_2 employer address not found';
        ELSE
            p_name      := l_name;
            p_addr_1    := l_addr_1;
            p_addr_2    := l_addr_2;
            p_addr_3    := l_addr_3;
            p_addr_4    := l_addr_4;
            p_addr_5    := l_addr_5;
            p_postcode  := l_postcode;
            p_dx_no     := l_dx_no;
            p_reference := l_reference;
        END IF;
        CLOSE c_addr_ae;
    ELSE
        -- error if p_type is CASE
        p_error := 'cmp_employer_2 invalid p_type';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'cmp_employer_2 '||SQLERRM;
END cmp_employer_2;

PROCEDURE cmp_get_plaint_or_sol
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_party_role IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
   P_case_party_no IN AE_APPLICATIONS.party_for_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_error    OUT VARCHAR2) IS
CURSOR c_ae_details IS
SELECT  CASE_NUMBER
FROM  AE_APPLICATIONS
WHERE AE_NUMBER = p_ae_number
AND PARTY_FOR_PARTY_ROLE_CODE = p_party_role
AND PARTY_FOR_CASE_PARTY_NO = p_case_party_no;
   l_case_number  AE_APPLICATIONS.case_number%TYPE;
   l_name      case_parties.name%TYPE;
   l_addr_1    case_parties.address_line1%TYPE;
   l_addr_2    case_parties.address_line2%TYPE;
   l_addr_3    case_parties.address_line3%TYPE;
   l_addr_4    case_parties.address_line4%TYPE;
   l_addr_5    case_parties.address_line5%TYPE;
   l_postcode  case_parties.postcode%TYPE;
   l_tel_no    case_parties.tel_no%TYPE;
   l_plaintiff_reference case_parties.reference%TYPE;
   l_code      case_parties.coded_party_no%TYPE;
   l_dx_no     case_parties.dx_number%TYPE;
   l_reference case_parties.reference%TYPE;
   l_error     VARCHAR2(2000);
   BEGIN
  OPEN c_ae_details;
  FETCH c_ae_details INTO l_case_number;
  IF c_ae_details%NOTFOUND THEN
           p_error := 'cmp_get_plain_or_sol ae_application not found';
        END IF;
      -- if Plaintiff has a solicitor then select
      -- the solicitor's details
      -- BUT NOT where the doc payee is the debtor, orders will always go to the debtor, not their solicitor
      IF cmf_solicitor_exists(p_ae_number,'FOR',p_cmp_doc_payee_flag) AND p_debtor_flag = 'N' THEN
         p_party := 'Judgment Creditor''s Solicitor';
         cmp_solicitor(p_ae_number,
                       p_party_role,
                 p_case_party_no,
                       l_name,
                       l_code,
                       l_addr_1,
                       l_addr_2,
                       l_addr_3,
                       l_addr_4,
                       l_addr_5,
                       l_reference,
                       l_postcode,
                       l_tel_no,
                       l_dx_no,
                       l_error);
         IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_plaint_or_sol '||l_error;
         ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
         END IF;
      ELSE -- no solicitor or p_debtor_flag is Y
         p_party := 'Judgment Creditor';
         -- Select Plaintiff Details
         cmp_party_service(l_case_number,
                           p_party_role,
                       p_case_party_no,
                           p_stage,
                           l_code,
                           l_name,
                           l_addr_1,
                           l_addr_2,
                           l_addr_3,
                           l_addr_4,
                           l_addr_5,
                           l_postcode,
                           l_tel_no,
                           l_plaintiff_reference,
                           l_error);
         IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_plaint_or_sol '||l_error;
         ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
         END IF;
      END IF; -- solicitor
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_get_plaint_or_sol '||SQLERRM;
   END cmp_get_plaint_or_sol;

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_get_plaint_or_sol_2
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_party_role IN AE_APPLICATIONS.party_for_party_role_code%TYPE,
         P_case_party_no IN AE_APPLICATIONS.party_for_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_dx_no    OUT case_parties.dx_number%TYPE,
         p_error    OUT VARCHAR2) IS
         
    CURSOR c_ae_details IS
    SELECT  CASE_NUMBER
    FROM    AE_APPLICATIONS
    WHERE   AE_NUMBER = p_ae_number
    AND     PARTY_FOR_PARTY_ROLE_CODE = p_party_role
    AND     PARTY_FOR_CASE_PARTY_NO = p_case_party_no;
    
    l_case_number  AE_APPLICATIONS.case_number%TYPE;
    l_name      case_parties.name%TYPE;
    l_addr_1    case_parties.address_line1%TYPE;
    l_addr_2    case_parties.address_line2%TYPE;
    l_addr_3    case_parties.address_line3%TYPE;
    l_addr_4    case_parties.address_line4%TYPE;
    l_addr_5    case_parties.address_line5%TYPE;
    l_postcode  case_parties.postcode%TYPE;
    l_tel_no    case_parties.tel_no%TYPE;
    l_plaintiff_reference case_parties.reference%TYPE;
    l_code      case_parties.coded_party_no%TYPE;
    l_dx_no     case_parties.dx_number%TYPE;
    l_reference case_parties.reference%TYPE;
    l_error     VARCHAR2(2000);

BEGIN
    OPEN c_ae_details;
    FETCH c_ae_details INTO l_case_number;
    IF c_ae_details%NOTFOUND THEN
        p_error := 'cmp_get_plaint_or_sol_2 ae_application not found';
    END IF;

    -- if Plaintiff has a solicitor then select
    -- the solicitor's details
    -- BUT NOT where the doc payee is the debtor, orders will always go to the debtor, not their solicitor
    IF cmf_solicitor_exists(p_ae_number,'FOR',p_cmp_doc_payee_flag) AND p_debtor_flag = 'N' THEN
        p_party := 'Judgment Creditor''s Solicitor';
        cmp_solicitor(p_ae_number,
                      p_party_role,
                      p_case_party_no,
                      l_name,
                      l_code,
                      l_addr_1,
                      l_addr_2,
                      l_addr_3,
                      l_addr_4,
                      l_addr_5,
                      l_reference,
                      l_postcode,
                      l_tel_no,
                      l_dx_no,
                      l_error);
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_plaint_or_sol_2 '||l_error;
        ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
            p_dx_no    := l_dx_no;
        END IF;
    ELSE -- no solicitor or p_debtor_flag is Y
        p_party := 'Judgment Creditor';
        -- Select Plaintiff Details
        cmp_party_service_2(l_case_number,
                            p_party_role,
                            p_case_party_no,
                            p_stage,
                            l_code,
                            l_name,
                            l_addr_1,
                            l_addr_2,
                            l_addr_3,
                            l_addr_4,
                            l_addr_5,
                            l_postcode,
                            l_tel_no,
                            l_dx_no,
                            l_plaintiff_reference,
                            l_error);
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_plaint_or_sol_2 '||l_error;
        ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
            p_dx_no    := l_dx_no;
        END IF;
    END IF; -- solicitor
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'cmp_get_plaint_or_sol_2 '||SQLERRM;
END cmp_get_plaint_or_sol_2;

PROCEDURE cmp_get_deft_or_sol
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
   p_party_role IN AE_APPLICATIONS.party_against_party_role_code%TYPE,
   P_case_party_no IN AE_APPLICATIONS.party_against_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_error    OUT VARCHAR2) IS
CURSOR c_ae_details IS
SELECT  CASE_NUMBER
FROM  AE_APPLICATIONS
WHERE AE_NUMBER = p_ae_number
AND PARTY_AGAINST_PARTY_ROLE_CODE = p_party_role
AND PARTY_AGAINST_CASE_PARTY_NO = p_case_party_no;
   l_case_number  AE_APPLICATIONS.case_number%TYPE;
   l_deft_id   case_parties.case_party_no%TYPE;
   l_code      case_parties.case_party_no%TYPE;
   l_name      case_parties.name%TYPE;
   l_addr_1    case_parties.address_line1%TYPE;
   l_addr_2    case_parties.address_line2%TYPE;
   l_addr_3    case_parties.address_line3%TYPE;
   l_addr_4    case_parties.address_line4%TYPE;
   l_addr_5    case_parties.address_line5%TYPE;
   l_reference case_parties.reference%TYPE;
   l_postcode  case_parties.postcode%TYPE;
   l_tel_no    case_parties.tel_no%TYPE;
   l_dx_no     case_parties.dx_number%TYPE;
   l_error     VARCHAR2(2000);
   BEGIN
  OPEN c_ae_details;
  FETCH c_ae_details INTO l_case_number;
  IF c_ae_details%NOTFOUND THEN
           p_error := 'cmp_get_deft_or_sol ae_application not found';
        END IF;
      -- if Defendant has a solicitor then select
      -- the solicitor's details
      IF cmf_solicitor_exists(p_ae_number,'AGAINST',p_cmp_doc_payee_flag) AND p_debtor_flag = 'N' THEN
         p_party := 'Judgment Debtor''s Solicitor';
         cmp_solicitor(p_ae_number,
                       p_party_role,
                   p_case_party_no,
                       l_name,
                       l_code,
                       l_addr_1,
                       l_addr_2,
                       l_addr_3,
                       l_addr_4,
                       l_addr_5,
                       l_reference,
                       l_postcode,
                       l_tel_no,
             l_dx_no,
                       l_error);
         IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_deft_or_sol '||l_error;
         ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5; -- defendant's sol can never have 5th address line
            p_postcode := l_postcode;
         END IF;
      ELSE -- no solicitor or p_debtor_flag is Y
         p_party := 'Judgment Debtor';
         -- Select Defendant Details
         cmp_party_service(l_case_number,
                           p_party_role,
                           p_case_party_no,
                           p_stage,
                           l_code,
                           l_name,
                           l_addr_1,
                           l_addr_2,
                           l_addr_3,
                           l_addr_4,
                           l_addr_5,
                           l_postcode,
                           l_tel_no,
                           l_reference,
                           l_error);
         IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_deft_or_sol '||l_error;
         ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
         END IF;
      END IF; -- solicitor
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_get_deft_or_sol '||SQLERRM;
   END cmp_get_deft_or_sol;

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_get_deft_or_sol_2
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_party_role IN AE_APPLICATIONS.party_against_party_role_code%TYPE,
         p_case_party_no IN AE_APPLICATIONS.party_against_case_party_no%TYPE,
         p_stage     IN AE_EVENTS.issue_stage%TYPE,
         p_cmp_doc_payee_flag IN VARCHAR2,
         p_debtor_flag IN VARCHAR2,
         p_party    OUT VARCHAR2,
         p_name     OUT case_parties.name%TYPE,
         p_addr_1   OUT case_parties.address_line1%TYPE,
         p_addr_2   OUT case_parties.address_line2%TYPE,
         p_addr_3   OUT case_parties.address_line3%TYPE,
         p_addr_4   OUT case_parties.address_line4%TYPE,
         p_addr_5   OUT case_parties.address_line5%TYPE,
         p_postcode OUT case_parties.postcode%TYPE,
         p_dx_no    OUT case_parties.dx_number%TYPE,
         p_error    OUT VARCHAR2) IS

    CURSOR c_ae_details IS
    SELECT  CASE_NUMBER
    FROM    AE_APPLICATIONS
    WHERE   AE_NUMBER = p_ae_number
    AND     PARTY_AGAINST_PARTY_ROLE_CODE = p_party_role
    AND     PARTY_AGAINST_CASE_PARTY_NO = p_case_party_no;

    l_case_number  AE_APPLICATIONS.case_number%TYPE;
    l_deft_id   case_parties.case_party_no%TYPE;
    l_code      case_parties.case_party_no%TYPE;
    l_name      case_parties.name%TYPE;
    l_addr_1    case_parties.address_line1%TYPE;
    l_addr_2    case_parties.address_line2%TYPE;
    l_addr_3    case_parties.address_line3%TYPE;
    l_addr_4    case_parties.address_line4%TYPE;
    l_addr_5    case_parties.address_line5%TYPE;
    l_reference case_parties.reference%TYPE;
    l_postcode  case_parties.postcode%TYPE;
    l_tel_no    case_parties.tel_no%TYPE;
    l_dx_no     case_parties.dx_number%TYPE;
    l_error     VARCHAR2(2000);
    
BEGIN
    OPEN c_ae_details;
    FETCH c_ae_details INTO l_case_number;
    IF c_ae_details%NOTFOUND THEN
        p_error := 'cmp_get_deft_or_sol_2 ae_application not found';
    END IF;

    -- if Defendant has a solicitor then select
    -- the solicitor's details
    IF cmf_solicitor_exists(p_ae_number,'AGAINST',p_cmp_doc_payee_flag) AND p_debtor_flag = 'N' THEN
        p_party := 'Judgment Debtor''s Solicitor';
        cmp_solicitor(p_ae_number,
                      p_party_role,
                      p_case_party_no,
                      l_name,
                      l_code,
                      l_addr_1,
                      l_addr_2,
                      l_addr_3,
                      l_addr_4,
                      l_addr_5,
                      l_reference,
                      l_postcode,
                      l_tel_no,
                      l_dx_no,
                      l_error);
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_deft_or_sol_2 '||l_error;
        ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5; -- defendant's sol can never have 5th address line
            p_postcode := l_postcode;
            p_dx_no    := l_dx_no;
        END IF;
    ELSE -- no solicitor or p_debtor_flag is Y
        p_party := 'Judgment Debtor';
        -- Select Defendant Details
        cmp_party_service_2(l_case_number,
                            p_party_role,
                            p_case_party_no,
                            p_stage,
                            l_code,
                            l_name,
                            l_addr_1,
                            l_addr_2,
                            l_addr_3,
                            l_addr_4,
                            l_addr_5,
                            l_postcode,
                            l_tel_no,
                            l_dx_no,
                            l_reference,
                            l_error);
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_deft_or_sol_2 '||l_error;
        ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
            p_dx_no    := l_dx_no;
        END IF;
    END IF; -- solicitor
EXCEPTION
    WHEN OTHERS THEN
        p_error := 'cmp_get_deft_or_sol_2 '||SQLERRM;
END cmp_get_deft_or_sol_2;

PROCEDURE cmp_chk_char_ref_codes(p_value   IN OUT CCBC_REF_CODES.rv_low_value%TYPE,
                                 p_domain  IN CCBC_REF_CODES.rv_domain%TYPE,
                                 p_meaning OUT CCBC_REF_CODES.rv_meaning%TYPE,
                                 p_error   OUT VARCHAR2) IS
   CURSOR c_ref_codes IS
      SELECT
         DECODE(rv_high_value, NULL, rv_low_value, p_value),
         rv_meaning
      FROM
         CCBC_REF_CODES
      WHERE ((rv_high_value IS NULL AND p_value IN (rv_low_value, rv_abbreviation))
              OR
             (p_value BETWEEN  rv_low_value AND rv_high_value))
      AND ROWNUM = 1
      AND rv_domain = p_domain;
   l_new_value CCBC_REF_CODES.rv_low_value%TYPE;
   l_meaning CCBC_REF_CODES.rv_meaning%TYPE;
   BEGIN
      IF p_value IS NOT NULL THEN
         OPEN c_ref_codes;
         FETCH c_ref_codes INTO l_new_value,
                                l_meaning;
         IF c_ref_codes%NOTFOUND THEN
            -- when called from form trigger when-validate-item error displayed
            -- when called from form trigger post-query error not displayed
            p_meaning := 'NO DATA FOUND';
            CLOSE c_ref_codes;
         ELSE
            p_value   := l_new_value;
            p_meaning := l_meaning;
            CLOSE c_ref_codes;
         END IF;
      END IF;
   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_chk_char_ref_codes '||SQLERRM;
   END cmp_chk_char_ref_codes;

FUNCTION f_calculate_outstanding_bal (f_ae_number IN AE_EVENTS.ae_number%TYPE) RETURN NUMBER IS

  CURSOR c_ae_applications IS
    SELECT NVL(ae_fee,0),NVL(amount_of_ae,0)
    FROM AE_APPLICATIONS
    WHERE ae_number = f_ae_number;

  CURSOR c_sum_fees_paid_amount IS
    SELECT SUM(amount)
    FROM FEES_PAID
    WHERE process_number = f_ae_number
    AND process_type = 'A'
  AND deleted_flag = 'N';

  CURSOR c_sum_payments_amount IS
    SELECT NVL(SUM(amount),0)
    FROM PAYMENTS
    WHERE subject_no = f_ae_number
    AND payment_for = 'AE'
    AND rd_date IS NULL
    AND error_indicator = 'N';

  v_fees_paid_sum_amount  NUMBER(38,2);
  v_payments_sum_amount   NUMBER(38,2);
  v_ae_applications_fee   AE_APPLICATIONS.ae_fee%TYPE;
  v_ae_applications_aoae  AE_APPLICATIONS.amount_of_ae%TYPE;
BEGIN
  BEGIN
                        /***********************************************************/
                        /* Retrieve ae_fee and amount_of_ae from AE_APPLICATIONS   */
                        /* for current AE number           */
                        /***********************************************************/
                        OPEN c_ae_applications;
                        FETCH c_ae_applications
                        INTO v_ae_applications_fee,v_ae_applications_aoae;
                        CLOSE c_ae_applications;
                        /***********************************************************/
                        /* Retrieve the total sum of amount, from FEES_PAID    */
                        /* for current AE number           */
                        /***********************************************************/
                        OPEN c_sum_fees_paid_amount;
                        FETCH c_sum_fees_paid_amount
                        INTO v_fees_paid_sum_amount;
                        CLOSE c_sum_fees_paid_amount;
                        /***********************************************************/
                        /* Retrieve the total sum of payments, from PAYMENTS     */
                        /* for current AE number           */
                        /***********************************************************/
                        OPEN c_sum_payments_amount;
                        FETCH c_sum_payments_amount
                        INTO v_payments_sum_amount;
                        CLOSE c_sum_payments_amount;
                        /***********************************************************************/
                        /* If the v_fees_paid_sum_amount variable is NULL then use AE_FEE from */
                        /* AE_APPLICATIONS table instead                     */
                        /***********************************************************************/
    RETURN v_ae_applications_aoae + NVL(v_fees_paid_sum_amount,v_ae_applications_fee) - v_payments_sum_amount;
  EXCEPTION
                        /***********************************************************/
                        /* Exception handle incase of an unidentified error    */
                        /* Theoretically this should never happen, but its     */
                        /* better to return NULL than have the program fall over   */
                        /* (ORDER_AMOUNT IS OPTIONAL, SO SHOULD NOT CAUSE A PROB)  */
                        /***********************************************************/
    WHEN OTHERS THEN
      RETURN NULL;
  END;
END f_calculate_outstanding_bal;

FUNCTION F_GET_EVENT_TASK (p_case_no VARCHAR2 := NULL,
                           p_case_type VARCHAR2 := NULL,
                           p_event_id NUMBER := NULL,
                           p_task_type VARCHAR2 := NULL,
                           p_p1 VARCHAR2 := NULL,
                           p_p2 VARCHAR2 := NULL,
                           p_p3 VARCHAR2 := NULL,
                           p_p4 VARCHAR2 := NULL,
                           p_event_type_flag VARCHAR2 := 'O') RETURN CHAR AS

  CURSOR c_cases (l_case_no CHAR) IS
    SELECT case_type
    FROM CASES
    WHERE case_number = l_case_no;

  CURSOR c_tasks (l_event_id CHAR,
                  l_case_type CHAR,
                  l_task_type CHAR,
                  l_case_type_addl CHAR) IS
    SELECT etx.task_number
    FROM EVENT_TASK_XREF etx, TASKS tsk
    WHERE etx.event_id = l_event_id
    AND etx.task_number = tsk.task_number
      AND (etx.case_type = l_case_type
       OR  etx.case_type IN ('ALL',l_case_type_addl))
      AND tsk.task_type = l_task_type
    AND NVL(etx.event_type_flag,'O') = p_event_type_flag               -- Added for CM+ CO Phase 2
    AND etx.event_details IS NULL;                                     -- Added for BMS 5.1

  CURSOR c_cur_ccbc (l_orig_case_type CHAR) IS
    SELECT NVL(rv_iit_code_1,'')
    FROM        CCBC_REF_CODES
    WHERE       rv_domain = 'CURRENT_CASE_TYPE'
    AND         rv_low_value = l_orig_case_type;

  CURSOR c_old_ccbc (l_orig_case_type CHAR) IS
    SELECT NVL(rv_iit_code_1,'')
    FROM        CCBC_REF_CODES
    WHERE       rv_domain = 'CASE_TYPE'
    AND         rv_low_value = l_orig_case_type;

  l_case_type   CASES.case_type%TYPE := p_case_type;
  l_task_number TASKS.task_number%TYPE;
  l_case_type_addl VARCHAR2(2) := '';
  l_court_type CCBC_REF_CODES.rv_iit_code_1%TYPE;
  l_event_type_flag EVENT_TASK_XREF.event_type_flag%TYPE  := 'C';        -- Added for CM+ CO Phase 2


BEGIN
/* Moved up and simplified as part of changes for v1.2 DC */
/* Added for CM+ CO Phase 2 - if p_event_type_flag = 'C' (ie CO event) then
skip processing relating to getting case type etc.. */
IF p_event_type_flag = l_event_type_flag THEN
/*
 Added for CM+ CO Phase 2 added an elsif for each CO event where there
 are separate BMS task numbers for issue 'ISS' and ressiue 'R/I'.
*/
  IF p_p4 = 'R/I' AND p_task_type = 'B' THEN
/*design change v1.2    if p_event_id = 856 then
        return 'EN2';  */
    IF p_event_id IN (852, 854, 855, 865, 872, 877) THEN   -- Added 854 for BMS 5.1
        RETURN 'IS6';
    ELSIF p_event_id IN (853, 860, 864, 873) THEN
        RETURN 'IS8';
    END IF;
  END IF;
/*
  Added for CM+ CO Phase 2 to set up standard CO "case type"
*/
  l_case_type      := 'ALL';
  l_case_type_addl := 'CC';
ELSE  /* ie not CO D Climie v1.2 */
/*
  If no case type given, and there is a case number, derive
  the case type from the CASES table.
*/
    IF l_case_type IS NULL AND
      p_case_no IS NOT NULL THEN
      OPEN c_cases (p_case_no);
      FETCH c_cases INTO l_case_type;
      IF c_cases%NOTFOUND THEN
        CLOSE c_cases;
        RETURN '';
      END IF;
      CLOSE c_cases;
    END IF;
/*
  RFC 376 M Fisher
  Should have case type, find out what court the case type belongs to
  so that event_task_xref table can be decoded.
  1.14 Changed to include old case types
  1.15 Changed becuase some case types have both current_case_type and case_type
       entries on the database. First find out if its a current case type
*/
    OPEN c_cur_ccbc(l_case_type);
    FETCH c_cur_ccbc INTO l_court_type;
    IF c_cur_ccbc%NOTFOUND THEN
      /* The case type is not current so find out if its  */
      /* an old case type instead
      */
      OPEN c_old_ccbc(l_case_type);
      FETCH c_old_ccbc INTO l_court_type;
      IF c_old_ccbc%NOTFOUND THEN
        l_court_type := NULL;
      END IF;
      CLOSE c_old_ccbc;
    END IF;
    CLOSE c_cur_ccbc;

/*
  RFC 376 M Fisher
  We can now determine whether the event task xref select should include 'CC'
  (for County Court Case Types) or 'DR' (for District Registry)
*/
    IF l_court_type IS NULL THEN
      l_case_type_addl := 'CC';
    ELSE
      l_case_type_addl := 'DR';
    END IF;

END IF;  /* end of CO or case processing if statement. D Climie v1.2 */
/*
  Main select to get task id to return.
*/
  IF p_event_id = 640 THEN
    OPEN c_tasks (p_p1,
                  l_case_type,
                  p_task_type,
                  l_case_type_addl);
  ELSE
    OPEN c_tasks (p_event_id,
                  l_case_type,
                  p_task_type,
                  l_case_type_addl);
  END IF;
  FETCH c_tasks INTO l_task_number;
  IF c_tasks%FOUND THEN
    CLOSE c_tasks;
    RETURN l_task_number;
  END IF;
  CLOSE c_tasks;
/*
  No explicit task number was found - it will have to be derived or it
  is a special case.
*/
  IF p_task_type = 'B' THEN
    IF p_event_id = 1 THEN
      ------------------- Initial IT changes ref: 02BAG01074 -------------------------
      IF l_case_type IN ('CLAIM - SPEC ONLY', 'CLAIM - UNSPEC ONLY',
                            'PI CLAIM', 'CLAIM - MULT/OTHER') THEN
          RETURN 'IS1';
      ELSIF l_case_type = 'BULK CLAIM' THEN
          RETURN 'IS2';
      ELSIF l_case_type IN ('PART 8 CLAIM', 'PRE ISSUE APPLN') THEN

          RETURN 'IS9';
      ELSIF l_case_type IN ('QB PERSONAL INJURY', 'QB CLAIM - SPEC ONLY',
                            'QB CLAIM-UNSPEC ONLY', 'QB CLAIM-MULT/OTHER')THEN
          RETURN 'DR1';
      ELSIF l_case_type IN ('CH CLAIM - SPEC ONLY', 'CH CLAIM-UNSPEC ONLY',
                            'CH CLAIM-MULT/OTHER')THEN
          RETURN 'DR2';
      ELSIF l_case_type IN ('QB ORIG', 'QB PART 8 CLAIM', 'QB PRE-ISSUE APPLN',
                            'CHAN ORIG', 'CH PART 8 CLAIM', 'CH PRE-ISSUE APPLN')THEN
          RETURN 'DR9';
      -------------------------- End of Initial IT changes ---------------------------
      ELSIF l_case_type IN ('DFLT LIQ','DFLT UN-LIQ','PERSONAL INJURY') THEN
        IF p_p1 IS NULL THEN
          RETURN 'IS1';
      ELSE
          RETURN 'IS2';
        END IF;
      END IF;

/* SCR 991 - 16/04/04 KM - following code added to record correct BMS task for e
vents 84 and 86 */

    ELSIF p_event_id IN (84,86) THEN

        /* Queen's Bench */
        IF l_court_type = 'Q' THEN
          /* Force BMS task for QB cases */
          RETURN 'DR1';

        /*  Chancery */
        ELSIF l_court_type = 'C' THEN
          /* Force BMS task for CH cases */
          RETURN 'DR2';

        /* County Court */
        ELSE
          RETURN 'IS1';
        END IF;

/* SCR 991 - 16/04/04 KM - end of code added to record correct BMS task for even
ts 84 and 86 */

/*
  Event Type 710 - Application for Fee Remission.
*/
    ELSIF p_event_id = 710 THEN
      IF p_p4 = 'ISSUE' THEN
        RETURN 'IS16';
      ELSIF p_p4 = 'JUDGMENT' THEN
        RETURN 'JH54';
      ELSIF p_p4 = 'ENFORCEMENT' THEN
        RETURN 'EN70';
      ELSIF p_p4 = 'PAYMENT' THEN
        RETURN 'PA19';
      ELSIF p_p4 = 'DISTRICT REGISTRY' THEN
        RETURN 'DR35';
      ELSIF p_p4 = 'LISTING' THEN
        RETURN 'LS7';
      END IF;
/*
  Event Type 200 - Hearing Event.
*/
    ELSIF p_event_id = 200 THEN
      -- Initial IT change: added extra values, changed substr for first 'if'. Variable p_p4 is a
      -- string made up of hearing type : hearing details, the instr strips out hearing type only
      IF SUBSTR(p_p4,1,INSTR(p_p4,':')-1) IN ('GEN APPN', 'APPLN TO DISPUTE JUR','APPLN TO LIFT STAY') THEN
        RETURN 'JH11';
      END IF;
/*
  Event type 140 - Application to vary order.
*/
/*
  RFC 229 P O'Connell
  BMS task 'JH37' now counts against event_id '140'
v1.20 SCR925 J M Earwicker - count BMS tasks for CLAIMANT as well as PLAINTIFF
*/
    ELSIF p_event_id = 140 THEN
      IF p_p1 = 'DEFENDANT' THEN
        RETURN 'JH13';
      ELSIF p_p1 IN ('PLAINTIFF','CLAIMANT') THEN       -- V1.20 SCR925
--      elsif p_p1 = 'PLAINTIFF' then                   -- V1.20 SCR925 (old code)
        IF p_p2 = 'Y' THEN
          RETURN 'JH37';
        ELSE
          RETURN 'JH17';
        END IF;
      END IF;
/*
  Event Type 150 - N35 Variation order.
*/
/*
  RFC 229 P O'Connell
  BMS tasks 'JH36' and 'JH14' now count against event_id '150'
  where applications are set to 'defendants' and responses are 'no response' or
'accepts'
*/
    ELSIF p_event_id = 150 THEN
      IF p_p2 = 'DEFENDANT' THEN
        IF p_p1 IS NULL OR p_p1 IN ('NO RESPONSE','ACCEPTS') THEN
             RETURN 'JH14';
        END IF;
      ELSIF p_p1 IS NULL OR p_p1 = 'NO RESPONSE' THEN
        RETURN 'JH14';
      ELSE
        RETURN 'JH36';
      END IF;
    END IF;          -- event id
  END IF;            -- task type 'B'

-- 1.3   KJW   6.3.02   CM+ P2 Merge 1 with CMS
/* RFC 646 - added special processing for event 48, which
   is applicable to all case types */
IF p_task_type='S' THEN
   IF p_event_id = 48 THEN
      IF l_court_type IS NULL THEN
          RETURN 'SM68';
      ELSIF l_court_type = 'Q' THEN
          RETURN 'SM68Q';
      ELSIF l_court_type = 'C' THEN
          RETURN 'SM68C';
      ELSE
          RETURN '';
      END IF;
   END IF;
END IF;
-- Merge 1

/*
  If this point is reached then no valid task id has been found.
*/
  RETURN '';
END F_GET_EVENT_TASK;

FUNCTION f_task_age (p_receipt_date IN DATE, p_processing_date IN DATE) RETURN CHAR AS

--
-- Variables
--

  v_receipt_date        DATE;
  v_processing_date     DATE;
  v_task_age            NUMBER(6);
  v_age_category        AGE_CATEGORY.AGE_CATEGORY%TYPE;
  v_current_date        DATE;
  v_sum_non_wrkg_days   NUMBER(6);

  CURSOR c_sum_non_wrkg_days IS
    SELECT COUNT(*)
    FROM   NON_WORKING_DAYS
    WHERE  non_working_date BETWEEN v_receipt_date
                            AND     v_processing_date;

--
-- Functions
--
  FUNCTION f_non_working_day (p_date_to_check IN DATE) RETURN BOOLEAN IS

  CURSOR c_non_wrkg_days(p_check_date IN DATE) IS
    SELECT COUNT(*)
    FROM   NON_WORKING_DAYS
    WHERE  non_working_date = p_check_date;

  v_number              NUMBER(1);
  v_bank_holiday        BOOLEAN;

  BEGIN
    OPEN c_non_wrkg_days(p_date_to_check);

    FETCH c_non_wrkg_days INTO v_number;

    IF v_number <> 0  THEN
      v_bank_holiday := TRUE;
    ELSE
      v_bank_holiday := FALSE;
    END IF;

    CLOSE c_non_wrkg_days;

    RETURN v_bank_holiday;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;

BEGIN
--
-- Ensure all times are set to midnight and receipt is present
--
  v_processing_date := TRUNC(p_processing_date);
  v_receipt_date := TRUNC(NVL(p_receipt_date,SYSDATE));
  v_task_age := v_processing_date - v_receipt_date;
  v_current_date := v_receipt_date;

  LOOP

--
-- NB. When the processing date is reached immediately drop out of the loop
--     without carrying out any more processing. This way if the processing
--     date is on a weekend, it doesn't get subtracted,
--     leaving the task age at the equivilant of being carried out on the
--     next working day.
--

    EXIT WHEN v_current_date = v_processing_date;

    IF RTRIM(TO_CHAR(v_current_date,'DAY')) IN ('SATURDAY','SUNDAY') THEN
      v_task_age := v_task_age -1;
    END IF;

    v_current_date := v_current_date + 1;

  END LOOP;

  OPEN c_sum_non_wrkg_days;

  FETCH c_sum_non_wrkg_days
  INTO v_sum_non_wrkg_days;

  CLOSE c_sum_non_wrkg_days;

  v_task_age := v_task_age - v_sum_non_wrkg_days;

--
-- Finally add one if the processing date is on a bank holiday.
--
  IF f_non_working_day(v_processing_date) THEN
    v_task_age := v_task_age +1;
  END IF;

  SELECT AGE_CATEGORY
  INTO   v_age_category
  FROM   AGE_CATEGORY
  WHERE  v_task_age BETWEEN lower_limit
                    AND     NVL(upper_limit,v_task_age);

  RETURN v_age_category;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END f_task_age;

FUNCTION f_defendant (p_case_number IN VARCHAR2) RETURN VARCHAR2 IS
  /********************************************************************
  *  This function checks to see how many Defendants there are for a
  *  particular Case Number.  Added for Initial IT 02BAG01019.
  *
  *  The name of the first defendant is always returned.  If there is
  *  more than one, a count of the others is returned also.  Returns an
  *  error if there is no defendant at all....
  *
  *  Changed by        Date      Comments
  * -------------------------------------------------------------------
  *  Darren Bell    23/11/1998   Original version
  *
  *********************************************************************/
    l_count NUMBER(3);
    l_id          CASE_PARTIES.CASE_PARTY_NO%TYPE;
    l_def_name    CASE_PARTIES.name%TYPE;
    /*
    ||
    || Cursor is ordered by ID DESC, therefore the last name actually pulled
    || from the table when there is more than one defendant will actually
    || be the first defendant - they will have an id of 1
    ||
    */
    CURSOR get_def_name IS
      SELECT name, case_party_no id
      FROM   case_parties
      WHERE  case_number = p_case_number
      AND    REPORTING_PARTY_ROLE_CODE = 'DEFENDANT'
            AND    ADDRESS_TYPE_CODE = 'SERVICE'
      ORDER BY id DESC;
  BEGIN
    l_count := 0;
    OPEN  get_def_name;
    LOOP
      FETCH get_def_name INTO l_def_name,
                              l_id;
      EXIT WHEN get_def_name%NOTFOUND;
      l_count := l_count + 1;
    END LOOP;
    CLOSE get_def_name;
    /*
    ||
    || if there are no defendants, return error
    ||
    */
    IF l_count < 1 THEN
      RETURN('ERROR');
    /*
    ||
    || if there is one defendant only, return name
    ||
    */
    ELSIF l_count = 1 THEN
      RETURN(l_def_name);
    /*
    ||
    || if there are 2 defendants, return first defendant and
    || an appropriate message
    ||
    */
    ELSIF l_count = 2 THEN
      RETURN(l_def_name||' and 1 other');
    /*
    ||
    || otherwise there are more than 2 defendants, so return
    || first defendant and count of the others. Minus one so we
    || don't count the defendant already named
    ||
    */
    ELSE
      RETURN(l_def_name||' and '||TO_CHAR(l_count -1)||' others');
    END IF;
END f_defendant;

PROCEDURE cmp_get_warrant_info
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_creditor_name         OUT case_parties.name%TYPE,
         p_creditor_sol_code     OUT case_parties.coded_party_no%TYPE,
         p_creditor_sol_name     OUT case_parties.name%TYPE,
         p_creditor_sol_addr_1   OUT case_parties.address_line1%TYPE,
         p_creditor_sol_addr_2   OUT case_parties.address_line2%TYPE,
         p_creditor_sol_addr_3   OUT case_parties.address_line3%TYPE,
         p_creditor_sol_addr_4   OUT case_parties.address_line4%TYPE,
       p_creditor_sol_addr_5   OUT case_parties.address_line5%TYPE,
         p_creditor_sol_postcode OUT case_parties.postcode%TYPE,
         p_creditor_sol_tel      OUT case_parties.tel_no%TYPE,
         p_creditor_sol_ref      OUT case_parties.reference%TYPE,
         p_creditor_sol_dx       OUT case_parties.dx_number%TYPE,
         p_debtor_id       OUT case_parties.coded_party_no%TYPE,
         p_debtor          OUT case_parties.name%TYPE,
         p_debtor_addr_1   OUT case_parties.address_line1%TYPE,
         p_debtor_addr_2   OUT case_parties.address_line2%TYPE,
         p_debtor_addr_3   OUT case_parties.address_line3%TYPE,
         p_debtor_addr_4   OUT case_parties.address_line4%TYPE,
         p_debtor_addr_5   OUT case_parties.address_line5%TYPE,
         p_debtor_postcode OUT case_parties.postcode%TYPE,
         p_debtor_sol_ref  OUT case_parties.reference%TYPE,
         p_error OUT VARCHAR2) IS
CURSOR c_ae_parties IS
SELECT  party_for_party_role_code,
  party_for_case_party_no,
  party_against_party_role_code,
  party_against_case_party_no
FROM
  AE_APPLICATIONS
WHERE ae_number = p_ae_number;
   l_pty_for_party_role_code    AE_APPLICATIONS.party_for_party_role_code%TYPE;
   l_pty_for_case_party_no    AE_APPLICATIONS.party_for_case_party_no%TYPE;
   l_pty_against_party_role_code  AE_APPLICATIONS.party_against_party_role_code%TYPE;
   l_pty_against_case_party_no    AE_APPLICATIONS.party_against_case_party_no%TYPE;
   -- cmp_ae_details
   l_case_number  AE_APPLICATIONS.case_number%TYPE;
   l_ae_type      AE_APPLICATIONS.ae_type%TYPE;
   l_ae_fee       AE_APPLICATIONS.ae_fee%TYPE;
   l_amount_of_ae AE_APPLICATIONS.amount_of_ae%TYPE;
   l_per          AE_APPLICATIONS.protected_earnings_rate%TYPE;
   l_ndr          AE_APPLICATIONS.normal_deduction_rate%TYPE;
   l_pep          AE_APPLICATIONS.protected_earnings_period%TYPE;
   l_ndp          AE_APPLICATIONS.normal_deduction_period%TYPE;
   l_date_of_issue AE_APPLICATIONS.date_of_issue%TYPE;
   l_error VARCHAR2(2000);
   -- cmp_defendant
   l_deft_id   case_parties.party_id%TYPE;
   l_name      case_parties.name%TYPE;
   l_addr_1    case_parties.address_line1%TYPE;
   l_addr_2    case_parties.address_line2%TYPE;
   l_addr_3    case_parties.address_line3%TYPE;
   l_addr_4    case_parties.address_line4%TYPE;
   l_addr_5    case_parties.address_line5%TYPE;
   l_postcode  case_parties.postcode%TYPE;
   -- cmp_deft_solicitor
   l_code      case_parties.coded_party_no%TYPE;
   l_reference case_parties.reference%TYPE;
   l_tel_no    case_parties.tel_no%TYPE;
   l_dx_no     case_parties.dx_number%TYPE;
   -- cmp_plaintiff
   l_plaintiff_reference case_parties.reference%TYPE;

   BEGIN
      OPEN c_ae_parties;
      FETCH c_ae_parties INTO l_pty_for_party_role_code,
        l_pty_for_case_party_no,
        l_pty_against_party_role_code,
        l_pty_against_case_party_no;
      IF c_ae_parties%NOTFOUND THEN
      p_error := 'cmp_get_warrant_info ae application not found';
      END IF;
      cmp_ae_details(p_ae_number,
                     l_case_number,
                     l_ae_type,
                     l_ae_fee,
                     l_amount_of_ae,
                     l_per,
                     l_ndr,
                     l_pep,
                     l_ndp,
                     l_date_of_issue,
                     l_error);
      IF l_error IS NOT NULL THEN
         p_error := 'cmp_get_warrant_info '||l_error;
      ELSE
  /*----------------------------Get the Party For or their Solicitors details------------------*/

    cmp_party_service(  l_case_number,
                      l_pty_for_party_role_code,
                  l_pty_for_case_party_no,
                      NULL,
                      l_code,
                      l_name,
                      l_addr_1,
                      l_addr_2,
                      l_addr_3,
                      l_addr_4,
                      l_addr_5,
                      l_postcode,
                      l_tel_no,
                      l_plaintiff_reference,
                      l_error);
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_get_warrant_info '||l_error;
    ELSE
      p_creditor_name:= l_name;
      IF NOT cmf_solicitor_exists(p_ae_number,'FOR','N') THEN
                      p_creditor_sol_code     := NULL;
                      p_creditor_sol_name     := l_name;
                      p_creditor_sol_addr_1   := l_addr_1;
                      p_creditor_sol_addr_2   := l_addr_2;
                      p_creditor_sol_addr_3   := l_addr_3;
                      p_creditor_sol_addr_4   := l_addr_4;
                      p_creditor_sol_addr_5 := l_addr_5;
                p_creditor_sol_postcode := l_postcode;
                      p_creditor_sol_tel      := l_tel_no;
                      p_creditor_sol_ref      := l_plaintiff_reference;
                      p_creditor_sol_dx       := NULL;
      ELSE
        cmp_solicitor(p_ae_number,
                              l_pty_for_party_role_code,
                              l_pty_for_case_party_no,
                              l_name,
                              l_code,
                              l_addr_1,
                              l_addr_2,
                              l_addr_3,
                              l_addr_4,
                              l_addr_5,
                              l_reference,
                              l_postcode,
                              l_tel_no,
                              l_dx_no,
                              l_error);
        IF l_error IS NOT NULL THEN
                    p_error := 'cmp_get_plaint_or_sol '||l_error;
            ELSE
          p_creditor_sol_code     := l_code;
                p_creditor_sol_name     := l_name;
                p_creditor_sol_addr_1   := l_addr_1;
                p_creditor_sol_addr_2   := l_addr_2;
                p_creditor_sol_addr_3   := l_addr_3;
                p_creditor_sol_addr_4   := l_addr_4;
                p_creditor_sol_addr_5 := l_addr_5;
                    p_creditor_sol_postcode := l_postcode;
                p_creditor_sol_tel      := l_tel_no;
                p_creditor_sol_ref      := l_reference;
                p_creditor_sol_dx       := l_dx_no;
        END IF;
      END IF;
    END IF;

  /*----------------------------Get the Party Against or their Solicitors details---------------*/

    cmp_party_service(  l_case_number,
                      l_pty_against_party_role_code,
                  l_pty_against_case_party_no,
                      NULL,
                      l_code,
                      l_name,
                      l_addr_1,
                      l_addr_2,
                      l_addr_3,
                      l_addr_4,
                      l_addr_5,
                      l_postcode,
                      l_tel_no,
                      l_plaintiff_reference,
                      l_error);
        IF l_error IS NOT NULL THEN
          p_error := 'cmp_get_warrant_info '||l_error;
    ELSE
      p_debtor_id       := l_pty_against_case_party_no;
      p_debtor          := l_name;
      p_debtor_addr_1   := l_addr_1;
      p_debtor_addr_2   := l_addr_2;
      p_debtor_addr_3   := l_addr_3;
      p_debtor_addr_4   := l_addr_4;
      p_debtor_addr_5   := l_addr_5;
      p_debtor_postcode := l_postcode;
      p_debtor_sol_ref := l_plaintiff_reference;
    END IF;
  END IF;

   EXCEPTION
      WHEN OTHERS THEN
         p_error := 'cmp_get_warrant_info '||SQLERRM;
END cmp_get_warrant_info;

/* Procedure added for Welsh Language Requirements. Trac #2618.
   Returns the welsh_indicator for a specified party.
   p_party_role_type =  'AE Creditor' - denotes a AE related Judgment Creditor
                        'AE Debtor'   - denotes a AE related Judgment Debtor
                        'AE Employer' - denotes AE related Employer
*/                  
PROCEDURE cmp_get_welsh_indicator
        (p_ae_number       IN  ae_applications.ae_number%TYPE,
         p_party_role_type IN  VARCHAR2,
         p_welsh_indicator OUT case_party_roles.welsh_indicator%TYPE,
         p_error           OUT VARCHAR2) IS

    -- Cursor to get the relevant info from AE_APPLICATIONS for AE-related parties
    CURSOR c_ae_applications IS
    SELECT a.party_for_case_party_no       -- AE Judgment Creditor
          ,a.party_against_case_party_no   -- AE Judgment Debtor 
          ,a.debtors_employers_party_id    -- AE Employer
          ,a.party_for_party_role_code     -- AE Judgment Creditor
          ,a.party_against_party_role_code -- AE Judgment Debtor
          ,a.case_number
    FROM   ae_applications a
    WHERE  a.ae_number = p_ae_number;

    -- Cursor to retrieve the welsh indicator for an AE Employer
    CURSOR c_ae_employer (p_party_id  parties.party_id%TYPE) IS
    SELECT p.welsh_indicator
    FROM   parties p
    WHERE  p.party_id = p_party_id;

    -- Cursor to retrieve the welsh_indicator for an AE Judgment Creditor or Debtor.
    CURSOR c_ae_creditor_or_debtor_party (p_case_number       case_party_roles.case_number%TYPE
                                         ,p_party_role_code   case_party_roles.party_role_code%TYPE
                                         ,p_case_party_number case_party_roles.case_party_no%TYPE) IS
    SELECT cpr.welsh_indicator
    FROM   case_party_roles cpr
    WHERE  cpr.case_number     = p_case_number
    AND    cpr.party_role_code = p_party_role_code
    AND    cpr.case_party_no   = p_case_party_number;
    
    l_welsh_indicator               case_party_roles.welsh_indicator%TYPE;
    l_party_role_code               case_party_roles.party_role_code%TYPE;
    l_party_case_party_no           case_party_roles.case_party_no%TYPE;
    l_party_for_case_party_no       ae_applications.party_for_case_party_no%TYPE;
    l_party_against_case_party_no   ae_applications.party_against_case_party_no%TYPE;
    l_party_for_party_role_code     ae_applications.party_for_party_role_code%TYPE;
    l_party_against_prty_role_code  ae_applications.party_against_party_role_code%TYPE;
    l_debtors_employers_party_id    ae_applications.debtors_employers_party_id%TYPE;
    l_case_number                   ae_applications.case_number%TYPE;

BEGIN

    OPEN c_ae_applications;
    FETCH c_ae_applications
    INTO  l_party_for_case_party_no
         ,l_party_against_case_party_no
         ,l_debtors_employers_party_id
         ,l_party_for_party_role_code
         ,l_party_against_prty_role_code
         ,l_case_number;

    IF c_ae_applications%NOTFOUND THEN
        p_error := 'cmp_get_welsh_indicator c_ae_applications invalid ae_number passed in';
    ELSE
        IF p_party_role_type IN ('AE Creditor', 'AE Debtor') THEN
            -- select the welsh_indicator for an AE Creditor or AE Debtor
            IF p_party_role_type = 'AE Creditor' THEN
                l_party_role_code := l_party_for_party_role_code;
                l_party_case_party_no := l_party_for_case_party_no;
            ELSE
                l_party_role_code := l_party_against_prty_role_code;
                l_party_case_party_no := l_party_against_case_party_no;
            END IF;
            OPEN c_ae_creditor_or_debtor_party(l_case_number
                                              ,l_party_role_code
                                              ,l_party_case_party_no);
            FETCH c_ae_creditor_or_debtor_party
            INTO  l_welsh_indicator;
        
            IF c_ae_creditor_or_debtor_party%NOTFOUND THEN
                p_error := 'cmp_get_welsh_indicator c_ae_creditor_or_debtor_party ' ||
                           'invalid case_number/party_role_code/case_party_no passed in';
            ELSE
                p_welsh_indicator := l_welsh_indicator;
            END IF;
            CLOSE c_ae_creditor_or_debtor_party;
        ELSIF p_party_role_type = 'AE Employer' THEN
            -- select the welsh_indicator for an AE Employer
            OPEN c_ae_employer (l_debtors_employers_party_id);
            FETCH c_ae_employer
            INTO  l_welsh_indicator;
            
            IF c_ae_employer%NOTFOUND THEN
                p_error := 'cmp_get_welsh_indicator c_ae_employer ' ||
                           'invalid party_id passed in';
            ELSE
                p_welsh_indicator := l_welsh_indicator;
            END IF;
            CLOSE c_ae_employer;
        ELSE
            -- Source the welsh flags for the other parties here, e.g. CO-related parties
            NULL;
        END IF;
    END IF;
    CLOSE c_ae_applications;

EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_get_welsh_indicator '||SQLERRM;

END cmp_get_welsh_indicator;

/* Procedure added for Welsh Language Requirements. Trac #2618.
   Returns the employer named person name for either an Attachment of Earnings or Consolidated Order.
   p_enf_type =  'AE' - expects p_enf_number to be an AE Number and will return AE Employer details
                 'CO' - expects p_enf_number to be a CO Number and will return CO Employer details
*/  
PROCEDURE cmp_get_employer_named_person
        (p_enf_type 	IN VARCHAR2,									-- Enforcement Type (AE or CO)
		 p_enf_number 	IN  consolidated_orders.co_number%TYPE,			-- Enforcement Number (AE Number or CO Number)
		 p_named_person OUT consolidated_orders.named_employer%TYPE,	-- Employer named person name
         p_error        OUT VARCHAR2) IS

    -- Cursor to get the relevant info from AE_APPLICATIONS
    CURSOR c_ae_employer_named_person IS
    SELECT a.named_employer
    FROM   ae_applications a
    WHERE  a.ae_number = p_enf_number;
	
    -- Cursor to get the relevant info from CONSOLIDATED_ORDERS
    CURSOR c_co_employer_named_person IS
    SELECT c.named_employer
    FROM   consolidated_orders c
    WHERE  c.co_number = p_enf_number;

    l_named_person               consolidated_orders.named_employer%TYPE;

BEGIN
	IF p_enf_type IN ('AE', 'CO') THEN
		-- Enforcement type passed in is correct
		
		IF p_enf_type = 'AE' THEN
			-- AE Enforcement Type
			OPEN  c_ae_employer_named_person;
			FETCH c_ae_employer_named_person
			INTO  l_named_person;
			-- Retrieve and assign the AE Employer Named Person Name
			IF c_ae_employer_named_person%NOTFOUND THEN
				p_error := 'cmp_get_employer_named_person invalid ae number passed in';
			ELSE
				p_named_person := l_named_person;
			END IF;
			CLOSE c_ae_employer_named_person;
		ELSE
			-- CO Enforcement Type
			OPEN  c_co_employer_named_person;
			FETCH c_co_employer_named_person
			INTO  l_named_person;
			-- Retrieve and assign the CCO Employer Named Person Name
			IF c_co_employer_named_person%NOTFOUND THEN
				p_error := 'cmp_get_employer_named_person invalid co number passed in';
			ELSE
				p_named_person := l_named_person;
			END IF;
			CLOSE c_co_employer_named_person;
		END IF;
	ELSE
		-- Invalid enforcement type passed in
		p_error := 'cmp_get_employer_named_person invalid enforcement type passed in';
	END IF;

EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_get_employer_named_person '||SQLERRM;

END cmp_get_employer_named_person;

PROCEDURE cmp_doc_payee
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_ae_type   IN VARCHAR2,
         p_doc_payee IN ORDER_TYPES.doc_payee%TYPE,
         p_name     OUT VARCHAR2,
         p_addr_1   OUT VARCHAR2,
         p_addr_2   OUT VARCHAR2,
         p_addr_3   OUT VARCHAR2,
         p_addr_4   OUT VARCHAR2,
         p_addr_5   OUT VARCHAR2,
         p_postcode OUT VARCHAR2,
         p_error    OUT VARCHAR2) IS

	CURSOR c_ae_details IS
	SELECT  ae.party_for_party_role_code,
	  ae.party_for_case_party_no,
	  c.admin_crt_code
	FROM  AE_APPLICATIONS ae, cases c
	WHERE ae.AE_NUMBER = p_ae_number
	AND	  c.case_number = ae.case_number;

   l_pty_for_role_code    AE_APPLICATIONS.party_for_party_role_code%TYPE;
   l_pty_for_case_party_no  AE_APPLICATIONS.party_for_case_party_no%TYPE;
   l_court_code     CASES.admin_crt_code%TYPE;
   l_party     VARCHAR2(100);
   l_name      case_parties.name%TYPE;
   l_addr_1    case_parties.address_line1%TYPE;
   l_addr_2    case_parties.address_line2%TYPE;
   l_addr_3    case_parties.address_line3%TYPE;
   l_addr_4    case_parties.address_line4%TYPE;
   l_addr_5    case_parties.address_line5%TYPE;
   l_postcode  case_parties.postcode%TYPE;
   l_error     VARCHAR2(2000);
   -- cmp_court
   l_crt_name      COURTS.name%TYPE;
   l_crt_addr_1    case_parties.address_line1%TYPE;
   l_crt_addr_2    case_parties.address_line2%TYPE;
   l_crt_addr_3    case_parties.address_line3%TYPE;
   l_crt_addr_4    case_parties.address_line4%TYPE;
   l_crt_addr_5    case_parties.address_line5%TYPE;
   l_crt_postcode  case_parties.postcode%TYPE;
   l_crt_tel_no    COURTS.tel_no%TYPE;
   l_crt_fax_no    COURTS.fax_no%TYPE;
   l_crt_open      PERSONALISE.open_from%TYPE;
   l_crt_close     PERSONALISE.closed_at%TYPE;
   -- calls cmp_get_deft_or_sol,cmp_get_plaint_or_sol,cmp_court
   BEGIN
  OPEN c_ae_details;
  FETCH c_ae_details INTO l_pty_for_role_code,
        l_pty_for_case_party_no,
        l_court_code;
  IF c_ae_details%NOTFOUND THEN
           p_error := 'cmp_get_plain_or_sol ae_application not found';
        END IF;
      IF p_doc_payee IS NULL THEN
         p_name     := NULL;
         p_addr_1   := NULL;
         p_addr_2   := NULL;
         p_addr_3   := NULL;
         p_addr_4   := NULL;
         p_addr_5   := NULL;
         p_postcode := NULL;
      ELSIF p_doc_payee = 'PLAINTIFF' THEN
  cmp_get_plaint_or_sol(  p_ae_number,
              l_pty_for_role_code,
        l_pty_for_case_party_no,
              NULL,
              'Y',
              'N',
              l_party,
                                l_name,
                                l_addr_1,
                                l_addr_2,
                                l_addr_3,
                                l_addr_4,
                                l_addr_5,
                                l_postcode,
                                l_error);
            IF l_error IS NOT NULL THEN
               p_error := 'cmp_doc_payee '||l_error;
            ELSE
               p_name     := l_name;
               p_addr_1   := l_addr_1;
               p_addr_2   := l_addr_2;
               p_addr_3   := l_addr_3;
               p_addr_4   := l_addr_4;
               p_addr_5   := l_addr_5;
               p_postcode := l_postcode;
            END IF;
  ELSIF p_doc_payee = 'COURT' THEN
    cmp_court ( l_court_code,
            l_crt_name,
                      l_crt_addr_1,
                      l_crt_addr_2,
                      l_crt_addr_3,
                      l_crt_addr_4,
                      l_crt_addr_5,
                      l_crt_postcode,
                      l_crt_tel_no,
                      l_crt_fax_no,
                      l_crt_open,
                      l_crt_close,
                      l_error);
          IF l_error IS NOT NULL THEN
                p_error := 'cmp_doc_payee '||l_error;
          ELSE
                p_name     := l_crt_name;
                p_addr_1   := l_crt_addr_1;
                p_addr_2   := l_crt_addr_2;
                p_addr_3   := l_crt_addr_3;
                p_addr_4   := l_crt_addr_4;
                p_addr_5   := l_crt_addr_5;
                p_postcode := l_crt_postcode;
            END IF;
  ELSE      -- p_doc_payee = Unknown type
    p_error := 'cmp_doc_payee invalid p_doc_payee';
  END IF; -- doc payee
EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_doc_payee '||SQLERRM;
END cmp_doc_payee;

PROCEDURE cmp_doc_payee2
        (p_ae_number IN AE_APPLICATIONS.ae_number%TYPE,
         p_ae_type   IN VARCHAR2,
         p_doc_payee IN ORDER_TYPES.doc_payee%TYPE,
		 p_crt_code OUT NUMBER,
         p_name     OUT VARCHAR2,
         p_addr_1   OUT VARCHAR2,
         p_addr_2   OUT VARCHAR2,
         p_addr_3   OUT VARCHAR2,
         p_addr_4   OUT VARCHAR2,
         p_addr_5   OUT VARCHAR2,
         p_postcode OUT VARCHAR2,
         p_error    OUT VARCHAR2) IS

	CURSOR c_ae_details IS
	SELECT  ae.party_for_party_role_code,
	  ae.party_for_case_party_no,
	  c.admin_crt_code
	FROM  AE_APPLICATIONS ae, cases c
	WHERE ae.AE_NUMBER = p_ae_number
	AND	  c.case_number = ae.case_number;

   l_pty_for_role_code    AE_APPLICATIONS.party_for_party_role_code%TYPE;
   l_pty_for_case_party_no  AE_APPLICATIONS.party_for_case_party_no%TYPE;
   l_court_code     CASES.admin_crt_code%TYPE;
   l_party     VARCHAR2(100);
   l_name      case_parties.name%TYPE;
   l_addr_1    case_parties.address_line1%TYPE;
   l_addr_2    case_parties.address_line2%TYPE;
   l_addr_3    case_parties.address_line3%TYPE;
   l_addr_4    case_parties.address_line4%TYPE;
   l_addr_5    case_parties.address_line5%TYPE;
   l_postcode  case_parties.postcode%TYPE;
   l_error     VARCHAR2(2000);
   -- cmp_court
   l_crt_name      COURTS.name%TYPE;
   l_crt_addr_1    case_parties.address_line1%TYPE;
   l_crt_addr_2    case_parties.address_line2%TYPE;
   l_crt_addr_3    case_parties.address_line3%TYPE;
   l_crt_addr_4    case_parties.address_line4%TYPE;
   l_crt_addr_5    case_parties.address_line5%TYPE;
   l_crt_postcode  case_parties.postcode%TYPE;
   l_crt_tel_no    COURTS.tel_no%TYPE;
   l_crt_fax_no    COURTS.fax_no%TYPE;
   l_crt_open      PERSONALISE.open_from%TYPE;
   l_crt_close     PERSONALISE.closed_at%TYPE;
   -- calls cmp_get_deft_or_sol,cmp_get_plaint_or_sol,cmp_court
   BEGIN
  OPEN c_ae_details;
  FETCH c_ae_details INTO l_pty_for_role_code,
        l_pty_for_case_party_no,
        l_court_code;
  IF c_ae_details%NOTFOUND THEN
           p_error := 'cmp_get_plain_or_sol ae_application not found';
        END IF;
      IF p_doc_payee IS NULL THEN
         p_crt_code := NULL;
		 p_name     := NULL;
         p_addr_1   := NULL;
         p_addr_2   := NULL;
         p_addr_3   := NULL;
         p_addr_4   := NULL;
         p_addr_5   := NULL;
         p_postcode := NULL;
      ELSIF p_doc_payee = 'PLAINTIFF' THEN
		p_crt_code := NULL;
  cmp_get_plaint_or_sol(  p_ae_number,
              l_pty_for_role_code,
        l_pty_for_case_party_no,
              NULL,
              'Y',
              'N',
              l_party,
                                l_name,
                                l_addr_1,
                                l_addr_2,
                                l_addr_3,
                                l_addr_4,
                                l_addr_5,
                                l_postcode,
                                l_error);
            IF l_error IS NOT NULL THEN
               p_error := 'cmp_doc_payee2 '||l_error;
            ELSE
               p_name     := l_name;
               p_addr_1   := l_addr_1;
               p_addr_2   := l_addr_2;
               p_addr_3   := l_addr_3;
               p_addr_4   := l_addr_4;
               p_addr_5   := l_addr_5;
               p_postcode := l_postcode;
            END IF;
  ELSIF p_doc_payee = 'COURT' THEN
    cmp_court ( l_court_code,
            l_crt_name,
                      l_crt_addr_1,
                      l_crt_addr_2,
                      l_crt_addr_3,
                      l_crt_addr_4,
                      l_crt_addr_5,
                      l_crt_postcode,
                      l_crt_tel_no,
                      l_crt_fax_no,
                      l_crt_open,
                      l_crt_close,
                      l_error);
          IF l_error IS NOT NULL THEN
                p_error := 'cmp_doc_payee2 '||l_error;
          ELSE
				p_crt_code := l_court_code;
                p_name     := l_crt_name;
                p_addr_1   := l_crt_addr_1;
                p_addr_2   := l_crt_addr_2;
                p_addr_3   := l_crt_addr_3;
                p_addr_4   := l_crt_addr_4;
                p_addr_5   := l_crt_addr_5;
                p_postcode := l_crt_postcode;
            END IF;
  ELSE      -- p_doc_payee = Unknown type
    p_error := 'cmp_doc_payee2 invalid p_doc_payee';
  END IF; -- doc payee
EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_doc_payee2 '||SQLERRM;
END cmp_doc_payee2;

PROCEDURE cmp_get_ae_per_totals
        (  p_ae_number  AE_APPLICATIONS.ae_number%TYPE,
           p_a_total  OUT NUMBER,
           p_b_total  OUT NUMBER,
           p_c_total  OUT NUMBER,
           p_d_total  OUT NUMBER,
           p_g_total  OUT NUMBER,
           p_error  OUT VARCHAR2) IS
   CURSOR c_get_per_totals IS
   SELECT pdet.per_category,
          NVL(SUM(pite.amount_allowed),0) total
   FROM   PER_DETAILS pdet,
          AE_PER_ITEMS pite
   WHERE  pdet.detail_code = pite.detail_code
   AND    pite.ae_number = p_ae_number
   AND    pite.error_indicator = 'N'
   GROUP  BY pdet.per_category;

   l_a_total    NUMBER(38,2);
   l_b_total    NUMBER(38,2);
   l_c_total    NUMBER(38,2);
   l_d_total    NUMBER(38,2);
   l_g_total    NUMBER(38,2);

BEGIN

   l_a_total := 0;
   l_b_total := 0;
   l_c_total := 0;
   l_d_total := 0;
   l_g_total := 0;

   p_error := NULL;

   FOR r1 IN c_get_per_totals LOOP
       IF r1.per_category = 'A' THEN
          l_a_total := r1.total;
       ELSIF r1.per_category = 'B' THEN
             l_b_total := r1.total;
       ELSIF r1.per_category = 'C' THEN
             l_c_total := r1.total;
       ELSIF r1.per_category = 'D' THEN
             l_d_total := r1.total;
       END IF;
   END LOOP;

   l_g_total := l_a_total + l_b_total + l_c_total - l_d_total;

   p_a_total := l_a_total;
   p_b_total := l_b_total;
   p_c_total := l_c_total;
   p_d_total := l_d_total;
   p_g_total := l_g_total;

EXCEPTION

   WHEN OTHERS THEN
        p_error := 'cmp_get_per_totals '||TO_CHAR(SQLCODE);

END cmp_get_ae_per_totals;

PROCEDURE cmp_doc_recipient
        (p_ae_number     IN AE_APPLICATIONS.ae_number%TYPE,
         p_ae_type       IN VARCHAR2,
         p_doc_recipient IN ORDER_TYPES.doc_recipient%TYPE,
         p_stage         IN AE_EVENTS.issue_stage%TYPE,
         p_party    OUT VARCHAR2,
         p_name     OUT VARCHAR2,
         p_addr_1   OUT VARCHAR2,
         p_addr_2   OUT VARCHAR2,
         p_addr_3   OUT VARCHAR2,
         p_addr_4   OUT VARCHAR2,
         p_addr_5   OUT VARCHAR2,
         p_postcode OUT VARCHAR2,
         p_error    OUT VARCHAR2) IS
CURSOR c_ae_details IS
  SELECT  party_against_party_role_code,
    party_against_case_party_no,
    party_for_party_role_code,
    party_for_case_party_no,
    debtors_employers_party_id
  FROM  AE_APPLICATIONS
  WHERE ae_number = p_ae_number;
  l_pty_for_party_role_code AE_APPLICATIONS.party_for_party_role_code%TYPE;
  l_pty_for_case_party_no AE_APPLICATIONS.party_for_case_party_no%TYPE;
  l_pty_against_party_role_code AE_APPLICATIONS.party_against_party_role_code%TYPE;
  l_pty_against_case_party_no AE_APPLICATIONS.party_against_case_party_no%TYPE;
  l_employer      AE_APPLICATIONS.debtors_employers_party_id%TYPE;
   l_party     VARCHAR2(100);
   l_name      case_parties.name%TYPE;
   l_addr_1    case_parties.address_line1%TYPE;
   l_addr_2    case_parties.address_line2%TYPE;
   l_addr_3    case_parties.address_line3%TYPE;
   l_addr_4    case_parties.address_line4%TYPE;
   l_addr_5    case_parties.address_line5%TYPE;
   l_postcode  case_parties.postcode%TYPE;
   l_reference case_parties.reference%TYPE;
   l_error     VARCHAR2(2000);
   -- calls cmp_get_deft_or_sol,cmp_get_plaint_or_sol,cmp_employer
   BEGIN
  OPEN c_ae_details;
  FETCH c_ae_details INTO l_pty_against_party_role_code,
        l_pty_against_case_party_no,
        l_pty_for_party_role_code,
        l_pty_for_case_party_no,
        l_employer;
  IF c_ae_details%NOTFOUND THEN
    p_error := 'cmp_doc_recipient invalid ae number passed in';
  END IF;
  CLOSE c_ae_details;
      IF p_doc_recipient IS NULL THEN
         p_party    := NULL;
         p_name     := NULL;
         p_addr_1   := NULL;
         p_addr_2   := NULL;
         p_addr_3   := NULL;
         p_addr_4   := NULL;
         p_addr_5   := NULL;
         p_postcode := NULL;
      ELSIF p_doc_recipient = 'DEBTOR' THEN
  cmp_get_deft_or_sol(p_ae_number,
                l_pty_against_party_role_code,
          l_pty_against_case_party_no,
                p_stage,
                'N',
                'Y',
                            l_party,
                            l_name,
                            l_addr_1,
                            l_addr_2,
                            l_addr_3,
                            l_addr_4,
                            l_addr_5,
                            l_postcode,
                            l_error);
      IF l_error IS NOT NULL THEN
               p_error := 'cmp_doc_recipient '||l_error;
            ELSE
               p_party    := l_party;
               p_name     := l_name;
               p_addr_1   := l_addr_1;
               p_addr_2   := l_addr_2;
               p_addr_3   := l_addr_3;
               p_addr_4   := l_addr_4;
               p_addr_5   := l_addr_5;
               p_postcode := l_postcode;
            END IF;
      ELSIF p_doc_recipient = 'CREDITOR' THEN
  cmp_get_plaint_or_sol(p_ae_number,
                  l_pty_for_party_role_code,
            l_pty_for_case_party_no,
                  p_stage,
                  'N',
                  'N',
                              l_party,
                              l_name,
                              l_addr_1,
                              l_addr_2,
                              l_addr_3,
                              l_addr_4,
                              l_addr_5,
                              l_postcode,
                              l_error);
      IF l_error IS NOT NULL THEN
               p_error := 'cmp_doc_recipient '||l_error;
            ELSE
               p_party    := l_party;
               p_name     := l_name;
               p_addr_1   := l_addr_1;
               p_addr_2   := l_addr_2;
               p_addr_3   := l_addr_3;
               p_addr_4   := l_addr_4;
               p_addr_5   := l_addr_5;
               p_postcode := l_postcode;
            END IF;
      ELSIF p_doc_recipient = 'EMPLOYER' THEN
         p_party := 'Employer';
         -- Select Employer Details
         cmp_employer(p_ae_number,
                      'AE',
          l_employer,
                      l_name,
                      l_addr_1,
                      l_addr_2,
                      l_addr_3,
                      l_addr_4,
                      l_addr_5,
                      l_postcode,
                      l_reference,
                      l_error);
         IF l_error IS NOT NULL THEN
            p_error := 'cmp_doc_recipient '||l_error;
         ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
         END IF;
      ELSE      -- p_doc_recipient = Unknown type
          p_error := 'cmp_doc_recipient invalid p_doc_recipient';
      END IF; -- doc recipient
EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_doc_recipient '||SQLERRM;
END cmp_doc_recipient;

-- Procedure added for Welsh Language Requirements. Trac #2618.
PROCEDURE cmp_doc_recipient_2
         (p_ae_number     IN AE_APPLICATIONS.ae_number%TYPE,
          p_ae_type       IN VARCHAR2,
          p_doc_recipient IN ORDER_TYPES.doc_recipient%TYPE,
          p_stage         IN AE_EVENTS.issue_stage%TYPE,
          p_party    OUT VARCHAR2,
          p_name     OUT VARCHAR2,
          p_addr_1   OUT VARCHAR2,
          p_addr_2   OUT VARCHAR2,
          p_addr_3   OUT VARCHAR2,
          p_addr_4   OUT VARCHAR2,
          p_addr_5   OUT VARCHAR2,
          p_postcode OUT VARCHAR2,
          p_dx_no    OUT VARCHAR2,
          p_error    OUT VARCHAR2) IS

    CURSOR c_ae_details IS
    SELECT  a.party_against_party_role_code,
            a.party_against_case_party_no,
            a.party_for_party_role_code,
            a.party_for_case_party_no,
            a.debtors_employers_party_id
    FROM    AE_APPLICATIONS a
    WHERE   a.ae_number = p_ae_number;

    l_pty_for_party_role_code AE_APPLICATIONS.party_for_party_role_code%TYPE;
    l_pty_for_case_party_no AE_APPLICATIONS.party_for_case_party_no%TYPE;
    l_pty_against_party_role_code AE_APPLICATIONS.party_against_party_role_code%TYPE;
    l_pty_against_case_party_no AE_APPLICATIONS.party_against_case_party_no%TYPE;
    l_employer      AE_APPLICATIONS.debtors_employers_party_id%TYPE;
    l_party     VARCHAR2(100);
    l_name      case_parties.name%TYPE;
    l_addr_1    case_parties.address_line1%TYPE;
    l_addr_2    case_parties.address_line2%TYPE;
    l_addr_3    case_parties.address_line3%TYPE;
    l_addr_4    case_parties.address_line4%TYPE;
    l_addr_5    case_parties.address_line5%TYPE;
    l_postcode  case_parties.postcode%TYPE;
    l_dx_no     case_parties.dx_number%TYPE;
    l_reference case_parties.reference%TYPE;
    l_error     VARCHAR2(2000);

    -- calls cmp_get_deft_or_sol_2, cmp_get_plaint_or_sol_2, cmp_employer_2
BEGIN
    OPEN c_ae_details;
    FETCH c_ae_details 
    INTO  l_pty_against_party_role_code,
          l_pty_against_case_party_no,
          l_pty_for_party_role_code,
          l_pty_for_case_party_no,
          l_employer;
        
    IF c_ae_details%NOTFOUND THEN
        p_error := 'cmp_doc_recipient_2 invalid ae number passed in';
    END IF;
    CLOSE c_ae_details;

    IF p_doc_recipient IS NULL THEN
        p_party    := NULL;
        p_name     := NULL;
        p_addr_1   := NULL;
        p_addr_2   := NULL;
        p_addr_3   := NULL;
        p_addr_4   := NULL;
        p_addr_5   := NULL;
        p_postcode := NULL;
        p_dx_no    := NULL;
    ELSIF p_doc_recipient = 'DEBTOR' THEN
        cmp_get_deft_or_sol_2(p_ae_number,
                              l_pty_against_party_role_code,
                              l_pty_against_case_party_no,
                              p_stage,
                              'N',
                              'Y',
                              l_party,
                              l_name,
                              l_addr_1,
                              l_addr_2,
                              l_addr_3,
                              l_addr_4,
                              l_addr_5,
                              l_postcode,
                              l_dx_no,
                              l_error);
                              
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_doc_recipient_2 '||l_error;
        ELSE
            p_party    := l_party;
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
            p_dx_no    := l_dx_no;
        END IF;
    ELSIF p_doc_recipient = 'CREDITOR' THEN
        cmp_get_plaint_or_sol_2(p_ae_number,
                                l_pty_for_party_role_code,
                                l_pty_for_case_party_no,
                                p_stage,
                                'N',
                                'N',
                                l_party,
                                l_name,
                                l_addr_1,
                                l_addr_2,
                                l_addr_3,
                                l_addr_4,
                                l_addr_5,
                                l_postcode,
                                l_dx_no,
                                l_error);
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_doc_recipient_2 '||l_error;
        ELSE
            p_party    := l_party;
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
            p_dx_no    := l_dx_no;
        END IF;
    ELSIF p_doc_recipient = 'EMPLOYER' THEN
        p_party := 'Employer';
        -- Select Employer Details
        cmp_employer_2(p_ae_number,
                       'AE',
                       l_employer,
                       l_name,
                       l_addr_1,
                       l_addr_2,
                       l_addr_3,
                       l_addr_4,
                       l_addr_5,
                       l_postcode,
                       l_dx_no,
                       l_reference,
                       l_error);
        IF l_error IS NOT NULL THEN
            p_error := 'cmp_doc_recipient_2 '||l_error;
        ELSE
            p_name     := l_name;
            p_addr_1   := l_addr_1;
            p_addr_2   := l_addr_2;
            p_addr_3   := l_addr_3;
            p_addr_4   := l_addr_4;
            p_addr_5   := l_addr_5;
            p_postcode := l_postcode;
        END IF;
    ELSE      -- p_doc_recipient = Unknown type
        p_error := 'cmp_doc_recipient_2 invalid p_doc_recipient';
    END IF; -- doc recipient
EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_doc_recipient_2 '||SQLERRM;
END cmp_doc_recipient_2;

PROCEDURE cmp_ae_party_details
        (p_ae_number  IN  AE_APPLICATIONS.ae_number%TYPE,
         p_party      IN  VARCHAR2,
         p_code       OUT case_parties.coded_party_no%TYPE,
         p_name       OUT case_parties.name%TYPE,
         p_addr_1     OUT case_parties.address_line1%TYPE,
         p_addr_2     OUT case_parties.address_line2%TYPE,
         p_addr_3     OUT case_parties.address_line3%TYPE,
         p_addr_4     OUT case_parties.address_line4%TYPE,
         p_addr_5     OUT case_parties.address_line5%TYPE,
         p_postcode   OUT case_parties.postcode%TYPE,
         p_tel_no     OUT case_parties.tel_no%TYPE,
         p_dx_no      OUT case_parties.dx_number%TYPE,
         p_reference  OUT case_parties.reference%TYPE,
         p_error      OUT VARCHAR2) IS
CURSOR c_workplace_address IS
SELECT
  addr.address_line1,
  addr.address_line2,
  addr.address_line3,
  addr.address_line4,
  addr.address_line5,
  addr.postcode,
  addr.reference
FROM
  AE_APPLICATIONS ae,
  GIVEN_ADDRESSES addr
WHERE ae.ae_number = p_ae_number
AND addr.case_number = ae.case_number
AND addr.case_party_no = ae.PARTY_AGAINST_CASE_PARTY_NO
AND addr.party_role_code = ae.party_against_party_role_code
AND addr.party_id IS NULL
AND addr.address_type_code = 'WORKPLACE'
AND addr.valid_to IS NULL;
CURSOR c_get_ae IS
SELECT
  PARTY_FOR_CASE_PARTY_NO,
  PARTY_FOR_PARTY_ROLE_CODE,
  PARTY_AGAINST_CASE_PARTY_NO,
  PARTY_AGAINST_PARTY_ROLE_CODE,
  DEBTORS_EMPLOYERS_PARTY_ID,
  CASE_NUMBER
FROM  AE_APPLICATIONS
WHERE AE_NUMBER = P_AE_NUMBER;

  l_pty_for_case_party_no   AE_APPLICATIONS.party_for_case_party_no%TYPE;
  l_pty_for_party_role_code AE_APPLICATIONS.party_for_party_role_code%TYPE;
  l_pty_against_case_party_no AE_APPLICATIONS.party_against_case_party_no%TYPE;
  l_pty_against_party_role_code AE_APPLICATIONS.party_against_party_role_code%TYPE;
  l_employer      AE_APPLICATIONS.debtors_employers_party_id%TYPE;
  l_case_number     AE_APPLICATIONS.case_number%TYPE;
   -- applicable to all procedures
   l_code        case_parties.coded_party_no%TYPE;
   l_name        case_parties.name%TYPE;
   l_addr_1      case_parties.address_line1%TYPE;
   l_addr_2      case_parties.address_line2%TYPE;
   l_addr_3      case_parties.address_line3%TYPE;
   l_addr_4      case_parties.address_line4%TYPE;
   l_addr_5      case_parties.address_line5%TYPE;
   l_postcode    case_parties.postcode%TYPE;
   l_tel_no      case_parties.tel_no%TYPE;
   l_dx_no       case_parties.dx_number%TYPE;
   l_reference   case_parties.reference%TYPE;
   l_error       VARCHAR2(2000);
   -- cmp_ae_details
   l_ae_type      AE_APPLICATIONS.ae_type%TYPE;
   l_ae_fee       AE_APPLICATIONS.ae_fee%TYPE;
   l_amount_of_ae AE_APPLICATIONS.amount_of_ae%TYPE;
   l_per          AE_APPLICATIONS.protected_earnings_rate%TYPE;
   l_ndr          AE_APPLICATIONS.normal_deduction_rate%TYPE;
   l_pep          AE_APPLICATIONS.protected_earnings_period%TYPE;
   l_ndp          AE_APPLICATIONS.normal_deduction_period%TYPE;
   l_date_of_issue AE_APPLICATIONS.date_of_issue%TYPE;
   -- cmp_defendant
   l_deft_id   CASE_PARTIES.CASE_PARTY_NO%TYPE;
   -- cmp_plaintiff
   l_plaintiff_reference case_PARTIES.reference%TYPE;
   BEGIN

  OPEN c_get_ae;
  FETCH c_get_ae INTO l_pty_for_case_party_no,
        l_pty_for_party_role_code,
        l_pty_against_case_party_no,
        l_pty_against_party_role_code,
        l_employer,
        l_case_number;
  IF c_get_ae%NOTFOUND THEN
    p_error := 'cmp_ae_party_details ae not found';
  END IF;
  CLOSE c_get_ae;
  IF p_party = 'CREDITOR' THEN
    cmp_party_service(  l_case_number,
          l_pty_for_party_role_code,
          l_pty_for_case_party_no,
          NULL,
          l_code,
          l_name,
          l_addr_1,
          l_addr_2,
          l_addr_3,
          l_addr_4,
          l_addr_5,
          l_postcode,
          l_tel_no,
          l_reference,
          l_error);
    IF l_error IS NOT NULL THEN
      p_error := 'cmp_ae_party_details '||l_error;
    ELSE
      p_code      := l_code;
      p_name      := l_name;
      p_addr_1    := l_addr_1;
      p_addr_2    := l_addr_2;
      p_addr_3    := l_addr_3;
      p_addr_4    := l_addr_4;
      p_addr_5    := l_addr_5;
      p_postcode  := l_postcode;
      p_tel_no    := l_tel_no;
      p_dx_no     := NULL;
      p_reference := l_reference;
    END IF;
  ELSIF p_party = 'DEBTOR' THEN
    cmp_party_service(  l_case_number,
          l_pty_against_party_role_code,
          l_pty_against_case_party_no,
          NULL,
          l_code,
          l_name,
          l_addr_1,
          l_addr_2,
          l_addr_3,
          l_addr_4,
          l_addr_5,
          l_postcode,
          l_tel_no,
          l_reference,
          l_error);
    IF l_error IS NOT NULL THEN
      p_error := 'cmp_ae_party_details '||l_error;
    ELSE
      p_code      := l_code;
      p_name      := l_name;
      p_addr_1    := l_addr_1;
      p_addr_2    := l_addr_2;
      p_addr_3    := l_addr_3;
      p_addr_4    := l_addr_4;
      p_addr_5    := l_addr_5;
      p_postcode  := l_postcode;
      p_tel_no    := l_tel_no;
      p_dx_no     := NULL;
      p_reference := l_reference;
    END IF;
  ELSIF p_party = 'EMPLOYER' THEN
    cmp_employer( p_ae_number,
                          'AE',
              l_employer,
                          l_name,
                          l_addr_1,
                          l_addr_2,
                          l_addr_3,
                          l_addr_4,
                          l_addr_5,
                          l_postcode,
                          l_reference,
                          l_error);
    IF l_error IS NOT NULL THEN
      p_error := 'cmp_ae_party_details '||l_error;
    ELSE
      p_code      := NULL;
      p_name      := l_name;
      p_addr_1    := l_addr_1;
      p_addr_2    := l_addr_2;
      p_addr_3    := l_addr_3;
      p_addr_4    := l_addr_4;
      p_addr_5    := l_addr_5;
      p_postcode  := l_postcode;
      p_tel_no    := NULL;
      p_dx_no     := NULL;
      p_reference := l_reference;
    END IF;
  ELSIF p_party = 'WORKPLACE' THEN
    OPEN c_workplace_address;
    FETCH c_workplace_address INTO
      l_addr_1,
                        l_addr_2,
                        l_addr_3,
                        l_addr_4,
                        l_addr_5,
                        l_postcode,
                        l_reference;
    IF c_workplace_address%NOTFOUND THEN
      p_error := 'cmp_ae_party_details workplace address not found';
    ELSE
      p_code      := NULL;
      p_name      := NULL;
      p_addr_1    := l_addr_1;
      p_addr_2    := l_addr_2;
      p_addr_3    := l_addr_3;
      p_addr_4    := l_addr_4;
      p_addr_5    := l_addr_5;
      p_postcode  := l_postcode;
      p_tel_no    := NULL;
      p_dx_no     := NULL;
      p_reference := l_reference;
    END IF;
    CLOSE c_workplace_address;
  ELSIF p_party = 'PAYEE' THEN
    IF NOT cmf_solicitor_exists(p_ae_number,'FOR','N') THEN
      cmp_party_service(  l_case_number,
            l_pty_for_party_role_code,
            l_pty_for_case_party_no,
            NULL,
            l_code,
            l_name,
            l_addr_1,
            l_addr_2,
            l_addr_3,
            l_addr_4,
            l_addr_5,
            l_postcode,
            l_tel_no,
            l_reference,
            l_error);
      IF l_error IS NOT NULL THEN
        p_error := 'cmp_ae_party_details '||l_error;
      ELSE
        p_code      := l_code;
        p_name      := l_name;
        p_addr_1    := l_addr_1;
        p_addr_2    := l_addr_2;
        p_addr_3    := l_addr_3;
        p_addr_4    := l_addr_4;
        p_addr_5    := l_addr_5;
        p_postcode  := l_postcode;
        p_tel_no    := l_tel_no;
        p_dx_no     := NULL;
        p_reference := l_reference;
      END IF;
    ELSE
          cmp_solicitor(  p_ae_number,
                  l_pty_for_party_role_code,
                  l_pty_for_case_party_no,
                  l_name,
                  l_code,
                  l_addr_1,
                  l_addr_2,
                  l_addr_3,
                  l_addr_4,
                  l_addr_5,
                  l_reference,
                  l_postcode,
                  l_tel_no,
                  l_dx_no,
                  l_error);
      IF l_error IS NOT NULL THEN
        p_error := 'cmp_ae_party_details '||l_error;
      ELSE
        p_code      := l_code;
        p_name      := l_name;
        p_addr_1    := l_addr_1;
        p_addr_2    := l_addr_2;
        p_addr_3    := l_addr_3;
        p_addr_4    := l_addr_4;
        p_addr_5    := NULL;
        p_postcode  := l_postcode;
        p_tel_no    := l_tel_no;
        p_dx_no     := l_dx_no;
        p_reference := l_reference;
      END IF;
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_ae_party_details '||SQLERRM;
END cmp_ae_party_details;

FUNCTION cmf_ald_debt_balance (p_debt_seq ALLOWED_DEBTS.debt_seq%TYPE) RETURN NUMBER IS
CURSOR c_paid IS
   SELECT NVL(SUM(dd.dd_amount), 0)
   FROM   DEBT_DIVIDENDS dd
   WHERE  dd.dd_ald_seq = p_debt_seq
   AND    dd.created = 'Y';
CURSOR c_pass IS
   SELECT NVL(SUM(pay.amount), 0)
   FROM   PAYMENTS pay, ALLOWED_DEBTS ald
   WHERE  p_debt_seq = pay.ald_debt_seq
   AND    ald.debt_seq = pay.ald_debt_seq
   AND    ald.debt_status NOT IN ('DELETED', 'PAID', 'PENDING')
   AND    pay.passthrough = 'Y'
   AND    pay.error_indicator = 'N';
CURSOR c_debt IS
   SELECT ald.debt_amount_allowed
   FROM   ALLOWED_DEBTS ald
   WHERE  ald.debt_seq = p_debt_seq;
l_pass NUMBER(38, 2) := 0;
l_paid NUMBER(38, 2) := 0;
l_debt NUMBER(38, 2) := 0;
BEGIN
-- get total paid
OPEN c_paid;
FETCH c_paid INTO l_paid;
CLOSE c_paid;
-- get total passthroughs
OPEN c_pass;
FETCH c_pass INTO l_pass;
CLOSE c_pass;
OPEN c_debt;
-- get total due
FETCH c_debt INTO l_debt;
CLOSE c_debt;
-- RETURN balance
RETURN l_debt - (l_pass + l_paid);
EXCEPTION
  WHEN OTHERS THEN
        RAISE;
END cmf_ald_debt_balance;

FUNCTION cmf_money_in_court ( p_co_number CONSOLIDATED_ORDERS.co_number%TYPE,
        p_releasable_ind VARCHAR2 DEFAULT 'Y') RETURN NUMBER IS
l_money NUMBER(38, 2) := 0;
CURSOR c_money IS
   SELECT NVL(SUM(pay.amount), 0)
   FROM   PAYMENTS pay
   WHERE  pay.payout_date IS NULL
   AND    pay.rd_date IS NULL
   AND    pay.passthrough = 'N'
   AND    pay.retention_type = 'AO/CAEO'
   AND    pay.payment_for = 'CO'
   AND    pay.subject_no = p_co_number
   AND    ((p_releasable_ind = 'Y'  AND TRUNC(pay.release_date) < TRUNC(SYSDATE)) OR p_releasable_ind = 'N');
BEGIN
OPEN c_money;
FETCH c_money INTO l_money;
CLOSE c_money;
RETURN l_money;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END cmf_money_in_court;

-- This function is only to be used to get the case number for a PAYMENT,
-- and therefore we know the payment owner and the enforcement owner.

FUNCTION f_get_case_number
 (p_admin_court_code       IN COURTS.code%TYPE,    -- payment owner
  p_enforcement_court_code IN COURTS.code%TYPE,    -- enforcement owner
  p_subject_no             IN PAYMENTS.subject_no%TYPE,
  p_subject_type           IN PAYMENTS.payment_for%TYPE)
RETURN VARCHAR2
IS


v_case_number VARCHAR2(10);

CURSOR c_ae IS
SELECT  c.case_number
FROM  AE_APPLICATIONS ae,
  CASES c
WHERE ae.ae_number = p_subject_no
AND ae.case_number = c.case_number;

CURSOR hwarrant IS
SELECT  c.case_number
FROM  WARRANTS war,
  CASES c
WHERE war.warrant_number = p_subject_no
AND war.local_warrant_number IS NULL
AND war.case_number = c.case_number
AND     war.issued_by   = p_enforcement_court_code;

CURSOR fwarrant IS
  SELECT war.case_number
  FROM   WARRANTS war
  WHERE  war.local_warrant_number = p_subject_no
  AND    war.currently_owned_by = p_enforcement_court_code;

CURSOR casedet IS
SELECT  c.case_number
FROM  CASES c
WHERE c.case_number = p_subject_no;

BEGIN
  IF p_subject_type = 'AE' THEN
    OPEN c_ae;
    FETCH c_ae INTO v_case_number;
    CLOSE c_ae;
  ELSIF p_subject_type = 'CASE' THEN
    OPEN casedet;
    FETCH casedet INTO v_case_number;
    CLOSE casedet;
  ELSIF p_subject_type = 'HOME WARRANT' THEN
    OPEN hwarrant;
    FETCH hwarrant INTO v_case_number;
    CLOSE hwarrant;
  ELSIF p_subject_type = 'FOREIGN WARRANT' THEN
    OPEN fwarrant;
    FETCH fwarrant INTO v_case_number;
    CLOSE fwarrant;
  END IF;
  RETURN(v_case_number);

END f_get_case_number;

PROCEDURE p_del_gen_repno(p_court_code NUMBER, p_userid VARCHAR2, p_report_id VARCHAR2) IS

l_report_type VARCHAR2(4);
BEGIN

  IF SUBSTR(p_report_id,1,4) IN ('PREC', 'BVER', 'CVER') THEN
    l_report_type := SUBSTR(p_report_id,1,4);
  ELSE
    l_report_type := SUBSTR(p_report_id,1,3);
  END IF;

  DELETE FROM REPORT_DATA
  WHERE  report_type = l_report_type
  AND    user_id   = p_userid
  AND    admin_court_code = p_court_code;
  COMMIT;

END p_del_gen_repno;

PROCEDURE p_final_dcs (p_report_id IN DCS.report_id%TYPE, p_court_code IN DCS.admin_court_code%TYPE) IS
BEGIN
  UPDATE  DCS
  SET final = 'Y'
  WHERE report_id = p_report_id
  AND admin_court_code = p_court_code;
  COMMIT;

END  p_final_dcs;

FUNCTION cmf_co_target_amount (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE) RETURN NUMBER IS
l_live_debts NUMBER(38, 2) := 0;
l_total_debts NUMBER(38, 2) := 0;
l_target_amount NUMBER(38, 2) := 0;
CURSOR c_live_debts IS
   SELECT NVL(SUM(ald.debt_amount_allowed), 0)
   FROM   ALLOWED_DEBTS ald
   WHERE  ald.debt_co_number = p_co_number
   AND    ald.debt_status IN ('PAID', 'LIVE');
CURSOR c_total_debts IS
   SELECT NVL(SUM(ald.debt_amount_allowed), 0)
   FROM   ALLOWED_DEBTS ald
   WHERE  ald.debt_co_number = p_co_number
   AND    ald.debt_status IN ('PAID', 'LIVE', 'SCHEDULE2');
CURSOR c_target_amount IS
   SELECT (l_total_debts + NVL(co.fee_amount, 0)) * l_live_debts/l_total_debts * co.dividend_target/100
   FROM   CONSOLIDATED_ORDERS co
   WHERE  co.co_number = p_co_number;
BEGIN
-- Get live debts
OPEN c_live_debts;
FETCH c_live_debts INTO l_live_debts;
CLOSE c_live_debts;
-- Get total debts
OPEN c_total_debts;
FETCH c_total_debts INTO l_total_debts;
CLOSE c_total_debts;
-- Prevent zero divide error if total debts are zero or negative.
IF l_total_debts <= 0 THEN
l_total_debts := 1;
l_live_debts := 1;
END IF;
-- RETURN target amount
OPEN c_target_amount;
FETCH c_target_amount INTO l_target_amount;
CLOSE c_target_amount;
RETURN l_target_amount;

EXCEPTION
   WHEN OTHERS THEN
          RAISE;
END cmf_co_target_amount;

FUNCTION cmf_outstanding_fee (p_co_number CONSOLIDATED_ORDERS.co_number%TYPE) RETURN NUMBER IS

CURSOR c_fee_due IS
  SELECT  co.fee_amount
  FROM  CONSOLIDATED_ORDERS co
  WHERE co.co_number = p_co_number;
CURSOR c_fee_taken IS
  SELECT NVL(SUM(div.div_fee), 0)
  FROM DIVIDENDS div
  WHERE div.div_co_number = p_co_number
  AND div.created = 'Y';

l_fee_due NUMBER;
l_fee_taken NUMBER;

BEGIN

  OPEN c_fee_due;
  FETCH c_fee_due INTO l_fee_due;
  CLOSE c_fee_due;

  OPEN c_fee_taken;
  FETCH c_fee_taken INTO l_fee_taken;
  CLOSE c_fee_taken;

  RETURN l_fee_due - l_fee_taken;

EXCEPTION
   WHEN OTHERS THEN
   RAISE;
END cmf_outstanding_fee;

FUNCTION f_next_working_day(p_date IN DATE) RETURN DATE IS

CURSOR c_bank_hol (c_date IN DATE) IS
SELECT  'x'
FROM  NON_WORKING_DAYS
WHERE TRUNC(non_working_date) = TRUNC(c_date)
AND   error_indicator = 'N';

l_date    DATE := p_date;
l_bank_hol  VARCHAR2(1);

BEGIN

  LOOP
    OPEN  c_bank_hol(l_date);
    FETCH c_bank_hol INTO l_bank_hol;

    IF c_bank_hol%NOTFOUND THEN

      IF TO_CHAR(l_date, 'Dy') IN ('Sat', 'Sun') THEN
        l_date := l_date + 1;
      ELSE
        CLOSE c_bank_hol;
        EXIT;
      END IF;
    ELSE
      l_date := l_date + 1;
    END IF;
    CLOSE c_bank_hol;

  END LOOP;

  RETURN TRUNC(l_date);

END f_next_working_day;

FUNCTION f_prior_working_day(n_date IN DATE,num_prior IN NUMBER) RETURN DATE IS

CURSOR c_holiday (c_date IN DATE) IS
SELECT  'x'
FROM  NON_WORKING_DAYS
WHERE TRUNC(non_working_date) = TRUNC(c_date)
AND error_indicator = 'N';

l_date    DATE := n_date;
l_holiday VARCHAR2(1);

BEGIN

  FOR i IN 1..num_prior LOOP
    l_date := l_date - 1;
    LOOP
      OPEN  c_holiday(l_date);
      FETCH c_holiday INTO l_holiday;
      IF c_holiday%NOTFOUND THEN
        IF TO_CHAR(l_date, 'Dy') IN ('Sat', 'Sun') THEN
          l_date := l_date - 1;
        ELSE
          l_date := l_date;
          CLOSE c_holiday;
          EXIT;
        END IF;
      ELSE
        l_date := l_date - 1;
      END IF;
      CLOSE c_holiday;
    END LOOP;
  END LOOP;

  RETURN TRUNC(l_date);

END f_prior_working_day;

PROCEDURE cmp_insert_event (p_co_number CO_EVENTS.co_number%TYPE,
                            p_std_event_id CO_EVENTS.std_event_id%TYPE,
                            p_issue_stage CO_EVENTS.issue_stage%TYPE,
                            p_details CO_EVENTS.details%TYPE,
                            p_bailiff_identifier CO_EVENTS.bailiff_identifier%TYPE,
                            p_service_status CO_EVENTS.service_status%TYPE,
                            p_service_date DATE,
                            p_process_stage CO_EVENTS.process_stage%TYPE,
                            p_process_date DATE,
                            p_receipt_date DATE,
                            p_hrg_seq CO_EVENTS.hrg_seq%TYPE,
                            p_warrant_id WARRANTS.warrant_id%TYPE,
                            p_ald_debt_seq CO_EVENTS.ald_debt_seq%TYPE,
                            p_report_val_1 CO_EVENTS.report_value_1%TYPE,
                            p_user_id          IN user_information.name%TYPE,
                            p_bms_court_code   IN COURTS.code%TYPE,              -- court code and section for BMS counting
                            p_bms_section      IN user_information.SECTION%TYPE
)
IS

v_bms_task_number CO_EVENTS.bms_task_number%TYPE;
v_stats_module CO_EVENTS.stats_module%TYPE;
v_task_age CO_EVENTS.AGE_CATEGORY%TYPE;
l_error_ind VARCHAR2(1) := 'N';
l_co_event_seq CO_EVENTS.co_event_seq%TYPE;

BEGIN
-- Extract the task number or stats module values from the BMS Package
v_bms_task_number := f_get_event_task(NULL
                        , NULL
                        , p_std_event_id
                        , 'B'
                        , NULL
                        , NULL
                        , NULL
                        , p_issue_stage
                        , 'C');

v_stats_module := f_get_event_task(NULL
                        , NULL
                        , p_std_event_id
                        , 'S'
                        , NULL
                        , NULL
                        , NULL
                        , p_issue_stage
                        , 'C');

-- Extract the task age from the BMS Package
v_task_age := f_task_age(NVL(p_receipt_date, TRUNC(SYSDATE)), TRUNC(SYSDATE));

-- Obtain the next sequence number from CO_EVENT_SEQUENCE
SELECT co_event_sequence.NEXTVAL INTO l_co_event_seq
   FROM DUAL;

-- Insert the CO Event record based on the parameters passed in and extracted values.
INSERT INTO CO_EVENTS
        (CO_EVENT_SEQ
        , CO_NUMBER
        , EVENT_DATE
        , STD_EVENT_ID
        , ISSUE_STAGE
        , DETAILS
        , ERROR_INDICATOR
        , USERNAME
        , BAILIFF_IDENTIFIER
        , SERVICE_STATUS
        , SERVICE_DATE
        , PROCESS_STAGE
        , PROCESS_DATE
        , RECEIPT_DATE
        , BMS_TASK_NUMBER
        , STATS_MODULE
        , AGE_CATEGORY
        , HRG_SEQ
        , WARRANT_ID
        , ALD_DEBT_SEQ
        , REPORT_VALUE_1
        , CREATING_COURT
        , CREATING_SECTION)
   VALUES
        (l_co_event_seq
        , p_co_number
        , TRUNC(SYSDATE)
        , p_std_event_id
        , p_issue_stage
        , p_details
        , l_error_ind
        , p_user_id
        , p_bailiff_identifier
        , p_service_status
        , p_service_date
        , p_process_stage
        , p_process_date
        , TRUNC(SYSDATE)
        , v_bms_task_number
        , v_stats_module
        , v_task_age
        , p_hrg_seq
        , p_warrant_id
        , p_ald_debt_seq
        , p_report_val_1
        , p_bms_court_code
        , p_bms_section);

END cmp_insert_event;

PROCEDURE p_eoap (p_report_no IN VARCHAR2, p_court_code IN PAYMENT_SUMMARY.admin_court_code%TYPE) IS

l_report_id VARCHAR2(14);
l_count_in NUMBER := 0;
l_o_in NUMBER := 0;
l_c_in NUMBER := 0;
l_j_in NUMBER := 0;
l_a_in NUMBER := 0;
l_i_in NUMBER := 0;
l_p_in NUMBER := 0;
l_m_in NUMBER := 0;
l_count_out NUMBER := 0;
l_o_out NUMBER := 0;
l_c_out NUMBER := 0;
l_j_out NUMBER := 0;
l_a_out NUMBER := 0;
l_i_out NUMBER := 0;
l_p_out NUMBER := 0;
l_m_out NUMBER := 0;

CURSOR c_in IS SELECT SUM(NVL(transaction_total,0)),
                      SUM(NVL(ordinary,0)),
                      SUM(NVL(cheque,0)),
                      SUM(NVL(jgmt1000,0)),
                      SUM(NVL(AO_CAEO,0)),
                      SUM(NVL(insatis,0)),
                      SUM(NVL(pto_order,0)),
                      SUM(NVL(miscellaneous,0))
FROM PAYMENT_SUMMARY
WHERE valid = 'Y'
AND inout = 'I'
AND admin_court_code = p_court_code;


CURSOR c_out IS SELECT SUM(NVL(transaction_total,0)),
                       SUM(NVL(ordinary,0)),
                       SUM(NVL(cheque,0)),
                       SUM(NVL(jgmt1000,0)),
                       SUM(NVL(AO_CAEO,0)),
                       SUM(NVL(insatis,0)),
                       SUM(NVL(pto_order,0)),
                       SUM(NVL(miscellaneous,0))
FROM PAYMENT_SUMMARY
WHERE valid = 'Y'
AND inout = 'O'
AND admin_court_code = p_court_code;

BEGIN


l_report_id := 'B/F '||SUBSTR(p_report_no,5,14);


OPEN c_in;
FETCH c_in INTO l_count_in,
                l_o_in,
                l_c_in,
                l_j_in,
                l_a_in,
                l_i_in,
                l_p_in,
                l_m_in;
CLOSE c_in;

OPEN c_out;
FETCH c_out INTO l_count_out,
                 l_o_out,
                 l_c_out,
                 l_j_out,
                 l_a_out,
                 l_i_out,
                 l_p_out,
                 l_m_out;
CLOSE c_out;


INSERT INTO PAYMENT_SUMMARY(dcs_date,
                            report_id,
                            transaction_total,
                            ordinary,
                            cheque,
                            jgmt1000,
                            AO_CAEO,
                            insatis,
                            pto_order,
                            miscellaneous,
                            valid,
                            inout,
          admin_court_code)
                    VALUES (TRUNC(SYSDATE),
                            l_report_id,
                            NVL(l_count_in,0) - NVL(l_count_out,0),
                            NVL(l_o_in,0) - NVL(l_o_out,0),
                            NVL(l_c_in,0) - NVL(l_c_out,0),
                            NVL(l_j_in,0) - NVL(l_j_out,0),
                            NVL(l_a_in,0) - NVL(l_a_out,0),
                            NVL(l_i_in,0) - NVL(l_i_out,0),
                            NVL(l_p_in,0) - NVL(l_p_out,0),
                            NVL(l_m_in,0) - NVL(l_m_out,0),
                            'Y',
                            'I',
          p_court_code);
DELETE FROM DCS WHERE admin_court_code = p_court_code;
DELETE FROM PAYMENT_SUMMARY
WHERE report_id != l_report_id AND admin_court_code = p_court_code;

COMMIT;
END p_eoap;

PROCEDURE cmp_declare_dividends
  (p_court_code   IN COURTS.code%TYPE,
   p_release_date IN DATE,
   p_report_id    IN DIVIDENDS.div_report_id%TYPE,
   p_user_id      IN DIVIDENDS.div_created_by%TYPE)
IS
l_os_debts    NUMBER(38, 2) := 0;
l_os_fees   NUMBER(38, 2) := 0;
l_live_debts    NUMBER(38, 2) := 0;
l_total_debts   NUMBER(38, 2) := 0;
l_s2_debts    NUMBER(38, 2) := 0;
l_dividends   NUMBER(38, 2) := 0;
l_live_divs   NUMBER(38, 2) := 0;
l_fees_paid   NUMBER(38, 2) := 0;
l_s2os_debts    NUMBER(38, 2) := 0;
l_div_number    NUMBER(38, 2) := 0;
l_schedule2_amount  NUMBER(38, 2) := 0;
l_cred_amount   NUMBER(38, 2) := 0;
l_amount_to_pay_out NUMBER(38, 2) := 0;
l_div_fee   NUMBER(38, 2) := 0;
l_count_os_live_debt  NUMBER(38, 2) := 0;
l_count_os_s2_debt  NUMBER(38, 2) := 0;
l_pass      NUMBER(38, 2) := 0;
l_live_pass   NUMBER(38, 2) := 0;

CURSOR c_pay IS
  SELECT    NVL(SUM(cdp.cdp_amount), 0) l_tot_amount,
      cdp.cdp_co_number l_co_number,
      co.co_type l_co_type,
      NVL(co.fee_amount, 0) l_fee
  FROM    CONSOLIDATED_ORDERS co, CANDIDATE_DIVIDEND_PAYMENTS cdp
  WHERE     co.admin_court_code = p_court_code
        AND             co.admin_court_code = cdp.admin_court_code
  AND   co.co_number = cdp.cdp_co_number
  GROUP BY  cdp.cdp_co_number, co.co_type, co.fee_amount;

r_pay c_pay%ROWTYPE;

CURSOR c_live_debts IS
  SELECT  NVL(SUM(debt_amount_allowed), 0)
  FROM  ALLOWED_DEBTS ald
  WHERE ald.debt_status = 'LIVE'
  AND debt_co_number = r_pay.l_co_number;

CURSOR c_live_pass IS
  SELECT  NVL(SUM(pay.amount), 0)
  FROM  PAYMENTS pay, ALLOWED_DEBTS ald
  WHERE ald.debt_seq = pay.ald_debt_seq
  AND pay.passthrough = 'Y'
  AND ald.debt_co_number = r_pay.l_co_number
  AND pay.error_indicator = 'N'
  AND ald.debt_status = 'LIVE';

CURSOR c_pass IS
  SELECT  NVL(SUM(pay.amount), 0)
  FROM  PAYMENTS pay, ALLOWED_DEBTS ald
  WHERE ald.debt_seq = pay.ald_debt_seq
  AND pay.passthrough = 'Y'
  AND ald.debt_co_number = r_pay.l_co_number
  AND pay.error_indicator = 'N'
  AND ald.debt_status IN ('LIVE','SCHEDULE2');

CURSOR c_dividends (p_status IN VARCHAR2) IS
  SELECT  NVL(SUM(dd.dd_amount), 0)
  FROM  DEBT_DIVIDENDS dd, ALLOWED_DEBTS ald
  WHERE dd.dd_co_number = r_pay.l_co_number
  AND dd.dd_ald_seq = ald.debt_seq
  AND ((ald.debt_status NOT IN ('PAID', 'DELETED') AND p_status = 'ALL') OR (debt_status = 'LIVE' AND p_status = 'LIVE'))
  AND dd.created = 'Y';

CURSOR c_div_fee IS
  SELECT  NVL(SUM(div.div_fee), 0)
  FROM  DIVIDENDS div
  WHERE div.div_co_number = r_pay.l_co_number
  AND div.created = 'Y';

CURSOR c_total_debts IS
  SELECT  NVL(SUM(debt_amount_allowed), 0)
  FROM  ALLOWED_DEBTS ald
  WHERE ald.debt_co_number = r_pay.l_co_number
  AND ald.debt_status IN ('LIVE', 'SCHEDULE2');

CURSOR c_div_number IS
  SELECT  NVL(MAX(div.div_number), 0) + 1
  FROM  DIVIDENDS div
  WHERE div.div_co_number = r_pay.l_co_number;

CURSOR c_count_os_live_debt IS
  SELECT  COUNT(*)
  FROM  ALLOWED_DEBTS ald
  WHERE ald.debt_co_number = r_pay.l_co_number
  AND ald.debt_status = 'LIVE';

CURSOR c_os_live_debt IS
  SELECT  cmf_ald_debt_balance(ald.debt_seq) l_os_debt, ald.debt_seq, ROWNUM
  FROM  ALLOWED_DEBTS ald
  WHERE ald.debt_co_number = r_pay.l_co_number
  AND ald.debt_status = 'LIVE';

CURSOR c_count_os_s2_debt IS
  SELECT  COUNT(*)
  FROM  ALLOWED_DEBTS ald
  WHERE ald.debt_co_number = r_pay.l_co_number
  AND ald.debt_status = 'SCHEDULE2';

CURSOR c_os_s2_debt IS
  SELECT  cmf_ald_debt_balance(ald.debt_seq) l_s2os_debt, ald.debt_seq, ROWNUM
  FROM  ALLOWED_DEBTS ald
  WHERE ald.debt_co_number = r_pay.l_co_number
  AND ald.debt_status = 'SCHEDULE2';

BEGIN

-- get all potential payments
  INSERT INTO CANDIDATE_DIVIDEND_PAYMENTS
    (cdp_amount,
     cdp_co_number,
     cdp_transaction_number,
     cdp_div_number,
     admin_court_code)
  SELECT   pay.amount - NVL(pay.overpayment_amount, 0),
     pay.subject_no,
     pay.transaction_number,
     0,
     p_court_code
  FROM  PAYMENTS pay
  WHERE pay.payout_date IS NULL
  AND     pay.passthrough = 'N'
  AND pay.release_date <= TRUNC(p_release_date)
  AND pay.retention_type = 'AO/CAEO'
  AND pay.payment_for = 'CO'
        AND     pay.admin_court_code = p_court_code;

-- delete where relevant conditions have not been met
-- for either type, delete any records where there is an unresolved overpayment

  DELETE FROM CANDIDATE_DIVIDEND_PAYMENTS cdp
  WHERE cdp.cdp_co_number IN (  SELECT  cdp2.cdp_co_number
          FROM  PAYMENTS pay,
            CANDIDATE_DIVIDEND_PAYMENTS cdp2
          WHERE pay.transaction_number = cdp2.cdp_transaction_number
          AND pay.admin_court_code = cdp2.admin_court_code
          AND pay.overpayment_amount IS NOT NULL
          AND pay.overpayee_name IS NULL
          AND cdp2.admin_court_code = p_court_code)
  AND cdp.admin_court_code = p_court_code;

  IF SUBSTR(p_report_id,1,3) = 'PPL' THEN
--if weekly payout delete if any conditions not met

    DELETE FROM CANDIDATE_DIVIDEND_PAYMENTS cdp
    WHERE cdp.admin_court_code = p_court_code
                AND     cdp.cdp_co_number IN (  SELECT  co.co_number
            FROM  CANDIDATE_DIVIDEND_PAYMENTS cdp1,
              CONSOLIDATED_ORDERS co
            WHERE cdp1.cdp_co_number = co.co_number
            AND cdp1.admin_court_code = p_court_code
            AND cmf_co_target_amount(co.co_number) > (  SELECT  SUM(cdp2.cdp_amount) -- target not met
                            FROM  CANDIDATE_DIVIDEND_PAYMENTS cdp2
                            WHERE cdp2.cdp_co_number = co.co_number
                            AND cdp2.admin_court_code = p_court_code)
            AND NVL(co.adhoc_dividend,'N') = 'N'  -- not ad hoc
            AND co.co_status NOT IN ('REVOKED','DISCHARGED')-- not discharged/revoked
            AND cmf_co_os_balance(co.co_number, 'Y')  > ( SELECT  SUM(cdp3.cdp_amount) -- not paid in full
                            FROM  CANDIDATE_DIVIDEND_PAYMENTS cdp3
                            WHERE cdp3.cdp_co_number = co.co_number
                            AND cdp3.admin_court_code = p_court_code));

--if dividend payout then delete anything not marked for ad hoc

  ELSIF  SUBSTR(p_report_id,1,3) = 'DIV' THEN

    DELETE FROM CANDIDATE_DIVIDEND_PAYMENTS cdp
    WHERE cdp.cdp_co_number IN (  SELECT  co.co_number
            FROM  CANDIDATE_DIVIDEND_PAYMENTS cdp4,
              CONSOLIDATED_ORDERS co
            WHERE cdp4.cdp_co_number = co.co_number
            AND cdp4.admin_court_code = p_court_code
            AND NVL(co.adhoc_dividend,'N') != 'Y'  )
    AND cdp.admin_court_code = p_court_code;

  END IF;
-- process candidate_dividend payments

FOR r_div IN c_pay LOOP

  r_pay := r_div;
      -- get live debts
  OPEN c_live_debts;
  FETCH c_live_debts INTO l_live_debts;
  CLOSE c_live_debts;

      -- get div amount
  OPEN c_dividends('ALL');
  FETCH c_dividends INTO l_dividends;
  CLOSE c_dividends;

      -- get div fee
  OPEN c_div_fee;
  FETCH c_div_fee INTO l_fees_paid;
  CLOSE c_div_fee;

      -- get total debts
  OPEN c_total_debts;
  FETCH c_total_debts INTO l_total_debts;
  CLOSE c_total_debts;

      -- get total passthroughs
  OPEN c_pass;
  FETCH c_Pass INTO l_pass;
  CLOSE c_pass;

      -- get LIVE passthroughs
  OPEN c_live_pass;
  FETCH c_live_pass INTO l_live_pass;
  CLOSE c_live_pass;

-- if there are no valid debts to process then take no action.
-- if there is no money to proces (ie just overpayment) then take no action. DC 23/5/2001 SCR9025
  IF l_total_debts > 0 AND r_pay.l_tot_amount > 0 THEN
    -- get proportionate outstanding fees
    l_os_fees := (r_pay.l_fee * (l_live_debts - l_live_pass)/(l_total_debts - l_pass)) - l_fees_paid;
    -- get outstanding debts
    l_os_debts := l_live_debts - l_dividends - l_live_pass;

    -- get proportionate dividend fee
    l_div_fee := (l_os_fees/(l_os_debts + l_os_fees)) * r_pay.l_tot_amount;

    -- get next dividend number
    OPEN c_div_number;
    FETCH c_div_number INTO l_div_number;
    CLOSE c_div_number;

    -- create dividend for candidate dividend payment, including total candidate dividend payments,
    -- proportionate outstanding fee and next dividend number for CO.
    INSERT INTO DIVIDENDS
      ( created,
        div_amount,
        div_co_number,
        div_created_by,
        div_date,
        div_fee,
        div_report_id,
        div_number)
    VALUES  ( 'N',
        r_pay.l_tot_amount,
        r_pay.l_co_number,
        p_user_id,
        SYSDATE,
        l_div_fee,
        p_report_id,
        l_div_number);

    UPDATE  CANDIDATE_DIVIDEND_PAYMENTS
    SET cdp_div_number = l_div_number
    WHERE cdp_co_number = r_pay.l_co_number
    AND admin_court_code = p_court_code;

    -- get total to pay
    l_amount_to_pay_out := r_pay.l_tot_amount - l_div_fee;

    OPEN c_dividends('LIVE');
    FETCH c_dividends INTO l_live_divs;
    CLOSE c_dividends;

    -- get schedule2 to pay
    l_schedule2_amount := l_amount_to_pay_out - (l_live_debts - l_live_pass - l_live_divs);
    IF r_pay.l_co_type = 'AO' AND l_schedule2_amount > 0 THEN   -- schedule2 debts exist

      -- get outstanding schedule2 debts
      l_s2os_debts := l_total_debts - l_live_debts;

      -- modify total to pay out
      l_amount_to_pay_out :=  l_amount_to_pay_out - l_schedule2_amount;

    END IF;

    -- get live debts
    -- get number of debts
    OPEN c_count_os_live_debt;
    FETCH c_count_os_live_debt INTO l_count_os_live_debt;
    CLOSE c_count_os_live_debt;
    FOR r_os_live_debt IN c_os_live_debt LOOP

      -- get amount to pay creditor
      IF l_count_os_live_debt = r_os_live_debt.ROWNUM THEN
        -- last debt
        l_cred_amount := l_amount_to_pay_out;
      ELSE
        l_cred_amount := ROUND(l_amount_to_pay_out * (r_os_live_debt.l_os_debt/l_os_debts), 2);
      END IF;

      -- create debt dividend
      INSERT INTO DEBT_DIVIDENDS
        ( dd_seq,
          dd_co_number,
          dd_div_number,
          dd_ald_seq,
          created,
          dd_amount)
      VALUES (  dd_sequence.NEXTVAL,
          r_pay.l_co_number,
          l_div_number,
          r_os_live_debt.debt_seq,
          'N',
          l_cred_amount);

      -- reduce amount to pay out accordingly
      l_amount_to_pay_out := l_amount_to_pay_out - l_cred_amount;
      -- reduce outstanding debts accordingly
      l_os_debts := l_os_debts - r_os_live_debt.l_os_debt;

    END LOOP;
  END IF;

  IF l_schedule2_amount > 0 THEN

    -- schedule2 debts
    l_amount_to_pay_out := l_schedule2_amount;
    -- get total
    OPEN c_count_os_s2_debt;
    FETCH c_count_os_s2_debt INTO l_count_os_s2_debt;
    CLOSE c_count_os_s2_debt;
    FOR r_os_s2_debt IN c_os_s2_debt LOOP

      -- get amount to pay creditor
      IF l_count_os_s2_debt = r_os_s2_debt.ROWNUM THEN
        -- last debt
        l_cred_amount := l_amount_to_pay_out;
      ELSE
        l_cred_amount := ROUND(l_amount_to_pay_out * (r_os_s2_debt.l_s2os_debt/l_s2os_debts), 2);
      END IF;

      -- create debt dividend, including amount to pay creditor for CO.
      INSERT INTO DEBT_DIVIDENDS
        ( dd_seq,
          dd_co_number,
          dd_div_number,
          dd_ald_seq,
          created,
          dd_amount)
      VALUES  ( dd_sequence.NEXTVAL,
          r_pay.l_co_number,
          l_div_number,
          r_os_s2_debt.debt_seq,
          'N',
          l_cred_amount);

      -- reduce amount to pay out accordingly
      l_amount_to_pay_out := l_amount_to_pay_out - l_cred_amount;

      -- reduce outstanding debts accordingly
      l_s2os_debts := l_s2os_debts - r_os_s2_debt.l_s2os_debt;
    END LOOP;

  END IF;

END LOOP;

EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE BETWEEN -20999 AND -20000 THEN
      RAISE;
    ELSE
      RAISE_APPLICATION_ERROR(-20111, 'CMP_DECLARE_DIVIDENDS: '||SQLERRM);
    END IF;
END cmp_declare_dividends;

FUNCTION cmf_chk_single_live_ae
        (p_case_number  IN CASES.case_number%TYPE,
   p_party_role_code IN AE_APPLICATIONS.party_against_party_role_code%TYPE,
         p_case_party_no IN AE_APPLICATIONS.party_against_case_party_no%TYPE,
         p_ae_number IN AE_EVENTS.ae_number%TYPE) RETURN BOOLEAN IS

CURSOR c_ae_exists IS
  SELECT  ae.ae_number
  FROM  AE_APPLICATIONS ae
  WHERE ae.case_number = p_case_number
  AND ae.party_against_party_role_code = p_party_role_code
  AND ae.party_against_case_party_no = p_case_party_no
  AND ae.ae_number = p_ae_number;

CURSOR c_ae_event_exists (b_ae_number AE_APPLICATIONS.ae_number%TYPE) IS
  SELECT  'x'
  FROM  AE_EVENTS eve
  WHERE eve.ae_number = b_ae_number;
   -- Check for the existence of the following events to determine
   -- whether the application has come to an end
   -- 888: Application dismissed
   -- 889: Application withdrawn
   -- 890: Application withdrawn / Fee refunded

CURSOR c_ae_end (b_ae_number AE_APPLICATIONS.ae_number%TYPE) IS
  SELECT  MAX(eve.ae_event_seq)
  FROM  AE_APPLICATIONS ae,
    AE_EVENTS eve
  WHERE ae.ae_number = b_ae_number
  AND eve.ae_number = ae.ae_number
  AND eve.error_indicator = 'N'
  AND eve.std_event_id IN (888, 889, 890);
   -- Check for the existence of the following event to determine
   -- whether the application has subsequently been re-instated
   -- 900: Application restored

CURSOR c_ae_restore (b_event_seq AE_EVENTS.ae_event_seq%TYPE,
                     b_ae_number AE_APPLICATIONS.ae_number%TYPE) IS
  SELECT  'x'
  FROM  AE_APPLICATIONS ae,
    AE_EVENTS eve
  WHERE ae.ae_number = b_ae_number
  AND eve.ae_number = ae.ae_number
  AND eve.error_indicator = 'N'
  AND eve.std_event_id = 900
  AND eve.ae_event_seq > b_event_seq;

l_max_ae_event_seq AE_EVENTS.ae_event_seq%TYPE;
l_ae_number AE_APPLICATIONS.ae_number%TYPE;
l_exists VARCHAR2(1);

BEGIN
      -- Check for existence of ae_application
  OPEN c_ae_exists;
  FETCH c_ae_exists INTO l_ae_number;
  IF c_ae_exists%NOTFOUND THEN
    CLOSE c_ae_exists;
    RETURN FALSE; -- No AE
  ELSE
    CLOSE c_ae_exists;
    -- Check for existence of ae_events
    OPEN c_ae_event_exists(l_ae_number);
    FETCH c_ae_event_exists INTO l_exists;
    IF c_ae_event_exists%NOTFOUND THEN
      CLOSE c_ae_event_exists;
      RETURN TRUE; -- AE with no events
    ELSE
      CLOSE c_ae_event_exists;
      -- Check for existence of ae_events which indicate the end of an AE
      OPEN c_ae_end(l_ae_number);
      FETCH c_ae_end INTO l_max_ae_event_seq;
      IF l_max_ae_event_seq IS NULL THEN -- no 'end' events
        CLOSE c_ae_end;
        RETURN TRUE; -- Live AE
      ELSE
        CLOSE c_ae_end;
        -- Check for existence of ae_events which indicate the
        -- restoration of an AE
        OPEN c_ae_restore (l_max_ae_event_seq,l_ae_number);
        FETCH c_ae_restore INTO l_exists;
        IF c_ae_restore%NOTFOUND THEN
          CLOSE c_ae_restore;
          RETURN FALSE; -- AE not restored
        ELSE
          CLOSE c_ae_restore;
          RETURN TRUE; -- AE restored
        END IF;
      END IF; -- end events
    END IF; -- no events
  END IF; -- no ae
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END cmf_chk_single_live_ae;


/*
  This procedure replicates parts of the legacy AFTER INSERT ON EACH ROW trigger on AE_EVENTS.

  It only replicates functionality which can be invoked from CM_AUTH_LST.RDF
   i.e. the creation of case event 640 following creation of AE events 174, 852 or 871.
*/

/*  This procedure inserts events into the case_events table and is called by
    most of the after insert triggers on the majority of the tables.  It
    expects the following variables in the order given:-
      Case number  - Case number which the event is for.
      Standard Event id - The unique event number of the case event being inserted
      party_role_code/case_party_no -  The case party against whom the event is occurring (for an AE can only be 1 party).
      details   - Any textual information about the event, if any
      deleted flag - usually always 'N', No the event is not void
      result - result of the event if any, mainly used for variation orders.

   For SUPS, removed parameters which are always NULL.
*/

PROCEDURE insert_event_dbp (p_case_number   IN CASES.case_number%TYPE
                           ,p_std_event_id  IN CASE_EVENTS.std_event_id%TYPE
                           ,p_party_role_code   IN AE_APPLICATIONS.party_against_party_role_code%TYPE
                           ,p_case_party_no     IN AE_APPLICATIONS.party_against_case_party_no%TYPE
                           ,p_details     IN STANDARD_EVENTS.description%TYPE
                           ,p_deleted_flag  IN CASE_EVENTS.deleted_flag%TYPE
                           ,p_receipt_date  IN DATE
                           ,p1      IN VARCHAR2
                           ,p2      IN VARCHAR2
                           ,p3      IN VARCHAR2
                           ,p_case_type   IN CASES.case_type%TYPE
                           ,p_admin_court_code  IN COURTS.code%TYPE
                           ,p_user_id           IN user_information.name%TYPE
                           ,p_bms_court_code    IN COURTS.code%TYPE              -- court code and section for BMS counting
                           ,p_bms_section       IN user_information.SECTION%TYPE
                           ,p_case_event_seq    OUT CASE_EVENTS.event_seq%TYPE
)

IS

  v_bms_task_number EVENT_TASK_XREF.task_number%TYPE;
  v_stats_module  EVENT_TASK_XREF.task_number%TYPE;
  v_task_age            CASE_EVENTS.AGE_CATEGORY%TYPE;

BEGIN

-- Retrieve the task number and stats module for inserting into CASE_EVENTS

  v_bms_task_number := f_get_event_task
       (p_case_number
       ,p_case_type
       ,p_std_event_id
       ,'B'
       ,p1
       ,p2
       ,p3
       ,p_details);

  v_stats_module := f_get_event_task
       (p_case_number
       ,p_case_type
       ,p_std_event_id
       ,'S'
       ,p1
       ,p2
       ,p3
       ,p_details);

  v_task_age := f_task_age
       (NVL(p_receipt_date,TRUNC(SYSDATE))
       ,TRUNC(SYSDATE));


  SELECT event_sequence.NEXTVAL INTO p_case_event_seq FROM DUAL;

  INSERT INTO CASE_EVENTS
   (
     event_seq
    ,case_number
    ,std_event_id
    ,party_role_code
    ,case_party_no
    ,details
    ,event_date
    ,deleted_flag
    ,username
    ,receipt_date
    ,bms_task_number
    ,stats_module
    ,AGE_CATEGORY
    ,crt_code
    ,creating_court
    ,creating_section
   )
  VALUES
   (
     p_case_event_seq
     ,p_case_number
     ,p_std_event_id
     ,p_party_role_code
     ,p_case_party_no
     ,p_details
     ,TRUNC(SYSDATE)
     ,p_deleted_flag
     ,p_user_id
     ,p_receipt_date
     ,v_bms_task_number
     ,v_stats_module
     ,v_task_age
     ,p_admin_court_code
--
-- Defects 3394/3395, commented out the assignments for p_bms_court_code and p_bms_section
--
     ,null   --,p_bms_court_code
     ,null   --,p_bms_section
  );

END insert_event_dbp;


/*
  This procedure replicates parts of the legacy AFTER INSERT ON EACH ROW trigger on AE_EVENTS.

  It only replicates functionality which can be invoked from CM_AUTH_LST.RDF
   i.e. the handling of new AE events with id of 174, 852 or 871 with issue stage of NULL or 'ISS'
*/

PROCEDURE cm_ae_dbt_ai_aev
(
  p_ae_number        IN AE_APPLICATIONS.ae_number%TYPE,
  p_ae_event_seq     IN AE_EVENTS.ae_event_seq%TYPE,
  p_std_event_id     IN AE_EVENTS.std_event_id%TYPE,
  p_ae_date_entered  IN AE_EVENTS.date_entered%TYPE,
  p_ae_issue_stage   IN AE_EVENTS.issue_stage%TYPE,
  p_admin_court_code IN COURTS.code%TYPE,
  p_user_id          IN user_information.name%TYPE,
  p_bms_court_code   IN COURTS.code%TYPE,              -- court code and section for BMS counting
  p_bms_section      IN user_information.SECTION%TYPE
)
IS
   CURSOR c_ccbc IS
      SELECT
         'x'
      FROM
         CCBC_REF_CODES
      WHERE rv_low_value = TO_CHAR(p_std_event_id)
      AND rv_domain = 'AE_CASE_EVENTS';

   CURSOR c_ae IS
      SELECT
         cas.case_number,
         cas.case_type,
         ae.party_against_party_role_code,
         ae.party_against_case_party_no
      FROM
         AE_APPLICATIONS ae,
         CASES cas
      WHERE ae.ae_number = p_ae_number
      AND ae.case_number = cas.case_number;

   CURSOR c_std IS
      SELECT
         description
      FROM
         STANDARD_EVENTS
      WHERE event_id = p_std_event_id;

   -- cursors
   l_exists        VARCHAR2(1);

   l_case_number   AE_APPLICATIONS.case_number%TYPE;
   l_case_type     CASES.case_type%TYPE;
   l_party_role_code  AE_APPLICATIONS.party_against_party_role_code%TYPE;
   l_case_party_no    AE_APPLICATIONS.party_against_case_party_no%TYPE;

   l_description   STANDARD_EVENTS.description%TYPE;

   v_case_event_seq CASE_EVENTS.event_seq%TYPE;

BEGIN

   OPEN c_ae;
   FETCH c_ae INTO l_case_number,l_case_type, l_party_role_code, l_case_party_no;
   IF c_ae%FOUND THEN

      OPEN c_std;
      FETCH c_std INTO l_description;
      IF c_std%FOUND THEN

         OPEN c_ccbc;
         FETCH c_ccbc INTO l_exists;
         IF c_ccbc%FOUND THEN

            IF TRUNC(p_ae_date_entered) = TRUNC(SYSDATE) THEN

               -- Observation AE 258
               IF NVL(p_ae_issue_stage,'ISS') = 'ISS' THEN

                  v_case_event_seq := NULL;

                  insert_event_dbp
                     (l_case_number,
                      640,
                      l_party_role_code,
                      l_case_party_no,
                      l_description,
                      'N',
                      p_ae_date_entered,            -- p_receipt_date
                      TO_CHAR(p_std_event_id),    -- p1 AEA 031
                      NULL,                       -- p2
                      NULL,                       -- p3
                      l_case_type,                -- p_case_type
                      p_admin_court_code,
                      p_user_id,
                      p_bms_court_code,
                      p_bms_section,
                      v_case_event_seq);

                   -- CASEMAN defect 2022: link the case event to the ae event

                   IF v_case_event_seq IS NOT NULL THEN

                      UPDATE AE_EVENTS
                      SET    case_event_seq = v_case_event_seq
                      WHERE  ae_event_seq = p_ae_event_seq;

                   END IF;

               END IF;

            END IF;

         END IF; -- c_ccbc%FOUND
         CLOSE c_ccbc;

      END IF;
      CLOSE c_std;

   END IF;
   CLOSE c_ae;

END;




/* Note added for SUPS:

   cmp_insert_ae_event is called only from CM_AUTH_LST and in order to replicate lagacy
   functionality which was implemented by database triggers, inline code specific to
   CM_AUTH_LST has been added (i.e. only those parts of the legacy database triggers
   which would have been executed by CM_AUTH_LST have been implemented)
*/

PROCEDURE cmp_insert_ae_event
        (p_ae_number    IN AE_APPLICATIONS.ae_number%TYPE,
         p_event_date   IN AE_EVENTS.event_date%TYPE,
         p_date_entered IN AE_EVENTS.date_entered%TYPE,
         p_std_event_id IN AE_EVENTS.std_event_id%TYPE,
         p_stage        IN AE_EVENTS.issue_stage%TYPE,
         p_details      IN AE_EVENTS.details%TYPE,
         p_hrg_seq      IN AE_EVENTS.hrg_seq%TYPE,
         p_bailiff_identifier IN AE_EVENTS.bailiff_identifier%TYPE,
         p_service_status IN AE_EVENTS.service_status%TYPE,
         p_service_date   IN AE_EVENTS.service_date%TYPE,
         p_warrant_id     IN AE_EVENTS.warrant_id%TYPE,
         p_report_value_1 IN AE_EVENTS.report_value_1%TYPE,
         p_report_value_2 IN AE_EVENTS.report_value_2%TYPE,
         p_report_value_3 IN AE_EVENTS.report_value_3%TYPE,
         p_process_stage  IN AE_EVENTS.process_stage%TYPE,
         p_admin_court_code IN COURTS.code%TYPE,
         p_user_id          IN user_information.name%TYPE,
         p_bms_court_code   IN COURTS.code%TYPE,              -- court code and section for BMS counting
         p_bms_section      IN user_information.SECTION%TYPE,
         p_error          OUT VARCHAR2) IS

v_ae_event_seq   AE_EVENTS.ae_event_seq%TYPE;

BEGIN

        -- CASEMAN_Reports defect 71: get AE event sequence no so it can be updated
        -- with the associated case event sequence later on

        SELECT ae_event_seq.NEXTVAL INTO v_ae_event_seq FROM DUAL;

  INSERT INTO AE_EVENTS
           (ae_event_seq,
            ae_number,
            event_date,
            date_entered,
            std_event_id,
            issue_stage,
            details,
            hrg_seq,
            error_indicator,
            username,
            bailiff_identifier,
            service_status,
            service_date,
            warrant_id,
            report_value_1,
            report_value_2,
            report_value_3,
            process_stage)
  VALUES
           (v_ae_event_seq,
            p_ae_number,
            p_event_date,
            p_date_entered,
            p_std_event_id,
            p_stage,
            p_details,
            p_hrg_seq,
            'N',
            p_user_id,
            p_bailiff_identifier,
            p_service_status,
            p_service_date,
            p_warrant_id,
            p_report_value_1,
            p_report_value_2,
            p_report_value_3,
            p_process_stage);
  IF SQL%NOTFOUND THEN
    p_error := 'cmp_insert_ae_event insert failed'; -- row could not be inserted
        ELSE

           -- Caseman_reports defect 71: call function which replicates legacy db trigger
           -- It Keeps to the same function hierarchy as legacy to help validate SUPS functionality

           cm_ae_dbt_ai_aev (p_ae_number, v_ae_event_seq, p_std_event_id, p_date_entered,
                             p_stage, p_admin_court_code, p_user_id, p_bms_court_code, p_bms_section);

  END IF;


EXCEPTION
  WHEN OTHERS THEN
    p_error := 'cmp_insert_ae_event '||SQLERRM;
END cmp_insert_ae_event;

PROCEDURE pop_pay_sum (p_user_id IN VARCHAR2,
                       p_report_no IN VARCHAR2,
                       p_court_code IN NUMBER
                      )
IS

l_date DATE;
l_paysum_row PAYMENT_SUMMARY%ROWTYPE;
l_pscheck VARCHAR2(5);
l_report_number VARCHAR2(10);

CURSOR c1 IS
SELECT MAX(TRUNC(item_date))
FROM DCS
WHERE admin_court_code = p_court_code;

CURSOR c_psin IS
SELECT NVL(SUM(TRANSACTION),0),
       NVL(SUM(ordinary),0),
       NVL(SUM(cheque),0),
       NVL(SUM(jgmt1000),0),
       NVL(SUM(AO_CAEO),0),
       NVL(SUM(insatis),0),
       NVL(SUM(pto_order),0),
       NVL(SUM(miscellaneous),0),
       'I'
FROM DCS
 WHERE TRUNC(item_date) = l_date
 AND   inout = 'I'
 AND admin_court_code = p_court_code;

CURSOR c_psout IS
SELECT NVL(SUM(TRANSACTION),0),
       NVL(SUM(ordinary),0),
       NVL(SUM(cheque),0),
       NVL(SUM(jgmt1000),0),
       NVL(SUM(AO_CAEO),0),
       NVL(SUM(insatis),0),
       NVL(SUM(pto_order),0),
       NVL(SUM(miscellaneous),0),
       'O'
FROM DCS
 WHERE TRUNC(item_date) = l_date
 AND   inout = 'O'
 AND admin_court_code = p_court_code;


BEGIN

   /* Strip numeric part off report number  */

   l_report_number := SUBSTR(p_report_no,5);

   /* insert report no into report data                                        */
   INSERT INTO REPORT_DATA (user_id,
                            report_type,
                            report_number,
                            report_date,
          admin_court_code)
                    VALUES (p_user_iD,
                            'DSUM',
                            l_report_number,
                            SYSDATE,
          p_court_code);
   COMMIT;


/* summarise dcs and insert into payment summary                       */
/* find the latest entry in dcs                                        */
OPEN c1;
FETCH c1 INTO l_date;
CLOSE c1;
/* if there is not an entry in payment_summary which matches the entry in dcs */
/* perform the rollover of dcs into payment summary                           */
l_pscheck := f_pscheck(l_date, p_court_code);
IF l_pscheck = 'FALSE' THEN
/* summarise the IN rows in DCS - if there are none, make variables all zero  */
/* and set inout flag accordingly                                             */
   OPEN c_psin;
   FETCH c_psin INTO  l_paysum_row.transaction_total,
                      l_paysum_row.ordinary,
                      l_paysum_row.cheque,
                      l_paysum_row.jgmt1000,
                      l_paysum_row.AO_CAEO,
                      l_paysum_row.insatis,
                      l_paysum_row.pto_order,
                      l_paysum_row.miscellaneous,
                      l_paysum_row.inout;
   IF c_psin%NOTFOUND THEN
                      l_paysum_row.transaction_total := 0;
                      l_paysum_row.ordinary := 0;
                      l_paysum_row.cheque := 0;
                      l_paysum_row.jgmt1000 := 0;
                      l_paysum_row.AO_CAEO := 0;
                      l_paysum_row.insatis := 0;
                      l_paysum_row.pto_order := 0;
                      l_paysum_row.miscellaneous := 0;
                      l_paysum_row.inout := 'I';
   END IF;
   INSERT INTO PAYMENT_SUMMARY (dcs_date,
                                report_id,
                                transaction_total,
                                ordinary,
                                cheque,
                                jgmt1000,
                                AO_CAEO,
                                insatis,
                                pto_order,
                                miscellaneous,
                                valid,
                                inout,
        admin_court_code)
                        VALUES (l_date,
                                p_report_no,
                                l_paysum_row.transaction_total,
                                l_paysum_row.ordinary,
                                l_paysum_row.cheque,
                                l_paysum_row.jgmt1000,
                                l_paysum_row.AO_CAEO,
                                l_paysum_row.insatis,
                                l_paysum_row.pto_order,
                                l_paysum_row.miscellaneous,
                                'Y',
                                l_paysum_row.inout,
        p_court_code);
   CLOSE c_psin;
   OPEN c_psout;
/* summarise the OUT rows in DCS - if there are none, make variables all zero */
/* and set inout flag accordingly                                             */
   FETCH c_psout INTO l_paysum_row.transaction_total,
                      l_paysum_row.ordinary,
                      l_paysum_row.cheque,
                      l_paysum_row.jgmt1000,
                      l_paysum_row.AO_CAEO,
                      l_paysum_row.insatis,
                      l_paysum_row.pto_order,
                      l_paysum_row.miscellaneous,
                      l_paysum_row.inout;
   IF c_psout%NOTFOUND THEN
                      l_paysum_row.transaction_total := 0;
                      l_paysum_row.ordinary := 0;
                      l_paysum_row.cheque := 0;
                      l_paysum_row.jgmt1000 := 0;
                      l_paysum_row.AO_CAEO := 0;
                      l_paysum_row.insatis := 0;
                      l_paysum_row.pto_order := 0;
                      l_paysum_row.miscellaneous := 0;
                      l_paysum_row.inout := 'O';
   END IF;
   INSERT INTO PAYMENT_SUMMARY (dcs_date,
                                report_id,
                                transaction_total,
                                ordinary,
                                cheque,
                                jgmt1000,
                                AO_CAEO,
                                insatis,
                                pto_order,
                                miscellaneous,
                                valid,
                                inout,
        admin_court_code)
                        VALUES (l_date,
                                p_report_no,
                                l_paysum_row.transaction_total,
                                l_paysum_row.ordinary,
                                l_paysum_row.cheque,
                                l_paysum_row.jgmt1000,
                                l_paysum_row.AO_CAEO,
                                l_paysum_row.insatis,
                                l_paysum_row.pto_order,
                                l_paysum_row.miscellaneous,
                                'Y',
                                l_paysum_row.inout,
        p_court_code);
   CLOSE c_psout;
   COMMIT;
END IF;
END pop_pay_sum;


/* The following procedure is run from the amendment verification report
   CM_AMR in the after form trigger. After a payment record has been
   amended it populates old and new values in a table called amr_reports by reading
   the updates from the journal table SUPS_AMENDMENTS.
   The report then reads values straight from AMR_REPORTS thus simplifying the report

The following is a description of the major changes made for SUPS:

In SUPS the amendment table (SUPS_AMENDMENTS) is a true journal table and holds only data pertaining to columns
on the table being journalled (in this case the PAYMENTS table).  In legacy the amendment table (AMENDMENTS)
also held 'derived' data such as the case number to which the payment related.  In SUPS
we have to calculate derived data here.  There is a small risk that the calculation will not
give the same result as it would have, had it been done at the time the journal was taken.

In SUPS the PAYMENTS table holds a payee_id rather than the coded party code, and the payee_id will
be populated whether or not the payee is a coded party.  This function needs to look up the original and
current coded party code.

In SUPS the amendment table holds the correct column names for the columns which have been updated. In legacy
the column names on the amendment table differed from the true names.

In SUPS, date values are journalled in the format YYYY-MM-DD.

In SUPS, there is no unique sequence number on the amendment table so we can no longer (a) select the oldest
amendment record in a singleton select and (b) we cannot be 100% certain that we get the oldest when ordering
by timestamp.  The code has had to be extensively changed to deal with the possibility of multiple
updates with the same timestamp.

In SUPS, it is likely that the amendment table will not be as extensively indexed as in legacy, therefore
the function has been re-coded to simplify the queries somewhat.

*/
PROCEDURE pop_amr_reports(
  p_user_id    IN VARCHAR2,
  p_report_no  IN VARCHAR2,
  p_court_code IN NUMBER
)

IS

--
-- Date mask format used to hold dates on sups_amendments.old_value
--

SUPS_AMENDMENTS_DATE_MASK  VARCHAR2(10) := 'YYYY-MM-DD';

--
-- The following list of variables will hold data initially taken from sups_amendments.old_value
-- For fields where the corresponding column in AMR_REPORTS is also a VARCHAR2, we assume here that
--  the value in sups_amendments will fit into amr_reports.  For non-VARCHAR2's explicit conversions are
--  done.

l_old_amount               SUPS_AMENDMENTS.old_value%TYPE;
l_old_subject_no           SUPS_AMENDMENTS.old_value%TYPE;
l_old_payment_for          SUPS_AMENDMENTS.old_value%TYPE;
l_old_retention_type       SUPS_AMENDMENTS.old_value%TYPE;
l_old_payment_type         SUPS_AMENDMENTS.old_value%TYPE;
l_old_release_date         SUPS_AMENDMENTS.old_value%TYPE;
l_old_rd_date              SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_id             SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_name           SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_addr_1         SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_addr_2         SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_addr_3         SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_addr_4         SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_addr_5         SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_postcode       SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_tel_no         SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_reference      SUPS_AMENDMENTS.old_value%TYPE;
l_old_payee_rep_dx         SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_name        SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_addr1       SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_addr2       SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_addr3       SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_addr4       SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_addr5       SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_postcode    SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_reference   SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_party_role_code SUPS_AMENDMENTS.old_value%TYPE;
l_old_lodgment_case_party_no SUPS_AMENDMENTS.old_value%TYPE;
l_old_defendant_id         SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayment_amount   SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayee_name       SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayee_addr1      SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayee_addr2      SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayee_addr3      SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayee_addr4      SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayee_addr5      SUPS_AMENDMENTS.old_value%TYPE;
l_old_overpayee_postcode   SUPS_AMENDMENTS.old_value%TYPE;
l_old_date_entered         SUPS_AMENDMENTS.old_value%TYPE;
l_old_error_indicator      SUPS_AMENDMENTS.old_value%TYPE;
l_old_passthrough          SUPS_AMENDMENTS.old_value%TYPE;
l_old_enforcement_court_code SUPS_AMENDMENTS.old_value%TYPE;

-- Flags to indicate whether there has been an amendment for each column.

l_flag_amount               VARCHAR2(1);
l_flag_subject_no           VARCHAR2(1);
l_flag_payment_for          VARCHAR2(1);
l_flag_retention_type       VARCHAR2(1);
l_flag_payment_type         VARCHAR2(1);
l_flag_release_date         VARCHAR2(1);
l_flag_rd_date              VARCHAR2(1);
l_flag_payee_id             VARCHAR2(1);
l_flag_payee_name           VARCHAR2(1);
l_flag_payee_addr_1         VARCHAR2(1);
l_flag_payee_addr_2         VARCHAR2(1);
l_flag_payee_addr_3         VARCHAR2(1);
l_flag_payee_addr_4         VARCHAR2(1);
l_flag_payee_addr_5         VARCHAR2(1);
l_flag_payee_postcode       VARCHAR2(1);
l_flag_payee_tel_no         VARCHAR2(1);
l_flag_payee_reference      VARCHAR2(1);
l_flag_payee_rep_dx         VARCHAR2(1);
l_flag_lodgment_name        VARCHAR2(1);
l_flag_lodgment_addr1       VARCHAR2(1);
l_flag_lodgment_addr2       VARCHAR2(1);
l_flag_lodgment_addr3       VARCHAR2(1);
l_flag_lodgment_addr4       VARCHAR2(1);
l_flag_lodgment_addr5       VARCHAR2(1);
l_flag_lodgment_postcode    VARCHAR2(1);
l_flag_lodgment_reference   VARCHAR2(1);
l_flag_lodgment_pty_role_code VARCHAR2(1);
l_flag_lodgment_case_party_no VARCHAR2(1);
l_flag_defendant_id         VARCHAR2(1);
l_flag_overpayment_amount   VARCHAR2(1);
l_flag_overpayee_name       VARCHAR2(1);
l_flag_overpayee_addr1      VARCHAR2(1);
l_flag_overpayee_addr2      VARCHAR2(1);
l_flag_overpayee_addr3      VARCHAR2(1);
l_flag_overpayee_addr4      VARCHAR2(1);
l_flag_overpayee_addr5      VARCHAR2(1);
l_flag_overpayee_postcode   VARCHAR2(1);
l_flag_date_entered         VARCHAR2(1);
l_flag_error_indicator      VARCHAR2(1);
l_flag_passthrough          VARCHAR2(1);
l_flag_enforcement_court_code VARCHAR2(1);

-- Derived values

l_old_case_number       CASES.case_number%TYPE;
l_new_case_number       CASES.case_number%TYPE;
l_old_payee_code        CODED_PARTIES.code%TYPE;
l_new_payee_code        CODED_PARTIES.code%TYPE;

l_subject_no              PAYMENTS.subject_no%TYPE;
l_payment_for             PAYMENTS.payment_for%TYPE;
l_enforcement_court_code  PAYMENTS.enforcement_court_code%TYPE;

/*
  The cursor below retrieves all distinct transaction numbers belonging to the
  amendment session

  The following cursors have been modified to exclude the columns listed in the NOT IN list as these were NOT
  audited in legacy but are in SUPS.

  The following columns are new to SUPS but are included in the audit for now but this list can be used
  to add to the NOT IN lists...

   'AMOUNT_CURRENCY',
   'OVERPAYMENT_AMOUNT_CURRENCY',
   'COMPENSATION_AMOUNT_CURRENCY',
   'REDUCTION_AMOUNT_CURRENCY',
   'BENEFIT_AMOUNT_CURRENCY',
   'PAYEE_ID',
   'SUBJECT_NO',
   'LODGMENT_PARTY_ROLE_CODE',
   'LODGMENT_CASE_PARTY_NO',
   'ENFORCEMENT_COURT_CODE',

*/

--
-- Select all PAYMENT transactions in the current court, which have been amended by the current user
-- for the current report
--

CURSOR c1 IS
   SELECT DISTINCT
     pk01            transaction_number_char,
     TO_NUMBER(pk01) transaction_number
   FROM
     SUPS_AMENDMENTS
   WHERE
     user_id        = p_user_id AND
     court_id       = to_char(p_court_code) AND
     table_name     = 'PAYMENTS' AND
     pk02           = to_char(p_court_code) AND
     process_id     = p_report_no AND
     column_name not in ('COUNTER_PAYMENT',
                         'TRANSACTION_NUMBER',
                         'RELATED_TRANSACTION_NUMBER',
                         'CREATED_BY',
                         'VERIFICATION_REPORT_ID',
                         'BAILIFF_KNOWLEDGE',
                         'ISSUING_COURT',
                         'RECEIPT_REQUIRED',
                         'PAYOUT_DATE',
                         'PAYABLE_ORDER_NUMBER_1',
                         'PAYABLE_ORDER_NUMBER_2',
                         'PO_TOTAL',
                         'NOTES',
                         'VERIFICATION_DATE',
                         'PAYOUT_REPORT_ID',
                         'ALD_DEBT_SEQ',
                         'PO_TOTAL_CURRENCY',
                         'ADMIN_COURT_CODE',
                         'RELATED_ADMIN_COURT_CODE');

--
-- Select ALL changes for this transaction, in time order.  The code will only process the 1st one for
-- each column.
--

CURSOR c2 (p_transaction_number_char IN VARCHAR2)
IS
  SELECT
    column_name,
    old_value
  FROM
    SUPS_AMENDMENTS
  WHERE
    pk01           = p_transaction_number_char AND
    user_id        = p_user_id AND
    court_id       = to_char(p_court_code) AND
    table_name     = 'PAYMENTS' AND
    pk02           = to_char(p_court_code) AND
    process_id     = p_report_no AND
    column_name not in ('COUNTER_PAYMENT',
                        'TRANSACTION_NUMBER',
                        'RELATED_TRANSACTION_NUMBER',
                        'CREATED_BY',
                        'VERIFICATION_REPORT_ID',
                        'BAILIFF_KNOWLEDGE',
                        'ISSUING_COURT',
                        'RECEIPT_REQUIRED',
                        'PAYOUT_DATE',
                        'PAYABLE_ORDER_NUMBER_1',
                        'PAYABLE_ORDER_NUMBER_2',
                        'PO_TOTAL',
                        'NOTES',
                        'VERIFICATION_DATE',
                        'PAYOUT_REPORT_ID',
                        'ALD_DEBT_SEQ',
                        'PO_TOTAL_CURRENCY',
                        'ADMIN_COURT_CODE',
                        'RELATED_ADMIN_COURT_CODE')
  ORDER BY
    time_stamp;


--
-- The cursor below retrieves the current values from the payments table for
-- a transaction number. These values will be used in the insert into
-- amr_reports table if the value has not changed.
--

CURSOR c3 (p_transaction_number IN NUMBER) IS

  SELECT * FROM PAYMENTS
    WHERE transaction_number = p_transaction_number
    AND   admin_court_code   = p_court_code;


  v_c3_records  c3%ROWTYPE;

--
-- Look up coded party code
--

CURSOR c_get_party_code (p_party_id IN PAYMENTS.payee_id%TYPE) IS
  SELECT code FROM CODED_PARTIES WHERE party_id = p_party_id;


BEGIN


--
-- Delete values created by user in previous report  */
--

  DELETE
     AMR_REPORTS
  WHERE
     user_id = p_user_id AND
     admin_court_code = p_court_code;   -- SUPS Schema CR 86

  COMMIT;

  FOR c1rec IN c1 LOOP

    --
    -- Reset flag variables for the next transaction number
    -- No need to reset l_old_..., as we won't be looking at l_old_... unless the flag is set
    --

    l_flag_amount                := 'N';
    l_flag_subject_no            := 'N';
    l_flag_payment_for           := 'N';
    l_flag_retention_type        := 'N';
    l_flag_payment_type          := 'N';
    l_flag_release_date          := 'N';
    l_flag_rd_date               := 'N';
    l_flag_payee_id              := 'N';
    l_flag_payee_name            := 'N';
    l_flag_payee_addr_1          := 'N';
    l_flag_payee_addr_2          := 'N';
    l_flag_payee_addr_3          := 'N';
    l_flag_payee_addr_4          := 'N';
    l_flag_payee_addr_5          := 'N';
    l_flag_payee_postcode        := 'N';
    l_flag_payee_tel_no          := 'N';
    l_flag_payee_reference       := 'N';
    l_flag_payee_rep_dx          := 'N';
    l_flag_lodgment_name         := 'N';
    l_flag_lodgment_addr1        := 'N';
    l_flag_lodgment_addr2        := 'N';
    l_flag_lodgment_addr3        := 'N';
    l_flag_lodgment_addr4        := 'N';
    l_flag_lodgment_addr5        := 'N';
    l_flag_lodgment_postcode     := 'N';
    l_flag_lodgment_reference    := 'N';
    l_flag_lodgment_pty_role_code := 'N';
    l_flag_lodgment_case_party_no := 'N';
    l_flag_defendant_id          := 'N';
    l_flag_overpayment_amount    := 'N';
    l_flag_overpayee_name        := 'N';
    l_flag_overpayee_addr1       := 'N';
    l_flag_overpayee_addr2       := 'N';
    l_flag_overpayee_addr3       := 'N';
    l_flag_overpayee_addr4       := 'N';
    l_flag_overpayee_addr5       := 'N';
    l_flag_overpayee_postcode    := 'N';
    l_flag_date_entered          := 'N';
    l_flag_error_indicator       := 'N';
    l_flag_passthrough           := 'N';
    l_flag_enforcement_court_code  := 'N';


    --
    -- If we have an amendment on a column in which we are interested, and it is the first amendment
    -- then record the 'old' value
    --

    FOR c2rec IN c2 (c1rec.transaction_number_char) LOOP

      -- This must only process the first occurrence of an amendment to each column
      -- Note that we cannot rely on the fact that l_xxx is NULL meaning that we haven't seen this column
      -- before because it may have been NULLED by the amendment

      IF c2rec.column_name     = 'AMOUNT' AND l_flag_amount = 'N' THEN
         l_old_amount := c2rec.old_value;
         l_flag_amount := 'Y';

      ELSIF c2rec.column_name = 'SUBJECT_NO' AND l_flag_subject_no = 'N' THEN
         l_old_subject_no := c2rec.old_value;
         l_flag_subject_no := 'Y';

      ELSIF c2rec.column_name = 'PAYMENT_FOR' AND l_flag_payment_for = 'N' THEN
         l_old_payment_for := c2rec.old_value;
         l_flag_payment_for := 'Y';

      ELSIF c2rec.column_name     = 'RETENTION_TYPE' AND l_flag_retention_type = 'N' THEN
         l_old_retention_type := c2rec.old_value;
         l_flag_retention_type := 'Y';

      ELSIF c2rec.column_name     = 'PAYMENT_TYPE' AND l_flag_payment_type = 'N' THEN
         l_old_payment_type := c2rec.old_value;
         l_flag_payment_type := 'Y';

      ELSIF c2rec.column_name     = 'RELEASE_DATE' AND l_flag_release_date = 'N' THEN
         l_old_release_date := c2rec.old_value;
         l_flag_release_date := 'Y';

      ELSIF c2rec.column_name     = 'RD_DATE' AND l_flag_rd_date = 'N' THEN
         l_old_rd_date := c2rec.old_value;
         l_flag_rd_date := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_ID' AND l_flag_payee_id = 'N'  THEN
         l_old_payee_id  := c2rec.old_value;   -- SUPS: will need to look up the code later.
         l_flag_payee_id := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_NAME' AND l_flag_payee_name = 'N' THEN
         l_old_payee_name   := c2rec.old_value;
         l_flag_payee_name := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_ADDR_1' AND l_flag_payee_addr_1 = 'N' THEN
         l_old_payee_addr_1  := c2rec.old_value;
         l_flag_payee_addr_1 := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_ADDR_2' AND l_flag_payee_addr_2 = 'N' THEN
         l_old_payee_addr_2  := c2rec.old_value;
         l_flag_payee_addr_2 := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_ADDR_3' AND l_flag_payee_addr_3 = 'N' THEN
         l_old_payee_addr_3  := c2rec.old_value;
         l_flag_payee_addr_3 := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_ADDR_4' AND l_flag_payee_addr_4 = 'N' THEN
         l_old_payee_addr_4  := c2rec.old_value;
         l_flag_payee_addr_4 := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_ADDR_5' AND l_flag_payee_addr_5 = 'N' THEN
         l_old_payee_addr_5  := c2rec.old_value;
         l_flag_payee_addr_5 := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_POSTCODE' AND l_flag_payee_postcode = 'N' THEN
         l_old_payee_postcode := c2rec.old_value;
         l_flag_payee_postcode := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_TEL_NO' AND l_flag_payee_tel_no = 'N' THEN
         l_old_payee_tel_no := c2rec.old_value;
         l_flag_payee_tel_no := 'Y';

      ELSIF c2rec.column_name    = 'PAYEE_REP_DX' AND l_flag_payee_rep_dx = 'N' THEN
         l_old_payee_rep_dx := c2rec.old_value;
         l_flag_payee_rep_dx := 'Y';

      ELSIF c2rec.column_name     = 'PAYEE_REFERENCE' AND l_flag_payee_reference = 'N' THEN
         l_old_payee_reference := c2rec.old_value;
         l_flag_payee_reference := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_NAME' AND l_flag_lodgment_name = 'N' THEN
         l_old_lodgment_name := c2rec.old_value ;
         l_flag_lodgment_name := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_ADDR1' AND l_flag_lodgment_addr1 = 'N' THEN
         l_old_lodgment_addr1 := c2rec.old_value ;
         l_flag_lodgment_addr1 := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_ADDR2' AND l_flag_lodgment_addr2 = 'N' THEN
         l_old_lodgment_addr2 := c2rec.old_value ;
         l_flag_lodgment_addr2 := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_ADDR3' AND l_flag_lodgment_addr3 = 'N' THEN
         l_old_lodgment_addr3 := c2rec.old_value ;
         l_flag_lodgment_addr3 := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_ADDR4' AND l_flag_lodgment_addr4 = 'N' THEN
         l_old_lodgment_addr4 := c2rec.old_value ;
         l_flag_lodgment_addr4 := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_ADDR5' AND l_flag_lodgment_addr5 = 'N' THEN
         l_old_lodgment_addr5 := c2rec.old_value ;
         l_flag_lodgment_addr5 := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_POSTCODE' AND l_flag_lodgment_postcode = 'N' THEN
         l_old_lodgment_postcode := c2rec.old_value ;
         l_flag_lodgment_postcode := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_REFERENCE' AND l_flag_lodgment_reference = 'N' THEN
         l_old_lodgment_reference := c2rec.old_value ;
         l_flag_lodgment_reference := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_PARTY_ROLE_CODE' AND l_flag_lodgment_pty_role_code = 'N' THEN
         l_old_lodgment_party_role_code := c2rec.old_value ;
         l_flag_lodgment_pty_role_code := 'Y';

      ELSIF c2rec.column_name     = 'LODGMENT_CASE_PARTY_NO' AND l_flag_lodgment_case_party_no = 'N' THEN
         l_old_lodgment_case_party_no := c2rec.old_value ;
         l_flag_lodgment_case_party_no := 'Y';

      ELSIF c2rec.column_name     = 'DEFENDANT_ID' AND l_flag_defendant_id = 'N' THEN
         l_old_defendant_id := c2rec.old_value;
         l_flag_defendant_id := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYMENT_AMOUNT' AND l_flag_overpayment_amount = 'N' THEN
         l_old_overpayment_amount := c2rec.old_value;
         l_flag_overpayment_amount := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYEE_NAME' AND l_flag_overpayee_name = 'N' THEN
         l_old_overpayee_name   := c2rec.old_value;
         l_flag_overpayee_name := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYEE_ADDR1' AND l_flag_overpayee_addr1 = 'N' THEN
         l_old_overpayee_addr1  := c2rec.old_value;
         l_flag_overpayee_addr1 := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYEE_ADDR2' AND l_flag_overpayee_addr2 = 'N' THEN
         l_old_overpayee_addr2  := c2rec.old_value;
         l_flag_overpayee_addr2 := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYEE_ADDR3' AND l_flag_overpayee_addr3 = 'N' THEN
         l_old_overpayee_addr3  := c2rec.old_value;
         l_flag_overpayee_addr3 := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYEE_ADDR4' AND l_flag_overpayee_addr4 = 'N' THEN
         l_old_overpayee_addr4  := c2rec.old_value;
         l_flag_overpayee_addr4 := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYEE_ADDR5' AND l_flag_overpayee_addr5 = 'N' THEN
         l_old_overpayee_addr5  := c2rec.old_value;
         l_flag_overpayee_addr5 := 'Y';

      ELSIF c2rec.column_name     = 'OVERPAYEE_POSTCODE' AND l_flag_overpayee_postcode = 'N' THEN
         l_old_overpayee_postcode  := c2rec.old_value;
         l_flag_overpayee_postcode := 'Y';

      ELSIF c2rec.column_name     = 'DATE_ENTERED' AND l_flag_date_entered = 'N' THEN
         l_old_date_entered := c2rec.old_value;
         l_flag_date_entered := 'Y';

      ELSIF c2rec.column_name     = 'ERROR_INDICATOR' AND l_flag_error_indicator = 'N' THEN
         l_old_error_indicator := c2rec.old_value;
         l_flag_error_indicator := 'Y';

      ELSIF c2rec.column_name     = 'PASSTHROUGH' AND l_flag_passthrough = 'N' THEN
         l_old_passthrough := c2rec.old_value;
         l_flag_passthrough := 'Y';

      ELSIF c2rec.column_name     = 'ENFORCEMENT_COURT_CODE' AND l_flag_enforcement_court_code = 'N' THEN
         l_old_enforcement_court_code := c2rec.old_value;
         l_flag_enforcement_court_code := 'Y';

      END IF;


   END LOOP; /* close c2 */

   --
   -- Get the current values for the payment
   --

   OPEN c3(c1rec.transaction_number);

   FETCH c3 INTO v_c3_records;

   --
   -- Obtain new case number for new record
   --

   l_new_case_number :=
     f_get_case_number (p_court_code, v_c3_records.enforcement_court_code, v_c3_records.subject_no, v_c3_records.payment_for);


   -- Calculate 'old' case number based on the original or new values of subject_no, payment_for and enforcement court

   IF l_flag_enforcement_court_code = 'N' THEN
      l_enforcement_court_code := v_c3_records.enforcement_court_code;
   ELSE
      l_enforcement_court_code := TO_NUMBER(l_old_enforcement_court_code);
   END IF;

   IF l_flag_subject_no = 'N' THEN
      l_subject_no := v_c3_records.subject_no;
   ELSE
      l_subject_no := l_old_subject_no;
   END IF;

   IF l_flag_payment_for = 'N' THEN
      l_payment_for := v_c3_records.payment_for;
   ELSE
      l_payment_for := l_old_payment_for;
   END IF;


   l_old_case_number :=
     f_get_case_number (p_court_code, l_enforcement_court_code, l_subject_no, l_payment_for);

   -- Get current coded party code for payee

   l_new_payee_code := NULL;
   IF v_c3_records.payee_id IS NOT NULL THEN

     OPEN c_get_party_code (v_c3_records.payee_id);
     FETCH c_get_party_code INTO l_new_payee_code;
     CLOSE c_get_party_code;

   END IF;

   -- Get original coded party code

   IF l_flag_payee_id = 'N' THEN
      l_old_payee_code := l_new_payee_code;
   ELSE
      -- There has been an amendment to the payee id (and hence the code)

      l_old_payee_code := NULL;
      IF l_old_payee_id IS NOT NULL THEN

        OPEN c_get_party_code (TO_NUMBER(l_old_payee_id));
        FETCH c_get_party_code INTO l_old_payee_code;
        CLOSE c_get_party_code;

      END IF;

   END IF;


   INSERT INTO AMR_REPORTS
   (
      admin_court_code,   -- Schema CR 86

      user_id,
      task_id,
      transaction_number,

      OLD_AMOUNT                     ,
      OLD_SUBJECT_NO                 ,
      OLD_PAYMENT_FOR                ,

      OLD_CASE_NUMBER                ,

      OLD_RETENTION_TYPE             ,
      OLD_PAYMENT_TYPE               ,

      OLD_RD_DATE                    ,
      OLD_RELEASE_DATE               ,

      OLD_PAYEE_CODE                 ,

      OLD_PAYEE_NAME                 ,
      OLD_PAYEE_ADDR_1               ,
      OLD_PAYEE_ADDR_2               ,
      OLD_PAYEE_ADDR_3               ,
      OLD_PAYEE_ADDR_4               ,
      OLD_PAYEE_ADDR_5               ,
      OLD_PAYEE_POSTCODE             ,
      OLD_PAYEE_TEL_NO               ,
      OLD_PAYEE_REFERENCE            ,
      OLD_PAYEE_REP_DX               ,

      OLD_LODGMENT_NAME              ,
      OLD_LODGMENT_ADDR1             ,
      OLD_LODGMENT_ADDR2             ,
      OLD_LODGMENT_ADDR3             ,
      OLD_LODGMENT_ADDR4             ,
      OLD_LODGMENT_ADDR5             ,
      OLD_LODGMENT_POSTCODE          ,
      OLD_LODGMENT_REFERENCE         ,
      OLD_LODGMENT_PARTY_ROLE_CODE   ,
      OLD_LODGMENT_CASE_PARTY_NO     ,

      OLD_DEFENDANT_ID               ,

      OLD_OVERPAYMENT_AMOUNT         ,

      OLD_OVERPAYEE_NAME             ,
      OLD_OVERPAYEE_ADDR1            ,
      OLD_OVERPAYEE_ADDR2            ,
      OLD_OVERPAYEE_ADDR3            ,
      OLD_OVERPAYEE_ADDR4            ,
      OLD_OVERPAYEE_ADDR5            ,
      OLD_OVERPAYEE_POSTCODE         ,

      OLD_DATE_ENTERED               ,
      OLD_ERROR_INDICATOR            ,
      OLD_PASSTHROUGH                ,
      OLD_ENFORCEMENT_COURT_CODE     ,

      NEW_AMOUNT                             ,
      NEW_SUBJECT_NO                         ,
      NEW_PAYMENT_FOR                        ,

      NEW_CASE_NUMBER                        ,

      NEW_RETENTION_TYPE                     ,
      NEW_PAYMENT_TYPE                       ,

      NEW_RD_DATE                            ,
      NEW_RELEASE_DATE                       ,

      NEW_PAYEE_CODE                         ,

      NEW_PAYEE_NAME                         ,
      NEW_PAYEE_ADDR_1                       ,
      NEW_PAYEE_ADDR_2                       ,
      NEW_PAYEE_ADDR_3                       ,
      NEW_PAYEE_ADDR_4                       ,
      NEW_PAYEE_ADDR_5                       ,
      NEW_PAYEE_POSTCODE                     ,
      NEW_PAYEE_TEL_NO                       ,
      NEW_PAYEE_REFERENCE                    ,
      NEW_PAYEE_REP_DX                       ,

      NEW_LODGMENT_NAME                      ,
      NEW_LODGMENT_ADDR1                     ,
      NEW_LODGMENT_ADDR2                     ,
      NEW_LODGMENT_ADDR3                     ,
      NEW_LODGMENT_ADDR4                     ,
      NEW_LODGMENT_ADDR5                     ,
      NEW_LODGMENT_POSTCODE                  ,
      NEW_LODGMENT_REFERENCE                 ,
    NEW_LODGMENT_PARTY_ROLE_CODE           ,
      NEW_LODGMENT_CASE_PARTY_NO             ,

      NEW_DEFENDANT_ID                       ,

      NEW_OVERPAYMENT_AMOUNT                 ,

      NEW_OVERPAYEE_NAME                     ,
      NEW_OVERPAYEE_ADDR1                    ,
      NEW_OVERPAYEE_ADDR2                    ,
      NEW_OVERPAYEE_ADDR3                    ,
      NEW_OVERPAYEE_ADDR4                    ,
      NEW_OVERPAYEE_ADDR5                    ,
      NEW_OVERPAYEE_POSTCODE                 ,

      NEW_DATE_ENTERED                       ,
      NEW_ERROR_INDICATOR                    ,
      NEW_PASSTHROUGH                        ,
      NEW_ENFORCEMENT_COURT_CODE

   )
   VALUES
   (

     p_court_code,  -- Schema CR 86

     p_USER_ID,
     p_report_no,
     c1rec.transaction_number,

     DECODE(l_flag_amount,'N',v_c3_records.amount,TO_NUMBER(l_old_amount)),
     DECODE(l_flag_subject_no,'N',v_c3_records.subject_no,l_old_subject_no),
     DECODE(l_flag_payment_for,'N',v_c3_records.payment_for,l_old_payment_for),

     l_old_case_number,

     DECODE(l_flag_retention_type,'N',v_c3_records.retention_type,l_old_retention_type),
     DECODE(l_flag_payment_type,'N',v_c3_records.payment_type,l_old_payment_type),

     DECODE(l_flag_rd_date,'N',v_c3_records.rd_date,TO_DATE(l_old_rd_date,SUPS_AMENDMENTS_DATE_MASK)),
     DECODE(l_flag_release_date,'N',v_c3_records.release_date,TO_DATE(l_old_release_date,SUPS_AMENDMENTS_DATE_MASK)),

     l_old_payee_code,

     DECODE(l_flag_payee_name,'N',v_c3_records.payee_name,l_old_payee_name),
     DECODE(l_flag_payee_addr_1,'N',v_c3_records.payee_addr_1,l_old_payee_addr_1),
     DECODE(l_flag_payee_addr_2,'N',v_c3_records.payee_addr_2,l_old_payee_addr_2),
     DECODE(l_flag_payee_addr_3,'N',v_c3_records.payee_addr_3,l_old_payee_addr_3),
     DECODE(l_flag_payee_addr_4,'N',v_c3_records.payee_addr_4,l_old_payee_addr_4),
     DECODE(l_flag_payee_addr_5,'N',v_c3_records.payee_addr_5,l_old_payee_addr_5),
     DECODE(l_flag_payee_postcode,'N',v_c3_records.payee_postcode,l_old_payee_postcode),
     DECODE(l_flag_payee_tel_no,'N',v_c3_records.payee_tel_no,l_old_payee_tel_no),
     DECODE(l_flag_payee_reference,'N',v_c3_records.payee_reference,l_old_payee_reference),
     DECODE(l_flag_payee_rep_dx,'N',v_c3_records.payee_rep_dx,l_old_payee_rep_dx),

     DECODE(l_flag_lodgment_name,'N',v_c3_records.lodgment_name,l_old_lodgment_name),
     DECODE(l_flag_lodgment_addr1,'N',v_c3_records.lodgment_addr1,l_old_lodgment_addr1),
     DECODE(l_flag_lodgment_addr2,'N',v_c3_records.lodgment_addr2,l_old_lodgment_addr2),
     DECODE(l_flag_lodgment_addr3,'N',v_c3_records.lodgment_addr3,l_old_lodgment_addr3),
     DECODE(l_flag_lodgment_addr4,'N',v_c3_records.lodgment_addr4,l_old_lodgment_addr4),
     DECODE(l_flag_lodgment_addr5,'N',v_c3_records.lodgment_addr5,l_old_lodgment_addr5),
     DECODE(l_flag_lodgment_postcode,'N',v_c3_records.lodgment_postcode,l_old_lodgment_postcode),
     DECODE(l_flag_lodgment_reference,'N',v_c3_records.lodgment_reference,l_old_lodgment_reference),
     DECODE(l_flag_lodgment_pty_role_code,'N',v_c3_records.lodgment_party_role_code,l_old_lodgment_party_role_code),
     DECODE(l_flag_lodgment_case_party_no,'N',v_c3_records.lodgment_case_party_no,l_old_lodgment_case_party_no),

     DECODE(l_flag_defendant_id, 'N',v_c3_records.defendant_id,TO_NUMBER(l_old_defendant_id)),

     DECODE(l_flag_overpayment_amount,'N',v_c3_records.overpayment_amount,TO_NUMBER(l_old_overpayment_amount)),

     DECODE(l_flag_overpayee_name,'N',v_c3_records.overpayee_name,l_old_overpayee_name),
     DECODE(l_flag_overpayee_addr1,'N',v_c3_records.overpayee_addr1,l_old_overpayee_addr1),
     DECODE(l_flag_overpayee_addr2,'N',v_c3_records.overpayee_addr2,l_old_overpayee_addr2),
     DECODE(l_flag_overpayee_addr3,'N',v_c3_records.overpayee_addr3,l_old_overpayee_addr3),
     DECODE(l_flag_overpayee_addr4,'N',v_c3_records.overpayee_addr4,l_old_overpayee_addr4),
     DECODE(l_flag_overpayee_addr5,'N',v_c3_records.overpayee_addr5,l_old_overpayee_addr5),
     DECODE(l_flag_overpayee_postcode,'N',v_c3_records.overpayee_postcode,l_old_overpayee_postcode),

     DECODE(l_flag_date_entered,'N',v_c3_records.date_entered,TO_DATE(l_old_date_entered,SUPS_AMENDMENTS_DATE_MASK)),
     DECODE(l_flag_error_indicator,'N',v_c3_records.error_indicator,l_old_error_indicator),
     DECODE(l_flag_passthrough,'N',v_c3_records.passthrough,l_old_passthrough),

     DECODE(l_flag_enforcement_court_code,'N',v_c3_records.enforcement_court_code,TO_NUMBER(l_old_enforcement_court_code)),

     v_c3_records.amount,
     v_c3_records.subject_no,
     v_c3_records.payment_for,

     l_new_case_number,

     v_c3_records.retention_type,
     v_c3_records.payment_type,

     v_c3_records.rd_date,
     v_c3_records.release_date,

     l_new_payee_code,

     v_c3_records.payee_name,
     v_c3_records.payee_addr_1,
     v_c3_records.payee_addr_2,
     v_c3_records.payee_addr_3,
     v_c3_records.payee_addr_4,
     v_c3_records.payee_addr_5,
     v_c3_records.payee_postcode,
     v_c3_records.payee_tel_no,
     v_c3_records.payee_reference,
     v_c3_records.payee_rep_dx,

     v_c3_records.lodgment_name,
     v_c3_records.lodgment_addr1,
     v_c3_records.lodgment_addr2,
     v_c3_records.lodgment_addr3,
     v_c3_records.lodgment_addr4,
     v_c3_records.lodgment_addr5,
     v_c3_records.lodgment_postcode,
     v_c3_records.lodgment_reference,
     v_c3_records.lodgment_party_role_code,
     v_c3_records.lodgment_case_party_no,

     v_c3_records.defendant_id,

     v_c3_records.overpayment_amount,

     v_c3_records.overpayee_name,
     v_c3_records.overpayee_addr1,
     v_c3_records.overpayee_addr2,
     v_c3_records.overpayee_addr3,
     v_c3_records.overpayee_addr4,
     v_c3_records.overpayee_addr5,
     v_c3_records.overpayee_postcode,

     v_c3_records.date_entered,
     v_c3_records.error_indicator,
     v_c3_records.passthrough,
     v_c3_records.enforcement_court_code
  );


  CLOSE c3;


END LOOP;  -- close C1

COMMIT;

END pop_amr_reports;


FUNCTION f_pscheck(p_ps_date IN DATE, p_court_code NUMBER) RETURN VARCHAR2 IS

  CURSOR c1 IS
    SELECT MAX(TRUNC(item_date))
    FROM DCS
    WHERE admin_court_code = p_court_code;

  CURSOR c_ps (p_date IN DATE) IS
    SELECT 1
  FROM PAYMENT_SUMMARY
    WHERE TRUNC(dcs_date) = TRUNC(p_date)
  AND   admin_court_code = p_court_code
    AND   valid = 'Y';

  l_return NUMBER(1);
  l_date DATE;
  l_ps_date DATE;

BEGIN
  l_ps_date := p_ps_date;
  IF l_ps_date IS NULL THEN
    OPEN c1;
    FETCH c1 INTO l_date;
    CLOSE c1;

    /* cursor c1 will return null only if DCS is empty.
       DCS table is truncated by the End of Month process.
       If it is empty it is save to assume that the End Of Day was completed
       for the previous working day
    */

    IF l_date IS NULL THEN
      RETURN 'TRUE';
    END IF;

    l_ps_date := l_date;

  END IF;

  OPEN c_ps(l_ps_date);
  FETCH c_ps INTO l_return;
  IF c_ps%FOUND THEN
    CLOSE c_ps;
    RETURN 'TRUE';
  ELSE
    CLOSE c_ps;
    RETURN 'FALSE';
  END IF;

END f_pscheck;

PROCEDURE p_del_dsum_repno (p_court_code IN NUMBER, p_user_id IN REPORT_DATA.user_id%TYPE) IS
BEGIN
  DELETE FROM REPORT_DATA
  WHERE  report_type = 'DSUM'
  AND    user_id     = p_user_id
  AND  admin_court_code = p_court_code;
COMMIT;
END p_del_dsum_repno;


FUNCTION f_get_party_name (p_case_number IN VARCHAR2, p_reporting_party_role_code IN VARCHAR2, p_case_party_no IN NUMBER DEFAULT 1) RETURN VARCHAR2 IS

l_party_name  case_parties.name%TYPE;

CURSOR c_party_name IS
SELECT  DISTINCT name
FROM  case_parties
WHERE case_number = p_case_number
AND reporting_party_role_code = p_reporting_party_role_code
AND case_party_no = p_case_party_no;

BEGIN
  OPEN c_party_name;
  FETCH c_party_name INTO l_party_name;
  CLOSE c_party_name;
  RETURN l_party_name;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN SQLCODE;

END f_get_party_name;

FUNCTION f_reporting_party_n_name
        (p_case_number IN CASES.CASE_NUMBER%TYPE,
     p_reporting_role_code IN PARTY_ROLES.REPORTING_ROLE_CODE%TYPE,
     p_number IN NUMBER) RETURN VARCHAR2 IS

     l_party_ctr NUMBER :=0;
   l_party_name PARTIES.PERSON_REQUESTED_NAME%TYPE :=NULL;

   CURSOR c_get_party_name IS
      SELECT PAR.PERSON_REQUESTED_NAME
    FROM CASE_PARTY_ROLES cpr,
         PARTIES par,
       PARTY_ROLES pr
    WHERE pr.reporting_role_code=p_reporting_role_code
    AND   pr.party_role_code = cpr.party_role_code
    AND   cpr.case_number = p_case_number
    AND   cpr.party_id = par.party_id
    ORDER BY DECODE(cpr.party_role_code,
                      'DEFENDANT','1A','DEBTOR','1B',
            'CLAIMANT','2A','CREDITOR','2B',
            'SOLICITOR','3A',
            cpr.party_role_code),
          cpr.case_party_no;
   BEGIN
      OPEN c_get_party_name;
      FOR l_party_ctr IN 1..p_number
    LOOP
       l_party_name :=NULL;
     FETCH c_get_party_name
     INTO l_party_name;
       EXIT WHEN c_get_party_name%NOTFOUND;
    END LOOP;
      CLOSE c_get_party_name;
    RETURN l_party_name;
   END f_reporting_party_n_name;

   FUNCTION f_party_role_short_code (p_party_role_code IN case_PARTIES.party_role_code%TYPE,
                                  p_case_party_no IN case_PARTIES.case_party_no%TYPE) RETURN VARCHAR IS
   BEGIN
      IF p_party_role_code IN  ('DEFENDANT','DEBTOR') THEN
         RETURN 'D'||p_case_party_no;
      ELSIF p_party_role_code IN ('CLAIMANT','CREDITOR') THEN
         RETURN 'C'||p_case_party_no;
      ELSE
       RETURN 'OP'||p_case_party_no;
      END IF;
   END f_party_role_short_code;

FUNCTION f_payee_party (p_ald_seq  number) RETURN NUMBER IS
  CURSOR c_check_payee_cp IS
   SELECT cp_payee_id
   FROM allowed_debts
   WHERE debt_seq = p_ald_seq
   and cp_payee_id is not null;

   CURSOR c_check_payee_ncp IS
    SELECT party_id
	FROM parties_no_cpr
	WHERE ald_seq = p_ald_seq
	AND address_type_code = 'CO PAYEE'
        and name is not null;

  CURSOR c_check_creditor_cp IS
   SELECT cp_creditor_id
   FROM allowed_debts
   WHERE debt_seq = p_ald_seq
   and cp_creditor_id is not null;


   CURSOR c_check_creditor_ncp IS
    SELECT party_id
	FROM parties_no_cpr
	WHERE ald_seq = p_ald_seq
	AND address_type_code = 'CO CRED'
        and name is not null;

        l_party_id parties.party_id%TYPE;

	BEGIN

	OPEN c_check_payee_cp;
	FETCH c_check_payee_cp
	INTO l_party_id;
	IF c_check_payee_cp%NOTFOUND THEN
   	   OPEN c_check_payee_ncp;
	   FETCH c_check_payee_ncp
	   INTO l_party_id;
	   IF c_check_payee_ncp%NOTFOUND THEN
              open c_check_creditor_cp;
              fetch c_check_creditor_cp
              into l_party_id;
              IF c_check_creditor_cp%NOTFOUND THEN
                 open c_check_creditor_ncp;
                 fetch c_check_creditor_ncp
                 into l_party_id;
                 IF c_check_creditor_ncp%NOTFOUND THEN
                    l_party_id := null;
                 END IF;
                 CLOSE c_check_creditor_ncp;
              END IF;
              close c_check_creditor_cp;
           END IF;
	   CLOSE c_check_payee_ncp;
	END IF;
	CLOSE c_check_payee_cp;

	RETURN l_party_id;

END f_payee_party;

FUNCTION f_payee_exists (p_ald_seq in number) RETURN VARCHAR2 IS
  CURSOR c_check_cp IS
   SELECT 'Y'
   FROM allowed_debts
   WHERE debt_seq = p_ald_seq
   and cp_payee_id is not null;

   CURSOR c_check_payee IS
    SELECT 'Y'
	FROM parties_no_cpr
	WHERE ald_seq = p_ald_seq
	AND address_type_code = 'CO PAYEE'
        and name is not null;

	l_dummy VARCHAR2(1);
	l_payee_exists VARCHAR2(1) :='N';

	BEGIN

	OPEN c_check_cp;
	FETCH c_check_cp
	INTO l_dummy;
	IF c_check_cp%FOUND THEN
	   l_payee_exists := 'Y';
        ELSE
   	   OPEN c_check_payee;
	   FETCH c_check_payee
	   INTO l_dummy;
	   IF c_check_payee%FOUND THEN
	      l_payee_exists :='Y';
	   END IF;
	   CLOSE c_check_payee;

	END IF;
	CLOSE c_check_cp;

	RETURN l_payee_exists;
END f_payee_exists;


END sups_Reports_Pack;

/

SHOW ERRORS;
