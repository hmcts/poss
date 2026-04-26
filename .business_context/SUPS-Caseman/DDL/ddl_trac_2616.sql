WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Common/database/Coding Templates/SUPS Oracle ddl template.sql $:
|
| SYNOPSIS      : Remove the appropriate DDL commands where necessary.
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
| COMMENTS      :
|
|---------------------------------------------------------------------------------
|
| $Rev: 3341 $:          Revision of last commit
| $Date: 2009-07-14 14:57:47 +0100 (Tue, 14 Jul 2009) $:         Date of last commit
| $Id: SUPS Oracle ddl template.sql 3341 2009-07-14 13:57:47Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_2616.log

PROMPT ************************************************************************
PROMPT Create Table obligations_purge_errors
PROMPT ************************************************************************
CREATE TABLE obligations_purge_errors
    (obligation_seq     NUMBER
    ,description        VARCHAR2(500 CHAR)
    ,error_date         DATE
    )
ROWDEPENDENCIES;



SPOOL OFF

