drop table task_types_ext;

create table task_types_ext (
 TASK_TYPE                                          VARCHAR2(1),
 CATAGORISE                                         VARCHAR2(1))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
TASK_TYPE      ,
CATAGORISE                 
    ))
  location ('task_types.csv')
);

merge into task_types REF
using 
(select 
TASK_TYPE      ,
CATAGORISE                                   
from task_types_ext) TMP
on (TMP.TASK_TYPE = REF.TASK_TYPE)
when matched then update set
REF.CATAGORISE = TMP.CATAGORISE                                                          
when not matched then insert (
TASK_TYPE            ,
CATAGORISE           )
values (
TMP.TASK_TYPE        ,      
TMP.CATAGORISE       );

drop table task_types_ext;