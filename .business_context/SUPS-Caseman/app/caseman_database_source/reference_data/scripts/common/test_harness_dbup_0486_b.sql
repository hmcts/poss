WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE ROLLBACK

SET LINESIZE 10000
SET NUMWIDTH 12
SET PAGESIZE 10000
SET SERVEROUTPUT ON SIZE 1000000
SET TRIMSPOOL ON
SET VERIFY OFF

SPOOL test_harness_dbup_0486_b.out

/*-------------------------------------------------------------------------------
|
| TITLE    : $filename$
|
| FILENAME : $Source$
|
| SYNOPSIS : Contains arguments to create the interface schema
|
| AUTHOR   : $username$
|
| VERSION  : $Revision$
|
| PROJECT   : SUPS Development
|
| COPYRIGHT : (c) 2008 Logica UK Ltd.
|             This file contains information which is confidential and of
|             value to Logica. It may be used only for the specific purpose for
|             which it has been provided. Logica's prior written consent is
|             required before any part is reproduced.
|
| COMMENTS  : The Oracle user being used to conduct the Unit test must have execution privileges to
|               - DBMS_SCHEDULER
|               - DBMS_ISCHED
|               - DROP ANY DIRECTORY
|
|             And have privileges to create
|               - JOBs
|               - EXTERNAL JOBs
|
|---------------------------------------------------------------------------------
|
| $Log$
--------------------------------------------------------------------------------*/

DEFINE v_num_of_tests       = 11

DEFINE v_test_offset        = 10
DEFINE v_ca_id_base         = 1000
DEFINE v_court_code_base    = -1000

ALTER SESSION SET NLS_TIMESTAMP_FORMAT  = 'YYYY-MM-DD HH24:MI:SS.FF3';
ALTER SESSION SET NLS_DATE_FORMAT       = 'YYYY-MM-DD HH24:MI:SS';

SET HEADING OFF
SELECT '** Module testing for procedure: dbup_0486_b, at: ' || SYSDATE || ' **'
FROM   sys.dual;
SELECT ''
FROM   sys.dual;
SELECT '** Tester must execution privileges to DBMS_SCHEDULER package      **'
FROM   sys.dual;
SELECT '** See comments in Test harness banner for required privileges     **'
FROM   sys.dual;
SET HEADING ON

SET TERMOUT OFF

-- Derive SCN to identify schema objects affected by test harness execution
COLUMN test_scn NEW_VALUE test_scn NOPRINT
SELECT TIMESTAMP_TO_SCN(LOCALTIMESTAMP) test_scn FROM SYS.DUAL;

-- Get path associated with the REPORTS directory object
COLUMN reports_path NEW_VALUE reports_path NOPRINT
SELECT d.directory_path reports_path
FROM   all_directories d
WHERE  d.directory_name = 'REPORTS';

SET TERMOUT ON

-- remove any left over test data
DELETE FROM sups_amendments                 WHERE ora_rowscn >= &test_scn
                                               OR court_id = 'b';

DELETE FROM cases                           WHERE ora_rowscn >= &test_scn
                                               OR admin_crt_code < 0;

DELETE FROM system_data                     WHERE ora_rowscn >= &test_scn;

DELETE FROM courts                          WHERE ora_rowscn >= &test_scn
                                               OR code < 0;


COMMIT;

