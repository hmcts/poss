/** 
 * @fileoverview CaseMan Party Type Codes - Enumeration class containing the party
 * type codes for reference in the CaseMan screens.
 *
 * @author Chris Vincent
 * @version 1.0 
 */

/**
 * @constructor
 * @author rzxd7g
 * 
 */
function PartyTypeCodesEnum() {};

/**
 * Claimant Party Code
 */
PartyTypeCodesEnum.CLAIMANT = "CLAIMANT";

/**
 * Defendant Party Code
 */
PartyTypeCodesEnum.DEFENDANT = "DEFENDANT";

/**
 * Solicitor Party Code
 */
PartyTypeCodesEnum.SOLICITOR = "SOLICITOR";

/**
 * Part 20 Defendant Party Code
 */
PartyTypeCodesEnum.PART_20_DEFENDANT = "PT 20 DEF";

/**
 * Part 20 Claimant Party Code
 */
PartyTypeCodesEnum.PART_20_CLAIMANT = "PT 20 CLMT";

/**
 * Creditor Party Code
 */
PartyTypeCodesEnum.CREDITOR = "CREDITOR";

/**
 * Debtor Party Code
 */
PartyTypeCodesEnum.DEBTOR = "DEBTOR";

/**
 * Applicant Party Code
 */
PartyTypeCodesEnum.APPLICANT = "APPLICANT";

/**
 * Official Receiver Party Code
 */
PartyTypeCodesEnum.OFFICIAL_RECEIVER = "OFF REC";

/**
 * Insolvency Practitioner Party Code
 */
PartyTypeCodesEnum.INSOLVENCY_PRACTITIONER = "INS PRAC";

/**
 * Petitioner Party Code
 */
PartyTypeCodesEnum.PETITIONER = "PETITIONER";

/**
 * The Company Party Code
 */
PartyTypeCodesEnum.THE_COMPANY = "COMPANY";

/**
 * Petitioner Party Code
 */
PartyTypeCodesEnum.TRUSTEE = "TRUSTEE";

/**
 * Function converts a party type code to a party type description.
 * 
 * @param [String] partyTypeCode party type code
 * @return [String] The party type description.
 * @author rzxd7g
 */
PartyTypeCodesEnum.getPartyTypeDescription = function(partyTypeCode)
{
	var description = null;
	switch ( partyTypeCode )
	{
		case PartyTypeCodesEnum.CLAIMANT:
			description = "Claimant";
			break;
		case PartyTypeCodesEnum.DEFENDANT:
			description = "Defendant";
			break;
		case PartyTypeCodesEnum.SOLICITOR:
			description = "Solicitor";
			break;
		case PartyTypeCodesEnum.PART_20_CLAIMANT:
			description = "Part 20 Claimant";
			break;
		case PartyTypeCodesEnum.PART_20_DEFENDANT:
			description = "Part 20 Defendant";
			break;
		case PartyTypeCodesEnum.CREDITOR:
			description = "Creditor";
			break;
		case PartyTypeCodesEnum.DEBTOR:
			description = "Debtor";
			break;
		case PartyTypeCodesEnum.APPLICANT:
			description = "Applicant";
			break;
		case PartyTypeCodesEnum.OFFICIAL_RECEIVER:
			description = "Official Receiver";
			break;
		case PartyTypeCodesEnum.INSOLVENCY_PRACTITIONER:
			description = "Insolvency Practitioner";
			break;
		case PartyTypeCodesEnum.PETITIONER:
			description = "Petitioner";
			break;
		case PartyTypeCodesEnum.THE_COMPANY:
			description = "The Company";
			break;
		case PartyTypeCodesEnum.TRUSTEE:
			description = "Trustee";
			break;
		default:
			description = "";
	}
	return description;
}
