Prompt Trigger AUD_PARTY_ROLES;
--
-- AUD_PARTY_ROLES  (Trigger) 
--
--  Dependencies: 
--   PARTY_ROLES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_PARTY_ROLES"
after update or insert or delete on "PARTY_ROLES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table PARTY_ROLES                                      */
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
        'PARTY_ROLES',
        'PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_ROLE_CODE",
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PARTY_ROLE_DESCRIPTION" != :new."PARTY_ROLE_DESCRIPTION")
    or (:old."PARTY_ROLE_DESCRIPTION" is null and :new."PARTY_ROLE_DESCRIPTION" is not null)
    or (:old."PARTY_ROLE_DESCRIPTION" is not null and :new."PARTY_ROLE_DESCRIPTION" is null)
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
        'PARTY_ROLES',
        'PARTY_ROLE_DESCRIPTION',
        'Updated',
        :old."PARTY_ROLE_DESCRIPTION",
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."REPORTING_ROLE_CODE" != :new."REPORTING_ROLE_CODE")
    or (:old."REPORTING_ROLE_CODE" is null and :new."REPORTING_ROLE_CODE" is not null)
    or (:old."REPORTING_ROLE_CODE" is not null and :new."REPORTING_ROLE_CODE" is null)
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
        'PARTY_ROLES',
        'REPORTING_ROLE_CODE',
        'Updated',
        :old."REPORTING_ROLE_CODE",
        :old."PARTY_ROLE_CODE");
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
      'PARTY_ROLES',
      null,
      v_type,
      null,
      nvl(:old."PARTY_ROLE_CODE",:new."PARTY_ROLE_CODE"));
  end if;
end;
/
SHOW ERRORS;


