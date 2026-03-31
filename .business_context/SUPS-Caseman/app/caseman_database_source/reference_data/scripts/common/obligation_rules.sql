drop table OBLIGATION_RULES_ext;

create table OBLIGATION_RULES_ext (
OBLIGATION_TYPE                                    NUMBER(3),
MECHANISM                                          VARCHAR2(1),
ACTION                                             VARCHAR2(1),
DEFAULT_DAYS                                       NUMBER(3),
DEFAULT_MONTHS                                     NUMBER(3),
EVENT_ID                                           NUMBER(3))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
OBLIGATION_TYPE  ,
MECHANISM        ,
ACTION           ,
DEFAULT_DAYS     ,
DEFAULT_MONTHS   ,
EVENT_ID         
    ))
  location ('obligation_rules.csv')
);

truncate table OBLIGATION_RULES;

merge into OBLIGATION_RULES REF
using 
(select 
EVENT_ID               ,
OBLIGATION_TYPE        ,
MECHANISM              ,
ACTION                 ,
DEFAULT_DAYS           ,
DEFAULT_MONTHS 
from OBLIGATION_RULES_ext) TMP
on (TMP.EVENT_ID = REF.EVENT_ID AND
TMP.OBLIGATION_TYPE = REF.OBLIGATION_TYPE)
when matched then update set
REF.MECHANISM       = TMP.MECHANISM      ,
REF.ACTION          = TMP.ACTION         ,
REF.DEFAULT_DAYS    = TMP.DEFAULT_DAYS   ,
REF.DEFAULT_MONTHS  = TMP.DEFAULT_MONTHS
when not matched then insert (
REF.EVENT_ID,
REF.OBLIGATION_TYPE  ,
REF.MECHANISM,
REF.ACTION,
REF.DEFAULT_DAYS,
REF.DEFAULT_MONTHS)
values (
TMP.EVENT_ID         ,
TMP.OBLIGATION_TYPE  ,
TMP.MECHANISM        ,
TMP.ACTION           ,
TMP.DEFAULT_DAYS     ,
TMP.DEFAULT_MONTHS);

drop table OBLIGATION_RULES_ext;