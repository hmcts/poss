drop table given_addresses_ext;

create table given_addresses_ext (
ADDRESS_ID                                         NUMBER(12),
ADDRESS_LINE1                                      VARCHAR2(35),
ADDRESS_LINE2                                      VARCHAR2(35),
ADDRESS_LINE3                                      VARCHAR2(35),
ADDRESS_LINE4                                      VARCHAR2(35),
ADDRESS_LINE5                                      VARCHAR2(35),
POSTCODE                                           VARCHAR2(8),
VALID_FROM                                         DATE,
VALID_TO                                           DATE,
PARTY_ID                                           NUMBER(12),
REFERENCE                                          VARCHAR2(25),
CASE_NUMBER                                        VARCHAR2(8),
PARTY_ROLE_CODE                                    VARCHAR2(10),
ADDRESS_TYPE_CODE                                  VARCHAR2(15),
CO_NUMBER                                          VARCHAR2(8),
ADDR_TYPE_SEQ                                      NUMBER(3),
ALD_SEQ                                            NUMBER(9),
COURT_CODE                                         NUMBER(3),
UPDATED_BY                                         VARCHAR2(70))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are NULL
    (
ADDRESS_ID   ,          
ADDRESS_LINE1,          
ADDRESS_LINE2,          
ADDRESS_LINE3,          
ADDRESS_LINE4,          
ADDRESS_LINE5,          
POSTCODE     ,          
VALID_FROM   ,          
VALID_TO     ,          
PARTY_ID     ,          
REFERENCE    ,          
CASE_NUMBER  ,          
PARTY_ROLE_CODE,        
ADDRESS_TYPE_CODE,      
CO_NUMBER        ,      
ADDR_TYPE_SEQ    ,      
ALD_SEQ          ,      
COURT_CODE       ,      
UPDATED_BY                               
    ))
  location ('mig_given_addresses.csv')
);

merge into GIVEN_ADDRESSES REF
using 
(select 
ADDRESS_ID             ,
ADDRESS_LINE1          , 
ADDRESS_LINE2          , 
ADDRESS_LINE3          ,
ADDRESS_LINE4          ,
ADDRESS_LINE5          ,
POSTCODE               ,
VALID_FROM             ,
VALID_TO               ,
PARTY_ID               ,
REFERENCE              ,
CASE_NUMBER            ,
PARTY_ROLE_CODE        ,
ADDRESS_TYPE_CODE      ,
CO_NUMBER              ,
ADDR_TYPE_SEQ          ,
ALD_SEQ                ,
COURT_CODE             ,
UPDATED_BY                   
from given_addresses_EXT) TMP
on (TMP.ADDRESS_ID = REF.ADDRESS_ID)
when matched then update set
REF.ADDRESS_LINE1 = TMP.ADDRESS_LINE1  ,                 
REF.ADDRESS_LINE2 = TMP.ADDRESS_LINE2  ,                 
REF.ADDRESS_LINE3 = TMP.ADDRESS_LINE3  ,                
REF.ADDRESS_LINE4 = TMP.ADDRESS_LINE4  ,                 
REF.ADDRESS_LINE5 = TMP.ADDRESS_LINE5  ,                 
REF.POSTCODE      = TMP.POSTCODE       ,                 
REF.VALID_FROM    = TMP.VALID_FROM     ,                 
REF.VALID_TO      = TMP.VALID_TO       ,                 
REF.PARTY_ID      = TMP.PARTY_ID       ,                 
REF.REFERENCE     = TMP.REFERENCE      ,                 
REF.CASE_NUMBER   = TMP.CASE_NUMBER    ,                 
REF.PARTY_ROLE_CODE = TMP.PARTY_ROLE_CODE ,              
REF.ADDRESS_TYPE_CODE = TMP.ADDRESS_TYPE_CODE,
REF.CO_NUMBER = TMP.CO_NUMBER          ,                
REF.ADDR_TYPE_SEQ = TMP.ADDR_TYPE_SEQ  ,                 
REF.ALD_SEQ = TMP.ALD_SEQ              ,                 
REF.COURT_CODE = TMP.COURT_CODE        ,                 
REF.UPDATED_BY = TMP.UPDATED_BY                                                                               
when not matched then insert (
REF.ADDRESS_ID            ,
REF.ADDRESS_LINE1         ,
REF.ADDRESS_LINE2         ,
REF.ADDRESS_LINE3         ,
REF.ADDRESS_LINE4         ,
REF.ADDRESS_LINE5         , 
REF.POSTCODE              , 
REF.VALID_FROM            , 
REF.VALID_TO              , 
REF.PARTY_ID              , 
REF.REFERENCE             , 
REF.CASE_NUMBER           , 
REF.PARTY_ROLE_CODE       , 
REF.ADDRESS_TYPE_CODE     , 
REF.CO_NUMBER             , 
REF.ADDR_TYPE_SEQ         , 
REF.ALD_SEQ               , 
REF.COURT_CODE            , 
UPDATED_BY                   )
values (
TMP.ADDRESS_ID            ,
TMP.ADDRESS_LINE1         ,
TMP.ADDRESS_LINE2         ,
TMP.ADDRESS_LINE3         ,
TMP.ADDRESS_LINE4         ,
TMP.ADDRESS_LINE5         , 
TMP.POSTCODE              , 
TMP.VALID_FROM            , 
TMP.VALID_TO              , 
TMP.PARTY_ID              , 
TMP.REFERENCE             , 
TMP.CASE_NUMBER           , 
TMP.PARTY_ROLE_CODE       , 
TMP.ADDRESS_TYPE_CODE     , 
TMP.CO_NUMBER             , 
TMP.ADDR_TYPE_SEQ         , 
TMP.ALD_SEQ               , 
TMP.COURT_CODE            ,
TMP.UPDATED_BY   );

drop table given_addresses_ext;