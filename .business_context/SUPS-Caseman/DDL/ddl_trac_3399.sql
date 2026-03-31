
WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Remove the appropriate DDL commands where necessary.
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
| COMMENTS      : Create the Package Header and Package Body for create_judgmnt_print_file
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_3399.log

PROMPT ************************************************************************
PROMPT Create Package Header create_judgmnt_print_file
PROMPT ************************************************************************

/*-------------------------------------------------------*
 |                                      		 |
 | Package Header: create_judgmnt_print_file             |
 |                                                       |
 |     Version No: 1.0                                   |
 |                                                       |
 |       Comments:                                       |
 |                                                       |                                          
 |-------------------------------------------------------|*/
  
CREATE OR REPLACE PACKAGE create_judgmnt_print_file
AS
 PROCEDURE run_print_judgments ( p_username IN VARCHAR2 );
END create_judgmnt_print_file;
/

PROMPT ************************************************************************
PROMPT Package Header create_judgmnt_print_file created
PROMPT ************************************************************************



PROMPT ************************************************************************
PROMPT Create Package Body create_judgmnt_print_file
PROMPT ************************************************************************


/*-------------------------------------------------------*
 |                                      		 |
 | Package Body: create_judgmnt_print_file               |
 |                                                       |
 |     Version No: 1.0                                   |
 |                                                       |
 |       Comments:                                       |
 |                                                       |                                          
 |-------------------------------------------------------|*/
