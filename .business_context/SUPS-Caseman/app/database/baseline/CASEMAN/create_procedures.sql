
  CREATE OR REPLACE PROCEDURE "CASEMAN"."AUD_TRIG_GEN" (
  OUTFILE   IN VARCHAR2 DEFAULT 'aud_trig_script.sql',
  TABLENAME IN VARCHAR2 DEFAULT NULL)
AS

/*************************************************************************/
/*                                                                       */
/*  Generates a script to create audit triggers. Scripts are only        */
/*  defined for tables shown in AUDIT_CONFIG where AUDITED is set to Y.  */
/*                                                                       */
/*  Parameters:                                                          */
/*                                                                       */
/*    OUTFILE                                                            */
/*    The output file on the server. The name is case sensitive on Unix  */
/*    systems. If the file already exists, it will be overwritten.       */
/*    Directory REPORTS must be defined on the database and must exist   */
/*    on the server.                                                     */
/*                                                                       */
/*    TABLENAME                                                          */
/*    If left null, scripts for all tables are generated. If a table     */
/*    name is specified, only a script for that table is generated.      */
/*    In both cases, this depends on the table being defined as audited  */
/*    in table AUDIT_CONFIG. This parameter should be in upper case,     */
/*    unless database tables were defined in lower case using double     */
/*    quotes (not usually a good idea).                                  */
/*  The audit table itself and AUDIT_CONFIG are not audited even if      */
/*  specified in table AUDIT_CONFIG or parameter TABLENAME.              */
/*                                                                       */
/*  To improve readability, upper case is used for the code in this      */
/*  procedure, and lower case for the script being generated.            */
/*                                                                       */
/*  External tables are not audited by these triggers, even if set to Y  */
/*  in AUDIT_CONFIG. Data types LONG, BLOB, CLOB and BFILE are also      */
/*  excluded, but other columns of tables containing these data types    */
/*  are audited as normal.                                               */
/*                                                                       */
/*************************************************************************/
/*                                                                       */
/*  Date        Name      Reason for change                              */
/*  ====        ====      =================                              */
/*  01/06/2006  J Wilson  Add comments to triggers.                      */
/*                        Drop old triggers before creating new ones.    */
/*  01/10/2006  J Wilson  Change final check for invalid triggers to     */
/*                        use SUBSTR instead of LIKE.                    */
/*                                                                       */
/*************************************************************************/

  K_CONTEXT      CONSTANT VARCHAR2(12) := 'sups_app_ctx';
  K_USERID       CONSTANT VARCHAR2(11) := 'app_user_id';
  K_COURTID      CONSTANT VARCHAR2(12) := 'app_court_id';
  K_PROCESSID    CONSTANT VARCHAR2(14) := 'app_process_id';
  K_AUDIT_TABLE  CONSTANT VARCHAR2(30) := 'SUPS_AMENDMENTS';
  K_DATE_FORMAT  CONSTANT VARCHAR2(21) := 'YYYY-MM-DD';

  TYPE T_PK      IS TABLE OF VARCHAR2(100) INDEX BY BINARY_INTEGER;
  V_PK_NAME      T_PK;
  V_PK_TYPE      T_PK;

  F1             UTL_FILE.FILE_TYPE;
  V_PK_COUNT     PLS_INTEGER;
  V_OUTFILE      VARCHAR2(100);
  V_TABLENAME    VARCHAR2(30);
  V_LINE         VARCHAR2(32767);
  V_UNIQUE_INDEX VARCHAR2(30);

BEGIN

  V_OUTFILE := OUTFILE;
  V_TABLENAME := TABLENAME;

  F1 := UTL_FILE.FOPEN('REPORTS', V_OUTFILE, 'W', 2000);

  UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');
  UTL_FILE.PUT_LINE(F1,'/*   Script to (re)generate Audit triggers.                                   */');
  UTL_FILE.PUT_LINE(F1,'/*   Generated ' || RPAD(TO_CHAR(SYSDATE,'DD-MON-YYYY HH24:MI:SS'),63,' ') ||'*/');
  UTL_FILE.PUT_LINE(F1,'/*   From:                                                                    */');
  UTL_FILE.PUT_LINE(F1,'/*     Server   ' || RPAD(SYS_CONTEXT('USERENV', 'SERVER_HOST'), 62, ' ')   || '*/');
  UTL_FILE.PUT_LINE(F1,'/*     Database ' || RPAD(SYS_CONTEXT('USERENV', 'DB_NAME'), 62, ' ') || '*/');
  UTL_FILE.PUT_LINE(F1,'/*     User     ' || RPAD(USER, 62, ' ')     || '*/');
  UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');

  UTL_FILE.PUT_LINE(F1,'set serveroutput on');

  IF V_TABLENAME IS NULL
  THEN

/*************************************************************************/
/*  Drop the existing audit triggers.                                    */
/*************************************************************************/

    UTL_FILE.PUT_LINE(F1,'prompt *****************************************');
    UTL_FILE.PUT_LINE(F1,'prompt * Drop the existing audit triggers      *');
    UTL_FILE.PUT_LINE(F1,'prompt *****************************************');

    FOR C1 IN
     (SELECT UT.TRIGGER_NAME
      FROM   USER_TRIGGERS UT
      WHERE  SUBSTR(UT.TRIGGER_NAME,1,4) = 'AUD_'
      ORDER BY UT.TRIGGER_NAME)
    LOOP
      UTL_FILE.PUT_LINE(F1,'drop trigger "' || C1.TRIGGER_NAME || '";');
    END LOOP;

  END IF;

