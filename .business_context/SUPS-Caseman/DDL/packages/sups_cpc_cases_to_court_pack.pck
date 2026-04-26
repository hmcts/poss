/*************************************************************************
 Module:            sups_cpc_cases_to_court_pack

 Description:       SUPS to SUPS Transfer script.
 					Transfers SUPS CPC Cases to SUPS Caseman.
 					Taken from the Legacy Caseman Central Server script, cases_to_court_pack.sql 
 					(which was taken in turn from case_transfer_pack.sql).
                    Originally written to transfer any type of Case, this script has been 
                    simplified to only handle SUPS CPC Cases.
 					The procedure "p_transfer_cpc_cases_to_cmcs()" is derived from the Legacy CPC shell script, SP_OP_U3.sh. 
 					The procedure "p_transfer_clear_down()" should also be called periodically to remove rows from staging 
 					tables. 

 Amendment History

 Version   Date         Name             Amendment
 ------------------------------------------------------------------------  
 1.4       06-May-1998  E Pepperday      Merged version 1.0.1.0 with version 1.3
                                         taking 1.0.1.0 as a baseline
                                         Amended p_create_remote_event
 1.5       07-May-1998  E Pepperday      Design Change 02AEN01069
                                         Changes due to AE tables   
 1.6       22-Jun-1998  E Pepperday      Design Change 02AEN01069/2
                                         Amended p_insert_judgments to
                                         populate judgment_court_code     
 1.7       25-Jun-1998  E Pepperday      Observation AE 700 - avoid use of   
                                         sysdate by using parameter 
                                         pv_system_date
 1.8       01-Jul-1998  E Pepperday      Amended p_ins_ce to ensure that
                                         the cursor is executed (AE 719)
 1.9       10-Jul-1998  E Pepperday      Amended f_get_remote_balance
                                         to reference AE_PACKAGE.
                                         f_calculate_outstanding_bal
 1.10      08-Oct-1998  N Morgan         Amended p_create_remote_event
 1.11      15-Oct-1998  P Scanlon        Modified to improve performance. 
                                         c_get_variations cursor changed
                                         to use an equi-join as opposed to a 
                                         corelated subquery
 1.12      26-Nov-1998  P Scanlon        Ensured each dbmssql cursor is closed
                                         after it is finished with.
 1.13      04-Jan-1999  E Pepperday      Amended p_create_remote_event (Initial IT)
 1.14	   03-Aug-1999  C Ferris	 Amended p_insert_ae - changed instances of
 1.50      			         pv_amount_of_ae to r_ae.amount_of_ae (SCR 70)
 1.51      03-SEP-1999  R Nagaratnam     (SCR213)- CPC cases are not required to update 
                                         the case event or judgment flag.
 1.17      14-Dec-1999  J Buchanan       SCR 390 - transfer 2 additional columns
                                         from ae_events table - process_stage
                                         and process_date.
 1.18      01-Feb-2000  C Davies         Case events split between pre-judgment                                          
                                         and post-judgment
 1.19      02-Mar-2000  J Spooner        Changes following code review.
 1.20      30-May-2000  H Orton          SCR 561 - Use trans_seq to avoid duplicate 
                                         records being transferred from Stockley
 1.22      30-Jun-2000  H Orton          changes to p_del_ae_events as per ST50089
 1.23      04-Jul-2000  H Orton          Changes to p_del_ae_events add )
 1.24      17-Aug-2000  J Buchanan       SCR 633 (RFC433 PT 2) added new 
                                         procedures for transfer of ECHR details.
 R Mistry  21/07/00  Changes made for CaseMan+ WFT (L2 design ref:2.5.1.2) 

 J Williams 7/08/00  Changes made for CaseMan+ DMS (L2 design ref:2.5.1.1) 

 H Orton   22/12/00  STO 50478 added the use of trans_seq to wft,wfte and obligations

-------------------------------------------------------------------------------
New PVCS version number after receipt from Caseman+ team.
-------------------------------------------------------------------------------
 1.1	   24/09/01	D.Holder	SCR728 enable correct transfer of error
					flags on case events.
 1.2	   08/10/01	D.Holder	SCR718 added new function 
					ind_ae_exists_on_remote to test if an
					ae exists.  Added call to new function
					to procedure p_update_ae.
 1.3	   30/10/01	D.Holder	SCR717 updated processing to transfer 
					the AE_EVENTS field REPORT_VALUE_1. 
 1.4	   28/03/02	K Miles		SCR819 Proc p_get_post_transfer_data 
                                        added to transfer data added after case
                                        transferred.
 1.6       16/04/02     Doug Mayger     SCR819 Proc p_get_post_transfer_data
                                        ensure obligation seq defaults to a
                                        value when no rows found at CS
 1.7 	   20/06/02 J.Edgar	SCR697 amended insert_defendants procedure.

 1.8       18/06/03     Jim M Earwicker SCR841 Add trans_seq to following update
    					statements: p_update_sp_ae_event_seq,
					p_update_sp_event_seq,p_update_sp_judg_seq,
					p_update_sp_vary_seq,p_lookup_new_ae_event_seq,
					p_lookup_new_event_seq,p_lookup_new_judg_seq,
					p_lookup_new_vary_seq
1.9      19/05/04 J.Edgar     SCR996 Comment out and make null the procedure 
                              P_DEL_MANUAL_CE
1.10	 11/05/05 K.Banga	SCR1026 Update p_update_case procedure to clear
									the xfer_reciept_date field when exisiting case
									is transferred in (desintation_cursor).
1.11     15/07/05 H. Patrick    SCR1037 Add trans_seq to calls to 
                                p_update_sp_obln_event_seq and
                                p_update_sp_obln_ae_event_seq
-------------------------------------------------------------------------------
New version number after translation for the SUPS project.
-------------------------------------------------------------------------------
1.1     10/02/06 P.Haferer		Created SUPS Version of the package.
1.2     01/09/06 P.Haferer		Change to update PARTY_ID in GIVEN_ADDRESSES table, in response to 
                                TD CASEMAN 4958: PARTY_ID not populated in GIVEN_ADDRESSES.
1.3     02/11/06 P.Haferer		Modified p_transfer_cpc_cases_to_cmcs() - added a 2nd 'shuffle' loop 
                                to ensure that the 2nd line of the address has at least a '.' in it.
1.4     08/12/06 P.Haferer		Modified p_transfer_cpc_cases_to_cmcs() - testing identified that 
                                if the columns CLAIMANT_DETAILS_1 and CLAIMANT_DETAILS_2 contain 
                                more than 35 characters in total an error is thrown, because the 
                                variable used by the assignment did not allow for possible 70
                                characters for which the column PLAINTIFF_DETAILS_1 allows.
                                Introduced the intermediate variable "v_plaintiff_details_1" to 
                                accommodate this requirement.
                                
1.5     18/07/07 Chris Hutt     Defect UCT Group2: 1482
                                CASES.COURT_FEE not being updated.

1.6     20/07/08 D.Gwynne       Defect CaseMan 5665
                                v_plaintiff_details_1 initialised and always set   

1.7		19/09/11 C Vincent		Trac 4553.
								Change to p_insert_party to include checks for the new CCBC Coded
								Party ranges.
                                
*******************************************************************************/

