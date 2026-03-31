WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds new columns to the COURTS and PERSONALISE table
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_4718.log

PROMPT ************************************************************************
PROMPT Alter Table COURTS
PROMPT ************************************************************************

ALTER TABLE courts
ADD dr_tel_no VARCHAR2(24);

COMMENT ON COLUMN courts.dr_tel_no
   IS 'Holds the District Registry telephone number for the court';

PROMPT ************************************************************************
PROMPT COURTS Table altered
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Alter Table PERSONALISE
PROMPT ************************************************************************

ALTER TABLE personalise
ADD 
(
	dr_open_from NUMBER(5)
	,dr_closed_at NUMBER(5)
	,by_appointment_ind VARCHAR2(1)
);

COMMENT ON COLUMN personalise.dr_open_from
   IS 'Holds the District Registry opening time (seconds after midnight) for the court';
   
COMMENT ON COLUMN personalise.dr_closed_at
   IS 'Holds the District Registry closing time (seconds after midnight) for the court';
   
COMMENT ON COLUMN personalise.by_appointment_ind
   IS 'Holds the open by appointment indicator for the court';

PROMPT ************************************************************************
PROMPT PERSONALISE Table altered
PROMPT ************************************************************************


SPOOL OFF
