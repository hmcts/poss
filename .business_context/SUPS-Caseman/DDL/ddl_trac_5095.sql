/*-------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| Procedure     : ddl_trac_5095
| SYNOPSIS      : This module adds the new tables required by the Claims Processing
|                 and Transfers application (CPT) to the CASEMAN schema.
|
|                 This currently uses the tables spaces for the Env52 CASEMAN enviroment.
|                 The TABLESPACE names may need to be changed for the live or test environments    
|
|                 The following tables are added to CASEMAN
|
|                    CPT_CLAIMS
|                    CPT_DEFENDANTS
|                    CPT_PRINT_CLAIMS
|                    CPT_STATISTICS
|                
|                 The above tables are renamed versions of tables which used to be in the old sups01
|                 which is replaced by the CPT extentsion to CASEMAN following the development of the 
|                 Secure Data Transmission (SDT) changes to MCOL.
|
|                   CPT_LIBERATE_TOTAL_FEES
|   
|                 The above is a completely new table added for CPT which is not a copy of an old CPC table.
|
|                 In addition, a new VIA_SDT column is added to the LOAD_CASES table which is used to control 
|                 conditional validation of cases depending on the submission route.
|                  
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
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/
-- drop old versions of the tables if they exist

/*
DROP TABLE cpt_defendants;
DROP TABLE cpt_claims;
DROP TABLE cpt_statistics;
DROP TABLE cpt_print_claims;
DROP TABLE cpt_liberata_total_fees;
*/

-- Create cpt claims table and indexes

CREATE TABLE cpt_claims
(
  claim_number              VARCHAR2(8)     NOT NULL,
  court_code                NUMBER(3)       NOT NULL,
  claimant_name_1           VARCHAR2(35),
  claimant_name_2           VARCHAR2(35),
  claimant_addr_1           VARCHAR2(35),
  claimant_addr_2           VARCHAR2(35),
  claimant_addr_3           VARCHAR2(35),
  claimant_addr_4           VARCHAR2(35),
  claimant_addr_5           VARCHAR2(35),
  claimant_postcode         VARCHAR2(8),
  solicitor_reference       VARCHAR2(24),
  claim_amount              NUMBER(8,2)     NOT NULL,
  court_fee                 NUMBER(6,2)     NOT NULL,
  claimant_email_addr       VARCHAR2(255),
  solicitors_costs          NUMBER(6,2)     NOT NULL,
  total_amount              NUMBER(9,2)     NOT NULL,
  issue_DATE                DATE            NOT NULL,
  service_DATE              DATE            NOT NULL,
  particulars_1             VARCHAR2(45),
  particulars_2             VARCHAR2(45),
  particulars_3             VARCHAR2(45),
  particulars_4             VARCHAR2(45),
  particulars_5             VARCHAR2(45),
  particulars_6             VARCHAR2(45),
  particulars_7             VARCHAR2(45),
  particulars_8             VARCHAR2(45),
  particulars_9             VARCHAR2(45),
  particulars_10            VARCHAR2(45),
  particulars_11            VARCHAR2(45),
  particulars_12            VARCHAR2(45),
  particulars_13            VARCHAR2(45),
  particulars_14            VARCHAR2(45),
  particulars_15            VARCHAR2(45),
  particulars_16            VARCHAR2(45),
  particulars_17            VARCHAR2(45),
  particulars_18            VARCHAR2(45),
  particulars_19            VARCHAR2(45),
  particulars_20            VARCHAR2(45),
  particulars_21            VARCHAR2(45),
  particulars_22            VARCHAR2(45),
  particulars_23            VARCHAR2(45),
  particulars_24            VARCHAR2(45),
  despatch_number           NUMBER(3),
  corres_rep_name           VARCHAR2(70),
  corres_rep_addr_1         VARCHAR2(35),
  corres_rep_addr_2         VARCHAR2(35),
  corres_rep_addr_3         VARCHAR2(35),
  solicitor                 VARCHAR2(1),
  corres_rep_addr_4         VARCHAR2(35),
  name_on_partics           VARCHAR2(30),
  corres_rep_addr_5         VARCHAR2(35),
  corres_rep_postcode       VARCHAR2(8),
  claimant_rep_fax_no       VARCHAR2(14),
  claimant_rep_email        VARCHAR2(60),
  claim_amount_currency     VARCHAR2(3),
  court_fee_currency        VARCHAR2(3),
  solicitors_costs_currency VARCHAR2(3),
  total_amount_currency     VARCHAR2(3),
  status                    VARCHAR2(1) NOT NULL,
  claimant_dx_no            VARCHAR2(35),
  claimant_pcm              VARCHAR2(2),
  claimant_tel_no           VARCHAR2(24),
  claimant_fax_no           VARCHAR2(24),
  creditor_code             NUMBER(4) NOT NULL
)
TABLESPACE sups01
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 3M
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );
-- Create/Recreate primary, unique and foreign key constraints 
ALTER TABLE cpt_claims
  ADD CONSTRAINT cpt_claims_pk PRIMARY KEY (claim_number)
  USING INDEX 
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 128K
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );

CREATE INDEX cpt_claims_idx1 ON cpt_claims (status)
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64K
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );

-- create cpt_defendants table and required indexes

CREATE TABLE cpt_defendants
(
  claim_number       VARCHAR2(8)    NOT NULL,
  id                 NUMBER(1)      DEFAULT 1 NOT NULL,
  name               VARCHAR2(70)   NOT NULL,
  addr_1             VARCHAR2(35)   NOT NULL,
  addr_2             VARCHAR2(35),
  addr_3             VARCHAR2(35),
  addr_4             VARCHAR2(35),
  addr_5             VARCHAR2(35),
  postcode           VARCHAR2(8),
  non_service_number NUMBER(9),
  non_service_code   NUMBER(1),
  DATE_returned      DATE,
  mcol_password      VARCHAR2(8)
)
TABLESPACE sups01
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 704k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );
-- create/recreate primary, unique and foreign key constraints
 
ALTER TABLE cpt_defendants
  ADD CONSTRAINT deft_pk PRIMARY KEY (claim_number, id)
  USING INDEX
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 192k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );
  
ALTER TABLE cpt_defendants
  ADD CONSTRAINT deft_fk1 foreign key (claim_number)
  references cpt_claims (claim_number)
  disable;
  
-- create/recreate indexes 

create index deft_fk1 on cpt_defendants (claim_number)
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 192k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );


-- CREATE TABLE
CREATE TABLE cpt_print_claims
(
  rec_no              NUMBER(5)         NOT NULL,
  omr_code            NUMBER(1)         NOT NULL,
  welsh_1             VARCHAR2(25),
  welsh_2             VARCHAR2(25),
  welsh_3             VARCHAR2(25),
  welsh_4             VARCHAR2(25),
  creditor_code       NUMBER(4)         NOT NULL,
  bar_code            VARCHAR2(9)       NOT NULL,
  claim_number        VARCHAR2(10)      NOT NULL,
  court_name          VARCHAR2(24)      NOT NULL,
  court_code          NUMBER(3)         NOT NULL,
  court_name_seal_1   VARCHAR2(14),
  court_name_seal_2   VARCHAR2(14),
  amount              VARCHAR2(9)       NOT NULL,
  fee                 VARCHAR2(7)       NOT NULL,
  court_postcode      VARCHAR2(8),
  costs               VARCHAR2(7)       NOT NULL,
  total               VARCHAR2(10)      NOT NULL,
  issue_DATE          DATE              NOT NULL,
  page_1_count        VARCHAR2(6)       NOT NULL,
  court_address_1     VARCHAR2(35),
  court_address_2     VARCHAR2(35),
  court_address_3     VARCHAR2(35),
  court_address_4     VARCHAR2(35),
  court_address_5     VARCHAR2(35),
  court_section       VARCHAR2(15),
  claimant_dets_1     VARCHAR2(35),
  claimant_dets_2     VARCHAR2(35),
  claimant_dets_3     VARCHAR2(35),
  claimant_dets_4     VARCHAR2(35),
  claimant_dets_5     VARCHAR2(35),
  claimant_dets_6     VARCHAR2(35),
  claimant_dets_7     VARCHAR2(35),
  payment_address_1   VARCHAR2(35),
  payment_address_2   VARCHAR2(35),
  payment_address_3   VARCHAR2(35),
  payment_address_4   VARCHAR2(35),
  claimant_tel_number VARCHAR2(30),
  reference           VARCHAR2(24),
  particulars_name    VARCHAR2(30),
  court_tel_number    VARCHAR2(30),
  deft_1_dets_1       VARCHAR2(35),
  deft_1_dets_2       VARCHAR2(35),
  deft_1_dets_3       VARCHAR2(35),
  deft_1_dets_4       VARCHAR2(35),
  deft_1_dets_5       VARCHAR2(35),
  deft_1_dets_6       VARCHAR2(35),
  deft_1_dets_7       VARCHAR2(35),
  deft_1_dets_8       VARCHAR2(8),
  claimant_x          VARCHAR2(8),
  solicitor_x         VARCHAR2(15),
  deft_2_dets_1       VARCHAR2(35),
  deft_2_dets_2       VARCHAR2(35),
  deft_2_dets_3       VARCHAR2(35),
  deft_2_dets_4       VARCHAR2(35),
  deft_2_dets_5       VARCHAR2(35),
  deft_2_dets_6       VARCHAR2(35),
  deft_2_dets_7       VARCHAR2(35),
  deft_2_dets_8       VARCHAR2(8),
  particulars_1       VARCHAR2(45),
  particulars_2       VARCHAR2(45),
  particulars_3       VARCHAR2(45),
  particulars_4       VARCHAR2(45),
  particulars_5       VARCHAR2(45),
  particulars_6       VARCHAR2(45),
  particulars_7       VARCHAR2(45),
  particulars_8       VARCHAR2(45),
  particulars_9       VARCHAR2(45),
  particulars_10      VARCHAR2(45),
  particulars_11      VARCHAR2(45),
  particulars_12      VARCHAR2(45),
  particulars_13      VARCHAR2(45),
  particulars_14      VARCHAR2(45),
  particulars_15      VARCHAR2(45),
  particulars_16      VARCHAR2(45),
  particulars_17      VARCHAR2(45),
  particulars_18      VARCHAR2(45),
  particulars_19      VARCHAR2(45),
  particulars_20      VARCHAR2(45),
  particulars_21      VARCHAR2(45),
  particulars_22      VARCHAR2(45),
  amount_currency     VARCHAR2(3),
  particulars_23      VARCHAR2(45),
  particulars_24      VARCHAR2(45),
  fee_currency        VARCHAR2(3),
  help_text_1         VARCHAR2(60),
  costs_currency      VARCHAR2(3),
  help_text_2         VARCHAR2(60),
  help_text_3         VARCHAR2(60),
  total_currency      VARCHAR2(3),
  help_text_4         VARCHAR2(60),
  help_text_5         VARCHAR2(60),
  help_text_6         VARCHAR2(60),
  help_text_7         VARCHAR2(60),
  help_text_8         VARCHAR2(60),
  help_text_9         VARCHAR2(60),
  help_text_10        VARCHAR2(60),
  help_text_11        VARCHAR2(60),
  help_text_12        VARCHAR2(60),
  help_text_13        VARCHAR2(60),
  help_text_14        VARCHAR2(60),
  help_text_15        VARCHAR2(60),
  help_text_16        VARCHAR2(60),
  help_text_17        VARCHAR2(60),
  p2_claimant_name_1  VARCHAR2(35),
  p2_claimant_name_2  VARCHAR2(35),
  p2_deft_name_1      VARCHAR2(35),
  p2_deft_name_2      VARCHAR2(35),
  p2_court_address    VARCHAR2(188),
  p2_help_text_1      VARCHAR2(60),
  p2_help_text_2      VARCHAR2(60),
  p2_help_text_3      VARCHAR2(60),
  p2_help_text_4      VARCHAR2(60),
  p2_help_text_5      VARCHAR2(60),
  p2_help_text_6      VARCHAR2(60),
  p2_help_text_7      VARCHAR2(60),
  p2_help_text_8      VARCHAR2(60),
  p2_help_text_9      VARCHAR2(60),
  page_3_count        VARCHAR2(6)       NOT NULL,
  page_2_count        VARCHAR2(6)       NOT NULL,
  page_4_count        VARCHAR2(6)       NOT NULL,
  claimant_postcode   VARCHAR2(8),
  payment_postcode    VARCHAR2(8),
  payment_address_5   VARCHAR2(35)
)
TABLESPACE sups01
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 448k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );
-- create/recreate primary, unique and foreign key constraints 
ALTER TABLE cpt_print_claims
  ADD CONSTRAINT print_claims_pk PRIMARY KEY (rec_no)
  USING INDEX
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );

-- CREATE TABLE
CREATE TABLE cpt_statistics
(
  issue_date            DATE            NOT NULL,
  valid                 VARCHAR2(1)     NOT NULL,
  court_code            NUMBER(3),
  claim_amount          NUMBER(8,2),
  court_fee             NUMBER(6,2),
  claim_number          VARCHAR2(8),
  claim_amount_currency VARCHAR2(3),
  court_fee_currency    VARCHAR2(3),
  creditor_code         NUMBER(4)       NOT NULL
)
TABLESPACE sups01
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 256k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );
  
-- create/recreate check constraints 
ALTER TABLE cpt_statistics
  ADD CONSTRAINT valid_rule_6
  check (valid in ( 'Y' , 'N' ));
  
-- create/recreate indexes 
create index stat_issue_date_idx on cpt_statistics (issue_date)
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 128k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );
create index cpt_statistics_idx1 on cpt_statistics (claim_number)
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 128k
    MINEXTENTS 1
    MAXEXTENTS unlimited
  );

-- Create table
CREATE TABLE cpt_liberata_total_fees
(
  issue_date         DATE           NOT NULL,
  report_line_string VARCHAR2(100)  NOT NULL
)
TABLESPACE sups01
  PCTFREE 10
  INITRANS 1
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64K
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );
-- CREATE/RECREATE PRIMARY, UNIQUE AND FOREIGN KEY CONSTRAINTS 
ALTER TABLE cpt_liberata_total_fees
  ADD PRIMARY KEY (issue_date)
  USING INDEX 
  TABLESPACE sups01
  PCTFREE 10
  INITRANS 2
  MAXTRANS 255
  STORAGE
  (
    INITIAL 64K
    MINEXTENTS 1
    MAXEXTENTS UNLIMITED
  );
  
PROMPT ************************************************************************
PROMPT adding VIA_SDT column and constraint to LOAD_CASES table
PROMPT ************************************************************************ 
  
ALTER TABLE load_cases
ADD (via_sdt VARCHAR2(1) DEFAULT 'N' NOT NULL );

ALTER TABLE load_cases
ADD CONSTRAINT lc_vs_check CHECK (via_sdt      IN ('Y', 'N'));
  