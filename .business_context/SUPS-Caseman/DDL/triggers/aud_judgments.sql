Prompt Trigger AUD_JUDGMENTS;
--
-- AUD_JUDGMENTS  (Trigger) 
--
--  Dependencies: 
--   JUDGMENTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_JUDGMENTS"
after update or insert or delete on "JUDGMENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table JUDGMENTS                                        */
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
SHOW ERRORS;