/*************************************************************************/
/*  If TABLENAME is specified, select it if set up in AUDIT_CONFIG.      */
/*  If TABLENAME is not specified, select all tables in the user if      */
/*  they are set up in AUDIT_CONFIG.                                     */
/*************************************************************************/

  FOR C1 IN
   (SELECT UT.TABLE_NAME
    FROM   USER_TABLES UT
    WHERE  UT.TABLE_NAME NOT IN (K_AUDIT_TABLE, 'AUDIT_CONFIG')
    AND    UT.TABLE_NAME IN
            (SELECT AC.TABLE_NAME
             FROM   AUDIT_CONFIG AC
             WHERE  AC.AUDITED = 'Y')
    AND    NOT EXISTS
            (SELECT 'X'
             FROM   USER_EXTERNAL_TABLES UET
             WHERE  UET.TABLE_NAME = UT.TABLE_NAME)
    AND    ((V_TABLENAME IS NULL) OR (UT.TABLE_NAME = V_TABLENAME))
    ORDER BY UT.TABLE_NAME)
  LOOP

/*************************************************************************/
/*  Generate a prompt to say which table's script is being generated.    */
/*************************************************************************/

    UTL_FILE.PUT_LINE(F1,'prompt *****************************************');
    UTL_FILE.PUT_LINE(F1,'prompt *  ' || RPAD(C1.TABLE_NAME, 35, ' ')  || '  *');
    UTL_FILE.PUT_LINE(F1,'prompt *****************************************');

/*************************************************************************/
/*  CREATE OR REPLACE statement starts.                                  */
/*************************************************************************/

    UTL_FILE.PUT_LINE(F1,'create or replace trigger "AUD_' || SUBSTR(C1.TABLE_NAME,1,26) || '"');
    UTL_FILE.PUT_LINE(F1,'after update or insert or delete on "' || C1.TABLE_NAME || '"');
    UTL_FILE.PUT_LINE(F1,'for each row');
    UTL_FILE.PUT_LINE(F1,'declare');

    UTL_FILE.PUT_LINE(F1,'  v_userid varchar2(30);');
    UTL_FILE.PUT_LINE(F1,'  v_courtid varchar2(4);');
    UTL_FILE.PUT_LINE(F1,'  v_processid varchar2(20);');
    UTL_FILE.PUT_LINE(F1,'  v_type varchar2(8);');

    UTL_FILE.PUT_LINE(F1,'begin');

/*************************************************************************/
/*  Add comments to the trigger.                                         */
/*************************************************************************/

    UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');
    UTL_FILE.PUT_LINE(F1,'/*   Audit trigger for table ' || RPAD(C1.TABLE_NAME, 49, ' ') || '*/');
    UTL_FILE.PUT_LINE(F1,'/*   Script generated ' || RPAD(TO_CHAR(SYSDATE,'DD-MON-YYYY HH24:MI:SS'), 56) || '*/');
    UTL_FILE.PUT_LINE(F1,'/*   From:                                                                    */');
    UTL_FILE.PUT_LINE(F1,'/*     Server   ' || RPAD(SYS_CONTEXT('USERENV', 'SERVER_HOST'), 62, ' ') || '*/');
    UTL_FILE.PUT_LINE(F1,'/*     Database ' || RPAD(SYS_CONTEXT('USERENV', 'DB_NAME'), 62, ' ') || '*/');
    UTL_FILE.PUT_LINE(F1,'/*     User     ' || RPAD(USER, 62, ' ') || '*/');
    UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');
    UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');
    UTL_FILE.PUT_LINE(F1,'/**  THIS TRIGGER MUST NOT BE EDITED. IF THERE ARE SCHEMA CHANGES FOR        **/');
    UTL_FILE.PUT_LINE(F1,'/**  AUDITED TABLES, THE AUDIT TRIGGERS MUST BE REGENERATED USING A SCRIPT   **/');
    UTL_FILE.PUT_LINE(F1,'/**  PRODUCED BY PROCEDURE AUD_TRIG_GEN.                                     **/');
    UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');
    UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');
    UTL_FILE.PUT_LINE(F1,'/*   If updating, each column is checked to see if it has changed, and for    */');
    UTL_FILE.PUT_LINE(F1,'/*   each one that has there is a row written to SUPS_AMENDMENTS.             */');
    UTL_FILE.PUT_LINE(F1,'/*   If inserting or deleting, a single row is written to SUPS_AMENDMENTS.    */');
    UTL_FILE.PUT_LINE(F1,'/******************************************************************************/');

