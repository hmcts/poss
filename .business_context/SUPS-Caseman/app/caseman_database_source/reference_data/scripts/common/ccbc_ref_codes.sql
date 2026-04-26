drop table CCBC_REF_CODES_ext;

create table CCBC_REF_CODES_ext (
RV_LOW_VALUE                                       VARCHAR2(240),
RV_HIGH_VALUE                                      VARCHAR2(240),
RV_ABBREVIATION                                    VARCHAR2(240),
RV_DOMAIN                                          VARCHAR2(100),
RV_MEANING                                         VARCHAR2(240),
RV_TYPE                                            VARCHAR2(10),
RV_IIT_CODE_1                                      VARCHAR2(20),
RV_IIT_CODE_2                                      VARCHAR2(20),
DUMMY                                              VARCHAR2(5))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
RV_LOW_VALUE   , 
RV_HIGH_VALUE  , 
RV_ABBREVIATION,
RV_DOMAIN      ,
RV_MEANING     ,
RV_TYPE        ,
RV_IIT_CODE_1  ,
RV_IIT_CODE_2  ,
DUMMY
    ))
  location ('ccbc_ref_codes.csv')
);

delete from CCBC_REF_CODES;

insert into CCBC_REF_CODES (
RV_LOW_VALUE          ,
RV_HIGH_VALUE         , 
RV_ABBREVIATION       , 
RV_DOMAIN             , 
RV_MEANING            , 
RV_TYPE               , 
RV_IIT_CODE_1         , 
RV_IIT_CODE_2         )
(select 
RV_LOW_VALUE          ,
RV_HIGH_VALUE         , 
RV_ABBREVIATION       , 
RV_DOMAIN             , 
RV_MEANING            , 
RV_TYPE               , 
RV_IIT_CODE_1         , 
RV_IIT_CODE_2          
from  CCBC_REF_CODES_ext);

-- 25-Oct-2006 Phil Haferer: Candidate for Build Z Issue 113...
-- Replace any unprintable Ellipse characters by the printable three dots.
UPDATE CCBC_REF_CODES REF
SET    REF.RV_LOW_VALUE    = REPLACE(REF.RV_LOW_VALUE   , CHR(133), '...')
,      REF.RV_HIGH_VALUE   = REPLACE(REF.RV_HIGH_VALUE  , CHR(133), '...')
,      REF.RV_ABBREVIATION = REPLACE(REF.RV_ABBREVIATION, CHR(133), '...')
,      REF.RV_DOMAIN       = REPLACE(REF.RV_DOMAIN      , CHR(133), '...')
,      REF.RV_MEANING      = REPLACE(REF.RV_MEANING     , CHR(133), '...')
,      REF.RV_TYPE         = REPLACE(REF.RV_TYPE        , CHR(133), '...')
,      REF.RV_IIT_CODE_1   = REPLACE(REF.RV_IIT_CODE_1  , CHR(133), '...')
,      REF.RV_IIT_CODE_2   = REPLACE(REF.RV_IIT_CODE_2  , CHR(133), '...');

drop table CCBC_REF_CODES_ext;