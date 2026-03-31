WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/ddl_trac_5721.sql $  
|
| SYNOPSIS      :   This script adds a new AMOUNT_ALLOWED_EDITABLE column to the PER_DETAILS table
|
| $Author: grewalg $         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2015 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. CGI's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision: 12189 $   Revision of last commit
| $Date: 2015-12-16 15:42:57 +0000 (Wed, 16 Dec 2015) $       Date of last commit
| $Id: ddl_trac_5721.sql 12189 2015-12-16 15:42:57Z grewalg $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_5721.log

PROMPT ************************************************************************
PROMPT Adds a new AMOUNT_ALLOWED_EDITABLE column to the PER_DETAILS table
PROMPT ************************************************************************ 

ALTER TABLE
   per_details
ADD
   amount_allowed_editable  VARCHAR2(1) DEFAULT 'Y' NOT NULL;

SPOOL OFF