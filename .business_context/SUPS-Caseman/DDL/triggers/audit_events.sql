Prompt Trigger AUDIT_EVENTS;
--
-- AUDIT_EVENTS  (Trigger) 
--
--  Dependencies: 
--   CASE_EVENTS (Table)
--   STANDARD (Package)
--   CCBC_STATUSES (Package)
--
CREATE OR REPLACE TRIGGER audit_events
after update on case_events
for each row
DECLARE
v_userid VARCHAR2(16);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN
  IF :new.std_event_id = 140 AND
     :new.result IS NOT NULL AND :old.result IS NULL THEN
       ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'N');
  END IF;
END IF;
END;
/
SHOW ERRORS;


