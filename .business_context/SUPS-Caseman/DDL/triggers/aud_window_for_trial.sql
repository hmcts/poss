Prompt Trigger AUD_WINDOW_FOR_TRIAL;
--
-- AUD_WINDOW_FOR_TRIAL  (Trigger) 
--
--  Dependencies: 
--   WINDOW_FOR_TRIAL (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_WINDOW_FOR_TRIAL"
after update or insert or delete on "WINDOW_FOR_TRIAL"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table WINDOW_FOR_TRIAL                                 */
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
SHOW ERRORS;


