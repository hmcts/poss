WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$     
|
| SYNOPSIS      : This script inserts coded parties into the CaseMan database
|
| $Author:$       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2012 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4628.log

-- Drop the external table if it already exists
BEGIN
        
        EXECUTE IMMEDIATE 'DROP TABLE local_coded_parties_ext';
        
        EXCEPTION
        
        WHEN OTHERS THEN
               NULL;
END;
/

-- Load the Coded Parties in the CSV file to the external table
CREATE TABLE local_coded_parties_ext (
	admin_court_code		NUMBER(3),
	person_requested_name	VARCHAR2(70), 
	address_line1			VARCHAR2(35), 
	address_line2			VARCHAR2(35), 
	address_line3           VARCHAR2(35),
	address_line4           VARCHAR2(35),
	address_line5           VARCHAR2(35),
	postcode           		VARCHAR2(8)
)
organization EXTERNAL
(
	DEFAULT directory EXTERNAL_DIR
	ACCESS PARAMETERS
	(
		records delimited BY newline
		fields terminated BY ','
		missing field VALUES ARE NULL
		(
			ADMIN_COURT_CODE,
			PERSON_REQUESTED_NAME, 
			ADDRESS_LINE1, 
			ADDRESS_LINE2, 
			ADDRESS_LINE3, 
			ADDRESS_LINE4, 
			ADDRESS_LINE5, 
			POSTCODE
		)
	)
	location ('local_coded_parties.csv')
) reject LIMIT 1;

DECLARE

	-- Local variables
	n_coded_party_code	NUMBER;
	n_admin_court_code  NUMBER;
	n_valid_court_code  NUMBER;
	n_count_completed	NUMBER;
	n_count_total  		NUMBER;
	
	-- Declare user exceptions
	e_non_sups_court_code	EXCEPTION;
	e_negative_starting_code	EXCEPTION;
	e_cannot_start_in_ncp_range	EXCEPTION;
	e_run_out_of_codes	EXCEPTION;
	PRAGMA EXCEPTION_INIT(e_non_sups_court_code, -20000);
	PRAGMA EXCEPTION_INIT(e_negative_starting_code, -20001);
	PRAGMA EXCEPTION_INIT(e_cannot_start_in_ncp_range, -20002);
	PRAGMA EXCEPTION_INIT(e_run_out_of_codes, -20003);

	-- Cursor to retrieve all the coded parties loaded into the external table
	CURSOR c_get_new_coded_parties IS
	SELECT 	admin_court_code
			,person_requested_name
			,address_line1
			,address_line2
			,address_line3
			,address_line4
			,address_line5
			,postcode
	FROM local_coded_parties_ext;

