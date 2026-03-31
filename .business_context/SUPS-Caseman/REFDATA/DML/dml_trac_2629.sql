WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_2629.sql $:
|
| SYNOPSIS      : Updates the COURTS table to provide Welsh Court names for specific
|		        Welsh courts.
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
| COMMENTS      : This data will be used as reference data.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_2629.log

PROMPT ************************************************************************
PROMPT Update table COURTS to include Welsh Court names
PROMPT ************************************************************************

CALL sys.set_sups_app_ctx('support','282','trac 2629');

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH ABERDÂR',
		welsh_county_court_name = 'LLYS SIROL ABERDÂR'
WHERE	code = 101;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH ABERYSTWYTH',
		welsh_county_court_name = 'LLYS SIROL ABERYSTWYTH'
WHERE	code = 102;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH COED-DUON',
		welsh_county_court_name = 'LLYS SIROL COED-DUON'
WHERE	code = 132;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH BYRCHEINIOG',
		welsh_county_court_name = 'LLYS SIROL BYRCHEINIOG'
WHERE	code = 143;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH PEN-Y-BONT AR OGWR',
		welsh_county_court_name = 'LLYS SIROL PEN-Y-BONT AR OGWR'
WHERE	code = 146;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CAERNARFON',
		welsh_county_court_name = 'LLYS SIROL CAERNARFON'
WHERE	code = 159;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CAERDYDD',
		welsh_county_court_name = 'LLYS SIROL CAERDYDD'
WHERE	code = 164;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CAERFYRDDIN',
		welsh_county_court_name = 'LLYS SIROL CAERFYRDDIN'
WHERE	code = 166;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CAER',
		welsh_county_court_name = 'LLYS SIROL CAER'
WHERE	code = 170;

SET ESCAPE ON
UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CONWY \& CHOLWYN',
		welsh_county_court_name = 'LLYS SIROL CONWY \& CHOLWYN'
WHERE	code = 178;
SET ESCAPE OFF

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CREWE',
		welsh_county_court_name = 'LLYS SIROL CREWE'
WHERE	code = 181;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH HWLFFORDD',
		welsh_county_court_name = 'LLYS SIROL HWLFFORDD'
WHERE	code = 217;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH LLANELLI',
		welsh_county_court_name = 'LLYS SIROL LLANELLI'
WHERE	code = 253;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH LLANGEFNI',
		welsh_county_court_name = 'LLYS SIROL LLANGEFNI'
WHERE	code = 254;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH MACCLESFIELD',
		welsh_county_court_name = 'LLYS SIROL MACCLESFIELD'
WHERE	code = 260;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH MERTHYR TUDFUL',
		welsh_county_court_name = 'LLYS SIROL MERTHYR TUDFUL'
WHERE	code = 269;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH YR WYDDGRUG',
		welsh_county_court_name = 'LLYS SIROL YR WYDDGRUG'
WHERE	code = 271;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CASTELL-NEDD A PHORT TALBOT',
		welsh_county_court_name = 'LLYS SIROL CASTELL-NEDD A PHORT TALBOT'
WHERE	code = 274;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH CASNEWYDD',
		welsh_county_court_name = 'LLYS SIROL CASNEWYDD'
WHERE	code = 280;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH PONT-Y-PWL',
		welsh_county_court_name = 'LLYS SIROL PONT-Y-PWL'
WHERE	code = 298;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH PONTYPRIDD',
		welsh_county_court_name = 'LLYS SIROL PONTYPRIDD'
WHERE	code = 299;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH Y RHYL',
		welsh_county_court_name = 'LLYS SIROL Y RHYL'
WHERE	code = 308;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH ABERTAWE',
		welsh_county_court_name = 'LLYS SIROL ABERTAWE'
WHERE	code = 344;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH Y TRALLWNG A' || '''' || 'R DRENEWYDD',
		welsh_county_court_name = 'LLYS SIROL Y TRALLWNG A' || '''' || 'R DRENEWYDD'
WHERE	code = 366;

UPDATE 	courts
SET 	welsh_high_court_name = 'COFRESTRFA DDOSBARTH WRECSAM',
		welsh_county_court_name = 'LLYS SIROL WRECSAM'
WHERE	code = 384;

PROMPT ************************************************************************
PROMPT Updated table COURTS
PROMPT ************************************************************************

COMMIT;

SPOOL OFF

EXIT