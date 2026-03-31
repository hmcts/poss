Prompt Trigger AUD_GIVEN_ADDRESSES;
--
-- AUD_GIVEN_ADDRESSES  (Trigger) 
--
--  Dependencies: 
--   GIVEN_ADDRESSES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_GIVEN_ADDRESSES"
after update or insert or delete on "GIVEN_ADDRESSES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table GIVEN_ADDRESSES                                  */
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
    if (:old."ADDRESS_ID" != :new."ADDRESS_ID")
    or (:old."ADDRESS_ID" is null and :new."ADDRESS_ID" is not null)
    or (:old."ADDRESS_ID" is not null and :new."ADDRESS_ID" is null)
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
        'GIVEN_ADDRESSES',
        'ADDRESS_ID',
        'Updated',
        to_char(:old."ADDRESS_ID"),
        to_char(:old."ADDRESS_ID"));
    end if;
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE1',
        'Updated',
        :old."ADDRESS_LINE1",
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE2',
        'Updated',
        :old."ADDRESS_LINE2",
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE3',
        'Updated',
        :old."ADDRESS_LINE3",
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE4',
        'Updated',
        :old."ADDRESS_LINE4",
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'ADDRESS_LINE5',
        'Updated',
        :old."ADDRESS_LINE5",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDRESS_TYPE_CODE" != :new."ADDRESS_TYPE_CODE")
    or (:old."ADDRESS_TYPE_CODE" is null and :new."ADDRESS_TYPE_CODE" is not null)
    or (:old."ADDRESS_TYPE_CODE" is not null and :new."ADDRESS_TYPE_CODE" is null)
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
        'GIVEN_ADDRESSES',
        'ADDRESS_TYPE_CODE',
        'Updated',
        :old."ADDRESS_TYPE_CODE",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ADDR_TYPE_SEQ" != :new."ADDR_TYPE_SEQ")
    or (:old."ADDR_TYPE_SEQ" is null and :new."ADDR_TYPE_SEQ" is not null)
    or (:old."ADDR_TYPE_SEQ" is not null and :new."ADDR_TYPE_SEQ" is null)
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
        'GIVEN_ADDRESSES',
        'ADDR_TYPE_SEQ',
        'Updated',
        to_char(:old."ADDR_TYPE_SEQ"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."ALD_SEQ" != :new."ALD_SEQ")
    or (:old."ALD_SEQ" is null and :new."ALD_SEQ" is not null)
    or (:old."ALD_SEQ" is not null and :new."ALD_SEQ" is null)
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
        'GIVEN_ADDRESSES',
        'ALD_SEQ',
        'Updated',
        to_char(:old."ALD_SEQ"),
        to_char(:old."ADDRESS_ID"));
    end if;
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'CASE_PARTY_NO',
        'Updated',
        to_char(:old."CASE_PARTY_NO"),
        to_char(:old."ADDRESS_ID"));
    end if;
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'COURT_CODE',
        'Updated',
        to_char(:old."COURT_CODE"),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."CO_NUMBER" != :new."CO_NUMBER")
    or (:old."CO_NUMBER" is null and :new."CO_NUMBER" is not null)
    or (:old."CO_NUMBER" is not null and :new."CO_NUMBER" is null)
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
        'GIVEN_ADDRESSES',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        to_char(:old."ADDRESS_ID"));
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
        'GIVEN_ADDRESSES',
        'PARTY_ID',
        'Updated',
        to_char(:old."PARTY_ID"),
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'PARTY_ROLE_CODE',
        'Updated',
        :old."PARTY_ROLE_CODE",
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'POSTCODE',
        'Updated',
        :old."POSTCODE",
        to_char(:old."ADDRESS_ID"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'GIVEN_ADDRESSES',
        'REFERENCE',
        'Updated',
        :old."REFERENCE",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."UPDATED_BY" != :new."UPDATED_BY")
    or (:old."UPDATED_BY" is null and :new."UPDATED_BY" is not null)
    or (:old."UPDATED_BY" is not null and :new."UPDATED_BY" is null)
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
        'GIVEN_ADDRESSES',
        'UPDATED_BY',
        'Updated',
        :old."UPDATED_BY",
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."VALID_FROM" != :new."VALID_FROM")
    or (:old."VALID_FROM" is null and :new."VALID_FROM" is not null)
    or (:old."VALID_FROM" is not null and :new."VALID_FROM" is null)
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
        'GIVEN_ADDRESSES',
        'VALID_FROM',
        'Updated',
        to_char(:old."VALID_FROM",'YYYY-MM-DD'),
        to_char(:old."ADDRESS_ID"));
    end if;
    if (:old."VALID_TO" != :new."VALID_TO")
    or (:old."VALID_TO" is null and :new."VALID_TO" is not null)
    or (:old."VALID_TO" is not null and :new."VALID_TO" is null)
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
        'GIVEN_ADDRESSES',
        'VALID_TO',
        'Updated',
        to_char(:old."VALID_TO",'YYYY-MM-DD'),
        to_char(:old."ADDRESS_ID"));
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
      'GIVEN_ADDRESSES',
      null,
      v_type,
      null,
      to_char(nvl(:old."ADDRESS_ID",:new."ADDRESS_ID")));
  end if;
end;
/
SHOW ERRORS;


