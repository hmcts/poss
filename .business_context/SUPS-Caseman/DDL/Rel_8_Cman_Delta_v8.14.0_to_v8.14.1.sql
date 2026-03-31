WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| FILENAME      : Rel_8_Cman_Delta_v8.14.0_to_v8.14.1.sql
|
| SYNOPSIS      : A caddy to apply Scalability changes to the CaseMan database
|
|
| $Author: barisa $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica plc.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Scripts MissingFKIndexes.sql, SODIndexes.sql, ddl_trac_178.sql and 
|                 cr_aud_user_role.sql must reside in the same directory as this script.
|
|---------------------------------------------------------------------------------
|
| $Rev: 1492 $:          Revision of last commit
| $Date: 2009-01-28 19:01:16 +0000 (Wed, 28 Jan 2009) $:         Date of last commit
| $Id: Rel_8_Cman_Delta_v8.14.0_to_v8.14.1.sql 1492 2009-01-28 19:01:16Z barisa $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL Rel_8_Cman_Delta_v8.14.0_to_v8.14.1.log

PROMPT ************************************************************************
PROMPT Applying Missing Foreign Key Indexes
PROMPT ************************************************************************
@MissingFKIndexes.sql

PROMPT ************************************************************************
PROMPT Applying Start Of Day Indexes
PROMPT ************************************************************************
@SODIndexes.sql


PROMPT ************************************************************************
PROMPT Applying DDL_TRAC_178.SQL
PROMPT ************************************************************************
@ddl_trac_178.sql


PROMPT ************************************************************************
PROMPT Applying Audit UserRole Trigger
PROMPT ************************************************************************
@cr_aud_user_role.sql

PROMPT ************************************************************************
PROMPT Applying functional index xmlsource_numcheck_fcn
PROMPT ************************************************************************
@xmlsource_numcheck_fcn.sql

PROMPT ************************************************************************
PROMPT Creating Functional Index WP_OUTPUT_FX1 on WP_OUTPUT
PROMPT ************************************************************************
CREATE INDEX wp_output_fx1 ON wp_output
(
            xmlsource_numcheck(xmlsource)  ASC
);
PROMPT ************************************************************************
PROMPT Created Functional Index WP_OUTPUT_FX1 on WP_OUTPUT
PROMPT ************************************************************************



-- update configuration history
@schemascripts_update



SPOOL OFF
