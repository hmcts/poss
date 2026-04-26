Prompt Trigger AUD_AE_EVENTS;
--
-- AUD_AE_EVENTS  (Trigger) 
--
--  Dependencies: 
--   AE_EVENTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_AE_EVENTS"
after update or insert or delete on "AE_EVENTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table AE_EVENTS                                        */
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'AE_EVENT_SEQ',
        'Updated',
        to_char(:old."AE_EVENT_SEQ"),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."AE_NUMBER" != :new."AE_NUMBER")
    or (:old."AE_NUMBER" is null and :new."AE_NUMBER" is not null)
    or (:old."AE_NUMBER" is not null and :new."AE_NUMBER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'AE_NUMBER',
        'Updated',
        :old."AE_NUMBER",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'BAILIFF_IDENTIFIER',
        'Updated',
        to_char(:old."BAILIFF_IDENTIFIER"),
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."CASE_EVENT_SEQ" != :new."CASE_EVENT_SEQ")
    or (:old."CASE_EVENT_SEQ" is null and :new."CASE_EVENT_SEQ" is not null)
    or (:old."CASE_EVENT_SEQ" is not null and :new."CASE_EVENT_SEQ" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'CASE_EVENT_SEQ',
        'Updated',
        to_char(:old."CASE_EVENT_SEQ"),
        to_char(:old."AE_EVENT_SEQ"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'AE_EVENTS',
        'DATE_ENTERED',
        'Updated',
        to_char(:old."DATE_ENTERED",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'DETAILS',
        'Updated',
        :old."DETAILS",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'ERROR_INDICATOR',
        'Updated',
        :old."ERROR_INDICATOR",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'EVENT_DATE',
        'Updated',
        to_char(:old."EVENT_DATE",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'HRG_SEQ',
        'Updated',
        to_char(:old."HRG_SEQ"),
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'ISSUE_STAGE',
        'Updated',
        :old."ISSUE_STAGE",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'PROCESS_DATE',
        'Updated',
        to_char(:old."PROCESS_DATE",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'PROCESS_STAGE',
        'Updated',
        :old."PROCESS_STAGE",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'REPORT_VALUE_1',
        'Updated',
        :old."REPORT_VALUE_1",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_10" != :new."REPORT_VALUE_10")
    or (:old."REPORT_VALUE_10" is null and :new."REPORT_VALUE_10" is not null)
    or (:old."REPORT_VALUE_10" is not null and :new."REPORT_VALUE_10" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_10',
        'Updated',
        :old."REPORT_VALUE_10",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_11" != :new."REPORT_VALUE_11")
    or (:old."REPORT_VALUE_11" is null and :new."REPORT_VALUE_11" is not null)
    or (:old."REPORT_VALUE_11" is not null and :new."REPORT_VALUE_11" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_11',
        'Updated',
        :old."REPORT_VALUE_11",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_12" != :new."REPORT_VALUE_12")
    or (:old."REPORT_VALUE_12" is null and :new."REPORT_VALUE_12" is not null)
    or (:old."REPORT_VALUE_12" is not null and :new."REPORT_VALUE_12" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_12',
        'Updated',
        :old."REPORT_VALUE_12",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_13" != :new."REPORT_VALUE_13")
    or (:old."REPORT_VALUE_13" is null and :new."REPORT_VALUE_13" is not null)
    or (:old."REPORT_VALUE_13" is not null and :new."REPORT_VALUE_13" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_13',
        'Updated',
        :old."REPORT_VALUE_13",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_14" != :new."REPORT_VALUE_14")
    or (:old."REPORT_VALUE_14" is null and :new."REPORT_VALUE_14" is not null)
    or (:old."REPORT_VALUE_14" is not null and :new."REPORT_VALUE_14" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_14',
        'Updated',
        :old."REPORT_VALUE_14",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_2" != :new."REPORT_VALUE_2")
    or (:old."REPORT_VALUE_2" is null and :new."REPORT_VALUE_2" is not null)
    or (:old."REPORT_VALUE_2" is not null and :new."REPORT_VALUE_2" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_2',
        'Updated',
        :old."REPORT_VALUE_2",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_3" != :new."REPORT_VALUE_3")
    or (:old."REPORT_VALUE_3" is null and :new."REPORT_VALUE_3" is not null)
    or (:old."REPORT_VALUE_3" is not null and :new."REPORT_VALUE_3" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_3',
        'Updated',
        :old."REPORT_VALUE_3",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_4" != :new."REPORT_VALUE_4")
    or (:old."REPORT_VALUE_4" is null and :new."REPORT_VALUE_4" is not null)
    or (:old."REPORT_VALUE_4" is not null and :new."REPORT_VALUE_4" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_4',
        'Updated',
        :old."REPORT_VALUE_4",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_5" != :new."REPORT_VALUE_5")
    or (:old."REPORT_VALUE_5" is null and :new."REPORT_VALUE_5" is not null)
    or (:old."REPORT_VALUE_5" is not null and :new."REPORT_VALUE_5" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_5',
        'Updated',
        :old."REPORT_VALUE_5",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_6" != :new."REPORT_VALUE_6")
    or (:old."REPORT_VALUE_6" is null and :new."REPORT_VALUE_6" is not null)
    or (:old."REPORT_VALUE_6" is not null and :new."REPORT_VALUE_6" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_6',
        'Updated',
        :old."REPORT_VALUE_6",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_7" != :new."REPORT_VALUE_7")
    or (:old."REPORT_VALUE_7" is null and :new."REPORT_VALUE_7" is not null)
    or (:old."REPORT_VALUE_7" is not null and :new."REPORT_VALUE_7" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_7',
        'Updated',
        :old."REPORT_VALUE_7",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_8" != :new."REPORT_VALUE_8")
    or (:old."REPORT_VALUE_8" is null and :new."REPORT_VALUE_8" is not null)
    or (:old."REPORT_VALUE_8" is not null and :new."REPORT_VALUE_8" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_8',
        'Updated',
        :old."REPORT_VALUE_8",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
    if (:old."REPORT_VALUE_9" != :new."REPORT_VALUE_9")
    or (:old."REPORT_VALUE_9" is null and :new."REPORT_VALUE_9" is not null)
    or (:old."REPORT_VALUE_9" is not null and :new."REPORT_VALUE_9" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'REPORT_VALUE_9',
        'Updated',
        :old."REPORT_VALUE_9",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'SERVICE_DATE',
        'Updated',
        to_char(:old."SERVICE_DATE",'YYYY-MM-DD'),
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'SERVICE_STATUS',
        'Updated',
        :old."SERVICE_STATUS",
        to_char(:old."AE_EVENT_SEQ"));
    end if;
	if (:old."SOD_REFERENCE" != :new."SOD_REFERENCE")
    or (:old."SOD_REFERENCE" is null and :new."SOD_REFERENCE" is not null)
    or (:old."SOD_REFERENCE" is not null and :new."SOD_REFERENCE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'AE_EVENTS',
        'SOD_REFERENCE',
        'Updated',
        :old."SOD_REFERENCE",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'STD_EVENT_ID',
        'Updated',
        to_char(:old."STD_EVENT_ID"),
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'USERNAME',
        'Updated',
        :old."USERNAME",
        to_char(:old."AE_EVENT_SEQ"));
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
        'AE_EVENTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        to_char(:old."AE_EVENT_SEQ"));
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
      'AE_EVENTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."AE_EVENT_SEQ",:new."AE_EVENT_SEQ")));
  end if;
end;
/
SHOW ERRORS;


