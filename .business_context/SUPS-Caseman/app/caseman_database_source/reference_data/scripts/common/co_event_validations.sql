drop table co_event_validations_ext;

create table co_event_validations_ext (
STD_EVENT_ID				   	NUMBER(3),
CREATES_HEARING                                 VARCHAR2(1),
CO_EVENT_SUB_TYPE				VARCHAR2(10),
LINK_TO_DEBT					VARCHAR2(1),
PRE_REQ_EVENT1					NUMBER(3),
PRE_REQ_EVENT2					NUMBER(3),
PRE_REQ_EVENT3					NUMBER(3),
DUMMY						VARCHAR(10))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
	STD_EVENT_ID,
	CREATES_HEARING,
	CO_EVENT_SUB_TYPE,
	LINK_TO_DEBT,
	PRE_REQ_EVENT1,
	PRE_REQ_EVENT2,
	PRE_REQ_EVENT3,
	DUMMY					
    ))
  location ('co_event_validations.csv') 
) reject limit unlimited ;

merge into co_event_validations REF
using 
(select 
	STD_EVENT_ID,
	CREATES_HEARING,
	CO_EVENT_SUB_TYPE,
	LINK_TO_DEBT,
	PRE_REQ_EVENT1,
	PRE_REQ_EVENT2,
	PRE_REQ_EVENT3
from co_event_validations_ext) TMP
on (TMP.STD_EVENT_ID = REF.STD_EVENT_ID)
when matched then update set
REF.CREATES_HEARING=TMP.CREATES_HEARING,
REF.CO_EVENT_SUB_TYPE=TMP.CO_EVENT_SUB_TYPE,
REF.LINK_TO_DEBT=TMP.LINK_TO_DEBT,
REF.PRE_REQ_EVENT1=TMP.PRE_REQ_EVENT1,
REF.PRE_REQ_EVENT2=TMP.PRE_REQ_EVENT2,
REF.PRE_REQ_EVENT3=TMP.PRE_REQ_EVENT3
when not matched then insert (
	REF.STD_EVENT_ID,
	REF.CREATES_HEARING,
	REF.CO_EVENT_SUB_TYPE,
	REF.LINK_TO_DEBT,
	REF.PRE_REQ_EVENT1,
	REF.PRE_REQ_EVENT2,
	REF.PRE_REQ_EVENT3)
values (
	TMP.STD_EVENT_ID,
	TMP.CREATES_HEARING,
	TMP.CO_EVENT_SUB_TYPE,
	TMP.LINK_TO_DEBT,
	TMP.PRE_REQ_EVENT1,
	TMP.PRE_REQ_EVENT2,
	TMP.PRE_REQ_EVENT3
             );

drop table co_event_validations_ext;