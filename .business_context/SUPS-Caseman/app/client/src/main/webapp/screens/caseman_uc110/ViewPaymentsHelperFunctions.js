/** 
 * @fileoverview ViewPaymentsHelperFunctions.js:
 * This file contains the helper functions for UC110 - View Payments screen
 *
 * @author Tim Connor, Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 */

/**
 * Function handles the exit from the screen, checking if a call stack exists.  If a 
 * stack does not exist, then navigates to the main menu.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.removeNode(ViewPaymentsParams.PARENT);
	if( NavigationController.callStackExists() ) 
	{
		NavigationController.nextScreen();
	}
	else 
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * A number of the fields on the ViewPayments screen should not be displayed if the 
 * enforcement type is 'CO' or if passthrough is 'N' and error is 'Y'
 *
 * @returns [Boolean] true if the payment is valid
 * @author rzxd7g
 */
function isPaymentValid() 
{
	// Not valid if passthrough is 'N' and error is 'Y'
	var passthrough = Services.getValue(PaymentDetails_Passthrough.dataBinding);
	var errorInd = Services.getValue(PaymentDetails_Error.dataBinding);
	if ( passthrough == "N" && errorInd == "Y" )
	{
		return false;
	}

	// Not valid if the enforcement type is 'CO'
	var enfType = Services.getValue(PaymentDetails_EnforcementType.dataBinding);
	return ( enfType == ViewPaymentsParamsConstants.CO ) ? false : true;
}

/*********************************************************************************/

/**
 * If the payment is not a passthrough and had been referred to drawer, the payee details are not shown.
 * @returns [Boolean] true if the payee details are to be displayed
 * @author rzxd7g
 */
function showPayeeDetails() 
{
    var passthrough = Services.getValue(PaymentDetails_Passthrough.dataBinding);
    var RDDate = Services.getValue(PaymentDetails_RDDate.dataBinding);
    if( !CaseManUtils.isBlank(RDDate) && passthrough == "N" ) 
    {
        return false;
    }
    return true;
}

/*********************************************************************************/

/**
 * If the payment is for a case, and notes start with DEFAULT, and passthrough="Y", don't show the notes.
 * @param [String] notes The Notes
 * @returns [Boolean] true if the notes are to be displayed
 * @author rzxd7g
 */
function displayNotes(notes) 
{
	if ( CaseManUtils.isBlank(notes) )
	{
		return true;
	}

	var startOfNotes = notes.substring(0, 7);
    var enforcementType = Services.getValue(PaymentDetails_EnforcementType.dataBinding);
    var passthrough = Services.getValue(PaymentDetails_Passthrough.dataBinding);
    if( enforcementType == ViewPaymentsParamsConstants.CASE && 
    	passthrough == "Y" && 
    	startOfNotes.toUpperCase() == "DEFAULT" ) 
    {
        return false;
    }
    return true;
}

/*********************************************************************************/

/**
 * Function converts a value to upper case 
 * @param [String] value String to be converted
 * @returns [String] Value converted to upper case
 * @author rzxd7g
 */
function toUpperCase(value) 
{
   	return (null != value) ? value.toUpperCase() : null;    
}

/*********************************************************************************/

/**
 * Function converts a fee to 2 decimal places for use in a grid
 * @param [Integer] value Amount to be converted
 * @returns [Float] Amount to two decimal places
 * @author rzxd7g
 */
function transformAmountToDisplay(value) 
{
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal))
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}

/*********************************************************************************/

/**
 * Function converts a currency identifier e.g. GBP to a currency symbol (£)
 * @param [String] value Currency identifier to be converted to a symbol
 * @returns [String] Currency symbol to display on screen
 * @author rzxd7g
 */
function transformCurrencyToDisplay(value) 
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

/**
 * Function returns the paid in by details for the selected payment.  If a party role
 * and a party number have been entered then the paid in by is [PARTY TYPE] - [PARTY NUMBER]
 * else if not specified, will just use the party name.
 *
 * @param [Integer] rowId Unique identifier for the payment
 * @returns [String] The paid in by string
 * @author rzxd7g
 */
function getPaidInBy(rowId) 
{
	var xp = XPathConstants.PAYMENTS_XPATH + "/Payment[./Id=" + rowId + "]/Lodgment";
	var partyName = Services.getValue(xp + "/Name");
	var partyType = Services.getValue(xp + "/PartyRole");
	var partyNumber = Services.getValue(xp + "/CasePartyNumber");
	var adline1 = Services.getValue(xp + "/ContactDetails/Address/Line[1]");
	var adline2 = Services.getValue(xp + "/ContactDetails/Address/Line[2]");

	var paidInBy = "";
	if ( CaseManUtils.isBlank(adline1) && CaseManUtils.isBlank(adline2) && !CaseManUtils.isBlank(partyName) )
	{
		// No lodgment address so return party name
		paidInBy = partyName;
	}
	else if ( !CaseManUtils.isBlank(partyType) )
	{
		// At least a party type is available so return party type
		paidInBy = partyType;
		if ( !CaseManUtils.isBlank(partyNumber) )
		{
			// Number is also available so add the party number to the return string
			paidInBy = paidInBy + " " + partyNumber;
		}
	}
	return paidInBy;
}
