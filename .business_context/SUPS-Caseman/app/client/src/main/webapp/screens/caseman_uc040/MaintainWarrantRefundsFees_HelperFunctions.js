/** 
 * @fileoverview MaintainWarrantRefundsFees_HelperFunctions.js:
 * This file contains the helper functions for UC040 - Maintain Warrant Refunds and Fees screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 01/06/2006 - Chris Vincent, Changed global variables to static variables.
 * 15/08/2006 - Chris Vincent, Changed the calculateTotalFees function so the value returned is
 * 				wrapped by transformFeeForGrid to return a valid value as some were greater than 
 * 				10 characters.  Defect 4294.
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
	Services.removeNode(MaintainWarrantAmountParams.PARENT);
	if ( NavigationController.callStackExists() )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		// return to the AE Menu screen
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Function retrieves the case data from the database
 * @author rzxd7g
 * 
 */
function retrieveWarrantData()
{
	var warrantID = Services.getValue(MaintainWarrantAmountParams.WARRANT_ID);
	var params = new ServiceParams();
	params.addSimpleParameter("warrantID", warrantID);
	Services.callService("getWarrantSummary", params, maintainWarrantRefundsFees, true);
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
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.DEFAULTCURRENCY_XPATH);
}

/*********************************************************************************/

/**
 * Function converts a fee to 2 decimal places for use in a grid
 * @param [Integer] value Amount to be converted
 * @returns [Float] Amount to two decimal places
 * @author rzxd7g
 */
function transformFeeForGrid(value)
{
	// Use the CaseManUtils function, setting the maximum length to 8
	return CaseManUtils.transformAmountToTwoDP(value, 8);
}

/*********************************************************************************/

/**
 * Function indicates whether or not an AE Fee has been created today
 * @returns [Boolean] Returns true if a Fee has been created already today
 * @author rzxd7g
 */
function feeCreatedToday()
{
	var today = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
	var feeExists = Services.exists(XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant[./Type = 'FEE' and ./DateCreated = '" + today + "' and ./Deleted != 'Y']");
	return feeExists;
}

/*********************************************************************************/

/**
 * Function indicates whether or not an AE Refund has been created today
 * @returns [Boolean] Returns true if a Refund has been created already today
 * @author rzxd7g
 */
function refundCreatedToday()
{
	var today = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
	var refundExists = Services.exists(XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant[./Type = 'REFUND' and ./DateCreated = '" + today + "' and ./Deleted != 'Y']");
	return refundExists;
}

/*********************************************************************************/

/**
 * Function adds or removes a minus (-) sign from an amount depending on type
 * @param [String] value unprocessed value
 * @param [String] amountType type of the amount record (FEE or REFUND)
 * @returns [String] Returns processed value
 * @author rzxd7g
 */
function evaluateValueSign(value, amountType)
{
	if ( !CaseManUtils.isBlank(value) )
	{
		if ( AmountTypes.AMOUNTTYPE_FEE == amountType )
		{
			// Remove the minus sign for positive fee amounts
			value = value.replace(/-/, "");
		}
		else
		{
			// Add the minus sign for negative refund amounts
			if ( value.charAt(0) != "-" )
			{
				value = "-" + value;
			}
		}
	}
	return value;
}

/*********************************************************************************/

/**
 * Function calculates the total fees based upon all fees & refunds available
 * @returns [Float] returns the total fees
 * @author rzxd7g
 */
function calculateTotalFees()
{
	var totalFees = 0.00;
	var tempAmount;

	// Accumulate the total fees from the main amounts grid
	for (var i=0; i<Services.countNodes(XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant"); i++)
	{
		if ( Services.getValue(XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant[" + (i+1) + "]/Deleted") != "Y" )
		{
			tempAmount = Services.getValue(XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant[" + (i+1) + "]/Amount");
			if ( null == CaseManValidationHelper.validatePattern(tempAmount, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg") )
			{
				// Add fee if it is valid amount
				totalFees = totalFees + parseFloat(tempAmount);
			}
		}
	}
	
	// Accumulate the total fees from the new amounts grid
	for (var i=0; i<Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant"); i++)
	{
		tempAmount = Services.getValue(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant[" + (i+1) + "]/Amount");
		if ( null == CaseManValidationHelper.validatePattern(tempAmount, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg") )
		{
			// Add fee if it is valid amount
			totalFees = totalFees + parseFloat(tempAmount);
		}
	}

	return transformFeeForGrid( parseFloat(totalFees) );
}

/*********************************************************************************/

/**
 * Function finds the largest amount surrogate id and returns that number plus 1
 * @returns [Integer] Returns the next largest surrogate id
 * @author rzxd7g
 */
function generateNextSurrogateId()
{
	var surrogateId = 0;
	var countNewAmounts = Services.countNodes(XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant");
	
	if ( 0 == countNewAmounts )
	{
		// No new amounts, so get largest surrogate id from main grid data source
		var xpathRoot = XPathConstants.DATA_XPATH + "/WarrantAmounts/Warrant";
	}
	else
	{
		// Get the latest surrogate id from the new amounts grid data source
		var xpathRoot = XPathConstants.NEWAMOUNTS_XPATH + "/WarrantAmounts/Warrant";
	}

	// Loop through the amounts in the appropriate grid and get the largest id
	var temp = "";
	for (var i=0; i<Services.countNodes(xpathRoot); i++)
	{
		temp = parseInt(Services.getValue(xpathRoot + "[" + (i+1) + "]/SurrogateId" ));
		if (temp > surrogateId)
		{
			surrogateId = temp;
		}
	}
	return (surrogateId + 1);
}

/*********************************************************************************/

/**
 * Function indicates whether or not the data is dirty
 * @returns [Boolean] returns true if the data on the form is dirty
 * @author rzxd7g
 */
function isDataDirty()
{
	var dirtyFlag = Services.getValue(XPathConstants.DATA_CHANGED_XPATH);
	return ( dirtyFlag == "true" );
}

/*********************************************************************************/

/**
 * Function sets the dirty flag on the form
 * @author rzxd7g
 * 
 */
function setDirtyFlag()
{
	if ( !isDataDirty() )
	{
		Services.setValue(XPathConstants.DATA_CHANGED_XPATH, "true");
	}
}
