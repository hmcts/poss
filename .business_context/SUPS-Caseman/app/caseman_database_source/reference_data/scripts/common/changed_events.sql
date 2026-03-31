drop table CHANGED_EVENTS_ext;

create table CHANGED_EVENTS_ext (
STD_EVENT_ID                               NUMBER(3),
RELEASE_DATE                               DATE,
FINAL_DATE                                 DATE,
EVENT_DESCRIPTION                          VARCHAR2(100))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
STD_EVENT_ID,
RELEASE_DATE,
FINAL_DATE,
EVENT_DESCRIPTION
    ))
  location ('changed_events.csv')
);

merge into CHANGED_EVENTS REF
using 
(select 
STD_EVENT_ID,
RELEASE_DATE,
FINAL_DATE,
EVENT_DESCRIPTION
from CHANGED_EVENTS_ext) TMP
on (TMP.STD_EVENT_ID = REF.STD_EVENT_ID AND
    TMP.RELEASE_DATE = REF.RELEASE_DATE)
when matched then update set
REF.FINAL_DATE = TMP.FINAL_DATE                         ,
REF.EVENT_DESCRIPTION = TMP.EVENT_DESCRIPTION
when not matched then insert (
REF.STD_EVENT_ID       ,
REF.RELEASE_DATE       ,
REF.FINAL_DATE         ,
REF.EVENT_DESCRIPTION  )
values (
TMP.STD_EVENT_ID       ,
TMP.RELEASE_DATE       ,
TMP.FINAL_DATE         ,
TMP.EVENT_DESCRIPTION) ;

drop table CHANGED_EVENTS_ext;