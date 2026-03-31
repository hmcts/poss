/********************************************************************************************/
/* Module     : sups_ae_order_transfer_pack.pck                                             */
/* Description: Inserts rows into CMCS_CAPS_ORDERS                                          */
/*              Based on legacy's ae_order_transfer_pack.sql                                */
/* Author     : Chris Hutt                                                                  */
/* Date       : 3 June 2007                                                                 */
/*----------------------------------------------------------------------------------------- */
/* Version Control                                                                          */
/* ---------------                                                                          */
/* Version	Date		Name	              Amendment		                    */
/*----------------------------------------------------------------------------------------- */
/*                                                                                          */
/* 1.0      11/03/1998  Anthony Keith	      Original Version                              */
/* 1.1      30/04/1998  Anthony Keith         As per review 02AEQ01172                      */
/* 1.2      11/05/1998  Anthony Keith         Added RESTRICTED REFERENCES PRAGMA to         */
/*                                            f_calculate_outstanding_bal function          */
/* 1.3      13/05/1998  Anthony Keith         Added DEBUGGING facility, now if procedure    */
/*                                            p_transfer_ae_orders_out called with 'Y'      */
/*                                            parameter will echo contents of CAPS_ORDERS   */
/*                                            table, if an insert failure occurs            */
/* 1.4      15/05/1998  Anthony Keith         Receiving court now set to 0 (constant)       */
/* 1.5      26/06/1998  John Spencer          Synonym creation removed 			    */
/* 1.6      01/07/1998  Anthony Keith         OBS: AE 724 Design change                     */
/*                                            Modified selection criteria for c_ae_events   */
/*                                            cursor in p_transfer_ae_orders_out from       */
/*                                            AND NVL(ae.process_stage,'AUTO') = 'AUTO';    */
/*                                            to AND NVL(ae.process_stage,'AUTO') != 'TRAN';*/
/*                                            as a new process_stage called REP was causing */
/*                                            events to be missed.                          */
/* 1.7      01/07/1998  Anthony Keith         OBS: AE 724, missed a semi-colon, oops        */
/* 1.8      03/07/1998  Anthony Keith         OBS: AEA 026, if                              */
/*                                            protected_earnings_period = 'MTH' and         */ 
/*                                            normal_deduction_period = 'MTH'               */
/*                                            in ae_applications, then                      */
/*                                            caps_orders.paid_monthly_flag = 'Y', ELSE     */
/*                                            should equal v_report_value_1                 */
/* 1.9      04/07/1998  Anthony Keith         Moved function f_calculate_outstanding_bal,   */
/*                                            now resides in CM_AE_PACKAGE.SQL              */
/* 1.10     12/02/2001  Shehmina Giulianelli  SCR 654 - check to see if record already      */
/*                                            exists in CAPS_ORDERS (New procedure p_check_ */
/*                                            record_exists)overwrite else create new.      */
/*                                            New update procedure- p_update_caps_orders    */
/*                                            for overwrite created. This is to prevent two */
/*                                            records being sent to CAPS for same AE order. */
/*                                            New procedure p_update_transfer_control called*/
/*                                            if record in CAPS_ORDERS is updated           */
/*                                                                                          */
/* 2.0      3 June 2007 Chris Hutt            Ported to SUPS	                            */
/*                                            					            */
/* 2.1     22 June 2007 Chris Hutt            Defect Group2 5102                            */
/*                                            CMCS_TRANSFER_CONTROL.TRANSFER_TYPE not being */
/*                                            populated                                     */
/*                                            One instance of 'CODED_PARTY' in procedure    */
/*                                            p_get_payee_detail corrected to 'CODED PARTY' */
/*                                                                             	            */
/* 2.2      2 Oct  2007 Paul Scanlon          Defect Group2 5380                            */
/*                                            Created new procedure p_transfer_cleardown    */
/*                                            to perform housekeeping on CMCS_CAPS_ORDERS   */
/*                                            and related CMCS_TRANSFER_CONTROL records.    */
/*                                                                                          */
/* 2.3      22 Oct 2007 Chris Hutt            Defect Group2 5380                            */
/*                                            Extanded selection criteria in                */
/*                                            p_transfer_clear_down to confine deletion to  */
/*                                            TRANSFER_TYPE = 'O'                           */
/*                                                                                          */
/* 2.4	    17 Dec 2007 Chris Hutt            Defect Group2 5535                            */
/*                                            Null values in Report_value_1/2/3 can occur   */
/*                                            if associated Q&A screen aborted. This will   */
/*                                            cause insert into CMCS_CAPS_ORDERS to fail. To*/
/*                                            avoid this, events with these null values are */
/*                                            processed seperately and details written to   */
/*                                            TRANSER_ERROR_LOG                             */
/* 2.5	    26 May 2010 Troy Baines           TRAC #3244                                    */
/*                                            Strip diacritic marks off Welsh characters    */
/*											  A,E,I,O,U for Person_Requested_Name and       */
/*											  Given_Addresses Lines 1 - 5                   */
/* 2.6		13 May 2011 Nilesh Mistry		  TRAC #3436									*/
/*											  Amend p_get_debtor_detail so that it retrieves*/
/*										      the payroll number instead of reference       */
/********************************************************************************************/


/**********************************************************************************************************************/
/*                                                 P A C K A G E                                                      */
/**********************************************************************************************************************/

CREATE OR REPLACE PACKAGE sups_ae_order_transfer_pack IS
	
	v_transfer_error_log		transfer_error_log%ROWTYPE;
	v_transfer_control		cmcs_transfer_control%ROWTYPE;
	v_caps_orders			cmcs_caps_orders%ROWTYPE;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_insert_transfer_control                                                               */
	/* DESCRIPTION	: Inserts a control row into the TRANFER CONTROL table                                            */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_transfer_control(p_error_flag OUT  VARCHAR2);


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_update_transfer_control                                                               */
	/* DESCRIPTION	: Updates control row in the TRANFER CONTROL table if there is an update to AE order              */
    	/*                  New procedure created for change 1.10 ,scr 654 (SG)                                           */
 	/******************************************************************************************************************/

	PROCEDURE p_update_transfer_control(p_trans_seq IN number,p_error_flag OUT VARCHAR2);

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_insert_caps_orders                                                                    */
	/* DESCRIPTION	: Inserts a record into the CMCS_CAPS_ORDERS table                                                */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_caps_orders(p_debug IN CHAR DEFAULT 'N',p_error_flag OUT VARCHAR2);

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                           */
    /* NAME			: p_update_caps_orders                                                                */
    /* DESCRIPTION	: Updates a record into the CMCS_CAPS_ORDERS table                                            */
    /*                  created for change 1.10 , scr 654(SG)                                                         */ 
    /******************************************************************************************************************/

	PROCEDURE p_update_caps_orders(p_ae_number IN VARCHAR2,p_case_number IN VARCHAR2,
                                     p_trans_seq IN VARCHAR2,
                                     p_debug IN CHAR DEFAULT 'N',p_error_flag OUT VARCHAR2);

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                           */
    /* NAME			: p_check_record_exists                                                               */
    /* DESCRIPTION	: Checks to see if record exists in the CMCS_CAPS_ORDERS table                                */
    /*                created for change 1.10 , scr 654(SG)                                                           */
    /******************************************************************************************************************/

      PROCEDURE p_check_record_exists(p_ae_number IN VARCHAR2,p_case_number IN VARCHAR2,
                                      p_debug IN CHAR DEFAULT 'N',p_trans_seq OUT VARCHAR2,
                                      p_exists OUT VARCHAR2,p_error_flag OUT VARCHAR2) ;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_order_status                                                                      */
	/* DESCRIPTION	: Calculate the order status, depending om standard event ID passed                               */
 	/******************************************************************************************************************/

	FUNCTION f_get_order_status (f_std_event_id IN ae_events.std_event_id%TYPE) RETURN VARCHAR2;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_ae_type                                                                           */
	/* DESCRIPTION	: Calculate the AE Type, depending on standard event ID passed                                    */
 	/******************************************************************************************************************/

	FUNCTION f_get_ae_type (f_std_event_id IN ae_events.std_event_id%TYPE) RETURN VARCHAR2;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_order_amount                                                                      */
	/* DESCRIPTION	: Calculate the order amount, depending on the standard event id passed                           */
 	/******************************************************************************************************************/

	FUNCTION f_get_order_amount(f_std_event_id IN ae_events.std_event_id%TYPE,
								f_ae_number IN ae_events.ae_number%TYPE) RETURN NUMBER;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_judg_crt_code                                                                     */
	/* DESCRIPTION	: Retrieve the judgement court code from JUDGEMENTS, depending on judgement sequence passed       */
 	/******************************************************************************************************************/

	FUNCTION f_get_judg_crt_code(f_judg_seq IN judgments.judg_seq%TYPE) RETURN NUMBER;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_creditor_detail                                                                   */
	/* DESCRIPTION	: Retrieve the creditor associated with an ae order                                               */
 	/******************************************************************************************************************/

	PROCEDURE p_get_creditor_detail(p_ae_number 	                  IN  ae_applications.ae_number%TYPE             ,
				        p_code                            OUT coded_parties.code%TYPE                    ,
	                                p_person_requested_name           OUT parties.person_requested_name%TYPE         ,
	                                p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                                p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                    	p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                    	p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                    	p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                                p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                    	p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                    	p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                    	p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                    	p_email_address                   OUT parties.email_address%TYPE                 ,
                                    	p_pcm                             OUT parties.preferred_communication_method%TYPE                            ,
                                    	p_reference                       OUT case_party_roles.reference%TYPE              );
         

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_payee_detail                                                                      */
	/* DESCRIPTION	: Retrieve the payee associated with an ae order                                                  */
 	/******************************************************************************************************************/

	PROCEDURE p_get_payee_detail(	p_ae_number 	               IN  ae_applications.ae_number%TYPE             ,
				     	p_code                         OUT coded_parties.code%TYPE                    ,
	                             	p_person_requested_name        OUT parties.person_requested_name%TYPE         ,
	                             	p_address_line1                OUT given_addresses.address_line1%TYPE         ,
	                             	p_address_line2                OUT given_addresses.address_line2%TYPE         ,
                                 	p_address_line3                OUT given_addresses.address_line3%TYPE         ,
                                 	p_address_line4                OUT given_addresses.address_line4%TYPE         ,
                                 	p_address_line5                OUT given_addresses.address_line5%TYPE         ,
	                             	p_postcode                     OUT given_addresses.postcode%TYPE              ,
                                 	p_tel_no                       OUT parties.tel_no%TYPE                        ,
                                 	p_dx_number                    OUT parties.dx_number%TYPE                     ,
                                 	p_fax_number                   OUT parties.fax_number%TYPE                    ,
                                 	p_email_address                OUT parties.email_address%TYPE                 ,
                                 	p_pcm                          OUT parties.preferred_communication_method%TYPE,
                                 	p_reference                    OUT case_party_roles.reference%TYPE              );
       

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_debtor_detail                                                                     */
	/* DESCRIPTION	: Retrieve the debtor associated with an ae order                                                 */
 	/******************************************************************************************************************/

	PROCEDURE p_get_debtor_detail(	p_ae_number 	                  IN  ae_applications.ae_number%TYPE             ,
	                               	p_person_requested_name           OUT parties.person_requested_name%TYPE         ,
	                               	p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                               	p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                   	p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                   	p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                   	p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                               	p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                   	p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                   	p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                   	p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                   	p_email_address                   OUT parties.email_address%TYPE                 ,
                                   	p_pcm                             OUT parties.preferred_communication_method%TYPE,
                                   	p_payroll_number                  OUT ae_applications.payroll_number%TYPE       );

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_employer_detail                                                                   */
	/* DESCRIPTION	: Retrieve the debtor associated with an ae order                                                 */
 	/******************************************************************************************************************/

	PROCEDURE p_get_employer_detail(p_ae_number 	                  IN  ae_applications.ae_number%TYPE             ,
                                    	p_empl_code                       OUT coded_parties.code%TYPE                   ,
	                                p_person_requested_name           OUT parties.person_requested_name%TYPE         ,
	                                p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                                p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                    	p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                    	p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                    	p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                                p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                    	p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                    	p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                    	p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                    	p_email_address                   OUT parties.email_address%TYPE                 ,
                                    	p_pcm                             OUT parties.preferred_communication_method%TYPE,
                                    	p_reference                       OUT case_party_roles.reference%TYPE              );
       
	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_workplace_detail                                                                  */
	/* DESCRIPTION	: Retrieve the debtor associated with an ae order                                                 */
    	/*                                                                                                                */
 	/******************************************************************************************************************/

	PROCEDURE p_get_workplace_detail(p_ae_number 	                 IN  ae_applications.ae_number%TYPE             ,
	                               p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                               p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                       p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                       p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                       p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                               p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                       p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                       p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                       p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                       p_email_address                   OUT parties.email_address%TYPE                 ,
                                       p_pcm                             OUT parties.preferred_communication_method%TYPE) ;
        

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_transfer_ae_orders_out                                                                */
	/* DESCRIPTION	: Transfers records from court database to remote database situated in Uxbridge, for processing   */
 	/******************************************************************************************************************/

	PROCEDURE p_transfer_ae_orders_out(p_user IN VARCHAR2 DEFAULT 'CAPS_BATCH',p_debug IN CHAR DEFAULT 'N',p_cleardown IN CHAR DEFAULT 'Y');

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_insert_error_log                                                                      */
	/* DESCRIPTION	: Inserts an error in a log table, held on remote database		       	                  */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_error_log;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_update_process_stage                                                                  */
	/* DESCRIPTION	: Updates the process stage in AE_EVENTS, to parameter define value, for rowid              	  */
 	/******************************************************************************************************************/

	PROCEDURE p_update_process_stage(p_row_id IN ROWID,p_process_stage IN VARCHAR2,p_error_flag OUT VARCHAR2);

    /******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                            */
    /* NAME			: f_calculate_outstanding_bal                                                         */
    /* DESCRIPTION	: Calculate the outstanding balance of AE  (PER: 02AEN01026)                                  */
    /******************************************************************************************************************/

    FUNCTION f_calculate_outstanding_bal (f_ae_number IN ae_events.ae_number%TYPE) RETURN NUMBER;


    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                           */
    /* NAME			: p_transfer_clear_down                                                               */
    /* DESCRIPTION	: Deletes rows from the following staging tables that have been successfully transferred over */
    /*                50 days prior :-                                                                                */
    /*                 CMCS_CAPS_ORDERS and CMCS_TRANSFER_CONTROL.                                                    */
    /******************************************************************************************************************/

    PROCEDURE p_transfer_clear_down;