BEGIN

	-- Prompt the user for a starting coded party code
	n_coded_party_code := &starting_code;
	n_admin_court_code := &court_code;
	
	-- Get the total number of Coded Parties to add and initialise variable holding number completed.
	SELECT COUNT(*)
	INTO n_count_total
	FROM local_coded_parties_ext;
	
	n_count_completed := 0;

	-- Determine if the court code the coded parties will be added to is a SUPS Court
	SELECT COUNT(*)
	INTO n_valid_court_code
	FROM courts
	WHERE code = n_admin_court_code
	AND sups_centralised_flag = 'Y';
	
	IF n_valid_court_code = 0 THEN
		-- Court Code entered is not a SUPS Court
		RAISE e_non_sups_court_code;
	END IF;
	
	IF n_coded_party_code < 0 THEN
		-- Starting code cannot be a negative number
		RAISE e_negative_starting_code;
		
	ELSIF n_coded_party_code = 0 THEN
		-- Determine starting code by using next highest number
		-- Retrieve highest current number
		SELECT NVL(MAX(code), 0)
		INTO n_coded_party_code
		FROM coded_parties 
		WHERE admin_court_code = n_admin_court_code;
		
		-- Increment number by 1 to get next highest
		n_coded_party_code := n_coded_party_code + 1;
		
	ELSIF n_coded_party_code BETWEEN 1500 AND 1999 THEN
		-- Starting code cannot be a National Coded Party
		RAISE e_cannot_start_in_ncp_range;
		
	ELSIF n_coded_party_code > 6999 THEN
		-- Starting code cannot be a National Coded Party
		RAISE e_cannot_start_in_ncp_range;
		
	END IF;
	
	-- Set Audit trigger context
	sys.set_sups_app_ctx('support','0','lcp load');

	-- Loop through all coded parties loaded into the external table
	FOR rec_lcp IN c_get_new_coded_parties
	LOOP

		-- Validation checks following increment of coded party number at the end of the loop
		IF n_coded_party_code = 1500 THEN
			-- Incrementing the coded party code has taken it into the National Coded Party range (1500-1999)
			-- Restart numbering from 2000
			n_coded_party_code := 2000;
			
		ELSIF n_coded_party_code = 7000 THEN
			-- Incrementing the coded party code has taken it into the National Coded Party range (7000-9999)
			-- Cannot continue in this range so throw exception.
			RAISE e_run_out_of_codes;
			
		END IF;
		
		-- Insert PARTIES row
		INSERT INTO parties (
			party_id
			,person_requested_name
		)
		VALUES (
			PARTIES_SEQUENCE.NEXTVAL
			,rec_lcp.person_requested_name
		);
		
		-- Insert GIVEN_ADDRESSES row
		INSERT INTO given_addresses (
			address_id
			,address_line1
			,address_line2
			,address_line3
			,address_line4
			,address_line5
			,postcode
			,party_id
			,address_type_code
		)
		VALUES (
			ADDR_SEQUENCE.NEXTVAL
			,rec_lcp.address_line1
			,rec_lcp.address_line2
			,rec_lcp.address_line3
			,rec_lcp.address_line4
			,rec_lcp.address_line5
			,rec_lcp.postcode
			,PARTIES_SEQUENCE.CURRVAL
			,'CODED PARTY'
		);
		
		-- Insert CODED_PARTIES row
		INSERT INTO coded_parties (
			party_id
			,code
			,admin_court_code
			,person_requested_name
			,address_line1
			,address_line2
			,address_line3
			,address_line4
			,address_line5
			,postcode
		)
		VALUES (
			PARTIES_SEQUENCE.CURRVAL
			,n_coded_party_code
			,n_admin_court_code
			,rec_lcp.person_requested_name
			,rec_lcp.address_line1
			,rec_lcp.address_line2
			,rec_lcp.address_line3
			,rec_lcp.address_line4
			,rec_lcp.address_line5
			,rec_lcp.postcode
		);
		
		-- Increment coded party number to get the next value
		n_coded_party_code := n_coded_party_code + 1;
		n_count_completed := n_count_completed + 1;
	
	END LOOP;
	
	-- Information line on number of lcps added
	dbms_output.put_line(n_count_completed || ' local coded parties added to court ' || n_admin_court_code);
	
	COMMIT;
	
EXCEPTION

		-- Court code entered in command line is not a SUPS Court
		WHEN e_non_sups_court_code THEN        
			dbms_output.put_line('Error: The Court Code: ' || n_admin_court_code || ' is not a SUPS Court.');
			RAISE;
			
		-- Starting Coded Party code is negative
		WHEN e_negative_starting_code THEN        
			dbms_output.put_line('Error: The starting coded party code: ' || n_coded_party_code || ' is negative.');
			RAISE;
			
		-- Starting Coded Party code falls in a National Coded Party range (1500-999 or 7000-9999)
		WHEN e_cannot_start_in_ncp_range THEN
			dbms_output.put_line('Error: The starting coded party code: ' || n_coded_party_code || ' falls in a reserved National Coded Party range.');
			RAISE;
		
		-- Whilst adding Coded Parties, have come to the end of the available Local Coded Party range
		WHEN e_run_out_of_codes THEN
			dbms_output.put_line('Error: no more available local coded party codes for court: ' || n_admin_court_code || '. ' || n_count_completed || ' out of ' ||  n_count_total || ' completed.');
			ROLLBACK;
			RAISE;	
		
		WHEN OTHERS THEN
			dbms_output.put_line('Unknown error has occurred!!!');
			dbms_output.put_line(n_count_completed || ' out of ' ||  n_count_total || ' completed.');
			dbms_output.put_line(SUBSTR(SQLERRM,1,500));
			ROLLBACK;
			RAISE;
	
END;

/

-- Drop the external table
BEGIN
        
        EXECUTE IMMEDIATE 'DROP TABLE local_coded_parties_ext';
        
        EXCEPTION
        
        WHEN OTHERS THEN
               NULL;
END;
/

SPOOL OFF