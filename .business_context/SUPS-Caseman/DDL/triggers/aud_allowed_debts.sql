Prompt Trigger AUD_ALLOWED_DEBTS;
--
-- AUD_ALLOWED_DEBTS  (Trigger) 
--
--  Dependencies: 
--   ALLOWED_DEBTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_ALLOWED_DEBTS"
after update or insert or delete on "ALLOWED_DEBTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table ALLOWED_DEBTS                                    */
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
SHOW ERRORS;


