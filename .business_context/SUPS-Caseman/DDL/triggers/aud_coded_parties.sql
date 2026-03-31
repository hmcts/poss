Prompt Trigger AUD_CODED_PARTIES;
--
-- AUD_CODED_PARTIES  (Trigger) 
--
--  Dependencies: 
--   CODED_PARTIES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_CODED_PARTIES"
after update or insert or delete on "CODED_PARTIES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CODED_PARTIES                                    */
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
    if (:old."ADDRESS_LINE1" != :new."ADDRESS_LINE1")
    or (:old."ADDRESS_LINE1" is null and :new."ADDRESS_LINE1" is not null)
    or (:old."ADDRESS_LINE1" is not null and :new."ADDRESS_LINE1" is null)
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
        'CODED_PARTIES',
        'ADDRESS_LINE1',
        'Updated',
        :old."ADDRESS_LINE1",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE2" != :new."ADDRESS_LINE2")
    or (:old."ADDRESS_LINE2" is null and :new."ADDRESS_LINE2" is not null)
    or (:old."ADDRESS_LINE2" is not null and :new."ADDRESS_LINE2" is null)
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
        'CODED_PARTIES',
        'ADDRESS_LINE2',
        'Updated',
        :old."ADDRESS_LINE2",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE3" != :new."ADDRESS_LINE3")
    or (:old."ADDRESS_LINE3" is null and :new."ADDRESS_LINE3" is not null)
    or (:old."ADDRESS_LINE3" is not null and :new."ADDRESS_LINE3" is null)
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
        'CODED_PARTIES',
        'ADDRESS_LINE3',
        'Updated',
        :old."ADDRESS_LINE3",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE4" != :new."ADDRESS_LINE4")
    or (:old."ADDRESS_LINE4" is null and :new."ADDRESS_LINE4" is not null)
    or (:old."ADDRESS_LINE4" is not null and :new."ADDRESS_LINE4" is null)
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
        'CODED_PARTIES',
        'ADDRESS_LINE4',
        'Updated',
        :old."ADDRESS_LINE4",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."ADDRESS_LINE5" != :new."ADDRESS_LINE5")
    or (:old."ADDRESS_LINE5" is null and :new."ADDRESS_LINE5" is not null)
    or (:old."ADDRESS_LINE5" is not null and :new."ADDRESS_LINE5" is null)
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
        'CODED_PARTIES',
        'ADDRESS_LINE5',
        'Updated',
        :old."ADDRESS_LINE5",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
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
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."CASCADE_UPDATE_FLAG" != :new."CASCADE_UPDATE_FLAG")
    or (:old."CASCADE_UPDATE_FLAG" is null and :new."CASCADE_UPDATE_FLAG" is not null)
    or (:old."CASCADE_UPDATE_FLAG" is not null and :new."CASCADE_UPDATE_FLAG" is null)
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
        'CODED_PARTIES',
        'CASCADE_UPDATE_FLAG',
        'Updated',
        :old."CASCADE_UPDATE_FLAG",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."CODE" != :new."CODE")
    or (:old."CODE" is null and :new."CODE" is not null)
    or (:old."CODE" is not null and :new."CODE" is null)
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
        'CODED_PARTIES',
        'CODE',
        'Updated',
        to_char(:old."CODE"),
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
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
        pk01,
        pk02)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CODED_PARTIES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PERSON_REQUESTED_NAME" != :new."PERSON_REQUESTED_NAME")
    or (:old."PERSON_REQUESTED_NAME" is null and :new."PERSON_REQUESTED_NAME" is not null)
    or (:old."PERSON_REQUESTED_NAME" is not null and :new."PERSON_REQUESTED_NAME" is null)
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
        'CODED_PARTIES',
        'PERSON_REQUESTED_NAME',
        'Updated',
        :old."PERSON_REQUESTED_NAME",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."POSTCODE" != :new."POSTCODE")
    or (:old."POSTCODE" is null and :new."POSTCODE" is not null)
    or (:old."POSTCODE" is not null and :new."POSTCODE" is null)
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
        'CODED_PARTIES',
        'POSTCODE',
        'Updated',
        :old."POSTCODE",
        to_char(:old."CODE"),
        to_char(:old."ADMIN_COURT_CODE"));
    end if;
    if (:old."PTY_TYPE" != :new."PTY_TYPE")
    or (:old."PTY_TYPE" is null and :new."PTY_TYPE" is not null)
    or (:old."PTY_TYPE" is not null and :new."PTY_TYPE" is null)
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
        'CODED_PARTIES',
        'PTY_TYPE',
        'Updated',
        :old."PTY_TYPE",
        to_char(:old."CODE"),
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
      'CODED_PARTIES',
      null,
      v_type,
      null,
      to_char(nvl(:old."CODE",:new."CODE")),
      to_char(nvl(:old."ADMIN_COURT_CODE",:new."ADMIN_COURT_CODE")));
  end if;
end;
/
SHOW ERRORS;


