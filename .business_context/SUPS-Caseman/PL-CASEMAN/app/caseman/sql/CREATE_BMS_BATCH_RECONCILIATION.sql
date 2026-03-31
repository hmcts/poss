/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :       Create BMS_BATCH_RECONCILIATION table. A BMS_BATCH_RECONCILIATION row represents a BMS BATCH REPORT for a court and records the court, filname  |                       and status of the file. 
|                       File Status 0 - No Report Generated. Initial state of report.
|                       File Status 1 - No Report Generated. SQL Exception.
|                       File Status 2 - File Generated.
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

create table BMS_BATCH_RECONCILIATION (
    COURT_CODE VARCHAR2(3) PRIMARY KEY,
    FILENAME VARCHAR2(35),
    STATUS_CODE NUMBER NOT NULL
);



