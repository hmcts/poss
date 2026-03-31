WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Additional of new ENFORCEMENT_PARENT column on Payments table
|
|
| $Author$:       Chris Vincent
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Script is made up of table alteration, population of new column
|				  using temporary table and creation of index.  Audit trigger on
|				  Payments table will need to be recreated to include the new column.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          06 July 2009
| $Date$:         06 July 2009
| $Id$         	  1
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_891.log

PROMPT ************************************************************************
PROMPT Alter Table PAYMENTS
PROMPT ************************************************************************

CREATE TABLE payments
ADD enforcement_parent VARCHAR2(8);

PROMPT ************************************************************************
PROMPT Table PAYMENTS altered
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Temporary Table to populate new column
PROMPT ************************************************************************

CREATE TABLE temp_enforcement_parent
AS
(SELECT p.transaction_number, p.admin_court_code, p.subject_no AS "ENFORCEMENT_PARENT" 
FROM payments p
WHERE p.payment_for = 'CASE')
UNION
(SELECT p.transaction_number, p.admin_court_code, p.subject_no AS "ENFORCEMENT_PARENT" 
FROM payments p
WHERE p.payment_for IN ('CO','AO/CAEO'))
UNION
(SELECT p.transaction_number, p.admin_court_code, ae.case_number AS "ENFORCEMENT_PARENT" 
FROM payments p, ae_applications ae
WHERE p.payment_for = 'AE'
AND ae.ae_number = p.subject_no)
UNION
(SELECT p.transaction_number, p.admin_court_code, w.case_number AS "ENFORCEMENT_PARENT" 
FROM payments p, warrants w
WHERE p.payment_for = 'HOME WARRANT'
AND w.warrant_number = p.subject_no
AND w.local_warrant_number IS NULL
AND w.co_number IS NULL
AND w.issued_by = p.enforcement_court_code)
UNION
(SELECT p.transaction_number, p.admin_court_code, w.co_number AS "ENFORCEMENT_PARENT" 
FROM payments p, warrants w
WHERE p.payment_for = 'HOME WARRANT'
AND w.warrant_number = p.subject_no
AND w.local_warrant_number IS NULL
AND w.case_number IS NULL
AND w.issued_by = p.enforcement_court_code)
UNION
(SELECT p.transaction_number, p.admin_court_code, w.case_number AS "ENFORCEMENT_PARENT" 
FROM payments p, warrants w
WHERE p.payment_for = 'FOREIGN WARRANT'
AND w.local_warrant_number = p.subject_no
AND w.co_number IS NULL
AND w.currently_owned_by = p.enforcement_court_code)
UNION
(SELECT p.transaction_number, p.admin_court_code, w.co_number AS "ENFORCEMENT_PARENT" 
FROM payments p, warrants w
WHERE p.payment_for = 'FOREIGN WARRANT'
AND w.local_warrant_number = p.subject_no
AND w.case_number IS NULL
AND w.currently_owned_by = p.enforcement_court_code);

PROMPT ************************************************************************
PROMPT Temporary Table created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Populate new ENFORCEMENT_PARENT column using temporary table
PROMPT ************************************************************************

UPDATE payments p
SET p.enforcement_parent = 
(SELECT t.enforcement_parent FROM temp_enforcement_parent t
WHERE t.transaction_number = p.transaction_number
AND t.admin_court_code = p.admin_court_code);

PROMPT ************************************************************************
PROMPT New column populated
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Create Function Index PAYMENTS_FX1 on Table PAYMENTS
PROMPT ************************************************************************

CREATE INDEX payments_fx1 ON payments
(
	NVL( enforcement_parent, ‘NOPARENT’ )
);

PROMPT ************************************************************************
PROMPT Function Index PAYMENTS_FX1 on Table PAYMENTS created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Drop temporary table
PROMPT ************************************************************************

DROP TABLE temp_enforcement_parent;

PROMPT ************************************************************************
PROMPT temporary table dropped
PROMPT ************************************************************************

SPOOL OFF


