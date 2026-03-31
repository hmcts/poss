drop table party_types_ext;

create table party_types_ext (
PARTY_TYPE_CODE                                    VARCHAR2(10),
PARTY_TYPE_DESCRIPTION                             VARCHAR2(50))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
PARTY_TYPE_CODE       , 
PARTY_TYPE_DESCRIPTION
    ))
  location ('party_types.csv')
);

merge into party_types REF
using 
(select 
PARTY_TYPE_CODE       , 
PARTY_TYPE_DESCRIPTION
from party_types_ext) TMP
on (TMP.PARTY_TYPE_CODE = REF.PARTY_TYPE_CODE)
when matched then update set
REF.PARTY_TYPE_DESCRIPTION = TMP.PARTY_TYPE_DESCRIPTION
when not matched then insert (
REF.PARTY_TYPE_CODE  ,
REF.PARTY_TYPE_DESCRIPTION)
values (
TMP.PARTY_TYPE_CODE  ,
TMP.PARTY_TYPE_DESCRIPTION);

drop table party_types_ext;