-- create the test data
DECLARE
    --------------------------------------------------------------------------
    -- constants
    --------------------------------------------------------------------------
    c_number_of_tests           CONSTANT NUMBER         := &&v_num_of_tests;

    c_test_offset               CONSTANT NUMBER         := &&v_test_offset;

    c_ca_id_base                CONSTANT NUMBER         := &&v_ca_id_base;
    c_court_code_base           CONSTANT NUMBER         := &&v_court_code_base;

    --------------------------------------------------------------------------


    --------------------------------------------------------------------------
    -- record structure for test data
    --------------------------------------------------------------------------
    TYPE t_id_list              IS TABLE OF NUMBER(12)                  INDEX BY BINARY_INTEGER;
    TYPE t_bool_list            IS TABLE OF BOOLEAN                     INDEX BY BINARY_INTEGER;
    TYPE t_ca                   IS TABLE OF cases%ROWTYPE               INDEX BY BINARY_INTEGER;
    TYPE t_ct                   IS TABLE OF courts%ROWTYPE              INDEX BY BINARY_INTEGER;
    TYPE t_sd                   IS TABLE OF system_data%ROWTYPE         INDEX BY BINARY_INTEGER;

    TYPE t_test IS RECORD (
        lst_ca                     t_ca         -- table of cases records
       ,lst_ct                     t_ct         -- table of courts records
       ,lst_sd                     t_sd         -- table of system_data records
    );

    TYPE t_test_list            IS TABLE OF t_test INDEX BY BINARY_INTEGER;

    tests                       t_test_list;

    -- temporary records to aid building test data.
    rec_ca                      cases%ROWTYPE;
    rec_ct                      courts%ROWTYPE;
    rec_sd                      system_data%ROWTYPE;

    --------------------------------------------------------------------------


    --------------------------------------------------------------------------
    -- local procedures to insert data into tables
    --------------------------------------------------------------------------
    PROCEDURE insert_into_cases
        ( p_rec                         IN cases%ROWTYPE )
    IS
        rec_tmp                         cases%ROWTYPE;
    BEGIN
        rec_tmp := p_rec;

        INSERT INTO cases
        VALUES rec_tmp;

    END insert_into_cases;

    PROCEDURE insert_into_courts
        ( p_rec                         IN courts%ROWTYPE )
    IS
        rec_tmp                         courts%ROWTYPE;
    BEGIN
        rec_tmp := p_rec;

        -- set any mandatory values not specified
        rec_tmp.code                          := NVL(rec_tmp.code,c_court_code_base);
        rec_tmp.name                          := NVL(rec_tmp.name,'TEST COURT');
        rec_tmp.caseman_inservice             := NVL(rec_tmp.caseman_inservice,'Y');
        rec_tmp.sups_centralised_flag         := NVL(rec_tmp.sups_centralised_flag,'Y');

        INSERT INTO courts
        VALUES rec_tmp;

    END insert_into_courts;

    PROCEDURE insert_into_system_data
        ( p_rec                         IN system_data%ROWTYPE )
    IS
        rec_tmp                         system_data%ROWTYPE;
    BEGIN
        rec_tmp := p_rec;

        -- set any mandatory values not specified
        rec_tmp.item                        := NVL(rec_tmp.item,'TEST COURT');
        rec_tmp.admin_court_code            := NVL(rec_tmp.admin_court_code, c_court_code_base);

        INSERT INTO system_data
        VALUES rec_tmp;

    END insert_into_system_data;

    --------------------------------------------------------------------------
    -- local procedure to create data
    --------------------------------------------------------------------------
    PROCEDURE create_test_data
        ( p_test_num                    IN  NUMBER
         ,p_test_rec                    IN  t_test
        )
    IS
        v_test                      t_test;
        i  BINARY_INTEGER;
    BEGIN
        v_test := p_test_rec;

        -- create system_data entry or entries
        i := v_test.lst_sd.FIRST;
        WHILE i IS NOT NULL LOOP
            insert_into_system_data(v_test.lst_sd(i));
            i := v_test.lst_sd.NEXT(i);
        END LOOP;

        -- create courts entry or entries
        i := v_test.lst_ct.FIRST;
        WHILE i IS NOT NULL LOOP
            insert_into_courts(v_test.lst_ct(i));
            i := v_test.lst_ct.NEXT(i);
        END LOOP;

        -- create cases entry or entries
        i := v_test.lst_ca.FIRST;
        WHILE i IS NOT NULL LOOP
            insert_into_cases(v_test.lst_ca(i));
            i := v_test.lst_ca.NEXT(i);
        END LOOP;
    END create_test_data;
    --------------------------------------------------------------------------

