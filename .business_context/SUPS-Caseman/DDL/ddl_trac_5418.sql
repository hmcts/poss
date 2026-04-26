WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script adds 4 new mediation columns to the  
|                   CASE_PARTY_ROLES table.
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. Logica's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$   Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_5418.log
 
PROMPT ************************************************************************
PROMPT adding mediation columns to CASE_PARTY_ROLES table
PROMPT ************************************************************************ 

ALTER TABLE case_party_roles
ADD
(mediation_name			VARCHAR2(70)
,mediation_tel_no		VARCHAR2(24)
,mediation_email		VARCHAR2(254)
,mediation_availability	VARCHAR2(2000)
,mediation_notes		VARCHAR2(2000));

SPOOL OFF