delete from audit_config;

drop table audit_config_ext;

create table audit_config_ext (
TABLE_NAME                                 VARCHAR2(30),
AUDITED                                    VARCHAR2(1))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
      TABLE_NAME             ,
      AUDITED                 
    ))
  location ('audit_config.csv') 
) reject limit 1 ;

merge into audit_config REF
using 
(select 
      TABLE_NAME             ,
      AUDITED                    
from audit_config_ext) TMP
on (TMP.TABLE_NAME = REF.TABLE_NAME)
when matched then update set
REF.AUDITED = TMP.AUDITED              
when not matched then insert (
      TABLE_NAME             ,
      AUDITED                 )
values (
      TMP.TABLE_NAME    ,
      TMP.AUDITED        );

drop table audit_config_ext;