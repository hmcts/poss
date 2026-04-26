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
| SYNOPSIS      : Drop Materialized Views V_CMAN_PARTIES and V_CMAN_PARTY_ADDRESSES.
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
| COMMENTS      : Part 2 of 2.  Script must be run after ddl_trac_1363_a.sql
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_1363_b.log

PROMPT ************************************************************************
PROMPT Drop Materialized View V_CMAN_PARTIES
PROMPT ************************************************************************

DROP MATERIALIZED VIEW v_cman_parties;

PROMPT ************************************************************************
PROMPT Dropped Materialized View V_CMAN_PARTIES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Drop Materialized View V_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

DROP MATERIALIZED VIEW v_cman_party_addresses;

PROMPT ************************************************************************
PROMPT Dropped Materialized View V_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

SPOOL OFF