/*************************************************************************/
/*  Set the context in the trigger.                                      */
/*************************************************************************/

    UTL_FILE.PUT_LINE(F1,'  v_userid := sys_context(''' || K_CONTEXT || ''',''' || K_USERID    || ''');');
    UTL_FILE.PUT_LINE(F1,'  v_courtid := sys_context(''' || K_CONTEXT || ''',''' || K_COURTID   || ''');');
    UTL_FILE.PUT_LINE(F1,'  v_processid := sys_context(''' || K_CONTEXT || ''',''' || K_PROCESSID || ''');');

/*************************************************************************/
/*  If the UNIQUE_INDEX column of table AUDIT_CONFIG is null, use the    */
/*  primary key constraint. If not, use the specified unique index.      */
/*  If no index of that name exists, or the index is not unique,         */
/*  columns PK01 to PK12 in the SUPS_AMENDMENTS table will be null.      */
/*  This will also be the case if UNIQUE_INDEX is null and there is no   */
/*  primary key.                                                         */
/*************************************************************************/

    V_UNIQUE_INDEX := NULL;

    SELECT AC.UNIQUE_INDEX
    INTO   V_UNIQUE_INDEX
    FROM   AUDIT_CONFIG AC
    WHERE  AC.TABLE_NAME = C1.TABLE_NAME;

    V_PK_COUNT := 0;

    IF V_UNIQUE_INDEX IS NULL
    THEN

      FOR C2 IN
       (SELECT UCC.COLUMN_NAME,
               UCC.POSITION,
               UTC.DATA_TYPE
        FROM   USER_CONSTRAINTS UC,
               USER_CONS_COLUMNS UCC,
               USER_TAB_COLUMNS UTC
        WHERE  UC.TABLE_NAME = C1.TABLE_NAME
        AND    UC.CONSTRAINT_NAME = UCC.CONSTRAINT_NAME
        AND    UC.CONSTRAINT_TYPE = 'P'
        AND    UCC.TABLE_NAME = UTC.TABLE_NAME
        AND    UCC.COLUMN_NAME = UTC.COLUMN_NAME
        ORDER BY UCC.POSITION)
      LOOP

        V_PK_NAME(C2.POSITION) := C2.COLUMN_NAME;
        V_PK_TYPE(C2.POSITION) := C2.DATA_TYPE;
        V_PK_COUNT := C2.POSITION;

      END LOOP;

    ELSE

      FOR C2 IN
       (SELECT UIC.COLUMN_NAME,
               UIC.COLUMN_POSITION,
               UTC.DATA_TYPE
        FROM   USER_IND_COLUMNS UIC,
               USER_TAB_COLUMNS UTC,
               USER_INDEXES UI
        WHERE  UIC.TABLE_NAME = C1.TABLE_NAME
        AND    UIC.INDEX_NAME = V_UNIQUE_INDEX
        AND    UIC.TABLE_NAME = UTC.TABLE_NAME
        AND    UIC.COLUMN_NAME = UTC.COLUMN_NAME
        AND    UIC.TABLE_NAME = UI.TABLE_NAME
        AND    UIC.INDEX_NAME = UI.INDEX_NAME
        AND    UI.UNIQUENESS = 'UNIQUE'
        ORDER BY UIC.COLUMN_POSITION)
      LOOP

        V_PK_NAME(C2.COLUMN_POSITION) := C2.COLUMN_NAME;
        V_PK_TYPE(C2.COLUMN_POSITION) := C2.DATA_TYPE;
        V_PK_COUNT := C2.COLUMN_POSITION;

      END LOOP;

    END IF;

/*************************************************************************/
/*  UPDATING - an audit row is written for each changed column.          */
/*************************************************************************/

    UTL_FILE.PUT_LINE(F1,'  if updating');
    UTL_FILE.PUT_LINE(F1,'  then');

    FOR C2 IN
     (SELECT UTC.COLUMN_NAME
      ,      UTC.DATA_TYPE
      FROM   USER_TAB_COLUMNS UTC
      WHERE  UTC.TABLE_NAME = C1.TABLE_NAME
      AND    UTC.DATA_TYPE NOT IN ('LONG','BLOB','CLOB','BFILE')
      ORDER BY UTC.COLUMN_NAME)
    LOOP

      UTL_FILE.PUT_LINE(F1,'    if (:old."' || C2.COLUMN_NAME || '" != :new."' || C2.COLUMN_NAME || '")');
      UTL_FILE.PUT_LINE(F1,'    or (:old."' || C2.COLUMN_NAME || '" is null and :new."' || C2.COLUMN_NAME                                    || '" is not null)');
      UTL_FILE.PUT_LINE(F1,'    or (:old."' || C2.COLUMN_NAME || '" is not null and :new."' || C2.COLUMN_NAME
                                    || '" is null)');
      UTL_FILE.PUT_LINE(F1,'    then');

      UTL_FILE.PUT_LINE(F1,'      insert into "' || K_AUDIT_TABLE || '" (');
      UTL_FILE.PUT_LINE(F1,'        time_stamp,');
      UTL_FILE.PUT_LINE(F1,'        date_of_change,');
      UTL_FILE.PUT_LINE(F1,'        court_id,');
      UTL_FILE.PUT_LINE(F1,'        user_id,');
      UTL_FILE.PUT_LINE(F1,'        process_id,');
      UTL_FILE.PUT_LINE(F1,'        table_name,');
      UTL_FILE.PUT_LINE(F1,'        column_name,');
      UTL_FILE.PUT_LINE(F1,'        amendment_type,');

      V_LINE := '        old_value';
      IF V_PK_COUNT > 0
      THEN
        V_LINE := V_LINE || ',';
      ELSE
        V_LINE := V_LINE || ')';
      END IF;
      UTL_FILE.PUT_LINE(F1,V_LINE);

      FOR I IN 1..V_PK_COUNT
      LOOP
        V_LINE := '        pk' || LPAD(TO_CHAR(I),2,'0');
        IF I = V_PK_COUNT
        THEN
          V_LINE := V_LINE || ')';
        ELSE
          V_LINE := V_LINE || ',';
        END IF;
        UTL_FILE.PUT_LINE(F1,V_LINE);
      END LOOP;

      UTL_FILE.PUT_LINE(F1,'      values (');
      UTL_FILE.PUT_LINE(F1,'        systimestamp,');
      UTL_FILE.PUT_LINE(F1,'        trunc(sysdate),');
      UTL_FILE.PUT_LINE(F1,'        v_courtid,');
      UTL_FILE.PUT_LINE(F1,'        v_userid,');
      UTL_FILE.PUT_LINE(F1,'        v_processid,');
      UTL_FILE.PUT_LINE(F1,'        ''' || C1.TABLE_NAME || ''',');
      UTL_FILE.PUT_LINE(F1,'        ''' || C2.COLUMN_NAME || ''',');
      UTL_FILE.PUT_lINE(F1,'        ''Updated'',');

      IF C2.DATA_TYPE = 'DATE'
      THEN
        V_LINE := '        to_char(:old."' || C2.COLUMN_NAME || '",''' || K_DATE_FORMAT || ''')';
      ELSIF C2.DATA_TYPE = 'NUMBER'
      THEN
        V_LINE := '        to_char(:old."' || C2.COLUMN_NAME || '")';
      ELSE
        V_LINE := '        :old."' || C2.COLUMN_NAME || '"';
      END IF;

      IF V_PK_COUNT > 0
      THEN
        V_LINE := V_LINE || ',';
      ELSE
        V_LINE := V_LINE || ');';
      END IF;
      UTL_FILE.PUT_LINE(F1,V_LINE);

      FOR I IN 1..V_PK_COUNT
      LOOP

        IF V_PK_TYPE(I) = 'DATE'
        THEN
          V_LINE := '        to_char(:old."' || V_PK_NAME(I) || '",''' || K_DATE_FORMAT || ''')';
        ELSIF V_PK_TYPE(I) = 'NUMBER'
        THEN
          V_LINE := '        to_char(:old."' || V_PK_NAME(I) || '")';
        ELSE
          V_LINE := '        :old."' || V_PK_NAME(I) || '"';
        END IF;

        IF I = V_PK_COUNT
        THEN
          V_LINE := V_LINE || ');';
        ELSE
          V_LINE := V_LINE || ',';
        END IF;
        UTL_FILE.PUT_LINE(F1,V_LINE);

      END LOOP;

      UTL_FILE.PUT_LINE(F1,'    end if;');

    END LOOP;

    UTL_FILE.PUT_LINE(F1,'  else');

/*************************************************************************/
/*  INSERTING or DELETING - a single row is written with the column      */
/*  AMENDMENT_TYPE set to "Inserted" or "Deleted".                       */
/*************************************************************************/

    UTL_FILE.PUT_LINE(F1,'    if inserting');
    UTL_FILE.PUT_LINE(F1,'    then');
    UTL_FILE.PUT_LINE(F1,'      v_type := ''Inserted'';');
    UTL_FILE.PUT_LINE(F1,'    else');
    UTL_FILE.PUT_LINE(F1,'      v_type := ''Deleted'';');
    UTL_FILE.PUT_LINE(F1,'    end if;');

    UTL_FILE.PUT_LINE(F1,'    insert into "' || K_AUDIT_TABLE || '" (');
    UTL_FILE.PUT_LINE(F1,'      time_stamp,');
    UTL_FILE.PUT_LINE(F1,'      date_of_change,');
    UTL_FILE.PUT_LINE(F1,'      court_id,');
    UTL_FILE.PUT_LINE(F1,'      user_id,');
    UTL_FILE.PUT_LINE(F1,'      process_id,');
    UTL_FILE.PUT_LINE(F1,'      table_name,');
    UTL_FILE.PUT_LINE(F1,'      column_name,');
    UTL_FILE.PUT_LINE(F1,'      amendment_type,');

    V_LINE := '      old_value';
    IF V_PK_COUNT > 0
    THEN
      V_LINE := V_LINE || ',';
    ELSE
      V_LINE := V_LINE || ')';
    END IF;
    UTL_FILE.PUT_LINE(F1,V_LINE);

    FOR I IN 1..V_PK_COUNT
    LOOP

      V_LINE := '      pk' || LPAD(TO_CHAR(I),2,'0');
      IF I = V_PK_COUNT
      THEN
        V_LINE := V_LINE || ')';
      ELSE
        V_LINE := V_LINE || ',';
      END IF;
      UTL_FILE.PUT_LINE(F1,V_LINE);

    END LOOP;
    UTL_FILE.PUT_LINE(F1,'    values (');
    UTL_FILE.PUT_LINE(F1,'      systimestamp,');
    UTL_FILE.PUT_LINE(F1,'      trunc(sysdate),');
    UTL_FILE.PUT_LINE(F1,'      v_courtid,');
    UTL_FILE.PUT_LINE(F1,'      v_userid,');
    UTL_FILE.PUT_LINE(F1,'      v_processid,');
    UTL_FILE.PUT_LINE(F1,'      ''' || C1.TABLE_NAME || ''',');
    UTL_FILE.PUT_LINE(F1,'      null,');
    UTL_FILE.PUT_LINE(F1,'      v_type,');

    V_LINE := '      null';
    IF V_PK_COUNT > 0
    THEN
      V_LINE := V_LINE || ',';
    ELSE
      V_LINE := V_LINE || ');';
    END IF;
    UTL_FILE.PUT_LINE(F1,V_LINE);

    FOR I IN 1..V_PK_COUNT
    LOOP

      IF V_PK_TYPE(I) = 'DATE'
      THEN
        V_LINE := '      to_char(nvl(:old."' || V_PK_NAME(I) || '",'  ||
                                      ':new."' || V_PK_NAME(I) || '"),''' ||
                                      K_DATE_FORMAT || ''')';
      ELSIF V_PK_TYPE(I) = 'NUMBER'
      THEN
        V_LINE := '      to_char(nvl(:old."' || V_PK_NAME(I) || '",'  ||
                                      ':new."' || V_PK_NAME(I) || '"))';
      ELSE
        V_LINE := '      nvl(:old."' || V_PK_NAME(I) || '",:new."' || V_PK_NAME(I) || '")';
      END IF;

      IF I = V_PK_COUNT
      THEN
        V_LINE := V_LINE || ');';
      ELSE
        V_LINE := V_LINE || ',';
      END IF;
      UTL_FILE.PUT_LINE(F1,V_LINE);

    END LOOP;

    UTL_FILE.PUT_LINE(F1,'  end if;');
    UTL_FILE.PUT_LINE(F1,'end;');

    UTL_FILE.PUT_LINE(F1,'/');
    UTL_FILE.PUT_LINE(F1,'show errors');
    UTL_FILE.PUT_LINE(F1,' ');

  END LOOP;

  UTL_FILE.PUT_LINE(F1,'prompt *****************************************');
  UTL_FILE.PUT_LINE(F1,'prompt * Check all audit triggers are valid.   *');
  UTL_FILE.PUT_LINE(F1,'prompt * The next line should read             *');
  UTL_FILE.PUT_LINE(F1,'prompt *  "no rows selected"                   *');
  UTL_FILE.PUT_LINE(F1,'prompt *****************************************');

  UTL_FILE.PUT_LINE(F1,'column trigger_name format a30');
  UTL_FILE.PUT_LINE(F1,'select substr(o.object_name,1,30) trigger_name, o.status');
  UTL_FILE.PUT_LINE(F1,'from obj o');
  UTL_FILE.PUT_LINE(F1,'where o.object_type = ''TRIGGER''');
  UTL_FILE.PUT_LINE(F1,'and o.status != ''VALID''');
  UTL_FILE.PUT_LINE(F1,'and substr(o.object_name,1,4) = ''AUD_''');
  UTL_FILE.PUT_LINE(F1,'order by 1,2;');

  UTL_FILE.FCLOSE(F1);

