Prompt Trigger AUDIT_INSERT_WARRANTS;
--
-- AUDIT_INSERT_WARRANTS  (Trigger) 
--
--  Dependencies: 
--   WARRANTS (Table)
--   STANDARD (Package)
--   CCBC_EVENTS (Package)
--
CREATE OR REPLACE TRIGGER audit_insert_warrants
after insert on warrants
for each row
DECLARE
v_userid VARCHAR2(16);

BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN

if :new.currently_owned_by = 335 then
  ccbc_events.insert_event_dbp(:new.case_number
                               ,'380'
                               ,:new.def1_case_party_no
                               ,:new.def1_party_role_code
                               ,null
                               ,null
                               ,:new.warrant_id
                               ,null
                               ,null
                               ,'N'
                               ,null);
end if;

END IF;
end;
/
SHOW ERRORS;


