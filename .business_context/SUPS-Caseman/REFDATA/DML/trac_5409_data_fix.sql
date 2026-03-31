WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:     
|
| SYNOPSIS      : This script generates MCOL_DATA row for certain events entered
|				  by CCBC Batch for a given creditor code and entered on or after
|				  a specific date.  A defect means that CCBC Batch was not creating
|				  these notifications to MCOL so this script generates the missing
|				  notifications.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL trac_5409_data_fix.log

DECLARE
	
	-- Variables to hold the parameters passed in from the command line
	n_cred_code		NUMBER(4);
	v_date_from		VARCHAR2(10);
	n_count_settled	NUMBER := 0;
	n_count_discont	NUMBER := 0;
	n_count_paid	NUMBER := 0;
	
	CURSOR 	get_settled_events IS
	SELECT 	ce.case_number, ce.event_date, ce.case_party_no
	FROM 	case_events ce, cases c
	WHERE	ce.std_event_id IN (73,76)
	AND		ce.deleted_flag = 'N'
	AND		ce.username = 'CCBC_BATCH'
	AND		ce.event_date >= TO_DATE(v_date_from,'YYYY-MM-DD')
	AND		c.case_number = ce.case_number
	AND		NVL(c.cred_code,-1) = n_cred_code;
	
	CURSOR 	get_discontinued_events IS
	SELECT 	ce.case_number, ce.event_date, ce.case_party_no
	FROM 	case_events ce, cases c
	WHERE	ce.std_event_id = 74
	AND		ce.deleted_flag = 'N'
	AND		ce.username = 'CCBC_BATCH'
	AND		ce.event_date >= TO_DATE(v_date_from,'YYYY-MM-DD')
	AND		c.case_number = ce.case_number
	AND		NVL(c.cred_code,-1) = n_cred_code;
	
	CURSOR 	get_paid_events IS
	SELECT 	ce.case_number, ce.event_date, ce.case_party_no
	FROM 	case_events ce, cases c
	WHERE	ce.std_event_id IN (78,79)
	AND		ce.deleted_flag = 'N'
	AND		ce.username = 'CCBC_BATCH'
	AND		ce.event_date >= TO_DATE(v_date_from,'YYYY-MM-DD')
	AND		c.case_number = ce.case_number
	AND		NVL(c.cred_code,-1) = n_cred_code;
	
BEGIN

	-- Assign parameters passed in to local variables
	n_cred_code := &creditor_code;
	v_date_from := '&date_from';	-- Date must be entered in format YYYY-MM-DD
	
	dbms_output.put_line('=============================================');

	-- Create MCOL_DATA rows for all the settled events
	FOR settled_evt IN get_settled_events LOOP
	
		INSERT INTO mcol_data
			(claim_number
			,deft_id
			,type
			,event_date
			,new_creditor)
		VALUES
			(settled_evt.case_number
			,settled_evt.case_party_no
			,'WD'
			,settled_evt.event_date
			,n_cred_code);
			
		n_count_settled := n_count_settled + 1;
	
	END LOOP;
	
	-- Create MCOL_DATA rows for all the discontinued events
	FOR discont_evt IN get_discontinued_events LOOP
	
		INSERT INTO mcol_data
			(claim_number
			,deft_id
			,type
			,event_date
			,new_creditor)
		VALUES
			(discont_evt.case_number
			,discont_evt.case_party_no
			,'DI'
			,discont_evt.event_date
			,n_cred_code);
			
		n_count_discont := n_count_discont + 1;
	
	END LOOP;
	
	-- Create MCOL_DATA rows for all the paid events
	FOR paid_evt IN get_paid_events LOOP
	
		INSERT INTO mcol_data
			(claim_number
			,deft_id
			,type
			,event_date
			,new_creditor)
		VALUES
			(paid_evt.case_number
			,paid_evt.case_party_no
			,'MP'
			,paid_evt.event_date
			,n_cred_code);
			
		n_count_paid := n_count_paid + 1;
			
	END LOOP;
	
	COMMIT;
	
	-- Results
	dbms_output.put_line('Creditor Code: '||n_cred_code||' events created on and after '||v_date_from);
	dbms_output.put_line('Settled (WD) Events: '||n_count_settled);
	dbms_output.put_line('Discontinued (DI) Events: '||n_count_discont);
	dbms_output.put_line('Paid (MP) Events: '||n_count_paid);

END;

/

SPOOL OFF