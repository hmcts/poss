WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Common/database/Coding Templates/SUPS Oracle ddl template.sql $:
|
| SYNOPSIS      : Applies an Index on the HEARINGS Table in CaseMan schema
|                 to improve performance of a CaseMan Report.
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
| COMMENTS      : Script must be run from SQL*Plus against the CaseMan schema
|                 as the CaseMan User.
|
|                 A log file is produced in the same directory where this script
|                 is located in the Linux File System.
|
|---------------------------------------------------------------------------------
|
|---------------------------------------------------------------------------------
|
| $Rev: 3341 $:          Revision of last commit
| $Date: 2009-07-14 14:57:47 +0100 (Tue, 14 Jul 2009) $:         Date of last commit
| $Id: SUPS Oracle ddl template.sql 3341 2009-07-14 13:57:47Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_2821.log

PROMPT ************************************************************************
PROMPT Create Index HEARINGS_FX1 on Table HEARINGS
PROMPT ************************************************************************

CREATE INDEX hearings_fx1 ON hearings
        (hrg_type
        ,TRUNC(hrg_date)
        ,hrg_outcome
        );
	
PROMPT ************************************************************************
PROMPT Index HEARINGS_FX1 on Table HEARINGS created
PROMPT ************************************************************************

SPOOL OFF

EXIT

