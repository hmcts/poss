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
| SYNOPSIS      : Create the CC_USER schema in the SUPSA database
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
| COMMENTS      : JF 11/03/2011 - Updated for TRAC 4283.
|
|                 Addition of CAPS.PAYABLE_ORDERS.
|
|---------------------------------------------------------------------------------
|
| $Rev: $:       Revision of last commit
| $Date: $:      Date of last commit
| $Id: $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL create_cc_user_supsa.log


ACCEPT pwd  PROMPT 'Please enter password for CC_USER:'


PROMPT ************************************************************************
PROMPT CREATE USER CC_USER
PROMPT ************************************************************************

DECLARE 
 v_ct NUMBER;
 
BEGIN

 SELECT COUNT(*)
   INTO v_ct
   FROM dba_users
  WHERE username ='CC_USER';
  
 IF v_ct = 0 THEN
 
   EXECUTE IMMEDIATE 'CREATE USER CC_USER IDENTIFIED BY &pwd
                      DEFAULT TABLESPACE MIG_TB
                      TEMPORARY TABLESPACE TEMP';
 END IF;
 
 END;
 /
 
PROMPT ************************************************************************
PROMPT GRANT CONNECT, RESOURCE TO CC_USER
PROMPT ************************************************************************

GRANT CONNECT, RESOURCE TO CC_USER;

PROMPT ************************************************************************
PROMPT GRANT CREATE DATABASE LINK TO CC_USER
PROMPT ************************************************************************

GRANT CREATE DATABASE LINK TO CC_USER;



PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT ON FMAN.TUCS_PARTIES TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON FMAN.TUCS_PARTIES TO CC_USER;


PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT ON FMAN.TUCS_ROLES TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON FMAN.TUCS_ROLES TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT ON FMAN.TUCS_COURTS_MV TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON FMAN.TUCS_COURTS_MV TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT ON CAPS.PARTIES TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CAPS.PARTIES  TO CC_USER;

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT ON CAPS.AE_PARTIES TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CAPS.AE_PARTIES TO CC_USER;

PROMPT *******************************************************************************
PROMPT CREATE SYNONYM CC_USER.FMAN_TUCS_PARTIES
PROMPT *******************************************************************************

CREATE OR REPLACE SYNONYM CC_USER.FMAN_TUCS_PARTIES FOR FMAN.TUCS_PARTIES;

PROMPT *******************************************************************************
PROMPT CREATE SYNONYM CC_USER.FMAN_TUCS_ROLES
PROMPT *******************************************************************************

CREATE OR REPLACE SYNONYM CC_USER.FMAN_TUCS_ROLES FOR FMAN.TUCS_ROLES;

PROMPT *******************************************************************************
PROMPT CREATE SYNONYM CC_USER.FMAN_TUCS_COURTS_MV
PROMPT *******************************************************************************

CREATE OR REPLACE SYNONYM CC_USER.FMAN_TUCS_COURTS_MV FOR FMAN.TUCS_COURTS_MV;

PROMPT *******************************************************************************
PROMPT CREATE SYNONYM CC_USER.CAPS_PARTIES
PROMPT *******************************************************************************

CREATE OR REPLACE SYNONYM CC_USER.CAPS_PARTIES FOR CAPS.PARTIES;

PROMPT *******************************************************************************
PROMPT CREATE SYNONYM CC_USER.CAPS_AE_PARTIES 
PROMPT *******************************************************************************

CREATE OR REPLACE SYNONYM CC_USER.CAPS_AE_PARTIES FOR CAPS.AE_PARTIES;


-- TRAC 4283
PROMPT *******************************************************************************
PROMPT ADDITIONAL GRANTS FOR TRAC #4283
PROMPT *******************************************************************************

PROMPT *******************************************************************************
PROMPT GRANT INSERT, SELECT ON CAPS.AE_PARTIES TO CC_USER;
PROMPT *******************************************************************************

GRANT SELECT ON CAPS.PAYABLE_ORDERS TO CC_USER;

PROMPT *******************************************************************************
PROMPT CREATE SYNONYM CC_USER.CAPS_PAYABLE_ORDERS 
PROMPT *******************************************************************************

CREATE OR REPLACE SYNONYM CC_USER.CAPS_PAYABLE_ORDERS FOR CAPS.PAYABLE_ORDERS;









