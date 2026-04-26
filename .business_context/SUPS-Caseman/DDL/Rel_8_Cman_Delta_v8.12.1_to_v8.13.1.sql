SPOOL PleaseSendToDataArchitectASAP.txt ;


CREATE INDEX XIE7_WARRANTS ON WARRANTS(CASE_NUMBER,LOCAL_WARRANT_NUMBER) online;


CREATE INDEX XEI2_WARRANT_RTNS ON WARRANT_RETURNS (WARRANT_ID,DEFENDANT_ID) online;


CREATE INDEX XIE1_WINDOW_FTRL ON WINDOW_FOR_TRIAL(WFT_CASE_NUMBER) online;


CREATE INDEX XIE8_WARRANTS ON WARRANTS(CASE_NUMBER) online;


insert into dbauser.schemascripts
values
((select user from dual),
  sysdate,
  'Rel_8_Cman_Delta_v8.12.1_to_v8.13.1.sql',
  '8.13.1') ;
commit;

SPOOL OFF;