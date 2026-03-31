WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/ddl_trac_646.sql $:
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
| $Rev: 2977 $:          Revision of last commit
| $Date: 2009-06-09 18:04:50 +0100 (Tue, 09 Jun 2009) $:         Date of last commit
| $Id: ddl_trac_646.sql 2977 2009-06-09 17:04:50Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_646.log

PROMPT ************************************************************************
PROMPT Drop previous incarnation of Materialized View MV_QBP_CASE
PROMPT ************************************************************************

/*
Use an anonymous block to dynamically create the partitions for each court
for the mv_qbp_case materialized view.  Dynamic creation necessary due to
inconsistencies in court reference data held in different target environments.
*/

BEGIN

    -- remove previous incarnation of materialized view
    EXECUTE IMMEDIATE 'DROP MATERIALIZED VIEW mv_qbp_case';

EXCEPTION

    WHEN OTHERS THEN
        NULL; -- suppress error do error likely to be MV does not exist.

END;
/

PROMPT ************************************************************************
PROMPT Materialized View MV_QBP_CASE dropped
PROMPT ************************************************************************

SPOOL OFF

/*****
   spool the output of the dynamically created DDL to create a new
   version of the MV_QBP_CASE materialized view.

   This new spool file once created will be called from this session.

*****/
SET PAGES 0 HEADING OFF TRIMSPOOL ON LINES 400 FEEDB OFF

SPOOL cr_mv_qbp_case.sql

WITH crt_fl AS
        (SELECT  MIN(c_fl.code) mn
                ,MAX(c_fl.code) mx
         FROM    courts c_fl
        )
SELECT  CASE WHEN crt_fl.mn = c.code THEN
'CREATE MATERIALIZED VIEW mv_qbp_case '
|| ' PARALLEL 15'
|| ' PARTITION BY LIST (admin_crt_code)'
|| ' (PARTITION mv_qbp_case_pt_adm_crt_' || c.code || ' VALUES (' || c.code || ')'
WHEN crt_fl.mx = c.code THEN
'       ,PARTITION mv_qbp_case_pt_adm_crt_' || c.code || ' VALUES (' || c.code || ')
       )
        BUILD IMMEDIATE
        AS
        SELECT NULL code
              ,cpr.case_number case_number
              ,ga.address_line1 address_line1
              ,ga.address_line2 address_line2
              ,p.person_requested_name person_requested_name
              ,pr.party_role_description party_role_description
              ,cpr.party_role_code party_role_code
              ,c.admin_crt_code admin_crt_code
              ,c.insolvency_number
        FROM   case_party_roles cpr
              ,given_addresses ga
              ,parties p
              ,party_roles pr
              ,cases c
        WHERE  c.admin_crt_code != 335
        AND    pr.party_role_code = cpr.party_role_code
        AND    p.party_id = cpr.party_id
        AND    c.case_number = cpr.case_number
        AND    ga.case_number = cpr.case_number
        AND    ga.party_role_code = cpr.party_role_code
        AND    ga.case_party_no = cpr.case_party_no
        AND    ga.valid_to IS NULL
        AND    (   cpr.party_role_code != ''SOLICITOR''
                OR EXISTS (
                       SELECT NULL
                       FROM   cpr_to_cpr_relationship cpr2cprb
                       WHERE  cpr2cprb.cpr_b_case_number = cpr.case_number
                       AND    cpr2cprb.cpr_b_party_role_code = cpr.party_role_code
                       AND    cpr2cprb.cpr_b_case_party_no = cpr.case_party_no
                       AND    NVL(cpr2cprb.deleted_flag,''N'') = ''N''))
        UNION ALL
        SELECT cp.code code
              ,cpr.case_number case_number
              ,cp.address_line1 address_line1
              ,cp.address_line2 address_line2
              ,cp.person_requested_name person_requested_name
              ,pr.party_role_description party_role_description
              ,cpr.party_role_code party_role_code
              ,c.admin_crt_code admin_crt_code
              ,c.insolvency_number
        FROM   coded_parties cp
              ,case_party_roles cpr
              ,party_roles pr
              ,cases c
        WHERE  c.admin_crt_code != 335
        AND    pr.party_role_code = cpr.party_role_code
        AND    c.case_number = cpr.case_number
        AND    cp.party_id = cpr.party_id
        AND    (   cpr.party_role_code != ''SOLICITOR''
                OR EXISTS (
                       SELECT NULL
                       FROM   cpr_to_cpr_relationship cpr2cprb
                       WHERE  cpr2cprb.cpr_b_case_number = cpr.case_number
                       AND    cpr2cprb.cpr_b_party_role_code = cpr.party_role_code
                       AND    cpr2cprb.cpr_b_case_party_no = cpr.case_party_no
                       AND    NVL(cpr2cprb.deleted_flag,''N'') =''N''))
 ORDER BY 2,6,5,1,3,4;'
        ELSE
'       ,PARTITION mv_qbp_case_pt_adm_crt_' || c.code || ' VALUES (' || c.code || ')'
        END  part_stmt
FROM    courts c
       ,crt_fl;

SPOOL OFF

-- spool file created, now resume writing to the audit file associated with this
-- DDL script.
SPOOL ddl_trac_646.log APPEND

-- run the spool file created to apply the Materialized View
PROMPT ************************************************************************
PROMPT Creating Materialized View MV_QBP_CASE
PROMPT ************************************************************************
@cr_mv_qbp_case.sql

PROMPT ************************************************************************
PROMPT Created Materialized View MV_QBP_CASE
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Gathering stats ON MV_QBP_CASE table and partitions
PROMPT ************************************************************************

BEGIN

    dbms_stats.gather_table_stats(ownname => USER
                                 ,tabname => 'MV_QBP_CASE'
                                 ,granularity => 'PARTITION'
                                 ,degree => 15
                                 ,estimate_percent => 20
                                 );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
/

PROMPT ************************************************************************
PROMPT Stats gathered ON MV_QBP_CASE table and partitions
PROMPT ************************************************************************

SPOOL OFF

