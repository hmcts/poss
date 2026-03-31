WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE ROLLBACK

SET LINESIZE 10000
SET NUMWIDTH 12
SET PAGESIZE 10000
SET SERVEROUTPUT ON SIZE 1000000
SET TRIMSPOOL ON
SET VERIFY OFF

SPOOL test_harness_dml_trac_2616.out

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
| COMMENTS  : Tester must have execution privileges to
|
|---------------------------------------------------------------------------------
|
| $Log$
--------------------------------------------------------------------------------*/

DEFINE v_num_of_tests       = 4

DEFINE v_test_offset        = 10
DEFINE v_ca_id_base         = 1000
DEFINE v_court_code_base    = -1000
DEFINE v_ob_seq_base       = 1000


ALTER SESSION SET NLS_TIMESTAMP_FORMAT  = 'YYYY-MM-DD HH24:MI:SS.FF3';
ALTER SESSION SET NLS_DATE_FORMAT       = 'YYYY-MM-DD HH24:MI:SS';

SET HEADING OFF
SELECT '** Module testing for script : dml_trac_2616.sql, at: ' || SYSDATE || ' **'
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

DELETE FROM sups_amendments                 WHERE court_id = 'b'
											AND	  date_of_change = TRUNC(SYSDATE);

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
	
	n_obl_type					PLS_INTEGER				:= 1;

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

	FOR i IN 1 .. 1999 LOOP
		tests(01).lst_ob(i).obligation_seq				:= TO_NUMBER(TO_CHAR(-1) || TO_CHAR( i * c_ob_seq_base));
		IF MOD(i,49) = 0 THEN
			n_obl_type := 1;
		END IF;	
		tests(01).lst_ob(i).obligation_type             := n_obl_type;
		tests(01).lst_ob(i).expiry_date            	    := SYSDATE - i;
		tests(01).lst_ob(i).case_number					:= tests(01).lst_ca(1).case_number;
		
		n_obl_type := n_obl_type + 1;
		tests(01).lst_ob(i).delete_flag                     := 'Y';
		
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

WITH stats AS
(
	SELECT  CASE WHEN trunc(expiry_date) < TRUNC(SYSDATE - 365) THEN (TRUNC(SYSDATE) - 5)
														  ELSE (TRUNC(SYSDATE) + 5)
			END cutover												
		   ,delete_flag
	FROM    obligations
	WHERE   ora_rowscn >= &test_scn
)
SELECT cutover, delete_flag, count(1)
FROM    stats
GROUP BY cutover, delete_flag;

SPOOL OFF
@dml_trac_2616

SPOOL  test_harness_dml_trac_2616.out APPEND

-- remove any left over test data
DELETE FROM obligations_purge_errors        WHERE   ora_rowscn >= &test_scn;

DELETE FROM sups_amendments                 WHERE ora_rowscn >= &test_scn;

DELETE FROM obligations                     WHERE ora_rowscn >= &test_scn;


DELETE FROM cases                           WHERE ora_rowscn >= &test_scn;

DELETE FROM system_data                     WHERE ora_rowscn >= &test_scn;

DELETE FROM courts                          WHERE ora_rowscn >= &test_scn;

SPOOL OFF
