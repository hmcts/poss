WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF
SET PAGES 0 HEADING OFF TRIMSPOOL ON LINES 400 FEEDB OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/ddl_trac_1071_a.sql $:
|
| SYNOPSIS      : <fill in short description of what this file is here>
|
|
| $Author: westm $:       Author of last commit
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
| $Rev: 3409 $:          Revision of last commit
| $Date: 2009-07-22 13:51:38 +0100 (Wed, 22 Jul 2009) $:         Date of last commit
| $Id: ddl_trac_1071_a.sql 3409 2009-07-22 12:51:38Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_1071_a.log

PROMPT ************************************************************************
PROMPT Drop previous incarnation of View V_CMAN_PARTIES
PROMPT ************************************************************************

BEGIN

    -- remove previous incarnation of materialized view
    EXECUTE IMMEDIATE 'DROP MATERIALIZED VIEW v_cman_parties';

EXCEPTION

    WHEN OTHERS THEN
        NULL; -- suppress error likely to be that the view does not exist.

END;
/

PROMPT ************************************************************************
PROMPT View V_CMAN_PARTIES dropped
PROMPT ************************************************************************
   

CREATE MATERIALIZED VIEW v_cman_parties
REFRESH COMPLETE ON DEMAND
AS
SELECT   c.admin_crt_code admin_crt_code
        ,cpr.case_number case_number
        ,p.party_id AS party_id
        ,cpr.party_role_code AS party_role_code
        ,cpr.case_party_no AS case_party_no
        ,ncp.code coded_party_no
        ,p.person_requested_name AS person_requested_name
        ,p.tel_no tel_no
        ,p.dx_number dx_number
        ,cpr.reference reference
        ,cpr.deft_date_of_service_ro    date_of_service_ro
        ,cpr.deft_date_of_service       date_of_service
        ,cpr.payee_flag payee_flag
        ,DECODE (pr.reporting_role_code
                ,'OTHER', cpr.party_role_code
                ,pr.reporting_role_code
                )                       reporting_party_role_code
FROM     parties p
        ,cases c
        ,case_party_roles cpr
        ,coded_parties ncp
        ,party_roles pr
WHERE    c.admin_crt_code != 335
  AND    c.case_number = cpr.case_number
  AND    cpr.party_id = p.party_id
  AND    cpr.party_role_code = pr.party_role_code
  AND    cpr.party_id = ncp.party_id(+)
ORDER BY 1,2,3,4
/

PROMPT ************************************************************************
PROMPT Created Materialized View V_CMAN_PARTIES
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Gathering stats ON V_CMAN_PARTIES table
PROMPT ************************************************************************

BEGIN

    dbms_stats.gather_table_stats(ownname => USER
                                 ,tabname => 'V_CMAN_PARTIES'                                 
                                 ,degree => 15
                                 ,estimate_percent => 20
                                 );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
/

PROMPT ************************************************************************
PROMPT Stats gathered ON V_CMAN_PARTIES table
PROMPT ************************************************************************

SPOOL OFF

