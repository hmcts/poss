WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Common/database/Coding Templates/SUPS Oracle ddl template.sql $:
|
| SYNOPSIS      : Remove the appropriate DDL commands where necessary.
|
|
| $Author: westm $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      :
|
|---------------------------------------------------------------------------------
|
| $Rev: 3341 $:          Revision of last commit
| $Date: 2009-07-14 14:57:47 +0100 (Tue, 14 Jul 2009) $:         Date of last commit
| $Id: SUPS Oracle ddl template.sql 3341 2009-07-14 13:57:47Z westm $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_4235.log

PROMPT ************************************************************************
PROMPT Create Table tmp_rtl_judgments
PROMPT ************************************************************************
CREATE TABLE tmp_rtl_judgments
    (judg_seq                          NUMBER(9) NOT NULL
   ,judgment_type                     VARCHAR2(16 CHAR) NOT NULL
   ,joint_judgment                    VARCHAR2(1 CHAR)
   ,judgment_date                     DATE
   ,sent_to_rtl                       DATE
   ,status_to_rtl                     VARCHAR2(1 CHAR)
   ,date_of_final_payment             DATE
   ,status                            VARCHAR2(15 CHAR)
   ,judgment_amount                   NUMBER(38, 2)
   ,total_costs                       NUMBER(38, 2)
   ,paid_before_judgment              NUMBER(38, 2)
   ,total                             NUMBER(38, 2)
   ,instalment_amount                 NUMBER(38, 2)
   ,instalment_period                 VARCHAR2(3 CHAR)
   ,first_payment_date                DATE
   ,payee_name                        VARCHAR2(70 CHAR)
   ,payee_addr_1                      VARCHAR2(35 CHAR)
   ,payee_addr_2                      VARCHAR2(35 CHAR)
   ,payee_addr_3                      VARCHAR2(35 CHAR)
   ,payee_addr_4                      VARCHAR2(35 CHAR)
   ,payee_addr_5                      VARCHAR2(35 CHAR)
   ,payee_postcode                    VARCHAR2(8 CHAR)
   ,payee_tel_no                      VARCHAR2(24 CHAR)
   ,payee_reference                   VARCHAR2(25 CHAR)
   ,pay_receipt_date                  DATE
   ,judgment_court_code               NUMBER(3)
   ,judgment_amount_currency          VARCHAR2(3 CHAR)
   ,total_costs_currency              VARCHAR2(3 CHAR)
   ,paid_before_judgment_currency     VARCHAR2(3 CHAR)
   ,total_currency                    VARCHAR2(3 CHAR)
   ,instalment_amount_currency        VARCHAR2(3 CHAR)
   ,case_number                       VARCHAR2(8 CHAR)
   ,slip_codeline_1                   VARCHAR2(58 CHAR)
   ,against_party_role_code           VARCHAR2(10 CHAR)
   ,slip_codeline_2                   VARCHAR2(100 CHAR)
   ,payee_bank_sort_code              VARCHAR2(8 CHAR)
   ,payee_acc_holder                  VARCHAR2(70 CHAR)
   ,payee_bank_name                   VARCHAR2(30 CHAR)
   ,payee_bank_info_1                 VARCHAR2(30 CHAR)
   ,payee_bank_info_2                 VARCHAR2(30 CHAR)
   ,payee_bank_acc_no                 VARCHAR2(18 CHAR)
   ,payee_giro_acc_no                 VARCHAR2(8 CHAR)
   ,payee_giro_trans_code_1           VARCHAR2(9 CHAR)
   ,payee_giro_trans_code_2           VARCHAR2(2 CHAR)
   ,payee_apacs_trans_code            VARCHAR2(2 CHAR)
   ,against_case_party_no             NUMBER(4)
   ,warrant_id                        VARCHAR2(8 CHAR)
   ,warrant_party_against             NUMBER(1)
   ,payee_email_address               VARCHAR2(254 CHAR)
   ,payee_fax_number                  VARCHAR2(24 CHAR)
   ,payee_dx_number                   VARCHAR2(40 CHAR)
   ,payee_dob                         DATE
   ,against_party_addr_id_judg_reg    NUMBER(12)
)
ROWDEPENDENCIES;

SPOOL OFF