BEGIN

    --------------------------------------------------------------------------
    -- populate a records default values
    -- NOTE : identifier fields will have to be assigned appropriate values
    --        if they are used in the, 'define data for tests' section.
    --        Execute set sups app. context to avoid constraint violations when
    --        doing DML operations in SUPS schemas.
    --------------------------------------------------------------------------
    set_sups_app_ctx('a','b','c');

    --------------------------------------------------------------------------
    -- define data for tests
    --------------------------------------------------------------------------

    -- Test 01
    -- =======
    -- case Court code to process does not exist in caseman


    -- Test 02
    -- =======
    -- case Court code to process is closed
    tests(02).lst_ct(1).code                          := c_court_code_base + (2 + c_test_offset);
    tests(02).lst_ct(1).name                          := 'COURT TEST 2';
    tests(02).lst_ct(1).caseman_inservice             := 'N';


    -- Test 03
    -- =======
    -- case Court code to process is a Legacy court
    tests(03).lst_ct(1).code                          := c_court_code_base + (3 + c_test_offset);
    tests(03).lst_ct(1).name                          := 'COURT TEST 3';
    tests(03).lst_ct(1).sups_centralised_flag         := 'N';


    -- Test 04
    -- =======
    -- case Court code with insolvency cases with some invalid case numbers - case numbers don't have 7 in 4th digit
    tests(04).lst_ct(1).code                          := c_court_code_base + (4 + c_test_offset);
    tests(04).lst_ct(1).name                          := 'COURT TEST 4';

    FOR i IN 1..3 LOOP
        tests(04).lst_ca(i).case_number                   := '8' || RPAD('X',2,'X') || '7' || LPAD(TO_CHAR(i),4,'0');
        tests(04).lst_ca(i).case_type                     := 'APP INT ORD (INSOLV)';
        tests(04).lst_ca(i).admin_crt_code                := tests(04).lst_ct(1).code;
        tests(04).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 4 - ' || TO_CHAR(i);
        tests(04).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    tests(04).lst_ca(1).case_number                   := RPAD('X',3,'X') || 'X' || '2008';
    tests(04).lst_ca(3).case_number                   := RPAD('X',3,'X') || 'Y' || '2008';

    -- Test 05
    -- =======
    -- case Court code with insolvency cases with some invalid case numbers - sequence in case numbers not numeric
    tests(05).lst_ct(1).code                          := c_court_code_base + (5 + c_test_offset);
    tests(05).lst_ct(1).name                          := 'COURT TEST 5';

    FOR i IN 1..3 LOOP
        tests(05).lst_ca(i).case_number                   := '8' || RPAD('Y',2,'Y') || '7' || LPAD(TO_CHAR(i),4,'0');
        tests(05).lst_ca(i).case_type                     := 'APP INT ORD (INSOLV)';
        tests(05).lst_ca(i).admin_crt_code                := tests(05).lst_ct(1).code;
        tests(05).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 5 - ' || TO_CHAR(i);
        tests(05).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    tests(05).lst_ca(1).case_number                   := SUBSTR(tests(05).lst_ca(1).case_number,1,7) || 'T';
    tests(05).lst_ca(3).case_number                   := SUBSTR(tests(05).lst_ca(3).case_number,1,5) || 'Y' || '03';


    -- Test 06
    -- =======
    -- case Court code with insolvency cases with some invalid case numbers - year is not numeric
    tests(06).lst_ct(1).code                          := c_court_code_base + (6 + c_test_offset);
    tests(06).lst_ct(1).name                          := 'COURT TEST 6';

    FOR i IN 1..3 LOOP
        tests(06).lst_ca(i).case_number                   := TO_CHAR(i) || RPAD('Y',2,'Y') || '7' || LPAD(TO_CHAR(i),4,'0');
        tests(06).lst_ca(i).case_type                     := 'APP TO SET STAT DEMD';
        tests(06).lst_ca(i).admin_crt_code                := tests(06).lst_ct(1).code;
        tests(06).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 6 - ' || TO_CHAR(i);
        tests(06).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    tests(06).lst_ca(1).case_number                   := 'P' || SUBSTR(tests(06).lst_ca(1).case_number,2,8);


    -- Test 07
    -- =======
    -- case Court code with insolvency cases one record locked
    tests(07).lst_ct(1).code                          := c_court_code_base + (7 + c_test_offset);
    tests(07).lst_ct(1).name                          := 'COURT TEST 7';

    FOR i IN 1..4 LOOP
        tests(07).lst_ca(i).case_number                   := TO_CHAR(i) || RPAD('Z',2,'Y') || '7' || LPAD(TO_CHAR(i),4,'0');
        tests(07).lst_ca(i).case_type                     := 'APP TO SET STAT DEMD';
        tests(07).lst_ca(i).admin_crt_code                := tests(07).lst_ct(1).code;
        tests(07).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 7 - ' || TO_CHAR(i);
        tests(07).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    tests(07).lst_ca(2).case_type                     := 'CREDITORS PETITION';
    tests(07).lst_ca(3).case_type                     := 'DEBTORS PETITION';
    tests(07).lst_ca(4).case_type                     := 'WINDING UP PETITION';


    -- Test 08
    -- =======
    -- case Court code with insolvency cases - a severe oracle error raised
    tests(08).lst_ct(1).code                          := c_court_code_base + (8 + c_test_offset);
    tests(08).lst_ct(1).name                          := 'COURT TEST 8';

    FOR i IN 1..4 LOOP
        tests(08).lst_ca(i).case_number                   := TO_CHAR(i) || RPAD('A',2,'A') || '7' || LPAD(TO_CHAR(i),4,'0');
        tests(08).lst_ca(i).case_type                     := 'APP TO SET STAT DEMD';
        tests(08).lst_ca(i).admin_crt_code                := tests(08).lst_ct(1).code;
        tests(08).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 8 - ' || TO_CHAR(i);
        tests(08).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    tests(08).lst_ca(2).case_type                     := 'CREDITORS PETITION';
    tests(08).lst_ca(3).case_type                     := 'DEBTORS PETITION';
    tests(08).lst_ca(4).case_type                     := 'WINDING UP PETITION';

    -- Test 09
    -- =======
    -- case Court code with some insolvency cases - only insolvency cases processed
    tests(09).lst_ct(1).code                          := c_court_code_base + (9 + c_test_offset);
    tests(09).lst_ct(1).name                          := 'COURT TEST 9';

    FOR i IN 1..10 LOOP
        IF i > 9 THEN
            tests(09).lst_ca(i).case_number                   := TO_CHAR(i) || 'B7' || LPAD(TO_CHAR(i),4,'0');
        ELSE
            tests(09).lst_ca(i).case_number                   := TO_CHAR(i) || RPAD('B',2,'B') || '7' || LPAD(TO_CHAR(i),4,'0');
        END IF;
        tests(09).lst_ca(i).case_type                     := 'APP TO SET STAT DEMD';
        tests(09).lst_ca(i).admin_crt_code                := tests(09).lst_ct(1).code;
        tests(09).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 9 - ' || TO_CHAR(i);
        tests(09).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    tests(09).lst_ca(2).case_type                     := 'CREDITORS PETITION';
    tests(09).lst_ca(3).case_type                     := 'DEBTORS PETITION';
    tests(09).lst_ca(4).case_type                     := 'NOT INSOLV CASE';
    tests(09).lst_ca(5).case_type                     := 'CREDITORS PETITION';
    tests(09).lst_ca(6).case_type                     := 'DEBTORS PETITION';
    tests(09).lst_ca(7).case_type                     := 'APP INT ORD (INSOLV)';
    tests(09).lst_ca(8).case_type                     := 'NOT INSOLV CASE';
    tests(09).lst_ca(9).case_type                     := 'DEBTORS PETITION';


    -- Test 10
    -- =======
    -- case Court code with insolvency cases - volume testing
    tests(10).lst_ct(1).code                          := c_court_code_base + (10 + c_test_offset);
    tests(10).lst_ct(1).name                          := 'COURT TEST 10';

    FOR i IN 1..100 LOOP
        IF i > 9 AND i < 100 THEN
            tests(10).lst_ca(i).case_number                   := TO_CHAR(i) || 'C7' || LPAD(TO_CHAR(i),4,'0');
        ELSIF i > 99 THEN
            tests(10).lst_ca(i).case_number                   := TO_CHAR(i) || 'C7' || LPAD(TO_CHAR(i),1,'0');
        ELSE
            tests(10).lst_ca(i).case_number                   := TO_CHAR(i) || RPAD('C',2,'B') || '7' || LPAD(TO_CHAR(i),4,'0');
        END IF;

        tests(10).lst_ca(i).case_type                         := 'APP TO SET STAT DEMD';

        IF MOD(i,3) = 0 THEN
            tests(10).lst_ca(i).case_type                     := 'APP TO SET STAT DEMD';
        ELSIF MOD(i,4) = 0 THEN
            tests(10).lst_ca(i).case_type                     := 'CREDITORS PETITION';
        ELSIF MOD(i,5) = 0 THEN
            tests(10).lst_ca(i).case_type                     := 'DEBTORS PETITION';
        ELSIF MOD(i,7) = 0 THEN
            tests(10).lst_ca(i).case_type                     := 'APP INT ORD (INSOLV)';
        ELSIF MOD(i,9) = 0 THEN
            tests(10).lst_ca(i).case_type                     := 'WINDING UP PETITION';
        END IF;

        tests(10).lst_ca(i).admin_crt_code                := tests(10).lst_ct(1).code;
        tests(10).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 10 - ' || TO_CHAR(i);
        tests(10).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    tests(10).lst_ca(4).case_type                       := 'NOT INSOLV CASE';
    tests(10).lst_ca(18).case_type                      := 'NOT INSOLV CASE';
    tests(10).lst_ca(51).case_type                      := 'NOT INSOLV CASE';

    tests(10).lst_ca(12).insolvency_number              := 'NOTNULL';
    tests(10).lst_ca(24).insolvency_number              := 'NOTNULL';


    -- Test 11
    -- =======
    -- case Report Directory object missing
    tests(11).lst_ct(1).code                          := c_court_code_base + (11 + c_test_offset);
    tests(11).lst_ct(1).name                          := 'COURT TEST 11';

    FOR i IN 1..3 LOOP
        tests(11).lst_ca(i).case_number                   := TO_CHAR(i) || 'D7' || LPAD(TO_CHAR(i),4,'0');
        tests(11).lst_ca(i).case_type                     := 'APP INT ORD (INSOLV)';
        tests(11).lst_ca(i).admin_crt_code                := tests(11).lst_ct(1).code;
        tests(11).lst_ca(i).brief_details_of_claim        := 'CASE FOR TEST 11 - ' || TO_CHAR(i);
        tests(11).lst_ca(i).insolvency_number             := NULL;
    END LOOP;

    --------------------------------------------------------------------------

    --------------------------------------------------------------------------
    -- create data for each test
    --------------------------------------------------------------------------
    FOR test IN 1..c_number_of_tests LOOP

        IF tests.EXISTS(test) THEN

            create_test_data
                ( p_test_num                => test
                 ,p_test_rec                => tests(test)
                );

        END IF;

    END LOOP;
    --------------------------------------------------------------------------