END sups_ae_order_transfer_pack;
/


/**********************************************************************************************************************/
/*                                            P A C K A G E  B O D Y                                                  */
/**********************************************************************************************************************/

CREATE OR REPLACE PACKAGE BODY sups_ae_order_transfer_pack IS

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
        /* NAME			: p_insert_error_log                                                                      */
	/* DESCRIPTION	: Inserts an error in a log table				      	                          */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_error_log IS

	BEGIN

		BEGIN

			INSERT INTO transfer_error_log (transfer_date,
							transfer_type,
							sending_court,
--							transfer_number,
--							table_name,
							error_message,
							case_number)
						VALUES (v_transfer_error_log.transfer_date,
							v_transfer_error_log.transfer_type,
							v_transfer_error_log.sending_court,
--							v_transfer_error_log.transfer_number,
--							v_transfer_error_log.table_name,
							v_transfer_error_log.error_message,
							v_transfer_error_log.case_number);

		EXCEPTION

			WHEN others THEN

				/**********************************************************************/
				/* This should never happen, however if it does we dont want the      */
				/* transfer process to stop. Error will need to be picked up manually */
				/**********************************************************************/
				NULL;


--			        IF p_debug = 'Y' THEN
--
--					DBMS_OUTPUT.PUT_LINE('************************************************************************************');
--					DBMS_OUTPUT.PUT_LINE('* (DEBUGGING) ERRORS OCCURRED, ON ATTEMPTING INSERT INTO TRANSFER_ERROR_LOG        *');
--					DBMS_OUTPUT.PUT_LINE('************************************************************************************');		
--					DBMS_OUTPUT.PUT_LINE('TRANSFER_TYPE     :'||v_transfer_error_log.transfer_type);
--					DBMS_OUTPUT.PUT_LINE('SENDING_COURT     :'||v_transfer_error_log.sending_court);
--					DBMS_OUTPUT.PUT_LINE('ERROR_MESSAGE     :'||v_transfer_error_log.error_message);
--
--			        END IF;	


		END;				

	END p_insert_error_log;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_insert_transfer_control                                                               */
	/* DESCRIPTION	: Inserts a control row into the TRANFER CONTROL table                                            */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_transfer_control(p_error_flag OUT VARCHAR2) IS

	BEGIN

		BEGIN

			INSERT INTO cmcs_transfer_control (	trans_seq,
								transfer_type,
								transfer_number,
								sending_court_code,
								receiving_court_code,
								transfer_request_date,
								central_receipt_date,
								date_transferred,
								transfer_status,
								attempt)
							VALUES (v_transfer_control.trans_seq,
								v_transfer_control.transfer_type,
								v_transfer_control.transfer_number,
								v_transfer_control.sending_court_code,
								v_transfer_control.receiving_court_code,
								v_transfer_control.transfer_request_date,
								v_transfer_control.central_receipt_date,
								v_transfer_control.date_transferred,
								v_transfer_control.transfer_status,
								v_transfer_control.attempt);

			/*****************************************************************************/
			/* Set error flag to 'N' (no error on INSERTING into TRANSFER_CONTROL TABLE) */
			/*****************************************************************************/
		
			p_error_flag := 'N';

		EXCEPTION

			WHEN others THEN

				/********************************************************************/
				/* Transaction is invalid                                           */
				/* Issue a ROLLBACK to clean up, if partially completed transaction */
				/********************************************************************/

				ROLLBACK;

				/************************************************************/
				/* Update TRANSFER_ERROR LOG with error information         */
				/* due to an SQL error on insert into CMCS_TRANSFER_CONTROL */
				/************************************************************/

				v_transfer_error_log.transfer_date		:= v_transfer_control.transfer_request_date;
				v_transfer_error_log.transfer_type		:= v_transfer_control.transfer_type;
				v_transfer_error_log.sending_court		:= v_transfer_control.sending_court_code;
--				v_transfer_error_log.transfer_number		:= v_transfer_control.transfer_number;
--				v_transfer_error_log.table_name			:= 'CMCS_TRANSFER_CONTROL';
				v_transfer_error_log.error_message		:= SUBSTR(SQLERRM,1,200);

				sups_ae_order_transfer_pack.p_insert_error_log;

				/**********************************************************/
				/* Issue a COMMIT to save current transaction to database */
				/* Ensures any errors are committed.                      */
				/**********************************************************/
	
				COMMIT;

				/*******************************************************************************/
				/* Set error flag to 'Y' (Error on INSERTING into CMCS_TRANSFER_CONTROL TABLE) */
				/*******************************************************************************/

				p_error_flag := 'Y';

		END;

	END p_insert_transfer_control;



	PROCEDURE p_update_transfer_control(p_trans_seq IN number,p_error_flag OUT VARCHAR2) IS

	BEGIN

		BEGIN

		  UPDATE cmcs_transfer_control
                  SET transfer_type         = v_transfer_control.transfer_type,
                      transfer_number       = v_transfer_control.transfer_number,
                      sending_court_code    = v_transfer_control.sending_court_code ,
                      receiving_court_code  = v_transfer_control.receiving_court_code,
                      transfer_request_date = v_transfer_control.transfer_request_date,
                      central_receipt_date  = v_transfer_control.central_receipt_date,
                      date_transferred      = v_transfer_control.date_transferred,
                      transfer_status       = v_transfer_control.transfer_status,
                      attempt               = v_transfer_control.attempt
                  WHERE trans_seq           = p_trans_seq ;   
                   
			/*****************************************************************************/
			/* Set error flag to 'N' (no error on UPDATING  TRANSFER_CONTROL TABLE)      */
			/*****************************************************************************/
		
			p_error_flag := 'N';

		EXCEPTION

			WHEN others THEN

				/********************************************************************/
				/* Transaction is invalid                                           */
				/* Issue a ROLLBACK to clean up, if partially completed transaction */
				/********************************************************************/

				ROLLBACK;

				/************************************************************/
				/* Update TRANSFER_ERROR LOG with error information         */
				/* due to an SQL error on insert into CMCS_TRANSFER_CONTROL */
				/************************************************************/

				v_transfer_error_log.transfer_date		:= v_transfer_control.transfer_request_date;
				v_transfer_error_log.transfer_type		:= v_transfer_control.transfer_type;
				v_transfer_error_log.sending_court		:= v_transfer_control.sending_court_code;
--				v_transfer_error_log.transfer_number		:= v_transfer_control.transfer_number;
--				v_transfer_error_log.table_name			:= 'CMCS_TRANSFER_CONTROL';
				v_transfer_error_log.error_message		:= SUBSTR(SQLERRM,1,200);

				sups_ae_order_transfer_pack.p_insert_error_log;

				/**********************************************************/
				/* Issue a COMMIT to save current transaction to database */
				/* Ensures any errors are committed.                      */
				/**********************************************************/
	
				COMMIT;

				/**************************************************************************/
				/* Set error flag to 'Y' (Error on UPDATING  CMCS_TRANSFER_CONTROL TABLE) */
				/**************************************************************************/

				p_error_flag := 'Y';

		END;

	END p_update_transfer_control;


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_insert_caps_orders                                                                    */
	/* DESCRIPTION	: Inserts a record into the CMCS_CAPS_ORDERS table                                                */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_caps_orders(p_debug IN CHAR DEFAULT 'N',p_error_flag OUT VARCHAR2) IS

	BEGIN

		BEGIN

			INSERT INTO cmcs_caps_orders (trans_seq,
									 issued_by,
									 order_status,
									 case_number,
									 ae_number,
									 caps_sequence,
									 ae_type,
									 pltf_code,
									 pltf_name,
									 pltf_addr1,
									 pltf_addr2,
									 pltf_addr3,
									 pltf_addr4,
									 pltf_addr5,
									 pltf_postcode,
									 pltf_tel,
									 pltf_dx,
									 pltf_fax,
									 pltf_email,
									 pltf_pcm,
									 pltf_ref,
									 payee_code,
									 payee_name,
									 payee_addr1,
									 payee_addr2,
									 payee_addr3,
									 payee_addr4,
									 payee_addr5,
									 payee_postcode,
									 payee_tel,
									 payee_dx,
									 payee_fax,
       								 	 payee_email,
						                         payee_pcm,
									 payee_ref,
									 def_name,
									 def_addr1,
									 def_addr2,
									 def_addr3,
									 def_addr4,
									 def_addr5,
									 def_postcode,
                                                                         def_tel,
                                                                         def_dx,
                                                                         def_fax,
                                                                         def_email,
									 def_pcm,
									 def_occupation,
									 def_pay_ref,
									 empl_code,
									 empl_name,
									 empl_addr1,
									 empl_addr2,
									 empl_addr3,
									 empl_addr4,
                                                                         empl_addr5,
									 empl_postcode,
									 empl_tel,
                                                                         empl_dx,
                                                                         empl_fax,
                                                                         empl_email,
                                                                         empl_pcm,
									 empl_ref,
									 work_addr1,
									 work_addr2,
									 work_addr3,
									 work_addr4,
									 work_addr5,
									 work_postcode,
                                                                         work_tel,
                                                                         work_dx,
                                                                         work_fax,
                                                                         work_email,
                                                                         work_pcm,
									 ndr_amount,
									 ndr_period,
									 per_amount,
									 per_period,
									 paid_monthly_flag,
								 	 order_amount,
                                                                         order_amount_currency,
									 date_of_order,
									 judg_crt_code,
									 order_required_flag,
									 dj_order_flag,
									 transfer_status)
							 VALUES (        v_caps_orders.trans_seq,
							 	         v_caps_orders.issued_by,
									 v_caps_orders.order_status,
									 v_caps_orders.case_number,
									 v_caps_orders.ae_number,
									 v_caps_orders.caps_sequence,
									 v_caps_orders.ae_type,
									 v_caps_orders.pltf_code,
									 v_caps_orders.pltf_name,
									 v_caps_orders.pltf_addr1,
									 v_caps_orders.pltf_addr2,
									 v_caps_orders.pltf_addr3,
								 	 v_caps_orders.pltf_addr4,
									 v_caps_orders.pltf_addr5,
									 v_caps_orders.pltf_postcode,
									 v_caps_orders.pltf_tel,
									 v_caps_orders.pltf_dx,
									 v_caps_orders.pltf_fax,
									 v_caps_orders.pltf_email,
									 v_caps_orders.pltf_pcm,
									 v_caps_orders.pltf_ref,
									 v_caps_orders.payee_code,
									 v_caps_orders.payee_name,
									 v_caps_orders.payee_addr1,
									 v_caps_orders.payee_addr2,
									 v_caps_orders.payee_addr3,
									 v_caps_orders.payee_addr4,
									 v_caps_orders.payee_addr5,
									 v_caps_orders.payee_postcode,
									 v_caps_orders.payee_tel,
									 v_caps_orders.payee_dx,
									 v_caps_orders.payee_fax,
       								         v_caps_orders.payee_email,
						                         v_caps_orders.payee_pcm,
									 v_caps_orders.payee_ref,
									 v_caps_orders.def_name,
									 v_caps_orders.def_addr1,
									 v_caps_orders.def_addr2,
									 v_caps_orders.def_addr3,
									 v_caps_orders.def_addr4,
									 v_caps_orders.def_addr5,
									 v_caps_orders.def_postcode,
                                                                         v_caps_orders.def_tel,
                                                                         v_caps_orders.def_dx,
                                                                         v_caps_orders.def_fax,
                                                                         v_caps_orders.def_email,
									 v_caps_orders.def_pcm,
									 v_caps_orders.def_occupation,
									 v_caps_orders.def_pay_ref,
									 v_caps_orders.empl_code,
									 v_caps_orders.empl_name,
									 v_caps_orders.empl_addr1,
									 v_caps_orders.empl_addr2,
									 v_caps_orders.empl_addr3,
									 v_caps_orders.empl_addr4,
                                                                         v_caps_orders.empl_addr5,
									 v_caps_orders.empl_postcode,
									 v_caps_orders.empl_tel,
                                                                         v_caps_orders.empl_dx,
                                                                         v_caps_orders.empl_fax,
                                                                         v_caps_orders.empl_email,
                                                                         v_caps_orders.empl_pcm,
									 v_caps_orders.empl_ref,
									 v_caps_orders.work_addr1,
									 v_caps_orders.work_addr2,
									 v_caps_orders.work_addr3,
									 v_caps_orders.work_addr4,
									 v_caps_orders.work_addr5,
									 v_caps_orders.work_postcode,
                                                                         v_caps_orders.work_tel,
                                                                         v_caps_orders.work_dx,
                                                                         v_caps_orders.work_fax,
                                                                         v_caps_orders.work_email,
                                                                         v_caps_orders.work_pcm,
									 v_caps_orders.ndr_amount,
									 v_caps_orders.ndr_period,
									 v_caps_orders.per_amount,
									 v_caps_orders.per_period,
									 v_caps_orders.paid_monthly_flag,
								 	 v_caps_orders.order_amount,
                                                                         v_caps_orders.order_amount_currency,
									 v_caps_orders.date_of_order,
									 v_caps_orders.judg_crt_code,
									 v_caps_orders.order_required_flag,
									 v_caps_orders.dj_order_flag,
									 v_caps_orders.transfer_status);

			/*****************************************************************************/
			/* Set error flag to 'N' (no error on INSERTING into CMCS_CAPS_ORDERS TABLE) */
			/*****************************************************************************/

			p_error_flag := 'N';

			IF p_debug = 'Y' THEN

					DBMS_OUTPUT.PUT_LINE('************************************************************************************');
					DBMS_OUTPUT.PUT_LINE('* (DEBUGGING) NO ERRORS OCCURRED, ON ATTEMPTING INSERT INTO CMCS_CAPS_ORDERS TABLE *');
					DBMS_OUTPUT.PUT_LINE('************************************************************************************');			
					DBMS_OUTPUT.PUT_LINE('AE_NUMBER (NOT NULL)			:'||v_caps_orders.ae_number);
					DBMS_OUTPUT.PUT_LINE(' ');

			END IF;	

		EXCEPTION

			WHEN others THEN

				/********************************************************************/
				/* Transaction is invalid                                           */
				/* Issue a ROLLBACK to clean up, if partially completed transaction */
				/********************************************************************/

				ROLLBACK;

				/****************************************************/
				/* Update TRANSFER_ERROR LOG with error information */
				/* due to an SQL error on insert into CMCS_CAPS_ORDERS   */
				/****************************************************/

				v_transfer_error_log.transfer_date		:= SYSDATE;
				v_transfer_error_log.transfer_type		:= v_transfer_control.transfer_type;
				v_transfer_error_log.sending_court		:= v_transfer_control.sending_court_code;
