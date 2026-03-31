WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script provides all the reference data updates required for
|				  the the case numbering changes. 
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

SPOOL dml_trac_4908.log

CALL sys.set_sups_app_ctx('support','0','case numbering');

PROMPT ************************************************************************
PROMPT Insert indicator of new numbering start date in SYSTEM_DATA table
PROMPT ************************************************************************

INSERT INTO system_data
	(item
	,item_value
	,item_value_currency
	,admin_court_code)
VALUES
	('NEW_NUMBERING_LIVE_DATE'
	,20140101
	,NULL
	,0);

PROMPT ************************************************************************
PROMPT Insert global REISSUE item in SYSTEM_DATA table
PROMPT ************************************************************************
	
INSERT INTO system_data
	(item
	,item_value
	,item_value_currency
	,admin_court_code)
VALUES
	('REISSUE'
	,1
	,NULL
	,0);
	
PROMPT ************************************************************************
PROMPT insert new enforcment letters into the ENFORCEMENT_LETTERS table
PROMPT ************************************************************************

INSERT INTO enforcement_letters
	(year_value
	,letter)
VALUES
	('2015'
	,'F');

INSERT INTO enforcement_letters
	(year_value
	,letter)
VALUES
	('2016'
	,'J');
	
INSERT INTO enforcement_letters
	(year_value
	,letter)
VALUES
	('2017'
	,'L');
	
INSERT INTO enforcement_letters
	(year_value
	,letter)
VALUES
	('2018'
	,'U');

COMMIT;

/

SPOOL OFF