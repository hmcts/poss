drop table event_outputs_ext;

create table event_outputs_ext (
STD_EVENT_ID                                       NUMBER(3),
ORDER_TYPE_ID                                      VARCHAR2(20),
CODE                                               NUMBER(4),
ISSUE_STAGE                                        VARCHAR2(3),
dummy                                              varchar2(2))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
STD_EVENT_ID   ,
ORDER_TYPE_ID  ,
CODE           ,
ISSUE_STAGE    ,
dummy
    ))
  location ('event_outputs.csv')
);

merge into event_outputs REF
using 
(select 
STD_EVENT_ID   ,
ORDER_TYPE_ID  ,
CODE           ,
ISSUE_STAGE
from event_outputs_ext) TMP
on (TMP.STD_EVENT_ID    = REF.STD_EVENT_ID   and
TMP.ORDER_TYPE_ID = REF.ORDER_TYPE_ID)
when matched then update set
REF.CODE = TMP.CODE                             ,
REF.ISSUE_STAGE= TMP.ISSUE_STAGE  
when not matched then insert (
REF.STD_EVENT_ID               ,
REF.ORDER_TYPE_ID               ,
REF.CODE ,
REF.ISSUE_STAGE   )
values (
TMP.STD_EVENT_ID               ,
TMP.ORDER_TYPE_ID                              ,
TMP.CODE ,
TMP.ISSUE_STAGE  );

drop table event_outputs_ext;