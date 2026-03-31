SET TERMOUT OFF
SET TIME OFF
SET TIMING OFF
SET FEEDBACK OFF
SET ECHO OFF
SET TRIMSPOOL ON
SET TRIMOUT ON
SET PAGESIZE 0
SET VERIFY OFF
SET SERVEROUTPUT ON
SET LINESIZE 2000

COLUMN dt new_val timestring
SELECT TO_CHAR(SYSDATE, 'YYYYMMDD-HH24MISS') dt FROM dual;

SPOOL sdt_post_report.&timestring..log

DECLARE
	
	CURSOR	c_mig_creditors IS
	SELECT  cred_code
			,count_claims
			,transferred_claims
			,count_judgments
			,transferred_judgments
			,count_warrants
			,transferred_warrants
			,count_parties
			,transferred_parties
			,count_events
			,transferred_events
			,failed_claims
			,migration_date
	FROM   	tmp_mcol_mig_info
	WHERE  	migration_complete = 'Y'
	ORDER BY migration_date desc, cred_code;
	
BEGIN

	DBMS_OUTPUT.ENABLE(250000);

	-- For each creditor migrated to date, output migration statistics
	FOR cred_rec IN c_mig_creditors LOOP
	
		dbms_output.put_line('=========================================');
		dbms_output.put_line('Coded Creditor ' || cred_rec.cred_code || ' migrated ' || TRUNC(cred_rec.migration_date) );
		dbms_output.put_line('=========================================');
		
		IF cred_rec.failed_claims > 0 THEN
			-- At least one claim failed to migrate, indicate how many records have migrated and how many still to go
			dbms_output.put_line(cred_rec.transferred_claims || ' out of ' || cred_rec.count_claims || ' cases migrated (' || cred_rec.failed_claims || ' failed)');
			dbms_output.put_line(cred_rec.transferred_parties || ' out of ' || cred_rec.count_parties || ' Parties migrated');
			dbms_output.put_line(cred_rec.transferred_judgments || ' out of ' || cred_rec.count_judgments || ' Judgments migrated');
			dbms_output.put_line(cred_rec.transferred_warrants || ' out of ' || cred_rec.count_warrants || ' Warrants migrated');
			dbms_output.put_line(cred_rec.transferred_events || ' out of ' || cred_rec.transferred_events || ' Events migrated');				
		ELSE
			-- No failures
			dbms_output.put_line('All cases migrated (' || cred_rec.count_claims || ' in total)');
			dbms_output.put_line(cred_rec.count_parties || ' Parties');
			dbms_output.put_line(cred_rec.count_judgments || ' Judgments');
			dbms_output.put_line(cred_rec.count_warrants || ' Warrants');
			dbms_output.put_line(cred_rec.transferred_events || ' Events');
		END IF;
		
		dbms_output.put_line('=========================================');
		dbms_output.new_line();
	
	END LOOP;

END;

/

SPOOL OFF