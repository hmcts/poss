drop table currency_ext;

create table currency_ext (
 CURRENCY_CODE                                      VARCHAR2(3),
 CURRENCY_SYMBOL                                    VARCHAR2(1),
 CONVERSION_MULTIPLIER                              NUMBER(7,6),
 DATE_FROM_WHICH_EUR_PERMITTED                      DATE,
 DATE_FROM_WHICH_EUR_IS_DEFAULT                     DATE,
 DATE_FROM_WHICH_GBP_PROHIBITED                     DATE,
 DUMMY                                              VARCHAR2(6))
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
      CURRENCY_CODE                   ,
      CURRENCY_SYMBOL                 ,
      CONVERSION_MULTIPLIER           ,
      DATE_FROM_WHICH_EUR_PERMITTED   ,
      DATE_FROM_WHICH_EUR_IS_DEFAULT  ,
      DATE_FROM_WHICH_GBP_PROHIBITED  ,
      DUMMY  
    ))
  location ('currency.csv')
);

merge into currency REF
using 
(select 
      CURRENCY_CODE                   ,
      CURRENCY_SYMBOL                 ,
      CONVERSION_MULTIPLIER           ,
      DATE_FROM_WHICH_EUR_PERMITTED   ,
      DATE_FROM_WHICH_EUR_IS_DEFAULT  ,
      DATE_FROM_WHICH_GBP_PROHIBITED                      
from currency_ext) TMP
on (TMP.CURRENCY_CODE = REF.CURRENCY_CODE)
when matched then update set
REF.CURRENCY_SYMBOL                     = TMP.CURRENCY_SYMBOL              				,            
REF.CONVERSION_MULTIPLIER               = CONVERSION_MULTIPLIER      				,     
REF.DATE_FROM_WHICH_EUR_PERMITTED       = TMP.DATE_FROM_WHICH_EUR_PERMITTED           ,  
REF.DATE_FROM_WHICH_EUR_IS_DEFAULT      = TMP.DATE_FROM_WHICH_EUR_IS_DEFAULT         ,          
REF.DATE_FROM_WHICH_GBP_PROHIBITED      = TMP.DATE_FROM_WHICH_GBP_PROHIBITED                                                  
when not matched then insert (
      CURRENCY_CODE                   ,
      CURRENCY_SYMBOL                 ,
      CONVERSION_MULTIPLIER           ,
      DATE_FROM_WHICH_EUR_PERMITTED   ,
      DATE_FROM_WHICH_EUR_IS_DEFAULT  ,
      DATE_FROM_WHICH_GBP_PROHIBITED            )
values (
      TMP.CURRENCY_CODE                   ,
      TMP.CURRENCY_SYMBOL                 ,
      TMP.CONVERSION_MULTIPLIER           ,
      TMP.DATE_FROM_WHICH_EUR_PERMITTED   ,
      TMP.DATE_FROM_WHICH_EUR_IS_DEFAULT  ,
      TMP.DATE_FROM_WHICH_GBP_PROHIBITED       );

drop table currency_ext;