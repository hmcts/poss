Prompt Trigger AUD_CASE_EVENTS;
--
-- AUD_CASE_EVENTS  (Trigger) 
--
--  Dependencies: 
--   CASE_EVENTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_CASE_EVENTS"
after update or insert or delete on "CASE_EVENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CASE_EVENTS                                      */
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
SHOW ERRORS;