EXCEPTION

  WHEN OTHERS
  THEN
    IF UTL_FILE.IS_OPEN(F1)
    THEN
      UTL_FILE.FCLOSE(F1);
    END IF;
    RAISE;

END;
/



  CREATE OR REPLACE PROCEDURE "CASEMAN"."CLONE_FM_PARTY" ( p_party_from IN NUMBER, p_party_to IN NUMBER, p_court_code_to IN NUMBER ) IS

BEGIN

        sys.SET_SUPS_APP_CTX (P_APP_USERID => 'SUPPORT', P_APP_COURTID => '000', P_APP_PROCESSID => 'FM_FPC_MERGE_PKG');

        -- Clone party record
        INSERT INTO PARTIES
        (PARTY_ID,
        PERSON_TITLE,
        PERSON_GIVEN_FIRST_NAME,
        PERSON_GIVEN_SECOND_NAME,
        PERSON_FAMILY_NAME,
        PERSON_GIVEN_THIRD_NAME,
        AUTHENTICATION_PIN,
        COMPANY_NAME,
        AUTHENTICATION_PASSWORD,
        EMAIL_ADDRESS,
        GENDER,
        ETHNIC_ORIGIN_CODE,
        PARTY_TYPE_CODE,
        FAX_NUMBER,
        PERSON_REQUESTED_NAME,
        TEL_NO,
        DX_NUMBER,
        WELSH_INDICATOR,
        PREFERRED_COMMUNICATION_METHOD,
        PERSON_DOB)
        SELECT
        p_party_to, -- new party id
        PERSON_TITLE,
        PERSON_GIVEN_FIRST_NAME,
        PERSON_GIVEN_SECOND_NAME,
        PERSON_FAMILY_NAME,
        PERSON_GIVEN_THIRD_NAME,
        AUTHENTICATION_PIN,
        COMPANY_NAME,
        AUTHENTICATION_PASSWORD,
        EMAIL_ADDRESS,
        GENDER,
        ETHNIC_ORIGIN_CODE,
        PARTY_TYPE_CODE,
        FAX_NUMBER,
        PERSON_REQUESTED_NAME,
        TEL_NO,
        DX_NUMBER,
        WELSH_INDICATOR,
        PREFERRED_COMMUNICATION_METHOD,
        PERSON_DOB
        FROM PARTIES
        WHERE PARTY_ID = p_party_from ;

        -- Clone coded parties record.
        INSERT INTO CODED_PARTIES
        (PARTY_ID,
        CODE,
        PTY_TYPE,
        ADMIN_COURT_CODE,
        CASCADE_UPDATE_FLAG,
        PERSON_REQUESTED_NAME,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE)
        SELECT
        p_party_to, -- new party id
        CODE,
        PTY_TYPE,
        P_COURT_CODE_TO, -- to court code
        CASCADE_UPDATE_FLAG,
        PERSON_REQUESTED_NAME,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE
        FROM CODED_PARTIES
        WHERE PARTY_ID = p_party_from ;

        -- Clone addresses
        INSERT INTO GIVEN_ADDRESSES
        (ADDRESS_ID,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE,
        VALID_FROM,
        VALID_TO,
        PARTY_ID,
        REFERENCE,
        CASE_NUMBER,
        PARTY_ROLE_CODE,
        ADDRESS_TYPE_CODE,
        CO_NUMBER,
        ADDR_TYPE_SEQ,
        ALD_SEQ,
        COURT_CODE,
        UPDATED_BY,
        CASE_PARTY_NO)
        SELECT
        ADDR_SEQUENCE.NEXTVAL, -- new address id
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE,
        VALID_FROM,
        VALID_TO,
        p_party_to, -- new party_id
        REFERENCE,
        CASE_NUMBER,
        PARTY_ROLE_CODE,
        ADDRESS_TYPE_CODE,
        CO_NUMBER,
        ADDR_TYPE_SEQ,
        ALD_SEQ,
        decode(COURT_CODE,null,null,P_COURT_CODE_TO), -- update to new court if old court is present
        UPDATED_BY,
        CASE_PARTY_NO
        FROM GIVEN_ADDRESSES
        WHERE PARTY_ID = p_party_from;

