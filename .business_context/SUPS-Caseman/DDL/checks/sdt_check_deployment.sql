/*
WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE
*/

SET SERVEROUT ON SIZE 500000
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script carries out checks to ensure that the deployment
|                    of the SDT database changes is correct
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. Logica's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$   Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL sdt_check_deployment.log

-- Set audit context
CALL sys.set_sups_app_ctx('support','0','sdt_check_deployment');

DECLARE

deployed_ok     BOOLEAN := TRUE;

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_db_package                                                                          *
* DESCRIPTION   : verifies that a named database package is valid                                           *
\***********************************************************************************************************/

PROCEDURE check_db_package   ( package_name IN VARCHAR2) IS

found_package   user_objects.object_name%TYPE;

BEGIN

    -- check package header is valid
    SELECT  object_name
    INTO    found_package
    FROM    user_objects 
    WHERE   object_name = UPPER(package_name)
    AND     object_type = 'PACKAGE'
    AND     status      = 'VALID';

    -- check package body is valid
    SELECT  object_name
    INTO    found_package
    FROM    user_objects 
    WHERE   object_name = UPPER(package_name)
    AND     object_type = 'PACKAGE BODY'
    AND     status      = 'VALID';

    DBMS_OUTPUT.PUT_LINE('Success - package '||package_name||' is valid');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - package '||package_name||' is not present or is invalid');
        
        deployed_ok := FALSE;

END; -- end of check_db_package

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_invalid                                                                             *
* DESCRIPTION   : checks for invalid db objects                                                             *
\***********************************************************************************************************/
PROCEDURE check_invalid  IS

found_invalid   NUMBER := NULL;

BEGIN

    -- check for invalid objects
    SELECT  COUNT(object_name)
    INTO    found_invalid
    FROM    user_objects 
    WHERE   status      = 'INVALID';

    IF  found_invalid = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Success - No invalid objects found');
    ELSE
        deployed_ok := FALSE;
        DBMS_OUTPUT.PUT_LINE('ERROR  - Found '||found_invalid||' objects in USER_OBJECTS table');

    END IF;

END; -- end of check_db_trigger

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_db_trigger                                                                          *
* DESCRIPTION   : verifies that a named database trigger is valid                                           *
\***********************************************************************************************************/
PROCEDURE check_db_trigger   ( trigger_name IN VARCHAR2) IS

found_trigger   user_objects.object_name%TYPE;

BEGIN

    -- check package is valid
    SELECT  object_name
    INTO    found_trigger
    FROM    user_objects 
    WHERE   object_name = UPPER(trigger_name)
    AND     object_type = 'TRIGGER'
    AND     status      = 'VALID';


    DBMS_OUTPUT.PUT_LINE('Success - tigger '||trigger_name||' is valid');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - trigger '||trigger_name||' is not present or is invalid');
        
        deployed_ok := FALSE;

END; -- end of check_db_trigger

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_db_columns                                                                          *
* DESCRIPTION   : verifies that a named columnn is present on a named table                                           *
\***********************************************************************************************************/
PROCEDURE check_db_columns  ( 
                            table_parameter  IN VARCHAR2, 
                            column_parameter IN VARCHAR2
                            ) IS

found_column   user_tab_cols.column_name%TYPE := NULL;

BEGIN

    -- check column is present
    SELECT  column_name
    INTO    found_column
    FROM    user_tab_cols
    WHERE   table_name  = table_parameter
    AND     column_name = column_parameter;
    
    DBMS_OUTPUT.PUT_LINE('Success - column '||found_column||' exists in '||table_parameter||' table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - column '||column_parameter||' is missing in '||table_parameter||' table');
        
        deployed_ok := FALSE;

END; -- end of check_db_columns

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_db_column_size                                                                      *
* DESCRIPTION   : verifies that a named columnn is present on a named table and is the specified size       *
\***********************************************************************************************************/
PROCEDURE check_db_column_size  ( 
                            table_parameter  IN VARCHAR2, 
                            column_parameter IN VARCHAR2,
                            required_size    IN NUMBER
                            ) IS

