/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :  Initial insert of data to the table. Status should always be 0
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
SET TERMOUT OFF
var CourtCode varchar2(3);
var FileName varchar2(35);
var StatusCode number;

exec :CourtCode := '&1';
exec :FileName := '&2';
exec :StatusCode := '&3';

Insert into BMS_BATCH_RECONCILIATION values(:CourtCode, :FileName,:StatusCode);
Commit;
