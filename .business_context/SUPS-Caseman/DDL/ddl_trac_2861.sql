WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE ROLLBACK

SET PAGESIZE 10000
SET SERVEROUTPUT ON SIZE 1000000
SET TRIMSPOOL ON

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/ddl_trac_2861.sql $:
|
| SYNOPSIS      : Applies composite indexes on the CASES and AE_EVENTS Tables
|
|
| $Author: westm $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      :  Script must be run from SQL*Plus against the CaseMan schema
|			       as the CaseMan User.
|
|		           A log file is produced in the same directory where this script
|			       is located, in the Linux File System.
|
|---------------------------------------------------------------------------------
|
| $Rev: 6632 $:          Revision of last commit
| $Date: 2010-05-04 16:30:38 +0100 (Tue, 04 May 2010) $:         Date of last commit
| $Id: ddl_trac_2861.sql 6632 2010-05-04 15:30:38Z westm $:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_2861.log


PROMPT ************************************************************************
PROMPT Create Index CASES_FX2 on Table CASES
PROMPT ************************************************************************

CREATE INDEX cases_fx2 ON cases
	(case_number
	,admin_crt_code
    ,NVL(status,'N/A')
	);


PROMPT ************************************************************************
PROMPT Index CASES_FX2 on Table CASES created!
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create Index AE_EVENTS_FX3 on Table AE_EVENTS
PROMPT ************************************************************************

CREATE INDEX ae_events_fx3 ON ae_events
    (std_event_id
    ,TRUNC(NVL(service_date, TO_DATE ('31-12-9999','dd-mm-yyyy')))
    ,service_status
    ,error_indicator
    );

PROMPT ************************************************************************
PROMPT Index AE_EVENTS_FX3 on Table AE_EVENTS created!
PROMPT ************************************************************************

SPOOL OFF

EXIT