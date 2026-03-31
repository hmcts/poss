drop table ITEM_DETAILS_ext;

create table ITEM_DETAILS_ext (
CODE                                               NUMBER(5)    ,
ORDER_TYPE_ID                                      VARCHAR2(20) ,
LIST                                               VARCHAR2(1)  , 
ITEM_DEFAULT                                       VARCHAR2(50) ,
FORMAT                                             VARCHAR2(8)  ,
PROMPT                                             VARCHAR2(40) ,
VALS_SYSDATE                                       VARCHAR2(1)  ,
MANDATORY                                          VARCHAR2(1)  ,
HINT_LINE                                          VARCHAR2(70) ,
DOMAIN                                             VARCHAR2(20) ,
STORAGE_COLUMN                                     VARCHAR2(30) ,
STORAGE_TABLE                                      VARCHAR2(30) ,
dummy                                              VARCHAR2(2))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
CODE           ,
ORDER_TYPE_ID  ,
LIST           ,
ITEM_DEFAULT   ,
FORMAT         ,
PROMPT       CHAR(40) terminated by ',' optionally enclosed by '"'  ,
VALS_SYSDATE   ,
MANDATORY      ,
HINT_LINE    CHAR(70) terminated by ',' optionally enclosed by '"'  ,
DOMAIN                                                              ,
STORAGE_COLUMN,
STORAGE_TABLE,
dummy                                     
    ))
  location ('item_details.csv')
);

merge into ITEM_DETAILS REF
using 
(select 
CODE           ,
ORDER_TYPE_ID  ,
LIST           ,
ITEM_DEFAULT   ,
FORMAT         ,
PROMPT         ,
VALS_SYSDATE   ,
MANDATORY      ,
HINT_LINE      ,
DOMAIN         ,
STORAGE_COLUMN,
STORAGE_TABLE          
from ITEM_DETAILS_ext) TMP
on (TMP.CODE = REF.CODE)
when matched then update set
REF.ORDER_TYPE_ID = TMP.ORDER_TYPE_ID  ,
REF.LIST          = TMP.LIST           ,
REF.ITEM_DEFAULT  = TMP.ITEM_DEFAULT   ,
REF.FORMAT        = TMP.FORMAT         ,
REF.PROMPT        = TMP.PROMPT         ,
REF.VALS_SYSDATE  = TMP.VALS_SYSDATE   , 
REF.MANDATORY     = TMP.MANDATORY      ,
REF.HINT_LINE     = TMP.HINT_LINE      ,
REF.DOMAIN        = TMP.DOMAIN ,
REF.STORAGE_COLUMN= TMP.STORAGE_COLUMN,
REF.STORAGE_TABLE = TMP.STORAGE_TABLE    
when not matched then insert (
REF.CODE           ,
REF.ORDER_TYPE_ID  ,
REF.LIST           ,
REF.ITEM_DEFAULT   ,
REF.FORMAT         ,
REF.PROMPT         ,
REF.VALS_SYSDATE   ,
REF.MANDATORY      ,
REF.HINT_LINE      ,
REF.DOMAIN         ,
REF.STORAGE_COLUMN,
REF.STORAGE_TABLE     )
values (
TMP.CODE           ,
TMP.ORDER_TYPE_ID  ,
TMP.LIST           ,
TMP.ITEM_DEFAULT   ,
TMP.FORMAT         ,
TMP.PROMPT         ,
TMP.VALS_SYSDATE   ,
TMP.MANDATORY      ,
TMP.HINT_LINE      ,
TMP.DOMAIN         ,
TMP.STORAGE_COLUMN ,
TMP.STORAGE_TABLE);

drop table ITEM_DETAILS_ext;