WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF


/*-------------------------------------------------------------------------------
|
| FILENAME      : ddl_trac_805.sql
|
| SYNOPSIS      : Address sequence of PRFD change
|                 
|                 
|                 
|
| $Author: barisa $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2008 Logica plc.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|                 
|                 
|
|---------------------------------------------------------------------------------
|
| $Rev: 1492 $:          Revision of last commit
| $Date: 2009-01-28 19:01:16 +0000 (Wed, 28 Jan 2009) $:         Date of last commit
| $Id: ddl_trac_805.sql 1492 2009-01-28 19:01:16Z barisa $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_805.log


PROMPT ******************************************************************************
PROMPT Change Address sequence of PRFD so it does not clash with FMAN Brighton court
PROMPT ******************************************************************************

DECLARE
  v_count NUMBER := 0;
  
BEGIN
  
  set_sups_app_ctx('azhnn1','180','Reference Data fix');
  
  SELECT COUNT(1)
  INTO v_count
  FROM given_addresses
 WHERE court_code = 100
   AND address_id = 2;
  
  IF v_count <> 0 THEN
    DBMS_OUTPUT.PUT_LINE(v_count || ' records to update.');
    
    UPDATE given_addresses
    SET address_id = 5000
    WHERE court_code = 100
    AND address_id = 2;
    
    DBMS_OUTPUT.PUT_LINE(v_count || ' records updated.');
  END IF;
  
  SELECT count(1)
  INTO v_count
  FROM given_addresses
  WHERE court_code = 100
  AND address_id = 2;
  
  IF v_count <> 0 THEN
     DBMS_OUTPUT.PUT_LINE('Court not updated?!?');
  END IF;
  COMMIT;
END;

/

PROMPT ************************************************************************
PROMPT Sequence changed
PROMPT ************************************************************************

Spool Off 
