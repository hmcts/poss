WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      :  Creates the table TMP_RTL_CHARACTER_MAP
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

SPOOL ddl_trac_5867.log

PROMPT ************************************************************************
PROMPT Creating TMP_RTL_CHARACTER_MAP table
PROMPT ************************************************************************

BEGIN

        EXECUTE IMMEDIATE 'DROP TABLE tmp_rtl_character_map';

        EXCEPTION

        WHEN OTHERS THEN
               NULL;
END;
/

CREATE TABLE tmp_rtl_character_map
(
        ascii_code       NUMBER,
        replacement_char VARCHAR2(3),
        CONSTRAINT tmp_rtl_character_map_pk PRIMARY KEY (ascii_code)
);

COMMENT ON TABLE tmp_rtl_character_map IS 'Temporary table used for mapping invalid XML characters and their replacements';

PROMPT ************************************************************************
PROMPT table created
PROMPT ************************************************************************

SPOOL OFF