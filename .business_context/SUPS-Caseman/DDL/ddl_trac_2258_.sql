WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      :  Change is part of the Scalability enhancements to CaseMan.
|
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
| COMMENTS      : Index added as part of the Scalability change around the Run
|			Order Printing functionality. 
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_2258_1.log


PROMPT ************************************************************************
PROMPT Create Index WP_OUTPUT_IDX2 on Table WP_OUTPUT
PROMPT ************************************************************************
CREATE INDEX wp_output_idx2 ON wp_output
    (user_id
    ,event_seq
    ,output_id
    );

PROMPT ************************************************************************
PROMPT Index WP_OUTPUT_IDX2 on Table WP_OUTPUT created
PROMPT ************************************************************************


SPOOL OFF