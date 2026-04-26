/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :       Update the table. Status codes mean: 0 - report about to be generated, 1 - report failed while generating , 2 - Report genearted successfully
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
SET TERMOUT OFF
var FileName varchar2(35);
var StatusCode number;

exec :FileName := '&1';
exec :StatusCode := '&2';

Update BMS_BATCH_RECONCILIATION SET STATUS_CODE = :StatusCode where FILENAME = :FileName ;
Commit;
