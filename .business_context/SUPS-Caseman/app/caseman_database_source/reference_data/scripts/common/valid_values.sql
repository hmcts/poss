drop table VALID_VALUES_ext;

create table VALID_VALUES_ext (
VALS_SEQ                                           NUMBER(9)     ,
VALS_DETAILS_CODE                                  NUMBER(5)     ,
VALS_HIGH_VALUE                                    VARCHAR2(30)  ,
VALS_LOW_VALUE                                     VARCHAR2(80)  ,
DESCRIPTION                                        VARCHAR2(500) ,
dummy                                              VARCHAR2(2))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
VALS_SEQ               ,
VALS_DETAILS_CODE      ,
VALS_HIGH_VALUE        ,
VALS_LOW_VALUE         ,
DESCRIPTION         CHAR(500) terminated by ',' optionally enclosed by '"'   ,
DUMMY                 
    ))
  location ('valid_values.csv')
);

merge into VALID_VALUES REF
using 
(select 
VALS_SEQ               ,
VALS_DETAILS_CODE      ,
VALS_HIGH_VALUE        ,
VALS_LOW_VALUE         ,
DESCRIPTION                  
from VALID_VALUES_ext) TMP
on (TMP.VALS_DETAILS_CODE = REF.VALS_DETAILS_CODE AND
TMP.VALS_LOW_VALUE = REF.VALS_LOW_VALUE)
when matched then update set
REF.VALS_SEQ          = TMP.VALS_SEQ         ,
REF.VALS_HIGH_VALUE   = TMP.VALS_HIGH_VALUE  ,
REF.DESCRIPTION       = TMP.DESCRIPTION      
when not matched then insert (
REF.VALS_SEQ               ,
REF.VALS_DETAILS_CODE      ,
REF.VALS_HIGH_VALUE        ,
REF.VALS_LOW_VALUE         ,
REF.DESCRIPTION             )
values (
TMP.VALS_SEQ               ,
TMP.VALS_DETAILS_CODE      ,
TMP.VALS_HIGH_VALUE        ,
TMP.VALS_LOW_VALUE         ,
TMP.DESCRIPTION  );

drop table VALID_VALUES_ext;