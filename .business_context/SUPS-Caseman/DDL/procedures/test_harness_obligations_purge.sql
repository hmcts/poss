WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE ROLLBACK

SET LINESIZE 10000
SET NUMWIDTH 12
SET PAGESIZE 10000
SET SERVEROUTPUT ON SIZE 1000000
SET TRIMSPOOL ON
SET VERIFY OFF

SPOOL test_harness_obligations_purge.out

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
| COPYRIGHT : (c) 2010 Logica UK Ltd.
|             This file contains information which is confidential and of
|             value to Logica. It may be used only for the specific purpose for
|             which it has been provided. Logica's prior written consent is
|             required before any part is reproduced.
|
| COMMENTS  : Runs the stored procedure twice to demonstrate how the purge job handles Oracle errors.
|
|---------------------------------------------------------------------------------
|
| $Log$
--------------------------------------------------------------------------------*/

DEFINE v_num_of_tests       = 5

DEFINE v_test_offset        = 10
DEFINE v_ca_id_base         = 1000
DEFINE v_court_code_base    = -1000
DEFINE v_ob_seq_base       = 1000


ALTER SESSION SET NLS_TIMESTAMP_FORMAT  = 'YYYY-MM-DD HH24:MI:SS.FF3';
ALTER SESSION SET NLS_DATE_FORMAT       = 'YYYY-MM-DD HH24:MI:SS';

SET HEADING OFF
SELECT '** Module testing for procedure: obligations_purge, at: ' || SYSDATE || ' **'
FROM   sys.dual;
SELECT ''
FROM   sys.dual;
SET HEADING ON

SET TERMOUT OFF

-- Derive SCN to identify schema objects affected by test harness execution
COLUMN test_scn NEW_VALUE test_scn NOPRINT
SELECT TIMESTAMP_TO_SCN(LOCALTIMESTAMP) test_scn FROM SYS.DUAL;

SET TERMOUT ON

EXEC  set_sups_app_ctx ('a', 'b', 'c');

-- remove any left over test data
DELETE FROM obligations_purge_errors        WHERE obligation_seq < 0;

DELETE FROM sups_amendments                 WHERE ora_rowscn >= &test_scn;

DELETE FROM obligations						WHERE obligation_seq < 0;

DELETE FROM cases                           WHERE case_number < '0';

DELETE FROM courts                          WHERE code < 0;



COMMIT;