EXCEPTION

    WHEN OTHERS THEN -- remove test data
        ROLLBACK;
        RAISE;
END;
/
COMMIT;

-- Set column listing format
COLUMN id                             FORMAT A2
COLUMN name                           FORMAT A30
COLUMN tel_no                         FORMAT A6
COLUMN fax_no                         FORMAT A6
COLUMN blf_tel_no                     FORMAT A10
COLUMN caseman_inservice              FORMAT A17
COLUMN database_name                  FORMAT A13
COLUMN tasks_updated                  FORMAT A13
COLUMN district_registry              FORMAT A17
COLUMN wft_grouping_court             FORMAT 9999999999999999999999
COLUMN wft_dm_email_address           FORMAT A20
COLUMN sat_court                      FORMAT A9
COLUMN open_flag                      FORMAT A9
COLUMN last_wrt_seqno                 FORMAT 9999999999999999999999
COLUMN sups_centralised_flag          FORMAT A21
COLUMN dx_number                      FORMAT A9
COLUMN default_printer                FORMAT A15
COLUMN deed_pack_number               FORMAT A16
COLUMN welsh_high_court_name          FORMAT A21
COLUMN welsh_county_court_name        FORMAT A23
COLUMN fap_id                         FORMAT A6
COLUMN tucs_in_use                    FORMAT A11

