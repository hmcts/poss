/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :  Select the a date timestamp for use in filenames 
|
| $Author: :       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2011 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      :
|
|---------------------------------------------------------------------------------
|
| $Rev:            Revision of last commit
| $Date:           Date of last commit
| $Id:
|
--------------------------------------------------------------------------------*/
WHENEVER SQLERROR EXIT 1
WHENEVER OSERROR EXIT 2
SET NEWPAGE 0
SET SPACE 0
SET PAGESIZE 0
SET ECHO OFF
SET FEEDBACK OFF
SET VERIFY OFF
SET HEADING OFF
SET MARKUP HTML OFF SPOOL OFF
SET TERMOUT OFF
select to_char(sysdate,'yyyyMMddHH24MISS') from dual;