create or replace package sups_cpc_cases_to_court_pack is
    v_trans_seq cmcs_cases.trans_seq%type;
    v_case_number cmcs_cases.case_number%type;
    v_case_type  cmcs_cases.case_type%type;
    v_admin_crt_code cmcs_cases.admin_crt_code%type;
    v_amount_claimed cmcs_cases.amount_claimed%type;
    v_amount_claimed_currency cmcs_cases.amount_claimed_currency%type;
    v_court_fee cmcs_cases.court_fee%type;
    v_court_fee_currency cmcs_cases.court_fee_currency%type;
    v_solicitors_costs cmcs_cases.solicitors_costs%type;
    v_solicitors_costs_currency cmcs_cases.solicitors_costs_currency%type;
    v_total cmcs_cases.total%type;
    v_total_currency cmcs_cases.total_currency%type;
    v_date_of_issue cmcs_cases.date_of_issue%type;
    v_brief_details_of_claim cmcs_cases.brief_details_of_claim%type;
    v_particulars_of_claim cmcs_cases.particulars_of_claim%type;
    v_rep_code cmcs_cases.rep_code%type;
    v_rep_name cmcs_cases.rep_name%type;
    v_rep_addr_1 cmcs_cases.rep_addr_1%type;
    v_rep_addr_2 cmcs_cases.rep_addr_2%type;
    v_rep_addr_3 cmcs_cases.rep_addr_3%type;
    v_rep_addr_4 cmcs_cases.rep_addr_4%type;
    v_rep_addr_5 cmcs_cases.rep_addr_5%type;
    v_rep_postcode cmcs_cases.rep_postcode%type;
    v_rep_tel_no cmcs_cases.rep_tel_no%type;
    v_reference cmcs_cases.reference%type;
    v_rep_dx cmcs_cases.rep_dx%type;
    v_pltf_code cmcs_cases.pltf_code%type;
    v_plaintiff_details_1 cmcs_cases.plaintiff_details_1%type;
    v_plaintiff_details_2 cmcs_cases.plaintiff_details_2%type;
    v_plaintiff_details_3 cmcs_cases.plaintiff_details_3%type;
    v_plaintiff_details_4 cmcs_cases.plaintiff_details_4%type;
    v_plaintiff_details_5 cmcs_cases.plaintiff_details_5%type;
    v_plaintiff_details_6 cmcs_cases.plaintiff_details_6%type;
    v_plaintiff_details_7 cmcs_cases.plaintiff_details_7%type;
    v_plaintiff_reference cmcs_cases.plaintiff_reference%type;
	v_plaintiff_postcode cmcs_cases.plaintiff_postcode%type;
    v_pltf_dx cmcs_cases.pltf_dx%type;
    v_trans_crt_code cmcs_cases.trans_crt_code%type;
    v_plaintiff_tel_no cmcs_cases.plaintiff_tel_no%type;
    v_plaintiff_fax_no cmcs_cases.plaintiff_fax_no%type;
    v_plaintiff_email_addr cmcs_cases.plaintiff_email_addr%type;
    v_plaintiff_pcm cmcs_cases.plaintiff_pcm%type;
    v_date_of_transfer cmcs_cases.date_of_transfer%type;
    v_status cmcs_cases.status%type;
    v_transfer_reason cmcs_cases.transfer_reason%type;
    v_payee_flag cmcs_cases.payee_flag%type;
    v_transfer_status cmcs_cases.transfer_status%type;
    v_date_transferred_in cmcs_cases.date_transferred_in%type;
    v_db_name  courts.database_name%type;
    v_new_court boolean;
    v_delete_defendant boolean;
    v_old_court_name courts.name%type;
    d_id cmcs_defendants.id%type;
    d_name cmcs_defendants.name%type;
    d_date_of_service_ro cmcs_defendants.date_of_service_ro%type;
    d_date_of_service_other cmcs_defendants.date_of_Service_other%type;
    d_bar_judgment cmcs_defendants.bar_judgment%type;

	/* Constants: Party Role Codes. */
    C_PARTY_ROLE_CODE_CLAIMANT  CONSTANT party_roles.party_role_code%type := 'CLAIMANT';
    C_PARTY_ROLE_CODE_DEFENDANT CONSTANT party_roles.party_role_code%type := 'DEFENDANT';
    C_PARTY_ROLE_CODE_SOLICITOR CONSTANT party_roles.party_role_code%type := 'SOLICITOR';

	/* Constants: Address Type Codes. */
    C_ADDRESS_TYPE_CODE_SERVICE CONSTANT party_roles.party_role_code%type := 'SERVICE';
    
    /* Constants: Transfer Status. */
    C_TRANSFER_STATUS_READY      CONSTANT cmcs_cases.transfer_status%type := '1';
    C_TRANSFER_STATUS_SUCCESSFUL CONSTANT cmcs_cases.transfer_status%type := '2';
                                

function f_coded_party_exists (fv_rep_code in number) return boolean ;
function f_get_coded_party_id(pv_code in varchar2) return parties.party_id%type;
procedure p_start_transfer (pv_court_code in number, pv_user in VARCHAR2, pv_system_date date DEFAULT NULL);
procedure p_insert_case (
            pv_case_number in varchar2,             
            pv_case_type in varchar2,               
            pv_admin_crt_code in number,            
            pv_amount_claimed in number,            
            pv_amount_claimed_currency in varchar2, 
            pv_court_fee in number ,                
            pv_court_fee_currency in varchar2 ,     
            pv_solicitors_costs in number ,         
            pv_solicitors_costs_currency in varchar2,
            pv_total in number ,                    
            pv_total_currency in varchar2 ,         
            pv_date_of_issue in date,               
            pv_brief_details_of_claim in varchar2,  
            pv_particulars_of_claim in varchar2,    
            pv_rep_code in number,                  
            pv_rep_coded_party_id in number,                  
            pv_reference in varchar2,               
            pv_plaintiff_details_1 in out varchar2, 
            pv_plaintiff_details_3 in out varchar2, 
            pv_plaintiff_details_4 in out varchar2, 
            pv_plaintiff_details_5 in out varchar2, 
            pv_plaintiff_details_6 in out varchar2, 
            pv_plaintiff_details_7 in out varchar2, 
            pv_plaintiff_postcode in out varchar2,  
            pv_plaintiff_tel_no in out varchar2,    
            pv_plaintiff_fax_no in out varchar2,    
            pv_plaintiff_email_addr in out varchar2,
            pv_plaintiff_pcm in out varchar2,       
            pv_plaintiff_reference in varchar2,     
            pv_pltf_dx in out varchar2,             
            pv_trans_crt_code in number,            
            pv_date_of_transfer in date,            
            pv_status in out varchar2,              
            pv_transfer_reason in varchar2,         
            pv_payee_flag in varchar2,              
            pv_transfer_status in out varchar2,     
            pv_date_transferred_in in out date,     
            pv_system_date in date,                 
            pv_user in varchar2) ;
procedure p_insert_defendants (pv_case_number in varchar2,
                               pv_id in number,
                               pv_name in varchar2,
                               pv_date_of_service_ro in date,
                               pv_date_of_service_other in date) ;
procedure p_insert_addresses (pv_case_number in varchar2,
                              pv_trans_seq in number) ; -- SCR 561
function f_fmt_postcode(postcode_in in varchar2) return varchar2;
procedure p_update_local (pv_case_number in varchar2,
                          pv_trans_seq in number) ; -- SCR 561
procedure p_transfer_cpc_cases_to_cmcs(p_user in varchar2);

/******************************************************************************************************************/
/* TYPE			: PROCEDURE                                                                                       */
/* NAME			: p_transfer_clear_down                                                                           */	
/* DESCRIPTION	: Deletes rows from the following staging tables that have been successfully transferred over     */
/*                3 days prior :-                                                                                 */
/*                  CMCS_CASES, CMCS_DEFENDANTS, and CMCS_DEFENDANT_ADDRESSES.                                    */
/*                Also, the CMCS_TRANSFER_CONTROL table is also cleared down of records more than 50 days old.    */
/******************************************************************************************************************/
PROCEDURE p_transfer_clear_down;

/******************************************************************************************************************/
/* TYPE			: PROCEDURE                                                                                       */
/* NAME			: p_trans_cpc_cases_to_caseman                                                                 */	
/* DESCRIPTION	: This procedure will perform the complete transfer, end to end, of Cases from SUPS CPC           */
/*                to SUPS Caseman, via staging tables, and will also perform housekeeping on those staging tables.*/
/*                It calls the three main entry points :-                                                         */
/*                  p_transfer_cpc_cases_to_cmcs(), p_start_transfer() and p_transfer_clear_down().               */
/*                If this implementation does not suit scheduling requirements, these entry points may called     */
/*                individually, as appropriate.                                                                   */
/******************************************************************************************************************/
PROCEDURE p_trans_cpc_cases_to_caseman( 
    	pv_user in VARCHAR2,
    	pv_clear_down in CHAR DEFAULT 'Y');
    	
end sups_cpc_cases_to_court_pack;
/
create or replace package body sups_cpc_cases_to_court_pack is

	/******************************************************************************************************************/
	/* TYPE			: PROCEDURE                                                                                       */
    /* NAME			: p_start_transfer                                                                                */	
	/* DESCRIPTION	: Transfers records from SUPS Caseman Central Server staging tables to the main SUPS Caseman      */
	/*                databases tables for the specified Court.                                                       */
	/*                pv_court_code is used to select receiving_court_code.                                           */
	/*                pv_system_date replaces any use of sysdate.                                                     */ 
 	/******************************************************************************************************************/

