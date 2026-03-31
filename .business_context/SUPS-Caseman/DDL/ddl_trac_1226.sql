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
| SYNOPSIS      : Introduction of Global Temporary Table
|
|                 Change is part of the Scalability enhancements to CaseMan.
|                 This Global Temporary Table will be used to replace views used
|                 in the DPA_INIT.rdf oracle report.
|
| $Author:  $:       Author of last commit
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
| $Rev: $:          Revision of last commit
| $Date: $:         Date of last commit
| $Id: $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_1226.log

PROMPT ************************************************************************
PROMPT Create Global Temporary Table TMP_DPA_PARTIES_CACHE
PROMPT ************************************************************************

CREATE GLOBAL TEMPORARY TABLE tmp_dpa_parties_cache
    (party_id 				NUMBER(12) 		NOT NULL PRIMARY KEY
    ,person_requested_name 	VARCHAR2(70)
    ,tel_no 				VARCHAR(24)
    ,dx_number 				VARCHAR(40)
	)
ON COMMIT DELETE ROWS;

PROMPT ************************************************************************
PROMPT Created Global Temporary Table TMP_DPA_PARTIES_CACHE
PROMPT ************************************************************************

SPOOL OFF

