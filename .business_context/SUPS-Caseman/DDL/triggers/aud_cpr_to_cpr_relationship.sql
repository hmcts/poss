Prompt Trigger AUD_CPR_TO_CPR_RELATIONSHIP;
--
-- AUD_CPR_TO_CPR_RELATIONSHIP  (Trigger) 
--
--  Dependencies: 
--   CPR_TO_CPR_RELATIONSHIP (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_CPR_TO_CPR_RELATIONSHIP"
after update or insert or delete on "CPR_TO_CPR_RELATIONSHIP"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CPR_TO_CPR_RELATIONSHIP                          */
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
    if (:old."CPR_A_CASE_NUMBER" != :new."CPR_A_CASE_NUMBER")
    or (:old."CPR_A_CASE_NUMBER" is null and :new."CPR_A_CASE_NUMBER" is not null)
    or (:old."CPR_A_CASE_NUMBER" is not null and :new."CPR_A_CASE_NUMBER" is null)
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
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_A_CASE_NUMBER',
        'Updated',
        :old."CPR_A_CASE_NUMBER",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_A_CASE_PARTY_NO" != :new."CPR_A_CASE_PARTY_NO")
    or (:old."CPR_A_CASE_PARTY_NO" is null and :new."CPR_A_CASE_PARTY_NO" is not null)
    or (:old."CPR_A_CASE_PARTY_NO" is not null and :new."CPR_A_CASE_PARTY_NO" is null)
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
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_A_CASE_PARTY_NO',
        'Updated',
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_A_PARTY_ROLE_CODE" != :new."CPR_A_PARTY_ROLE_CODE")
    or (:old."CPR_A_PARTY_ROLE_CODE" is null and :new."CPR_A_PARTY_ROLE_CODE" is not null)
    or (:old."CPR_A_PARTY_ROLE_CODE" is not null and :new."CPR_A_PARTY_ROLE_CODE" is null)
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
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_A_PARTY_ROLE_CODE',
        'Updated',
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_B_CASE_NUMBER" != :new."CPR_B_CASE_NUMBER")
    or (:old."CPR_B_CASE_NUMBER" is null and :new."CPR_B_CASE_NUMBER" is not null)
    or (:old."CPR_B_CASE_NUMBER" is not null and :new."CPR_B_CASE_NUMBER" is null)
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
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_B_CASE_NUMBER',
        'Updated',
        :old."CPR_B_CASE_NUMBER",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_B_CASE_PARTY_NO" != :new."CPR_B_CASE_PARTY_NO")
    or (:old."CPR_B_CASE_PARTY_NO" is null and :new."CPR_B_CASE_PARTY_NO" is not null)
    or (:old."CPR_B_CASE_PARTY_NO" is not null and :new."CPR_B_CASE_PARTY_NO" is null)
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
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_B_CASE_PARTY_NO',
        'Updated',
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."CPR_B_PARTY_ROLE_CODE" != :new."CPR_B_PARTY_ROLE_CODE")
    or (:old."CPR_B_PARTY_ROLE_CODE" is null and :new."CPR_B_PARTY_ROLE_CODE" is not null)
    or (:old."CPR_B_PARTY_ROLE_CODE" is not null and :new."CPR_B_PARTY_ROLE_CODE" is null)
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
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'CPR_B_PARTY_ROLE_CODE',
        'Updated',
        :old."CPR_B_PARTY_ROLE_CODE",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
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
        pk01,
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'DELETED_FLAG',
        'Updated',
        :old."DELETED_FLAG",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
    end if;
    if (:old."PERSONAL_REFERENCE" != :new."PERSONAL_REFERENCE")
    or (:old."PERSONAL_REFERENCE" is null and :new."PERSONAL_REFERENCE" is not null)
    or (:old."PERSONAL_REFERENCE" is not null and :new."PERSONAL_REFERENCE" is null)
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
        pk02,
        pk03,
        pk04,
        pk05,
        pk06)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CPR_TO_CPR_RELATIONSHIP',
        'PERSONAL_REFERENCE',
        'Updated',
        :old."PERSONAL_REFERENCE",
        :old."CPR_A_CASE_NUMBER",
        to_char(:old."CPR_A_CASE_PARTY_NO"),
        :old."CPR_A_PARTY_ROLE_CODE",
        :old."CPR_B_CASE_NUMBER",
        to_char(:old."CPR_B_CASE_PARTY_NO"),
        :old."CPR_B_PARTY_ROLE_CODE");
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
      pk02,
      pk03,
      pk04,
      pk05,
      pk06)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CPR_TO_CPR_RELATIONSHIP',
      null,
      v_type,
      null,
      nvl(:old."CPR_A_CASE_NUMBER",:new."CPR_A_CASE_NUMBER"),
      to_char(nvl(:old."CPR_A_CASE_PARTY_NO",:new."CPR_A_CASE_PARTY_NO")),
      nvl(:old."CPR_A_PARTY_ROLE_CODE",:new."CPR_A_PARTY_ROLE_CODE"),
      nvl(:old."CPR_B_CASE_NUMBER",:new."CPR_B_CASE_NUMBER"),
      to_char(nvl(:old."CPR_B_CASE_PARTY_NO",:new."CPR_B_CASE_PARTY_NO")),
      nvl(:old."CPR_B_PARTY_ROLE_CODE",:new."CPR_B_PARTY_ROLE_CODE"));
  end if;
end;
/
SHOW ERRORS;


