Prompt Trigger AUD_COURTS;
--
-- AUD_COURTS  (Trigger) 
--
--  Dependencies: 
--   COURTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_COURTS"
after update or insert or delete on "COURTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table COURTS                                           */
/*   Script generated 04-AUG-2007 09:38:39                                    */
/*   From:                                                                    */
/*     Server   csa00072                                                      */
/*     Database supsb                                                         */
/*     User     CMAN                                                          */
/*   Change History:														  */
/*     04/09/2012, Chris Vincent.											  */
/*     Added handlers for columns WELSH_COURT_NAME and DR_TEL_NO.  Trac 4718  */
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
    if (:old."BLF_TEL_NO" != :new."BLF_TEL_NO")
    or (:old."BLF_TEL_NO" is null and :new."BLF_TEL_NO" is not null)
    or (:old."BLF_TEL_NO" is not null and :new."BLF_TEL_NO" is null)
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
        'COURTS',
        'BLF_TEL_NO',
        'Updated',
        :old."BLF_TEL_NO",
        to_char(:old."CODE"));
    end if;
    if (:old."CASEMAN_INSERVICE" != :new."CASEMAN_INSERVICE")
    or (:old."CASEMAN_INSERVICE" is null and :new."CASEMAN_INSERVICE" is not null)
    or (:old."CASEMAN_INSERVICE" is not null and :new."CASEMAN_INSERVICE" is null)
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
        'COURTS',
        'CASEMAN_INSERVICE',
        'Updated',
        :old."CASEMAN_INSERVICE",
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
        'COURTS',
        'CODE',
        'Updated',
        to_char(:old."CODE"),
        to_char(:old."CODE"));
    end if;
    if (:old."DATABASE_NAME" != :new."DATABASE_NAME")
    or (:old."DATABASE_NAME" is null and :new."DATABASE_NAME" is not null)
    or (:old."DATABASE_NAME" is not null and :new."DATABASE_NAME" is null)
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
        'COURTS',
        'DATABASE_NAME',
        'Updated',
        :old."DATABASE_NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."DEED_PACK_NUMBER" != :new."DEED_PACK_NUMBER")
    or (:old."DEED_PACK_NUMBER" is null and :new."DEED_PACK_NUMBER" is not null)
    or (:old."DEED_PACK_NUMBER" is not null and :new."DEED_PACK_NUMBER" is null)
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
        'COURTS',
        'DEED_PACK_NUMBER',
        'Updated',
        :old."DEED_PACK_NUMBER",
        to_char(:old."CODE"));
    end if;
    if (:old."DEFAULT_PRINTER" != :new."DEFAULT_PRINTER")
    or (:old."DEFAULT_PRINTER" is null and :new."DEFAULT_PRINTER" is not null)
    or (:old."DEFAULT_PRINTER" is not null and :new."DEFAULT_PRINTER" is null)
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
        'COURTS',
        'DEFAULT_PRINTER',
        'Updated',
        :old."DEFAULT_PRINTER",
        to_char(:old."CODE"));
    end if;
    if (:old."DISTRICT_REGISTRY" != :new."DISTRICT_REGISTRY")
    or (:old."DISTRICT_REGISTRY" is null and :new."DISTRICT_REGISTRY" is not null)
    or (:old."DISTRICT_REGISTRY" is not null and :new."DISTRICT_REGISTRY" is null)
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
        'COURTS',
        'DISTRICT_REGISTRY',
        'Updated',
        :old."DISTRICT_REGISTRY",
        to_char(:old."CODE"));
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
        'COURTS',
        'DX_NUMBER',
        'Updated',
        :old."DX_NUMBER",
        to_char(:old."CODE"));
    end if;
    if (:old."FAP_ID" != :new."FAP_ID")
    or (:old."FAP_ID" is null and :new."FAP_ID" is not null)
    or (:old."FAP_ID" is not null and :new."FAP_ID" is null)
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
        'COURTS',
        'FAP_ID',
        'Updated',
        :old."FAP_ID",
        to_char(:old."CODE"));
    end if;
    if (:old."FAX_NO" != :new."FAX_NO")
    or (:old."FAX_NO" is null and :new."FAX_NO" is not null)
    or (:old."FAX_NO" is not null and :new."FAX_NO" is null)
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
        'COURTS',
        'FAX_NO',
        'Updated',
        :old."FAX_NO",
        to_char(:old."CODE"));
    end if;
    if (:old."ID" != :new."ID")
    or (:old."ID" is null and :new."ID" is not null)
    or (:old."ID" is not null and :new."ID" is null)
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
        'COURTS',
        'ID',
        'Updated',
        :old."ID",
        to_char(:old."CODE"));
    end if;
    if (:old."LAST_WRT_SEQNO" != :new."LAST_WRT_SEQNO")
    or (:old."LAST_WRT_SEQNO" is null and :new."LAST_WRT_SEQNO" is not null)
    or (:old."LAST_WRT_SEQNO" is not null and :new."LAST_WRT_SEQNO" is null)
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
        'COURTS',
        'LAST_WRT_SEQNO',
        'Updated',
        to_char(:old."LAST_WRT_SEQNO"),
        to_char(:old."CODE"));
    end if;
    if (:old."NAME" != :new."NAME")
    or (:old."NAME" is null and :new."NAME" is not null)
    or (:old."NAME" is not null and :new."NAME" is null)
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
        'COURTS',
        'NAME',
        'Updated',
        :old."NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."OPEN_FLAG" != :new."OPEN_FLAG")
    or (:old."OPEN_FLAG" is null and :new."OPEN_FLAG" is not null)
    or (:old."OPEN_FLAG" is not null and :new."OPEN_FLAG" is null)
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
        'COURTS',
        'OPEN_FLAG',
        'Updated',
        :old."OPEN_FLAG",
        to_char(:old."CODE"));
    end if;
    if (:old."SAT_COURT" != :new."SAT_COURT")
    or (:old."SAT_COURT" is null and :new."SAT_COURT" is not null)
    or (:old."SAT_COURT" is not null and :new."SAT_COURT" is null)
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
        'COURTS',
        'SAT_COURT',
        'Updated',
        :old."SAT_COURT",
        to_char(:old."CODE"));
    end if;
    if (:old."SUPS_CENTRALISED_FLAG" != :new."SUPS_CENTRALISED_FLAG")
    or (:old."SUPS_CENTRALISED_FLAG" is null and :new."SUPS_CENTRALISED_FLAG" is not null)
    or (:old."SUPS_CENTRALISED_FLAG" is not null and :new."SUPS_CENTRALISED_FLAG" is null)
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
        'COURTS',
        'SUPS_CENTRALISED_FLAG',
        'Updated',
        :old."SUPS_CENTRALISED_FLAG",
        to_char(:old."CODE"));
    end if;
    if (:old."TASKS_UPDATED" != :new."TASKS_UPDATED")
    or (:old."TASKS_UPDATED" is null and :new."TASKS_UPDATED" is not null)
    or (:old."TASKS_UPDATED" is not null and :new."TASKS_UPDATED" is null)
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
        'COURTS',
        'TASKS_UPDATED',
        'Updated',
        :old."TASKS_UPDATED",
        to_char(:old."CODE"));
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
        'COURTS',
        'TEL_NO',
        'Updated',
        :old."TEL_NO",
        to_char(:old."CODE"));
    end if;
    if (:old."TUCS_IN_USE" != :new."TUCS_IN_USE")
    or (:old."TUCS_IN_USE" is null and :new."TUCS_IN_USE" is not null)
    or (:old."TUCS_IN_USE" is not null and :new."TUCS_IN_USE" is null)
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
        'COURTS',
        'TUCS_IN_USE',
        'Updated',
        :old."TUCS_IN_USE",
        to_char(:old."CODE"));
    end if;
    if (:old."WELSH_COUNTY_COURT_NAME" != :new."WELSH_COUNTY_COURT_NAME")
    or (:old."WELSH_COUNTY_COURT_NAME" is null and :new."WELSH_COUNTY_COURT_NAME" is not null)
    or (:old."WELSH_COUNTY_COURT_NAME" is not null and :new."WELSH_COUNTY_COURT_NAME" is null)
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
        'COURTS',
        'WELSH_COUNTY_COURT_NAME',
        'Updated',
        :old."WELSH_COUNTY_COURT_NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."WELSH_HIGH_COURT_NAME" != :new."WELSH_HIGH_COURT_NAME")
    or (:old."WELSH_HIGH_COURT_NAME" is null and :new."WELSH_HIGH_COURT_NAME" is not null)
    or (:old."WELSH_HIGH_COURT_NAME" is not null and :new."WELSH_HIGH_COURT_NAME" is null)
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
        'COURTS',
        'WELSH_HIGH_COURT_NAME',
        'Updated',
        :old."WELSH_HIGH_COURT_NAME",
        to_char(:old."CODE"));
    end if;
    if (:old."WFT_DM_EMAIL_ADDRESS" != :new."WFT_DM_EMAIL_ADDRESS")
    or (:old."WFT_DM_EMAIL_ADDRESS" is null and :new."WFT_DM_EMAIL_ADDRESS" is not null)
    or (:old."WFT_DM_EMAIL_ADDRESS" is not null and :new."WFT_DM_EMAIL_ADDRESS" is null)
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
        'COURTS',
        'WFT_DM_EMAIL_ADDRESS',
        'Updated',
        :old."WFT_DM_EMAIL_ADDRESS",
        to_char(:old."CODE"));
    end if;
    if (:old."WFT_GROUPING_COURT" != :new."WFT_GROUPING_COURT")
    or (:old."WFT_GROUPING_COURT" is null and :new."WFT_GROUPING_COURT" is not null)
    or (:old."WFT_GROUPING_COURT" is not null and :new."WFT_GROUPING_COURT" is null)
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
        'COURTS',
        'WFT_GROUPING_COURT',
        'Updated',
        to_char(:old."WFT_GROUPING_COURT"),
        to_char(:old."CODE"));
    end if;
    if (:old."WELSH_COURT_NAME" != :new."WELSH_COURT_NAME")
    or (:old."WELSH_COURT_NAME" is null and :new."WELSH_COURT_NAME" is not null)
    or (:old."WELSH_COURT_NAME" is not null and :new."WELSH_COURT_NAME" is null)
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
        'COURTS',
        'WELSH_COURT_NAME',
        'Updated',
        to_char(:old."WELSH_COURT_NAME"),
        to_char(:old."CODE"));
    end if;
    if (:old."DR_TEL_NO" != :new."DR_TEL_NO")
    or (:old."DR_TEL_NO" is null and :new."DR_TEL_NO" is not null)
    or (:old."DR_TEL_NO" is not null and :new."DR_TEL_NO" is null)
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
        'COURTS',
        'DR_TEL_NO',
        'Updated',
        to_char(:old."DR_TEL_NO"),
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
      'COURTS',
      null,
      v_type,
      null,
      to_char(nvl(:old."CODE",:new."CODE")));
  end if;
end;
/
SHOW ERRORS;


