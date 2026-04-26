/** 
 * @fileoverview RemovePaymentsLock.js:
 * This file contains the form and field configurations for Remove Payments Lock screen.
 *
 * @author Steve Blair
 */

/**
 * XPath Constants
 * @author tzzmr4
 * 
 */
function XPathConstants() {};
XPathConstants.REPORT_TYPES_XPATH = "/ds/var/form/ReferenceData/ReportTypes";
XPathConstants.COMPLETE_PAYOUT_LOCK_XPATH = "/ds/var/page/insertUpdateRunStartOfDayStatus/row";

/****************************** MAIN FORM ******************************************/

function RemovePaymentsLock() {};
RemovePaymentsLock.refDataServices = [{name: "ReportTypes", dataBinding: "/ds/var/form/ReferenceData", serviceName:"getReportTypes", serviceParams: []}];

/******************************** GRIDS *******************************************/

function Records_Grid() {};
Records_Grid.tabIndex = 1;
Records_Grid.dataBinding = "/ds/var/page/SelectedRecord";
Records_Grid.srcData = XPathConstants.REPORT_TYPES_XPATH;
Records_Grid.srcDataOn = [XPathConstants.REPORT_TYPES_XPATH];
Records_Grid.rowXPath = "ReportData";
Records_Grid.keyXPath = "Key";
Records_Grid.columns = [
	{xpath: "UserID"},
	{xpath: "ReportType"},
	{xpath: "ReportNumber", sort: "numerical" },
	{
		xpath: "ReportDate",
		sort: CaseManUtils.sortGridDatesDsc, 
		transformToDisplay: CaseManUtils.formatGridDate,
		defaultSort: "true",
		additionalSortColumns: [
			{columnNumber: 1, orderOnAsc: "descending", orderOnDesc: "ascending"},
			{columnNumber: 2, orderOnAsc: "ascending", orderOnDesc: "descending"}
		]
	},
	{xpath: "CourtCode", sort: "numerical" }
];

/*************************** BUTTON FIELDS ****************************************/

function Status_RemoveBtn() {};
Status_RemoveBtn.tabIndex = 10;
Status_RemoveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "RemovePaymentsLock", alt: true } ]
	}
};
Status_RemoveBtn.enableOn = [Records_Grid.dataBinding];
Status_RemoveBtn.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(Records_Grid.dataBinding));
}
/**
 * @author tzzmr4
 * 
 */
Status_RemoveBtn.actionBinding = function()
{
	var message =	"Warning - Proceeding could result in corrupt payment records.\n" +
							"Please ensure the user is not currently accessing the relevant screen.";
	if(confirm(message)) {
		var xpath = XPathConstants.REPORT_TYPES_XPATH + "/ReportData[Key = " + Records_Grid.dataBinding + "]";
		var reportNumber = Services.getValue(xpath + "/ReportNumber") * 1;
		switch(Services.getValue(xpath + "/ReportType")) {
			case "PREC":
			case "BVER":
				if(reportNumber > 0) {
					cleanupScreen("exitCreateUpdates");
				}
				else {
					deleteReportData();
				}
				break;
			case "PVER":
				if(reportNumber > 0) {
					cleanupScreen("produceCreatePaymentsReports");
				}
				else {
					deleteReportData();
				}
				break;
			case "AMR":
				if(reportNumber > 0) {
					cleanupScreen("produceAmendmentVerificationReport");
				}
				else {
					deleteReportData();
				}
				break;
			case "OVP":
				if(reportNumber > 0) {
					cleanupScreen("produceResolveOverpaymentsReport");
				}
				else {
					deleteReportData();
				}
				break;
			case "ADH":
				if(reportNumber > 0) {
					cleanupScreen("produceAdhocPayoutReport");
				}
				else {
					deleteReportData();
				}
				break;
			case "DIV":
				getPayoutStatus();
				break;
			case "PAY":
				getPayoutStatus();
				break;
		}
	}
}

/**********************************************************************************/

function Status_CloseBtn() {};
Status_CloseBtn.tabIndex = 11;
/**
 * @author tzzmr4
 * 
 */
Status_CloseBtn.actionBinding = function()
{
	if( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else 
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "RemovePaymentsLock" } ]
	}
};

/**************************** HELPER FUNCTIONS *************************************/

/**
 * @param service
 * @author tzzmr4
 * 
 */
function cleanupScreen(service)
{
	var xpath = XPathConstants.REPORT_TYPES_XPATH + "/ReportData[Key = " + Records_Grid.dataBinding + "]";
	var reportType = Services.getValue(xpath + "/ReportType");
	var reportNumber = Services.getValue(xpath + "/ReportNumber");
	Services.setValue("/ds/var/app/businessProcessId", reportType + reportNumber);
	var dom = XML.createDOM(null, null, null);
	var node = Services.getNode(xpath);
	dom.appendChild(node);
	var params = new ServiceParams();
	params.addDOMParameter("reportData", dom);
	Services.callService(service, params, cleanupScreen, true);
}
/**
 * @author tzzmr4
 * 
 */
