Prompt Trigger AUD_PERSONALISE;
--
-- AUD_PERSONALISE  (Trigger) 
--
--  Dependencies: 
--   PERSONALISE (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_PERSONALISE"
after update or insert or delete on "PERSONALISE"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table PERSONALISE                                      */
/*   Script generated 04-AUG-2007 09:38:39                                    */
/*   From:                                                                    */
/*     Server   csa00072                                                      */
/*     Database supsb                                                         */
/*     User     CMAN                                                          */
/*   Change History:														  */
/*     04/09/2012, Chris Vincent.											  */
/*     Added handlers for columns DR_OPEN_FROM, DR_CLOSED_AT and     		  */
/*     BY_APPOINTMENT_IND.  Trac 4718										  */
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
    if (:old."ACCOUNTING_CODE" != :new."ACCOUNTING_CODE")
    or (:old."ACCOUNTING_CODE" is null and :new."ACCOUNTING_CODE" is not null)
    or (:old."ACCOUNTING_CODE" is not null and :new."ACCOUNTING_CODE" is null)
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
        'PERSONALISE',
        'ACCOUNTING_CODE',
        'Updated',
        to_char(:old."ACCOUNTING_CODE"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."ACCOUNT_TYPE" != :new."ACCOUNT_TYPE")
    or (:old."ACCOUNT_TYPE" is null and :new."ACCOUNT_TYPE" is not null)
    or (:old."ACCOUNT_TYPE" is not null and :new."ACCOUNT_TYPE" is null)
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
        'PERSONALISE',
        'ACCOUNT_TYPE',
        'Updated',
        :old."ACCOUNT_TYPE",
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_CLOSING" != :new."BAILIFF_CLOSING")
    or (:old."BAILIFF_CLOSING" is null and :new."BAILIFF_CLOSING" is not null)
    or (:old."BAILIFF_CLOSING" is not null and :new."BAILIFF_CLOSING" is null)
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
        'PERSONALISE',
        'BAILIFF_CLOSING',
        'Updated',
        to_char(:old."BAILIFF_CLOSING"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_FAX" != :new."BAILIFF_FAX")
    or (:old."BAILIFF_FAX" is null and :new."BAILIFF_FAX" is not null)
    or (:old."BAILIFF_FAX" is not null and :new."BAILIFF_FAX" is null)
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
        'PERSONALISE',
        'BAILIFF_FAX',
        'Updated',
        :old."BAILIFF_FAX",
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_OPENING" != :new."BAILIFF_OPENING")
    or (:old."BAILIFF_OPENING" is null and :new."BAILIFF_OPENING" is not null)
    or (:old."BAILIFF_OPENING" is not null and :new."BAILIFF_OPENING" is null)
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
        'PERSONALISE',
        'BAILIFF_OPENING',
        'Updated',
        to_char(:old."BAILIFF_OPENING"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BAILIFF_TELEPHONE" != :new."BAILIFF_TELEPHONE")
    or (:old."BAILIFF_TELEPHONE" is null and :new."BAILIFF_TELEPHONE" is not null)
    or (:old."BAILIFF_TELEPHONE" is not null and :new."BAILIFF_TELEPHONE" is null)
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
        'PERSONALISE',
        'BAILIFF_TELEPHONE',
        'Updated',
        :old."BAILIFF_TELEPHONE",
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."CLOSED_AT" != :new."CLOSED_AT")
    or (:old."CLOSED_AT" is null and :new."CLOSED_AT" is not null)
    or (:old."CLOSED_AT" is not null and :new."CLOSED_AT" is null)
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
        'PERSONALISE',
        'CLOSED_AT',
        'Updated',
        to_char(:old."CLOSED_AT"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."CRT_CODE" != :new."CRT_CODE")
    or (:old."CRT_CODE" is null and :new."CRT_CODE" is not null)
    or (:old."CRT_CODE" is not null and :new."CRT_CODE" is null)
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
        'PERSONALISE',
        'CRT_CODE',
        'Updated',
        to_char(:old."CRT_CODE"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."OPEN_FROM" != :new."OPEN_FROM")
    or (:old."OPEN_FROM" is null and :new."OPEN_FROM" is not null)
    or (:old."OPEN_FROM" is not null and :new."OPEN_FROM" is null)
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
        'PERSONALISE',
        'OPEN_FROM',
        'Updated',
        to_char(:old."OPEN_FROM"),
        to_char(:old."CRT_CODE"));
    end if;
	
    if (:old."DR_OPEN_FROM" != :new."DR_OPEN_FROM")
    or (:old."DR_OPEN_FROM" is null and :new."DR_OPEN_FROM" is not null)
    or (:old."DR_OPEN_FROM" is not null and :new."DR_OPEN_FROM" is null)
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
        'PERSONALISE',
        'DR_OPEN_FROM',
        'Updated',
        to_char(:old."DR_OPEN_FROM"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."DR_CLOSED_AT" != :new."DR_CLOSED_AT")
    or (:old."DR_CLOSED_AT" is null and :new."DR_CLOSED_AT" is not null)
    or (:old."DR_CLOSED_AT" is not null and :new."DR_CLOSED_AT" is null)
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
        'PERSONALISE',
        'DR_CLOSED_AT',
        'Updated',
        to_char(:old."DR_CLOSED_AT"),
        to_char(:old."CRT_CODE"));
    end if;
    if (:old."BY_APPOINTMENT_IND" != :new."BY_APPOINTMENT_IND")
    or (:old."BY_APPOINTMENT_IND" is null and :new."BY_APPOINTMENT_IND" is not null)
    or (:old."BY_APPOINTMENT_IND" is not null and :new."BY_APPOINTMENT_IND" is null)
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
        'PERSONALISE',
        'BY_APPOINTMENT_IND',
        'Updated',
        to_char(:old."BY_APPOINTMENT_IND"),
        to_char(:old."CRT_CODE"));
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
      'PERSONALISE',
      null,
      v_type,
      null,
      to_char(nvl(:old."CRT_CODE",:new."CRT_CODE")));
  end if;
end;
/
SHOW ERRORS;


