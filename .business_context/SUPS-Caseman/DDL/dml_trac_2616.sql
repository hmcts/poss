SET LINESIZE 500
SET NUMWIDTH 12
SET PAGESIZE 10000
SET SERVEROUTPUT ON SIZE 1000000
SET TRIMSPOOL ON
SET VERIFY OFF
SET ECHO ON

ALTER SESSION ENABLE PARALLEL DDL;

SPOOL dml_trac_2616.out

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Script cleans up the CaseMan schema by purging the Obligations Table
|				  of 43m rows.  This is done by creating a copy of Obligations Table,
|			      migrating the rows we want to keep (anything that's not a year old)
|				  to it.
|
|				  The original Table will be truncated, and the the table will be repopulated
|				  with the rows that were archived as described in the paragraph above.
|
|				  Truncation will reclaim the diskspace consumed by the deleted obligation
|				  entries.	 
|
|				  A Backup of the Obligations Table must be taken before running this script! 
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
| COMMENTS      : A log file will be produced in the same directory, where this script is 
|				  run from.	
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:           Revision at last change
|
--------------------------------------------------------------------------------*/

SET HEADING OFF
SELECT '** Starting dml_trac_2616 at : ' || SYSDATE || ' **'
FROM   sys.dual;
SET HEADING ON 

CREATE TABLE obligations_temp
AS
SELECT  o.obligation_seq, o.obligation_type, o.expiry_date, 
   o.notes, o.event_seq, o.ae_event_seq, 
   o.last_used_by, o.delete_flag, o.case_number
FROM obligations o
WHERE TRUNC(o.expiry_date) >=  TRUNC(SYSDATE - 365);


SET HEADING OFF ECHO OFF
SELECT 'No of Records copied to obligations_temp : ' || TO_CHAR(count(1)) figure
FROM 	obligations_temp;
SET HEADING ON ECHO ON

TRUNCATE TABLE obligations;

exec set_sups_app_ctx ('support', '0', 'Obligation Purge');

INSERT INTO obligations
SELECT  o.obligation_seq, o.obligation_type, o.expiry_date, 
   o.notes, o.event_seq, o.ae_event_seq, 
   o.last_used_by, o.delete_flag, o.case_number
FROM obligations_temp o;

BEGIN 
	dbms_output.put_line('No of Records copied to cleared down obligations Table : ' || SQL%ROWCOUNT);
END;
/
DROP TABLE obligations_temp PURGE;

-- not really needed as DDLs above should perform implicit commit but done for as failsafe.
COMMIT;

SET HEADING OFF
SELECT '** Finished dml_trac_2616 at : ' || SYSDATE || ' **'
FROM   sys.dual;
SET HEADING ON


SPOOL OFF

ALTER SESSION DISABLE PARALLEL DDL;

EXIT