cleanupScreen.onSuccess = function()
{
	Services.setValue("/ds/var/app/businessProcessId", "DummyProcessId");
	deleteReportData();
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
cleanupScreen.onError = function(e)
{
	Services.setValue("/ds/var/app/businessProcessId", "DummyProcessId");
	alert("Error - Cannot remove record." + "\n\n" + e);
}

/**********************************************************************************/

/**
 * @author tzzmr4
 * 
 */
function deleteReportData()
{
	var xpath = XPathConstants.REPORT_TYPES_XPATH + "/ReportData[Key = " + Records_Grid.dataBinding + "]";
	var dom = XML.createDOM(null, null, null);
	var node = Services.getNode(xpath);
	if(node != null) {
		dom.appendChild(node);
		var params = new ServiceParams();
		params.addDOMParameter("reportData", dom);
		Services.callService("deleteReportData", params, deleteReportData, true);
	}
	else {
		deleteReportData.onSuccess();
	}
}
/**
 * @author tzzmr4
 * 
 */
deleteReportData.onSuccess = function()
{
	var xpath = XPathConstants.REPORT_TYPES_XPATH + "/ReportData[Key = " + Records_Grid.dataBinding + "]";
	Services.removeNode(xpath);
	Services.setValue(Records_Grid.dataBinding, null);
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
deleteReportData.onError = function(e)
{
	alert(Messages.REPORT_DATA_DELETE_ERROR + "\n\n" + e);
}

/**********************************************************************************/

/**
 * @author tzzmr4
 * 
 */
function getPayoutStatus()
{
	var xpath = XPathConstants.REPORT_TYPES_XPATH + "/ReportData[Key = " + Records_Grid.dataBinding + "]";
	var params = new ServiceParams();
	params.addSimpleParameter("courtCode", Services.getValue(xpath + "/CourtCode"));
	Services.callService("checkPoItems", params, getPayoutStatus, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
getPayoutStatus.onSuccess = function(dom)
{
	if(dom != null) {
		var results = dom.selectSingleNode("/POItems/POItem/PONumber");
		if(results != null) {      
			var poNumber = XML.getNodeTextContent(results);
			// Second stage of print payouts sets PO Number to a six digit value.
			// If this is the case we need to complete the payout, else we can just tidy up.
			if(poNumber.length == 6) {
				requestPayoutReports();
			}
			else {
				cleanupPayoutScreen();
			}
		}
		else {
			cleanupPayoutScreen();
		}
	}
	else {
		this.onError();
	}
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
getPayoutStatus.onError = function(e)
{
	alert("Error - Can't determine Payout status.");
}

/**********************************************************************************/

/**
 * @author tzzmr4
 * 
 */
function cleanupPayoutScreen()
{
	var xpath = XPathConstants.REPORT_TYPES_XPATH + "/ReportData[Key = " + Records_Grid.dataBinding + "]";
	switch(Services.getValue(xpath + "/ReportType")) {
		case "DIV":
			cleanupScreen("cancelDividendPayout");
			break;
		case "PAY":
			cleanupScreen("cancelCompletePayout");
			break;
	}
}

/**********************************************************************************/

/**
 * @author tzzmr4
 * 
 */
function requestPayoutReports()
{
	var xpath = XPathConstants.REPORT_TYPES_XPATH + "/ReportData[Key = " + Records_Grid.dataBinding + "]";
	var courtCode = Services.getValue(xpath + "/CourtCode");
	var reportType = Services.getValue(xpath + "/ReportType");
	
	var params = new ServiceParams();
	var dataNode = XML.createDOM(null, null, null);
	
	var date = Services.getValue(xpath + "/ReportDate");
	// Return system date as a string in YYYYMMDD format
	systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");

	Services.setValue(XPathConstants.COMPLETE_PAYOUT_LOCK_XPATH + "/item", "CP RUNDATE");
	Services.setValue(XPathConstants.COMPLETE_PAYOUT_LOCK_XPATH + "/itemValue", systemDate);
	Services.setValue(XPathConstants.COMPLETE_PAYOUT_LOCK_XPATH + "/adminCourtCode", courtCode);
	dataNode.appendChild(Services.getNode("ds/var/page/insertUpdateRunStartOfDayStatus"));
	params.addDOMParameter("systemDataDbUpdate", dataNode);
	
	var runDivIndicator = null;
	if(reportType ==  "PAY") {
		runDivIndicator = false; //Navigation is from the complete payout screen
	}
	else {
		runDivIndicator = true; //Navigation is from the run dividend screen
	}
	params.addSimpleParameter("runDivIndicator", runDivIndicator);
	params.addSimpleParameter("xButtonClicked", "true");
	params.addSimpleParameter("endOfDayRunIndicator", "true");
	params.addSimpleParameter("payoutLockIndicator", "true");
		
	Services.callService("runCompletePayoutReports", params, deleteReportData, true);
}