--				v_transfer_error_log.transfer_number	        := v_transfer_control.transfer_number;
--				v_transfer_error_log.table_name		        := 'CMCS_CAPS_ORDERS';
				v_transfer_error_log.error_message		:= SUBSTR(SQLERRM,1,200);

				sups_ae_order_transfer_pack.p_insert_error_log;

				/**********************************************************/
				/* Issue a COMMIT to save current transaction to database */
				/* Ensures any errors are committed.                      */
				/**********************************************************/

				COMMIT;

				/**************************************************************************/
				/* Set error flag to 'Y' (Error on INSERTING into CMCS_CAPS_ORDERS TABLE) */
				/**************************************************************************/
		
				p_error_flag := 'Y';

				IF p_debug = 'Y' THEN

					DBMS_OUTPUT.PUT_LINE('********************************************************************************');
					DBMS_OUTPUT.PUT_LINE('* (DEBUGGING) ERROR OCCURRED, ON ATTEMPTING INSERT INTO CMCS_CAPS_ORDERS TABLE *');
					DBMS_OUTPUT.PUT_LINE('********************************************************************************');
					DBMS_OUTPUT.PUT_LINE('TRANS_SEQ (NOT NULL)			:'||v_caps_orders.trans_seq);
					DBMS_OUTPUT.PUT_LINE('ISSUED BY (NOT NULL)			:'||v_caps_orders.issued_by);
					DBMS_OUTPUT.PUT_LINE('ORDER_STATUS (NOT NULL)			:'||v_caps_orders.order_status);
					DBMS_OUTPUT.PUT_LINE('CASE_NUMBER (NOT NULL)			:'||v_caps_orders.case_number);
					DBMS_OUTPUT.PUT_LINE('AE_NUMBER (NOT NULL)			:'||v_caps_orders.ae_number);
					DBMS_OUTPUT.PUT_LINE('AE_TYPE (NOT NULL)			:'||v_caps_orders.ae_type);
					DBMS_OUTPUT.PUT_LINE('PLTF_NAME (NOT NULL)			:'||v_caps_orders.pltf_name);
					DBMS_OUTPUT.PUT_LINE('PLTF_ADDR1 (NOT NULL)			:'||v_caps_orders.pltf_addr1);
					DBMS_OUTPUT.PUT_LINE('PLTF_ADDR2 (NOT NULL)			:'||v_caps_orders.pltf_addr2);
					DBMS_OUTPUT.PUT_LINE('PAYEE_NAME (NOT NULL)			:'||v_caps_orders.payee_name);
					DBMS_OUTPUT.PUT_LINE('PAYEE_ADDR1 (NOT NULL)			:'||v_caps_orders.payee_addr1);
					DBMS_OUTPUT.PUT_LINE('PAYEE_ADDR2 (NOT NULL)			:'||v_caps_orders.payee_addr2);
					DBMS_OUTPUT.PUT_LINE('DEF_NAME (NOT NULL)			:'||v_caps_orders.def_name);
					DBMS_OUTPUT.PUT_LINE('DEF_ADDR1 (NOT NULL)			:'||v_caps_orders.def_addr1);
					DBMS_OUTPUT.PUT_LINE('DEF_ADDR2 (NOT NULL) 			:'||v_caps_orders.def_addr2);
					DBMS_OUTPUT.PUT_LINE('DEF_OCCUPATION (NOT NULL)		        :'||v_caps_orders.def_occupation);
					DBMS_OUTPUT.PUT_LINE('DEF_PAY_REF (NOT NULL)			:'||v_caps_orders.def_pay_ref);
					DBMS_OUTPUT.PUT_LINE('EMPL_NAME (NOT NULL)			:'||v_caps_orders.empl_name);
					DBMS_OUTPUT.PUT_LINE('EMPL_ADDR1 (NOT NULL)			:'||v_caps_orders.empl_addr1);
					DBMS_OUTPUT.PUT_LINE('EMPL_ADDR2 (NOT NULL)			:'||v_caps_orders.empl_addr2);
					DBMS_OUTPUT.PUT_LINE('NDR_AMOUNT (NOT NULL)			:'||v_caps_orders.ndr_amount);
					DBMS_OUTPUT.PUT_LINE('NDR_PERIOD (NOT NULL)			:'||v_caps_orders.ndr_period);
					DBMS_OUTPUT.PUT_LINE('PER AMOUNT (NOT NULL)			:'||v_caps_orders. per_amount);
					DBMS_OUTPUT.PUT_LINE('PER_PERIOD (NOT NULL)			:'||v_caps_orders.per_period);
					DBMS_OUTPUT.PUT_LINE('PAID_MONTHLY_FLAG (NOT NULL)		:'||v_caps_orders.paid_monthly_flag);
					DBMS_OUTPUT.PUT_LINE('DATE_OD_ORDER (NOT NULL)		        :'||v_caps_orders.date_of_order);
					DBMS_OUTPUT.PUT_LINE('ORDER_REQUIRED_FLAG (NOT NULL)		:'||v_caps_orders.order_required_flag);
					DBMS_OUTPUT.PUT_LINE('DJ_ORDER_FLAG (NOT NULL)		        :'||v_caps_orders.dj_order_flag);
					DBMS_OUTPUT.PUT_LINE('TRANSFER_STATUS (NOT NULL)		:'||v_caps_orders.transfer_status);

				END IF;		

		END;

	END p_insert_caps_orders;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                           */
    /* NAME			: p_update_caps_orders                                                                */
    /* DESCRIPTION	: Updates a record into the CMCS_CAPS_ORDERS table                                            */
    /*                  New procedure created for scr 654- change 1.10(SG)                                            */
    /******************************************************************************************************************/

	PROCEDURE p_update_caps_orders(p_ae_number IN VARCHAR2,
                                     p_case_number IN VARCHAR2,
                                     p_trans_seq IN VARCHAR2,
                                     p_debug IN CHAR DEFAULT 'N',p_error_flag OUT VARCHAR2) IS

	BEGIN

		BEGIN

			UPDATE cmcs_caps_orders 
                        SET issued_by           = v_caps_orders.issued_by,
			    order_status        = v_caps_orders.order_status,
			    case_number         = v_caps_orders.case_number,
			    ae_number           = v_caps_orders.ae_number,
			    caps_sequence       = v_caps_orders.caps_sequence,
			    ae_type             = v_caps_orders.ae_type,
			    pltf_code           = v_caps_orders.pltf_code,
			    pltf_name           = v_caps_orders.pltf_name,
			    pltf_addr1          = v_caps_orders.pltf_addr1,
			    pltf_addr2          = v_caps_orders.pltf_addr2,
			    pltf_addr3          = v_caps_orders.pltf_addr3,
			    pltf_addr4          = v_caps_orders.pltf_addr4,
			    pltf_addr5          = v_caps_orders.pltf_addr5,
			    pltf_postcode       = v_caps_orders.pltf_postcode,
			    pltf_tel            = v_caps_orders.pltf_tel,
			    pltf_dx             = v_caps_orders.pltf_dx,
			    pltf_fax            = v_caps_orders.pltf_fax,
			    pltf_email          = v_caps_orders.pltf_email,
			    pltf_pcm            = v_caps_orders.pltf_pcm,
			    pltf_ref            = v_caps_orders.pltf_ref,
			    payee_code          = v_caps_orders.payee_code,
			    payee_name          = v_caps_orders.payee_name,
			    payee_addr1         = v_caps_orders.payee_addr1,
			    payee_addr2         = v_caps_orders.payee_addr2,
			    payee_addr3         = v_caps_orders.payee_addr3,
			    payee_addr4         = v_caps_orders.payee_addr4,
			    payee_addr5         = v_caps_orders.payee_addr5,
			    payee_postcode      = v_caps_orders.payee_postcode,
			    payee_tel           = v_caps_orders.payee_tel,
			    payee_dx            = v_caps_orders.payee_dx,
			    payee_fax           = v_caps_orders.payee_fax,
       		            payee_email         = v_caps_orders.payee_email,
			    payee_pcm           = v_caps_orders.payee_pcm,
			    payee_ref           = v_caps_orders.payee_ref,
			    def_name            = v_caps_orders.def_name,
			    def_addr1           = v_caps_orders.def_addr1,
			    def_addr2           = v_caps_orders.def_addr2,
			    def_addr3           = v_caps_orders.def_addr3,
			    def_addr4           = v_caps_orders.def_addr4,
			    def_addr5           = v_caps_orders.def_addr5,
			    def_postcode        = v_caps_orders.def_postcode,
                            def_tel             = v_caps_orders.def_tel,
                            def_dx              = v_caps_orders.def_dx,
                            def_fax             = v_caps_orders.def_fax,
                            def_email           = v_caps_orders.def_email,
			    def_pcm             = v_caps_orders.def_pcm,
			    def_occupation      = v_caps_orders.def_occupation,
			    def_pay_ref         = v_caps_orders.def_pay_ref,
			    empl_code           = v_caps_orders.empl_code,
			    empl_name           = v_caps_orders.empl_name,
			    empl_addr1          = v_caps_orders.empl_addr1,
			    empl_addr2          = v_caps_orders.empl_addr2,
			    empl_addr3          = v_caps_orders.empl_addr3,
			    empl_addr4          = v_caps_orders.empl_addr4,
                            empl_addr5          = v_caps_orders.empl_addr5,
			    empl_postcode       = v_caps_orders.empl_postcode,
			    empl_tel            = v_caps_orders.empl_tel,
                            empl_dx             = v_caps_orders.empl_dx,
                            empl_fax            = v_caps_orders.empl_fax,
                            empl_email          = v_caps_orders.empl_email,
                            empl_pcm            = v_caps_orders.empl_pcm,
			    empl_ref            = v_caps_orders.empl_ref,
			    work_addr1          = v_caps_orders.work_addr1,
			    work_addr2          = v_caps_orders.work_addr2,
			    work_addr3          = v_caps_orders.work_addr3,
			    work_addr4          = v_caps_orders.work_addr4,
			    work_addr5          = v_caps_orders.work_addr5,
			    work_postcode       = v_caps_orders.work_postcode,
                            work_tel            = v_caps_orders.work_tel,
                            work_dx             = v_caps_orders.work_dx,
                            work_fax            = v_caps_orders.work_fax,
                            work_email          = v_caps_orders.work_email,
                            work_pcm            = v_caps_orders.work_pcm,
			    ndr_amount          = v_caps_orders.ndr_amount,
			    ndr_period          = v_caps_orders.ndr_period,
			    per_amount          = v_caps_orders.per_amount,
                            per_period          = v_caps_orders.per_period,
			    paid_monthly_flag   = v_caps_orders.paid_monthly_flag,
			    order_amount        = v_caps_orders.order_amount,
                            order_amount_currency = v_caps_orders.order_amount_currency,
			    date_of_order       = v_caps_orders.date_of_order,
			    judg_crt_code       = v_caps_orders.judg_crt_code,
			    order_required_flag = v_caps_orders.order_required_flag,
			    dj_order_flag       = v_caps_orders.dj_order_flag,
			    transfer_status     = v_caps_orders.transfer_status
                  WHERE trans_seq = p_trans_seq
                  AND   ae_number = p_ae_number
                  AND   case_number = p_case_number ;
				 
							 	     

			/****************************************************************************/
			/* Set error flag to 'N' (no error on UPDATING into CMCS_CAPS_ORDERS TABLE) */
			/****************************************************************************/

			p_error_flag := 'N';

		EXCEPTION

			WHEN others THEN

				/********************************************************************/
				/* Transaction is invalid                                           */
				/* Issue a ROLLBACK to clean up, if partially completed transaction */
				/********************************************************************/

				ROLLBACK;

				/**********************************************************/
				/* Update TRANSFER_ERROR LOG with error information       */
				/* due to an SQL error on insert into CMCS_CAPS_ORDERS    */
				/**********************************************************/

				v_transfer_error_log.transfer_date		:= SYSDATE;
				v_transfer_error_log.transfer_type		:= v_transfer_control.transfer_type;
				v_transfer_error_log.sending_court		:= v_transfer_control.sending_court_code;
