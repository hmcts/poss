Prompt Trigger AUD_CASES;
--
-- AUD_CASES  (Trigger) 
--
--  Dependencies: 
--   CASES (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   SUPS_AMENDMENTS (Table)
--
CREATE OR REPLACE TRIGGER "AUD_CASES"
after update or insert or delete on "CASES"
for each row
declare
  v_userid varchar2(30);
  v_courtid varchar2(4);
  v_processid varchar2(20);
  v_type varchar2(8);
begin
/******************************************************************************/
/*   Audit trigger for table CASES                                            */
/*   Script generated 04-AUG-2007 09:38:39                                    */
/*   From:                                                                    */
/*     Server   csa00072                                                      */
/*     Database supsb                                                         */
/*     User     CMAN     													  */
/*   Change History:														  */
/*     22/01/2013, Chris Vincent.											  */
/*     Added handlers for columns PREF_COURT_CODE, JUDGE and TRACK    		  */
/*     RFS 3719.  Tracks 4763, 4764 and 4768                                  */
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
    if (:old."ADMIN_CRT_CODE" != :new."ADMIN_CRT_CODE")
    or (:old."ADMIN_CRT_CODE" is null and :new."ADMIN_CRT_CODE" is not null)
    or (:old."ADMIN_CRT_CODE" is not null and :new."ADMIN_CRT_CODE" is null)
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
        'CASES',
        'ADMIN_CRT_CODE',
        'Updated',
        to_char(:old."ADMIN_CRT_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."AMOUNT_CLAIMED" != :new."AMOUNT_CLAIMED")
    or (:old."AMOUNT_CLAIMED" is null and :new."AMOUNT_CLAIMED" is not null)
    or (:old."AMOUNT_CLAIMED" is not null and :new."AMOUNT_CLAIMED" is null)
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
        'CASES',
        'AMOUNT_CLAIMED',
        'Updated',
        to_char(:old."AMOUNT_CLAIMED"),
        :old."CASE_NUMBER");
    end if;
    if (:old."AMOUNT_CLAIMED_CURRENCY" != :new."AMOUNT_CLAIMED_CURRENCY")
    or (:old."AMOUNT_CLAIMED_CURRENCY" is null and :new."AMOUNT_CLAIMED_CURRENCY" is not null)
    or (:old."AMOUNT_CLAIMED_CURRENCY" is not null and :new."AMOUNT_CLAIMED_CURRENCY" is null)
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
        'CASES',
        'AMOUNT_CLAIMED_CURRENCY',
        'Updated',
        :old."AMOUNT_CLAIMED_CURRENCY",
        :old."CASE_NUMBER");
    end if;
    if (:old."BRIEF_DETAILS_OF_CLAIM" != :new."BRIEF_DETAILS_OF_CLAIM")
    or (:old."BRIEF_DETAILS_OF_CLAIM" is null and :new."BRIEF_DETAILS_OF_CLAIM" is not null)
    or (:old."BRIEF_DETAILS_OF_CLAIM" is not null and :new."BRIEF_DETAILS_OF_CLAIM" is null)
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
        'CASES',
        'BRIEF_DETAILS_OF_CLAIM',
        'Updated',
        :old."BRIEF_DETAILS_OF_CLAIM",
        :old."CASE_NUMBER");
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
        'CASES',
        'CASE_NUMBER',
        'Updated',
        :old."CASE_NUMBER",
        :old."CASE_NUMBER");
    end if;
    if (:old."CASE_TYPE" != :new."CASE_TYPE")
    or (:old."CASE_TYPE" is null and :new."CASE_TYPE" is not null)
    or (:old."CASE_TYPE" is not null and :new."CASE_TYPE" is null)
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
        'CASES',
        'CASE_TYPE',
        'Updated',
        :old."CASE_TYPE",
        :old."CASE_NUMBER");
    end if;
    if (:old."CJR" != :new."CJR")
    or (:old."CJR" is null and :new."CJR" is not null)
    or (:old."CJR" is not null and :new."CJR" is null)
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
        'CASES',
        'CJR',
        'Updated',
        :old."CJR",
        :old."CASE_NUMBER");
    end if;
    if (:old."COURT_FEE" != :new."COURT_FEE")
    or (:old."COURT_FEE" is null and :new."COURT_FEE" is not null)
    or (:old."COURT_FEE" is not null and :new."COURT_FEE" is null)
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
        'CASES',
        'COURT_FEE',
        'Updated',
        to_char(:old."COURT_FEE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."COURT_FEE_CURRENCY" != :new."COURT_FEE_CURRENCY")
    or (:old."COURT_FEE_CURRENCY" is null and :new."COURT_FEE_CURRENCY" is not null)
    or (:old."COURT_FEE_CURRENCY" is not null and :new."COURT_FEE_CURRENCY" is null)
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
        'CASES',
        'COURT_FEE_CURRENCY',
        'Updated',
        :old."COURT_FEE_CURRENCY",
        :old."CASE_NUMBER");
    end if;
    if (:old."CRED_CODE" != :new."CRED_CODE")
    or (:old."CRED_CODE" is null and :new."CRED_CODE" is not null)
    or (:old."CRED_CODE" is not null and :new."CRED_CODE" is null)
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
        'CASES',
        'CRED_CODE',
        'Updated',
        to_char(:old."CRED_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."DATE_OF_ISSUE" != :new."DATE_OF_ISSUE")
    or (:old."DATE_OF_ISSUE" is null and :new."DATE_OF_ISSUE" is not null)
    or (:old."DATE_OF_ISSUE" is not null and :new."DATE_OF_ISSUE" is null)
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
        'CASES',
        'DATE_OF_ISSUE',
        'Updated',
        to_char(:old."DATE_OF_ISSUE",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
    if (:old."DATE_OF_TRANSFER" != :new."DATE_OF_TRANSFER")
    or (:old."DATE_OF_TRANSFER" is null and :new."DATE_OF_TRANSFER" is not null)
    or (:old."DATE_OF_TRANSFER" is not null and :new."DATE_OF_TRANSFER" is null)
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
        'CASES',
        'DATE_OF_TRANSFER',
        'Updated',
        to_char(:old."DATE_OF_TRANSFER",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
    if (:old."DATE_TRANSFERRED_IN" != :new."DATE_TRANSFERRED_IN")
    or (:old."DATE_TRANSFERRED_IN" is null and :new."DATE_TRANSFERRED_IN" is not null)
    or (:old."DATE_TRANSFERRED_IN" is not null and :new."DATE_TRANSFERRED_IN" is null)
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
        'CASES',
        'DATE_TRANSFERRED_IN',
        'Updated',
        to_char(:old."DATE_TRANSFERRED_IN",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
	if (:old."JUDGE" != :new."JUDGE")
    or (:old."JUDGE" is null and :new."JUDGE" is not null)
    or (:old."JUDGE" is not null and :new."JUDGE" is null)
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
        'CASES',
        'JUDGE',
        'Updated',
        to_char(:old."JUDGE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."MANUAL" != :new."MANUAL")
    or (:old."MANUAL" is null and :new."MANUAL" is not null)
    or (:old."MANUAL" is not null and :new."MANUAL" is null)
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
        'CASES',
        'MANUAL',
        'Updated',
        :old."MANUAL",
        :old."CASE_NUMBER");
    end if;
    if (:old."PARTICULARS_OF_CLAIM" != :new."PARTICULARS_OF_CLAIM")
    or (:old."PARTICULARS_OF_CLAIM" is null and :new."PARTICULARS_OF_CLAIM" is not null)
    or (:old."PARTICULARS_OF_CLAIM" is not null and :new."PARTICULARS_OF_CLAIM" is null)
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
        'CASES',
        'PARTICULARS_OF_CLAIM',
        'Updated',
        :old."PARTICULARS_OF_CLAIM",
        :old."CASE_NUMBER");
    end if;
	if (:old."PREF_COURT_CODE" != :new."PREF_COURT_CODE")
    or (:old."PREF_COURT_CODE" is null and :new."PREF_COURT_CODE" is not null)
    or (:old."PREF_COURT_CODE" is not null and :new."PREF_COURT_CODE" is null)
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
        'CASES',
        'PREF_COURT_CODE',
        'Updated',
        to_char(:old."PREF_COURT_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."PREVIOUS_COURT" != :new."PREVIOUS_COURT")
    or (:old."PREVIOUS_COURT" is null and :new."PREVIOUS_COURT" is not null)
    or (:old."PREVIOUS_COURT" is not null and :new."PREVIOUS_COURT" is null)
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
        'CASES',
        'PREVIOUS_COURT',
        'Updated',
        to_char(:old."PREVIOUS_COURT"),
        :old."CASE_NUMBER");
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
        'CASES',
        'RECEIPT_DATE',
        'Updated',
        to_char(:old."RECEIPT_DATE",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
    end if;
    if (:old."SOLICITORS_COSTS" != :new."SOLICITORS_COSTS")
    or (:old."SOLICITORS_COSTS" is null and :new."SOLICITORS_COSTS" is not null)
    or (:old."SOLICITORS_COSTS" is not null and :new."SOLICITORS_COSTS" is null)
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
        'CASES',
        'SOLICITORS_COSTS',
        'Updated',
        to_char(:old."SOLICITORS_COSTS"),
        :old."CASE_NUMBER");
    end if;
    if (:old."SOLICITORS_COSTS_CURRENCY" != :new."SOLICITORS_COSTS_CURRENCY")
    or (:old."SOLICITORS_COSTS_CURRENCY" is null and :new."SOLICITORS_COSTS_CURRENCY" is not null)
    or (:old."SOLICITORS_COSTS_CURRENCY" is not null and :new."SOLICITORS_COSTS_CURRENCY" is null)
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
        'CASES',
        'SOLICITORS_COSTS_CURRENCY',
        'Updated',
        :old."SOLICITORS_COSTS_CURRENCY",
        :old."CASE_NUMBER");
    end if;
    if (:old."STATUS" != :new."STATUS")
    or (:old."STATUS" is null and :new."STATUS" is not null)
    or (:old."STATUS" is not null and :new."STATUS" is null)
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
        'CASES',
        'STATUS',
        'Updated',
        :old."STATUS",
        :old."CASE_NUMBER");
    end if;
    if (:old."TOTAL" != :new."TOTAL")
    or (:old."TOTAL" is null and :new."TOTAL" is not null)
    or (:old."TOTAL" is not null and :new."TOTAL" is null)
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
        'CASES',
        'TOTAL',
        'Updated',
        to_char(:old."TOTAL"),
        :old."CASE_NUMBER");
    end if;
    if (:old."TOTAL_CURRENCY" != :new."TOTAL_CURRENCY")
    or (:old."TOTAL_CURRENCY" is null and :new."TOTAL_CURRENCY" is not null)
    or (:old."TOTAL_CURRENCY" is not null and :new."TOTAL_CURRENCY" is null)
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
        'CASES',
        'TOTAL_CURRENCY',
        'Updated',
        :old."TOTAL_CURRENCY",
        :old."CASE_NUMBER");
    end if;
	if (:old."TRACK" != :new."TRACK")
    or (:old."TRACK" is null and :new."TRACK" is not null)
    or (:old."TRACK" is not null and :new."TRACK" is null)
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
        'CASES',
        'TRACK',
        'Updated',
        to_char(:old."TRACK"),
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANSFER_REASON" != :new."TRANSFER_REASON")
    or (:old."TRANSFER_REASON" is null and :new."TRANSFER_REASON" is not null)
    or (:old."TRANSFER_REASON" is not null and :new."TRANSFER_REASON" is null)
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
        'CASES',
        'TRANSFER_REASON',
        'Updated',
        :old."TRANSFER_REASON",
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANSFER_STATUS" != :new."TRANSFER_STATUS")
    or (:old."TRANSFER_STATUS" is null and :new."TRANSFER_STATUS" is not null)
    or (:old."TRANSFER_STATUS" is not null and :new."TRANSFER_STATUS" is null)
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
        'CASES',
        'TRANSFER_STATUS',
        'Updated',
        :old."TRANSFER_STATUS",
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANS_CASE_TYPE" != :new."TRANS_CASE_TYPE")
    or (:old."TRANS_CASE_TYPE" is null and :new."TRANS_CASE_TYPE" is not null)
    or (:old."TRANS_CASE_TYPE" is not null and :new."TRANS_CASE_TYPE" is null)
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
        'CASES',
        'TRANS_CASE_TYPE',
        'Updated',
        :old."TRANS_CASE_TYPE",
        :old."CASE_NUMBER");
    end if;
    if (:old."TRANS_CRT_CODE" != :new."TRANS_CRT_CODE")
    or (:old."TRANS_CRT_CODE" is null and :new."TRANS_CRT_CODE" is not null)
    or (:old."TRANS_CRT_CODE" is not null and :new."TRANS_CRT_CODE" is null)
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
        'CASES',
        'TRANS_CRT_CODE',
        'Updated',
        to_char(:old."TRANS_CRT_CODE"),
        :old."CASE_NUMBER");
    end if;
    if (:old."XFER_RECEIPT_DATE" != :new."XFER_RECEIPT_DATE")
    or (:old."XFER_RECEIPT_DATE" is null and :new."XFER_RECEIPT_DATE" is not null)
    or (:old."XFER_RECEIPT_DATE" is not null and :new."XFER_RECEIPT_DATE" is null)
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
        'CASES',
        'XFER_RECEIPT_DATE',
        'Updated',
        to_char(:old."XFER_RECEIPT_DATE",'YYYY-MM-DD'),
        :old."CASE_NUMBER");
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
      'CASES',
      null,
      v_type,
      null,
      nvl(:old."CASE_NUMBER",:new."CASE_NUMBER"));
  end if;
end;
/
SHOW ERRORS;


