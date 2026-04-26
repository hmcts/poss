drop table per_details_ext;

create table per_details_ext (
DETAIL_CODE      VARCHAR2(10), 
PER_GROUP        VARCHAR2(1), 
PER_CATEGORY     VARCHAR2(1), 
ALLOW_MULTIPLES  VARCHAR2(1), 
ORDER_NUMBER     NUMBER(2), 
PROMPT           VARCHAR2(60))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
DETAIL_CODE      , 
PER_GROUP        , 
PER_CATEGORY     , 
ALLOW_MULTIPLES  , 
ORDER_NUMBER     , 
PROMPT               ))
  location ('per_details.csv')
) reject limit 1 ;

merge into per_details REF
using 
(select 
DETAIL_CODE      , 
PER_GROUP        , 
PER_CATEGORY     , 
ALLOW_MULTIPLES  , 
ORDER_NUMBER     , 
PROMPT              
from per_details_ext) TMP
on (TMP.DETAIL_CODE = REF.DETAIL_CODE)
when matched then update set
REF.PER_GROUP        = TMP.PER_GROUP      , 
REF.PER_CATEGORY     = TMP.PER_CATEGORY   , 
REF.ALLOW_MULTIPLES  = TMP.ALLOW_MULTIPLES, 
REF.ORDER_NUMBER     = TMP.ORDER_NUMBER   , 
REF.PROMPT           = TMP.PROMPT            
when not matched then insert (
DETAIL_CODE      , 
PER_GROUP        , 
PER_CATEGORY     , 
ALLOW_MULTIPLES  , 
ORDER_NUMBER     , 
PROMPT              )
values (
TMP.DETAIL_CODE    , 
TMP.PER_GROUP      , 
TMP.PER_CATEGORY   , 
TMP.ALLOW_MULTIPLES, 
TMP.ORDER_NUMBER   , 
TMP.PROMPT            );

drop table per_details_ext;
