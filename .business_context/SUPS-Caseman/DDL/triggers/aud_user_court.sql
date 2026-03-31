Prompt Trigger AUD_USER_COURT;
--
-- AUD_USER_COURT  (Trigger) 
--
--  Dependencies: 
--   USER_COURT (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_USER_COURT"
after update or insert or delete on "USER_COURT"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table USER_COURT                                       */
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
    if (:old."COURT_CODE" != :new."COURT_CODE")
    or (:old."COURT_CODE" is null and :new."COURT_CODE" is not null)
    or (:old."COURT_CODE" is not null and :new."COURT_CODE" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'USER_COURT',
        'COURT_CODE',
        'Updated',
        to_char(:old."COURT_CODE"),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."DATE_FROM" != :new."DATE_FROM")
    or (:old."DATE_FROM" is null and :new."DATE_FROM" is not null)
    or (:old."DATE_FROM" is not null and :new."DATE_FROM" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'USER_COURT',
        'DATE_FROM',
        'Updated',
        to_char(:old."DATE_FROM",'YYYY-MM-DD'),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."DATE_TO" != :new."DATE_TO")
    or (:old."DATE_TO" is null and :new."DATE_TO" is not null)
    or (:old."DATE_TO" is not null and :new."DATE_TO" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'USER_COURT',
        'DATE_TO',
        'Updated',
        to_char(:old."DATE_TO",'YYYY-MM-DD'),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."HOME_FLAG" != :new."HOME_FLAG")
    or (:old."HOME_FLAG" is null and :new."HOME_FLAG" is not null)
    or (:old."HOME_FLAG" is not null and :new."HOME_FLAG" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'USER_COURT',
        'HOME_FLAG',
        'Updated',
        :old."HOME_FLAG",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."SECTION_NAME" != :new."SECTION_NAME")
    or (:old."SECTION_NAME" is null and :new."SECTION_NAME" is not null)
    or (:old."SECTION_NAME" is not null and :new."SECTION_NAME" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'USER_COURT',
        'SECTION_NAME',
        'Updated',
        :old."SECTION_NAME",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."USER_ID" != :new."USER_ID")
    or (:old."USER_ID" is null and :new."USER_ID" is not null)
    or (:old."USER_ID" is not null and :new."USER_ID" is null)
    then
      insert into "SUPS_AMENDMENTS" (
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
        'USER_COURT',
        'USER_ID',
        'Updated',
        :old."USER_ID",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
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
      'USER_COURT',
      null,
      v_type,
      null,
      nvl(:old."USER_ID",:new."USER_ID"),
      to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
  end if;
end;
/
SHOW ERRORS;


