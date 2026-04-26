WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| TITLE    : dbup_0521_a.sql
|
| FILENAME : dbup_0521_a.sql
|
| SYNOPSIS : Performs DDL actions to implement changes required for RFC 0521
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
| COMMENTS  :  Script 1 of 2
|
|---------------------------------------------------------------------------------
|
--------------------------------------------------------------------------------*/

SPOOL dbup_0521_a.log

PROMPT ************************************************************************
PROMPT Drop IDX xpuser_role
PROMPT ************************************************************************

ALTER TABLE user_role DISABLE CONSTRAINT xpkuser_role;

ALTER TABLE user_role DROP CONSTRAINT xpkuser_role;

DROP INDEX xpkuser_role;

PROMPT ************************************************************************
PROMPT Create UX xpkuser_role
PROMPT ************************************************************************

CREATE UNIQUE INDEX xpkuser_role ON user_role
    (user_id, court_code, role_id);

PROMPT ************************************************************************
PROMPT Create PK xpkuser_role
PROMPT ************************************************************************

ALTER TABLE user_role ADD CONSTRAINT xpkuser_role
    PRIMARY KEY (user_id, court_code, role_id)
    USING INDEX xpkuser_role;

SPOOL OFF