procedure p_start_transfer(
	pv_court_code in number,
	pv_user in VARCHAR2,
	pv_system_date date DEFAULT NULL) is
	
	cursor get_cases_to_transfer is
		select ca.trans_seq                     
		,      ca.case_number                   
		,      ca.case_type                     
		,      ca.admin_crt_code                
		,      ca.amount_claimed                
		,      ca.amount_claimed_currency       
		,      ca.court_fee                     
		,      ca.court_fee_currency            
		,      ca.solicitors_costs              
		,      ca.solicitors_costs_currency     
		,      ca.total                         
		,      ca.total_currency                
		,      ca.date_of_issue                 
		,      ca.brief_details_of_claim        
		,      ca.particulars_of_claim          
		,      ca.rep_code                      
		,      ca.rep_name                      
		,      ca.rep_addr_1                    
		,      ca.rep_addr_2                    
		,      ca.rep_addr_3                    
		,      ca.rep_addr_4                    
		,      ca.rep_addr_5                    
		,      ca.rep_postcode                  
		,      ca.rep_tel_no                    
		,      ca.reference                     
		,      ca.rep_dx                        
		,      ca.pltf_code                     
		,      ca.plaintiff_details_1           
		,      ca.plaintiff_details_2           
		,      ca.plaintiff_details_3           
		,      ca.plaintiff_details_4           
		,      ca.plaintiff_details_5           
		,      ca.plaintiff_details_6           
		,      ca.plaintiff_details_7           
		,      ca.plaintiff_postcode            
		,      ca.plaintiff_tel_no              
		,      ca.plaintiff_fax_no              
		,      ca.plaintiff_email_addr          
		,      ca.plaintiff_pcm                 
		,      ca.plaintiff_reference           
		,      ca.pltf_dx                       
		,      ca.trans_crt_code                
		,      ca.date_of_transfer              
		,      ca.status                        
		,      ca.transfer_reason               
		,      ca.payee_flag                    
		,      ca.transfer_status               
		,      ca.date_transferred_in           
		from   cmcs_cases            ca
		,      cmcs_transfer_control tc
		where  ca.transfer_status = C_TRANSFER_STATUS_READY
		and    ca.trans_crt_code  = pv_court_code
		and    ca.trans_seq       = tc.trans_seq              
		order  by ca.trans_crt_code ;
	
	   v_system_date date; -- AE 700
     v_rep_coded_party_id parties.party_id%type;
begin

	/******************************************************************/
	/* If pv_system_date parameter is NULL then set to sysdate AE 700 */
	/******************************************************************/
	v_system_date := NVL(pv_system_date,trunc(sysdate));

	open get_cases_to_transfer;
	loop
    	fetch get_cases_to_transfer
		into v_trans_seq                
		,    v_case_number              
		,    v_case_type                
		,    v_admin_crt_code           
		,    v_amount_claimed           
		,    v_amount_claimed_currency  
		,    v_court_fee                
		,    v_court_fee_currency       
		,    v_solicitors_costs         
		,    v_solicitors_costs_currency
		,    v_total                    
		,    v_total_currency           
		,    v_date_of_issue            
		,    v_brief_details_of_claim   
		,    v_particulars_of_claim     
		,    v_rep_code                 
		,    v_rep_name                 
		,    v_rep_addr_1               
		,    v_rep_addr_2               
		,    v_rep_addr_3               
		,    v_rep_addr_4               
		,    v_rep_addr_5               
		,    v_rep_postcode             
		,    v_rep_tel_no               
		,    v_reference                
		,    v_rep_dx                   
		,    v_pltf_code                
		,    v_plaintiff_details_1      
		,    v_plaintiff_details_2      
		,    v_plaintiff_details_3      
		,    v_plaintiff_details_4      
		,    v_plaintiff_details_5      
		,    v_plaintiff_details_6      
		,    v_plaintiff_details_7      
		,    v_plaintiff_postcode       
		,    v_plaintiff_tel_no         
		,    v_plaintiff_fax_no         
		,    v_plaintiff_email_addr     
		,    v_plaintiff_pcm            
		,    v_plaintiff_reference      
		,    v_pltf_dx                  
		,    v_trans_crt_code           
		,    v_date_of_transfer         
		,    v_status                   
		,    v_transfer_reason          
		,    v_payee_flag               
		,    v_transfer_status          
		,    v_date_transferred_in;
    	exit when get_cases_to_transfer%notfound;
    
        begin
            /* If a CPC Coded Creditor referred to be the Case/Claim that is about to inserted, 
               does not exist as a National Coded Party in the Caseman, the overall transaction 
               for the insertion of the Case will not be performed.
               The Case will then remain in the staging tables, until the National Coded Party 
               has been created.
               A manual business process should exist which identifies Claims/Cases then are 
               awaiting completion of the transfer.
            */
            v_rep_coded_party_id := f_get_coded_party_id(v_rep_code);
            if v_rep_coded_party_id is not null then
            	p_insert_case(
            	       v_case_number,
            	       v_case_type,
            	       v_admin_crt_code,
            	       v_amount_claimed,
            	       v_amount_claimed_currency,
            	       v_court_fee,
            	       v_court_fee_currency,
            	       v_solicitors_costs,
            	       v_solicitors_costs_currency,
            	       v_total,
            	       v_total_currency,
            	       v_date_of_issue,
            	       v_brief_details_of_claim,
            	       v_particulars_of_claim,
            	       v_rep_code,
            	       v_rep_coded_party_id,
            	       v_reference,
            	       v_plaintiff_details_1, 
            	       v_plaintiff_details_3,
            	       v_plaintiff_details_4,
            	       v_plaintiff_details_5,
            	       v_plaintiff_details_6,
            	       v_plaintiff_details_7,
            	       v_plaintiff_postcode,
            	       v_plaintiff_tel_no,     
            	       v_plaintiff_fax_no,     
            	       v_plaintiff_email_addr, 
            	       v_plaintiff_pcm,        
                       v_plaintiff_reference,
            	       v_pltf_dx,
            	       v_trans_crt_code,
            	       v_date_of_transfer,
            	       v_status,
            	       v_transfer_reason,
            	       v_payee_flag,
            	       v_transfer_status,
            	       v_date_transferred_in,
            	       v_system_date,
            	       pv_user);
                    
            	/* CPC Defendants don't have Solicitors, and so are not retrieved by this select. */
            	declare cursor c_get_defendants is
            		select d.id
            		,      d.name
            		,      d.date_of_service_ro
            		,      d.date_of_service_other
            		from   cmcs_defendants d
            		where  d.case_number = v_case_number
            		and    d.trans_seq   = v_trans_seq; -- SCR 561
            	begin
            		open c_get_defendants;
            		loop
            			fetch c_get_defendants 
            				into d_id
            				,    d_name
            				,    d_date_of_Service_ro
            				,    d_date_of_Service_other;
            			exit when c_get_defendants%notfound;
                        
            			p_insert_defendants(
            				v_case_number,
            				d_id,
            				d_name,
            				d_date_of_service_ro,
            				d_date_of_service_other);
            		end loop;
            		close c_get_defendants; 
            	end;
            
                p_insert_addresses(
                    v_case_number,
                    v_trans_seq); -- SCR 561
            
                p_update_local(
                    v_case_number,
                    v_trans_seq); -- SCR 561
                
                /**********************************************************
                 SCR213, Cases transferred from CPC (NOT CCBC) then do           
                 not update the case_event table. Cases trasferred from CPC
                 always start with J or X or Q and previous_court is null.
                 Only create the 'Transfer In' Case Event if Case is not from the CPC, 
                 i.e. previous_court is not null and sending_court is 335. 
                ***********************************************************/
                    
                commit;
            end if; /* if v_rep_coded_party_id is not null */
        exception
            when others then
                rollback;
        end;            
    end loop;
    close get_cases_to_transfer;
end;

function f_coded_party_exists(
	fv_rep_code in number)
	return boolean is

	CURSOR c_coded_party_exists IS
		select null
		from   coded_parties cp
		where  cp.code = fv_rep_code;
   
   v_value varchar2(1);
   v_result boolean;
begin
	OPEN c_coded_party_exists;
	FETCH c_coded_party_exists INTO v_value;
	v_result := c_coded_party_exists%FOUND;  
	CLOSE c_coded_party_exists;
	return(v_result);
exception
   when others then
      raise_application_error(-20010,'coded_party_exists '||sqlerrm);
end f_coded_party_exists;

function f_parties_nextval return parties.party_id%type is
	cursor c_parties_nextval is 
		select parties_sequence.nextval from dual;
		
	v_party_id parties.party_id%type;
begin
    open c_parties_nextval;
    fetch c_parties_nextval into v_party_id;
    close c_parties_nextval;

    return(v_party_id);
