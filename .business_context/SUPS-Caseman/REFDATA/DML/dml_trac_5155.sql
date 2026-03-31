WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_5014_a.sql $:
|
| SYNOPSIS      : Reference data updates for the Single Court release
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2013 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
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

SPOOL dml_trac_5155.log

PROMPT ************************************************************************
PROMPT Update table COURTS to include Welsh Court names
PROMPT ************************************************************************

CALL sys.set_sups_app_ctx('support','0','trac 5155');

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: ABERYSTWYTH'
WHERE	code = 102;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: COED DUON'
WHERE	code = 132;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: BRYCHEINIOG'
WHERE	code = 143;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: PEN-Y-BONT AR OGWR'
WHERE	code = 146;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: CAERNARFON'
WHERE	code = 159;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: CAERDYDD'
WHERE	code = 164;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: CAERFYRDDIN'
WHERE	code = 166;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: CONWY A CHOLWYN'
WHERE	code = 178;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: HWLFFORDD'
WHERE	code = 217;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: LLANELLI'
WHERE	code = 253;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: LLANGEFNI'
WHERE	code = 254;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: MERTHYR TUDFUL'
WHERE	code = 269;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: YR WYDDGRUG'
WHERE	code = 271;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: CASTELL-NEDD A PHORT TALBOT'
WHERE	code = 274;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: CASNEWYDD'
WHERE	code = 280;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: PONTYPRIDD'
WHERE	code = 299;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: Y RHYL'
WHERE	code = 308;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: ABERTAWE'
WHERE	code = 344;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: Y TRALLWNG A' || '''' || 'R DRENEWYDD'
WHERE	code = 366;

UPDATE 	courts
SET 	welsh_county_court_name = 'Y LLYS SIROL YN: WRECSAM'
WHERE	code = 384;

PROMPT ************************************************************************
PROMPT Updated table COURTS
PROMPT ************************************************************************

COMMIT;

SPOOL OFF