REM CHANGE CONTROL HISTORY
REM ----------------------
REM Version   Date     Author   Description                               RFC/FR
REM -------   ----     ------   -----------                               ------
REM   0.1     1993      GILL    Created.
REM   0.2     1993
REM   0.3   02-DEC-93   DHC     Event entered depends on value of variable
REM                              initialised by judg_event_dbp.
REM   0.4      DEC-93           After insert and after update include new
REM                              Case Number and Deft Id.
REM   0.5   01-MAR-94   SLH     After insert to not fire when user is      FR16
REM                              CCBC. Change Control section addded.
REM   0.6   05-JUL-94   AWGB    Remove call to ccbc_addresses.insert_addr_dbp.
REM   0.7   16-SEP-94   AWGB    After insert to not fire when user is     RFC23
REM                              SYSADMIN.
REM   0.8  19-AUG-2002  AWGB    Insert a row in OLS_DATA when a Judgment  RFC880
REM                              is inserted on a Case issued after MCOL
REM                              Phase 2 or for an MCOL Claimant.
REM   1.0   08-Dec-2005 fz806t  migration according to the new schema
REM   1.1   30-NOV-2005 fz806t  according to TO-BE
REM   1.2   08-JUN-2006 tzws3p  modifying the v_userid of the custtest user
REM   1.3   17-AUG-2006 AGM     Apply CR CCCIS 112.
REM   1.4   25-FEB-2007 nz3wx0  Fixing defect 4444.
REM   1.5   22-APR-2007 WKhalil Fixing defect 1323 (UFO)
REM   1.6   12-FEB-2008 CZZP44  Fix defect # 5609 (Group2) - TestDirector
REM ----------------------------------------------------------------------------


REM AFTER INSERT ON JUDGMENTS

create or replace trigger audit_insert_judgments
after insert on judgments
for each row
DECLARE
v_userid VARCHAR2(16);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN
if :new.judgment_type = 'DEFAULT' then
   ccbc_events.insert_event_dbp(:new.case_number, 230,
                              :new.against_case_party_no, :new.against_party_role_code, null, null,
                             null, :new.judg_seq, null, 'N', null);
else
   ccbc_events.insert_event_dbp(:new.case_number, 240,
                             :new.against_case_party_no, :new.against_party_role_code, null, null,
                             null, :new.judg_seq, null, 'N', null);
end if;
 
/* Trac ticket #5102 always inform mcol 

if mcol_sups_ccbc_package.f_ols_case(:new.case_number) or
   mcol_sups_ccbc_package.f_mcol2_case(:new.case_number, :new.against_case_party_no) then */
   
  INSERT INTO MCOL_DATA
  (CLAIM_NUMBER, DEFT_ID, TYPE, EVENT_DATE, MCOL_REFERENCE, JUDGMENT_REFERENCE)
  VALUES
  (:new.case_number, :new.against_case_party_no, 'JE', sysdate, :new.mcol_judg_ref, :new.mcol_judg_ref);
  
-- end if;

  INSERT INTO INFAVOUR_PARTIES
  (JUDG_SEQ, CASE_NUMBER, CASE_PARTY_NO, PARTY_ROLE_CODE, DELETED_FLAG)
  VALUES
  (:new.judg_seq, :new.case_number, 1, 'CLAIMANT', 'N');

END IF;
end;
/



REM AFTER UPDATE ON JUDGMENTS

create or replace trigger audit_judgments
after update on judgments
for each row
DECLARE
v_userid VARCHAR2(16);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN
if :new.date_of_final_payment is not null and
   :old.date_of_final_payment is null then
    if ccbc_statuses.paid_flag = 'Y' then
        ccbc_statuses.case_status_dbp('PAID', :new.case_number);
        /* send paid date to MCOL */
        INSERT INTO MCOL_DATA
            (CLAIM_NUMBER, TYPE, EVENT_DATE, DEFT_ID, PAID_DATE )
        VALUES
            (:new.case_number,'MP', sysdate, :new.against_case_party_no, :new.date_of_final_payment);
        
        /* Trac ticket #5102 moved event 79, 
        ccbc_events.insert_event_dbp(:new.case_number, 79, null, null,
                                     null, null, null, :new.judg_seq, null,
                                     'N', null);
        */                             
        ccbc_statuses.bar_judg_all_dbp(:new.case_number, 'Y');
        /* USD89220 set_warrant_all_dbp now called from BC_PWO_U1.SQL.
                ccbc_statuses.set_warrant_all_dbp(:new.case_number);*/                
        ccbc_statuses.paid_flag := 'N';
    else
        ccbc_statuses.bar_judg_dbp(:new.case_number, :new.against_case_party_no, 'Y');
    end if;
        ccbc_events.insert_event_dbp(:new.case_number, 79, :new.against_case_party_no, :new.against_party_role_code, null, null, null, :new.judg_seq, null, 'N', null);
end if;
END IF;
end;
/
