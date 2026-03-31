
  CREATE OR REPLACE TRIGGER "CASEMAN"."AFTER_INSERT_WARRANT_RETURNS"
after insert on warrant_returns
for each row
DECLARE
v_userid VARCHAR2(16);

case_number varchar2(8);
warrant_number varchar2(8);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN

select case_number into case_number
from warrants
where warrant_id= :new.warrant_id;

select warrant_number into warrant_number
from warrants
where warrant_id= :new.warrant_id;

ccbc_events.insert_event_dbp(case_number
                                 ,'620'
                                 ,:new.defendant_id
                                 ,'DEFENDANT'
                                 ,null
                                 ,'Return Code '||to_char(:new.return_code)
                                 ,:new.warrant_id
                                 ,null
                                 ,null
                                 ,'N'
                                 ,null);

/* track ticket #5102 now inform MCOL of warrants for all cases */
   insert into mcol_data
      (claim_number, deft_id, type, event_date,
       warrant_number, return_code, return_info)
   values
      (case_number
       ,:new.defendant_id
       ,'FR'
       ,:new.warrant_return_date
       ,warrant_number
       ,:new.return_code
       ,:new.additional_information);

       END IF;
end;

/
ALTER TRIGGER "CASEMAN"."AFTER_INSERT_WARRANT_RETURNS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUDIT_EVENTS"
after update on case_events
for each row
DECLARE
v_userid VARCHAR2(16);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN
  IF :new.std_event_id = 140 AND
     :new.result IS NOT NULL AND :old.result IS NULL THEN
       ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'N');
  END IF;
END IF;
END;

/
ALTER TRIGGER "CASEMAN"."AUDIT_EVENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUDIT_INSERT_JUDGMENTS"
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
ALTER TRIGGER "CASEMAN"."AUDIT_INSERT_JUDGMENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUDIT_JUDGMENTS"
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
ALTER TRIGGER "CASEMAN"."AUDIT_JUDGMENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_AE_APPLICATIONS"
after update or insert or delete on "AE_APPLICATIONS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."AE_FEE" != :new."AE_FEE")
    or (:old."AE_FEE" is null and :new."AE_FEE" is not null)
    or (:old."AE_FEE" is not null and :new."AE_FEE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'AE_FEE',
        'Updated',
        to_char(:old."AE_FEE"),
        :old."AE_NUMBER");
    end if;
    if (:old."AE_FEE_CURRENCY" != :new."AE_FEE_CURRENCY")
    or (:old."AE_FEE_CURRENCY" is null and :new."AE_FEE_CURRENCY" is not null)
    or (:old."AE_FEE_CURRENCY" is not null and :new."AE_FEE_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'AE_FEE_CURRENCY',
        'Updated',
        :old."AE_FEE_CURRENCY",
        :old."AE_NUMBER");
    end if;
    if (:old."AE_NUMBER" != :new."AE_NUMBER")
    or (:old."AE_NUMBER" is null and :new."AE_NUMBER" is not null)
    or (:old."AE_NUMBER" is not null and :new."AE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'AE_NUMBER',
        'Updated',
        :old."AE_NUMBER",
        :old."AE_NUMBER");
    end if;
    if (:old."AE_TYPE" != :new."AE_TYPE")
    or (:old."AE_TYPE" is null and :new."AE_TYPE" is not null)
    or (:old."AE_TYPE" is not null and :new."AE_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'AE_TYPE',
        'Updated',
        :old."AE_TYPE",
        :old."AE_NUMBER");
    end if;
    if (:old."AMOUNT_OF_AE" != :new."AMOUNT_OF_AE")
    or (:old."AMOUNT_OF_AE" is null and :new."AMOUNT_OF_AE" is not null)
    or (:old."AMOUNT_OF_AE" is not null and :new."AMOUNT_OF_AE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'AMOUNT_OF_AE',
        'Updated',
        to_char(:old."AMOUNT_OF_AE"),
        :old."AE_NUMBER");
    end if;
    if (:old."AMOUNT_OF_AE_CURRENCY" != :new."AMOUNT_OF_AE_CURRENCY")
    or (:old."AMOUNT_OF_AE_CURRENCY" is null and :new."AMOUNT_OF_AE_CURRENCY" is not null)
    or (:old."AMOUNT_OF_AE_CURRENCY" is not null and :new."AMOUNT_OF_AE_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'AMOUNT_OF_AE_CURRENCY',
        'Updated',
        :old."AMOUNT_OF_AE_CURRENCY",
        :old."AE_NUMBER");
    end if;
    if (:old."CAPS_SEQUENCE" != :new."CAPS_SEQUENCE")
    or (:old."CAPS_SEQUENCE" is null and :new."CAPS_SEQUENCE" is not null)
    or (:old."CAPS_SEQUENCE" is not null and :new."CAPS_SEQUENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'CAPS_SEQUENCE',
        'Updated',
        to_char(:old."CAPS_SEQUENCE"),
        :old."AE_NUMBER");
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        :old."AE_NUMBER");
    end if;
    if (:old."DATE_OF_CREATION" != :new."DATE_OF_CREATION")
    or (:old."DATE_OF_CREATION" is null and :new."DATE_OF_CREATION" is not null)
    or (:old."DATE_OF_CREATION" is not null and :new."DATE_OF_CREATION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'DATE_OF_CREATION',
        'Updated',
        to_char(:old."DATE_OF_CREATION",'YYYY-MM-DD'),
        :old."AE_NUMBER");
    end if;
    if (:old."DATE_OF_ISSUE" != :new."DATE_OF_ISSUE")
    or (:old."DATE_OF_ISSUE" is null and :new."DATE_OF_ISSUE" is not null)
    or (:old."DATE_OF_ISSUE" is not null and :new."DATE_OF_ISSUE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'DATE_OF_ISSUE',
        'Updated',
        to_char(:old."DATE_OF_ISSUE",'YYYY-MM-DD'),
        :old."AE_NUMBER");
    end if;
    if (:old."DATE_OF_RECEIPT" != :new."DATE_OF_RECEIPT")
    or (:old."DATE_OF_RECEIPT" is null and :new."DATE_OF_RECEIPT" is not null)
    or (:old."DATE_OF_RECEIPT" is not null and :new."DATE_OF_RECEIPT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'DATE_OF_RECEIPT',
        'Updated',
        to_char(:old."DATE_OF_RECEIPT",'YYYY-MM-DD'),
        :old."AE_NUMBER");
    end if;
    if (:old."DEBTORS_EMPLOYERS_PARTY_ID" != :new."DEBTORS_EMPLOYERS_PARTY_ID")
    or (:old."DEBTORS_EMPLOYERS_PARTY_ID" is null and :new."DEBTORS_EMPLOYERS_PARTY_ID" is not null)
    or (:old."DEBTORS_EMPLOYERS_PARTY_ID" is not null and :new."DEBTORS_EMPLOYERS_PARTY_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'DEBTORS_EMPLOYERS_PARTY_ID',
        'Updated',
        to_char(:old."DEBTORS_EMPLOYERS_PARTY_ID"),
        :old."AE_NUMBER");
    end if;
    if (:old."DEBTOR_OCCUPATION" != :new."DEBTOR_OCCUPATION")
    or (:old."DEBTOR_OCCUPATION" is null and :new."DEBTOR_OCCUPATION" is not null)
    or (:old."DEBTOR_OCCUPATION" is not null and :new."DEBTOR_OCCUPATION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'DEBTOR_OCCUPATION',
        'Updated',
        :old."DEBTOR_OCCUPATION",
        :old."AE_NUMBER");
    end if;
    if (:old."ISSUING_CRT_CODE" != :new."ISSUING_CRT_CODE")
    or (:old."ISSUING_CRT_CODE" is null and :new."ISSUING_CRT_CODE" is not null)
    or (:old."ISSUING_CRT_CODE" is not null and :new."ISSUING_CRT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'ISSUING_CRT_CODE',
        'Updated',
        to_char(:old."ISSUING_CRT_CODE"),
        :old."AE_NUMBER");
    end if;
    if (:old."JUDG_SEQ" != :new."JUDG_SEQ")
    or (:old."JUDG_SEQ" is null and :new."JUDG_SEQ" is not null)
    or (:old."JUDG_SEQ" is not null and :new."JUDG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'JUDG_SEQ',
        'Updated',
        to_char(:old."JUDG_SEQ"),
        :old."AE_NUMBER");
    end if;
    if (:old."NAMED_EMPLOYER" != :new."NAMED_EMPLOYER")
    or (:old."NAMED_EMPLOYER" is null and :new."NAMED_EMPLOYER" is not null)
    or (:old."NAMED_EMPLOYER" is not null and :new."NAMED_EMPLOYER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'NAMED_EMPLOYER',
        'Updated',
        :old."NAMED_EMPLOYER",
        :old."AE_NUMBER");
    end if;
    if (:old."NORMAL_DEDUCTION_PERIOD" != :new."NORMAL_DEDUCTION_PERIOD")
    or (:old."NORMAL_DEDUCTION_PERIOD" is null and :new."NORMAL_DEDUCTION_PERIOD" is not null)
    or (:old."NORMAL_DEDUCTION_PERIOD" is not null and :new."NORMAL_DEDUCTION_PERIOD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'NORMAL_DEDUCTION_PERIOD',
        'Updated',
        :old."NORMAL_DEDUCTION_PERIOD",
        :old."AE_NUMBER");
    end if;
    if (:old."NORMAL_DEDUCTION_RATE" != :new."NORMAL_DEDUCTION_RATE")
    or (:old."NORMAL_DEDUCTION_RATE" is null and :new."NORMAL_DEDUCTION_RATE" is not null)
    or (:old."NORMAL_DEDUCTION_RATE" is not null and :new."NORMAL_DEDUCTION_RATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'NORMAL_DEDUCTION_RATE',
        'Updated',
        to_char(:old."NORMAL_DEDUCTION_RATE"),
        :old."AE_NUMBER");
    end if;
    if (:old."PARTY_AGAINST_CASE_PARTY_NO" != :new."PARTY_AGAINST_CASE_PARTY_NO")
    or (:old."PARTY_AGAINST_CASE_PARTY_NO" is null and :new."PARTY_AGAINST_CASE_PARTY_NO" is not null)
    or (:old."PARTY_AGAINST_CASE_PARTY_NO" is not null and :new."PARTY_AGAINST_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'PARTY_AGAINST_CASE_PARTY_NO',
        'Updated',
        to_char(:old."PARTY_AGAINST_CASE_PARTY_NO"),
        :old."AE_NUMBER");
    end if;
    if (:old."PARTY_AGAINST_PARTY_ROLE_CODE" != :new."PARTY_AGAINST_PARTY_ROLE_CODE")
    or (:old."PARTY_AGAINST_PARTY_ROLE_CODE" is null and :new."PARTY_AGAINST_PARTY_ROLE_CODE" is not null)
    or (:old."PARTY_AGAINST_PARTY_ROLE_CODE" is not null and :new."PARTY_AGAINST_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'PARTY_AGAINST_PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_AGAINST_PARTY_ROLE_CODE",
        :old."AE_NUMBER");
    end if;
    if (:old."PARTY_FOR_CASE_PARTY_NO" != :new."PARTY_FOR_CASE_PARTY_NO")
    or (:old."PARTY_FOR_CASE_PARTY_NO" is null and :new."PARTY_FOR_CASE_PARTY_NO" is not null)
    or (:old."PARTY_FOR_CASE_PARTY_NO" is not null and :new."PARTY_FOR_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'PARTY_FOR_CASE_PARTY_NO',
        'Updated',
        to_char(:old."PARTY_FOR_CASE_PARTY_NO"),
        :old."AE_NUMBER");
    end if;
    if (:old."PARTY_FOR_PARTY_ROLE_CODE" != :new."PARTY_FOR_PARTY_ROLE_CODE")
    or (:old."PARTY_FOR_PARTY_ROLE_CODE" is null and :new."PARTY_FOR_PARTY_ROLE_CODE" is not null)
    or (:old."PARTY_FOR_PARTY_ROLE_CODE" is not null and :new."PARTY_FOR_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'PARTY_FOR_PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_FOR_PARTY_ROLE_CODE",
        :old."AE_NUMBER");
    end if;
    if (:old."PAYROLL_NUMBER" != :new."PAYROLL_NUMBER")
    or (:old."PAYROLL_NUMBER" is null and :new."PAYROLL_NUMBER" is not null)
    or (:old."PAYROLL_NUMBER" is not null and :new."PAYROLL_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'PAYROLL_NUMBER',
        'Updated',
        :old."PAYROLL_NUMBER",
        :old."AE_NUMBER");
    end if;
    if (:old."PROTECTED_EARNINGS_PERIOD" != :new."PROTECTED_EARNINGS_PERIOD")
    or (:old."PROTECTED_EARNINGS_PERIOD" is null and :new."PROTECTED_EARNINGS_PERIOD" is not null)
    or (:old."PROTECTED_EARNINGS_PERIOD" is not null and :new."PROTECTED_EARNINGS_PERIOD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'PROTECTED_EARNINGS_PERIOD',
        'Updated',
        :old."PROTECTED_EARNINGS_PERIOD",
        :old."AE_NUMBER");
    end if;
    if (:old."PROTECTED_EARNINGS_RATE" != :new."PROTECTED_EARNINGS_RATE")
    or (:old."PROTECTED_EARNINGS_RATE" is null and :new."PROTECTED_EARNINGS_RATE" is not null)
    or (:old."PROTECTED_EARNINGS_RATE" is not null and :new."PROTECTED_EARNINGS_RATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_APPLICATIONS',
        'PROTECTED_EARNINGS_RATE',
        'Updated',
        to_char(:old."PROTECTED_EARNINGS_RATE"),
        :old."AE_NUMBER");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'AE_APPLICATIONS',
      null,
      v_type,
      null,
      nvl(:old."AE_NUMBER",:new."AE_NUMBER"));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_AE_APPLICATIONS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_AE_EVENTS"