-- create the test data
DECLARE
    --------------------------------------------------------------------------
    -- constants
    --------------------------------------------------------------------------
    c_number_of_tests           CONSTANT NUMBER         := &&v_num_of_tests;

    c_test_offset               CONSTANT NUMBER         := &&v_test_offset;

    c_ca_id_base                CONSTANT NUMBER         := &&v_ca_id_base;
	c_ob_seq_base				CONSTANT NUMBER			:= &&v_ob_seq_base;
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
    TYPE t_ob                   IS TABLE OF obligations%ROWTYPE         INDEX BY BINARY_INTEGER;

    TYPE t_test IS RECORD (
        lst_ca                     t_ca         -- table of cases records
       ,lst_ct                     t_ct         -- table of courts records
       ,lst_sd                     t_sd         -- table of system_data records
	   ,lst_ob					   t_ob			-- table of obligation records
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

    PROCEDURE insert_into_obligations
        ( p_rec                         IN obligations%ROWTYPE )
    IS
        rec_tmp                         obligations%ROWTYPE;
    BEGIN
        rec_tmp := p_rec;

        -- set any mandatory values not specified
        rec_tmp.obligation_type             := NVL(rec_tmp.obligation_type,1);
        rec_tmp.expiry_date            	    := NVL(rec_tmp.expiry_date, SYSDATE - 365);
        rec_tmp.last_used_by				:= NVL(rec_tmp.last_used_by,'test');
        rec_tmp.delete_flag					:= NVL(rec_tmp.delete_flag,'N');

        INSERT INTO obligations
        VALUES rec_tmp;

    END insert_into_obligations;



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

        -- create obligation entry or entries
        i := v_test.lst_ob.FIRST;
        WHILE i IS NOT NULL LOOP
            insert_into_obligations(v_test.lst_ob(i));
            i := v_test.lst_ob.NEXT(i);
        END LOOP;

    END create_test_data;
    --------------------------------------------------------------------------

    --------------------------------------------------------------------------
    -- local function to create case numbers
    --------------------------------------------------------------------------
    FUNCTION gen_case_number
       (pn_test_number            IN       PLS_INTEGER
       ,pn_sequence               IN       PLS_INTEGER DEFAULT 0
       )
    RETURN cases.case_number%TYPE
    IS

        v_case_number                   cases.case_number%TYPE;

    BEGIN

        v_case_number :=
               RPAD ((0 - pn_test_number)
                    ,3
                    ,'0'
                    )
            || pn_test_number
            || LPAD (pn_sequence
                    ,4
                    ,'0'
                    )
            ;
        RETURN v_case_number;

    END gen_case_number;



BEGIN

    --------------------------------------------------------------------------
    -- populate a records default values
    -- NOTE : identifier fields will have to be assigned appropriate values
    --        if they are used in the, 'define data for tests' section.
    --        set sups app. context to avoid constraint violations when
    --        doing DML operations in SUPS schemas.
    --------------------------------------------------------------------------
    set_sups_app_ctx('a','b','c');

    --------------------------------------------------------------------------
    -- define data for tests
    --------------------------------------------------------------------------

    -- Test 01
    -- =======
    -- Create 3 Obligations with 1 that is over the threshold and all records are not  marked for deletion, expect none to be removed
    tests(01).lst_ct(1).code                          := c_court_code_base + (1 + c_test_offset);

	tests(01).lst_ca(1).case_number                   := gen_case_number(1);
	tests(01).lst_ca(1).case_type                     := 'APP INT ORD (INSOLV)';
	tests(01).lst_ca(1).admin_crt_code                := tests(01).lst_ct(1).code;

	FOR i IN 1 .. 4 LOOP
		tests(01).lst_ob(i).obligation_seq				:= TO_NUMBER(TO_CHAR(-1) || TO_CHAR( i * c_ob_seq_base));
		tests(01).lst_ob(i).obligation_type             := i;
		tests(01).lst_ob(i).expiry_date            	    := ((SYSDATE - i) - 365);
		tests(01).lst_ob(i).case_number					:= tests(01).lst_ca(1).case_number;
	END LOOP;


    -- Test 02
    -- =======
    -- Create 3 Obligations with 2 records over the threshold and 1 of these is deleted, expect 1 record to be removed
	tests(02).lst_ca(1).case_number                   := gen_case_number(2);
	tests(02).lst_ca(1).case_type                     := 'APP INT ORD (INSOLV)';
	tests(02).lst_ca(1).admin_crt_code                := tests(01).lst_ct(1).code;

	FOR i IN 1 .. 4 LOOP
		tests(02).lst_ob(i).obligation_seq				:= TO_NUMBER(TO_CHAR(-2) || TO_CHAR( i * c_ob_seq_base));
		tests(02).lst_ob(i).obligation_type             := i;
		tests(02).lst_ob(i).expiry_date            	    := ((SYSDATE - i) - 364);
		tests(02).lst_ob(i).case_number					:= tests(02).lst_ca(1).case_number;
	END LOOP;

    tests(02).lst_ob(3).delete_flag                     := 'Y';
    tests(02).lst_ob(4).delete_flag                     := 'Y';


    -- Test 03
    -- =======
    -- Create 3 Obligations with 2 records over the threshold and both marked for deletion - 1 record locked so expect obligation
    -- to appear in error log.
	tests(03).lst_ca(1).case_number                   := gen_case_number(3);
	tests(03).lst_ca(1).case_type                     := 'APP INT ORD (INSOLV)';
	tests(03).lst_ca(1).admin_crt_code                := tests(01).lst_ct(1).code;

	FOR i IN 1 .. 4 LOOP
		tests(03).lst_ob(i).obligation_seq				:= TO_NUMBER(TO_CHAR(-3) || TO_CHAR( i * c_ob_seq_base));
		tests(03).lst_ob(i).obligation_type             := i;
		tests(03).lst_ob(i).expiry_date            	    := ((SYSDATE - i) - 364);
		tests(03).lst_ob(i).case_number					:= tests(03).lst_ca(1).case_number;
        tests(03).lst_ob(i).delete_flag                 := 'Y';

	END LOOP;


    -- Test 04
    -- =======
    -- Create 4 Obligations under the threshold - none will be deleted
	tests(04).lst_ca(1).case_number                   := gen_case_number(4);
	tests(04).lst_ca(1).case_type                     := 'APP INT ORD (INSOLV)';
	tests(04).lst_ca(1).admin_crt_code                := tests(01).lst_ct(1).code;

	FOR i IN 1 .. 4 LOOP
		tests(04).lst_ob(i).obligation_seq				:= TO_NUMBER(TO_CHAR(-4) || TO_CHAR( i * c_ob_seq_base));
		tests(04).lst_ob(i).obligation_type             := i;
		tests(04).lst_ob(i).expiry_date            	    := ((SYSDATE - i) - 354); 
		tests(04).lst_ob(i).case_number					:= tests(04).lst_ca(1).case_number;
        tests(04).lst_ob(i).delete_flag                 := 'Y';

	END LOOP;

    -- Test 05
    -- =======
    -- Create 4 Obligations over the threshold - none will be deleted as an Oracle error will be raised
	tests(05).lst_ca(1).case_number                   := gen_case_number(5);
	tests(05).lst_ca(1).case_type                     := 'APP INT ORD (INSOLV)';
	tests(05).lst_ca(1).admin_crt_code                := tests(01).lst_ct(1).code;

	FOR i IN 1 .. 4 LOOP
		tests(05).lst_ob(i).obligation_seq				:= TO_NUMBER(TO_CHAR(-5) || TO_CHAR( i * c_ob_seq_base));
		tests(05).lst_ob(i).obligation_type             := i;
		tests(05).lst_ob(i).expiry_date            	    := ((SYSDATE - i) - 365); 
		tests(05).lst_ob(i).case_number					:= tests(05).lst_ca(1).case_number;
        tests(05).lst_ob(i).delete_flag                 := 'Y';

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

COLUMN description					  FORMAT A50 WRAPPED
COLUMN last_used_by					  FORMAT A30
COLUMN delete_flag					  FORMAT A12
COLUMN amendment_type				  FORMAT A15
COLUMN table_name					  FORMAT A30
COLUMN pk01					  		  FORMAT A30
COLUMN pk02							  FORMAT A30


PROMPT Test Data BEFORE - courts
SELECT   code
        ,id
        ,name
FROM     courts
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data BEFORE - cases
SELECT   case_number
        ,admin_crt_code
FROM     cases
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data BEFORE - system_data
SELECT   item
        ,item_value
        ,item_value_currency
        ,admin_court_code
FROM     system_data
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data BEFORE - obligations

SELECT   obligation_seq
		,obligation_type
		,expiry_date
		,last_used_by
		,delete_flag
		,case_number
FROM 	 obligations
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data BEFORE - obligations_purge_errors
SELECT  obligation_seq
       ,case_number
       ,description
FROM    obligations_purge_errors
WHERE   ora_rowscn >= &test_scn;

PROMPT Test Data BEFORE - sups_amendments
SELECT   pk01
		,pk02
		,amendment_type
		,process_id
		,table_name
FROM     sups_amendments                
WHERE    ora_rowscn >= &test_scn;

SELECT 


-- Anonymous block allows white box and black box testing, e.g. can test how the Oracle exceptions are handled.
DECLARE  

    n_found     NUMBER;
    n_passed    NUMBER;
    n_failed    NUMBER;

    n_triggers  PLS_INTEGER;
    
	-- local procedure to call stored procedure being tested	
	PROCEDURE test_proc	(pn_found	OUT NUMBER
						,pn_passed	OUT NUMBER
						,pn_failed	OUT NUMBER
						)
	IS
	
		PRAGMA AUTONOMOUS_TRANSACTION;
	
	BEGIN

		-- call stored procedure
		obligations_purge	(pn_obligations_found 	=> pn_found	
							,pn_deleted_succ	  	=> pn_passed
							,pn_deleted_fail		=> pn_failed
							);
                            
        COMMIT;
        
	END test_proc;	
	
BEGIN

	FOR test in 1 .. 2 LOOP
	

		CASE test
			WHEN 1 THEN -- lock some rows to demonstrate that locked rows are skipped
			
				dbms_output.put_line('Perform Tests 1 to 4 - also demonstrates that locked rows are skipped');

				UPDATE obligations o
				SET    o.delete_flag = 'Y'
				WHERE  o.obligation_seq IN (-33000, -51000, -52000, -53000, -54000);

			WHEN 2 THEN -- capture oracle exceptions
			
				dbms_output.put_line('Perform Test 5 - also demonstrates Oracle Errors are captured');
				
				EXECUTE IMMEDIATE 'CREATE OR REPLACE TRIGGER test BEFORE DELETE ON obligations FOR EACH ROW DECLARE n_res NUMBER; BEGIN SELECT sqrt(-1) INTO n_res from dual; END;';
				
		END CASE;
	
		dbms_output.put(CHR(10));
		dbms_output.put_line('*************************');
		dbms_output.put_line('Running obilgations_purge');
		dbms_output.put_line('*************************');

		-- call local procedure	
		test_proc	(pn_found 	=> n_found
					,pn_passed 	=> n_passed
					,pn_failed 	=> n_failed
					);

        ROLLBACK;  -- release locked rows
                    
		IF test = 2 THEN
			EXECUTE IMMEDIATE 'DROP TRIGGER test';
		END IF;
			
		dbms_output.put(CHR(10));
		dbms_output.put_line('Records found         : ' || TO_CHAR(n_found));
		dbms_output.put_line('Records deleted       : ' || TO_CHAR(n_passed));
		dbms_output.put_line('Records failed        : ' || TO_CHAR(n_failed));
		dbms_output.put(CHR(10));
		
		
	END LOOP;
    
EXCEPTION

    WHEN OTHERS THEN
        
        SELECT 1 INTO n_triggers  FROM user_triggers
        WHERE trigger_name = 'TEST'
        AND     table_name = 'OBLIGATIONS';
           
        IF n_triggers = 1 THEN
            EXECUTE IMMEDIATE 'DROP TRIGGER test';
        END IF;
                
		ROLLBACK;
		dbms_output.put_line('Err : ' || SUBSTR(SQLERRM,1,500));

END;
/

ROLLBACK;

PROMPT Test Data AFTER - courts
SELECT   code
        ,id
        ,name
FROM     courts
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data AFTER - cases
SELECT   case_number
        ,admin_crt_code
FROM     cases
WHERE    ora_rowscn >= &test_scn;


PROMPT Test Data AFTER - obligations
SELECT   obligation_seq
		,obligation_type
		,expiry_date
		,last_used_by
		,delete_flag
		,case_number
FROM 	 obligations
WHERE    ora_rowscn >= &test_scn;

PROMPT Test Data AFTER - obligations_purge_errors
SELECT  obligation_seq
       ,case_number
       ,description
FROM    obligations_purge_errors
WHERE   ora_rowscn >= &test_scn;

PROMPT Test Data AFTER - sups_amendments
SELECT   pk01
		,pk02
		,amendment_type
		,process_id
		,table_name
FROM     sups_amendments                
WHERE    ora_rowscn >= &test_scn;

-- remove any left over test data
DELETE FROM obligations_purge_errors        WHERE   ora_rowscn >= &test_scn;

DELETE FROM sups_amendments                 WHERE ora_rowscn >= &test_scn;

DELETE FROM obligations                     WHERE ora_rowscn >= &test_scn;


DELETE FROM cases                           WHERE ora_rowscn >= &test_scn;

DELETE FROM system_data                     WHERE ora_rowscn >= &test_scn;

DELETE FROM courts                          WHERE ora_rowscn >= &test_scn;


COMMIT;

SPOOL OFF

exit;
