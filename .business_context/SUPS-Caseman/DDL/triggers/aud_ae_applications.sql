Prompt Trigger AUD_AE_APPLICATIONS;
--
-- AUD_AE_APPLICATIONS  (Trigger) 
--
--  Dependencies: 
--   AE_APPLICATIONS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_AE_APPLICATIONS"
after update or insert or delete on "AE_APPLICATIONS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table AE_APPLICATIONS                                  */
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
SHOW ERRORS;


