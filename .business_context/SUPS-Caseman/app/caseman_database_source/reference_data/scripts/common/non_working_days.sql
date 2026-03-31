drop table NON_WORKING_DAYS_ext;

create table NON_WORKING_DAYS_ext (
NON_WD_SEQ                                         NUMBER(3)   ,
NON_WORKING_DATE                                   DATE        ,
USERNAME                                           VARCHAR2(30),
CREATION_DATE                                      DATE        ,
NOTES                                              VARCHAR2(30),
ERROR_INDICATOR                                    VARCHAR2(1) ,
UPDATED                                            VARCHAR2(1))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
NON_WD_SEQ            ,
NON_WORKING_DATE      , 
USERNAME              , 
CREATION_DATE         , 
NOTES                 , 
ERROR_INDICATOR       , 
UPDATED                      
    ))
  location ('non_working_days.csv')
);

merge into NON_WORKING_DAYS REF
using 
(select 
NON_WD_SEQ            ,
NON_WORKING_DATE      , 
USERNAME              , 
CREATION_DATE         , 
NOTES                 , 
ERROR_INDICATOR          
from NON_WORKING_DAYS_ext) TMP
on (TMP.NON_WD_SEQ = REF.NON_WD_SEQ)
when matched then update set
REF.NON_WORKING_DATE = TMP.NON_WORKING_DATE ,
REF.USERNAME = TMP.USERNAME                 ,
REF.CREATION_DATE = TMP.CREATION_DATE       ,
REF.NOTES = TMP.NOTES                       ,
REF.ERROR_INDICATOR = TMP.ERROR_INDICATOR                      
when not matched then insert (
REF.NON_WD_SEQ            ,
REF.NON_WORKING_DATE      , 
REF.USERNAME              , 
REF.CREATION_DATE         , 
REF.NOTES                 , 
REF.ERROR_INDICATOR      )
values (
TMP.NON_WD_SEQ            ,
TMP.NON_WORKING_DATE      , 
TMP.USERNAME              , 
TMP.CREATION_DATE         , 
TMP.NOTES                 , 
TMP.ERROR_INDICATOR      );

drop table NON_WORKING_DAYS_ext;