exception
   when others then
      raise_application_error(-20010,'f_parties_nextval '||sqlerrm);
end;

function f_get_coded_party_id(pv_code in varchar2) return parties.party_id%type is
	cursor c_get_coded_party_id(
		pv_code coded_parties.code%type) is
		select cp.party_id
		from   coded_parties cp
		where  cp.code = pv_code;

	v_coded_party_id		parties.party_id %type;
begin
	open c_get_coded_party_id(pv_code);
	fetch c_get_coded_party_id into v_coded_party_id;
	close c_get_coded_party_id;

    return(v_coded_party_id);
exception
   when others then
      raise_application_error(-20010,'f_get_coded_party_id '||sqlerrm);
end f_get_coded_party_id;

procedure p_insert_case(
	pv_case_number in varchar2,
	pv_case_type in varchar2,
	pv_admin_crt_code in number,
	pv_amount_claimed in number,
	pv_amount_claimed_currency in varchar2,
	pv_court_fee in number ,
	pv_court_fee_currency in varchar2 ,
	pv_solicitors_costs in number ,
	pv_solicitors_costs_currency in varchar2 ,
	pv_total in number ,
	pv_total_currency in varchar2 ,
	pv_date_of_issue in date,
	pv_brief_details_of_claim in varchar2,
	pv_particulars_of_claim in varchar2,
	pv_rep_code in number,
	pv_rep_coded_party_id in number,
	pv_reference in varchar2, 
	pv_plaintiff_details_1 in out varchar2,
	pv_plaintiff_details_3 in out varchar2,
	pv_plaintiff_details_4 in out varchar2,
	pv_plaintiff_details_5 in out varchar2,
	pv_plaintiff_details_6 in out varchar2,
	pv_plaintiff_details_7 in out varchar2,
	pv_plaintiff_postcode in out varchar2,
	pv_plaintiff_tel_no in out varchar2,
	pv_plaintiff_fax_no in out varchar2,
	pv_plaintiff_email_addr in out varchar2,
	pv_plaintiff_pcm in out varchar2,
	pv_plaintiff_reference in varchar2,
	pv_pltf_dx in out varchar2,
	pv_trans_crt_code in number,
	pv_date_of_transfer in date,
	pv_status in out varchar2,
	pv_transfer_reason in varchar2,
	pv_payee_flag in varchar2,
	pv_transfer_status in out varchar2,
	pv_date_transferred_in in out date,
	pv_system_date in date,
	pv_user in varchar2) is
/*
*******************************************************************
* Ok link obtained so need to insert into table                   *
*******************************************************************
*/
	v_claimant_party_id		parties.party_id %type;
begin   
	pv_transfer_status := null;
	pv_date_transferred_in := pv_system_date;
	pv_status := null;
   
	/* SUPS Caseman Persistance.
	   Three entities are passed in this method's parameters: Cases, Claimants, and the Claimant's Solicitor.
	   In legacy, these were all persisted in the CASES table.
	   In SUPS, the Claimant and Solicitor have been extracted from the CASES table.
	   In CPC, the Claimant's Solicitor is known as a "Coded Creditor", and is always a Coded Party.
	   As such, there is never a need to create PARTIES, or GIVEN_ADDRESSES rows for this Solicitor.
	   Only a CASE_PARTY_ROLES row need to be created to link the Coded Party into the Case.
	 */

	/* Persist the Case. */
	/* ----------------- */
	insert into cases            
	(case_number                 	
	,case_type                   	
	,admin_crt_code              	
	,amount_claimed              	
	,amount_claimed_currency        
	,court_fee                   	
	,court_fee_currency           	
	,solicitors_costs            	
	,solicitors_costs_currency   	
	,total                       	
	,total_currency                	
	,date_of_issue               	
	,brief_details_of_claim      	
	,particulars_of_claim        	
	,trans_crt_code              	
	,date_of_transfer            	
	,status                      	
	,transfer_reason             	
	,previous_court              	
	,transfer_status             	
	,date_transferred_in         	
	) values                     	
	(pv_case_number                 
	,pv_case_type                   
	,pv_trans_crt_code              
	,pv_amount_claimed              
	,pv_amount_claimed_currency     
	,pv_court_fee                   
	,pv_court_fee_currency          
	,pv_solicitors_costs            
	,pv_solicitors_costs_currency            
	,pv_total                       
	,pv_total_currency              
	,pv_date_of_issue               
	,pv_brief_details_of_claim      
	,pv_particulars_of_claim        
	,null                           
	,pv_date_of_transfer            
	,null                           
	,pv_transfer_reason
	,pv_admin_crt_code              
	,pv_transfer_status             
	,pv_date_transferred_in         
	);                              

	/* Persist the Claimant's Solicitor. */
	/* --------------------------------- */
	insert into case_party_roles
	(case_number                      
	,party_id                         
	,party_role_code                  
	,case_party_no                    
	) values                          
	(pv_case_number     
	,pv_rep_coded_party_id
	,C_PARTY_ROLE_CODE_SOLICITOR        
	,1                  
	);                  
	
	/* Persist the Claimant. */
	/* --------------------- */
	/* CPC Claimant's are never Coded parties. 
	   Unused parameter: 
			pv_pltf_code 
	*/
    v_claimant_party_id := f_parties_nextval();

	insert into parties 
	(party_id					     
	,person_requested_name		     
	,email_address                   
	,fax_number                      
	,tel_no                          
	,dx_number                       
	) values 					     
	(v_claimant_party_id    
	,pv_plaintiff_details_1 
	,pv_plaintiff_email_addr
	,pv_plaintiff_fax_no    
	,pv_plaintiff_tel_no    
	,pv_pltf_dx             
	);                      
	
    pv_plaintiff_postcode := f_fmt_postcode(pv_plaintiff_postcode);
  
	insert into case_party_roles
	(case_number                      
	,party_id                         
	,party_role_code                  
	,case_party_no                    
	,reference                        
	,payee_flag                       
	,preferred_communication_method   
	) values                          
	(pv_case_number        
	,v_claimant_party_id   
	,C_PARTY_ROLE_CODE_CLAIMANT            
	,1                     
	,pv_plaintiff_reference
	,pv_payee_flag         
	,pv_plaintiff_pcm      
	);                     
	
	insert into given_addresses
	(address_id				
	,address_line1			
	,address_line2          
	,address_line3          
	,address_line4          
	,address_line5          
	,postcode               
	,valid_from             
	,case_number            
	,party_role_code        
	,address_type_code      
	,updated_by             
	,case_party_no          
	,party_id
	) values          
	(addr_sequence.nextval 
	,pv_plaintiff_details_3
	,pv_plaintiff_details_4
	,pv_plaintiff_details_5
	,pv_plaintiff_details_6
	,pv_plaintiff_details_7
	,pv_plaintiff_postcode
	,trunc(sysdate)        
	,pv_case_number        
	,C_PARTY_ROLE_CODE_CLAIMANT            
	,C_ADDRESS_TYPE_CODE_SERVICE             
	,pv_user               
	,1       
	,v_claimant_party_id
	);

	/* Persist the relationship between the Claimant and their Solicitor. */
	insert into cpr_to_cpr_relationship 
	(cpr_a_case_number      
	,cpr_a_party_role_code  
	,cpr_b_party_role_code  
	,cpr_b_case_number      
	,cpr_b_case_party_no    
	,cpr_a_case_party_no    
	,deleted_flag           
	,personal_reference     
	) values	
	(pv_case_number
	,C_PARTY_ROLE_CODE_CLAIMANT    
	,C_PARTY_ROLE_CODE_SOLICITOR   
	,pv_case_number
	,1             
	,1             
	,'N'           
	,pv_reference  
	);
	
exception 
   when others then 
      raise_application_error (-20010,'p_insert_case'||sqlerrm||pv_rep_code||pv_case_number);
end;



procedure p_insert_defendants(
	pv_case_number in varchar2,
	pv_id in number,
	pv_name in varchar2,
	pv_date_of_service_ro in date,
	pv_date_of_service_other in date) is

	v_party_id parties.party_id%type;
begin
    v_party_id := f_parties_nextval();
    
	insert into parties
    (party_id
    ,person_requested_name
	) values
	(v_party_id
	,pv_name
	);

	insert into case_party_roles
    (case_number                      
    ,party_id                         
    ,party_role_code                  
    ,case_party_no                    
    ,deft_date_of_service_ro          
    ,deft_date_of_service             
    ) values                          
    (pv_case_number              
    ,v_party_id                  
    ,C_PARTY_ROLE_CODE_DEFENDANT 
    ,pv_id                       
    ,pv_date_of_service_ro       
    ,pv_date_of_service_other    
    );                           	

