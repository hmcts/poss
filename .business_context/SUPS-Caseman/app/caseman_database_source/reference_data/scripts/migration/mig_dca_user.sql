drop table dca_user_ext;

create table dca_user_ext (
 USER_ID                             VARCHAR2(10),
 TITLE                               VARCHAR2(35),
 FORENAMES                           VARCHAR2(70),
 SURNAME                             VARCHAR2(35),
 USER_SHORT_NAME                     VARCHAR2(20 CHAR),
 JOB_TITLE                           VARCHAR2(35),
 EXTENSION                           VARCHAR2(40),
 ACCESS_SECURITY_LEVEL               NUMBER(1),
 USER_DEFAULT_PRINTER                VARCHAR2(64),
 USER_STYLE_PROFILE                  VARCHAR2(25),
 ACTIVE_USER_FLAG                    VARCHAR2(1),
 SECTION_FOR_PRINTOUTS               VARCHAR2(25),
 DUMMY                               VARCHAR2(2)
)
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
 USER_ID     ,
 TITLE       ,
 FORENAMES   ,
 SURNAME     ,
 USER_SHORT_NAME ,
 JOB_TITLE       ,
 EXTENSION       ,
 ACCESS_SECURITY_LEVEL  ,
 USER_DEFAULT_PRINTER   ,
 USER_STYLE_PROFILE     ,
 ACTIVE_USER_FLAG       ,
 SECTION_FOR_PRINTOUTS  ,
 DUMMY                  
    ))
  location ('mig_dca_user.csv')
) reject limit 1;

merge into dca_user REF
using 
(select 
 USER_ID     ,
 TITLE       ,
 FORENAMES   ,
 SURNAME     ,
 USER_SHORT_NAME ,
 JOB_TITLE       ,
 EXTENSION       ,
 ACCESS_SECURITY_LEVEL  ,
 USER_DEFAULT_PRINTER   ,
 USER_STYLE_PROFILE     ,
 ACTIVE_USER_FLAG       ,
 SECTION_FOR_PRINTOUTS             
from dca_user_ext ) TMP
on (TMP.USER_ID = REF.USER_ID)
when matched then update set
 REF.TITLE   			= TMP.TITLE    ,
 REF.FORENAMES  		= TMP.FORENAMES ,
 REF.SURNAME   			= TMP.SURNAME  ,
 REF.USER_SHORT_NAME 		= TMP.USER_SHORT_NAME,
 REF.JOB_TITLE   		= TMP.JOB_TITLE   ,
 REF.EXTENSION   		= TMP.EXTENSION     ,
 REF.ACCESS_SECURITY_LEVEL  	= TMP.ACCESS_SECURITY_LEVEL,
 REF.USER_DEFAULT_PRINTER  	= TMP.USER_DEFAULT_PRINTER ,
 REF.USER_STYLE_PROFILE   	= TMP.USER_STYLE_PROFILE  ,
 REF.ACTIVE_USER_FLAG    	= TMP.ACTIVE_USER_FLAG    ,      
 REF.SECTION_FOR_PRINTOUTS 	= TMP.SECTION_FOR_PRINTOUTS                                                       
when not matched then insert (
 USER_ID ,
 TITLE  ,
 FORENAMES ,
 SURNAME   ,
 USER_SHORT_NAME,
 JOB_TITLE ,
 EXTENSION ,
 ACCESS_SECURITY_LEVEL  ,
 USER_DEFAULT_PRINTER   ,
 USER_STYLE_PROFILE   	,
 ACTIVE_USER_FLAG       ,
 SECTION_FOR_PRINTOUTS  
 )
values (
 TMP.USER_ID ,
 TMP.TITLE  ,
 TMP.FORENAMES ,
 TMP.SURNAME   ,
 TMP.USER_SHORT_NAME,
 TMP.JOB_TITLE ,
 TMP.EXTENSION ,
 TMP.ACCESS_SECURITY_LEVEL  ,
 TMP.USER_DEFAULT_PRINTER   ,
 TMP.USER_STYLE_PROFILE   	,
 TMP.ACTIVE_USER_FLAG       ,
 TMP.SECTION_FOR_PRINTOUTS    );

drop table dca_user_ext;