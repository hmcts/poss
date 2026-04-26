WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Schema changes required for CCBC SDT including new columns to
|				  the MCOL_DATA table.
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

SPOOL ddl_trac_4997.log

PROMPT ************************************************************************
PROMPT Alter Table MCOL_DATA
PROMPT ************************************************************************

ALTER TABLE
	mcol_data
ADD
	(
		previous_creditor NUMBER(4),
		new_creditor NUMBER(4),
		judgment_type VARCHAR2(16),
		joint_judgment VARCHAR2(1),
		total NUMBER(*,2),
		instalment_amount NUMBER(*,2),
		frequency VARCHAR2(3),
		first_payment_date DATE
	);

PROMPT ************************************************************************
PROMPT MCOL_DATA Table altered
PROMPT ************************************************************************

SPOOL OFF
EXIT
