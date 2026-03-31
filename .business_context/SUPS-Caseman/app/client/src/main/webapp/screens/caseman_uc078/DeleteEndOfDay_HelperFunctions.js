/** 
 * @fileoverview DeleteEndOfDay_HelperFunctions.js:
 * This file contains the helper functions for UC078 - Delete End Of Day screen
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 */

/**
 * Indicates whether or not payment in data exists for the report
 * @return [Boolean] True if Payment In data exists else false
 * @author rzxd7g
 */
function paymentInDataExists()
{
	return Services.exists(PAYMENTIN_DATA_XPATH) ? true : false;
}

/*********************************************************************************/

/**
 * Indicates whether or not payment out data exists for the report 
 * @return [Boolean] True if Payment Out data exists else false
 * @author rzxd7g
 */
function paymentOutDataExists()
{
	return Services.exists(PAYMENTOUT_DATA_XPATH) ? true : false;
}

/*********************************************************************************/

/**
 * Function sets the data in the header panel as is returned in the Payment In/Out nodes 
 * @author rzxd7g
 * 
 */
function setHeaderData()
{
	if ( paymentInDataExists() )
	{
		// Payment In data exists, take the report id and date from the Payment In node
		var reportId = Services.getValue(PAYMENTIN_DATA_XPATH + "/ReportId");
		var reportDate = Services.getValue(PAYMENTIN_DATA_XPATH + "/DCSDate");
	}
	else
	{
		// Payment Out data exists where Payment In data doesn't, take data from here instead
		var reportId = Services.getValue(PAYMENTOUT_DATA_XPATH + "/ReportId");
		var reportDate = Services.getValue(PAYMENTOUT_DATA_XPATH + "/DCSDate");
	}
	
	// Set the header data
	Services.startTransaction();
	Services.setValue(Header_ReportNumber.dataBinding, reportId);
	Services.setValue(Header_ReportDate.dataBinding, reportDate);
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function calculates the totals for the Payments In and Payments Out
 * @author rzxd7g
 * 
 */
function calculateTotals()
{
	if ( paymentInDataExists() )
	{
		// Calculate the Payment In total
		var ordinary = parseFloat( Services.getValue(PaymentsIn_Ordinary.dataBinding) );
		var cheque = parseFloat( Services.getValue(PaymentsIn_Cheque.dataBinding) );
		var judgment1000 = parseFloat( Services.getValue(PaymentsIn_Judgment1000.dataBinding) );
		var aoCaeo = parseFloat( Services.getValue(PaymentsIn_AOCAEO.dataBinding) );
		var miscellaneous = parseFloat( Services.getValue(PaymentsIn_Miscellaneous.dataBinding) );
		var total = ordinary + cheque + judgment1000 + aoCaeo + miscellaneous;
		Services.setValue(PaymentsIn_GrandTotalIn.dataBinding, total);
	}
	
	if ( paymentOutDataExists() )
	{
		// Calculate the Payment Out total
		var ordinary = parseFloat( Services.getValue(PaymentsOut_Ordinary.dataBinding) );
		var cheque = parseFloat( Services.getValue(PaymentsOut_Cheque.dataBinding) );
		var judgment1000 = parseFloat( Services.getValue(PaymentsOut_Judgment1000.dataBinding) );
		var aoCaeo = parseFloat( Services.getValue(PaymentsOut_AOCAEO.dataBinding) );
		var miscellaneous = parseFloat( Services.getValue(PaymentsOut_Miscellaneous.dataBinding) );
		var total = ordinary + cheque + judgment1000 + aoCaeo + miscellaneous;
		Services.setValue(PaymentsOut_GrandTotalOut.dataBinding, total);
	}
}

/*********************************************************************************/

/**
 * Function handles the exit from the screen, checking if a call stack exists.  If a 
 * stack does not exist, then navigates to the main menu.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
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
function transformCurrencyToDisplay(value, inout) 
{
	if ( inout == "I" )
	{
		// Payment In Currency field
		if ( !paymentInDataExists() )
		{
			return "";
		}
	}
	else
	{
		// Payment Out Currency field
		if ( !paymentOutDataExists() )
		{
			return "";
		}
	}
	
	return CaseManUtils.transformCurrencySymbolToDisplay(value, REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}
