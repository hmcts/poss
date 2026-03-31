drop table sections_ext;

create table sections_ext (
ADMIN_COURT_CODE			   NUMBER(3),
 SECTION_NAME                              VARCHAR2(30),
nothing                                    varchar2(10),
dummy                                      varchar2(10)
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
ADMIN_COURT_CODE, 	
SECTION_NAME,
nothing 	,
	DUMMY
    ))
  location ('mig_sections.csv')
) reject limit 1;

merge into sections REF
using 
(select 
	SECTION_NAME,
 	ADMIN_COURT_CODE                                  
from sections_ext) TMP
on (TMP.SECTION_NAME = REF.SECTION_NAME AND
    TMP.ADMIN_COURT_CODE = REF.ADMIN_COURT_CODE)                                            
when not matched then insert (
	SECTION_NAME,
 	ADMIN_COURT_CODE          )
values (
	TMP.SECTION_NAME,
 	TMP.ADMIN_COURT_CODE );

drop table sections_ext;