Prompt Trigger AUD_CO_EVENTS;
--
-- AUD_CO_EVENTS  (Trigger) 
--
--  Dependencies: 
--   CO_EVENTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_CO_EVENTS"
after update or insert or delete on "CO_EVENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CO_EVENTS                                        */
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
        'CO_EVENTS',
        'AGE_CATEGORY',
        'Updated',
        :old."AGE_CATEGORY",
        to_char(:old."CO_EVENT_SEQ"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'ALD_DEBT_SEQ',
        'Updated',
        to_char(:old."ALD_DEBT_SEQ"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."BAILIFF_IDENTIFIER" != :new."BAILIFF_IDENTIFIER")
    or (:old."BAILIFF_IDENTIFIER" is null and :new."BAILIFF_IDENTIFIER" is not null)
    or (:old."BAILIFF_IDENTIFIER" is not null and :new."BAILIFF_IDENTIFIER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'BAILIFF_IDENTIFIER',
        'Updated',
        to_char(:old."BAILIFF_IDENTIFIER"),
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'BMS_TASK_NUMBER',
        'Updated',
        :old."BMS_TASK_NUMBER",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."CO_EVENT_SEQ" != :new."CO_EVENT_SEQ")
    or (:old."CO_EVENT_SEQ" is null and :new."CO_EVENT_SEQ" is not null)
    or (:old."CO_EVENT_SEQ" is not null and :new."CO_EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'CO_EVENT_SEQ',
        'Updated',
        to_char(:old."CO_EVENT_SEQ"),
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'CREATING_COURT',
        'Updated',
        to_char(:old."CREATING_COURT"),
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'CREATING_SECTION',
        'Updated',
        :old."CREATING_SECTION",
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'DATE_TO_RTL',
        'Updated',
        to_char(:old."DATE_TO_RTL",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'DETAILS',
        'Updated',
        :old."DETAILS",
        to_char(:old."CO_EVENT_SEQ"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CO_EVENTS',
        'ERROR_INDICATOR',
        'Updated',
        :old."ERROR_INDICATOR",
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'EVENT_DATE',
        'Updated',
        to_char(:old."EVENT_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'HRG_SEQ',
        'Updated',
        to_char(:old."HRG_SEQ"),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."ISSUE_STAGE" != :new."ISSUE_STAGE")
    or (:old."ISSUE_STAGE" is null and :new."ISSUE_STAGE" is not null)
    or (:old."ISSUE_STAGE" is not null and :new."ISSUE_STAGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'ISSUE_STAGE',
        'Updated',
        :old."ISSUE_STAGE",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."PROCESS_DATE" != :new."PROCESS_DATE")
    or (:old."PROCESS_DATE" is null and :new."PROCESS_DATE" is not null)
    or (:old."PROCESS_DATE" is not null and :new."PROCESS_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'PROCESS_DATE',
        'Updated',
        to_char(:old."PROCESS_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."PROCESS_STAGE" != :new."PROCESS_STAGE")
    or (:old."PROCESS_STAGE" is null and :new."PROCESS_STAGE" is not null)
    or (:old."PROCESS_STAGE" is not null and :new."PROCESS_STAGE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'PROCESS_STAGE',
        'Updated',
        :old."PROCESS_STAGE",
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_1" != :new."REPORT_VALUE_1")
    or (:old."REPORT_VALUE_1" is null and :new."REPORT_VALUE_1" is not null)
    or (:old."REPORT_VALUE_1" is not null and :new."REPORT_VALUE_1" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'REPORT_VALUE_1',
        'Updated',
        :old."REPORT_VALUE_1",
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."SERVICE_DATE" != :new."SERVICE_DATE")
    or (:old."SERVICE_DATE" is null and :new."SERVICE_DATE" is not null)
    or (:old."SERVICE_DATE" is not null and :new."SERVICE_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'SERVICE_DATE',
        'Updated',
        to_char(:old."SERVICE_DATE",'YYYY-MM-DD'),
        to_char(:old."CO_EVENT_SEQ"));
    end if;
    if (:old."SERVICE_STATUS" != :new."SERVICE_STATUS")
    or (:old."SERVICE_STATUS" is null and :new."SERVICE_STATUS" is not null)
    or (:old."SERVICE_STATUS" is not null and :new."SERVICE_STATUS" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'CO_EVENTS',
        'SERVICE_STATUS',
        'Updated',
        :old."SERVICE_STATUS",
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'STATS_MODULE',
        'Updated',
        :old."STATS_MODULE",
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'STD_EVENT_ID',
        'Updated',
        to_char(:old."STD_EVENT_ID"),
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'USERNAME',
        'Updated',
        :old."USERNAME",
        to_char(:old."CO_EVENT_SEQ"));
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
        'CO_EVENTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        to_char(:old."CO_EVENT_SEQ"));
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
      'CO_EVENTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."CO_EVENT_SEQ",:new."CO_EVENT_SEQ")));
  end if;
end;
/
SHOW ERRORS;


