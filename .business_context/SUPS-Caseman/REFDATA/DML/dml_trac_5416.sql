WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*--------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : dml_trac_5416.sql
| SYNOPSIS      : Adds the CaseMan output footer strapline to the CCBC_REF_CODES table
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) CGI.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : 
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5416.log

PROMPT ************************************************************************
PROMPT Insert strapline text into CCBC_REF_CODES
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
    (
    rv_domain, 
    rv_meaning
    )
VALUES
    (
    'OUTPUT_STRAPLINE',
    'Check if you can issue your claim online. It will save you time and money. Go to www.moneyclaim.gov.uk to find out more.'
    );

PROMPT ************************************************************************
PROMPT CCBC_REF_CODES table updated
PROMPT ************************************************************************
	
COMMIT;