exception
   when others then 
      raise_application_error(-20010,'p_insert_defendants '||sqlerrm);
end;

/*
**************************************************
* Insert coded parties if does not exist
**************************************************
*/
procedure p_insert_party (pv_code in number,
                          pv_name in varchar2,
                          pv_addr_1 in varchar2,
                          pv_addr_2 in varchar2,
                          pv_addr_3 in varchar2,
                          pv_addr_4 in varchar2,
                          pv_addr_5 in varchar2,
                          pv_postcode in varchar2,
                          pv_tel_no in varchar2,
                          pv_dx_number in varchar2) is

	v_is_ccbc_national_coded_party boolean;
	v_coded_party_court_code       coded_parties.admin_court_code%type;
	v_ncp_party_id                 parties.party_id%type;
	v_payee_party_id               parties.party_id%type;

begin
	if pv_code between 1500 and 1999 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 7355 and 7455 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 7517 and 7586 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 7588 and 7675 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 7720 and 7772 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 7791 and 7828 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 7835 and 7894 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 7909 and 7977 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 8247 and 8298 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 8334 and 8361 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 8636 and 8675 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 8677 and 8724 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 8825 and 8854 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 8930 and 8964 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 9530 and 9632 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 9634 and 9666 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 9668 and 9755 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 9790 and 9822 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;
	elsif pv_code between 9907 and 9960 then
		v_is_ccbc_national_coded_party := true;
		v_coded_party_court_code := 335;	
	else
		v_is_ccbc_national_coded_party := false;
		v_coded_party_court_code := 0;
	end if;
			
    v_ncp_party_id := f_parties_nextval();

	INSERT INTO PARTIES 
	(	PARTY_ID
	, 	PERSON_REQUESTED_NAME
	,   TEL_NO
	,   DX_NUMBER
	) VALUES 
	(	v_ncp_party_id
	, 	pv_name
	,   pv_tel_no
	,   pv_dx_number
	);
	
	INSERT INTO CODED_PARTIES 
	(	PARTY_ID
	, 	CODE
	, 	ADMIN_COURT_CODE
	) VALUES 
	(	v_ncp_party_id
	, 	pv_code
	, 	v_coded_party_court_code
	);
	
	INSERT INTO GIVEN_ADDRESSES 
	(	ADDRESS_ID
	, 	ADDRESS_LINE1
	, 	ADDRESS_LINE2
	, 	ADDRESS_LINE3
	, 	ADDRESS_LINE4
	, 	ADDRESS_LINE5
	, 	POSTCODE
	, 	ADDRESS_TYPE_CODE
	, 	PARTY_ID
	) VALUES 
	(	ADDR_SEQUENCE.NEXTVAL
	, 	pv_addr_1
	, 	pv_addr_2
	, 	pv_addr_3
	, 	pv_addr_4
	, 	pv_addr_5
	,   f_fmt_postcode(pv_postcode)
	, 	'CODED PARTY'
	, 	v_ncp_party_id);

	if v_is_ccbc_national_coded_party then
        v_payee_party_id := f_parties_nextval();

		INSERT INTO NATIONAL_CODED_PARTIES 
		(	CODE
		, 	ADMIN_COURT_CODE
		) VALUES 
		(	pv_code
		, 	v_coded_party_court_code
		);

		INSERT INTO PARTIES 
		(	PARTY_ID
		) VALUES 
		(	v_payee_party_id
        );
		
		INSERT INTO PAYEES 
		(	PARTY_ID
		) VALUES 
		(	v_payee_party_id
		);
		
		INSERT INTO GIVEN_ADDRESSES 
		(	ADDRESS_ID
		, 	ADDRESS_TYPE_CODE
		, 	PARTY_ID
		) VALUES 
		(	ADDR_SEQUENCE.NEXTVAL
		, 	'NCP PAYEE'
		, 	v_payee_party_id);
		
		INSERT INTO PARTY_TO_PARTY_RELATIONSHIP
		(	PARTY_A_ID
		, 	PARTY_B_ID
		, 	PARTY_A_ROLE_CODE
		, 	PARTY_B_ROLE_CODE
		) VALUES	
		(	v_ncp_party_id
		,	v_payee_party_id
		,	'NCP'
		,	'NCP PAYEE');		
	end if;
	
exception
   when others then
      raise_application_error (-20010,'p_insert_party '||sqlerrm);
end;

/******************************************************************************************************************/
/* TYPE			: FUNCTION                                                                                        */
/* NAME			: f_fmt_postcode                                                                                  */
/* DESCRIPTION	: Validates Postcodes, changing invalid values into nulls.                                        */
/*                Taken from the Legacy Court to SUPS Migration code.                                             */
/******************************************************************************************************************/
FUNCTION f_fmt_postcode(
    POSTCODE_IN IN VARCHAR2)
    RETURN VARCHAR2
    IS

  V_POSTCODE     VARCHAR2(8);
  V_CODE_OUTWARD VARCHAR2(4);
  V_CODE_INWARD  VARCHAR2(3);
  V_VALID        BOOLEAN;
  V_FORMAT       VARCHAR2(8);

BEGIN

  V_VALID := NULL;
  V_POSTCODE := REPLACE(UPPER(POSTCODE_IN), ' ');

  CASE
    WHEN V_POSTCODE IS NULL THEN
      V_VALID := TRUE;
    WHEN V_POSTCODE = 'GIR0AA' THEN
      V_VALID := TRUE;
      V_CODE_OUTWARD := 'GIR';
      V_CODE_INWARD := '0AA';
    WHEN LENGTH (V_POSTCODE) < 5 THEN
      V_VALID := FALSE;
    WHEN LENGTH (V_POSTCODE) =8 THEN
      V_VALID := FALSE;
    ELSE
      V_CODE_OUTWARD := SUBSTR(V_POSTCODE, 1, LENGTH(V_POSTCODE) - 3);
      V_CODE_INWARD  := SUBSTR(V_POSTCODE, LENGTH(V_POSTCODE) - 2);
      V_FORMAT := TRANSLATE(V_CODE_OUTWARD || ' ' || V_CODE_INWARD,
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                    'AAAAAAAAAAAAAAAAAAAAAAAAAA9999999999');
      CASE
        WHEN V_FORMAT NOT IN ('A9 9AA','A99 9AA','AA9 9AA','AA99 9AA','A9A 9AA','AA9A 9AA') THEN
          V_VALID := FALSE;
        -- AN 13/12/05--
        -- DONT NEED THIS VALIDATION AS ROYALMAIL DEFENATION IN PAF_DIGEST
        --WHEN SUBSTR(V_CODE_OUTWARD,2,1) IN ('I','Z') THEN
        --THIS PATTERN IS NOT VALID 'AAA 9AA'
        --V_VALID := FALSE;
        WHEN SUBSTR(V_CODE_INWARD,2,1) IN ('C','I','K','M','O','V') THEN
          V_VALID := FALSE;
        WHEN SUBSTR(V_CODE_INWARD,3,1) IN ('C','I','K','M','O','V') THEN
          V_VALID := FALSE;
        ELSE V_VALID := TRUE;
      END CASE;
  END CASE;

  IF V_VALID = FALSE
  THEN
   -- RAISE_APPLICATION_ERROR(-20000, 'Invalid postcode (' || POSTCODE_IN || ')');
   V_POSTCODE := NULL;
  ELSIF V_POSTCODE IS NOT NULL
  THEN
    V_POSTCODE := V_CODE_OUTWARD || ' ' || V_CODE_INWARD;
  END IF;

  RETURN V_POSTCODE;

END;

/*
**************************************************
* Insert addresses
**************************************************
*/
procedure p_insert_addresses(
	pv_case_number in varchar2,
    pv_trans_seq in number) is -- SCR 561
