/** 
 * @fileoverview ViewCODividends.js:
 * This file contains the main form configurations for UC111 - View CO Dividends screen
 *
 * @author Tim Connor, Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 05/06/2006 - Chris Vincent, changed global variables to static variables.  Also 
 *				moved the constants to this file from the separate constants file.
 */

/**
 * XPath Constants
 * @author fzj0yl
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.CO_XPATH = "/ds/MaintainCO";
XPathConstants.DIVIDENDS_XPATH = XPathConstants.CO_XPATH + "/Dividends";
XPathConstants.SELECTED_DIVIDEND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedDividend";
XPathConstants.DEBT_DIVIDENDS_XPATH = XPathConstants.DIVIDENDS_XPATH + "/Dividend[./Number = " + XPathConstants.SELECTED_DIVIDEND_XPATH + "]/Debts"
XPathConstants.SELECTED_DEBT_DIVIDEND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedDebtDividend";

/****************************** MAIN FORM *****************************************/

function ViewCODividends() {};

/**
 * @author fzj0yl
 * 
 */
ViewCODividends.initialise = function() 
{
	// Retrieve the parameter from the calling screen
	var CONumber = Services.getValue(ViewDividendsParams.CO_NUMBER);
	if ( !CaseManUtils.isBlank(CONumber) )
	{
		//Retrieve the CO header details
		var params = new ServiceParams();
		params.addSimpleParameter("coNumber", CONumber);
		Services.callService("getCoHeader", params, ViewCODividends, false);
		Services.callService("getCoDividends", params, ViewCODividends, false);	
	}
	else
	{
		// Exit the screen if incorrect details have been passed in
		exitScreen();
	}
}

/**
 * @param dom
 * @param serviceName
 * @author fzj0yl
 * 
 */
ViewCODividends.onSuccess = function(dom, serviceName) 
{
    if ( serviceName == "getCoHeader" ) 
    {
    	// Insert the summary CO Data into the DOM
        Services.replaceNode(XPathConstants.CO_XPATH, dom.selectSingleNode(XPathConstants.CO_XPATH));
    } 
    else if ( serviceName == "getCoDividends" )
    {
    	// Insert the Dividends in the DOM
        Services.replaceNode(XPathConstants.DIVIDENDS_XPATH, dom.selectSingleNode(XPathConstants.DIVIDENDS_XPATH));
    }
}

ViewCODividends.refDataServices = [
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] }
];

/********************************** GRIDS *****************************************/

function DividendDetails_DividendsGrid() {};
DividendDetails_DividendsGrid.tabIndex = 1;
DividendDetails_DividendsGrid.dataBinding = XPathConstants.SELECTED_DIVIDEND_XPATH;
DividendDetails_DividendsGrid.srcData = XPathConstants.DIVIDENDS_XPATH;
DividendDetails_DividendsGrid.rowXPath = "Dividend";
DividendDetails_DividendsGrid.keyXPath = "Number";
DividendDetails_DividendsGrid.columns = [
	{xpath: "Number"},
	{xpath: "Date", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "ReportId"},
	{xpath: "AmountCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Amount", transformToDisplay: transformAmountToDisplay},
	{xpath: "FeeCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Fee", transformToDisplay: transformAmountToDisplay},
	{xpath: "CreatedBy"}
];

/***********************************************************************************/