--				v_transfer_error_log.transfer_number	        := v_transfer_control.transfer_number;
--				v_transfer_error_log.table_name		        := 'CMCS_CAPS_ORDERS';
				v_transfer_error_log.error_message		:= SUBSTR(SQLERRM,1,200);

				sups_ae_order_transfer_pack.p_insert_error_log;

				/**********************************************************/
				/* Issue a COMMIT to save current transaction to database */
				/* Ensures any errors are committed.                      */
				/**********************************************************/

				COMMIT;

				/**************************************************************************/
				/* Set error flag to 'Y' (Error on INSERTING into CMCS_CAPS_ORDERS TABLE) */
				/**************************************************************************/
		
				p_error_flag := 'Y';

				IF p_debug = 'Y' THEN

					DBMS_OUTPUT.PUT_LINE('********************************************************************************');
					DBMS_OUTPUT.PUT_LINE('* (DEBUGGING) ERROR OCCURRED, ON ATTEMPTING UPDATE INTO CMCS_CAPS_ORDERS TABLE *');
					DBMS_OUTPUT.PUT_LINE('********************************************************************************');
					DBMS_OUTPUT.PUT_LINE('TRANS_SEQ (NOT NULL)			:'||v_caps_orders.trans_seq);
					DBMS_OUTPUT.PUT_LINE('ISSUED BY (NOT NULL)			:'||v_caps_orders.issued_by);
					DBMS_OUTPUT.PUT_LINE('ORDER_STATUS (NOT NULL)			:'||v_caps_orders.order_status);
					DBMS_OUTPUT.PUT_LINE('CASE_NUMBER (NOT NULL)			:'||v_caps_orders.case_number);
					DBMS_OUTPUT.PUT_LINE('AE_NUMBER (NOT NULL)			:'||v_caps_orders.ae_number);
					DBMS_OUTPUT.PUT_LINE('AE_TYPE (NOT NULL)		        :'||v_caps_orders.ae_type);
					DBMS_OUTPUT.PUT_LINE('PLTF_NAME (NOT NULL)			:'||v_caps_orders.pltf_name);
					DBMS_OUTPUT.PUT_LINE('PLTF_ADDR1 (NOT NULL)			:'||v_caps_orders.pltf_addr1);
					DBMS_OUTPUT.PUT_LINE('PLTF_ADDR2 (NOT NULL)			:'||v_caps_orders.pltf_addr2);
					DBMS_OUTPUT.PUT_LINE('PAYEE_NAME (NOT NULL)			:'||v_caps_orders.payee_name);
					DBMS_OUTPUT.PUT_LINE('PAYEE_ADDR1 (NOT NULL)			:'||v_caps_orders.payee_addr1);
					DBMS_OUTPUT.PUT_LINE('PAYEE_ADDR2 (NOT NULL)			:'||v_caps_orders.payee_addr2);
					DBMS_OUTPUT.PUT_LINE('DEF_NAME (NOT NULL)			:'||v_caps_orders.def_name);
					DBMS_OUTPUT.PUT_LINE('DEF_ADDR1 (NOT NULL)			:'||v_caps_orders.def_addr1);
					DBMS_OUTPUT.PUT_LINE('DEF_ADDR2 (NOT NULL) 			:'||v_caps_orders.def_addr2);
					DBMS_OUTPUT.PUT_LINE('DEF_OCCUPATION (NOT NULL)	        	:'||v_caps_orders.def_occupation);
					DBMS_OUTPUT.PUT_LINE('DEF_PAY_REF (NOT NULL)			:'||v_caps_orders.def_pay_ref);
					DBMS_OUTPUT.PUT_LINE('EMPL_NAME (NOT NULL)			:'||v_caps_orders.empl_name);
					DBMS_OUTPUT.PUT_LINE('EMPL_ADDR1 (NOT NULL)			:'||v_caps_orders.empl_addr1);
					DBMS_OUTPUT.PUT_LINE('EMPL_ADDR2 (NOT NULL)			:'||v_caps_orders.empl_addr2);
					DBMS_OUTPUT.PUT_LINE('NDR_AMOUNT (NOT NULL)			:'||v_caps_orders.ndr_amount);
					DBMS_OUTPUT.PUT_LINE('NDR_PERIOD (NOT NULL)			:'||v_caps_orders.ndr_period);
					DBMS_OUTPUT.PUT_LINE('PER AMOUNT (NOT NULL)			:'||v_caps_orders. per_amount);
					DBMS_OUTPUT.PUT_LINE('PER_PERIOD (NOT NULL)			:'||v_caps_orders.per_period);
					DBMS_OUTPUT.PUT_LINE('PAID_MONTHLY_FLAG (NOT NULL)		:'||v_caps_orders.paid_monthly_flag);
					DBMS_OUTPUT.PUT_LINE('DATE_OD_ORDER (NOT NULL)		        :'||v_caps_orders.date_of_order);
					DBMS_OUTPUT.PUT_LINE('ORDER_REQUIRED_FLAG (NOT NULL)		:'||v_caps_orders.order_required_flag);
					DBMS_OUTPUT.PUT_LINE('DJ_ORDER_FLAG (NOT NULL)	        	:'||v_caps_orders.dj_order_flag);
					DBMS_OUTPUT.PUT_LINE('TRANSFER_STATUS (NOT NULL)		:'||v_caps_orders.transfer_status);

				END IF;		

		END;

	END p_update_caps_orders;



    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                           */
    /* NAME			: p_check_record_exists                                                               */
    /* DESCRIPTION	: Checks to see if record already exists at SP for AE/Casenumber combination                  */
    /*                  New procedure created for scr 654- change 1.10(SG)                                            */
    /******************************************************************************************************************/

	PROCEDURE p_check_record_exists(p_ae_number IN VARCHAR2,p_case_number IN VARCHAR2,
                                      p_debug IN CHAR DEFAULT 'N',p_trans_seq OUT VARCHAR2,
                                      p_exists OUT VARCHAR2,p_error_flag OUT VARCHAR2) IS

      Cursor c_check_record(p_ae_number ae.ae_number%TYPE,p_case_number cases.case_number%TYPE) IS
        SELECT trans_seq
        FROM cmcs_caps_orders
        WHERE ae_number = p_ae_number
        AND  case_number = p_case_number;

        v_trans_seq  cmcs_caps_orders.trans_seq%TYPE;


	BEGIN

		BEGIN
			OPEN c_check_record(p_ae_number,p_case_number);
                  FETCH c_check_record INTO v_trans_seq;
                  IF c_check_record%NOTFOUND THEN
                     p_exists := 'N';
                  ELSE 
                     p_exists := 'Y';
                  END IF;
                  CLOSE c_check_record;	 	     

			/************************************************************************/
			/* Set error flag to 'N' (no error on checking CMCS_CAPS_ORDERS TABLE) */
			/************************************************************************/
                  p_trans_seq := v_trans_seq;
			p_error_flag := 'N';

		EXCEPTION

			WHEN others THEN

				/*********************************************************/
				/* Update TRANSFER_ERROR LOG with error information      */
				/* due to an SQL error on insert into CMCS_CAPS_ORDERS   */
				/*********************************************************/

				v_transfer_error_log.transfer_date		:= SYSDATE;
				v_transfer_error_log.transfer_type		:= v_transfer_control.transfer_type;
				v_transfer_error_log.sending_court		:= v_transfer_control.sending_court_code;
