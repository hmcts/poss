drop table REJECT_REASONS_ext;

create table REJECT_REASONS_ext (
REJECT_CODE NUMBER(22),
REJECT_TEXT VARCHAR2(70))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    characterset WE8MSWIN1252
    fields terminated by ','
    missing field values are null
    (
REJECT_CODE,
REJECT_TEXT  CHAR(70) terminated by ',' optionally enclosed by '"'          
    ))
  location ('reject_reasons.csv')
);

merge into REJECT_REASONS REF
using 
(select 
REJECT_CODE,
REJECT_TEXT 
from REJECT_REASONS_ext) TMP
on (TMP.REJECT_CODE = REF.REJECT_CODE)
when matched then update set
REF.REJECT_TEXT = TMP.REJECT_TEXT
when not matched then insert (
REF.REJECT_CODE,
REF.REJECT_TEXT)
values (
TMP.REJECT_CODE,
TMP.REJECT_TEXT);

drop table REJECT_REASONS_ext;