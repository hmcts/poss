WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| TITLE    : dbup_0486_b
|
| FILENAME : dbup_0486_b.sql
|
| SYNOPSIS : Data Migration script to set the Insolvency Number against
|            existing insolvency cases for a specific court.
|
| AUTHOR   : Mark West
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
| COMMENTS  : Requires receipt of a SUPS Court Code inorder to process.
|
|             Script 2 of 2 for RFC 486
|
|---------------------------------------------------------------------------------
|
| $Log$
--------------------------------------------------------------------------------*/


DEFINE CourtToProcess = &&1
DEFINE Errorfile =''

VARIABLE v_dbup_err_filename            VARCHAR2(100)
VARIABLE v_errmessage                   VARCHAR2(500)
VARIABLE v_exec_date                    VARCHAR2(26);


DECLARE

    -- Fetch Isolvency case numbers
    CURSOR curGetInsolvencyCaseNos
    IS
    SELECT  c.rowid
           ,c.case_number
           ,c.insolvency_number
    FROM    cases c
    WHERE   c.case_type IN
           ('APP INT ORD (INSOLV)'
           ,'APP TO SET STAT DEMD'
           ,'CREDITORS PETITION'
           ,'DEBTORS PETITION'
           ,'WINDING UP PETITION'
           )
      AND   c.insolvency_number IS NULL
      AND   c.admin_crt_code = &&CourtToProcess
    ORDER BY c.case_number;

    -- var. to store result of court code validity
    v_valid_court                       VARCHAR2(1)   := 'N';
    v_filename                          VARCHAR2(100) := 'dbup_0486_b_output_for_court_code_'
                                                        || &&CourtToProcess
                                                        || '_at_<TIME>.log';

    v_exec_time                         VARCHAR2(20);

    -- Store the 2 parts of the insolvency number
    v_derived_insolvency_year           VARCHAR2(4);
    v_derived_insolvency_sequence       VARCHAR2(4);

    n_count_succ                        PLS_INTEGER := 0;
    n_count_fail                        PLS_INTEGER := 0;
    n_count_processed_tally             PLS_INTEGER := 0;
    n_lock_row_to_update                PLS_INTEGER;

    n_commit_point                      PLS_INTEGER := 500;

    r_writefilehndl                     UTL_FILE.FILE_TYPE;


    TYPE tblInsolvencyCaseNos           IS TABLE OF curGetInsolvencyCaseNos%ROWTYPE
        INDEX BY BINARY_INTEGER;

    lstInsolvencyCaseNos                tblInsolvencyCaseNos;

    -- UDF exceptions
    exInvalidOrMissingCourtCode         EXCEPTION;
    exCourtCodeHasTooManyEntries        EXCEPTION;
    exInvalidInsolvencyCase             EXCEPTION;
    exInsolvencySequenceNotFound        EXCEPTION;
    exInsolvencyYearNotFound            EXCEPTION;

    exRecordLocked                      EXCEPTION;
    PRAGMA EXCEPTION_INIT(exRecordLocked, -00054);

    -- Procedure closes opened file
    PROCEDURE p_close_file
    IS
    BEGIN

        IF UTL_FILE.IS_OPEN(r_writefilehndl) THEN
            UTL_FILE.FCLOSE(r_writefilehndl);
        END IF;

    END p_close_file;

    -- Procedure shows section heading that lists cases numbers that have failed the migration
    -- for the current execution.  Only called once.
    PROCEDURE p_show_hdg_for_errd_cases
    IS
    BEGIN

        IF n_count_fail = 0 THEN
            UTL_FILE.PUT_LINE(r_writefilehndl, 'List of Errored Case Numbers');
            UTL_FILE.PUT_LINE(r_writefilehndl, '~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        END IF;

    END p_show_hdg_for_errd_cases;

    -- Procedure shows details of the insolvency cases processed during this execution.
    PROCEDURE p_show_stats
    IS
    BEGIN

        UTL_FILE.PUT(r_writefilehndl, CHR(10));
        UTL_FILE.PUT_LINE(r_writefilehndl, RPAD('-',80,'-'));
        UTL_FILE.PUT_LINE(r_writefilehndl, 'Insolvency Cases Found       = ' || TO_CHAR(n_count_processed_tally));
        UTL_FILE.PUT_LINE(r_writefilehndl, 'Insolvency Cases Updated     = ' || TO_CHAR(n_count_succ));
        UTL_FILE.PUT_LINE(r_writefilehndl, 'Insolvency Cases Skipped     = ' || TO_CHAR(n_count_fail));
        UTL_FILE.PUT_LINE(r_writefilehndl, RPAD('=',80,'='));

        p_close_file;

    END p_show_stats;


BEGIN

    -- get execution time
    SELECT  TO_CHAR(LOCALTIMESTAMP(3), 'YYYYMMDDHH24MISSFF3')
           ,TO_CHAR(SYSDATE,'DD-MON-YYYY HH:MI:SS PM')
    INTO    v_exec_time
           ,:v_exec_date
    FROM    SYS.DUAL;

    v_filename           := REPLACE(v_filename,'<TIME>', v_exec_time);
    :v_dbup_err_filename := REPLACE(v_filename,'.log','.err');

    r_writefilehndl      := UTL_FILE.FOPEN('REPORTS',v_filename,'W',500);

    UTL_FILE.PUT_LINE(r_writefilehndl, RPAD('=',80,'='));
    UTL_FILE.PUT_LINE(r_writefilehndl, 'Insolvency Number Data Migration Report for' );
    UTL_FILE.PUT_LINE(r_writefilehndl, 'Court Code ''&&CourtToProcess'' at ' || :v_exec_date);
    UTL_FILE.PUT_LINE(r_writefilehndl, RPAD('-',80,'-'));

    -- Checks court code argument received is valid and/or is active in CaseMan.
    BEGIN

        SELECT  'Y'
        INTO    v_valid_court
        FROM    courts c
        WHERE   c.code = &&CourtToProcess
          AND   c.caseman_inservice = 'Y'
          AND   c.sups_centralised_flag = 'Y';

    EXCEPTION

        WHEN NO_DATA_FOUND THEN
            RAISE exInvalidOrMissingCourtCode;

        WHEN TOO_MANY_ROWS THEN
            RAISE exCourtCodeHasTooManyEntries;

    END;

    OPEN curGetInsolvencyCaseNos;
    LOOP

        FETCH curGetInsolvencyCaseNos
            BULK COLLECT INTO lstInsolvencyCaseNos
            LIMIT n_commit_point;

        EXIT WHEN lstInsolvencyCaseNos.COUNT = 0;


        <<set_insolvency_number>>
        FOR i IN 1..lstInsolvencyCaseNos.COUNT LOOP

            v_derived_insolvency_sequence  := NULL;
            v_derived_insolvency_year      := NULL;

            -----
            -- Block to validate case number
            ----
            BEGIN

                -- validate case number - where the fourth digit in a case number is not a 7, skip to next case
                IF (REGEXP_INSTR (lstInsolvencyCaseNos(i).case_number, '.{3}[7].*') = 0) THEN
                    RAISE exInvalidInsolvencyCase;
                END IF;

                -- extract and validate sequence
                -- 1. get last 4 characters of case number
                -- 2. check last 4 characters are digits, where not, skip to next case
                v_derived_insolvency_sequence := REGEXP_SUBSTR (lstInsolvencyCaseNos(i).case_number, '[[:digit:]]{4}$');

                IF v_derived_insolvency_sequence IS NULL THEN
                    RAISE exInsolvencySequenceNotFound;
                END IF;

                -- extract and validate year
                -- 1. get First character of case number
                -- 2. check first character is numeric, where not, skip to next case
                v_derived_insolvency_year     := REGEXP_SUBSTR (lstInsolvencyCaseNos(i).case_number, '^[[:digit:]]{1}');

                IF v_derived_insolvency_year IS NULL THEN
                    RAISE exInsolvencyYearNotFound;
                END IF;


                -- set insolvency number
                lstInsolvencyCaseNos(i).insolvency_number := v_derived_insolvency_sequence || '200' || v_derived_insolvency_year;

                -- lock cases record to update
                SELECT  1
                INTO    n_lock_row_to_update
                FROM    cases c
                WHERE   c.rowid  = lstInsolvencyCaseNos(i).rowid
                FOR UPDATE NOWAIT;


                UPDATE  cases c
                SET     c.insolvency_number = lstInsolvencyCaseNos(i).insolvency_number
                WHERE   c.rowid = lstInsolvencyCaseNos(i).rowid;

                n_count_succ := n_count_succ + 1;

            EXCEPTION

                WHEN exInvalidInsolvencyCase THEN -- record invalid case
                    p_show_hdg_for_errd_cases;
                    UTL_FILE.PUT_LINE(r_writefilehndl, 'Case number ' || TO_CHAR(lstInsolvencyCaseNos(i).case_number) || ' invalid.');
                    n_count_fail := n_count_fail + 1;

                WHEN exInsolvencySequenceNotFound THEN -- record invalid case
                    p_show_hdg_for_errd_cases;
                    UTL_FILE.PUT_LINE(r_writefilehndl, 'Case number ' || TO_CHAR(lstInsolvencyCaseNos(i).case_number) || ' - cannot derive insolvency sequence.');
                    n_count_fail := n_count_fail + 1;

                WHEN exInsolvencyYearNotFound THEN -- record invalid case
                    p_show_hdg_for_errd_cases;
                    UTL_FILE.PUT_LINE(r_writefilehndl, 'Case number ' || TO_CHAR(lstInsolvencyCaseNos(i).case_number) || ' - cannot derive insolvency year.');
                    n_count_fail := n_count_fail + 1;

                WHEN exRecordLocked THEN
                    p_show_hdg_for_errd_cases;
                    UTL_FILE.PUT_LINE(r_writefilehndl, 'Case number ' || TO_CHAR(lstInsolvencyCaseNos(i).case_number) || ' - record locked by another session.');
                    n_count_fail := n_count_fail + 1;
            END;

            n_count_processed_tally := n_count_processed_tally + 1;

        END LOOP set_insolvency_number;

        COMMIT;


    END LOOP;  -- fetch candidate insolvency cases to update

    COMMIT;

    p_show_stats;

EXCEPTION

    WHEN exInvalidOrMissingCourtCode THEN
        UTL_FILE.PUT_LINE(r_writefilehndl, 'Court Code ''&&CourtToProcess'' is either invalid, no longer an active court');
        UTL_FILE.PUT_LINE(r_writefilehndl, 'or not a SUPS court.');
        p_show_stats;

    WHEN exCourtCodeHasTooManyEntries THEN
        UTL_FILE.PUT_LINE(r_writefilehndl, 'Court Code ''&&CourtToProcess'' has too many entries in the COURTS table.  Please investigate!');
        p_show_stats;

    WHEN UTL_FILE.INVALID_PATH THEN
        :v_errmessage := 'File location specified is invalid (REPORTS Object may not be set).';

    WHEN UTL_FILE.INVALID_MODE THEN
        :v_errmessage := 'The open_mode parameter in FOPEN is invalid.';

    WHEN UTL_FILE.INVALID_FILEHANDLE THEN
        :v_errmessage := 'File handle specified is invalid.';

    WHEN UTL_FILE.INVALID_OPERATION THEN
        :v_errmessage := 'File could not be opened or operated on as requested.';

    WHEN UTL_FILE.WRITE_ERROR THEN
        :v_errmessage := 'Operating system error occurred during a write operation.';

    WHEN UTL_FILE.INTERNAL_ERROR THEN
        :v_errmessage := 'Unspecified PL/SQL error';

    WHEN UTL_FILE.CHARSETMISMATCH THEN
        :v_errmessage := 'A file is opened using FOPEN_NCHAR, but later I/O operations use nonchar functions such as PUTF or GET_LINE.';

    WHEN UTL_FILE.FILE_OPEN THEN
        :v_errmessage := 'The requested operation failed because the file is open.';

    WHEN UTL_FILE.INVALID_MAXLINESIZE THEN
        :v_errmessage := 'The maximium linesize for a file write operation has been exceeded!';

    WHEN UTL_FILE.INVALID_FILENAME THEN
        :v_errmessage := 'The filename parameter is invalid.';

    WHEN UTL_FILE.ACCESS_DENIED THEN
        :v_errmessage := 'User/Role, script is  executed in does not have the correct operating system permissions.';


    WHEN OTHERS THEN

        UTL_FILE.PUT_LINE(r_writefilehndl, 'Court Code ''&&CourtToProcess'' raised the following Oracle Error. ' );
        UTL_FILE.PUT_LINE(r_writefilehndl,  SUBSTR(SQLERRM, 1, 500));
        UTL_FILE.PUT(r_writefilehndl,  CHR(10));
        UTL_FILE.PUT_LINE(r_writefilehndl, 'ROLLBACK issued!');
        ROLLBACK;
        p_show_stats;

END;
/


/*-------------------------------------------------------------------------------
-- Create spool file where utl_file error raised
--
-- Use bind var. :v_errmessage to capture a report directory object failures.
-- If a value exists in the bind var. assign constructed file name
-- in :v_dbup_err_filename to substitution variable, Errorfile.
-- If there's no error, the target file in the SPOOL clause will be null
-- which stops the creation of the *.err file.
-------------------------------------------------------------------------------*/
COLUMN errfilename NEW_VALUE Errorfile NOPRINT
SELECT  CASE WHEN :v_errmessage IS NOT NULL
             THEN :v_dbup_err_filename
             ELSE NULL
        END errfilename
FROM    SYS.DUAL;

SPOOL &&Errorfile
BEGIN

    IF :v_errmessage IS NOT NULL THEN

        DBMS_OUTPUT.PUT_LINE (RPAD('=',80,'='));
        DBMS_OUTPUT.PUT_LINE ('Insolvency Number Data Migration Report for' );
        DBMS_OUTPUT.PUT_LINE ('Court Code ''&&CourtToProcess'' at ' || :v_exec_date);
        DBMS_OUTPUT.PUT_LINE (RPAD('-',80,'-'));
        DBMS_OUTPUT.PUT_LINE ('Error raised :' || :v_errmessage);
        DBMS_OUTPUT.PUT_LINE (RPAD('=',80,'='));

    END IF;

END;
/
SPOOL OFF

EXIT