function DebtDetails_DebtsGrid() {};
DebtDetails_DebtsGrid.tabIndex = 10;
DebtDetails_DebtsGrid.dataBinding = XPathConstants.SELECTED_DEBT_DIVIDEND_XPATH;
DebtDetails_DebtsGrid.srcData = XPathConstants.DEBT_DIVIDENDS_XPATH;
DebtDetails_DebtsGrid.retrieveOn = [DividendDetails_DividendsGrid.dataBinding];
DebtDetails_DebtsGrid.srcDataOn = [DividendDetails_DividendsGrid.dataBinding];
DebtDetails_DebtsGrid.rowXPath = "Debt";
DebtDetails_DebtsGrid.keyXPath = "Number";
DebtDetails_DebtsGrid.columns = [
	{xpath: "CreditorName"},
	{xpath: "PayeeDetails"},
	{xpath: "AmountCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Amount", transformToDisplay: transformAmountToDisplay},
	{xpath: "PONumber", transformToDisplay: transformPONumberToDisplay},
	{xpath: "TotalPOCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "TotalPO", transformToDisplay: transformAmountToDisplay}
];

DebtDetails_DebtsGrid.enableOn = [DividendDetails_DividendsGrid.dataBinding];
DebtDetails_DebtsGrid.isEnabled = function()
{
	// Disabled if no dividends on the CO record
	var countDividends = Services.countNodes(DividendDetails_DividendsGrid.srcData + "/" + DividendDetails_DividendsGrid.rowXPath);
	return ( countDividends == 0 ) ? false : true;
}

/********************************* FIELDS ******************************************/

function Header_CONumber() {};
Header_CONumber.tabIndex = -1;
Header_CONumber.helpText = "Unique Consolidated Order identifier";
Header_CONumber.dataBinding = XPathConstants.CO_XPATH + "/CONumber";
Header_CONumber.transformToDisplay = toUpperCase;
Header_CONumber.isReadOnly = function() { return true; }

/***********************************************************************************/

function Header_OldCONumber() {};
Header_OldCONumber.tabIndex = -1;
Header_OldCONumber.helpText = "The previous CO number for the CO";
Header_OldCONumber.dataBinding = XPathConstants.CO_XPATH + "/OldNumber";
Header_OldCONumber.transformToDisplay = toUpperCase;
Header_OldCONumber.isReadOnly = function() { return true; }

/***********************************************************************************/

function Header_COType() {};
Header_COType.tabIndex = -1;
Header_COType.helpText = "Consolidated Order type";
Header_COType.dataBinding = XPathConstants.CO_XPATH + "/COType";
Header_COType.transformToDisplay = toUpperCase;
Header_COType.isReadOnly = function() { return true; }

/***********************************************************************************/

function Header_DebtorName() {};
Header_DebtorName.tabIndex = -1;
Header_DebtorName.helpText = "Debtor Name for the Consolidated Order";
Header_DebtorName.dataBinding = XPathConstants.CO_XPATH + "/DebtorName";
Header_DebtorName.transformToDisplay = toUpperCase;
Header_DebtorName.isReadOnly = function() { return true; }

/***********************************************************************************/

function Header_COStatus() {};
Header_COStatus.tabIndex = -1;
Header_COStatus.helpText = "Status of the Consolidated Order";
Header_COStatus.dataBinding = XPathConstants.CO_XPATH + "/COStatus";
Header_COStatus.transformToDisplay = toUpperCase;
Header_COStatus.isReadOnly = function() { return true; }

/***********************************************************************************/

function DebtDetails_PayeeDetails() {};
DebtDetails_PayeeDetails.retrieveOn = [DividendDetails_DividendsGrid.dataBinding, DebtDetails_DebtsGrid.dataBinding];
DebtDetails_PayeeDetails.tabIndex = -1;
DebtDetails_PayeeDetails.helpText = "Payee details";
DebtDetails_PayeeDetails.dataBinding = XPathConstants.DEBT_DIVIDENDS_XPATH + "/Debt[./Number = " + XPathConstants.SELECTED_DEBT_DIVIDEND_XPATH + "]/PayeeDetails";
DebtDetails_PayeeDetails.transformToDisplay = toUpperCase;
DebtDetails_PayeeDetails.isReadOnly = function() { return true; }
DebtDetails_PayeeDetails.enableOn = [DividendDetails_DividendsGrid.dataBinding];
DebtDetails_PayeeDetails.isEnabled = function()
{
	// Disabled if no dividends on the CO record
	var countDividends = Services.countNodes(DividendDetails_DividendsGrid.srcData + "/" + DividendDetails_DividendsGrid.rowXPath);
	return ( countDividends == 0 ) ? false : true;
}

/******************************** BUTTONS *****************************************/

function Status_CloseButton() {};

Status_CloseButton.tabIndex = 20;

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "ViewCODividends" } ]
	}
};

/**
 * @author fzj0yl
 * 
 */
Status_CloseButton.actionBinding = function() 
{
    exitScreen();
}