-- Set column listing format
COLUMN case_number                    FORMAT A11
COLUMN case_type                      FORMAT A9
COLUMN date_of_issue                  FORMAT A10
COLUMN brief_details_of_claim         FORMAT A22
COLUMN particulars_of_claim           FORMAT A20
COLUMN date_of_transfer               FORMAT A10
COLUMN status                         FORMAT A6
COLUMN transfer_reason                FORMAT A15
COLUMN date_transferred_in            FORMAT A10
COLUMN transfer_status                FORMAT A15
COLUMN receipt_date                   FORMAT A10
COLUMN xfer_receipt_date              FORMAT A10
COLUMN amount_claimed_currency        FORMAT A23
COLUMN court_fee_currency             FORMAT A18
COLUMN solicitors_costs_currency      FORMAT A25
COLUMN total_currency                 FORMAT A14
COLUMN cjr                            FORMAT A3
COLUMN manual                         FORMAT A6
COLUMN trans_case_type                FORMAT A15
COLUMN insolvency_number              FORMAT A17

-- Set column listing format
COLUMN item                           FORMAT A4
COLUMN item_value_currency            FORMAT A19

PROMPT Test Data BEFORE - courts
SELECT   code
        ,id
        ,name
        ,tel_no
        ,fax_no
        ,blf_tel_no
        ,caseman_inservice
        ,database_name
        ,tasks_updated
        ,district_registry
        ,wft_grouping_court
        ,wft_dm_email_address
        ,sat_court
        ,open_flag
        ,last_wrt_seqno
        ,sups_centralised_flag
        ,dx_number
        ,default_printer
        ,deed_pack_number
        ,welsh_high_court_name
        ,welsh_county_court_name
        ,fap_id
        ,tucs_in_use
