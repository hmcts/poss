drop table system_data_ext;

create table system_data_ext (
ITEM                                       VARCHAR2(30),
ITEM_VALUE                                 NUMBER(38,2),
ITEM_VALUE_CURRENCY                        VARCHAR2(3) ,
ADMIN_COURT_CODE                           NUMBER(3))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
ITEM                 ,  
ITEM_VALUE           ,  
ITEM_VALUE_CURRENCY  ,
ADMIN_COURT_CODE                 
    ))
  location ('system_data.csv')
) reject limit 1 ;


delete from SYSTEM_DATA where ADMIN_COURT_CODE = '0';


merge into system_data REF
using 
(select 
ITEM                 ,  
ITEM_VALUE           ,  
ITEM_VALUE_CURRENCY  ,
ADMIN_COURT_CODE                                          
from system_data_ext) TMP
on (TMP.ITEM = REF.ITEM and
    REF.ADMIN_COURT_CODE    = TMP.ADMIN_COURT_CODE)
when matched then update set
REF.ITEM_VALUE          = TMP.ITEM_VALUE         ,
REF.ITEM_VALUE_CURRENCY = TMP.ITEM_VALUE_CURRENCY                                                      
when not matched then insert (
ITEM                  , 
ITEM_VALUE            , 
ITEM_VALUE_CURRENCY   ,
ADMIN_COURT_CODE      )
values (
TMP.ITEM                ,   
TMP.ITEM_VALUE          ,   
TMP.ITEM_VALUE_CURRENCY ,
TMP.ADMIN_COURT_CODE    );

drop table system_data_ext;


