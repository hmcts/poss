Prompt Trigger AUD_WARRANT_RETURNS;
--
-- AUD_WARRANT_RETURNS  (Trigger) 
--
--  Dependencies: 
--   WARRANT_RETURNS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_WARRANT_RETURNS"
after update or insert or delete on "WARRANT_RETURNS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table WARRANT_RETURNS                                  */
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
    if (:old."ADDITIONAL_INFORMATION" != :new."ADDITIONAL_INFORMATION")
    or (:old."ADDITIONAL_INFORMATION" is null and :new."ADDITIONAL_INFORMATION" is not null)
    or (:old."ADDITIONAL_INFORMATION" is not null and :new."ADDITIONAL_INFORMATION" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'ADDITIONAL_INFORMATION',
        'Updated',
        :old."ADDITIONAL_INFORMATION",
        :old."WARRANT_RETURNS_ID");
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
        'WARRANT_RETURNS',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."APPOINTMENT_DATE" != :new."APPOINTMENT_DATE")
    or (:old."APPOINTMENT_DATE" is null and :new."APPOINTMENT_DATE" is not null)
    or (:old."APPOINTMENT_DATE" is not null and :new."APPOINTMENT_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'APPOINTMENT_DATE',
        'Updated',
        to_char(:old."APPOINTMENT_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."APPOINTMENT_TIME" != :new."APPOINTMENT_TIME")
    or (:old."APPOINTMENT_TIME" is null and :new."APPOINTMENT_TIME" is not null)
    or (:old."APPOINTMENT_TIME" is not null and :new."APPOINTMENT_TIME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'APPOINTMENT_TIME',
        'Updated',
        :old."APPOINTMENT_TIME",
        :old."WARRANT_RETURNS_ID");
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
        'WARRANT_RETURNS',
        'CO_EVENT_SEQ',
        'Updated',
        to_char(:old."CO_EVENT_SEQ"),
        :old."WARRANT_RETURNS_ID");
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'CREATED_BY',
        'Updated',
        :old."CREATED_BY",
        :old."WARRANT_RETURNS_ID");
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'DEFENDANT_ID',
        'Updated',
        to_char(:old."DEFENDANT_ID"),
        :old."WARRANT_RETURNS_ID");
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
        'WARRANT_RETURNS',
        'ERROR_INDICATOR',
        'Updated',
        :old."ERROR_INDICATOR",
        :old."WARRANT_RETURNS_ID");
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
        'WARRANT_RETURNS',
        'EVENT_SEQ',
        'Updated',
        to_char(:old."EVENT_SEQ"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."NOTICE_REQUIRED" != :new."NOTICE_REQUIRED")
    or (:old."NOTICE_REQUIRED" is null and :new."NOTICE_REQUIRED" is not null)
    or (:old."NOTICE_REQUIRED" is not null and :new."NOTICE_REQUIRED" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'NOTICE_REQUIRED',
        'Updated',
        :old."NOTICE_REQUIRED",
        :old."WARRANT_RETURNS_ID");
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
        'WARRANT_RETURNS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."RETURN_CODE" != :new."RETURN_CODE")
    or (:old."RETURN_CODE" is null and :new."RETURN_CODE" is not null)
    or (:old."RETURN_CODE" is not null and :new."RETURN_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'RETURN_CODE',
        'Updated',
        :old."RETURN_CODE",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."RETURN_CODE_COURT_CODE" != :new."RETURN_CODE_COURT_CODE")
    or (:old."RETURN_CODE_COURT_CODE" is null and :new."RETURN_CODE_COURT_CODE" is not null)
    or (:old."RETURN_CODE_COURT_CODE" is not null and :new."RETURN_CODE_COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'RETURN_CODE_COURT_CODE',
        'Updated',
        to_char(:old."RETURN_CODE_COURT_CODE"),
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."TO_TRANSFER" != :new."TO_TRANSFER")
    or (:old."TO_TRANSFER" is null and :new."TO_TRANSFER" is not null)
    or (:old."TO_TRANSFER" is not null and :new."TO_TRANSFER" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'TO_TRANSFER',
        'Updated',
        :old."TO_TRANSFER",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."TRANSFER_DATE" != :new."TRANSFER_DATE")
    or (:old."TRANSFER_DATE" is null and :new."TRANSFER_DATE" is not null)
    or (:old."TRANSFER_DATE" is not null and :new."TRANSFER_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'TRANSFER_DATE',
        'Updated',
        to_char(:old."TRANSFER_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'WARRANT_RETURNS',
        'VERIFICATION_DATE',
        'Updated',
        to_char(:old."VERIFICATION_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
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
        'WARRANT_RETURNS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."WARRANT_RETURNS_ID" != :new."WARRANT_RETURNS_ID")
    or (:old."WARRANT_RETURNS_ID" is null and :new."WARRANT_RETURNS_ID" is not null)
    or (:old."WARRANT_RETURNS_ID" is not null and :new."WARRANT_RETURNS_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'WARRANT_RETURNS_ID',
        'Updated',
        :old."WARRANT_RETURNS_ID",
        :old."WARRANT_RETURNS_ID");
    end if;
    if (:old."WARRANT_RETURN_DATE" != :new."WARRANT_RETURN_DATE")
    or (:old."WARRANT_RETURN_DATE" is null and :new."WARRANT_RETURN_DATE" is not null)
    or (:old."WARRANT_RETURN_DATE" is not null and :new."WARRANT_RETURN_DATE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'WARRANT_RETURNS',
        'WARRANT_RETURN_DATE',
        'Updated',
        to_char(:old."WARRANT_RETURN_DATE",'YYYY-MM-DD'),
        :old."WARRANT_RETURNS_ID");
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
      'WARRANT_RETURNS',
      null,
      v_type,
      null,
      nvl(:old."WARRANT_RETURNS_ID",:new."WARRANT_RETURNS_ID"));
  end if;
end;
/
SHOW ERRORS;


