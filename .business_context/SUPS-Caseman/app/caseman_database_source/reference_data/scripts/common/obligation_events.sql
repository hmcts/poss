drop table OBLIGATION_EVENTS_ext;

create table OBLIGATION_EVENTS_ext (
EVENT_ID                                   NUMBER(3),
MAINTENANCE_MODE                           VARCHAR2(1))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
EVENT_ID        ,       
MAINTENANCE_MODE
    ))
  location ('obligation_events.csv')
);

truncate table OBLIGATION_EVENTS;

merge into OBLIGATION_EVENTS REF
using 
(select 
EVENT_ID         ,
MAINTENANCE_MODE 
FROM OBLIGATION_EVENTS_ext) TMP
on (TMP.EVENT_ID = REF.EVENT_ID)
when matched then update set
REF.MAINTENANCE_MODE = TMP.MAINTENANCE_MODE
when not matched then insert (
REF.EVENT_ID   ,
REF.MAINTENANCE_MODE)
values (
TMP.EVENT_ID  ,
TMP.MAINTENANCE_MODE);

drop table OBLIGATION_EVENTS_ext;