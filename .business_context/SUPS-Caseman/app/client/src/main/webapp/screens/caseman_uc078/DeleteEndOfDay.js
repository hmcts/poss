/** 
 * @fileoverview DeleteEndOfDay.js:
 * This file contains the form and field configurations for the UC078 - Delete End Of Day 
 * screen.
 *
 * @author Chris Vincent
 * @version 0.1
 */

/****************************** MAIN FORM *****************************************/

function deleteEndOfDay() {};

/**
 * @author rzxd7g
 * 
 */
deleteEndOfDay.initialise = function()
{
	// Retrieve End of Day Report Details
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var systemDate = CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate");
	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", courtCode );
	params.addSimpleParameter("dcsDate", systemDate );
	Services.callService("getEndOfDayData", params, deleteEndOfDay, true);
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
deleteEndOfDay.onSuccess = function(dom) 
{
	// Place the data in the DOM, set the header data and calculate the totals
	Services.replaceNode(DATA_XPATH, dom);
	setHeaderData();
	calculateTotals();
	
	var countRecords = Services.countNodes(DATA_XPATH + "/PaymentSummaries/PaymentSummary");
	var accountingPeriodEnded = Services.getValue(ACCOUNTING_PERIOD_XPATH);
	var noBroughtForwardRow = Services.getValue(BROUGHT_FORWARD_ROW_XPATH);
	if ( countRecords == 0 || accountingPeriodEnded == "true" || noBroughtForwardRow == "true" )
	{
		// Call the save button to display the error message in the status bar
		Status_SaveButton.actionBinding();
	}
}

deleteEndOfDay.refDataServices = [
	{ name:"SystemDate",      dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",      serviceParams:[] },
	{ name:"CurrentCurrency", dataBinding:REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] }
];

/********************************* FIELDS ******************************************/

function Header_ReportNumber() {};
Header_ReportNumber.dataBinding = DATA_XPATH + "/ReportNumber";
Header_ReportNumber.helpText = "The report number for the current date";
Header_ReportNumber.tabIndex = -1;
Header_ReportNumber.isReadOnly = function() { return true; }
Header_ReportNumber.enableOn = [PAYMENTIN_DATA_XPATH, PAYMENTOUT_DATA_XPATH];
Header_ReportNumber.isEnabled = function()
{
	if ( !paymentInDataExists() && !paymentOutDataExists() )
	{
		return false;
	}
	return true;
}

/***********************************************************************************/

function Header_ReportDate() {};
Header_ReportDate.dataBinding = DATA_XPATH + "/ReportDate";
Header_ReportDate.helpText = "End of day report date";
Header_ReportDate.tabIndex = -1;
Header_ReportDate.isReadOnly = function() { return true; }
Header_ReportDate.enableOn = [PAYMENTIN_DATA_XPATH, PAYMENTOUT_DATA_XPATH];
Header_ReportDate.isEnabled = function()
{
	if ( !paymentInDataExists() && !paymentOutDataExists() )
	{
		return false;
	}
	return true;
}

/***********************************************************************************/

function PaymentsIn_OrdinaryCurrency() {};
PaymentsIn_OrdinaryCurrency.dataBinding = PAYMENTIN_DATA_XPATH + "/OrdinaryCurrency";
PaymentsIn_OrdinaryCurrency.helpText = "Currency for ordinary payments in";
PaymentsIn_OrdinaryCurrency.tabIndex = -1;
PaymentsIn_OrdinaryCurrency.isReadOnly = function() { return true; }
PaymentsIn_OrdinaryCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "I");
}
PaymentsIn_OrdinaryCurrency.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_OrdinaryCurrency.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_Ordinary() {};
PaymentsIn_Ordinary.dataBinding = PAYMENTIN_DATA_XPATH + "/Ordinary";
PaymentsIn_Ordinary.helpText = "Sum of ordinary payments IN";
PaymentsIn_Ordinary.tabIndex = -1;
PaymentsIn_Ordinary.isReadOnly = function() { return true; }
PaymentsIn_Ordinary.transformToDisplay = transformAmountToDisplay;
PaymentsIn_Ordinary.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_Ordinary.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_ChequeCurrency() {};
PaymentsIn_ChequeCurrency.dataBinding = PAYMENTIN_DATA_XPATH + "/ChequeCurrency";
PaymentsIn_ChequeCurrency.helpText = "Currency for cheque payments in";
PaymentsIn_ChequeCurrency.tabIndex = -1;
PaymentsIn_ChequeCurrency.isReadOnly = function() { return true; }
PaymentsIn_ChequeCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "I");
}
PaymentsIn_ChequeCurrency.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_ChequeCurrency.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_Cheque() {};
PaymentsIn_Cheque.dataBinding = PAYMENTIN_DATA_XPATH + "/Cheque";
PaymentsIn_Cheque.helpText = "Sum of cheque payments IN";
PaymentsIn_Cheque.tabIndex = -1;
PaymentsIn_Cheque.isReadOnly = function() { return true; }
PaymentsIn_Cheque.transformToDisplay = transformAmountToDisplay;
PaymentsIn_Cheque.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_Cheque.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_Judgment1000Currency() {};
PaymentsIn_Judgment1000Currency.dataBinding = PAYMENTIN_DATA_XPATH + "/Judgment1000Currency";
PaymentsIn_Judgment1000Currency.helpText = "Currency for Judgment 1000+ payments in";
PaymentsIn_Judgment1000Currency.tabIndex = -1;
PaymentsIn_Judgment1000Currency.isReadOnly = function() { return true; }
PaymentsIn_Judgment1000Currency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "I");
}
PaymentsIn_Judgment1000Currency.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_Judgment1000Currency.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_Judgment1000() {};
PaymentsIn_Judgment1000.dataBinding = PAYMENTIN_DATA_XPATH + "/Judgment1000";
PaymentsIn_Judgment1000.helpText = "Sum of Judgment 1000+ payments IN";
PaymentsIn_Judgment1000.tabIndex = -1;
PaymentsIn_Judgment1000.isReadOnly = function() { return true; }
PaymentsIn_Judgment1000.transformToDisplay = transformAmountToDisplay;
PaymentsIn_Judgment1000.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_Judgment1000.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_AOCAEOCurrency() {};
PaymentsIn_AOCAEOCurrency.dataBinding = PAYMENTIN_DATA_XPATH + "/AOCAEOCurrency";
PaymentsIn_AOCAEOCurrency.helpText = "Currency for AO/CAEO payments in";
PaymentsIn_AOCAEOCurrency.tabIndex = -1;
PaymentsIn_AOCAEOCurrency.isReadOnly = function() { return true; }
PaymentsIn_AOCAEOCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "I");
}
PaymentsIn_AOCAEOCurrency.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_AOCAEOCurrency.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_AOCAEO() {};
PaymentsIn_AOCAEO.dataBinding = PAYMENTIN_DATA_XPATH + "/AOCAEO";
PaymentsIn_AOCAEO.helpText = "Sum of AO/CAEO payments IN";
PaymentsIn_AOCAEO.tabIndex = -1;
PaymentsIn_AOCAEO.isReadOnly = function() { return true; }
PaymentsIn_AOCAEO.transformToDisplay = transformAmountToDisplay;
PaymentsIn_AOCAEO.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_AOCAEO.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_MiscellaneousCurrency() {};
PaymentsIn_MiscellaneousCurrency.dataBinding = PAYMENTIN_DATA_XPATH + "/MiscellaneousCurrency";
PaymentsIn_MiscellaneousCurrency.helpText = "Currency for miscellaneous payments in";
PaymentsIn_MiscellaneousCurrency.tabIndex = -1;
PaymentsIn_MiscellaneousCurrency.isReadOnly = function() { return true; }
PaymentsIn_MiscellaneousCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "I");
}
PaymentsIn_MiscellaneousCurrency.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_MiscellaneousCurrency.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_Miscellaneous() {};
PaymentsIn_Miscellaneous.dataBinding = PAYMENTIN_DATA_XPATH + "/Miscellaneous";
PaymentsIn_Miscellaneous.helpText = "Sum of Miscellaneous payments IN";
PaymentsIn_Miscellaneous.tabIndex = -1;
PaymentsIn_Miscellaneous.isReadOnly = function() { return true; }
PaymentsIn_Miscellaneous.transformToDisplay = transformAmountToDisplay;
PaymentsIn_Miscellaneous.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_Miscellaneous.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_GrandTotalInCurrency() {};
PaymentsIn_GrandTotalInCurrency.retrieveOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_GrandTotalInCurrency.dataBinding = PAYMENTIN_DATA_XPATH + "/GrandTotalCurrency";
PaymentsIn_GrandTotalInCurrency.helpText = "Currency for grand total of payments in";
PaymentsIn_GrandTotalInCurrency.tabIndex = -1;
PaymentsIn_GrandTotalInCurrency.isReadOnly = function() { return true; }
PaymentsIn_GrandTotalInCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "I");
}
PaymentsIn_GrandTotalInCurrency.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_GrandTotalInCurrency.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsIn_GrandTotalIn() {};
PaymentsIn_GrandTotalIn.dataBinding = PAYMENTIN_DATA_XPATH + "/GrandTotal";
PaymentsIn_GrandTotalIn.helpText = "Grand total amount for payments IN";
PaymentsIn_GrandTotalIn.tabIndex = -1;
PaymentsIn_GrandTotalIn.isReadOnly = function() { return true; }
PaymentsIn_GrandTotalIn.transformToDisplay = transformAmountToDisplay;
PaymentsIn_GrandTotalIn.enableOn = [PAYMENTIN_DATA_XPATH];
PaymentsIn_GrandTotalIn.isEnabled = paymentInDataExists;