--				v_transfer_error_log.transfer_number	        := v_transfer_control.transfer_number;
--				v_transfer_error_log.table_name		        := 'CMCS_CAPS_ORDERS';
				v_transfer_error_log.error_message		:= SUBSTR(SQLERRM,1,200);

				sups_ae_order_transfer_pack.p_insert_error_log;

				/*******************************************************************************/
				/* Set error flag to 'Y' (Error on Checking records in CMCS_CAPS_ORDERS TABLE) */
				/*******************************************************************************/
		
				p_error_flag := 'Y';

				IF p_debug = 'Y' THEN

					DBMS_OUTPUT.PUT_LINE('********************************************************************************');
					DBMS_OUTPUT.PUT_LINE('* (DEBUGGING) ERROR OCCURRED, ON ATTEMPTING CHECK INTO CMCS_CAPS_ORDERS TABLE  *');
					DBMS_OUTPUT.PUT_LINE('********************************************************************************');
					
				END IF;		

		END;

	END p_check_record_exists;


	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_order_status                                                                      */
	/* DESCRIPTION	: Calculate the order status, depending om standard event ID passed                               */
 	/******************************************************************************************************************/

	FUNCTION f_get_order_status (f_std_event_id IN ae_events.std_event_id%TYPE) RETURN VARCHAR2 IS

	BEGIN

		/************************************/
		/* Set order status depending on    */
		/* standard event id                */
		/************************************/

		IF f_std_event_id IN (880,881,882) THEN

			/****************************************************/
			/* Standard event ID must be either:                */
			/* 880,881 or 882, so set order status to N (NEW)   */
			/****************************************************/

			RETURN 'N';

		ELSE

			/**********************************************************/
			/* Standard event ID must be either:                      */
			/* 897,898 or 899, so set to order status to V (VARIED)   */
			/**********************************************************/

			RETURN 'V';
		END IF;

	END f_get_order_status;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_ae_type                                                                           */
	/* DESCRIPTION	: Calculate the AE Type, depending on standard event ID passed                                    */
 	/******************************************************************************************************************/

	FUNCTION f_get_ae_type (f_std_event_id IN ae_events.std_event_id%TYPE) RETURN VARCHAR2 IS

	BEGIN

		/**********************************************/
		/* Set ae type depending on standard event id */ 
		/**********************************************/

		IF f_std_event_id IN (880,897) THEN

			RETURN 'J';

		ELSIF f_std_event_id IN (881,898) THEN

			RETURN 'A';

		ELSE
	          /*******************************************/
                  /* Standard event ID must be 882 or 899    */
                  /*******************************************/                       
			RETURN 'M';

		END IF;

	END f_get_ae_type;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_order_amount                                                                      */
	/* DESCRIPTION	: Calculate the order amount, depending on the standard event id passed                           */
 	/******************************************************************************************************************/

	FUNCTION f_get_order_amount(f_std_event_id IN ae_events.std_event_id%TYPE,
								f_ae_number IN ae_events.ae_number%TYPE) RETURN NUMBER IS

	BEGIN

		/*****************************************************************/
		/* If the standard event ID is either 882 or 899, then           */
 		/* order_amount is set to NULL in CMCS_CAPS_ORDERS, return NULL  */
		/*****************************************************************/

		IF f_std_event_id IN (882,899) THEN

			RETURN NULL;

		ELSE

			/***********************************************************/
			/* Calculate the outstanding balance                       */
			/***********************************************************/

			RETURN sups_ae_order_transfer_pack.f_calculate_outstanding_bal(f_ae_number);

		END IF;

	END f_get_order_amount;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                */
    	/* NAME			: f_get_judg_                                                                             */
	/* DESCRIPTION	: Retrieve the judgment court code from JUDGMENTS, depending on judgment sequence passed          */
 	/******************************************************************************************************************/

	FUNCTION f_get_judg_crt_code(f_judg_seq IN judgments.judg_seq%TYPE) RETURN NUMBER IS

		CURSOR c_judgments IS

			SELECT judgment_court_code
			FROM judgments
			WHERE judg_seq = f_judg_seq;

		v_judgment_court_code	judgments.judgment_court_code%TYPE;

	BEGIN

		BEGIN

			OPEN c_judgments;
			FETCH c_judgments
			INTO v_judgment_court_code;

			CLOSE c_judgments;
			RETURN v_judgment_court_code;

		EXCEPTION

			/***********************************************************/
			/* Exception handle incase of an unidentified error        */
			/* Theoretically this should never happen, but its         */
			/* better to return NULL than have the program fall over   */
			/* (JUDG_CRT_CODE IS OPTIONAL, SO SHOULD NOT CAUSE A PROB) */
			/***********************************************************/

			WHEN others THEN

				RETURN NULL;

		END;

	END f_get_judg_crt_code;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_update_process_stage                                                                  */
	/* DESCRIPTION	: Updates the process stage in AE_EVENTS, to parameter define value, for rowid                    */
    	/*                Change for SUPS	: process_date (system date) now truncated                                */
 	/******************************************************************************************************************/

	PROCEDURE p_update_process_stage(p_row_id IN ROWID,p_process_stage IN VARCHAR2,p_error_flag OUT VARCHAR2) IS

	BEGIN

		BEGIN

			UPDATE ae_events SET
	
				process_stage = p_process_stage,
				process_date  = trunc(sysdate)  

			WHERE rowid = p_row_id; 

			/*****************************************************************/
			/* Set error flag to 'N' (no error on UPDATE of AE_EVENTS TABLE) */
			/*****************************************************************/

			p_error_flag := 'N';

		EXCEPTION

			WHEN others THEN

				/********************************************************************/
				/* Transaction is invalid                                           */
				/* Issue a ROLLBACK to clean up, if partially completed transaction */
				/********************************************************************/

				ROLLBACK;

				/****************************************************/
				/* Update TRANSFER_ERROR LOG with error information */
				/* due to an SQL error on update of AE_EVENTS       */
				/****************************************************/

				v_transfer_error_log.transfer_date		:= SYSDATE;
				v_transfer_error_log.transfer_type		:= v_transfer_control.transfer_type;
				v_transfer_error_log.sending_court		:= v_transfer_control.sending_court_code;