after update or insert or delete on "AE_EVENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."AE_EVENT_SEQ" != :new."AE_EVENT_SEQ")
    or (:old."AE_EVENT_SEQ" is null and :new."AE_EVENT_SEQ" is not null)
    or (:old."AE_EVENT_SEQ" is not null and :new."AE_EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'AE_EVENT_SEQ',
        'Updated',
        to_char(:old."AE_EVENT_SEQ"),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."AE_NUMBER" != :new."AE_NUMBER")
    or (:old."AE_NUMBER" is null and :new."AE_NUMBER" is not null)
    or (:old."AE_NUMBER" is not null and :new."AE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'AE_NUMBER',
        'Updated',
        :old."AE_NUMBER",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."BAILIFF_IDENTIFIER" != :new."BAILIFF_IDENTIFIER")
    or (:old."BAILIFF_IDENTIFIER" is null and :new."BAILIFF_IDENTIFIER" is not null)
    or (:old."BAILIFF_IDENTIFIER" is not null and :new."BAILIFF_IDENTIFIER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'BAILIFF_IDENTIFIER',
        'Updated',
        to_char(:old."BAILIFF_IDENTIFIER"),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."CASE_EVENT_SEQ" != :new."CASE_EVENT_SEQ")
    or (:old."CASE_EVENT_SEQ" is null and :new."CASE_EVENT_SEQ" is not null)
    or (:old."CASE_EVENT_SEQ" is not null and :new."CASE_EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'CASE_EVENT_SEQ',
        'Updated',
        to_char(:old."CASE_EVENT_SEQ"),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."DATE_ENTERED" != :new."DATE_ENTERED")
    or (:old."DATE_ENTERED" is null and :new."DATE_ENTERED" is not null)
    or (:old."DATE_ENTERED" is not null and :new."DATE_ENTERED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'DATE_ENTERED',
        'Updated',
        to_char(:old."DATE_ENTERED",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."DETAILS" != :new."DETAILS")
    or (:old."DETAILS" is null and :new."DETAILS" is not null)
    or (:old."DETAILS" is not null and :new."DETAILS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'DETAILS',
        'Updated',
        :old."DETAILS",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."ERROR_INDICATOR" != :new."ERROR_INDICATOR")
    or (:old."ERROR_INDICATOR" is null and :new."ERROR_INDICATOR" is not null)
    or (:old."ERROR_INDICATOR" is not null and :new."ERROR_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'ERROR_INDICATOR',
        'Updated',
        :old."ERROR_INDICATOR",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."EVENT_DATE" != :new."EVENT_DATE")
    or (:old."EVENT_DATE" is null and :new."EVENT_DATE" is not null)
    or (:old."EVENT_DATE" is not null and :new."EVENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'EVENT_DATE',
        'Updated',
        to_char(:old."EVENT_DATE",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."HRG_SEQ" != :new."HRG_SEQ")
    or (:old."HRG_SEQ" is null and :new."HRG_SEQ" is not null)
    or (:old."HRG_SEQ" is not null and :new."HRG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'HRG_SEQ',
        'Updated',
        to_char(:old."HRG_SEQ"),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."ISSUE_STAGE" != :new."ISSUE_STAGE")
    or (:old."ISSUE_STAGE" is null and :new."ISSUE_STAGE" is not null)
    or (:old."ISSUE_STAGE" is not null and :new."ISSUE_STAGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'ISSUE_STAGE',
        'Updated',
        :old."ISSUE_STAGE",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."PROCESS_DATE" != :new."PROCESS_DATE")
    or (:old."PROCESS_DATE" is null and :new."PROCESS_DATE" is not null)
    or (:old."PROCESS_DATE" is not null and :new."PROCESS_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'PROCESS_DATE',
        'Updated',
        to_char(:old."PROCESS_DATE",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."PROCESS_STAGE" != :new."PROCESS_STAGE")
    or (:old."PROCESS_STAGE" is null and :new."PROCESS_STAGE" is not null)
    or (:old."PROCESS_STAGE" is not null and :new."PROCESS_STAGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'PROCESS_STAGE',
        'Updated',
        :old."PROCESS_STAGE",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_1" != :new."REPORT_VALUE_1")
    or (:old."REPORT_VALUE_1" is null and :new."REPORT_VALUE_1" is not null)
    or (:old."REPORT_VALUE_1" is not null and :new."REPORT_VALUE_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_1',
        'Updated',
        :old."REPORT_VALUE_1",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_10" != :new."REPORT_VALUE_10")
    or (:old."REPORT_VALUE_10" is null and :new."REPORT_VALUE_10" is not null)
    or (:old."REPORT_VALUE_10" is not null and :new."REPORT_VALUE_10" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_10',
        'Updated',
        :old."REPORT_VALUE_10",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_11" != :new."REPORT_VALUE_11")
    or (:old."REPORT_VALUE_11" is null and :new."REPORT_VALUE_11" is not null)
    or (:old."REPORT_VALUE_11" is not null and :new."REPORT_VALUE_11" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_11',
        'Updated',
        :old."REPORT_VALUE_11",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_12" != :new."REPORT_VALUE_12")
    or (:old."REPORT_VALUE_12" is null and :new."REPORT_VALUE_12" is not null)
    or (:old."REPORT_VALUE_12" is not null and :new."REPORT_VALUE_12" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_12',
        'Updated',
        :old."REPORT_VALUE_12",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_13" != :new."REPORT_VALUE_13")
    or (:old."REPORT_VALUE_13" is null and :new."REPORT_VALUE_13" is not null)
    or (:old."REPORT_VALUE_13" is not null and :new."REPORT_VALUE_13" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_13',
        'Updated',
        :old."REPORT_VALUE_13",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_14" != :new."REPORT_VALUE_14")
    or (:old."REPORT_VALUE_14" is null and :new."REPORT_VALUE_14" is not null)
    or (:old."REPORT_VALUE_14" is not null and :new."REPORT_VALUE_14" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_14',
        'Updated',
        :old."REPORT_VALUE_14",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_2" != :new."REPORT_VALUE_2")
    or (:old."REPORT_VALUE_2" is null and :new."REPORT_VALUE_2" is not null)
    or (:old."REPORT_VALUE_2" is not null and :new."REPORT_VALUE_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_2',
        'Updated',
        :old."REPORT_VALUE_2",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_3" != :new."REPORT_VALUE_3")
    or (:old."REPORT_VALUE_3" is null and :new."REPORT_VALUE_3" is not null)
    or (:old."REPORT_VALUE_3" is not null and :new."REPORT_VALUE_3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_3',
        'Updated',
        :old."REPORT_VALUE_3",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_4" != :new."REPORT_VALUE_4")
    or (:old."REPORT_VALUE_4" is null and :new."REPORT_VALUE_4" is not null)
    or (:old."REPORT_VALUE_4" is not null and :new."REPORT_VALUE_4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_4',
        'Updated',
        :old."REPORT_VALUE_4",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_5" != :new."REPORT_VALUE_5")
    or (:old."REPORT_VALUE_5" is null and :new."REPORT_VALUE_5" is not null)
    or (:old."REPORT_VALUE_5" is not null and :new."REPORT_VALUE_5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_5',
        'Updated',
        :old."REPORT_VALUE_5",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_6" != :new."REPORT_VALUE_6")
    or (:old."REPORT_VALUE_6" is null and :new."REPORT_VALUE_6" is not null)
    or (:old."REPORT_VALUE_6" is not null and :new."REPORT_VALUE_6" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_6',
        'Updated',
        :old."REPORT_VALUE_6",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_7" != :new."REPORT_VALUE_7")
    or (:old."REPORT_VALUE_7" is null and :new."REPORT_VALUE_7" is not null)
    or (:old."REPORT_VALUE_7" is not null and :new."REPORT_VALUE_7" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_7',
        'Updated',
        :old."REPORT_VALUE_7",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_8" != :new."REPORT_VALUE_8")
    or (:old."REPORT_VALUE_8" is null and :new."REPORT_VALUE_8" is not null)
    or (:old."REPORT_VALUE_8" is not null and :new."REPORT_VALUE_8" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_8',
        'Updated',
        :old."REPORT_VALUE_8",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_9" != :new."REPORT_VALUE_9")
    or (:old."REPORT_VALUE_9" is null and :new."REPORT_VALUE_9" is not null)
    or (:old."REPORT_VALUE_9" is not null and :new."REPORT_VALUE_9" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'REPORT_VALUE_9',
        'Updated',
        :old."REPORT_VALUE_9",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."SERVICE_DATE" != :new."SERVICE_DATE")
    or (:old."SERVICE_DATE" is null and :new."SERVICE_DATE" is not null)
    or (:old."SERVICE_DATE" is not null and :new."SERVICE_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'SERVICE_DATE',
        'Updated',
        to_char(:old."SERVICE_DATE",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."SERVICE_STATUS" != :new."SERVICE_STATUS")
    or (:old."SERVICE_STATUS" is null and :new."SERVICE_STATUS" is not null)
    or (:old."SERVICE_STATUS" is not null and :new."SERVICE_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'SERVICE_STATUS',
        'Updated',
        :old."SERVICE_STATUS",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."STD_EVENT_ID" != :new."STD_EVENT_ID")
    or (:old."STD_EVENT_ID" is null and :new."STD_EVENT_ID" is not null)
    or (:old."STD_EVENT_ID" is not null and :new."STD_EVENT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'STD_EVENT_ID',
        'Updated',
        to_char(:old."STD_EVENT_ID"),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."USERNAME" != :new."USERNAME")
    or (:old."USERNAME" is null and :new."USERNAME" is not null)
    or (:old."USERNAME" is not null and :new."USERNAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'USERNAME',
        'Updated',
        :old."USERNAME",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."WARRANT_ID" != :new."WARRANT_ID")
    or (:old."WARRANT_ID" is null and :new."WARRANT_ID" is not null)
    or (:old."WARRANT_ID" is not null and :new."WARRANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'AE_EVENTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."AE_EVENT_SEQ",:new."AE_EVENT_SEQ")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_AE_EVENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_ALLOWED_DEBTS"
after update or insert or delete on "ALLOWED_DEBTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADDRESS_UNKNOWN" != :new."ADDRESS_UNKNOWN")
    or (:old."ADDRESS_UNKNOWN" is null and :new."ADDRESS_UNKNOWN" is not null)
    or (:old."ADDRESS_UNKNOWN" is not null and :new."ADDRESS_UNKNOWN" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'ADDRESS_UNKNOWN',
        'Updated',
        :old."ADDRESS_UNKNOWN",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."CASEMAN_DEBT" != :new."CASEMAN_DEBT")
    or (:old."CASEMAN_DEBT" is null and :new."CASEMAN_DEBT" is not null)
    or (:old."CASEMAN_DEBT" is not null and :new."CASEMAN_DEBT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'CASEMAN_DEBT',
        'Updated',
        :old."CASEMAN_DEBT",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."CP_CREDITOR_ID" != :new."CP_CREDITOR_ID")
    or (:old."CP_CREDITOR_ID" is null and :new."CP_CREDITOR_ID" is not null)
    or (:old."CP_CREDITOR_ID" is not null and :new."CP_CREDITOR_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'CP_CREDITOR_ID',
        'Updated',
        to_char(:old."CP_CREDITOR_ID"),
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."CP_PAYEE_ID" != :new."CP_PAYEE_ID")
    or (:old."CP_PAYEE_ID" is null and :new."CP_PAYEE_ID" is not null)
    or (:old."CP_PAYEE_ID" is not null and :new."CP_PAYEE_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'CP_PAYEE_ID',
        'Updated',
        to_char(:old."CP_PAYEE_ID"),
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."CREDITOR_PREF_COMM_METHOD" != :new."CREDITOR_PREF_COMM_METHOD")
    or (:old."CREDITOR_PREF_COMM_METHOD" is null and :new."CREDITOR_PREF_COMM_METHOD" is not null)
    or (:old."CREDITOR_PREF_COMM_METHOD" is not null and :new."CREDITOR_PREF_COMM_METHOD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'CREDITOR_PREF_COMM_METHOD',
        'Updated',
        :old."CREDITOR_PREF_COMM_METHOD",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."CREDITOR_WELSH_INDICATOR" != :new."CREDITOR_WELSH_INDICATOR")
    or (:old."CREDITOR_WELSH_INDICATOR" is null and :new."CREDITOR_WELSH_INDICATOR" is not null)
    or (:old."CREDITOR_WELSH_INDICATOR" is not null and :new."CREDITOR_WELSH_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'CREDITOR_WELSH_INDICATOR',
        'Updated',
        :old."CREDITOR_WELSH_INDICATOR",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_ADMIN_COURT_CODE" != :new."DEBT_ADMIN_COURT_CODE")
    or (:old."DEBT_ADMIN_COURT_CODE" is null and :new."DEBT_ADMIN_COURT_CODE" is not null)
    or (:old."DEBT_ADMIN_COURT_CODE" is not null and :new."DEBT_ADMIN_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."DEBT_ADMIN_COURT_CODE"),
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_AMOUNT_ALLOWED" != :new."DEBT_AMOUNT_ALLOWED")
    or (:old."DEBT_AMOUNT_ALLOWED" is null and :new."DEBT_AMOUNT_ALLOWED" is not null)
    or (:old."DEBT_AMOUNT_ALLOWED" is not null and :new."DEBT_AMOUNT_ALLOWED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_AMOUNT_ALLOWED',
        'Updated',
        to_char(:old."DEBT_AMOUNT_ALLOWED"),
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_AMOUNT_ALLOWED_CURRENCY" != :new."DEBT_AMOUNT_ALLOWED_CURRENCY")
    or (:old."DEBT_AMOUNT_ALLOWED_CURRENCY" is null and :new."DEBT_AMOUNT_ALLOWED_CURRENCY" is not null)
    or (:old."DEBT_AMOUNT_ALLOWED_CURRENCY" is not null and :new."DEBT_AMOUNT_ALLOWED_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_AMOUNT_ALLOWED_CURRENCY',
        'Updated',
        :old."DEBT_AMOUNT_ALLOWED_CURRENCY",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_AMOUNT_ORIGINAL" != :new."DEBT_AMOUNT_ORIGINAL")
    or (:old."DEBT_AMOUNT_ORIGINAL" is null and :new."DEBT_AMOUNT_ORIGINAL" is not null)
    or (:old."DEBT_AMOUNT_ORIGINAL" is not null and :new."DEBT_AMOUNT_ORIGINAL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_AMOUNT_ORIGINAL',
        'Updated',
        to_char(:old."DEBT_AMOUNT_ORIGINAL"),
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_AMOUNT_ORIGINAL_CURRENCY" != :new."DEBT_AMOUNT_ORIGINAL_CURRENCY")
    or (:old."DEBT_AMOUNT_ORIGINAL_CURRENCY" is null and :new."DEBT_AMOUNT_ORIGINAL_CURRENCY" is not null)
    or (:old."DEBT_AMOUNT_ORIGINAL_CURRENCY" is not null and :new."DEBT_AMOUNT_ORIGINAL_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_AMOUNT_ORIGINAL_CURRENCY',
        'Updated',
        :old."DEBT_AMOUNT_ORIGINAL_CURRENCY",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_CASE_NUMBER" != :new."DEBT_CASE_NUMBER")
    or (:old."DEBT_CASE_NUMBER" is null and :new."DEBT_CASE_NUMBER" is not null)
    or (:old."DEBT_CASE_NUMBER" is not null and :new."DEBT_CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_CASE_NUMBER',
        'Updated',
        :old."DEBT_CASE_NUMBER",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_CO_NUMBER" != :new."DEBT_CO_NUMBER")
    or (:old."DEBT_CO_NUMBER" is null and :new."DEBT_CO_NUMBER" is not null)
    or (:old."DEBT_CO_NUMBER" is not null and :new."DEBT_CO_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_CO_NUMBER',
        'Updated',
        :old."DEBT_CO_NUMBER",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_CREDITOR_REFERENCE" != :new."DEBT_CREDITOR_REFERENCE")
    or (:old."DEBT_CREDITOR_REFERENCE" is null and :new."DEBT_CREDITOR_REFERENCE" is not null)
    or (:old."DEBT_CREDITOR_REFERENCE" is not null and :new."DEBT_CREDITOR_REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_CREDITOR_REFERENCE',
        'Updated',
        :old."DEBT_CREDITOR_REFERENCE",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_PAYEE_INDICATOR" != :new."DEBT_PAYEE_INDICATOR")
    or (:old."DEBT_PAYEE_INDICATOR" is null and :new."DEBT_PAYEE_INDICATOR" is not null)
    or (:old."DEBT_PAYEE_INDICATOR" is not null and :new."DEBT_PAYEE_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_PAYEE_INDICATOR',
        'Updated',
        :old."DEBT_PAYEE_INDICATOR",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_PAYEE_REFERENCE" != :new."DEBT_PAYEE_REFERENCE")
    or (:old."DEBT_PAYEE_REFERENCE" is null and :new."DEBT_PAYEE_REFERENCE" is not null)
    or (:old."DEBT_PAYEE_REFERENCE" is not null and :new."DEBT_PAYEE_REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_PAYEE_REFERENCE',
        'Updated',
        :old."DEBT_PAYEE_REFERENCE",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_SEQ" != :new."DEBT_SEQ")
    or (:old."DEBT_SEQ" is null and :new."DEBT_SEQ" is not null)
    or (:old."DEBT_SEQ" is not null and :new."DEBT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_SEQ',
        'Updated',
        to_char(:old."DEBT_SEQ"),
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEBT_STATUS" != :new."DEBT_STATUS")
    or (:old."DEBT_STATUS" is null and :new."DEBT_STATUS" is not null)
    or (:old."DEBT_STATUS" is not null and :new."DEBT_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEBT_STATUS',
        'Updated',
        :old."DEBT_STATUS",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEFT_CASE_PARTY_NO" != :new."DEFT_CASE_PARTY_NO")
    or (:old."DEFT_CASE_PARTY_NO" is null and :new."DEFT_CASE_PARTY_NO" is not null)
    or (:old."DEFT_CASE_PARTY_NO" is not null and :new."DEFT_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEFT_CASE_PARTY_NO',
        'Updated',
        to_char(:old."DEFT_CASE_PARTY_NO"),
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."DEFT_PARTY_ROLE_CODE" != :new."DEFT_PARTY_ROLE_CODE")
    or (:old."DEFT_PARTY_ROLE_CODE" is null and :new."DEFT_PARTY_ROLE_CODE" is not null)
    or (:old."DEFT_PARTY_ROLE_CODE" is not null and :new."DEFT_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'DEFT_PARTY_ROLE_CODE',
        'Updated',
        :old."DEFT_PARTY_ROLE_CODE",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."PAYEE_PREF_COMM_METHOD" != :new."PAYEE_PREF_COMM_METHOD")
    or (:old."PAYEE_PREF_COMM_METHOD" is null and :new."PAYEE_PREF_COMM_METHOD" is not null)
    or (:old."PAYEE_PREF_COMM_METHOD" is not null and :new."PAYEE_PREF_COMM_METHOD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'PAYEE_PREF_COMM_METHOD',
        'Updated',
        :old."PAYEE_PREF_COMM_METHOD",
        to_char(:old."DEBT_SEQ"));
    end if;
    if (:old."PAYEE_WELSH_INDICATOR" != :new."PAYEE_WELSH_INDICATOR")
    or (:old."PAYEE_WELSH_INDICATOR" is null and :new."PAYEE_WELSH_INDICATOR" is not null)
    or (:old."PAYEE_WELSH_INDICATOR" is not null and :new."PAYEE_WELSH_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'ALLOWED_DEBTS',
        'PAYEE_WELSH_INDICATOR',
        'Updated',
        :old."PAYEE_WELSH_INDICATOR",
        to_char(:old."DEBT_SEQ"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'ALLOWED_DEBTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."DEBT_SEQ",:new."DEBT_SEQ")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_ALLOWED_DEBTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_CASES"
after update or insert or delete on "CASES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CASES                                            */
/*   Script generated 04-AUG-2007 09:38:39                                    */
/*   From:                                                                    */
/*     Server   csa00072                                                      */
/*     Database supsb                                                         */
/*     User     CMAN                                                          */
/******************************************************************************/
/******************************************************************************/
/**  THIS TRIGGER MUST NOT BE EDITED. IF THERE ARE SCHEMA CHANGES FOR        **/
/**  AUDITED TABLES, THE AUDIT TRIGGERS MUST BE REGENERATED USING A SCRIPT   **/
/**  PRODUCED BY PROCEDURE AUD_TRIG_GEN.                                     **/
/******************************************************************************/
/******************************************************************************/
/*   If updating, each column is checked to see if it has changed, and for    */
/*   each one that has there is a row written to SUPS_AMENDMENTS.             */
/*   If inserting or deleting, a single row is written to SUPS_AMENDMENTS.    */
/******************************************************************************/
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADMIN_CRT_CODE" != :new."ADMIN_CRT_CODE")
    or (:old."ADMIN_CRT_CODE" is null and :new."ADMIN_CRT_CODE" is not null)
    or (:old."ADMIN_CRT_CODE" is not null and :new."ADMIN_CRT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'ADMIN_CRT_CODE',
        'Updated',
        to_char(:old."ADMIN_CRT_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."AMOUNT_CLAIMED" != :new."AMOUNT_CLAIMED")
    or (:old."AMOUNT_CLAIMED" is null and :new."AMOUNT_CLAIMED" is not null)
    or (:old."AMOUNT_CLAIMED" is not null and :new."AMOUNT_CLAIMED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'AMOUNT_CLAIMED',
        'Updated',
        to_char(:old."AMOUNT_CLAIMED"),
        :old."CASE_NUMBER");
    end if;
    if (:old."AMOUNT_CLAIMED_CURRENCY" != :new."AMOUNT_CLAIMED_CURRENCY")
    or (:old."AMOUNT_CLAIMED_CURRENCY" is null and :new."AMOUNT_CLAIMED_CURRENCY" is not null)
    or (:old."AMOUNT_CLAIMED_CURRENCY" is not null and :new."AMOUNT_CLAIMED_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'AMOUNT_CLAIMED_CURRENCY',
        'Updated',
        :old."AMOUNT_CLAIMED_CURRENCY",
        :old."CASE_NUMBER");
    end if;
    if (:old."BRIEF_DETAILS_OF_CLAIM" != :new."BRIEF_DETAILS_OF_CLAIM")
    or (:old."BRIEF_DETAILS_OF_CLAIM" is null and :new."BRIEF_DETAILS_OF_CLAIM" is not null)
    or (:old."BRIEF_DETAILS_OF_CLAIM" is not null and :new."BRIEF_DETAILS_OF_CLAIM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'BRIEF_DETAILS_OF_CLAIM',
        'Updated',
        :old."BRIEF_DETAILS_OF_CLAIM",
        :old."CASE_NUMBER");
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        :old."CASE_NUMBER");
    end if;
    if (:old."CASE_TYPE" != :new."CASE_TYPE")
    or (:old."CASE_TYPE" is null and :new."CASE_TYPE" is not null)
    or (:old."CASE_TYPE" is not null and :new."CASE_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'CASE_TYPE',
        'Updated',
        :old."CASE_TYPE",
        :old."CASE_NUMBER");
    end if;
    if (:old."CJR" != :new."CJR")
    or (:old."CJR" is null and :new."CJR" is not null)
    or (:old."CJR" is not null and :new."CJR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'CJR',
        'Updated',
        :old."CJR",
        :old."CASE_NUMBER");
    end if;
    if (:old."COURT_FEE" != :new."COURT_FEE")
    or (:old."COURT_FEE" is null and :new."COURT_FEE" is not null)
    or (:old."COURT_FEE" is not null and :new."COURT_FEE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'COURT_FEE',
        'Updated',
        to_char(:old."COURT_FEE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."COURT_FEE_CURRENCY" != :new."COURT_FEE_CURRENCY")
    or (:old."COURT_FEE_CURRENCY" is null and :new."COURT_FEE_CURRENCY" is not null)
    or (:old."COURT_FEE_CURRENCY" is not null and :new."COURT_FEE_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'COURT_FEE_CURRENCY',
        'Updated',
        :old."COURT_FEE_CURRENCY",
        :old."CASE_NUMBER");
    end if;
    if (:old."CRED_CODE" != :new."CRED_CODE")
    or (:old."CRED_CODE" is null and :new."CRED_CODE" is not null)
    or (:old."CRED_CODE" is not null and :new."CRED_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'CRED_CODE',
        'Updated',
        to_char(:old."CRED_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."DATE_OF_ISSUE" != :new."DATE_OF_ISSUE")
    or (:old."DATE_OF_ISSUE" is null and :new."DATE_OF_ISSUE" is not null)
    or (:old."DATE_OF_ISSUE" is not null and :new."DATE_OF_ISSUE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'DATE_OF_ISSUE',
        'Updated',
        to_char(:old."DATE_OF_ISSUE",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
    if (:old."DATE_OF_TRANSFER" != :new."DATE_OF_TRANSFER")
    or (:old."DATE_OF_TRANSFER" is null and :new."DATE_OF_TRANSFER" is not null)
    or (:old."DATE_OF_TRANSFER" is not null and :new."DATE_OF_TRANSFER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'DATE_OF_TRANSFER',
        'Updated',
        to_char(:old."DATE_OF_TRANSFER",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
    if (:old."DATE_TRANSFERRED_IN" != :new."DATE_TRANSFERRED_IN")
    or (:old."DATE_TRANSFERRED_IN" is null and :new."DATE_TRANSFERRED_IN" is not null)
    or (:old."DATE_TRANSFERRED_IN" is not null and :new."DATE_TRANSFERRED_IN" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'DATE_TRANSFERRED_IN',
        'Updated',
        to_char(:old."DATE_TRANSFERRED_IN",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
    if (:old."JUDGE" != :new."JUDGE")
    or (:old."JUDGE" is null and :new."JUDGE" is not null)
    or (:old."JUDGE" is not null and :new."JUDGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'JUDGE',
        'Updated',
        to_char(:old."JUDGE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."MANUAL" != :new."MANUAL")
    or (:old."MANUAL" is null and :new."MANUAL" is not null)
    or (:old."MANUAL" is not null and :new."MANUAL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'MANUAL',
        'Updated',
        :old."MANUAL",
        :old."CASE_NUMBER");
    end if;
    if (:old."PARTICULARS_OF_CLAIM" != :new."PARTICULARS_OF_CLAIM")
    or (:old."PARTICULARS_OF_CLAIM" is null and :new."PARTICULARS_OF_CLAIM" is not null)
    or (:old."PARTICULARS_OF_CLAIM" is not null and :new."PARTICULARS_OF_CLAIM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'PARTICULARS_OF_CLAIM',
        'Updated',
        :old."PARTICULARS_OF_CLAIM",
        :old."CASE_NUMBER");
    end if;
    if (:old."PREF_COURT_CODE" != :new."PREF_COURT_CODE")
    or (:old."PREF_COURT_CODE" is null and :new."PREF_COURT_CODE" is not null)
    or (:old."PREF_COURT_CODE" is not null and :new."PREF_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'PREF_COURT_CODE',
        'Updated',
        to_char(:old."PREF_COURT_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."PREVIOUS_COURT" != :new."PREVIOUS_COURT")
    or (:old."PREVIOUS_COURT" is null and :new."PREVIOUS_COURT" is not null)
    or (:old."PREVIOUS_COURT" is not null and :new."PREVIOUS_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'PREVIOUS_COURT',
        'Updated',
        to_char(:old."PREVIOUS_COURT"),
        :old."CASE_NUMBER");
    end if;
    if (:old."RECEIPT_DATE" != :new."RECEIPT_DATE")
    or (:old."RECEIPT_DATE" is null and :new."RECEIPT_DATE" is not null)
    or (:old."RECEIPT_DATE" is not null and :new."RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
    if (:old."SOLICITORS_COSTS" != :new."SOLICITORS_COSTS")
    or (:old."SOLICITORS_COSTS" is null and :new."SOLICITORS_COSTS" is not null)
    or (:old."SOLICITORS_COSTS" is not null and :new."SOLICITORS_COSTS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'SOLICITORS_COSTS',
        'Updated',
        to_char(:old."SOLICITORS_COSTS"),
        :old."CASE_NUMBER");
    end if;
    if (:old."SOLICITORS_COSTS_CURRENCY" != :new."SOLICITORS_COSTS_CURRENCY")
    or (:old."SOLICITORS_COSTS_CURRENCY" is null and :new."SOLICITORS_COSTS_CURRENCY" is not null)
    or (:old."SOLICITORS_COSTS_CURRENCY" is not null and :new."SOLICITORS_COSTS_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'SOLICITORS_COSTS_CURRENCY',
        'Updated',
        :old."SOLICITORS_COSTS_CURRENCY",
        :old."CASE_NUMBER");
    end if;
    if (:old."STATUS" != :new."STATUS")
    or (:old."STATUS" is null and :new."STATUS" is not null)
    or (:old."STATUS" is not null and :new."STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'STATUS',
        'Updated',
        :old."STATUS",
        :old."CASE_NUMBER");
    end if;
    if (:old."TOTAL" != :new."TOTAL")
    or (:old."TOTAL" is null and :new."TOTAL" is not null)
    or (:old."TOTAL" is not null and :new."TOTAL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'TOTAL',
        'Updated',
        to_char(:old."TOTAL"),
        :old."CASE_NUMBER");
    end if;
    if (:old."TOTAL_CURRENCY" != :new."TOTAL_CURRENCY")
    or (:old."TOTAL_CURRENCY" is null and :new."TOTAL_CURRENCY" is not null)
    or (:old."TOTAL_CURRENCY" is not null and :new."TOTAL_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'TOTAL_CURRENCY',
        'Updated',
        :old."TOTAL_CURRENCY",
        :old."CASE_NUMBER");
    end if;
    if (:old."TRACK" != :new."TRACK")
    or (:old."TRACK" is null and :new."TRACK" is not null)
    or (:old."TRACK" is not null and :new."TRACK" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'TRACK',
        'Updated',
        to_char(:old."TRACK"),
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANSFER_REASON" != :new."TRANSFER_REASON")
    or (:old."TRANSFER_REASON" is null and :new."TRANSFER_REASON" is not null)
    or (:old."TRANSFER_REASON" is not null and :new."TRANSFER_REASON" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'TRANSFER_REASON',
        'Updated',
        :old."TRANSFER_REASON",
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANSFER_STATUS" != :new."TRANSFER_STATUS")
    or (:old."TRANSFER_STATUS" is null and :new."TRANSFER_STATUS" is not null)
    or (:old."TRANSFER_STATUS" is not null and :new."TRANSFER_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'TRANSFER_STATUS',
        'Updated',
        :old."TRANSFER_STATUS",
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANS_CASE_TYPE" != :new."TRANS_CASE_TYPE")
    or (:old."TRANS_CASE_TYPE" is null and :new."TRANS_CASE_TYPE" is not null)
    or (:old."TRANS_CASE_TYPE" is not null and :new."TRANS_CASE_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'TRANS_CASE_TYPE',
        'Updated',
        :old."TRANS_CASE_TYPE",
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANS_CRT_CODE" != :new."TRANS_CRT_CODE")
    or (:old."TRANS_CRT_CODE" is null and :new."TRANS_CRT_CODE" is not null)
    or (:old."TRANS_CRT_CODE" is not null and :new."TRANS_CRT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'TRANS_CRT_CODE',
        'Updated',
        to_char(:old."TRANS_CRT_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."XFER_RECEIPT_DATE" != :new."XFER_RECEIPT_DATE")
    or (:old."XFER_RECEIPT_DATE" is null and :new."XFER_RECEIPT_DATE" is not null)
    or (:old."XFER_RECEIPT_DATE" is not null and :new."XFER_RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASES',
        'XFER_RECEIPT_DATE',
        'Updated',
        to_char(:old."XFER_RECEIPT_DATE",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CASES',
      null,
      v_type,
      null,
      nvl(:old."CASE_NUMBER",:new."CASE_NUMBER"));
  end if;
end;

/
ALTER TRIGGER "CASEMAN"."AUD_CASES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_CASE_EVENTS"
after update or insert or delete on "CASE_EVENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."AGE_CATEGORY" != :new."AGE_CATEGORY")
    or (:old."AGE_CATEGORY" is null and :new."AGE_CATEGORY" is not null)
    or (:old."AGE_CATEGORY" is not null and :new."AGE_CATEGORY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'AGE_CATEGORY',
        'Updated',
        :old."AGE_CATEGORY",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."BMS_TASK_NUMBER" != :new."BMS_TASK_NUMBER")
    or (:old."BMS_TASK_NUMBER" is null and :new."BMS_TASK_NUMBER" is not null)
    or (:old."BMS_TASK_NUMBER" is not null and :new."BMS_TASK_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'BMS_TASK_NUMBER',
        'Updated',
        :old."BMS_TASK_NUMBER",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."CASE_FLAG" != :new."CASE_FLAG")
    or (:old."CASE_FLAG" is null and :new."CASE_FLAG" is not null)
    or (:old."CASE_FLAG" is not null and :new."CASE_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'CASE_FLAG',
        'Updated',
        :old."CASE_FLAG",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."CASE_PARTY_NO" != :new."CASE_PARTY_NO")
    or (:old."CASE_PARTY_NO" is null and :new."CASE_PARTY_NO" is not null)
    or (:old."CASE_PARTY_NO" is not null and :new."CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'CASE_PARTY_NO',
        'Updated',
        to_char(:old."CASE_PARTY_NO"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."CREATING_COURT" != :new."CREATING_COURT")
    or (:old."CREATING_COURT" is null and :new."CREATING_COURT" is not null)
    or (:old."CREATING_COURT" is not null and :new."CREATING_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'CREATING_COURT',
        'Updated',
        to_char(:old."CREATING_COURT"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."CREATING_SECTION" != :new."CREATING_SECTION")
    or (:old."CREATING_SECTION" is null and :new."CREATING_SECTION" is not null)
    or (:old."CREATING_SECTION" is not null and :new."CREATING_SECTION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'CREATING_SECTION',
        'Updated',
        :old."CREATING_SECTION",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."CRT_CODE" != :new."CRT_CODE")
    or (:old."CRT_CODE" is null and :new."CRT_CODE" is not null)
    or (:old."CRT_CODE" is not null and :new."CRT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'CRT_CODE',
        'Updated',
        to_char(:old."CRT_CODE"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."DATE_TO_RTL" != :new."DATE_TO_RTL")
    or (:old."DATE_TO_RTL" is null and :new."DATE_TO_RTL" is not null)
    or (:old."DATE_TO_RTL" is not null and :new."DATE_TO_RTL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'DATE_TO_RTL',
        'Updated',
        to_char(:old."DATE_TO_RTL",'YYYY-MM-DD'),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."DELETED_FLAG" != :new."DELETED_FLAG")
    or (:old."DELETED_FLAG" is null and :new."DELETED_FLAG" is not null)
    or (:old."DELETED_FLAG" is not null and :new."DELETED_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'DELETED_FLAG',
        'Updated',
        :old."DELETED_FLAG",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."DETAILS" != :new."DETAILS")
    or (:old."DETAILS" is null and :new."DETAILS" is not null)
    or (:old."DETAILS" is not null and :new."DETAILS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'DETAILS',
        'Updated',
        :old."DETAILS",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."EVENT_DATE" != :new."EVENT_DATE")
    or (:old."EVENT_DATE" is null and :new."EVENT_DATE" is not null)
    or (:old."EVENT_DATE" is not null and :new."EVENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'EVENT_DATE',
        'Updated',
        to_char(:old."EVENT_DATE",'YYYY-MM-DD'),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."EVENT_SEQ" != :new."EVENT_SEQ")
    or (:old."EVENT_SEQ" is null and :new."EVENT_SEQ" is not null)
    or (:old."EVENT_SEQ" is not null and :new."EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'EVENT_SEQ',
        'Updated',
        to_char(:old."EVENT_SEQ"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."HRG_SEQ" != :new."HRG_SEQ")
    or (:old."HRG_SEQ" is null and :new."HRG_SEQ" is not null)
    or (:old."HRG_SEQ" is not null and :new."HRG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'HRG_SEQ',
        'Updated',
        to_char(:old."HRG_SEQ"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."JUDG_SEQ" != :new."JUDG_SEQ")
    or (:old."JUDG_SEQ" is null and :new."JUDG_SEQ" is not null)
    or (:old."JUDG_SEQ" is not null and :new."JUDG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'JUDG_SEQ',
        'Updated',
        to_char(:old."JUDG_SEQ"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."PARTY_ROLE_CODE" != :new."PARTY_ROLE_CODE")
    or (:old."PARTY_ROLE_CODE" is null and :new."PARTY_ROLE_CODE" is not null)
    or (:old."PARTY_ROLE_CODE" is not null and :new."PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_ROLE_CODE",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."RECEIPT_DATE" != :new."RECEIPT_DATE")
    or (:old."RECEIPT_DATE" is null and :new."RECEIPT_DATE" is not null)
    or (:old."RECEIPT_DATE" is not null and :new."RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."REGISTER_JUDGMENT" != :new."REGISTER_JUDGMENT")
    or (:old."REGISTER_JUDGMENT" is null and :new."REGISTER_JUDGMENT" is not null)
    or (:old."REGISTER_JUDGMENT" is not null and :new."REGISTER_JUDGMENT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'REGISTER_JUDGMENT',
        'Updated',
        :old."REGISTER_JUDGMENT",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."REQUESTER" != :new."REQUESTER")
    or (:old."REQUESTER" is null and :new."REQUESTER" is not null)
    or (:old."REQUESTER" is not null and :new."REQUESTER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'REQUESTER',
        'Updated',
        :old."REQUESTER",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."RESULT" != :new."RESULT")
    or (:old."RESULT" is null and :new."RESULT" is not null)
    or (:old."RESULT" is not null and :new."RESULT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'RESULT',
        'Updated',
        :old."RESULT",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."RESULT_DATE" != :new."RESULT_DATE")
    or (:old."RESULT_DATE" is null and :new."RESULT_DATE" is not null)
    or (:old."RESULT_DATE" is not null and :new."RESULT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'RESULT_DATE',
        'Updated',
        to_char(:old."RESULT_DATE",'YYYY-MM-DD'),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."STATS_MODULE" != :new."STATS_MODULE")
    or (:old."STATS_MODULE" is null and :new."STATS_MODULE" is not null)
    or (:old."STATS_MODULE" is not null and :new."STATS_MODULE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'STATS_MODULE',
        'Updated',
        :old."STATS_MODULE",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."STD_EVENT_ID" != :new."STD_EVENT_ID")
    or (:old."STD_EVENT_ID" is null and :new."STD_EVENT_ID" is not null)
    or (:old."STD_EVENT_ID" is not null and :new."STD_EVENT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'STD_EVENT_ID',
        'Updated',
        to_char(:old."STD_EVENT_ID"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."USERNAME" != :new."USERNAME")
    or (:old."USERNAME" is null and :new."USERNAME" is not null)
    or (:old."USERNAME" is not null and :new."USERNAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'USERNAME',
        'Updated',
        :old."USERNAME",
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."VARY_SEQ" != :new."VARY_SEQ")
    or (:old."VARY_SEQ" is null and :new."VARY_SEQ" is not null)
    or (:old."VARY_SEQ" is not null and :new."VARY_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'VARY_SEQ',
        'Updated',
        to_char(:old."VARY_SEQ"),
        to_char(:old."EVENT_SEQ"));
    end if;
    if (:old."WARRANT_ID" != :new."WARRANT_ID")
    or (:old."WARRANT_ID" is null and :new."WARRANT_ID" is not null)
    or (:old."WARRANT_ID" is not null and :new."WARRANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_EVENTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        to_char(:old."EVENT_SEQ"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CASE_EVENTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."EVENT_SEQ",:new."EVENT_SEQ")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_CASE_EVENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_CASE_PARTY_ROLES"
after update or insert or delete on "CASE_PARTY_ROLES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CASE_PARTY_ROLES                                 */
/*   Script generated 04-AUG-2007 09:38:39                                    */
/*   From:                                                                    */
/*     Server   csa00072                                                      */
/*     Database supsb                                                         */
/*     User     CMAN                                                          */
/******************************************************************************/
/******************************************************************************/
/**  THIS TRIGGER MUST NOT BE EDITED. IF THERE ARE SCHEMA CHANGES FOR        **/
/**  AUDITED TABLES, THE AUDIT TRIGGERS MUST BE REGENERATED USING A SCRIPT   **/
/**  PRODUCED BY PROCEDURE AUD_TRIG_GEN.                                     **/
/******************************************************************************/
/******************************************************************************/
/*   If updating, each column is checked to see if it has changed, and for    */
/*   each one that has there is a row written to SUPS_AMENDMENTS.             */
/*   If inserting or deleting, a single row is written to SUPS_AMENDMENTS.    */
/******************************************************************************/
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."CASE_PARTY_NO" != :new."CASE_PARTY_NO")
    or (:old."CASE_PARTY_NO" is null and :new."CASE_PARTY_NO" is not null)
    or (:old."CASE_PARTY_NO" is not null and :new."CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'CASE_PARTY_NO',
        'Updated',
        to_char(:old."CASE_PARTY_NO"),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_BAR_JUDGMENT" != :new."DEFT_BAR_JUDGMENT")
    or (:old."DEFT_BAR_JUDGMENT" is null and :new."DEFT_BAR_JUDGMENT" is not null)
    or (:old."DEFT_BAR_JUDGMENT" is not null and :new."DEFT_BAR_JUDGMENT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_BAR_JUDGMENT',
        'Updated',
        :old."DEFT_BAR_JUDGMENT",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_DATE_OF_SERVICE" != :new."DEFT_DATE_OF_SERVICE")
    or (:old."DEFT_DATE_OF_SERVICE" is null and :new."DEFT_DATE_OF_SERVICE" is not null)
    or (:old."DEFT_DATE_OF_SERVICE" is not null and :new."DEFT_DATE_OF_SERVICE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_DATE_OF_SERVICE',
        'Updated',
        to_char(:old."DEFT_DATE_OF_SERVICE",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_DATE_OF_SERVICE_RO" != :new."DEFT_DATE_OF_SERVICE_RO")
    or (:old."DEFT_DATE_OF_SERVICE_RO" is null and :new."DEFT_DATE_OF_SERVICE_RO" is not null)
    or (:old."DEFT_DATE_OF_SERVICE_RO" is not null and :new."DEFT_DATE_OF_SERVICE_RO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_DATE_OF_SERVICE_RO',
        'Updated',
        to_char(:old."DEFT_DATE_OF_SERVICE_RO",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_LAST_DATE_FOR_REPLY" != :new."DEFT_LAST_DATE_FOR_REPLY")
    or (:old."DEFT_LAST_DATE_FOR_REPLY" is null and :new."DEFT_LAST_DATE_FOR_REPLY" is not null)
    or (:old."DEFT_LAST_DATE_FOR_REPLY" is not null and :new."DEFT_LAST_DATE_FOR_REPLY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_LAST_DATE_FOR_REPLY',
        'Updated',
        to_char(:old."DEFT_LAST_DATE_FOR_REPLY",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_MCOL_PASSWORD" != :new."DEFT_MCOL_PASSWORD")
    or (:old."DEFT_MCOL_PASSWORD" is null and :new."DEFT_MCOL_PASSWORD" is not null)
    or (:old."DEFT_MCOL_PASSWORD" is not null and :new."DEFT_MCOL_PASSWORD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_MCOL_PASSWORD',
        'Updated',
        :old."DEFT_MCOL_PASSWORD",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_METHOD_OF_SERVICE" != :new."DEFT_METHOD_OF_SERVICE")
    or (:old."DEFT_METHOD_OF_SERVICE" is null and :new."DEFT_METHOD_OF_SERVICE" is not null)
    or (:old."DEFT_METHOD_OF_SERVICE" is not null and :new."DEFT_METHOD_OF_SERVICE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_METHOD_OF_SERVICE',
        'Updated',
        :old."DEFT_METHOD_OF_SERVICE",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."LAST_DATE_FOR_SERVICE" != :new."LAST_DATE_FOR_SERVICE")
    or (:old."LAST_DATE_FOR_SERVICE" is null and :new."LAST_DATE_FOR_SERVICE" is not null)
    or (:old."LAST_DATE_FOR_SERVICE" is not null and :new."LAST_DATE_FOR_SERVICE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'LAST_DATE_FOR_SERVICE',
        'Updated',
        to_char(:old."LAST_DATE_FOR_SERVICE",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PARTY_ID" != :new."PARTY_ID")
    or (:old."PARTY_ID" is null and :new."PARTY_ID" is not null)
    or (:old."PARTY_ID" is not null and :new."PARTY_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PARTY_ROLE_CODE" != :new."PARTY_ROLE_CODE")
    or (:old."PARTY_ROLE_CODE" is null and :new."PARTY_ROLE_CODE" is not null)
    or (:old."PARTY_ROLE_CODE" is not null and :new."PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_ROLE_CODE",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PAYEE_FLAG" != :new."PAYEE_FLAG")
    or (:old."PAYEE_FLAG" is null and :new."PAYEE_FLAG" is not null)
    or (:old."PAYEE_FLAG" is not null and :new."PAYEE_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PAYEE_FLAG',
        'Updated',
        :old."PAYEE_FLAG",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PREFERRED_COMMUNICATION_METHOD" != :new."PREFERRED_COMMUNICATION_METHOD")
    or (:old."PREFERRED_COMMUNICATION_METHOD" is null and :new."PREFERRED_COMMUNICATION_METHOD" is not null)
    or (:old."PREFERRED_COMMUNICATION_METHOD" is not null and :new."PREFERRED_COMMUNICATION_METHOD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PREFERRED_COMMUNICATION_METHOD',
        'Updated',
        :old."PREFERRED_COMMUNICATION_METHOD",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."REFERENCE" != :new."REFERENCE")
    or (:old."REFERENCE" is null and :new."REFERENCE" is not null)
    or (:old."REFERENCE" is not null and :new."REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'REFERENCE',
        'Updated',
        :old."REFERENCE",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."WELSH_INDICATOR" != :new."WELSH_INDICATOR")
    or (:old."WELSH_INDICATOR" is null and :new."WELSH_INDICATOR" is not null)
    or (:old."WELSH_INDICATOR" is not null and :new."WELSH_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'WELSH_INDICATOR',
        'Updated',
        :old."WELSH_INDICATOR",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."MEDIATION_NAME" != :new."MEDIATION_NAME")
    or (:old."MEDIATION_NAME" is null and :new."MEDIATION_NAME" is not null)
    or (:old."MEDIATION_NAME" is not null and :new."MEDIATION_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_NAME',
        'Updated',
        :old."MEDIATION_NAME",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."MEDIATION_TEL_NO" != :new."MEDIATION_TEL_NO")
    or (:old."MEDIATION_TEL_NO" is null and :new."MEDIATION_TEL_NO" is not null)
    or (:old."MEDIATION_TEL_NO" is not null and :new."MEDIATION_TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_TEL_NO',
        'Updated',
        :old."MEDIATION_TEL_NO",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."MEDIATION_EMAIL" != :new."MEDIATION_EMAIL")
    or (:old."MEDIATION_EMAIL" is null and :new."MEDIATION_EMAIL" is not null)
    or (:old."MEDIATION_EMAIL" is not null and :new."MEDIATION_EMAIL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_EMAIL',
        'Updated',
        :old."MEDIATION_EMAIL",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."MEDIATION_AVAILABILITY" != :new."MEDIATION_AVAILABILITY")
    or (:old."MEDIATION_AVAILABILITY" is null and :new."MEDIATION_AVAILABILITY" is not null)
    or (:old."MEDIATION_AVAILABILITY" is not null and :new."MEDIATION_AVAILABILITY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_AVAILABILITY',
        'Updated',
        :old."MEDIATION_AVAILABILITY",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."MEDIATION_NOTES" != :new."MEDIATION_NOTES")
    or (:old."MEDIATION_NOTES" is null and :new."MEDIATION_NOTES" is not null)
    or (:old."MEDIATION_NOTES" is not null and :new."MEDIATION_NOTES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_NOTES',
        'Updated',
        :old."MEDIATION_NOTES",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."CONFIDENTIAL" != :new."CONFIDENTIAL")
    or (:old."CONFIDENTIAL" is null and :new."CONFIDENTIAL" is not null)
    or (:old."CONFIDENTIAL" is not null and :new."CONFIDENTIAL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'CONFIDENTIAL',
        'Updated',
        :old."CONFIDENTIAL",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02,
      pk03)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CASE_PARTY_ROLES',
      null,
      v_type,
      null,
      nvl(:old."CASE_NUMBER",:new."CASE_NUMBER"),
      to_char(nvl(:old."CASE_PARTY_NO",:new."CASE_PARTY_NO")),
      nvl(:old."PARTY_ROLE_CODE",:new."PARTY_ROLE_CODE"));
  end if;
end;

/
ALTER TRIGGER "CASEMAN"."AUD_CASE_PARTY_ROLES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_CODED_PARTIES"
after update or insert or delete on "CODED_PARTIES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADDRESS_LINE1" != :new."ADDRESS_LINE1")
    or (:old."ADDRESS_LINE1" is null and :new."ADDRESS_LINE1" is not null)
    or (:old."ADDRESS_LINE1" is not null and :new."ADDRESS_LINE1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'ADDRESS_LINE1',
        'Updated',
        :old."ADDRESS_LINE1",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE2" != :new."ADDRESS_LINE2")
    or (:old."ADDRESS_LINE2" is null and :new."ADDRESS_LINE2" is not null)
    or (:old."ADDRESS_LINE2" is not null and :new."ADDRESS_LINE2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'ADDRESS_LINE2',
        'Updated',
        :old."ADDRESS_LINE2",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE3" != :new."ADDRESS_LINE3")
    or (:old."ADDRESS_LINE3" is null and :new."ADDRESS_LINE3" is not null)
    or (:old."ADDRESS_LINE3" is not null and :new."ADDRESS_LINE3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'ADDRESS_LINE3',
        'Updated',
        :old."ADDRESS_LINE3",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE4" != :new."ADDRESS_LINE4")
    or (:old."ADDRESS_LINE4" is null and :new."ADDRESS_LINE4" is not null)
    or (:old."ADDRESS_LINE4" is not null and :new."ADDRESS_LINE4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'ADDRESS_LINE4',
        'Updated',
        :old."ADDRESS_LINE4",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE5" != :new."ADDRESS_LINE5")
    or (:old."ADDRESS_LINE5" is null and :new."ADDRESS_LINE5" is not null)
    or (:old."ADDRESS_LINE5" is not null and :new."ADDRESS_LINE5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'ADDRESS_LINE5',
        'Updated',
        :old."ADDRESS_LINE5",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADMIN_COURT_CODE" != :new."ADMIN_COURT_CODE")
    or (:old."ADMIN_COURT_CODE" is null and :new."ADMIN_COURT_CODE" is not null)
    or (:old."ADMIN_COURT_CODE" is not null and :new."ADMIN_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."CASCADE_UPDATE_FLAG" != :new."CASCADE_UPDATE_FLAG")
    or (:old."CASCADE_UPDATE_FLAG" is null and :new."CASCADE_UPDATE_FLAG" is not null)
    or (:old."CASCADE_UPDATE_FLAG" is not null and :new."CASCADE_UPDATE_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'CASCADE_UPDATE_FLAG',
        'Updated',
        :old."CASCADE_UPDATE_FLAG",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."CODE" != :new."CODE")
    or (:old."CODE" is null and :new."CODE" is not null)
    or (:old."CODE" is not null and :new."CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'CODE',
        'Updated',
        to_char(:old."CODE"),
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PARTY_ID" != :new."PARTY_ID")
    or (:old."PARTY_ID" is null and :new."PARTY_ID" is not null)
    or (:old."PARTY_ID" is not null and :new."PARTY_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PERSON_REQUESTED_NAME" != :new."PERSON_REQUESTED_NAME")
    or (:old."PERSON_REQUESTED_NAME" is null and :new."PERSON_REQUESTED_NAME" is not null)
    or (:old."PERSON_REQUESTED_NAME" is not null and :new."PERSON_REQUESTED_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'PERSON_REQUESTED_NAME',
        'Updated',
        :old."PERSON_REQUESTED_NAME",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."POSTCODE" != :new."POSTCODE")
    or (:old."POSTCODE" is null and :new."POSTCODE" is not null)
    or (:old."POSTCODE" is not null and :new."POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'POSTCODE',
        'Updated',
        :old."POSTCODE",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PTY_TYPE" != :new."PTY_TYPE")
    or (:old."PTY_TYPE" is null and :new."PTY_TYPE" is not null)
    or (:old."PTY_TYPE" is not null and :new."PTY_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'PTY_TYPE',
        'Updated',
        :old."PTY_TYPE",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CODED_PARTIES',
      null,
      v_type,
      null,
      to_char(nvl(:old."CODE",:new."CODE")),
      to_char(nvl(:old."ADMIN_COURT_CODE",:new."ADMIN_COURT_CODE")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_CODED_PARTIES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_CONSOLIDATED_ORDERS"
after update or insert or delete on "CONSOLIDATED_ORDERS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADHOC_DIVIDEND" != :new."ADHOC_DIVIDEND")
    or (:old."ADHOC_DIVIDEND" is null and :new."ADHOC_DIVIDEND" is not null)
    or (:old."ADHOC_DIVIDEND" is not null and :new."ADHOC_DIVIDEND" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'ADHOC_DIVIDEND',
        'Updated',
        :old."ADHOC_DIVIDEND",
        :old."CO_NUMBER");
    end if;
    if (:old."ADMIN_COURT_CODE" != :new."ADMIN_COURT_CODE")
    or (:old."ADMIN_COURT_CODE" is null and :new."ADMIN_COURT_CODE" is not null)
    or (:old."ADMIN_COURT_CODE" is not null and :new."ADMIN_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        :old."CO_NUMBER");
    end if;
    if (:old."AGAINST_PARTY_ADDR_ID_CO_REG" != :new."AGAINST_PARTY_ADDR_ID_CO_REG")
    or (:old."AGAINST_PARTY_ADDR_ID_CO_REG" is null and :new."AGAINST_PARTY_ADDR_ID_CO_REG" is not null)
    or (:old."AGAINST_PARTY_ADDR_ID_CO_REG" is not null and :new."AGAINST_PARTY_ADDR_ID_CO_REG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'AGAINST_PARTY_ADDR_ID_CO_REG',
        'Updated',
        to_char(:old."AGAINST_PARTY_ADDR_ID_CO_REG"),
        :old."CO_NUMBER");
    end if;
    if (:old."AO_N60_DATE" != :new."AO_N60_DATE")
    or (:old."AO_N60_DATE" is null and :new."AO_N60_DATE" is not null)
    or (:old."AO_N60_DATE" is not null and :new."AO_N60_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'AO_N60_DATE',
        'Updated',
        to_char(:old."AO_N60_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."APPLN_RECEIVED_DATE" != :new."APPLN_RECEIVED_DATE")
    or (:old."APPLN_RECEIVED_DATE" is null and :new."APPLN_RECEIVED_DATE" is not null)
    or (:old."APPLN_RECEIVED_DATE" is not null and :new."APPLN_RECEIVED_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'APPLN_RECEIVED_DATE',
        'Updated',
        to_char(:old."APPLN_RECEIVED_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."ATTACHMENT_ARREARS_DATE" != :new."ATTACHMENT_ARREARS_DATE")
    or (:old."ATTACHMENT_ARREARS_DATE" is null and :new."ATTACHMENT_ARREARS_DATE" is not null)
    or (:old."ATTACHMENT_ARREARS_DATE" is not null and :new."ATTACHMENT_ARREARS_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'ATTACHMENT_ARREARS_DATE',
        'Updated',
        to_char(:old."ATTACHMENT_ARREARS_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."ATTACHMENT_LAPSED_DATE" != :new."ATTACHMENT_LAPSED_DATE")
    or (:old."ATTACHMENT_LAPSED_DATE" is null and :new."ATTACHMENT_LAPSED_DATE" is not null)
    or (:old."ATTACHMENT_LAPSED_DATE" is not null and :new."ATTACHMENT_LAPSED_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'ATTACHMENT_LAPSED_DATE',
        'Updated',
        to_char(:old."ATTACHMENT_LAPSED_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."COMP_RATE" != :new."COMP_RATE")
    or (:old."COMP_RATE" is null and :new."COMP_RATE" is not null)
    or (:old."COMP_RATE" is not null and :new."COMP_RATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'COMP_RATE',
        'Updated',
        to_char(:old."COMP_RATE"),
        :old."CO_NUMBER");
    end if;
    if (:old."COMP_TYPE" != :new."COMP_TYPE")
    or (:old."COMP_TYPE" is null and :new."COMP_TYPE" is not null)
    or (:old."COMP_TYPE" is not null and :new."COMP_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'COMP_TYPE',
        'Updated',
        :old."COMP_TYPE",
        :old."CO_NUMBER");
    end if;
    if (:old."COURT_OF_TRANSFER" != :new."COURT_OF_TRANSFER")
    or (:old."COURT_OF_TRANSFER" is null and :new."COURT_OF_TRANSFER" is not null)
    or (:old."COURT_OF_TRANSFER" is not null and :new."COURT_OF_TRANSFER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'COURT_OF_TRANSFER',
        'Updated',
        to_char(:old."COURT_OF_TRANSFER"),
        :old."CO_NUMBER");
    end if;
    if (:old."CO_NUMBER" != :new."CO_NUMBER")
    or (:old."CO_NUMBER" is null and :new."CO_NUMBER" is not null)
    or (:old."CO_NUMBER" is not null and :new."CO_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        :old."CO_NUMBER");
    end if;
    if (:old."CO_STATUS" != :new."CO_STATUS")
    or (:old."CO_STATUS" is null and :new."CO_STATUS" is not null)
    or (:old."CO_STATUS" is not null and :new."CO_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'CO_STATUS',
        'Updated',
        :old."CO_STATUS",
        :old."CO_NUMBER");
    end if;
    if (:old."CO_TYPE" != :new."CO_TYPE")
    or (:old."CO_TYPE" is null and :new."CO_TYPE" is not null)
    or (:old."CO_TYPE" is not null and :new."CO_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'CO_TYPE',
        'Updated',
        :old."CO_TYPE",
        :old."CO_NUMBER");
    end if;
    if (:old."DEBTOR_NAME" != :new."DEBTOR_NAME")
    or (:old."DEBTOR_NAME" is null and :new."DEBTOR_NAME" is not null)
    or (:old."DEBTOR_NAME" is not null and :new."DEBTOR_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DEBTOR_NAME',
        'Updated',
        :old."DEBTOR_NAME",
        :old."CO_NUMBER");
    end if;
    if (:old."DEBTOR_OCCUPATION" != :new."DEBTOR_OCCUPATION")
    or (:old."DEBTOR_OCCUPATION" is null and :new."DEBTOR_OCCUPATION" is not null)
    or (:old."DEBTOR_OCCUPATION" is not null and :new."DEBTOR_OCCUPATION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DEBTOR_OCCUPATION',
        'Updated',
        :old."DEBTOR_OCCUPATION",
        :old."CO_NUMBER");
    end if;
    if (:old."DIVIDEND_TARGET" != :new."DIVIDEND_TARGET")
    or (:old."DIVIDEND_TARGET" is null and :new."DIVIDEND_TARGET" is not null)
    or (:old."DIVIDEND_TARGET" is not null and :new."DIVIDEND_TARGET" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DIVIDEND_TARGET',
        'Updated',
        to_char(:old."DIVIDEND_TARGET"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_BANK_CREDIT" != :new."DOM_BANK_CREDIT")
    or (:old."DOM_BANK_CREDIT" is null and :new."DOM_BANK_CREDIT" is not null)
    or (:old."DOM_BANK_CREDIT" is not null and :new."DOM_BANK_CREDIT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_BANK_CREDIT',
        'Updated',
        to_char(:old."DOM_BANK_CREDIT"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_BANK_CREDIT_CURRENCY" != :new."DOM_BANK_CREDIT_CURRENCY")
    or (:old."DOM_BANK_CREDIT_CURRENCY" is null and :new."DOM_BANK_CREDIT_CURRENCY" is not null)
    or (:old."DOM_BANK_CREDIT_CURRENCY" is not null and :new."DOM_BANK_CREDIT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_BANK_CREDIT_CURRENCY',
        'Updated',
        :old."DOM_BANK_CREDIT_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_DISALLOWED_EXPENSES" != :new."DOM_DISALLOWED_EXPENSES")
    or (:old."DOM_DISALLOWED_EXPENSES" is null and :new."DOM_DISALLOWED_EXPENSES" is not null)
    or (:old."DOM_DISALLOWED_EXPENSES" is not null and :new."DOM_DISALLOWED_EXPENSES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_DISALLOWED_EXPENSES',
        'Updated',
        to_char(:old."DOM_DISALLOWED_EXPENSES"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_DISALLOWED_EXPENSES_CURR" != :new."DOM_DISALLOWED_EXPENSES_CURR")
    or (:old."DOM_DISALLOWED_EXPENSES_CURR" is null and :new."DOM_DISALLOWED_EXPENSES_CURR" is not null)
    or (:old."DOM_DISALLOWED_EXPENSES_CURR" is not null and :new."DOM_DISALLOWED_EXPENSES_CURR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_DISALLOWED_EXPENSES_CURR',
        'Updated',
        :old."DOM_DISALLOWED_EXPENSES_CURR",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_DISALLOWED_REASONS" != :new."DOM_DISALLOWED_REASONS")
    or (:old."DOM_DISALLOWED_REASONS" is null and :new."DOM_DISALLOWED_REASONS" is not null)
    or (:old."DOM_DISALLOWED_REASONS" is not null and :new."DOM_DISALLOWED_REASONS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_DISALLOWED_REASONS',
        'Updated',
        :old."DOM_DISALLOWED_REASONS",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_DISPOSABLE_INCOME" != :new."DOM_DISPOSABLE_INCOME")
    or (:old."DOM_DISPOSABLE_INCOME" is null and :new."DOM_DISPOSABLE_INCOME" is not null)
    or (:old."DOM_DISPOSABLE_INCOME" is not null and :new."DOM_DISPOSABLE_INCOME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_DISPOSABLE_INCOME',
        'Updated',
        to_char(:old."DOM_DISPOSABLE_INCOME"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_DISPOSABLE_INCOME_CURRENCY" != :new."DOM_DISPOSABLE_INCOME_CURRENCY")
    or (:old."DOM_DISPOSABLE_INCOME_CURRENCY" is null and :new."DOM_DISPOSABLE_INCOME_CURRENCY" is not null)
    or (:old."DOM_DISPOSABLE_INCOME_CURRENCY" is not null and :new."DOM_DISPOSABLE_INCOME_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_DISPOSABLE_INCOME_CURRENCY',
        'Updated',
        :old."DOM_DISPOSABLE_INCOME_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_INCOME" != :new."DOM_INCOME")
    or (:old."DOM_INCOME" is null and :new."DOM_INCOME" is not null)
    or (:old."DOM_INCOME" is not null and :new."DOM_INCOME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_INCOME',
        'Updated',
        to_char(:old."DOM_INCOME"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_INCOME_CURRENCY" != :new."DOM_INCOME_CURRENCY")
    or (:old."DOM_INCOME_CURRENCY" is null and :new."DOM_INCOME_CURRENCY" is not null)
    or (:old."DOM_INCOME_CURRENCY" is not null and :new."DOM_INCOME_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_INCOME_CURRENCY',
        'Updated',
        :old."DOM_INCOME_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_INSTAL_AMOUNT" != :new."DOM_INSTAL_AMOUNT")
    or (:old."DOM_INSTAL_AMOUNT" is null and :new."DOM_INSTAL_AMOUNT" is not null)
    or (:old."DOM_INSTAL_AMOUNT" is not null and :new."DOM_INSTAL_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_INSTAL_AMOUNT',
        'Updated',
        to_char(:old."DOM_INSTAL_AMOUNT"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_INSTAL_AMOUNT_CURRENCY" != :new."DOM_INSTAL_AMOUNT_CURRENCY")
    or (:old."DOM_INSTAL_AMOUNT_CURRENCY" is null and :new."DOM_INSTAL_AMOUNT_CURRENCY" is not null)
    or (:old."DOM_INSTAL_AMOUNT_CURRENCY" is not null and :new."DOM_INSTAL_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_INSTAL_AMOUNT_CURRENCY',
        'Updated',
        :old."DOM_INSTAL_AMOUNT_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_OFFER" != :new."DOM_OFFER")
    or (:old."DOM_OFFER" is null and :new."DOM_OFFER" is not null)
    or (:old."DOM_OFFER" is not null and :new."DOM_OFFER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_OFFER',
        'Updated',
        to_char(:old."DOM_OFFER"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_OFFER_CURRENCY" != :new."DOM_OFFER_CURRENCY")
    or (:old."DOM_OFFER_CURRENCY" is null and :new."DOM_OFFER_CURRENCY" is not null)
    or (:old."DOM_OFFER_CURRENCY" is not null and :new."DOM_OFFER_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_OFFER_CURRENCY',
        'Updated',
        :old."DOM_OFFER_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_SAVINGS_AMOUNT" != :new."DOM_SAVINGS_AMOUNT")
    or (:old."DOM_SAVINGS_AMOUNT" is null and :new."DOM_SAVINGS_AMOUNT" is not null)
    or (:old."DOM_SAVINGS_AMOUNT" is not null and :new."DOM_SAVINGS_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_SAVINGS_AMOUNT',
        'Updated',
        to_char(:old."DOM_SAVINGS_AMOUNT"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_SAVINGS_AMOUNT_CURRENCY" != :new."DOM_SAVINGS_AMOUNT_CURRENCY")
    or (:old."DOM_SAVINGS_AMOUNT_CURRENCY" is null and :new."DOM_SAVINGS_AMOUNT_CURRENCY" is not null)
    or (:old."DOM_SAVINGS_AMOUNT_CURRENCY" is not null and :new."DOM_SAVINGS_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_SAVINGS_AMOUNT_CURRENCY',
        'Updated',
        :old."DOM_SAVINGS_AMOUNT_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_TOTAL_EXPENSES" != :new."DOM_TOTAL_EXPENSES")
    or (:old."DOM_TOTAL_EXPENSES" is null and :new."DOM_TOTAL_EXPENSES" is not null)
    or (:old."DOM_TOTAL_EXPENSES" is not null and :new."DOM_TOTAL_EXPENSES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_TOTAL_EXPENSES',
        'Updated',
        to_char(:old."DOM_TOTAL_EXPENSES"),
        :old."CO_NUMBER");
    end if;
    if (:old."DOM_TOTAL_EXPENSES_CURRENCY" != :new."DOM_TOTAL_EXPENSES_CURRENCY")
    or (:old."DOM_TOTAL_EXPENSES_CURRENCY" is null and :new."DOM_TOTAL_EXPENSES_CURRENCY" is not null)
    or (:old."DOM_TOTAL_EXPENSES_CURRENCY" is not null and :new."DOM_TOTAL_EXPENSES_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'DOM_TOTAL_EXPENSES_CURRENCY',
        'Updated',
        :old."DOM_TOTAL_EXPENSES_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."FEE_AMOUNT" != :new."FEE_AMOUNT")
    or (:old."FEE_AMOUNT" is null and :new."FEE_AMOUNT" is not null)
    or (:old."FEE_AMOUNT" is not null and :new."FEE_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'FEE_AMOUNT',
        'Updated',
        to_char(:old."FEE_AMOUNT"),
        :old."CO_NUMBER");
    end if;
    if (:old."FEE_AMOUNT_CURRENCY" != :new."FEE_AMOUNT_CURRENCY")
    or (:old."FEE_AMOUNT_CURRENCY" is null and :new."FEE_AMOUNT_CURRENCY" is not null)
    or (:old."FEE_AMOUNT_CURRENCY" is not null and :new."FEE_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'FEE_AMOUNT_CURRENCY',
        'Updated',
        :old."FEE_AMOUNT_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."FEE_RATE" != :new."FEE_RATE")
    or (:old."FEE_RATE" is null and :new."FEE_RATE" is not null)
    or (:old."FEE_RATE" is not null and :new."FEE_RATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'FEE_RATE',
        'Updated',
        to_char(:old."FEE_RATE"),
        :old."CO_NUMBER");
    end if;
    if (:old."FIRST_PAYMENT_DATE" != :new."FIRST_PAYMENT_DATE")
    or (:old."FIRST_PAYMENT_DATE" is null and :new."FIRST_PAYMENT_DATE" is not null)
    or (:old."FIRST_PAYMENT_DATE" is not null and :new."FIRST_PAYMENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'FIRST_PAYMENT_DATE',
        'Updated',
        to_char(:old."FIRST_PAYMENT_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."FREQUENCY" != :new."FREQUENCY")
    or (:old."FREQUENCY" is null and :new."FREQUENCY" is not null)
    or (:old."FREQUENCY" is not null and :new."FREQUENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'FREQUENCY',
        'Updated',
        :old."FREQUENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."INSTAL_AMOUNT" != :new."INSTAL_AMOUNT")
    or (:old."INSTAL_AMOUNT" is null and :new."INSTAL_AMOUNT" is not null)
    or (:old."INSTAL_AMOUNT" is not null and :new."INSTAL_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'INSTAL_AMOUNT',
        'Updated',
        to_char(:old."INSTAL_AMOUNT"),
        :old."CO_NUMBER");
    end if;
    if (:old."INSTAL_AMOUNT_CURRENCY" != :new."INSTAL_AMOUNT_CURRENCY")
    or (:old."INSTAL_AMOUNT_CURRENCY" is null and :new."INSTAL_AMOUNT_CURRENCY" is not null)
    or (:old."INSTAL_AMOUNT_CURRENCY" is not null and :new."INSTAL_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'INSTAL_AMOUNT_CURRENCY',
        'Updated',
        :old."INSTAL_AMOUNT_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."NAMED_EMPLOYER" != :new."NAMED_EMPLOYER")
    or (:old."NAMED_EMPLOYER" is null and :new."NAMED_EMPLOYER" is not null)
    or (:old."NAMED_EMPLOYER" is not null and :new."NAMED_EMPLOYER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'NAMED_EMPLOYER',
        'Updated',
        :old."NAMED_EMPLOYER",
        :old."CO_NUMBER");
    end if;
    if (:old."OLD_NUMBER" != :new."OLD_NUMBER")
    or (:old."OLD_NUMBER" is null and :new."OLD_NUMBER" is not null)
    or (:old."OLD_NUMBER" is not null and :new."OLD_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'OLD_NUMBER',
        'Updated',
        :old."OLD_NUMBER",
        :old."CO_NUMBER");
    end if;
    if (:old."ORDER_DATE" != :new."ORDER_DATE")
    or (:old."ORDER_DATE" is null and :new."ORDER_DATE" is not null)
    or (:old."ORDER_DATE" is not null and :new."ORDER_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'ORDER_DATE',
        'Updated',
        to_char(:old."ORDER_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."PAYROLL_NUMBER" != :new."PAYROLL_NUMBER")
    or (:old."PAYROLL_NUMBER" is null and :new."PAYROLL_NUMBER" is not null)
    or (:old."PAYROLL_NUMBER" is not null and :new."PAYROLL_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'PAYROLL_NUMBER',
        'Updated',
        :old."PAYROLL_NUMBER",
        :old."CO_NUMBER");
    end if;
    if (:old."PER_CURRENCY" != :new."PER_CURRENCY")
    or (:old."PER_CURRENCY" is null and :new."PER_CURRENCY" is not null)
    or (:old."PER_CURRENCY" is not null and :new."PER_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'PER_CURRENCY',
        'Updated',
        :old."PER_CURRENCY",
        :old."CO_NUMBER");
    end if;
    if (:old."PROTECTED_EARNINGS_RATE" != :new."PROTECTED_EARNINGS_RATE")
    or (:old."PROTECTED_EARNINGS_RATE" is null and :new."PROTECTED_EARNINGS_RATE" is not null)
    or (:old."PROTECTED_EARNINGS_RATE" is not null and :new."PROTECTED_EARNINGS_RATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'PROTECTED_EARNINGS_RATE',
        'Updated',
        to_char(:old."PROTECTED_EARNINGS_RATE"),
        :old."CO_NUMBER");
    end if;
    if (:old."REVIEW_DATE" != :new."REVIEW_DATE")
    or (:old."REVIEW_DATE" is null and :new."REVIEW_DATE" is not null)
    or (:old."REVIEW_DATE" is not null and :new."REVIEW_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'REVIEW_DATE',
        'Updated',
        to_char(:old."REVIEW_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."REVOKED_DISCHARGED_DATE" != :new."REVOKED_DISCHARGED_DATE")
    or (:old."REVOKED_DISCHARGED_DATE" is null and :new."REVOKED_DISCHARGED_DATE" is not null)
    or (:old."REVOKED_DISCHARGED_DATE" is not null and :new."REVOKED_DISCHARGED_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'REVOKED_DISCHARGED_DATE',
        'Updated',
        to_char(:old."REVOKED_DISCHARGED_DATE",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."SENT_TO_RTL" != :new."SENT_TO_RTL")
    or (:old."SENT_TO_RTL" is null and :new."SENT_TO_RTL" is not null)
    or (:old."SENT_TO_RTL" is not null and :new."SENT_TO_RTL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'SENT_TO_RTL',
        'Updated',
        to_char(:old."SENT_TO_RTL",'YYYY-MM-DD'),
        :old."CO_NUMBER");
    end if;
    if (:old."STATUS_TO_RTL" != :new."STATUS_TO_RTL")
    or (:old."STATUS_TO_RTL" is null and :new."STATUS_TO_RTL" is not null)
    or (:old."STATUS_TO_RTL" is not null and :new."STATUS_TO_RTL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CONSOLIDATED_ORDERS',
        'STATUS_TO_RTL',
        'Updated',
        :old."STATUS_TO_RTL",
        :old."CO_NUMBER");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CONSOLIDATED_ORDERS',
      null,
      v_type,
      null,
      nvl(:old."CO_NUMBER",:new."CO_NUMBER"));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_CONSOLIDATED_ORDERS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_COURTS"
after update or insert or delete on "COURTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table COURTS                                           */
/*   Script generated 04-AUG-2007 09:38:39                                    */
/*   From:                                                                    */
/*     Server   csa00072                                                      */
/*     Database supsb                                                         */
/*     User     CMAN                                                          */
/*   Change History:                                                          */
/*     04/09/2012, Chris Vincent.                                             */
/*     Added handlers for columns WELSH_COURT_NAME and DR_TEL_NO.  Trac 4718  */
/******************************************************************************/
/******************************************************************************/
/**  THIS TRIGGER MUST NOT BE EDITED. IF THERE ARE SCHEMA CHANGES FOR        **/
/**  AUDITED TABLES, THE AUDIT TRIGGERS MUST BE REGENERATED USING A SCRIPT   **/
/**  PRODUCED BY PROCEDURE AUD_TRIG_GEN.                                     **/
/******************************************************************************/
/******************************************************************************/
/*   If updating, each column is checked to see if it has changed, and for    */
/*   each one that has there is a row written to SUPS_AMENDMENTS.             */
/*   If inserting or deleting, a single row is written to SUPS_AMENDMENTS.    */
/******************************************************************************/
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."BLF_TEL_NO" != :new."BLF_TEL_NO")
    or (:old."BLF_TEL_NO" is null and :new."BLF_TEL_NO" is not null)
    or (:old."BLF_TEL_NO" is not null and :new."BLF_TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'BLF_TEL_NO',
        'Updated',
        :old."BLF_TEL_NO",
        to_char(:old."CODE"));
    end if;
    if (:old."CASEMAN_INSERVICE" != :new."CASEMAN_INSERVICE")
    or (:old."CASEMAN_INSERVICE" is null and :new."CASEMAN_INSERVICE" is not null)
    or (:old."CASEMAN_INSERVICE" is not null and :new."CASEMAN_INSERVICE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'CASEMAN_INSERVICE',
        'Updated',
        :old."CASEMAN_INSERVICE",
        to_char(:old."CODE"));
    end if;
    if (:old."CODE" != :new."CODE")
    or (:old."CODE" is null and :new."CODE" is not null)
    or (:old."CODE" is not null and :new."CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'CODE',
        'Updated',
        to_char(:old."CODE"),
        to_char(:old."CODE"));
    end if;
    if (:old."DATABASE_NAME" != :new."DATABASE_NAME")
    or (:old."DATABASE_NAME" is null and :new."DATABASE_NAME" is not null)
    or (:old."DATABASE_NAME" is not null and :new."DATABASE_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'DATABASE_NAME',
        'Updated',
        :old."DATABASE_NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."DEED_PACK_NUMBER" != :new."DEED_PACK_NUMBER")
    or (:old."DEED_PACK_NUMBER" is null and :new."DEED_PACK_NUMBER" is not null)
    or (:old."DEED_PACK_NUMBER" is not null and :new."DEED_PACK_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'DEED_PACK_NUMBER',
        'Updated',
        :old."DEED_PACK_NUMBER",
        to_char(:old."CODE"));
    end if;
    if (:old."DEFAULT_PRINTER" != :new."DEFAULT_PRINTER")
    or (:old."DEFAULT_PRINTER" is null and :new."DEFAULT_PRINTER" is not null)
    or (:old."DEFAULT_PRINTER" is not null and :new."DEFAULT_PRINTER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'DEFAULT_PRINTER',
        'Updated',
        :old."DEFAULT_PRINTER",
        to_char(:old."CODE"));
    end if;
    if (:old."DISTRICT_REGISTRY" != :new."DISTRICT_REGISTRY")
    or (:old."DISTRICT_REGISTRY" is null and :new."DISTRICT_REGISTRY" is not null)
    or (:old."DISTRICT_REGISTRY" is not null and :new."DISTRICT_REGISTRY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'DISTRICT_REGISTRY',
        'Updated',
        :old."DISTRICT_REGISTRY",
        to_char(:old."CODE"));
    end if;
    if (:old."DX_NUMBER" != :new."DX_NUMBER")
    or (:old."DX_NUMBER" is null and :new."DX_NUMBER" is not null)
    or (:old."DX_NUMBER" is not null and :new."DX_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'DX_NUMBER',
        'Updated',
        :old."DX_NUMBER",
        to_char(:old."CODE"));
    end if;
    if (:old."FAP_ID" != :new."FAP_ID")
    or (:old."FAP_ID" is null and :new."FAP_ID" is not null)
    or (:old."FAP_ID" is not null and :new."FAP_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'FAP_ID',
        'Updated',
        :old."FAP_ID",
        to_char(:old."CODE"));
    end if;
    if (:old."FAX_NO" != :new."FAX_NO")
    or (:old."FAX_NO" is null and :new."FAX_NO" is not null)
    or (:old."FAX_NO" is not null and :new."FAX_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'FAX_NO',
        'Updated',
        :old."FAX_NO",
        to_char(:old."CODE"));
    end if;
    if (:old."ID" != :new."ID")
    or (:old."ID" is null and :new."ID" is not null)
    or (:old."ID" is not null and :new."ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'ID',
        'Updated',
        :old."ID",
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_WRT_SEQNO" != :new."LAST_WRT_SEQNO")
    or (:old."LAST_WRT_SEQNO" is null and :new."LAST_WRT_SEQNO" is not null)
    or (:old."LAST_WRT_SEQNO" is not null and :new."LAST_WRT_SEQNO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'LAST_WRT_SEQNO',
        'Updated',
        to_char(:old."LAST_WRT_SEQNO"),
        to_char(:old."CODE"));
    end if;
    if (:old."NAME" != :new."NAME")
    or (:old."NAME" is null and :new."NAME" is not null)
    or (:old."NAME" is not null and :new."NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'NAME',
        'Updated',
        :old."NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."OPEN_FLAG" != :new."OPEN_FLAG")
    or (:old."OPEN_FLAG" is null and :new."OPEN_FLAG" is not null)
    or (:old."OPEN_FLAG" is not null and :new."OPEN_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'OPEN_FLAG',
        'Updated',
        :old."OPEN_FLAG",
        to_char(:old."CODE"));
    end if;
    if (:old."SAT_COURT" != :new."SAT_COURT")
    or (:old."SAT_COURT" is null and :new."SAT_COURT" is not null)
    or (:old."SAT_COURT" is not null and :new."SAT_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'SAT_COURT',
        'Updated',
        :old."SAT_COURT",
        to_char(:old."CODE"));
    end if;
    if (:old."SUPS_CENTRALISED_FLAG" != :new."SUPS_CENTRALISED_FLAG")
    or (:old."SUPS_CENTRALISED_FLAG" is null and :new."SUPS_CENTRALISED_FLAG" is not null)
    or (:old."SUPS_CENTRALISED_FLAG" is not null and :new."SUPS_CENTRALISED_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'SUPS_CENTRALISED_FLAG',
        'Updated',
        :old."SUPS_CENTRALISED_FLAG",
        to_char(:old."CODE"));
    end if;
    if (:old."TASKS_UPDATED" != :new."TASKS_UPDATED")
    or (:old."TASKS_UPDATED" is null and :new."TASKS_UPDATED" is not null)
    or (:old."TASKS_UPDATED" is not null and :new."TASKS_UPDATED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'TASKS_UPDATED',
        'Updated',
        :old."TASKS_UPDATED",
        to_char(:old."CODE"));
    end if;
    if (:old."TEL_NO" != :new."TEL_NO")
    or (:old."TEL_NO" is null and :new."TEL_NO" is not null)
    or (:old."TEL_NO" is not null and :new."TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'TEL_NO',
        'Updated',
        :old."TEL_NO",
        to_char(:old."CODE"));
    end if;
    if (:old."TUCS_IN_USE" != :new."TUCS_IN_USE")
    or (:old."TUCS_IN_USE" is null and :new."TUCS_IN_USE" is not null)
    or (:old."TUCS_IN_USE" is not null and :new."TUCS_IN_USE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'TUCS_IN_USE',
        'Updated',
        :old."TUCS_IN_USE",
        to_char(:old."CODE"));
    end if;
    if (:old."WELSH_COUNTY_COURT_NAME" != :new."WELSH_COUNTY_COURT_NAME")
    or (:old."WELSH_COUNTY_COURT_NAME" is null and :new."WELSH_COUNTY_COURT_NAME" is not null)
    or (:old."WELSH_COUNTY_COURT_NAME" is not null and :new."WELSH_COUNTY_COURT_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'WELSH_COUNTY_COURT_NAME',
        'Updated',
        :old."WELSH_COUNTY_COURT_NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."WELSH_HIGH_COURT_NAME" != :new."WELSH_HIGH_COURT_NAME")
    or (:old."WELSH_HIGH_COURT_NAME" is null and :new."WELSH_HIGH_COURT_NAME" is not null)
    or (:old."WELSH_HIGH_COURT_NAME" is not null and :new."WELSH_HIGH_COURT_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'WELSH_HIGH_COURT_NAME',
        'Updated',
        :old."WELSH_HIGH_COURT_NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."WFT_DM_EMAIL_ADDRESS" != :new."WFT_DM_EMAIL_ADDRESS")
    or (:old."WFT_DM_EMAIL_ADDRESS" is null and :new."WFT_DM_EMAIL_ADDRESS" is not null)
    or (:old."WFT_DM_EMAIL_ADDRESS" is not null and :new."WFT_DM_EMAIL_ADDRESS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'WFT_DM_EMAIL_ADDRESS',
        'Updated',
        :old."WFT_DM_EMAIL_ADDRESS",
        to_char(:old."CODE"));
    end if;
    if (:old."WFT_GROUPING_COURT" != :new."WFT_GROUPING_COURT")
    or (:old."WFT_GROUPING_COURT" is null and :new."WFT_GROUPING_COURT" is not null)
    or (:old."WFT_GROUPING_COURT" is not null and :new."WFT_GROUPING_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'WFT_GROUPING_COURT',
        'Updated',
        to_char(:old."WFT_GROUPING_COURT"),
        to_char(:old."CODE"));
    end if;
    if (:old."WELSH_COURT_NAME" != :new."WELSH_COURT_NAME")
    or (:old."WELSH_COURT_NAME" is null and :new."WELSH_COURT_NAME" is not null)
    or (:old."WELSH_COURT_NAME" is not null and :new."WELSH_COURT_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'WELSH_COURT_NAME',
        'Updated',
        to_char(:old."WELSH_COURT_NAME"),
        to_char(:old."CODE"));
    end if;
    if (:old."DR_TEL_NO" != :new."DR_TEL_NO")
    or (:old."DR_TEL_NO" is null and :new."DR_TEL_NO" is not null)
    or (:old."DR_TEL_NO" is not null and :new."DR_TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'COURTS',
        'DR_TEL_NO',
        'Updated',
        to_char(:old."DR_TEL_NO"),
        to_char(:old."CODE"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'COURTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."CODE",:new."CODE")));
  end if;
end;

/
ALTER TRIGGER "CASEMAN"."AUD_COURTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_CO_EVENTS"
after update or insert or delete on "CO_EVENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."AGE_CATEGORY" != :new."AGE_CATEGORY")
    or (:old."AGE_CATEGORY" is null and :new."AGE_CATEGORY" is not null)
    or (:old."AGE_CATEGORY" is not null and :new."AGE_CATEGORY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'AGE_CATEGORY',
        'Updated',
        :old."AGE_CATEGORY",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."ALD_DEBT_SEQ" != :new."ALD_DEBT_SEQ")
    or (:old."ALD_DEBT_SEQ" is null and :new."ALD_DEBT_SEQ" is not null)
    or (:old."ALD_DEBT_SEQ" is not null and :new."ALD_DEBT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'ALD_DEBT_SEQ',
        'Updated',
        to_char(:old."ALD_DEBT_SEQ"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."BAILIFF_IDENTIFIER" != :new."BAILIFF_IDENTIFIER")
    or (:old."BAILIFF_IDENTIFIER" is null and :new."BAILIFF_IDENTIFIER" is not null)
    or (:old."BAILIFF_IDENTIFIER" is not null and :new."BAILIFF_IDENTIFIER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'BAILIFF_IDENTIFIER',
        'Updated',
        to_char(:old."BAILIFF_IDENTIFIER"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."BMS_TASK_NUMBER" != :new."BMS_TASK_NUMBER")
    or (:old."BMS_TASK_NUMBER" is null and :new."BMS_TASK_NUMBER" is not null)
    or (:old."BMS_TASK_NUMBER" is not null and :new."BMS_TASK_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'BMS_TASK_NUMBER',
        'Updated',
        :old."BMS_TASK_NUMBER",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."CO_EVENT_SEQ" != :new."CO_EVENT_SEQ")
    or (:old."CO_EVENT_SEQ" is null and :new."CO_EVENT_SEQ" is not null)
    or (:old."CO_EVENT_SEQ" is not null and :new."CO_EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'CO_EVENT_SEQ',
        'Updated',
        to_char(:old."CO_EVENT_SEQ"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."CO_NUMBER" != :new."CO_NUMBER")
    or (:old."CO_NUMBER" is null and :new."CO_NUMBER" is not null)
    or (:old."CO_NUMBER" is not null and :new."CO_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."CREATING_COURT" != :new."CREATING_COURT")
    or (:old."CREATING_COURT" is null and :new."CREATING_COURT" is not null)
    or (:old."CREATING_COURT" is not null and :new."CREATING_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'CREATING_COURT',
        'Updated',
        to_char(:old."CREATING_COURT"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."CREATING_SECTION" != :new."CREATING_SECTION")
    or (:old."CREATING_SECTION" is null and :new."CREATING_SECTION" is not null)
    or (:old."CREATING_SECTION" is not null and :new."CREATING_SECTION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'CREATING_SECTION',
        'Updated',
        :old."CREATING_SECTION",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."DATE_TO_RTL" != :new."DATE_TO_RTL")
    or (:old."DATE_TO_RTL" is null and :new."DATE_TO_RTL" is not null)
    or (:old."DATE_TO_RTL" is not null and :new."DATE_TO_RTL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'DATE_TO_RTL',
        'Updated',
        to_char(:old."DATE_TO_RTL",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."DETAILS" != :new."DETAILS")
    or (:old."DETAILS" is null and :new."DETAILS" is not null)
    or (:old."DETAILS" is not null and :new."DETAILS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'DETAILS',
        'Updated',
        :old."DETAILS",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."ERROR_INDICATOR" != :new."ERROR_INDICATOR")
    or (:old."ERROR_INDICATOR" is null and :new."ERROR_INDICATOR" is not null)
    or (:old."ERROR_INDICATOR" is not null and :new."ERROR_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'ERROR_INDICATOR',
        'Updated',
        :old."ERROR_INDICATOR",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."EVENT_DATE" != :new."EVENT_DATE")
    or (:old."EVENT_DATE" is null and :new."EVENT_DATE" is not null)
    or (:old."EVENT_DATE" is not null and :new."EVENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'EVENT_DATE',
        'Updated',
        to_char(:old."EVENT_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."HRG_SEQ" != :new."HRG_SEQ")
    or (:old."HRG_SEQ" is null and :new."HRG_SEQ" is not null)
    or (:old."HRG_SEQ" is not null and :new."HRG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'HRG_SEQ',
        'Updated',
        to_char(:old."HRG_SEQ"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."ISSUE_STAGE" != :new."ISSUE_STAGE")
    or (:old."ISSUE_STAGE" is null and :new."ISSUE_STAGE" is not null)
    or (:old."ISSUE_STAGE" is not null and :new."ISSUE_STAGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'ISSUE_STAGE',
        'Updated',
        :old."ISSUE_STAGE",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."PROCESS_DATE" != :new."PROCESS_DATE")
    or (:old."PROCESS_DATE" is null and :new."PROCESS_DATE" is not null)
    or (:old."PROCESS_DATE" is not null and :new."PROCESS_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'PROCESS_DATE',
        'Updated',
        to_char(:old."PROCESS_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."PROCESS_STAGE" != :new."PROCESS_STAGE")
    or (:old."PROCESS_STAGE" is null and :new."PROCESS_STAGE" is not null)
    or (:old."PROCESS_STAGE" is not null and :new."PROCESS_STAGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'PROCESS_STAGE',
        'Updated',
        :old."PROCESS_STAGE",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."RECEIPT_DATE" != :new."RECEIPT_DATE")
    or (:old."RECEIPT_DATE" is null and :new."RECEIPT_DATE" is not null)
    or (:old."RECEIPT_DATE" is not null and :new."RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_1" != :new."REPORT_VALUE_1")
    or (:old."REPORT_VALUE_1" is null and :new."REPORT_VALUE_1" is not null)
    or (:old."REPORT_VALUE_1" is not null and :new."REPORT_VALUE_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'REPORT_VALUE_1',
        'Updated',
        :old."REPORT_VALUE_1",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."SERVICE_DATE" != :new."SERVICE_DATE")
    or (:old."SERVICE_DATE" is null and :new."SERVICE_DATE" is not null)
    or (:old."SERVICE_DATE" is not null and :new."SERVICE_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'SERVICE_DATE',
        'Updated',
        to_char(:old."SERVICE_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."SERVICE_STATUS" != :new."SERVICE_STATUS")
    or (:old."SERVICE_STATUS" is null and :new."SERVICE_STATUS" is not null)
    or (:old."SERVICE_STATUS" is not null and :new."SERVICE_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'SERVICE_STATUS',
        'Updated',
        :old."SERVICE_STATUS",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."STATS_MODULE" != :new."STATS_MODULE")
    or (:old."STATS_MODULE" is null and :new."STATS_MODULE" is not null)
    or (:old."STATS_MODULE" is not null and :new."STATS_MODULE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'STATS_MODULE',
        'Updated',
        :old."STATS_MODULE",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."STD_EVENT_ID" != :new."STD_EVENT_ID")
    or (:old."STD_EVENT_ID" is null and :new."STD_EVENT_ID" is not null)
    or (:old."STD_EVENT_ID" is not null and :new."STD_EVENT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'STD_EVENT_ID',
        'Updated',
        to_char(:old."STD_EVENT_ID"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."USERNAME" != :new."USERNAME")
    or (:old."USERNAME" is null and :new."USERNAME" is not null)
    or (:old."USERNAME" is not null and :new."USERNAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'USERNAME',
        'Updated',
        :old."USERNAME",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."WARRANT_ID" != :new."WARRANT_ID")
    or (:old."WARRANT_ID" is null and :new."WARRANT_ID" is not null)
    or (:old."WARRANT_ID" is not null and :new."WARRANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CO_EVENTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."CO_EVENT_SEQ",:new."CO_EVENT_SEQ")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_CO_EVENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_CPR_TO_CPR_RELATIONSHIP"
after update or insert or delete on "CPR_TO_CPR_RELATIONSHIP"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."CPR_A_CASE_NUMBER" != :new."CPR_A_CASE_NUMBER")
    or (:old."CPR_A_CASE_NUMBER" is null and :new."CPR_A_CASE_NUMBER" is not null)
    or (:old."CPR_A_CASE_NUMBER" is not null and :new."CPR_A_CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_A_CASE_NUMBER',
        'Updated',
        :old."CPR_A_CASE_NUMBER",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_A_CASE_PARTY_NO" != :new."CPR_A_CASE_PARTY_NO")
    or (:old."CPR_A_CASE_PARTY_NO" is null and :new."CPR_A_CASE_PARTY_NO" is not null)
    or (:old."CPR_A_CASE_PARTY_NO" is not null and :new."CPR_A_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_A_CASE_PARTY_NO',
        'Updated',
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_A_PARTY_ROLE_CODE" != :new."CPR_A_PARTY_ROLE_CODE")
    or (:old."CPR_A_PARTY_ROLE_CODE" is null and :new."CPR_A_PARTY_ROLE_CODE" is not null)
    or (:old."CPR_A_PARTY_ROLE_CODE" is not null and :new."CPR_A_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_A_PARTY_ROLE_CODE',
        'Updated',
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_B_CASE_NUMBER" != :new."CPR_B_CASE_NUMBER")
    or (:old."CPR_B_CASE_NUMBER" is null and :new."CPR_B_CASE_NUMBER" is not null)
    or (:old."CPR_B_CASE_NUMBER" is not null and :new."CPR_B_CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_B_CASE_NUMBER',
        'Updated',
        :old."CPR_B_CASE_NUMBER",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_B_CASE_PARTY_NO" != :new."CPR_B_CASE_PARTY_NO")
    or (:old."CPR_B_CASE_PARTY_NO" is null and :new."CPR_B_CASE_PARTY_NO" is not null)
    or (:old."CPR_B_CASE_PARTY_NO" is not null and :new."CPR_B_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_B_CASE_PARTY_NO',
        'Updated',
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_B_PARTY_ROLE_CODE" != :new."CPR_B_PARTY_ROLE_CODE")
    or (:old."CPR_B_PARTY_ROLE_CODE" is null and :new."CPR_B_PARTY_ROLE_CODE" is not null)
    or (:old."CPR_B_PARTY_ROLE_CODE" is not null and :new."CPR_B_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_B_PARTY_ROLE_CODE',
        'Updated',
        :old."CPR_B_PARTY_ROLE_CODE",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."DELETED_FLAG" != :new."DELETED_FLAG")
    or (:old."DELETED_FLAG" is null and :new."DELETED_FLAG" is not null)
    or (:old."DELETED_FLAG" is not null and :new."DELETED_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'DELETED_FLAG',
        'Updated',
        :old."DELETED_FLAG",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."PERSONAL_REFERENCE" != :new."PERSONAL_REFERENCE")
    or (:old."PERSONAL_REFERENCE" is null and :new."PERSONAL_REFERENCE" is not null)
    or (:old."PERSONAL_REFERENCE" is not null and :new."PERSONAL_REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'PERSONAL_REFERENCE',
        'Updated',
        :old."PERSONAL_REFERENCE",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02,
      pk03,
      pk04,
      pk05,
      pk06)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CPR_TO_CPR_RELATIONSHIP',
      null,
      v_type,
      null,
      nvl(:old."CPR_A_CASE_NUMBER",:new."CPR_A_CASE_NUMBER"),
      to_char(nvl(:old."CPR_A_CASE_PARTY_NO",:new."CPR_A_CASE_PARTY_NO")),
      nvl(:old."CPR_A_PARTY_ROLE_CODE",:new."CPR_A_PARTY_ROLE_CODE"),
      nvl(:old."CPR_B_CASE_NUMBER",:new."CPR_B_CASE_NUMBER"),
      to_char(nvl(:old."CPR_B_CASE_PARTY_NO",:new."CPR_B_CASE_PARTY_NO")),
      nvl(:old."CPR_B_PARTY_ROLE_CODE",:new."CPR_B_PARTY_ROLE_CODE"));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_CPR_TO_CPR_RELATIONSHIP" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_DCA_USER"
after update or insert or delete on "DCA_USER"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ACCESS_SECURITY_LEVEL" != :new."ACCESS_SECURITY_LEVEL")
    or (:old."ACCESS_SECURITY_LEVEL" is null and :new."ACCESS_SECURITY_LEVEL" is not null)
    or (:old."ACCESS_SECURITY_LEVEL" is not null and :new."ACCESS_SECURITY_LEVEL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'ACCESS_SECURITY_LEVEL',
        'Updated',
        to_char(:old."ACCESS_SECURITY_LEVEL"),
        :old."USER_ID");
    end if;
    if (:old."ACTIVE_USER_FLAG" != :new."ACTIVE_USER_FLAG")
    or (:old."ACTIVE_USER_FLAG" is null and :new."ACTIVE_USER_FLAG" is not null)
    or (:old."ACTIVE_USER_FLAG" is not null and :new."ACTIVE_USER_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'ACTIVE_USER_FLAG',
        'Updated',
        :old."ACTIVE_USER_FLAG",
        :old."USER_ID");
    end if;
    if (:old."EXTENSION" != :new."EXTENSION")
    or (:old."EXTENSION" is null and :new."EXTENSION" is not null)
    or (:old."EXTENSION" is not null and :new."EXTENSION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'EXTENSION',
        'Updated',
        :old."EXTENSION",
        :old."USER_ID");
    end if;
    if (:old."FORENAMES" != :new."FORENAMES")
    or (:old."FORENAMES" is null and :new."FORENAMES" is not null)
    or (:old."FORENAMES" is not null and :new."FORENAMES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'FORENAMES',
        'Updated',
        :old."FORENAMES",
        :old."USER_ID");
    end if;
    if (:old."JOB_TITLE" != :new."JOB_TITLE")
    or (:old."JOB_TITLE" is null and :new."JOB_TITLE" is not null)
    or (:old."JOB_TITLE" is not null and :new."JOB_TITLE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'JOB_TITLE',
        'Updated',
        :old."JOB_TITLE",
        :old."USER_ID");
    end if;
    if (:old."PRINTER_COURT_CODE" != :new."PRINTER_COURT_CODE")
    or (:old."PRINTER_COURT_CODE" is null and :new."PRINTER_COURT_CODE" is not null)
    or (:old."PRINTER_COURT_CODE" is not null and :new."PRINTER_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'PRINTER_COURT_CODE',
        'Updated',
        to_char(:old."PRINTER_COURT_CODE"),
        :old."USER_ID");
    end if;
    if (:old."SECTION_FOR_PRINTOUTS" != :new."SECTION_FOR_PRINTOUTS")
    or (:old."SECTION_FOR_PRINTOUTS" is null and :new."SECTION_FOR_PRINTOUTS" is not null)
    or (:old."SECTION_FOR_PRINTOUTS" is not null and :new."SECTION_FOR_PRINTOUTS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'SECTION_FOR_PRINTOUTS',
        'Updated',
        :old."SECTION_FOR_PRINTOUTS",
        :old."USER_ID");
    end if;
    if (:old."SURNAME" != :new."SURNAME")
    or (:old."SURNAME" is null and :new."SURNAME" is not null)
    or (:old."SURNAME" is not null and :new."SURNAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'SURNAME',
        'Updated',
        :old."SURNAME",
        :old."USER_ID");
    end if;
    if (:old."TITLE" != :new."TITLE")
    or (:old."TITLE" is null and :new."TITLE" is not null)
    or (:old."TITLE" is not null and :new."TITLE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'TITLE',
        'Updated',
        :old."TITLE",
        :old."USER_ID");
    end if;
    if (:old."USER_DEFAULT_PRINTER" != :new."USER_DEFAULT_PRINTER")
    or (:old."USER_DEFAULT_PRINTER" is null and :new."USER_DEFAULT_PRINTER" is not null)
    or (:old."USER_DEFAULT_PRINTER" is not null and :new."USER_DEFAULT_PRINTER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'USER_DEFAULT_PRINTER',
        'Updated',
        :old."USER_DEFAULT_PRINTER",
        :old."USER_ID");
    end if;
    if (:old."USER_ID" != :new."USER_ID")
    or (:old."USER_ID" is null and :new."USER_ID" is not null)
    or (:old."USER_ID" is not null and :new."USER_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'USER_ID',
        'Updated',
        :old."USER_ID",
        :old."USER_ID");
    end if;
    if (:old."USER_SHORT_NAME" != :new."USER_SHORT_NAME")
    or (:old."USER_SHORT_NAME" is null and :new."USER_SHORT_NAME" is not null)
    or (:old."USER_SHORT_NAME" is not null and :new."USER_SHORT_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'USER_SHORT_NAME',
        'Updated',
        :old."USER_SHORT_NAME",
        :old."USER_ID");
    end if;
    if (:old."USER_STYLE_PROFILE" != :new."USER_STYLE_PROFILE")
    or (:old."USER_STYLE_PROFILE" is null and :new."USER_STYLE_PROFILE" is not null)
    or (:old."USER_STYLE_PROFILE" is not null and :new."USER_STYLE_PROFILE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'USER_STYLE_PROFILE',
        'Updated',
        :old."USER_STYLE_PROFILE",
        :old."USER_ID");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'DCA_USER',
      null,
      v_type,
      null,
      nvl(:old."USER_ID",:new."USER_ID"));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_DCA_USER" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_GIVEN_ADDRESSES"
after update or insert or delete on "GIVEN_ADDRESSES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADDRESS_ID" != :new."ADDRESS_ID")
    or (:old."ADDRESS_ID" is null and :new."ADDRESS_ID" is not null)
    or (:old."ADDRESS_ID" is not null and :new."ADDRESS_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_ID',
        'Updated',
        to_char(:old."ADDRESS_ID"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDRESS_LINE1" != :new."ADDRESS_LINE1")
    or (:old."ADDRESS_LINE1" is null and :new."ADDRESS_LINE1" is not null)
    or (:old."ADDRESS_LINE1" is not null and :new."ADDRESS_LINE1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE1',
        'Updated',
        :old."ADDRESS_LINE1",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDRESS_LINE2" != :new."ADDRESS_LINE2")
    or (:old."ADDRESS_LINE2" is null and :new."ADDRESS_LINE2" is not null)
    or (:old."ADDRESS_LINE2" is not null and :new."ADDRESS_LINE2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE2',
        'Updated',
        :old."ADDRESS_LINE2",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDRESS_LINE3" != :new."ADDRESS_LINE3")
    or (:old."ADDRESS_LINE3" is null and :new."ADDRESS_LINE3" is not null)
    or (:old."ADDRESS_LINE3" is not null and :new."ADDRESS_LINE3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE3',
        'Updated',
        :old."ADDRESS_LINE3",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDRESS_LINE4" != :new."ADDRESS_LINE4")
    or (:old."ADDRESS_LINE4" is null and :new."ADDRESS_LINE4" is not null)
    or (:old."ADDRESS_LINE4" is not null and :new."ADDRESS_LINE4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE4',
        'Updated',
        :old."ADDRESS_LINE4",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDRESS_LINE5" != :new."ADDRESS_LINE5")
    or (:old."ADDRESS_LINE5" is null and :new."ADDRESS_LINE5" is not null)
    or (:old."ADDRESS_LINE5" is not null and :new."ADDRESS_LINE5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE5',
        'Updated',
        :old."ADDRESS_LINE5",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDRESS_TYPE_CODE" != :new."ADDRESS_TYPE_CODE")
    or (:old."ADDRESS_TYPE_CODE" is null and :new."ADDRESS_TYPE_CODE" is not null)
    or (:old."ADDRESS_TYPE_CODE" is not null and :new."ADDRESS_TYPE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_TYPE_CODE',
        'Updated',
        :old."ADDRESS_TYPE_CODE",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDR_TYPE_SEQ" != :new."ADDR_TYPE_SEQ")
    or (:old."ADDR_TYPE_SEQ" is null and :new."ADDR_TYPE_SEQ" is not null)
    or (:old."ADDR_TYPE_SEQ" is not null and :new."ADDR_TYPE_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDR_TYPE_SEQ',
        'Updated',
        to_char(:old."ADDR_TYPE_SEQ"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ALD_SEQ" != :new."ALD_SEQ")
    or (:old."ALD_SEQ" is null and :new."ALD_SEQ" is not null)
    or (:old."ALD_SEQ" is not null and :new."ALD_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ALD_SEQ',
        'Updated',
        to_char(:old."ALD_SEQ"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."CASE_PARTY_NO" != :new."CASE_PARTY_NO")
    or (:old."CASE_PARTY_NO" is null and :new."CASE_PARTY_NO" is not null)
    or (:old."CASE_PARTY_NO" is not null and :new."CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'CASE_PARTY_NO',
        'Updated',
        to_char(:old."CASE_PARTY_NO"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."COURT_CODE" != :new."COURT_CODE")
    or (:old."COURT_CODE" is null and :new."COURT_CODE" is not null)
    or (:old."COURT_CODE" is not null and :new."COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'COURT_CODE',
        'Updated',
        to_char(:old."COURT_CODE"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."CO_NUMBER" != :new."CO_NUMBER")
    or (:old."CO_NUMBER" is null and :new."CO_NUMBER" is not null)
    or (:old."CO_NUMBER" is not null and :new."CO_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."PARTY_ID" != :new."PARTY_ID")
    or (:old."PARTY_ID" is null and :new."PARTY_ID" is not null)
    or (:old."PARTY_ID" is not null and :new."PARTY_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."PARTY_ROLE_CODE" != :new."PARTY_ROLE_CODE")
    or (:old."PARTY_ROLE_CODE" is null and :new."PARTY_ROLE_CODE" is not null)
    or (:old."PARTY_ROLE_CODE" is not null and :new."PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_ROLE_CODE",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."POSTCODE" != :new."POSTCODE")
    or (:old."POSTCODE" is null and :new."POSTCODE" is not null)
    or (:old."POSTCODE" is not null and :new."POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'POSTCODE',
        'Updated',
        :old."POSTCODE",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."REFERENCE" != :new."REFERENCE")
    or (:old."REFERENCE" is null and :new."REFERENCE" is not null)
    or (:old."REFERENCE" is not null and :new."REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'REFERENCE',
        'Updated',
        :old."REFERENCE",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."UPDATED_BY" != :new."UPDATED_BY")
    or (:old."UPDATED_BY" is null and :new."UPDATED_BY" is not null)
    or (:old."UPDATED_BY" is not null and :new."UPDATED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'UPDATED_BY',
        'Updated',
        :old."UPDATED_BY",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."VALID_FROM" != :new."VALID_FROM")
    or (:old."VALID_FROM" is null and :new."VALID_FROM" is not null)
    or (:old."VALID_FROM" is not null and :new."VALID_FROM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'VALID_FROM',
        'Updated',
        to_char(:old."VALID_FROM",'YYYY-MM-DD'),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."VALID_TO" != :new."VALID_TO")
    or (:old."VALID_TO" is null and :new."VALID_TO" is not null)
    or (:old."VALID_TO" is not null and :new."VALID_TO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'VALID_TO',
        'Updated',
        to_char(:old."VALID_TO",'YYYY-MM-DD'),
        to_char(:old."ADDRESS_ID"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'GIVEN_ADDRESSES',
      null,
      v_type,
      null,
      to_char(nvl(:old."ADDRESS_ID",:new."ADDRESS_ID")));
  end if;
end;

/
ALTER TRIGGER "CASEMAN"."AUD_GIVEN_ADDRESSES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_HEARINGS"
after update or insert or delete on "HEARINGS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADDRESS_ID" != :new."ADDRESS_ID")
    or (:old."ADDRESS_ID" is null and :new."ADDRESS_ID" is not null)
    or (:old."ADDRESS_ID" is not null and :new."ADDRESS_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'ADDRESS_ID',
        'Updated',
        to_char(:old."ADDRESS_ID"),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."CO_NUMBER" != :new."CO_NUMBER")
    or (:old."CO_NUMBER" is null and :new."CO_NUMBER" is not null)
    or (:old."CO_NUMBER" is not null and :new."CO_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."CRT_CODE" != :new."CRT_CODE")
    or (:old."CRT_CODE" is null and :new."CRT_CODE" is not null)
    or (:old."CRT_CODE" is not null and :new."CRT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'CRT_CODE',
        'Updated',
        to_char(:old."CRT_CODE"),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."HOURS_ALLOWED" != :new."HOURS_ALLOWED")
    or (:old."HOURS_ALLOWED" is null and :new."HOURS_ALLOWED" is not null)
    or (:old."HOURS_ALLOWED" is not null and :new."HOURS_ALLOWED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'HOURS_ALLOWED',
        'Updated',
        to_char(:old."HOURS_ALLOWED"),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."HRG_DATE" != :new."HRG_DATE")
    or (:old."HRG_DATE" is null and :new."HRG_DATE" is not null)
    or (:old."HRG_DATE" is not null and :new."HRG_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'HRG_DATE',
        'Updated',
        to_char(:old."HRG_DATE",'YYYY-MM-DD'),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."HRG_OUTCOME" != :new."HRG_OUTCOME")
    or (:old."HRG_OUTCOME" is null and :new."HRG_OUTCOME" is not null)
    or (:old."HRG_OUTCOME" is not null and :new."HRG_OUTCOME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'HRG_OUTCOME',
        'Updated',
        :old."HRG_OUTCOME",
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."HRG_SEQ" != :new."HRG_SEQ")
    or (:old."HRG_SEQ" is null and :new."HRG_SEQ" is not null)
    or (:old."HRG_SEQ" is not null and :new."HRG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'HRG_SEQ',
        'Updated',
        to_char(:old."HRG_SEQ"),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."HRG_TIME" != :new."HRG_TIME")
    or (:old."HRG_TIME" is null and :new."HRG_TIME" is not null)
    or (:old."HRG_TIME" is not null and :new."HRG_TIME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'HRG_TIME',
        'Updated',
        to_char(:old."HRG_TIME"),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."HRG_TYPE" != :new."HRG_TYPE")
    or (:old."HRG_TYPE" is null and :new."HRG_TYPE" is not null)
    or (:old."HRG_TYPE" is not null and :new."HRG_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'HRG_TYPE',
        'Updated',
        :old."HRG_TYPE",
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."MINS_ALLOWED" != :new."MINS_ALLOWED")
    or (:old."MINS_ALLOWED" is null and :new."MINS_ALLOWED" is not null)
    or (:old."MINS_ALLOWED" is not null and :new."MINS_ALLOWED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'MINS_ALLOWED',
        'Updated',
        to_char(:old."MINS_ALLOWED"),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."RECEIPT_DATE" != :new."RECEIPT_DATE")
    or (:old."RECEIPT_DATE" is null and :new."RECEIPT_DATE" is not null)
    or (:old."RECEIPT_DATE" is not null and :new."RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."TEL_NO" != :new."TEL_NO")
    or (:old."TEL_NO" is null and :new."TEL_NO" is not null)
    or (:old."TEL_NO" is not null and :new."TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'TEL_NO',
        'Updated',
        :old."TEL_NO",
        to_char(:old."HRG_SEQ"));
    end if;
    if (:old."VENUE" != :new."VENUE")
    or (:old."VENUE" is null and :new."VENUE" is not null)
    or (:old."VENUE" is not null and :new."VENUE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'HEARINGS',
        'VENUE',
        'Updated',
        :old."VENUE",
        to_char(:old."HRG_SEQ"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'HEARINGS',
      null,
      v_type,
      null,
      to_char(nvl(:old."HRG_SEQ",:new."HRG_SEQ")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_HEARINGS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_JUDGMENTS"
after update or insert or delete on "JUDGMENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."AGAINST_CASE_PARTY_NO" != :new."AGAINST_CASE_PARTY_NO")
    or (:old."AGAINST_CASE_PARTY_NO" is null and :new."AGAINST_CASE_PARTY_NO" is not null)
    or (:old."AGAINST_CASE_PARTY_NO" is not null and :new."AGAINST_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'AGAINST_CASE_PARTY_NO',
        'Updated',
        to_char(:old."AGAINST_CASE_PARTY_NO"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."AGAINST_PARTY_ADDR_ID_JUDG_REG" != :new."AGAINST_PARTY_ADDR_ID_JUDG_REG")
    or (:old."AGAINST_PARTY_ADDR_ID_JUDG_REG" is null and :new."AGAINST_PARTY_ADDR_ID_JUDG_REG" is not null)
    or (:old."AGAINST_PARTY_ADDR_ID_JUDG_REG" is not null and :new."AGAINST_PARTY_ADDR_ID_JUDG_REG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'AGAINST_PARTY_ADDR_ID_JUDG_REG',
        'Updated',
        to_char(:old."AGAINST_PARTY_ADDR_ID_JUDG_REG"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."AGAINST_PARTY_ROLE_CODE" != :new."AGAINST_PARTY_ROLE_CODE")
    or (:old."AGAINST_PARTY_ROLE_CODE" is null and :new."AGAINST_PARTY_ROLE_CODE" is not null)
    or (:old."AGAINST_PARTY_ROLE_CODE" is not null and :new."AGAINST_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'AGAINST_PARTY_ROLE_CODE',
        'Updated',
        :old."AGAINST_PARTY_ROLE_CODE",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."DATE_OF_FINAL_PAYMENT" != :new."DATE_OF_FINAL_PAYMENT")
    or (:old."DATE_OF_FINAL_PAYMENT" is null and :new."DATE_OF_FINAL_PAYMENT" is not null)
    or (:old."DATE_OF_FINAL_PAYMENT" is not null and :new."DATE_OF_FINAL_PAYMENT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'DATE_OF_FINAL_PAYMENT',
        'Updated',
        to_char(:old."DATE_OF_FINAL_PAYMENT",'YYYY-MM-DD'),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."FIRST_PAYMENT_DATE" != :new."FIRST_PAYMENT_DATE")
    or (:old."FIRST_PAYMENT_DATE" is null and :new."FIRST_PAYMENT_DATE" is not null)
    or (:old."FIRST_PAYMENT_DATE" is not null and :new."FIRST_PAYMENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'FIRST_PAYMENT_DATE',
        'Updated',
        to_char(:old."FIRST_PAYMENT_DATE",'YYYY-MM-DD'),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."INSTALMENT_AMOUNT" != :new."INSTALMENT_AMOUNT")
    or (:old."INSTALMENT_AMOUNT" is null and :new."INSTALMENT_AMOUNT" is not null)
    or (:old."INSTALMENT_AMOUNT" is not null and :new."INSTALMENT_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'INSTALMENT_AMOUNT',
        'Updated',
        to_char(:old."INSTALMENT_AMOUNT"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."INSTALMENT_AMOUNT_CURRENCY" != :new."INSTALMENT_AMOUNT_CURRENCY")
    or (:old."INSTALMENT_AMOUNT_CURRENCY" is null and :new."INSTALMENT_AMOUNT_CURRENCY" is not null)
    or (:old."INSTALMENT_AMOUNT_CURRENCY" is not null and :new."INSTALMENT_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'INSTALMENT_AMOUNT_CURRENCY',
        'Updated',
        :old."INSTALMENT_AMOUNT_CURRENCY",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."INSTALMENT_PERIOD" != :new."INSTALMENT_PERIOD")
    or (:old."INSTALMENT_PERIOD" is null and :new."INSTALMENT_PERIOD" is not null)
    or (:old."INSTALMENT_PERIOD" is not null and :new."INSTALMENT_PERIOD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'INSTALMENT_PERIOD',
        'Updated',
        :old."INSTALMENT_PERIOD",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."JOINT_JUDGMENT" != :new."JOINT_JUDGMENT")
    or (:old."JOINT_JUDGMENT" is null and :new."JOINT_JUDGMENT" is not null)
    or (:old."JOINT_JUDGMENT" is not null and :new."JOINT_JUDGMENT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'JOINT_JUDGMENT',
        'Updated',
        :old."JOINT_JUDGMENT",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."JUDGMENT_AMOUNT" != :new."JUDGMENT_AMOUNT")
    or (:old."JUDGMENT_AMOUNT" is null and :new."JUDGMENT_AMOUNT" is not null)
    or (:old."JUDGMENT_AMOUNT" is not null and :new."JUDGMENT_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'JUDGMENT_AMOUNT',
        'Updated',
        to_char(:old."JUDGMENT_AMOUNT"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."JUDGMENT_AMOUNT_CURRENCY" != :new."JUDGMENT_AMOUNT_CURRENCY")
    or (:old."JUDGMENT_AMOUNT_CURRENCY" is null and :new."JUDGMENT_AMOUNT_CURRENCY" is not null)
    or (:old."JUDGMENT_AMOUNT_CURRENCY" is not null and :new."JUDGMENT_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'JUDGMENT_AMOUNT_CURRENCY',
        'Updated',
        :old."JUDGMENT_AMOUNT_CURRENCY",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."JUDGMENT_COURT_CODE" != :new."JUDGMENT_COURT_CODE")
    or (:old."JUDGMENT_COURT_CODE" is null and :new."JUDGMENT_COURT_CODE" is not null)
    or (:old."JUDGMENT_COURT_CODE" is not null and :new."JUDGMENT_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'JUDGMENT_COURT_CODE',
        'Updated',
        to_char(:old."JUDGMENT_COURT_CODE"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."JUDGMENT_DATE" != :new."JUDGMENT_DATE")
    or (:old."JUDGMENT_DATE" is null and :new."JUDGMENT_DATE" is not null)
    or (:old."JUDGMENT_DATE" is not null and :new."JUDGMENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'JUDGMENT_DATE',
        'Updated',
        to_char(:old."JUDGMENT_DATE",'YYYY-MM-DD'),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."JUDGMENT_TYPE" != :new."JUDGMENT_TYPE")
    or (:old."JUDGMENT_TYPE" is null and :new."JUDGMENT_TYPE" is not null)
    or (:old."JUDGMENT_TYPE" is not null and :new."JUDGMENT_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'JUDGMENT_TYPE',
        'Updated',
        :old."JUDGMENT_TYPE",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."JUDG_SEQ" != :new."JUDG_SEQ")
    or (:old."JUDG_SEQ" is null and :new."JUDG_SEQ" is not null)
    or (:old."JUDG_SEQ" is not null and :new."JUDG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'JUDG_SEQ',
        'Updated',
        to_char(:old."JUDG_SEQ"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAID_BEFORE_JUDGMENT" != :new."PAID_BEFORE_JUDGMENT")
    or (:old."PAID_BEFORE_JUDGMENT" is null and :new."PAID_BEFORE_JUDGMENT" is not null)
    or (:old."PAID_BEFORE_JUDGMENT" is not null and :new."PAID_BEFORE_JUDGMENT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAID_BEFORE_JUDGMENT',
        'Updated',
        to_char(:old."PAID_BEFORE_JUDGMENT"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAID_BEFORE_JUDGMENT_CURRENCY" != :new."PAID_BEFORE_JUDGMENT_CURRENCY")
    or (:old."PAID_BEFORE_JUDGMENT_CURRENCY" is null and :new."PAID_BEFORE_JUDGMENT_CURRENCY" is not null)
    or (:old."PAID_BEFORE_JUDGMENT_CURRENCY" is not null and :new."PAID_BEFORE_JUDGMENT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAID_BEFORE_JUDGMENT_CURRENCY',
        'Updated',
        :old."PAID_BEFORE_JUDGMENT_CURRENCY",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_ACC_HOLDER" != :new."PAYEE_ACC_HOLDER")
    or (:old."PAYEE_ACC_HOLDER" is null and :new."PAYEE_ACC_HOLDER" is not null)
    or (:old."PAYEE_ACC_HOLDER" is not null and :new."PAYEE_ACC_HOLDER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_ACC_HOLDER',
        'Updated',
        :old."PAYEE_ACC_HOLDER",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_ADDR_1" != :new."PAYEE_ADDR_1")
    or (:old."PAYEE_ADDR_1" is null and :new."PAYEE_ADDR_1" is not null)
    or (:old."PAYEE_ADDR_1" is not null and :new."PAYEE_ADDR_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_ADDR_1',
        'Updated',
        :old."PAYEE_ADDR_1",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_ADDR_2" != :new."PAYEE_ADDR_2")
    or (:old."PAYEE_ADDR_2" is null and :new."PAYEE_ADDR_2" is not null)
    or (:old."PAYEE_ADDR_2" is not null and :new."PAYEE_ADDR_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_ADDR_2',
        'Updated',
        :old."PAYEE_ADDR_2",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_ADDR_3" != :new."PAYEE_ADDR_3")
    or (:old."PAYEE_ADDR_3" is null and :new."PAYEE_ADDR_3" is not null)
    or (:old."PAYEE_ADDR_3" is not null and :new."PAYEE_ADDR_3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_ADDR_3',
        'Updated',
        :old."PAYEE_ADDR_3",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_ADDR_4" != :new."PAYEE_ADDR_4")
    or (:old."PAYEE_ADDR_4" is null and :new."PAYEE_ADDR_4" is not null)
    or (:old."PAYEE_ADDR_4" is not null and :new."PAYEE_ADDR_4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_ADDR_4',
        'Updated',
        :old."PAYEE_ADDR_4",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_ADDR_5" != :new."PAYEE_ADDR_5")
    or (:old."PAYEE_ADDR_5" is null and :new."PAYEE_ADDR_5" is not null)
    or (:old."PAYEE_ADDR_5" is not null and :new."PAYEE_ADDR_5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_ADDR_5',
        'Updated',
        :old."PAYEE_ADDR_5",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_APACS_TRANS_CODE" != :new."PAYEE_APACS_TRANS_CODE")
    or (:old."PAYEE_APACS_TRANS_CODE" is null and :new."PAYEE_APACS_TRANS_CODE" is not null)
    or (:old."PAYEE_APACS_TRANS_CODE" is not null and :new."PAYEE_APACS_TRANS_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_APACS_TRANS_CODE',
        'Updated',
        :old."PAYEE_APACS_TRANS_CODE",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_BANK_ACC_NO" != :new."PAYEE_BANK_ACC_NO")
    or (:old."PAYEE_BANK_ACC_NO" is null and :new."PAYEE_BANK_ACC_NO" is not null)
    or (:old."PAYEE_BANK_ACC_NO" is not null and :new."PAYEE_BANK_ACC_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_BANK_ACC_NO',
        'Updated',
        :old."PAYEE_BANK_ACC_NO",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_BANK_INFO_1" != :new."PAYEE_BANK_INFO_1")
    or (:old."PAYEE_BANK_INFO_1" is null and :new."PAYEE_BANK_INFO_1" is not null)
    or (:old."PAYEE_BANK_INFO_1" is not null and :new."PAYEE_BANK_INFO_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_BANK_INFO_1',
        'Updated',
        :old."PAYEE_BANK_INFO_1",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_BANK_INFO_2" != :new."PAYEE_BANK_INFO_2")
    or (:old."PAYEE_BANK_INFO_2" is null and :new."PAYEE_BANK_INFO_2" is not null)
    or (:old."PAYEE_BANK_INFO_2" is not null and :new."PAYEE_BANK_INFO_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_BANK_INFO_2',
        'Updated',
        :old."PAYEE_BANK_INFO_2",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_BANK_NAME" != :new."PAYEE_BANK_NAME")
    or (:old."PAYEE_BANK_NAME" is null and :new."PAYEE_BANK_NAME" is not null)
    or (:old."PAYEE_BANK_NAME" is not null and :new."PAYEE_BANK_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_BANK_NAME',
        'Updated',
        :old."PAYEE_BANK_NAME",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_BANK_SORT_CODE" != :new."PAYEE_BANK_SORT_CODE")
    or (:old."PAYEE_BANK_SORT_CODE" is null and :new."PAYEE_BANK_SORT_CODE" is not null)
    or (:old."PAYEE_BANK_SORT_CODE" is not null and :new."PAYEE_BANK_SORT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_BANK_SORT_CODE',
        'Updated',
        :old."PAYEE_BANK_SORT_CODE",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_DOB" != :new."PAYEE_DOB")
    or (:old."PAYEE_DOB" is null and :new."PAYEE_DOB" is not null)
    or (:old."PAYEE_DOB" is not null and :new."PAYEE_DOB" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_DOB',
        'Updated',
        to_char(:old."PAYEE_DOB",'YYYY-MM-DD'),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_DX_NUMBER" != :new."PAYEE_DX_NUMBER")
    or (:old."PAYEE_DX_NUMBER" is null and :new."PAYEE_DX_NUMBER" is not null)
    or (:old."PAYEE_DX_NUMBER" is not null and :new."PAYEE_DX_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_DX_NUMBER',
        'Updated',
        :old."PAYEE_DX_NUMBER",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_EMAIL_ADDRESS" != :new."PAYEE_EMAIL_ADDRESS")
    or (:old."PAYEE_EMAIL_ADDRESS" is null and :new."PAYEE_EMAIL_ADDRESS" is not null)
    or (:old."PAYEE_EMAIL_ADDRESS" is not null and :new."PAYEE_EMAIL_ADDRESS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_EMAIL_ADDRESS',
        'Updated',
        :old."PAYEE_EMAIL_ADDRESS",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_FAX_NUMBER" != :new."PAYEE_FAX_NUMBER")
    or (:old."PAYEE_FAX_NUMBER" is null and :new."PAYEE_FAX_NUMBER" is not null)
    or (:old."PAYEE_FAX_NUMBER" is not null and :new."PAYEE_FAX_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_FAX_NUMBER',
        'Updated',
        :old."PAYEE_FAX_NUMBER",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_GIRO_ACC_NO" != :new."PAYEE_GIRO_ACC_NO")
    or (:old."PAYEE_GIRO_ACC_NO" is null and :new."PAYEE_GIRO_ACC_NO" is not null)
    or (:old."PAYEE_GIRO_ACC_NO" is not null and :new."PAYEE_GIRO_ACC_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_GIRO_ACC_NO',
        'Updated',
        :old."PAYEE_GIRO_ACC_NO",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_GIRO_TRANS_CODE_1" != :new."PAYEE_GIRO_TRANS_CODE_1")
    or (:old."PAYEE_GIRO_TRANS_CODE_1" is null and :new."PAYEE_GIRO_TRANS_CODE_1" is not null)
    or (:old."PAYEE_GIRO_TRANS_CODE_1" is not null and :new."PAYEE_GIRO_TRANS_CODE_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_GIRO_TRANS_CODE_1',
        'Updated',
        :old."PAYEE_GIRO_TRANS_CODE_1",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_GIRO_TRANS_CODE_2" != :new."PAYEE_GIRO_TRANS_CODE_2")
    or (:old."PAYEE_GIRO_TRANS_CODE_2" is null and :new."PAYEE_GIRO_TRANS_CODE_2" is not null)
    or (:old."PAYEE_GIRO_TRANS_CODE_2" is not null and :new."PAYEE_GIRO_TRANS_CODE_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_GIRO_TRANS_CODE_2',
        'Updated',
        :old."PAYEE_GIRO_TRANS_CODE_2",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_NAME" != :new."PAYEE_NAME")
    or (:old."PAYEE_NAME" is null and :new."PAYEE_NAME" is not null)
    or (:old."PAYEE_NAME" is not null and :new."PAYEE_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_NAME',
        'Updated',
        :old."PAYEE_NAME",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_POSTCODE" != :new."PAYEE_POSTCODE")
    or (:old."PAYEE_POSTCODE" is null and :new."PAYEE_POSTCODE" is not null)
    or (:old."PAYEE_POSTCODE" is not null and :new."PAYEE_POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_POSTCODE',
        'Updated',
        :old."PAYEE_POSTCODE",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_REFERENCE" != :new."PAYEE_REFERENCE")
    or (:old."PAYEE_REFERENCE" is null and :new."PAYEE_REFERENCE" is not null)
    or (:old."PAYEE_REFERENCE" is not null and :new."PAYEE_REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_REFERENCE',
        'Updated',
        :old."PAYEE_REFERENCE",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAYEE_TEL_NO" != :new."PAYEE_TEL_NO")
    or (:old."PAYEE_TEL_NO" is null and :new."PAYEE_TEL_NO" is not null)
    or (:old."PAYEE_TEL_NO" is not null and :new."PAYEE_TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAYEE_TEL_NO',
        'Updated',
        :old."PAYEE_TEL_NO",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."PAY_RECEIPT_DATE" != :new."PAY_RECEIPT_DATE")
    or (:old."PAY_RECEIPT_DATE" is null and :new."PAY_RECEIPT_DATE" is not null)
    or (:old."PAY_RECEIPT_DATE" is not null and :new."PAY_RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'PAY_RECEIPT_DATE',
        'Updated',
        to_char(:old."PAY_RECEIPT_DATE",'YYYY-MM-DD'),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."SENT_TO_RTL" != :new."SENT_TO_RTL")
    or (:old."SENT_TO_RTL" is null and :new."SENT_TO_RTL" is not null)
    or (:old."SENT_TO_RTL" is not null and :new."SENT_TO_RTL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'SENT_TO_RTL',
        'Updated',
        to_char(:old."SENT_TO_RTL",'YYYY-MM-DD'),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."SLIP_CODELINE_1" != :new."SLIP_CODELINE_1")
    or (:old."SLIP_CODELINE_1" is null and :new."SLIP_CODELINE_1" is not null)
    or (:old."SLIP_CODELINE_1" is not null and :new."SLIP_CODELINE_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'SLIP_CODELINE_1',
        'Updated',
        :old."SLIP_CODELINE_1",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."SLIP_CODELINE_2" != :new."SLIP_CODELINE_2")
    or (:old."SLIP_CODELINE_2" is null and :new."SLIP_CODELINE_2" is not null)
    or (:old."SLIP_CODELINE_2" is not null and :new."SLIP_CODELINE_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'SLIP_CODELINE_2',
        'Updated',
        :old."SLIP_CODELINE_2",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."STATUS" != :new."STATUS")
    or (:old."STATUS" is null and :new."STATUS" is not null)
    or (:old."STATUS" is not null and :new."STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'STATUS',
        'Updated',
        :old."STATUS",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."STATUS_TO_RTL" != :new."STATUS_TO_RTL")
    or (:old."STATUS_TO_RTL" is null and :new."STATUS_TO_RTL" is not null)
    or (:old."STATUS_TO_RTL" is not null and :new."STATUS_TO_RTL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'STATUS_TO_RTL',
        'Updated',
        :old."STATUS_TO_RTL",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."TOTAL" != :new."TOTAL")
    or (:old."TOTAL" is null and :new."TOTAL" is not null)
    or (:old."TOTAL" is not null and :new."TOTAL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'TOTAL',
        'Updated',
        to_char(:old."TOTAL"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."TOTAL_COSTS" != :new."TOTAL_COSTS")
    or (:old."TOTAL_COSTS" is null and :new."TOTAL_COSTS" is not null)
    or (:old."TOTAL_COSTS" is not null and :new."TOTAL_COSTS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'TOTAL_COSTS',
        'Updated',
        to_char(:old."TOTAL_COSTS"),
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."TOTAL_COSTS_CURRENCY" != :new."TOTAL_COSTS_CURRENCY")
    or (:old."TOTAL_COSTS_CURRENCY" is null and :new."TOTAL_COSTS_CURRENCY" is not null)
    or (:old."TOTAL_COSTS_CURRENCY" is not null and :new."TOTAL_COSTS_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'TOTAL_COSTS_CURRENCY',
        'Updated',
        :old."TOTAL_COSTS_CURRENCY",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."TOTAL_CURRENCY" != :new."TOTAL_CURRENCY")
    or (:old."TOTAL_CURRENCY" is null and :new."TOTAL_CURRENCY" is not null)
    or (:old."TOTAL_CURRENCY" is not null and :new."TOTAL_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'TOTAL_CURRENCY',
        'Updated',
        :old."TOTAL_CURRENCY",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."WARRANT_ID" != :new."WARRANT_ID")
    or (:old."WARRANT_ID" is null and :new."WARRANT_ID" is not null)
    or (:old."WARRANT_ID" is not null and :new."WARRANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        to_char(:old."JUDG_SEQ"));
    end if;
    if (:old."WARRANT_PARTY_AGAINST" != :new."WARRANT_PARTY_AGAINST")
    or (:old."WARRANT_PARTY_AGAINST" is null and :new."WARRANT_PARTY_AGAINST" is not null)
    or (:old."WARRANT_PARTY_AGAINST" is not null and :new."WARRANT_PARTY_AGAINST" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'JUDGMENTS',
        'WARRANT_PARTY_AGAINST',
        'Updated',
        to_char(:old."WARRANT_PARTY_AGAINST"),
        to_char(:old."JUDG_SEQ"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'JUDGMENTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."JUDG_SEQ",:new."JUDG_SEQ")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_JUDGMENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_NATIONAL_CODED_PARTIES"
after update or insert or delete on "NATIONAL_CODED_PARTIES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADMIN_COURT_CODE" != :new."ADMIN_COURT_CODE")
    or (:old."ADMIN_COURT_CODE" is null and :new."ADMIN_COURT_CODE" is not null)
    or (:old."ADMIN_COURT_CODE" is not null and :new."ADMIN_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        to_char(:old."CODE"));
    end if;
    if (:old."ADM_PAPER_TYPE" != :new."ADM_PAPER_TYPE")
    or (:old."ADM_PAPER_TYPE" is null and :new."ADM_PAPER_TYPE" is not null)
    or (:old."ADM_PAPER_TYPE" is not null and :new."ADM_PAPER_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'ADM_PAPER_TYPE',
        'Updated',
        :old."ADM_PAPER_TYPE",
        to_char(:old."CODE"));
    end if;
    if (:old."CODE" != :new."CODE")
    or (:old."CODE" is null and :new."CODE" is not null)
    or (:old."CODE" is not null and :new."CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'CODE',
        'Updated',
        to_char(:old."CODE"),
        to_char(:old."CODE"));
    end if;
    if (:old."DEF_PAPER_TYPE" != :new."DEF_PAPER_TYPE")
    or (:old."DEF_PAPER_TYPE" is null and :new."DEF_PAPER_TYPE" is not null)
    or (:old."DEF_PAPER_TYPE" is not null and :new."DEF_PAPER_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'DEF_PAPER_TYPE',
        'Updated',
        :old."DEF_PAPER_TYPE",
        to_char(:old."CODE"));
    end if;
    if (:old."DUPLEX" != :new."DUPLEX")
    or (:old."DUPLEX" is null and :new."DUPLEX" is not null)
    or (:old."DUPLEX" is not null and :new."DUPLEX" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'DUPLEX',
        'Updated',
        :old."DUPLEX",
        to_char(:old."CODE"));
    end if;
    if (:old."GIRO_JUDGMENTS" != :new."GIRO_JUDGMENTS")
    or (:old."GIRO_JUDGMENTS" is null and :new."GIRO_JUDGMENTS" is not null)
    or (:old."GIRO_JUDGMENTS" is not null and :new."GIRO_JUDGMENTS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'GIRO_JUDGMENTS',
        'Updated',
        :old."GIRO_JUDGMENTS",
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_ADM_SEQ" != :new."LAST_ADM_SEQ")
    or (:old."LAST_ADM_SEQ" is null and :new."LAST_ADM_SEQ" is not null)
    or (:old."LAST_ADM_SEQ" is not null and :new."LAST_ADM_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'LAST_ADM_SEQ',
        'Updated',
        to_char(:old."LAST_ADM_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_DEF_SEQ" != :new."LAST_DEF_SEQ")
    or (:old."LAST_DEF_SEQ" is null and :new."LAST_DEF_SEQ" is not null)
    or (:old."LAST_DEF_SEQ" is not null and :new."LAST_DEF_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'LAST_DEF_SEQ',
        'Updated',
        to_char(:old."LAST_DEF_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_JG_SEQ" != :new."LAST_JG_SEQ")
    or (:old."LAST_JG_SEQ" is null and :new."LAST_JG_SEQ" is not null)
    or (:old."LAST_JG_SEQ" is not null and :new."LAST_JG_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'LAST_JG_SEQ',
        'Updated',
        to_char(:old."LAST_JG_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_PD_SEQ" != :new."LAST_PD_SEQ")
    or (:old."LAST_PD_SEQ" is null and :new."LAST_PD_SEQ" is not null)
    or (:old."LAST_PD_SEQ" is not null and :new."LAST_PD_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'LAST_PD_SEQ',
        'Updated',
        to_char(:old."LAST_PD_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_WT_SEQ" != :new."LAST_WT_SEQ")
    or (:old."LAST_WT_SEQ" is null and :new."LAST_WT_SEQ" is not null)
    or (:old."LAST_WT_SEQ" is not null and :new."LAST_WT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'LAST_WT_SEQ',
        'Updated',
        to_char(:old."LAST_WT_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."PRINT_JUDGMENTS" != :new."PRINT_JUDGMENTS")
    or (:old."PRINT_JUDGMENTS" is null and :new."PRINT_JUDGMENTS" is not null)
    or (:old."PRINT_JUDGMENTS" is not null and :new."PRINT_JUDGMENTS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'PRINT_JUDGMENTS',
        'Updated',
        :old."PRINT_JUDGMENTS",
        to_char(:old."CODE"));
    end if;
    if (:old."WRT_NO_FROM" != :new."WRT_NO_FROM")
    or (:old."WRT_NO_FROM" is null and :new."WRT_NO_FROM" is not null)
    or (:old."WRT_NO_FROM" is not null and :new."WRT_NO_FROM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'WRT_NO_FROM',
        'Updated',
        :old."WRT_NO_FROM",
        to_char(:old."CODE"));
    end if;
    if (:old."WRT_NO_TO" != :new."WRT_NO_TO")
    or (:old."WRT_NO_TO" is null and :new."WRT_NO_TO" is not null)
    or (:old."WRT_NO_TO" is not null and :new."WRT_NO_TO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'WRT_NO_TO',
        'Updated',
        :old."WRT_NO_TO",
        to_char(:old."CODE"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'NATIONAL_CODED_PARTIES',
      null,
      v_type,
      null,
      to_char(nvl(:old."CODE",:new."CODE")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_NATIONAL_CODED_PARTIES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_OBLIGATIONS"
after update or insert or delete on "OBLIGATIONS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."AE_EVENT_SEQ" != :new."AE_EVENT_SEQ")
    or (:old."AE_EVENT_SEQ" is null and :new."AE_EVENT_SEQ" is not null)
    or (:old."AE_EVENT_SEQ" is not null and :new."AE_EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'AE_EVENT_SEQ',
        'Updated',
        to_char(:old."AE_EVENT_SEQ"),
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."DELETE_FLAG" != :new."DELETE_FLAG")
    or (:old."DELETE_FLAG" is null and :new."DELETE_FLAG" is not null)
    or (:old."DELETE_FLAG" is not null and :new."DELETE_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'DELETE_FLAG',
        'Updated',
        :old."DELETE_FLAG",
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."EVENT_SEQ" != :new."EVENT_SEQ")
    or (:old."EVENT_SEQ" is null and :new."EVENT_SEQ" is not null)
    or (:old."EVENT_SEQ" is not null and :new."EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'EVENT_SEQ',
        'Updated',
        to_char(:old."EVENT_SEQ"),
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."EXPIRY_DATE" != :new."EXPIRY_DATE")
    or (:old."EXPIRY_DATE" is null and :new."EXPIRY_DATE" is not null)
    or (:old."EXPIRY_DATE" is not null and :new."EXPIRY_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'EXPIRY_DATE',
        'Updated',
        to_char(:old."EXPIRY_DATE",'YYYY-MM-DD'),
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."LAST_USED_BY" != :new."LAST_USED_BY")
    or (:old."LAST_USED_BY" is null and :new."LAST_USED_BY" is not null)
    or (:old."LAST_USED_BY" is not null and :new."LAST_USED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'LAST_USED_BY',
        'Updated',
        :old."LAST_USED_BY",
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."NOTES" != :new."NOTES")
    or (:old."NOTES" is null and :new."NOTES" is not null)
    or (:old."NOTES" is not null and :new."NOTES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'NOTES',
        'Updated',
        :old."NOTES",
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."OBLIGATION_SEQ" != :new."OBLIGATION_SEQ")
    or (:old."OBLIGATION_SEQ" is null and :new."OBLIGATION_SEQ" is not null)
    or (:old."OBLIGATION_SEQ" is not null and :new."OBLIGATION_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'OBLIGATION_SEQ',
        'Updated',
        to_char(:old."OBLIGATION_SEQ"),
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
    if (:old."OBLIGATION_TYPE" != :new."OBLIGATION_TYPE")
    or (:old."OBLIGATION_TYPE" is null and :new."OBLIGATION_TYPE" is not null)
    or (:old."OBLIGATION_TYPE" is not null and :new."OBLIGATION_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'OBLIGATIONS',
        'OBLIGATION_TYPE',
        'Updated',
        to_char(:old."OBLIGATION_TYPE"),
        to_char(:old."OBLIGATION_SEQ"),
        :old."CASE_NUMBER");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'OBLIGATIONS',
      null,
      v_type,
      null,
      to_char(nvl(:old."OBLIGATION_SEQ",:new."OBLIGATION_SEQ")),
      nvl(:old."CASE_NUMBER",:new."CASE_NUMBER"));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_OBLIGATIONS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_PARTIES"
after update or insert or delete on "PARTIES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."AUTHENTICATION_PASSWORD" != :new."AUTHENTICATION_PASSWORD")
    or (:old."AUTHENTICATION_PASSWORD" is null and :new."AUTHENTICATION_PASSWORD" is not null)
    or (:old."AUTHENTICATION_PASSWORD" is not null and :new."AUTHENTICATION_PASSWORD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'AUTHENTICATION_PASSWORD',
        'Updated',
        :old."AUTHENTICATION_PASSWORD",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."AUTHENTICATION_PIN" != :new."AUTHENTICATION_PIN")
    or (:old."AUTHENTICATION_PIN" is null and :new."AUTHENTICATION_PIN" is not null)
    or (:old."AUTHENTICATION_PIN" is not null and :new."AUTHENTICATION_PIN" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'AUTHENTICATION_PIN',
        'Updated',
        to_char(:old."AUTHENTICATION_PIN"),
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."COMPANY_NAME" != :new."COMPANY_NAME")
    or (:old."COMPANY_NAME" is null and :new."COMPANY_NAME" is not null)
    or (:old."COMPANY_NAME" is not null and :new."COMPANY_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'COMPANY_NAME',
        'Updated',
        :old."COMPANY_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."DX_NUMBER" != :new."DX_NUMBER")
    or (:old."DX_NUMBER" is null and :new."DX_NUMBER" is not null)
    or (:old."DX_NUMBER" is not null and :new."DX_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'DX_NUMBER',
        'Updated',
        :old."DX_NUMBER",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."EMAIL_ADDRESS" != :new."EMAIL_ADDRESS")
    or (:old."EMAIL_ADDRESS" is null and :new."EMAIL_ADDRESS" is not null)
    or (:old."EMAIL_ADDRESS" is not null and :new."EMAIL_ADDRESS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'EMAIL_ADDRESS',
        'Updated',
        :old."EMAIL_ADDRESS",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."ETHNIC_ORIGIN_CODE" != :new."ETHNIC_ORIGIN_CODE")
    or (:old."ETHNIC_ORIGIN_CODE" is null and :new."ETHNIC_ORIGIN_CODE" is not null)
    or (:old."ETHNIC_ORIGIN_CODE" is not null and :new."ETHNIC_ORIGIN_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'ETHNIC_ORIGIN_CODE',
        'Updated',
        :old."ETHNIC_ORIGIN_CODE",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."FAX_NUMBER" != :new."FAX_NUMBER")
    or (:old."FAX_NUMBER" is null and :new."FAX_NUMBER" is not null)
    or (:old."FAX_NUMBER" is not null and :new."FAX_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'FAX_NUMBER',
        'Updated',
        :old."FAX_NUMBER",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."GENDER" != :new."GENDER")
    or (:old."GENDER" is null and :new."GENDER" is not null)
    or (:old."GENDER" is not null and :new."GENDER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'GENDER',
        'Updated',
        to_char(:old."GENDER"),
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PARTY_ID" != :new."PARTY_ID")
    or (:old."PARTY_ID" is null and :new."PARTY_ID" is not null)
    or (:old."PARTY_ID" is not null and :new."PARTY_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PARTY_TYPE_CODE" != :new."PARTY_TYPE_CODE")
    or (:old."PARTY_TYPE_CODE" is null and :new."PARTY_TYPE_CODE" is not null)
    or (:old."PARTY_TYPE_CODE" is not null and :new."PARTY_TYPE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PARTY_TYPE_CODE',
        'Updated',
        :old."PARTY_TYPE_CODE",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_DOB" != :new."PERSON_DOB")
    or (:old."PERSON_DOB" is null and :new."PERSON_DOB" is not null)
    or (:old."PERSON_DOB" is not null and :new."PERSON_DOB" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_DOB',
        'Updated',
        to_char(:old."PERSON_DOB",'YYYY-MM-DD'),
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_FAMILY_NAME" != :new."PERSON_FAMILY_NAME")
    or (:old."PERSON_FAMILY_NAME" is null and :new."PERSON_FAMILY_NAME" is not null)
    or (:old."PERSON_FAMILY_NAME" is not null and :new."PERSON_FAMILY_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_FAMILY_NAME',
        'Updated',
        :old."PERSON_FAMILY_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_GIVEN_FIRST_NAME" != :new."PERSON_GIVEN_FIRST_NAME")
    or (:old."PERSON_GIVEN_FIRST_NAME" is null and :new."PERSON_GIVEN_FIRST_NAME" is not null)
    or (:old."PERSON_GIVEN_FIRST_NAME" is not null and :new."PERSON_GIVEN_FIRST_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_GIVEN_FIRST_NAME',
        'Updated',
        :old."PERSON_GIVEN_FIRST_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_GIVEN_SECOND_NAME" != :new."PERSON_GIVEN_SECOND_NAME")
    or (:old."PERSON_GIVEN_SECOND_NAME" is null and :new."PERSON_GIVEN_SECOND_NAME" is not null)
    or (:old."PERSON_GIVEN_SECOND_NAME" is not null and :new."PERSON_GIVEN_SECOND_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_GIVEN_SECOND_NAME',
        'Updated',
        :old."PERSON_GIVEN_SECOND_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_GIVEN_THIRD_NAME" != :new."PERSON_GIVEN_THIRD_NAME")
    or (:old."PERSON_GIVEN_THIRD_NAME" is null and :new."PERSON_GIVEN_THIRD_NAME" is not null)
    or (:old."PERSON_GIVEN_THIRD_NAME" is not null and :new."PERSON_GIVEN_THIRD_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_GIVEN_THIRD_NAME',
        'Updated',
        :old."PERSON_GIVEN_THIRD_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_REQUESTED_NAME" != :new."PERSON_REQUESTED_NAME")
    or (:old."PERSON_REQUESTED_NAME" is null and :new."PERSON_REQUESTED_NAME" is not null)
    or (:old."PERSON_REQUESTED_NAME" is not null and :new."PERSON_REQUESTED_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_REQUESTED_NAME',
        'Updated',
        :old."PERSON_REQUESTED_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_TITLE" != :new."PERSON_TITLE")
    or (:old."PERSON_TITLE" is null and :new."PERSON_TITLE" is not null)
    or (:old."PERSON_TITLE" is not null and :new."PERSON_TITLE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_TITLE',
        'Updated',
        :old."PERSON_TITLE",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PREFERRED_COMMUNICATION_METHOD" != :new."PREFERRED_COMMUNICATION_METHOD")
    or (:old."PREFERRED_COMMUNICATION_METHOD" is null and :new."PREFERRED_COMMUNICATION_METHOD" is not null)
    or (:old."PREFERRED_COMMUNICATION_METHOD" is not null and :new."PREFERRED_COMMUNICATION_METHOD" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PREFERRED_COMMUNICATION_METHOD',
        'Updated',
        :old."PREFERRED_COMMUNICATION_METHOD",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."TEL_NO" != :new."TEL_NO")
    or (:old."TEL_NO" is null and :new."TEL_NO" is not null)
    or (:old."TEL_NO" is not null and :new."TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'TEL_NO',
        'Updated',
        :old."TEL_NO",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."WELSH_INDICATOR" != :new."WELSH_INDICATOR")
    or (:old."WELSH_INDICATOR" is null and :new."WELSH_INDICATOR" is not null)
    or (:old."WELSH_INDICATOR" is not null and :new."WELSH_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'WELSH_INDICATOR',
        'Updated',
        :old."WELSH_INDICATOR",
        to_char(:old."PARTY_ID"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'PARTIES',
      null,
      v_type,
      null,
      to_char(nvl(:old."PARTY_ID",:new."PARTY_ID")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_PARTIES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_PARTY_ROLES"
after update or insert or delete on "PARTY_ROLES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."PARTY_ROLE_CODE" != :new."PARTY_ROLE_CODE")
    or (:old."PARTY_ROLE_CODE" is null and :new."PARTY_ROLE_CODE" is not null)
    or (:old."PARTY_ROLE_CODE" is not null and :new."PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTY_ROLES',
        'PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_ROLE_CODE",
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PARTY_ROLE_DESCRIPTION" != :new."PARTY_ROLE_DESCRIPTION")
    or (:old."PARTY_ROLE_DESCRIPTION" is null and :new."PARTY_ROLE_DESCRIPTION" is not null)
    or (:old."PARTY_ROLE_DESCRIPTION" is not null and :new."PARTY_ROLE_DESCRIPTION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTY_ROLES',
        'PARTY_ROLE_DESCRIPTION',
        'Updated',
        :old."PARTY_ROLE_DESCRIPTION",
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."REPORTING_ROLE_CODE" != :new."REPORTING_ROLE_CODE")
    or (:old."REPORTING_ROLE_CODE" is null and :new."REPORTING_ROLE_CODE" is not null)
    or (:old."REPORTING_ROLE_CODE" is not null and :new."REPORTING_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTY_ROLES',
        'REPORTING_ROLE_CODE',
        'Updated',
        :old."REPORTING_ROLE_CODE",
        :old."PARTY_ROLE_CODE");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'PARTY_ROLES',
      null,
      v_type,
      null,
      nvl(:old."PARTY_ROLE_CODE",:new."PARTY_ROLE_CODE"));
  end if;
end;

/
ALTER TRIGGER "CASEMAN"."AUD_PARTY_ROLES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_PAYEES"
after update or insert or delete on "PAYEES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ACC_HOLDER" != :new."ACC_HOLDER")
    or (:old."ACC_HOLDER" is null and :new."ACC_HOLDER" is not null)
    or (:old."ACC_HOLDER" is not null and :new."ACC_HOLDER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'ACC_HOLDER',
        'Updated',
        :old."ACC_HOLDER",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."APACS_TRANS_CODE" != :new."APACS_TRANS_CODE")
    or (:old."APACS_TRANS_CODE" is null and :new."APACS_TRANS_CODE" is not null)
    or (:old."APACS_TRANS_CODE" is not null and :new."APACS_TRANS_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'APACS_TRANS_CODE',
        'Updated',
        :old."APACS_TRANS_CODE",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."BANK_ACC_NO" != :new."BANK_ACC_NO")
    or (:old."BANK_ACC_NO" is null and :new."BANK_ACC_NO" is not null)
    or (:old."BANK_ACC_NO" is not null and :new."BANK_ACC_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'BANK_ACC_NO',
        'Updated',
        :old."BANK_ACC_NO",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."BANK_INFO_1" != :new."BANK_INFO_1")
    or (:old."BANK_INFO_1" is null and :new."BANK_INFO_1" is not null)
    or (:old."BANK_INFO_1" is not null and :new."BANK_INFO_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'BANK_INFO_1',
        'Updated',
        :old."BANK_INFO_1",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."BANK_INFO_2" != :new."BANK_INFO_2")
    or (:old."BANK_INFO_2" is null and :new."BANK_INFO_2" is not null)
    or (:old."BANK_INFO_2" is not null and :new."BANK_INFO_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'BANK_INFO_2',
        'Updated',
        :old."BANK_INFO_2",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."BANK_NAME" != :new."BANK_NAME")
    or (:old."BANK_NAME" is null and :new."BANK_NAME" is not null)
    or (:old."BANK_NAME" is not null and :new."BANK_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'BANK_NAME',
        'Updated',
        :old."BANK_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."BANK_SORT_CODE" != :new."BANK_SORT_CODE")
    or (:old."BANK_SORT_CODE" is null and :new."BANK_SORT_CODE" is not null)
    or (:old."BANK_SORT_CODE" is not null and :new."BANK_SORT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'BANK_SORT_CODE',
        'Updated',
        :old."BANK_SORT_CODE",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."GIRO_ACC_NO" != :new."GIRO_ACC_NO")
    or (:old."GIRO_ACC_NO" is null and :new."GIRO_ACC_NO" is not null)
    or (:old."GIRO_ACC_NO" is not null and :new."GIRO_ACC_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'GIRO_ACC_NO',
        'Updated',
        :old."GIRO_ACC_NO",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."GIRO_TRANS_CODE_1" != :new."GIRO_TRANS_CODE_1")
    or (:old."GIRO_TRANS_CODE_1" is null and :new."GIRO_TRANS_CODE_1" is not null)
    or (:old."GIRO_TRANS_CODE_1" is not null and :new."GIRO_TRANS_CODE_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'GIRO_TRANS_CODE_1',
        'Updated',
        :old."GIRO_TRANS_CODE_1",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."GIRO_TRANS_CODE_2" != :new."GIRO_TRANS_CODE_2")
    or (:old."GIRO_TRANS_CODE_2" is null and :new."GIRO_TRANS_CODE_2" is not null)
    or (:old."GIRO_TRANS_CODE_2" is not null and :new."GIRO_TRANS_CODE_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'GIRO_TRANS_CODE_2',
        'Updated',
        :old."GIRO_TRANS_CODE_2",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PARTY_ID" != :new."PARTY_ID")
    or (:old."PARTY_ID" is null and :new."PARTY_ID" is not null)
    or (:old."PARTY_ID" is not null and :new."PARTY_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYEES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        to_char(:old."PARTY_ID"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'PAYEES',
      null,
      v_type,
      null,
      to_char(nvl(:old."PARTY_ID",:new."PARTY_ID")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_PAYEES" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_PAYMENTS"
after update or insert or delete on "PAYMENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADMIN_COURT_CODE" != :new."ADMIN_COURT_CODE")
    or (:old."ADMIN_COURT_CODE" is null and :new."ADMIN_COURT_CODE" is not null)
    or (:old."ADMIN_COURT_CODE" is not null and :new."ADMIN_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ALD_DEBT_SEQ" != :new."ALD_DEBT_SEQ")
    or (:old."ALD_DEBT_SEQ" is null and :new."ALD_DEBT_SEQ" is not null)
    or (:old."ALD_DEBT_SEQ" is not null and :new."ALD_DEBT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'ALD_DEBT_SEQ',
        'Updated',
        to_char(:old."ALD_DEBT_SEQ"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."AMOUNT" != :new."AMOUNT")
    or (:old."AMOUNT" is null and :new."AMOUNT" is not null)
    or (:old."AMOUNT" is not null and :new."AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'AMOUNT',
        'Updated',
        to_char(:old."AMOUNT"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."AMOUNT_CURRENCY" != :new."AMOUNT_CURRENCY")
    or (:old."AMOUNT_CURRENCY" is null and :new."AMOUNT_CURRENCY" is not null)
    or (:old."AMOUNT_CURRENCY" is not null and :new."AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'AMOUNT_CURRENCY',
        'Updated',
        :old."AMOUNT_CURRENCY",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."BAILIFF_KNOWLEDGE" != :new."BAILIFF_KNOWLEDGE")
    or (:old."BAILIFF_KNOWLEDGE" is null and :new."BAILIFF_KNOWLEDGE" is not null)
    or (:old."BAILIFF_KNOWLEDGE" is not null and :new."BAILIFF_KNOWLEDGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'BAILIFF_KNOWLEDGE',
        'Updated',
        :old."BAILIFF_KNOWLEDGE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."BENEFIT_AMOUNT" != :new."BENEFIT_AMOUNT")
    or (:old."BENEFIT_AMOUNT" is null and :new."BENEFIT_AMOUNT" is not null)
    or (:old."BENEFIT_AMOUNT" is not null and :new."BENEFIT_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'BENEFIT_AMOUNT',
        'Updated',
        to_char(:old."BENEFIT_AMOUNT"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."BENEFIT_AMOUNT_CURRENCY" != :new."BENEFIT_AMOUNT_CURRENCY")
    or (:old."BENEFIT_AMOUNT_CURRENCY" is null and :new."BENEFIT_AMOUNT_CURRENCY" is not null)
    or (:old."BENEFIT_AMOUNT_CURRENCY" is not null and :new."BENEFIT_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'BENEFIT_AMOUNT_CURRENCY',
        'Updated',
        :old."BENEFIT_AMOUNT_CURRENCY",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."COMPENSATION_AMOUNT" != :new."COMPENSATION_AMOUNT")
    or (:old."COMPENSATION_AMOUNT" is null and :new."COMPENSATION_AMOUNT" is not null)
    or (:old."COMPENSATION_AMOUNT" is not null and :new."COMPENSATION_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'COMPENSATION_AMOUNT',
        'Updated',
        to_char(:old."COMPENSATION_AMOUNT"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."COMPENSATION_AMOUNT_CURRENCY" != :new."COMPENSATION_AMOUNT_CURRENCY")
    or (:old."COMPENSATION_AMOUNT_CURRENCY" is null and :new."COMPENSATION_AMOUNT_CURRENCY" is not null)
    or (:old."COMPENSATION_AMOUNT_CURRENCY" is not null and :new."COMPENSATION_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'COMPENSATION_AMOUNT_CURRENCY',
        'Updated',
        :old."COMPENSATION_AMOUNT_CURRENCY",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."COUNTER_PAYMENT" != :new."COUNTER_PAYMENT")
    or (:old."COUNTER_PAYMENT" is null and :new."COUNTER_PAYMENT" is not null)
    or (:old."COUNTER_PAYMENT" is not null and :new."COUNTER_PAYMENT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'COUNTER_PAYMENT',
        'Updated',
        :old."COUNTER_PAYMENT",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."CREATED_BY" != :new."CREATED_BY")
    or (:old."CREATED_BY" is null and :new."CREATED_BY" is not null)
    or (:old."CREATED_BY" is not null and :new."CREATED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'CREATED_BY',
        'Updated',
        :old."CREATED_BY",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."DATE_ENTERED" != :new."DATE_ENTERED")
    or (:old."DATE_ENTERED" is null and :new."DATE_ENTERED" is not null)
    or (:old."DATE_ENTERED" is not null and :new."DATE_ENTERED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'DATE_ENTERED',
        'Updated',
        to_char(:old."DATE_ENTERED",'YYYY-MM-DD'),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."DEFENDANT_ID" != :new."DEFENDANT_ID")
    or (:old."DEFENDANT_ID" is null and :new."DEFENDANT_ID" is not null)
    or (:old."DEFENDANT_ID" is not null and :new."DEFENDANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'DEFENDANT_ID',
        'Updated',
        to_char(:old."DEFENDANT_ID"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ENFORCEMENT_COURT_CODE" != :new."ENFORCEMENT_COURT_CODE")
    or (:old."ENFORCEMENT_COURT_CODE" is null and :new."ENFORCEMENT_COURT_CODE" is not null)
    or (:old."ENFORCEMENT_COURT_CODE" is not null and :new."ENFORCEMENT_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'ENFORCEMENT_COURT_CODE',
        'Updated',
        to_char(:old."ENFORCEMENT_COURT_CODE"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ERROR_INDICATOR" != :new."ERROR_INDICATOR")
    or (:old."ERROR_INDICATOR" is null and :new."ERROR_INDICATOR" is not null)
    or (:old."ERROR_INDICATOR" is not null and :new."ERROR_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'ERROR_INDICATOR',
        'Updated',
        :old."ERROR_INDICATOR",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ISSUING_COURT" != :new."ISSUING_COURT")
    or (:old."ISSUING_COURT" is null and :new."ISSUING_COURT" is not null)
    or (:old."ISSUING_COURT" is not null and :new."ISSUING_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'ISSUING_COURT',
        'Updated',
        to_char(:old."ISSUING_COURT"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_ADDR1" != :new."LODGMENT_ADDR1")
    or (:old."LODGMENT_ADDR1" is null and :new."LODGMENT_ADDR1" is not null)
    or (:old."LODGMENT_ADDR1" is not null and :new."LODGMENT_ADDR1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_ADDR1',
        'Updated',
        :old."LODGMENT_ADDR1",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_ADDR2" != :new."LODGMENT_ADDR2")
    or (:old."LODGMENT_ADDR2" is null and :new."LODGMENT_ADDR2" is not null)
    or (:old."LODGMENT_ADDR2" is not null and :new."LODGMENT_ADDR2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_ADDR2',
        'Updated',
        :old."LODGMENT_ADDR2",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_ADDR3" != :new."LODGMENT_ADDR3")
    or (:old."LODGMENT_ADDR3" is null and :new."LODGMENT_ADDR3" is not null)
    or (:old."LODGMENT_ADDR3" is not null and :new."LODGMENT_ADDR3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_ADDR3',
        'Updated',
        :old."LODGMENT_ADDR3",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_ADDR4" != :new."LODGMENT_ADDR4")
    or (:old."LODGMENT_ADDR4" is null and :new."LODGMENT_ADDR4" is not null)
    or (:old."LODGMENT_ADDR4" is not null and :new."LODGMENT_ADDR4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_ADDR4',
        'Updated',
        :old."LODGMENT_ADDR4",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_ADDR5" != :new."LODGMENT_ADDR5")
    or (:old."LODGMENT_ADDR5" is null and :new."LODGMENT_ADDR5" is not null)
    or (:old."LODGMENT_ADDR5" is not null and :new."LODGMENT_ADDR5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_ADDR5',
        'Updated',
        :old."LODGMENT_ADDR5",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_CASE_PARTY_NO" != :new."LODGMENT_CASE_PARTY_NO")
    or (:old."LODGMENT_CASE_PARTY_NO" is null and :new."LODGMENT_CASE_PARTY_NO" is not null)
    or (:old."LODGMENT_CASE_PARTY_NO" is not null and :new."LODGMENT_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_CASE_PARTY_NO',
        'Updated',
        to_char(:old."LODGMENT_CASE_PARTY_NO"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_NAME" != :new."LODGMENT_NAME")
    or (:old."LODGMENT_NAME" is null and :new."LODGMENT_NAME" is not null)
    or (:old."LODGMENT_NAME" is not null and :new."LODGMENT_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_NAME',
        'Updated',
        :old."LODGMENT_NAME",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_PARTY_ROLE_CODE" != :new."LODGMENT_PARTY_ROLE_CODE")
    or (:old."LODGMENT_PARTY_ROLE_CODE" is null and :new."LODGMENT_PARTY_ROLE_CODE" is not null)
    or (:old."LODGMENT_PARTY_ROLE_CODE" is not null and :new."LODGMENT_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_PARTY_ROLE_CODE',
        'Updated',
        :old."LODGMENT_PARTY_ROLE_CODE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_POSTCODE" != :new."LODGMENT_POSTCODE")
    or (:old."LODGMENT_POSTCODE" is null and :new."LODGMENT_POSTCODE" is not null)
    or (:old."LODGMENT_POSTCODE" is not null and :new."LODGMENT_POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_POSTCODE',
        'Updated',
        :old."LODGMENT_POSTCODE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."LODGMENT_REFERENCE" != :new."LODGMENT_REFERENCE")
    or (:old."LODGMENT_REFERENCE" is null and :new."LODGMENT_REFERENCE" is not null)
    or (:old."LODGMENT_REFERENCE" is not null and :new."LODGMENT_REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'LODGMENT_REFERENCE',
        'Updated',
        :old."LODGMENT_REFERENCE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."NAMED_BENEFIT" != :new."NAMED_BENEFIT")
    or (:old."NAMED_BENEFIT" is null and :new."NAMED_BENEFIT" is not null)
    or (:old."NAMED_BENEFIT" is not null and :new."NAMED_BENEFIT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'NAMED_BENEFIT',
        'Updated',
        :old."NAMED_BENEFIT",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."NOTES" != :new."NOTES")
    or (:old."NOTES" is null and :new."NOTES" is not null)
    or (:old."NOTES" is not null and :new."NOTES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'NOTES',
        'Updated',
        :old."NOTES",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYEE_ADDR1" != :new."OVERPAYEE_ADDR1")
    or (:old."OVERPAYEE_ADDR1" is null and :new."OVERPAYEE_ADDR1" is not null)
    or (:old."OVERPAYEE_ADDR1" is not null and :new."OVERPAYEE_ADDR1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYEE_ADDR1',
        'Updated',
        :old."OVERPAYEE_ADDR1",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYEE_ADDR2" != :new."OVERPAYEE_ADDR2")
    or (:old."OVERPAYEE_ADDR2" is null and :new."OVERPAYEE_ADDR2" is not null)
    or (:old."OVERPAYEE_ADDR2" is not null and :new."OVERPAYEE_ADDR2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYEE_ADDR2',
        'Updated',
        :old."OVERPAYEE_ADDR2",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYEE_ADDR3" != :new."OVERPAYEE_ADDR3")
    or (:old."OVERPAYEE_ADDR3" is null and :new."OVERPAYEE_ADDR3" is not null)
    or (:old."OVERPAYEE_ADDR3" is not null and :new."OVERPAYEE_ADDR3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYEE_ADDR3',
        'Updated',
        :old."OVERPAYEE_ADDR3",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYEE_ADDR4" != :new."OVERPAYEE_ADDR4")
    or (:old."OVERPAYEE_ADDR4" is null and :new."OVERPAYEE_ADDR4" is not null)
    or (:old."OVERPAYEE_ADDR4" is not null and :new."OVERPAYEE_ADDR4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYEE_ADDR4',
        'Updated',
        :old."OVERPAYEE_ADDR4",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYEE_ADDR5" != :new."OVERPAYEE_ADDR5")
    or (:old."OVERPAYEE_ADDR5" is null and :new."OVERPAYEE_ADDR5" is not null)
    or (:old."OVERPAYEE_ADDR5" is not null and :new."OVERPAYEE_ADDR5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYEE_ADDR5',
        'Updated',
        :old."OVERPAYEE_ADDR5",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYEE_NAME" != :new."OVERPAYEE_NAME")
    or (:old."OVERPAYEE_NAME" is null and :new."OVERPAYEE_NAME" is not null)
    or (:old."OVERPAYEE_NAME" is not null and :new."OVERPAYEE_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYEE_NAME',
        'Updated',
        :old."OVERPAYEE_NAME",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYEE_POSTCODE" != :new."OVERPAYEE_POSTCODE")
    or (:old."OVERPAYEE_POSTCODE" is null and :new."OVERPAYEE_POSTCODE" is not null)
    or (:old."OVERPAYEE_POSTCODE" is not null and :new."OVERPAYEE_POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYEE_POSTCODE',
        'Updated',
        :old."OVERPAYEE_POSTCODE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYMENT_AMOUNT" != :new."OVERPAYMENT_AMOUNT")
    or (:old."OVERPAYMENT_AMOUNT" is null and :new."OVERPAYMENT_AMOUNT" is not null)
    or (:old."OVERPAYMENT_AMOUNT" is not null and :new."OVERPAYMENT_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYMENT_AMOUNT',
        'Updated',
        to_char(:old."OVERPAYMENT_AMOUNT"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."OVERPAYMENT_AMOUNT_CURRENCY" != :new."OVERPAYMENT_AMOUNT_CURRENCY")
    or (:old."OVERPAYMENT_AMOUNT_CURRENCY" is null and :new."OVERPAYMENT_AMOUNT_CURRENCY" is not null)
    or (:old."OVERPAYMENT_AMOUNT_CURRENCY" is not null and :new."OVERPAYMENT_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'OVERPAYMENT_AMOUNT_CURRENCY',
        'Updated',
        :old."OVERPAYMENT_AMOUNT_CURRENCY",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PASSTHROUGH" != :new."PASSTHROUGH")
    or (:old."PASSTHROUGH" is null and :new."PASSTHROUGH" is not null)
    or (:old."PASSTHROUGH" is not null and :new."PASSTHROUGH" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PASSTHROUGH',
        'Updated',
        :old."PASSTHROUGH",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYABLE_ORDER_NUMBER_1" != :new."PAYABLE_ORDER_NUMBER_1")
    or (:old."PAYABLE_ORDER_NUMBER_1" is null and :new."PAYABLE_ORDER_NUMBER_1" is not null)
    or (:old."PAYABLE_ORDER_NUMBER_1" is not null and :new."PAYABLE_ORDER_NUMBER_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYABLE_ORDER_NUMBER_1',
        'Updated',
        to_char(:old."PAYABLE_ORDER_NUMBER_1"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYABLE_ORDER_NUMBER_2" != :new."PAYABLE_ORDER_NUMBER_2")
    or (:old."PAYABLE_ORDER_NUMBER_2" is null and :new."PAYABLE_ORDER_NUMBER_2" is not null)
    or (:old."PAYABLE_ORDER_NUMBER_2" is not null and :new."PAYABLE_ORDER_NUMBER_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYABLE_ORDER_NUMBER_2',
        'Updated',
        to_char(:old."PAYABLE_ORDER_NUMBER_2"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_ADDR_1" != :new."PAYEE_ADDR_1")
    or (:old."PAYEE_ADDR_1" is null and :new."PAYEE_ADDR_1" is not null)
    or (:old."PAYEE_ADDR_1" is not null and :new."PAYEE_ADDR_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_ADDR_1',
        'Updated',
        :old."PAYEE_ADDR_1",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_ADDR_2" != :new."PAYEE_ADDR_2")
    or (:old."PAYEE_ADDR_2" is null and :new."PAYEE_ADDR_2" is not null)
    or (:old."PAYEE_ADDR_2" is not null and :new."PAYEE_ADDR_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_ADDR_2',
        'Updated',
        :old."PAYEE_ADDR_2",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_ADDR_3" != :new."PAYEE_ADDR_3")
    or (:old."PAYEE_ADDR_3" is null and :new."PAYEE_ADDR_3" is not null)
    or (:old."PAYEE_ADDR_3" is not null and :new."PAYEE_ADDR_3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_ADDR_3',
        'Updated',
        :old."PAYEE_ADDR_3",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_ADDR_4" != :new."PAYEE_ADDR_4")
    or (:old."PAYEE_ADDR_4" is null and :new."PAYEE_ADDR_4" is not null)
    or (:old."PAYEE_ADDR_4" is not null and :new."PAYEE_ADDR_4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_ADDR_4',
        'Updated',
        :old."PAYEE_ADDR_4",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_ADDR_5" != :new."PAYEE_ADDR_5")
    or (:old."PAYEE_ADDR_5" is null and :new."PAYEE_ADDR_5" is not null)
    or (:old."PAYEE_ADDR_5" is not null and :new."PAYEE_ADDR_5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_ADDR_5',
        'Updated',
        :old."PAYEE_ADDR_5",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_ID" != :new."PAYEE_ID")
    or (:old."PAYEE_ID" is null and :new."PAYEE_ID" is not null)
    or (:old."PAYEE_ID" is not null and :new."PAYEE_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_ID',
        'Updated',
        to_char(:old."PAYEE_ID"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_NAME" != :new."PAYEE_NAME")
    or (:old."PAYEE_NAME" is null and :new."PAYEE_NAME" is not null)
    or (:old."PAYEE_NAME" is not null and :new."PAYEE_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_NAME',
        'Updated',
        :old."PAYEE_NAME",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_POSTCODE" != :new."PAYEE_POSTCODE")
    or (:old."PAYEE_POSTCODE" is null and :new."PAYEE_POSTCODE" is not null)
    or (:old."PAYEE_POSTCODE" is not null and :new."PAYEE_POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_POSTCODE',
        'Updated',
        :old."PAYEE_POSTCODE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_REFERENCE" != :new."PAYEE_REFERENCE")
    or (:old."PAYEE_REFERENCE" is null and :new."PAYEE_REFERENCE" is not null)
    or (:old."PAYEE_REFERENCE" is not null and :new."PAYEE_REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_REFERENCE',
        'Updated',
        :old."PAYEE_REFERENCE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_REP_DX" != :new."PAYEE_REP_DX")
    or (:old."PAYEE_REP_DX" is null and :new."PAYEE_REP_DX" is not null)
    or (:old."PAYEE_REP_DX" is not null and :new."PAYEE_REP_DX" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_REP_DX',
        'Updated',
        :old."PAYEE_REP_DX",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYEE_TEL_NO" != :new."PAYEE_TEL_NO")
    or (:old."PAYEE_TEL_NO" is null and :new."PAYEE_TEL_NO" is not null)
    or (:old."PAYEE_TEL_NO" is not null and :new."PAYEE_TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYEE_TEL_NO',
        'Updated',
        :old."PAYEE_TEL_NO",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYMENT_FOR" != :new."PAYMENT_FOR")
    or (:old."PAYMENT_FOR" is null and :new."PAYMENT_FOR" is not null)
    or (:old."PAYMENT_FOR" is not null and :new."PAYMENT_FOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYMENT_FOR',
        'Updated',
        :old."PAYMENT_FOR",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYMENT_TYPE" != :new."PAYMENT_TYPE")
    or (:old."PAYMENT_TYPE" is null and :new."PAYMENT_TYPE" is not null)
    or (:old."PAYMENT_TYPE" is not null and :new."PAYMENT_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYMENT_TYPE',
        'Updated',
        :old."PAYMENT_TYPE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYOUT_DATE" != :new."PAYOUT_DATE")
    or (:old."PAYOUT_DATE" is null and :new."PAYOUT_DATE" is not null)
    or (:old."PAYOUT_DATE" is not null and :new."PAYOUT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYOUT_DATE',
        'Updated',
        to_char(:old."PAYOUT_DATE",'YYYY-MM-DD'),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PAYOUT_REPORT_ID" != :new."PAYOUT_REPORT_ID")
    or (:old."PAYOUT_REPORT_ID" is null and :new."PAYOUT_REPORT_ID" is not null)
    or (:old."PAYOUT_REPORT_ID" is not null and :new."PAYOUT_REPORT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PAYOUT_REPORT_ID',
        'Updated',
        :old."PAYOUT_REPORT_ID",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PO_TOTAL" != :new."PO_TOTAL")
    or (:old."PO_TOTAL" is null and :new."PO_TOTAL" is not null)
    or (:old."PO_TOTAL" is not null and :new."PO_TOTAL" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PO_TOTAL',
        'Updated',
        to_char(:old."PO_TOTAL"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PO_TOTAL_CURRENCY" != :new."PO_TOTAL_CURRENCY")
    or (:old."PO_TOTAL_CURRENCY" is null and :new."PO_TOTAL_CURRENCY" is not null)
    or (:old."PO_TOTAL_CURRENCY" is not null and :new."PO_TOTAL_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'PO_TOTAL_CURRENCY',
        'Updated',
        :old."PO_TOTAL_CURRENCY",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."RD_DATE" != :new."RD_DATE")
    or (:old."RD_DATE" is null and :new."RD_DATE" is not null)
    or (:old."RD_DATE" is not null and :new."RD_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'RD_DATE',
        'Updated',
        to_char(:old."RD_DATE",'YYYY-MM-DD'),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."RECEIPT_REQUIRED" != :new."RECEIPT_REQUIRED")
    or (:old."RECEIPT_REQUIRED" is null and :new."RECEIPT_REQUIRED" is not null)
    or (:old."RECEIPT_REQUIRED" is not null and :new."RECEIPT_REQUIRED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'RECEIPT_REQUIRED',
        'Updated',
        :old."RECEIPT_REQUIRED",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."REDUCTION_AMOUNT" != :new."REDUCTION_AMOUNT")
    or (:old."REDUCTION_AMOUNT" is null and :new."REDUCTION_AMOUNT" is not null)
    or (:old."REDUCTION_AMOUNT" is not null and :new."REDUCTION_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'REDUCTION_AMOUNT',
        'Updated',
        to_char(:old."REDUCTION_AMOUNT"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."REDUCTION_AMOUNT_CURRENCY" != :new."REDUCTION_AMOUNT_CURRENCY")
    or (:old."REDUCTION_AMOUNT_CURRENCY" is null and :new."REDUCTION_AMOUNT_CURRENCY" is not null)
    or (:old."REDUCTION_AMOUNT_CURRENCY" is not null and :new."REDUCTION_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'REDUCTION_AMOUNT_CURRENCY',
        'Updated',
        :old."REDUCTION_AMOUNT_CURRENCY",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."RELATED_ADMIN_COURT_CODE" != :new."RELATED_ADMIN_COURT_CODE")
    or (:old."RELATED_ADMIN_COURT_CODE" is null and :new."RELATED_ADMIN_COURT_CODE" is not null)
    or (:old."RELATED_ADMIN_COURT_CODE" is not null and :new."RELATED_ADMIN_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'RELATED_ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."RELATED_ADMIN_COURT_CODE"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."RELATED_TRANSACTION_NUMBER" != :new."RELATED_TRANSACTION_NUMBER")
    or (:old."RELATED_TRANSACTION_NUMBER" is null and :new."RELATED_TRANSACTION_NUMBER" is not null)
    or (:old."RELATED_TRANSACTION_NUMBER" is not null and :new."RELATED_TRANSACTION_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'RELATED_TRANSACTION_NUMBER',
        'Updated',
        to_char(:old."RELATED_TRANSACTION_NUMBER"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."RELEASE_DATE" != :new."RELEASE_DATE")
    or (:old."RELEASE_DATE" is null and :new."RELEASE_DATE" is not null)
    or (:old."RELEASE_DATE" is not null and :new."RELEASE_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'RELEASE_DATE',
        'Updated',
        to_char(:old."RELEASE_DATE",'YYYY-MM-DD'),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."RETENTION_TYPE" != :new."RETENTION_TYPE")
    or (:old."RETENTION_TYPE" is null and :new."RETENTION_TYPE" is not null)
    or (:old."RETENTION_TYPE" is not null and :new."RETENTION_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'RETENTION_TYPE',
        'Updated',
        :old."RETENTION_TYPE",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."SUBJECT_NO" != :new."SUBJECT_NO")
    or (:old."SUBJECT_NO" is null and :new."SUBJECT_NO" is not null)
    or (:old."SUBJECT_NO" is not null and :new."SUBJECT_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'SUBJECT_NO',
        'Updated',
        :old."SUBJECT_NO",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."TRANSACTION_NUMBER" != :new."TRANSACTION_NUMBER")
    or (:old."TRANSACTION_NUMBER" is null and :new."TRANSACTION_NUMBER" is not null)
    or (:old."TRANSACTION_NUMBER" is not null and :new."TRANSACTION_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'TRANSACTION_NUMBER',
        'Updated',
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."VERIFICATION_DATE" != :new."VERIFICATION_DATE")
    or (:old."VERIFICATION_DATE" is null and :new."VERIFICATION_DATE" is not null)
    or (:old."VERIFICATION_DATE" is not null and :new."VERIFICATION_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'VERIFICATION_DATE',
        'Updated',
        to_char(:old."VERIFICATION_DATE",'YYYY-MM-DD'),
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."VERIFICATION_REPORT_ID" != :new."VERIFICATION_REPORT_ID")
    or (:old."VERIFICATION_REPORT_ID" is null and :new."VERIFICATION_REPORT_ID" is not null)
    or (:old."VERIFICATION_REPORT_ID" is not null and :new."VERIFICATION_REPORT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PAYMENTS',
        'VERIFICATION_REPORT_ID',
        'Updated',
        :old."VERIFICATION_REPORT_ID",
        to_char(:old."TRANSACTION_NUMBER"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'PAYMENTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."TRANSACTION_NUMBER",:new."TRANSACTION_NUMBER")),
      to_char(nvl(:old."ADMIN_COURT_CODE",:new."ADMIN_COURT_CODE")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_PAYMENTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_PERSONALISE"
after update or insert or delete on "PERSONALISE"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table PERSONALISE                                      */
/*   Script generated 04-AUG-2007 09:38:39                                    */
/*   From:                                                                    */
/*     Server   csa00072                                                      */
/*     Database supsb                                                         */
/*     User     CMAN                                                          */
/*   Change History:                                                          */
/*     04/09/2012, Chris Vincent.                                             */
/*     Added handlers for columns DR_OPEN_FROM, DR_CLOSED_AT and              */
/*     BY_APPOINTMENT_IND.  Trac 4718                                         */
/******************************************************************************/
/******************************************************************************/
/**  THIS TRIGGER MUST NOT BE EDITED. IF THERE ARE SCHEMA CHANGES FOR        **/
/**  AUDITED TABLES, THE AUDIT TRIGGERS MUST BE REGENERATED USING A SCRIPT   **/
/**  PRODUCED BY PROCEDURE AUD_TRIG_GEN.                                     **/
/******************************************************************************/
/******************************************************************************/
/*   If updating, each column is checked to see if it has changed, and for    */
/*   each one that has there is a row written to SUPS_AMENDMENTS.             */
/*   If inserting or deleting, a single row is written to SUPS_AMENDMENTS.    */
/******************************************************************************/
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ACCOUNTING_CODE" != :new."ACCOUNTING_CODE")
    or (:old."ACCOUNTING_CODE" is null and :new."ACCOUNTING_CODE" is not null)
    or (:old."ACCOUNTING_CODE" is not null and :new."ACCOUNTING_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'ACCOUNTING_CODE',
        'Updated',
        to_char(:old."ACCOUNTING_CODE"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."ACCOUNT_TYPE" != :new."ACCOUNT_TYPE")
    or (:old."ACCOUNT_TYPE" is null and :new."ACCOUNT_TYPE" is not null)
    or (:old."ACCOUNT_TYPE" is not null and :new."ACCOUNT_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'ACCOUNT_TYPE',
        'Updated',
        :old."ACCOUNT_TYPE",
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_CLOSING" != :new."BAILIFF_CLOSING")
    or (:old."BAILIFF_CLOSING" is null and :new."BAILIFF_CLOSING" is not null)
    or (:old."BAILIFF_CLOSING" is not null and :new."BAILIFF_CLOSING" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'BAILIFF_CLOSING',
        'Updated',
        to_char(:old."BAILIFF_CLOSING"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_FAX" != :new."BAILIFF_FAX")
    or (:old."BAILIFF_FAX" is null and :new."BAILIFF_FAX" is not null)
    or (:old."BAILIFF_FAX" is not null and :new."BAILIFF_FAX" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'BAILIFF_FAX',
        'Updated',
        :old."BAILIFF_FAX",
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_OPENING" != :new."BAILIFF_OPENING")
    or (:old."BAILIFF_OPENING" is null and :new."BAILIFF_OPENING" is not null)
    or (:old."BAILIFF_OPENING" is not null and :new."BAILIFF_OPENING" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'BAILIFF_OPENING',
        'Updated',
        to_char(:old."BAILIFF_OPENING"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_TELEPHONE" != :new."BAILIFF_TELEPHONE")
    or (:old."BAILIFF_TELEPHONE" is null and :new."BAILIFF_TELEPHONE" is not null)
    or (:old."BAILIFF_TELEPHONE" is not null and :new."BAILIFF_TELEPHONE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'BAILIFF_TELEPHONE',
        'Updated',
        :old."BAILIFF_TELEPHONE",
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."CLOSED_AT" != :new."CLOSED_AT")
    or (:old."CLOSED_AT" is null and :new."CLOSED_AT" is not null)
    or (:old."CLOSED_AT" is not null and :new."CLOSED_AT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'CLOSED_AT',
        'Updated',
        to_char(:old."CLOSED_AT"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."CRT_CODE" != :new."CRT_CODE")
    or (:old."CRT_CODE" is null and :new."CRT_CODE" is not null)
    or (:old."CRT_CODE" is not null and :new."CRT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'CRT_CODE',
        'Updated',
        to_char(:old."CRT_CODE"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."OPEN_FROM" != :new."OPEN_FROM")
    or (:old."OPEN_FROM" is null and :new."OPEN_FROM" is not null)
    or (:old."OPEN_FROM" is not null and :new."OPEN_FROM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'OPEN_FROM',
        'Updated',
        to_char(:old."OPEN_FROM"),
        to_char(:old."CRT_CODE"));
    end if;

    if (:old."DR_OPEN_FROM" != :new."DR_OPEN_FROM")
    or (:old."DR_OPEN_FROM" is null and :new."DR_OPEN_FROM" is not null)
    or (:old."DR_OPEN_FROM" is not null and :new."DR_OPEN_FROM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'DR_OPEN_FROM',
        'Updated',
        to_char(:old."DR_OPEN_FROM"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."DR_CLOSED_AT" != :new."DR_CLOSED_AT")
    or (:old."DR_CLOSED_AT" is null and :new."DR_CLOSED_AT" is not null)
    or (:old."DR_CLOSED_AT" is not null and :new."DR_CLOSED_AT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'DR_CLOSED_AT',
        'Updated',
        to_char(:old."DR_CLOSED_AT"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BY_APPOINTMENT_IND" != :new."BY_APPOINTMENT_IND")
    or (:old."BY_APPOINTMENT_IND" is null and :new."BY_APPOINTMENT_IND" is not null)
    or (:old."BY_APPOINTMENT_IND" is not null and :new."BY_APPOINTMENT_IND" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PERSONALISE',
        'BY_APPOINTMENT_IND',
        'Updated',
        to_char(:old."BY_APPOINTMENT_IND"),
        to_char(:old."CRT_CODE"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'PERSONALISE',
      null,
      v_type,
      null,
      to_char(nvl(:old."CRT_CODE",:new."CRT_CODE")));
  end if;
end;

/
ALTER TRIGGER "CASEMAN"."AUD_PERSONALISE" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_USER_COURT"
after update or insert or delete on "USER_COURT"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."COURT_CODE" != :new."COURT_CODE")
    or (:old."COURT_CODE" is null and :new."COURT_CODE" is not null)
    or (:old."COURT_CODE" is not null and :new."COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_COURT',
        'COURT_CODE',
        'Updated',
        to_char(:old."COURT_CODE"),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."DATE_FROM" != :new."DATE_FROM")
    or (:old."DATE_FROM" is null and :new."DATE_FROM" is not null)
    or (:old."DATE_FROM" is not null and :new."DATE_FROM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_COURT',
        'DATE_FROM',
        'Updated',
        to_char(:old."DATE_FROM",'YYYY-MM-DD'),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."DATE_TO" != :new."DATE_TO")
    or (:old."DATE_TO" is null and :new."DATE_TO" is not null)
    or (:old."DATE_TO" is not null and :new."DATE_TO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_COURT',
        'DATE_TO',
        'Updated',
        to_char(:old."DATE_TO",'YYYY-MM-DD'),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."HOME_FLAG" != :new."HOME_FLAG")
    or (:old."HOME_FLAG" is null and :new."HOME_FLAG" is not null)
    or (:old."HOME_FLAG" is not null and :new."HOME_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_COURT',
        'HOME_FLAG',
        'Updated',
        :old."HOME_FLAG",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."SECTION_NAME" != :new."SECTION_NAME")
    or (:old."SECTION_NAME" is null and :new."SECTION_NAME" is not null)
    or (:old."SECTION_NAME" is not null and :new."SECTION_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_COURT',
        'SECTION_NAME',
        'Updated',
        :old."SECTION_NAME",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."USER_ID" != :new."USER_ID")
    or (:old."USER_ID" is null and :new."USER_ID" is not null)
    or (:old."USER_ID" is not null and :new."USER_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_COURT',
        'USER_ID',
        'Updated',
        :old."USER_ID",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'USER_COURT',
      null,
      v_type,
      null,
      nvl(:old."USER_ID",:new."USER_ID"),
      to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_USER_COURT" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_USER_ROLE"
after update or insert or delete on "USER_ROLE"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."COURT_CODE" != :new."COURT_CODE")
    or (:old."COURT_CODE" is null and :new."COURT_CODE" is not null)
    or (:old."COURT_CODE" is not null and :new."COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_ROLE',
        'COURT_CODE',
        'Updated',
        to_char(:old."COURT_CODE"),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."ROLE_ID" != :new."ROLE_ID")
    or (:old."ROLE_ID" is null and :new."ROLE_ID" is not null)
    or (:old."ROLE_ID" is not null and :new."ROLE_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_ROLE',
        'ROLE_ID',
        'Updated',
        :old."ROLE_ID",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."USER_ID" != :new."USER_ID")
    or (:old."USER_ID" is null and :new."USER_ID" is not null)
    or (:old."USER_ID" is not null and :new."USER_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'USER_ROLE',
        'USER_ID',
        'Updated',
        :old."USER_ID",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
  elsif (inserting and :new."ROLE_ID" = 'admin')
    then
        v_type := 'Inserted';
        insert into "SUPS_AMENDMENTS" (
          time_stamp,
          date_of_change,
          court_id,
          user_id,
          process_id,
          table_name,
          column_name,
          amendment_type,
          old_value,
          pk01,
          pk02)
        values (
          systimestamp,
          trunc(sysdate),
          v_courtid,
          v_userid,
          v_processid,
          'USER_ROLE',
          'ROLE_ID',
          v_type,
          null,
          nvl(:old."USER_ID",:new."USER_ID"),
          to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
  elsif (deleting and :old."ROLE_ID" = 'admin')
    then
        v_type := 'Deleted';
        insert into "SUPS_AMENDMENTS" (
          time_stamp,
          date_of_change,
          court_id,
          user_id,
          process_id,
          table_name,
          column_name,
          amendment_type,
          old_value,
          pk01,
          pk02)
        values (
          systimestamp,
          trunc(sysdate),
          v_courtid,
          v_userid,
          v_processid,
          'USER_ROLE',
          'ROLE_ID',
          v_type,
          'admin',
          nvl(:old."USER_ID",:new."USER_ID"),
          to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'USER_ROLE',
      null,
      v_type,
      null,
      nvl(:old."USER_ID",:new."USER_ID"),
      to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_USER_ROLE" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_WARRANTS"
after update or insert or delete on "WARRANTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."BAILIFF_IDENTIFIER" != :new."BAILIFF_IDENTIFIER")
    or (:old."BAILIFF_IDENTIFIER" is null and :new."BAILIFF_IDENTIFIER" is not null)
    or (:old."BAILIFF_IDENTIFIER" is not null and :new."BAILIFF_IDENTIFIER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'BAILIFF_IDENTIFIER',
        'Updated',
        to_char(:old."BAILIFF_IDENTIFIER"),
        :old."WARRANT_ID");
    end if;
    if (:old."BALANCE_AFTER_PAID" != :new."BALANCE_AFTER_PAID")
    or (:old."BALANCE_AFTER_PAID" is null and :new."BALANCE_AFTER_PAID" is not null)
    or (:old."BALANCE_AFTER_PAID" is not null and :new."BALANCE_AFTER_PAID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'BALANCE_AFTER_PAID',
        'Updated',
        to_char(:old."BALANCE_AFTER_PAID"),
        :old."WARRANT_ID");
    end if;
    if (:old."BALANCE_AFTER_PAID_CURRENCY" != :new."BALANCE_AFTER_PAID_CURRENCY")
    or (:old."BALANCE_AFTER_PAID_CURRENCY" is null and :new."BALANCE_AFTER_PAID_CURRENCY" is not null)
    or (:old."BALANCE_AFTER_PAID_CURRENCY" is not null and :new."BALANCE_AFTER_PAID_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'BALANCE_AFTER_PAID_CURRENCY',
        'Updated',
        :old."BALANCE_AFTER_PAID_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."CASE_NUMBER" != :new."CASE_NUMBER")
    or (:old."CASE_NUMBER" is null and :new."CASE_NUMBER" is not null)
    or (:old."CASE_NUMBER" is not null and :new."CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."CCBC_WARRANT" != :new."CCBC_WARRANT")
    or (:old."CCBC_WARRANT" is null and :new."CCBC_WARRANT" is not null)
    or (:old."CCBC_WARRANT" is not null and :new."CCBC_WARRANT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'CCBC_WARRANT',
        'Updated',
        :old."CCBC_WARRANT",
        :old."WARRANT_ID");
    end if;
    if (:old."CODED_PARTY_CLAIMANT_CODE" != :new."CODED_PARTY_CLAIMANT_CODE")
    or (:old."CODED_PARTY_CLAIMANT_CODE" is null and :new."CODED_PARTY_CLAIMANT_CODE" is not null)
    or (:old."CODED_PARTY_CLAIMANT_CODE" is not null and :new."CODED_PARTY_CLAIMANT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'CODED_PARTY_CLAIMANT_CODE',
        'Updated',
        to_char(:old."CODED_PARTY_CLAIMANT_CODE"),
        :old."WARRANT_ID");
    end if;
    if (:old."CODED_PARTY_REP_CODE" != :new."CODED_PARTY_REP_CODE")
    or (:old."CODED_PARTY_REP_CODE" is null and :new."CODED_PARTY_REP_CODE" is not null)
    or (:old."CODED_PARTY_REP_CODE" is not null and :new."CODED_PARTY_REP_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'CODED_PARTY_REP_CODE',
        'Updated',
        to_char(:old."CODED_PARTY_REP_CODE"),
        :old."WARRANT_ID");
    end if;
    if (:old."CO_NUMBER" != :new."CO_NUMBER")
    or (:old."CO_NUMBER" is null and :new."CO_NUMBER" is not null)
    or (:old."CO_NUMBER" is not null and :new."CO_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."CURRENTLY_OWNED_BY" != :new."CURRENTLY_OWNED_BY")
    or (:old."CURRENTLY_OWNED_BY" is null and :new."CURRENTLY_OWNED_BY" is not null)
    or (:old."CURRENTLY_OWNED_BY" is not null and :new."CURRENTLY_OWNED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'CURRENTLY_OWNED_BY',
        'Updated',
        to_char(:old."CURRENTLY_OWNED_BY"),
        :old."WARRANT_ID");
    end if;
    if (:old."DATE_PRINTED" != :new."DATE_PRINTED")
    or (:old."DATE_PRINTED" is null and :new."DATE_PRINTED" is not null)
    or (:old."DATE_PRINTED" is not null and :new."DATE_PRINTED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DATE_PRINTED',
        'Updated',
        to_char(:old."DATE_PRINTED",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."DATE_REPRINTED" != :new."DATE_REPRINTED")
    or (:old."DATE_REPRINTED" is null and :new."DATE_REPRINTED" is not null)
    or (:old."DATE_REPRINTED" is not null and :new."DATE_REPRINTED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DATE_REPRINTED',
        'Updated',
        to_char(:old."DATE_REPRINTED",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_1" != :new."DEF1_ADDR_1")
    or (:old."DEF1_ADDR_1" is null and :new."DEF1_ADDR_1" is not null)
    or (:old."DEF1_ADDR_1" is not null and :new."DEF1_ADDR_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_ADDR_1',
        'Updated',
        :old."DEF1_ADDR_1",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_2" != :new."DEF1_ADDR_2")
    or (:old."DEF1_ADDR_2" is null and :new."DEF1_ADDR_2" is not null)
    or (:old."DEF1_ADDR_2" is not null and :new."DEF1_ADDR_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_ADDR_2',
        'Updated',
        :old."DEF1_ADDR_2",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_3" != :new."DEF1_ADDR_3")
    or (:old."DEF1_ADDR_3" is null and :new."DEF1_ADDR_3" is not null)
    or (:old."DEF1_ADDR_3" is not null and :new."DEF1_ADDR_3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_ADDR_3',
        'Updated',
        :old."DEF1_ADDR_3",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_4" != :new."DEF1_ADDR_4")
    or (:old."DEF1_ADDR_4" is null and :new."DEF1_ADDR_4" is not null)
    or (:old."DEF1_ADDR_4" is not null and :new."DEF1_ADDR_4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_ADDR_4',
        'Updated',
        :old."DEF1_ADDR_4",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_5" != :new."DEF1_ADDR_5")
    or (:old."DEF1_ADDR_5" is null and :new."DEF1_ADDR_5" is not null)
    or (:old."DEF1_ADDR_5" is not null and :new."DEF1_ADDR_5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_ADDR_5',
        'Updated',
        :old."DEF1_ADDR_5",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_CASE_PARTY_NO" != :new."DEF1_CASE_PARTY_NO")
    or (:old."DEF1_CASE_PARTY_NO" is null and :new."DEF1_CASE_PARTY_NO" is not null)
    or (:old."DEF1_CASE_PARTY_NO" is not null and :new."DEF1_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_CASE_PARTY_NO',
        'Updated',
        to_char(:old."DEF1_CASE_PARTY_NO"),
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_PARTY_ROLE_CODE" != :new."DEF1_PARTY_ROLE_CODE")
    or (:old."DEF1_PARTY_ROLE_CODE" is null and :new."DEF1_PARTY_ROLE_CODE" is not null)
    or (:old."DEF1_PARTY_ROLE_CODE" is not null and :new."DEF1_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_PARTY_ROLE_CODE',
        'Updated',
        :old."DEF1_PARTY_ROLE_CODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_POSTCODE" != :new."DEF1_POSTCODE")
    or (:old."DEF1_POSTCODE" is null and :new."DEF1_POSTCODE" is not null)
    or (:old."DEF1_POSTCODE" is not null and :new."DEF1_POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF1_POSTCODE',
        'Updated',
        :old."DEF1_POSTCODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_1" != :new."DEF2_ADDR_1")
    or (:old."DEF2_ADDR_1" is null and :new."DEF2_ADDR_1" is not null)
    or (:old."DEF2_ADDR_1" is not null and :new."DEF2_ADDR_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_ADDR_1',
        'Updated',
        :old."DEF2_ADDR_1",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_2" != :new."DEF2_ADDR_2")
    or (:old."DEF2_ADDR_2" is null and :new."DEF2_ADDR_2" is not null)
    or (:old."DEF2_ADDR_2" is not null and :new."DEF2_ADDR_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_ADDR_2',
        'Updated',
        :old."DEF2_ADDR_2",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_3" != :new."DEF2_ADDR_3")
    or (:old."DEF2_ADDR_3" is null and :new."DEF2_ADDR_3" is not null)
    or (:old."DEF2_ADDR_3" is not null and :new."DEF2_ADDR_3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_ADDR_3',
        'Updated',
        :old."DEF2_ADDR_3",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_4" != :new."DEF2_ADDR_4")
    or (:old."DEF2_ADDR_4" is null and :new."DEF2_ADDR_4" is not null)
    or (:old."DEF2_ADDR_4" is not null and :new."DEF2_ADDR_4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_ADDR_4',
        'Updated',
        :old."DEF2_ADDR_4",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_5" != :new."DEF2_ADDR_5")
    or (:old."DEF2_ADDR_5" is null and :new."DEF2_ADDR_5" is not null)
    or (:old."DEF2_ADDR_5" is not null and :new."DEF2_ADDR_5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_ADDR_5',
        'Updated',
        :old."DEF2_ADDR_5",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_CASE_PARTY_NO" != :new."DEF2_CASE_PARTY_NO")
    or (:old."DEF2_CASE_PARTY_NO" is null and :new."DEF2_CASE_PARTY_NO" is not null)
    or (:old."DEF2_CASE_PARTY_NO" is not null and :new."DEF2_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_CASE_PARTY_NO',
        'Updated',
        to_char(:old."DEF2_CASE_PARTY_NO"),
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_PARTY_ROLE_CODE" != :new."DEF2_PARTY_ROLE_CODE")
    or (:old."DEF2_PARTY_ROLE_CODE" is null and :new."DEF2_PARTY_ROLE_CODE" is not null)
    or (:old."DEF2_PARTY_ROLE_CODE" is not null and :new."DEF2_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_PARTY_ROLE_CODE',
        'Updated',
        :old."DEF2_PARTY_ROLE_CODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_POSTCODE" != :new."DEF2_POSTCODE")
    or (:old."DEF2_POSTCODE" is null and :new."DEF2_POSTCODE" is not null)
    or (:old."DEF2_POSTCODE" is not null and :new."DEF2_POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEF2_POSTCODE',
        'Updated',
        :old."DEF2_POSTCODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEFENDANT1" != :new."DEFENDANT1")
    or (:old."DEFENDANT1" is null and :new."DEFENDANT1" is not null)
    or (:old."DEFENDANT1" is not null and :new."DEFENDANT1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEFENDANT1',
        'Updated',
        :old."DEFENDANT1",
        :old."WARRANT_ID");
    end if;
    if (:old."DEFENDANT2" != :new."DEFENDANT2")
    or (:old."DEFENDANT2" is null and :new."DEFENDANT2" is not null)
    or (:old."DEFENDANT2" is not null and :new."DEFENDANT2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'DEFENDANT2',
        'Updated',
        :old."DEFENDANT2",
        :old."WARRANT_ID");
    end if;
    if (:old."EXECUTED_BY" != :new."EXECUTED_BY")
    or (:old."EXECUTED_BY" is null and :new."EXECUTED_BY" is not null)
    or (:old."EXECUTED_BY" is not null and :new."EXECUTED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'EXECUTED_BY',
        'Updated',
        to_char(:old."EXECUTED_BY"),
        :old."WARRANT_ID");
    end if;
    if (:old."HOME_COURT_ISSUE_DATE" != :new."HOME_COURT_ISSUE_DATE")
    or (:old."HOME_COURT_ISSUE_DATE" is null and :new."HOME_COURT_ISSUE_DATE" is not null)
    or (:old."HOME_COURT_ISSUE_DATE" is not null and :new."HOME_COURT_ISSUE_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'HOME_COURT_ISSUE_DATE',
        'Updated',
        to_char(:old."HOME_COURT_ISSUE_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."ISSUED_BY" != :new."ISSUED_BY")
    or (:old."ISSUED_BY" is null and :new."ISSUED_BY" is not null)
    or (:old."ISSUED_BY" is not null and :new."ISSUED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'ISSUED_BY',
        'Updated',
        to_char(:old."ISSUED_BY"),
        :old."WARRANT_ID");
    end if;
    if (:old."LAND_REGISTRY_FEE" != :new."LAND_REGISTRY_FEE")
    or (:old."LAND_REGISTRY_FEE" is null and :new."LAND_REGISTRY_FEE" is not null)
    or (:old."LAND_REGISTRY_FEE" is not null and :new."LAND_REGISTRY_FEE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'LAND_REGISTRY_FEE',
        'Updated',
        to_char(:old."LAND_REGISTRY_FEE"),
        :old."WARRANT_ID");
    end if;
    if (:old."LAND_REGISTRY_FEE_CURRENCY" != :new."LAND_REGISTRY_FEE_CURRENCY")
    or (:old."LAND_REGISTRY_FEE_CURRENCY" is null and :new."LAND_REGISTRY_FEE_CURRENCY" is not null)
    or (:old."LAND_REGISTRY_FEE_CURRENCY" is not null and :new."LAND_REGISTRY_FEE_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'LAND_REGISTRY_FEE_CURRENCY',
        'Updated',
        :old."LAND_REGISTRY_FEE_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."LOCAL_WARRANT_NUMBER" != :new."LOCAL_WARRANT_NUMBER")
    or (:old."LOCAL_WARRANT_NUMBER" is null and :new."LOCAL_WARRANT_NUMBER" is not null)
    or (:old."LOCAL_WARRANT_NUMBER" is not null and :new."LOCAL_WARRANT_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'LOCAL_WARRANT_NUMBER',
        'Updated',
        :old."LOCAL_WARRANT_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."NOTES" != :new."NOTES")
    or (:old."NOTES" is null and :new."NOTES" is not null)
    or (:old."NOTES" is not null and :new."NOTES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'NOTES',
        'Updated',
        :old."NOTES",
        :old."WARRANT_ID");
    end if;
    if (:old."ORIGINAL_WARRANT_NUMBER" != :new."ORIGINAL_WARRANT_NUMBER")
    or (:old."ORIGINAL_WARRANT_NUMBER" is null and :new."ORIGINAL_WARRANT_NUMBER" is not null)
    or (:old."ORIGINAL_WARRANT_NUMBER" is not null and :new."ORIGINAL_WARRANT_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'ORIGINAL_WARRANT_NUMBER',
        'Updated',
        :old."ORIGINAL_WARRANT_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."PLAINTIFF_NAME" != :new."PLAINTIFF_NAME")
    or (:old."PLAINTIFF_NAME" is null and :new."PLAINTIFF_NAME" is not null)
    or (:old."PLAINTIFF_NAME" is not null and :new."PLAINTIFF_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'PLAINTIFF_NAME',
        'Updated',
        :old."PLAINTIFF_NAME",
        :old."WARRANT_ID");
    end if;
    if (:old."PREISSUE_BALANCE" != :new."PREISSUE_BALANCE")
    or (:old."PREISSUE_BALANCE" is null and :new."PREISSUE_BALANCE" is not null)
    or (:old."PREISSUE_BALANCE" is not null and :new."PREISSUE_BALANCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'PREISSUE_BALANCE',
        'Updated',
        to_char(:old."PREISSUE_BALANCE"),
        :old."WARRANT_ID");
    end if;
    if (:old."PREISSUE_BALANCE_CURRENCY" != :new."PREISSUE_BALANCE_CURRENCY")
    or (:old."PREISSUE_BALANCE_CURRENCY" is null and :new."PREISSUE_BALANCE_CURRENCY" is not null)
    or (:old."PREISSUE_BALANCE_CURRENCY" is not null and :new."PREISSUE_BALANCE_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'PREISSUE_BALANCE_CURRENCY',
        'Updated',
        :old."PREISSUE_BALANCE_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."RECEIPT_DATE" != :new."RECEIPT_DATE")
    or (:old."RECEIPT_DATE" is null and :new."RECEIPT_DATE" is not null)
    or (:old."RECEIPT_DATE" is not null and :new."RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."REFERENCE" != :new."REFERENCE")
    or (:old."REFERENCE" is null and :new."REFERENCE" is not null)
    or (:old."REFERENCE" is not null and :new."REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REFERENCE',
        'Updated',
        :old."REFERENCE",
        :old."WARRANT_ID");
    end if;
    if (:old."REPRINTED_BY" != :new."REPRINTED_BY")
    or (:old."REPRINTED_BY" is null and :new."REPRINTED_BY" is not null)
    or (:old."REPRINTED_BY" is not null and :new."REPRINTED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REPRINTED_BY',
        'Updated',
        :old."REPRINTED_BY",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_1" != :new."REP_ADDR_1")
    or (:old."REP_ADDR_1" is null and :new."REP_ADDR_1" is not null)
    or (:old."REP_ADDR_1" is not null and :new."REP_ADDR_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_ADDR_1',
        'Updated',
        :old."REP_ADDR_1",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_2" != :new."REP_ADDR_2")
    or (:old."REP_ADDR_2" is null and :new."REP_ADDR_2" is not null)
    or (:old."REP_ADDR_2" is not null and :new."REP_ADDR_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_ADDR_2',
        'Updated',
        :old."REP_ADDR_2",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_3" != :new."REP_ADDR_3")
    or (:old."REP_ADDR_3" is null and :new."REP_ADDR_3" is not null)
    or (:old."REP_ADDR_3" is not null and :new."REP_ADDR_3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_ADDR_3',
        'Updated',
        :old."REP_ADDR_3",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_4" != :new."REP_ADDR_4")
    or (:old."REP_ADDR_4" is null and :new."REP_ADDR_4" is not null)
    or (:old."REP_ADDR_4" is not null and :new."REP_ADDR_4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_ADDR_4',
        'Updated',
        :old."REP_ADDR_4",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_5" != :new."REP_ADDR_5")
    or (:old."REP_ADDR_5" is null and :new."REP_ADDR_5" is not null)
    or (:old."REP_ADDR_5" is not null and :new."REP_ADDR_5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_ADDR_5',
        'Updated',
        :old."REP_ADDR_5",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_CASE_PARTY_NO" != :new."REP_CASE_PARTY_NO")
    or (:old."REP_CASE_PARTY_NO" is null and :new."REP_CASE_PARTY_NO" is not null)
    or (:old."REP_CASE_PARTY_NO" is not null and :new."REP_CASE_PARTY_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_CASE_PARTY_NO',
        'Updated',
        to_char(:old."REP_CASE_PARTY_NO"),
        :old."WARRANT_ID");
    end if;
    if (:old."REP_DX_NUMBER" != :new."REP_DX_NUMBER")
    or (:old."REP_DX_NUMBER" is null and :new."REP_DX_NUMBER" is not null)
    or (:old."REP_DX_NUMBER" is not null and :new."REP_DX_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_DX_NUMBER',
        'Updated',
        :old."REP_DX_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_EMAIL_ADDRESS" != :new."REP_EMAIL_ADDRESS")
    or (:old."REP_EMAIL_ADDRESS" is null and :new."REP_EMAIL_ADDRESS" is not null)
    or (:old."REP_EMAIL_ADDRESS" is not null and :new."REP_EMAIL_ADDRESS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_EMAIL_ADDRESS',
        'Updated',
        :old."REP_EMAIL_ADDRESS",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_FAX_NUMBER" != :new."REP_FAX_NUMBER")
    or (:old."REP_FAX_NUMBER" is null and :new."REP_FAX_NUMBER" is not null)
    or (:old."REP_FAX_NUMBER" is not null and :new."REP_FAX_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_FAX_NUMBER',
        'Updated',
        :old."REP_FAX_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_NAME" != :new."REP_NAME")
    or (:old."REP_NAME" is null and :new."REP_NAME" is not null)
    or (:old."REP_NAME" is not null and :new."REP_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_NAME',
        'Updated',
        :old."REP_NAME",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_PARTY_ROLE_CODE" != :new."REP_PARTY_ROLE_CODE")
    or (:old."REP_PARTY_ROLE_CODE" is null and :new."REP_PARTY_ROLE_CODE" is not null)
    or (:old."REP_PARTY_ROLE_CODE" is not null and :new."REP_PARTY_ROLE_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_PARTY_ROLE_CODE',
        'Updated',
        :old."REP_PARTY_ROLE_CODE",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_POSTCODE" != :new."REP_POSTCODE")
    or (:old."REP_POSTCODE" is null and :new."REP_POSTCODE" is not null)
    or (:old."REP_POSTCODE" is not null and :new."REP_POSTCODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_POSTCODE',
        'Updated',
        :old."REP_POSTCODE",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_TEL_NO" != :new."REP_TEL_NO")
    or (:old."REP_TEL_NO" is null and :new."REP_TEL_NO" is not null)
    or (:old."REP_TEL_NO" is not null and :new."REP_TEL_NO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'REP_TEL_NO',
        'Updated',
        :old."REP_TEL_NO",
        :old."WARRANT_ID");
    end if;
    if (:old."RE_ISSUE_DATE" != :new."RE_ISSUE_DATE")
    or (:old."RE_ISSUE_DATE" is null and :new."RE_ISSUE_DATE" is not null)
    or (:old."RE_ISSUE_DATE" is not null and :new."RE_ISSUE_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'RE_ISSUE_DATE',
        'Updated',
        to_char(:old."RE_ISSUE_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."SOLICITOR_COSTS" != :new."SOLICITOR_COSTS")
    or (:old."SOLICITOR_COSTS" is null and :new."SOLICITOR_COSTS" is not null)
    or (:old."SOLICITOR_COSTS" is not null and :new."SOLICITOR_COSTS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'SOLICITOR_COSTS',
        'Updated',
        to_char(:old."SOLICITOR_COSTS"),
        :old."WARRANT_ID");
    end if;
    if (:old."SOLICITOR_COSTS_CURRENCY" != :new."SOLICITOR_COSTS_CURRENCY")
    or (:old."SOLICITOR_COSTS_CURRENCY" is null and :new."SOLICITOR_COSTS_CURRENCY" is not null)
    or (:old."SOLICITOR_COSTS_CURRENCY" is not null and :new."SOLICITOR_COSTS_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'SOLICITOR_COSTS_CURRENCY',
        'Updated',
        :old."SOLICITOR_COSTS_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."TO_TRANSFER" != :new."TO_TRANSFER")
    or (:old."TO_TRANSFER" is null and :new."TO_TRANSFER" is not null)
    or (:old."TO_TRANSFER" is not null and :new."TO_TRANSFER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'TO_TRANSFER',
        'Updated',
        :old."TO_TRANSFER",
        :old."WARRANT_ID");
    end if;
    if (:old."TRANSFER_DATE" != :new."TRANSFER_DATE")
    or (:old."TRANSFER_DATE" is null and :new."TRANSFER_DATE" is not null)
    or (:old."TRANSFER_DATE" is not null and :new."TRANSFER_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'TRANSFER_DATE',
        'Updated',
        to_char(:old."TRANSFER_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_AMOUNT" != :new."WARRANT_AMOUNT")
    or (:old."WARRANT_AMOUNT" is null and :new."WARRANT_AMOUNT" is not null)
    or (:old."WARRANT_AMOUNT" is not null and :new."WARRANT_AMOUNT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_AMOUNT',
        'Updated',
        to_char(:old."WARRANT_AMOUNT"),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_AMOUNT_CURRENCY" != :new."WARRANT_AMOUNT_CURRENCY")
    or (:old."WARRANT_AMOUNT_CURRENCY" is null and :new."WARRANT_AMOUNT_CURRENCY" is not null)
    or (:old."WARRANT_AMOUNT_CURRENCY" is not null and :new."WARRANT_AMOUNT_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_AMOUNT_CURRENCY',
        'Updated',
        :old."WARRANT_AMOUNT_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_FEE" != :new."WARRANT_FEE")
    or (:old."WARRANT_FEE" is null and :new."WARRANT_FEE" is not null)
    or (:old."WARRANT_FEE" is not null and :new."WARRANT_FEE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_FEE',
        'Updated',
        to_char(:old."WARRANT_FEE"),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_FEE_CURRENCY" != :new."WARRANT_FEE_CURRENCY")
    or (:old."WARRANT_FEE_CURRENCY" is null and :new."WARRANT_FEE_CURRENCY" is not null)
    or (:old."WARRANT_FEE_CURRENCY" is not null and :new."WARRANT_FEE_CURRENCY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_FEE_CURRENCY',
        'Updated',
        :old."WARRANT_FEE_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_ID" != :new."WARRANT_ID")
    or (:old."WARRANT_ID" is null and :new."WARRANT_ID" is not null)
    or (:old."WARRANT_ID" is not null and :new."WARRANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_ISSUE_DATE" != :new."WARRANT_ISSUE_DATE")
    or (:old."WARRANT_ISSUE_DATE" is null and :new."WARRANT_ISSUE_DATE" is not null)
    or (:old."WARRANT_ISSUE_DATE" is not null and :new."WARRANT_ISSUE_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_ISSUE_DATE',
        'Updated',
        to_char(:old."WARRANT_ISSUE_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_NUMBER" != :new."WARRANT_NUMBER")
    or (:old."WARRANT_NUMBER" is null and :new."WARRANT_NUMBER" is not null)
    or (:old."WARRANT_NUMBER" is not null and :new."WARRANT_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_NUMBER',
        'Updated',
        :old."WARRANT_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_TYPE" != :new."WARRANT_TYPE")
    or (:old."WARRANT_TYPE" is null and :new."WARRANT_TYPE" is not null)
    or (:old."WARRANT_TYPE" is not null and :new."WARRANT_TYPE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANTS',
        'WARRANT_TYPE',
        'Updated',
        :old."WARRANT_TYPE",
        :old."WARRANT_ID");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'WARRANTS',
      null,
      v_type,
      null,
      nvl(:old."WARRANT_ID",:new."WARRANT_ID"));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_WARRANTS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_WARRANT_RETURNS"
after update or insert or delete on "WARRANT_RETURNS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."ADDITIONAL_INFORMATION" != :new."ADDITIONAL_INFORMATION")
    or (:old."ADDITIONAL_INFORMATION" is null and :new."ADDITIONAL_INFORMATION" is not null)
    or (:old."ADDITIONAL_INFORMATION" is not null and :new."ADDITIONAL_INFORMATION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'ADDITIONAL_INFORMATION',
        'Updated',
        :old."ADDITIONAL_INFORMATION",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."ADMIN_COURT_CODE" != :new."ADMIN_COURT_CODE")
    or (:old."ADMIN_COURT_CODE" is null and :new."ADMIN_COURT_CODE" is not null)
    or (:old."ADMIN_COURT_CODE" is not null and :new."ADMIN_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."APPOINTMENT_DATE" != :new."APPOINTMENT_DATE")
    or (:old."APPOINTMENT_DATE" is null and :new."APPOINTMENT_DATE" is not null)
    or (:old."APPOINTMENT_DATE" is not null and :new."APPOINTMENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'APPOINTMENT_DATE',
        'Updated',
        to_char(:old."APPOINTMENT_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."APPOINTMENT_TIME" != :new."APPOINTMENT_TIME")
    or (:old."APPOINTMENT_TIME" is null and :new."APPOINTMENT_TIME" is not null)
    or (:old."APPOINTMENT_TIME" is not null and :new."APPOINTMENT_TIME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'APPOINTMENT_TIME',
        'Updated',
        :old."APPOINTMENT_TIME",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."CO_EVENT_SEQ" != :new."CO_EVENT_SEQ")
    or (:old."CO_EVENT_SEQ" is null and :new."CO_EVENT_SEQ" is not null)
    or (:old."CO_EVENT_SEQ" is not null and :new."CO_EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'CO_EVENT_SEQ',
        'Updated',
        to_char(:old."CO_EVENT_SEQ"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."CREATED_BY" != :new."CREATED_BY")
    or (:old."CREATED_BY" is null and :new."CREATED_BY" is not null)
    or (:old."CREATED_BY" is not null and :new."CREATED_BY" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'CREATED_BY',
        'Updated',
        :old."CREATED_BY",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."DEFENDANT_ID" != :new."DEFENDANT_ID")
    or (:old."DEFENDANT_ID" is null and :new."DEFENDANT_ID" is not null)
    or (:old."DEFENDANT_ID" is not null and :new."DEFENDANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'DEFENDANT_ID',
        'Updated',
        to_char(:old."DEFENDANT_ID"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."ERROR_INDICATOR" != :new."ERROR_INDICATOR")
    or (:old."ERROR_INDICATOR" is null and :new."ERROR_INDICATOR" is not null)
    or (:old."ERROR_INDICATOR" is not null and :new."ERROR_INDICATOR" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'ERROR_INDICATOR',
        'Updated',
        :old."ERROR_INDICATOR",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."EVENT_SEQ" != :new."EVENT_SEQ")
    or (:old."EVENT_SEQ" is null and :new."EVENT_SEQ" is not null)
    or (:old."EVENT_SEQ" is not null and :new."EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'EVENT_SEQ',
        'Updated',
        to_char(:old."EVENT_SEQ"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."NOTICE_REQUIRED" != :new."NOTICE_REQUIRED")
    or (:old."NOTICE_REQUIRED" is null and :new."NOTICE_REQUIRED" is not null)
    or (:old."NOTICE_REQUIRED" is not null and :new."NOTICE_REQUIRED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'NOTICE_REQUIRED',
        'Updated',
        :old."NOTICE_REQUIRED",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."RECEIPT_DATE" != :new."RECEIPT_DATE")
    or (:old."RECEIPT_DATE" is null and :new."RECEIPT_DATE" is not null)
    or (:old."RECEIPT_DATE" is not null and :new."RECEIPT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."RETURN_CODE" != :new."RETURN_CODE")
    or (:old."RETURN_CODE" is null and :new."RETURN_CODE" is not null)
    or (:old."RETURN_CODE" is not null and :new."RETURN_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'RETURN_CODE',
        'Updated',
        :old."RETURN_CODE",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."RETURN_CODE_COURT_CODE" != :new."RETURN_CODE_COURT_CODE")
    or (:old."RETURN_CODE_COURT_CODE" is null and :new."RETURN_CODE_COURT_CODE" is not null)
    or (:old."RETURN_CODE_COURT_CODE" is not null and :new."RETURN_CODE_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'RETURN_CODE_COURT_CODE',
        'Updated',
        to_char(:old."RETURN_CODE_COURT_CODE"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."TO_TRANSFER" != :new."TO_TRANSFER")
    or (:old."TO_TRANSFER" is null and :new."TO_TRANSFER" is not null)
    or (:old."TO_TRANSFER" is not null and :new."TO_TRANSFER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'TO_TRANSFER',
        'Updated',
        :old."TO_TRANSFER",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."TRANSFER_DATE" != :new."TRANSFER_DATE")
    or (:old."TRANSFER_DATE" is null and :new."TRANSFER_DATE" is not null)
    or (:old."TRANSFER_DATE" is not null and :new."TRANSFER_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'TRANSFER_DATE',
        'Updated',
        to_char(:old."TRANSFER_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."VERIFICATION_DATE" != :new."VERIFICATION_DATE")
    or (:old."VERIFICATION_DATE" is null and :new."VERIFICATION_DATE" is not null)
    or (:old."VERIFICATION_DATE" is not null and :new."VERIFICATION_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'VERIFICATION_DATE',
        'Updated',
        to_char(:old."VERIFICATION_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."WARRANT_ID" != :new."WARRANT_ID")
    or (:old."WARRANT_ID" is null and :new."WARRANT_ID" is not null)
    or (:old."WARRANT_ID" is not null and :new."WARRANT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."WARRANT_RETURNS_ID" != :new."WARRANT_RETURNS_ID")
    or (:old."WARRANT_RETURNS_ID" is null and :new."WARRANT_RETURNS_ID" is not null)
    or (:old."WARRANT_RETURNS_ID" is not null and :new."WARRANT_RETURNS_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'WARRANT_RETURNS_ID',
        'Updated',
        :old."WARRANT_RETURNS_ID",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."WARRANT_RETURN_DATE" != :new."WARRANT_RETURN_DATE")
    or (:old."WARRANT_RETURN_DATE" is null and :new."WARRANT_RETURN_DATE" is not null)
    or (:old."WARRANT_RETURN_DATE" is not null and :new."WARRANT_RETURN_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'WARRANT_RETURN_DATE',
        'Updated',
        to_char(:old."WARRANT_RETURN_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'WARRANT_RETURNS',
      null,
      v_type,
      null,
      nvl(:old."WARRANT_RETURNS_ID",:new."WARRANT_RETURNS_ID"));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_WARRANT_RETURNS" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."AUD_WINDOW_FOR_TRIAL"
after update or insert or delete on "WINDOW_FOR_TRIAL"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
  v_userid := sys_context('sups_app_ctx','app_user_id');
  v_courtid := sys_context('sups_app_ctx','app_court_id');
  v_processid := sys_context('sups_app_ctx','app_process_id');
  if updating
  then
    if (:old."WFT_CASE_MANAGE_CONF_DATE" != :new."WFT_CASE_MANAGE_CONF_DATE")
    or (:old."WFT_CASE_MANAGE_CONF_DATE" is null and :new."WFT_CASE_MANAGE_CONF_DATE" is not null)
    or (:old."WFT_CASE_MANAGE_CONF_DATE" is not null and :new."WFT_CASE_MANAGE_CONF_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_CASE_MANAGE_CONF_DATE',
        'Updated',
        to_char(:old."WFT_CASE_MANAGE_CONF_DATE",'YYYY-MM-DD'),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_CASE_MANAGE_CONF_FLAG" != :new."WFT_CASE_MANAGE_CONF_FLAG")
    or (:old."WFT_CASE_MANAGE_CONF_FLAG" is null and :new."WFT_CASE_MANAGE_CONF_FLAG" is not null)
    or (:old."WFT_CASE_MANAGE_CONF_FLAG" is not null and :new."WFT_CASE_MANAGE_CONF_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_CASE_MANAGE_CONF_FLAG',
        'Updated',
        :old."WFT_CASE_MANAGE_CONF_FLAG",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_CASE_NUMBER" != :new."WFT_CASE_NUMBER")
    or (:old."WFT_CASE_NUMBER" is null and :new."WFT_CASE_NUMBER" is not null)
    or (:old."WFT_CASE_NUMBER" is not null and :new."WFT_CASE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_CASE_NUMBER',
        'Updated',
        :old."WFT_CASE_NUMBER",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_CURRENT_COURT" != :new."WFT_CURRENT_COURT")
    or (:old."WFT_CURRENT_COURT" is null and :new."WFT_CURRENT_COURT" is not null)
    or (:old."WFT_CURRENT_COURT" is not null and :new."WFT_CURRENT_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_CURRENT_COURT',
        'Updated',
        to_char(:old."WFT_CURRENT_COURT"),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_END_DATE" != :new."WFT_END_DATE")
    or (:old."WFT_END_DATE" is null and :new."WFT_END_DATE" is not null)
    or (:old."WFT_END_DATE" is not null and :new."WFT_END_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_END_DATE',
        'Updated',
        to_char(:old."WFT_END_DATE",'YYYY-MM-DD'),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_ESTIMATED_DAYS" != :new."WFT_ESTIMATED_DAYS")
    or (:old."WFT_ESTIMATED_DAYS" is null and :new."WFT_ESTIMATED_DAYS" is not null)
    or (:old."WFT_ESTIMATED_DAYS" is not null and :new."WFT_ESTIMATED_DAYS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_ESTIMATED_DAYS',
        'Updated',
        to_char(:old."WFT_ESTIMATED_DAYS"),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_ESTIMATED_HOURS" != :new."WFT_ESTIMATED_HOURS")
    or (:old."WFT_ESTIMATED_HOURS" is null and :new."WFT_ESTIMATED_HOURS" is not null)
    or (:old."WFT_ESTIMATED_HOURS" is not null and :new."WFT_ESTIMATED_HOURS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_ESTIMATED_HOURS',
        'Updated',
        to_char(:old."WFT_ESTIMATED_HOURS"),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_ESTIMATED_MINS" != :new."WFT_ESTIMATED_MINS")
    or (:old."WFT_ESTIMATED_MINS" is null and :new."WFT_ESTIMATED_MINS" is not null)
    or (:old."WFT_ESTIMATED_MINS" is not null and :new."WFT_ESTIMATED_MINS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_ESTIMATED_MINS',
        'Updated',
        to_char(:old."WFT_ESTIMATED_MINS"),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_EXTRACTED_FOR_DM" != :new."WFT_EXTRACTED_FOR_DM")
    or (:old."WFT_EXTRACTED_FOR_DM" is null and :new."WFT_EXTRACTED_FOR_DM" is not null)
    or (:old."WFT_EXTRACTED_FOR_DM" is not null and :new."WFT_EXTRACTED_FOR_DM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_EXTRACTED_FOR_DM',
        'Updated',
        to_char(:old."WFT_EXTRACTED_FOR_DM",'YYYY-MM-DD'),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_ID" != :new."WFT_ID")
    or (:old."WFT_ID" is null and :new."WFT_ID" is not null)
    or (:old."WFT_ID" is not null and :new."WFT_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_ID',
        'Updated',
        to_char(:old."WFT_ID"),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_JUDGES_NAME" != :new."WFT_JUDGES_NAME")
    or (:old."WFT_JUDGES_NAME" is null and :new."WFT_JUDGES_NAME" is not null)
    or (:old."WFT_JUDGES_NAME" is not null and :new."WFT_JUDGES_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_JUDGES_NAME',
        'Updated',
        :old."WFT_JUDGES_NAME",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_NOTES" != :new."WFT_NOTES")
    or (:old."WFT_NOTES" is null and :new."WFT_NOTES" is not null)
    or (:old."WFT_NOTES" is not null and :new."WFT_NOTES" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_NOTES',
        'Updated',
        :old."WFT_NOTES",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_OLD_OUTCOME_DATE" != :new."WFT_OLD_OUTCOME_DATE")
    or (:old."WFT_OLD_OUTCOME_DATE" is null and :new."WFT_OLD_OUTCOME_DATE" is not null)
    or (:old."WFT_OLD_OUTCOME_DATE" is not null and :new."WFT_OLD_OUTCOME_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_OLD_OUTCOME_DATE',
        'Updated',
        to_char(:old."WFT_OLD_OUTCOME_DATE",'YYYY-MM-DD'),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_OLD_STATUS" != :new."WFT_OLD_STATUS")
    or (:old."WFT_OLD_STATUS" is null and :new."WFT_OLD_STATUS" is not null)
    or (:old."WFT_OLD_STATUS" is not null and :new."WFT_OLD_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_OLD_STATUS',
        'Updated',
        :old."WFT_OLD_STATUS",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_OUTCOME_DATE" != :new."WFT_OUTCOME_DATE")
    or (:old."WFT_OUTCOME_DATE" is null and :new."WFT_OUTCOME_DATE" is not null)
    or (:old."WFT_OUTCOME_DATE" is not null and :new."WFT_OUTCOME_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_OUTCOME_DATE',
        'Updated',
        to_char(:old."WFT_OUTCOME_DATE",'YYYY-MM-DD'),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_PREVIOUS_COURT" != :new."WFT_PREVIOUS_COURT")
    or (:old."WFT_PREVIOUS_COURT" is null and :new."WFT_PREVIOUS_COURT" is not null)
    or (:old."WFT_PREVIOUS_COURT" is not null and :new."WFT_PREVIOUS_COURT" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_PREVIOUS_COURT',
        'Updated',
        to_char(:old."WFT_PREVIOUS_COURT"),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_REASON_FOR_ADJ" != :new."WFT_REASON_FOR_ADJ")
    or (:old."WFT_REASON_FOR_ADJ" is null and :new."WFT_REASON_FOR_ADJ" is not null)
    or (:old."WFT_REASON_FOR_ADJ" is not null and :new."WFT_REASON_FOR_ADJ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_REASON_FOR_ADJ',
        'Updated',
        :old."WFT_REASON_FOR_ADJ",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_START_DATE" != :new."WFT_START_DATE")
    or (:old."WFT_START_DATE" is null and :new."WFT_START_DATE" is not null)
    or (:old."WFT_START_DATE" is not null and :new."WFT_START_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_START_DATE',
        'Updated',
        to_char(:old."WFT_START_DATE",'YYYY-MM-DD'),
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_STATUS" != :new."WFT_STATUS")
    or (:old."WFT_STATUS" is null and :new."WFT_STATUS" is not null)
    or (:old."WFT_STATUS" is not null and :new."WFT_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_STATUS',
        'Updated',
        :old."WFT_STATUS",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
    if (:old."WFT_TRACK" != :new."WFT_TRACK")
    or (:old."WFT_TRACK" is null and :new."WFT_TRACK" is not null)
    or (:old."WFT_TRACK" is not null and :new."WFT_TRACK" is null)
    then
      insert into "SUPS_AMENDMENTS" (
        time_stamp,
        date_of_change,
        court_id,
        user_id,
        process_id,
        table_name,
        column_name,
        amendment_type,
        old_value,
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WINDOW_FOR_TRIAL',
        'WFT_TRACK',
        'Updated',
        :old."WFT_TRACK",
        :old."WFT_CASE_NUMBER",
        to_char(:old."WFT_ID"));
    end if;
  else
    if inserting
    then
      v_type := 'Inserted';
    else
      v_type := 'Deleted';
    end if;
    insert into "SUPS_AMENDMENTS" (
      time_stamp,
      date_of_change,
      court_id,
      user_id,
      process_id,
      table_name,
      column_name,
      amendment_type,
      old_value,
      pk01,
      pk02)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'WINDOW_FOR_TRIAL',
      null,
      v_type,
      null,
      nvl(:old."WFT_CASE_NUMBER",:new."WFT_CASE_NUMBER"),
      to_char(nvl(:old."WFT_ID",:new."WFT_ID")));
  end if;
end;
/
ALTER TRIGGER "CASEMAN"."AUD_WINDOW_FOR_TRIAL" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."MCOL_BAR_JUDGMENT"
AFTER UPDATE ON "CASE_PARTY_ROLES"
FOR EACH ROW
DECLARE

    v_court_code NUMBER(3);
    v_mcol_type VARCHAR2(2);
    v_cred_code NUMBER(4);

BEGIN

    IF updating
    THEN
        -- Determine if the Bar on Judgment has changed
        IF (:OLD."DEFT_BAR_JUDGMENT" != :NEW."DEFT_BAR_JUDGMENT")
        OR (:OLD."DEFT_BAR_JUDGMENT" IS NULL AND :NEW."DEFT_BAR_JUDGMENT" IS NOT NULL)
        OR (:OLD."DEFT_BAR_JUDGMENT" IS NOT NULL AND :NEW."DEFT_BAR_JUDGMENT" IS NULL)
        THEN

            -- Retrieve case owning court for the case in question
            SELECT c.admin_crt_code, c.cred_code
            INTO v_court_code, v_cred_code
            FROM cases c
            WHERE c.case_number = :OLD."CASE_NUMBER";

            IF :OLD."PARTY_ROLE_CODE" = 'DEFENDANT' AND v_court_code = 335 THEN

                -- Determine which MCOL_DATA type code to use
                IF :new."DEFT_BAR_JUDGMENT" = 'Y' THEN
                    v_mcol_type := 'I1';
                ELSE
                    v_mcol_type := 'I0';
                END IF;

                -- Insert MCOL_DATA record
                INSERT INTO mcol_data (
                    claim_number
                    ,deft_id
                    ,type
                    ,event_date
                    ,new_creditor)
                VALUES (
                    :OLD."CASE_NUMBER"
                    ,:OLD."CASE_PARTY_NO"
                    ,v_mcol_type
                    ,TRUNC(SYSDATE)
                    ,v_cred_code
                );

            END IF; -- End if Defendant on CCBC case

        END IF; -- End if DEFT_BAR_JUDGMENT changed

    END IF; -- End if updating

END;

/
ALTER TRIGGER "CASEMAN"."MCOL_BAR_JUDGMENT" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."MCOL_CASE_REASSIGNED"
AFTER UPDATE ON "CASES"
FOR EACH ROW
DECLARE

    v_court_code NUMBER(3);

BEGIN

    IF updating
    THEN
        -- Determine if the Creditor Code has changed
        IF (:OLD."CRED_CODE" != :NEW."CRED_CODE")
        OR (:OLD."CRED_CODE" IS NULL AND :NEW."CRED_CODE" IS NOT NULL)
        OR (:OLD."CRED_CODE" IS NOT NULL AND :NEW."CRED_CODE" IS NULL)
        THEN

            -- Check only CCBC (Non MCOL) Case
            IF :OLD."CRED_CODE" != 1999 AND :NEW."CRED_CODE" != 1999 AND :OLD."ADMIN_CRT_CODE" = 335 THEN

                -- Insert MCOL_DATA record
                INSERT INTO mcol_data (
                    claim_number
                    ,type
                    ,event_date
                    ,previous_creditor
                    ,new_creditor)
                VALUES (
                    :OLD."CASE_NUMBER"
                    ,'OC'
                    ,TRUNC(SYSDATE)
                    ,:OLD."CRED_CODE"
                    ,:NEW."CRED_CODE"
                );

            END IF; -- End if CCBC case

        END IF; -- End if CRED_CODE changed

    END IF; -- End if updating

END;

/
ALTER TRIGGER "CASEMAN"."MCOL_CASE_REASSIGNED" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."MCOL_CASE_STATUS_RESET"
AFTER UPDATE ON "CASES"
FOR EACH ROW
DECLARE

    v_court_code NUMBER(3);
    v_mcol_type  VARCHAR2(2);

BEGIN

    IF updating
    THEN
        -- Determine if the Case status has been changed to NULL
        IF :OLD."STATUS" IS NOT NULL AND :NEW."STATUS" IS NULL
        THEN

            -- Check a CCBC owned Case (regardless of Creditor Code)
            IF :OLD."ADMIN_CRT_CODE" = 335 THEN

                v_mcol_type := 'XX';

                IF :OLD."STATUS" = 'WITHDRAWN' THEN
                    v_mcol_type := 'H0';
                END IF;

                IF :OLD."STATUS" = 'SETTLED' THEN
                    v_mcol_type := 'H0';
                END IF;

                IF :OLD."STATUS" = 'WRITTEN OFF' THEN
                    v_mcol_type := 'B0';
                END IF;

                IF :OLD."STATUS" = 'DISCONTINUED' THEN
                    v_mcol_type := 'B0';
                END IF;

                IF :OLD."STATUS" = 'STRUCK OUT' THEN
                    v_mcol_type := 'K0';
                END IF;

                IF :OLD."STATUS" = 'SETTLED/WDRN' THEN
                    v_mcol_type := 'B0';
                END IF;

                IF :OLD."STATUS" = 'PAID' THEN
                    v_mcol_type := 'M0';
                END IF;

                IF v_mcol_type != 'XX' THEN

                    -- Case changed from an MCOL-related status to NULL
                    -- Insert MCOL_DATA record
                    INSERT INTO mcol_data (
                        claim_number
                        ,type
                        ,event_date
                        ,new_creditor)
                    VALUES (
                        :OLD."CASE_NUMBER"
                        ,v_mcol_type
                        ,TRUNC(SYSDATE)
                        ,:OLD."CRED_CODE"
                    );

                END IF; -- End if Case changed from a MCOL-related status to NULL

            END IF; -- End if CCBC owned case

        END IF; -- End if STATUS changed from NOT NULL to NULL

    END IF; -- End if updating

END;

/
ALTER TRIGGER "CASEMAN"."MCOL_CASE_STATUS_RESET" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."MCOL_NEW_CREDITOR"
BEFORE INSERT ON "MCOL_DATA"
FOR EACH ROW
DECLARE

    v_cred_code NUMBER(4);

BEGIN

    IF inserting
    THEN
        -- Determine if the creditor column is blank
        IF ( NVL(:OLD."NEW_CREDITOR",:NEW."NEW_CREDITOR") IS NULL )
        THEN

            -- Retrieve the creditor code
            SELECT c.cred_code
            INTO v_cred_code
            FROM cases c
            WHERE c.case_number = NVL(:OLD."CLAIM_NUMBER",:NEW."CLAIM_NUMBER");

            :NEW."NEW_CREDITOR" := v_cred_code;

        END IF; -- End Determine if the creditor column is blank

    END IF; -- End if inserting

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        :NEW."NEW_CREDITOR" := :OLD."NEW_CREDITOR";
    WHEN OTHERS THEN
        :NEW."NEW_CREDITOR" := :OLD."NEW_CREDITOR";

END;

/
ALTER TRIGGER "CASEMAN"."MCOL_NEW_CREDITOR" ENABLE;



  CREATE OR REPLACE TRIGGER "CASEMAN"."SET_STATUSES"
after insert on case_events
for each row
DECLARE
v_userid VARCHAR2(16);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN
    insert into CASE_EVENT_INSTIGATORS
    (EVENT_SEQ, CASE_NUMBER, CASE_PARTY_NO, PARTY_ROLE_CODE, DELETE_FLAG)
    values
    (:new.EVENT_SEQ, :new.CASE_NUMBER, 1, 'CLAIMANT', 'N');
  IF :new.std_event_id = 74 THEN
    IF :new.case_party_no IS NOT NULL THEN
        IF ccbc_statuses.discon_flag = 'Y' THEN
            ccbc_statuses.discon_flag := 'N';
            ccbc_statuses.case_status_dbp('SETTLED/WDRN', :new.case_number);
        END IF;
        ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'Y');
        INSERT INTO MCOL_DATA
            (CLAIM_NUMBER, TYPE, EVENT_DATE, DEFT_ID)
        VALUES
            (:new.case_number,'DI', sysdate, :new.case_party_no);
    ELSE
        ccbc_statuses.case_status_dbp('SETTLED/WDRN', :new.case_number);
        ccbc_statuses.bar_judg_all_dbp(:new.case_number, 'Y');
        INSERT INTO MCOL_DATA
            (CLAIM_NUMBER, TYPE, EVENT_DATE)
        VALUES
            (:new.case_number,'DI', sysdate);
    END IF;
  ELSIF :new.std_event_id in (73, 76) THEN
    IF :new.case_party_no IS NOT NULL THEN
        IF ccbc_statuses.settled_flag = 'Y' THEN
            ccbc_statuses.settled_flag := 'N';
            ccbc_statuses.case_status_dbp('SETTLED', :new.case_number);
        END IF;
        ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'Y');
        INSERT INTO MCOL_DATA
            (CLAIM_NUMBER, TYPE, EVENT_DATE, DEFT_ID)
        VALUES
            (:new.case_number,'WD', sysdate, :new.case_party_no);
    ELSE
        ccbc_statuses.case_status_dbp('SETTLED', :new.case_number);
        ccbc_statuses.bar_judg_all_dbp(:new.case_number, 'Y');
        INSERT INTO MCOL_DATA
            (CLAIM_NUMBER, TYPE, EVENT_DATE)
        VALUES
            (:new.case_number,'WD', sysdate);
    END IF;
  ELSIF :new.std_event_id = 160 THEN
    -- BIF Change lifts bar on Judgements
    ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'N');
  ELSIF :new.std_event_id in (752, 754) THEN
    ccbc_statuses.case_status_dbp('STAYED', :new.case_number);
  ELSIF :new.std_event_id = 756 THEN
    ccbc_statuses.case_status_dbp('', :new.case_number);
  ELSIF :new.std_event_id IN ( 50, 52, 60) THEN
    -- set the bar for these events submitted via MCOL
    ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'Y');
  END IF;
END IF;
END;

/
ALTER TRIGGER "CASEMAN"."SET_STATUSES" ENABLE;


