/** 
 * @fileoverview RunDividendDeclaration_HelperFunctions.js:
 * This file contains the helper functions for UC075 - Run Dividend Declaration screen
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 */


/**
 * Function calls the service which retrieves a list of all Consolidated Orders on the 
 * user's court code that have previously has a dividend declared.
 * @author rzxd7g
 * 
 */
function retrieveConsolidatedOrders()
{
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", courtCode);
	Services.callService("getDividendsDeclared", params, runDividendDeclaration, false);
}

/*********************************************************************************/

/**
 * Function handles the exit from the screen back to the menu
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
function transformCurrencyToDisplay(value) 
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

/**
 * Function calls a service to clear the lock on the screen and remove any data from 
 * relevant tables as the user wishes to exit the screen without running the report.
 * @author rzxd7g
 * 
 */
function cancelDividendPayout()
{
	var payoutRun = Services.getValue(PAYOUT_LOCK_IND_XPATH);
	if ( payoutRun == "true" )
	{
		// The REPORT_DATA table need to be unlocked and other data removed
		var params = new ServiceParams();
		Services.callService("cancelDividendPayout", params, Status_CloseButton, true);
	}
	else
	{
		// No need to unlock the screen, just exit
		exitScreen();
	}
}

/*********************************************************************************/

/**
 * Function calls the retrieval service which checks for start of day, end of day and 
 * payout status before returning the list of COs with the adhoc_dividend flag set to
 * 'Y'.
 * @author rzxd7g
 * 
 */
function getDividendDeclarationData()
{
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);

    //Check the Suitors Cash End Of Day report has run
    var dataNode = XML.createDOM(null, null, null);
	Services.setValue(REPORT_DATA_XPATH + "/ReportType", "DIV");
	Services.setValue(REPORT_DATA_XPATH + "/ReportDate", CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate") );
	Services.setValue(REPORT_DATA_XPATH + "/ReportNumber", 0);
	Services.setValue(REPORT_DATA_XPATH + "/UserID", Services.getCurrentUser());
	Services.setValue(REPORT_DATA_XPATH + "/CourtCode", courtCode);
	dataNode.appendChild( Services.getNode(REPORT_DATA_XPATH) );
	
	// Get the system date in YYYY-MM-DD format
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	// Return system date as a string in YYYYMMDD format (i.e. remove the hyphens)
	var systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");
	
	var params = new ServiceParams();
	params.addSimpleParameter("runDate", "CFO RUNDATE");
	params.addSimpleParameter("systemDate", systemDate);
	params.addDOMParameter("reportData", dataNode);
	params.addSimpleParameter("adminCourtCode", courtCode);
	Services.callService("getRunDividendDeclarationData", params, runDividendDeclaration, true);
}