FROM     courts
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data BEFORE - cases
SELECT   case_number
        ,case_type
        ,admin_crt_code
        ,insolvency_number
        ,amount_claimed
        ,court_fee
        ,solicitors_costs
        ,total
        ,date_of_issue
        ,brief_details_of_claim
        ,particulars_of_claim
        ,trans_crt_code
        ,date_of_transfer
        ,status
        ,transfer_reason
        ,date_transferred_in
        ,previous_court
        ,transfer_status
        ,receipt_date
        ,xfer_receipt_date
        ,amount_claimed_currency
        ,court_fee_currency
        ,solicitors_costs_currency
        ,total_currency
        ,cjr
        ,manual
        ,trans_case_type
        ,cred_code
FROM     cases
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data BEFORE - system_data
SELECT   item
        ,item_value
        ,item_value_currency
        ,admin_court_code
FROM     system_data
WHERE    ora_rowscn >= &test_scn;


-- run the tests
DECLARE

    c_number_of_tests               CONSTANT NUMBER         := &&v_num_of_tests;

    c_test_offset                   CONSTANT NUMBER         := &&v_test_offset;

    c_ca_id_base                    CONSTANT NUMBER         := &&v_ca_id_base;
    c_court_code_base               CONSTANT NUMBER         := &&v_court_code_base;

    b_lock_record                   BOOLEAN;
    b_directory_dropped             BOOLEAN;
    v_create_trigger                VARCHAR2(30);
    v_sql                           VARCHAR2(500);

    n_court_code                    NUMBER(3);
    v_case_number                   VARCHAR2(8);
    v_test_description              VARCHAR2(500);

    -- local procedure to call the script
    PROCEDURE call_script
         (p_test_number             IN  NUMBER
         ,p_test_description        IN  VARCHAR2
         ,p_court_code              IN  NUMBER
         )
    IS
        PRAGMA  AUTONOMOUS_TRANSACTION;

        v_job_name                  VARCHAR2(30)    := 'test_harness_dbup_0486_b';
        vFilename                   VARCHAR2(100)   := 'Test_'||p_test_number||'.sql';

        rWriteFileHndl              UTL_FILE.FILE_TYPE;

    BEGIN

        -- submit a job to run the dbup_0486_b script
        DBMS_SCHEDULER.CREATE_JOB
            (job_name => v_job_name
            ,job_type => 'EXECUTABLE'
            ,job_action => './&&reports_path/' || v_job_name || '.sh'
            ,number_of_arguments => 5 -- not documented by Oracle
            ,enabled => FALSE
            ,auto_drop => TRUE
            ,comments => 'To test the insolvency number data migration script'
            );

        -----
        -- set arguments to submit to the underlying script executed by the scheduler
        ----
        DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE
            (job_name                   => v_job_name
            ,argument_position          => 1
            ,argument_value             => '&&reports_path'
            );

        DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE
            (job_name                   => v_job_name
            ,argument_position          => 2
            ,argument_value             => USER
            );

        DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE
            (job_name                   => v_job_name
            ,argument_position          => 3
            ,argument_value             => p_test_number
            );

        DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE
            (job_name                   => v_job_name
            ,argument_position          => 4
            ,argument_value             => REPLACE(p_test_description,' ','~')
            );

        DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE
            (job_name                   => v_job_name
            ,argument_position          => 5
            ,argument_value             => p_court_code
            );

        -- execute scheduled job
        DBMS_SCHEDULER.RUN_JOB (job_name                => v_job_name);

        -- remove scheduled job from job queue
        DBMS_SCHEDULER.drop_job(job_name                => v_job_name);

        COMMIT;

    EXCEPTION
        WHEN OTHERS THEN -- suppress error in Test Harness
            DBMS_SCHEDULER.drop_job(job_name                => v_job_name);
            NULL;
            COMMIT;
    END call_script;

