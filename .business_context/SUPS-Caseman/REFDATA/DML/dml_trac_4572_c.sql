WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$     
|
| SYNOPSIS      : This script sets up a temporary table to hold the value to be used
|				  for the next AE/Warrant/CO sequence at each court when reset at the
|				  end of the year.
|
| $Author:$       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
| AMENDMENTS	: 04/07/2013, Chris Vincent - Trac 4908
|                 commented out inserts for home, foreign and reissued warrants
|                 which will no longer be used under the new numbering scheme.
|				  09/12/2015, Chris Vincent - Trac 5719
|				  Removed AE sequences to be reset as no longer required.
|
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4572_c.log

BEGIN
        
        EXECUTE IMMEDIATE 'DROP TABLE tmp_end_year_reset_sequences';
        
        EXCEPTION
        
        WHEN OTHERS THEN
               NULL;
END;
/

-- Create temporary table
CREATE TABLE tmp_end_year_reset_sequences
	(court_code  NUMBER(3)
	,item        VARCHAR2(30)
	,item_value  NUMBER(*,2)
);

COMMENT ON TABLE tmp_end_year_reset_sequences IS 'Temporary table used to store the starting AE, CO, HOME, FOREIGN and REISSUE sequence numbers for each court at the start of the year.';

DECLARE

	-- Variables to hold the parameters passed in from the command line
	v_enf_letter VARCHAR2(1);

	-- Variables to hold the next AE/HW/FW sequence for a court
	n_next_ae_seq	NUMBER;
	n_next_hw_seq	NUMBER;
	n_next_fw_seq	NUMBER;

	-- Cursor to retrieve all the live CaseMan courts
	CURSOR c_get_live_cm_courts IS
	SELECT c.code
	FROM courts c
	WHERE c.sups_centralised_flag = 'Y'
	AND c.caseman_inservice = 'Y';
	
	/*-------------------------------------------------------------------------------
	| FUNCTION      : get_exception_value
	|
	| DECSRIPTION   : Returns the exception value for a given court, enforcement type
	|				  and year to use instead of the next highest number available.
	|
	| PARAMETERS    : pn_crt_code		IN	Court code to use
	| PARAMETERS    : pv_year_letter	IN	Enforcement letter to use
	| PARAMETERS    : pv_item			IN	Enforcement type (e.g. AE, HOME, FOREIGN)
	|
	| RETURNS       : NUMBER
	--------------------------------------------------------------------------------*/
	FUNCTION get_exception_value ( pn_crt_code IN NUMBER, pv_year_letter IN VARCHAR2, pv_item IN VARCHAR2 ) RETURN NUMBER IS
	
		n_count_exceptions	NUMBER;
		n_exception_value	NUMBER;
	
	BEGIN
		
		-- Determine if any exceptions exist
		SELECT COUNT(*)
		INTO n_count_exceptions
		FROM tmp_end_year_reset_exceptions t
		WHERE t.court_code = pn_crt_code
		AND t.year_code = pv_year_letter
		AND t.item = pv_item;
		
		IF n_count_exceptions > 0 THEN
			-- Exception exists, return the exception value
			SELECT t.item_value
			INTO n_exception_value
			FROM tmp_end_year_reset_exceptions t
			WHERE t.court_code = pn_crt_code
			AND t.year_code = pv_year_letter
			AND t.item = pv_item;
			
		ELSE
			-- No exception exists, return 0
			n_exception_value := 0;
			
		END IF;
		
		RETURN n_exception_value;
	
	END;
	
	/*-------------------------------------------------------------------------------
	| FUNCTION      : get_next_ae_sequence
	|
	| DECSRIPTION   : Given a court code and an enforcement letter, determines the next
	|				  unique AE Number sequence to use for that court.
	|
	| PARAMETERS    : pn_crt_code		IN	Court code to use
	| PARAMETERS    : pv_year_letter	IN	Enforcement letter to use
	|
	| RETURNS       : NUMBER
	--------------------------------------------------------------------------------*/
	FUNCTION get_next_ae_sequence ( pn_crt_code IN NUMBER, pv_year_letter IN VARCHAR2 ) RETURN NUMBER IS
	
		n_max_ae 		NUMBER;
		n_max_cman_ae	NUMBER;
		n_max_caps_ae 	NUMBER;
		n_exception		NUMBER;
	
	BEGIN
	
		n_exception := get_exception_value(pn_crt_code, pv_year_letter, 'AE');
		
		IF n_exception > 0 THEN
		
			-- Use the exception value
			n_max_ae := n_exception;
		
		ELSE
		
			-- No exception, get the maximum CaseMan AE Number
			SELECT NVL( TO_NUMBER( SUBSTR( MAX(ae.ae_number), 5 ) ), 0)
			INTO n_max_cman_ae 
			FROM ae_applications ae 
			WHERE ae.ae_number LIKE pn_crt_code || pv_year_letter || '%'
			AND LENGTH(ae.ae_number) = 8;
			
			-- Get the maximum CAPS AE Number
			SELECT NVL( TO_NUMBER( SUBSTR( MAX(aes.ae_number), 5 ) ), 0)
			INTO n_max_caps_ae 
			FROM aes@caps_link aes 
			WHERE aes.ae_number LIKE pn_crt_code || pv_year_letter || '%'
			AND LENGTH(aes.ae_number) = 8;
			
			IF n_max_caps_ae > n_max_cman_ae THEN
				-- Use the maximum CAPS sequence number
				n_max_ae := n_max_caps_ae;
			ELSE
				-- Use the maximum CaseMan sequence number
				n_max_ae := n_max_cman_ae;
			END IF;
			
			-- Increment number by 1
			n_max_ae := n_max_ae + 1;
		
		END IF;
		
		RETURN n_max_ae;
		
	END;
	
	/*-------------------------------------------------------------------------------
	| FUNCTION      : get_next_hw_sequence
	|
	| DECSRIPTION   : Given a court code and an enforcement letter, determines the next
	|				  unique Home Warrant Number sequence to use for that court.
	|
	| PARAMETERS    : pn_crt_code		IN	Court code to use
	| PARAMETERS    : pv_year_letter	IN	Enforcement letter to use
	|
	| RETURNS       : NUMBER
	--------------------------------------------------------------------------------*/
	FUNCTION get_next_hw_sequence ( pn_crt_code IN NUMBER, pv_year_letter IN VARCHAR2 ) RETURN NUMBER IS
	
		n_max_hw	NUMBER;
		n_exception	NUMBER;
	
	BEGIN
	
		n_exception := get_exception_value(pn_crt_code, pv_year_letter, 'HOME');
		
		IF n_exception > 0 THEN
		
			-- Use the exception value
			n_max_hw := n_exception;
		
		ELSE
		
			-- No exception, get the maximum Home Warrant Number
			SELECT NVL( TO_NUMBER( SUBSTR( MAX(w.warrant_number), 2 ) ), 0)
			INTO n_max_hw 
			FROM warrants w 
			WHERE w.warrant_number LIKE pv_year_letter || '%'
			AND LENGTH(w.warrant_number) = 8
			AND w.local_warrant_number IS NULL
			AND w.issued_by = pn_crt_code;
			
			-- Increment number by 1
			n_max_hw := n_max_hw + 1;
		
		END IF;
		
		RETURN n_max_hw;
		
	END;
	
	/*-------------------------------------------------------------------------------
	| FUNCTION      : get_next_fw_sequence
	|
	| DECSRIPTION   : Given a court code and an enforcement letter, determines the next
	|				  unique Foreign Warrant Number sequence to use for that court.
	|
	| PARAMETERS    : pn_crt_code		IN	Court code to use
	| PARAMETERS    : pv_year_letter	IN	Enforcement letter to use
	|
	| RETURNS       : NUMBER
	--------------------------------------------------------------------------------*/
	FUNCTION get_next_fw_sequence ( pn_crt_code IN NUMBER, pv_year_letter IN VARCHAR2 ) RETURN NUMBER IS
	
		n_max_fw 	NUMBER;
		n_exception	NUMBER;
	
	BEGIN
	
		n_exception := get_exception_value(pn_crt_code, pv_year_letter, 'FOREIGN');
		
		IF n_exception > 0 THEN
		
			-- Use the exception value
			n_max_fw := n_exception;
		
		ELSE
		
			-- No exception, get the maximum Foreign Warrant Number
			SELECT NVL( TO_NUMBER( SUBSTR( MAX(w.local_warrant_number), 4 ) ), 0)
			INTO n_max_fw 
			FROM warrants w 
			WHERE w.warrant_number LIKE 'FW' || pv_year_letter || '%'
			AND LENGTH(w.local_warrant_number) = 8
			AND w.local_warrant_number IS NOT NULL
			AND w.currently_owned_by = pn_crt_code;
			
			-- Increment number by 1
			n_max_fw := n_max_fw + 1;
		
		END IF;
		
		RETURN n_max_fw;
		
	END;


