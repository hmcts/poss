Prompt Trigger UPDATE_VARIATION_EVENT;
--
-- UPDATE_VARIATION_EVENT  (Trigger) 
--
--  Dependencies: 
--   VARIATIONS (Table)
--   STANDARD (Package)
--   DBMS_STANDARD (Package)
--   CCBC_EVENTS (Package)
--
CREATE OR REPLACE TRIGGER update_variation_event
after update on variations
for each row
DECLARE
v_userid VARCHAR2(16);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN

if updating ('result') then
    ccbc_events.update_event_dbp (:new.vary_seq, :new.requester, :new.result);
end if;

END IF;
END;
/
SHOW ERRORS;