found_column   user_tab_cols.column_name%TYPE := NULL;

BEGIN

    -- check column and has correct size is present
    SELECT  column_name
    INTO    found_column
    FROM    user_tab_cols
    WHERE   table_name  = table_parameter
    AND     column_name = column_parameter
    AND     char_length = required_size;
    
    DBMS_OUTPUT.PUT_LINE('Success - column '||found_column||' is the correct size in '||table_parameter||' table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - column '||column_parameter||' is missing or is not the correct size in '||table_parameter||' table');
        
        deployed_ok := FALSE;

END; -- end of check_db_column_size

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_db_table                                                                           *
* DESCRIPTION   : verifies that a named table is present in the database                                    *
\***********************************************************************************************************/
PROCEDURE check_db_table  ( 
                            table_parameter  IN VARCHAR2
                            ) IS

found_table   user_tables.table_name%TYPE := NULL;

BEGIN

    -- check table exists
    SELECT  table_name
    INTO    found_table
    FROM    user_tables
    WHERE   table_name  = table_parameter;
    
    DBMS_OUTPUT.PUT_LINE('Success - table '||found_table||' exists');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - table '||table_parameter||' does not exist');
        
        deployed_ok := FALSE;

END; -- end of check_db_table

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_std_event_desc                                                                      *
* DESCRIPTION   : verifies that a event has corrected description                                            *    
\***********************************************************************************************************/
PROCEDURE check_std_event_desc  (
                                std_event    IN NUMBER,
                                event_desc  IN VARCHAR2
                                ) IS

found_event   standard_events.event_id%TYPE := NULL;

BEGIN

    -- check event is valid
    SELECT  se.event_id
    INTO    found_event
    FROM    standard_events se
    WHERE   se.event_id     = std_event
    AND        se.description     = event_desc;
    
    DBMS_OUTPUT.PUT_LINE('Success - event '||found_event||' has correct description in STANDARD_EVENTS table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - event '||std_event||' does not exist or has wroing description in STANDARD_EVENTS table');
        
        deployed_ok := FALSE;

END; -- end of check_std_event_desc

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_reject_reason                                                                       *
* DESCRIPTION   : verifies that a reject reason exists with the correct description                         *
\***********************************************************************************************************/
PROCEDURE check_reject_reason  (
                                rcj_code    IN NUMBER,
                                rcj_desc    IN VARCHAR2
                                ) IS

found_rejection   standard_events.event_id%TYPE := NULL;

BEGIN

    -- check reject reason is valid
    SELECT  rr.reject_code
    INTO    found_rejection
    FROM    reject_reasons rr
    WHERE   rr.reject_code        = rcj_code
    AND        rr.reject_text    = rcj_desc;
    
    DBMS_OUTPUT.PUT_LINE('Success - reject reason '||found_rejection||' has correct description in REJECT REASONS table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - reject_reason '||rcj_code||' does not exist or has wroing description in RECJECT_REASONS table');
        
        deployed_ok := FALSE;
        
END; -- end of check_reject_reason

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_report_seq                                                                          *
* DESCRIPTION   : verifies that a specified entry exists in the report sequence table                       *
\***********************************************************************************************************/
PROCEDURE check_report_seq  (
                                rep_desc    IN VARCHAR2
                                ) IS

found_name   report_sequences.form_name%TYPE := NULL;

BEGIN

    -- check report seq is valid
    SELECT  rs.form_name
    INTO    found_name
    FROM    report_sequences rs
    WHERE   rs.form_name    = rep_desc;
    
    DBMS_OUTPUT.PUT_LINE('Success - report form name '||found_name||' in REPORT_SEQUENCES table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - report form name '||rep_desc||' does not exist  in REPORT_SEQUENCES table');
        
        deployed_ok := FALSE;
        
END; -- end of check_report_seq

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_task                                                                                *
* DESCRIPTION   : verifies that a specified task exists in the TASKS table with correct description         *
\***********************************************************************************************************/
PROCEDURE check_task    (
                            task_no     IN VARCHAR2,
                            task_desc   IN VARCHAR2
                        ) IS

