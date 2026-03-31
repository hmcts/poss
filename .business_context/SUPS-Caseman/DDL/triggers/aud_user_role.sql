Prompt Trigger AUD_USER_ROLE;
--
-- AUD_USER_ROLE  (Trigger) 
--
--  Dependencies: 
--   USER_ROLE (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_USER_ROLE"
after update or insert or delete on "USER_ROLE"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
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
        'USER_ROLE',
        'COURT_CODE',
        'Updated',
        to_char(:old."COURT_CODE"),
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
    if (:old."ROLE_ID" != :new."ROLE_ID")
    or (:old."ROLE_ID" is null and :new."ROLE_ID" is not null)
    or (:old."ROLE_ID" is not null and :new."ROLE_ID" is null)
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
        'USER_ROLE',
        'ROLE_ID',
        'Updated',
        :old."ROLE_ID",
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
        'USER_ROLE',
        'USER_ID',
        'Updated',
        :old."USER_ID",
        :old."USER_ID",
        to_char(:old."COURT_CODE"));
    end if;
  elsif (inserting and :new."ROLE_ID" = 'admin')
    then
        v_type := 'Inserted';
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
          'USER_ROLE',
          'ROLE_ID',
          v_type,
          null,
          nvl(:old."USER_ID",:new."USER_ID"),
          to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
  elsif (deleting and :old."ROLE_ID" = 'admin')
    then
        v_type := 'Deleted';
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
          'USER_ROLE',
          'ROLE_ID',
          v_type,
          'admin',
          nvl(:old."USER_ID",:new."USER_ID"),
          to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
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
      'USER_ROLE',
      null,
      v_type,
      null,
      nvl(:old."USER_ID",:new."USER_ID"),
      to_char(nvl(:old."COURT_CODE",:new."COURT_CODE")));
  end if;
end;
/
SHOW ERRORS;


