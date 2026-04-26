drop table document_variables_ext;

create table document_variables_ext (
CODE                                               VARCHAR2(30),
DESCRIPTION                                        VARCHAR2(70),
SELECT_CLAUSE                                      VARCHAR2(1000),
FROM_WHERE_CLAUSE                                  VARCHAR2(2000))
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
CODE                                               ,
DESCRIPTION   CHAR(70) terminated by ',' optionally enclosed by '"'                                       ,
SELECT_CLAUSE CHAR(1000) terminated by ',' optionally enclosed by '"'                                     ,
FROM_WHERE_CLAUSE CHAR(2000) terminated by ',' optionally enclosed by '"'                                 
    ))
  location ('document_variables.csv')
);

merge into document_variables REF
using 
(select 
CODE                                               ,
DESCRIPTION                                        ,
SELECT_CLAUSE                                      ,
FROM_WHERE_CLAUSE                                  
from document_variables_ext) TMP
on (TMP.CODE= REF.CODE)
when matched then update set
REF.DESCRIPTION                                        = TMP.DESCRIPTION                                        ,
REF.SELECT_CLAUSE                                      = TMP.SELECT_CLAUSE                                      ,
REF.FROM_WHERE_CLAUSE                                  = TMP.FROM_WHERE_CLAUSE                                  
when not matched then insert (
REF.CODE                                               ,
REF.DESCRIPTION                                        ,
REF.SELECT_CLAUSE                                      ,
REF.FROM_WHERE_CLAUSE                                  )
values (
TMP.CODE                                               ,
TMP.DESCRIPTION                                        ,
TMP.SELECT_CLAUSE                                      ,
TMP.FROM_WHERE_CLAUSE                                  );

drop table document_variables_ext;