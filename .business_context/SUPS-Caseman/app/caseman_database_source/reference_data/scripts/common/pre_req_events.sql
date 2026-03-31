drop table pre_req_events_ext;

create table pre_req_events_ext (
 STD_EVENT_ID                             	    NUMBER(3),
 PRE_REQ_EVENT_ID1                        	    NUMBER(3),
 PRE_REQ_EVENT_ID2                                  NUMBER(3),
 PRE_REQ_EVENT_ID3                                  NUMBER(3),
 PRE_REQ_EVENT_ID4                                  NUMBER(3),
 DEF_DEPENDANT                                      VARCHAR2(1),
 MESSAGE_STATUS                                     VARCHAR2(1)
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
	STD_EVENT_ID,
	PRE_REQ_EVENT_ID1,
	PRE_REQ_EVENT_ID2,
	PRE_REQ_EVENT_ID3,
	PRE_REQ_EVENT_ID4,
	DEF_DEPENDANT,
	MESSAGE_STATUS
    ))
  location ('pre_req_events.csv')
);

merge into pre_req_events REF
using 
(select 	
	STD_EVENT_ID,
	PRE_REQ_EVENT_ID1,
	PRE_REQ_EVENT_ID2,
	PRE_REQ_EVENT_ID3,
	PRE_REQ_EVENT_ID4,
	DEF_DEPENDANT,
	MESSAGE_STATUS
from pre_req_events_ext) TMP
on (TMP.STD_EVENT_ID = REF.STD_EVENT_ID AND
    TMP.PRE_REQ_EVENT_ID1 = REF.PRE_REQ_EVENT_ID1)
when matched then update set
	REF.PRE_REQ_EVENT_ID2 = TMP.PRE_REQ_EVENT_ID2,
	REF.PRE_REQ_EVENT_ID3 = TMP.PRE_REQ_EVENT_ID3,
	REF.PRE_REQ_EVENT_ID4 = TMP.PRE_REQ_EVENT_ID4,
	REF.DEF_DEPENDANT = TMP.DEF_DEPENDANT,
	REF.MESSAGE_STATUS = TMP.MESSAGE_STATUS
when not matched then insert (
	REF.STD_EVENT_ID,
	REF.PRE_REQ_EVENT_ID1,
	REF.PRE_REQ_EVENT_ID2,
	REF.PRE_REQ_EVENT_ID3,
	REF.PRE_REQ_EVENT_ID4,
	REF.DEF_DEPENDANT,
	REF.MESSAGE_STATUS )
values (
	TMP.STD_EVENT_ID,
	TMP.PRE_REQ_EVENT_ID1,
	TMP.PRE_REQ_EVENT_ID2,
	TMP.PRE_REQ_EVENT_ID3,
	TMP.PRE_REQ_EVENT_ID4,
	TMP.DEF_DEPENDANT,
	TMP.MESSAGE_STATUS);

drop table pre_req_events_ext;