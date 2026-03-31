Prompt Trigger AUD_OBLIGATIONS;
--
-- AUD_OBLIGATIONS  (Trigger) 
--
--  Dependencies: 
--   OBLIGATIONS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_OBLIGATIONS"
after update or insert or delete on "OBLIGATIONS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table OBLIGATIONS                                      */
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
SHOW ERRORS;


