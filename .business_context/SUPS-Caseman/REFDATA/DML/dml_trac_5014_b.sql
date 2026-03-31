WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

SPOOL dml_trac_5014_b.log

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Script to update court addresses that feature the text 'COUNTY COURT'
|				  and replace with 'HEARING CENTRE' for Single Court.
|
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      Run as CMAN user with table creation privileges.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

DECLARE

	-- Cursor to retrieve all court addresses affected
	CURSOR cur_cc_addresses 
	IS
	SELECT ga.address_id, ga.address_line1, ga.address_line2, ga.address_line3, ga.address_line4, ga.address_line5
	FROM given_addresses ga, courts c
	WHERE c.sups_centralised_flag = 'Y'
	AND ga.court_code = c.code
	AND ga.address_type_code IN ('OFFICE','COURTHOUSE')
	AND ga.valid_to IS NULL
	AND (
		UPPER(ga.address_line1) LIKE '%COUNTY COURT%'
		OR UPPER(ga.address_line2) LIKE '%COUNTY COURT%'
		OR UPPER(ga.address_line3) LIKE '%COUNTY COURT%'
		OR UPPER(ga.address_line4) LIKE '%COUNTY COURT%'
		OR UPPER(ga.address_line5) LIKE '%COUNTY COURT%'
	);

BEGIN

	-- Audit context
	sys.set_sups_app_ctx('support','0','trac 5014');

	-- Loop through each address affected
	FOR rec_address IN cur_cc_addresses
	LOOP
	
		-- Handle address line 1
		IF UPPER(rec_address.address_line1) LIKE '%CROWN AND COUNTY COURT%' THEN
			
			UPDATE 	given_addresses ga
			SET		ga.address_line1 = REPLACE(UPPER(ga.address_line1), 'CROWN AND COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line1) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line1) <= 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line1 = REPLACE(UPPER(ga.address_line1), 'COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line1) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line1) > 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line1 = REPLACE(UPPER(ga.address_line1), 'COUNTY COURT', 'HEARING CTR')
			WHERE	ga.address_id = rec_address.address_id;
		
		END IF;
		
		-- Handle address line 2
		IF UPPER(rec_address.address_line2) LIKE '%CROWN AND COUNTY COURT%' THEN
			
			UPDATE 	given_addresses ga
			SET		ga.address_line2 = REPLACE(UPPER(ga.address_line2), 'CROWN AND COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line2) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line2) <= 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line2 = REPLACE(UPPER(ga.address_line2), 'COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line2) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line2) > 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line2 = REPLACE(UPPER(ga.address_line2), 'COUNTY COURT', 'HEARING CTR')
			WHERE	ga.address_id = rec_address.address_id;
		
		END IF;
		
		-- Handle address line 3
		IF UPPER(rec_address.address_line3) LIKE '%CROWN AND COUNTY COURT%' THEN
			
			UPDATE 	given_addresses ga
			SET		ga.address_line3 = REPLACE(UPPER(ga.address_line3), 'CROWN AND COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line3) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line3) <= 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line3 = REPLACE(UPPER(ga.address_line3), 'COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line3) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line3) > 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line3 = REPLACE(UPPER(ga.address_line3), 'COUNTY COURT', 'HEARING CTR')
			WHERE	ga.address_id = rec_address.address_id;
		
		END IF;
		
		-- Handle address line 4
		IF UPPER(rec_address.address_line4) LIKE '%CROWN AND COUNTY COURT%' THEN
			
			UPDATE 	given_addresses ga
			SET		ga.address_line4 = REPLACE(UPPER(ga.address_line4), 'CROWN AND COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line4) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line4) <= 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line4 = REPLACE(UPPER(ga.address_line4), 'COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line4) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line4) > 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line4 = REPLACE(UPPER(ga.address_line4), 'COUNTY COURT', 'HEARING CTR')
			WHERE	ga.address_id = rec_address.address_id;
		
		END IF;
		
		-- Handle address line 5
		IF UPPER(rec_address.address_line5) LIKE '%CROWN AND COUNTY COURT%' THEN
			
			UPDATE 	given_addresses ga
			SET		ga.address_line5 = REPLACE(UPPER(ga.address_line5), 'CROWN AND COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line5) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line5) <= 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line5 = REPLACE(UPPER(ga.address_line5), 'COUNTY COURT', 'HEARING CENTRE')
			WHERE	ga.address_id = rec_address.address_id;
			
		ELSIF UPPER(rec_address.address_line5) LIKE '%COUNTY COURT%' AND LENGTH(rec_address.address_line5) > 33 THEN
		
			UPDATE 	given_addresses ga
			SET		ga.address_line5 = REPLACE(UPPER(ga.address_line5), 'COUNTY COURT', 'HEARING CTR')
			WHERE	ga.address_id = rec_address.address_id;
		
		END IF;

	END LOOP;

	COMMIT;

END;

/

SPOOL OFF
