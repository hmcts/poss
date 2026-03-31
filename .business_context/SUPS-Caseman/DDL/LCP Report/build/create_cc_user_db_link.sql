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

SPOOL create_cc_user_db_link.log

ACCEPT pwd  PROMPT 'Please enter password for CC_USER:'

PROMPT ************************************************************************
PROMPT CREATE DATABASE LINK CC_USER_SUPSA
PROMPT ************************************************************************

CREATE DATABASE LINK CC_USER_SUPSA CONNECT TO CC_USER IDENTIFIED BY &pwd USING 'SUPSA';

SPOOL OFF