EXCEPTION
WHEN OTHERS THEN
    RAISE ;

END CLONE_FM_PARTY;
/



  CREATE OR REPLACE PROCEDURE "CASEMAN"."CMAN_CLONE_PARTY" ( p_party_from IN NUMBER, p_party_to IN NUMBER, p_court_code_to IN NUMBER ) IS
/*-------------------------------------------------------------------------------
|
| FILENAME      : cman_clone_party_proc.sql
|
| SYNOPSIS      : Contains functionality for FPC merger. Clones parties over remote call from FMAN
|
| AUTHOR        : RSingh
|
| CLIENT        : Ministry of Justice
|
| COMMENTS      : Accepts
|                   party_from ( party_id ) : source party being cloned
|                   party_to   ( party_id ) : party id for clone record ( pre-extracted PARTIES_SEQUENCE.NEXTVAL )
|                   court_to   ( court_id ) : destination court ( for app context and coded_party, address data )
|
|---------------------------------------------------------------------------------
|
|v0.1  RSingh    Initial Version Created
|
--------------------------------------------------------------------------------*/

BEGIN
        -- set context
        sys.SET_SUPS_APP_CTX (P_APP_USERID => 'SUPPORT', P_APP_COURTID => to_char(p_court_code_to), P_APP_PROCESSID => 'CMAN_CLONE_PARTY');

        -- Clone party record
        INSERT INTO PARTIES
        (PARTY_ID,
        PERSON_TITLE,
        PERSON_GIVEN_FIRST_NAME,
        PERSON_GIVEN_SECOND_NAME,
        PERSON_FAMILY_NAME,
        PERSON_GIVEN_THIRD_NAME,
        AUTHENTICATION_PIN,
        COMPANY_NAME,
        AUTHENTICATION_PASSWORD,
        EMAIL_ADDRESS,
        GENDER,
        ETHNIC_ORIGIN_CODE,
        PARTY_TYPE_CODE,
        FAX_NUMBER,
        PERSON_REQUESTED_NAME,
        TEL_NO,
        DX_NUMBER,
        WELSH_INDICATOR,
        PREFERRED_COMMUNICATION_METHOD,
        PERSON_DOB)
        SELECT
        p_party_to, -- new party id
        PERSON_TITLE,
        PERSON_GIVEN_FIRST_NAME,
        PERSON_GIVEN_SECOND_NAME,
        PERSON_FAMILY_NAME,
        PERSON_GIVEN_THIRD_NAME,
        AUTHENTICATION_PIN,
        COMPANY_NAME,
        AUTHENTICATION_PASSWORD,
        EMAIL_ADDRESS,
        GENDER,
        ETHNIC_ORIGIN_CODE,
        PARTY_TYPE_CODE,
        FAX_NUMBER,
        PERSON_REQUESTED_NAME,
        TEL_NO,
        DX_NUMBER,
        WELSH_INDICATOR,
        PREFERRED_COMMUNICATION_METHOD,
        PERSON_DOB
        FROM PARTIES
        WHERE PARTY_ID = p_party_from ;

        -- Clone coded parties record.
        INSERT INTO CODED_PARTIES
        (PARTY_ID,
        CODE,
        PTY_TYPE,
        ADMIN_COURT_CODE,
        CASCADE_UPDATE_FLAG,
        PERSON_REQUESTED_NAME,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE)
        SELECT
        p_party_to, -- new party id
        CODE,
        PTY_TYPE,
        P_COURT_CODE_TO, -- to court code
        CASCADE_UPDATE_FLAG,
        PERSON_REQUESTED_NAME,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE
        FROM CODED_PARTIES
        WHERE PARTY_ID = p_party_from ;

        -- Clone addresses
        INSERT INTO GIVEN_ADDRESSES
        (ADDRESS_ID,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE,
        VALID_FROM,
        VALID_TO,
        PARTY_ID,
        REFERENCE,
        CASE_NUMBER,
        PARTY_ROLE_CODE,
        ADDRESS_TYPE_CODE,
        CO_NUMBER,
        ADDR_TYPE_SEQ,
        ALD_SEQ,
        COURT_CODE,
        UPDATED_BY,
        CASE_PARTY_NO)
        SELECT
        ADDR_SEQUENCE.NEXTVAL, -- new address id
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        ADDRESS_LINE3,
        ADDRESS_LINE4,
        ADDRESS_LINE5,
        POSTCODE,
        VALID_FROM,
        VALID_TO,
        p_party_to, -- new party_id
        REFERENCE,
        CASE_NUMBER,
        PARTY_ROLE_CODE,
        ADDRESS_TYPE_CODE,
        CO_NUMBER,
        ADDR_TYPE_SEQ,
        ALD_SEQ,
        decode(COURT_CODE,null,null,P_COURT_CODE_TO), -- update to new court if old court is present
        UPDATED_BY,
        CASE_PARTY_NO
        FROM GIVEN_ADDRESSES
        WHERE PARTY_ID = p_party_from;

