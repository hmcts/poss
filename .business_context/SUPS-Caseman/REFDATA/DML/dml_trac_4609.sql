WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_4609.sql $:
|
| SYNOPSIS      : Script to add new CCBC judgment cost ranges to the COSTS table.
|				  
|
|
| $Author: johnstond $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| 
|
|---------------------------------------------------------------------------------
|
| $Rev: 9326 $:          Revision of last commit
| $Date: 2011-12-14 16:31:38 +0000 (Wed, 14 Dec 2011) $:         Date of last commit
| $Id: dml_trac_4609.sql 9326 2011-12-14 16:31:38Z johnstond $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_4609.log

PROMPT ************************************************************************
PROMPT Inserting ADMISSION costs
PROMPT ************************************************************************

	INSERT INTO costs 
		(process
		,range_from 
		,range_from_currency 
		,range_to 
		,costs
		,range_to_currency 
		,effective_date 
		,costs_currency)
	VALUES 
		('ADMISSION' 
		,0.00 
		,'GBP'
		,5000.00 
		,40.00
		,'GBP' 
		,TO_DATE('01-APR-2012', 'DD-MON-YYYY')
		,'GBP');
		
	INSERT INTO costs 
		(process 
		,range_from 
		,range_from_currency 
		,range_to 
		,costs 
		,range_to_currency 
		,effective_date 
		,costs_currency)
	VALUES 
		('ADMISSION' 
		,5000.01 
		,'GBP' 
		,999999.99 
		,55.00 
		,'GBP'
		,TO_DATE('01-APR-2012', 'DD-MON-YYYY')
		,'GBP');

PROMPT ************************************************************************
PROMPT Inserting DEFAULT costs
PROMPT ************************************************************************

	INSERT INTO costs 
		(process 
		,range_from 
		,range_from_currency 
		,range_to
		,costs 
		,range_to_currency 
		,effective_date 
		,costs_currency)
	VALUES 
		('DEFAULT' 
		,0.00 
		,'GBP' 
		,5000.00 
		,25.00 
		,'GBP'
		,TO_DATE('01-APR-2012', 'DD-MON-YYYY')
		,'GBP');
		
	INSERT INTO costs 
		(process 
		,range_from 
		,range_from_currency 
		,range_to 
		,costs 
		,range_to_currency 
		,effective_date 
		,costs_currency)
	VALUES 
		('DEFAULT' 
		,5000.01 
		,'GBP' 
		,999999.99 
		,35 
		,'GBP'
		,TO_DATE('01-APR-2012', 'DD-MON-YYYY')
		,'GBP');

PROMPT ************************************************************************
PROMPT Inserting DETERMINATION costs
PROMPT ************************************************************************

	INSERT INTO costs 
		(process 
		,range_from 
		,range_from_currency
		,range_to
		,costs 
		,range_to_currency 
		,effective_date 
		,costs_currency)
	VALUES 
		('DETERMINATION'
		,00.00 
		,'GBP' 
		,5000.00 
		,55.00 
		,'GBP' 
		,TO_DATE('01-APR-2012', 'DD-MON-YYYY')
		,'GBP');
		
	INSERT INTO costs 
		(process 
		,range_from 
		,range_from_currency
		,range_to
		,costs 
		,range_to_currency
		,effective_date 
		,costs_currency)
	VALUES 
		('DETERMINATION'
		,5000.01 
		,'GBP' 
		,999999.99 
		,70.00 
		,'GBP' 
		,TO_DATE('01-APR-2012', 'DD-MON-YYYY')
		,'GBP');

	COMMIT;

SPOOL OFF

EXIT