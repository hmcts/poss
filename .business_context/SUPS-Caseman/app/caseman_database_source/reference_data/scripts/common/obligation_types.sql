drop table OBLIGATION_TYPES_ext;

create table OBLIGATION_TYPES_ext (
OBLIGATION_TYPE                            NUMBER(3)   ,
OBLIGATION_TEXT                            VARCHAR2(60),
MULTI_USE                                  VARCHAR2(1))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
OBLIGATION_TYPE        ,
OBLIGATION_TEXT        ,
MULTI_USE              
    ))
  location ('obligation_types.csv')
);

-- delete from OBLIGATION_TYPES;
-- commit;

merge into OBLIGATION_TYPES REF
using 
(select 
OBLIGATION_TYPE        ,
OBLIGATION_TEXT        ,
MULTI_USE               
FROM OBLIGATION_TYPES_ext) TMP
on (TMP.OBLIGATION_TYPE = REF.OBLIGATION_TYPE)
when matched then update set
REF.OBLIGATION_TEXT = TMP.OBLIGATION_TEXT,
REF.MULTI_USE       = TMP.MULTI_USE
when not matched then insert (
REF.OBLIGATION_TYPE   ,
REF.OBLIGATION_TEXT   ,
REF.MULTI_USE)
values (
TMP.OBLIGATION_TYPE  ,
TMP.OBLIGATION_TEXT  ,
TMP.MULTI_USE);

drop table OBLIGATION_TYPES_ext;