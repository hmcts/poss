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

SPOOL sdt_exceptions_report.&timestring..log

DECLARE
	
	CURSOR	c_mig_failures IS
	SELECT  case_number
			,cred_code
			,failure_reason
	FROM   	tmp_mcol_mig_failures
	ORDER BY cred_code, case_number;
	
	l_count_failures	NUMBER;
	l_cred_code			tmp_mcol_mig_failures.cred_code%TYPE;
	
BEGIN

	DBMS_OUTPUT.ENABLE(250000);
	
	l_count_failures := 0;
	l_cred_code := -1;

	-- Output details on each failure
	FOR failed_rec IN c_mig_failures LOOP
	
		l_count_failures := l_count_failures + 1;
		IF l_cred_code != failed_rec.cred_code THEN
			
			l_cred_code := failed_rec.cred_code;
			dbms_output.put_line('=========================================');
			dbms_output.put_line('Coded Creditor: ' || l_cred_code);
			dbms_output.put_line('=========================================');
		
		END IF;
	
		dbms_output.put_line('Case Number: ' || failed_rec.case_number || ' - ' || failed_rec.failure_reason);
	
	END LOOP;

END;

/

SPOOL OFF