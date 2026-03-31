/* View to get address and party details when case and case party details known

   This should be used to query the following address types / party roles:

   SERVICE (CODED PARTY)    - CLAIMANT
   SERVICE                  - DEFENDANT
   SUBSERVICE               - CLAIMANT/DEFENDANT
   WORKPLACE                - CLAIMANT/DEFENDANT
   SOLICITOR                - SOLICITOR

*/

create or replace view case_parties as
/* Non-coded parties */
select	cpr.case_number case_number,
	cpr.party_role_code party_role_code,
	decode(pr.reporting_role_code,'OTHER',CPR.PARTY_ROLE_CODE,PR.REPORTING_ROLE_CODE) REPORTING_PARTY_ROLE_CODE,
	cpr.case_party_no case_party_no,
	cpr.party_id party_id,
	ga.address_type_code address_type_code,
	null coded_party_no,
	pty.person_requested_name name,
	ga.address_line1 address_line1,
	ga.address_line2 address_line2,
	ga.address_line3 address_line3,
	ga.address_line4 address_line4,
	ga.address_line5 address_line5,
	ga.postcode postcode,
	cpr.reference reference,
	pty.tel_no tel_no,
	pty.dx_number dx_number,
	cpr.deft_date_of_service_ro date_of_service_ro,
	cpr.deft_date_of_service date_of_service,
	cpr.payee_flag payee_flag
from	case_party_roles cpr,
	parties pty,
	given_addresses ga,
	party_roles pr
where	pty.party_id = cpr.party_id
and	pr.party_role_code = cpr.party_role_code
and	ga.case_number = cpr.case_number
and	ga.party_role_code = cpr.party_role_code
and	ga.case_party_no = cpr.case_party_no
and	ga.valid_to is null
and     ga.address_type_code IN ('SERVICE','SUBSERV','WORKPLACE','SOLICITOR')
union
/* Coded parties, joined to case_party_roles via party_id */
select	cpr.case_number case_number,
	cpr.party_role_code party_role_code,
	decode(pr.reporting_role_code,'OTHER',CPR.PARTY_ROLE_CODE,PR.REPORTING_ROLE_CODE) REPORTING_PARTY_ROLE_CODE,
	cpr.case_party_no case_party_no,
	cpr.party_id party_id,
	ga.address_type_code address_type_code,
	ncp.code coded_party_no,
	pty.person_requested_name name,
	ga.address_line1 address_line1,
	ga.address_line2 address_line2,
	ga.address_line3 address_line3,
	ga.address_line4 address_line4,
	ga.address_line5 address_line5,
	ga.postcode postcode,
	cpr.reference reference,
	pty.tel_no tel_no,
	pty.dx_number dx_number,
	cpr.deft_date_of_service_ro date_of_service_ro,
	cpr.deft_date_of_service date_of_service,
	cpr.payee_flag payee_flag
from	case_party_roles cpr,
	parties pty,
	given_addresses ga,
        party_roles pr,
	coded_parties ncp
where	pty.party_id = cpr.party_id
and	pr.party_role_code = cpr.party_role_code
and	ncp.party_id = cpr.party_id
and	ga.party_id = cpr.party_id
and	ga.valid_to is null
and     ga.address_type_code = 'CODED PARTY';

