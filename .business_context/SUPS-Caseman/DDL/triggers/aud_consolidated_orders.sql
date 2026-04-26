Prompt Trigger AUD_CONSOLIDATED_ORDERS;
--
-- AUD_CONSOLIDATED_ORDERS  (Trigger) 
--
--  Dependencies: 
--   CONSOLIDATED_ORDERS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_CONSOLIDATED_ORDERS"
after update or insert or delete on "CONSOLIDATED_ORDERS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CONSOLIDATED_ORDERS                              */
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
SHOW ERRORS;