/***********************************************************************************/

function PaymentsOut_OrdinaryCurrency() {};
PaymentsOut_OrdinaryCurrency.dataBinding = PAYMENTOUT_DATA_XPATH + "/OrdinaryCurrency";
PaymentsOut_OrdinaryCurrency.helpText = "Currency for ordinary payments out";
PaymentsOut_OrdinaryCurrency.tabIndex = -1;
PaymentsOut_OrdinaryCurrency.isReadOnly = function() { return true; }
PaymentsOut_OrdinaryCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "O");
}
PaymentsOut_OrdinaryCurrency.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_OrdinaryCurrency.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_Ordinary() {};
PaymentsOut_Ordinary.dataBinding = PAYMENTOUT_DATA_XPATH + "/Ordinary";
PaymentsOut_Ordinary.helpText = "Sum of ordinary payments OUT";
PaymentsOut_Ordinary.tabIndex = -1;
PaymentsOut_Ordinary.isReadOnly = function() { return true; }
PaymentsOut_Ordinary.transformToDisplay = transformAmountToDisplay;
PaymentsOut_Ordinary.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_Ordinary.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_ChequeCurrency() {};
PaymentsOut_ChequeCurrency.dataBinding = PAYMENTOUT_DATA_XPATH + "/ChequeCurrency";
PaymentsOut_ChequeCurrency.helpText = "Currency for cheque payments out";
PaymentsOut_ChequeCurrency.tabIndex = -1;
PaymentsOut_ChequeCurrency.isReadOnly = function() { return true; }
PaymentsOut_ChequeCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "O");
}
PaymentsOut_ChequeCurrency.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_ChequeCurrency.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_Cheque() {};
PaymentsOut_Cheque.dataBinding = PAYMENTOUT_DATA_XPATH + "/Cheque";
PaymentsOut_Cheque.helpText = "Sum of cheque payments OUT";
PaymentsOut_Cheque.tabIndex = -1;
PaymentsOut_Cheque.isReadOnly = function() { return true; }
PaymentsOut_Cheque.transformToDisplay = transformAmountToDisplay;
PaymentsOut_Cheque.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_Cheque.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_Judgment1000Currency() {};
PaymentsOut_Judgment1000Currency.dataBinding = PAYMENTOUT_DATA_XPATH + "/Judgment1000Currency";
PaymentsOut_Judgment1000Currency.helpText = "Currency for Judgment 1000+ payments out";
PaymentsOut_Judgment1000Currency.tabIndex = -1;
PaymentsOut_Judgment1000Currency.isReadOnly = function() { return true; }
PaymentsOut_Judgment1000Currency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "O");
}
PaymentsOut_Judgment1000Currency.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_Judgment1000Currency.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_Judgment1000() {};
PaymentsOut_Judgment1000.dataBinding = PAYMENTOUT_DATA_XPATH + "/Judgment1000";
PaymentsOut_Judgment1000.helpText = "Sum of Judgment 1000+ payments OUT";
PaymentsOut_Judgment1000.tabIndex = -1;
PaymentsOut_Judgment1000.isReadOnly = function() { return true; }
PaymentsOut_Judgment1000.transformToDisplay = transformAmountToDisplay;
PaymentsOut_Judgment1000.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_Judgment1000.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_AOCAEOCurrency() {};
PaymentsOut_AOCAEOCurrency.dataBinding = PAYMENTOUT_DATA_XPATH + "/AOCAEOCurrency";
PaymentsOut_AOCAEOCurrency.helpText = "Currency for AO/CAEO payments out";
PaymentsOut_AOCAEOCurrency.tabIndex = -1;
PaymentsOut_AOCAEOCurrency.isReadOnly = function() { return true; }
PaymentsOut_AOCAEOCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "O");
}
PaymentsOut_AOCAEOCurrency.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_AOCAEOCurrency.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_AOCAEO() {};
PaymentsOut_AOCAEO.dataBinding = PAYMENTOUT_DATA_XPATH + "/AOCAEO";
PaymentsOut_AOCAEO.helpText = "Sum of AO/CAEO payments OUT";
PaymentsOut_AOCAEO.tabIndex = -1;
PaymentsOut_AOCAEO.isReadOnly = function() { return true; }
PaymentsOut_AOCAEO.transformToDisplay = transformAmountToDisplay;
PaymentsOut_AOCAEO.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_AOCAEO.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_MiscellaneousCurrency() {};
PaymentsOut_MiscellaneousCurrency.dataBinding = PAYMENTOUT_DATA_XPATH + "/MiscellaneousCurrency";
PaymentsOut_MiscellaneousCurrency.helpText = "Currency for miscellaneous payments out";
PaymentsOut_MiscellaneousCurrency.tabIndex = -1;
PaymentsOut_MiscellaneousCurrency.isReadOnly = function() { return true; }
PaymentsOut_MiscellaneousCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "O");
}
PaymentsOut_MiscellaneousCurrency.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_MiscellaneousCurrency.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_Miscellaneous() {};
PaymentsOut_Miscellaneous.dataBinding = PAYMENTOUT_DATA_XPATH + "/Miscellaneous";
PaymentsOut_Miscellaneous.helpText = "Sum of miscellaneous payments OUT";
PaymentsOut_Miscellaneous.tabIndex = -1;
PaymentsOut_Miscellaneous.isReadOnly = function() { return true; }
PaymentsOut_Miscellaneous.transformToDisplay = transformAmountToDisplay;
PaymentsOut_Miscellaneous.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_Miscellaneous.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_GrandTotalOutCurrency() {};
PaymentsOut_GrandTotalOutCurrency.retrieveOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_GrandTotalOutCurrency.dataBinding = PAYMENTOUT_DATA_XPATH + "/GrandTotalCurrency";
PaymentsOut_GrandTotalOutCurrency.helpText = "Currency for grand total for payments out";
PaymentsOut_GrandTotalOutCurrency.tabIndex = -1;
PaymentsOut_GrandTotalOutCurrency.isReadOnly = function() { return true; }
PaymentsOut_GrandTotalOutCurrency.transformToDisplay = function(value)
{
	return transformCurrencyToDisplay(value, "O");
}
PaymentsOut_GrandTotalOutCurrency.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_GrandTotalOutCurrency.isEnabled = paymentOutDataExists;

