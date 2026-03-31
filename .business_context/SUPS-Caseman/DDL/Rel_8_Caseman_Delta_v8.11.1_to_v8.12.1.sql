SPOOL PleaseSendToDataArchitectASAP.txt ;

DROP MATERIALIZED VIEW mv_cman_party_addresses;

DROP MATERIALIZED VIEW mv_cman_parties;

create materialized view mv_cman_party_addresses
refresh next trunc(sysdate + 1) + 6.5/24
as
SELECT	C.ADMIN_CRT_CODE ADMIN_CRT_CODE,					
	C.CASE_NUMBER CASE_NUMBER,
	cpr.case_party_no case_party_no,
	cpr.party_id party_id,
	GA.ADDRESS_LINE1 ADDRESS_LINE1, 
	GA.ADDRESS_LINE2 ADDRESS_LINE2,
	ga.address_line3 ADDRESS_LINE3,
 	GA.ADDRESS_LINE4 ADDRESS_LINE4,
	GA.ADDRESS_LINE5 ADDRESS_LINE5,
	ga.postcode postcode,
	GA.ADDRESS_TYPE_CODE ADDRESS_TYPE_CODE,
	cpr.PARTY_ROLE_CODE PARTY_ROLE_CODE
FROM 	CASES C, GIVEN_ADDRESSES GA, case_party_roles cpr
WHERE 	C.ADMIN_CRT_CODE != '335'
    	AND CPR.CASE_NUMBER = C.CASE_NUMBER 
    	AND GA.VALID_TO IS NULL
	AND ((decode(ga.address_type_code, 'CODED PARTY','CODED PARTY',ga.address_type_code)='CODED PARTY'  
	    AND ga.party_id=cpr.party_id) 
	    OR (cpr.case_number = ga.case_number
	    AND cpr.case_party_no = ga.case_party_no
	    AND cpr.party_role_code = ga.party_role_code) ) 
ORDER BY 1,2;

create index idx1mv_cman_party_addresses 
on mv_cman_party_addresses
(admin_crt_code, case_number, case_party_no);


create index idx2mv_cman_party_addresses 
on mv_cman_party_addresses
(case_number, party_role_code, case_party_no);


create materialized view mv_cman_parties
refresh next trunc(sysdate + 1) + 6.5/24
as
select cpr.case_number case_number,
	p.party_id as party_id,
	cpr.party_role_code as party_role_code,
	cpr.case_party_no as case_party_no,
	ncp.code coded_party_no,
	p.person_requested_name AS person_requested_name,
	p.tel_no tel_no,
	p.dx_number dx_number,
	cpr.reference reference,
	cpr.deft_date_of_service_ro date_of_service_ro,
	cpr.deft_date_of_service date_of_service,
	cpr.payee_flag payee_flag,
DECODE(PR.REPORTING_ROLE_CODE, 'OTHER', CPR.PARTY_ROLE_CODE, PR.REPORTING_ROLE_CODE) REPORTING_PARTY_ROLE_CODE
	from parties p, cases c, case_party_roles cpr, coded_parties ncp,
	party_roles pr
	where c.admin_crt_code != 335
	and c.case_number = cpr.case_number
	and cpr.party_id = P.party_id
	and cpr.party_role_code = pr.party_role_code
	and cpr.party_id = ncp.party_id(+)
ORDER BY 1,2,3;


create index idx1mv_cman_parties 
on mv_cman_parties
(party_id, party_role_code, case_party_no);

create index idx2_cman_parties 
on mv_cman_parties
(party_role_code, case_number, case_party_no);


insert into dbauser.schemascripts
values
((select user from dual),
  sysdate,
  'Rel_8_Cman_Delta_v8.11.1_to_v8.12.1.sql',
  '8.12.1') ;
commit;

-- @BUILD_SUPS_VIEWS.sql;

-- @BUILD_SUPS_SYNONYMS.sql;

spool off;



