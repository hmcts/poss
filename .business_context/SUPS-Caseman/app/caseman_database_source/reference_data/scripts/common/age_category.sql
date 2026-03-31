drop table age_category_ext;

create table age_category_ext (
AGE_CATEGORY                   VARCHAR2(10),
LOWER_LIMIT                    NUMBER(3),
UPPER_LIMIT                    NUMBER(3))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
       AGE_CATEGORY ,      
       LOWER_LIMIT  ,
       UPPER_LIMIT  
    ))
  location ('age_category.csv')
);


merge into age_category REF
using 
(select 
AGE_CATEGORY       ,
LOWER_LIMIT        ,
UPPER_LIMIT                        
from age_category_ext) TMP
on (TMP.AGE_CATEGORY = REF.AGE_CATEGORY)
when matched then update set
REF.LOWER_LIMIT = TMP.LOWER_LIMIT,
REF.UPPER_LIMIT   = TMP.UPPER_LIMIT      
when not matched then insert (
REF.AGE_CATEGORY     ,
REF.LOWER_LIMIT      ,
REF.UPPER_LIMIT      )
values (
TMP.AGE_CATEGORY     ,
TMP.LOWER_LIMIT      ,
TMP.UPPER_LIMIT      );

commit;

drop table age_category_ext;