drop table order_types_ext;

create table order_types_ext (
ORDER_ID                                   VARCHAR2(20),
ORDER_DESCRIPTION                          VARCHAR2(100),
USER_EDIT                                  VARCHAR2(1),
DISPLAY_ORDER_ID                           VARCHAR2(6),
DOCUMENT_TYPE                              VARCHAR2(10),
DOC_PAYEE                                  VARCHAR2(20),
DOC_RECIPIENT                              VARCHAR2(20),
FILE_EXTENSION                             VARCHAR2(10),
FILE_PREFIX                                VARCHAR2(4),
LEGAL_DESCRIPTION                          VARCHAR2(150),
MODULE_GROUP                               VARCHAR2(10),
MODULE_NAME                                VARCHAR2(20),
NO_OF_COPIES                               NUMBER(2),
PREVIOUS_ORDER_ID                          VARCHAR2(6),
PRINTER_TYPE                               VARCHAR2(1),
REPORT_TYPE                                VARCHAR2(10),
SELECTION_CRITERIA                         VARCHAR2(1000),
SERVICE_TYPE                               VARCHAR2(1),
MULT_ADDR_FLAG                             VARCHAR2(1),
TRAY					   VARCHAR2(2),
DUMMY                                      VARCHAR2(2))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
ORDER_ID               ,
ORDER_DESCRIPTION    CHAR(100) terminated by ',' optionally enclosed by '"'  ,
USER_EDIT              ,
DISPLAY_ORDER_ID       ,
DOCUMENT_TYPE          ,
DOC_PAYEE              ,
DOC_RECIPIENT          ,
FILE_EXTENSION         ,
FILE_PREFIX            ,
LEGAL_DESCRIPTION   CHAR(150) terminated by ',' optionally enclosed by '"'   ,
MODULE_GROUP        CHAR(10) terminated by ',' optionally enclosed by '"'  ,
MODULE_NAME            ,
NO_OF_COPIES           ,
PREVIOUS_ORDER_ID      ,
PRINTER_TYPE           ,
REPORT_TYPE            ,
SELECTION_CRITERIA     ,
SERVICE_TYPE           ,
MULT_ADDR_FLAG         ,
TRAY		       ,
DUMMY
    ))
  location ('order_types.csv')
);

merge into order_types REF
using 
(select
ORDER_ID                       ,
ORDER_DESCRIPTION              ,
USER_EDIT                      ,
DISPLAY_ORDER_ID               ,
DOCUMENT_TYPE                  ,
DOC_PAYEE                      ,
DOC_RECIPIENT                  ,
FILE_EXTENSION                 ,
FILE_PREFIX                    ,
LEGAL_DESCRIPTION              ,
MODULE_GROUP                   ,
MODULE_NAME                    ,
NO_OF_COPIES                   ,
PREVIOUS_ORDER_ID              ,
PRINTER_TYPE                   ,
REPORT_TYPE                    ,
SELECTION_CRITERIA             ,
SERVICE_TYPE                   ,
MULT_ADDR_FLAG                 ,
TRAY
from order_types_ext) TMP
on (TMP.ORDER_ID = REF.ORDER_ID)
when matched then update set
REF.ORDER_DESCRIPTION = TMP.ORDER_DESCRIPTION       ,                    
REF.USER_EDIT = TMP.USER_EDIT                       ,                    
REF.DISPLAY_ORDER_ID = TMP.DISPLAY_ORDER_ID         ,                    
REF.DOCUMENT_TYPE = TMP.DOCUMENT_TYPE               ,                    
REF.DOC_PAYEE = TMP.DOC_PAYEE                       ,                    
REF.DOC_RECIPIENT = TMP.DOC_RECIPIENT               ,                    
REF.FILE_EXTENSION = TMP.FILE_EXTENSION             ,                    
REF.FILE_PREFIX = TMP.FILE_PREFIX                   ,                    
REF.LEGAL_DESCRIPTION = TMP.LEGAL_DESCRIPTION       ,                    
REF.MODULE_GROUP = TMP.MODULE_GROUP                 ,                    
REF.MODULE_NAME = TMP.MODULE_NAME                   ,                    
REF.NO_OF_COPIES = TMP.NO_OF_COPIES                 ,                    
REF.PREVIOUS_ORDER_ID = TMP.PREVIOUS_ORDER_ID       ,                    
REF.PRINTER_TYPE = TMP.PRINTER_TYPE                 ,                    
REF.REPORT_TYPE = TMP.REPORT_TYPE                   ,                    
REF.SELECTION_CRITERIA = TMP.SELECTION_CRITERIA     ,                    
REF.SERVICE_TYPE =  TMP.SERVICE_TYPE                ,  
REF.MULT_ADDR_FLAG  = TMP.MULT_ADDR_FLAG            ,
REF.TRAY = TMP.TRAY                     
when not matched then insert (
REF.ORDER_ID               ,
REF.ORDER_DESCRIPTION      ,
REF.USER_EDIT              ,
REF.DISPLAY_ORDER_ID       ,
REF.DOCUMENT_TYPE          ,
REF.DOC_PAYEE              ,
REF.DOC_RECIPIENT          ,
REF.FILE_EXTENSION         ,
REF.FILE_PREFIX            ,
REF.LEGAL_DESCRIPTION      ,
REF.MODULE_GROUP           ,
REF.MODULE_NAME            ,
REF.NO_OF_COPIES           ,
REF.PREVIOUS_ORDER_ID      ,
REF.PRINTER_TYPE           ,
REF.REPORT_TYPE            ,
REF.SELECTION_CRITERIA     ,
REF.SERVICE_TYPE           ,
REF.MULT_ADDR_FLAG         ,
REF.TRAY		   )
values (
TMP.ORDER_ID            ,   
TMP.ORDER_DESCRIPTION   ,   
TMP.USER_EDIT           ,   
TMP.DISPLAY_ORDER_ID    ,   
TMP.DOCUMENT_TYPE       ,   
TMP.DOC_PAYEE           ,   
TMP.DOC_RECIPIENT       ,   
TMP.FILE_EXTENSION      ,   
TMP.FILE_PREFIX         ,   
TMP.LEGAL_DESCRIPTION   ,   
TMP.MODULE_GROUP        ,   
TMP.MODULE_NAME         ,   
TMP.NO_OF_COPIES        ,   
TMP.PREVIOUS_ORDER_ID   ,   
TMP.PRINTER_TYPE        ,   
TMP.REPORT_TYPE         ,   
TMP.SELECTION_CRITERIA  ,   
TMP.SERVICE_TYPE        ,   
TMP.MULT_ADDR_FLAG      ,
TMP.TRAY		   );

drop table order_types_ext;