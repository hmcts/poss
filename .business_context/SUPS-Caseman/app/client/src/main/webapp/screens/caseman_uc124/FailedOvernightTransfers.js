/** 
 * @fileoverview FailedOvernightTransfers.js:
 * This file contains the form and field configurations for the UC124 - List 
 * Failed Transfers screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, changed global variables to static variables.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form"; 
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DATA_XPATH = "/ds/FailedTransfers";

/******************************* FUNCTIONS *****************************************/

/**
 * Returns the screen to the menu
 * @author rzxd7g
 * 
 */
function exitScreen() 
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Calls the non working days retrieval service
 * @author rzxd7g
 * 
 */
function loadFailedTransfers()
{
	// Need to use previous working day
	var previousWorkingDate = CaseManUtils.getPreviousWorkingDate(XPathConstants.REF_DATA_XPATH + "/SystemDate");
	var params = new ServiceParams();
    params.addSimpleParameter("failedDate", previousWorkingDate);
	Services.callService("getFailedTransfers", params, failedOvernightTransfers, true);
}

/******************************* FORM ELEMENT ***************************************/

function failedOvernightTransfers() {}

/**
 * @author rzxd7g
 * 
 */
failedOvernightTransfers.initialise = function() 
{
	loadFailedTransfers();
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
failedOvernightTransfers.onSuccess = function(dom) 
{
	Services.replaceNode(XPathConstants.DATA_XPATH, dom); 
}

failedOvernightTransfers.refDataServices = [
	{ name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[] }
];

/******************************* FORM FIELDS ***************************************/

function Master_FailedTransfersGrid() {};

/**
 * @param rowId
 * @author rzxd7g
 * @return courtCode + " - " + courtName  
 */
Master_FailedTransfersGrid.transformSendingCourt = function(rowId)
{
	var rootxp = XPathConstants.DATA_XPATH + "/FailedTransfer[./id = '" + rowId + "']";
	var courtCode = Services.getValue(rootxp + "/SendingCourtCode");
	var courtName = Services.getValue(rootxp + "/SendingCourtName");
	return courtCode + " - " + courtName;
}

/**
 * @param rowId
 * @author rzxd7g
 * @return ( type == "CAPS Events" ) ? "CAPS", courtCode + " - " + courtName  
 */
Master_FailedTransfersGrid.transformReceivingCourt = function(rowId)
{
	var rootxp = XPathConstants.DATA_XPATH + "/FailedTransfer[./id = '" + rowId + "']";
	var courtCode = Services.getValue(rootxp + "/ReceivingCourtCode");
	var courtName = Services.getValue(rootxp + "/ReceivingCourtName");
	var type = Services.getValue(rootxp + "/Type");
	return ( type == "CAPS Events" ) ? "CAPS" : courtCode + " - " + courtName;
}

Master_FailedTransfersGrid.tabIndex = 1;
Master_FailedTransfersGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Grids/SelectedFailedTransfer";
Master_FailedTransfersGrid.srcData = XPathConstants.DATA_XPATH;
Master_FailedTransfersGrid.rowXPath = "FailedTransfer";
Master_FailedTransfersGrid.keyXPath = "id";
Master_FailedTransfersGrid.columns = [
	{xpath: "Type", sort: "alphabeticalCaseInsensitive", additionalSortColumns: [ { columnNumber: 3, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Number"},
	{xpath: "id", transformToDisplay: Master_FailedTransfersGrid.transformSendingCourt },
	{xpath: "id", transformToDisplay: Master_FailedTransfersGrid.transformReceivingCourt }
];

Master_FailedTransfersGrid.isEnabled = function()
{
	var gridDB = Services.getValue(Master_FailedTransfersGrid.dataBinding);
	return CaseManUtils.isBlank(gridDB) ? false : true;
}

/***********************************************************************************/

function Status_CloseButton() {}
Status_CloseButton.tabIndex = 10;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "failedOvernightTransfers" } ]
	}
};