begin
	insert into given_addresses ga 
	(ga.address_id                 
	,ga.case_number                
	,ga.case_party_no              
	,ga.address_type_code          
	,ga.address_line1              
	,ga.address_line2              
	,ga.address_line3              
	,ga.address_line4              
	,ga.address_line5              
	,ga.postcode                   
	,ga.updated_by                 
	,ga.valid_from                 
	,ga.valid_to                   
	,ga.party_role_code            
    ) select                    
     addr_sequence.nextval      
    ,da.deft_case_number        
    ,da.deft_id                 
    ,da.addr_type               	
    ,da.addr_1                  	
    ,da.addr_2                  	   
    ,da.addr_3                  	   
    ,da.addr_4                  	   
    ,da.addr_5                  	   
    ,f_fmt_postcode(da.postcode)
    ,da.username                	   
    ,da.valid_from              	   
    ,null
    ,C_PARTY_ROLE_CODE_DEFENDANT	   	
	from  cmcs_defendant_addresses da
	where da.deft_case_number = pv_case_number
	and   da.trans_seq        = pv_trans_seq;
	
    update given_addresses ga
    set    ga.party_id = 
    (select cpr.party_id
     from   case_party_roles cpr
     where  cpr.case_number     = ga.case_number
     and    cpr.party_role_code = ga.party_role_code
     and    cpr.case_party_no   = ga.case_party_no)
    where  ga.case_number     = pv_case_number
    and    ga.party_role_code = C_PARTY_ROLE_CODE_DEFENDANT
    and    ga.party_id is null;
	
exception
   when others then
      raise_application_error (-20010,'p_insert_addresses '||sqlerrm);
end;

procedure p_update_local(
    pv_case_number in varchar2,
    pv_trans_seq in number) is -- SCR 561
begin
    update cmcs_cases c
    set    c.transfer_status  = C_TRANSFER_STATUS_SUCCESSFUL
    ,      c.date_of_transfer = trunc(sysdate)
    where  c.case_number      = pv_case_number
    and    c.trans_seq        = pv_trans_seq; -- SCR 561
    
    update cmcs_transfer_control tc
    set    tc.transfer_status  = C_TRANSFER_STATUS_SUCCESSFUL
    ,      tc.date_transferred = trunc(sysdate)
    where  tc.transfer_status = C_TRANSFER_STATUS_READY
    and    tc.transfer_number = pv_case_number
    and    tc.trans_seq       = pv_trans_seq; -- SCR 561
    
exception when others then
    raise_application_error (-20010,'p_update_local '||sqlerrm);
end;

/******************************************************************************************************************/
/* TYPE			: PROCEDURE                                                                                       */
/* NAME			: p_transfer_cpc_cases_to_cmcs                                                                    */	
/* DESCRIPTION	: Transfers Cases for all SUPS Courts from SUPS CPC to SUPS Caseman's 'CaseMan Central Server'    */
/*                staging tables.                                                                                 */
/******************************************************************************************************************/
PROCEDURE p_transfer_cpc_cases_to_cmcs(
	p_user in VARCHAR2) IS

  nv_trans_seq    number := 0;
  nv_addr_seq     number := 0;
  nv_loop_count   number(1) := 0;
  nv_commit_count number(4) := 0;
  nv_total_count  number(8) := 0;
  cv_mess_text    varchar2(27) := 'Number of CaseMan Cases = ';
  v_plaintiff_details_1 cmcs_cases.plaintiff_details_1%type;
    
  CURSOR c_clm IS
	  SELECT CLM.CLAIM_NUMBER
	  ,      CLM.COURT_CODE
	  ,      CLM.CLAIM_AMOUNT
	  ,      CLM.CLAIM_AMOUNT_CURRENCY
	  ,      CLM.COURT_FEE
	  ,      CLM.COURT_FEE_CURRENCY
	  ,      CLM.SOLICITORS_COSTS
	  ,      CLM.SOLICITORS_COSTS_CURRENCY
	  ,      CLM.TOTAL_AMOUNT
	  ,      CLM.TOTAL_AMOUNT_CURRENCY
	  ,      CLM.ISSUE_DATE
	  ,      CLM.SERVICE_DATE
	  ,      upper(CLM.PARTICULARS_1)  "PARTICULARS_1"
	  ,      upper(CLM.PARTICULARS_2)  "PARTICULARS_2"
	  ,      upper(CLM.PARTICULARS_3)  "PARTICULARS_3"
	  ,      upper(CLM.PARTICULARS_4)  "PARTICULARS_4" 
	  ,      upper(CLM.PARTICULARS_5)  "PARTICULARS_5"
	  ,      upper(CLM.PARTICULARS_6)  "PARTICULARS_6"
	  ,      upper(CLM.PARTICULARS_7)  "PARTICULARS_7"
	  ,      upper(CLM.PARTICULARS_8)  "PARTICULARS_8" 
	  ,      upper(CLM.PARTICULARS_9)  "PARTICULARS_9"
	  ,      upper(CLM.PARTICULARS_10) "PARTICULARS_10"
	  ,      upper(CLM.PARTICULARS_11) "PARTICULARS_11"
	  ,      upper(CLM.PARTICULARS_12) "PARTICULARS_12"
	  ,      upper(CLM.PARTICULARS_13) "PARTICULARS_13"
	  ,      upper(CLM.PARTICULARS_14) "PARTICULARS_14"
	  ,      upper(CLM.PARTICULARS_15) "PARTICULARS_15"
	  ,      upper(CLM.PARTICULARS_16) "PARTICULARS_16"
	  ,      upper(CLM.PARTICULARS_17) "PARTICULARS_17"
	  ,      upper(CLM.PARTICULARS_18) "PARTICULARS_18"
	  ,      upper(CLM.PARTICULARS_19) "PARTICULARS_19"
	  ,      upper(CLM.PARTICULARS_20) "PARTICULARS_20"
	  ,      upper(CLM.PARTICULARS_21) "PARTICULARS_21"
	  ,      upper(CLM.PARTICULARS_22) "PARTICULARS_22"
	  ,      upper(CLM.PARTICULARS_23) "PARTICULARS_23"
	  ,      upper(CLM.PARTICULARS_24) "PARTICULARS_24"
	  ,      CLM.CREDITOR_CODE
	  ,      decode(CRED.PAYMENT_ADDR_1,null,CRED.NAME,CRED.PAYMENT_ADDR_1)       "REP_NAME"
	  ,      decode(CRED.PAYMENT_ADDR_1,null,CRED.ADDR_1,CRED.PAYMENT_ADDR_2)     "REP_ADDR_1"
	  ,      decode(CRED.PAYMENT_ADDR_1,null,CRED.ADDR_2,CRED.PAYMENT_ADDR_3)     "REP_ADDR_2"
	  ,      decode(CRED.PAYMENT_ADDR_1,null,CRED.ADDR_3,CRED.PAYMENT_ADDR_4)     "REP_ADDR_3"
	  ,      decode(CRED.PAYMENT_ADDR_1,null,CRED.ADDR_4,CRED.PAYMENT_ADDR_5)     "REP_ADDR_4"
	  ,      decode(CRED.PAYMENT_ADDR_1,null,CRED.ADDR_5,null)                    "REP_ADDR_5"
	  ,      decode(CRED.PAYMENT_ADDR_1,null,CRED.POSTCODE,CRED.PAYMENT_POSTCODE) "REP_POSTCODE"
	  ,      CRED.TEL_NO                                                          "REP_TEL_NO"
	  ,      CLM.SOLICITOR_REFERENCE
	  ,      CLM.CLAIMANT_NAME_1 "CLAIMANT_DETAILS_1"
	  ,      CLM.CLAIMANT_NAME_2 "CLAIMANT_DETAILS_2"
	  ,      CLM.CLAIMANT_ADDR_1 "CLAIMANT_DETAILS_3"
	  ,      CLM.CLAIMANT_ADDR_2 "CLAIMANT_DETAILS_4"
	  ,      CLM.CLAIMANT_ADDR_3 "CLAIMANT_DETAILS_5"
	  ,      CLM.CLAIMANT_ADDR_4 "CLAIMANT_DETAILS_6"
	  ,      CLM.CLAIMANT_ADDR_5 "CLAIMANT_DETAILS_7"
	  ,      CLM.CLAIMANT_POSTCODE   "CLAIMANT_POSTCODE"
	  ,      CLM.CLAIMANT_DX_NO      "CLAIMANT_DX_NO"     
	  ,      CLM.CLAIMANT_TEL_NO     "CLAIMANT_TEL_NO"    
	  ,      CLM.CLAIMANT_FAX_NO     "CLAIMANT_FAX_NO"    
	  ,      CLM.CLAIMANT_EMAIL_ADDR "CLAIMANT_EMAIL_ADDR"
	  ,      CLM.CLAIMANT_PCM        "CLAIMANT_PCM"       
	  ,      DEFT1.NAME     "DEFT1_NAME"
	  ,      DEFT1.ADDR_1   "DEFT1_ADDR_1"
	  ,      DEFT1.ADDR_2   "DEFT1_ADDR_2"
	  ,      DEFT1.ADDR_3   "DEFT1_ADDR_3"
	  ,      DEFT1.ADDR_4   "DEFT1_ADDR_4"
	  ,      DEFT1.ADDR_5   "DEFT1_ADDR_5"
	  ,      DEFT1.POSTCODE "DEFT1_POSTCODE"
	  ,      DEFT2.NAME     "DEFT2_NAME"
	  ,      DEFT2.ADDR_1   "DEFT2_ADDR_1"
	  ,      DEFT2.ADDR_2   "DEFT2_ADDR_2"
	  ,      DEFT2.ADDR_3   "DEFT2_ADDR_3"
	  ,      DEFT2.ADDR_4   "DEFT2_ADDR_4"
	  ,      DEFT2.ADDR_5   "DEFT2_ADDR_5"
	  ,      DEFT2.POSTCODE "DEFT2_POSTCODE"
	  FROM   COURTS                   CRT
	  ,      CLAIMS@cpc_link          CLM
	  ,      DEFENDANTS@cpc_link      DEFT1
	  ,      DEFENDANTS@cpc_link      DEFT2
	  ,	     CODED_CREDITORS@cpc_link CRED
	  WHERE  CRT.SUPS_CENTRALISED_FLAG = 'Y'
	  AND    CLM.COURT_CODE   = CRT.CODE
	  AND    CLM.CLAIM_NUMBER = DEFT1.CLAIM_NUMBER
	  AND    DEFT1.ID         = 1
	  AND    CLM.CLAIM_NUMBER = DEFT2.CLAIM_NUMBER(+)
	  AND    DEFT2.ID      (+)= 2
	  AND    CRED.CODE        = CLM.CREDITOR_CODE
	  AND    CLM.COURT_CODE  != 335
	  AND    CLM.STATUS       = 'P';

  CURSOR c_trans_seq IS
	  SELECT CMCS_TRANS_SEQUENCE.NEXTVAL
	  FROM   DUAL;

  CURSOR c_addr_seq IS
	  SELECT CMCS_ADDR_SEQUENCE.NEXTVAL
	  FROM   DUAL;

