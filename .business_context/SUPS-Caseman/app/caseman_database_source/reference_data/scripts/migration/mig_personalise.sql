drop table personalise_ext;

create table personalise_ext (
 CRT_CODE                                  NUMBER(3),
 OPEN_FROM                                 NUMBER(5),
 CLOSED_AT                                 NUMBER(5),
 ACCOUNT_TYPE                              VARCHAR2(10),
 ACCOUNTING_CODE                           NUMBER(5),
 BAILIFF_OPENING                           NUMBER(5),
 BAILIFF_CLOSING                           NUMBER(5),
 BAILIFF_TELEPHONE                         VARCHAR2(12),
 BAILIFF_FAX                               VARCHAR2(12),
 DUMMY                                     VARCHAR2(10))
organization external
(
  default directory caseman_rd_dir
  access parameters
  (
    records delimited by newline
    fields terminated by ','
    missing field values are null
    (
	CRT_CODE,
	OPEN_FROM,
	CLOSED_AT,
	ACCOUNT_TYPE,
	ACCOUNTING_CODE,
	BAILIFF_OPENING,
	BAILIFF_CLOSING,
	BAILIFF_TELEPHONE,
	BAILIFF_FAX,
	DUMMY
    ))
  location ('mig_personalise.csv')
) reject limit 1;

merge into personalise REF
using 
(select 
	CRT_CODE,
	OPEN_FROM,
	CLOSED_AT,
	ACCOUNT_TYPE,
	ACCOUNTING_CODE,
	BAILIFF_OPENING,
	BAILIFF_CLOSING,
	BAILIFF_TELEPHONE,
	BAILIFF_FAX                                   
from personalise_ext) TMP
on (TMP.CRT_CODE = REF.CRT_CODE)
when matched then update set
	REF.OPEN_FROM 		= TMP.OPEN_FROM ,
	REF.CLOSED_AT 		= TMP.CLOSED_AT ,
	REF.ACCOUNT_TYPE 	= TMP.ACCOUNT_TYPE,
	REF.ACCOUNTING_CODE 	= TMP.ACCOUNTING_CODE,
	REF.BAILIFF_OPENING 	= TMP.BAILIFF_OPENING,
	REF.BAILIFF_CLOSING 	= TMP.BAILIFF_CLOSING,
	REF.BAILIFF_TELEPHONE 	= TMP.BAILIFF_TELEPHONE,
	REF.BAILIFF_FAX 	= TMP.BAILIFF_FAX                                                  
when not matched then insert (
	CRT_CODE,
	OPEN_FROM,
	CLOSED_AT,
	ACCOUNT_TYPE,
	ACCOUNTING_CODE,
	BAILIFF_OPENING,
	BAILIFF_CLOSING,
	BAILIFF_TELEPHONE,
	BAILIFF_FAX           )
values (
	TMP.CRT_CODE,
	TMP.OPEN_FROM,
	TMP.CLOSED_AT,
	TMP.ACCOUNT_TYPE,
	TMP.ACCOUNTING_CODE,
	TMP.BAILIFF_OPENING,
	TMP.BAILIFF_CLOSING,
	TMP.BAILIFF_TELEPHONE,
	TMP.BAILIFF_FAX );

drop table personalise_ext;