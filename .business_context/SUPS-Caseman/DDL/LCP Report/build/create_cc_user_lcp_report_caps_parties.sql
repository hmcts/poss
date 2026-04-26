WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE
SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF
SET PAGES 0 HEADING OFF TRIMSPOOL ON LINES 400 FEEDB OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups/svn/trunk/Caseman-CCBC/DDL/LCP%20Report/build/create_cc_user_lcp_report_caps_parties.sql $:
|
| SYNOPSIS      : Create the CC_USER schema objects 
|
| $Author: westm $:    
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2011 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Script to create the database objects in the CC user.
|
|                 JF 11/03/2011 - Updated TRAC 4221 to include LCP_MAPPINGS table
|
|---------------------------------------------------------------------------------
|
| $Rev: 8756 $:       Revision of last commit
| $Date: 2011-05-12 09:02:03 +0100 (Thu, 12 May 2011) $:      Date of last commit
| $Id: create_cc_user_lcp_report_caps_parties.sql 8756 2011-05-12 08:02:03Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL create_cc_user_lcp_report_caps_parties.log

PROMPT ************************************************************************
PROMPT CREATE TABLE LCP_REPORT_CAPS_PARTIES
PROMPT ************************************************************************

-- drop table and associated index if it already exists
BEGIN
    
    EXECUTE IMMEDIATE 'DROP TABLE lcp_report_caps_parties';

EXCEPTION 
     
    WHEN OTHERS THEN
        NULL; -- suppress error as likely to be table does not exist
END;
/        

CREATE TABLE lcp_report_caps_parties
    (party_seq     NUMBER (9) NOT NULL
    ,code          NUMBER (4)
    ,crt_code      NUMBER (3)
    ,name          VARCHAR2 (70 CHAR) NOT NULL
    ,addr_1        VARCHAR2 (35 CHAR) NOT NULL
    ,addr_2        VARCHAR2 (35 CHAR) NOT NULL
    ,addr_3        VARCHAR2 (35 CHAR)
    ,addr_4        VARCHAR2 (35 CHAR)
    ,addr_5        VARCHAR2 (35 CHAR)
    ,postcode      VARCHAR2 (8 CHAR)
    ,tel_no        VARCHAR2 (24 CHAR)
    ,dx_no         VARCHAR2 (40 CHAR)
    ,rd_chq_date   DATE
    ,fax_no        VARCHAR2 (24 CHAR)
    ,email_addr    VARCHAR2 (60 CHAR)
    ,pcm           VARCHAR2 (2 CHAR)
    );

PROMPT ************************************************************************
PROMPT CREATED TABLE LCP_REPORT_CAPS_PARTIES
PROMPT ************************************************************************
PROMPT ************************************************************************
PROMPT CREATED INDEX LCP_REPORT_CAPS_PARTIES_IDX
PROMPT ************************************************************************


CREATE INDEX lcp_report_caps_parties_fx1
   ON lcp_report_caps_parties (crt_code
                              ,UPPER (name)
                              ,party_seq
                              );

PROMPT ************************************************************************
PROMPT LCP_REPORT_CAPS_PARTIES_IDX CREATED
PROMPT ************************************************************************

SPOOL OFF