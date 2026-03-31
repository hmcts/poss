Prompt Trigger AUD_DCA_USER;
--
-- AUD_DCA_USER  (Trigger) 
--
--  Dependencies: 
--   DCA_USER (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_DCA_USER"
after update or insert or delete on "DCA_USER"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table DCA_USER                                         */
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
    if (:old."ACCESS_SECURITY_LEVEL" != :new."ACCESS_SECURITY_LEVEL")
    or (:old."ACCESS_SECURITY_LEVEL" is null and :new."ACCESS_SECURITY_LEVEL" is not null)
    or (:old."ACCESS_SECURITY_LEVEL" is not null and :new."ACCESS_SECURITY_LEVEL" is null)
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
        'DCA_USER',
        'ACCESS_SECURITY_LEVEL',
        'Updated',
        to_char(:old."ACCESS_SECURITY_LEVEL"),
        :old."USER_ID");
    end if;
    if (:old."ACTIVE_USER_FLAG" != :new."ACTIVE_USER_FLAG")
    or (:old."ACTIVE_USER_FLAG" is null and :new."ACTIVE_USER_FLAG" is not null)
    or (:old."ACTIVE_USER_FLAG" is not null and :new."ACTIVE_USER_FLAG" is null)
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
        'DCA_USER',
        'ACTIVE_USER_FLAG',
        'Updated',
        :old."ACTIVE_USER_FLAG",
        :old."USER_ID");
    end if;
    if (:old."EXTENSION" != :new."EXTENSION")
    or (:old."EXTENSION" is null and :new."EXTENSION" is not null)
    or (:old."EXTENSION" is not null and :new."EXTENSION" is null)
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
        'DCA_USER',
        'EXTENSION',
        'Updated',
        :old."EXTENSION",
        :old."USER_ID");
    end if;
    if (:old."FORENAMES" != :new."FORENAMES")
    or (:old."FORENAMES" is null and :new."FORENAMES" is not null)
    or (:old."FORENAMES" is not null and :new."FORENAMES" is null)
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
        'DCA_USER',
        'FORENAMES',
        'Updated',
        :old."FORENAMES",
        :old."USER_ID");
    end if;
    if (:old."JOB_TITLE" != :new."JOB_TITLE")
    or (:old."JOB_TITLE" is null and :new."JOB_TITLE" is not null)
    or (:old."JOB_TITLE" is not null and :new."JOB_TITLE" is null)
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
        'DCA_USER',
        'JOB_TITLE',
        'Updated',
        :old."JOB_TITLE",
        :old."USER_ID");
    end if;
    if (:old."SECTION_FOR_PRINTOUTS" != :new."SECTION_FOR_PRINTOUTS")
    or (:old."SECTION_FOR_PRINTOUTS" is null and :new."SECTION_FOR_PRINTOUTS" is not null)
    or (:old."SECTION_FOR_PRINTOUTS" is not null and :new."SECTION_FOR_PRINTOUTS" is null)
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
        'DCA_USER',
        'SECTION_FOR_PRINTOUTS',
        'Updated',
        :old."SECTION_FOR_PRINTOUTS",
        :old."USER_ID");
    end if;
    if (:old."SURNAME" != :new."SURNAME")
    or (:old."SURNAME" is null and :new."SURNAME" is not null)
    or (:old."SURNAME" is not null and :new."SURNAME" is null)
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
        'DCA_USER',
        'SURNAME',
        'Updated',
        :old."SURNAME",
        :old."USER_ID");
    end if;
    if (:old."TITLE" != :new."TITLE")
    or (:old."TITLE" is null and :new."TITLE" is not null)
    or (:old."TITLE" is not null and :new."TITLE" is null)
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
        'DCA_USER',
        'TITLE',
        'Updated',
        :old."TITLE",
        :old."USER_ID");
    end if;
    if (:old."USER_DEFAULT_PRINTER" != :new."USER_DEFAULT_PRINTER")
    or (:old."USER_DEFAULT_PRINTER" is null and :new."USER_DEFAULT_PRINTER" is not null)
    or (:old."USER_DEFAULT_PRINTER" is not null and :new."USER_DEFAULT_PRINTER" is null)
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
        'DCA_USER',
        'USER_DEFAULT_PRINTER',
        'Updated',
        :old."USER_DEFAULT_PRINTER",
        :old."USER_ID");
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'DCA_USER',
        'USER_ID',
        'Updated',
        :old."USER_ID",
        :old."USER_ID");
    end if;
    if (:old."USER_SHORT_NAME" != :new."USER_SHORT_NAME")
    or (:old."USER_SHORT_NAME" is null and :new."USER_SHORT_NAME" is not null)
    or (:old."USER_SHORT_NAME" is not null and :new."USER_SHORT_NAME" is null)
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
        'DCA_USER',
        'USER_SHORT_NAME',
        'Updated',
        :old."USER_SHORT_NAME",
        :old."USER_ID");
    end if;
    if (:old."USER_STYLE_PROFILE" != :new."USER_STYLE_PROFILE")
    or (:old."USER_STYLE_PROFILE" is null and :new."USER_STYLE_PROFILE" is not null)
    or (:old."USER_STYLE_PROFILE" is not null and :new."USER_STYLE_PROFILE" is null)
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
        'DCA_USER',
        'USER_STYLE_PROFILE',
        'Updated',
        :old."USER_STYLE_PROFILE",
        :old."USER_ID");
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
      'DCA_USER',
      null,
      v_type,
      null,
      nvl(:old."USER_ID",:new."USER_ID"));
  end if;
end;
/
SHOW ERRORS;