BEGIN

  FOR clm_rec IN c_clm
  LOOP

    OPEN c_trans_seq;
    FETCH c_trans_seq 
    INTO nv_trans_seq;
    CLOSE c_trans_seq;

    /* The first two 'claimant_details' lines, hold the name, and these should be concatenated. */
    v_plaintiff_details_1 := NULL;
    IF clm_rec.claimant_details_1 IS NULL THEN
        v_plaintiff_details_1 := clm_rec.claimant_details_2;
        clm_rec.claimant_details_2 := NULL;
    ELSE
        IF clm_rec.claimant_details_2 IS NOT NULL THEN
            v_plaintiff_details_1 := SUBSTR(clm_rec.claimant_details_1||' '||clm_rec.claimant_details_2,1,70);
            clm_rec.claimant_details_2 := NULL;
        ELSE
            v_plaintiff_details_1 := clm_rec.claimant_details_1;         
        END IF;
    END IF;

    nv_loop_count := 0;
<<SHUFFLE_3>>
    IF clm_rec.claimant_details_3 IS NULL THEN
      clm_rec.claimant_details_3 := clm_rec.claimant_details_4;
      clm_rec.claimant_details_4 := clm_rec.claimant_details_5;
      clm_rec.claimant_details_5 := clm_rec.claimant_details_6;
      clm_rec.claimant_details_6 := clm_rec.claimant_details_7;
      clm_rec.claimant_details_7 := NULL;
      nv_loop_count := nv_loop_count + 1;
      IF nv_loop_count = 5 THEN
        clm_rec.claimant_details_3 := '.';
      END IF;
      GOTO SHUFFLE_3;
    END IF;

    nv_loop_count := 0;
<<SHUFFLE_4>>
    IF clm_rec.claimant_details_4 IS NULL THEN
      clm_rec.claimant_details_4 := clm_rec.claimant_details_5;
      clm_rec.claimant_details_5 := clm_rec.claimant_details_6;
      clm_rec.claimant_details_6 := clm_rec.claimant_details_7;
      clm_rec.claimant_details_7 := NULL;
      nv_loop_count := nv_loop_count + 1;
      IF nv_loop_count = 4 THEN
        clm_rec.claimant_details_4 := '.';
      END IF;
      GOTO SHUFFLE_4;
    END IF;

    INSERT INTO CMCS_TRANSFER_CONTROL
    ( TRANS_SEQ
    , TRANSFER_TYPE
    , TRANSFER_NUMBER
    , SENDING_COURT_CODE
    , RECEIVING_COURT_CODE
    , TRANSFER_REQUEST_DATE
    , CENTRAL_RECEIPT_DATE
    , TRANSFER_STATUS
    ) VALUES
    ( nv_trans_seq
    , 'C'
    , clm_rec.claim_number
    , 335
    , clm_rec.court_code
    , clm_rec.issue_date
    , trunc(sysdate)
    , C_TRANSFER_STATUS_READY 
    );

	INSERT INTO CMCS_CASES
	( TRANS_SEQ                          
	, CASE_NUMBER                        
	, CASE_TYPE                          
	, ADMIN_CRT_CODE                     
	, AMOUNT_CLAIMED                     
	, AMOUNT_CLAIMED_CURRENCY                                   
	, COURT_FEE                          
	, COURT_FEE_CURRENCY                          
	, SOLICITORS_COSTS                   
	, SOLICITORS_COSTS_CURRENCY                   
	, TOTAL                              
	, TOTAL_CURRENCY                              
	, DATE_OF_ISSUE                      
	, PARTICULARS_OF_CLAIM               
	, REP_CODE                           
	, REP_NAME                           
	, REP_ADDR_1                         
	, REP_ADDR_2                         
	, REP_ADDR_3                         
	, REP_ADDR_4                         
	, REP_ADDR_5                         
	, REP_POSTCODE                       
	, REP_TEL_NO                         
	, REFERENCE                          
	, PLAINTIFF_DETAILS_1                
	, PLAINTIFF_DETAILS_2                
	, PLAINTIFF_DETAILS_3                
	, PLAINTIFF_DETAILS_4                
	, PLAINTIFF_DETAILS_5                
	, PLAINTIFF_DETAILS_6                
	, PLAINTIFF_DETAILS_7                
	, PLAINTIFF_POSTCODE
	, PLTF_DX
	, PLAINTIFF_TEL_NO
	, PLAINTIFF_FAX_NO
	, PLAINTIFF_EMAIL_ADDR
	, PLAINTIFF_PCM
	, PAYEE_FLAG                         
	, TRANS_CRT_CODE                     
	, DATE_TRANSFERRED_IN                
	, TRANSFER_STATUS                    
	) VALUES                             
	( nv_trans_seq                     
	, clm_rec.claim_number             
	, 'CLAIM - SPEC ONLY'              
	, clm_rec.court_code               
	, clm_rec.claim_amount             
	, clm_rec.claim_amount_currency    
	, clm_rec.court_fee                
	, clm_rec.court_fee_currency       
	, clm_rec.solicitors_costs         
	, clm_rec.solicitors_costs_currency
	, clm_rec.total_amount             
	, clm_rec.total_amount_currency    
	, clm_rec.issue_date               
	, rpad(clm_rec.particulars_1,45)|| 
	  rpad(clm_rec.particulars_2,45)|| 
	  rpad(clm_rec.particulars_3,45)|| 
	  rpad(clm_rec.particulars_4,45)|| 
	  rpad(clm_rec.particulars_5,45)|| 
	  rpad(clm_rec.particulars_6,45)|| 
	  rpad(clm_rec.particulars_7,45)|| 
	  rpad(clm_rec.particulars_8,45)|| 
	  rpad(clm_rec.particulars_9,45)|| 
	  rpad(clm_rec.particulars_10,45)||
	  rpad(clm_rec.particulars_11,45)||
	  rpad(clm_rec.particulars_12,45)||
	  rpad(clm_rec.particulars_13,45)||
	  rpad(clm_rec.particulars_14,45)||
	  rpad(clm_rec.particulars_15,45)||
	  rpad(clm_rec.particulars_16,45)||
	  rpad(clm_rec.particulars_17,45)||
	  rpad(clm_rec.particulars_18,45)||
	  rpad(clm_rec.particulars_19,45)||
	  rpad(clm_rec.particulars_20,45)||
	  rpad(clm_rec.particulars_21,45)||
	  rpad(clm_rec.particulars_22,45)||
	  rpad(clm_rec.particulars_23,45)||
	  clm_rec.particulars_24           
	, clm_rec.creditor_code            
	, clm_rec.rep_name                 
	, clm_rec.rep_addr_1               
	, clm_rec.rep_addr_2               
	, clm_rec.rep_addr_3               
	, clm_rec.rep_addr_4               
	, clm_rec.rep_addr_5               
	, clm_rec.rep_postcode             
	, clm_rec.rep_tel_no               
	, clm_rec.solicitor_reference      
	, v_plaintiff_details_1
	, clm_rec.claimant_details_2       
	, clm_rec.claimant_details_3       
	, clm_rec.claimant_details_4       
	, clm_rec.claimant_details_5       
	, clm_rec.claimant_details_6       
	, clm_rec.claimant_details_7       
	, clm_rec.claimant_postcode
	, clm_rec.claimant_dx_no
	, clm_rec.claimant_tel_no
	, clm_rec.claimant_fax_no
	, clm_rec.claimant_email_addr
	, clm_rec.claimant_pcm
	, 'Y'                              
	, clm_rec.court_code               
	, trunc(sysdate)                   
	, C_TRANSFER_STATUS_READY                              
	);                                 

    INSERT INTO CMCS_DEFENDANTS
    ( TRANS_SEQ
    , CASE_NUMBER
    , ID
    , NAME
    , DATE_OF_SERVICE_OTHER
    , METHOD_OF_SERVICE
    , BAR_JUDGMENT
    ) VALUES
    ( nv_trans_seq
    , clm_rec.claim_number
    , 1
    , clm_rec.deft1_name
    , clm_rec.service_date
    , 'POST'
    , 'N'
    );

    OPEN c_addr_seq;
    FETCH c_addr_seq 
    INTO nv_addr_seq;
    CLOSE c_addr_seq;

    INSERT INTO CMCS_DEFENDANT_ADDRESSES
    ( TRANS_SEQ
    , ADDR_SEQ
    , DEFT_CASE_NUMBER
    , DEFT_ID
    , ADDR_TYPE
    , ADDR_1
    , ADDR_2
    , ADDR_3
    , ADDR_4
    , ADDR_5
    , POSTCODE
    , USERNAME
    , VALID_FROM
    ) VALUES
    ( nv_trans_seq
    , nv_addr_seq
    , clm_rec.claim_number
    , 1
    , C_ADDRESS_TYPE_CODE_SERVICE
    , clm_rec.deft1_addr_1
    , clm_rec.deft1_addr_2
    , clm_rec.deft1_addr_3
    , clm_rec.deft1_addr_4
    , clm_rec.deft1_addr_5
    , clm_rec.deft1_postcode
    , p_user
    , clm_rec.issue_date
    );

    IF clm_rec.deft2_name IS NOT NULL THEN

      INSERT INTO CMCS_DEFENDANTS
      ( TRANS_SEQ
      , CASE_NUMBER
      , ID
      , NAME
      , DATE_OF_SERVICE_OTHER
      , METHOD_OF_SERVICE
      , BAR_JUDGMENT
      ) VALUES
      ( nv_trans_seq
      , clm_rec.claim_number
      , 2
      , clm_rec.deft2_name
      , clm_rec.service_date
      , 'POST'
      , 'N'
      );

      OPEN c_addr_seq;
      FETCH c_addr_seq 
      INTO nv_addr_seq;
      CLOSE c_addr_seq;

      INSERT INTO CMCS_DEFENDANT_ADDRESSES
      ( TRANS_SEQ
      , ADDR_SEQ
      , DEFT_CASE_NUMBER
      , DEFT_ID
      , ADDR_TYPE
      , ADDR_1
      , ADDR_2
      , ADDR_3
      , ADDR_4
      , ADDR_5
      , POSTCODE
      , USERNAME
      , VALID_FROM
      ) VALUES
      ( nv_trans_seq
      , nv_addr_seq
      , clm_rec.claim_number
      , 2
      , C_ADDRESS_TYPE_CODE_SERVICE
      , clm_rec.deft2_addr_1
      , clm_rec.deft2_addr_2
      , clm_rec.deft2_addr_3
      , clm_rec.deft2_addr_4
      , clm_rec.deft2_addr_5
      , clm_rec.deft2_postcode
      , p_user
      , clm_rec.issue_date
      );

    END IF;

    UPDATE CLAIMS@cpc_link CLM
    SET    CLM.STATUS = 'T'
    WHERE  CLM.CLAIM_NUMBER = clm_rec.claim_number;

    nv_commit_count := nv_commit_count + 1;
    nv_total_count := nv_total_count + 1;

    IF nv_commit_count = 500 THEN
      COMMIT;
      nv_commit_count := 0;
    END IF;

  END LOOP;

  COMMIT;

  dbms_output.put_line(cv_mess_text||nv_total_count||'.');

