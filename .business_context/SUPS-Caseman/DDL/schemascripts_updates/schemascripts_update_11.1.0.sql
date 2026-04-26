/*-------------------------------------------------------------------------------
|
| FILENAME      : schemascripts_update_11.1.0.sql
|
| SYNOPSIS      : Inserts an entry of the version of the CaseMan schema into
|                 dbauser.schemascripts.  Script run as the last step in
|                 any releases to a CaseMan database, where schema changes are
|                 required.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2008 Logica plc.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Must be added as a last entry to any CaseMan Database Release
|                 build script.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:           Revision at last change
|
--------------------------------------------------------------------------------*/

PROMPT ************************************************************************
PROMPT Updating configuration history
PROMPT ************************************************************************

INSERT INTO dbauser.schemascripts
VALUES
    ((SELECT USER FROM DUAL)
    ,SYSDATE
    ,'CaseMan Schema'
    ,'11.1.0'
    );

COMMIT;

PROMPT ************************************************************************
PROMPT Configuration history updated
PROMPT ************************************************************************