found_task   tasks.task_number%TYPE := NULL;

BEGIN

    -- check task is valid
    SELECT  t.task_number
    INTO    found_task
    FROM    tasks t
    WHERE   t.task_number       = task_no
    AND     t.task_description  = task_desc
    AND     t.task_type         = 'B'
    AND     t.action_event_ind  = 'E';
    
    DBMS_OUTPUT.PUT_LINE('Success - task '||found_task||' in TASKS table with correct description');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - task '||task_desc||' does not exist or has wrong description is TASK table');
        
        deployed_ok := FALSE;
        
END; -- end of check_task

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_cdr_event                                                                           *
* DESCRIPTION   : verifies that a specified cdr event exists in the CDR_MCOL_EVENT_MAPPING table            *
\***********************************************************************************************************/
PROCEDURE check_cdr_event    (
                            cdr_event   IN NUMBER,
                            mtype   IN VARCHAR2
                        ) IS

found_event   cdr_mcol_event_mapping.std_event_id%TYPE := NULL;

BEGIN

    -- check cdr event is valid
    SELECT  cmem.std_event_id
    INTO    found_event
    FROM    cdr_mcol_event_mapping cmem
    WHERE   cmem.std_event_id   = cdr_event
    AND     cmem.mcol_type      = mtype;
    
    DBMS_OUTPUT.PUT_LINE('Success - event '||found_event||' in CDR_MCOL_EVENT_MAPPING table with correct description');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - event '||cdr_event||' does not exist or has wrong description is CDR_MCOL_EVENT_MAPPING table');
        
        deployed_ok := FALSE;
        
END; -- end of check_cdr_event

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_cdr_status                                                                           *
* DESCRIPTION   : verifies that a specified cdr status exists in the CDR_MCOL_STATUS_MAPPING table            *
\***********************************************************************************************************/
PROCEDURE check_cdr_status   (
                            cdr_status  IN VARCHAR2,
                            mtype       IN VARCHAR2
                            ) IS

found_status   cdr_mcol_status_mapping.claim_status%TYPE := NULL;

BEGIN

    -- check status is valid
    SELECT  cmsm.claim_status
    INTO    found_status
    FROM    cdr_mcol_status_mapping cmsm
    WHERE   cmsm.claim_status   = cdr_status
    AND     cmsm.mcol_type      = mtype;
    
    DBMS_OUTPUT.PUT_LINE('Success - status '||found_status||' in CDR_MCOL_STATUS_MAPPING table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - status '||cdr_status||' does not exist or has wrong mapping in CDR_MCOL_STATUS_MAPPING table');
        
        deployed_ok := FALSE;
        
END; -- end of check_cdr_status


/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_ref_code                                                                          *
* DESCRIPTION   : verifies that a specified cdr status exists in the CCBC_REF_CODES table            *
\***********************************************************************************************************/
PROCEDURE check_ref_code    (
                                ref_code  IN VARCHAR2,
                                ref_desc     IN VARCHAR2
                                ) IS

found_code   ccbc_ref_codes.rv_iit_code_1%TYPE := NULL;

BEGIN

    -- check ref code is valid
    SELECT  crc.rv_iit_code_1
    INTO    found_code
    FROM    ccbc_ref_codes crc
    WHERE   crc.rv_domain       = 'EVENT_SETTING_CASE_STATUS'
    AND        crc.rv_low_value    = ref_code
    AND     crc.rv_iit_code_1   = ref_desc;
    
    DBMS_OUTPUT.PUT_LINE('Success - code '||found_code||' in CCBC_REF_CODES table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - code '||ref_code||' does not exist or has wrong mapping in CCBC_REF_CODES table');
        
        deployed_ok := FALSE;
        
END; -- end of check_ref_code

/***********************************************************************************************************\
* TYPE          : PROCEDURE                                                                                 *
* NAME          : check_ref_code                                                                          *
* DESCRIPTION   : verifies that a specified event exists in the CHANGED_EVENTS table            *
\***********************************************************************************************************/
PROCEDURE check_changed_event   (
                                event_id  IN number,
                                event_desc  IN VARCHAR2
                                ) IS

