Prompt Trigger AUD_PARTIES;
--
-- AUD_PARTIES  (Trigger) 
--
--  Dependencies: 
--   PARTIES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_PARTIES"
after update or insert or delete on "PARTIES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table PARTIES                                          */
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
    if (:old."AUTHENTICATION_PASSWORD" != :new."AUTHENTICATION_PASSWORD")
    or (:old."AUTHENTICATION_PASSWORD" is null and :new."AUTHENTICATION_PASSWORD" is not null)
    or (:old."AUTHENTICATION_PASSWORD" is not null and :new."AUTHENTICATION_PASSWORD" is null)
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
        'PARTIES',
        'AUTHENTICATION_PASSWORD',
        'Updated',
        :old."AUTHENTICATION_PASSWORD",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."AUTHENTICATION_PIN" != :new."AUTHENTICATION_PIN")
    or (:old."AUTHENTICATION_PIN" is null and :new."AUTHENTICATION_PIN" is not null)
    or (:old."AUTHENTICATION_PIN" is not null and :new."AUTHENTICATION_PIN" is null)
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
        'PARTIES',
        'AUTHENTICATION_PIN',
        'Updated',
        to_char(:old."AUTHENTICATION_PIN"),
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."COMPANY_NAME" != :new."COMPANY_NAME")
    or (:old."COMPANY_NAME" is null and :new."COMPANY_NAME" is not null)
    or (:old."COMPANY_NAME" is not null and :new."COMPANY_NAME" is null)
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
        'PARTIES',
        'COMPANY_NAME',
        'Updated',
        :old."COMPANY_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."DX_NUMBER" != :new."DX_NUMBER")
    or (:old."DX_NUMBER" is null and :new."DX_NUMBER" is not null)
    or (:old."DX_NUMBER" is not null and :new."DX_NUMBER" is null)
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
        'PARTIES',
        'DX_NUMBER',
        'Updated',
        :old."DX_NUMBER",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."EMAIL_ADDRESS" != :new."EMAIL_ADDRESS")
    or (:old."EMAIL_ADDRESS" is null and :new."EMAIL_ADDRESS" is not null)
    or (:old."EMAIL_ADDRESS" is not null and :new."EMAIL_ADDRESS" is null)
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
        'PARTIES',
        'EMAIL_ADDRESS',
        'Updated',
        :old."EMAIL_ADDRESS",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."ETHNIC_ORIGIN_CODE" != :new."ETHNIC_ORIGIN_CODE")
    or (:old."ETHNIC_ORIGIN_CODE" is null and :new."ETHNIC_ORIGIN_CODE" is not null)
    or (:old."ETHNIC_ORIGIN_CODE" is not null and :new."ETHNIC_ORIGIN_CODE" is null)
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
        'PARTIES',
        'ETHNIC_ORIGIN_CODE',
        'Updated',
        :old."ETHNIC_ORIGIN_CODE",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."FAX_NUMBER" != :new."FAX_NUMBER")
    or (:old."FAX_NUMBER" is null and :new."FAX_NUMBER" is not null)
    or (:old."FAX_NUMBER" is not null and :new."FAX_NUMBER" is null)
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
        'PARTIES',
        'FAX_NUMBER',
        'Updated',
        :old."FAX_NUMBER",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."GENDER" != :new."GENDER")
    or (:old."GENDER" is null and :new."GENDER" is not null)
    or (:old."GENDER" is not null and :new."GENDER" is null)
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
        'PARTIES',
        'GENDER',
        'Updated',
        to_char(:old."GENDER"),
        to_char(:old."PARTY_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PARTY_TYPE_CODE" != :new."PARTY_TYPE_CODE")
    or (:old."PARTY_TYPE_CODE" is null and :new."PARTY_TYPE_CODE" is not null)
    or (:old."PARTY_TYPE_CODE" is not null and :new."PARTY_TYPE_CODE" is null)
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
        'PARTIES',
        'PARTY_TYPE_CODE',
        'Updated',
        :old."PARTY_TYPE_CODE",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_DOB" != :new."PERSON_DOB")
    or (:old."PERSON_DOB" is null and :new."PERSON_DOB" is not null)
    or (:old."PERSON_DOB" is not null and :new."PERSON_DOB" is null)
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
        'PARTIES',
        'PERSON_DOB',
        'Updated',
        to_char(:old."PERSON_DOB",'YYYY-MM-DD'),
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_FAMILY_NAME" != :new."PERSON_FAMILY_NAME")
    or (:old."PERSON_FAMILY_NAME" is null and :new."PERSON_FAMILY_NAME" is not null)
    or (:old."PERSON_FAMILY_NAME" is not null and :new."PERSON_FAMILY_NAME" is null)
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
        'PARTIES',
        'PERSON_FAMILY_NAME',
        'Updated',
        :old."PERSON_FAMILY_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_GIVEN_FIRST_NAME" != :new."PERSON_GIVEN_FIRST_NAME")
    or (:old."PERSON_GIVEN_FIRST_NAME" is null and :new."PERSON_GIVEN_FIRST_NAME" is not null)
    or (:old."PERSON_GIVEN_FIRST_NAME" is not null and :new."PERSON_GIVEN_FIRST_NAME" is null)
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
        'PARTIES',
        'PERSON_GIVEN_FIRST_NAME',
        'Updated',
        :old."PERSON_GIVEN_FIRST_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_GIVEN_SECOND_NAME" != :new."PERSON_GIVEN_SECOND_NAME")
    or (:old."PERSON_GIVEN_SECOND_NAME" is null and :new."PERSON_GIVEN_SECOND_NAME" is not null)
    or (:old."PERSON_GIVEN_SECOND_NAME" is not null and :new."PERSON_GIVEN_SECOND_NAME" is null)
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
        'PARTIES',
        'PERSON_GIVEN_SECOND_NAME',
        'Updated',
        :old."PERSON_GIVEN_SECOND_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_GIVEN_THIRD_NAME" != :new."PERSON_GIVEN_THIRD_NAME")
    or (:old."PERSON_GIVEN_THIRD_NAME" is null and :new."PERSON_GIVEN_THIRD_NAME" is not null)
    or (:old."PERSON_GIVEN_THIRD_NAME" is not null and :new."PERSON_GIVEN_THIRD_NAME" is null)
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
        'PARTIES',
        'PERSON_GIVEN_THIRD_NAME',
        'Updated',
        :old."PERSON_GIVEN_THIRD_NAME",
        to_char(:old."PARTY_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PERSON_REQUESTED_NAME',
        'Updated',
        :old."PERSON_REQUESTED_NAME",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."PERSON_TITLE" != :new."PERSON_TITLE")
    or (:old."PERSON_TITLE" is null and :new."PERSON_TITLE" is not null)
    or (:old."PERSON_TITLE" is not null and :new."PERSON_TITLE" is null)
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
        'PARTIES',
        'PERSON_TITLE',
        'Updated',
        :old."PERSON_TITLE",
        to_char(:old."PARTY_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'PREFERRED_COMMUNICATION_METHOD',
        'Updated',
        :old."PREFERRED_COMMUNICATION_METHOD",
        to_char(:old."PARTY_ID"));
    end if;
    if (:old."TEL_NO" != :new."TEL_NO")
    or (:old."TEL_NO" is null and :new."TEL_NO" is not null)
    or (:old."TEL_NO" is not null and :new."TEL_NO" is null)
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
        'PARTIES',
        'TEL_NO',
        'Updated',
        :old."TEL_NO",
        to_char(:old."PARTY_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'PARTIES',
        'WELSH_INDICATOR',
        'Updated',
        :old."WELSH_INDICATOR",
        to_char(:old."PARTY_ID"));
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
      'PARTIES',
      null,
      v_type,
      null,
      to_char(nvl(:old."PARTY_ID",:new."PARTY_ID")));
  end if;
end;
/
SHOW ERRORS;


