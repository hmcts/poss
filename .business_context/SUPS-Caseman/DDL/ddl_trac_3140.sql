WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

ALTER SESSION ENABLE PARALLEL DML;

SPOOL ddl_trac_3140.log

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Add a new column 'WELSH_COURT_NAME' to the COURTS table
|
|
| $Author$:       Author of last commit

| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : <add anything applicable here if necessary, eg file exposure, etc>
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:           Revision at last change
|
--------------------------------------------------------------------------------*/

PROMPT ************************************************************************
PROMPT Create New Column on COURTS
PROMPT ************************************************************************

DECLARE

    n_col_count     PLS_INTEGER     := 0;

BEGIN

    SELECT 1
    INTO    n_col_count
    FROM    user_tab_columns
    WHERE   table_name = 'COURTS'
    AND     column_name = 'WELSH_COURT_NAME';

EXCEPTION

    WHEN NO_DATA_FOUND THEN

        EXECUTE IMMEDIATE 'ALTER TABLE courts ADD welsh_court_name VARCHAR2(60) NULL';
END;
/

COMMIT;

COMMENT ON COLUMN courts.welsh_court_name IS 'Stores the Welsh Language derivation of the Court''s name.';

PROMPT ************************************************************************
PROMPT New Column on COURTS Created
PROMPT ************************************************************************

SPOOL OFF