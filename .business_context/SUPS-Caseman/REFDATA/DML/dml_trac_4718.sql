WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      : This script populates the new COURTS and PERSONALISE table 
|				  columns with the correct details for live.
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

SPOOL dml_trac_4718.log

	-- Set audit context
CALL sys.set_sups_app_ctx('support','0','update courts');

PROMPT ************************************************************************
PROMPT Update table PERSONALISE to populate the new columns
PROMPT ************************************************************************
	
-- Populate the new Personalise table columns with default values
UPDATE personalise p
SET p.dr_open_from = p.open_from
	,p.dr_closed_at = p.closed_at
	,p.by_appointment_ind = 'N';
	
-- Updating specific courts highlighted by business that will be open by appointment:
-- Bow (140), Clerkenwell and Shoreditch (321), Willesden (375), Telford (364), Bradford (141), Doncaster (187), Blackpool (131), 
-- Stockport (336), West Cumbria (373), Hastings (216), King's Lynn (238), Oxford (291), Newport (IOW) (279), Weston-Super-Mare (370)
-- and Newport (280)
UPDATE personalise p
SET p.by_appointment_ind = 'Y'
WHERE p.crt_code IN (140,321,375,364,141,187,131,336,373,216,238,291,279,370,280);

-- Updating specific District Registry opening hours for specific courts highlighted by the business:
-- Birmingham (127), Bristol (151), Cardiff (164), Liverpool (251), Leeds (243), Newcastle (278) and Manchester (262)
UPDATE personalise p
SET p.dr_open_from = 36000
	,p.dr_closed_at = 57600
WHERE p.crt_code IN (127,151,164,251,243,278,262);

PROMPT ************************************************************************
PROMPT Update table COURTS to populate the new columns
PROMPT ************************************************************************
	
-- Populate the new Courts table telephone number column with the same value as the tel_no column
UPDATE courts c
SET c.dr_tel_no = c.tel_no;

-- Updating Birmingham's (127) DR Telephone Number which was specifically highlighted by the business for change.
UPDATE courts c
SET c.dr_tel_no = '0121 681 4441'
WHERE c.code = 127;

COMMIT;

SPOOL OFF