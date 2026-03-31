drop table enforcement_letters_ext;

create table enforcement_letters_ext (
YEAR_VALUE                                 VARCHAR2(4),
LETTER                                     VARCHAR2(1))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
      YEAR_VALUE             ,
      LETTER                 
    ))
  location ('enforcement_letters.csv') 
) reject limit 1 ;

merge into enforcement_letters REF
using 
(select 
      YEAR_VALUE             ,
      LETTER                    
from enforcement_letters_ext) TMP
on (TMP.YEAR_VALUE = REF.YEAR_VALUE)
when matched then update set
REF.LETTER = TMP.LETTER              
when not matched then insert (
      YEAR_VALUE             ,
      LETTER                 )
values (
      TMP.YEAR_VALUE    ,
      TMP.LETTER        );

drop table enforcement_letters_ext;