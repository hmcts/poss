WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:     
|
| SYNOPSIS      : This script generates a SYSTEM_DATA row for all courts
|				  representing the last AE sequence number (AE_SOD_SEQ)
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

SPOOL dml_trac_5718.log

DECLARE

	CURSOR get_courts IS
	SELECT c.code FROM courts c
	WHERE NVL(c.caseman_inservice,'N') = 'Y'
	AND NVL(c.sups_centralised_flag,'N') = 'Y'
	AND NOT EXISTS (
		SELECT NULL 
		FROM system_data sd
		WHERE sd.admin_court_code = c.code
		AND sd.item = 'AE_SOD_SEQ');
	
	-- Variables to hold the parameters passed in from the command line
	n_count	NUMBER := 0;
	
BEGIN

	-- Create SYSTEM_DATA records for all courts
	FOR court_rec IN get_courts LOOP
	
		INSERT INTO system_data
			(item
			,item_value
			,item_value_currency
			,admin_court_code)
		VALUES
			('AE_SOD_SEQ'
			,0
			,NULL
			,court_rec.code);
			
		n_count := n_count + 1;
	
	END LOOP;
	
	COMMIT;
	
	-- Results
	dbms_output.put_line('Records created: '||n_count);

END;

/

SPOOL OFF