END;

/******************************************************************************************************************/
/* TYPE			: PROCEDURE                                                                                       */
/* NAME			: p_transfer_clear_down                                                                           */	
/* DESCRIPTION	: Deletes rows from the following staging tables that have been successfully transferred over     */
/*                3 days prior :-                                                                                 */
/*                  CMCS_CASES, CMCS_DEFENDANTS, and CMCS_DEFENDANT_ADDRESSES.                                    */
/*                Also, the CMCS_TRANSFER_CONTROL table is also cleared down of records more than 50 days old.    */
/******************************************************************************************************************/
PROCEDURE p_transfer_clear_down IS
BEGIN
    delete cmcs_cases c
    where  c.trans_seq in 
  	(select tc.trans_seq 
  	 from   cmcs_transfer_control tc
  	 where  tc.transfer_type        = 'C'
  	 and    tc.central_receipt_date < trunc(sysdate) - 3
  	 and    tc.transfer_status      = C_TRANSFER_STATUS_SUCCESSFUL);
    
    delete cmcs_defendants d
    where  d.trans_seq in 
  	(select tc.trans_seq 
  	 from   cmcs_transfer_control tc
  	 where  tc.transfer_type        = 'C'
  	 and    tc.central_receipt_date < trunc(sysdate) - 3
  	 and    tc.transfer_status      = C_TRANSFER_STATUS_SUCCESSFUL);
    
    delete cmcs_defendant_addresses da
    where  da.trans_seq in 
  	(select tc.trans_seq 
  	 from   cmcs_transfer_control tc
  	 where  tc.transfer_type        = 'C'
  	 and    tc.central_receipt_date < trunc(sysdate) - 3
  	 and    tc.transfer_status      = C_TRANSFER_STATUS_SUCCESSFUL);
    
    delete cmcs_transfer_control tc
  	where  tc.transfer_type        = 'C'
  	and    tc.central_receipt_date < trunc(sysdate) - 50;

    commit;
        
END p_transfer_clear_down;

/******************************************************************************************************************/
/* TYPE			: PROCEDURE                                                                                       */
/* NAME			: p_trans_cpc_cases_to_caseman                                                                 */	
/* DESCRIPTION	: This procedure will perform the complete transfer, end to end, of Cases from SUPS CPC           */
/*                to SUPS Caseman, via staging tables, and will also perform housekeeping on those staging tables.*/
/*                It calls the three main entry points :-                                                         */
/*                  p_transfer_cpc_cases_to_cmcs(), p_start_transfer() and p_transfer_clear_down().               */
/*                If this implementation does not suit scheduling requirements, these entry points may called     */
/*                individually, as appropriate.                                                                   */
/******************************************************************************************************************/
PROCEDURE p_trans_cpc_cases_to_caseman( 
    	pv_user in VARCHAR2,
    	pv_clear_down in CHAR DEFAULT 'Y') IS

  CURSOR c_get_sups_courts IS
	  SELECT CRT.CODE
	  FROM   COURTS CRT
	  WHERE  CRT.SUPS_CENTRALISED_FLAG = 'Y';
	  
BEGIN
    /* By default, performing housekeeping on the staging tables. */
    if pv_clear_down = 'Y' then
        p_transfer_clear_down();    
    end if;

    /* Transfer CPC Claims into the SUPS Caseman Staging tables. */
    p_transfer_cpc_cases_to_cmcs(pv_user);
    
    /* Iterate through each of the Courts which has been migrated into SUPS. */
    FOR sups_court IN c_get_sups_courts
    LOOP
        /* Set up the 'Context' for the Audit triggers. */
        sys.set_sups_app_ctx(pv_user, sups_court.code, 'SupsCPCCaseTransfer');
        
        /* Transfer the Cases fromn the Staging Tables into the main Application tables. */
        p_start_transfer(sups_court.code, pv_user);
    END LOOP;
    
END p_trans_cpc_cases_to_caseman;

end sups_cpc_cases_to_court_pack;
/