/***********************************************************************************/

function PaymentsOut_GrandTotalOut() {};
PaymentsOut_GrandTotalOut.dataBinding = PAYMENTOUT_DATA_XPATH + "/GrandTotal";
PaymentsOut_GrandTotalOut.helpText = "Grand total for payments OUT";
PaymentsOut_GrandTotalOut.tabIndex = -1;
PaymentsOut_GrandTotalOut.isReadOnly = function() { return true; }
PaymentsOut_GrandTotalOut.transformToDisplay = transformAmountToDisplay;
PaymentsOut_GrandTotalOut.enableOn = [PAYMENTOUT_DATA_XPATH];
PaymentsOut_GrandTotalOut.isEnabled = paymentOutDataExists;

/******************************** BUTTONS *****************************************/

function Status_SaveButton() {};

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "deleteEndOfDay" } ]
	}
};

Status_SaveButton.tabIndex = 1;
/**
 * @author rzxd7g
 * 
 */
Status_SaveButton.actionBinding = function() 
{
	var countRecords = Services.countNodes(DATA_XPATH + "/PaymentSummaries/PaymentSummary");
	var accountingPeriodEnded = Services.getValue(ACCOUNTING_PERIOD_XPATH);
	var noBroughtForwardRow = Services.getValue(BROUGHT_FORWARD_ROW_XPATH);
	var ec = null;
	
	if ( countRecords == 0 )
	{
		ec = ErrorCode.getErrorCode("CaseMan_delEndOfDayNoRecords_Msg");
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
	else if ( accountingPeriodEnded == "true" )
	{
		ec = ErrorCode.getErrorCode("CaseMan_delEndOfDayAccountingPeriodEnded_Msg");
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
	else if ( noBroughtForwardRow == "true" )
	{
		ec = ErrorCode.getErrorCode("CaseMan_delEndOfDayNoBroughtForwardRow_Msg");
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
	else
	{
		if ( confirm(Messages.DELETE_ENDOFDAY_CONFIRM_MESSAGE) )
		{
			// Call service to delete end of day record (mark payment_summary records as valid = 'N')
			var newDOM = XML.createDOM(null, null, null);
			var dataNode = Services.getNode(DATA_XPATH);
			newDOM.appendChild(dataNode);
			var params = new ServiceParams();
			params.addDOMParameter("paymentData", newDOM);
			Services.callService("deleteEndOfDayRecord", params, Status_SaveButton, true);
		}
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Status_SaveButton.onSuccess = function(dom)
{
	// Exit screen
	exitScreen();
}

/***********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 2;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "deleteEndOfDay" } ]
	}
};