BEGIN
    -- loop through the tests - set the inputs each time
    FOR test IN 1..c_number_of_tests LOOP

        -- set the default input values
        n_court_code                        := c_court_code_base + (test + c_test_offset);
        v_test_description                  := 'TEST '||TO_CHAR(test);

        b_lock_record                       := FALSE;
        v_create_trigger                    := NULL;
        b_directory_dropped                 := FALSE;

        CASE test
            WHEN 1 THEN
                v_test_description          := '>>>> success - court code to process does not exist in caseman. No migration occurs.';
            WHEN 2 THEN
                v_test_description          := '>>>> success - court code submitted is closed. No migration occurs.';
            WHEN 3 THEN
                v_test_description          := '>>>> success - court code submitted for Legacy court. No migration occurs.';
            WHEN 4 THEN
                v_test_description          := '>>>> success - court with insolvency cases with some invalid case numbers - case numbers do not have 7 in 4th digit';
            WHEN 5 THEN
                v_test_description          := '>>>> success - court with insolvency cases with some invalid case numbers - sequence in case numbers not numeric';
            WHEN 6 THEN
                v_test_description          := '>>>> success - court with insolvency cases with some invalid case numbers - year is not numeric';
            WHEN 7 THEN
                v_test_description          := '>>>> success - court with insolvency cases one case record locked - locked record skipped.';
                b_lock_record               := TRUE;
                v_case_number               := '2ZY70002';
            WHEN 8 THEN
                v_test_description          := '>>>> success - court with insolvency cases - court cases not migrated due to oracle error.';
                v_create_trigger            := 'CASES';
            WHEN 9 THEN
                v_test_description          := '>>>> success - court with insolvency cases - some cases not of insolvency type so not migrated';
            WHEN 10 THEN
                v_test_description          := '>>>> success - court with insolvency cases - volume testing';
            WHEN 11 THEN
                -- done for completeness as loops is performed the number times specified by substitution v_num_of_tests
                NULL;
    END CASE;

        IF (v_create_trigger IS NOT NULL) THEN
            -- create erroneous trigger
            v_sql := 'CREATE OR REPLACE TRIGGER trg_force_error
                          BEFORE INSERT OR UPDATE ON ' || v_create_trigger || '
                      BEGIN
                          RAISE PROGRAM_ERROR;
                      END;';
            EXECUTE IMMEDIATE v_sql;
        END IF;

        IF (b_lock_record) THEN
            -- lock record
            SELECT  1
            INTO    v_sql
            FROM    cases
            WHERE   case_number = v_case_number
            FOR UPDATE NOWAIT;
        END IF;

        IF test <> 11 THEN
            call_script
                ( p_test_number                 => test
                 ,p_test_description            => TRIM(v_test_description)
                 ,p_court_code                  => n_court_code
                );
        END IF;

        ROLLBACK;

        IF (v_create_trigger IS NOT NULL) THEN
            -- drop trigger
            v_sql := 'DROP TRIGGER trg_force_error';
            EXECUTE IMMEDIATE v_sql;
        END IF;

    END LOOP;