BEGIN

	-- Assign parameters passed in to local variables
	v_enf_letter := '&enforcement_letter';

	-- Populate temporary table
	FOR rec_court IN c_get_live_cm_courts
	LOOP
		
		--n_next_ae_seq := get_next_ae_sequence(rec_court.code, v_enf_letter);
		--INSERT INTO tmp_end_year_reset_sequences
		--VALUES (rec_court.code
		--		,'AE'
		--		,n_next_ae_seq
		--);
		
		INSERT INTO tmp_end_year_reset_sequences
		VALUES (rec_court.code
				,'CO'
				,1
		);
		
		--n_next_fw_seq := get_next_fw_sequence(rec_court.code, v_enf_letter);
		--INSERT INTO tmp_end_year_reset_sequences
		--VALUES (rec_court.code
		--		,'FOREIGN'
		--		,n_next_fw_seq
		--);
		
		--n_next_hw_seq := get_next_hw_sequence(rec_court.code, v_enf_letter);
		--INSERT INTO tmp_end_year_reset_sequences
		--VALUES (rec_court.code
		--		,'HOME'
		--		,n_next_hw_seq
		--);
		
		--INSERT INTO tmp_end_year_reset_sequences
		--VALUES (rec_court.code
		--		,'REISSUE'
		--		,1
		--);
		
	END LOOP;
	
	COMMIT;
	
END;

/

SPOOL OFF