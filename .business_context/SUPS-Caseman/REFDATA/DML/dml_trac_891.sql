WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_891.sql $:
|
| SYNOPSIS      : Populates the ENFORCEMENT_PARENT column in the Payments table.
|
|                 This script creates a temporary table (TMP_ENFORCEMENT_PARENT)
|                 to obtain the Primary Key values from all the various Enforcement types
|                 held in the CaseMan schema.  (An Enforcement type is a Case,
|                 an Attachment of Earning, a Consolidated Order or a Warrant.)
|
|                 Once the temporary table is populated, work starts on
|                 updating the PAYMENTS.ENFORCEMENT_PARENT column with the value
|                 set in TMP_ENFORCEMENT_PARENT.ENFORCEMENT_PARENT.
|
|                 Once the update is complete the temporary table is removed.
|
|                 Change is part of the Scalability enhancements to CaseMan.
|                 This new column will retain a link to the source Enforcement
|                 a payment is associated with.
|
|                 This script is implemented in a manner that allows it to be
|                 run repeatedly as a Post migration activity for CaseMan NRO,
|                 when more Legacy courts become SUPS-idised!
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2009 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : This script is part 2 of 2.
|                 Inorder to run this script, script ddl_trac_891.sql must have been
|                 executed against the CaseMan schema.
|
| CHANGES		: Chris Vincent (10/07/2009) Update statement was non performant so
|				  added index to temporary table and amended the update statement.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
| $Id: dml_trac_891.sql 3319 2009-07-10 09:33:12Z vincentcp $:           Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_891.log

PROMPT ************************************************************************
PROMPT Remove traces of the last time this script was run
PROMPT ************************************************************************

BEGIN

    EXECUTE IMMEDIATE 'DROP TABLE tmp_enforcement_parent PURGE';

EXCEPTION

    WHEN OTHERS THEN
        NULL; -- suppress errors

END;
/

PROMPT ************************************************************************
PROMPT Create Temporary Table to populate new column
PROMPT ************************************************************************

CREATE TABLE tmp_enforcement_parent
AS
(SELECT p.transaction_number
       ,p.admin_court_code
       ,p.subject_no            enforcement_parent
 FROM   payments p
 WHERE  p.payment_for = 'CASE')
UNION
(SELECT p.transaction_number
       ,p.admin_court_code
       ,p.subject_no            enforcement_parent
 FROM   payments p
 WHERE  p.payment_for IN ('CO', 'AO/CAEO'))
UNION
(SELECT p.transaction_number
       ,p.admin_court_code
       ,ae.case_number          enforcement_parent
 FROM   payments p
       ,ae_applications ae
 WHERE  p.payment_for = 'AE'
 AND    ae.ae_number = p.subject_no)
UNION
(SELECT p.transaction_number
       ,p.admin_court_code
       ,w.case_number           enforcement_parent
 FROM   payments p
       ,warrants w
 WHERE  p.payment_for = 'HOME WARRANT'
 AND    w.warrant_number = p.subject_no
 AND    w.local_warrant_number IS NULL
 AND    w.co_number IS NULL
 AND    w.issued_by = p.enforcement_court_code)
UNION
(SELECT p.transaction_number
       ,p.admin_court_code
       ,w.co_number             enforcement_parent
 FROM   payments p
       ,warrants w
 WHERE  p.payment_for = 'HOME WARRANT'
 AND    w.warrant_number = p.subject_no
 AND    w.local_warrant_number IS NULL
 AND    w.case_number IS NULL
 AND    w.issued_by = p.enforcement_court_code)
UNION
(SELECT p.transaction_number
       ,p.admin_court_code
       ,w.case_number           enforcement_parent
 FROM   payments p
       ,warrants w
 WHERE  p.payment_for = 'FOREIGN WARRANT'
 AND    w.local_warrant_number = p.subject_no
 AND    w.co_number IS NULL
 AND    w.currently_owned_by = p.enforcement_court_code)
UNION
(SELECT p.transaction_number
       ,p.admin_court_code
       ,w.co_number             enforcement_parent
 FROM   payments p
       ,warrants w
 WHERE  p.payment_for = 'FOREIGN WARRANT'
 AND    w.local_warrant_number = p.subject_no
 AND    w.case_number IS NULL
 AND    w.currently_owned_by = p.enforcement_court_code
);



PROMPT ************************************************************************
PROMPT Temporary Table created
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create Index on Temporary Table
PROMPT ************************************************************************

CREATE UNIQUE INDEX tmp_enforcement_parent_idx1 ON tmp_enforcement_parent 
	(admin_court_code,transaction_number);

PROMPT ************************************************************************
PROMPT Index on Temporary Table created
PROMPT ************************************************************************



SET FEEDB OFF

DECLARE
    v_rows  PLS_INTEGER;
BEGIN

    SELECT  count(1)
    INTO    v_rows
    FROM    tmp_enforcement_parent;

    dbms_output.put_line(chr(10));
    dbms_output.put_line ('Temporary table TMP_ENFORCEMENT_PARENT contains ' || to_char(v_rows) || ' records.');
    dbms_output.put_line(chr(10));
END;
/

SET FEEDB ON

PROMPT ************************************************************************
PROMPT Populate new ENFORCEMENT_PARENT column using temporary table
PROMPT ************************************************************************

UPDATE 
	(SELECT t.enforcement_parent tenforce, p.enforcement_parent penforce 
	 FROM payments p, tmp_enforcement_parent t 
	 WHERE t.transaction_number = p.transaction_number 
	 AND t.admin_court_code = p.admin_court_code
	) 
	SET penforce = tenforce;

PROMPT ************************************************************************
PROMPT New ENFORCEMENT_PARENT column populated
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Drop temporary table
PROMPT ************************************************************************

DROP TABLE tmp_enforcement_parent PURGE;

PROMPT ************************************************************************
PROMPT Temporary table dropped
PROMPT ************************************************************************

SPOOL OFF

EXIT