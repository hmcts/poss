drop table address_types_ext;

create table address_types_ext (
ADDRESS_TYPE_CODE                         VARCHAR2(15),
ADDRESS_TYPE_DESCRIPTION                           VARCHAR2(100))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
       ADDRESS_TYPE_CODE ,             
 ADDRESS_TYPE_DESCRIPTION
    ))
  location ('address_types.csv')
);

merge into address_types REF
using 
(select ADDRESS_TYPE_CODE,
ADDRESS_TYPE_DESCRIPTION 
from address_types_ext) TMP
on (TMP.ADDRESS_TYPE_CODE = REF.ADDRESS_TYPE_CODE)
when matched then update set
REF.ADDRESS_TYPE_DESCRIPTION = TMP.ADDRESS_TYPE_DESCRIPTION 
when not matched then insert (REF.ADDRESS_TYPE_CODE ,REF.ADDRESS_TYPE_DESCRIPTION)
values (TMP.ADDRESS_TYPE_CODE ,TMP.ADDRESS_TYPE_DESCRIPTION);

drop table address_types_ext;