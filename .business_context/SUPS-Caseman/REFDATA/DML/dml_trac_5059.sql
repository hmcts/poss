WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

SPOOL dml_trac_5059.log

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Creates any missing fees_paid records for warrants created with 
|				  the new numbering format.
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

	n_fees_added		PLS_INTEGER := 0;

	-- Cursor to retrieve all home warrants affected
	CURSOR cur_hwarrants_no_fees 
	IS
	SELECT w.warrant_number, w.issued_by, w.warrant_issue_date, w.warrant_fee, sa.user_id
	FROM warrants w, sups_amendments sa
	WHERE w.local_warrant_number IS NULL
	AND w.original_warrant_number IS NULL
	AND w.issued_by != 335
	AND w.warrant_issue_date >= TO_DATE('01-Jan-2014','DD-Mon-YYYY')
	AND NOT EXISTS (
		SELECT NULL FROM fees_paid fp
		WHERE fp.process_type = 'W'
		AND fp.process_number = w.warrant_number
		AND fp.allocation_date = w.warrant_issue_date
		AND fp.issuing_court = w.issued_by
		AND	fp.deleted_flag = 'N')
	AND sa.pk01 (+)= w.warrant_id
	AND sa.table_name (+)= 'WARRANTS'
	AND sa.amendment_type (+)= 'Inserted';

BEGIN

	-- Audit context
	sys.set_sups_app_ctx('support','0','trac 5059');

	-- Loop through each warrant and add a fees_paid record
	FOR rec_warrant IN cur_hwarrants_no_fees
	LOOP
	
		INSERT INTO fees_paid 
			(fees_paid_id
			,process_number
			,process_type
			,allocation_date
			,amount
			,issuing_court
			,deleted_flag
			,user_id
			,date_created)
		VALUES 
			(FEES_PAID_SEQUENCE.NEXTVAL
			,rec_warrant.warrant_number
			,'W'
			,rec_warrant.warrant_issue_date
			,NVL(rec_warrant.warrant_fee,0)
			,rec_warrant.issued_by
			,'N'
			,NVL(rec_warrant.user_id,'support')
			,rec_warrant.warrant_issue_date);
		
		n_fees_added := n_fees_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_fees_added || ' records added');

	COMMIT;

END;

/

SPOOL OFF
