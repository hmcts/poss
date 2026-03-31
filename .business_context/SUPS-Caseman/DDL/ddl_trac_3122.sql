WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF
SET PAGES 0 HEADING OFF TRIMSPOOL ON LINES 400 FEEDB OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/DDL/ddl_trac_3122.sql $:
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
| $Id: ddl_trac_1071_a.sql 3409 2011-05-16 12:51:38Z mistrynl $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_3122.log

PROMPT ************************************************************************
PROMPT Drop previous incarnation of Materialised View MV_CCBC_DEFENDANTS
PROMPT ************************************************************************

BEGIN

    -- remove previous incarnation of materialized view
    EXECUTE IMMEDIATE 'DROP MATERIALIZED VIEW mv_ccbc_defendants';

EXCEPTION

    WHEN OTHERS THEN
        NULL; -- suppress error likely to be that the view does not exist.

END;
/

PROMPT ************************************************************************
PROMPT View MV_CCBC_DEFENDANTS dropped
PROMPT ************************************************************************
   

CREATE MATERIALIZED VIEW mv_ccbc_defendants
REFRESH FORCE ON DEMAND
AS
SELECT  ga.case_number
	   ,ga.address_line1
	   ,ga.address_line2,
	    p.person_requested_name
FROM	cases c
	   ,given_addresses ga
	   ,parties p
	   ,case_party_roles cpr
WHERE	p.party_id = cpr.party_id
AND 	cpr.case_number = c.case_number
AND 	c.case_number = ga.case_number
AND 	ga.case_party_no = cpr.case_party_no
AND 	p.party_type_code = 'DEFENDANT'
AND 	ga.valid_to IS NULL
AND 	c.admin_crt_code = 335
AND 	ga.party_role_code = cpr.party_role_code
/

PROMPT ************************************************************************
PROMPT Created Materialized View MV_CCBC_DEFENDANTS
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Gathering stats ON MV_CCBC_DEFENDANTS table
PROMPT ************************************************************************

BEGIN

    dbms_stats.gather_table_stats(ownname => USER
                                 ,tabname => 'MV_CCBC_DEFENDANTS'                                 
                                 ,degree => 15
                                 ,estimate_percent => 20
                                 );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
/

PROMPT ************************************************************************
PROMPT Stats gathered ON MV_CCBC_DEFENDANTS table
PROMPT ************************************************************************

SPOOL OFF

