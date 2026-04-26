drop table tasks_ext;

create table tasks_ext (
TASK_NUMBER                                        VARCHAR2(5),
TASK_TYPE                                          VARCHAR2(1),
TASK_DESCRIPTION                                   VARCHAR2(70),
ACTION_EVENT_IND                                   VARCHAR2(1),
MODIFIED_FLAG                                      VARCHAR2(1),
COUNT_LEVEL                                        VARCHAR2(1),
DUMMY                                              VARCHAR2(25))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
TASK_NUMBER          ,  
TASK_TYPE            , 
TASK_DESCRIPTION   char(70) terminated by ',' optionally enclosed by '"'  ,
ACTION_EVENT_IND     ,
MODIFIED_FLAG        ,  
COUNT_LEVEL          ,
DUMMY  
    ))
  location ('tasks.csv')
);

merge into tasks REF
using 
(select 
TASK_NUMBER          ,  
TASK_TYPE            , 
TASK_DESCRIPTION     ,
ACTION_EVENT_IND     ,
MODIFIED_FLAG        ,  
COUNT_LEVEL                              
from tasks_ext) TMP
on (TMP.TASK_NUMBER = REF.TASK_NUMBER)
when matched then update set
REF.TASK_TYPE = TMP.TASK_TYPE                          ,
REF.TASK_DESCRIPTION = TMP.TASK_DESCRIPTION            ,            
REF.ACTION_EVENT_IND = TMP.ACTION_EVENT_IND            ,     
REF.MODIFIED_FLAG    = TMP.MODIFIED_FLAG               ,           
REF.COUNT_LEVEL      = TMP.COUNT_LEVEL                                                  
when not matched then insert (
TASK_NUMBER            ,
TASK_TYPE              ,
TASK_DESCRIPTION       ,
ACTION_EVENT_IND       ,
MODIFIED_FLAG          ,
COUNT_LEVEL            )
values (
TMP.TASK_NUMBER        ,      
TMP.TASK_TYPE          ,      
TMP.TASK_DESCRIPTION   ,      
TMP.ACTION_EVENT_IND   ,      
TMP.MODIFIED_FLAG      ,      
TMP.COUNT_LEVEL        );

drop table tasks_ext;