CREATE OR REPLACE PACKAGE BODY create_judgmnt_print_file
AS

 /*------------------------------------------------*
  * Procedure to Truncate the Print Judgments      *
  * table                                          *
  *------------------------------------------------*/
  
 PROCEDURE truncate_print_judgments
 AS
 BEGIN
  
  EXECUTE IMMEDIATE 'truncate table print_judgments';
  
 END truncate_print_judgments;
 
 
 /*------------------------------------------------*
  * Procedure to run the Actual Processing         *
  *------------------------------------------------*/
  
 PROCEDURE create_print_judgments ( p_username IN VARCHAR2 )
 IS
      
  nv_old_cred        		NUMBER(4);
  cv_old_type        		VARCHAR2(1);
  nv_rec_number      		NUMBER(6);
  cv_payee_name      		VARCHAR2(70);
  cv_payee_addr_1    		VARCHAR2(35);
  cv_payee_addr_2    		VARCHAR2(35);
  cv_payee_addr_3    		VARCHAR2(35);
  cv_payee_addr_4    		VARCHAR2(35);
  cv_payee_addr_5    		VARCHAR2(35);
  cv_payee_postcode  		VARCHAR2(8);
  cv_payee_tel_no    		VARCHAR2(24);
  cv_payee_ref       		VARCHAR2(25);
  cv_payee_ref_sol   		VARCHAR2(25);
  cv_payee_bank_sort_code      	VARCHAR2(8);
  cv_payee_acc_holder          	VARCHAR2(70);
  cv_payee_bank_name           	VARCHAR2(30);
  cv_payee_bank_info_1        	VARCHAR2(30);
  cv_payee_bank_info_2         	VARCHAR2(30);
  cv_payee_bank_acc_no         	VARCHAR2(18);
  cv_payee_giro_acc_no         	VARCHAR2(8);
  cv_payee_giro_trans_code_1   	VARCHAR2(9);
  cv_payee_giro_trans_code_2   	VARCHAR2(2);
  cv_payee_apacs_trans_code    	VARCHAR2(2);

  CURSOR c_judg 
      IS
  SELECT DECODE(eve.username, p_username ,cred.code,'1999') code	, 
         cas.cred_code						,
         SUBSTR(judg.judgment_type,1,1) judgment_type		, 
         cas.case_number					,
         parclmt.person_requested_name 	claimant_details_1	,
         gaclmt.address_line1 	       	claimant_details_2	,
         gaclmt.address_line2 	       	claimant_details_3	,
         gaclmt.address_line3 		claimant_details_4	,
         gaclmt.address_line4 		claimant_details_5	,
         gaclmt.address_line5 		claimant_details_6	,
         gaclmt.postcode 		claimant_details_7	,
	 judg.payee_reference					,	 
	 cprclmt.reference					,
         pardef.person_requested_name 	name			, 
         pardef.person_dob					,
	 gadef.address_line1 addr_1				, 
	 gadef.address_line2 addr_2				,
         gadef.address_line3 addr_3				, 
         gadef.address_line4 addr_4				,
         gadef.address_line5 addr_5				, 
         gadef.postcode						,
	 judg.judgment_amount					, 
	 judg.total_costs					,
	 judg.paid_before_judgment				, 
	 judg.total						, 
	 judg.instalment_amount					,
	 judg.instalment_period					, 
	 judg.first_payment_date				, 
	 judg.judgment_date					,
	 judg.slip_codeline_1					, 
	 judg.slip_codeline_2					, 
	 judg.payee_name					,
         judg.payee_addr_1					, 
         judg.payee_addr_2					, 
         judg.payee_addr_3					, 
         judg.payee_addr_4					,
         judg.payee_addr_5					, 
         judg.payee_postcode					, 
         judg.payee_tel_no					,	
	 judg.payee_bank_sort_code				, 
	 judg.payee_acc_holder					,
	 judg.payee_bank_name					, 
	 judg.payee_bank_info_1					,
	 judg.payee_bank_info_2					, 
	 judg.payee_bank_acc_no					,
	 judg.payee_giro_acc_no					, 
	 judg.payee_giro_trans_code_1				,
	 judg.payee_giro_trans_code_2				, 
	 judg.payee_apacs_trans_code				,	
         NVL(parcred.party_type_code, 'SOLICITOR') party_type_code, 
         parcred.party_id
  FROM   case_events            eve,
	 cases                  cas,
         judgments              judg,
         coded_parties          cred,
         national_coded_parties ncp,
	 report_sequences       rseq,
	 parties                parclmt,
	 given_addresses        gaclmt,
	 case_party_roles       cprclmt,
	 parties                pardef,
	 given_addresses        gadef,
	 parties                parcred
  WHERE  gadef.case_number = judg.case_number
    AND  gadef.case_party_no = judg.against_case_party_no
    AND  gadef.party_role_code = 'DEFENDANT'
    AND  gadef.address_type_code = 'SERVICE'
    AND  gadef.valid_to IS NULL
    AND  pardef.party_id = gadef.party_id
    AND  cprclmt.case_number = judg.case_number
    AND  cprclmt.case_party_no = 1
    AND  cprclmt.party_role_code = 'CLAIMANT'
    AND  gaclmt.case_number = judg.case_number
    AND  gaclmt.case_party_no = 1
    AND  gaclmt.party_role_code = 'CLAIMANT'
    AND  gaclmt.address_type_code = 'SERVICE'
    AND  gaclmt.valid_to IS NULL
    AND  parclmt.party_id = gaclmt.party_id
    AND  cred.code = cas.cred_code
    AND  cred.admin_court_code = 335
    AND  parcred.party_id = cred.party_id
    AND  ncp.code = cred.code
    AND  ncp.print_judgments = 'Y'
    AND  cas.manual is NULL
    AND  cas.case_number = judg.case_number
    AND  cas.admin_crt_code = 335
    AND  eve.deleted_flag = 'N'
    AND  eve.std_event_id IN (230,240)
    AND  eve.judg_seq = judg.judg_seq
    AND  judg.status IS NULL
    AND  judg.judgment_type IN ('DEFAULT','ADMISSION')
    AND  judg.judg_seq > rseq.last_seqno
    AND  rseq.form_name = 'JUDGMENTS'
  ORDER BY 1, 3, gadef.postcode;

