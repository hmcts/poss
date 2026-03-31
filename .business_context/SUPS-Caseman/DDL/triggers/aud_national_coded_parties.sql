Prompt Trigger AUD_NATIONAL_CODED_PARTIES;
--
-- AUD_NATIONAL_CODED_PARTIES  (Trigger) 
--
--  Dependencies: 
--   NATIONAL_CODED_PARTIES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_NATIONAL_CODED_PARTIES"
after update or insert or delete on "NATIONAL_CODED_PARTIES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table NATIONAL_CODED_PARTIES                           */
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'ADMIN_COURT_CODE',
        'Updated',
        to_char(:old."ADMIN_COURT_CODE"),
        to_char(:old."CODE"));
    end if;
    if (:old."ADM_PAPER_TYPE" != :new."ADM_PAPER_TYPE")
    or (:old."ADM_PAPER_TYPE" is null and :new."ADM_PAPER_TYPE" is not null)
    or (:old."ADM_PAPER_TYPE" is not null and :new."ADM_PAPER_TYPE" is null)
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
        'NATIONAL_CODED_PARTIES',
        'ADM_PAPER_TYPE',
        'Updated',
        :old."ADM_PAPER_TYPE",
        to_char(:old."CODE"));
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
        pk01)
      values (
        systimestamp,
        trunc(sysdate),
        v_courtid,
        v_userid,
        v_processid,
        'NATIONAL_CODED_PARTIES',
        'CODE',
        'Updated',
        to_char(:old."CODE"),
        to_char(:old."CODE"));
    end if;
    if (:old."DEF_PAPER_TYPE" != :new."DEF_PAPER_TYPE")
    or (:old."DEF_PAPER_TYPE" is null and :new."DEF_PAPER_TYPE" is not null)
    or (:old."DEF_PAPER_TYPE" is not null and :new."DEF_PAPER_TYPE" is null)
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
        'NATIONAL_CODED_PARTIES',
        'DEF_PAPER_TYPE',
        'Updated',
        :old."DEF_PAPER_TYPE",
        to_char(:old."CODE"));
    end if;
    if (:old."DUPLEX" != :new."DUPLEX")
    or (:old."DUPLEX" is null and :new."DUPLEX" is not null)
    or (:old."DUPLEX" is not null and :new."DUPLEX" is null)
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
        'NATIONAL_CODED_PARTIES',
        'DUPLEX',
        'Updated',
        :old."DUPLEX",
        to_char(:old."CODE"));
    end if;
    if (:old."GIRO_JUDGMENTS" != :new."GIRO_JUDGMENTS")
    or (:old."GIRO_JUDGMENTS" is null and :new."GIRO_JUDGMENTS" is not null)
    or (:old."GIRO_JUDGMENTS" is not null and :new."GIRO_JUDGMENTS" is null)
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
        'NATIONAL_CODED_PARTIES',
        'GIRO_JUDGMENTS',
        'Updated',
        :old."GIRO_JUDGMENTS",
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_ADM_SEQ" != :new."LAST_ADM_SEQ")
    or (:old."LAST_ADM_SEQ" is null and :new."LAST_ADM_SEQ" is not null)
    or (:old."LAST_ADM_SEQ" is not null and :new."LAST_ADM_SEQ" is null)
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
        'NATIONAL_CODED_PARTIES',
        'LAST_ADM_SEQ',
        'Updated',
        to_char(:old."LAST_ADM_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_DEF_SEQ" != :new."LAST_DEF_SEQ")
    or (:old."LAST_DEF_SEQ" is null and :new."LAST_DEF_SEQ" is not null)
    or (:old."LAST_DEF_SEQ" is not null and :new."LAST_DEF_SEQ" is null)
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
        'NATIONAL_CODED_PARTIES',
        'LAST_DEF_SEQ',
        'Updated',
        to_char(:old."LAST_DEF_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_JG_SEQ" != :new."LAST_JG_SEQ")
    or (:old."LAST_JG_SEQ" is null and :new."LAST_JG_SEQ" is not null)
    or (:old."LAST_JG_SEQ" is not null and :new."LAST_JG_SEQ" is null)
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
        'NATIONAL_CODED_PARTIES',
        'LAST_JG_SEQ',
        'Updated',
        to_char(:old."LAST_JG_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_PD_SEQ" != :new."LAST_PD_SEQ")
    or (:old."LAST_PD_SEQ" is null and :new."LAST_PD_SEQ" is not null)
    or (:old."LAST_PD_SEQ" is not null and :new."LAST_PD_SEQ" is null)
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
        'NATIONAL_CODED_PARTIES',
        'LAST_PD_SEQ',
        'Updated',
        to_char(:old."LAST_PD_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_WT_SEQ" != :new."LAST_WT_SEQ")
    or (:old."LAST_WT_SEQ" is null and :new."LAST_WT_SEQ" is not null)
    or (:old."LAST_WT_SEQ" is not null and :new."LAST_WT_SEQ" is null)
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
        'NATIONAL_CODED_PARTIES',
        'LAST_WT_SEQ',
        'Updated',
        to_char(:old."LAST_WT_SEQ"),
        to_char(:old."CODE"));
    end if;
    if (:old."PRINT_JUDGMENTS" != :new."PRINT_JUDGMENTS")
    or (:old."PRINT_JUDGMENTS" is null and :new."PRINT_JUDGMENTS" is not null)
    or (:old."PRINT_JUDGMENTS" is not null and :new."PRINT_JUDGMENTS" is null)
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
        'NATIONAL_CODED_PARTIES',
        'PRINT_JUDGMENTS',
        'Updated',
        :old."PRINT_JUDGMENTS",
        to_char(:old."CODE"));
    end if;
    if (:old."WRT_NO_FROM" != :new."WRT_NO_FROM")
    or (:old."WRT_NO_FROM" is null and :new."WRT_NO_FROM" is not null)
    or (:old."WRT_NO_FROM" is not null and :new."WRT_NO_FROM" is null)
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
        'NATIONAL_CODED_PARTIES',
        'WRT_NO_FROM',
        'Updated',
        :old."WRT_NO_FROM",
        to_char(:old."CODE"));
    end if;
    if (:old."WRT_NO_TO" != :new."WRT_NO_TO")
    or (:old."WRT_NO_TO" is null and :new."WRT_NO_TO" is not null)
    or (:old."WRT_NO_TO" is not null and :new."WRT_NO_TO" is null)
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
        'NATIONAL_CODED_PARTIES',
        'WRT_NO_TO',
        'Updated',
        :old."WRT_NO_TO",
        to_char(:old."CODE"));
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
      'NATIONAL_CODED_PARTIES',
      null,
      v_type,
      null,
      to_char(nvl(:old."CODE",:new."CODE")));
  end if;
end;
/
SHOW ERRORS;


