WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script moves all 'dangling' payments into a payments archive
|				  table.  The term 'dangling' refers to payments linked to 
|				  enforcements (e.g. Cases, Warrants etc.) that do not exist in the
|				  SUPS database as they were not migrated from Legacy CM
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
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4573_a.log

-- Move the dangling payments to the payments archive table
CREATE TABLE payments_archive
AS
(SELECT *
 FROM   payments p
 WHERE  p.payment_for = 'CASE'
 AND NOT EXISTS (SELECT NULL FROM cases WHERE case_number = p.subject_no) )
UNION
(SELECT *
 FROM   payments p
 WHERE  p.payment_for IN ('CO', 'AO/CAEO')
 AND NOT EXISTS (SELECT NULL FROM consolidated_orders WHERE co_number = p.subject_no) )
UNION
(SELECT *
 FROM   payments p
 WHERE  p.payment_for = 'AE'
 AND NOT EXISTS (SELECT NULL FROM ae_applications WHERE ae_number = p.subject_no) )
UNION
(SELECT *
 FROM   payments p
 WHERE  p.payment_for = 'HOME WARRANT'
 AND NOT EXISTS (SELECT NULL FROM warrants w 
		 WHERE w.local_warrant_number IS NULL
		 AND w.warrant_number = p.subject_no
		 AND w.issued_by = p.enforcement_court_code) )
UNION
(SELECT *
 FROM   payments p
 WHERE  p.payment_for = 'FOREIGN WARRANT'
 AND NOT EXISTS (SELECT NULL FROM warrants w 
		 WHERE w.local_warrant_number IS NOT NULL
		 AND w.local_warrant_number = p.subject_no
				 AND w.currently_owned_by = p.enforcement_court_code) );

-- Setup primary key and indexes for the archive table				 
ALTER TABLE payments_archive
ADD PRIMARY KEY (transaction_number, admin_court_code);		

CREATE INDEX payments_archive_ix1 ON payments_archive
    (subject_no
    ,payment_for
    );
	
CREATE INDEX payments_archive_ix2 ON payments_archive
    (subject_no
    ,payment_for
	,enforcement_court_code
    );
	
CREATE INDEX payments_archive_ix3 ON payments_archive (enforcement_court_code);

CREATE INDEX payments_archive_ix4 ON payments_archive (admin_court_code);

DECLARE

	-- Variables
	n_count_dnglg_pymts		NUMBER;
	n_count_case_pymts		NUMBER;
	n_count_co_pymts		NUMBER;
	n_count_ae_pymts		NUMBER;
	n_count_hw_pymts		NUMBER;
	n_count_fw_pymts		NUMBER;
	n_total_deleted			NUMBER;
		
	-- Declare user exceptions
	e_totals_dont_match	EXCEPTION;
	PRAGMA EXCEPTION_INIT(e_totals_dont_match, -20000);

BEGIN

	-- Set audit context
	sys.set_sups_app_ctx('support','0','payment archive');

	-- Retrieve a count of the number of archived payments
	SELECT COUNT(*)
	INTO n_count_dnglg_pymts
	FROM payments_archive;
	
	-----------------------------------------------------------
	-- Delete dangling payments from the main payments table --
	-----------------------------------------------------------
	
	-- Delete Case payments and retrieve a count
	DELETE
	FROM   payments p
	WHERE  p.payment_for = 'CASE'
	AND NOT EXISTS (SELECT NULL FROM cases WHERE case_number = p.subject_no);

	n_count_case_pymts := SQL%ROWCOUNT;

	-- Delete CO payments and retrieve a count
	DELETE
	FROM   payments p
	WHERE  p.payment_for IN ('CO', 'AO/CAEO')
	AND NOT EXISTS (SELECT NULL FROM consolidated_orders WHERE co_number = p.subject_no);
	
	n_count_co_pymts := SQL%ROWCOUNT;

	-- Delete AE payments and retrieve a count
	DELETE
	FROM   payments p
	WHERE  p.payment_for = 'AE'
	AND NOT EXISTS (SELECT NULL FROM ae_applications WHERE ae_number = p.subject_no);
	
	n_count_ae_pymts := SQL%ROWCOUNT;

	-- Delete Home Warrant payments and retrieve a count
	DELETE
	FROM   payments p
	WHERE  p.payment_for = 'HOME WARRANT'
	AND NOT EXISTS (SELECT NULL FROM warrants w 
					WHERE w.local_warrant_number IS NULL
					AND w.warrant_number = p.subject_no
					AND w.issued_by = p.enforcement_court_code);
					
	n_count_hw_pymts := SQL%ROWCOUNT;
	
	-- Delete Foreign Warrant payments and retrieve a count	
	DELETE
	FROM   payments p
	WHERE  p.payment_for = 'FOREIGN WARRANT'
	AND NOT EXISTS (SELECT NULL FROM warrants w 
					WHERE w.local_warrant_number IS NOT NULL
					AND w.local_warrant_number = p.subject_no
					AND w.currently_owned_by = p.enforcement_court_code);
					
	n_count_fw_pymts := SQL%ROWCOUNT;
	
	-- Add the delete counts together
	n_total_deleted := n_count_case_pymts + n_count_co_pymts + n_count_ae_pymts + n_count_hw_pymts + n_count_fw_pymts;
	
	IF n_count_dnglg_pymts = n_total_deleted THEN
		-- Number deleted matches number in archive table - commit changes
		dbms_output.put_line(n_count_dnglg_pymts || ' payments archived successfully.');
		COMMIT;
	ELSE
		-- Totals do not match, raise exception
		RAISE e_totals_dont_match;
	END IF;
	
EXCEPTION

		WHEN e_totals_dont_match THEN        
			dbms_output.put_line('Error: Total archived = ' || n_count_dnglg_pymts || ' but the total deleted = ' || n_total_deleted);
			RAISE;
		
		WHEN OTHERS THEN
			dbms_output.put_line('Unknown error has occurred!!!');
			dbms_output.put_line(SUBSTR(SQLERRM,1,500));
			RAISE;
					
END;

/

SPOOL OFF