BEGIN

 nv_old_cred := 0;
 cv_old_type := 'X';
  
 -- Loop through the Cursor
 FOR c_judg_rec IN c_judg
 LOOP
   
   IF nv_old_cred = c_judg_rec.code AND cv_old_type = c_judg_rec.judgment_type THEN
      nv_rec_number := nv_rec_number + 1;
   ELSE
    nv_rec_number := 1;
    nv_old_cred := c_judg_rec.code;
    cv_old_type := c_judg_rec.judgment_type; 
   END IF;

    /* Default payee fields to those obtained in cursor c_judg */
    cv_payee_name              := c_judg_rec.claimant_details_1;
    cv_payee_addr_1            := c_judg_rec.claimant_details_2;
    cv_payee_addr_2            := c_judg_rec.claimant_details_3;
    cv_payee_addr_3            := c_judg_rec.claimant_details_4;
    cv_payee_addr_4            := c_judg_rec.claimant_details_5;
    cv_payee_addr_5            := c_judg_rec.claimant_details_6;
    cv_payee_postcode          := c_judg_rec.claimant_details_7;
    cv_payee_tel_no            := c_judg_rec.payee_tel_no;
    cv_payee_bank_sort_code    := c_judg_rec.payee_bank_sort_code;
    cv_payee_acc_holder        := c_judg_rec.payee_acc_holder;
    cv_payee_bank_name         := c_judg_rec.payee_bank_name;
    cv_payee_bank_info_1       := c_judg_rec.payee_bank_info_1;
    cv_payee_bank_info_2       := c_judg_rec.payee_bank_info_2;
    cv_payee_bank_acc_no       := c_judg_rec.payee_bank_acc_no;
    cv_payee_giro_acc_no       := c_judg_rec.payee_giro_acc_no;
    cv_payee_giro_trans_code_1 := c_judg_rec.payee_giro_trans_code_1;
    cv_payee_giro_trans_code_2 := c_judg_rec.payee_giro_trans_code_2;
    cv_payee_apacs_trans_code  := c_judg_rec.payee_apacs_trans_code;

