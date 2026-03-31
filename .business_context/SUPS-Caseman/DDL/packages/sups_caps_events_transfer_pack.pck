/*************************************************************************************/
/* Module     : SUPS_CAPS_EVENTS_TRANSFER_PACK.sql                                   */
/* Description: SUPS to SUPS Transfer Script.                                        */
/*              Derived from a Legacy Caseman Central Server script :-               */
/*                  caps_events_transfer_pack.sql                                    */
/*              Responsible for transfer of Event data relating to Attachment of     */
/*              Earnings from the SUPS CAPS database to SUPS CaseMan database.       */
/*              Where the Attachment of earnings Payments System                     */
/*              identifies that an event has been recorded on an AE order which      */
/*              requires notification to the local court, a row will be created in   */
/*              the staging tables in SUPS Caseman.                                  */
/*              This processing is performed by "p_transfer_ae_events_to_cmcs()"     */
/*              which transfers all events relating to SUPS Centralised Courts.      */
/*              This package is also responsible for the transfer of that data to the*/
/*              appropriate SUPS CaseMan tables. For each row in the staging tables  */
/*              a corresponding row will be created in AE_EVENTS table of the main   */
/*              SUPS Caseman database. The staging table row will then be updated to */
/*              indicate the success or failure of the transfer.                     */
/*              This is performed by "p_transfer_ae_orders_in()" on a Court by Court */
/*              basis.                                                               */
/*-----------------------------------------------------------------------------------*/
/* The following statuses are set, depending on transfer success/failure :           */
/*          2 - Successful Transfer                                                  */
/*			P - Failed attempting to insert into AE_EVENTS                           */
/*          Q - Failed attempting to insert into CAPS_PAYMENTS                       */
/*          R - Failed attempting to delete from CAPS_PAYMENTS                       */
/*          S - Failed attempting to insert into PAYMENTS                            */
/*          T - Failed attempting to select f_calculate_outstanding_bal              */
/*          U - Failed attempting to select AE_EVENT_SEQ                             */
/*          V - Failed attempting to update AE_APPLICATIONS                          */
/*          W - Failed attempting to select from SYSTEM_DATA                         */
/*-----------------------------------------------------------------------------------*/	
/* Author     : Anthony Keith                                                        */
/* Date       : 29/04/1998                                                           */
/*-----------------------------------------------------------------------------------*/
/* Version Control                                                                   */
/* ---------------                                                                   */
/* Version	Date		Name			Amendment									 */
/*-----------------------------------------------------------------------------------*/
/* 1.0      29/04/1998  Anthony Keith	Original Version			     */
/* 1.1      07/07/1998  Anthony Keith   Function f_calculate_outstanding_bal has     */
/*                                      moved to CM_AE_PACKAGE.SQL (AE_PACKAGE),     */
/*                                      called from p_calc_local_outstanding_bal     */
/* 1.2      01/02/2000  Carl Davies     SCR99 - Proc p_select_system_data -          */
/*                                      v_select_string changed from item_value+1 to */
/*                                      just item_value                              */
/* 1.3      02/02/2006  Phil Haferer    Created SUPS version of the script.          */
/*                                                                                   */
/* 1.4      12/06/2007  Chris Hutt      Defect Group2 5051 :                         */
/*                                      'SupsCAPSAeEventTransfer' to long for audits */
/*                                      app context.                                 */
/*                                      Abbreviated to 'SupsCAPSAeEventXfer'         */
/*                                                                                   */
/* 1.5      18/07/2007  Chris Hutt      Defect Group2 5227                           */
/*                                      PAYAMENTS.ENFORCEMENT_COURT_CODE not being   */
/*                                      populated                                    */
/*                                                                                   */
/* 1.6      02/10/2007  Paul Scanlon    Defect Group2 5380                           */
/*                                      deleting of staging tables in procedure      */
/*                                      P_TRANSFER_CLEARDOWN now uses <= operator    */
/*                                      rather than <.                               */ 
/*                                      Added extra condition to Statement that      */
/*                                      deletes from CMCS_TRANSFER_CONTROL to ensure */
/*                                      only successfully transferred records are    */
/*                                      deleted.                                     */
/*************************************************************************************/

--INSERT INTO cmcs_transfer_status VALUES ('P','Failed inserting AE_EVENTS');
--INSERT INTO cmcs_transfer_status VALUES ('Q','Failed inserting CAPS_PAYMENTS');
--INSERT INTO cmcs_transfer_status VALUES ('R','Failed deleting CAPS_PAYMENTS');
--INSERT INTO cmcs_transfer_status VALUES ('S','Failed inserting PAYMENTS');
--INSERT INTO cmcs_transfer_status VALUES ('T','Failed on balance calculation');
--INSERT INTO cmcs_transfer_status VALUES ('U','Failed selecting AE_EVENT_SEQ');
--INSERT INTO cmcs_transfer_status VALUES ('V','Failed updating AE_APPLICATION');
--INSERT INTO cmcs_transfer_status VALUES ('W','Failed selecting SYSTEM_DATA');
--COMMIT;

/**********************************************************************************************************************/
/*                                                 P A C K A G E                                                      */
/**********************************************************************************************************************/

