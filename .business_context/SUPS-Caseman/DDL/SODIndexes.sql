/*-------------------------------------------------------------------------------
|
| FILENAME      : SODIndexes.sql
|
| SYNOPSIS      : A caddy to apply scalability changes to the CaseMan database
|
|
| $Author: barisa $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2008 Logica plc.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Part 2 of 2.
|
|---------------------------------------------------------------------------------
|
| $Rev: 2763 $:          Revision of last commit
| $Date: 2009-05-27 14:39:41 +0100 (Wed, 27 May 2009) $:         Date of last commit
| $Id: SODIndexes.sql 2763 2009-05-27 13:39:41Z barisa $         Revision at last change
|
--------------------------------------------------------------------------------*/
SPOOL SODIndexes.log

PROMPT ************************************************************************
PROMPT Dropping Indexs If exists
PROMPT ************************************************************************

BEGIN
    EXECUTE IMMEDIATE ('DROP INDEX co_events_ix9');
        dbms_output.put_line('********************************************************');
        dbms_output.put_line('INDEX co_events_ix9 DROPPED');
        dbms_output.put_line('********************************************************');
EXCEPTION
    WHEN OTHERS THEN
        dbms_output.put_line('*******************************************************************');
        dbms_output.put_line('INDEX co_events_ix9 does not exist');
        dbms_output.put_line('********************************************************************');
END;

/

BEGIN
    EXECUTE IMMEDIATE ('DROP INDEX cases_fx1');
        dbms_output.put_line('********************************************************');
        dbms_output.put_line('INDEX cases_fx1 DROPPED');
        dbms_output.put_line('********************************************************');
EXCEPTION
    WHEN OTHERS THEN
        dbms_output.put_line('*******************************************************************');
        dbms_output.put_line('INDEX cases_fx1 does not exist');
        dbms_output.put_line('********************************************************************');
END;

/

BEGIN
    EXECUTE IMMEDIATE ('DROP INDEX ae_applications_ux1');
        dbms_output.put_line('********************************************************');
        dbms_output.put_line('INDEX ae_applications_ux1 DROPPED');
        dbms_output.put_line('********************************************************');
EXCEPTION
    WHEN OTHERS THEN
        dbms_output.put_line('*******************************************************************');
        dbms_output.put_line('INDEX ae_applications_ux1 does not exist');
        dbms_output.put_line('********************************************************************');
END;

/

BEGIN
    EXECUTE IMMEDIATE ('DROP INDEX ae_events_ix6');
        dbms_output.put_line('********************************************************');
        dbms_output.put_line('INDEX ae_events_ix6 DROPPED');
        dbms_output.put_line('********************************************************');
EXCEPTION
    WHEN OTHERS THEN
        dbms_output.put_line('*******************************************************************');
        dbms_output.put_line('INDEX ae_events_ix6 does not exist');
        dbms_output.put_line('********************************************************************');
END;

/

BEGIN
    EXECUTE IMMEDIATE ('DROP INDEX ae_events_fx1');
        dbms_output.put_line('********************************************************');
        dbms_output.put_line('INDEX ae_events_fx1 DROPPED');
        dbms_output.put_line('********************************************************');
EXCEPTION
    WHEN OTHERS THEN
        dbms_output.put_line('*******************************************************************');
        dbms_output.put_line('INDEX ae_events_fx1 does not exist');
        dbms_output.put_line('********************************************************************');
END;

/

BEGIN
    EXECUTE IMMEDIATE ('DROP INDEX ae_events_ix7');
        dbms_output.put_line('********************************************************');
        dbms_output.put_line('INDEX ae_events_ix7 DROPPED');
        dbms_output.put_line('********************************************************');
EXCEPTION
    WHEN OTHERS THEN
        dbms_output.put_line('*******************************************************************');
        dbms_output.put_line('INDEX ae_events_ix7 does not exist');
        dbms_output.put_line('********************************************************************');
END;

/

BEGIN
    EXECUTE IMMEDIATE ('DROP INDEX ae_events_fx2');
        dbms_output.put_line('********************************************************');
        dbms_output.put_line('INDEX ae_events_fx2 DROPPED');
        dbms_output.put_line('********************************************************');
EXCEPTION
    WHEN OTHERS THEN
        dbms_output.put_line('*******************************************************************');
        dbms_output.put_line('INDEX ae_events_fx2 does not exist');
        dbms_output.put_line('********************************************************************');
END;

/
PROMPT ************************************************************************
PROMPT Creating Indexs
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Adding indexes to CO_EVENTS
PROMPT ************************************************************************

CREATE INDEX co_events_ix9 ON co_events
    (co_number
    ,std_event_id
    );

PROMPT ************************************************************************
PROMPT Adding indexes to CASES
PROMPT ************************************************************************	

CREATE INDEX cases_fx1 ON cases(NVL(status, 'N/A'));

PROMPT ************************************************************************
PROMPT Adding indexes to AE_APPLICATIONS
PROMPT ************************************************************************	

CREATE UNIQUE INDEX ae_applications_ux1 ON ae_applications
    (ae_number
    ,case_number
    );

PROMPT ************************************************************************
PROMPT Adding indexes to AE_EVENTS
PROMPT ************************************************************************	

CREATE INDEX ae_events_ix6 ON ae_events
    (ae_number
    ,std_event_id
    );

	
CREATE INDEX ae_events_fx1 ON ae_events
    (TRUNC(NVL(service_date, TO_DATE('31-12-9999','DD-MM-YYYY')))
    ,NVL(service_status, 'NOT SERVED' ),error_indicator
    );

CREATE INDEX ae_events_ix7 ON ae_events(process_stage);

CREATE INDEX ae_events_fx2 ON ae_events(NVL(process_stage,' '));

PROMPT ************************************************************************
PROMPT Script SODindexes has been successfully ran!!!
PROMPT ************************************************************************	

SPOOL off