/* If MCOL case then set payee fields to solicitor fields */   
    IF c_judg_rec.cred_code = 1999 THEN
      
      -- Run in a seperate block so that the exception
      -- is caught and just return NULL if it is.
      BEGIN
          
         SELECT parsol.person_requested_name, 
                gasol.address_line1         ,
                gasol.address_line2	    , 
                gasol.address_line3         ,
	        gasol.address_line4         , 
	        gasol.address_line5         ,
	        gasol.postcode              , 
	        NULL                        ,   
	        cprcprsol.personal_reference
           INTO cv_payee_name		    , 
                cv_payee_addr_1		    , 
                cv_payee_addr_2		    , 
                cv_payee_addr_3		    ,
                cv_payee_addr_4		    , 
                cv_payee_addr_5		    , 
                cv_payee_postcode	    , 
                cv_payee_tel_no		    ,
                cv_payee_ref_sol
           FROM parties                  parsol   ,
                given_addresses          gasol    ,
                cpr_to_cpr_relationship  cprcprsol
          WHERE cprcprsol.cpr_a_case_number = c_judg_rec.case_numbeR
            AND cprcprsol.cpr_a_case_party_no = 1
            AND cprcprsol.cpr_a_party_role_code = 'CLAIMANT'
            AND cprcprsol.cpr_b_case_number = c_judg_rec.case_number
            AND cprcprsol.cpr_b_party_role_code = 'SOLICITOR'
            AND cprcprsol.deleted_flag = 'N'
            AND gasol.case_number = c_judg_rec.case_number
            AND gasol.case_party_no = cprcprsol.cpr_b_case_party_no
            AND gasol.party_role_code = 'SOLICITOR'
            AND gasol.address_type_code = 'SOLICITOR'
            AND gasol.valid_to IS NULL
            AND parsol.party_id = gasol.party_id;
      EXCEPTION
        WHEN NO_DATA_FOUND THEN NULL;
      END;
      
    END IF;

   /*---------------------------------------------------------*
    * If non-MCOL then if payee details have been supplied on *
    * the judgment then use them otherwise use the standard   *
    * payee details from the database                         *
    *---------------------------------------------------------*/

    IF C_JUDG_REC.CRED_CODE <> 1999 THEN
    
      IF c_judg_rec.payee_name IS NOT NULL THEN
        cv_payee_name     := c_judg_rec.payee_name;
        cv_payee_addr_1   := c_judg_rec.payee_addr_1;
        cv_payee_addr_2   := c_judg_rec.payee_addr_2;
        cv_payee_addr_3   := c_judg_rec.payee_addr_3;
        cv_payee_addr_4   := c_judg_rec.payee_addr_4;
        cv_payee_addr_5   := c_judg_rec.payee_addr_5;
        cv_payee_postcode := c_judg_rec.payee_postcode;
        
      ELSE
         
        -- Run a seperate PL/SQL block so that the exception
        -- can be caught and handled without impacting the
        -- main program.
        BEGIN
          
          SELECT parpay.person_requested_name	, 
                 gapay.address_line1		,
                 gapay.address_line2		, 
                 gapay.address_line3		,
                 gapay.address_line4		, 
                 gapay.address_line5		,
                 gapay.postcode			, 
                 parpay.tel_no			, 
                 pay.bank_sort_code		,
	         pay.acc_holder			, 
	         pay.bank_name			, 
	         pay.bank_info_1		,
	         pay.bank_info_2		, 
	         pay.bank_acc_no		, 
	         pay.giro_acc_no		,
	         pay.giro_trans_code_1		, 
	         pay.giro_trans_code_2		,
	         pay.apacs_trans_code
            INTO cv_payee_name			, 
                 cv_payee_addr_1		, 
                 cv_payee_addr_2		, 
                 cv_payee_addr_3		,
              	 cv_payee_addr_4		, 
              	 cv_payee_addr_5		, 
              	 cv_payee_postcode		, 
              	 cv_payee_tel_no		,
                 cv_payee_bank_sort_code	, 
                 cv_payee_acc_holder		, 
                 cv_payee_bank_name		,
                 cv_payee_bank_info_1		, 
                 cv_payee_bank_info_2		, 
                 cv_payee_bank_acc_no		,
                 cv_payee_giro_acc_no		, 
                 cv_payee_giro_trans_code_1	,
                 cv_payee_giro_trans_code_2	, 
                 cv_payee_apacs_trans_code
            FROM parties          parpay        ,
	         given_addresses  gapay         ,
	         payees           pay           ,
	         party_to_party_relationship  ptyptypay
           WHERE ptyptypay.party_a_id = c_judg_rec.party_id
             AND ptyptypay.party_a_role_code = c_judg_rec.party_type_code
             AND ptyptypay.party_b_role_code = 'NCP PAYEE'
             AND gapay.party_id = ptyptypay.party_b_id
             AND gapay.address_type_code = 'NCP PAYEE'
             AND gapay.valid_to IS NULL
             AND parpay.party_id = ptyptypay.party_b_id
             AND pay.party_id = ptyptypay.party_b_id;
       EXCEPTION
          WHEN NO_DATA_FOUND THEN NULL;
       END;
      
      END IF;
      
      
    /*-----------------------------------*
     * Now get the reference             *
     *-----------------------------------*/
    
     SELECT cprcprsol.personal_reference
       INTO cv_payee_ref_sol
       FROM cpr_to_cpr_relationship  cprcprsol
      WHERE cprcprsol.cpr_a_case_number = c_judg_rec.case_number
        AND cprcprsol.cpr_a_case_party_no = 1
        AND cprcprsol.cpr_a_party_role_code = 'CLAIMANT'
        AND cprcprsol.cpr_b_case_number = c_judg_rec.case_number
        AND cprcprsol.cpr_b_party_role_code = 'SOLICITOR'
        AND cprcprsol.deleted_flag = 'N';
    
    END IF;

    /*-----------------------------------*
     * Lastly use the correct reference  *
     *-----------------------------------*/

    IF c_judg_rec.payee_reference IS NOT NULL THEN
       cv_payee_ref := c_judg_rec.payee_reference;
    ELSE
      IF cv_payee_ref_sol IS NOT NULL THEN
         cv_payee_ref := cv_payee_ref_sol;
      ELSE
         cv_payee_ref := c_judg_rec.reference;
      END IF;
    END IF;

    INSERT INTO PRINT_JUDGMENTS
    ( 
      cred_code			, 
      judgment_type		, 
      rec_no			, 
      printed			, 
      case_number		,
      claimant_details_1	, 
      claimant_details_2	, 
      claimant_details_3	,
      claimant_details_4	, 
      claimant_details_5	, 
      claimant_details_6	,
      claimant_details_7	, 
      payee_name		, 
      payee_addr_1		, 
      payee_addr_2		,
      payee_addr_3		, 
      payee_addr_4		, 
      payee_addr_5		, 
      payee_postcode		, 
      payee_tel_no		,
      payee_reference		, 
      defendant_name		, 
      defendant_addr_1		, 
      defendant_addr_2		,
      defendant_addr_3		, 
      defendant_addr_4		, 
      defendant_addr_5		, 
      defendant_postcode	,
      defendant_dob		, 
      judgment_amount		, 
      total_costs		, 
      paid_before_judgment	, 
      total			,
      instalment_amount		, 
      instalment_period		, 
      first_payment_date	, 
      judgment_date		,
      slip_codeline_1		, 
      slip_codeline_2		, 
      payee_bank_sort_code	, 
      payee_acc_holder		,
      payee_bank_name		, 
      payee_bank_info_1		, 
      payee_bank_info_2		, 
      payee_bank_acc_no		,
      payee_giro_acc_no		, 
      payee_giro_trans_code_1	, 
      payee_giro_trans_code_2	,
      payee_apacs_trans_code 
      )
    VALUES
    ( c_judg_rec.code, 
      c_judg_rec.judgment_type, 
      nv_rec_number, 
      'N',
      c_judg_rec.case_number, 
      c_judg_rec.claimant_details_1,
      c_judg_rec.claimant_details_2, 
      c_judg_rec.claimant_details_3,
      c_judg_rec.claimant_details_4, 
      c_judg_rec.claimant_details_5,
      c_judg_rec.claimant_details_6, 
      c_judg_rec.claimant_details_7,
      cv_payee_name, 
      cv_payee_addr_1, 
      cv_payee_addr_2, 
      cv_payee_addr_3,
      cv_payee_addr_4, 
      cv_payee_addr_5, 
      cv_payee_postcode, 
      cv_payee_tel_no,
      cv_payee_ref, 
      c_judg_rec.name,
      c_judg_rec.addr_1, 
      c_judg_rec.addr_2, 
      c_judg_rec.addr_3,
      c_judg_rec.addr_4, 
      c_judg_rec.addr_5, 
      c_judg_rec.postcode,
      c_judg_rec.person_dob, 
      c_judg_rec.judgment_amount, 
      c_judg_rec.total_costs,
      c_judg_rec.paid_before_judgment, 
      c_judg_rec.total,
      c_judg_rec.instalment_amount, 
      c_judg_rec.instalment_period,
      c_judg_rec.first_payment_date, 
      c_judg_rec.judgment_date,
      c_judg_rec.slip_codeline_1, 
      c_judg_rec.slip_codeline_2,
      cv_payee_bank_sort_code, 
      cv_payee_acc_holder,
      cv_payee_bank_name, 
      cv_payee_bank_info_1,
      cv_payee_bank_info_2, 
      cv_payee_bank_acc_no,
      cv_payee_giro_acc_no, 
      cv_payee_giro_trans_code_1,
      cv_payee_giro_trans_code_2, 
      cv_payee_apacs_trans_code 
     );
    COMMIT;
    
  END LOOP;

END create_print_judgments;

/*------------------------------------------------*
 * Controlling procedure that will truncate the   *
 * print judgments table, clear down the logging  *
 * table and then run the create print judgments  *
 * code.                                          *
 *------------------------------------------------*/
  
 PROCEDURE run_print_judgments ( p_username IN VARCHAR2 )
 IS
 BEGIN

 -- Truncate the print judgments table.
 truncate_print_judgments;

 -- Run the create print judgments code. 
 create_print_judgments (p_username);

END run_print_judgments;
 
END create_judgmnt_print_file;
/

PROMPT ************************************************************************
PROMPT Package Body create_judgmnt_print_file created
PROMPT ************************************************************************


SHOW ERRORS


SPOOL OFF

