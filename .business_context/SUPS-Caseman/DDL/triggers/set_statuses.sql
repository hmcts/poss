Prompt Trigger SET_STATUSES;
--
-- SET_STATUSES  (Trigger) 
--
--  Dependencies: 
--   CASE_EVENTS (Table)
--   STANDARD (Package)
--   CASE_EVENT_INSTIGATORS (Table)
--   CCBC_STATUSES (Package)
--
CREATE OR REPLACE TRIGGER set_statuses
after insert on case_events
for each row
DECLARE
v_userid VARCHAR2(16);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN
    insert into CASE_EVENT_INSTIGATORS
    (EVENT_SEQ, CASE_NUMBER, CASE_PARTY_NO, PARTY_ROLE_CODE, DELETE_FLAG)
    values
    (:new.EVENT_SEQ, :new.CASE_NUMBER, 1, 'CLAIMANT', 'N');
  IF :new.std_event_id = 74 THEN
	IF :new.case_party_no IS NOT NULL THEN
		IF ccbc_statuses.discon_flag = 'Y' THEN
			ccbc_statuses.discon_flag := 'N';
			ccbc_statuses.case_status_dbp('SETTLED/WDRN', :new.case_number);
		END IF;
		ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'Y');
		INSERT INTO MCOL_DATA
			(CLAIM_NUMBER, TYPE, EVENT_DATE, DEFT_ID)
		VALUES
			(:new.case_number,'DI', sysdate, :new.case_party_no);
	ELSE
		ccbc_statuses.case_status_dbp('SETTLED/WDRN', :new.case_number);
		ccbc_statuses.bar_judg_all_dbp(:new.case_number, 'Y');
		INSERT INTO MCOL_DATA
			(CLAIM_NUMBER, TYPE, EVENT_DATE)
		VALUES
			(:new.case_number,'DI', sysdate);
	END IF;
  ELSIF :new.std_event_id in (73, 76) THEN
	IF :new.case_party_no IS NOT NULL THEN
		IF ccbc_statuses.settled_flag = 'Y' THEN
			ccbc_statuses.settled_flag := 'N';
			ccbc_statuses.case_status_dbp('SETTLED', :new.case_number);
		END IF;
		ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'Y');
		INSERT INTO MCOL_DATA
			(CLAIM_NUMBER, TYPE, EVENT_DATE, DEFT_ID)
		VALUES
			(:new.case_number,'WD', sysdate, :new.case_party_no);
	ELSE
		ccbc_statuses.case_status_dbp('SETTLED', :new.case_number);
		ccbc_statuses.bar_judg_all_dbp(:new.case_number, 'Y');
		INSERT INTO MCOL_DATA
			(CLAIM_NUMBER, TYPE, EVENT_DATE)
		VALUES
			(:new.case_number,'WD', sysdate);
	END IF;
  ELSIF :new.std_event_id = 160 THEN
    -- BIF Change lifts bar on Judgements
    ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'N');
  ELSIF :new.std_event_id in (752, 754) THEN
    ccbc_statuses.case_status_dbp('STAYED', :new.case_number);
  ELSIF :new.std_event_id = 756 THEN
    ccbc_statuses.case_status_dbp('', :new.case_number);
  ELSIF :new.std_event_id IN ( 50, 52, 60) THEN
    -- set the bar for these events submitted via MCOL
    ccbc_statuses.bar_judg_dbp(:new.case_number, :new.case_party_no, 'Y');
  END IF;
END IF;
END;
/
SHOW ERRORS;