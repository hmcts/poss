Prompt Trigger AUD_CASE_PARTY_ROLES;
--
-- AUD_CASE_PARTY_ROLES  (Trigger) 
--
--  Dependencies: 
--   CASE_PARTY_ROLES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_CASE_PARTY_ROLES"
after update or insert or delete on "CASE_PARTY_ROLES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CASE_PARTY_ROLES                                 */
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
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
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
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'CASE_PARTY_NO',
        'Updated',
        to_char(:old."CASE_PARTY_NO"),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_BAR_JUDGMENT" != :new."DEFT_BAR_JUDGMENT")
    or (:old."DEFT_BAR_JUDGMENT" is null and :new."DEFT_BAR_JUDGMENT" is not null)
    or (:old."DEFT_BAR_JUDGMENT" is not null and :new."DEFT_BAR_JUDGMENT" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_BAR_JUDGMENT',
        'Updated',
        :old."DEFT_BAR_JUDGMENT",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_DATE_OF_SERVICE" != :new."DEFT_DATE_OF_SERVICE")
    or (:old."DEFT_DATE_OF_SERVICE" is null and :new."DEFT_DATE_OF_SERVICE" is not null)
    or (:old."DEFT_DATE_OF_SERVICE" is not null and :new."DEFT_DATE_OF_SERVICE" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_DATE_OF_SERVICE',
        'Updated',
        to_char(:old."DEFT_DATE_OF_SERVICE",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_DATE_OF_SERVICE_RO" != :new."DEFT_DATE_OF_SERVICE_RO")
    or (:old."DEFT_DATE_OF_SERVICE_RO" is null and :new."DEFT_DATE_OF_SERVICE_RO" is not null)
    or (:old."DEFT_DATE_OF_SERVICE_RO" is not null and :new."DEFT_DATE_OF_SERVICE_RO" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_DATE_OF_SERVICE_RO',
        'Updated',
        to_char(:old."DEFT_DATE_OF_SERVICE_RO",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_LAST_DATE_FOR_REPLY" != :new."DEFT_LAST_DATE_FOR_REPLY")
    or (:old."DEFT_LAST_DATE_FOR_REPLY" is null and :new."DEFT_LAST_DATE_FOR_REPLY" is not null)
    or (:old."DEFT_LAST_DATE_FOR_REPLY" is not null and :new."DEFT_LAST_DATE_FOR_REPLY" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_LAST_DATE_FOR_REPLY',
        'Updated',
        to_char(:old."DEFT_LAST_DATE_FOR_REPLY",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_MCOL_PASSWORD" != :new."DEFT_MCOL_PASSWORD")
    or (:old."DEFT_MCOL_PASSWORD" is null and :new."DEFT_MCOL_PASSWORD" is not null)
    or (:old."DEFT_MCOL_PASSWORD" is not null and :new."DEFT_MCOL_PASSWORD" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_MCOL_PASSWORD',
        'Updated',
        :old."DEFT_MCOL_PASSWORD",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."DEFT_METHOD_OF_SERVICE" != :new."DEFT_METHOD_OF_SERVICE")
    or (:old."DEFT_METHOD_OF_SERVICE" is null and :new."DEFT_METHOD_OF_SERVICE" is not null)
    or (:old."DEFT_METHOD_OF_SERVICE" is not null and :new."DEFT_METHOD_OF_SERVICE" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'DEFT_METHOD_OF_SERVICE',
        'Updated',
        :old."DEFT_METHOD_OF_SERVICE",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."LAST_DATE_FOR_SERVICE" != :new."LAST_DATE_FOR_SERVICE")
    or (:old."LAST_DATE_FOR_SERVICE" is null and :new."LAST_DATE_FOR_SERVICE" is not null)
    or (:old."LAST_DATE_FOR_SERVICE" is not null and :new."LAST_DATE_FOR_SERVICE" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'LAST_DATE_FOR_SERVICE',
        'Updated',
        to_char(:old."LAST_DATE_FOR_SERVICE",'YYYY-MM-DD'),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
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
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
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
        pk01,
        pk02,
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_ROLE_CODE",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PAYEE_FLAG" != :new."PAYEE_FLAG")
    or (:old."PAYEE_FLAG" is null and :new."PAYEE_FLAG" is not null)
    or (:old."PAYEE_FLAG" is not null and :new."PAYEE_FLAG" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PAYEE_FLAG',
        'Updated',
        :old."PAYEE_FLAG",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."PREFERRED_COMMUNICATION_METHOD" != :new."PREFERRED_COMMUNICATION_METHOD")
    or (:old."PREFERRED_COMMUNICATION_METHOD" is null and :new."PREFERRED_COMMUNICATION_METHOD" is not null)
    or (:old."PREFERRED_COMMUNICATION_METHOD" is not null and :new."PREFERRED_COMMUNICATION_METHOD" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'PREFERRED_COMMUNICATION_METHOD',
        'Updated',
        :old."PREFERRED_COMMUNICATION_METHOD",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."REFERENCE" != :new."REFERENCE")
    or (:old."REFERENCE" is null and :new."REFERENCE" is not null)
    or (:old."REFERENCE" is not null and :new."REFERENCE" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'REFERENCE',
        'Updated',
        :old."REFERENCE",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
    if (:old."WELSH_INDICATOR" != :new."WELSH_INDICATOR")
    or (:old."WELSH_INDICATOR" is null and :new."WELSH_INDICATOR" is not null)
    or (:old."WELSH_INDICATOR" is not null and :new."WELSH_INDICATOR" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'WELSH_INDICATOR',
        'Updated',
        :old."WELSH_INDICATOR",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
	if (:old."MEDIATION_NAME" != :new."MEDIATION_NAME")
    or (:old."MEDIATION_NAME" is null and :new."MEDIATION_NAME" is not null)
    or (:old."MEDIATION_NAME" is not null and :new."MEDIATION_NAME" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_NAME',
        'Updated',
        :old."MEDIATION_NAME",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
	if (:old."MEDIATION_TEL_NO" != :new."MEDIATION_TEL_NO")
    or (:old."MEDIATION_TEL_NO" is null and :new."MEDIATION_TEL_NO" is not null)
    or (:old."MEDIATION_TEL_NO" is not null and :new."MEDIATION_TEL_NO" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_TEL_NO',
        'Updated',
        :old."MEDIATION_TEL_NO",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
	if (:old."MEDIATION_EMAIL" != :new."MEDIATION_EMAIL")
    or (:old."MEDIATION_EMAIL" is null and :new."MEDIATION_EMAIL" is not null)
    or (:old."MEDIATION_EMAIL" is not null and :new."MEDIATION_EMAIL" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_EMAIL',
        'Updated',
        :old."MEDIATION_EMAIL",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
	if (:old."MEDIATION_AVAILABILITY" != :new."MEDIATION_AVAILABILITY")
    or (:old."MEDIATION_AVAILABILITY" is null and :new."MEDIATION_AVAILABILITY" is not null)
    or (:old."MEDIATION_AVAILABILITY" is not null and :new."MEDIATION_AVAILABILITY" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_AVAILABILITY',
        'Updated',
        :old."MEDIATION_AVAILABILITY",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
	if (:old."MEDIATION_NOTES" != :new."MEDIATION_NOTES")
    or (:old."MEDIATION_NOTES" is null and :new."MEDIATION_NOTES" is not null)
    or (:old."MEDIATION_NOTES" is not null and :new."MEDIATION_NOTES" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'MEDIATION_NOTES',
        'Updated',
        :old."MEDIATION_NOTES",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
        :old."PARTY_ROLE_CODE");
    end if;
	if (:old."CONFIDENTIAL" != :new."CONFIDENTIAL")
    or (:old."CONFIDENTIAL" is null and :new."CONFIDENTIAL" is not null)
    or (:old."CONFIDENTIAL" is not null and :new."CONFIDENTIAL" is null)
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
        pk03)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'CASE_PARTY_ROLES',
        'CONFIDENTIAL',
        'Updated',
        :old."CONFIDENTIAL",
        :old."CASE_NUMBER",
        to_char(:old."CASE_PARTY_NO"),
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
      pk01,
      pk02,
      pk03)
    values (
      systimestamp,
      trunc(sysdate),
      v_courtid,
      v_userid,
      v_processid,
      'CASE_PARTY_ROLES',
      null,
      v_type,
      null,
      nvl(:old."CASE_NUMBER",:new."CASE_NUMBER"),
      to_char(nvl(:old."CASE_PARTY_NO",:new."CASE_PARTY_NO")),
      nvl(:old."PARTY_ROLE_CODE",:new."PARTY_ROLE_CODE"));
  end if;
end;
/
SHOW ERRORS;


