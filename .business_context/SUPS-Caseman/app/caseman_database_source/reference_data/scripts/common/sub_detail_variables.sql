drop table sub_detail_variables_ext;

create table sub_detail_variables_ext (SDV_SEQ     NUMBER(9),
OD_SEQ                                             NUMBER(9),
SUB_ITEM_NUMBER                                    VARCHAR2(2),
VARIABLE_CODE                                      VARCHAR2(30),
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
SDV_SEQ   ,     
OD_SEQ         ,
SUB_ITEM_NUMBER,
VARIABLE_CODE  ,
dummy 
    ))
  location ('sub_detail_variables.csv')
);




merge into sub_detail_variables REF
using 
(select 
SDV_SEQ   ,     
OD_SEQ         ,
SUB_ITEM_NUMBER,
VARIABLE_CODE      
from sub_detail_variables_ext) TMP
on (TMP.SDV_SEQ = REF.SDV_SEQ )
when matched then update set
REF.OD_SEQ = TMP.OD_SEQ                          ,
REF.SUB_ITEM_NUMBER = TMP.SUB_ITEM_NUMBER                        ,
REF.VARIABLE_CODE = TMP.VARIABLE_CODE                       
when not matched then insert (
REF.SDV_SEQ        ,
REF.OD_SEQ            , 
REF.SUB_ITEM_NUMBER            , 
REF.VARIABLE_CODE           )
values (
TMP.SDV_SEQ        ,
TMP.OD_SEQ            , 
TMP.SUB_ITEM_NUMBER            , 
TMP.VARIABLE_CODE);


drop table sub_detail_variables_ext;