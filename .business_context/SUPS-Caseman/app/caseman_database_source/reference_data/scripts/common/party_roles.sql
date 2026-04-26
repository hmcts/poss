drop table party_roles_ext;

create table party_roles_ext (
PARTY_ROLE_CODE                                    VARCHAR2(10),
PARTY_ROLE_DESCRIPTION                             VARCHAR2(100),
REPORTING_ROLE_CODE                                VARCHAR2(20))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
PARTY_ROLE_CODE       , 
PARTY_ROLE_DESCRIPTION,
REPORTING_ROLE_CODE
    ))
  location ('party_roles.csv')
);

merge into party_roles REF
using 
(select 
PARTY_ROLE_CODE       , 
PARTY_ROLE_DESCRIPTION,
REPORTING_ROLE_CODE
from party_roles_ext) TMP
on (TMP.PARTY_ROLE_CODE = REF.PARTY_ROLE_CODE)
when matched then update set
REF.PARTY_ROLE_DESCRIPTION = TMP.PARTY_ROLE_DESCRIPTION,
REF.REPORTING_ROLE_CODE = TMP.REPORTING_ROLE_CODE
when not matched then insert (
REF.PARTY_ROLE_CODE  ,
REF.PARTY_ROLE_DESCRIPTION,
REF.REPORTING_ROLE_CODE)
values (
TMP.PARTY_ROLE_CODE  ,
TMP.PARTY_ROLE_DESCRIPTION,
TMP.REPORTING_ROLE_CODE);

drop table party_roles_ext;