EXCEPTION
WHEN OTHERS THEN
    RAISE ;

END CMAN_CLONE_PARTY;
/



  CREATE OR REPLACE PROCEDURE "CASEMAN"."FIND_INSOL_NO" (
    owning_crt                IN       cases.admin_crt_code%TYPE) IS
    TYPE fdigits IS VARRAY (10000) OF INTEGER (4);

    insolnos                      fdigits;
    casenos                       fdigits;
    insolnum                      INTEGER (4);
    casenum                       INTEGER (4);
    insolfound                    BOOLEAN;
    casefound                     BOOLEAN;
    caseref                       cases.case_number%TYPE;
    insolyyyy                     cases.insolvency_number%TYPE;
    aa                            VARCHAR2 (2);               --AA = Court ID
    rd                            VARCHAR2 (1) := '1';     --Range Digit 1..9
BEGIN
    SELECT   SUBSTR (insolvency_number
                    ,1
                    ,4)
    BULK COLLECT INTO insolnos
    FROM     cases
    WHERE    insolvency_number IS NOT NULL
    AND      admin_crt_code = owning_crt
    AND      SUBSTR (insolvency_number
                    ,5
                    ,4) = TO_CHAR (SYSDATE, 'YYYY')
    ORDER BY insolvency_number;

    SELECT   SUBSTR (case_number
                    ,5
                    ,4)
    BULK COLLECT INTO casenos
    FROM     cases
    WHERE    case_number IS NOT NULL
    AND      admin_crt_code = owning_crt
    AND      SUBSTR (case_number
                    ,3
                    ,1) = SUBSTR ((TO_CHAR (SYSDATE, 'YYYY'))
                                 ,4
                                 ,1)
    AND      SUBSTR (case_number
                    ,4
                    ,1) = rd
    ORDER BY case_number;

    FOR i IN 1 .. insolnos.COUNT LOOP
        insolfound := FALSE;
        insolnum := LPAD (i
                         ,4
                         ,0);

        FOR j IN 1 .. insolnos.COUNT LOOP
            IF insolnos (j) = insolnum THEN
                insolfound := TRUE;
            END IF;
        END LOOP;

        IF NOT insolfound THEN
            --Found an unused insolvency number
            insolyyyy :=
                         TO_CHAR (insolnum, '00000')
                      || TO_CHAR (SYSDATE, 'YYYY');
            DBMS_OUTPUT.put_line (   insolyyyy
                                  || ' xxx');
            EXIT;
        END IF;
    END LOOP;

    FOR i IN 1 .. casenos.COUNT LOOP
        casefound := FALSE;
        casenum := LPAD (i
                        ,4
                        ,0);

        FOR j IN 1 .. casenos.COUNT LOOP
            IF casenos (j) = casenum THEN
                casefound := TRUE;
            END IF;
        END LOOP;

        IF NOT casefound THEN
            --Found an unused case number
            SELECT ID
            INTO   aa
            FROM   courts
            WHERE  code = owning_crt
            AND    ROWNUM = 1;

            caseref :=
                   aa
                || SUBSTR ((TO_CHAR (SYSDATE, 'YYYY'))
                          ,4
                          ,1)
                || rd
                || TO_CHAR (casenum);
            DBMS_OUTPUT.put_line (   caseref
                                  || ' xxx');
            EXIT;
        END IF;
    END LOOP;
