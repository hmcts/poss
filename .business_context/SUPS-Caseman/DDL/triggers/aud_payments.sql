Prompt Trigger AUD_PAYMENTS;
--
-- AUD_PAYMENTS  (Trigger) 
--
--  Dependencies: 
--   PAYMENTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_PAYMENTS"
after update or insert or delete on "PAYMENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table PAYMENTS                                         */
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
SHOW ERRORS;


