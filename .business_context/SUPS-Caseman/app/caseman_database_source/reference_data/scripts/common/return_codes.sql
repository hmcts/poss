drop table RETURN_CODES_ext;

create table RETURN_CODES_ext (
RETURN_CATEGORY                            VARCHAR2(1),
RETURN_CODE                                VARCHAR2(3),
RETURN_TYPE                                VARCHAR2(1),
RETURN_CLASS                               VARCHAR2(1),
RETURN_CODE_DESCRIPTION                    VARCHAR2(1000),
RETURN_CODE_SUMMARY                        VARCHAR2(80),
CURRENT_RETURN                             VARCHAR2(1),
USER_LIST                                  VARCHAR2(1),
NEW_RETURN_CODE                            VARCHAR2(3),
ADMIN_COURT_CODE                           NUMBER(3))
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
RETURN_CATEGORY        ,
RETURN_CODE            , 
RETURN_TYPE            , 
RETURN_CLASS           , 
RETURN_CODE_DESCRIPTION CHAR(1000) terminated by ',' optionally enclosed by '"',
RETURN_CODE_SUMMARY     CHAR(80)   terminated by ',' optionally enclosed by '"',
CURRENT_RETURN         ,
USER_LIST               CHAR(1)   terminated by ',' optionally enclosed by '"',
NEW_RETURN_CODE        ,
ADMIN_COURT_CODE       
    ))
  location ('return_codes.csv')
) reject limit 1 ;

merge into RETURN_CODES REF
using 
(select 
RETURN_CATEGORY        ,
RETURN_CODE            , 
RETURN_TYPE            , 
RETURN_CLASS           , 
RETURN_CODE_DESCRIPTION,
RETURN_CODE_SUMMARY    ,
CURRENT_RETURN         ,
USER_LIST              ,
NEW_RETURN_CODE        ,
ADMIN_COURT_CODE      
from RETURN_CODES_ext) TMP
on (TMP.RETURN_CODE = REF.RETURN_CODE AND
   TMP.ADMIN_COURT_CODE = REF.ADMIN_COURT_CODE)
when matched then update set
REF.RETURN_CATEGORY = TMP.RETURN_CATEGORY                  ,
REF.RETURN_TYPE = TMP.RETURN_TYPE                          ,
REF.RETURN_CLASS = TMP.RETURN_CLASS                        ,
REF.RETURN_CODE_DESCRIPTION = TMP.RETURN_CODE_DESCRIPTION  ,
REF.RETURN_CODE_SUMMARY = TMP.RETURN_CODE_SUMMARY          ,
REF.CURRENT_RETURN = TMP.CURRENT_RETURN                    ,
REF.USER_LIST = TMP.USER_LIST                              ,
REF.NEW_RETURN_CODE = TMP.NEW_RETURN_CODE                       
when not matched then insert (
REF.RETURN_CATEGORY        ,
REF.RETURN_CODE            , 
REF.RETURN_TYPE            , 
REF.RETURN_CLASS           , 
REF.RETURN_CODE_DESCRIPTION,
REF.RETURN_CODE_SUMMARY    ,
REF.CURRENT_RETURN         ,
REF.USER_LIST              ,
REF.NEW_RETURN_CODE        ,
REF.ADMIN_COURT_CODE       )
values (
TMP.RETURN_CATEGORY        ,
TMP.RETURN_CODE            , 
TMP.RETURN_TYPE            , 
TMP.RETURN_CLASS           , 
TMP.RETURN_CODE_DESCRIPTION,
TMP.RETURN_CODE_SUMMARY    ,
TMP.CURRENT_RETURN         ,
TMP.USER_LIST              ,
TMP.NEW_RETURN_CODE        ,
TMP.ADMIN_COURT_CODE);

drop table RETURN_CODES_ext;