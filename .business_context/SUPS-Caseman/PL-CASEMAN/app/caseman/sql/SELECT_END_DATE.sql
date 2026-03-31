/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :  Select the date of Sunday for the accounting week. Select day of week (Monday = 1, Sunday = 7) find modulus 7 (so if today was actually Sunday you would get 0) and minus that many days from the sysdate. 
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
SET ECHO OFF
SET FEEDBACK OFF
SET VERIFY OFF
SET HEADING OFF
SET MARKUP HTML OFF SPOOL OFF
SET TERMOUT OFF
select to_char(sysdate-(select mod(to_char(sysdate,'D'),7) from dual),'yyyy-MM-dd') from dual;