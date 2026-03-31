drop table STANDARD_EVENTS_ext;

create table STANDARD_EVENTS_ext (
EVENT_ID                                           NUMBER(3),
CATEGORY                                           VARCHAR2(1),
DESCRIPTION                                        VARCHAR2(70),
DATABASE_EVENT                                     VARCHAR2(1),
RECORD_CARD                                        VARCHAR2(1),
TASK_NUMBER                                        VARCHAR2(5),
CCBC_EVENT_ID                                      NUMBER(3),
CALL_TYPE                                          VARCHAR2(1),
CALL_OPTION                                        VARCHAR2(10),
ADDRESSEE                                          VARCHAR2(1),
EDIT_DETAILS                                       VARCHAR2(1))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
EVENT_ID               ,
CATEGORY               ,
DESCRIPTION            ,
DATABASE_EVENT         ,
RECORD_CARD            ,
TASK_NUMBER            ,
CCBC_EVENT_ID          ,
CALL_TYPE              ,
CALL_OPTION            ,
ADDRESSEE              ,
EDIT_DETAILS
    ))
  location ('standard_events.csv')
);

merge into STANDARD_EVENTS REF
using 
(select 
EVENT_ID               ,
CATEGORY               ,
DESCRIPTION            ,
DATABASE_EVENT         ,
RECORD_CARD            ,
TASK_NUMBER            ,
CCBC_EVENT_ID          ,
CALL_TYPE              ,
CALL_OPTION            ,
ADDRESSEE              ,
EDIT_DETAILS
from standard_events_ext) TMP
on (TMP.EVENT_ID = REF.EVENT_ID)
when matched then update set
REF.CATEGORY = TMP.CATEGORY                             ,
REF.DESCRIPTION = TMP.DESCRIPTION                       ,
REF.DATABASE_EVENT = TMP.DATABASE_EVENT                 ,
REF.RECORD_CARD = TMP.RECORD_CARD                       ,
REF.TASK_NUMBER = TMP.TASK_NUMBER                       ,
REF.CCBC_EVENT_ID = TMP.CCBC_EVENT_ID                   ,
REF.CALL_TYPE = TMP.CALL_TYPE                           ,
REF.CALL_OPTION = TMP.CALL_OPTION                       ,
REF.ADDRESSEE = TMP.ADDRESSEE                           ,
REF.EDIT_DETAILS = TMP.EDIT_DETAILS  
when not matched then insert (
REF.EVENT_ID               ,
REF.CATEGORY               ,
REF.DESCRIPTION            ,
REF.DATABASE_EVENT         ,
REF.RECORD_CARD            ,
REF.TASK_NUMBER            ,
REF.CCBC_EVENT_ID          ,
REF.CALL_TYPE              ,
REF.CALL_OPTION            ,
REF.ADDRESSEE              ,
REF.EDIT_DETAILS   )
values (
TMP.EVENT_ID               ,
TMP.CATEGORY               ,
TMP.DESCRIPTION            ,
TMP.DATABASE_EVENT         ,
TMP.RECORD_CARD            ,
TMP.TASK_NUMBER            ,
TMP.CCBC_EVENT_ID          ,
TMP.CALL_TYPE              ,
TMP.CALL_OPTION            ,
TMP.ADDRESSEE              ,
TMP.EDIT_DETAILS);

drop table STANDARD_EVENTS_ext;