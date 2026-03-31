WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$     
|
| SYNOPSIS      : This script applies changes to the OBLIGATION_EVENTS table, specifically
|				  to the EVENT_ID column which must be converted to a VARCHAR2.  The
|				  table is emptied into a temporary table, a foreign key removed and
|				  then the column altered before data is moved back into the table
|				  and the temporary table dropped.  RFS 3719
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

SPOOL ddl_trac_4763_c.log

-- Ensure the temporary table does not already exist
BEGIN
        
        EXECUTE IMMEDIATE 'DROP TABLE tmp_obligation_events';
        
        EXCEPTION
        
        WHEN OTHERS THEN
               NULL;
END;
/

-- Create temporary table
CREATE TABLE tmp_obligation_events
	(event_id VARCHAR2(4)
	,maintenance_mode VARCHAR2(1)
);

-- Copy data from OBLIGATION_EVENTS to the temporary table (converting EVENT_ID to a VARCHAR2)
INSERT INTO tmp_obligation_events
SELECT TO_CHAR(event_id), maintenance_mode
FROM obligation_events;

COMMIT;

-- Empty the OBLIGATION_EVENTS table
TRUNCATE TABLE obligation_events;

-- Remove Foreign Key constraint to the STANDARD_EVENTS table
ALTER TABLE obligation_events
DROP CONSTRAINT DMS_STD_EVENTS_FK;

-- Change datatype of EVENT_ID column
ALTER TABLE obligation_events
MODIFY 
( 
   event_id    VARCHAR2(4)
);

-- Insert data back into OBLIGATION_EVENTS table from temporary table
INSERT INTO obligation_events
SELECT event_id, maintenance_mode
FROM tmp_obligation_events;

COMMIT;

/

-- Drop temporary table
BEGIN
        
        EXECUTE IMMEDIATE 'DROP TABLE tmp_obligation_events';
        
        EXCEPTION
        
        WHEN OTHERS THEN
               NULL;
END;
/

SPOOL OFF