--Insert Prerequisite data
--insert_insol(owning_crt,caseref,insolyyyy);

--Error handling
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL;
END find_insol_no; /



  CREATE OR REPLACE PROCEDURE "CASEMAN"."Find Insol No" () is

declare
  type insol_nos(10000) is array of integer(4)
  no_of_insols                      number

begin
  select substr(insolvency_number,1,4)
  into inol_nos
  from cases
  where insolvency_number is not NULL
  and substr(insolvency_number,5,4) = to_char(sysdate,'YYYY')


end Find Insol No; /



  CREATE OR REPLACE PROCEDURE "CASEMAN"."INSERT_CANDIDATE_CLAIMS" ( p_array_size IN PLS_INTEGER,
                  p_cred_code IN PLS_INTEGER) IS
  TYPE ARRAY IS TABLE OF tmp_mcol_mig_cred_claims%ROWTYPE;
  l_data ARRAY;

  CURSOR c IS SELECT  case_number,
            decode(date_of_issue > add_months(sysdate, -36), 'Y', 'N'),
            'N',
            'N',
            'N'
        FROM   cases
        WHERE   admin_crt_code = 335
        AND    cred_code = p_cred_code;

BEGIN
    OPEN c;
    LOOP
    FETCH c BULK COLLECT INTO l_data LIMIT p_array_size;

    FORALL i IN 1..l_data.COUNT
    INSERT INTO tmp_mcol_mig_cred_claims VALUES l_data(i);

    EXIT WHEN c%NOTFOUND;
    END LOOP;
    CLOSE c;
END insert_candidate_claims;
/



  CREATE OR REPLACE PROCEDURE "CASEMAN"."OBLIGATIONS_PURGE" (pn_obligations_found OUT NUMBER
                                              ,pn_deleted_succ  OUT NUMBER
                                              ,pn_deleted_fail  OUT NUMBER
                                              )
