WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Updating the Instigator Label for Case Event 31 in the
|		        CCBC_REF_CODES table.  The instigator is changing from  
|		        multiple parties to a single party so text needs to be changed
|                         to single case.
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
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_2439.log

PROMPT ************************************************************************
PROMPT Update table CCBC_REF_CODES to change the instigator label for case event 31
PROMPT ************************************************************************

UPDATE ccbc_ref_codes
SET rv_meaning = 'Select the party who requires a copy of the notice'
WHERE rv_low_value = '31'
AND rv_domain = 'INSTIGATOR_LABEL';

PROMPT ************************************************************************
PROMPT Updated table CCBC_REF_CODES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF

EXIT