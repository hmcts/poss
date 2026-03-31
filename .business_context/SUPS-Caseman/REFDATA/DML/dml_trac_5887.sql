WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      :  Reference Data changes supporting the Window for Trial
|				   PolarLake replacement
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2015 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Indexes to improve the document cleardown process
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5887.log

prompt ************************************************************************
prompt Create the SYSTEM_DATA reference data
prompt ************************************************************************

INSERT INTO system_data (item, item_value, admin_court_code)
VALUES ('WFT_DOC_RETENTION', 30, 0);

PROMPT ************************************************************************
PROMPT data created
PROMPT ************************************************************************

prompt ************************************************************************
prompt Populate the new column on the COURTS table
prompt ************************************************************************

CALL SYS.SET_SUPS_APP_CTX('support','0','refdata release');

UPDATE courts SET dm_court_code = 140 WHERE code = 140;	-- Bow export to Bow
UPDATE courts SET dm_court_code = 141 WHERE code = 141;	-- Bradford export to Bradford
UPDATE courts SET dm_court_code = 141 WHERE code = 228;	-- Huddersfield export to Bradford
UPDATE courts SET dm_court_code = 150 WHERE code = 150;	-- Brighton export to Brighton
UPDATE courts SET dm_court_code = 151 WHERE code = 151;	-- Bristol export to Bristol
UPDATE courts SET dm_court_code = 151 WHERE code = 203;	-- Gloucester and Cheltenham export to Bristol
UPDATE courts SET dm_court_code = 151 WHERE code = 347;	-- Taunton export to Bristol
UPDATE courts SET dm_court_code = 162 WHERE code = 162;	-- Cambridge export to Cambridge
UPDATE courts SET dm_court_code = 163 WHERE code = 163;	-- Canterbury export to Canterbury
UPDATE courts SET dm_court_code = 164 WHERE code = 164;	-- Cardiff export to Cardiff
UPDATE courts SET dm_court_code = 170 WHERE code = 170;	-- Chester export to Chester
UPDATE courts SET dm_court_code = 372 WHERE code = 372;	-- Central London export to Central London
UPDATE courts SET dm_court_code = 176 WHERE code = 176;	-- Colchester export to Colchester
UPDATE courts SET dm_court_code = 182 WHERE code = 182;	-- Croydon export to Croydon
UPDATE courts SET dm_court_code = 338 WHERE code = 338;	-- Stoke on Trent export to Stoke on Trent
UPDATE courts SET dm_court_code = 338 WHERE code = 364;	-- Telford export to Stoke on Trent
UPDATE courts SET dm_court_code = 338 WHERE code = 380;	-- Worcester export to Stoke on Trent
UPDATE courts SET dm_court_code = 211 WHERE code = 211;	-- Guildford export to Guildford
UPDATE courts SET dm_court_code = 258 WHERE code = 258;	-- Luton export to Luton
UPDATE courts SET dm_court_code = 262 WHERE code = 288;	-- Oldham export to Manchester
UPDATE courts SET dm_court_code = 262 WHERE code = 262;	-- Manchester export to Manchester
UPDATE courts SET dm_court_code = 266 WHERE code = 266;	-- Mayors & City of London export to Mayors & City of London
UPDATE courts SET dm_court_code = 278 WHERE code = 278;	-- Newcastle export to Newcastle
UPDATE courts SET dm_court_code = 285 WHERE code = 285;	-- Norwich export to Norwich
UPDATE courts SET dm_court_code = 286 WHERE code = 185;	-- Derby export to Nottingham
UPDATE courts SET dm_court_code = 286 WHERE code = 286;	-- Nottingham export to Nottingham
UPDATE courts SET dm_court_code = 291 WHERE code = 291;	-- Oxford export to Oxford
UPDATE courts SET dm_court_code = 303 WHERE code = 131;	-- Blackpool export to Preston
UPDATE courts SET dm_court_code = 303 WHERE code = 154;	-- Burnley export to Preston
UPDATE courts SET dm_court_code = 303 WHERE code = 165;	-- Carlisle export to Preston
UPDATE courts SET dm_court_code = 303 WHERE code = 242;	-- Lancaster export to Preston
UPDATE courts SET dm_court_code = 303 WHERE code = 303;	-- Preston export to Preston
UPDATE courts SET dm_court_code = 243 WHERE code = 243;	-- Leeds export to Leeds
UPDATE courts SET dm_court_code = 243 WHERE code = 386;	-- York export to Leeds
UPDATE courts SET dm_court_code = 320 WHERE code = 187;	-- Doncaster export to Sheffield
UPDATE courts SET dm_court_code = 320 WHERE code = 320;	-- Sheffield export to Sheffield
UPDATE courts SET dm_court_code = 328 WHERE code = 139;	-- Bournemouth and Poole export to Southampton
UPDATE courts SET dm_court_code = 328 WHERE code = 302;	-- Portsmouth export to Southampton
UPDATE courts SET dm_court_code = 328 WHERE code = 328;	-- Southampton export to Southampton
UPDATE courts SET dm_court_code = 328 WHERE code = 345;	-- Swindon export to Southampton
UPDATE courts SET dm_court_code = 328 WHERE code = 376;	-- Winchester export to Southampton
UPDATE courts SET dm_court_code = 344 WHERE code = 344;	-- Swansea export to Swansea
UPDATE courts SET dm_court_code = 270 WHERE code = 270;	-- Middlesbrough export to Middlesbrough
UPDATE courts SET dm_court_code = 359 WHERE code = 359;	-- Wandsworth export to Wandsworth
UPDATE courts SET dm_court_code = 115 WHERE code = 115;	-- Central Family Court export to Central Family Court
UPDATE courts SET dm_court_code = 127 WHERE code = 180;	-- Coventry export to Birmingham
UPDATE courts SET dm_court_code = 127 WHERE code = 358;	-- Walsall export to Birmingham
UPDATE courts SET dm_court_code = 249 WHERE code = 249;	-- Lincoln export to Lincoln
UPDATE courts SET dm_court_code = 282 WHERE code = 244;	-- Leicester export to Northampton
UPDATE courts SET dm_court_code = 282 WHERE code = 282;	-- Northampton export to Northampton
UPDATE courts SET dm_court_code = 198 WHERE code = 198;	-- Exeter export to Exeter
UPDATE courts SET dm_court_code = 198 WHERE code = 296;	-- Plymouth export to Exeter
UPDATE courts SET dm_court_code = 198 WHERE code = 354;	-- Truro export to Exeter
UPDATE courts SET dm_court_code = 329 WHERE code = 329;	-- Southend export to Southend
UPDATE courts SET dm_court_code = 239 WHERE code = 239;	-- Kingston Upon Hull export to Kingston Upon Hull
UPDATE courts SET dm_court_code = 251 WHERE code = 251;	-- Liverpool export to Liverpool
UPDATE courts SET dm_court_code = 305 WHERE code = 305;	-- Reading export to Reading
UPDATE courts SET dm_court_code = 127 WHERE code = 127;	-- Birmingham export to Birmingham
UPDATE courts SET dm_court_code = 271 WHERE code = 271;	-- Mold export to Mold
UPDATE courts SET dm_court_code = 368 WHERE code = 368;	-- Hammersmith export to Hammersmith

COMMIT;

PROMPT ************************************************************************
PROMPT data set up
PROMPT ************************************************************************

SPOOL OFF