WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

ALTER SESSION ENABLE PARALLEL DML;

SPOOL dml_trac_3140.log

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Populate COURTS.WELSH_COURT_NAME field
|
|
| $Author$:       Author of last commit

| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : <add anything applicable here if necessary, eg file exposure, etc>
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:           Revision at last change
|
--------------------------------------------------------------------------------*/

PROMPT ************************************************************************
PROMPT Add Data To COURTS.WELSH_COURT_NAME
PROMPT ************************************************************************

UPDATE courts
SET welsh_court_name = 'Aberd'||chr(50082)|| 'r'
WHERE code = 101;

UPDATE courts
SET welsh_court_name = 'Aberystwyth'
WHERE code = 102;

UPDATE courts
SET welsh_court_name = 'Coed-Duon'
WHERE code = 132;

UPDATE courts
SET welsh_court_name = 'Byrcheiniog'
WHERE code = 143;

UPDATE courts
SET welsh_court_name = 'Pen-y-Bont ar Ogwr'
WHERE code = 146;

UPDATE courts
SET welsh_court_name = 'Caernarfon'
WHERE code = 159;

UPDATE courts
SET welsh_court_name = 'Caerdydd'
WHERE code = 164;

UPDATE courts
SET welsh_court_name = 'Caerfyrddin'
WHERE code = 166;

UPDATE courts
SET welsh_court_name = 'Conwy a Cholwyn'
WHERE code = 178;

UPDATE courts
SET welsh_court_name = 'Hwlffordd'
WHERE code = 217;

UPDATE courts
SET welsh_court_name = 'Llanelli'
WHERE code = 253;

UPDATE courts
SET welsh_court_name = 'Llangefni'
WHERE code = 254;

UPDATE courts
SET welsh_court_name = 'Merthyr Tudful'
WHERE code = 269;

UPDATE courts
SET welsh_court_name = 'yr Wyddgrug'
WHERE code = 271;

UPDATE courts
SET welsh_court_name = 'Castell-Nedd a Phort Talbot'
WHERE code = 274;

UPDATE courts
SET welsh_court_name = 'Casnewydd'
WHERE code = 280;

UPDATE courts
SET welsh_court_name = 'Pont-y-Pwl'
WHERE code = 298;

UPDATE courts
SET welsh_court_name = 'Pontypridd'
WHERE code = 299;

UPDATE courts
SET welsh_court_name = 'Y Rhyl'
WHERE code = 308;

UPDATE courts
SET welsh_court_name = 'Abertawe'
WHERE code = 344;

UPDATE courts
SET welsh_court_name = 'y Trallwng a''r Drenewydd'
WHERE code = 366;

UPDATE courts
SET welsh_court_name = 'Wrecsam'
WHERE code = 384;

UPDATE courts
SET welsh_court_name = 'Aberd'||chr(50082)|| 'r'
WHERE code = 401;

UPDATE courts
SET welsh_court_name = 'Ynys M'||chr(50100)|| 'n'
WHERE code = 404;

UPDATE courts
SET welsh_court_name = 'Brycheiniog'
WHERE code = 421;

UPDATE courts
SET welsh_court_name = 'Pen-y-Bont ar Ogwr'
WHERE code = 423;

UPDATE courts
SET welsh_court_name = 'Caerdydd'
WHERE code = 429;

UPDATE courts
SET welsh_court_name = 'Ceredigion'
WHERE code = 433;

UPDATE courts
SET welsh_court_name = 'Conwy'
WHERE code = 437;

UPDATE courts
SET welsh_court_name = 'Cwmbr'||chr(50082)|| 'n'
WHERE code = 441;

UPDATE courts
SET welsh_court_name = 'Sir Ddinbych'
WHERE code = 443;

UPDATE courts
SET welsh_court_name = 'Gwynedd'
WHERE code = 456;

UPDATE courts
SET welsh_court_name = 'Hwlffordd'
WHERE code = 461;

UPDATE courts
SET welsh_court_name = 'Llanelli'
WHERE code = 478;

UPDATE courts
SET welsh_court_name = 'Merthyr Tudful'
WHERE code = 486;

UPDATE courts
SET welsh_court_name = 'Castell-Nedd a Phort Talbot'
WHERE code = 488;

UPDATE courts
SET welsh_court_name = 'Pontypridd'
WHERE code = 516;

UPDATE courts
SET welsh_court_name = 'Abertawe'
WHERE code = 555;

UPDATE courts
SET welsh_court_name = 'Wrecsam'
WHERE code = 579;

UPDATE courts
SET welsh_court_name = 'Gwent'
WHERE code = 585;

COMMIT;

PROMPT ************************************************************************
PROMPT Added Data To COURTS.WELSH_COURT_NAME
PROMPT ************************************************************************

SPOOL OFF