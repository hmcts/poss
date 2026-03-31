/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :  Create table to hold temporary parameters
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
-- Create table
create global temporary table TMP_BMS_STATS_PARAMETERS
(
  START_DATE DATE,
  END_DATE   DATE,
  COURT_ID   NUMBER(3)
)
on commit delete rows;