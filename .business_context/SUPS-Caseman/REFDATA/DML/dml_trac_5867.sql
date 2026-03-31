WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      :  Populates the table TMP_RTL_CHARACTER_MAP
|
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

SPOOL dml_trac_5867.log

PROMPT ************************************************************************
PROMPT Populating the TMP_RTL_CHARACTER_MAP table
PROMPT ************************************************************************

INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844051,'-');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (49837,'-');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844057,'''');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844056,'''');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844060,'"');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844061,'"');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14845061,'C/O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (15707265,'FI');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (192,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (193,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (194,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (196,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50048,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50049,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50050,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50051,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50052,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50308,'A');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50080,'a');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50316,'C');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50055,'C');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50310,'C');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (200,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (201,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (202,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (203,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50056,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50057,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50058,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50059,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50326,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50328,'E');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (204,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (205,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (206,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (207,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50060,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50061,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50062,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50063,'I');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50561,'L');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50563,'N');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50065,'N');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (210,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (211,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (212,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (214,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50066,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50067,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50068,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50070,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50072,'O');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50592,'S');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50079,'SS');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (217,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (218,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (219,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (220,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50602,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50073,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50074,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50075,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50076,'U');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (372,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (7808,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (7810,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (7812,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50612,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14793344,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14793346,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14793348,'W');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (221,'Y');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (374,'Y');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (376,'Y');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (7922,'Y');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50077,'Y');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50614,'Y');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (50616,'Y');
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14793650,'Y');

-- Characters that should be removed so insert NULL in replacement_char
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (15711167, NULL);
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (49824, NULL);
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (49840, NULL);
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844046, NULL);
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844072, NULL);
INSERT INTO tmp_rtl_character_map (ascii_code, replacement_char)
VALUES (14844070, NULL);

COMMIT;

PROMPT ************************************************************************
PROMPT data created
PROMPT ************************************************************************

SPOOL OFF