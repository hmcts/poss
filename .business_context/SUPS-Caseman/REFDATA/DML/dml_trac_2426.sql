WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_2426.sql $:
|
| SYNOPSIS      : Updates the COURTS table to amend the PCOL court names so are all unique.
|
|
|                 All 6 PCOL courts (range 601-606) currently have the same court name (PCOL DUMMY COURT), 
|                 but if any warrants issued by a PCOL court loaded into Warrant Returns screen will crash because
|                 one of the fields selects on court name.  This script updates each PCOL court's name to have the 
|		court code in brackets after 'PCOL DUMMY COURT' so each court has a unique name.
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : This is a pre-requisite for the live CaseMan Defect #2050.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
| $Id: dml_trac_891.sql 3319 2009-07-10 09:33:12Z vincentcp $:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_2426.log

PROMPT ************************************************************************
PROMPT Update table COURTS for PCOL court name reference data change
PROMPT ************************************************************************

CALL sys.set_sups_app_ctx('support','601','trac 2426');

UPDATE courts 
SET name = name || ' (' || code || ')'
WHERE code BETWEEN 601 AND 606;

PROMPT ************************************************************************
PROMPT Updated table COURTS
PROMPT ************************************************************************

COMMIT;

SPOOL OFF

EXIT