WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$   
|
| SYNOPSIS      : This script updates the SYSTEM_DATA table, specifically the court
|				  specific items AE, CO, FOREIGN, HOME and REISSUE for a new year.
|				  The values to reset the items to are stored in a temporary table
|				  as not all items should be reset to the default value of 1.
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
| AMENDMENTS	: 04/07/2013, Chris Vincent - Trac 4908
|                 Only AE and CO sequences are reset from the tmp_end_year_reset_sequences
|                 table and a global (rather than court specific) REISSUE item
|                 is now used under the new numbering scheme.
|				  09/12/2015, Chris Vincent - Trac 5719
|				  Removed AE sequences to be reset as no longer required.
|
|---------------------------------------------------------------------------------
|
| $Revision:$	Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4572_d.log

PROMPT ************************************************************************
PROMPT Update AE and CO SYSTEM_DATA sequence items for the end of year resets
PROMPT ************************************************************************

UPDATE	system_data sd
SET 	sd.item_value = 1
WHERE	sd.item = 'CO'
AND 	sd.admin_court_code IN (
			SELECT	code 
			FROM 	courts 
			WHERE 	sups_centralised_flag = 'Y' 
			AND 	caseman_inservice = 'Y'
		);
	 
PROMPT ************************************************************************
PROMPT Updated table SYSTEM_DATA
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update global REISSUE SYSTEM_DATA sequence item for the end of year resets
PROMPT ************************************************************************

UPDATE	system_data sd
SET 	sd.item_value = 1
WHERE	sd.item = 'REISSUE'
AND 	sd.admin_court_code = 0;
	 
PROMPT ************************************************************************
PROMPT Updated table SYSTEM_DATA
PROMPT ************************************************************************

COMMIT;

SPOOL OFF