WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script updates the ENFORCEMENT_LETTERS table to specify the
|				  use of letter codes A, B and C for years 2012, 2013 and 2014 
|				  respectively.
|
| $Author:$       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4572_a.log

PROMPT ************************************************************************
PROMPT Update ENFORCEMENT_LETTERS table
PROMPT ************************************************************************

UPDATE 	enforcement_letters
SET		year_value = '2012'
WHERE	letter = 'A';

UPDATE 	enforcement_letters
SET		year_value = '2013'
WHERE	letter = 'B';

UPDATE 	enforcement_letters
SET		year_value = '2014'
WHERE	letter = 'C';
	 
PROMPT ************************************************************************
PROMPT Updated table ENFORCEMENT_LETTERS
PROMPT ************************************************************************

COMMIT;

SPOOL OFF