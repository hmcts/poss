WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      :  Indexes to improve the document cleardown process
|
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2015 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Indexes to improve the document cleardown process
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_5627.log

PROMPT ************************************************************************
PROMPT Create Indexes on Table REPORT_QUEUE
PROMPT ************************************************************************

CREATE INDEX report_queue_idx4 ON report_queue
    (storage_duration
	,created_date
	,id
    ) ONLINE;
	
CREATE INDEX report_queue_idx5 ON report_queue
    (storage_duration
	,type
	,document_id
	,id
    ) ONLINE;

PROMPT ************************************************************************
PROMPT Indexes on Table REPORT_QUEUE created
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Recreate Index on Table WP_OUTPUT
PROMPT ************************************************************************

DROP INDEX xie9wp_output;
CREATE INDEX xie9wp_output ON wp_output
    (xmlsource_numcheck(xmlsource)
	,nvl(final_ind,'N')
    ) ONLINE;
	
PROMPT ************************************************************************
PROMPT Index on Table WP_OUTPUT recreated
PROMPT ************************************************************************

SPOOL OFF