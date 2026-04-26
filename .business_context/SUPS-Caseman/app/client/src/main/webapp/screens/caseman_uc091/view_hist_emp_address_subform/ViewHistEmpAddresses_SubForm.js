/** 
 * @fileoverview ViewHistEmpAddresses_SubForm.js:
 * This file contains the configurations for the View Historical Employer Addresses Subform
 *
 * @author Chris Vincent
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/Subforms/ViewEmpHistAddressesSubform/HistoricalAddresses";

/************************** FORM CONFIGURATIONS *************************************/

function viewHistEmpAddressesSubform() {}

viewHistEmpAddressesSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "viewHistEmpAddressesSubform" } ],
					singleClicks: [ {element: "HistoricalAddress_CloseButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/*********************************** GRIDS *****************************************/

/**
 * Grid control in view historical address form extension popup
 * @author rzxd7g
 * 
 */
function viewHistAddrMasterGrid() {};
viewHistAddrMasterGrid.tabIndex = 1;
/**
 * @param index
 * @author rzxd7g
 * @return addressString  
 */
viewHistAddrMasterGrid.concatAddrLines = function(index)
{
	var addressString = "" + Services.getValue(XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = '" + index + "']/Line[1]");
	addressString = addressString + ", " + Services.getValue(XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = '" + index + "']/Line[2]");
	return addressString;
}

viewHistAddrMasterGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedHistoricalAddress";
viewHistAddrMasterGrid.srcData = XPathConstants.FORM_DATA_XPATH;
viewHistAddrMasterGrid.rowXPath = "Address";
viewHistAddrMasterGrid.keyXPath = "SurrogateId";
viewHistAddrMasterGrid.columns = [
	{xpath: "SurrogateId", transformToDisplay: viewHistAddrMasterGrid.concatAddrLines},
	{xpath: "DateFrom", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "DateTo", sort: CaseManUtils.sortGridDatesDsc, additionalSortColumns: [ { columnNumber: 1, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "CreatedBy"}	
];

/****************************** DATA BINDINGS **************************************/

HistoricalAddress_ContactDetails_Address_Line1.dataBinding = XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = " + viewHistAddrMasterGrid.dataBinding + "]/Line[1]";
HistoricalAddress_ContactDetails_Address_Line2.dataBinding = XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = " + viewHistAddrMasterGrid.dataBinding + "]/Line[2]";
HistoricalAddress_ContactDetails_Address_Line3.dataBinding = XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = " + viewHistAddrMasterGrid.dataBinding + "]/Line[3]";
HistoricalAddress_ContactDetails_Address_Line4.dataBinding = XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = " + viewHistAddrMasterGrid.dataBinding + "]/Line[4]";
HistoricalAddress_ContactDetails_Address_Line5.dataBinding = XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = " + viewHistAddrMasterGrid.dataBinding + "]/Line[5]";
HistoricalAddress_ContactDetails_Address_Postcode.dataBinding = XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = " + viewHistAddrMasterGrid.dataBinding + "]/PostCode";
HistoricalAddress_ContactDetails_Address_Reference.dataBinding = XPathConstants.FORM_DATA_XPATH + "/Address[./SurrogateId = " + viewHistAddrMasterGrid.dataBinding + "]/Reference";

/******************************* INPUT FIELDS **************************************/

function HistoricalAddress_ContactDetails_Address_Line1() {};

HistoricalAddress_ContactDetails_Address_Line1.retrieveOn = [viewHistAddrMasterGrid.dataBinding];
HistoricalAddress_ContactDetails_Address_Line1.tabIndex = -1;
HistoricalAddress_ContactDetails_Address_Line1.helpText = "First line of address";

HistoricalAddress_ContactDetails_Address_Line1.isReadOnly = function()
{
	return true;
}

/**********************************************************************************/

function HistoricalAddress_ContactDetails_Address_Line2() {};

HistoricalAddress_ContactDetails_Address_Line2.retrieveOn = [viewHistAddrMasterGrid.dataBinding];
HistoricalAddress_ContactDetails_Address_Line2.tabIndex = -1;
HistoricalAddress_ContactDetails_Address_Line2.helpText = "Second line of address";

HistoricalAddress_ContactDetails_Address_Line2.isReadOnly = function()
{
	return true;
}

/**********************************************************************************/

function HistoricalAddress_ContactDetails_Address_Line3() {};

HistoricalAddress_ContactDetails_Address_Line3.retrieveOn = [viewHistAddrMasterGrid.dataBinding];
HistoricalAddress_ContactDetails_Address_Line3.helpText = "Third line of address";
HistoricalAddress_ContactDetails_Address_Line3.tabIndex = -1;

HistoricalAddress_ContactDetails_Address_Line3.isReadOnly = function()
{
	return true;
}

/**********************************************************************************/

function HistoricalAddress_ContactDetails_Address_Line4() {};

HistoricalAddress_ContactDetails_Address_Line4.retrieveOn = [viewHistAddrMasterGrid.dataBinding];
HistoricalAddress_ContactDetails_Address_Line4.helpText = "Fourth line of address";
HistoricalAddress_ContactDetails_Address_Line4.tabIndex = -1;

HistoricalAddress_ContactDetails_Address_Line4.isReadOnly = function()
{
	return true;
}

/**********************************************************************************/

function HistoricalAddress_ContactDetails_Address_Line5() {};

HistoricalAddress_ContactDetails_Address_Line5.retrieveOn = [viewHistAddrMasterGrid.dataBinding];
HistoricalAddress_ContactDetails_Address_Line5.helpText = "Fifth line of address";
HistoricalAddress_ContactDetails_Address_Line5.tabIndex = -1;

HistoricalAddress_ContactDetails_Address_Line5.isReadOnly = function()
{
	return true;
}

/**********************************************************************************/

function HistoricalAddress_ContactDetails_Address_Postcode() {};

HistoricalAddress_ContactDetails_Address_Postcode.retrieveOn = [viewHistAddrMasterGrid.dataBinding];
HistoricalAddress_ContactDetails_Address_Postcode.helpText = "Postcode";
HistoricalAddress_ContactDetails_Address_Postcode.tabIndex = -1;

HistoricalAddress_ContactDetails_Address_Postcode.isReadOnly = function()
{
	return true;
}

/**********************************************************************************/

function HistoricalAddress_ContactDetails_Address_Reference() {};

HistoricalAddress_ContactDetails_Address_Reference.retrieveOn = [viewHistAddrMasterGrid.dataBinding];
HistoricalAddress_ContactDetails_Address_Reference.helpText = "Reference";
HistoricalAddress_ContactDetails_Address_Reference.tabIndex = -1;

HistoricalAddress_ContactDetails_Address_Reference.isReadOnly = function()
{
	return true;
}

/****************************** BUTTON FIELDS **************************************/

function HistoricalAddress_CloseButton() {};

HistoricalAddress_CloseButton.tabIndex = 2;