found_event   changed_events.std_event_id%TYPE := NULL;

BEGIN

    -- check event is valid
    SELECT  ce.std_event_id
    INTO    found_event
    FROM    changed_events ce
    WHERE   ce.std_event_id         = event_id
    AND     ce.event_description    = event_desc;
    
    DBMS_OUTPUT.PUT_LINE('Success - code '||found_event||' in CHANGED_EVENTS table');
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR - code '||event_id||' does not exist or has wrong mapping in CHANGED_EVENTS table');
        
        deployed_ok := FALSE;
        
END; -- end of check_changed_event

/*******************************************************************************************************\
* TYPE          :   Main                                                                                *
* NAME          :   Main programme                                                                      *
* DESCRIPTION   :   calls various procedures to verify that all the required code and data has been     *
*                   correctly deployed for the SDT database changes                                     *
\*******************************************************************************************************/

BEGIN


    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating DDL database changes ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));

    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** checking ddl_trac_4997 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    check_db_columns('MCOL_DATA', 'PREVIOUS_CREDITOR');
    check_db_columns('MCOL_DATA', 'NEW_CREDITOR');
    check_db_columns('MCOL_DATA', 'JUDGMENT_TYPE');
    check_db_columns('MCOL_DATA', 'JOINT_JUDGMENT');
    check_db_columns('MCOL_DATA', 'TOTAL');
    check_db_columns('MCOL_DATA', 'INSTALMENT_AMOUNT');
    check_db_columns('MCOL_DATA', 'FREQUENCY');
    check_db_columns('MCOL_DATA', 'FIRST_PAYMENT_DATE');
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** checking ddl_trac_5095****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    check_db_table('CPT_DEFENDANTS');
    check_db_table('CPT_CLAIMS');
    check_db_table('CPT_STATISTICS');
    check_db_table('CPT_PRINT_CLAIMS');
    check_db_table('CPT_LIBERATA_TOTAL_FEES');
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** checking ddl_trac_5118 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    check_db_table('DEFENCE_DOC_EVENT');
    check_db_columns('LOAD_JUDGMENTS', 'VIA_SDT');
    check_db_columns('LOAD_WARRANTS', 'VIA_SDT');
    check_db_columns('LOAD_PAID_WO_DETAILS', 'VIA_SDT');
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** checking ddl_trac_5253 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));

    check_db_table('CDR_MCOL_EVENT_MAPPING');
    check_db_table('CDR_MCOL_STATUS_MAPPING');

    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** checking ddl_trac_5278 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));

    check_db_column_size('CPT_PRINT_CLAIMS', 'COURT_NAME',  30 );
    check_db_column_size('CPT_PRINT_CLAIMS', 'COURT_NAME_SEAL_1',  15 );
    check_db_column_size('CPT_PRINT_CLAIMS', 'COURT_NAME_SEAL_2',  15 );
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating SDT database packages ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    check_db_package('cpt_claims_pack');            -- code is in cpt_process claims
    check_db_package('ccbc_mcol_interface_pkg');
    check_db_package('validate_defences_pkg');
    check_db_package('ccbc_events');                 -- code is in events_package.sql
    check_db_package('ccbc_batch_validation');      -- code is in package_ccbc.sql
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating SDT database triggers ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    check_db_trigger('mcol_bar_judgment');
    check_db_trigger('mcol_case_reassigned');
    check_db_trigger('mcol_case_status_reset');
    check_db_trigger('after_insert_warrant_returns');
       check_db_trigger('mcol_new_creditor');
    check_db_trigger('set_statuses');               -- code is in event_trigger.sql
    check_db_trigger('audit_events');               -- code is in event_trigger.sql
    check_db_trigger('audit_insert_judgments');     -- code is in judgments_triggers
    check_db_trigger('audit_judgments');            -- code is in judgments_triggers
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating SDT database data ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating data changed by DML_TRAC_4997 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    -- only check a couple of data changes for each DML script. If they are correct, assume  script worked
    
    check_changed_event( 74, 'CASE DISCONTINUED' );                 -- current event description
    check_changed_event( 74, 'CASE DISCONTINUED/WRITTEN OFF' );     -- old event description
    check_changed_event( 76, 'CASE SETTLED WITHDRAWN (POST-JGMT)'); -- old event description
    check_changed_event( 76, 'CASE SETTLED (POST-JGMT)'); -- current event description
    check_std_event_desc( 74, 'CASE DISCONTINUED');
    check_std_event_desc( 76, 'CASE SETTLED (POST-JGMT)');
    check_ref_code( '74','SETTLED/WDRN' );
    check_ref_code( '76', 'SETTLED' );
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating data changed by DML_TRAC_5118 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    check_reject_reason( 93, 'Active judgment found for defendant');
    check_reject_reason( 94, 'Case status is ''STAYED''');
    check_reject_reason( 95, 'Defendant Id must be blank when Type is ''D''');
    check_reject_reason( 96, 'Invalid Defence Event Type');
    check_report_seq( 'CPT_ISSUE' );

    DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating data changed by DML_TRAC_5102 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    check_task( 'BC073', 'Acknowledgment of service filed via SDT');
    check_task( 'BC074', 'Entry of defence and counterclaim via SDT - MCOL only');
    check_task( 'BC075', 'Receipt of defence via SDT');
    check_task( 'BC076', 'Entry of defence and counterclaim via SDT');
    check_task( 'BC077', 'Receipt of (Part) Admission via SDT');
    check_task( 'BC078', 'Notice of change of address/withdrawal via SDT - MCOL only');
    check_task( 'BC079', 'Notice of change of address/withdrawal via SDT');
    check_task( 'BC080', 'Paid in full notification via SDT');

      DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** validating data changed by DML_TRAC_5253 ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));

    check_cdr_event( 38, 'AS' ); 
    check_cdr_event( 50, 'DE' );
    check_cdr_event( 52, 'DC' );
    check_cdr_event( 57, 'DK' );
    check_cdr_event( 60, 'PA' );
    check_cdr_event( 72, 'K1' );
    check_cdr_event( 73, 'WD' );
    check_cdr_event( 74, 'DI' );
    check_cdr_event( 75, 'WD' );
    check_cdr_event( 76, 'WD' );
    check_cdr_event( 78, 'MP' );
    check_cdr_event( 79, 'MP' );
    check_cdr_event( 140, 'V1' );
    check_cdr_event( 160, 'X1' );
    check_cdr_event( 620, 'FR' );

    DBMS_OUTPUT.PUT_LINE(chr(10));

    check_cdr_status( 'BLANK', '00' ); 
    check_cdr_status( 'WITHDRAWN', 'WD' );
    check_cdr_status( 'SETTLED', 'WD' );
    check_cdr_status( 'WRITTEN OFF', 'D1');
    check_cdr_status( 'DISCONTINUED', 'D1');
    check_cdr_status( 'STRUCK OUT', 'K1' );
    check_cdr_status( 'SETTLED/WDRN', 'WD' );
    check_cdr_status( 'PAID', 'MP' );
    check_cdr_status( 'STAYED', '01' );


      DBMS_OUTPUT.PUT_LINE(chr(10));
    DBMS_OUTPUT.PUT_LINE('**************** Checking for invalid database objects ****************');
    DBMS_OUTPUT.PUT_LINE(chr(10));

    check_invalid;
    
    DBMS_OUTPUT.PUT_LINE(chr(10));
    IF deployed_ok THEN
        DBMS_OUTPUT.PUT_LINE('**************** ALL CHECKS PASSED ****************');
    ELSE
        DBMS_OUTPUT.PUT_LINE('**************** ONE OR MORE DEPLOYMENT FAILURES ****************');
    END IF;   
    DBMS_OUTPUT.PUT_LINE(chr(10));
    
    
    
END; -- end of main programme
/
SPOOL OFF

