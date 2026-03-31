WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds new ENFORCEMENT_PARENT column on Payments table.
|
|                 Change is part of the Scalability enhancements to CaseMan.
|                 This new column will retain a link to the source Enforcement
|                 a payment is associated with.
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
| COMMENTS      : This script is part 1 of 2.  The sister to this script is
|                 dml_trac_891.sql which populates the new column.
|
| CHANGES	       : Chris Vincent (10/07/2009), removed the functional index
|			following testing showed it was not used.  Instead replaced
| 			with two indexes which were shown to be used by the
|			different queries that use the new column.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_891.log

PROMPT ************************************************************************
PROMPT Alter Table PAYMENTS
PROMPT ************************************************************************

ALTER TABLE payments
ADD enforcement_parent VARCHAR2(8 CHAR);

COMMENT ON COLUMN payments.enforcement_parent
   IS 'Retains a link to the source Enforcement a payment is associated with.';

PROMPT ************************************************************************
PROMPT PAYMENTS Table altered
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Index PAYMENTS_IX1 on Table PAYMENTS
PROMPT ************************************************************************

CREATE INDEX payments_ix1 ON payments
    (enforcement_parent);

PROMPT ************************************************************************
PROMPT Index PAYMENTS_IX1 on Table PAYMENTS created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Index PAYMENTS_IX2 on Table PAYMENTS
PROMPT ************************************************************************

CREATE INDEX payments_ix2 ON payments
    (passthrough
	,rd_date
	,payout_date
	,enforcement_parent
	);

PROMPT ************************************************************************
PROMPT Index PAYMENTS_IX2 on Table PAYMENTS created
PROMPT ************************************************************************

SPOOL OFF
