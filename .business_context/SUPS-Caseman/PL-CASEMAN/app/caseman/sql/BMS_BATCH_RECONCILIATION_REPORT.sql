/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :       Produce BMS_BATCH_RECONCILIATION report
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
SET LINESIZE 140
SET PAGESIZE 0
SET ECHO OFF
SET FEEDBACK OFF
SET VERIFY OFF
SET HEADING OFF
SET MARKUP HTML OFF SPOOL OFF
SET TERMOUT OFF
SET COLSEP ,

REPHEADER OFF

column FILENAME format a32
column COURTS format a20
column FILES format a20

var fileName varchar2(30);

exec :fileName := '&1'


SPOOL &1
SELECT 
'LIVE COURTS '||courts.courtcount as COURTS, 'FILE COUNT '||files.filecount as FILES
from
(Select count(*) as courtcount FROM BMS_BATCH_RECONCILIATION) courts ,
(Select count(*) as filecount FROM BMS_BATCH_RECONCILIATION WHERE STATUS_CODE = '2') files;

Select FILENAME from BMS_BATCH_RECONCILIATION order by COURT_CODE;

SPOOL off
