drop table courts_ext;

create table courts_ext (
 CODE                                               NUMBER(3),
 ID                                                 VARCHAR2(2),
 NAME                                               VARCHAR2(30),
 TEL_NO                                             VARCHAR2(24),
 FAX_NO                                             VARCHAR2(24),
 BLF_TEL_NO                                         VARCHAR2(24),
 CASEMAN_INSERVICE                                  VARCHAR2(1),
 DATABASE_NAME                                      VARCHAR2(30),
 TASKS_UPDATED                                      VARCHAR2(1),
 DISTRICT_REGISTRY                                  VARCHAR2(1),
 WFT_GROUPING_COURT                                 NUMBER(3),
 WFT_DM_EMAIL_ADDRESS                               VARCHAR2(80),
 SAT_COURT                                          VARCHAR2(1),
 OPEN_FLAG                                          VARCHAR2(1),
 LAST_WRT_SEQNO                                     NUMBER(4),
 SUPS_CENTRALISED_FLAG                              VARCHAR2(1),
 DX_NUMBER                                          VARCHAR2(40),
 DEFAULT_PRINTER				    VARCHAR2(64),
 FAP_ID                                             VARCHAR2(12),
 DEED_PACK_NUMBER                                   VARCHAR2(6),
 TUCS_IN_USE					    VARCHAR2(3))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
CODE                   ,
ID                     ,
NAME                   ,
TEL_NO                 ,
FAX_NO                 ,
BLF_TEL_NO             ,
CASEMAN_INSERVICE      ,
DATABASE_NAME          ,
TASKS_UPDATED          ,
DISTRICT_REGISTRY      ,
WFT_GROUPING_COURT     ,
WFT_DM_EMAIL_ADDRESS   ,
SAT_COURT              ,
OPEN_FLAG              ,
LAST_WRT_SEQNO         ,
SUPS_CENTRALISED_FLAG  ,
DX_NUMBER              ,
DEFAULT_PRINTER	       ,
FAP_ID    	       ,
DEED_PACK_NUMBER       ,
TUCS_IN_USE
    ))
  location ('mig_courts.csv')
);

merge into COURTS REF
using 
(select 
CODE                   ,
ID                     ,
NAME                   ,
TEL_NO                 ,
FAX_NO                 ,
BLF_TEL_NO             ,
CASEMAN_INSERVICE      ,
DATABASE_NAME          ,
TASKS_UPDATED          ,
DISTRICT_REGISTRY      ,
WFT_GROUPING_COURT     ,
WFT_DM_EMAIL_ADDRESS   ,
SAT_COURT              ,
OPEN_FLAG              ,
LAST_WRT_SEQNO         ,
SUPS_CENTRALISED_FLAG  ,
DX_NUMBER              ,
DEFAULT_PRINTER	       ,
FAP_ID                 ,
DEED_PACK_NUMBER       ,
TUCS_IN_USE
from courts_ext) TMP
on (TMP.CODE = REF.CODE)
when matched then update set
REF.ID = TMP.ID ,                  
REF.NAME = TMP.NAME ,                 
REF.TEL_NO = TMP.TEL_NO,                
REF.FAX_NO = TMP.FAX_NO,                
REF.BLF_TEL_NO = TMP.BLF_TEL_NO,            
REF.CASEMAN_INSERVICE = TMP.CASEMAN_INSERVICE,     
REF.DATABASE_NAME = TMP.DATABASE_NAME,         
REF.TASKS_UPDATED = TMP.TASKS_UPDATED ,        
REF.DISTRICT_REGISTRY = TMP.DISTRICT_REGISTRY  ,    
REF.WFT_GROUPING_COURT = TMP.WFT_GROUPING_COURT ,   
REF.WFT_DM_EMAIL_ADDRESS = TMP.WFT_DM_EMAIL_ADDRESS ,    
REF.SAT_COURT = TMP.SAT_COURT ,                          
REF.OPEN_FLAG = TMP.OPEN_FLAG ,                          
REF.LAST_WRT_SEQNO = TMP.LAST_WRT_SEQNO ,                
REF.SUPS_CENTRALISED_FLAG = TMP.SUPS_CENTRALISED_FLAG ,  
REF.DX_NUMBER = TMP.DX_NUMBER  ,
REF.DEFAULT_PRINTER = TMP.DEFAULT_PRINTER		   ,
REF.FAP_ID = TMP.FAP_ID   ,
REF.DEED_PACK_NUMBER  = TMP.DEED_PACK_NUMBER ,
REF.TUCS_IN_USE  = TMP.TUCS_IN_USE                    
when not matched then insert (
REF.CODE                   ,
REF.ID                     ,
REF.NAME                   , 
REF.TEL_NO                 , 
REF.FAX_NO                 , 
REF.BLF_TEL_NO             ,
REF.CASEMAN_INSERVICE      ,
REF.DATABASE_NAME          ,
REF.TASKS_UPDATED          ,
REF.DISTRICT_REGISTRY      ,
REF.WFT_GROUPING_COURT     ,
REF.WFT_DM_EMAIL_ADDRESS   ,
REF.SAT_COURT              ,
REF.OPEN_FLAG              ,
REF.LAST_WRT_SEQNO         ,
REF.SUPS_CENTRALISED_FLAG  ,
REF.DX_NUMBER              ,
REF.DEFAULT_PRINTER        ,
REF.FAP_ID		   ,
REF.DEED_PACK_NUMBER       ,
REF.TUCS_IN_USE             )
values (
TMP.CODE                   ,
TMP.ID                     ,
TMP.NAME                   ,
TMP.TEL_NO                 ,
TMP.FAX_NO                 ,
TMP.BLF_TEL_NO             ,
TMP.CASEMAN_INSERVICE      ,
TMP.DATABASE_NAME          ,
TMP.TASKS_UPDATED          ,
TMP.DISTRICT_REGISTRY      ,
TMP.WFT_GROUPING_COURT     ,
TMP.WFT_DM_EMAIL_ADDRESS   ,
TMP.SAT_COURT              ,
TMP.OPEN_FLAG              ,
TMP.LAST_WRT_SEQNO         ,
TMP.SUPS_CENTRALISED_FLAG  ,
TMP.DX_NUMBER              ,
TMP.DEFAULT_PRINTER        ,
TMP.FAP_ID		   ,
TMP.DEED_PACK_NUMBER       ,
TMP.TUCS_IN_USE             );

drop table courts_ext;

UPDATE COURTS C1 SET  C1.DEED_PACK_NUMBER =  (SELECT SUBSTR('000000'||C2.DEED_PACK_NUMBER, -6, 6) FROM COURTS C2 WHERE C2.CODE = C1.CODE);

COMMIT;


