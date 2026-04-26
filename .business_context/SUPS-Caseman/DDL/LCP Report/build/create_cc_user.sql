WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF
SET PAGES 0 HEADING OFF TRIMSPOOL ON LINES 400 FEEDB OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: $:
|
| SYNOPSIS      : Create the CC_USER schema
|
| $Author:  $:    Jon Fane
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : <add anything applicable here if necessary, eg file exposure, etc>
|
|---------------------------------------------------------------------------------
|
| $Rev: $:       Revision of last commit
| $Date: $:      Date of last commit
| $Id: $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL create_cc_user.log


PROMPT ************************************************************************
PROMPT CREATE USER CC_USER
PROMPT ************************************************************************


CREATE USER CC_USER IDENTIFIED BY CC_USER
DEFAULT TABLESPACE USERS
TEMPORARY TABLESPACE TEMP;


PROMPT ************************************************************************
PROMPT GRANT CONNECT, RESOURCE TO CC_USER
PROMPT ************************************************************************

GRANT CONNECT, RESOURCE TO CC_USER;

PROMPT ************************************************************************
PROMPT GRANT CREATE DATABASE LINK TO CC_USER
PROMPT ************************************************************************

GRANT CREATE DATABASE LINK TO CC_USER;


PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT ON CMAN.CONSOLIDATED_ORDERS TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CMAN.CONSOLIDATED_ORDERS TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT, UPDATE, DELETE ON CMAN.CASE_PARTY_ROLES TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CMAN.CASE_PARTY_ROLES TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT, UPDATE, DELETE ON CMAN.CODED_PARTIES TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CMAN.CODED_PARTIES TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT, UPDATE, DELETE ON CMAN.WARRANTS TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CMAN.WARRANTS TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT, UPDATE, DELETE ON CMAN.ALLOWED_DEBTS TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CMAN.ALLOWED_DEBTS TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT, UPDATE, DELETE ON CMAN.PAYMENTS TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CMAN.PAYMENTS TO CC_USER;







