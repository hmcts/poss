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

SPOOL export_over_link.&timestring..log

DECLARE

	l_timestring			VARCHAR2(30);
	
BEGIN

	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Start copy of mcol_mig_claim_data over link.');

	INSERT INTO mcol_mig_claim_data@ccbc_mcol_link
	SELECT * FROM mcol_mig_claim_data;
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Completed copy of mcol_mig_claim_data over link.');
	
	-------------------------------------------------------------------------------------------
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Start copy of mcol_mig_party_data over link.');
	
	INSERT INTO mcol_mig_party_data@ccbc_mcol_link
	SELECT * FROM mcol_mig_party_data;
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Completed copy of mcol_mig_party_data over link.');
	
	-------------------------------------------------------------------------------------------
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Start copy of mcol_mig_judgment_data over link.');
	
	INSERT INTO mcol_mig_judgment_data@ccbc_mcol_link
	SELECT * FROM mcol_mig_judgment_data;
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Completed copy of mcol_mig_judgment_data over link.');
	
	-------------------------------------------------------------------------------------------
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Start copy of mcol_mig_warrant_data over link.');
	
	INSERT INTO mcol_mig_warrant_data@ccbc_mcol_link
	SELECT * FROM mcol_mig_warrant_data;
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Completed copy of mcol_mig_warrant_data over link.');
	
	-------------------------------------------------------------------------------------------
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Start copy of mcol_mig_event_data over link.');
	
	INSERT INTO mcol_mig_event_data@ccbc_mcol_link
	SELECT * FROM mcol_mig_event_data;
	
	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' Completed copy of mcol_mig_event_data over link.');
	
	-------------------------------------------------------------------------------------------

	SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') INTO l_timestring FROM dual;
	dbms_output.put_line(l_timestring || ' All tables copied over database link');
	
	COMMIT;

END;

/

SPOOL OFF