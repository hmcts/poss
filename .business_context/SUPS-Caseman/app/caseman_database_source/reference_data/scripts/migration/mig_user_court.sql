drop table user_court_ext;

create table user_court_ext (
COURT_CODE                                NUMBER(3),
USER_ID                                   VARCHAR2(10 CHAR),
staff_id                                  VARCHAR2(10 CHAR),
crest_user_id                             VARCHAR2(10 CHAR),
DATE_FROM                                 DATE,
DATE_TO                                   DATE,
HOME_FLAG                                 VARCHAR2(1 CHAR),
section_name                              varchar2(30),
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
staff_id   ,
crest_user_id,
DATE_FROM,
DATE_TO,
HOME_FLAG,
SECTION_NAME,
DUMMY
    ))
  location ('mig_user_court.csv')
) reject limit 1;

merge into user_court REF
using 
(select 
COURT_CODE,
USER_ID   ,
DATE_FROM,
DATE_TO,
HOME_FLAG,
SECTION_NAME                                     
from user_court_ext) TMP
on (TMP.USER_ID = REF.USER_ID AND
    TMP.COURT_CODE = REF.COURT_CODE)
when matched then update set
REF.DATE_FROM  = TMP.DATE_FROM    ,   
REF.DATE_TO    = TMP.DATE_TO      ,
REF.HOME_FLAG  = TMP.HOME_FLAG    ,
REF.SECTION_NAME = TMP.SECTION_NAME
when not matched then insert (
COURT_CODE,
USER_ID   ,
DATE_FROM,
DATE_TO,
HOME_FLAG,
SECTION_NAME           )
values (
TMP.COURT_CODE,
TMP.USER_ID   ,
TMP.DATE_FROM,
TMP.DATE_TO,
TMP.HOME_FLAG,
TMP.SECTION_NAME       );

drop table user_court_ext;