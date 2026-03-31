WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script adds a new MCOL_REFERENCE column to the MCOL_DATA, 
|                   LOAD_JUDGMENTS and JUDGMENTS tables.
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. CGI's prior written consent is
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

SPOOL ddl_trac_5435.log
 
PROMPT ************************************************************************
PROMPT adding MCOL_REFERENCE and JUDGMENT_REFERENCE columns to MCOL_DATA table
PROMPT ************************************************************************ 

ALTER TABLE mcol_data
ADD
(
	mcol_reference VARCHAR2(12)
,	judgment_reference VARCHAR2(12)
);

PROMPT ************************************************************************
PROMPT adding DOCUMENT_ID column to LOAD_JUDGMENTS table
PROMPT ************************************************************************ 

ALTER TABLE load_judgments
ADD
(mcol_reference VARCHAR2(12));

PROMPT ************************************************************************
PROMPT adding MCOL_DOCUMENT_ID column to JUDGMENTS table
PROMPT ************************************************************************ 

ALTER TABLE judgments
ADD
(mcol_judg_ref VARCHAR2(12));

SPOOL OFF