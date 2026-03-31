drop table CCBC_MEDIA_FILE_TYPE_ext;

create table CCBC_MEDIA_FILE_TYPE_ext (
FILE_TYPE_CODE VARCHAR2(6),
FILE_TYPE_DESCRIPTION VARCHAR2(150))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
FILE_TYPE_CODE,
FILE_TYPE_DESCRIPTION
    ))
  location ('ccbc_media_file_types.csv')
);

merge into CCBC_MEDIA_FILE_TYPE REF
using 
(select 
FILE_TYPE_CODE,
FILE_TYPE_DESCRIPTION 
from CCBC_MEDIA_FILE_TYPE_ext) TMP
on (TMP.FILE_TYPE_CODE = REF.FILE_TYPE_CODE)
when matched then update set
REF.FILE_TYPE_DESCRIPTION = TMP.FILE_TYPE_DESCRIPTION
when not matched then insert (
REF.FILE_TYPE_CODE,
REF.FILE_TYPE_DESCRIPTION)
values (
TMP.FILE_TYPE_CODE,
TMP.FILE_TYPE_DESCRIPTION);

drop table CCBC_MEDIA_FILE_TYPE_ext;