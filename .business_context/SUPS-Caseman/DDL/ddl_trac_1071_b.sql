WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF
SET PAGES 0 HEADING OFF TRIMSPOOL ON LINES 400 FEEDB OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/ddl_trac_1071_b.sql $:
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
| $Id: ddl_trac_1071_b.sql 3409 2009-07-22 12:51:38Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_1071_b.log

PROMPT ************************************************************************
PROMPT Drop previous incarnation of View V_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

BEGIN

    -- remove previous incarnation of materialized view
    EXECUTE IMMEDIATE 'DROP MATERIALIZED VIEW v_cman_party_addresses';

EXCEPTION

    WHEN OTHERS THEN
        NULL; -- suppress error likely to be that the view does not exist.

END;
/

PROMPT ************************************************************************
PROMPT View V_CMAN_PARTY_ADDRESSES dropped
PROMPT ************************************************************************
   

CREATE MATERIALIZED VIEW  v_cman_party_addresses
REFRESH COMPLETE ON DEMAND
AS
SELECT  c.admin_crt_code admin_crt_code
       ,c.case_number case_number
       ,cpr.case_party_no case_party_no
       ,cpr.party_id party_id
       ,ga.address_line1 address_line1
       ,ga.address_line2 address_line2
       ,ga.address_line3 address_line3
       ,ga.address_line4 address_line4
       ,ga.address_line5 address_line5
       ,ga.postcode postcode
       ,ga.address_type_code address_type_code
       ,cpr.party_role_code party_role_code
FROM    cases c
       ,given_addresses ga
       ,case_party_roles cpr
WHERE   c.admin_crt_code != '335'
  AND   cpr.case_number = c.case_number
  AND   ga.valid_to IS NULL
  AND  (
        (DECODE (ga.address_type_code
                 ,'CODED PARTY', 'CODED PARTY'
                 ,ga.address_type_code
                 ) = 'CODED PARTY'
        AND ga.party_id = cpr.party_id
        )
   OR  (cpr.case_number = ga.case_number
        AND cpr.case_party_no = ga.case_party_no
        AND cpr.party_role_code = ga.party_role_code
        )
       )
ORDER BY 1,2
/

PROMPT ************************************************************************
PROMPT Created Materialized View V_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Gathering stats ON V_CMAN_PARTY_ADDRESSES table
PROMPT ************************************************************************

BEGIN

    dbms_stats.gather_table_stats(ownname => USER
                                 ,tabname => 'V_CMAN_PARTY_ADDRESSES'                                 
                                 ,degree => 15
                                 ,estimate_percent => 20
                                 );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
/

PROMPT ************************************************************************
PROMPT Stats gathered ON V_CMAN_PARTY_ADDRESSES table
PROMPT ************************************************************************

SPOOL OFF