CREATE OR REPLACE PACKAGE sups_caps_events_transfer_pack IS

	v_ae_events				cmcs_ae_events%ROWTYPE;
	v_caps_payments			cmcs_caps_payments%ROWTYPE;
	v_no_error				CONSTANT cmcs_transfer_status.ts_status%TYPE := '2';		
	v_error_1				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'P';
	v_error_2				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'Q';
	v_error_3				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'R';
	v_error_4				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'S';
	v_error_5				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'T';
	v_error_6				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'U';
	v_error_7				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'V';
	v_error_8				CONSTANT cmcs_transfer_status.ts_status%TYPE := 'W';

    /* Constants: Transfer Status. */
    C_TRANSFER_STATUS_READY      CONSTANT cmcs_cases.transfer_status%type := '1';
    C_TRANSFER_STATUS_SUCCESSFUL CONSTANT cmcs_cases.transfer_status%type := '2';
  
	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_debug_output                                                                                  */
	/* DESCRIPTION	: When used, will send output to the screen, allowing developers to test/debug code.              */
	/*                eg. Will show each AE event processed, and success failure of called packages.                  */
	/*                SERVEROUTPUT must be set to ON, in order to take advantage of this information                  */
 	/******************************************************************************************************************/

	PROCEDURE p_debug_output (p_debug IN CHAR,p_module IN VARCHAR2,p_value IN VARCHAR2,p_error IN VARCHAR2);

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_formatted_put_line                                                                            */
	/* DESCRIPTION	: Avoids the Oracle error "ORU-10028: line length overflow, limit of 255 bytes per line error"    */
 	/******************************************************************************************************************/

	PROCEDURE p_formatted_put_line (p_string IN VARCHAR2);

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_check_database_available                                                                      */
	/* DESCRIPTION	: Check remote database is available                                                              */
 	/******************************************************************************************************************/

	PROCEDURE p_check_database_available;


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_select_next_ae_seq                                                                            */
	/* DESCRIPTION	: Retrieve the next sequence number from AE_EVENT_SEQ on local court                              */
	/******************************************************************************************************************/

	PROCEDURE p_select_next_ae_seq(p_ae_event_seq OUT NUMBER,p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_select_system_data                                                                            */
	/* DESCRIPTION	: Increment SYSTEM_DATA.ITEM_VALUE by 1, SELECT NEW value from SYSTEM_DATA.ITEM_VALUE             */
	/******************************************************************************************************************/

	PROCEDURE p_select_system_data(p_admin_court_code IN system_data.admin_court_code%TYPE,p_item IN system_data.item%TYPE,p_item_value OUT system_data.item_value%TYPE,p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_local_ae_events                                                                        */
	/* DESCRIPTION	: Insert records into ae_events table                                                             */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_local_ae_events(p_ae_event_seq IN NUMBER,p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_update_local_ae_applications                                                                  */
	/* DESCRIPTION	: Update records on ae_applications table in SUPS Caseman database                                */
 	/******************************************************************************************************************/

	PROCEDURE p_update_local_ae_applications(p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_local_caps_payments                                                                    */
	/* DESCRIPTION	: Insert records into caps_payments table in the SUPS Caseman database                            */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_local_caps_payments(p_ae_event_seq IN NUMBER,p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_local_payments                                                                         */
	/* DESCRIPTION	: Insert records into payments table situated on SUPS Caseman database                            */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_local_payments(p_payment_amount IN NUMBER,p_payment_amount_currency IN VARCHAR2,p_court_code IN courts.code%TYPE,p_date IN DATE,p_retention_type IN payments.retention_type%TYPE,p_ae_number IN ae_events.ae_number%TYPE,p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_delete_local_caps_payments                                                                    */
	/* DESCRIPTION	: Delete records from caps_payments table situated on local courts database                       */
 	/******************************************************************************************************************/

	PROCEDURE p_delete_local_caps_payments(p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');


	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_calc_local_outstanding_bal                                                                    */
	/* DESCRIPTION	: Calculate the outstanding balance of AE, using dynamic SQL to call                              */
    /*                ae_transfer_order_pack.f_calculate_outstanding_bal on local courts database                     */
 	/******************************************************************************************************************/

	PROCEDURE p_calc_local_outstanding_bal (p_outstanding_bal OUT NUMBER,p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR DEFAULT 'N');

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                        */
	/* NAME			: f_calculate_outstanding_bal                                                                     */
	/* DESCRIPTION	: Calculate the outstanding balance of AE  (PER: 02AEN01026)                                      */
	/*                (02-Jan-2006 - Extracted from the legacy court ae_package).                                     */
	/******************************************************************************************************************/

	FUNCTION f_calculate_outstanding_bal (f_ae_number IN ae_events.ae_number%TYPE) RETURN NUMBER;
	
	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_transfer_ae_orders_in                                                                         */
	/* DESCRIPTION	: Transfers records from SUPS Caseman Central Server staging tables to the main SUPS Caseman      */
	/*                databases tables.                                                                               */
	/*                p_court_code is used to select receiving_court_code from TRANSFER_CONTROL (c_ae_events)         */
	/*                p_date replaces any use of sysdate, whenever used (eg. p_insert_local_payments)                 */ 
 	/******************************************************************************************************************/

	PROCEDURE p_transfer_ae_orders_in(p_court_code IN courts.code%TYPE,p_date DATE DEFAULT NULL,p_debug IN CHAR DEFAULT 'N');

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_transfer_ae_events_to_cmcs                                                                    */
	/* DESCRIPTION	: Transfers AE Event records from SUPS CAPS to SUPS Caseman's 'CaseMan Central Server' staging    */
	/*                tables.                                                                                         */
 	/******************************************************************************************************************/

	PROCEDURE p_transfer_ae_events_to_cmcs;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_transfer_clear_down                                                                           */
    /* DESCRIPTION	: Deletes rows from the following staging tables that have been successfully transferred over     */
    /*                3 days prior :-                                                                                 */
    /*                  CMCS_AE_EVENTS and CMCS_CAPS_PAYMENTS                                                         */
    /*                Also, the CMCS_TRANSFER_CONTROL table is also cleared down of records more than 50 days old.    */
    /******************************************************************************************************************/

    PROCEDURE p_transfer_clear_down;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_trans_caps_ae_events_to_caseman                                                               *
    /* DESCRIPTION	: This procedure will perform the complete transfer, end to end, of Attachment of Earnings from   */
    /*                SUPS CAPS to SUPS Caseman, via staging tables, and will also perform housekeeping on those      */
    /*                staging tables.                                                                                 */
    /*                It calls the three main entry points :-                                                         */
    /*                  p_transfer_ae_events_to_cmcs(), p_transfer_ae_orders_in() and p_transfer_clear_down().        */
    /*                If this implementation does not suit scheduling requirements, these entry points may called     */
    /*                individually, as appropriate.                                                                   */
    /******************************************************************************************************************/
    PROCEDURE p_trans_caps_events_to_caseman(pv_user in VARCHAR2, pv_clear_down in CHAR DEFAULT 'Y');

END sups_caps_events_transfer_pack;
/
/**********************************************************************************************************************/
/*                                            P A C K A G E  B O D Y                                                  */
/**********************************************************************************************************************/

CREATE OR REPLACE PACKAGE BODY sups_caps_events_transfer_pack IS

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_debug_output                                                                                  */
	/* DESCRIPTION	: When used, will send output to the screen, allowing developers to test/debug code.              */
	/*                eg. Will show each AE event processed, and success failure of called packages.                  */
	/*                SERVEROUTPUT must be set to ON, in order to take advantage of this information                  */
 	/******************************************************************************************************************/

	PROCEDURE p_debug_output (p_debug IN CHAR,p_module IN VARCHAR2,p_value IN VARCHAR2,p_error IN VARCHAR2) IS

	BEGIN

		IF p_debug = 'Y' THEN

			p_formatted_put_line(
				'----------------------------------------'||CHR(10)||
			    'Date/Time: '||TO_CHAR(sysdate,'DD/MM/YY HH24:MI:SS')||CHR(10)||
			    'Module: '||p_module||CHR(10)||
			    NVL(p_error,p_value));

		END IF;
	
	END p_debug_output;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_formatted_put_line                                                                            */
	/* DESCRIPTION	: Avoids the Oracle error "ORU-10028: line length overflow, limit of 255 bytes per line error"    */
 	/******************************************************************************************************************/

	PROCEDURE p_formatted_put_line (p_string IN VARCHAR2)
	IS
	   v_curr_pos     INTEGER;
	   v_length       INTEGER;
	   v_printed_to   INTEGER;
	   v_last_ws      INTEGER;
	   skipping_ws    BOOLEAN;
	   c_len          CONSTANT INTEGER := 160;
	   ------------------------------------------------------
	   -- All 3 variables must be modified at the same time.
	   c_max_len      CONSTANT INTEGER := 10000;
	   v_string       VARCHAR2 (10002);
	   ------------------------------------------------------
	   v_len_total    INTEGER;
	   
	BEGIN
	   -------------------------------------------------------------------------
	   -- Case 1: Null string.
	   -------------------------------------------------------------------------
	   IF (p_string IS NULL)
	   THEN
	      DBMS_OUTPUT.new_line;
	      RETURN;
	   END IF;
	
	   -------------------------------------------------------------------------
	   -- Case 2: Recursive calls for very long strings! (hard line breaks)
	   -------------------------------------------------------------------------
	   v_len_total:=LENGTH (p_string);
	   
	   IF (v_len_total > c_max_len)
	   THEN
	      p_formatted_put_line(SUBSTR (p_string, 1, c_max_len));
	      p_formatted_put_line(SUBSTR (p_string, c_max_len+1, v_len_total-c_max_len));
	      RETURN;
	   END IF;
	   
	   -------------------------------------------------------------------------
	   -- Case 3: Regular start here.
	   -------------------------------------------------------------------------     
	   v_string := p_string;
	   
	   -------------------------------------------------------------------------
	   -- Remove EOL characters!
	   -------------------------------------------------------------------------
	   --
	   -- Strip only last linefeed characters
	   --
	   v_string := RTRIM (v_string, CHR (10));                     --New Line
	   v_string := RTRIM (v_string, CHR (13));              --Carriage Return
	        
	   --------------------------------------------------------------------------
	   -- Main algorithm
	   --------------------------------------------------------------------------
	   v_length     := LENGTH (v_string);
	   v_curr_pos   :=  1;                 -- current position (Start with 1.ch.)
	   v_printed_to :=  0;                 -- string was printed to this mark
	   v_last_ws    :=  0;                 -- position of last blank
	
	   WHILE v_curr_pos <= v_length
	   LOOP
	      IF SUBSTR (v_string, v_curr_pos, 1) = ' '      -- blank found
	      THEN
	         v_last_ws := v_curr_pos;
	      ELSE
	         skipping_ws := FALSE;
	      END IF;
	
	      IF (v_curr_pos >= (v_printed_to + c_len))
	      THEN
	         IF (
	              (v_last_ws <= v_printed_to)          -- 1) no blank found
	                    OR                             -- 2) next char is blank
	                                                   --    (ignore last blank)
	              ((v_curr_pos < v_length) AND (SUBSTR(v_string,v_curr_pos+1,1) = ' '))
	                    OR
	              (v_curr_pos = v_length)              -- 3) end of string
	            )
	         THEN
	            -------------------------------------
	            -- Hard break (no blank found)
	            -------------------------------------
	            DBMS_OUTPUT.put_line (SUBSTR (v_string,
	                                          v_printed_to + 1,
	                                          v_curr_pos - v_printed_to
	                                         )
	                                 );
	            v_printed_to := v_curr_pos;
	            skipping_ws  := TRUE;
	         ELSE
	            ----------------------------------
	            -- Line Break on last blank
	            ----------------------------------
	            DBMS_OUTPUT.put_line (SUBSTR (v_string,
	                                          v_printed_to + 1,
	                                          v_last_ws - v_printed_to
	                                         )
	                                 );
	            v_printed_to := v_last_ws;
	            
	            IF (v_last_ws = v_curr_pos)
	            THEN
	               skipping_ws := TRUE;
	            END IF;
	            
	         END IF;
	      END IF;
	
	      v_curr_pos := v_curr_pos + 1;
	   END LOOP;
	
	   DBMS_OUTPUT.put_line (SUBSTR (v_string, v_printed_to + 1));
	END p_formatted_put_line;
	

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_check_database_available                                                                      */
	/* DESCRIPTION	: Check remote database is available                                                              */
 	/******************************************************************************************************************/

	PROCEDURE p_check_database_available IS

		cursor c_check_link is
			select dummy from dual@caps_link;

		v_dummy		CHAR(1);

	BEGIN
		OPEN c_check_link;
		FETCH c_check_link INTO v_dummy;
		CLOSE c_check_link;
    EXCEPTION
      WHEN OTHERS THEN
        CLOSE c_check_link;
		ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Cannot connect to SUPS CAPS database.');
        DBMS_OUTPUT.PUT_LINE(sqlerrm);
	    RAISE_APPLICATION_ERROR(-20001,'Unable to connect to SUPS CAPS database.');

	END p_check_database_available;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_select_next_ae_seq                                                                            */
	/* DESCRIPTION	: Retrieve the next sequence number from AE_EVENT_SEQ.                                            */
	/******************************************************************************************************************/

	PROCEDURE p_select_next_ae_seq(
		p_ae_event_seq    OUT NUMBER,
		p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,
		p_debug           IN CHAR) IS

		CURSOR c_ae_event_seq IS
			select ae_event_seq.nextval from dual;
		
		v_ae_event_seq		NUMBER(10);

	BEGIN
		BEGIN
			OPEN c_ae_event_seq;
			FETCH c_ae_event_seq INTO v_ae_event_seq;
			CLOSE c_ae_event_seq; 

			/***************************************************************************************************/
			/* No error has occured, set transfer status to V_NO_ERROR, pass ae_event_seq back to main program */
			/***************************************************************************************************/
			p_transfer_status := v_no_error;
			p_ae_event_seq := v_ae_event_seq;
			p_debug_output (p_debug,'PROCEDURE p_select_next_ae_seq','p_ae_event_seq: '||TO_CHAR(v_ae_event_seq),NULL);
		EXCEPTION
			WHEN others THEN
				/*************************************************************************/
				/* If an error was raised while attempting to select from                */
				/* courts ae_event_seq sequence, set transfer status to V_ERROR_6        */
				/*************************************************************************/
				CLOSE c_ae_event_seq; 
				p_transfer_status := v_error_6;
				p_debug_output (p_debug,'PROCEDURE p_select_next_ae_seq',NULL,SQLERRM);
		END;

	END p_select_next_ae_seq;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_select_system_data                                                                            */
	/* DESCRIPTION	: Increment SYSTEM_DATA.ITEM_VALUE by 1, SELECT NEW value from SYSTEM_DATA.ITEM_VALUE             */
	/******************************************************************************************************************/

	PROCEDURE p_select_system_data(
		p_admin_court_code  IN system_data.admin_court_code%TYPE,
		p_item              IN system_data.item%TYPE,
		p_item_value        OUT system_data.item_value%TYPE,
		p_transfer_status   OUT cmcs_transfer_status.ts_status%TYPE,
		p_debug             IN CHAR) IS

		CURSOR c_system_data IS 
			SELECT sd.item_value 
			FROM   system_data sd
			WHERE  sd.admin_court_code = p_admin_court_code
			AND    sd.item             = p_item;

		v_item_value system_data.item_value%TYPE;

	BEGIN
		BEGIN
			p_transfer_status := v_no_error;

			OPEN c_system_data;
			FETCH c_system_data INTO v_item_value;
			CLOSE c_system_data;
		EXCEPTION
			WHEN others THEN
				/**************************************************************/
				/* If an error was raised while attempting to select from     */
				/* remote table SYSTEM_DATA, set transfer status to V_ERROR_8 */
				/**************************************************************/
				p_transfer_status := v_error_8;
				p_debug_output (p_debug,'PROCEDURE p_select_system_data',NULL,'Error when selecting from SYSTEM_DATA');
		END;
			
		IF p_transfer_status = v_no_error THEN
  		BEGIN
  			/********************************************************/
  			/* Increment SYSTEM_DATA.ITEM_VALUE by 1 on local court */
  			/********************************************************/
  			UPDATE system_data sd
  			SET    item_value = item_value + 1 
  			WHERE  sd.admin_court_code = p_admin_court_code
  			AND    sd.item             = p_item;
  
  			/***************************************************************************************************/
  			/* No error has occured.                                                                           */
  			/***************************************************************************************************/
  			p_item_value := v_item_value;
  			p_debug_output (p_debug,'PROCEDURE p_select_system_data','p_item_value: '||TO_CHAR(v_item_value),NULL);
  		EXCEPTION
  			WHEN others THEN
  				/**************************************************************/
  				/* If an error was raised while attempting to select from     */
  				/* remote table SYSTEM_DATA, set transfer status to V_ERROR_8 */
  				/**************************************************************/
  				p_transfer_status := v_error_8;
  				p_debug_output (p_debug,'PROCEDURE p_select_system_data',NULL,SQLERRM);
  		END;
    END IF;

	END p_select_system_data;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_local_ae_events                                                                        */
	/* DESCRIPTION	: Insert records into ae_events table situated on local courts database                           */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_local_ae_events(
		p_ae_event_seq IN NUMBER,p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,p_debug IN CHAR) IS
		
	BEGIN
		INSERT INTO ae_events 
		(ae_event_seq
		,ae_number
		,event_date
		,date_entered
		,std_event_id
		,details
		,error_indicator
		,username
		,process_stage
		) VALUES 
		(p_ae_event_seq
		,v_ae_events.ae_number
		,v_ae_events.event_date
		,v_ae_events.date_entered
		,v_ae_events.std_event_id
		,v_ae_events.details
		,v_ae_events.error_indicator
		,v_ae_events.username
		,'CAPS'
		);

		/***********************************************************/
		/* No error has occured, set transfer status to V_NO_ERROR */
		/***********************************************************/
		p_transfer_status := v_no_error;
		p_debug_output (p_debug,'PROCEDURE p_insert_local_ae_events','Insert completed successfully',NULL);
	EXCEPTION 
		WHEN others THEN
			/*******************************************************************/
			/* If an error was raised while attempting to insert into          */
            /* remote courts ae_events table, set transfer status to V_ERROR_1 */
			/*******************************************************************/
			p_transfer_status := v_error_1;
			p_debug_output (p_debug,'PROCEDURE p_insert_local_ae_events',NULL,SQLERRM);
	END p_insert_local_ae_events;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_update_local_ae_applications                                                                  */
	/* DESCRIPTION	: Update records on ae_applications table in SUPS Caseman database                                */
 	/******************************************************************************************************************/

	PROCEDURE p_update_local_ae_applications(
		p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,
		p_debug           IN CHAR) IS
		
	BEGIN
		BEGIN
			UPDATE ae_applications
			SET    caps_sequence = v_ae_events.caps_sequence
			WHERE  ae_number = v_ae_events.ae_number;
		
			/***********************************************************/
			/* No error has occured, set transfer status to V_NO_ERROR */
			/***********************************************************/
			p_transfer_status := v_no_error;
			p_debug_output (p_debug,'PROCEDURE p_update_local_ae_applications','Update completed successfully',NULL);

		EXCEPTION

			WHEN others THEN

				/*************************************************************************/
				/* If an error was raised while attempting to update                     */
                /* remote courts ae_applications table, set transfer status to V_ERROR_7 */
				/*************************************************************************/
				p_transfer_status := v_error_7;
				p_debug_output (p_debug,'PROCEDURE p_update_local_ae_applications',NULL,SQLERRM);

		END;

	END p_update_local_ae_applications;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_local_caps_payments                                                                    */
	/* DESCRIPTION	: Insert records into caps_payments table situated on local courts database                       */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_local_caps_payments(
		p_ae_event_seq    IN NUMBER,
		p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,
		p_debug           IN CHAR DEFAULT 'N') IS

	BEGIN
		BEGIN
			INSERT INTO caps_payments
			(ae_number
			,caps_trans_no
			,payment_date
			,amount
			,amount_currency
			,notes
			,ae_event_seq
			) VALUES 
			(v_caps_payments.ae_number    
			,v_caps_payments.caps_trans_no
			,v_caps_payments.payment_date 
			,v_caps_payments.amount       
			,v_caps_payments.amount_currency       
			,v_caps_payments.notes        
			,p_ae_event_seq	             
			);

			/***********************************************************/
			/* No error has occured, set transfer status to v_no_error */
			/***********************************************************/
			p_transfer_status := v_no_error;
			p_debug_output (p_debug,'PROCEDURE p_insert_local_caps_payments','Insert completed successfully',NULL);

		EXCEPTION

			WHEN others THEN

				/***********************************************************************/
				/* If an error was raised while attempting to insert into              */
                /* remote courts caps_payments table, set transfer status to V_ERROR_2 */
				/***********************************************************************/
				p_transfer_status := v_error_2;
				p_debug_output (p_debug,'PROCEDURE p_insert_local_caps_payments',NULL,SQLERRM);

		END;

	END p_insert_local_caps_payments;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_delete_local_caps_payments                                                                    */
	/* DESCRIPTION	: Delete records from caps_payments table in SUPS Caseman database                                */
 	/******************************************************************************************************************/

	PROCEDURE p_delete_local_caps_payments(
		p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,
		p_debug           IN CHAR DEFAULT 'N') IS
	BEGIN
		BEGIN
			DELETE FROM caps_payments cp
			WHERE  cp.ae_number = v_caps_payments.ae_number;
			
			/***********************************************************/
			/* No error has occured, set transfer status to v_no_error */
			/***********************************************************/
			p_transfer_status := v_no_error;
			p_debug_output (p_debug,'PROCEDURE p_delete_local_caps_payments','Delete completed successfully',NULL);
		EXCEPTION
			WHEN others THEN
				/***********************************************************************/
				/* If an error was raised while attempting to delete from              */
                /* remote courts caps_payments table, set transfer status to V_ERROR_3 */
				/***********************************************************************/
				p_transfer_status := v_error_3;
				p_debug_output (p_debug,'PROCEDURE p_delete_local_caps_payments',NULL,SQLERRM);
		END;
	END p_delete_local_caps_payments;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_insert_local_payments                                                                         */
	/* DESCRIPTION	: Insert records into payments table situated on SUPS Caseman database                            */
 	/******************************************************************************************************************/

	PROCEDURE p_insert_local_payments(
		p_payment_amount                IN NUMBER,
		p_payment_amount_currency       IN VARCHAR2,
		p_court_code                    IN courts.code%TYPE,
		p_date                          IN DATE,
		p_retention_type                IN payments.retention_type%TYPE,
		p_ae_number                     IN ae_events.ae_number%TYPE,
		p_transfer_status               OUT cmcs_transfer_status.ts_status%TYPE,
		p_debug                         IN CHAR DEFAULT 'N') IS

		v_transaction_number	system_data.item_value%TYPE;
		v_transfer_status		cmcs_transfer_status.ts_status%TYPE;

	BEGIN
		p_select_system_data(p_court_code,'TRANSACTION NO',v_transaction_number,v_transfer_status);

		IF v_transfer_status = v_no_error THEN			
			BEGIN
				INSERT INTO payments
				(counter_payment
				,transaction_number
				,admin_court_code
				,created_by
				,amount
				,amount_currency
				,bailiff_knowledge
				,date_entered
				,subject_no
				,payment_for
				,issuing_court
				,retention_type
				,error_indicator
				,passthrough
				,enforcement_court_code 
				) VALUES 
				('N'                                                
				,v_transaction_number                               
				,p_court_code
				,'CAPS'                                           	
				,p_payment_amount                                 	
				,p_payment_amount_currency                                 	
				,'Y'                                                
				,p_date                                           	
				,p_ae_number                                      	
				,'AE'                                             	
				,p_court_code                                       
				,p_retention_type                                   
				,'N'                                                
				,'Y'  
				,p_court_code                                          	
				);
	
				/***********************************************************/
				/* No error has occured, set transfer status to V_NO_ERROR */
				/***********************************************************/
				p_transfer_status := v_no_error;
				p_debug_output (p_debug,'PROCEDURE p_insert_local_payments','Insert completed successfully',NULL);


			EXCEPTION

				WHEN others THEN

					/******************************************************************/
					/* If an error was raised while attempting to insert into         */
                	/* remote courts payments table, set transfer status to V_ERROR_4 */
					/******************************************************************/
					p_transfer_status := v_error_4;
					p_debug_output (p_debug,'PROCEDURE p_insert_local_payments',NULL,SQLERRM);

		
			END;

		ELSE

			p_transfer_status := v_transfer_status;

		END IF;
	
	END p_insert_local_payments;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_calc_local_outstanding_bal                                                                    */
	/* DESCRIPTION	: Calculate the outstanding balance of AE, using dynamic SQL to call                              */
    /*                ae_package.f_calculate_outstanding_bal on local courts database                                 */
 	/******************************************************************************************************************/

	PROCEDURE p_calc_local_outstanding_bal (
		p_outstanding_bal OUT NUMBER,
		p_transfer_status OUT cmcs_transfer_status.ts_status%TYPE,
		p_debug           IN CHAR DEFAULT 'N') IS

		v_outstanding_bal	NUMBER(10,2);

	BEGIN

		BEGIN
			v_outstanding_bal := f_calculate_outstanding_bal(v_ae_events.ae_number);
		
			/***********************************************************/
			/* No error has occured, set transfer status to V_NO_ERROR */
			/***********************************************************/
			p_transfer_status := v_no_error;
			p_outstanding_bal := v_outstanding_bal;
			p_debug_output (p_debug,'PROCEDURE p_calc_local_outstanding_bal','p_outstanding_bal:'||TO_CHAR(v_outstanding_bal),NULL);

		EXCEPTION

			WHEN others THEN

			/***********************************************************/
			/* If an error was raised while attempting to select from  */
            /* dual, using f_calculate_outstanding_bal function,       */
			/* set transfer status to V_ERROR_5                        */
			/***********************************************************/
			p_transfer_status := v_error_5;
			p_debug_output (p_debug,'PROCEDURE p_calc_local_outstanding_bal',NULL,SQLERRM);

		END;

	END p_calc_local_outstanding_bal;

	/******************************************************************************************************************/
	/* TYPE			: FUNCTION                                                                                        */
	/* NAME			: f_calculate_outstanding_bal                                                                     */
	/* DESCRIPTION	: Calculate the outstanding balance of AE  (PER: 02AEN01026)                                      */
	/*                (02-Jan-2006 - Extracted from the legacy court ae_package).                                     */
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
	    	AND deleted_flag = 'N';
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
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_transfer_ae_orders_in                                                                         */
	/* DESCRIPTION	: Transfers records from SUPS Caseman Central Server staging tables to the main SUPS Caseman      */
	/*                databases tables for the specified Court.                                                       */
	/*                p_court_code is used to select receiving_court_code from TRANSFER_CONTROL (c_ae_events)         */
	/*                p_date replaces any use of sysdate, whenever used (eg. p_insert_local_payments)                 */ 
 	/******************************************************************************************************************/

	PROCEDURE p_transfer_ae_orders_in (
		p_court_code IN courts.code%TYPE,
		p_date       DATE DEFAULT NULL,
		p_debug      IN CHAR DEFAULT 'N') IS

		CURSOR c_ae_events IS

			SELECT	ae.caps_event_seq,
					ae.trans_seq,
					ae.ae_number,
					ae.event_date,
					ae.date_entered,
					ae.std_event_id,
					ae.details,
					ae.error_indicator,
					ae.username,
					ae.caps_balance,
					ae.caps_balance_currency,
					ae.caps_sequence
			FROM cmcs_ae_events ae, cmcs_transfer_control tc
			WHERE ae.trans_seq = tc.trans_seq
			AND tc.transfer_type = 'E'
			AND tc.transfer_status = '1'
            AND tc.receiving_court_code = p_court_code
			AND ae.transfer_status = '1'
			ORDER BY ae.ae_number;

		CURSOR c_caps_payments(p_caps_event_seq cmcs_caps_payments.caps_event_seq%TYPE) IS

			SELECT	cp.ae_number,
					cp.caps_trans_no,
					cp.payment_date,
					cp.amount,
					cp.amount_currency,
					cp.notes,
					cp.transfer_status
			FROM cmcs_caps_payments cp
			WHERE caps_event_seq = p_caps_event_seq;

		v_outstanding_balance		NUMBER(10,2);
		v_payment_amount			payments.amount%TYPE;
		v_transfer_status			cmcs_transfer_status.ts_status%TYPE;
		v_deleted_ae_number			ae_events.ae_number%TYPE := 'ZXZXZXZX';
		v_ae_event_seq				NUMBER(10);
		v_date						DATE;

	BEGIN

		/***************************************************/
		/* If P_DATE parameter is NULL then set to sysdate */
		/***************************************************/
		v_date := NVL(p_date,sysdate);

		/***************************************************/
		/* Check database link is available                */
		/* Raise an APPLICATION ERROR if fails             */
		/***************************************************/
		p_check_database_available();

		/*********************/
		/* Process AE events */
		/*********************/
		OPEN c_ae_events;
		LOOP

			FETCH c_ae_events
			INTO v_ae_events.caps_event_seq,
				 v_ae_events.trans_seq,
				 v_ae_events.ae_number, 
				 v_ae_events.event_date,
				 v_ae_events.date_entered,
				 v_ae_events.std_event_id,
				 v_ae_events.details,
				 v_ae_events.error_indicator,
				 v_ae_events.username,
				 v_ae_events.caps_balance,
				 v_ae_events.caps_balance_currency,
				 v_ae_events.caps_sequence;

			EXIT WHEN c_ae_events%NOTFOUND;

			p_debug_output(p_debug,'PROCEDURE p_transfer_ae_orders_in','AE_NUMBER :'||v_ae_events.ae_number,NULL);

			SAVEPOINT last_valid_transfer;

			/***************************************************/
			/* Retrieve the next AE_EVENT_SEQ from local court */
			/***************************************************/
			p_select_next_ae_seq(v_ae_event_seq,v_transfer_status,p_debug);
	
			IF v_transfer_status = v_no_error THEN

				/***************************************************/
				/* Insert new record into AE_EVENTS on local court */
				/***************************************************/
				p_insert_local_ae_events(v_ae_event_seq,v_transfer_status,p_debug);

				IF v_transfer_status = v_no_error THEN

					/*******************************************************/
					/* Update AE_APPLICATIONS.CAPS_SEQUENCE on local court */
					/*******************************************************/
					p_update_local_ae_applications(v_transfer_status,p_debug);

					IF v_transfer_status = v_no_error THEN

						/**************************************************************************/
						/* A passthrough payment will be required if outstanding balance on local */
						/* court less balance sent from CAPS is not equal to zero.                */
						/**************************************************************************/
						p_calc_local_outstanding_bal(v_outstanding_balance,v_transfer_status,p_debug);
				
						IF v_transfer_status = v_no_error THEN

							v_payment_amount := v_outstanding_balance - v_ae_events.caps_balance;
	
							IF v_payment_amount != 0 THEN
								p_insert_local_payments(
									v_payment_amount,
									v_ae_events.caps_balance_currency,
									p_court_code,
									v_date,
									'CAPS_ADJUSTMENT',
									v_ae_events.ae_number,
									v_transfer_status,
									p_debug);
							END IF;

							IF v_transfer_status = v_no_error THEN
	
								/************************************************************/
								/* Process any CAPS payments for the current CAPS_EVENT_SEQ */
								/************************************************************/

								OPEN c_caps_payments(v_ae_events.caps_event_seq);
								LOOP

									FETCH c_caps_payments
									INTO v_caps_payments.ae_number,
 										 v_caps_payments.caps_trans_no,
										 v_caps_payments.payment_date,
										 v_caps_payments.amount,
										 v_caps_payments.amount_currency,
										 v_caps_payments.notes,
										 v_caps_payments.transfer_status;

									EXIT WHEN c_caps_payments%NOTFOUND OR v_transfer_status <> v_no_error;
		
									/*************************************************************************/
									/* Has AE_NUMBER been deleted from local courts CAPS_PAYMENTS previously */
									/* (Used in conjunction with the ORDER BY in the c_ae_events cursor)     */
									/*************************************************************************/
									IF v_deleted_ae_number <> v_caps_payments.ae_number THEN

										/******************************************************/
										/* Delete record(s) from CAPS_PAYMENTS on local court */
										/******************************************************/
										p_delete_local_caps_payments(v_transfer_status,p_debug);				

										v_deleted_ae_number := v_caps_payments.ae_number;

									END IF; -- Have caps payments for this AE_NUMBER been deleted?
	
									IF v_transfer_status = v_no_error THEN

										/*******************************************************/
										/* Insert new record into CAPS_PAYMENTS on local court */
										/*******************************************************/
										p_insert_local_caps_payments(v_ae_event_seq,v_transfer_status,p_debug);
	
										IF v_transfer_status <> v_no_error THEN
	
											ROLLBACK TO last_valid_transfer;
	
										END IF; -- Transfer still successful? (Status = v_no_error?)

									ELSE

										ROLLBACK TO last_valid_transfer;
	
									END IF; -- Transfer still successful? (Status = v_no_error?)

								END LOOP; -- c_caps_payments CURSOR

								CLOSE c_caps_payments;

							ELSE -- Transfer still successful? (Status = v_no_error?)

								ROLLBACK TO last_valid_transfer;
		
							END IF;
		
						ELSE

							ROLLBACK TO last_valid_transfer;
	
						END IF; -- Transfer still successful? (Status = v_no_error?)
		
					ELSE

						ROLLBACK TO last_valid_transfer;

					END IF; -- Transfer still successful? (Status = v_no_error?)

				ELSE

					ROLLBACK TO last_valid_transfer;
	
				END IF; -- Transfer still successful? (Status = v_no_error?)

			ELSE

				ROLLBACK TO last_valid_transfer;
	
			END IF; -- Transfer still successful? (Status = v_no_error?)

			/*************************************************************************/
			/* Update AE_EVENTS transfer_status, with success or failure of transfer */
			/*************************************************************************/

			BEGIN

				UPDATE cmcs_ae_events SET

					transfer_status = v_transfer_status
	
				WHERE caps_event_seq = v_ae_events.caps_event_seq;

				p_debug_output(p_debug,'PROCEDURE p_transfer_ae_orders_in','Updated AE_EVENTS with TRANSFER_STATUS : '||v_transfer_status,NULL);

			EXCEPTION

				/**************************************************************************/
				/* If an error occurs while attempting an update, then halt program.      */
				/* As this is only populated by constant variables within the program     */ 
				/* a fatal error must have occurred eg. table missing, field changed etc. */
				/**************************************************************************/
				
				WHEN others THEN

					ROLLBACK;		
					RAISE_APPLICATION_ERROR(-20100,'ERROR - Module: p_transfer_ae_orders_in'||CHR(10)||SQLERRM);

			END;

			/********************************************************************************/
			/* Update TRANSFER_CONTROL transfer_status, with success or failure of transfer */
			/********************************************************************************/

			BEGIN

				UPDATE cmcs_transfer_control SET

					transfer_status = v_transfer_status

				WHERE trans_seq = v_ae_events.trans_seq;

				p_debug_output(p_debug,'PROCEDURE p_transfer_ae_orders_in','Updated TRANSFER_CONTROL with TRANSFER_STATUS : '||v_transfer_status,NULL);

			EXCEPTION

				/**************************************************************************/
				/* If an error occurs while attempting an update, then halt program.      */
				/* As this is only populated by constant variables within the program     */ 
				/* a fatal error must have occurred eg. table missing, field changed etc. */
				/**************************************************************************/
				
				WHEN others THEN

					ROLLBACK;		
					RAISE_APPLICATION_ERROR(-20100,'ERROR - Module: p_transfer_ae_orders_in'||CHR(10)||SQLERRM);

			END;

		END LOOP; -- c_ae_events CURSOR;

		CLOSE c_ae_events;

		COMMIT;
	
	EXCEPTION

		/****************************************************************************/
		/* If an unkown error occurs, then halt program.                            */
		/* A fatal error has occurred eg. table missing, field changed, dblink down */
		/****************************************************************************/

		WHEN others THEN

			ROLLBACK;
			RAISE_APPLICATION_ERROR(-20100,'ERROR - Module: p_transfer_ae_orders_in'||CHR(10)||SQLERRM);


	END p_transfer_ae_orders_in;

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_transfer_ae_events_to_cmcs                                                                    */
	/* DESCRIPTION	: Transfers AE Event records from SUPS CAPS to SUPS Caseman's 'CaseMan Central Server' staging    */
	/*                tables.                                                                                         */
 	/******************************************************************************************************************/

	PROCEDURE p_transfer_ae_events_to_cmcs IS

		-- Selects data from the SUPS CAPS TRANSFER_EVENTS table that applies to SUPS Courts and inserts it into the 
		-- SUPS Caseman CMCS_TRANSFER_CONTROL, CMCS_AE_EVENTS and CMCS_CAPS_PAYMENTS staging tables.
		-- Subsequently transferred to the main SUPS CaseMan tables.  

		cursor c_events is
			select te.ae_seq
			,      te.case_number
			,      te.ae_number
			,      te.crt_code
			,      te.event_seq
			,      te.std_event_id
			,      te.event_date
			,      te.balance
			,      te.balance_currency
			,      te.username
			,      te.details     
			from   transfer_events@caps_link te
			,      courts crt
			where  te.crt_code = crt.code
			and    crt.sups_centralised_flag = 'Y'
			and    te.status is null;

		v_ae_seq        transfer_events.ae_seq@caps_link%type;
		v_case_number   transfer_events.case_number@caps_link%type;
		v_ae_number     transfer_events.ae_number@caps_link%type;
		v_crt_code      transfer_events.crt_code@caps_link%type;
		v_event_seq     transfer_events.event_seq@caps_link%type;
		v_std_event_id  transfer_events.std_event_id@caps_link%type;
		v_event_date    transfer_events.event_date@caps_link%type;
		v_balance       transfer_events.balance@caps_link%type;
		v_balance_currency transfer_events.balance_currency@caps_link%type;
		v_username      transfer_events.username@caps_link%type;
		v_details       transfer_events.details@caps_link%type;

		cursor c_trans_seq is
			select cmcs_trans_sequence.nextval
			from   dual;
		
		v_trans_seq  number;
		
		cursor c_payments is
			select transaction_number
			,      date_entered
			,      amount
			,      amount_currency
			,      decode(rd_date,null,decode(expunge_date,null,payment_type,'EXP PT'),'RD CHQ')
			from   payments@caps_link
			where  ae_seq = v_ae_seq
			order by transaction_number desc;

		v_transaction_number  payments.transaction_number@caps_link%type;
		v_pay_date            payments.date_entered@caps_link%type;
		v_amount              payments.amount@caps_link%type;
		v_amount_currency     payments.amount_currency@caps_link%type;
		v_type                payments.payment_type@caps_link%type;
		v_pay_count           number(2);

		cursor c_check_link is
			select count(rowid)
			from   transfer_events@caps_link;
		
		v_dummy       number;      
		v_link_count  number(1);
		v_link_made   varchar2(1);
		
	BEGIN
		v_link_count := 1;
		v_link_made := 'N';
		
		WHILE v_link_count < 4 AND v_link_made = 'N'
		LOOP
			BEGIN
			  OPEN c_check_link;
			  FETCH c_check_link INTO v_dummy;
			  v_link_made := 'Y'; 
			  CLOSE c_check_link;
			EXCEPTION
			  WHEN OTHERS THEN
			    CLOSE c_check_link;
			    DBMS_OUTPUT.PUT_LINE('Cannot connect to SUPS CAPS database.');
			    DBMS_OUTPUT.PUT_LINE(sqlerrm);
			END;
			v_link_count := v_link_count + 1;
		END LOOP;

		IF v_link_made = 'N' THEN
			DBMS_OUTPUT.PUT_LINE('Unable to connect to SUPS CAPS database after 4 attempts.');
			RAISE_APPLICATION_ERROR(-20001,'Unable to connect to SUPS CAPS database.');
		ELSE
			OPEN c_events;
			
			LOOP
			
				FETCH c_events    
				INTO  v_ae_seq, 
				      v_case_number, 
				      v_ae_number, 
				      v_crt_code, 
				      v_event_seq,
				      v_std_event_id, 
				      v_event_date, 
				      v_balance, 
				      v_balance_currency, 
				      v_username, 
				      v_details;
				EXIT WHEN c_events%NOTFOUND;

				OPEN c_trans_seq;
				FETCH c_trans_seq 
				INTO  v_trans_seq;
				CLOSE c_trans_seq;

				INSERT INTO CMCS_TRANSFER_CONTROL
				(trans_seq
				,transfer_type
				,transfer_number
				,sending_court_code
				,receiving_court_code
				,transfer_request_date
				,central_receipt_date
				,transfer_status
				) VALUES
				(v_trans_seq
				,'E'
				,v_ae_number
				,0
				,v_crt_code
				,v_event_date
				,trunc(sysdate)
				,'1');

				INSERT INTO CMCS_AE_EVENTS
				(caps_sequence
				,trans_seq
				,caps_event_seq
				,ae_number
				,event_date
				,std_event_id
				,details
				,error_indicator
				,username
				,transfer_status
				,caps_balance
				,caps_balance_currency
				,date_entered
				) VALUES
				(v_ae_seq
				,v_trans_seq
				,v_event_seq
				,v_ae_number
				,v_event_date
				,v_std_event_id
				,v_details
				,'N'
				,v_username
				,'1'
				,v_balance
				,v_balance_currency
				,v_event_date);

				IF v_std_event_id = 819 THEN

					v_pay_count := 0;
					
					OPEN c_payments;
					
					LOOP   

						EXIT WHEN v_pay_count = 21;
						
						FETCH c_payments
						INTO  v_transaction_number, 
						      v_pay_date, 
						      v_amount, 
						      v_amount_currency, 
						      v_type;
						EXIT WHEN c_payments%NOTFOUND;

						INSERT INTO CMCS_CAPS_PAYMENTS
						(trans_seq
						,caps_event_seq
						,caps_trans_no
						,ae_number
						,payment_date
						,amount
						,amount_currency
						,notes
						,transfer_status
						) VALUES
						(v_trans_seq
						,v_event_seq
						,v_transaction_number
						,v_ae_number
						,v_pay_date
						,v_amount
						,v_amount_currency
						,v_type
						,'1'
						);

						v_pay_count := v_pay_count + 1; 
						
					END LOOP;
					
					CLOSE c_payments; 

				END IF;
				
				UPDATE TRANSFER_EVENTS@caps_link
				SET    STATUS = 'T'
				WHERE  EVENT_SEQ = v_event_seq;
						
				COMMIT;

			END LOOP;

			CLOSE c_events;
		END IF;

	END p_transfer_ae_events_to_cmcs;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_transfer_clear_down                                                                           */
    /* DESCRIPTION	: Deletes rows from the following staging tables that have been successfully transferred over     */
    /*                3 days prior :-                                                                                 */
    /*                  CMCS_AE_EVENTS and CMCS_CAPS_PAYMENTS                                                         */
    /*                Also, the CMCS_TRANSFER_CONTROL table is also cleared down of records more than 50 days old.    */
    /******************************************************************************************************************/
    PROCEDURE p_transfer_clear_down IS
    BEGIN
        delete cmcs_ae_events ae
        where  ae.trans_seq in 
      	(select tc.trans_seq 
      	 from   cmcs_transfer_control tc
      	 where  tc.transfer_type        = 'E'
      	 and    tc.central_receipt_date <= trunc(sysdate) - 3
      	 and    tc.transfer_status      = C_TRANSFER_STATUS_SUCCESSFUL);
        
        delete cmcs_caps_payments cp
        where  cp.trans_seq in 
      	(select tc.trans_seq 
      	 from   cmcs_transfer_control tc
      	 where  tc.transfer_type        = 'E'
      	 and    tc.central_receipt_date <= trunc(sysdate) - 3
      	 and    tc.transfer_status      = C_TRANSFER_STATUS_SUCCESSFUL);
        
        delete cmcs_transfer_control tc
      	where  tc.transfer_type        = 'E'
      	and    tc.central_receipt_date <= trunc(sysdate) - 50
        and    tc.transfer_status      = C_TRANSFER_STATUS_SUCCESSFUL;

        commit;
                
    END p_transfer_clear_down;

    /******************************************************************************************************************/
    /* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_trans_caps_ae_events_to_caseman                                                               */
    /* DESCRIPTION	: This procedure will perform the complete transfer, end to end, of Attachment of Earnings from   */
    /*                SUPS CAPS to SUPS Caseman, via staging tables, and will also perform housekeeping on those      */
    /*                staging tables.                                                                                 */
    /*                It calls the three main entry points :-                                                         */
    /*                  p_transfer_ae_events_to_cmcs(), p_transfer_ae_orders_in() and p_transfer_clear_down().        */
    /*                If this implementation does not suit scheduling requirements, these entry points may called     */
    /*                individually, as appropriate.                                                                   */
    /******************************************************************************************************************/
    PROCEDURE p_trans_caps_events_to_caseman( 
        	pv_user in VARCHAR2,
        	pv_clear_down in CHAR DEFAULT 'Y') IS
    
      CURSOR c_get_sups_courts IS
    	  SELECT CRT.CODE
    	  FROM   COURTS CRT
    	  WHERE  CRT.SUPS_CENTRALISED_FLAG = 'Y';
    	  
    BEGIN
        /* By default, performing housekeeping on the staging tables. */
        if pv_clear_down = 'Y' then
            p_transfer_clear_down();    
        end if;
    
        /* Transfer CAPS AE Events into the SUPS Caseman Staging tables. */
        p_transfer_ae_events_to_cmcs;
        
        /* Iterate through each of the Courts which has been migrated into SUPS. */
        FOR sups_court IN c_get_sups_courts
        LOOP
            /* Set up the 'Context' for the Audit triggers. */
            sys.set_sups_app_ctx(pv_user, sups_court.code, 'SupsCAPSAeEventXfer');
            
            /* Transfer the Events fromn the Staging Tables into the main Application tables. */
            p_transfer_ae_orders_in(sups_court.code);
        END LOOP;
        
    END p_trans_caps_events_to_caseman;

END sups_caps_events_transfer_pack;
/
