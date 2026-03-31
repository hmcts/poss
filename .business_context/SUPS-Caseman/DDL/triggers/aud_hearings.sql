Prompt Trigger AUD_HEARINGS;
--
-- AUD_HEARINGS  (Trigger) 
--
--  Dependencies: 
--   HEARINGS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_HEARINGS"
after update or insert or delete on "HEARINGS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table HEARINGS                                         */
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
SHOW ERRORS;