--				v_transfer_error_log.transfer_number	:= v_transfer_control.transfer_number;
--				v_transfer_error_log.table_name			:= 'AE_EVENTS';
				v_transfer_error_log.error_message		:= SUBSTR(SQLERRM,1,200);

				sups_ae_order_transfer_pack.p_insert_error_log;

				/**********************************************************/
				/* Issue a COMMIT to save current transaction to database */
				/* Ensures any errors are committed.                      */
				/**********************************************************/

				COMMIT;

				/**************************************************************/
				/* Set error flag to 'Y' (Error on UPDATE of AE_EVENTS TABLE) */
				/**************************************************************/

				p_error_flag := 'Y';
	
		END;
			
	END p_update_process_stage;


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: f_get_creditor_detail                                                                   */
	/* DESCRIPTION	: Retrieve the creditor associated with an ae order                                               */
 	/******************************************************************************************************************/

	PROCEDURE p_get_creditor_detail(p_ae_number 	                 IN  ae_applications.ae_number%TYPE,
				       p_code                            OUT coded_parties.code%TYPE                    ,
	                               p_person_requested_name           OUT parties.person_requested_name%TYPE         ,
	                               p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                               p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                       p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                       p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                       p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                               p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                       p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                       p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                       p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                       p_email_address                   OUT parties.email_address%TYPE                 ,
                                       p_pcm                             OUT parties.preferred_communication_method%TYPE,
                                       p_reference                       OUT case_party_roles.reference%TYPE              )
        IS

               CURSOR c_creditor IS
                      select 
	                    cp.code,
	                    translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    ga.postcode,
	                    p.tel_no,
	                    p.dx_number,
	                    p.fax_number,
	                    p.email_address,
	                    p.preferred_communication_method,
	                    cpr.reference
                      from 
	                    coded_parties cp,
	                    parties p,
	                    given_addresses ga,
	                    case_party_roles cpr,
  	                    ae_applications a
                      where
	                    cp.party_id = p.party_id and
  	                    ga.address_type_code = 'CODED PARTY' and
	                    ga.party_id = p.party_id and
	                    ga.valid_to is null and 
  	                    cpr.case_number = a.case_number and
  	                    cpr.party_role_code = a.party_for_party_role_code and
  	                    cpr.case_party_no = a.party_for_case_party_no and
  	                    p.party_id = cpr.party_id and 
  	                    a.ae_number = p_ae_number 
                   union
                       select 
	                    null,
	                    translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    ga.postcode,
	                    p.tel_no,
	                    p.dx_number,
	                    p.fax_number,
	                    p.email_address,
	                    p.preferred_communication_method,
	                    cpr.reference
                       from 
	                    parties p,
	                    given_addresses ga,
	                    case_party_roles cpr,
  	                    ae_applications a
                       where
  	                    cpr.case_number = a.case_number and
  	                    cpr.party_role_code = a.party_for_party_role_code and
  	                    cpr.case_party_no = a.party_for_case_party_no and
  	                    ga.address_type_code = 'SERVICE' and
	                    ga.case_number = a.case_number and
    	                    ga.party_role_code = cpr.party_role_code and
	                    ga.case_party_no = cpr.case_party_no and
	                    ga.valid_to is null and
  	                    p.party_id = cpr.party_id and 
  	                    a.ae_number = p_ae_number ;
                                   

	BEGIN

		BEGIN

			OPEN  c_creditor;
			FETCH c_creditor
			INTO 	        p_code                           ,                  
	                                p_person_requested_name          ,         
	                                p_address_line1                  ,
	                                p_address_line2                  ,
                                        p_address_line3                  ,
                                        p_address_line4                  ,
                                        p_address_line5                  ,
	                                p_postcode                       ,
                                        p_tel_no                         ,
                                        p_dx_number                      ,
                                        p_fax_number                     ,
                                        p_email_address                  ,
                                        p_pcm,
                                        p_reference                      ;      


			CLOSE c_creditor;
			

		EXCEPTION

			/***********************************************************/
			/* Exception handle incase of an unidentified error        */
			/* Theoretically this should never happen, but its         */
			/* better to return NULL than have the program fall over   */
			/***********************************************************/

			WHEN others THEN
                                IF C_CREDITOR%ISOPEN
                                THEN
                                   CLOSE C_CREDITOR;
                                END IF;

				NULL;

		END;

            NULL;

	END p_get_creditor_detail;


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_payee_detail                                                                      */
	/* DESCRIPTION	: Retrieve the payee associated with an ae order                                                  */
 	/******************************************************************************************************************/

	PROCEDURE   p_get_payee_detail(p_ae_number 	                 IN  ae_applications.ae_number%TYPE             ,
				       p_code                            OUT coded_parties.code%TYPE                    ,
	                               p_person_requested_name           OUT parties.person_requested_name%TYPE         ,
	                               p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                               p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                       p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                       p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                       p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                               p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                       p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                       p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                       p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                       p_email_address                   OUT parties.email_address%TYPE                 ,
                                       p_pcm                             OUT parties.preferred_communication_method%TYPE,
                                       p_reference                       OUT case_party_roles.reference%TYPE              ) 
         IS

               CURSOR c_payee IS
                      select 
		         cp.code,
	                 translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                 ga.postcode,
	                 p.tel_no,
	                 p.dx_number,
	                 p.fax_number,
	                 p.email_address,
	                 p.preferred_communication_method,
	                 cpr.reference
                      from 
	                 coded_parties cp,
	                 parties p,
	                 given_addresses ga,
	                 case_party_roles cpr,
  	                 ae_applications a
                      where
	                 cp.party_id 			= p.party_id and
  	                 ga.address_type_code 		= 'CODED PARTY' and
	                 ga.party_id 			= p.party_id and
	                 ga.valid_to 			is null and 
  	                 cpr.case_number 		= a.case_number and
  	                 cpr.party_role_code 		= a.party_for_party_role_code and
  	                 cpr.case_party_no 		= a.party_for_case_party_no and
	                 nvl(cpr.payee_flag ,'N') 	= 'N' and
  	                 p.party_id 			= cpr.party_id and 
  	                 a.ae_number 			= p_ae_number
                 union
                      select 
	                 null,
	                 translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                 ga.postcode,
	                 p.tel_no,
	                 p.dx_number,
	                 p.fax_number,
	                 p.email_address,
	                 p.preferred_communication_method,
	                 cpr.reference
                      from 
	                 parties p,
	                 given_addresses ga,
	                 case_party_roles cpr,
  	                 ae_applications a
                      where
  	                 cpr.case_number 		= a.case_number and
  	                 cpr.party_role_code 		= a.party_for_party_role_code and
  	                 cpr.case_party_no 		= a.party_for_case_party_no and
	                 nvl(cpr.payee_flag ,'N') 	= 'N' and
  	                 ga.address_type_code 		= 'SERVICE' and
	                 ga.case_number 		= a.case_number and
    	                 ga.party_role_code 		= cpr.party_role_code and
	                 ga.case_party_no 		= cpr.case_party_no and
	                 ga.valid_to 			is null and
  	                 p.party_id 			= cpr.party_id and 
  	                 a.ae_number 			= p_ae_number
                  union
                      select 
	                 null,
	                 translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                 ga.postcode,
	                 p.tel_no,
	                 p.dx_number,
	                 p.fax_number,
	                 p.email_address,
	                 p.preferred_communication_method,
	                 cpr2.reference
                      from 
	                 parties p,
	                 given_addresses ga,
	                 case_party_roles cpr1,
	                 case_party_roles cpr2,
  	                 ae_applications a,
	                 cpr_to_cpr_relationship cpr2cpr
                      where
  	                 cpr1.case_number 		= a.case_number and
  	                 cpr1.party_role_code 		= a.party_for_party_role_code and
  	                 cpr1.case_party_no 		= a.party_for_case_party_no and
	                 nvl(cpr1.payee_flag ,'N') 	= 'Y' and
	                 cpr2cpr.cpr_a_case_number 	= cpr1.case_number and
  	                 cpr2cpr.cpr_a_party_role_code 	= cpr1.party_role_code and
	                 cpr2cpr.cpr_a_case_party_no 	= cpr1.case_party_no and
	                 nvl(cpr2cpr.deleted_flag,'N') 	= 'N' and 
	                 cpr2.case_number 		= cpr2cpr.cpr_b_case_number and 
	                 cpr2.party_role_code 		= cpr2cpr.cpr_b_party_role_code and
	                 cpr2.case_party_no 		= cpr2cpr.cpr_b_case_party_no and 
  	                 p.party_id 			= cpr2.party_id and 
  	                 ga.address_type_code 		= 'SOLICITOR' and
	                 ga.case_number 		= a.case_number and
    	                 ga.party_role_code 		= cpr2.party_role_code and
	                 ga.case_party_no 		= cpr2.case_party_no and
	                 ga.valid_to 			is null and
  	                 a.ae_number 			= p_ae_number
                  union
                      select 
	                 cp.code,
	                 translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                 ga.postcode,
	                 p.tel_no,
	                 p.dx_number,
	                 p.fax_number,
	                 p.email_address,
	                 p.preferred_communication_method,
	                 cpr2.reference
                     from 
	                 coded_parties cp,
	                 parties p,
	                 given_addresses ga,
	                 case_party_roles cpr1,
	                 case_party_roles cpr2,
  	                 ae_applications a,
	                 cpr_to_cpr_relationship cpr2cpr
                     where
  	                 cpr1.case_number 		= a.case_number and
  	                 cpr1.party_role_code 		= a.party_for_party_role_code and
  	                 cpr1.case_party_no 		= a.party_for_case_party_no and
	                 nvl(cpr1.payee_flag ,'N') 	= 'Y' and
	                 cpr2cpr.cpr_a_case_number 	= cpr1.case_number and
  	                 cpr2cpr.cpr_a_party_role_code 	= cpr1.party_role_code and
	                 cpr2cpr.cpr_a_case_party_no 	= cpr1.case_party_no and
	                 nvl(cpr2cpr.deleted_flag,'N') 	= 'N' and 
	                 cpr2.case_number 		= cpr2cpr.cpr_b_case_number and 
	                 cpr2.party_role_code 		= cpr2cpr.cpr_b_party_role_code and
	                 cpr2.case_party_no 		= cpr2cpr.cpr_b_case_party_no and 
  	                 p.party_id 			= cpr2.party_id and 
                         cp.party_id                    = p.party_id and
  	                 ga.address_type_code 		= 'CODED PARTY' and
	                 ga.party_id 			= cpr2.party_id  and
	                 ga.valid_to 			is null and
  	                 a.ae_number 			= p_ae_number ;

                                  

	BEGIN

		BEGIN

			OPEN  c_payee;
			FETCH c_payee
			INTO 	        p_code                           ,                  
	                                p_person_requested_name          ,         
	                                p_address_line1                  ,
	                                p_address_line2                  ,
                                        p_address_line3                  ,
                                        p_address_line4                  ,
                                        p_address_line5                  ,
	                                p_postcode                       ,
                                        p_tel_no                         ,
                                        p_dx_number                      ,
                                        p_fax_number                     ,
                                        p_email_address                  ,
                                        p_pcm,
                                        p_reference                      ;      

			CLOSE c_payee;
                        
			

		EXCEPTION

			/***********************************************************/
			/* Exception handle incase of an unidentified error        */
			/* Theoretically this should never happen, but its         */
			/* better to return NULL than have the program fall over   */
			/***********************************************************/

			WHEN others THEN
                                IF C_PAYEE%ISOPEN
                                THEN
                                   CLOSE C_PAYEE;
                                END IF;

				

		END;

        END p_get_payee_detail;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
   	/* NAME			: p_get_debtor_detail                                                                     */
	/* DESCRIPTION	: Retrieve the debtor associated with an ae order                                                 */
 	/******************************************************************************************************************/

	PROCEDURE p_get_debtor_detail(p_ae_number 	                 IN  ae_applications.ae_number%TYPE             ,
	                               p_person_requested_name           OUT parties.person_requested_name%TYPE         ,
	                               p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                               p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                       p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                       p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                       p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                               p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                       p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                       p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                       p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                       p_email_address                   OUT parties.email_address%TYPE                 ,
                                       p_pcm                             OUT parties.preferred_communication_method%TYPE,
                                       p_payroll_number                       OUT ae_applications.payroll_number%TYPE            ) 
        IS

               CURSOR c_debtor IS
                      select 
	                 translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                 ga.postcode,
	                 p.tel_no,
	                 p.dx_number,
	                 p.fax_number,
	                 p.email_address,
	                 p.preferred_communication_method,
                         a.payroll_number
                      from 
	                 parties p,
	                 given_addresses ga,
                         ae_applications a,
                         case_party_roles cpr
                      where
  	                 cpr.case_number = a.case_number and
  	                 cpr.party_role_code = a.party_against_party_role_code and
  	                 cpr.case_party_no = a.party_against_case_party_no and
  	                 ga.address_type_code = 'SERVICE' and
	                 ga.case_number = a.case_number and
    	                 ga.party_role_code = cpr.party_role_code and
	                 ga.case_party_no = cpr.case_party_no and
	                 ga.valid_to is null and
  	                 p.party_id = cpr.party_id and 
  	                 a.ae_number = p_ae_number ;                                 

	BEGIN

		BEGIN

			OPEN  c_debtor;
			FETCH c_debtor
			INTO 	        p_person_requested_name          ,         
	                                p_address_line1                  ,
	                                p_address_line2                  ,
                                        p_address_line3                  ,
                                        p_address_line4                  ,
                                        p_address_line5                  ,
	                                p_postcode                       ,
                                        p_tel_no                         ,
                                        p_dx_number                      ,
                                        p_fax_number                     ,
                                        p_email_address                  ,
                                        p_pcm,
                                        p_payroll_number                      ;      
  

			CLOSE c_debtor;
                        
			

		EXCEPTION

			/***********************************************************/
			/* Exception handle incase of an unidentified error        */
			/* Theoretically this should never happen, but its         */
			/* better to return NULL than have the program fall over   */
			/***********************************************************/

			
			WHEN others THEN
                                IF C_debtor%ISOPEN
                                THEN
                                   CLOSE C_debtor;
                                END IF;

			

		END;

	END p_get_debtor_detail;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_employer_detail                                                                   */
	/* DESCRIPTION	: Retrieve the debtor associated with an ae order                                                 */
 	/******************************************************************************************************************/

	PROCEDURE p_get_employer_detail(p_ae_number 	                 IN  ae_applications.ae_number%TYPE             ,
                                       p_empl_code                       OUT coded_parties.code%TYPE                    ,
	                               p_person_requested_name           OUT parties.person_requested_name%TYPE         ,
	                               p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                               p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                       p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                       p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                       p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                               p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                       p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                       p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                       p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                       p_email_address                   OUT parties.email_address%TYPE                 ,
                                       p_pcm                             OUT parties.preferred_communication_method%TYPE,
                                       p_reference                       OUT case_party_roles.reference%TYPE              ) 
       IS

               CURSOR c_employer IS
                      select 
                          null,
	                  translate(p.person_requested_name,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                  ga.postcode,
	                  p.tel_no,
	                  p.dx_number,
	                  p.fax_number,
	                  p.email_address,
	                  p.preferred_communication_method,
                          ga.reference
                      from 
	                  parties p,
	                  given_addresses ga,
                          ae_applications a
                      where
                          ga.party_id = a.debtors_employers_party_id and
  	                  ga.address_type_code = 'EMPLOYER' and
                          ga.valid_to is null and
                          p.party_id = a.debtors_employers_party_id and 
  	                  a.ae_number = p_ae_number;                               

	BEGIN

		BEGIN

			OPEN  c_employer;
			FETCH c_employer
			INTO 	        p_empl_code                      ,
                                        p_person_requested_name          ,         
	                                p_address_line1                  ,
	                                p_address_line2                  ,
                                        p_address_line3                  ,
                                        p_address_line4                  ,
                                        p_address_line5                  ,
	                                p_postcode                       ,
                                        p_tel_no                         ,
                                        p_dx_number                      ,
                                        p_fax_number                     ,
                                        p_email_address                  ,
                                        p_pcm,
                                        p_reference                      ;       

			CLOSE c_employer;
			

		EXCEPTION

			/***********************************************************/
			/* Exception handle incase of an unidentified error        */
			/* Theoretically this should never happen, but its         */
			/* better to return NULL than have the program fall over   */
			/***********************************************************/

			
			WHEN others THEN
                                IF C_employer%ISOPEN
                                THEN
                                   CLOSE C_employer;
                                END IF;

				NULL;

		END;

	END p_get_employer_detail;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                               */
    	/* NAME			: p_get_workplace_detail                                                                  */
	/* DESCRIPTION	: Retrieve the debtor associated with an ae order                                                 */
 	/******************************************************************************************************************/

	PROCEDURE p_get_workplace_detail(p_ae_number 	                 IN  ae_applications.ae_number%TYPE             ,
	                               p_address_line1                   OUT given_addresses.address_line1%TYPE         ,
	                               p_address_line2                   OUT given_addresses.address_line2%TYPE         ,
                                       p_address_line3                   OUT given_addresses.address_line3%TYPE         ,
                                       p_address_line4                   OUT given_addresses.address_line4%TYPE         ,
                                       p_address_line5                   OUT given_addresses.address_line5%TYPE         ,
	                               p_postcode                        OUT given_addresses.postcode%TYPE              ,
                                       p_tel_no                          OUT parties.tel_no%TYPE                        ,
                                       p_dx_number                       OUT parties.dx_number%TYPE                     ,
                                       p_fax_number                      OUT parties.fax_number%TYPE                    ,
                                       p_email_address                   OUT parties.email_address%TYPE                 ,
                                       p_pcm                             OUT parties.preferred_communication_method%TYPE) 
        IS

               CURSOR c_workplace IS
                      select 
	                  translate(ga.address_line1,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line2,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line3,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line4,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                    translate(ga.address_line5,'¬ƒ¡¿ À…»ŒœÕÃ‘÷”“€‹⁄Ÿ','AAAAEEEEIIIIOOOOUUUU'),
	                  ga.postcode,
	                  null,
	                  null,
	                  null,
	                  null,
	                  null
                     from 
	                  parties p,
	                  given_addresses ga,
	                  case_party_roles cpr,
  	                  ae_applications a
                     where
  	                  cpr.case_number = a.case_number and
  	                  cpr.party_role_code = a.party_against_party_role_code and
  	                  cpr.case_party_no = a.party_against_case_party_no and
  	                  ga.address_type_code = 'WORKPLACE' and
	                  ga.case_number = a.case_number and
    	                  ga.party_role_code = cpr.party_role_code and
	                  ga.case_party_no = cpr.case_party_no and
	                  ga.valid_to is null and
  	                  p.party_id = cpr.party_id and 
  	                  a.ae_number = p_ae_number;                               

	BEGIN

		BEGIN

			OPEN  c_workplace;
			FETCH c_workplace
			INTO 	        p_address_line1                  ,
	                                p_address_line2                  ,
                                        p_address_line3                  ,
                                        p_address_line4                  ,
                                        p_address_line5                  ,
	                                p_postcode                       ,
                                        p_tel_no                         ,
                                        p_dx_number                      ,
                                        p_fax_number                     ,
                                        p_email_address                  ,
                                        p_pcm; 
      

			CLOSE c_workplace;
                        
			

		EXCEPTION

			/***********************************************************/
			/* Exception handle incase of an unidentified error        */
			/* Theoretically this should never happen, but its         */
			/* better to return NULL than have the program fall over   */
			/***********************************************************/

			
			WHEN others THEN
                                IF C_workplace%ISOPEN
                                THEN
                                   CLOSE C_workplace;
                                END IF;

				NULL;

		END;

	END p_get_workplace_detail;

    /******************************************************************************************************************/
    /* TYPE			: FUNCTION                                                                            */
    /* NAME			: f_calculate_outstanding_bal                                                         */
    /* DESCRIPTION	: Calculate the outstanding balance of AE  (PER: 02AEN01026)                                  */
    /*                                                                                                                */
    /* Change history: Chris Hutt 11June07 (SUPS port)                                                                */
    /*                 Fees paid only included where deleted_flag 'N' (as per sups_reports_package                    */
    /******************************************************************************************************************/

	FUNCTION f_calculate_outstanding_bal (f_ae_number IN ae_events.ae_number%TYPE) RETURN NUMBER IS
		CURSOR c_ae_applications IS
			SELECT NVL(ae_fee,0),NVL(amount_of_ae,0)
			FROM ae_applications
			WHERE ae_number = f_ae_number;
		CURSOR c_sum_fees_paid_amount IS
			SELECT SUM(amount)
			FROM fees_paid
			WHERE process_number = f_ae_number
	    	        AND process_type = 'A'
                        AND nvl(deleted_flag,'N') = 'N';
		CURSOR c_sum_payments_amount IS
			SELECT NVL(SUM(amount),0)
			FROM payments
			WHERE subject_no = f_ae_number
			AND payment_for = 'AE'
			AND rd_date IS NULL
			AND error_indicator = 'N';
		v_fees_paid_sum_amount	NUMBER(11,2);
		v_payments_sum_amount   NUMBER(11,2);
		v_ae_applications_fee	ae_applications.ae_fee%TYPE;
		v_ae_applications_aoae	ae_applications.amount_of_ae%TYPE;
	BEGIN
		BEGIN
			/***********************************************************/
			/* Retrieve ae_fee and amount_of_ae from AE_APPLICATIONS   */
			/* for current AE number                                   */
			/***********************************************************/
			OPEN c_ae_applications;
			FETCH c_ae_applications
			INTO v_ae_applications_fee,v_ae_applications_aoae;
			CLOSE c_ae_applications;
			/***********************************************************/
			/* Retrieve the total sum of amount, from FEES_PAID        */
			/* for current AE number                                   */
			/***********************************************************/
			OPEN c_sum_fees_paid_amount;
			FETCH c_sum_fees_paid_amount
			INTO v_fees_paid_sum_amount;
			CLOSE c_sum_fees_paid_amount;
			/***********************************************************/
			/* Retrieve the total sum of payments, from PAYMENTS       */
			/* for current AE number                                   */
			/***********************************************************/
			OPEN c_sum_payments_amount;
			FETCH c_sum_payments_amount
			INTO v_payments_sum_amount;
			CLOSE c_sum_payments_amount;
			/***********************************************************************/
			/* If the v_fees_paid_sum_amount variable is NULL then use AE_FEE from */
			/* AE_APPLICATIONS table instead                                       */
			/***********************************************************************/
			RETURN v_ae_applications_aoae + NVL(v_fees_paid_sum_amount,v_ae_applications_fee) - v_payments_sum_amount;
		EXCEPTION
			/***********************************************************/
			/* Exception handle incase of an unidentified error        */
			/* Theoretically this should never happen, but its         */
			/* better to return NULL than have the program fall over   */
			/* (ORDER_AMOUNT IS OPTIONAL, SO SHOULD NOT CAUSE A PROB)  */
			/***********************************************************/
			WHEN others THEN
				RETURN NULL;
		END;
	END f_calculate_outstanding_bal;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                           */
    /* NAME			: p_transfer_clear_down                                                               */
    /* DESCRIPTION	: Deletes rows from the following staging tables that have been successfully transferred over */
    /*                50 days prior :-                                                                                */
    /*                 CMCS_CAPS_ORDERS and CMCS_TRANSFER_CONTROL.                                                    */
    /******************************************************************************************************************/

    PROCEDURE p_transfer_clear_down IS
    BEGIN
       DELETE CMCS_CAPS_ORDERS CO
       WHERE CO.TRANS_SEQ IN 
          (SELECT TC.TRANS_SEQ
           FROM CMCS_TRANSFER_CONTROL TC
           WHERE TC.TRANSFER_TYPE = 'O'
           AND   TC.DATE_TRANSFERRED <= TRUNC(SYSDATE)-50
           AND   TC.TRANSFER_STATUS = '2');
       
        DELETE CMCS_TRANSFER_CONTROL TC
        WHERE TC.TRANSFER_TYPE = 'O'
        AND   TC.DATE_TRANSFERRED <= TRUNC(SYSDATE)-50
        AND   TC.TRANSFER_STATUS = '2';
       
    END p_transfer_clear_down;


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                  p_transfer                   */
    	/* NAME			: p_transfer_ae_orders_out                                                                */
	/* DESCRIPTION		: selects AE_APPLICATIONS for transfer to CAPS (via CMCS_CAPS_ORDERS table)               */
    	/*                                                                                                                */
    	/* Change in usage for SUPS: In legacy this procedure transfered records from court database to remote database   */
    	/*                           situated in Uxbridge, for processing                                                 */
    	/* Other SUPS changes	:                                                                                         */
    	/*                 	1) Use cases.admin_crt_code instead of PERSONALISE (no longer a single row per dbase      */
    	/*                      2) CMCS_TRANS_SEQUENCE used instead of TRANS_SEQUENCE                                     */
    	/*                      3) order_amount_currency added                                                            */
    	/*                      4) f_get_creditor_detail call added   (ae_package call removed)                           */
    	/*                      5) P_get_payee_detail call added   (ae_package call removed)                              */
    	/*                      6) f_get_employer_detail call added   (ae_package call removed)                           */
    	/*                      7) f_get_workplace_detail call added   (ae_package call removed)                          */
    	/*                      8) f_get_debtor_detail call added   (ae_package call removed)                             */
 	/******************************************************************************************************************/

	PROCEDURE p_transfer_ae_orders_out(p_user IN VARCHAR2 DEFAULT 'CAPS_BATCH', p_debug IN CHAR DEFAULT 'N', p_cleardown IN CHAR DEFAULT 'Y') IS

		/******************************************************************************/
		/* This cursor retrieves AE events which have REPORT_VALUE 1/2/3 popluated    */
		/* and will therefore write to CMCS_CAPS_ORDERS                               */
		/******************************************************************************/
		CURSOR c_ae_events IS

			SELECT	ae.rowid,
					ae.ae_event_seq,
					ae.ae_number,
					ae.date_entered,
					ae.std_event_id,
					aa.case_number,
					aa.debtor_occupation,
					aa.payroll_number,
					aa.normal_deduction_rate,
					aa.normal_deduction_period,
					aa.protected_earnings_rate,
					aa.protected_earnings_period,
					ae.report_value_1,
					ae.event_date,
					ae.report_value_2,
					ae.report_value_3,
					aa.judg_seq,
					aa.caps_sequence,
                              		c.admin_crt_code
			FROM ae_events ae, ae_applications aa, cases c
			WHERE ae.ae_number = aa.ae_number
			AND ae.std_event_id IN (880,881,882,897,898,899)
                  	AND NVL(ae.process_stage,'AUTO') != 'TRAN'
			AND ae.error_indicator = 'N'
                  	AND c.case_number = aa.case_number
                  	AND ae.report_value_1 IS NOT NULL
                  	AND ae.report_value_2 IS NOT NULL
                  	AND ae.report_value_3 IS NOT NULL;
                  	
                /*************************************************************************************/
		/* This cursor retrieves AE events which do NOT have REPORT_VALUE 1/2/3 popluated    */
		/* and will therefore to fail to write to CMCS_CAPS_ORDERS                           */
		/*************************************************************************************/
		CURSOR c_ae_events_null_report_values IS

			SELECT	ae.rowid,
					ae.ae_event_seq,
					ae.ae_number,
					ae.date_entered,
					ae.std_event_id,
					aa.case_number,
					ae.event_date,
                              		c.admin_crt_code,
                              		ae.report_value_1,
					ae.report_value_2,
					ae.report_value_3
			FROM ae_events ae, ae_applications aa, cases c
			WHERE ae.ae_number = aa.ae_number
			AND ae.std_event_id IN (880,881,882,897,898,899)
                  	AND NVL(ae.process_stage,'AUTO') != 'TRAN'
			AND ae.error_indicator = 'N'
                  	AND c.case_number = aa.case_number
                  	AND (   ae.report_value_1 IS NULL
                  	     OR ae.report_value_2 IS NULL
                  	     OR ae.report_value_3 IS NULL);

		v_ae_event_seq				ae_events.ae_event_seq%TYPE;
		v_ae_number				ae_events.ae_number%TYPE;
		v_date_entered				ae_events.date_entered%TYPE;
		v_std_event_id				ae_events.std_event_id%TYPE;
		v_report_value_1			ae_events.report_value_1%TYPE;
		v_event_date				ae_events.event_date%TYPE;
		v_report_value_2			ae_events.report_value_2%TYPE;
		v_report_value_3			ae_events.report_value_3%TYPE;

		v_case_number				ae_applications.case_number%TYPE;	
		v_debtor_occupation			ae_applications.debtor_occupation%TYPE;
		v_payroll_number			ae_applications.payroll_number%TYPE;
		v_normal_deduction_rate		        ae_applications.normal_deduction_rate%TYPE;
		v_normal_deduction_period	        ae_applications.normal_deduction_period%TYPE;
		v_protected_earnings_rate	        ae_applications.protected_earnings_rate%TYPE;
		v_protected_earnings_period	        ae_applications.protected_earnings_period%TYPE;
		v_judg_seq				ae_applications.judg_seq%TYPE;
		v_caps_sequence				ae_applications.caps_sequence%TYPE;
		v_send_crt_code                         cases.admin_crt_code%TYPE := 0;
		v_recv_crt_code				CONSTANT cases.admin_crt_code%TYPE := 0;

		v_row_id				CHAR(18);
		v_sequence				NUMBER(10);
		--v_error      				VARCHAR2(1000);
		v_error_flag				VARCHAR2(1);
		
		--insert for 1.10,scr 654(SG)
		v_exists                                VARCHAR2(1)  :=null;
                v_trans_seq_for_update                  cmcs_caps_orders.trans_seq%TYPE;
		
		/*********************************************************/
		/* Dummy variables are used when fields retrieved from   */
		/* ae_package.cmp_ae_party_details are not required but  */
		/* still need to be allocated their position             */
		/*********************************************************/

		--v_dummy_code				defendants.sol_code%TYPE;
		--v_dummy_name				defendants.name%TYPE;
		--v_dummy_addr_1			addresses.addr_1%TYPE;
		--v_dummy_addr_2			addresses.addr_2%TYPE;
		--v_dummy_addr_3			addresses.addr_3%TYPE;
		--v_dummy_addr_4			addresses.addr_4%TYPE;
		--v_dummy_addr_5			addresses.addr_5%TYPE;
		--v_dummy_postcode			addresses.postcode%TYPE;
		--v_dummy_tel_no			defendants.solicitor_tel_no%TYPE;
		--v_dummy_dx_no				defendants.sol_dx%TYPE;
		--v_dummy_reference		        defendants.solicitor_addr_5%TYPE;

    

	BEGIN
                BEGIN

                   /* Set up the 'Context' for the Audit triggers. */
                  sys.set_sups_app_ctx(p_user, '0', 'SupsCAPSAeOrdXfer');
            
		EXCEPTION

		   WHEN others THEN

		        RAISE_APPLICATION_ERROR(-20100,SQLERRM||' :- Unable to set application context for audit triggers, p_transfer_ae_orders_out HALTED');

	        END;

        	IF p_cleardown = 'Y' THEN
           		p_transfer_clear_down;
        	END IF;
 
                /********************************************/
                /* Process the events having report values  */
                /********************************************/
		OPEN c_ae_events;
		LOOP

			FETCH c_ae_events
			INTO v_row_id, 
				 v_ae_event_seq,
				 v_ae_number,
				 v_date_entered,
				 v_std_event_id,
				 v_case_number,
				 v_debtor_occupation,
				 v_payroll_number,
				 v_normal_deduction_rate,
				 v_normal_deduction_period,
				 v_protected_earnings_rate,
				 v_protected_earnings_period,
				 v_report_value_1,
				 v_event_date,
				 v_report_value_2,
				 v_report_value_3,
				 v_judg_seq,
				 v_caps_sequence,
                                 v_send_crt_code ;

			EXIT WHEN c_ae_events%NOTFOUND; 
			

			IF p_debug = 'Y' THEN

					DBMS_OUTPUT.PUT_LINE('************************************************************************************');
					DBMS_OUTPUT.PUT_LINE('* (DEBUGGING) PROCESSING NEXT ROW FOR INSERT INTO CMCS_CAPS_ORDERS                 *');
					DBMS_OUTPUT.PUT_LINE('************************************************************************************');		
					DBMS_OUTPUT.PUT_LINE('CASE_NUMBER	:'||v_case_number);
					DBMS_OUTPUT.PUT_LINE('AE_NUMBER     	:'||v_ae_number);
					DBMS_OUTPUT.PUT_LINE('AE_EVENT_SEQ     	:'||v_ae_event_seq);

			END IF;	


			/******************************************************************/
			/* Retrieve next available sequence from CMCS_TRANS_SEQUENCE      */
			/* If unable to retrieve, raise application error, and force      */
			/* rollback of uncommited records                                 */
			/******************************************************************/

			BEGIN

				SELECT cmcs_trans_sequence.nextval
				INTO v_sequence
				FROM DUAL;

			EXCEPTION

				WHEN others THEN

					CLOSE c_ae_events;
					RAISE_APPLICATION_ERROR(-20100,SQLERRM||' :- Unable to retrieve sequence from CMCS_TRANS_SEQUENCE, p_transfer_ae_orders_out HALTED');

			END;

			/*****************************************************************************/
			/* Prepare record for insert into CMCS_TRANSFER_CONTROL                      */
			/*****************************************************************************/
		
			v_transfer_control.trans_seq 				:= v_sequence;
			v_transfer_control.transfer_type			:= 'O';
			v_transfer_control.transfer_number			:= v_ae_number;
			v_transfer_control.sending_court_code		        := v_send_crt_code;
			v_transfer_control.receiving_court_code		        := v_recv_crt_code;
			v_transfer_control.transfer_request_date	        := v_date_entered;
			v_transfer_control.central_receipt_date		        := sysdate;
			v_transfer_control.date_transferred			:= NULL;
			v_transfer_control.transfer_status			:= 1;
			v_transfer_control.attempt				:= NULL;

			/*****************************************************************************/
			/* Prepare record for insert into CMCS_CAPS_ORDERS                           */
			/*****************************************************************************/
	
			v_caps_orders.trans_seq					:= v_sequence; 													-- NOT NULL
			v_caps_orders.issued_by 				:= v_send_crt_code;												-- NOT NULL
			v_caps_orders.order_status				:= sups_ae_order_transfer_pack.f_get_order_status(v_std_event_id);	-- NOT NULL
			v_caps_orders.case_number				:= v_case_number;												-- NOT NULL
			v_caps_orders.ae_number					:= v_ae_number;													-- NOT NULL
			v_caps_orders.caps_sequence				:= v_caps_sequence;
			v_caps_orders.ae_type					:= sups_ae_order_transfer_pack.f_get_ae_type(v_std_event_id);		-- NOT NULL
			v_caps_orders.def_occupation			        := v_debtor_occupation;											-- NOT NULL
			v_caps_orders.def_pay_ref				:= v_payroll_number;											-- NOT NULL
			v_caps_orders.ndr_amount				:= v_normal_deduction_rate;										-- NOT NULL
			v_caps_orders.ndr_period				:= v_normal_deduction_period;									-- NOT NULL
			v_caps_orders.per_amount				:= v_protected_earnings_rate;									-- NOT NULL
			v_caps_orders.per_period				:= v_protected_earnings_period;									-- NOT NULL

			/*************************************************************/
			/* When the NDR_PERIOD and PER_PERIOD are equal to 'MTH' the */
			/* paid_monthly_flag should equal = 'Y', otherwise should    */
			/* equal ae_events.report_value_1                            */
			/*************************************************************/

			IF v_normal_deduction_period = 'MTH' AND v_protected_earnings_period = 'MTH' THEN

				v_caps_orders.paid_monthly_flag := 'Y';

			ELSE

				v_caps_orders.paid_monthly_flag := v_report_value_1;												-- NOT NULL

			END IF;

			v_caps_orders.order_amount				:= sups_ae_order_transfer_pack.f_get_order_amount(v_std_event_id,v_ae_number);
			v_caps_orders.order_amount_currency                     := 'GBP';
			v_caps_orders.date_of_order				:= v_event_date;												-- NOT NULL
			v_caps_orders.judg_crt_code				:= sups_ae_order_transfer_pack.f_get_judg_crt_code(v_judg_seq);
			v_caps_orders.order_required_flag		        := v_report_value_3;											-- NOT NULL
			v_caps_orders.dj_order_flag				:= v_report_value_2;											-- NOT NULL
			v_caps_orders.transfer_status			        := '1';
           															-- NOT NULL

			/****************************************************/
			/* Retrieve CREDITOR details, for current AE number */
			/****************************************************/

                        sups_ae_order_transfer_pack.p_get_creditor_detail(v_ae_number                ,
							                  v_caps_orders.pltf_code    ,
							                  v_caps_orders.pltf_name    , 
							                  v_caps_orders.pltf_addr1   ,
							                  v_caps_orders.pltf_addr2   ,
							                  v_caps_orders.pltf_addr3   ,
							                  v_caps_orders.pltf_addr4   ,
							                  v_caps_orders.pltf_addr5   ,
							                  v_caps_orders.pltf_postcode,
							                  v_caps_orders.pltf_tel     ,
							                  v_caps_orders.pltf_dx      ,
							                  v_caps_orders.pltf_fax     ,
							                  v_caps_orders.pltf_email   ,
							                  v_caps_orders.pltf_pcm     ,
							                  v_caps_orders.pltf_ref     );



	
			/*************************************************/
			/* Retrieve PAYEE details, for current AE number */
			/*************************************************/


                        sups_ae_order_transfer_pack.p_get_payee_detail(v_ae_number                  ,
			                                               v_caps_orders.payee_code     ,
			                                               v_caps_orders.payee_name     , 
			                                               v_caps_orders.payee_addr1    ,
			                                               v_caps_orders.payee_addr2    ,
			                                               v_caps_orders.payee_addr3    ,
			                                               v_caps_orders.payee_addr4    ,
			                                               v_caps_orders.payee_addr5    ,
			                                               v_caps_orders.payee_postcode ,
			                                               v_caps_orders.payee_tel      ,
			                                               v_caps_orders.payee_dx       ,
			                                               v_caps_orders.payee_fax      ,
       		                                                       v_caps_orders.payee_email    ,
			                                               v_caps_orders.payee_pcm      ,
			                                               v_caps_orders.payee_ref      );




			/**************************************************/
			/* Retrieve DEBTOR details, for current AE number */
			/**************************************************/

			sups_ae_order_transfer_pack.p_get_debtor_detail(v_ae_number                  ,
			                                                v_caps_orders.def_name       ,
			                                                v_caps_orders.def_addr1      ,
			                                                v_caps_orders.def_addr2      ,
			                                                v_caps_orders.def_addr3      ,
			                                                v_caps_orders.def_addr4      ,
			                                                v_caps_orders.def_addr5      ,
			                                                v_caps_orders.def_postcode   ,
                                                                        v_caps_orders.def_tel        ,
                                                                        v_caps_orders.def_dx         ,
                                                                        v_caps_orders.def_fax        ,
                                                                        v_caps_orders.def_email      ,
			                                                v_caps_orders.def_pcm        ,
			                                                v_caps_orders.def_pay_ref    );


	
			/****************************************************/
			/* Retrieve EMPLOYER details, for current AE number */
			/****************************************************/

                        sups_ae_order_transfer_pack.p_get_employer_detail(v_ae_number                  ,
			                                                  v_caps_orders.empl_code      ,
			                                                  v_caps_orders.empl_name      ,
			                                                  v_caps_orders.empl_addr1     ,
			                                                  v_caps_orders.empl_addr2     ,
			                                                  v_caps_orders.empl_addr3     ,
			                                                  v_caps_orders.empl_addr4     ,
                                                                          v_caps_orders.empl_addr5     ,
			                                                  v_caps_orders.empl_postcode  ,
			                                                  v_caps_orders.empl_tel       ,
                                                                          v_caps_orders.empl_dx        ,
                                                                          v_caps_orders.empl_fax       ,
                                                                          v_caps_orders.empl_email     ,
                                                                          v_caps_orders.empl_pcm       ,
			                                                  v_caps_orders.empl_ref       );

			/*****************************************************/
			/* Retrieve WORKPLACE details, for current AE number */
			/*****************************************************/
	

			sups_ae_order_transfer_pack.p_get_workplace_detail(v_ae_number,
			                                                   v_caps_orders.work_addr1     ,
			                                                   v_caps_orders.work_addr2     ,
			                                                   v_caps_orders.work_addr3     ,
			                                                   v_caps_orders.work_addr4     ,
			                                                   v_caps_orders.work_addr5     ,
			                                                   v_caps_orders.work_postcode  ,
                                                                           v_caps_orders.work_tel       ,
                                                                           v_caps_orders.work_dx        ,
                                                                           v_caps_orders.work_fax       ,
                                                                           v_caps_orders.work_email     ,
                                                                           v_caps_orders.work_pcm       );


                       /*******************************************************/
                       /* Before insert, check if record already exists at SP */
                       /* If it does then update else insert record           */
                       /* Change for 1.10,scr 654 (SG)                        */
                       /*******************************************************/
                       sups_ae_order_transfer_pack.p_check_record_exists(v_ae_number,v_case_number,p_debug,
                                                                    v_trans_seq_for_update,v_exists,v_error_flag);
                      
                       IF v_exists = 'Y' THEN

                		/******************************************/
			        /* Update record in CMCS_TRANSFER_CONTROL */
		             	/************************************(((***/
              
                              	sups_ae_order_transfer_pack.p_update_transfer_control(v_trans_seq_for_update,v_error_flag);

                              	IF v_error_flag = 'N' then 
                              	
				      /****************************************/
	      			      /* Update details into CMCS_CAPS_ORDERS */
		      		      /****************************************/
	
				      sups_ae_order_transfer_pack.p_update_caps_orders(	v_ae_number,
				      							v_case_number,
                                                                          		v_trans_seq_for_update,
                                                                          		p_debug,v_error_flag);
                      
                             	END IF;
                       ELSIF v_exists = 'N' THEN      


                		/********************************************/
			        /* Insert record into CMCS_TRANSFER_CONTROL */
		             	/********************************************/

			        sups_ae_order_transfer_pack.p_insert_transfer_control(v_error_flag);

             			/*****************************************************************/
		            	/* If no error has been raised continue processing               */
			        /* If an error has been raised while attemping an insert         */
			        /* into CMCS_TRANSFER_CONTROL, skip further processing for record*/
		            	/*****************************************************************/
			            
			      	IF v_error_flag = 'N' THEN

            				/****************************************/
		            		/* Insert details into CMCS_CAPS_ORDERS */
			            	/****************************************/
	
					sups_ae_order_transfer_pack.p_insert_caps_orders(p_debug,v_error_flag);

                              	END IF;
                        END IF;

				/****************************************************************/
				/* If no error has been raised continue processing              */
				/* If an error has been raised while attemping an insert        */
				/* into CMCS_CAPS_ORDERS, halt processing for current record and*/
				/* issue a ROLLBACK to clean up partially completed transaction */
				/****************************************************************/

				IF v_error_flag = 'N' THEN

					/****************************************************/
					/* Update PROCESS_STAGE for current AE_EVENT record */
					/****************************************************/

					sups_ae_order_transfer_pack.p_update_process_stage(v_row_id,'TRAN',v_error_flag);

					/******************************************************************/
					/* If no error has been raised continue processing                */
					/* If an error has been raised while attemping an update          */
					/* of AE_EVENTS, issue a ROLLBACK to clean up partially completed */
					/* transaction                                                    */
					/******************************************************************/

					IF v_error_flag = 'N' THEN

						/**********************************************************/
						/* Transaction is valid                                   */
						/* Issue a COMMIT to save current transaction to database */
						/**********************************************************/

						COMMIT;
		
					END IF;

				END IF;

			--END IF;

		END LOOP;

		CLOSE c_ae_events;
		
		
                /******************************************************************/
                /* Process the events having NULL report values          	  */
		/* If Report_value_1/2/3 are null then write an error to          */
		/* TRANSFER_ERROR_LOG and do not attempt to process this record   */
		/* since it will only fail on attempting an insert into           */
		/* CMCS_CAPS_ORDERS and not enough info will be written to the log*/
		/* at that stage to facilitate support                            */
		/******************************************************************/
		OPEN c_ae_events_null_report_values;
		LOOP
			FETCH c_ae_events_null_report_values
			INTO v_row_id, 
				 v_ae_event_seq,
				 v_ae_number,
				 v_date_entered,
				 v_std_event_id,
				 v_case_number,
				 v_event_date,
                                 v_send_crt_code,
                                 v_report_value_1,
				 v_report_value_2,
				 v_report_value_3 ;
                                
			EXIT WHEN c_ae_events_null_report_values%NOTFOUND;
			
			/***************************************************************/
			/* Write all details directly to the TRANSFER_ERROR_LOG        */
			/***************************************************************/
			
			IF p_debug = 'Y' THEN

					DBMS_OUTPUT.PUT_LINE('************************************************************************************');
					DBMS_OUTPUT.PUT_LINE('* (DEBUGGING) NULL REPORT_VALUE COLS -- INSERTING ROWS INTO TRANSFER_ERROR_LOG     *');
					DBMS_OUTPUT.PUT_LINE('************************************************************************************');		
					DBMS_OUTPUT.PUT_LINE('CASE_NUMBER	:'||v_case_number);
					DBMS_OUTPUT.PUT_LINE('AE_NUMBER     	:'||v_ae_number);
					DBMS_OUTPUT.PUT_LINE('AE_EVENT_SEQ     	:'||v_ae_event_seq);

			END IF;	
		
			v_transfer_error_log.transfer_date	:= v_date_entered;
			v_transfer_error_log.transfer_type	:= 'O';
			v_transfer_error_log.sending_court	:= v_send_crt_code;
			v_transfer_error_log.case_number	:= v_case_number;
			v_transfer_error_log.error_message	:= 'AE_EVENT_SEQ: ' || v_ae_event_seq || ', AE: '|| v_ae_number || ', REPORT VALUE(S) ';
				
						
			if v_report_value_1 IS NULL THEN					
				v_transfer_error_log.error_message := v_transfer_error_log.error_message || ' 1 ';			
			END IF;
				
			if v_report_value_2 IS NULL THEN						
				v_transfer_error_log.error_message := v_transfer_error_log.error_message || ' 2 ';				
			END IF;
				
			if v_report_value_3 IS NULL THEN
				v_transfer_error_log.error_message := v_transfer_error_log.error_message || ' 3 ';							
			END IF;	
			
			v_transfer_error_log.error_message := v_transfer_error_log.error_message || ' NULL - NO CAPS EXTRACTION ';
			sups_ae_order_transfer_pack.p_insert_error_log;	
			
			/****************************************************/
			/* Update PROCESS_STAGE for current AE_EVENT record */
			/****************************************************/

			sups_ae_order_transfer_pack.p_update_process_stage(v_row_id,'TRAN',v_error_flag);
	
			IF v_error_flag = 'N' THEN
			
				/**********************************************************/
				/* Transaction is valid                                   */
				/* Issue a COMMIT to save current transaction to database */
				/**********************************************************/

				COMMIT;
		
			END IF;			
		END LOOP;

		CLOSE c_ae_events_null_report_values;
		
		
	EXCEPTION

		WHEN others THEN

			ROLLBACK;
			RAISE_APPLICATION_ERROR(-20100,'ERROR : p_transfer_ae_orders_out'||CHR(10)||SQLERRM);

	END p_transfer_ae_orders_out;




END sups_ae_order_transfer_pack;
/
-- SHOW ERRORS

/**********************************************************************************************************************/
/*                                             G R A N T S                                                            */
/**********************************************************************************************************************/

--GRANT EXECUTE ON sups_ae_order_transfer_pack to CASM_USER;