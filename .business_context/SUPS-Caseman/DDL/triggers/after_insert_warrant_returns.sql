Prompt Trigger AFTER_INSERT_WARRANT_RETURNS;
--
-- AFTER_INSERT_WARRANT_RETURNS  (Trigger) 
--
--  Dependencies: 
--   WARRANT_RETURNS (Table)
--   STANDARD (Package)
--   MCOL_DATA (Table)
--   WARRANTS (Table)
--   CCBC_EVENTS (Package)
--   MCOL_SUPS_CCBC_PACKAGE (Package)
--
CREATE OR REPLACE TRIGGER after_insert_warrant_returns
after insert on warrant_returns
for each row
DECLARE
v_userid VARCHAR2(16);

case_number varchar2(8);
warrant_number varchar2(8);
BEGIN
v_userid := sys_context('sups_app_ctx','app_user_id');
IF  v_userid = 'CCBC_BATCH'
    OR v_userid = 'CCBC_OPS'
    OR v_userid = 'CCBC_CAT'   THEN

select case_number into case_number
from warrants
where warrant_id= :new.warrant_id;

select warrant_number into warrant_number
from warrants
where warrant_id= :new.warrant_id;

ccbc_events.insert_event_dbp(case_number
                                 ,'620'
                                 ,:new.defendant_id
                                 ,'DEFENDANT'
                                 ,null
                                 ,'Return Code '||to_char(:new.return_code)
                                 ,:new.warrant_id
                                 ,null
                                 ,null
                                 ,'N'
                                 ,null);

/* track ticket #5102 now inform MCOL of warrants for all cases */ 
   insert into mcol_data
      (claim_number, deft_id, type, event_date,
       warrant_number, return_code, return_info)
   values
      (case_number
       ,:new.defendant_id
       ,'FR'
       ,:new.warrant_return_date
       ,warrant_number
       ,:new.return_code
       ,:new.additional_information);

       END IF;
end;
/
SHOW ERRORS;


