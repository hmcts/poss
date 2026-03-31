/** 
 * @fileoverview ViewCODividendsHelperFunctions.js:
 * This file contains the helper functions for UC111 - View CO Dividends screen
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
	Services.removeNode(ViewDividendsParams.PARENT);
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
	if ( CaseManUtils.isBlank(value) )
	{
		return "0.00";
	}

    var fVal = parseFloat(value).toFixed(2);
    if (isNaN(fVal)) {
        return value;
    }
    return CaseManUtils.isBlank(value) ? "" : fVal;
}

/*********************************************************************************/

/**
 * Function ensures a PO Number is 6 digits in length by padding it with 0s
 * @param [Integer] value PO Number
 * @returns [Integer] The PO Number converted to 6 digits if necessary
 * @author rzxd7g
 */
function transformPONumberToDisplay(value)
{
	if ( CaseManUtils.isBlank(value) )
	{
		return "";
	}

	var PONumberLength = value.length;
	if ( PONumberLength != 6 )
	{
		var iterations = 6 - PONumberLength;
		for ( var i=0; i<iterations; i++ )
		{
			value = "0" + value;
		}
	}
	return value;
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
