WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

SPOOL dml_trac_4594.log

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds the new case type of Company Administration Orders and the
|                 new case event linked to it
|
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      Run as CMAN user with table creation privileges.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

PROMPT ************************************************************************
PROMPT Create new case type
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
        (rv_low_value
        ,rv_high_value
        ,rv_domain
        ,rv_meaning
        )
VALUES
        ('COMPANY ADMIN ORDER'
        ,'INSOLVENCY'
        ,'CURRENT_CASE_TYPE'
        ,'Company Administration Order'
        );
        
PROMPT ************************************************************************
PROMPT Create new case type
PROMPT ************************************************************************

INSERT INTO standard_events
        (event_id
        ,category
        ,description
        ,database_event
        ,record_card
        ,edit_details
        )
VALUES
        (671
        ,'C'
        ,'COMPANY ADMINISTRATION ORDER'
        ,'N'
        ,'Y'
        ,'O'
        );
        
COMMIT;