END;
/

SPOOL OFF

! cat &&reports_path/Test_?.out >> &&reports_path/test_harness_dbup_0486_b.out
! cat &&reports_path/Test_10.out >> &&reports_path/test_harness_dbup_0486_b.out

SPOOL test_harness_dbup_0486_b.out APPEND

BEGIN DBMS_OUTPUT.PUT_LINE(CHR(10)); END;
/

PROMPT Test Data AFTER - courts
SELECT   code
        ,id
        ,name
        ,tel_no
        ,fax_no
        ,blf_tel_no
        ,caseman_inservice
        ,database_name
        ,tasks_updated
        ,district_registry
        ,wft_grouping_court
        ,wft_dm_email_address
        ,sat_court
        ,open_flag
        ,last_wrt_seqno
        ,sups_centralised_flag
        ,dx_number
        ,default_printer
        ,deed_pack_number
        ,welsh_high_court_name
        ,welsh_county_court_name
        ,fap_id
        ,tucs_in_use
FROM     courts
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data AFTER - cases
SELECT   case_number
        ,case_type
        ,admin_crt_code
        ,insolvency_number
        ,amount_claimed
        ,court_fee
        ,solicitors_costs
        ,total
        ,date_of_issue
        ,brief_details_of_claim
        ,particulars_of_claim
        ,trans_crt_code
        ,date_of_transfer
        ,status
        ,transfer_reason
        ,date_transferred_in
        ,previous_court
        ,transfer_status
        ,receipt_date
        ,xfer_receipt_date
        ,amount_claimed_currency
        ,court_fee_currency
        ,solicitors_costs_currency
        ,total_currency
        ,cjr
        ,manual
        ,trans_case_type
        ,cred_code
FROM     cases
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data AFTER - system_data
SELECT   item
        ,item_value
        ,item_value_currency
        ,admin_court_code
FROM     system_data
WHERE    ora_rowscn >= &test_scn;

COMMIT;

-- remove any left over test data
DELETE FROM sups_amendments                 WHERE ora_rowscn >= &test_scn;

DELETE FROM cases                           WHERE ora_rowscn >= &test_scn;

DELETE FROM system_data                     WHERE ora_rowscn >= &test_scn;

DELETE FROM courts                          WHERE ora_rowscn >= &test_scn;

SET FEEDB OFF
BEGIN
    DBMS_OUTPUT.PUT_LINE(CHR(10));
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('>>>> Test 11 is executed outside the test harness');
    DBMS_OUTPUT.PUT_LINE('>>>> success - report directory object missing - error raised');
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE(CHR(10));
END;
/
SPOOL OFF

DROP DIRECTORY reports;
!./test_harness_dbup_0486_b.sh /home/oracle/DBbuild/CaseMan/buildscripts &_USER 11 '~' -989
CREATE OR REPLACE DIRECTORY reports AS '&&reports_path';

! cat &&reports_path/dbup_0486_b_output_for_court_code_-989*.err >> &&reports_path/test_harness_dbup_0486_b.out

EXIT
