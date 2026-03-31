Prompt Trigger AUD_PAYEES;
--
-- AUD_PAYEES  (Trigger) 
--
--  Dependencies: 
--   PAYEES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_PAYEES"
after update or insert or delete on "PAYEES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table PAYEES                                           */
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
SHOW ERRORS;


