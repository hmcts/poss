Prompt Trigger AUD_WARRANTS;
--
-- AUD_WARRANTS  (Trigger) 
--
--  Dependencies: 
--   WARRANTS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_WARRANTS"
after update or insert or delete on "WARRANTS"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table WARRANTS                                         */
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
    if (:old."BAILIFF_IDENTIFIER" != :new."BAILIFF_IDENTIFIER")
    or (:old."BAILIFF_IDENTIFIER" is null and :new."BAILIFF_IDENTIFIER" is not null)
    or (:old."BAILIFF_IDENTIFIER" is not null and :new."BAILIFF_IDENTIFIER" is null)
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
        'WARRANTS',
        'BAILIFF_IDENTIFIER',
        'Updated',
        to_char(:old."BAILIFF_IDENTIFIER"),
        :old."WARRANT_ID");
    end if;
    if (:old."BALANCE_AFTER_PAID" != :new."BALANCE_AFTER_PAID")
    or (:old."BALANCE_AFTER_PAID" is null and :new."BALANCE_AFTER_PAID" is not null)
    or (:old."BALANCE_AFTER_PAID" is not null and :new."BALANCE_AFTER_PAID" is null)
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
        'WARRANTS',
        'BALANCE_AFTER_PAID',
        'Updated',
        to_char(:old."BALANCE_AFTER_PAID"),
        :old."WARRANT_ID");
    end if;
    if (:old."BALANCE_AFTER_PAID_CURRENCY" != :new."BALANCE_AFTER_PAID_CURRENCY")
    or (:old."BALANCE_AFTER_PAID_CURRENCY" is null and :new."BALANCE_AFTER_PAID_CURRENCY" is not null)
    or (:old."BALANCE_AFTER_PAID_CURRENCY" is not null and :new."BALANCE_AFTER_PAID_CURRENCY" is null)
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
        'WARRANTS',
        'BALANCE_AFTER_PAID_CURRENCY',
        'Updated',
        :old."BALANCE_AFTER_PAID_CURRENCY",
        :old."WARRANT_ID");
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
        'WARRANTS',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."CCBC_WARRANT" != :new."CCBC_WARRANT")
    or (:old."CCBC_WARRANT" is null and :new."CCBC_WARRANT" is not null)
    or (:old."CCBC_WARRANT" is not null and :new."CCBC_WARRANT" is null)
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
        'WARRANTS',
        'CCBC_WARRANT',
        'Updated',
        :old."CCBC_WARRANT",
        :old."WARRANT_ID");
    end if;
    if (:old."CODED_PARTY_CLAIMANT_CODE" != :new."CODED_PARTY_CLAIMANT_CODE")
    or (:old."CODED_PARTY_CLAIMANT_CODE" is null and :new."CODED_PARTY_CLAIMANT_CODE" is not null)
    or (:old."CODED_PARTY_CLAIMANT_CODE" is not null and :new."CODED_PARTY_CLAIMANT_CODE" is null)
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
        'WARRANTS',
        'CODED_PARTY_CLAIMANT_CODE',
        'Updated',
        to_char(:old."CODED_PARTY_CLAIMANT_CODE"),
        :old."WARRANT_ID");
    end if;
    if (:old."CODED_PARTY_REP_CODE" != :new."CODED_PARTY_REP_CODE")
    or (:old."CODED_PARTY_REP_CODE" is null and :new."CODED_PARTY_REP_CODE" is not null)
    or (:old."CODED_PARTY_REP_CODE" is not null and :new."CODED_PARTY_REP_CODE" is null)
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
        'WARRANTS',
        'CODED_PARTY_REP_CODE',
        'Updated',
        to_char(:old."CODED_PARTY_REP_CODE"),
        :old."WARRANT_ID");
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
        'WARRANTS',
        'CO_NUMBER',
        'Updated',
        :old."CO_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."CURRENTLY_OWNED_BY" != :new."CURRENTLY_OWNED_BY")
    or (:old."CURRENTLY_OWNED_BY" is null and :new."CURRENTLY_OWNED_BY" is not null)
    or (:old."CURRENTLY_OWNED_BY" is not null and :new."CURRENTLY_OWNED_BY" is null)
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
        'WARRANTS',
        'CURRENTLY_OWNED_BY',
        'Updated',
        to_char(:old."CURRENTLY_OWNED_BY"),
        :old."WARRANT_ID");
    end if;
    if (:old."DATE_PRINTED" != :new."DATE_PRINTED")
    or (:old."DATE_PRINTED" is null and :new."DATE_PRINTED" is not null)
    or (:old."DATE_PRINTED" is not null and :new."DATE_PRINTED" is null)
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
        'WARRANTS',
        'DATE_PRINTED',
        'Updated',
        to_char(:old."DATE_PRINTED",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."DATE_REPRINTED" != :new."DATE_REPRINTED")
    or (:old."DATE_REPRINTED" is null and :new."DATE_REPRINTED" is not null)
    or (:old."DATE_REPRINTED" is not null and :new."DATE_REPRINTED" is null)
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
        'WARRANTS',
        'DATE_REPRINTED',
        'Updated',
        to_char(:old."DATE_REPRINTED",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_1" != :new."DEF1_ADDR_1")
    or (:old."DEF1_ADDR_1" is null and :new."DEF1_ADDR_1" is not null)
    or (:old."DEF1_ADDR_1" is not null and :new."DEF1_ADDR_1" is null)
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
        'WARRANTS',
        'DEF1_ADDR_1',
        'Updated',
        :old."DEF1_ADDR_1",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_2" != :new."DEF1_ADDR_2")
    or (:old."DEF1_ADDR_2" is null and :new."DEF1_ADDR_2" is not null)
    or (:old."DEF1_ADDR_2" is not null and :new."DEF1_ADDR_2" is null)
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
        'WARRANTS',
        'DEF1_ADDR_2',
        'Updated',
        :old."DEF1_ADDR_2",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_3" != :new."DEF1_ADDR_3")
    or (:old."DEF1_ADDR_3" is null and :new."DEF1_ADDR_3" is not null)
    or (:old."DEF1_ADDR_3" is not null and :new."DEF1_ADDR_3" is null)
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
        'WARRANTS',
        'DEF1_ADDR_3',
        'Updated',
        :old."DEF1_ADDR_3",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_4" != :new."DEF1_ADDR_4")
    or (:old."DEF1_ADDR_4" is null and :new."DEF1_ADDR_4" is not null)
    or (:old."DEF1_ADDR_4" is not null and :new."DEF1_ADDR_4" is null)
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
        'WARRANTS',
        'DEF1_ADDR_4',
        'Updated',
        :old."DEF1_ADDR_4",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_ADDR_5" != :new."DEF1_ADDR_5")
    or (:old."DEF1_ADDR_5" is null and :new."DEF1_ADDR_5" is not null)
    or (:old."DEF1_ADDR_5" is not null and :new."DEF1_ADDR_5" is null)
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
        'WARRANTS',
        'DEF1_ADDR_5',
        'Updated',
        :old."DEF1_ADDR_5",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_CASE_PARTY_NO" != :new."DEF1_CASE_PARTY_NO")
    or (:old."DEF1_CASE_PARTY_NO" is null and :new."DEF1_CASE_PARTY_NO" is not null)
    or (:old."DEF1_CASE_PARTY_NO" is not null and :new."DEF1_CASE_PARTY_NO" is null)
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
        'WARRANTS',
        'DEF1_CASE_PARTY_NO',
        'Updated',
        to_char(:old."DEF1_CASE_PARTY_NO"),
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_PARTY_ROLE_CODE" != :new."DEF1_PARTY_ROLE_CODE")
    or (:old."DEF1_PARTY_ROLE_CODE" is null and :new."DEF1_PARTY_ROLE_CODE" is not null)
    or (:old."DEF1_PARTY_ROLE_CODE" is not null and :new."DEF1_PARTY_ROLE_CODE" is null)
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
        'WARRANTS',
        'DEF1_PARTY_ROLE_CODE',
        'Updated',
        :old."DEF1_PARTY_ROLE_CODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF1_POSTCODE" != :new."DEF1_POSTCODE")
    or (:old."DEF1_POSTCODE" is null and :new."DEF1_POSTCODE" is not null)
    or (:old."DEF1_POSTCODE" is not null and :new."DEF1_POSTCODE" is null)
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
        'WARRANTS',
        'DEF1_POSTCODE',
        'Updated',
        :old."DEF1_POSTCODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_1" != :new."DEF2_ADDR_1")
    or (:old."DEF2_ADDR_1" is null and :new."DEF2_ADDR_1" is not null)
    or (:old."DEF2_ADDR_1" is not null and :new."DEF2_ADDR_1" is null)
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
        'WARRANTS',
        'DEF2_ADDR_1',
        'Updated',
        :old."DEF2_ADDR_1",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_2" != :new."DEF2_ADDR_2")
    or (:old."DEF2_ADDR_2" is null and :new."DEF2_ADDR_2" is not null)
    or (:old."DEF2_ADDR_2" is not null and :new."DEF2_ADDR_2" is null)
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
        'WARRANTS',
        'DEF2_ADDR_2',
        'Updated',
        :old."DEF2_ADDR_2",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_3" != :new."DEF2_ADDR_3")
    or (:old."DEF2_ADDR_3" is null and :new."DEF2_ADDR_3" is not null)
    or (:old."DEF2_ADDR_3" is not null and :new."DEF2_ADDR_3" is null)
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
        'WARRANTS',
        'DEF2_ADDR_3',
        'Updated',
        :old."DEF2_ADDR_3",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_4" != :new."DEF2_ADDR_4")
    or (:old."DEF2_ADDR_4" is null and :new."DEF2_ADDR_4" is not null)
    or (:old."DEF2_ADDR_4" is not null and :new."DEF2_ADDR_4" is null)
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
        'WARRANTS',
        'DEF2_ADDR_4',
        'Updated',
        :old."DEF2_ADDR_4",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_ADDR_5" != :new."DEF2_ADDR_5")
    or (:old."DEF2_ADDR_5" is null and :new."DEF2_ADDR_5" is not null)
    or (:old."DEF2_ADDR_5" is not null and :new."DEF2_ADDR_5" is null)
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
        'WARRANTS',
        'DEF2_ADDR_5',
        'Updated',
        :old."DEF2_ADDR_5",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_CASE_PARTY_NO" != :new."DEF2_CASE_PARTY_NO")
    or (:old."DEF2_CASE_PARTY_NO" is null and :new."DEF2_CASE_PARTY_NO" is not null)
    or (:old."DEF2_CASE_PARTY_NO" is not null and :new."DEF2_CASE_PARTY_NO" is null)
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
        'WARRANTS',
        'DEF2_CASE_PARTY_NO',
        'Updated',
        to_char(:old."DEF2_CASE_PARTY_NO"),
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_PARTY_ROLE_CODE" != :new."DEF2_PARTY_ROLE_CODE")
    or (:old."DEF2_PARTY_ROLE_CODE" is null and :new."DEF2_PARTY_ROLE_CODE" is not null)
    or (:old."DEF2_PARTY_ROLE_CODE" is not null and :new."DEF2_PARTY_ROLE_CODE" is null)
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
        'WARRANTS',
        'DEF2_PARTY_ROLE_CODE',
        'Updated',
        :old."DEF2_PARTY_ROLE_CODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEF2_POSTCODE" != :new."DEF2_POSTCODE")
    or (:old."DEF2_POSTCODE" is null and :new."DEF2_POSTCODE" is not null)
    or (:old."DEF2_POSTCODE" is not null and :new."DEF2_POSTCODE" is null)
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
        'WARRANTS',
        'DEF2_POSTCODE',
        'Updated',
        :old."DEF2_POSTCODE",
        :old."WARRANT_ID");
    end if;
    if (:old."DEFENDANT1" != :new."DEFENDANT1")
    or (:old."DEFENDANT1" is null and :new."DEFENDANT1" is not null)
    or (:old."DEFENDANT1" is not null and :new."DEFENDANT1" is null)
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
        'WARRANTS',
        'DEFENDANT1',
        'Updated',
        :old."DEFENDANT1",
        :old."WARRANT_ID");
    end if;
    if (:old."DEFENDANT2" != :new."DEFENDANT2")
    or (:old."DEFENDANT2" is null and :new."DEFENDANT2" is not null)
    or (:old."DEFENDANT2" is not null and :new."DEFENDANT2" is null)
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
        'WARRANTS',
        'DEFENDANT2',
        'Updated',
        :old."DEFENDANT2",
        :old."WARRANT_ID");
    end if;
    if (:old."EXECUTED_BY" != :new."EXECUTED_BY")
    or (:old."EXECUTED_BY" is null and :new."EXECUTED_BY" is not null)
    or (:old."EXECUTED_BY" is not null and :new."EXECUTED_BY" is null)
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
        'WARRANTS',
        'EXECUTED_BY',
        'Updated',
        to_char(:old."EXECUTED_BY"),
        :old."WARRANT_ID");
    end if;
    if (:old."HOME_COURT_ISSUE_DATE" != :new."HOME_COURT_ISSUE_DATE")
    or (:old."HOME_COURT_ISSUE_DATE" is null and :new."HOME_COURT_ISSUE_DATE" is not null)
    or (:old."HOME_COURT_ISSUE_DATE" is not null and :new."HOME_COURT_ISSUE_DATE" is null)
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
        'WARRANTS',
        'HOME_COURT_ISSUE_DATE',
        'Updated',
        to_char(:old."HOME_COURT_ISSUE_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."ISSUED_BY" != :new."ISSUED_BY")
    or (:old."ISSUED_BY" is null and :new."ISSUED_BY" is not null)
    or (:old."ISSUED_BY" is not null and :new."ISSUED_BY" is null)
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
        'WARRANTS',
        'ISSUED_BY',
        'Updated',
        to_char(:old."ISSUED_BY"),
        :old."WARRANT_ID");
    end if;
    if (:old."LAND_REGISTRY_FEE" != :new."LAND_REGISTRY_FEE")
    or (:old."LAND_REGISTRY_FEE" is null and :new."LAND_REGISTRY_FEE" is not null)
    or (:old."LAND_REGISTRY_FEE" is not null and :new."LAND_REGISTRY_FEE" is null)
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
        'WARRANTS',
        'LAND_REGISTRY_FEE',
        'Updated',
        to_char(:old."LAND_REGISTRY_FEE"),
        :old."WARRANT_ID");
    end if;
    if (:old."LAND_REGISTRY_FEE_CURRENCY" != :new."LAND_REGISTRY_FEE_CURRENCY")
    or (:old."LAND_REGISTRY_FEE_CURRENCY" is null and :new."LAND_REGISTRY_FEE_CURRENCY" is not null)
    or (:old."LAND_REGISTRY_FEE_CURRENCY" is not null and :new."LAND_REGISTRY_FEE_CURRENCY" is null)
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
        'WARRANTS',
        'LAND_REGISTRY_FEE_CURRENCY',
        'Updated',
        :old."LAND_REGISTRY_FEE_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."LOCAL_WARRANT_NUMBER" != :new."LOCAL_WARRANT_NUMBER")
    or (:old."LOCAL_WARRANT_NUMBER" is null and :new."LOCAL_WARRANT_NUMBER" is not null)
    or (:old."LOCAL_WARRANT_NUMBER" is not null and :new."LOCAL_WARRANT_NUMBER" is null)
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
        'WARRANTS',
        'LOCAL_WARRANT_NUMBER',
        'Updated',
        :old."LOCAL_WARRANT_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."NOTES" != :new."NOTES")
    or (:old."NOTES" is null and :new."NOTES" is not null)
    or (:old."NOTES" is not null and :new."NOTES" is null)
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
        'WARRANTS',
        'NOTES',
        'Updated',
        :old."NOTES",
        :old."WARRANT_ID");
    end if;
    if (:old."ORIGINAL_WARRANT_NUMBER" != :new."ORIGINAL_WARRANT_NUMBER")
    or (:old."ORIGINAL_WARRANT_NUMBER" is null and :new."ORIGINAL_WARRANT_NUMBER" is not null)
    or (:old."ORIGINAL_WARRANT_NUMBER" is not null and :new."ORIGINAL_WARRANT_NUMBER" is null)
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
        'WARRANTS',
        'ORIGINAL_WARRANT_NUMBER',
        'Updated',
        :old."ORIGINAL_WARRANT_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."PLAINTIFF_NAME" != :new."PLAINTIFF_NAME")
    or (:old."PLAINTIFF_NAME" is null and :new."PLAINTIFF_NAME" is not null)
    or (:old."PLAINTIFF_NAME" is not null and :new."PLAINTIFF_NAME" is null)
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
        'WARRANTS',
        'PLAINTIFF_NAME',
        'Updated',
        :old."PLAINTIFF_NAME",
        :old."WARRANT_ID");
    end if;
    if (:old."PREISSUE_BALANCE" != :new."PREISSUE_BALANCE")
    or (:old."PREISSUE_BALANCE" is null and :new."PREISSUE_BALANCE" is not null)
    or (:old."PREISSUE_BALANCE" is not null and :new."PREISSUE_BALANCE" is null)
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
        'WARRANTS',
        'PREISSUE_BALANCE',
        'Updated',
        to_char(:old."PREISSUE_BALANCE"),
        :old."WARRANT_ID");
    end if;
    if (:old."PREISSUE_BALANCE_CURRENCY" != :new."PREISSUE_BALANCE_CURRENCY")
    or (:old."PREISSUE_BALANCE_CURRENCY" is null and :new."PREISSUE_BALANCE_CURRENCY" is not null)
    or (:old."PREISSUE_BALANCE_CURRENCY" is not null and :new."PREISSUE_BALANCE_CURRENCY" is null)
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
        'WARRANTS',
        'PREISSUE_BALANCE_CURRENCY',
        'Updated',
        :old."PREISSUE_BALANCE_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."RECEIPT_DATE" != :new."RECEIPT_DATE")
    or (:old."RECEIPT_DATE" is null and :new."RECEIPT_DATE" is not null)
    or (:old."RECEIPT_DATE" is not null and :new."RECEIPT_DATE" is null)
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
        'WARRANTS',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
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
        'WARRANTS',
        'REFERENCE',
        'Updated',
        :old."REFERENCE",
        :old."WARRANT_ID");
    end if;
    if (:old."REPRINTED_BY" != :new."REPRINTED_BY")
    or (:old."REPRINTED_BY" is null and :new."REPRINTED_BY" is not null)
    or (:old."REPRINTED_BY" is not null and :new."REPRINTED_BY" is null)
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
        'WARRANTS',
        'REPRINTED_BY',
        'Updated',
        :old."REPRINTED_BY",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_1" != :new."REP_ADDR_1")
    or (:old."REP_ADDR_1" is null and :new."REP_ADDR_1" is not null)
    or (:old."REP_ADDR_1" is not null and :new."REP_ADDR_1" is null)
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
        'WARRANTS',
        'REP_ADDR_1',
        'Updated',
        :old."REP_ADDR_1",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_2" != :new."REP_ADDR_2")
    or (:old."REP_ADDR_2" is null and :new."REP_ADDR_2" is not null)
    or (:old."REP_ADDR_2" is not null and :new."REP_ADDR_2" is null)
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
        'WARRANTS',
        'REP_ADDR_2',
        'Updated',
        :old."REP_ADDR_2",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_3" != :new."REP_ADDR_3")
    or (:old."REP_ADDR_3" is null and :new."REP_ADDR_3" is not null)
    or (:old."REP_ADDR_3" is not null and :new."REP_ADDR_3" is null)
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
        'WARRANTS',
        'REP_ADDR_3',
        'Updated',
        :old."REP_ADDR_3",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_4" != :new."REP_ADDR_4")
    or (:old."REP_ADDR_4" is null and :new."REP_ADDR_4" is not null)
    or (:old."REP_ADDR_4" is not null and :new."REP_ADDR_4" is null)
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
        'WARRANTS',
        'REP_ADDR_4',
        'Updated',
        :old."REP_ADDR_4",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_ADDR_5" != :new."REP_ADDR_5")
    or (:old."REP_ADDR_5" is null and :new."REP_ADDR_5" is not null)
    or (:old."REP_ADDR_5" is not null and :new."REP_ADDR_5" is null)
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
        'WARRANTS',
        'REP_ADDR_5',
        'Updated',
        :old."REP_ADDR_5",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_CASE_PARTY_NO" != :new."REP_CASE_PARTY_NO")
    or (:old."REP_CASE_PARTY_NO" is null and :new."REP_CASE_PARTY_NO" is not null)
    or (:old."REP_CASE_PARTY_NO" is not null and :new."REP_CASE_PARTY_NO" is null)
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
        'WARRANTS',
        'REP_CASE_PARTY_NO',
        'Updated',
        to_char(:old."REP_CASE_PARTY_NO"),
        :old."WARRANT_ID");
    end if;
    if (:old."REP_DX_NUMBER" != :new."REP_DX_NUMBER")
    or (:old."REP_DX_NUMBER" is null and :new."REP_DX_NUMBER" is not null)
    or (:old."REP_DX_NUMBER" is not null and :new."REP_DX_NUMBER" is null)
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
        'WARRANTS',
        'REP_DX_NUMBER',
        'Updated',
        :old."REP_DX_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_EMAIL_ADDRESS" != :new."REP_EMAIL_ADDRESS")
    or (:old."REP_EMAIL_ADDRESS" is null and :new."REP_EMAIL_ADDRESS" is not null)
    or (:old."REP_EMAIL_ADDRESS" is not null and :new."REP_EMAIL_ADDRESS" is null)
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
        'WARRANTS',
        'REP_EMAIL_ADDRESS',
        'Updated',
        :old."REP_EMAIL_ADDRESS",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_FAX_NUMBER" != :new."REP_FAX_NUMBER")
    or (:old."REP_FAX_NUMBER" is null and :new."REP_FAX_NUMBER" is not null)
    or (:old."REP_FAX_NUMBER" is not null and :new."REP_FAX_NUMBER" is null)
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
        'WARRANTS',
        'REP_FAX_NUMBER',
        'Updated',
        :old."REP_FAX_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_NAME" != :new."REP_NAME")
    or (:old."REP_NAME" is null and :new."REP_NAME" is not null)
    or (:old."REP_NAME" is not null and :new."REP_NAME" is null)
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
        'WARRANTS',
        'REP_NAME',
        'Updated',
        :old."REP_NAME",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_PARTY_ROLE_CODE" != :new."REP_PARTY_ROLE_CODE")
    or (:old."REP_PARTY_ROLE_CODE" is null and :new."REP_PARTY_ROLE_CODE" is not null)
    or (:old."REP_PARTY_ROLE_CODE" is not null and :new."REP_PARTY_ROLE_CODE" is null)
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
        'WARRANTS',
        'REP_PARTY_ROLE_CODE',
        'Updated',
        :old."REP_PARTY_ROLE_CODE",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_POSTCODE" != :new."REP_POSTCODE")
    or (:old."REP_POSTCODE" is null and :new."REP_POSTCODE" is not null)
    or (:old."REP_POSTCODE" is not null and :new."REP_POSTCODE" is null)
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
        'WARRANTS',
        'REP_POSTCODE',
        'Updated',
        :old."REP_POSTCODE",
        :old."WARRANT_ID");
    end if;
    if (:old."REP_TEL_NO" != :new."REP_TEL_NO")
    or (:old."REP_TEL_NO" is null and :new."REP_TEL_NO" is not null)
    or (:old."REP_TEL_NO" is not null and :new."REP_TEL_NO" is null)
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
        'WARRANTS',
        'REP_TEL_NO',
        'Updated',
        :old."REP_TEL_NO",
        :old."WARRANT_ID");
    end if;
    if (:old."RE_ISSUE_DATE" != :new."RE_ISSUE_DATE")
    or (:old."RE_ISSUE_DATE" is null and :new."RE_ISSUE_DATE" is not null)
    or (:old."RE_ISSUE_DATE" is not null and :new."RE_ISSUE_DATE" is null)
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
        'WARRANTS',
        'RE_ISSUE_DATE',
        'Updated',
        to_char(:old."RE_ISSUE_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."SOLICITOR_COSTS" != :new."SOLICITOR_COSTS")
    or (:old."SOLICITOR_COSTS" is null and :new."SOLICITOR_COSTS" is not null)
    or (:old."SOLICITOR_COSTS" is not null and :new."SOLICITOR_COSTS" is null)
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
        'WARRANTS',
        'SOLICITOR_COSTS',
        'Updated',
        to_char(:old."SOLICITOR_COSTS"),
        :old."WARRANT_ID");
    end if;
    if (:old."SOLICITOR_COSTS_CURRENCY" != :new."SOLICITOR_COSTS_CURRENCY")
    or (:old."SOLICITOR_COSTS_CURRENCY" is null and :new."SOLICITOR_COSTS_CURRENCY" is not null)
    or (:old."SOLICITOR_COSTS_CURRENCY" is not null and :new."SOLICITOR_COSTS_CURRENCY" is null)
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
        'WARRANTS',
        'SOLICITOR_COSTS_CURRENCY',
        'Updated',
        :old."SOLICITOR_COSTS_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."TO_TRANSFER" != :new."TO_TRANSFER")
    or (:old."TO_TRANSFER" is null and :new."TO_TRANSFER" is not null)
    or (:old."TO_TRANSFER" is not null and :new."TO_TRANSFER" is null)
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
        'WARRANTS',
        'TO_TRANSFER',
        'Updated',
        :old."TO_TRANSFER",
        :old."WARRANT_ID");
    end if;
    if (:old."TRANSFER_DATE" != :new."TRANSFER_DATE")
    or (:old."TRANSFER_DATE" is null and :new."TRANSFER_DATE" is not null)
    or (:old."TRANSFER_DATE" is not null and :new."TRANSFER_DATE" is null)
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
        'WARRANTS',
        'TRANSFER_DATE',
        'Updated',
        to_char(:old."TRANSFER_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_AMOUNT" != :new."WARRANT_AMOUNT")
    or (:old."WARRANT_AMOUNT" is null and :new."WARRANT_AMOUNT" is not null)
    or (:old."WARRANT_AMOUNT" is not null and :new."WARRANT_AMOUNT" is null)
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
        'WARRANTS',
        'WARRANT_AMOUNT',
        'Updated',
        to_char(:old."WARRANT_AMOUNT"),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_AMOUNT_CURRENCY" != :new."WARRANT_AMOUNT_CURRENCY")
    or (:old."WARRANT_AMOUNT_CURRENCY" is null and :new."WARRANT_AMOUNT_CURRENCY" is not null)
    or (:old."WARRANT_AMOUNT_CURRENCY" is not null and :new."WARRANT_AMOUNT_CURRENCY" is null)
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
        'WARRANTS',
        'WARRANT_AMOUNT_CURRENCY',
        'Updated',
        :old."WARRANT_AMOUNT_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_FEE" != :new."WARRANT_FEE")
    or (:old."WARRANT_FEE" is null and :new."WARRANT_FEE" is not null)
    or (:old."WARRANT_FEE" is not null and :new."WARRANT_FEE" is null)
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
        'WARRANTS',
        'WARRANT_FEE',
        'Updated',
        to_char(:old."WARRANT_FEE"),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_FEE_CURRENCY" != :new."WARRANT_FEE_CURRENCY")
    or (:old."WARRANT_FEE_CURRENCY" is null and :new."WARRANT_FEE_CURRENCY" is not null)
    or (:old."WARRANT_FEE_CURRENCY" is not null and :new."WARRANT_FEE_CURRENCY" is null)
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
        'WARRANTS',
        'WARRANT_FEE_CURRENCY',
        'Updated',
        :old."WARRANT_FEE_CURRENCY",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_ID" != :new."WARRANT_ID")
    or (:old."WARRANT_ID" is null and :new."WARRANT_ID" is not null)
    or (:old."WARRANT_ID" is not null and :new."WARRANT_ID" is null)
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
        'WARRANTS',
        'WARRANT_ID',
        'Updated',
        :old."WARRANT_ID",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_ISSUE_DATE" != :new."WARRANT_ISSUE_DATE")
    or (:old."WARRANT_ISSUE_DATE" is null and :new."WARRANT_ISSUE_DATE" is not null)
    or (:old."WARRANT_ISSUE_DATE" is not null and :new."WARRANT_ISSUE_DATE" is null)
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
        'WARRANTS',
        'WARRANT_ISSUE_DATE',
        'Updated',
        to_char(:old."WARRANT_ISSUE_DATE",'YYYY-MM-DD'),
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_NUMBER" != :new."WARRANT_NUMBER")
    or (:old."WARRANT_NUMBER" is null and :new."WARRANT_NUMBER" is not null)
    or (:old."WARRANT_NUMBER" is not null and :new."WARRANT_NUMBER" is null)
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
        'WARRANTS',
        'WARRANT_NUMBER',
        'Updated',
        :old."WARRANT_NUMBER",
        :old."WARRANT_ID");
    end if;
    if (:old."WARRANT_TYPE" != :new."WARRANT_TYPE")
    or (:old."WARRANT_TYPE" is null and :new."WARRANT_TYPE" is not null)
    or (:old."WARRANT_TYPE" is not null and :new."WARRANT_TYPE" is null)
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
        'WARRANTS',
        'WARRANT_TYPE',
        'Updated',
        :old."WARRANT_TYPE",
        :old."WARRANT_ID");
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
      'WARRANTS',
      null,
      v_type,
      null,
      nvl(:old."WARRANT_ID",:new."WARRANT_ID"));
  end if;
end;
/
SHOW ERRORS;