AS

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Common/database/Coding%20Templates/SUPS%20Oracle%20package%20template.sql $:
|
| SYNOPSIS      : A procedure to remove Obligation records that have been marked
|                 for deletion, that have been deleted over a year ago.
|
|                 Any Obligations that could not be deleted due to an Oracle Exception
|                 will be logged.
|
| PARAMETERS    : pn_obligations_found  OUT     Returns a count of the Obligation Records that qualify for purging
|                 pn_deleted_succ       OUT     Returns a count of the Obligation Records deleted
|                 pn_deleted_fail       OUT     Returns a count of the Obligation Records failed to be deleted
|
|
| $Author: westm $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Requires the existence of the obligations_purge_errors Table.
|
| CHANGES       : 25/10/2010 (Chris Vincent), Obligations table has a composite primary key consisting of obligation_seq
|                 and case_number so using obligation_seq on it's own causes Oracle Errors.  Case Number now added throughout.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3617 $:          Revision of last commit
| $Date: 2009-08-16 10:04:05 +0100 (Sun, 16 Aug 2009) $:         Date of last commit
| $Id: SUPS Oracle package template.sql 3617 2009-08-16 09:04:05Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

    -- constants sets how many records are fetched from the cur_del_obligations cursor at a time.
    -- The figure of a 1000 is the maximum that should be set, as it determines how many records from the cursor
    -- is held in memory when the stored procedure is executed.
    c_purge_batch           CONSTANT    PLS_INTEGER :=  1000;

    -- tallys to record what entries in the obligations table have been purged by this stored procedure.
    n_obligations_found     PLS_INTEGER := 0;
    n_deleted_succ          PLS_INTEGER := 0;
    n_deleted_fail          PLS_INTEGER := 0;

    n_lock                  PLS_INTEGER := 0; -- used to aid row locking

    -- variables used to store error details before they're written to the obligation_purge_errors table.
    n_err_seq               obligations_purge_errors.obligation_seq%TYPE;
    v_err_desc              obligations_purge_errors.description%TYPE;
    v_case_no               obligations_purge_errors.case_number%TYPE;

    -- stores cut-off date
    d_purge_from            DATE        := TRUNC(SYSDATE - 365);

    -- get candidate Obligations marked for deletion.
    -- 25/10/2010 (Chris Vincent) Added Case Number added to retrieval list
    CURSOR cur_del_obligations (pd_cutoff   IN obligations.expiry_date%TYPE)
    IS
        SELECT  rowid
               ,o.obligation_seq
               ,case_number
        FROM    obligations o
        WHERE   o.delete_flag = 'Y'
        AND     TRUNC(o.expiry_date) < pd_cutoff;


    TYPE tab_del_obligations_rowids     IS TABLE OF ROWID INDEX BY BINARY_INTEGER;
    TYPE tab_del_oligations_seqs        IS TABLE OF obligations.obligation_seq%TYPE INDEX BY BINARY_INTEGER;
    TYPE tab_del_oligations_caseno      IS TABLE OF obligations.case_number%TYPE INDEX BY BINARY_INTEGER;

    -- PL/SQL tables to store rowids from the obligations table.  The second of the two tables is used to reset the first table after a fetch
    -- from the cur_del_obligations cursor.
    lst_del_obligations_rowids          tab_del_obligations_rowids;
    lst_del_obligations_rowids_em       tab_del_obligations_rowids;

    -- PL/SQL tables to store the Primary Key values from the obligations table.  The second of the two tables is used to reset the first table after a fetch
    -- from the cur_del_obligations cursor.
    lst_del_obligations_seqs            tab_del_oligations_seqs;
    lst_del_obligations_seqs_empty      tab_del_oligations_seqs;

    -- 25/10/2010 (Chris Vincent) Added Case Number variables
    lst_del_obligations_caseno          tab_del_oligations_caseno;
    lst_del_obligations_caseno_em       tab_del_oligations_caseno;

    -- An exception for error ORA-00054: "resource busy and acquire with NOWAIT specified" to catch locked record errors
    e_record_locked EXCEPTION;
    PRAGMA EXCEPTION_INIT (e_record_locked, -54);

    -- A local stored procedures to write entries to the obligations_purge_errors table.
    -- The commit here is isolated from the commit in the body of the stored procedure,
    -- which guarantees that entries written to the errors table are retained even when a
    -- rollback is issued.
    -- Change History:
    -- 25/10/2010 (Chris Vincent), added Case Number to the procedure
    PROCEDURE log_err (pn_obligation_seq    IN obligations_purge_errors.obligation_seq%TYPE
                      ,pv_error_desc        IN  obligations_purge_errors.description%TYPE
                      ,pv_case_number       IN  obligations_purge_errors.case_number%TYPE
                      )
    AS

        PRAGMA AUTONOMOUS_TRANSACTION;

   BEGIN

        INSERT INTO   obligations_purge_errors
            (obligation_seq
            ,description
            ,case_number
            ,error_date
            )
         VALUES
            (pn_obligation_seq
            ,pv_error_desc
            ,pv_case_number
            ,SYSDATE
            );

        COMMIT;

   END log_err;


BEGIN

    set_sups_app_ctx ('support', '0', 'Obligation Purge');

    OPEN cur_del_obligations(d_purge_from);
    LOOP

        -- 25/10/2010 (Chris Vincent) Added Case Number to fetch list
        FETCH cur_del_obligations
        BULK COLLECT INTO lst_del_obligations_rowids, lst_del_obligations_seqs, lst_del_obligations_caseno
        LIMIT c_purge_batch;

        -- 25/10/2010 (Chris Vincent) Moved exit statement to here for efficiency
        EXIT WHEN lst_del_obligations_seqs.COUNT = 0;

        n_obligations_found := n_obligations_found + lst_del_obligations_seqs.COUNT;

        FOR i IN 1..lst_del_obligations_seqs.COUNT LOOP

            BEGIN

                n_err_seq   := NULL;
                v_err_desc  := NULL;
                v_case_no   := NULL;

                SELECT  1
                INTO    n_lock
                FROM    obligations o
                WHERE   o.obligation_seq = lst_del_obligations_seqs(i)
                AND     o.case_number = lst_del_obligations_caseno(i)
                FOR UPDATE NOWAIT;

                DELETE FROM obligations o
                WHERE o.rowid = lst_del_obligations_rowids(i);

            EXCEPTION

                WHEN e_record_locked THEN

                    n_deleted_fail := n_deleted_fail + 1;

                    n_err_seq   := lst_del_obligations_seqs(i);
                    v_err_desc  := 'Record locked by another process - therefore it has not been deleted!';
                    v_case_no   := lst_del_obligations_caseno(i);

                    log_err(n_err_seq, v_err_desc, v_case_no);

                WHEN OTHERS THEN

                    n_deleted_fail := n_deleted_fail + 1;

                    n_err_seq   := lst_del_obligations_seqs(i);
                    v_err_desc := SUBSTR(SQLERRM,1,500);
                    v_case_no   := lst_del_obligations_caseno(i);

                    log_err(n_err_seq, v_err_desc, v_case_no);

            END;

        END LOOP ;

        n_deleted_succ := n_obligations_found - n_deleted_fail;

        COMMIT;

        EXIT WHEN cur_del_obligations%NOTFOUND;

        -- reset lists.
        lst_del_obligations_rowids := lst_del_obligations_rowids_em;
        lst_del_obligations_seqs   := lst_del_obligations_seqs_empty;
        lst_del_obligations_caseno := lst_del_obligations_caseno_em;

    END LOOP;

    CLOSE cur_del_obligations;

    pn_obligations_found := n_obligations_found;
    pn_deleted_succ      := n_deleted_succ;
    pn_deleted_fail      := n_deleted_fail;

    COMMIT;

EXCEPTION

    WHEN OTHERS THEN

        IF cur_del_obligations%ISOPEN THEN -- close open cursor
            CLOSE cur_del_obligations;
        END IF;

        pn_obligations_found := n_obligations_found;
        pn_deleted_succ      := n_deleted_succ;
        pn_deleted_fail      := n_deleted_fail;

        RAISE;

END obligations_purge;
/


