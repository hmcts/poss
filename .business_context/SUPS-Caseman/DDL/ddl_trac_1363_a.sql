WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF
SET PAGES 0 HEADING OFF TRIMSPOOL ON LINES 400 FEEDB OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Introduction of Global Temporary Tables to replace Materialized Views
|		          V_CMAN_PARTIES and V_CMAN_PARTY_ADDRESSES.
|
|                 Change is part of the Scalability enhancements to CaseMan.
|                 These Global Temporary Tables will be used to replace materialized views used
|                 in the CM_DJ_1.rdf oracle report.
|		          The previously used Materialized Views are removed.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Script is part 1 of 2.  Script ddl_trac_1363_b.sql must be run
|                 after this script.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_1363_a.log

PROMPT ************************************************************************
PROMPT Create Global Temporary Table TMP_DJ_PARTIES_CACHE
PROMPT ************************************************************************

CREATE GLOBAL TEMPORARY TABLE tmp_dj_parties_cache
	(admin_crt_code 			NUMBER(3)
	,case_number 				VARCHAR2(8)
    ,party_id 					NUMBER(12)
    ,party_role_code 			VARCHAR2(10)
    ,case_party_no 				NUMBER(4)
    ,coded_party_no 			NUMBER(10)
    ,person_requested_name 		VARCHAR2(70)
    ,tel_no 					VARCHAR2(24)
    ,dx_number 					VARCHAR2(40)
    ,reference 					VARCHAR2(25)
    ,date_of_service_ro 		DATE
    ,date_of_service 			DATE
    ,payee_flag 				VARCHAR2(1)
    ,reporting_party_role_code	VARCHAR2(20)
	)
ON COMMIT DELETE ROWS;

PROMPT ************************************************************************
PROMPT Created Global Temporary Table TMP_DJ_PARTIES_CACHE
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Global Temporary Table TMP_DJ_PARTY_ADDRESSES_CACHE
PROMPT ************************************************************************

CREATE GLOBAL TEMPORARY TABLE tmp_dj_party_addresses_cache
    (admin_crt_code 	NUMBER(3)
    ,case_number 		VARCHAR2(8)
    ,case_party_no 		NUMBER(4)
    ,party_id 			NUMBER(12)
    ,address_line1 		VARCHAR2(35)
    ,address_line2 		VARCHAR2(35)
    ,address_line3 		VARCHAR2(35)
    ,address_line4 		VARCHAR2(35)
    ,address_line5 		VARCHAR2(35)
    ,postcode 			VARCHAR2(8)
    ,address_type_code	VARCHAR2(15)
    ,party_role_code 	VARCHAR2(10)
	)
ON COMMIT DELETE ROWS;

PROMPT ************************************************************************
PROMPT Created Global Temporary Table TMP_DJ_PARTY_ADDRESSES_CACHE
PROMPT ************************************************************************

SPOOL OFF

