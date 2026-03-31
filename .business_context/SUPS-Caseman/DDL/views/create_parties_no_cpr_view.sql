/* View to get address and party info when party id, ald_seq or co_number known */

/* This should be used for the following address types, which do not have case party details:

EMPLOYER           ga.party_id
CO_EMPLOYER        ga.co_number
CO_WORKPLACE       ga.co_number
CO_DEBTOR          ga.co_number
CO_PAYEE           ga.ald_seq    (or ga.party_id if ad.cp_payee_id populated)
CO_CRED            ga.ald_seq    (or ga.party_id if ad.cp_creditor_id populated)

   27/05/2010     Chris Vincent      Added welsh_ind for Welsh Language Requirements. Trac #2618.
*/

create or replace view parties_no_cpr as
select	pty.party_id party_id,
	ga.address_type_code address_type_code,
	ncp.code coded_party_no,
	pty.person_requested_name name,
	ga.address_line1 address_line1,
	ga.address_line2 address_line2,
	ga.address_line3 address_line3,
	ga.address_line4 address_line4,
	ga.address_line5 address_line5,
	ga.postcode      postcode,
        ga.ald_seq       ald_seq,
        ga.co_number     co_number,
	pty.tel_no tel_no,
	pty.dx_number dx_number,
        ga.reference reference,
        pty.person_dob person_dob,
        pty.welsh_indicator welsh_ind
from	parties pty,
	given_addresses ga,
        coded_parties ncp
where	ga.party_id = pty.party_id
and	ga.valid_to is null
and     ga.party_id = ncp.party_id (+)
/



