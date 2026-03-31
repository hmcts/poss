drop table user_role_ext;

create table user_role_ext (
COURT_CODE                                NUMBER(3),
USER_ID                                   VARCHAR2(10 CHAR),
ROLE_ID                                   VARCHAR2(8 CHAR),
DUMMY                                     VARCHAR2(2))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
COURT_CODE,
USER_ID   ,
ROLE_ID   ,
DUMMY
    ))
  location ('mig_user_role.csv')
) reject limit 1;

merge into user_role REF
using 
(select 
COURT_CODE,
USER_ID   ,
ROLE_ID                                     
from user_role_ext) TMP
on (TMP.USER_ID = REF.USER_ID)
when matched then update set
REF.COURT_CODE = TMP.COURT_CODE    ,   
REF.ROLE_ID    = TMP.ROLE_ID                                                         
when not matched then insert (
COURT_CODE,
USER_ID   ,
ROLE_ID           )
values (
TMP.COURT_CODE,
TMP.USER_ID   ,
TMP.ROLE_ID       );

drop table user_role_ext;